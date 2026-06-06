# Frontend-Backend Integration Assessment

Assessment of how the Twinder PRD frontend demo ([Twinder_PRD.md](./Twinder_PRD.md)) connects to the FastAPI backend ([app/README.md](../app/README.md)), including gaps and recommended integration phases.

**Date:** June 2026

---

## Current State

| Layer | Status | Location |
|-------|--------|----------|
| Backend (FastAPI) | Built | `app/` in this repo |
| Frontend (Next.js) | Not in repo | PRD spec only; may live in another branch or repo |
| Intake / YAML system | Documented, not wired | `Prompts/intake.md`, `Templates/` |

This repo contains the backend only. There is no Next.js app here yet: no `lib/mock-api.ts`, no routes like `/arena` or `/matches`. The work ahead is not "swap mock calls for real calls" inside an existing frontend. It is **build the frontend against the backend API**, using the PRD as the UX spec and the backend as the live data layer.

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
| Enter arena / matchmaking | `POST /rooms/matchmake` + poll `GET /rooms/matchmake/status` | 1:1 queue, not 5-agent arena |
| List matches | `GET /rooms` | Completed rooms with `vibe_score` |
| Match detail | `GET /rooms/{id}` | Partial fit |
| Agent transcript | `GET /rooms/{id}/messages` | Full transcript, not highlights |
| Live eavesdrop | `WS /ws/rooms/{id}?token=` | Real-time events |
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
Next.js pages (PRD routes)
    |
    v
lib/api.ts          <- replace mock-api.ts
    |
    +-- REST  -> FastAPI (localhost:8000)
    +-- WS    -> /ws/rooms/{id}
    +-- localStorage for demo-only state (Save/Pass, selected demo user)
```

Keep PRD demo persistence (Save/Pass, swipe history) in localStorage until backend adds those endpoints.

---

## Gap Analysis

### Critical Gaps

#### 1. Matching Model: 1:1 Queue vs 5-Agent Arena

| PRD | Backend |
|---|---|
| User's twin meets 5 seeded agents sequentially | FIFO queue pairs two real users |
| Precomputed highlights and ranked cards | One room per pair, score after conversation |
| Demo completes in under 3 minutes | Real LLM loop: up to 20 messages, 3s pacing (~1+ min per pair) |

**Options to connect without rewriting everything:**

- **Demo mode (fastest):** Seed 7 users via `dev-login`, run matchmake in parallel or scripted pairs, use WS + REST for live/real data. Arena UI becomes a **progress view** over real rooms, not a mock animation.
- **Hybrid:** Keep PRD arena as theater, but trigger real backend conversations in background and swap in real scores when ready.
- **Full backend alignment:** Add an "arena orchestrator" that pairs one user against N queued/seeded twins and returns ranked results. This does not exist today.

#### 2. Profile / Twin Model

| PRD | Backend |
|---|---|
| Hidden YAML profile (`Templates/profile.yaml`) | Single optional `persona` string on `User` |
| Intake paste + playful questions + follow-ups | No intake API |
| Twin preview card (vibe, looking for, bait, privacy) | Only `name`, `avatar_url`, `persona` |
| Mode-aware prompts (hackathon/dating/networking) | One generic `TWIN_SYSTEM_PROMPT` |

`Prompts/intake.md` and YAML templates exist in the repo but are **not wired into the API**.

**Connection path:**

1. Frontend collects onboarding answers.
2. New backend endpoint runs intake LLM call and produces YAML (stored server-side, never sent to client).
3. Backend derives `persona` (or structured fields) for agent prompts.
4. Frontend shows human-readable twin preview from a **sanitized** API response.

Today you can only `PUT /users/me` with a hand-built persona string.

#### 3. Match Object Richness

PRD match cards need: headline, match type, strongest/non-obvious overlap, complementary dynamic, possible mismatch, follow-up questions, help exchange, privacy note, agent summary.

Backend room/score gives: `vibe_score`, `vibe_summary`, `common_interests`, `suggested_icebreaker`.

That is enough for a **minimal** match card, not the full PRD detail page.

**Options:**

- Extend `scorer.py` to return the full PRD-shaped JSON.
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

PRD has 7 rich seeded personas (Alexis, Haley, Leo, Maya, Jordan, Priya, Marcus). Backend has no seed script.

For demo: run 7 `dev-login` calls with personas derived from PRD copy, or add a `/dev/seed` endpoint.

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

### Integration Flow (target)

```
Frontend onboarding (questions + paste)
    -> PUT /users/me {persona}          [today]
    -> POST /users/me/intake            [future]
    -> POST /rooms/matchmake (x N)
    -> WS message events (arena feed)
    -> GET /rooms (match cards)
    -> GET /rooms/{id}/messages (eavesdrop)
    -> Meet/Save/Pass (localStorage)
    -> POST /takeover, /complete
```

---

## Recommended Integration Phases

### Phase 1: Wire the Demo Shell (1-2 days)

- Scaffold Next.js per PRD routes.
- Add `lib/api.ts` with auth, profile update, matchmake poll, rooms list, messages, WebSocket helper.
- Demo entry: `dev-login` as Alexis (persona from PRD).
- Match queue: map `GET /rooms` to swipe cards using `vibe_score` + `vibe_summary` + participant info.
- Eavesdrop: bind to WS + message history.

### Phase 2: Close the Profile Gap

- Add `POST /users/me/intake` (paste text + questionnaire answers).
- LLM generates YAML using `Prompts/intake.md` + `Templates/profile.yaml`.
- Store YAML server-side; expose sanitized twin preview; set `persona` for agents.

### Phase 3: Close the Matching Gap

Either:

- Accept 1:1 live matching for the live demo, or
- Add arena orchestrator: enqueue user against N seeded twins, aggregate scores into ranked match list.

### Phase 4: Rich Match Output + Actions

- Expand scorer output to PRD match detail shape.
- Add Meet notification stub (even if mocked server-side).
- Optional CopilotKit endpoint for "Ask Why".

---

## Backend Data Model Reference

### SQLite (durable)

- `User`: `id`, `google_id`, `email`, `name`, `avatar_url`, `persona`, `created_at`
- `Room`: `id`, `status`, `vibe_score`, `vibe_summary`, `created_at`, `completed_at`
- `RoomParticipant`: `room_id`, `user_id`, `is_human_active`, `joined_at`

### Redis (ephemeral + real-time)

| Key | Type | Purpose |
|-----|------|---------|
| `matchmaking:queue` | List | User IDs waiting to be paired |
| `matchmaking:result:{user_id}` | String | Matched `room_id` (TTL 5 min) |
| `room:{id}:messages` | Stream | Full message history |
| `room:{id}:state` | Hash | Status, turn, message count, human overrides |
| `room:{id}:events` | Pub/Sub | Fan-out to WebSocket clients |
| `rooms:active` | Set | Active room IDs |

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

The backend implements a **real-time 1:1 agent chat + vibe scoring** pipeline. The PRD implements a **polished multi-agent demo** with rich static match narratives. They share the same story but different **granularity and orchestration**.

**Highest-value connection path for a hackathon demo:**

1. Build the PRD frontend with an `api.ts` layer (not mocks).
2. Use `dev-login` + seeded personas for the 7 demo users.
3. Treat the arena as a **live progress UI** over real WebSocket conversations (or run conversations ahead of time and replay).
4. Map rooms to match cards from scorer output.
5. Prioritize one new backend piece: **intake-to-persona** so onboarding feeds real agent behavior.

**Largest gaps to resolve before the demo feels integrated:**

- Arena orchestration (1 vs many)
- Rich profile/intake API
- Rich match explanation JSON

Everything else is mostly frontend wiring and local demo state.

---

## Related Documents

- [Twinder_PRD.md](./Twinder_PRD.md) - Frontend demo product requirements
- [app/README.md](../app/README.md) - Backend architecture and API reference
- [Prompts/intake.md](../Prompts/intake.md) - Intake prompt for YAML profile generation
- [Templates/profile.yaml](../Templates/profile.yaml) - Profile schema template
