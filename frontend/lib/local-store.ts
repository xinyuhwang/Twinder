const KEYS = {
  token: 'twinder_token',
  userId: 'twinder_user_id',
  userName: 'twinder_user_name',
  personaId: 'twinder_persona_id',
  currentRoomId: 'twinder_current_room_id',
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
  getToken: () => get<string>(KEYS.token),
  setToken: (token: string) => set(KEYS.token, token),

  getUserId: () => get<number>(KEYS.userId),
  setUserId: (id: number) => set(KEYS.userId, id),

  getUserName: () => get<string>(KEYS.userName),
  setUserName: (name: string) => set(KEYS.userName, name),

  getPersonaId: () => get<string>(KEYS.personaId) ?? 'alexis',
  setPersonaId: (id: string) => set(KEYS.personaId, id),

  getCurrentRoomId: () => get<string>(KEYS.currentRoomId),
  setCurrentRoomId: (roomId: string) => set(KEYS.currentRoomId, roomId),
  clearCurrentRoomId: () =>
    typeof window !== 'undefined' && localStorage.removeItem(KEYS.currentRoomId),

  isLoggedIn: () => !!get<string>(KEYS.token),

  reset: () =>
    Object.values(KEYS).forEach(
      k => typeof window !== 'undefined' && localStorage.removeItem(k)
    ),
};
