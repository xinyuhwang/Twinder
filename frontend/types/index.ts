export type EventMode = 'hackathon' | 'networking' | 'dating' | 'custom';
export type AuthMethod = 'google' | 'demo';

export interface ConversationHighlight {
  speaker: string;
  text: string;
}

export interface MatchCard {
  score: number;
  headline: string;
  match_type: string;
  summary: string;
  tip?: string | null;
  fun_facts?: string[];
  strongest_overlap: string | null;
  non_obvious_overlap: string | null;
  complementary_dynamic: string | null;
  suggested_opener: string | null;
  follow_up_questions: string[];
  conversation_highlights: ConversationHighlight[];
  common_interests: string[];
  openness_compatibility?: number | null;
  openness_scores?: Record<string, number | null> | null;
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

export interface ArenaStatusResponse {
  status: string;
  count: number;
}

export interface TwinPreview {
  public_safe_summary: string | null;
  looking_for: string[];
  interests: string[];
}

export interface DatResult {
  score: number | null;
  scored_words: string[];
  valid_words: string[];
  invalid_words: string[];
  enough_words: boolean;
}

export interface UserRead {
  id: number;
  name: string;
  email: string;
  avatar_url: string | null;
  age: number | null;
  persona: string | null;
  dat_score?: number | null;
}

export interface UserUpdate {
  name?: string;
  age?: number | null;
  persona?: string;
}

export interface MessageRead {
  id: string;
  sender_user_id: string;
  sender_name: string;
  role: string;
  content: string;
  timestamp: string;
}
