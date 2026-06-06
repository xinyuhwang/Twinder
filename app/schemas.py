from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class UserRead(BaseModel):
    id: int
    name: str
    email: str
    avatar_url: Optional[str] = None
    persona: Optional[str] = None


class UserUpdate(BaseModel):
    name: Optional[str] = None
    persona: Optional[str] = None


class RoomRead(BaseModel):
    id: str
    status: str
    vibe_score: Optional[float] = None
    vibe_summary: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    participants: list[UserRead] = []


class MessageRead(BaseModel):
    id: str
    sender_user_id: str
    sender_name: str
    role: str  # agent or human
    content: str
    timestamp: str


class MatchmakeResponse(BaseModel):
    status: str  # queued, matched
    room_id: Optional[str] = None
    position: Optional[int] = None
