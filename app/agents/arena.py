import asyncio
import json
import re
import uuid

from sqlmodel import select

from app.agents.dat import openness_compatibility
from app.agents.prompts import MATCH_CARD_SCORING_PROMPT, TWIN_OPENER
from app.agents.twin_prompt import build_twin_system_prompt, persona_with_openness
from app.database import get_session
from app.llm import chat
from app.models import EventParticipant, User
from app.redis_client import get_redis

ARENA_TURNS = 8  # 4 exchanges each

_LENGTH_REMINDER = "\n\n[reminder: reply in 1-2 sentences max. short texts only, no lists.]"


def _trim_to_sentences(text: str, max_sentences: int = 2) -> str:
    """Hard-cap a response to max_sentences. Splits on '.', '!', '?' boundaries."""
    import re
    text = text.strip()
    sentences = re.split(r'(?<=[.!?])\s+', text)
    trimmed = " ".join(sentences[:max_sentences])
    return trimmed


def _fallback_match_card(user_a: User, user_b: User, reason: str = "") -> dict:
    """Minimal card so every opponent appears in the stack even if scoring fails."""
    summary = f"Your twin met {user_b.name}, but we couldn't fully score the conversation."
    if reason:
        summary = f"{summary} ({reason})"
    return {
        "score": 40,
        "headline": f"Met {user_b.name}",
        "match_type": "unexpected_connection",
        "summary": summary,
        "common_interests": [],
        "opponent_id": user_b.id,
        "opponent_name": user_b.name,
        "opponent_avatar": user_b.avatar_url,
        "conversation_id": None,
    }


def _flip_card_perspective(card: dict, user_a: User, user_b: User) -> dict:
    """Flip a cached match card from the other user's perspective."""
    flipped = dict(card)
    flipped["opponent_id"] = user_b.id
    flipped["opponent_name"] = user_b.name
    flipped["opponent_avatar"] = user_b.avatar_url
    if flipped.get("openness_scores"):
        scores = flipped["openness_scores"]
        if user_a.name in scores and user_b.name in scores:
            flipped["openness_scores"] = {
                user_a.name: scores.get(user_b.name),
                user_b.name: scores.get(user_a.name),
            }
    return flipped


async def run_arena(user_id: int, mode: str = "networking") -> list[dict]:
    """Run one user's agent against all other users. Returns ranked match cards."""
    session = next(get_session())
    user = session.get(User, user_id)
    if not user:
        session.close()
        return []

    # Scope opponents to users in the same event (most recently joined event wins).
    # Falls back to all users if the requesting user has no event enrollment.
    participant_row = session.exec(
        select(EventParticipant)
        .where(EventParticipant.user_id == user_id)
        .order_by(EventParticipant.joined_at.desc())
    ).first()

    if participant_row:
        peer_ids = session.exec(
            select(EventParticipant.user_id).where(
                EventParticipant.event_id == participant_row.event_id,
                EventParticipant.user_id != user_id,
            )
        ).all()
        opponents = session.exec(select(User).where(User.id.in_(peer_ids))).all()
    else:
        opponents = session.exec(select(User).where(User.id != user_id)).all()

    if not opponents:
        session.close()
        return []

    r = get_redis()
    result_key = f"arena:{user_id}:latest"
    status_key = f"arena:{user_id}:status"

    raw = await r.get(result_key)
    arena_id = json.loads(raw).get("arena_id") if raw else str(uuid.uuid4())
    await r.set(status_key, "running", ex=3600)

    async def run_one(opponent: User) -> None:
        try:
            card = await _arena_conversation(user, opponent, mode, session)
        except Exception as e:
            card = _fallback_match_card(user, opponent, str(e))
        if not isinstance(card, dict):
            card = _fallback_match_card(user, opponent, "invalid response")
        if "score" not in card:
            card = {**card, "score": 40}
        current_raw = await r.get(result_key)
        current = json.loads(current_raw) if current_raw else {"arena_id": arena_id, "match_cards": []}
        cards = current.get("match_cards", [])
        cards.append(card)
        cards.sort(key=lambda x: x.get("score", 0), reverse=True)
        await r.set(
            result_key,
            json.dumps({"arena_id": current.get("arena_id", arena_id), "match_cards": cards}),
            ex=3600,
        )

    await asyncio.gather(*[run_one(opp) for opp in opponents], return_exceptions=True)

    final_raw = await r.get(result_key)
    match_cards = json.loads(final_raw).get("match_cards", []) if final_raw else []
    await r.set(f"arena:{arena_id}:results", json.dumps(match_cards), ex=3600)
    await r.set(status_key, "completed", ex=3600)

    session.close()
    return match_cards


async def _arena_conversation(user_a: User, user_b: User, mode: str, session) -> dict:
    """Run a short conversation between two agents and score it."""
    r = get_redis()
    pair_key = f"arena-pair:{min(user_a.id, user_b.id)}:{max(user_a.id, user_b.id)}"
    cached_raw = await r.get(pair_key)
    if cached_raw:
        card = json.loads(cached_raw)
        if card.get("opponent_id") != user_b.id:
            card = _flip_card_perspective(card, user_a, user_b)
        return card

    persona_a = persona_with_openness(user_a, session)
    persona_b = persona_with_openness(user_b, session)
    system_a = build_twin_system_prompt(user_a, mode, session)
    system_b = build_twin_system_prompt(user_b, mode, session)

    convo_id = f"arena-convo:{uuid.uuid4()}"

    messages_a: list[dict] = []
    messages_b: list[dict] = []

    def _with_reminder(msgs: list[dict]) -> list[dict]:
        """Append a length reminder to the last user message to counteract drift."""
        if not msgs:
            return msgs
        out = list(msgs)
        last = out[-1]
        if last["role"] == "user":
            out[-1] = {**last, "content": last["content"] + _LENGTH_REMINDER}
        return out

    for turn in range(ARENA_TURNS):
        if turn % 2 == 0:
            if turn == 0:
                prompt_msgs = [{"role": "user", "content": TWIN_OPENER.format(mode=mode) + _LENGTH_REMINDER}]
            else:
                prompt_msgs = _with_reminder(messages_a)
            content = _trim_to_sentences(await chat(messages=prompt_msgs, system=system_a))

            messages_a.append({"role": "assistant", "content": content})
            messages_b.append({"role": "user", "content": content})

            await r.xadd(convo_id, {
                "sender_name": user_a.name,
                "sender_user_id": str(user_a.id),
                "content": content,
                "turn": str(turn),
            })
        else:
            prompt_msgs = _with_reminder(messages_b)
            content = _trim_to_sentences(await chat(messages=prompt_msgs, system=system_b))

            messages_b.append({"role": "assistant", "content": content})
            messages_a.append({"role": "user", "content": content})

            await r.xadd(convo_id, {
                "sender_name": user_b.name,
                "sender_user_id": str(user_b.id),
                "content": content,
                "turn": str(turn),
            })

    await r.expire(convo_id, 3600)

    raw = await r.xrange(convo_id)
    lines = [f"{f['sender_name']}: {f['content']}" for _, f in raw]
    conversation_text = "\n".join(lines)

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

    # Blend in openness compatibility (similarity of divergent-thinking scores).
    compat = openness_compatibility(user_a.dat_score, user_b.dat_score)
    if compat is not None:
        base_score = float(match_card.get("score", 50))
        blended = round(0.8 * base_score + 0.2 * compat)
        match_card["score"] = max(0, min(100, blended))
        match_card["openness_compatibility"] = compat
        match_card["openness_scores"] = {
            user_a.name: user_a.dat_score,
            user_b.name: user_b.dat_score,
        }

    match_card["opponent_id"] = user_b.id
    match_card["opponent_name"] = user_b.name
    match_card["opponent_avatar"] = user_b.avatar_url
    match_card["conversation_id"] = convo_id

    await r.set(pair_key, json.dumps(match_card), ex=86400)

    return match_card


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
