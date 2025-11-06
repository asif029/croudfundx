'use client';

import { create } from 'zustand';

import type { Match, ScoreEvent } from '@/types';

type ScoringState = {
  strikerId?: string;
  nonStrikerId?: string;
  bowlerId?: string;
  lastEvent?: ScoreEvent;
};

type MatchStore = {
  activeMatch?: Match;
  scoring: ScoringState;
  loading: boolean;
  actions: {
    setActiveMatch: (match?: Match) => void;
    setLoading: (loading: boolean) => void;
    setStriker: (playerId: string) => void;
    setNonStriker: (playerId: string) => void;
    setBowler: (playerId: string) => void;
    setLastEvent: (event?: ScoreEvent) => void;
    swapStrike: () => void;
    reset: () => void;
  };
};

const initialState: Omit<MatchStore, 'actions'> = {
  activeMatch: undefined,
  scoring: {},
  loading: false,
};

export const useMatchStore = create<MatchStore>((set) => ({
  ...initialState,
  actions: {
    setActiveMatch: (activeMatch) => set((state) => ({ ...state, activeMatch })),
    setLoading: (loading) => set((state) => ({ ...state, loading })),
    setStriker: (playerId) =>
      set((state) => ({
        ...state,
        scoring: { ...state.scoring, strikerId: playerId },
      })),
    setNonStriker: (playerId) =>
      set((state) => ({
        ...state,
        scoring: { ...state.scoring, nonStrikerId: playerId },
      })),
    setBowler: (playerId) =>
      set((state) => ({
        ...state,
        scoring: { ...state.scoring, bowlerId: playerId },
      })),
    setLastEvent: (event) =>
      set((state) => ({
        ...state,
        scoring: { ...state.scoring, lastEvent: event },
      })),
    swapStrike: () =>
      set((state) => ({
        ...state,
        scoring: {
          ...state.scoring,
          strikerId: state.scoring.nonStrikerId,
          nonStrikerId: state.scoring.strikerId,
        },
      })),
    reset: () => set(initialState),
  },
}));

export const matchSelectors = {
  activeMatch: (state: MatchStore) => state.activeMatch,
  scoring: (state: MatchStore) => state.scoring,
  loading: (state: MatchStore) => state.loading,
};

export type { MatchStore, ScoringState };
