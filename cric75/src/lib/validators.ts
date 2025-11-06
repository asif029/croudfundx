import { z } from 'zod';

export const authRegisterSchema = z.object({
  displayName: z.string().min(2, 'Display name is too short'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const authLoginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const playerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Player name is required'),
  role: z.enum(['batter', 'bowler', 'all-rounder', 'wicket-keeper']),
  jerseyNumber: z.string().optional(),
  isCaptain: z.boolean().optional().default(false),
  isWicketKeeper: z.boolean().optional().default(false),
});

export const teamSchema = z.object({
  name: z.string().min(2, 'Team name is required'),
  color: z.string().optional(),
  logoUrl: z.string().url('Provide a valid URL').optional().or(z.literal('')),
  players: z.array(playerSchema).min(4, 'Add at least 4 players'),
});

export const matchSchema = z.object({
  title: z.string().min(4, 'Match title is required'),
  venue: z.string().optional(),
  matchType: z.enum(['T20', 'ODI', 'Test']),
  overs: z
    .number()
    .min(1, 'Overs must be positive')
    .max(90, 'Overs must be 90 or less for Test sessions')
    .or(z.string().transform((value) => Number.parseInt(value, 10))),
  tossWinnerId: z.string().min(1, 'Select toss winner'),
  electedTo: z.enum(['bat', 'bowl']),
  teamA: z.object({ id: z.string(), name: z.string() }),
  teamB: z.object({ id: z.string(), name: z.string() }),
});

export const profileSchema = z.object({
  displayName: z.string().min(2, 'Display name is too short'),
  bio: z.string().max(200, 'Bio must be under 200 characters').optional(),
  photoURL: z.string().url('Provide a valid image URL').optional().or(z.literal('')),
});

export const scoreEventSchema = z.object({
  type: z.enum(['run', 'wide', 'no-ball', 'bye', 'leg-bye', 'wicket', 'milestone']),
  runs: z.number().min(0).max(6),
  description: z.string().optional(),
  batterId: z.string().optional(),
  bowlerId: z.string().optional(),
});

export type AuthRegisterValues = z.infer<typeof authRegisterSchema>;
export type AuthLoginValues = z.infer<typeof authLoginSchema>;
export type PlayerFormValues = z.infer<typeof playerSchema>;
export type TeamFormValues = z.infer<typeof teamSchema>;
export type MatchFormValues = z.infer<typeof matchSchema>;
export type ProfileFormValues = z.infer<typeof profileSchema>;
export type ScoreEventValues = z.infer<typeof scoreEventSchema>;
