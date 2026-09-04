import { create } from 'zustand';
import type { Cliente, Trabalhador } from '../types/api';

type User = (Cliente | Trabalhador) & { role: 'cliente' | 'trabalhador' };

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (user: User) => void;
  logout: () => void;
  markInitialized: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  markInitialized: () => set({ isInitialized: true }),
}));
