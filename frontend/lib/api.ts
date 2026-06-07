import type {
  UserRead,
  UserUpdate,
  MessageRead,
  TwinPreview,
  ArenaResponse,
  DatResult,
} from '@/types';

export interface PreflightResponse {
  questions: string[];
  profile_yaml: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export type { MessageRead };

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

  updateMe: (token: string, body: UserUpdate) =>
    request<UserRead>('/users/me', {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(body),
    }),

  preflight: (token: string, raw_context: string) =>
    request<PreflightResponse>('/users/me/preflight', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({ raw_context }),
    }),

  intake: (token: string, body: { raw_context: string; answers?: Record<string, string> | null; mode?: string; profile_yaml?: string }) =>
    request<TwinPreview>('/users/me/intake', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(body),
    }),

  getTwinPrompt: (token: string, mode: string) =>
    request<{ mode: string; twin_prompt: string }>(`/users/me/twin-prompt?mode=${encodeURIComponent(mode)}`, {
      headers: authHeaders(token),
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
