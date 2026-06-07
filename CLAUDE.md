# CLAUDE.md — Twinder

## What is this project?

Twinder is a hackathon project (WeaveHacks 4, June 2026) where AI digital twins network on behalf of their users. Users create personality profiles, their agents chat with other agents, and the best connections are surfaced as ranked match cards. Then the humans meet IRL.

Repo: https://github.com/xinyuhwang/Twinder

## Architecture

```
Frontend (Next.js, port 3000)
  ↓ HTTP + WebSocket
Backend (FastAPI, port 8000)
  ↓                    ↓
SQLite (users,       Redis Cloud 8.x
 rooms, profiles)    (messages, state,
                      matchmaking, arena)
  ↓
LiteLLM → Claude / GPT-4o / any provider
```

### Backend (Python, `app/`)
- **FastAPI** async app with SQLModel ORM, SQLite persistence
- **Redis** is used heavily (hackathon sponsor): Streams for message history, Pub/Sub for WebSocket fan-out, Hashes for room state, Lists for matchmaking queue
- **LiteLLM** wraps LLM calls — provider is swappable via `LLM_MODEL` env var
- **Google OAuth** via authlib + JWT tokens (HS256, 7-day expiry)
- **Dev-login** shortcut at `POST /auth/dev-login?name=Alexis` bypasses OAuth for testing

### Frontend (TypeScript, `frontend/`)
- **Next.js 16** App Router, all pages are `'use client'`
- **Tailwind CSS** dark theme, mobile-first (max-w-md)
- **Framer Motion** for animations, **Lucide** for icons
- API base URL configured via `NEXT_PUBLIC_API_URL` env var
- WebSocket URL derived from same env var (http→ws swap)

## Two interaction modes

### Arena (batch) — primary demo flow
`POST /arena/start?mode=hackathon` → user's agent has short (8-turn) parallel conversations with all other users → each scored into a rich match card → returned ranked by score. Conversations stored in Redis Streams with 1hr TTL. Arena results stored at `arena:{userId}:latest`.

Key files: `app/agents/arena.py`, `app/arena/router.py`

### Chatroom (live) — deeper connection
`POST /rooms/matchmake` → two users paired via Redis list queue → agents chat in real-time (20 turns, 3s pacing) → messages stream via WebSocket + Redis Pub/Sub → human can take over at any time → vibe scoring on completion.

Key files: `app/agents/engine.py`, `app/rooms/router.py`, `app/chat/router.py`

## Key implementation details

### Agent conversation perspective mapping
When calling the LLM for Agent B, the conversation history must be remapped: A's messages become `role: "user"`, B's messages become `role: "assistant"`. This happens in `engine.py:_build_messages()`. The arena does this differently — it maintains two separate message lists (`messages_a`, `messages_b`) during the conversation loop.

### Redis protocol compatibility
Local dev uses Redis 5.x (no RESP3 support). `redis_client.py:init_redis()` tries RESP3 first, falls back to `protocol=2` on error. Redis Cloud 8.x supports both.

### LLM JSON parsing
LLMs often wrap JSON in markdown code blocks. Both `arena.py` and `scorer.py` have `_parse_json()` helpers that try: direct parse → extract from ```json blocks → find first `{...}` substring.

### Dev-login vs seeded users
`seed.py` creates 7 demo users on startup with rich 1400-char personas (google_id prefix `demo-`). `dev-login` finds them by google_id. Important: dev-login does NOT overwrite an existing persona — this prevents the frontend's short persona summaries from clobbering the rich seeded ones.

### Prompt system
`app/agents/prompts.py` has:
- `MODE_GUIDELINES` dict — mode-specific conversation instructions (hackathon, networking, dating, custom)
- `TWIN_SYSTEM_PROMPT` — agent identity template with `{name}`, `{persona}`, `{mode_guidelines}` slots + behavior rules from the PRD
- `TWIN_OPENER` — first message template with `{mode}` slot
- `MATCH_CARD_SCORING_PROMPT` — post-conversation scoring with both personas + transcript → rich JSON match card
- `VIBE_SCORING_PROMPT` — simpler scoring for chatroom mode

### Profile synthesis pipeline (added by team)
`app/agents/profile.py` — intake prompt generates YAML profile from raw user context
`app/agents/synthesis.py` — synthesizes profile + matching vector from multiple sources
`app/models.py:ProfileVersion` — stores versioned YAML profiles and system instructions

### Observability
`app/observability.py` — optional Weave integration (Weights & Biases). Enabled via `WEAVE_ENABLED=true`. The `@op` decorator wraps async functions for tracing.

## Database models

- **User**: id, google_id (unique), email, name, avatar_url, persona (text), created_at
- **Room**: id (uuid), status (waiting/active/completed), vibe_score, vibe_summary, timestamps
- **RoomParticipant**: room_id (FK), user_id (FK), is_human_active (bool)
- **ProfileVersion**: user_id (FK), version, profile_yaml, matching_vector, system_instruction, is_active

## Redis keys

| Key pattern | Type | TTL | Purpose |
|---|---|---|---|
| `room:{id}:messages` | Stream | none | Chat message history |
| `room:{id}:state` | Hash | none | Turn state, human overrides |
| `room:{id}:events` | Pub/Sub | — | WebSocket fan-out |
| `rooms:active` | Set | none | Active room IDs |
| `matchmaking:queue` | List | none | Users waiting to pair |
| `matchmaking:result:{uid}` | String | 5min | Match result for polling |
| `arena:{uid}:latest` | String | 1hr | Latest arena results |
| `arena-convo:{uuid}` | Stream | 1hr | Arena conversation messages |

## Environment variables

### Backend (`.env` at project root)
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`
- `JWT_SECRET`
- `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`
- `LLM_MODEL` — litellm format: `anthropic/claude-sonnet-4-20250514`, `gpt-4o`, etc.
- `REDIS_URL` — `redis://localhost:6379` or `redis://default:pass@host:port`
- `DATABASE_URL` — `sqlite:///./twinder.db`
- `FRONTEND_URL` — where OAuth redirects after login
- `WEAVE_ENABLED`, `WANDB_ENTITY`, `WANDB_PROJECT` — optional observability

### Frontend (`frontend/.env.local`)
- `NEXT_PUBLIC_API_URL` — backend base URL (defaults to `http://localhost:8000`)

## Running locally

```bash
# Backend
redis-server --daemonize yes  # or use Redis Cloud
uv venv && source .venv/bin/activate
uv pip install -e .
cp .env.example .env  # fill in keys
uvicorn app.main:app --reload  # seeds demo users on startup

# Frontend
cd frontend
npm install
npm run dev  # http://localhost:3000
```

## Commands

- `uvicorn app.main:app --reload` — start backend with hot reload
- `python -m app.seed` — manually re-seed demo users
- `cd frontend && npm run dev` — start frontend dev server
- `cd frontend && npm run build` — production build

## Gotchas

- The Python `.gitignore` has `lib/` globally — `!frontend/lib/` is added to exempt the frontend lib directory
- `python-jose` requires JWT `sub` claim to be a string, not int
- Redis 5.x doesn't support `HELLO` command — the client auto-detects and falls back
- Arena conversations are ephemeral (1hr TTL in Redis) — not persisted to SQLite
- The `SessionMiddleware` (for authlib OAuth state) requires `itsdangerous` — not auto-installed by authlib
- `setuptools` needs explicit `packages = ["app"]` in pyproject.toml because other top-level dirs (Docs, Prompts, Templates, Users) confuse auto-discovery
