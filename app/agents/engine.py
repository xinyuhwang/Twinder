import asyncio
import json
from datetime import datetime, timezone

from app.agents.profile import get_active_profile
from app.agents.prompts import MODE_GUIDELINES, TWIN_OPENER, TWIN_SYSTEM_PROMPT
from app.database import get_session
from app.llm import chat
from app.models import Room, RoomParticipant, User
from app.observability import op
from app.redis_client import get_redis


@op(name="generate_agent_turn")
async def _generate_turn(
    system_prompt: str,
    conversation: list[dict],
    room_id: str,
    sender_user_id: int,
) -> str:
    try:
        return await chat(messages=conversation, system=system_prompt)
    except Exception as e:
        return f"[Agent error: {e}]"


async def run_conversation(room_id: str):
    """Run the agent-to-agent conversation loop for a room."""
    r = get_redis()

    # Load participants from DB
    session = next(get_session())
    participants = list(session.exec(
        __import__("sqlmodel").select(RoomParticipant).where(RoomParticipant.room_id == room_id)
    ))

    if len(participants) < 2:
        return

    users = []
    for p in participants:
        user = session.get(User, p.user_id)
        if user:
            users.append(user)

    if len(users) < 2:
        return

    # Build system prompts for each agent
    system_prompts = {}
    for user in users:
        pv = get_active_profile(session, user.id)
        if pv and pv.system_instruction:
            system_prompts[user.id] = pv.system_instruction
        else:
            persona = user.persona or f"{user.name} — no detailed profile provided yet."
            system_prompts[user.id] = TWIN_SYSTEM_PROMPT.format(
                name=user.name, persona=persona,
                mode_guidelines=MODE_GUIDELINES.get("networking", MODE_GUIDELINES["networking"]),
            )

    turn_order = [users[0], users[1]]
    is_first_message = True

    while True:
        # Check room state
        state = await r.hgetall(f"room:{room_id}:state")
        if state.get("status") == "completed":
            break

        msg_count = int(state.get("message_count", "0"))
        max_messages = int(state.get("max_messages", "20"))
        if msg_count >= max_messages:
            # Auto-complete the room
            await _complete_room(room_id, session)
            break

        current_user = turn_order[msg_count % 2]

        # Check for human override
        if state.get(f"human_override:{current_user.id}") == "true":
            # Human is active — wait for human messages, then respond as the other agent
            await asyncio.sleep(2)
            continue

        # Build messages for this agent's perspective
        conversation = await _build_messages(room_id, current_user.id, users, is_first_message)

        content = await _generate_turn(
            system_prompts[current_user.id],
            conversation,
            room_id,
            current_user.id,
        )

        # Write to Redis Stream
        now = datetime.now(timezone.utc).isoformat()
        await r.xadd(f"room:{room_id}:messages", {
            "sender_user_id": str(current_user.id),
            "sender_name": current_user.name,
            "role": "agent",
            "content": content,
            "timestamp": now,
        })

        # Update room state
        await r.hincrby(f"room:{room_id}:state", "message_count", 1)
        next_user = turn_order[(msg_count + 1) % 2]
        await r.hset(f"room:{room_id}:state", "turn_user_id", str(next_user.id))

        # Publish to Pub/Sub for WebSocket
        await r.publish(f"room:{room_id}:events", json.dumps({
            "type": "message",
            "data": {
                "sender_user_id": current_user.id,
                "sender_name": current_user.name,
                "role": "agent",
                "content": content,
                "timestamp": now,
            },
        }))

        is_first_message = False

        # Pace the conversation
        await asyncio.sleep(3)

    session.close()


@op(name="respond_as_agent")
async def respond_as_agent(room_id: str, agent_user_id: int):
    """Generate a single agent response (used when human sends a message and the other side is still an agent)."""
    r = get_redis()
    session = next(get_session())

    user = session.get(User, agent_user_id)
    if not user:
        session.close()
        return

    # Get all participants for perspective mapping
    participants = list(session.exec(
        __import__("sqlmodel").select(RoomParticipant).where(RoomParticipant.room_id == room_id)
    ))
    users = [session.get(User, p.user_id) for p in participants if session.get(User, p.user_id)]

    pv = get_active_profile(session, user.id)
    if pv and pv.system_instruction:
        system = pv.system_instruction
    else:
        persona = user.persona or f"{user.name} — no detailed profile provided yet."
        system = TWIN_SYSTEM_PROMPT.format(
            name=user.name, persona=persona,
            mode_guidelines=MODE_GUIDELINES.get("networking", MODE_GUIDELINES["networking"]),
        )

    conversation = await _build_messages(room_id, agent_user_id, users, False)

    content = await _generate_turn(system, conversation, room_id, agent_user_id)

    now = datetime.now(timezone.utc).isoformat()
    await r.xadd(f"room:{room_id}:messages", {
        "sender_user_id": str(agent_user_id),
        "sender_name": user.name,
        "role": "agent",
        "content": content,
        "timestamp": now,
    })

    await r.hincrby(f"room:{room_id}:state", "message_count", 1)

    await r.publish(f"room:{room_id}:events", json.dumps({
        "type": "message",
        "data": {
            "sender_user_id": agent_user_id,
            "sender_name": user.name,
            "role": "agent",
            "content": content,
            "timestamp": now,
        },
    }))

    session.close()


async def _build_messages(
    room_id: str, current_user_id: int, users: list[User], is_first: bool
) -> list[dict]:
    """Build Claude messages array from conversation history, mapped to current agent's perspective."""
    if is_first:
        return [{"role": "user", "content": TWIN_OPENER.format(mode="networking")}]

    r = get_redis()
    raw = await r.xrange(f"room:{room_id}:messages")

    messages = []
    for _, fields in raw:
        sender_id = int(fields["sender_user_id"])
        if sender_id == current_user_id:
            role = "assistant"
        else:
            role = "user"
        messages.append({"role": role, "content": fields["content"]})

    if not messages:
        return [{"role": "user", "content": TWIN_OPENER.format(mode="networking")}]

    # Claude requires messages to start with "user" role
    if messages[0]["role"] == "assistant":
        messages.insert(0, {"role": "user", "content": TWIN_OPENER.format(mode="networking")})

    return messages


async def _complete_room(room_id: str, session):
    """Mark room as completed."""
    room = session.get(Room, room_id)
    if room:
        room.status = "completed"
        room.completed_at = datetime.now(timezone.utc)
        session.add(room)
        session.commit()

    r = get_redis()
    await r.hset(f"room:{room_id}:state", "status", "completed")
    await r.srem("rooms:active", room_id)

    await r.publish(f"room:{room_id}:events", json.dumps({
        "type": "room_completed",
        "data": {"room_id": room_id},
    }))

    # Trigger vibe scoring
    from app.agents.scorer import score_conversation

    asyncio.create_task(score_conversation(room_id))
