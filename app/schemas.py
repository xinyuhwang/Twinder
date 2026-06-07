from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class UserRead(BaseModel):
    id: int
    name: str
    email: str
    avatar_url: Optional[str] = None
    age: Optional[int] = None
    persona: Optional[str] = None
    dat_score: Optional[float] = None


class UserUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    persona: Optional[str] = None


class RoomRead(BaseModel):
    id: str
    status: str
    vibe_score: Optional[float] = None
    vibe_summary: Optional[str] = None
    match_card: Optional[dict] = None
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
    tip: Optional[str] = None
    fun_facts: list[str] = []
    strongest_overlap: Optional[str] = None
    non_obvious_overlap: Optional[str] = None
    complementary_dynamic: Optional[str] = None
    suggested_opener: Optional[str] = None
    follow_up_questions: list[str] = []
    conversation_highlights: list[ConversationHighlight] = []
    common_interests: list[str] = []
    openness_compatibility: Optional[float] = None
    openness_scores: Optional[dict] = None
    opponent_id: int
    opponent_name: str
    opponent_avatar: Optional[str] = None
    conversation_id: Optional[str] = None


class ArenaStatusResponse(BaseModel):
    status: str  # running, completed
    count: int = 0


class PreflightRequest(BaseModel):
    raw_context: str


class PreflightResponse(BaseModel):
    questions: list[str]
    profile_yaml: str


class IntakeRequest(BaseModel):
    raw_context: str
    answers: dict | None = None
    mode: str = "networking"
    profile_yaml: str | None = None


class DatRequest(BaseModel):
    words: list[str]


class DatResult(BaseModel):
    score: Optional[float] = None
    scored_words: list[str] = []
    valid_words: list[str] = []
    invalid_words: list[str] = []
    enough_words: bool = False


class TwinPreview(BaseModel):
    public_safe_summary: Optional[str] = None
    agent_vibe: Optional[str] = None
    looking_for: list[str] = []
    interests: list[str] = []
    can_help_with: list[str] = []
    conversation_bait: list[str] = []
    agent_voice: Optional[str] = None
    completeness_score: Optional[int] = None
    twin_prompt: Optional[str] = None


class TwinPromptResponse(BaseModel):
    mode: str
    twin_prompt: str


class FeedbackIn(BaseModel):
    verdict: str            # save | pass | meet
    rating: Optional[int] = None
    note: Optional[str] = None


class ArenaResponse(BaseModel):
    status: str  # running, completed
    arena_id: Optional[str] = None
    match_cards: list[MatchCard] = []
