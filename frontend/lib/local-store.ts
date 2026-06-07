import type { EventMode, MatchCard, TwinPreview } from '@/types';

const KEY = {
  token: 'twinder_token',
  userId: 'twinder_user_id',
  userName: 'twinder_user_name',
  personaId: 'twinder_persona_id',
  currentRoomId: 'twinder_current_room_id',
  eventMode: 'twinder_event_mode',
  eventCode: 'twinder_event_code',
  onboardingAnswers: 'twinder_onboarding_answers',
  twinPreview: 'twinder_twin_preview',
  arenaCards: 'twinder_arena_cards',
  savedMatchIds: 'twinder_saved_match_ids',
  passedMatchIds: 'twinder_passed_match_ids',
  metMatchIds: 'twinder_met_match_ids',
};

function getJson<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function setJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const localStore = {
  getToken: () => typeof window !== 'undefined' ? localStorage.getItem(KEY.token) : null,
  setToken: (v: string) => localStorage.setItem(KEY.token, v),

  getUserId: (): number | null => {
    const v = typeof window !== 'undefined' ? localStorage.getItem(KEY.userId) : null;
    return v ? parseInt(v, 10) : null;
  },
  setUserId: (v: number) => localStorage.setItem(KEY.userId, String(v)),

  getUserName: () => typeof window !== 'undefined' ? localStorage.getItem(KEY.userName) : null,
  setUserName: (v: string) => localStorage.setItem(KEY.userName, v),

  getPersonaId: () => typeof window !== 'undefined' ? localStorage.getItem(KEY.personaId) : null,
  setPersonaId: (v: string) => localStorage.setItem(KEY.personaId, v),

  getCurrentRoomId: () => typeof window !== 'undefined' ? localStorage.getItem(KEY.currentRoomId) : null,
  setCurrentRoomId: (v: string) => localStorage.setItem(KEY.currentRoomId, v),

  getEventMode: (): EventMode => {
    const v = typeof window !== 'undefined' ? localStorage.getItem(KEY.eventMode) : null;
    if (v === 'hackathon' || v === 'networking' || v === 'dating' || v === 'custom') return v;
    return 'hackathon';
  },
  setEventMode: (v: EventMode) => localStorage.setItem(KEY.eventMode, v),

  getEventCode: () => typeof window !== 'undefined' ? localStorage.getItem(KEY.eventCode) : null,
  setEventCode: (v: string) => localStorage.setItem(KEY.eventCode, v),

  getOnboardingAnswers: (): Record<string, string> | null =>
    getJson<Record<string, string>>(KEY.onboardingAnswers),
  setOnboardingAnswers: (v: Record<string, string>) => setJson(KEY.onboardingAnswers, v),

  getTwinPreview: (): TwinPreview | null => getJson<TwinPreview>(KEY.twinPreview),
  setTwinPreview: (v: TwinPreview) => setJson(KEY.twinPreview, v),

  getArenaCards: (): MatchCard[] | null => getJson<MatchCard[]>(KEY.arenaCards),
  setArenaCards: (v: MatchCard[]) => setJson(KEY.arenaCards, v),

  getSavedMatchIds: (): number[] => getJson<number[]>(KEY.savedMatchIds) ?? [],
  setSavedMatchIds: (v: number[]) => setJson(KEY.savedMatchIds, v),

  getPassedMatchIds: (): number[] => getJson<number[]>(KEY.passedMatchIds) ?? [],
  setPassedMatchIds: (v: number[]) => setJson(KEY.passedMatchIds, v),

  getMetMatchIds: (): number[] => getJson<number[]>(KEY.metMatchIds) ?? [],
  setMetMatchIds: (v: number[]) => setJson(KEY.metMatchIds, v),

  reset: () => {
    Object.values(KEY).forEach(k => localStorage.removeItem(k));
  },
};
