import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlmodel import SQLModel, Field


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    google_id: str = Field(unique=True, index=True)
    email: str
    name: str
    avatar_url: Optional[str] = None
    persona: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Room(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    status: str = Field(default="waiting")  # waiting, active, completed
    vibe_score: Optional[float] = None
    vibe_summary: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = None


class RoomParticipant(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    room_id: str = Field(foreign_key="room.id", index=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    is_human_active: bool = Field(default=False)
    joined_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
