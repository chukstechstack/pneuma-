import { create } from 'zustand';

type AuthState = {
  userId: string | null | undefined;
  userUuid: string | null | undefined;
  setAuth: (userId: string | null, userUuid: string | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  userId: undefined,
  userUuid: undefined,
  setAuth: (userId, userUuid) => set({ userId, userUuid }),
}));