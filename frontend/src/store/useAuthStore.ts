import { create } from 'zustand';


export const useAuthStore = create((set) => ({
  userId: null,
  userUuid: null,
  setAuth: (userId, userUuid) => set({ userId, userUuid }),
}));