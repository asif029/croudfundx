'use client';

import { create } from 'zustand';
import type { User } from 'firebase/auth';

import type { UserProfile } from '@/types';

type AuthState = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  hydrated: boolean;
  error?: string;
  actions: {
    setUser: (user: User | null) => void;
    setProfile: (profile: UserProfile | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error?: string) => void;
    setHydrated: (hydrated: boolean) => void;
    reset: () => void;
  };
};

const initialState = {
  user: null,
  profile: null,
  loading: true,
  hydrated: false,
  error: undefined,
};

export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,
  actions: {
    setUser: (user) => set((state) => ({ ...state, user })),
    setProfile: (profile) => set((state) => ({ ...state, profile })),
    setLoading: (loading) => set((state) => ({ ...state, loading })),
    setError: (error) => set((state) => ({ ...state, error })),
    setHydrated: (hydrated) => set((state) => ({ ...state, hydrated })),
    reset: () => set({ ...initialState, loading: false, hydrated: true }),
  },
}));

export const authSelectors = {
  user: (state: AuthState) => state.user,
  profile: (state: AuthState) => state.profile,
  loading: (state: AuthState) => state.loading,
  hydrated: (state: AuthState) => state.hydrated,
  error: (state: AuthState) => state.error,
};

export type { AuthState };
