import type {
  UserRead,
  RoomRead,
  MessageRead,
  MatchmakeResponse,
  TwinPreview,
  ArenaResponse,
  DatResult,
} from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const WS_BASE = API_BASE.replace(/^http/, 'ws');

export type { RoomRead, MessageRead };

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...opts.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status}: ${body}`);
  }
  return res.json();
}

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export const api = {
  devLogin: (name: string, persona: string) =>
    request<{ token: string; user: UserRead }>(`/auth/dev-login?name=${encodeURIComponent(name)}&persona=${encodeURIComponent(persona)}`, {
      method: 'POST',
    }),

  getMe: (token: string) =>
    request<UserRead>('/auth/me', { headers: authHeaders(token) }),

  matchmake: (token: string) =>
    request<MatchmakeResponse>('/rooms/matchmake', {
      method: 'POST',
      headers: authHeaders(token),
    }),

  matchmakeStatus: (token: string) =>
    request<MatchmakeResponse>('/rooms/matchmake/status', {
      headers: authHeaders(token),
    }),

  getRoom: (token: string, roomId: string) =>
    request<RoomRead>(`/rooms/${roomId}`, { headers: authHeaders(token) }),

  getMessages: (token: string, roomId: string) =>
    request<MessageRead[]>(`/rooms/${roomId}/messages`, { headers: authHeaders(token) }),

  takeover: (token: string, roomId: string) =>
    request<{ ok: boolean }>(`/rooms/${roomId}/takeover`, {
      method: 'POST',
      headers: authHeaders(token),
    }),

  completeRoom: (token: string, roomId: string) =>
    request<{ ok: boolean }>(`/rooms/${roomId}/complete`, {
      method: 'POST',
      headers: authHeaders(token),
    }),

  wsUrl: (roomId: string, token: string) =>
    `${WS_BASE}/ws/rooms/${roomId}?token=${token}`,

  intake: (token: string, body: { raw_context: string; answers?: Record<string, string> | null }) =>
    request<TwinPreview>('/users/me/intake', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(body),
    }),

  dat: (token: string, words: string[]) =>
    request<DatResult>('/users/me/dat', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({ words }),
    }),

  startArena: (token: string, mode: string) =>
    request<ArenaResponse>(`/arena/start?mode=${encodeURIComponent(mode)}`, {
      method: 'POST',
      headers: authHeaders(token),
    }),

  getArenaResults: (token: string) =>
    request<ArenaResponse>('/arena/results', { headers: authHeaders(token) }),

  getArenaStatus: (token: string) =>
    request<{ status: string; count: number }>('/arena/status', { headers: authHeaders(token) }),

  getArenaConversation: (token: string, conversationId: string) =>
    request<MessageRead[]>(`/arena/conversation/${encodeURIComponent(conversationId)}`, {
      headers: authHeaders(token),
    }),
};
