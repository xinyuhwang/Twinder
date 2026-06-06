const KEY = {
  token: 'twinder_token',
  userId: 'twinder_user_id',
  userName: 'twinder_user_name',
  personaId: 'twinder_persona_id',
  currentRoomId: 'twinder_current_room_id',
};

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

  reset: () => {
    Object.values(KEY).forEach(k => localStorage.removeItem(k));
  },
};
