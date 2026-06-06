import json
import re

from app.agents.prompts import VIBE_SCORING_PROMPT
from app.database import get_session
from app.llm import chat
from app.models import Room
from app.redis_client import get_redis


async def score_conversation(room_id: str):
    """Score a completed conversation using Claude."""
    r = get_redis()

    # Read full conversation from Redis Stream
    raw = await r.xrange(f"room:{room_id}:messages")
    if not raw:
        return

    # Format conversation for scoring
    lines = []
    for _, fields in raw:
        role_label = f"[{fields['role']}]" if fields["role"] == "human" else ""
        lines.append(f"{fields['sender_name']}{role_label}: {fields['content']}")
    conversation_text = "\n".join(lines)

    try:
        raw = await chat(
            messages=[{
                "role": "user",
                "content": VIBE_SCORING_PROMPT.format(conversation=conversation_text),
            }],
            max_tokens=500,
        )
        result = _parse_json(raw)
    except Exception:
        result = {"score": 50, "summary": "Unable to score conversation.", "common_interests": []}

    # Update Room in SQLite
    session = next(get_session())
    room = session.get(Room, room_id)
    if room:
        room.vibe_score = result.get("score", 50)
        room.vibe_summary = result.get("summary", "")
        session.add(room)
        session.commit()
    session.close()

    # Publish vibe score event
    await r.publish(f"room:{room_id}:events", json.dumps({
        "type": "vibe_score",
        "data": result,
    }))


def _parse_json(text: str) -> dict:
    """Extract JSON from LLM response, handling markdown code blocks."""
    text = text.strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    match = re.search(r"```(?:json)?\s*\n?(.*?)\n?\s*```", text, re.DOTALL)
    if match:
        return json.loads(match.group(1).strip())

    start = text.find("{")
    end = text.rfind("}") + 1
    if start >= 0 and end > start:
        return json.loads(text[start:end])

    raise ValueError(f"Could not parse JSON from: {text[:200]}")
