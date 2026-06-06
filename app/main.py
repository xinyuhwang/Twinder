from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app.config import settings
from app.database import create_db
from app.redis_client import close_redis, get_redis, init_redis


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db()
    await init_redis()
    # Verify Redis connection
    r = get_redis()
    await r.ping()
    yield
    await close_redis()


app = FastAPI(title="Twinder", version="0.1.0", lifespan=lifespan)

# Session middleware (required by authlib for OAuth state)
app.add_middleware(SessionMiddleware, secret_key=settings.jwt_secret)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
from app.auth.router import router as auth_router
from app.chat.router import router as chat_router
from app.rooms.router import router as rooms_router
from app.users.router import router as users_router

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(rooms_router)
app.include_router(chat_router)


@app.get("/health")
async def health():
    try:
        r = get_redis()
        redis_ok = await r.ping()
    except Exception:
        redis_ok = False
    return {"status": "ok", "redis": redis_ok}
