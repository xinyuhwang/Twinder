import json
import uuid

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query

from app.deps import get_current_user
from app.models import User
from app.redis_client import get_redis
from app.schemas import ArenaResponse, ArenaStatusResponse, MatchCard, MessageRead

router = APIRouter(prefix="/arena", tags=["arena"])


@router.post("/start", response_model=ArenaResponse)
async def start_arena(
    background_tasks: BackgroundTasks,
    mode: str = Query(default="networking", description="Event mode: networking, hackathon, dating, custom"),
    user: User = Depends(get_current_user),
):
    """Start an arena session in the background; poll /results for incremental cards."""
    from app.agents.arena import run_arena

    r = get_redis()
    arena_id = str(uuid.uuid4())
    await r.set(
        f"arena:{user.id}:latest",
        json.dumps({"arena_id": arena_id, "match_cards": []}),
        ex=3600,
    )
    await r.set(f"arena:{user.id}:status", "running", ex=3600)
    background_tasks.add_task(run_arena, user.id, mode)
    return ArenaResponse(status="running", arena_id=arena_id, match_cards=[])


@router.get("/status", response_model=ArenaStatusResponse)
async def get_arena_status(user: User = Depends(get_current_user)):
    """Check whether the arena run is still in progress."""
    r = get_redis()
    status = await r.get(f"arena:{user.id}:status")
    arena_data = await r.get(f"arena:{user.id}:latest")
    count = 0
    if arena_data:
        count = len(json.loads(arena_data).get("match_cards", []))
    if not status and arena_data:
        status = "completed"
    return ArenaStatusResponse(status=status or "completed", count=count)


@router.get("/results", response_model=ArenaResponse)
async def get_arena_results(user: User = Depends(get_current_user)):
    """Get the latest arena results for the current user."""
    r = get_redis()
    arena_data = await r.get(f"arena:{user.id}:latest")
    if not arena_data:
        raise HTTPException(status_code=404, detail="No arena results found. Start an arena first.")

    status = await r.get(f"arena:{user.id}:status") or "completed"
    data = json.loads(arena_data)
    return ArenaResponse(
        status=status,
        arena_id=data.get("arena_id"),
        match_cards=[MatchCard(**mc) for mc in data.get("match_cards", [])],
    )


@router.get("/conversation/{conversation_id}", response_model=list[MessageRead])
async def get_arena_conversation(
    conversation_id: str,
    user: User = Depends(get_current_user),
):
    """Get the full conversation from an arena match (eavesdrop view)."""
    r = get_redis()
    raw = await r.xrange(conversation_id)
    if not raw:
        raise HTTPException(status_code=404, detail="Conversation not found or expired")

    messages = []
    for msg_id, fields in raw:
        messages.append(MessageRead(
            id=msg_id,
            sender_user_id=fields.get("sender_user_id", ""),
            sender_name=fields.get("sender_name", ""),
            role="agent",
            content=fields.get("content", ""),
            timestamp=fields.get("turn", ""),
        ))
    return messages
