# Twinder Backend

FastAPI backend for Twinder: digital twins that network on your behalf. Users authenticate, define a persona, get matched into rooms, and their AI twins converse while humans can watch, take over, or complete conversations for vibe scoring.

## Tech Stack

| Layer | Technology |
|-------|------------|
| API | FastAPI + uvicorn (async Python 3.11+) |
| Persistence | SQLModel / SQLite (`User`, `Room`, `RoomParticipant`) |
| Real-time state | Redis (Streams, Pub/Sub, Hashes, Lists, Sets) |
| LLM | LiteLLM (Anthropic, OpenAI, 100+ providers via env) |
| Auth | Google OAuth (Authlib) + JWT (cookie or Bearer) |

## Architecture Overview

```mermaid
flowchart TB
    subgraph clients [Clients]
        FE[Frontend / Browser]
    end

    subgraph api [FastAPI Application]
        MAIN[main.py<br/>lifespan, CORS, routers]
        AUTH[auth/router]
        USERS[users/router]
        ROOMS[rooms/router]
        CHAT[chat/router<br/>WebSocket]
    end

    subgraph core [Core Services]
        DEPS[deps.py<br/>JWT auth]
        CONFIG[config.py]
        LLM[llm.py<br/>LiteLLM]
    end

    subgraph agents [Agent Layer]
        ENGINE[agents/engine.py<br/>conversation loop]
        SCORER[agents/scorer.py<br/>vibe scoring]
        PROMPTS[agents/prompts.py]
    end

    subgraph infra [Infrastructure]
        DB[(SQLite<br/>database.py)]
        REDIS[(Redis<br/>redis_client.py)]
        MM[rooms/matchmaker.py]
        WS[chat/manager.py]
    end

    subgraph external [External]
        GOOGLE[Google OAuth]
        LLM_API[LLM Providers]
    end

    FE -->|REST + WS| MAIN
    MAIN --> AUTH & USERS & ROOMS & CHAT
    AUTH --> DEPS
    USERS --> DEPS
    ROOMS --> DEPS
    CHAT --> DEPS

    AUTH --> GOOGLE
    AUTH & USERS & ROOMS --> DB
    ROOMS --> MM
    MM --> REDIS
    ROOMS --> ENGINE
    CHAT --> WS
    CHAT --> REDIS
    ENGINE --> LLM & REDIS & DB
    SCORER --> LLM & REDIS & DB
    LLM --> LLM_API
    WS --> REDIS
```

## Module Map

```
app/
├── main.py              Entry point, lifespan, middleware, router registration
├── config.py            Pydantic Settings from .env
├── deps.py              get_current_user (JWT from cookie or Authorization header)
├── database.py          SQLModel engine, create_db, get_session
├── models.py            User, Room, RoomParticipant
├── schemas.py           Pydantic request/response models
├── redis_client.py      Async Redis pool (RESP2/3 auto-fallback)
├── llm.py               LiteLLM wrapper (provider-agnostic)
│
├── auth/
│   ├── oauth.py         Authlib Google OAuth client
│   └── router.py        /auth/google, /callback, /me, /logout, /dev-login
│
├── users/
│   └── router.py        /users/me, /users/{id}
│
├── rooms/
│   ├── router.py        Room CRUD, matchmaking, takeover, completion
│   └── matchmaker.py    Redis list-based pairing queue
│
├── chat/
│   ├── manager.py       In-memory WebSocket ConnectionManager
│   └── router.py        WS /ws/rooms/{room_id}
│
└── agents/
    ├── prompts.py       Twin persona + vibe scoring prompts
    ├── engine.py        Agent conversation loop + respond_as_agent
    └── scorer.py        Post-conversation vibe scoring
```

### Dependency Graph

```mermaid
flowchart LR
    main --> config & database & redis_client
    main --> auth_router & users_router & rooms_router & chat_router

    auth_router --> oauth & deps & database & schemas
    users_router --> deps & database & schemas
    rooms_router --> deps & database & redis_client & matchmaker & engine
    chat_router --> manager & deps & database & redis_client & engine

    engine --> prompts & llm & database & redis_client & scorer
    scorer --> prompts & llm & database & redis_client
    matchmaker --> database & redis_client
    deps --> config & database & models
    llm --> config
```

## Data Model

### SQLite (durable records)

```mermaid
erDiagram
    User ||--o{ RoomParticipant : joins
    Room ||--o{ RoomParticipant : has

    User {
        int id PK
        string google_id UK
        string email
        string name
        string avatar_url
        string persona
        datetime created_at
    }

    Room {
        string id PK
        string status
        float vibe_score
        string vibe_summary
        datetime created_at
        datetime completed_at
    }

    RoomParticipant {
        int id PK
        string room_id FK
        int user_id FK
        bool is_human_active
        datetime joined_at
    }
```

### Redis (ephemeral + real-time)

| Key | Type | Purpose |
|-----|------|---------|
| `matchmaking:queue` | List | User IDs waiting to be paired |
| `matchmaking:result:{user_id}` | String | Matched `room_id` (TTL 5 min) |
| `room:{id}:messages` | Stream | Full message history |
| `room:{id}:state` | Hash | Status, turn, message count, human overrides |
| `room:{id}:events` | Pub/Sub | Fan-out to WebSocket clients |
| `rooms:active` | Set | Active room IDs |

## Request Flows

### 1. Authentication

```mermaid
sequenceDiagram
    participant C as Client
    participant A as auth/router
    participant G as Google OAuth
    participant DB as SQLite

    C->>A: GET /auth/google
    A->>G: authorize_redirect
    G->>C: Google login
    C->>A: GET /auth/callback
    A->>G: authorize_access_token
    A->>DB: find or create User
    A->>C: Redirect + JWT cookie
```

Dev shortcut: `POST /auth/dev-login?name=...&persona=...` creates a test user and returns a JWT without Google.

### 2. Matchmaking to Agent Conversation

```mermaid
sequenceDiagram
    participant C as Client
    participant R as rooms/router
    participant MM as matchmaker
    participant Redis as Redis
    participant DB as SQLite
    participant E as agents/engine

    C->>R: POST /rooms/matchmake
    R->>MM: enqueue_user(user_id)
    MM->>Redis: rpop queue or lpush user

    alt Partner found
        MM-->>R: matched + room_id
        R->>DB: create Room + RoomParticipants
        R->>Redis: init room state, sadd rooms:active
        R->>E: asyncio.create_task(run_conversation)
    else No partner
        MM-->>R: queued + position
    end

    C->>R: GET /rooms/matchmake/status (poll)
    R->>MM: check_match_status
```

### 3. Agent Conversation Loop

```mermaid
sequenceDiagram
    participant E as agents/engine
    participant Redis as Redis
    participant LLM as llm.py
    participant WS as WebSocket clients

    loop Until completed or max messages
        E->>Redis: hgetall room state
        alt Human override on current turn
            E->>E: sleep, wait for human
        else Agent turn
            E->>Redis: xrange messages
            E->>LLM: chat(system + history)
            E->>Redis: xadd message, hincrby count
            E->>Redis: publish room events
            Redis->>WS: Pub/Sub fan-out
            E->>E: sleep 3s pacing
        end
    end

    E->>E: _complete_room or manual POST /complete
    E->>E: score_conversation (background)
```

### 4. Real-time Chat (WebSocket)

```mermaid
sequenceDiagram
    participant C as Client
    participant WS as chat/router
    participant M as ConnectionManager
    participant Redis as Redis
    participant E as agents/engine

    C->>WS: WS /ws/rooms/{id}?token=jwt
    WS->>M: connect
    WS->>Redis: subscribe room events

    C->>WS: {type: message, content: ...}
    WS->>Redis: xadd message stream
    WS->>Redis: publish event
    Redis->>M: broadcast to room

    alt Other participant still agent-controlled
        WS->>E: respond_as_agent
    end
```

### 5. Human Takeover and Completion

```mermaid
flowchart TD
    A[User POST /rooms/id/takeover] --> B[Set is_human_active in SQLite]
    B --> C[Set human_override user_id in Redis hash]
    C --> D[Publish human_takeover event]

    E[User POST /rooms/id/complete] --> F[Mark room completed in SQLite + Redis]
    F --> G[Remove from rooms:active]
    G --> H[Background: score_conversation]
    H --> I[LLM scores 0-100 + summary]
    I --> J[Update Room.vibe_score in SQLite]
    J --> K[Publish vibe_score event]
```

## API Reference

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | No | Health check (Redis ping) |
| GET | `/auth/google` | No | Start Google OAuth |
| GET | `/auth/callback` | No | OAuth callback, sets JWT cookie |
| POST | `/auth/dev-login` | No | Dev-only test user + JWT |
| GET | `/auth/me` | Yes | Current user |
| POST | `/auth/logout` | No | Clear cookie |
| GET | `/users/me` | Yes | Get profile |
| PUT | `/users/me` | Yes | Update name, persona |
| GET | `/users/{id}` | No | Public profile |
| POST | `/rooms/matchmake` | Yes | Join matchmaking queue |
| GET | `/rooms/matchmake/status` | Yes | Poll match status |
| GET | `/rooms` | Yes | List user's rooms |
| GET | `/rooms/{id}` | Yes | Room details + vibe score |
| GET | `/rooms/{id}/messages` | Yes | Message history (Redis Stream) |
| POST | `/rooms/{id}/takeover` | Yes | Human replaces agent |
| POST | `/rooms/{id}/complete` | Yes | End conversation, trigger scoring |
| WS | `/ws/rooms/{id}?token={jwt}` | Token | Real-time chat via Redis Pub/Sub |

Interactive docs: `http://localhost:8000/docs`

## Configuration

Copy `.env.example` to `.env` at the repo root:

```bash
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
JWT_SECRET=...
ANTHROPIC_API_KEY=...          # or OPENAI_API_KEY
LLM_MODEL=anthropic/claude-sonnet-4-20250514
REDIS_URL=redis://localhost:6379
DATABASE_URL=sqlite:///./twinder.db
FRONTEND_URL=http://localhost:3000
```

Swap LLM providers by changing `LLM_MODEL` (LiteLLM format):

- `anthropic/claude-sonnet-4-20250514`
- `gpt-4o`
- `gpt-4o-mini`

## Running Locally

```bash
# Start Redis (if using local)
redis-server --daemonize yes

# Install deps
source .venv/bin/activate
uv pip install -e .

# Run API
uvicorn app.main:app --reload
```

## WebSocket Events

Clients receive JSON events on `room:{id}:events`:

| Event type | Payload |
|------------|---------|
| `message` | `sender_user_id`, `sender_name`, `role`, `content`, `timestamp` |
| `human_takeover` | `user_id`, `user_name` |
| `room_completed` | `room_id` |
| `vibe_score` | `score`, `summary`, `common_interests`, `suggested_icebreaker` |

Send `{ "type": "message", "content": "..." }` or `{ "type": "ping" }` (returns `pong`).

## Startup Lifecycle

On application startup (`main.py` lifespan):

1. `create_db()` - create SQLite tables if missing
2. `init_redis()` - connect Redis pool (RESP3, fallback to RESP2)
3. Ping Redis to verify connectivity

On shutdown: `close_redis()` closes the connection pool.
