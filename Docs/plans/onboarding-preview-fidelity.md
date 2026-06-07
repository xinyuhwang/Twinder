# Plan — Onboarding fidelity & high-signal collection

**Status:** proposed (not yet implemented)
**Date:** 2026-06-07
**Scope:** the three P0 fixes from the onboarding/matchmaking review — (1) preview fidelity,
(2) minimum-answer gate, (3) missing high-signal questions. Plus two small copy fixes the
review flagged. The ~76s intake latency (P1) and the demo mode-badge (P1) are explicitly
**out of scope** here.

**Decisions locked with the user:**
- The minimum-answer gate applies to **everyone**, including the rich-import path: `event_goals` is always required.
- Keep the DAT; **do not** restore the color question. Add a one-line explainer and align the DAT copy.

---

## Background: what's actually true in the code today

Verified against current `Alexis` branch (corrections to the original review noted):

- **Preview is built from intake YAML only.** `POST /users/me/intake`
  ([app/users/router.py:58-84](../../app/users/router.py#L58-L84)) runs intake then synthesis
  sequentially, stores the rich synthesis into `ProfileVersion.matching_vector` and
  `user.persona`, but the `TwinPreview` response comes from
  [`_to_twin_preview(yaml_str)`](../../app/agents/profile.py#L527-L552) which reads **only** the
  intake YAML. `TwinPreview` has just 3 public fields + `twin_prompt`
  ([app/schemas.py:109-113](../../app/schemas.py#L109-L113)).
- **Frontend overlays sparse backend fields on the demo persona.**
  [`buildPreviewFromTwinPreview`](../../frontend/lib/preview.ts#L98-L146) starts from
  `buildPreviewFromPersona(persona)` and overlays only the 3 backend fields; `canHelpWith`,
  `agentVoice`, and avatar are always persona-derived. With no `personaId`, the preview page
  falls back to `DEMO_PERSONAS[0]` (Alexis) at
  [preview/page.tsx:59](../../frontend/app/onboarding/preview/page.tsx#L59).
- **No minimum-answer gate.** In
  [RequiredQuestionFlow.tsx](../../frontend/components/RequiredQuestionFlow.tsx), "Skip this
  question" and "Finish onboarding" are available from step 0; `handleFinishEarly` and
  `handleComplete` are functionally identical.
- **Missing high-signal questions.** `hope_to_find`, `can_help_15min`, `never_share` (and
  `color`) exist in synthesis `_ANSWER_LABELS`
  ([synthesis.py:427-436](../../app/agents/synthesis.py#L427-L436)) but have no question, so they
  go unfilled unless present in imported text.
- **DAT copy mismatch.** Flow text says "name 10 words as different from each other as possible"
  ([RequiredQuestionFlow.tsx:19](../../frontend/components/RequiredQuestionFlow.tsx#L19)); the
  component itself only says "Enter a random word."

**Review claims that are WRONG (do not action):**
- *No hydration bug in DemoLoadingScreen.* `Date.now()` is in a `useRef` written inside
  `useEffect`, not in `useState` initial state — no SSR mismatch.
- *DAT does not influence the approved preview.* It's posted separately via `api.dat()` after the
  preview loads, not through the `answers` payload to intake. (Not in scope to fix here, but noted
  so we don't assume the DAT changes the card.)

---

## Synthesis output field map (source of truth for Fix 1)

`synthesize_profile()` returns `{"profile": <twinder_profile>, "matching_vector": <...>}`
(`_parse_synthesis`, [synthesis.py:622-641](../../app/agents/synthesis.py#L622-L641)). Fields we
will surface in the preview, all under `synthesis["profile"]`:

| Preview field | Synthesis path | Fallback (intake YAML) |
|---|---|---|
| `public_safe_summary` | `user_identity.public_safe_summary` → `short_public_bio` | `identity_snapshot.public_safe_summary` |
| `agent_vibe` | `vibe_model.one_sentence_vibe` | first sentence of summary |
| `looking_for` | `looking_for.explicit_people_requested` + `inferred_people_who_may_fit` + `energies` | `social_and_matching_intelligence.people_i_may_want_to_meet` |
| `interests` | `interests.{professional,intellectual,creative,social,lifestyle,niche_obsessions}` | same keys in intake YAML |
| `can_help_with` | `skills_and_strengths.can_help_with` | (none — leave empty) |
| `conversation_bait` | `conversation_hooks.topics_likely_to_create_spark` → `openers_about_user` | first 3 interests |
| `agent_voice` | `communication_style.likely_twin_voice.summary` | (none) |
| `privacy_settings` | `privacy.sensitive_do_not_share` (presence) + `default_privacy_level` | default privacy list |
| `completeness_score` | `profile_metadata.profile_completeness_score` (0-100) | computed from filled fields |

---

## Fix 1 — Preview fidelity (synthesis → API → card)

**Goal:** the card the user approves reflects what *they* said, not the Alexis seed.

### 1a. Extend the `TwinPreview` schema
[app/schemas.py:109-113](../../app/schemas.py#L109-L113) — add fields:

```python
class TwinPreview(BaseModel):
    public_safe_summary: Optional[str] = None
    agent_vibe: Optional[str] = None
    looking_for: list[str] = []
    interests: list[str] = []
    can_help_with: list[str] = []
    conversation_bait: list[str] = []
    agent_voice: Optional[str] = None
    completeness_score: Optional[int] = None
    twin_prompt: Optional[str] = None
```

All new fields are optional/defaulted → backward compatible with any existing callers.

### 1b. Rewrite `_to_twin_preview` to read from synthesis (YAML as fallback)
[app/agents/profile.py:527-552](../../app/agents/profile.py#L527-L552) — change signature to
`_to_twin_preview(synthesis: dict, yaml_str: str) -> dict`. For each field, read the synthesis
path from the table above; fall back to the intake-YAML extractor only when the synthesis value is
empty. Concretely:

- `profile = synthesis.get("profile") or {}`; `meta = profile.get("profile_metadata") or {}`.
- `public_safe_summary`: `user_identity.public_safe_summary` or `short_public_bio`, else current YAML path.
- `agent_vibe`: `vibe_model.one_sentence_vibe`, else first sentence of summary.
- `looking_for`: concat of `looking_for.explicit_people_requested`, `inferred_people_who_may_fit`,
  `energies` (dedup, cap 5); else current `people_i_may_want_to_meet` YAML path.
- `interests`: `profile["interests"]` flattened across the six categories (cap 10); else current
  YAML interests path. (Same category names in both schemas — reuse one helper.)
- `can_help_with`: `skills_and_strengths.can_help_with` (cap 5).
- `conversation_bait`: `conversation_hooks.topics_likely_to_create_spark` or `openers_about_user`
  (cap 3); else first 3 interests.
- `agent_voice`: `communication_style.likely_twin_voice.summary`.
- `completeness_score`: `int(meta.get("profile_completeness_score"))` when present (clamp 0-100).

Keep the existing intake-YAML parsing logic as private fallback helpers so nothing breaks when
synthesis returns empty (LLM failure, legacy rows).

### 1c. Update the call site
[app/users/router.py:83](../../app/users/router.py#L83):
```python
preview = _to_twin_preview(synthesis, yaml_str)
```
`synthesis` is already in scope (line 65). No other backend change.

### 1d. Frontend: build from backend, persona fills gaps only (invert precedence)
[frontend/lib/preview.ts](../../frontend/lib/preview.ts) and
[frontend/types/index.ts](../../frontend/types/index.ts):

1. Add the new optional fields to the `TwinPreview` TS type.
2. Add `AgentPreviewDisplay` fields if missing (`agent_voice` already maps to `agentVoice`).
3. In `buildPreviewFromTwinPreview`:
   - When a backend field is present, **use it directly**; use `base` (persona) only to fill a
     *missing* backend field — i.e. `twin.X ?? base.X`, not `unionUnique(backend, base)` which
     currently dilutes real data with seed data.
   - `canHelpWith`: `twin.can_help_with?.length ? twin.can_help_with : base.canHelpWith`.
   - `agentVibe`: `twin.agent_vibe ?? twin.public_safe_summary?.split('.')[0] ?? base.agentVibe`.
   - `conversationBait`: `twin.conversation_bait?.length ? twin.conversation_bait : backendInterests.slice(0,3)`.
   - `agentVoice`: `twin.agent_voice ?? base.agentVoice`.
   - `completenessScore`: `twin.completeness_score ?? <computed fallback>`.
4. **Stop defaulting to `DEMO_PERSONAS[0]` for non-demo users.** In
   [preview/page.tsx:59](../../frontend/app/onboarding/preview/page.tsx#L59): only resolve a demo
   persona when `localStore.getPersonaId()` actually returns one; otherwise pass `persona = null`
   so the `persona ? ... : {neutral skeleton}` branch in `buildPreviewFromTwinPreview` is used
   (that branch already exists at [preview.ts:107-120](../../frontend/lib/preview.ts#L107-L120)).
   This is the single change that stops the "approve Alexis's bio" bug for OAuth users.

**Note on demo users:** demo users *intentionally* pick a seed persona, so for them persona-as-base
is correct — but with backend precedence inverted, their real answers now win over the seed where
they provided them. That's the desired behavior.

---

## Fix 2 — Minimum-answer gate (`event_goals` required for everyone)

**Goal:** no one reaches the arena with zero signal; `event_goals` is mandatory even for importers.

[frontend/components/RequiredQuestionFlow.tsx](../../frontend/components/RequiredQuestionFlow.tsx):

1. Add a helper: `const eventGoalsAnswered = (answers['event_goals'] ?? '').trim().length > 0`.
2. Gate **"Finish onboarding"** ([lines 152-157](../../frontend/components/RequiredQuestionFlow.tsx#L152-L157)):
   disable it unless `eventGoalsAnswered` (or the current step *is* `event_goals` and `input` is
   non-empty). When disabled, relabel to **"Answer the event question to continue"** with reduced
   opacity, so it reads as a requirement rather than a dead button.
3. The DAT step and per-question "Skip" stay as-is (still optional) — only the finish path is gated.
4. **Importer path:** today both `chooseQuestions()` and `proceedWithImport()` route to
   `/onboarding/questions` ([onboarding/page.tsx](../../frontend/app/onboarding/page.tsx)), so the
   importer already passes through this flow — the gate covers them automatically. No separate
   importer branch needed. (Confirm `proceedWithImport` does not auto-advance past the questions
   screen; if it ever short-circuits to preview, add the same `eventGoalsAnswered` check there.)
5. Edge case: make `handleFinishEarly` ([line 80](../../frontend/components/RequiredQuestionFlow.tsx#L80))
   a no-op when the gate is unmet (defense in depth, in case the button's `disabled` is bypassed).

**Why event_goals specifically:** it maps to `current_intent` + `profile_positioning` in synthesis
and is the single highest-leverage matching signal. Requiring just one question keeps friction low
while guaranteeing the twin isn't a blank seed.

---

## Fix 3 — Add the 3 missing high-signal questions

**Goal:** collect the signals synthesis already expects (`_ANSWER_LABELS` keys exist; no backend
prompt change needed).

[frontend/components/RequiredQuestionFlow.tsx:12-34](../../frontend/components/RequiredQuestionFlow.tsx#L12-L34)
— extend `REQUIRED_QUESTIONS`. Use **exact ids** matching `_ANSWER_LABELS` so they map correctly:

```ts
{ id: 'hope_to_find',  text: 'Who do you most hope to meet here — and what would make a connection click?' },
{ id: 'can_help_15min', text: 'If someone grabbed you for 15 minutes, what could you actually help them with?' },
{ id: 'never_share',   text: "Anything you'd rather your twin never bring up? (totally fine to leave blank)" },
```

Ordering recommendation (keeps `event_goals` early since it's the gate):
`animal → event_goals → hope_to_find → can_help_15min → belief_changed → help_others → never_share → dat`.
(Move `event_goals` to step 1 so the required question is reached fast; put `never_share` and `dat`
last as low-pressure closers.)

Verification: these ids already have entries in
[`_ANSWER_LABELS`](../../app/agents/synthesis.py#L427-L436) → they flow through
`_format_answers_block` into synthesis with correct labels. `never_share` maps to
`privacy.sensitive_do_not_share`. **No backend change required for Fix 3.**

`never_share` should be genuinely optional (explicitly "fine to leave blank") and must NOT be
gated by Fix 2.

---

## Fix 4 (small) — DAT copy alignment + explainer

[frontend/components/DivergentAssociationTask.tsx:~76](../../frontend/components/DivergentAssociationTask.tsx)
— replace "Enter a random word." with copy consistent with the flow framing, plus the "why":

> "Name 10 words as different from each other as you can — we use the spread to gauge creative
> range for better matches."

Keep the per-word prompt ("Word N of 10") as the running label. Make the flow question text
([RequiredQuestionFlow.tsx:19](../../frontend/components/RequiredQuestionFlow.tsx#L19)) and the
component heading say the same thing.

---

## Implementation order & verification

1. **Fix 1 backend** (schema + `_to_twin_preview` + call site) — isolated, testable via
   `POST /users/me/intake` returning populated `agent_vibe`/`can_help_with`/etc.
2. **Fix 1 frontend** (types + precedence inversion + persona-null for OAuth) — the highest-impact
   change; depends on 1.
3. **Fix 3** (add questions) — independent; verify ids reach synthesis with right labels.
4. **Fix 2** (gate) — depends on `event_goals` existing in the (reordered) list.
5. **Fix 4** (copy) — independent, trivial.

**Manual verification (no automated tests in this area):**
- Run backend + frontend, walk `/demo → onboarding → questions`, answer only `event_goals`, finish.
  Preview summary/vibe/can-help should reflect the answer, not Alexis.
- Try to "Finish onboarding" with `event_goals` blank → button disabled.
- Inspect `POST /users/me/intake` response → new fields populated when synthesis succeeds; falls
  back gracefully (no 500) when synthesis returns empty.
- `cd frontend && npm run build` to catch type errors from the new `TwinPreview` fields.

## Risks / watch-outs
- **Synthesis empty/failure:** `_to_twin_preview` must never throw on missing synthesis keys —
  every read uses `(x or {})` / `.get`. Fallback to intake YAML keeps the card non-empty.
- **Legacy/demo personas:** demo users still see seed-as-base; verify their real answers now
  override seed fields rather than being unioned.
- **`completeness_score` source:** the LLM populates `profile_metadata.profile_completeness_score`;
  if it's frequently null, keep the computed fallback rather than showing nothing.
- **Out of scope (track separately):** parallelizing intake+synthesis / staged loading (P1 latency),
  demo mode badge, and routing DAT into the synthesis `answers` payload.
