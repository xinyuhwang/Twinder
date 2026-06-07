export type EventMode = 'hackathon' | 'networking' | 'dating' | 'custom';

export interface ConversationHighlight {
  speaker: string;
  text: string;
}

export interface MatchCard {
  score: number;
  headline: string;
  match_type: string;
  summary: string;
  strongest_overlap: string | null;
  non_obvious_overlap: string | null;
  complementary_dynamic: string | null;
  suggested_opener: string | null;
  follow_up_questions: string[];
  conversation_highlights: ConversationHighlight[];
  common_interests: string[];
  opponent_id: number;
  opponent_name: string;
  opponent_avatar: string | null;
  conversation_id: string | null;
}

export interface ArenaResponse {
  status: string;
  arena_id: string | null;
  match_cards: MatchCard[];
}

export interface TwinPreview {
  public_safe_summary: string | null;
  looking_for: string[];
  interests: string[];
}

export interface UserRead {
  id: number;
  name: string;
  email: string;
  avatar_url: string | null;
  persona: string | null;
}

export interface RoomRead {
  id: string;
  status: string;
  vibe_score: number | null;
  vibe_summary: string | null;
  created_at: string;
  completed_at: string | null;
  participants: UserRead[];
}

export interface MessageRead {
  id: string;
  sender_user_id: string;
  sender_name: string;
  role: string;
  content: string;
  timestamp: string;
}

export interface MatchmakeResponse {
  status: string;
  room_id: string | null;
  position: number | null;
}
