'use client';

import { create } from 'zustand';

import type { MatchListItem } from '@/types';

type MatchesStore = {
  matches: MatchListItem[];
  loading: boolean;
  actions: {
    setMatches: (matches: MatchListItem[]) => void;
    setLoading: (loading: boolean) => void;
    reset: () => void;
  };
};

const initialState: Omit<MatchesStore, 'actions'> = {
  matches: [],
  loading: false,
};

export const useMatchesStore = create<MatchesStore>((set) => ({
  ...initialState,
  actions: {
    setMatches: (matches) => set((state) => ({ ...state, matches })),
    setLoading: (loading) => set((state) => ({ ...state, loading })),
    reset: () => set(initialState),
  },
}));

export const matchesSelectors = {
  matches: (state: MatchesStore) => state.matches,
  loading: (state: MatchesStore) => state.loading,
};

export type { MatchesStore };
