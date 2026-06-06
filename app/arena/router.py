import asyncio
import json

from fastapi import APIRouter, Depends, HTTPException, Query

from app.deps import get_current_user
from app.models import User
from app.redis_client import get_redis
from app.schemas import ArenaResponse, MatchCard, MessageRead

router = APIRouter(prefix="/arena", tags=["arena"])


@router.post("/start", response_model=ArenaResponse)
async def start_arena(
    mode: str = Query(default="networking", description="Event mode: networking, hackathon, dating, custom"),
    user: User = Depends(get_current_user),
):
    """Start an arena session: user's agent meets all other agents in short conversations."""
    from app.agents.arena import run_arena

    # Run arena (this may take 30-60s with multiple LLM calls)
    match_cards = await run_arena(user.id, mode=mode)

    r = get_redis()
    arena_data = await r.get(f"arena:{user.id}:latest")
    arena_id = None
    if arena_data:
        arena_id = json.loads(arena_data).get("arena_id")

    return ArenaResponse(
        status="completed",
        arena_id=arena_id,
        match_cards=[MatchCard(**mc) for mc in match_cards],
    )


@router.get("/results", response_model=ArenaResponse)
async def get_arena_results(user: User = Depends(get_current_user)):
    """Get the latest arena results for the current user."""
    r = get_redis()
    arena_data = await r.get(f"arena:{user.id}:latest")
    if not arena_data:
        raise HTTPException(status_code=404, detail="No arena results found. Start an arena first.")

    data = json.loads(arena_data)
    return ArenaResponse(
        status="completed",
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
