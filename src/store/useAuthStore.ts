import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cliente, Trabalhador } from '../types/api';

type User = (Cliente | Trabalhador) & {
  role: 'cliente' | 'trabalhador';
  admin?: boolean;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (user: User) => void;
  logout: () => void;
  markInitialized: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isInitialized: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      markInitialized: () => set({ isInitialized: true }),
    }),
    {
      name: 'facilitei-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
