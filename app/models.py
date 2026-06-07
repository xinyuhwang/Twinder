import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlmodel import SQLModel, Field


class Event(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    code: str = Field(unique=True, index=True)
    name: str
    mode: str = Field(default="hackathon")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class EventParticipant(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    event_id: int = Field(foreign_key="event.id", index=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    joined_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    google_id: str = Field(unique=True, index=True)
    email: str
    name: str
    avatar_url: Optional[str] = None
    persona: Optional[str] = None
    dat_score: Optional[float] = None         # Divergent Association Task score (0-100)
    dat_words: Optional[str] = None           # JSON list of the scored words
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Room(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    status: str = Field(default="waiting")  # waiting, active, completed
    vibe_score: Optional[float] = None
    vibe_summary: Optional[str] = None
    match_card: Optional[str] = None          # JSON, PRD-shaped match card (Phase 3)
    match_card_call_id: Optional[str] = None  # Weave call id for feedback attachment (Phase 4)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = None


class ProfileVersion(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    version: int = Field(default=1)
    profile_yaml: Optional[str] = None
    matching_vector: Optional[str] = None
    system_instruction: Optional[str] = None
    is_active: bool = Field(default=True, index=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class MatchFeedback(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    room_id: str = Field(foreign_key="room.id", index=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    verdict: str                                # "save" | "pass" | "meet"
    rating: Optional[int] = None               # optional 1-5
    note: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class RoomParticipant(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    room_id: str = Field(foreign_key="room.id", index=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    is_human_active: bool = Field(default=False)
    joined_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
