export type PlayerRole = 'batter' | 'bowler' | 'all-rounder' | 'wicket-keeper';

export interface Player {
  id: string;
  name: string;
  role: PlayerRole;
  jerseyNumber?: string;
  isCaptain?: boolean;
  isWicketKeeper?: boolean;
}

export interface Team {
  id: string;
  userId: string;
  name: string;
  logoUrl?: string;
  color?: string;
  players: Player[];
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export type MatchType = 'T20' | 'ODI' | 'Test';
export type MatchStatus = 'upcoming' | 'live' | 'completed';

export type InningsStatus = 'not-started' | 'in-progress' | 'complete';

export interface PlayerScore {
  playerId: string;
  playerName: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOnStrike?: boolean;
  dismissal?: {
    type: string;
    by?: string;
    fielder?: string;
    over?: string;
  };
}

export interface BowlerSpell {
  playerId: string;
  playerName: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
}

export type ScoreEventType =
  | 'run'
  | 'wide'
  | 'no-ball'
  | 'bye'
  | 'leg-bye'
  | 'wicket'
  | 'milestone';

export interface ScoreEvent {
  id: string;
  type: ScoreEventType;
  runs: number;
  over: string;
  ball: number;
  description?: string;
  batterId?: string;
  batterName?: string;
  bowlerId?: string;
  bowlerName?: string;
  createdAt: string;
}

export interface MatchInnings {
  teamId: string;
  teamName: string;
  status: InningsStatus;
  totalRuns: number;
  wickets: number;
  balls: number;
  extras: number;
  runRate: number;
  currentOver: ScoreEvent[];
  timeline: ScoreEvent[];
  batters: PlayerScore[];
  bowlers: BowlerSpell[];
}

export interface MatchSummary {
  totalRuns: number;
  wickets: number;
  overs: number;
  topPerformer?: string;
  result?: string;
  lastUpdated: string;
}

export interface Match {
  id: string;
  userId: string;
  title: string;
  venue?: string;
  matchType: MatchType;
  overs: number;
  status: MatchStatus;
  tossWinnerId?: string;
  electedTo?: 'bat' | 'bowl';
  startedAt?: string;
  completedAt?: string;
  teamA: {
    id: string;
    name: string;
  };
  teamB: {
    id: string;
    name: string;
  };
  currentInnings: 1 | 2 | 3 | 4;
  innings: MatchInnings[];
  summary: MatchSummary;
  spectators?: number;
  shareCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MatchListItem {
  id: string;
  title: string;
  matchType: MatchType;
  status: MatchStatus;
  summary: MatchSummary;
  startedAt?: string;
  completedAt?: string;
}

export interface LiveMatchPresence {
  matchId: string;
  socketId: string;
  lastSeen: string;
  role: 'scorer' | 'viewer';
}
