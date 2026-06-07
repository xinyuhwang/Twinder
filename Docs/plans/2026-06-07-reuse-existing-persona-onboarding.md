# Reuse Existing Persona in Onboarding Flow — Implementation Plan

## Overview

Let a returning user who already has a saved twin profile skip the full onboarding flow. After joining an event, the user chooses **Use my existing twin** or **Create a new twin**. Choosing existing jumps straight to the persona confirmation screen, populated from the database (no fresh LLM synthesis), where they can edit the actual agent **system prompt** — both by hand and via CopilotKit — and persist their edits when they advance to the arena.

## Current State Analysis

**Flow today:** `/join` (event code + mode) → `/onboarding` (import vs. questions chooser) → `/onboarding/questions` → `/onboarding/preview` → `/arena`.

**The preview screen always rebuilds the twin.** [`frontend/app/onboarding/preview/page.tsx`](frontend/app/onboarding/preview/page.tsx) either:
- restores a `localStore.getTwinPreview()` cache (localStorage, not DB-backed), or
- calls `api.intake()` — which runs `generate_profile` + `synthesize_profile` LLM calls and creates a **brand-new** `ProfileVersion` every time ([`app/users/router.py:58-84`](app/users/router.py#L58-L84)).

There is no path that reuses an existing DB profile.

**Persona storage.** Real profiles live in `ProfileVersion` ([`app/models.py:47-55`](app/models.py)): one `is_active=True` row per user, holding `profile_yaml`, `matching_vector` (JSON of the synthesis `{"profile":…, "matching_vector":…}`), and a rendered `system_instruction`. The runnable prompt = `system_instruction` + mode guidelines + DAT line, assembled at request time by `build_twin_system_prompt` ([`app/agents/twin_prompt.py:95-109`](app/agents/twin_prompt.py#L95-L109)).

**Gaps blocking this feature:**
1. **No detection endpoint** — the frontend cannot tell whether the user already has an active `ProfileVersion`, nor fetch its preview fields / system prompt without re-running intake.
2. **No persistence for prompt edits** — after the initial intake, nothing ever updates `system_instruction`.
3. **CopilotKit only edits display cards.** On the preview screen, CopilotKit tweaks `summary`/`agent_voice`/`privacy_settings` as ephemeral React state via the client-side `apply_preview_edits` action ([`AgentPreviewCard.tsx:49-83`](frontend/components/AgentPreviewCard.tsx#L49-L83)). The real system prompt is shown **read-only** in an accordion ([`AgentPreviewCard.tsx:149-171`](frontend/components/AgentPreviewCard.tsx#L149-L171)). The backend `/copilotkit` actions ([`app/copilot/actions.py`](app/copilot/actions.py)) persist nothing and **receive no user identity** (the Next.js relay at [`frontend/app/api/copilotkit/route.ts`](frontend/app/api/copilotkit/route.ts) forwards no auth token).

### Key Discoveries
- `get_active_profile(session, user_id)` ([`app/agents/profile.py:637`](app/agents/profile.py#L637)) returns the active `ProfileVersion` or `None` — the basis for detection.
- `_to_twin_preview(synthesis, yaml_str)` ([`app/agents/profile.py:537`](app/agents/profile.py#L537)) builds public-safe preview fields from a synthesis dict — works **without** an LLM call.
- `load_synthesis_from_profile_version(matching_vector_json)` ([`app/agents/synthesis.py:601`](app/agents/synthesis.py#L601)) rehydrates the stored synthesis dict.
- `new_profile_version(session, user_id, **fields)` ([`app/agents/profile.py:646`](app/agents/profile.py#L646)) deactivates prior versions and inserts a new active one — reused for the "save as new version" path.
- The editable artifact must be the persisted **`system_instruction`** (the base), not the assembled `build_twin_system_prompt` output, because mode guidelines + DAT are re-appended at runtime. Editing the assembled prompt would double-append them.
- CopilotKit persistence is solved client-side per the user's direction: CopilotKit rewrites the textarea contents; whatever is in the box is pushed to the server when the user advances. No auth change to `/copilotkit` is needed.

## Desired End State

A returning user with a saved profile sees, after `/join`, a choice between **Use my existing twin** and **Create a new twin**.
- **Use existing** → `/onboarding/preview` loads the saved profile from the DB (no intake/LLM), shows preview cards + an **editable system-prompt textarea**. The user edits by hand and/or via CopilotKit. On **Approve**, the textarea contents are pushed to the server (user picks **Save as new version** or **Update in place**), then routes to `/arena`.
- **Create new** → unchanged full onboarding flow; the same editable-prompt + save capability is available on the preview screen at the end.

A user with no saved profile sees only "Create a new twin" (or is sent straight into onboarding).

### Verification
- Returning user: choice screen appears, "Use existing" reaches preview with no `intake` network call, edits persist (visible after reload / in arena prompt).
- New user: full flow unchanged; final preview now lets them edit + save the prompt.
- Edited prompt is reflected by `GET /users/me/twin-prompt` and used in arena conversations.

## What We're NOT Doing
- No multi-persona library / version picker — single active profile only (per decision).
- No auth forwarding into the `/copilotkit` backend endpoint; persistence stays client-driven via an authenticated REST call.
- No new LLM synthesis when reusing an existing profile.
- No changes to arena/chatroom scoring or matching logic.
- No editing of the structured preview cards' persistence semantics beyond what exists (display-card edits remain as today; only the system prompt becomes persistently editable).

## Implementation Approach

Four layers, built backend-first:
1. **Backend read endpoint** — fetch the existing profile's preview + system prompt without LLM calls.
2. **Backend write endpoint** — persist an edited system prompt, with caller choice of new-version vs. overwrite.
3. **Frontend choice step** — existing vs. new after join, gated on detection.
4. **Frontend preview screen** — load-from-DB branch, editable prompt textarea wired to CopilotKit, push-on-advance save with the new/overwrite toggle.

---

## Phase 1: Backend — fetch existing profile for reuse

### Overview
Add a read endpoint that returns whether the user has a saved profile, its public-safe preview fields, and its editable system prompt — all from stored data, no LLM calls.

### Changes Required

#### 1. Response schema
**File**: [`app/schemas.py`](app/schemas.py)
**Changes**: Add a schema exposing detection + preview + the editable base instruction.

```python
class ExistingTwinResponse(BaseModel):
    has_profile: bool
    version: Optional[int] = None
    preview: Optional[TwinPreview] = None          # public-safe display fields
    system_instruction: Optional[str] = None       # editable base prompt
    twin_prompt: Optional[str] = None              # assembled (read-only reference)
```

#### 2. Endpoint
**File**: [`app/users/router.py`](app/users/router.py)
**Changes**: Add `GET /users/me/twin` (alongside the existing `/me/twin-prompt`). Build preview from stored synthesis; resolve the base instruction the same way `_synthesized_instruction` does (prefer stored `system_instruction`, rebuild from `matching_vector` if it's a stub).

```python
from app.agents.profile import get_active_profile, _to_twin_preview
from app.agents.synthesis import (
    build_system_instruction, is_stub_instruction, load_synthesis_from_profile_version,
)

@router.get("/me/twin", response_model=ExistingTwinResponse)
async def get_existing_twin(
    mode: str = "networking",
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    pv = get_active_profile(session, user.id)
    if not pv:
        return ExistingTwinResponse(has_profile=False)

    synthesis = load_synthesis_from_profile_version(pv.matching_vector)
    preview = None
    if synthesis.get("profile"):
        preview = TwinPreview(**_to_twin_preview(synthesis, pv.profile_yaml or ""))

    base = pv.system_instruction
    if (not base or is_stub_instruction(base)) and synthesis.get("profile"):
        rebuilt = build_system_instruction(synthesis, user.name)
        if not is_stub_instruction(rebuilt):
            base = rebuilt

    return ExistingTwinResponse(
        has_profile=True,
        version=pv.version,
        preview=preview,
        system_instruction=base,
        twin_prompt=build_twin_system_prompt(user, mode, session),
    )
```

### Success Criteria

#### Automated Verification
- [ ] Backend imports cleanly / app boots: `uvicorn app.main:app --reload` (no import errors)
- [ ] Endpoint returns `has_profile=false` for a fresh user: `curl -s -H "Authorization: Bearer $TOKEN" localhost:8000/users/me/twin`
- [ ] After running intake once, the same call returns `has_profile=true` with non-empty `system_instruction`

#### Manual Verification
- [ ] `preview` fields match what the user saw at original intake (summary, looking_for, interests)
- [ ] `system_instruction` is the base prompt (no duplicated "== … mode ==" block)

**Implementation Note**: Pause for manual confirmation after this phase before proceeding.

---

## Phase 2: Backend — persist edited system prompt

### Overview
Add a write endpoint that saves the system prompt the user edited in the textarea, with caller choice of **new version** or **overwrite active**.

### Changes Required

#### 1. Request/response schemas
**File**: [`app/schemas.py`](app/schemas.py)

```python
class SystemInstructionUpdate(BaseModel):
    system_instruction: str
    create_new_version: bool = False   # True → new ProfileVersion; False → overwrite active

class SystemInstructionResponse(BaseModel):
    version: int
    system_instruction: str
```

#### 2. Endpoint
**File**: [`app/users/router.py`](app/users/router.py)
**Changes**: Add `PUT /users/me/system-instruction`. Overwrite path edits the active row in place; new-version path copies forward `profile_yaml`/`matching_vector` so the version stays self-contained.

```python
@router.put("/me/system-instruction", response_model=SystemInstructionResponse)
async def update_system_instruction(
    body: SystemInstructionUpdate,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    pv = get_active_profile(session, user.id)
    if not pv:
        raise HTTPException(status_code=404, detail="No profile to edit. Run intake first.")

    text = body.system_instruction.strip()
    if not text:
        raise HTTPException(status_code=400, detail="system_instruction cannot be empty")

    if body.create_new_version:
        pv = new_profile_version(
            session, user.id,
            profile_yaml=pv.profile_yaml,
            matching_vector=pv.matching_vector,
            system_instruction=text,
        )
    else:
        pv.system_instruction = text
        session.add(pv)

    session.commit()
    session.refresh(pv)
    return SystemInstructionResponse(version=pv.version, system_instruction=pv.system_instruction)
```

### Success Criteria

#### Automated Verification
- [ ] Overwrite keeps the same version: `PUT` with `create_new_version=false` → response `version` unchanged
- [ ] New-version bumps version and stays active: `PUT` with `create_new_version=true` → `version` increments; `GET /users/me/twin` returns the new text
- [ ] Empty body rejected with 400; no active profile rejected with 404
- [ ] Edited text appears in the assembled prompt: `GET /users/me/twin-prompt` contains the new instruction

#### Manual Verification
- [ ] After overwrite, only one active version exists (no orphan duplicates)
- [ ] After new-version, prior version is `is_active=False`, `matching_vector`/`profile_yaml` carried forward

**Implementation Note**: Pause for manual confirmation after this phase.

---

## Phase 3: Frontend — existing-vs-new choice after join

### Overview
After `/join`, route through a lightweight chooser that only offers "Use existing" when the backend reports a saved profile. Track the user's intent so the preview screen knows whether to load-from-DB or rebuild.

### Changes Required

#### 1. API client + types
**File**: [`frontend/lib/api.ts`](frontend/lib/api.ts), [`frontend/types`](frontend/types)
**Changes**: Add `getExistingTwin` and `updateSystemInstruction`.

```typescript
getExistingTwin: (token: string, mode: string) =>
  request<ExistingTwinResponse>(`/users/me/twin?mode=${encodeURIComponent(mode)}`, {
    headers: authHeaders(token),
  }),

updateSystemInstruction: (token: string, system_instruction: string, create_new_version: boolean) =>
  request<{ version: number; system_instruction: string }>('/users/me/system-instruction', {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ system_instruction, create_new_version }),
  }),
```
Add `ExistingTwinResponse` to the types module (mirrors the backend schema; `preview` is the existing `TwinPreview` type).

#### 2. Persona-source flag in local store
**File**: [`frontend/lib/local-store.ts`](frontend/lib/local-store.ts)
**Changes**: Add a `personaSource: 'existing' | 'new'` key + getter/setter (and include in `reset()` via the existing loop). This tells the preview screen which branch to take.

```typescript
// KEY: personaSource: 'twinder_persona_source',
getPersonaSource: (): 'existing' | 'new' | null => { /* read + validate */ },
setPersonaSource: (v: 'existing' | 'new') => localStorage.setItem(KEY.personaSource, v),
```

#### 3. Choice step
**File**: [`frontend/app/onboarding/page.tsx`](frontend/app/onboarding/page.tsx)
**Changes**: On mount, after the token check, call `api.getExistingTwin(token, mode)`. Add a new leading `path` state value (e.g. `'decide'`) rendered when `has_profile` is true and the user hasn't chosen yet:
- **Use my existing twin** → `localStore.setPersonaSource('existing')` → `router.push('/onboarding/preview')`.
- **Create a new twin** → `localStore.setPersonaSource('new')` → fall through to the current `'choose'` UI (import vs. questions).

When `has_profile` is false, set `personaSource='new'` and render the current `'choose'` screen directly (no visible extra step). The existing import/questions paths already set the data the preview screen rebuilds from.

> Keeping this inside `/onboarding` avoids a new route and reuses the existing auth/redirect guard. `/join`'s `handleContinue` still routes to `/onboarding` unchanged.

### Success Criteria

#### Automated Verification
- [ ] Frontend type-checks: `cd frontend && npm run build`

#### Manual Verification
- [ ] New user (no profile): goes straight into import/questions chooser, no flash of "Use existing"
- [ ] Returning user: sees the existing-vs-new choice; "Create new" leads to the normal chooser
- [ ] `personaSource` is set correctly in localStorage for each branch

**Implementation Note**: Pause for manual confirmation after this phase.

---

## Phase 4: Frontend — load-from-DB preview + editable prompt + save-on-advance

### Overview
On the preview screen, add an "existing" branch that loads the saved profile from the DB instead of calling intake. Make the system prompt an **editable textarea** (replacing the read-only accordion) wired so CopilotKit rewrites its contents. On Approve, push the textarea contents to the server with the user's new-version/overwrite choice, then continue to `/arena`.

### Changes Required

#### 1. Preview page — existing branch + edited-prompt state
**File**: [`frontend/app/onboarding/preview/page.tsx`](frontend/app/onboarding/preview/page.tsx)
**Changes**:
- Add `editedPrompt` state (string) seeded from the loaded prompt; treat the textarea as the source of truth for the system prompt.
- In the `load()` effect, branch first on `localStore.getPersonaSource()`:
  ```typescript
  if (personaSource === 'existing') {
    const existing = await api.getExistingTwin(token, mode);
    if (existing.has_profile) {
      const derived = buildPreviewFromTwinPreview(existing.preview ?? {...}, persona, userName);
      setPreview(derived);
      setTwinPrompt(existing.system_instruction ?? null);   // editable base
      setEditedPrompt(existing.system_instruction ?? '');
      setLoading(false);
      return;   // NO intake call
    }
    // fallthrough if profile vanished
  }
  ```
- The existing cache/intake branches stay for the `'new'` path. For the `'new'` path, seed `editedPrompt` from the intake response's `twin_prompt` as well (so new users can also edit before arena).
- `handleApprove` becomes async: if `editedPrompt` differs from the loaded prompt, call `api.updateSystemInstruction(token, editedPrompt, createNewVersion)` before routing. Use the `saveMode` choice (below). Keep existing `setTwinPreview` / `syncPersonaIfEmpty` behavior for display fields.

#### 2. AgentPreviewCard — editable prompt + CopilotKit wiring + save mode
**File**: [`frontend/components/AgentPreviewCard.tsx`](frontend/components/AgentPreviewCard.tsx)
**Changes**:
- Replace the read-only `<pre>` prompt accordion ([lines 149-171](frontend/components/AgentPreviewCard.tsx#L149-L171)) with an editable `<textarea>` bound to a new `editedPrompt`/`onPromptChange` prop pair (lifted to the page).
- Add `useCopilotReadable` exposing the current prompt text so CopilotKit can see what it's editing.
- Add a client-side `useCopilotAction` `apply_prompt_edit` ({ system_prompt: string }) whose handler calls `onPromptChange(system_prompt)` — mirroring `apply_preview_edits`. This is how "CopilotKit makes the edits, then we push what's in the box."
- Add a **save-mode** control near Approve: a small toggle/segmented control for **Save as new version** vs **Update in place**, lifted to the page as `saveMode` state. Default: "Update in place" for existing reuse, "new version" is opt-in.
- Update the "Ask my agent to improve this" / copilot entry points to also accept prompt-editing intents.

#### 3. CopilotKit instructions + backend action for prompt rewriting
**File**: [`frontend/lib/copilot.ts`](frontend/lib/copilot.ts), [`app/copilot/actions.py`](app/copilot/actions.py)
**Changes**:
- Add a backend action `edit_system_prompt(current_prompt: str, instruction: str)` that LLM-rewrites the prompt and returns `{ system_prompt, message }` (stateless, like `edit_agent_voice`; no DB write — persistence is the client's REST call on advance). Register it in `build_actions()`.
- Extend `PREVIEW_COPILOT_INSTRUCTIONS`: when the user asks to change how their agent behaves / the system prompt, call `edit_system_prompt` with the current prompt from context, then call the client-side `apply_prompt_edit` with the returned text.
- Add a preview prompt suggestion like "Rewrite my agent's instructions" in `getCopilotPrompts('preview')`.

### Success Criteria

#### Automated Verification
- [ ] Frontend builds: `cd frontend && npm run build`
- [ ] No `intake` request fires on the existing path (verify via network tab / a guard assertion in dev)

#### Manual Verification
- [ ] "Use existing" → preview loads from DB with correct summary + editable prompt, no synthesis spinner delay
- [ ] Hand-editing the textarea and approving persists (reload `/users/me/twin` shows new text; arena uses it)
- [ ] CopilotKit "Rewrite my agent's instructions" updates the textarea contents; approving persists them
- [ ] "Save as new version" creates a new version; "Update in place" keeps the version number
- [ ] New-user full flow still ends at a working preview; editing the prompt there also persists
- [ ] Empty prompt cannot be saved (button disabled or 400 surfaced gracefully)

**Implementation Note**: Pause for manual confirmation after this phase.

---

## Testing Strategy

### Backend
- Unit/manual: fresh user → `has_profile=false`; post-intake → `has_profile=true` with preview + base instruction.
- Overwrite vs. new-version semantics: version number, single-active invariant, carry-forward of `profile_yaml`/`matching_vector`.
- Edited instruction shows up in `build_twin_system_prompt` output (mode block appended once, not duplicated).

### Frontend
- Returning vs. new user routing through `/onboarding`.
- Existing path performs zero LLM/intake calls.
- Edit-by-hand and edit-by-CopilotKit both end up in the textarea and both persist on advance.
- Save-mode toggle drives `create_new_version`.

### Manual end-to-end
1. New Google user → onboarding → preview → edit prompt → approve → arena. Confirm persistence.
2. Same user re-enters via `/join` → "Use my existing twin" → preview prefilled → CopilotKit rewrite → "Save as new version" → arena.
3. Re-enter again → confirm the latest edited prompt loads.

## Migration Notes
- No DB migration required — reuses the existing `ProfileVersion` table and `new_profile_version` infra.
- Demo/seeded users without a `ProfileVersion` correctly report `has_profile=false` and see only the create-new path.

## References
- Preview screen: [`frontend/app/onboarding/preview/page.tsx`](frontend/app/onboarding/preview/page.tsx)
- Preview card / CopilotKit client actions: [`frontend/components/AgentPreviewCard.tsx`](frontend/components/AgentPreviewCard.tsx)
- Backend profile endpoints: [`app/users/router.py`](app/users/router.py)
- Prompt resolution: [`app/agents/twin_prompt.py`](app/agents/twin_prompt.py)
- Profile helpers: [`app/agents/profile.py`](app/agents/profile.py), [`app/agents/synthesis.py`](app/agents/synthesis.py)
- CopilotKit backend actions: [`app/copilot/actions.py`](app/copilot/actions.py)
- Onboarding entry / choice: [`frontend/app/onboarding/page.tsx`](frontend/app/onboarding/page.tsx)
- Join screen: [`frontend/app/join/page.tsx`](frontend/app/join/page.tsx)
- Local store: [`frontend/lib/local-store.ts`](frontend/lib/local-store.ts)
