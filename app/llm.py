import asyncio
import logging

from litellm import acompletion, aembedding

from app.config import settings
from app.observability import op

logger = logging.getLogger(__name__)

RATE_LIMIT_RETRIES = 4
RATE_LIMIT_BASE_DELAY_S = 15


def _is_rate_limit_error(exc: Exception) -> bool:
    name = type(exc).__name__.lower()
    text = str(exc).lower()
    return "ratelimit" in name or "rate_limit" in text or "rate limit" in text


@op(name="llm.chat")
async def chat(
    messages: list[dict],
    system: str | None = None,
    model: str | None = None,
    max_tokens: int = 120,
) -> str:
    """Unified LLM call via litellm. Works with Anthropic, OpenAI, etc."""
    model = model or settings.llm_model

    kwargs: dict = {
        "model": model,
        "messages": messages,
        "max_tokens": max_tokens,
        "api_key": settings.anthropic_api_key or None,
    }

    if system:
        kwargs["messages"] = [{"role": "system", "content": system}] + messages

    last_err: Exception | None = None
    for attempt in range(RATE_LIMIT_RETRIES):
        try:
            response = await acompletion(**kwargs)
            return response.choices[0].message.content
        except Exception as exc:
            if not _is_rate_limit_error(exc):
                raise
            last_err = exc
            if attempt >= RATE_LIMIT_RETRIES - 1:
                break
            delay = RATE_LIMIT_BASE_DELAY_S * (2 ** attempt)
            logger.warning(
                "LLM rate limited on %s (attempt %s/%s); retrying in %ss",
                model,
                attempt + 1,
                RATE_LIMIT_RETRIES,
                delay,
            )
            await asyncio.sleep(delay)

    assert last_err is not None
    raise last_err


@op(name="llm.embed")
async def embed(
    texts: list[str],
    model: str = "text-embedding-3-small",
) -> list[list[float]]:
    """Return embedding vectors for a list of texts via litellm (OpenAI by default)."""
    response = await aembedding(
        model=model,
        input=texts,
        api_key=settings.openai_api_key or None,
    )
    return [item["embedding"] for item in response.data]
