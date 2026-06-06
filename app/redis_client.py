import redis.asyncio as aioredis

from app.config import settings

redis_pool: aioredis.Redis | None = None


async def init_redis() -> aioredis.Redis:
    global redis_pool
    redis_pool = aioredis.from_url(settings.redis_url, decode_responses=True)
    # Test connection — fall back to RESP2 if server doesn't support HELLO (Redis <6)
    try:
        await redis_pool.ping()
    except aioredis.ResponseError:
        await redis_pool.close()
        redis_pool = aioredis.from_url(
            settings.redis_url, decode_responses=True, protocol=2
        )
        await redis_pool.ping()
    return redis_pool


async def close_redis():
    global redis_pool
    if redis_pool:
        await redis_pool.close()
        redis_pool = None


def get_redis() -> aioredis.Redis:
    assert redis_pool is not None, "Redis not initialized"
    return redis_pool
