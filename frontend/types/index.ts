export type EventMode = 'HACKATHON' | 'NETWORKING' | 'DATING' | 'GENERAL';

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
