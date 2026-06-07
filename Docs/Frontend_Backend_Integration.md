# Frontend-Backend Integration Assessment

Assessment of how the Twinder PRD frontend demo ([Twinder_PRD.md](./Twinder_PRD.md)) connects to the FastAPI backend ([app/README.md](../app/README.md)), including gaps and recommended integration phases.

**Date:** June 2026

---

## Current State

| Layer | Status | Location |
|-------|--------|----------|
| Backend (FastAPI) | Built | `app/` in this repo |
| Frontend (Next.js) | Partial live prototype | `frontend/` in this repo |
| Intake / YAML system | Backend wired, frontend missing | `POST /users/me/intake`, `app/agents/profile.py`, `app/agents/synthesis.py` |
| Arena batch matching | Backend wired, frontend unused | `POST /arena/start`, `GET /arena/results`, `GET /arena/conversation/{conversation_id}` |

This repo now contains both a live backend and a partial Next.js frontend. The frontend currently implements `/`, `/demo`, `/arena`, `/room/[roomId]`, and `/auth/callback`. It calls the backend through `frontend/lib/api.ts`, not a mocked `lib/mock-api.ts`.

The work ahead is not "build a frontend from scratch." It is **align the partial frontend with the PRD demo flow**, deciding where to keep local/mock behavior for the polished demo and where to wire the existing backend APIs.

---

## Conceptual Alignment

Both sides agree on the core product loop:

```
Create twin / persona
    -> Agents meet
    -> Conversation + scoring
    -> Ranked matches for human
    -> Meet / eavesdrop / take over
```

The backend implements the **middle** of that loop (pair, converse, score, watch/take over). The PRD implements the **full demo shell** (onboarding, arena theater, swipe cards, Copilot) with mocks. The mismatch is mostly in **shape of data** and **matching model**, not in product vision.

---

## How to Connect

### API Client Layer

Follow the PRD pattern: one data layer the UI calls (`lib/api.ts`, replacing the planned `lib/mock-api.ts`).

| PRD mock function (planned) | Backend endpoint | Notes |
|---|---|---|
| Login / demo user | `POST /auth/dev-login?name=&persona=` | Best for hackathon demo; OAuth via `GET /auth/google` for real users |
| Get current user | `GET /auth/me` or `GET /users/me` | Same shape |
| Save twin profile | `PUT /users/me` with `{ persona }` | See profile gap below |
| Enter current frontend arena | `POST /rooms/matchmake` + poll `GET /rooms/matchmake/status` | Current `/arena` route uses 1:1 queue |
| Run PRD-style arena batch | `POST /arena/start?mode=` | Backend runs against all other DB users, not capped to 5 |
| List arena matches | `GET /arena/results` | Returns ranked `MatchCard` objects |
| Arena eavesdrop | `GET /arena/conversation/{conversation_id}` | Full arena conversation stream |
| List live rooms | `GET /rooms` | Completed rooms with `vibe_score` |
| Live room detail | `GET /rooms/{id}` | Partial fit for match detail |
| Live room transcript | `GET /rooms/{id}/messages` | Full transcript, not highlights |
| Live room WebSocket | `WS /ws/rooms/{id}?token=` | Real-time events |
| Human takeover | `POST /rooms/{id}/takeover` | Maps to PRD "drop in" concept |
| End conversation | `POST /rooms/{id}/complete` | Triggers scoring |

**Auth:** Backend supports JWT via **cookie** (OAuth callback) or **Bearer** (`dev-login` returns `{ token }`). Frontend should send `credentials: 'include'` for cookies, or `Authorization: Bearer` for demo login.

OAuth callback redirects to `{FRONTEND_URL}/auth/callback?token=...`. The frontend needs that route.

### WebSocket Event Mapping

| Backend WS event | PRD UI use |
|---|---|
| `message` | Eavesdrop viewer, arena status line |
| `human_takeover` | "You're in the conversation" state |
| `room_completed` | Arena done, go to matches |
| `vibe_score` | Match card score + summary + opener |

Scorer payload includes `common_interests` and `suggested_icebreaker`, which align with PRD match card fields.

### Suggested Frontend Architecture

```
Next.js pages (implemented and PRD routes)
    |
    v
frontend/lib/api.ts
    |
    +-- REST  -> FastAPI (localhost:8000)
    +-- WS    -> /ws/rooms/{id}
    +-- localStorage for auth/demo state (token, user, persona, room)
```

Keep PRD demo persistence for Save, Pass, swipe history, and mocked Meet in localStorage until backend adds those endpoints.

---

## Gap Analysis

### Critical Gaps

#### 1. Matching Model: Current 1:1 Frontend vs 5-Agent PRD Arena

| PRD | Current implementation |
|---|---|
| User's twin meets 5 seeded agents sequentially | Frontend `/arena` uses FIFO 1:1 room queue |
| Precomputed highlights and ranked cards | Backend `/arena/start` returns ranked `MatchCard` objects, but frontend does not call it |
| Demo completes in under 3 minutes | Live room loop can take 20 messages with 3s pacing; arena batch uses multiple real LLM calls |

**Options to connect without rewriting everything:**

- **Frontend alignment:** Wire PRD arena UI to `POST /arena/start`, then render `MatchCard` results into `/matches`.
- **Demo cap:** Cap or filter `/arena/start` results to 5 opponents for the PRD demo, because the backend currently runs against all other users.
- **Hybrid:** Keep PRD arena theater locally, but trigger real backend arena conversations in the background and swap in real scores when ready.

#### 2. Profile / Twin Model

| PRD | Backend |
|---|---|
| Hidden YAML profile (`Templates/profile.yaml`) | `ProfileVersion.profile_yaml`, `matching_vector`, and `system_instruction` |
| Intake paste + playful questions + follow-ups | `POST /users/me/intake` exists, but no frontend onboarding UI calls it |
| Twin preview card (vibe, looking for, bait, privacy) | Backend returns `TwinPreview` with public summary, looking_for, and interests |
| Mode-aware prompts (hackathon/dating/networking) | Arena accepts `mode`; live room engine currently hardcodes networking |

`Prompts/intake.md` and YAML templates remain useful references, but the live backend code now lives in `app/agents/profile.py` and `app/agents/synthesis.py`.

**Connection path:**

1. Frontend collects onboarding answers.
2. Frontend calls `POST /users/me/intake`.
3. Backend generates YAML, synthesis, matching vector, and system instruction server-side.
4. Backend returns a sanitized `TwinPreview`.
5. Frontend shows the human-readable twin preview without exposing YAML or internal instructions.

#### 3. Match Object Richness

PRD match cards need: headline, match type, strongest/non-obvious overlap, complementary dynamic, possible mismatch, follow-up questions, help exchange, privacy note, agent summary.

Backend arena `MatchCard` gives most PRD match-card fields. Backend room scoring gives only persisted `vibe_score` and `vibe_summary`; the scorer event can include `common_interests` and `suggested_icebreaker`.

Use `/arena/start` for PRD-shaped match cards. Use room scoring for a minimal live conversation result unless `scorer.py` is expanded to persist richer fields.

**Options:**

- Wire frontend match queue to arena `MatchCard` objects.
- Extend `scorer.py` to persist the full PRD-shaped JSON for live rooms.
- Add a post-score "match explainer" LLM step.
- Keep rich copy mocked until scoring prompt is tuned.

#### 4. Product Actions With No Backend

| PRD action | Backend support |
|---|---|
| Meet (notify other user) | None |
| Save / Pass | None (localStorage only) |
| Ask Why / Copilot | None (CopilotKit not integrated) |
| Event code / mode selection | None |
| Integrations (ChatGPT, Notes, files) | None |

These stay frontend-local or need new endpoints.

### Moderate Gaps

#### 5. Conversation Presentation

Backend stores and streams **full transcripts**. PRD wants **highlights by default** with optional eavesdrop.

**Adapter options:**

- Frontend truncates/summarizes client-side (quick, lower quality).
- Backend adds `GET /rooms/{id}/highlights` (LLM summary of stream).

#### 6. Demo Users

PRD has 7 rich seeded personas: Alexis, Haley, Leo, Maya, Jordan, Priya, and Marcus. The backend now has an idempotent seed script in `app/seed.py`, called from the FastAPI lifespan in `app/main.py`.

For demo: use `dev-login` to select one of the seeded users from the frontend; seed data is created or updated at backend startup.

#### 7. Auth UX

PRD starts as Alexis with no login. Backend requires auth for all room APIs.

Use `dev-login` on demo entry and store JWT. Google OAuth is for non-demo flow.

### Minor Gaps

- `README.org` TODO says dev-login is missing; it is implemented at `POST /auth/dev-login`.
- Scorer fallback drops `suggested_icebreaker` on LLM failure.
- No event/room listing for "HACK-AI-2026" (cosmetic for MVP).
- CORS already allows `localhost:3000` and `FRONTEND_URL`.

---

## Flow Comparison

### PRD Demo Flow (mock)

```
Landing -> Demo entry -> Onboarding questions -> Twin preview
    -> Arena animation (5 agents) -> Match queue -> Match detail
    -> Eavesdrop / Copilot / Meet (local)
```

### Backend Live Flow (built)

```
Auth -> PUT /users/me (persona) -> POST /rooms/matchmake
    -> Poll status -> WS /ws/rooms/{id} (live messages)
    -> POST /complete -> vibe_score event -> GET /rooms (matches)
```

### Backend Arena Flow (built, frontend unused)

```
Auth -> POST /users/me/intake or seeded persona
    -> POST /arena/start?mode=networking
    -> Redis arena cache + arena-convo streams
    -> GET /arena/results
    -> GET /arena/conversation/{conversation_id}
```

### Integration Flow (target)

```
Frontend onboarding (questions + paste)
    -> POST /users/me/intake
    -> POST /arena/start?mode=
    -> GET /arena/results (match cards)
    -> GET /arena/conversation/{conversation_id} (eavesdrop)
    -> Meet/Save/Pass (localStorage)
```

---

## Recommended Integration Phases

### Phase 1: Wire the Demo Shell (1-2 days)

- Fill in missing PRD routes: `/join`, `/integrations`, `/onboarding`, `/onboarding/questions`, `/onboarding/preview`, `/matches`, `/matches/[matchId]`.
- Extend `frontend/lib/api.ts` with `/users/me/intake`, `/arena/start`, `/arena/results`, and `/arena/conversation/{conversation_id}`.
- Demo entry: `dev-login` as Alexis (persona from PRD).
- Match queue: map arena `MatchCard` results to swipe cards.
- Eavesdrop: show selected arena conversation highlights from `GET /arena/conversation/{conversation_id}`.

### Phase 2: Close the Profile Gap

- Wire onboarding and required questions to `POST /users/me/intake`.
- Render the sanitized `TwinPreview` response.
- Keep profile YAML, matching vector, and generated system instruction server-side.

### Phase 3: Close the Matching Gap

Either:

- Accept 1:1 live matching for the live demo, or
- Use the existing arena batch API and cap/filter results to the PRD's 5-agent demo shape.

### Phase 4: Rich Match Output + Actions

- Use arena `MatchCard` fields for match queue and match detail.
- Expand room scorer output only if the live room flow remains part of the demo.
- Add Meet notification stub (even if mocked server-side).
- Optional CopilotKit endpoint for "Ask Why".

---

## Backend Data Model Reference

### SQLite (durable)

- `User`: `id`, `google_id`, `email`, `name`, `avatar_url`, `persona`, `created_at`
- `Room`: `id`, `status`, `vibe_score`, `vibe_summary`, `created_at`, `completed_at`
- `RoomParticipant`: `room_id`, `user_id`, `is_human_active`, `joined_at`
- `ProfileVersion`: `user_id`, `version`, `profile_yaml`, `matching_vector`, `system_instruction`, `is_active`, `created_at`

### Redis (ephemeral + real-time)

| Key | Type | Purpose |
|-----|------|---------|
| `matchmaking:queue` | List | User IDs waiting to be paired |
| `matchmaking:result:{user_id}` | String | Matched `room_id` (TTL 5 min) |
| `room:{id}:messages` | Stream | Full message history |
| `room:{id}:state` | Hash | Status, turn, message count, human overrides |
| `room:{id}:events` | Pub/Sub | Fan-out to WebSocket clients |
| `rooms:active` | Set | Active room IDs |
| `arena:{user_id}:latest` | String | Latest arena id and match cards, TTL 1 hour |
| `arena-convo:{uuid}` | Stream | Arena conversation for eavesdrop, TTL 1 hour |

### Vibe Score Payload (from scorer)

```json
{
  "score": 0,
  "summary": "...",
  "common_interests": [],
  "suggested_icebreaker": "..."
}
```

---

## Bottom Line

The backend implements two useful paths: a **real-time 1:1 agent chat + vibe scoring** pipeline and an **arena batch matching** pipeline that is closer to the PRD match-card shape. The current frontend only uses the 1:1 room path.

**Highest-value connection path for a hackathon demo:**

1. Build the PRD frontend with an `api.ts` layer (not mocks).
2. Use `dev-login` + seeded personas for the 7 demo users.
3. Wire onboarding to the existing intake endpoint and keep raw YAML hidden.
4. Wire the arena and match queue to the existing arena batch endpoints.
5. Keep Meet, Save, Pass, and Copilot-style explanations local or mocked until product endpoints exist.

**Largest gaps to resolve before the demo feels integrated:**

- Frontend routes for onboarding, preview, matches, match detail, integrations, and join
- Frontend wiring to existing intake and arena APIs
- Save, Pass, Meet, and Copilot-style product actions

Most remaining PRD alignment is frontend wiring, demo-state handling, and choosing whether the visible demo uses the room path, the arena path, or both.

---

## Related Documents

- [Twinder_PRD.md](./Twinder_PRD.md) - Frontend demo product requirements
- [app/README.md](../app/README.md) - Backend architecture and API reference
- [Prompts/intake.md](../Prompts/intake.md) - Intake prompt for YAML profile generation
- [Templates/profile.yaml](../Templates/profile.yaml) - Profile schema template
