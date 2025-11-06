'use client';

import { useCallback, useEffect, useMemo } from 'react';
import {
  Timestamp,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import toast from 'react-hot-toast';

import { db } from '@/lib/firebase';
import { useMatchStore, matchSelectors } from '@/store/match-store';
import type { Match, MatchInnings, PlayerScore, ScoreEvent } from '@/types';
import type { ScoreEventValues } from '@/lib/validators';

const toIso = (value: unknown) => {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  if (typeof value === 'string') {
    return value;
  }
  return new Date().toISOString();
};

const oversFromBalls = (balls: number) => Number((Math.floor(balls / 6) + (balls % 6) / 10).toFixed(1));

type ApplyEventPayload = ScoreEventValues & {
  batterId?: string;
  bowlerId?: string;
  batterName?: string;
  bowlerName?: string;
};

function upsertBatter(list: PlayerScore[], event: ScoreEvent) {
  if (!event.batterId) return list;

  const next = [...list];
  const index = next.findIndex((item) => item.playerId === event.batterId);
  const isLegalBall = !['wide', 'no-ball'].includes(event.type);
  const runsScored = event.type === 'run' ? event.runs : event.type === 'bye' || event.type === 'leg-bye' ? 0 : 0;

  if (index === -1) {
    next.push({
      playerId: event.batterId,
      playerName: event.batterName ?? event.description ?? 'Batter',
      runs: runsScored,
      balls: isLegalBall ? 1 : 0,
      fours: event.type === 'run' && event.runs === 4 ? 1 : 0,
      sixes: event.type === 'run' && event.runs === 6 ? 1 : 0,
      strikeRate: isLegalBall ? Number(((runsScored / 1) * 100).toFixed(2)) : 0,
    });
    return next;
  }

  const batter = next[index];
  const balls = batter.balls + (isLegalBall ? 1 : 0);
  const runs = batter.runs + runsScored;

  next[index] = {
    ...batter,
    runs,
    balls,
    fours: batter.fours + (event.type === 'run' && event.runs === 4 ? 1 : 0),
    sixes: batter.sixes + (event.type === 'run' && event.runs === 6 ? 1 : 0),
    strikeRate: balls ? Number(((runs / balls) * 100).toFixed(2)) : 0,
  };

  return next;
}

function applyEvent(match: Match, eventInput: ApplyEventPayload): Match {
  const matchClone: Match = JSON.parse(JSON.stringify(match));
  const inningsIndex = matchClone.currentInnings - 1;
  const innings = matchClone.innings[inningsIndex] ?? matchClone.innings[0];

  const event: ScoreEvent = {
    id: crypto.randomUUID(),
    type: eventInput.type,
    runs: eventInput.runs,
    over: oversFromBalls(innings.balls).toFixed(1),
    ball: innings.balls + 1,
    description: eventInput.description,
    batterId: eventInput.batterId,
    batterName: eventInput.batterName,
    bowlerId: eventInput.bowlerId,
    bowlerName: eventInput.bowlerName,
    createdAt: new Date().toISOString(),
  };

  const isLegalBall = !['wide', 'no-ball'].includes(event.type);

  switch (event.type) {
    case 'run':
      innings.totalRuns += event.runs;
      innings.balls += 1;
      break;
    case 'wide':
    case 'no-ball':
      innings.totalRuns += event.runs || 1;
      innings.extras += event.runs || 1;
      break;
    case 'bye':
    case 'leg-bye':
      innings.totalRuns += event.runs;
      innings.extras += event.runs;
      innings.balls += 1;
      break;
    case 'wicket':
      innings.wickets += 1;
      innings.balls += 1;
      break;
    default:
      innings.balls += Number(isLegalBall);
  }

  innings.timeline = [...innings.timeline, event];
  innings.currentOver = isLegalBall
    ? [...innings.currentOver, event].slice(-6)
    : [...innings.currentOver];

  innings.runRate = innings.balls
    ? Number(((innings.totalRuns / innings.balls) * 6).toFixed(2))
    : 0;

  innings.batters = upsertBatter(innings.batters, event);

  if (innings.balls >= matchClone.overs * 6 || innings.wickets >= 10) {
    innings.status = 'complete';
    if (matchClone.innings[inningsIndex + 1]) {
      matchClone.currentInnings = (matchClone.currentInnings + 1) as Match['currentInnings'];
      matchClone.innings[inningsIndex + 1].status = 'in-progress';
    } else {
      matchClone.status = 'completed';
    }
  } else {
    innings.status = 'in-progress';
    matchClone.status = 'live';
  }

  matchClone.summary = {
    totalRuns: innings.totalRuns,
    wickets: innings.wickets,
    overs: oversFromBalls(innings.balls),
    topPerformer: innings.batters.sort((a, b) => b.runs - a.runs)[0]?.playerName,
    result: matchClone.status === 'completed' ? matchClone.summary.result : undefined,
    lastUpdated: new Date().toISOString(),
  };

  matchClone.updatedAt = new Date().toISOString();

  return matchClone;
}

const parseMatchSnapshot = (data: Record<string, unknown>, id: string): Match => ({
  ...(data as Match),
  id,
  createdAt: toIso(data.createdAt),
  updatedAt: toIso(data.updatedAt),
  summary: {
    totalRuns: Number((data.summary as Record<string, unknown>)?.totalRuns ?? 0),
    wickets: Number((data.summary as Record<string, unknown>)?.wickets ?? 0),
    overs: Number((data.summary as Record<string, unknown>)?.overs ?? 0),
    topPerformer: (data.summary as Record<string, unknown>)?.topPerformer as string | undefined,
    result: (data.summary as Record<string, unknown>)?.result as string | undefined,
    lastUpdated: toIso((data.summary as Record<string, unknown>)?.lastUpdated),
  },
  innings: (data.innings as MatchInnings[]).map((inning) => ({
    ...inning,
    currentOver: inning.currentOver ?? [],
    timeline: inning.timeline ?? [],
    batters: inning.batters ?? [],
    bowlers: inning.bowlers ?? [],
  })),
});

export function useMatch(matchId?: string) {
  const match = useMatchStore(matchSelectors.activeMatch);
  const loading = useMatchStore(matchSelectors.loading);
  const scoring = useMatchStore(matchSelectors.scoring);
  const actions = useMatchStore((state) => state.actions);

  useEffect(() => {
    if (!matchId) return;

    actions.setLoading(true);

    const ref = doc(db, 'matches', matchId);
    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        if (!snapshot.exists()) {
          actions.setLoading(false);
          actions.setActiveMatch(undefined);
          return;
        }

        const matchData = parseMatchSnapshot(snapshot.data(), snapshot.id);
        actions.setActiveMatch(matchData);
        actions.setLoading(false);
      },
      (error) => {
        toast.error(error.message);
        actions.setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [actions, matchId]);

  const recordEvent = useCallback(
    async (payload: ApplyEventPayload) => {
      if (!matchId || !match) {
        throw new Error('Match not loaded');
      }

      const nextMatch = applyEvent(match, payload);
      actions.setActiveMatch(nextMatch);
      actions.setLastEvent(nextMatch.innings[nextMatch.currentInnings - 1]?.timeline.slice(-1)[0]);

      const ref = doc(db, 'matches', matchId);
      await updateDoc(ref, {
        innings: nextMatch.innings,
        summary: nextMatch.summary,
        status: nextMatch.status,
        currentInnings: nextMatch.currentInnings,
        updatedAt: serverTimestamp(),
      });
    },
    [actions, match, matchId],
  );

  const selectStriker = useCallback(
    (playerId: string) => {
      actions.setStriker(playerId);
    },
    [actions],
  );

  const selectNonStriker = useCallback(
    (playerId: string) => {
      actions.setNonStriker(playerId);
    },
    [actions],
  );

  const selectBowler = useCallback(
    (playerId: string) => {
      actions.setBowler(playerId);
    },
    [actions],
  );

  const swapStrike = useCallback(() => {
    actions.swapStrike();
  }, [actions]);

  return useMemo(
    () => ({
      match,
      loading,
      scoring,
      recordEvent,
      selectStriker,
      selectNonStriker,
      selectBowler,
      swapStrike,
    }),
    [loading, match, recordEvent, scoring, selectBowler, selectNonStriker, selectStriker, swapStrike],
  );
}
