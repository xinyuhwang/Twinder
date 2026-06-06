# W&B Weave + LLM Pipeline Integration Plan

## Overview

Build the three missing LLM steps of the Twinder pipeline — **intake → profile YAML**, **synthesis → system instruction + matching vector**, and **rich match-card formatting** — and wrap every LLM/agent step with `@weave.op` from the moment it is written, so the backend is fully traceable in W&B Weave the instant each step works.

Weave is the **quality and debugging layer**. Redis stays the **state and memory layer** (queues, streams, room state, pub/sub) and SQLite stays the durable record store. Weave is added via an env toggle that is **off by default**, so local dev and the frontend-only MVP run with a no-op decorator and no W&B dependency at runtime — satisfying "for the frontend-only MVP, Weave is mocked/not implemented." It is flipped on (e.g. for the WeaveHacks demo) by setting `WEAVE_ENABLED=true` + a project name.

This plan also captures **human feedback** on match cards (Save/Pass + optional rating/note) and attaches it to the corresponding Weave trace, so the follow-up evals plan has human ground truth to validate its LLM-judge scorers against.

Automated **product scorers** (specificity, privacy safety, opener quality, mode alignment, agent voice fidelity, no overclaiming, useful tension, non-obvious overlap), offline evals on seeded datasets, and production monitoring dashboards are **explicitly deferred to a follow-up plan**. This plan produces the traced pipeline + human-feedback labels they will be built and validated against. See **Appendix: Eval Metric Mapping** for the planned scorer definitions.

## Current State Analysis

The backend (`app/`) is a FastAPI app. Today there is exactly **one LLM chokepoint** and **three live LLM call sites**:

- `app/llm.py:6` — `chat(messages, system, model, max_tokens)` wraps LiteLLM `acompletion`. Every model call goes through here.
- `app/agents/engine.py:68` — agent-to-agent turn generation inside `run_conversation()`.
- `app/agents/engine.py:132` — `respond_as_agent()`, a single agent reply when a human has taken over and the other side is still an agent.
- `app/agents/scorer.py:27` — `score_conversation()`, post-conversation vibe scoring (the current "match evaluation").

**Steps named in the spec that do NOT exist in code yet** (prompts exist only as markdown):

- **Profile generation** — `Prompts/intake.md` is a full matchmaker prompt + YAML schema, but nothing runs it. No `/intake` endpoint. `Docs/Frontend_Backend_Integration.md:117` marks intake→persona as future.
- **Custom agent system-instruction generation** — `app/agents/engine.py:38` just does `TWIN_SYSTEM_PROMPT.format(name=..., persona=...)` inline. The rich `twin_system_instruction_seed` block lives only in `Prompts/synthesis.md:899`.
- **Rich match-card formatting** — `score_conversation()` returns minimal JSON (`score`, `summary`, `common_interests`, `suggested_icebreaker`). The PRD-shaped match card (headline, non-obvious overlap, openers, privacy note, etc.) is future (`Docs/Frontend_Backend_Integration.md:127`).

**Data model** (`app/models.py`): `User` has only `persona: Optional[str]`. There is no place to store a profile YAML, matching vector, generated system instruction, or match card. `Room` has `vibe_score` + `vibe_summary` only.

**Other facts:**
- `app/config.py` uses `pydantic-settings` — clean place to add Weave settings.
- `pyproject.toml` has no `weave`/`wandb`/`pyyaml` dependency.
- There is **no tests directory**.
- `app/main.py:12` has a `lifespan` context — the place to call `init_weave()`.
- This is a **WeaveHacks** project (`README.org:2`), so Weave is the sponsor tech and will be enabled for the demo.

### Key Discoveries:
- Single LLM entry point `app/llm.py:6` — one decorator there traces every raw model call.
- Three live call sites to wrap: `engine.py:68`, `engine.py:132`, `scorer.py:27`.
- `run_conversation()` is a long loop; per-turn generation must be **extracted into a helper** so each turn is its own Weave call rather than one giant trace (`app/agents/engine.py:43-105`).
- The static system prompt is built inline at `app/agents/engine.py:38` and `:127` — both must read the generated instruction with a fallback.
- Scoring is already fired as a background task from two places: `engine.py:211` (auto-complete) and `rooms/router.py:176` (manual complete). Match-card formatting should chain off scoring in **one** place (inside the scorer) to avoid duplicating the trigger.
- Prompts to port into code: `Prompts/intake.md`, `Prompts/synthesis.md`, plus existing `app/agents/prompts.py`.

## Desired End State

When `WEAVE_ENABLED=true`:
- Every LLM/agent step appears in the W&B Weave UI as a named, nested trace: raw `llm.chat`, `generate_agent_turn`, `respond_as_agent`, `generate_profile`, `synthesize_profile`, `build_system_instruction`, `score_conversation`, `format_match_card`.
- A user can complete onboarding → a profile YAML is generated and stored → a system instruction + matching vector are synthesized → their twin converses using the generated instruction → the conversation is scored → a rich match card is produced — all traced end to end.
- Prompt and model versions are captured so two runs can be compared in Weave.

When `WEAVE_ENABLED=false` (default): identical behavior, zero Weave/W&B calls, `@op` is a transparent pass-through. The app runs with no W&B network dependency.

**Verification:** `uvicorn app.main:app` boots with the flag off and on; with it on, completing the full flow produces the named trace tree in the configured W&B project; with it off, the same flow runs and no W&B import is required at runtime beyond the no-op shim.

## What We're NOT Doing

- **No product scorers** (specificity, privacy safety, opener quality, mode alignment, voice fidelity, no overclaiming, useful tension, non-obvious overlap) — deferred to the follow-up evals plan. We only make the pipeline traceable so those scorers have data.
- **No offline `weave.Evaluation` harness and no seeded match dataset** — follow-up plan.
- **No production monitoring dashboards / alerting** — follow-up plan.
- **No mode-awareness logic** (dating/networking/hackathon selection driving behavior). The synthesis output already contains `mode_profiles`/`selected_mode`, so we store it for later, but we do not branch agent behavior on mode in this plan.
- **No arena orchestrator** (1-vs-N matching). Matching stays the existing 1:1 queue.
- **No frontend work.** Backend + API only.
- **No Alembic migration tooling.** SQLite dev DB; new columns are added to models and the dev DB is recreated (see Migration Notes).
- **No auth/matchmaking changes.**

## Implementation Approach

Bottom-up: first make the existing pipeline traceable behind a safe toggle (Phase 0), then build each new LLM step in pipeline order (intake → synthesis → match card), each shipping with its `@op` decorator. Finish with version-comparison hygiene and confirming the no-op path. Each new LLM function lives in `app/agents/` next to the existing engine/scorer, loads its prompt from a code constant (ported from the markdown), and returns structured data.

The `@op` decorator is applied through a **local indirection** (`app.observability.op`) rather than importing `weave.op` directly at every call site. This is what makes the kill-switch clean: when disabled, `op` returns the function unchanged; when enabled, it delegates to `weave.op`. No call site needs to know whether Weave is active.

---

## Phase 0: Weave Foundation (toggle + wrap existing steps)

### Overview
Add the Weave dependency, configuration, a no-op-safe decorator, lifespan init, and wrap the one LLM chokepoint plus the three existing LLM steps. After this phase, the *current* product (converse + score) is fully traceable.

### Changes Required:

#### 1. Dependencies
**File**: `pyproject.toml`
**Changes**: Add `weave` and `pyyaml` (pyyaml is used by later phases for profile YAML).
```toml
dependencies = [
    # ...existing...
    "weave>=0.51.0",
    "pyyaml>=6.0",
]
```

#### 2. Configuration
**File**: `app/config.py`
**Changes**: Add Weave settings, off by default.
```python
class Settings(BaseSettings):
    # ...existing...
    weave_enabled: bool = False
    wandb_project: str = "twinder"
    wandb_entity: str = ""        # optional W&B team/entity
```
**File**: `.env.example`
**Changes**: Document the new vars.
```bash
# Observability (W&B Weave). Off by default; set true for demo/eval.
WEAVE_ENABLED=false
WANDB_PROJECT=twinder
WANDB_ENTITY=
# WANDB_API_KEY is read by weave/wandb directly from the environment when enabled.
```

#### 3. Observability module (the toggle + decorator)
**File**: `app/observability.py` (new)
**Changes**: Provide `init_weave()` and a `op` decorator that is a transparent pass-through when disabled. Support both sync and async functions and decorator-with-args usage.
```python
import functools
from app.config import settings

_initialized = False

def init_weave() -> None:
    """Initialize Weave once, only if enabled. Safe to call on startup."""
    global _initialized
    if not settings.weave_enabled or _initialized:
        return
    import weave
    project = (
        f"{settings.wandb_entity}/{settings.wandb_project}"
        if settings.wandb_entity else settings.wandb_project
    )
    weave.init(project)
    _initialized = True

def op(*dargs, **dkwargs):
    """@op or @op(name=...). Delegates to weave.op when enabled, else no-op."""
    def wrap(fn):
        if not settings.weave_enabled:
            return fn
        import weave
        return weave.op(*dargs, **dkwargs)(fn)
    # bare @op usage
    if len(dargs) == 1 and callable(dargs[0]) and not dkwargs:
        fn, dargs = dargs[0], ()
        return wrap(fn)
    return wrap
```

#### 4. Lifespan init
**File**: `app/main.py`
**Changes**: Call `init_weave()` at startup (before routers handle requests).
```python
from app.observability import init_weave
# inside lifespan, before/after create_db():
    init_weave()
```

#### 5. Wrap the LLM chokepoint
**File**: `app/llm.py`
**Changes**: Decorate `chat` with `@op(name="llm.chat")`.
```python
from app.observability import op

@op(name="llm.chat")
async def chat(messages, system=None, model=None, max_tokens=300) -> str:
    ...
```

#### 6. Wrap the three existing LLM steps
**File**: `app/agents/engine.py`
**Changes**: Extract per-turn generation into an `@op` helper and call it from the loop; wrap `respond_as_agent`.
```python
from app.observability import op

@op(name="generate_agent_turn")
async def _generate_turn(system_prompt: str, conversation: list[dict],
                         room_id: str, sender_user_id: int) -> str:
    try:
        return await chat(messages=conversation, system=system_prompt)
    except Exception as e:
        return f"[Agent error: {e}]"
```
Replace the inline `try/await chat(...)` block at `engine.py:67-74` with a call to `_generate_turn(...)`. Add `@op(name="respond_as_agent")` to `respond_as_agent` at `engine.py:110`.

**File**: `app/agents/scorer.py`
**Changes**: Add `@op(name="score_conversation")` to `score_conversation` at `scorer.py:10`.

### Success Criteria:

#### Automated Verification:
- [x] Dependencies resolve: `uv pip install -e .`
- [x] App imports cleanly with flag off: `WEAVE_ENABLED=false python -c "import app.main"`
- [x] App imports cleanly with flag on but no key handled gracefully: `WEAVE_ENABLED=true python -c "import app.observability as o; o.init_weave()"` (expect it to either init or raise a clear W&B auth error, not an import/attribute error)
- [x] `op` is pass-through when disabled: a unit check that `app.observability.op(lambda x: x)` returns the original function when `WEAVE_ENABLED=false`
- [ ] Server boots both ways: `WEAVE_ENABLED=false uvicorn app.main:app` and `WEAVE_ENABLED=true ... uvicorn app.main:app` start without error
- [ ] `GET /health` returns 200 in both modes

#### Manual Verification:
- [ ] With `WEAVE_ENABLED=true` + a W&B login, running a full matchmake→converse→complete flow shows `llm.chat`, `generate_agent_turn`, and `score_conversation` traces in the W&B project.
- [ ] With the flag off, the same flow runs identically and nothing is sent to W&B.

**Implementation Note**: After this phase and all automated verification passes, pause for manual confirmation that traces appear in W&B before proceeding.

---

## Phase 1: Intake → Profile YAML

### Overview
Add the first new LLM step: turn onboarding input into the structured profile YAML from `Prompts/intake.md`, stored server-side, with a sanitized twin-preview response. Traced as `generate_profile`.

### Changes Required:

#### 1. Data model — versioned profiles
**File**: `app/models.py`
**Changes**: Add a `ProfileVersion` table so each onboarding/synthesis run is preserved and comparable, with exactly one active version per user. `User` keeps a derived public-safe `persona` (used by the public profile and the engine fallback); the heavyweight artifacts live on `ProfileVersion`.
```python
class ProfileVersion(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    version: int = Field(default=1)               # increments per user
    profile_yaml: Optional[str] = None            # intake output (Phase 1), server-side only
    matching_vector: Optional[str] = None         # synthesis output, JSON (Phase 2)
    system_instruction: Optional[str] = None      # derived twin system prompt (Phase 2)
    is_active: bool = Field(default=True, index=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
```
**Helper** (in `app/agents/profile.py` or a small `app/profiles.py`): `get_active_profile(session, user_id) -> ProfileVersion | None`, and `new_profile_version(session, user_id, ...)` which deactivates prior active rows (`is_active=False`), computes the next `version`, and inserts the new active row.

#### 2. Intake prompt + LLM step
**File**: `app/agents/profile.py` (new)
**Changes**: Port the intake instruction from `Prompts/intake.md` into a module constant `INTAKE_PROMPT`, and add the traced step.
```python
from app.observability import op
from app.llm import chat

INTAKE_PROMPT = """..."""  # ported from Prompts/intake.md (skip-questions, YAML-only output)

@op(name="generate_profile")
async def generate_profile(raw_context: str, answers: dict | None = None) -> str:
    """Run intake → return profile YAML string (stored server-side, never raw to client)."""
    user_content = _format_intake_input(raw_context, answers)
    return await chat(
        messages=[{"role": "user", "content": user_content}],
        system=INTAKE_PROMPT,
        max_tokens=2000,
    )
```

#### 3. Schemas
**File**: `app/schemas.py`
**Changes**: Add request + sanitized response.
```python
class IntakeRequest(BaseModel):
    raw_context: str
    answers: dict | None = None

class TwinPreview(BaseModel):
    public_safe_summary: Optional[str] = None
    looking_for: list[str] = []
    interests: list[str] = []
    # derived from profile YAML's public_safe fields only — never internal_only/sensitive
```

#### 4. Endpoint
**File**: `app/users/router.py`
**Changes**: `POST /users/me/intake` — runs `generate_profile`, creates a **new active `ProfileVersion`** (deactivating prior ones), derives a sanitized `persona` on `User` for agents, returns `TwinPreview` built only from public-safe YAML fields. (Phase 2 extends this same handler to also synthesize — single endpoint.)
```python
@router.post("/me/intake", response_model=TwinPreview)
async def run_intake(body: IntakeRequest, user=Depends(get_current_user),
                     session=Depends(get_session)):
    yaml_str = await generate_profile(body.raw_context, body.answers)
    pv = new_profile_version(session, user.id, profile_yaml=yaml_str)  # active, version++
    user.persona = _derive_persona(yaml_str)   # short public-safe persona for engine fallback
    session.add(user); session.commit()
    return _to_twin_preview(yaml_str)
```

### Success Criteria:

#### Automated Verification:
- [ ] App imports cleanly: `python -c "import app.main"`
- [ ] YAML parsing helper round-trips a sample profile: small unit test on `_to_twin_preview` / `_derive_persona`
- [ ] `POST /users/me/intake` returns 200 with a `TwinPreview` body (mock/stub `chat` in test so no live LLM call)
- [ ] Server boots: `uvicorn app.main:app`

#### Manual Verification:
- [ ] Posting real onboarding text produces a stored `profile_yaml` and a sane public-safe preview.
- [ ] The `TwinPreview` response contains **no** `internal_only` / `sensitive_do_not_share` content.
- [ ] With `WEAVE_ENABLED=true`, a `generate_profile` trace appears with the input and YAML output.

**Implementation Note**: Pause for manual confirmation (especially the privacy check on the response) before Phase 2.

---

## Phase 2: Synthesis → System Instruction + Matching Vector

### Overview
Add the synthesis LLM step (`Prompts/synthesis.md`) that turns the profile (+ any integration inputs) into the `twinder_profile` and `twinder_matching_vector`, and derive the agent's **custom system instruction** from the `twin_system_instruction_seed`. The engine then uses this generated instruction instead of the static `TWIN_SYSTEM_PROMPT`. Traced as `synthesize_profile` and `build_system_instruction`.

### Changes Required:

#### 1. Data model
**File**: `app/models.py`
**Changes**: No new table — `matching_vector` and `system_instruction` are already columns on `ProfileVersion` (added in Phase 1). This phase fills them in on the active version created during onboarding.

#### 2. Synthesis + instruction steps
**File**: `app/agents/synthesis.py` (new)
**Changes**: Port `Prompts/synthesis.md` into `SYNTHESIS_PROMPT`. Two ops: one for the full synthesis, one for deriving the runnable system instruction (the "custom agent system instruction generation" the spec calls out).
```python
@op(name="synthesize_profile")
async def synthesize_profile(profile_yaml: str, integrations: dict | None = None) -> dict:
    """Return {'profile': ..., 'matching_vector': ...} parsed from synthesis YAML."""
    ...

@op(name="build_system_instruction")
def build_system_instruction(synthesis: dict, name: str) -> str:
    """Deterministic render — NO LLM call. Templates the twin_system_instruction_seed
    block (identity/mission/voice/priorities/privacy_rules/matching_rules) emitted by
    synthesize_profile into a concrete system prompt string in plain Python."""
    ...
```

**Design note:** the LLM "intelligence" lives entirely in `synthesize_profile` (which produces the `twin_system_instruction_seed` per `Prompts/synthesis.md:899`). `build_system_instruction` is a pure, synchronous, deterministic template render of that seed — cheaper, fully reproducible, and easy to version/diff in Weave. It is still wrapped in `@op` so the rendered prompt shows up in the trace tree, but it makes no model call.

#### 3. Wire synthesis into the single intake endpoint
**File**: `app/users/router.py`
**Changes**: In the same `POST /users/me/intake` handler, after creating the `ProfileVersion` with `profile_yaml`, run `synthesize_profile` + `build_system_instruction` and write `matching_vector` + `system_instruction` onto that same active `ProfileVersion` row before commit. One onboarding call produces the full versioned artifact set.

#### 4. Engine uses the generated instruction (from the active version)
**File**: `app/agents/engine.py`
**Changes**: At `engine.py:38` and `engine.py:127`, look up the active `ProfileVersion` for each user and prefer its `system_instruction`; fall back to `TWIN_SYSTEM_PROMPT.format(...)` when there's no active version / no instruction (older users or no intake yet).
```python
pv = get_active_profile(session, user.id)
system_prompts[user.id] = (pv.system_instruction if pv and pv.system_instruction else
    TWIN_SYSTEM_PROMPT.format(
        name=user.name, persona=user.persona or f"{user.name} — no detailed profile yet."))
```

### Success Criteria:

#### Automated Verification:
- [ ] App imports cleanly: `python -c "import app.main"`
- [ ] `build_system_instruction` produces a non-empty string from a sample synthesis dict (unit test)
- [ ] Engine falls back to `TWIN_SYSTEM_PROMPT` when `system_instruction` is None (unit test on the prompt-selection line)
- [ ] Intake endpoint writes `matching_vector` + `system_instruction` onto the active `ProfileVersion`, and a second run deactivates the prior version and bumps `version` (test with stubbed `chat`)
- [ ] Server boots: `uvicorn app.main:app`

#### Manual Verification:
- [ ] After onboarding, a conversation visibly uses the personalized instruction (twin voice reflects the profile, not the generic prompt).
- [ ] With `WEAVE_ENABLED=true`, `synthesize_profile` and `build_system_instruction` traces appear, nested under the onboarding call.
- [ ] Existing users with no profile still converse (fallback path works).

**Implementation Note**: Pause for manual confirmation that twins use the generated voice and the fallback works before Phase 3.

---

## Phase 3: Rich Match-Card Formatting

### Overview
Add a post-scoring LLM step that turns the conversation + vibe score + both profiles into a PRD-shaped match card (headline, match type, strongest/non-obvious overlap, complementary dynamic, possible mismatch, follow-up questions, help exchange, privacy note, opener). Traced as `format_match_card`. Chained off scoring in one place.

### Changes Required:

#### 1. Data model
**File**: `app/models.py`
**Changes**:
```python
class Room(SQLModel, table=True):
    # ...existing...
    match_card: Optional[str] = None   # JSON, PRD-shaped match card
```

#### 2. Match-card step
**File**: `app/agents/match_card.py` (new)
**Changes**: `MATCH_CARD_PROMPT` + the traced formatter returning structured JSON.
```python
@op(name="format_match_card")
async def format_match_card(conversation_text: str, vibe: dict,
                            profiles: list[dict]) -> dict:
    """Return PRD-shaped match card JSON. Uses public-safe profile fields only."""
    ...
```

#### 3. Chain off scoring (single trigger)
**File**: `app/agents/scorer.py`
**Changes**: After `score_conversation` writes the vibe score, call `format_match_card`, store `room.match_card`, and publish a `match_card` WS event. This keeps the trigger in one place (scoring already runs from both auto-complete and manual complete).
```python
card = await format_match_card(conversation_text, result, profiles)
room.match_card = json.dumps(card)
await r.publish(f"room:{room_id}:events", json.dumps({"type": "match_card", "data": card}))
```

#### 4. Expose via API
**File**: `app/schemas.py` — add `match_card: Optional[dict] = None` to `RoomRead`.
**File**: `app/rooms/router.py` — populate `match_card` (parsed JSON) in `get_room` / `list_rooms`.

### Success Criteria:

#### Automated Verification:
- [ ] App imports cleanly: `python -c "import app.main"`
- [ ] `format_match_card` returns the expected keys for a sample input (unit test, stubbed `chat`)
- [ ] `GET /rooms/{id}` includes `match_card` when present (test with a seeded completed room)
- [ ] Server boots: `uvicorn app.main:app`

#### Manual Verification:
- [ ] Completing a conversation produces a stored, well-formed match card and a `match_card` WS event.
- [ ] The card surfaces only public-safe content (privacy note respected; no internal/sensitive profile data leaks).
- [ ] With `WEAVE_ENABLED=true`, `format_match_card` traces appear chained after `score_conversation`.

**Implementation Note**: Pause for manual confirmation (privacy + card quality) before Phase 4.

---

## Phase 4: Human Feedback Capture

### Overview
Capture human feedback on match cards (Save/Pass + optional 1–5 rating + free-text note) and attach it to the match card's Weave trace, while always persisting to SQLite (so feedback survives even when Weave is off — the MVP-mock guarantee). This gives the follow-up evals plan human ground truth to validate LLM-judge scorers against.

### Changes Required:

#### 1. Capture the match-card Weave call ID
**File**: `app/agents/match_card.py` / `app/agents/scorer.py`
**Changes**: When invoking the formatter, use Weave's `.call()` form to get the call handle so feedback can later be attached to that exact trace. When disabled, the call ID is simply `None`.
```python
# enabled: returns (output, call); the no-op op exposes a .call shim returning (out, None)
card, call = await format_match_card.call(conversation_text, result, profiles)
match_card_call_id = getattr(call, "id", None)
```
**File**: `app/observability.py` — ensure the no-op `op` path provides a `.call(...)` that returns `(result, None)` so call sites are identical in both modes.

#### 2. Data model
**File**: `app/models.py`
**Changes**:
```python
class Room(SQLModel, table=True):
    # ...existing + match_card...
    match_card_call_id: Optional[str] = None   # Weave call id for feedback attachment

class MatchFeedback(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    room_id: str = Field(foreign_key="room.id", index=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    verdict: str                                 # "save" | "pass" | "meet"
    rating: Optional[int] = None                 # optional 1-5
    note: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
```

#### 3. Feedback endpoint
**File**: `app/rooms/router.py`
**Changes**: `POST /rooms/{id}/feedback` — verify participant, persist `MatchFeedback`, and (when Weave enabled + a `match_card_call_id` exists) attach to the trace.
```python
@router.post("/{room_id}/feedback")
async def submit_feedback(room_id, body: FeedbackIn, user=..., session=...):
    # ...participant check...
    session.add(MatchFeedback(room_id=room_id, user_id=user.id,
                              verdict=body.verdict, rating=body.rating, note=body.note))
    session.commit()
    add_call_feedback(room.match_card_call_id, body)   # no-op when disabled / id is None
    return {"ok": True}
```
**File**: `app/observability.py` — `add_call_feedback(call_id, body)`: when enabled, look up the call and `call.feedback.add_reaction("👍"/"👎")` (save→👍, pass→👎), `add("rating", body.rating)`, and `add_note(body.note)`. No-op otherwise.

#### 4. Schema
**File**: `app/schemas.py`
```python
class FeedbackIn(BaseModel):
    verdict: str            # save | pass | meet
    rating: Optional[int] = None
    note: Optional[str] = None
```

### Success Criteria:

#### Automated Verification:
- [ ] App imports cleanly: `python -c "import app.main"`
- [ ] `op(...).call(...)` returns `(result, None)` when disabled (unit test) so call sites are mode-agnostic
- [ ] `POST /rooms/{id}/feedback` persists a `MatchFeedback` row and returns 200 (test with Weave off)
- [ ] Non-participant gets 403 (test)
- [ ] Server boots: `uvicorn app.main:app`

#### Manual Verification:
- [ ] Submitting Save/Pass with the flag off stores feedback in SQLite and makes no W&B call.
- [ ] With `WEAVE_ENABLED=true`, the reaction/rating/note appear on the `format_match_card` trace in the W&B UI, filterable by 👍/👎.

**Implementation Note**: Pause to confirm feedback lands on the correct trace in Weave and persists with the flag off, before Phase 5.

---

## Phase 5: Version Comparison + Trace Hygiene + MVP Mock Confirmation

### Overview
Make prompt/model versions comparable in Weave, attach useful attributes to traces, and confirm the frontend-only MVP mock (disabled) path.

### Changes Required:

#### 1. Publish prompt + model versions
**File**: `app/observability.py`
**Changes**: Add a helper to publish prompts as Weave objects when enabled, so changing a prompt creates a new comparable version. Record the active model (`settings.llm_model`) as a trace attribute.
```python
def publish_prompt(name: str, text: str) -> None:
    if not settings.weave_enabled:
        return
    import weave
    weave.publish(weave.StringPrompt(text), name=name)
```
Call `publish_prompt` for `INTAKE_PROMPT`, `SYNTHESIS_PROMPT`, `MATCH_CARD_PROMPT`, `TWIN_SYSTEM_PROMPT`, `VIBE_SCORING_PROMPT` inside `init_weave()`.

#### 2. Trace attributes
**File**: relevant `@op` call sites
**Changes**: Where Weave supports it, attach `room_id`, `user_id`, and `model` as call attributes (via `weave.attributes({...})` context) so traces are filterable. Keep this behind the enabled check.

#### 3. Confirm the mock/disabled path
**Changes**: Document and test that with `WEAVE_ENABLED=false` the entire pipeline (intake → synthesis → converse → score → match card) runs with no W&B calls. This is the "frontend-only MVP: Weave mocked/not implemented" guarantee.

#### 4. Docs
**File**: `app/README.md` (and `Docs/`)
**Changes**: Add a short "Observability (Weave)" section: env vars, how to enable, what traces to expect, and the note that scorers/evals are a follow-up.

### Success Criteria:

#### Automated Verification:
- [ ] Full pipeline runs end to end with `WEAVE_ENABLED=false` and makes no W&B calls (integration test with `chat` stubbed and weave import asserted not required)
- [ ] App boots with the flag on and `publish_prompt` does not raise
- [ ] All prior phases' automated checks still pass

#### Manual Verification:
- [ ] In the W&B UI, prompts appear as versioned objects; editing a prompt and re-running produces a new version that can be diffed.
- [ ] Traces are filterable by `room_id` / `model`.
- [ ] Switching `LLM_MODEL` and re-running lets two model versions be compared in Weave.

**Implementation Note**: Final phase — confirm the disabled path is truly inert (the MVP guarantee) and that version comparison works in the W&B UI.

---

## Testing Strategy

### Unit Tests (new `tests/` directory):
- `op` decorator is pass-through when disabled; delegates when enabled (monkeypatch `settings.weave_enabled`).
- YAML helpers: `_derive_persona`, `_to_twin_preview` (privacy filtering — assert no internal/sensitive fields surface).
- `build_system_instruction` renders a non-empty prompt; engine prompt-selection falls back when `system_instruction` is None.
- `format_match_card` returns the expected key set.
- All LLM-calling tests stub `app.llm.chat` so no live model calls occur.

### Integration Tests:
- End-to-end onboarding: `POST /users/me/intake` → active `ProfileVersion` has `profile_yaml`, `matching_vector`, `system_instruction`; response is a sanitized `TwinPreview`; re-run bumps `version` and deactivates the prior.
- Completed room exposes a `match_card` via `GET /rooms/{id}`.
- `POST /rooms/{id}/feedback` persists `MatchFeedback`; non-participant 403s.
- Full pipeline (incl. feedback) runs with `WEAVE_ENABLED=false` and emits no W&B calls.

### Manual Testing Steps:
1. `WEAVE_ENABLED=false uvicorn app.main:app` — run the whole flow; confirm normal behavior, no W&B.
2. `WEAVE_ENABLED=true` + `wandb login` — run again; confirm the named trace tree in the W&B project.
3. Verify privacy: inspect `TwinPreview` and `match_card` for absence of internal/sensitive profile content.
4. Edit a prompt, re-run, confirm a new prompt version in Weave; switch `LLM_MODEL`, confirm comparability.

## Performance Considerations

- `@op` when disabled is a bare function return — zero overhead.
- When enabled, Weave logging is async/batched; the dominant cost remains the LLM calls themselves.
- New LLM steps (intake ~2k tokens out, synthesis large) run **once per user at onboarding**, not in the hot conversation loop, so they don't affect per-turn pacing.
- Match-card formatting runs once per completed room in a background task (chained after scoring), off the request path.

## Migration Notes

- New `ProfileVersion` table (holds `profile_yaml`, `matching_vector`, `system_instruction`) and a new nullable `Room.match_card` column. `User` is unchanged except for keeping its existing `persona`. The engine/scorer fall back when there's no active `ProfileVersion` / null `match_card`, so **existing rows keep working**.
- No Alembic in the project. For the SQLite dev DB, delete `twinder.db` and let `create_db()` recreate tables (creates `ProfileVersion` + the new `Room` column), or add them manually. All new code treats missing values as "not yet generated."
- `ProfileVersion` keeps history: re-running onboarding deactivates the prior active row and inserts a new one, so old profile/instruction/vector versions remain for comparison in Weave and for rollback.

## References

- Spec: this plan's originating request (Weave as observability/eval layer; Redis stays state/memory).
- Backend architecture: `app/README.md`
- Integration gaps (intake→persona, rich match card as future): `Docs/Frontend_Backend_Integration.md:117`, `:127`
- LLM chokepoint: `app/llm.py:6`
- Existing LLM steps: `app/agents/engine.py:68`, `app/agents/engine.py:132`, `app/agents/scorer.py:27`
- Inline static prompt to replace: `app/agents/engine.py:38`, `app/agents/engine.py:127`
- Prompts to port: `Prompts/intake.md`, `Prompts/synthesis.md`, `app/agents/prompts.py`
- Scoring triggers: `app/agents/engine.py:211`, `app/rooms/router.py:176`
- Weave call feedback (reactions/notes/scores on a traced call) — used in Phase 4.
- Deferred follow-up: product scorers + offline evals + production monitoring (built/validated against this plan's traces + human feedback).

---

## Appendix: Eval Metric Mapping (for the follow-up evals plan)

Not implemented here — recorded so the follow-up plan has concrete definitions. Each becomes a Weave scorer run over seeded datasets and validated against the human Save/Pass labels captured in Phase 4.

| Scorer | Measures | Type | Output | Graded on |
|---|---|---|---|---|
| Match specificity | Concrete vs. generic match reasoning | LLM-judge | 0.0–1.0 | match card |
| Non-obvious overlap | Surfaces a non-obvious connection, not just surface overlap | LLM-judge | 0.0–1.0 | match card |
| Opener naturalness | Would a human actually send this opener? | LLM-judge | 0.0–1.0 | match card / icebreaker |
| Privacy safety | No `internal_only`/`sensitive` profile content leaks | **Hybrid**: exact-match sensitive strings (gate) + LLM-judge | boolean fail + 0.0–1.0 | match card + transcript |
| Mode alignment | Output fits selected mode (dating/networking/…) | LLM-judge | 0.0–1.0 | system instruction + transcript |
| Agent voice fidelity | Twin sounds like profile's `likely_twin_voice` | LLM-judge | 0.0–1.0 | transcript |
| No overclaiming | No invented credentials/commitments the profile forbids | LLM-judge | boolean fail | transcript |
| Useful tension | Productive contrast vs. bland agreement | LLM-judge | 0.0–1.0 | transcript |

**Validation method:** correlate each scorer against the Phase 4 human labels (Save/Pass, rating) on the same traces — a scorer that disagrees with humans gets re-tuned. Privacy safety is gated deterministically (string match against the profile's sensitive fields) before any judge, because it's a safety check, not a vibe score.
