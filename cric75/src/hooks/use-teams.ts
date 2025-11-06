'use client';

import { useCallback, useEffect, useMemo } from 'react';
import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
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
import { useTeamStore, teamSelectors } from '@/store/team-store';
import type { Player, Team } from '@/types';

const toIsoString = (value: unknown) => {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  if (typeof value === 'string') {
    return value;
  }
  return new Date().toISOString();
};

const parseTeam = (id: string, data: Record<string, unknown>): Team => ({
  id,
  userId: (data.userId as string) ?? '',
  name: (data.name as string) ?? 'Unnamed Team',
  logoUrl: (data.logoUrl as string) ?? undefined,
  color: (data.color as string) ?? undefined,
  players: (data.players as Player[]) ?? [],
  createdAt: toIsoString(data.createdAt),
  updatedAt: toIsoString(data.updatedAt),
});

export function useTeams(userId?: string) {
  const teams = useTeamStore(teamSelectors.teams);
  const loading = useTeamStore(teamSelectors.loading);
  const selectedTeamId = useTeamStore(teamSelectors.selectedTeamId);
  const actions = useTeamStore((state) => state.actions);

  useEffect(() => {
    if (!userId) {
      actions.reset();
      return;
    }

    actions.setLoading(true);

    const ref = collection(db, 'teams');
    const q = query(ref, where('userId', '==', userId), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const nextTeams = snapshot.docs.map((docSnapshot) =>
          parseTeam(docSnapshot.id, docSnapshot.data()),
        );
        actions.setTeams(nextTeams);
        actions.setLoading(false);
      },
      (error) => {
        actions.setLoading(false);
        toast.error(error.message);
      },
    );

    return () => unsubscribe();
  }, [actions, userId]);

  const createTeam = useCallback(
    async (payload: { name: string; color?: string; logoUrl?: string; players: Player[] }) => {
      if (!userId) {
        throw new Error('Missing user');
      }

      const ref = doc(collection(db, 'teams'));
      const data = {
        ...payload,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(ref, data);
      toast.success(`Team ${payload.name} created`);

      return ref.id;
    },
    [userId],
  );

  const updateTeam = useCallback(
    async (teamId: string, payload: Partial<Omit<Team, 'id' | 'userId'>>) => {
      const ref = doc(db, 'teams', teamId);
      await updateDoc(ref, {
        ...payload,
        updatedAt: serverTimestamp(),
      });
      toast.success('Team updated');
    },
    [],
  );

  const deleteTeam = useCallback(async (teamId: string) => {
    await deleteDoc(doc(db, 'teams', teamId));
    toast.success('Team deleted');
  }, []);

  return useMemo(
    () => ({
      teams,
      loading,
      selectedTeamId,
      selectTeam: actions.selectTeam,
      createTeam,
      updateTeam,
      deleteTeam,
    }),
    [actions.selectTeam, createTeam, deleteTeam, loading, selectedTeamId, teams, updateTeam],
  );
}
