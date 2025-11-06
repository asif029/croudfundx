'use client';

import { useCallback, useEffect, useMemo } from 'react';
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import toast from 'react-hot-toast';

import { db } from '@/lib/firebase';
import { useMatchesStore, matchesSelectors } from '@/store/matches-store';
import { useMatchStore } from '@/store/match-store';
import type { Match, MatchListItem, MatchSummary, MatchType } from '@/types';

type NewMatchPayload = {
  title: string;
  venue?: string;
  matchType: MatchType;
  overs: number;
  teamA: { id: string; name: string };
  teamB: { id: string; name: string };
  tossWinnerId: string;
  electedTo: 'bat' | 'bowl';
};

const toIso = (value: unknown) => {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  if (typeof value === 'string') {
    return value;
  }
  return new Date().toISOString();
};

const parseSummary = (data: Record<string, unknown>): MatchSummary => ({
  totalRuns: Number(data.totalRuns ?? 0),
  wickets: Number(data.wickets ?? 0),
  overs: Number(data.overs ?? 0),
  topPerformer: (data.topPerformer as string) ?? undefined,
  result: (data.result as string) ?? undefined,
  lastUpdated: toIso(data.lastUpdated),
});

const parseMatchList = (id: string, data: Record<string, unknown>): MatchListItem => ({
  id,
  title: (data.title as string) ?? 'Untitled Match',
  matchType: (data.matchType as Match['matchType']) ?? 'T20',
  status: (data.status as Match['status']) ?? 'upcoming',
  summary: parseSummary((data.summary as Record<string, unknown>) ?? {}),
  startedAt: toIso(data.startedAt),
  completedAt: toIso(data.completedAt),
});

export function useMatches(userId?: string) {
  const matches = useMatchesStore(matchesSelectors.matches);
  const loading = useMatchesStore(matchesSelectors.loading);
  const actions = useMatchesStore((state) => state.actions);
  const matchActions = useMatchStore((state) => state.actions);

  useEffect(() => {
    if (!userId) {
      actions.reset();
      return;
    }

    actions.setLoading(true);

    const ref = collection(db, 'matches');
    const q = query(ref, where('userId', '==', userId), orderBy('updatedAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const nextMatches = snapshot.docs.map((document) =>
          parseMatchList(document.id, document.data()),
        );
        actions.setMatches(nextMatches);
        actions.setLoading(false);
      },
      (error) => {
        actions.setLoading(false);
        toast.error(error.message);
      },
    );

    return () => unsubscribe();
  }, [actions, userId]);

  const createMatch = useCallback(
    async (payload: NewMatchPayload) => {
      if (!userId) {
        throw new Error('Missing user');
      }

      const ref = doc(collection(db, 'matches'));

      const firstBattingTeamId =
        payload.electedTo === 'bat' ? payload.tossWinnerId : payload.teamA.id === payload.tossWinnerId ? payload.teamB.id : payload.teamA.id;

      const firstTeam =
        firstBattingTeamId === payload.teamA.id ? payload.teamA : payload.teamB;
      const secondTeam =
        firstBattingTeamId === payload.teamA.id ? payload.teamB : payload.teamA;

      const innings: Match['innings'] = [
        {
          teamId: firstTeam.id,
          teamName: firstTeam.name,
          status: 'not-started',
          totalRuns: 0,
          wickets: 0,
          balls: 0,
          extras: 0,
          runRate: 0,
          currentOver: [],
          timeline: [],
          batters: [],
          bowlers: [],
        },
        {
          teamId: secondTeam.id,
          teamName: secondTeam.name,
          status: 'not-started',
          totalRuns: 0,
          wickets: 0,
          balls: 0,
          extras: 0,
          runRate: 0,
          currentOver: [],
          timeline: [],
          batters: [],
          bowlers: [],
        },
      ];

      const match: Match = {
        id: ref.id,
        userId,
        title: payload.title,
        venue: payload.venue,
        matchType: payload.matchType,
        overs: payload.overs,
        status: 'upcoming',
        tossWinnerId: payload.tossWinnerId,
        electedTo: payload.electedTo,
        teamA: payload.teamA,
        teamB: payload.teamB,
        currentInnings: 1,
        innings,
        summary: {
          totalRuns: 0,
          wickets: 0,
          overs: 0,
          topPerformer: undefined,
          result: undefined,
          lastUpdated: new Date().toISOString(),
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(ref, {
        ...match,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success('Match created');
      return ref.id;
    },
    [userId],
  );

  const hydrateMatch = useCallback(async (matchId: string) => {
    const ref = doc(db, 'matches', matchId);
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) {
      throw new Error('Match not found');
    }

    const data = snapshot.data() as Match;
    matchActions.setActiveMatch({ ...data, id: matchId });
    return data;
  }, [matchActions]);

  const updateMatch = useCallback(
    async (matchId: string, patch: Partial<Match>) => {
      const ref = doc(db, 'matches', matchId);
      await updateDoc(ref, {
        ...patch,
        updatedAt: serverTimestamp(),
      });
    },
    [],
  );

  return useMemo(
    () => ({
      matches,
      loading,
      createMatch,
      hydrateMatch,
      updateMatch,
    }),
    [createMatch, hydrateMatch, loading, matches, updateMatch],
  );
}
