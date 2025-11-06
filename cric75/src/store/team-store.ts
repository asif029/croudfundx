'use client';

import { create } from 'zustand';

import type { Team } from '@/types';

type TeamStore = {
  teams: Team[];
  loading: boolean;
  selectedTeamId?: string;
  actions: {
    setTeams: (teams: Team[]) => void;
    addTeam: (team: Team) => void;
    updateTeam: (team: Team) => void;
    removeTeam: (teamId: string) => void;
    selectTeam: (teamId?: string) => void;
    setLoading: (loading: boolean) => void;
    reset: () => void;
  };
};

const initialState: Omit<TeamStore, 'actions'> = {
  teams: [],
  loading: false,
  selectedTeamId: undefined,
};

export const useTeamStore = create<TeamStore>((set) => ({
  ...initialState,
  actions: {
    setTeams: (teams) => set((state) => ({ ...state, teams })),
    addTeam: (team) => set((state) => ({ ...state, teams: [team, ...state.teams] })),
    updateTeam: (team) =>
      set((state) => ({
        ...state,
        teams: state.teams.map((item) => (item.id === team.id ? team : item)),
      })),
    removeTeam: (teamId) =>
      set((state) => ({
        ...state,
        teams: state.teams.filter((team) => team.id !== teamId),
      })),
    selectTeam: (teamId) => set((state) => ({ ...state, selectedTeamId: teamId })),
    setLoading: (loading) => set((state) => ({ ...state, loading })),
    reset: () => set(initialState),
  },
}));

export const teamSelectors = {
  teams: (state: TeamStore) => state.teams,
  loading: (state: TeamStore) => state.loading,
  selectedTeamId: (state: TeamStore) => state.selectedTeamId,
};

export type { TeamStore };
