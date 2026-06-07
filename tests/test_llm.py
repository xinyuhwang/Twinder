"""Tests for LLM rate-limit retry behavior."""

from unittest.mock import AsyncMock, patch

import pytest

from app.llm import RATE_LIMIT_RETRIES, chat


@pytest.mark.asyncio
async def test_chat_retries_on_rate_limit():
    ok_response = AsyncMock()
    ok_response.choices = [AsyncMock(message=AsyncMock(content="hello"))]

    rate_err = Exception('litellm.RateLimitError: rate_limit_error')

    with patch("app.llm.acompletion", new=AsyncMock(side_effect=[rate_err, rate_err, ok_response])) as mock:
        with patch("app.llm.asyncio.sleep", new=AsyncMock()) as sleep:
            result = await chat([{"role": "user", "content": "hi"}], max_tokens=10)

    assert result == "hello"
    assert mock.await_count == 3
    assert sleep.await_count == 2


@pytest.mark.asyncio
async def test_chat_raises_after_max_rate_limit_retries():
    rate_err = Exception("rate_limit_error")

    with patch("app.llm.acompletion", new=AsyncMock(side_effect=[rate_err] * RATE_LIMIT_RETRIES)):
        with patch("app.llm.asyncio.sleep", new=AsyncMock()):
            with pytest.raises(Exception, match="rate_limit"):
                await chat([{"role": "user", "content": "hi"}], max_tokens=10)
