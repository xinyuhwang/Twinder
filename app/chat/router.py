import asyncio
import json
from datetime import datetime, timezone

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from jose import JWTError, jwt

from app.chat.manager import manager
from app.config import settings
from app.database import get_session
from app.models import User
from app.redis_client import get_redis

router = APIRouter(tags=["chat"])


@router.websocket("/ws/rooms/{room_id}")
async def room_websocket(websocket: WebSocket, room_id: str):
    # Auth via query param
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=4001, reason="Missing token")
        return

    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
        user_id = payload.get("sub")
    except JWTError:
        await websocket.close(code=4001, reason="Invalid token")
        return

    session = next(get_session())
    user = session.get(User, user_id)
    if not user:
        await websocket.close(code=4001, reason="User not found")
        session.close()
        return
    session.close()

    await manager.connect(room_id, websocket)

    r = get_redis()
    pubsub = r.pubsub()
    await pubsub.subscribe(f"room:{room_id}:events")

    async def listen_redis():
        """Forward Redis Pub/Sub events to WebSocket."""
        try:
            async for message in pubsub.listen():
                if message["type"] == "message":
                    data = json.loads(message["data"])
                    await manager.broadcast(room_id, data)
        except asyncio.CancelledError:
            pass

    redis_task = asyncio.create_task(listen_redis())

    try:
        while True:
            data = await websocket.receive_json()
            msg_type = data.get("type")

            if msg_type == "message":
                content = data.get("content", "").strip()
                if not content:
                    continue

                now = datetime.now(timezone.utc).isoformat()

                # Write human message to Redis Stream
                await r.xadd(f"room:{room_id}:messages", {
                    "sender_user_id": str(user_id),
                    "sender_name": user.name,
                    "role": "human",
                    "content": content,
                    "timestamp": now,
                })
                await r.hincrby(f"room:{room_id}:state", "message_count", 1)

                # Publish for other WebSocket clients
                await r.publish(f"room:{room_id}:events", json.dumps({
                    "type": "message",
                    "data": {
                        "sender_user_id": user_id,
                        "sender_name": user.name,
                        "role": "human",
                        "content": content,
                        "timestamp": now,
                    },
                }))

                # Trigger agent response from the other participant if they're still agent-controlled
                state = await r.hgetall(f"room:{room_id}:state")
                session = next(get_session())
                from sqlmodel import select
                from app.models import RoomParticipant
                other_participants = session.exec(
                    select(RoomParticipant).where(
                        RoomParticipant.room_id == room_id,
                        RoomParticipant.user_id != user_id,
                    )
                ).all()
                session.close()

                for other in other_participants:
                    if state.get(f"human_override:{other.user_id}") != "true":
                        from app.agents.engine import respond_as_agent
                        asyncio.create_task(respond_as_agent(room_id, other.user_id))

            elif msg_type == "ping":
                await websocket.send_json({"type": "pong"})

    except WebSocketDisconnect:
        pass
    finally:
        redis_task.cancel()
        await pubsub.unsubscribe(f"room:{room_id}:events")
        await pubsub.close()
        manager.disconnect(room_id, websocket)
