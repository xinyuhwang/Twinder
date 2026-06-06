import uuid

from sqlmodel import Session

from app.models import Room, RoomParticipant
from app.redis_client import get_redis


async def enqueue_user(user_id: int) -> dict:
    """Add user to matchmaking queue. Returns matched room or queue position."""
    r = get_redis()
    user_id_str = str(user_id)

    # Check if already in queue
    queue = await r.lrange("matchmaking:queue", 0, -1)
    if user_id_str in queue:
        position = queue.index(user_id_str)
        return {"status": "queued", "position": position}

    # Check if already waiting for match result
    room_id = await r.get(f"matchmaking:result:{user_id_str}")
    if room_id:
        return {"status": "matched", "room_id": room_id}

    # Try to pop a partner from the queue
    partner_id_str = await r.rpop("matchmaking:queue")

    if partner_id_str and partner_id_str != user_id_str:
        # Match found — create room
        room_id = str(uuid.uuid4())

        # Store match result for both users so they can poll for it
        await r.set(f"matchmaking:result:{user_id_str}", room_id, ex=300)
        await r.set(f"matchmaking:result:{partner_id_str}", room_id, ex=300)

        return {
            "status": "matched",
            "room_id": room_id,
            "partner_user_id": int(partner_id_str),
        }

    # No partner available — push to queue
    await r.lpush("matchmaking:queue", user_id_str)
    return {"status": "queued", "position": 0}


async def check_match_status(user_id: int) -> dict:
    """Check if user has been matched."""
    r = get_redis()
    user_id_str = str(user_id)

    room_id = await r.get(f"matchmaking:result:{user_id_str}")
    if room_id:
        return {"status": "matched", "room_id": room_id}

    # Check queue position
    queue = await r.lrange("matchmaking:queue", 0, -1)
    if user_id_str in queue:
        position = queue.index(user_id_str)
        return {"status": "queued", "position": position}

    return {"status": "not_queued"}


def create_room_in_db(session: Session, room_id: str, user_ids: list[int]) -> Room:
    """Create room and participant records in SQLite."""
    room = Room(id=room_id, status="active")
    session.add(room)
    for uid in user_ids:
        session.add(RoomParticipant(room_id=room_id, user_id=uid))
    session.commit()
    session.refresh(room)
    return room
