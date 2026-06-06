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


class ConversationHighlight(BaseModel):
    speaker: str
    text: str


class MatchCard(BaseModel):
    score: float
    headline: str = ""
    match_type: str = ""
    summary: str = ""
    strongest_overlap: Optional[str] = None
    non_obvious_overlap: Optional[str] = None
    complementary_dynamic: Optional[str] = None
    suggested_opener: Optional[str] = None
    follow_up_questions: list[str] = []
    conversation_highlights: list[ConversationHighlight] = []
    common_interests: list[str] = []
    opponent_id: int
    opponent_name: str
    opponent_avatar: Optional[str] = None
    conversation_id: Optional[str] = None


class IntakeRequest(BaseModel):
    raw_context: str
    answers: dict | None = None


class TwinPreview(BaseModel):
    public_safe_summary: Optional[str] = None
    looking_for: list[str] = []
    interests: list[str] = []


class ArenaResponse(BaseModel):
    status: str  # running, completed
    arena_id: Optional[str] = None
    match_cards: list[MatchCard] = []
