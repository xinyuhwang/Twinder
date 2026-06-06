from litellm import acompletion

from app.config import settings


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
    }

    # litellm handles system prompts differently per provider,
    # but passing it as the first message works universally
    if system:
        kwargs["messages"] = [{"role": "system", "content": system}] + messages

    response = await acompletion(**kwargs)
    return response.choices[0].message.content
