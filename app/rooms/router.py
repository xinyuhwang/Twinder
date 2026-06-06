import asyncio
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.database import get_session
from app.deps import get_current_user
from app.models import Room, RoomParticipant, User
from app.redis_client import get_redis
from app.rooms.matchmaker import check_match_status, create_room_in_db, enqueue_user
from app.schemas import MatchmakeResponse, MessageRead, RoomRead, UserRead

router = APIRouter(prefix="/rooms", tags=["rooms"])


@router.post("/matchmake", response_model=MatchmakeResponse)
async def matchmake(
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    result = await enqueue_user(user.id)

    if result["status"] == "matched":
        room_id = result["room_id"]
        # Check if room already exists in DB (partner may have created it)
        existing = session.get(Room, room_id)
        if not existing:
            partner_id = result.get("partner_user_id")
            if partner_id:
                user_ids = [user.id, partner_id]
            else:
                user_ids = [user.id]
            room = create_room_in_db(session, room_id, user_ids)

            # Initialize room state in Redis
            r = get_redis()
            await r.hset(f"room:{room_id}:state", mapping={
                "status": "active",
                "turn_user_id": str(user_ids[0]),
                "message_count": "0",
                "max_messages": "20",
            })
            await r.sadd("rooms:active", room_id)

            # Launch agent conversation engine
            from app.agents.engine import run_conversation

            asyncio.create_task(run_conversation(room_id))

    return MatchmakeResponse(**result)


@router.get("/matchmake/status", response_model=MatchmakeResponse)
async def matchmake_status(user: User = Depends(get_current_user)):
    result = await check_match_status(user.id)
    return MatchmakeResponse(**result)


@router.get("", response_model=list[RoomRead])
async def list_rooms(
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    participant_rooms = session.exec(
        select(RoomParticipant).where(RoomParticipant.user_id == user.id)
    ).all()
    rooms = []
    for rp in participant_rooms:
        room = session.get(Room, rp.room_id)
        if room:
            participants = session.exec(
                select(RoomParticipant).where(RoomParticipant.room_id == room.id)
            ).all()
            users = [session.get(User, p.user_id) for p in participants]
            rooms.append(RoomRead(
                **room.model_dump(),
                participants=[UserRead.model_validate(u) for u in users if u],
            ))
    return rooms


@router.get("/{room_id}", response_model=RoomRead)
async def get_room(
    room_id: str,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    room = session.get(Room, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    participants = session.exec(
        select(RoomParticipant).where(RoomParticipant.room_id == room_id)
    ).all()
    users = [session.get(User, p.user_id) for p in participants]
    return RoomRead(
        **room.model_dump(),
        participants=[UserRead.model_validate(u) for u in users if u],
    )


@router.get("/{room_id}/messages", response_model=list[MessageRead])
async def get_messages(room_id: str, user: User = Depends(get_current_user)):
    r = get_redis()
    raw = await r.xrange(f"room:{room_id}:messages")
    messages = []
    for msg_id, fields in raw:
        messages.append(MessageRead(
            id=msg_id,
            sender_user_id=fields["sender_user_id"],
            sender_name=fields["sender_name"],
            role=fields["role"],
            content=fields["content"],
            timestamp=fields["timestamp"],
        ))
    return messages


@router.post("/{room_id}/takeover")
async def takeover(
    room_id: str,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    # Verify user is a participant
    participant = session.exec(
        select(RoomParticipant).where(
            RoomParticipant.room_id == room_id,
            RoomParticipant.user_id == user.id,
        )
    ).first()
    if not participant:
        raise HTTPException(status_code=403, detail="Not a participant")

    participant.is_human_active = True
    session.add(participant)
    session.commit()

    r = get_redis()
    await r.hset(f"room:{room_id}:state", f"human_override:{user.id}", "true")

    # Publish takeover event
    import json

    await r.publish(f"room:{room_id}:events", json.dumps({
        "type": "human_takeover",
        "data": {"user_id": user.id, "user_name": user.name},
    }))

    return {"ok": True}


@router.post("/{room_id}/complete")
async def complete_room(
    room_id: str,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    room = session.get(Room, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    room.status = "completed"
    room.completed_at = datetime.now(timezone.utc)
    session.add(room)
    session.commit()

    r = get_redis()
    await r.hset(f"room:{room_id}:state", "status", "completed")
    await r.srem("rooms:active", room_id)

    # Trigger vibe scoring in background
    from app.agents.scorer import score_conversation

    asyncio.create_task(score_conversation(room_id))

    return {"ok": True}
