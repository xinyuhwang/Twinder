import { OnboardingAnswers } from '@/types';

const KEYS = {
  selectedUser: 'twinder_selected_user',
  onboardingAnswers: 'twinder_onboarding_answers',
  savedMatches: 'twinder_saved_matches',
  passedMatches: 'twinder_passed_matches',
  meetRequests: 'twinder_meet_requests',
  demoComplete: 'twinder_demo_complete',
};

function get<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
}

function set<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export const localStore = {
  getSelectedUser: () => get<string>(KEYS.selectedUser) ?? 'alexis',
  setSelectedUser: (id: string) => set(KEYS.selectedUser, id),

  getOnboardingAnswers: () => get<OnboardingAnswers>(KEYS.onboardingAnswers) ?? {},
  setOnboardingAnswers: (answers: OnboardingAnswers) => set(KEYS.onboardingAnswers, answers),

  getSavedMatches: () => get<string[]>(KEYS.savedMatches) ?? [],
  saveMatch: (matchId: string) => {
    const saved = get<string[]>(KEYS.savedMatches) ?? [];
    if (!saved.includes(matchId)) set(KEYS.savedMatches, [...saved, matchId]);
  },

  getPassedMatches: () => get<string[]>(KEYS.passedMatches) ?? [],
  passMatch: (matchId: string) => {
    const passed = get<string[]>(KEYS.passedMatches) ?? [];
    if (!passed.includes(matchId)) set(KEYS.passedMatches, [...passed, matchId]);
  },

  getMeetRequests: () => get<string[]>(KEYS.meetRequests) ?? [],
  addMeetRequest: (matchId: string) => {
    const meets = get<string[]>(KEYS.meetRequests) ?? [];
    if (!meets.includes(matchId)) set(KEYS.meetRequests, [...meets, matchId]);
  },

  reset: () => {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  },
};
