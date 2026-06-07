import type { AuthMethod, EventMode, MatchCard, TwinPreview } from '@/types';

const KEY = {
  token: 'twinder_token',
  authMethod: 'twinder_auth_method',
  userId: 'twinder_user_id',
  userName: 'twinder_user_name',
  personaId: 'twinder_persona_id',
  eventMode: 'twinder_event_mode',
  eventCode: 'twinder_event_code',
  rawContext: 'twinder_raw_context',
  skippedIntake: 'twinder_skipped_intake',
  onboardingAnswers: 'twinder_onboarding_answers',
  twinPreview: 'twinder_twin_preview',
  arenaCards: 'twinder_arena_cards',
  savedMatchIds: 'twinder_saved_match_ids',
  passedMatchIds: 'twinder_passed_match_ids',
  metMatchIds: 'twinder_met_match_ids',
  seenSwipeHint: 'twinder_seen_swipe_hint',
  theme: 'twinder_theme',
  preflightQuestions: 'twinder_preflight_questions',
  preflightProfileYaml: 'twinder_preflight_profile_yaml',
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

  getAuthMethod: (): AuthMethod | null => {
    const v = typeof window !== 'undefined' ? localStorage.getItem(KEY.authMethod) : null;
    return v === 'google' || v === 'demo' ? v : null;
  },
  setAuthMethod: (v: AuthMethod) => localStorage.setItem(KEY.authMethod, v),

  getUserId: (): number | null => {
    const v = typeof window !== 'undefined' ? localStorage.getItem(KEY.userId) : null;
    return v ? parseInt(v, 10) : null;
  },
  setUserId: (v: number) => localStorage.setItem(KEY.userId, String(v)),

  getUserName: () => typeof window !== 'undefined' ? localStorage.getItem(KEY.userName) : null,
  setUserName: (v: string) => localStorage.setItem(KEY.userName, v),

  getPersonaId: () => typeof window !== 'undefined' ? localStorage.getItem(KEY.personaId) : null,
  setPersonaId: (v: string) => localStorage.setItem(KEY.personaId, v),

  getEventMode: (): EventMode => {
    const v = typeof window !== 'undefined' ? localStorage.getItem(KEY.eventMode) : null;
    if (v === 'hackathon' || v === 'networking' || v === 'dating' || v === 'custom') return v;
    return 'hackathon';
  },
  setEventMode: (v: EventMode) => localStorage.setItem(KEY.eventMode, v),

  getEventCode: () => typeof window !== 'undefined' ? localStorage.getItem(KEY.eventCode) : null,
  setEventCode: (v: string) => localStorage.setItem(KEY.eventCode, v),

  getRawContext: () =>
    typeof window !== 'undefined' ? localStorage.getItem(KEY.rawContext) : null,
  setRawContext: (v: string) => localStorage.setItem(KEY.rawContext, v),
  clearRawContext: () => localStorage.removeItem(KEY.rawContext),

  getSkippedIntake: (): boolean =>
    typeof window !== 'undefined' && localStorage.getItem(KEY.skippedIntake) === 'true',
  setSkippedIntake: (v: boolean) =>
    localStorage.setItem(KEY.skippedIntake, v ? 'true' : 'false'),

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

  getSeenSwipeHint: (): boolean =>
    typeof window !== 'undefined' && localStorage.getItem(KEY.seenSwipeHint) === 'true',
  setSeenSwipeHint: (v: boolean) =>
    localStorage.setItem(KEY.seenSwipeHint, v ? 'true' : 'false'),

  getPreflightQuestions: (): string[] | null => getJson<string[]>(KEY.preflightQuestions),
  setPreflightQuestions: (v: string[]) => setJson(KEY.preflightQuestions, v),
  getPreflightProfileYaml: (): string | null =>
    typeof window !== 'undefined' ? localStorage.getItem(KEY.preflightProfileYaml) : null,
  setPreflightProfileYaml: (v: string) => localStorage.setItem(KEY.preflightProfileYaml, v),
  clearPreflightData: () => {
    localStorage.removeItem(KEY.preflightQuestions);
    localStorage.removeItem(KEY.preflightProfileYaml);
  },

  reset: () => {
    Object.entries(KEY).forEach(([name, k]) => {
      if (name === 'theme') return;
      localStorage.removeItem(k);
    });
  },
};
