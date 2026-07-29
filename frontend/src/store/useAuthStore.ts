import { create } from 'zustand';

type AuthState = {
  userId: string | null;
  userUuid: string | null;
  setAuth: (userId: string | null, userUuid: string | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  userUuid: null,
  setAuth: (userId, userUuid) => set({ userId, userUuid }),
}));