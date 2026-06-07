import json
import re

from sqlmodel import select

from app.agents.match_card import format_match_card
from app.agents.prompts import VIBE_SCORING_PROMPT
from app.database import get_session
from app.llm import chat
from app.models import Room, RoomParticipant, User
from app.observability import op
from app.redis_client import get_redis


@op(name="score_conversation")
async def score_conversation(room_id: str):
    """Score a completed conversation, then format and store a rich match card."""
    r = get_redis()

    raw = await r.xrange(f"room:{room_id}:messages")
    if not raw:
        return

    lines = []
    for _, fields in raw:
        role_label = f"[{fields['role']}]" if fields["role"] == "human" else ""
        lines.append(f"{fields['sender_name']}{role_label}: {fields['content']}")
    conversation_text = "\n".join(lines)

    try:
        raw_score = await chat(
            messages=[{
                "role": "user",
                "content": VIBE_SCORING_PROMPT.format(conversation=conversation_text),
            }],
            max_tokens=500,
        )
        result = _parse_json(raw_score)
    except Exception:
        result = {"score": 50, "summary": "Unable to score conversation.", "common_interests": []}

    # Load participants for match card
    session = next(get_session())
    room = session.get(Room, room_id)
    participants = session.exec(
        select(RoomParticipant).where(RoomParticipant.room_id == room_id)
    ).all()
    users = [session.get(User, p.user_id) for p in participants]
    profiles = [
        {"name": u.name, "persona": u.persona}
        for u in users if u
    ]

    # Format rich match card — use .call() to capture Weave call id
    card, call = await format_match_card.call(conversation_text, result, profiles)
    match_card_call_id = getattr(call, "id", None)

    if room:
        room.vibe_score = result.get("score", 50)
        room.vibe_summary = result.get("summary", "")
        room.match_card = json.dumps(card)
        room.match_card_call_id = str(match_card_call_id) if match_card_call_id else None
        session.add(room)
        session.commit()
    session.close()

    await r.publish(f"room:{room_id}:events", json.dumps({
        "type": "vibe_score",
        "data": result,
    }))
    await r.publish(f"room:{room_id}:events", json.dumps({
        "type": "match_card",
        "data": card,
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
