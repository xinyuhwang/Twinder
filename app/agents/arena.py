import asyncio
import json
import re
import uuid
from datetime import datetime, timezone

from sqlmodel import select

from app.agents.prompts import MATCH_CARD_SCORING_PROMPT, TWIN_OPENER, TWIN_SYSTEM_PROMPT
from app.database import get_session
from app.llm import chat
from app.models import User
from app.redis_client import get_redis

ARENA_TURNS = 8  # 4 exchanges each


async def run_arena(user_id: int, mode: str = "networking") -> list[dict]:
    """Run one user's agent against all other users. Returns ranked match cards."""
    session = next(get_session())
    user = session.get(User, user_id)
    if not user:
        session.close()
        return []

    opponents = session.exec(select(User).where(User.id != user_id)).all()
    if not opponents:
        session.close()
        return []

    # Run all conversations in parallel
    tasks = [
        _arena_conversation(user, opponent, mode)
        for opponent in opponents
    ]
    results = await asyncio.gather(*tasks, return_exceptions=True)

    # Filter out errors, sort by score
    match_cards = []
    for result in results:
        if isinstance(result, dict) and "score" in result:
            match_cards.append(result)

    match_cards.sort(key=lambda x: x.get("score", 0), reverse=True)

    # Store results in Redis for retrieval
    r = get_redis()
    arena_id = str(uuid.uuid4())
    await r.set(
        f"arena:{user_id}:latest",
        json.dumps({"arena_id": arena_id, "match_cards": match_cards}),
        ex=3600,
    )

    # Also store individual arena conversations
    await r.set(f"arena:{arena_id}:results", json.dumps(match_cards), ex=3600)

    session.close()
    return match_cards


async def _arena_conversation(user_a: User, user_b: User, mode: str) -> dict:
    """Run a short conversation between two agents and score it."""
    persona_a = user_a.persona or f"{user_a.name} — no detailed profile provided yet."
    persona_b = user_b.persona or f"{user_b.name} — no detailed profile provided yet."

    system_a = TWIN_SYSTEM_PROMPT.format(name=user_a.name, persona=persona_a, mode=mode)
    system_b = TWIN_SYSTEM_PROMPT.format(name=user_b.name, persona=persona_b, mode=mode)

    # Store conversation in Redis Stream for potential eavesdrop later
    r = get_redis()
    convo_id = f"arena-convo:{uuid.uuid4()}"

    messages_a: list[dict] = []  # from A's perspective
    messages_b: list[dict] = []  # from B's perspective

    for turn in range(ARENA_TURNS):
        if turn % 2 == 0:
            # A's turn
            if turn == 0:
                prompt_msgs = [{"role": "user", "content": TWIN_OPENER}]
            else:
                prompt_msgs = messages_a
            content = await chat(messages=prompt_msgs, system=system_a)

            messages_a.append({"role": "assistant", "content": content})
            messages_b.append({"role": "user", "content": content})

            await r.xadd(convo_id, {
                "sender_name": user_a.name,
                "sender_user_id": str(user_a.id),
                "content": content,
                "turn": str(turn),
            })
        else:
            # B's turn
            prompt_msgs = messages_b
            content = await chat(messages=prompt_msgs, system=system_b)

            messages_b.append({"role": "assistant", "content": content})
            messages_a.append({"role": "user", "content": content})

            await r.xadd(convo_id, {
                "sender_name": user_b.name,
                "sender_user_id": str(user_b.id),
                "content": content,
                "turn": str(turn),
            })

    # Set TTL on conversation stream
    await r.expire(convo_id, 3600)

    # Format conversation for scoring
    raw = await r.xrange(convo_id)
    lines = [f"{f['sender_name']}: {f['content']}" for _, f in raw]
    conversation_text = "\n".join(lines)

    # Generate match card
    scoring_prompt = MATCH_CARD_SCORING_PROMPT.format(
        user_a_name=user_a.name,
        user_a_persona=persona_a,
        user_b_name=user_b.name,
        user_b_persona=persona_b,
        conversation=conversation_text,
    )

    try:
        result_raw = await chat(
            messages=[{"role": "user", "content": scoring_prompt}],
            max_tokens=800,
        )
        match_card = _parse_json(result_raw)
    except Exception as e:
        match_card = {
            "score": 50,
            "headline": f"Connection with {user_b.name}",
            "match_type": "unexpected_connection",
            "summary": f"Unable to fully evaluate: {e}",
            "common_interests": [],
        }

    # Add metadata
    match_card["opponent_id"] = user_b.id
    match_card["opponent_name"] = user_b.name
    match_card["opponent_avatar"] = user_b.avatar_url
    match_card["conversation_id"] = convo_id

    return match_card


def _parse_json(text: str) -> dict:
    """Extract JSON from LLM response, handling markdown code blocks."""
    text = text.strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Try extracting from ```json ... ``` or ``` ... ```
    match = re.search(r"```(?:json)?\s*\n?(.*?)\n?\s*```", text, re.DOTALL)
    if match:
        return json.loads(match.group(1).strip())

    # Try finding first { ... } block
    start = text.find("{")
    end = text.rfind("}") + 1
    if start >= 0 and end > start:
        return json.loads(text[start:end])

    raise ValueError(f"Could not parse JSON from: {text[:200]}")
