import { localStore } from '@/lib/local-store';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const POST_AUTH_KEY = 'twinder_post_auth_redirect';

export function startGoogleAuth(returnTo = '/join') {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(POST_AUTH_KEY, returnTo);
    window.location.href = `${API_BASE}/auth/google`;
  }
}

export function consumePostAuthRedirect(): string {
  if (typeof window === 'undefined') return '/join';
  const dest = sessionStorage.getItem(POST_AUTH_KEY) ?? '/join';
  sessionStorage.removeItem(POST_AUTH_KEY);
  return dest;
}

export function isGoogleAuthed(): boolean {
  return localStore.getAuthMethod() === 'google' && !!localStore.getToken();
}
