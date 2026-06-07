const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

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

async function req<T>(path: string, opts: RequestInit = {}, token?: string): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: { ...headers, ...(opts.headers ?? {}) },
  });
  if (!res.ok) throw new Error(await res.text());
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  devLogin: (name: string, persona: string) =>
    req<{ token: string; user: UserRead }>(
      `/auth/dev-login?name=${encodeURIComponent(name)}&persona=${encodeURIComponent(persona)}`,
      { method: 'POST' }
    ),
  getMe: (token: string) => req<UserRead>('/auth/me', {}, token),
  logout: (token: string) => req<{ ok: boolean }>('/auth/logout', { method: 'POST' }, token),
  matchmake: (token: string) => req<MatchmakeResponse>('/rooms/matchmake', { method: 'POST' }, token),
  matchmakeStatus: (token: string) => req<MatchmakeResponse>('/rooms/matchmake/status', {}, token),
  getRoom: (token: string, roomId: string) => req<RoomRead>(`/rooms/${roomId}`, {}, token),
  getMessages: (token: string, roomId: string) => req<MessageRead[]>(`/rooms/${roomId}/messages`, {}, token),
  takeover: (token: string, roomId: string) =>
    req<{ ok: boolean }>(`/rooms/${roomId}/takeover`, { method: 'POST' }, token),
  completeRoom: (token: string, roomId: string) =>
    req<{ ok: boolean }>(`/rooms/${roomId}/complete`, { method: 'POST' }, token),
  wsUrl: (roomId: string, token: string) =>
    `${BASE.replace(/^http/, 'ws')}/ws/rooms/${roomId}?token=${encodeURIComponent(token)}`,
};
