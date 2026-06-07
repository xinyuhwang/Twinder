from litellm import acompletion, aembedding

from app.config import settings
from app.observability import op


@op(name="llm.chat")
async def chat(
    messages: list[dict],
    system: str | None = None,
    model: str | None = None,
    max_tokens: int = 300,
) -> str:
    """Unified LLM call via litellm. Works with Anthropic, OpenAI, etc."""
    model = model or settings.llm_model

    kwargs: dict = {
        "model": model,
        "messages": messages,
        "max_tokens": max_tokens,
        "api_key": settings.anthropic_api_key or None,
    }

    # litellm handles system prompts differently per provider,
    # but passing it as the first message works universally
    if system:
        kwargs["messages"] = [{"role": "system", "content": system}] + messages

    response = await acompletion(**kwargs)
    return response.choices[0].message.content


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
    # litellm returns response.data as a list of dicts with an "embedding" key
    return [item["embedding"] for item in response.data]
