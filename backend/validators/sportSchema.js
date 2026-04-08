import { z } from "zod";

// ── Sub-resource schemas (for nested creation) ───────

const setRuleSchema = z.object({
  set_number: z.number().int().positive("Set number must be positive"),
  max_score: z.number().int().positive().optional().nullable(),
  time: z.string().optional().nullable(),       // time_limit as interval string
  time_limit: z.string().optional().nullable(),  // alternate name used in some flows
});

const penaltySchema = z.object({
  penalty_name: z.string().min(1, "Penalty name is required").max(100),
  description: z.string().default(""),
  penalty_point: z.number().int(),
  affects_score: z.boolean().default(false),
  penalty_limit: z.number().int().positive().optional().nullable(),
});

const statSchema = z.object({
  stats_name: z.string().min(1, "Stat name is required").max(255),
  is_player_stat: z.boolean().default(false),
});

// ── Create Sport (with nested sub-resources) ─────────
export const createSportSchema = z.object({
  name: z.string().min(1, "Sport name is required").max(255),
  iconPath: z.string().optional().nullable().default(""),
  scoringType: z.string().min(1, "Scoring type is required").max(100),
  defaultSets: z.number().int().positive("Default sets must be positive"),
  maxSets: z.number().int().positive("Max sets must be positive"),
  maxScore: z.number().int().positive().optional().nullable(),
  timePerSet: z.string().optional().nullable(),
  minPlayers: z.number().int().positive("Min players must be positive"),
  maxPlayers: z.number().int().positive("Max players must be positive"),
  useSetBasedScoring: z.boolean().default(false),
  hasPenaltyAffectsScore: z.boolean().default(false),
  hasSetLineUp: z.boolean().default(false),

  // Nested sub-resources (optional — for batch creation)
  set_rules: z.array(setRuleSchema).optional().default([]),
  scoring_points: z.array(z.number().int()).optional().default([]),
  penalties: z.array(penaltySchema).optional().default([]),
  stats: z.array(statSchema).optional().default([]),
  positions: z.array(z.string().min(1)).optional().default([]),
});

// ── Update Sport ─────────────────────────────────────
export const updateSportSchema = z.object({
  name: z.string().min(1).max(255),
  iconPath: z.string().optional().nullable().default(""),
  scoringType: z.string().min(1).max(100),
  defaultSets: z.number().int().positive(),
  maxSets: z.number().int().positive(),
  maxScore: z.number().int().positive().optional().nullable(),
  timePerSet: z.string().optional().nullable(),
  minPlayers: z.number().int().positive(),
  maxPlayers: z.number().int().positive(),
  useSetBasedScoring: z.boolean().default(false),
  hasPenaltyAffectsScore: z.boolean().default(false),
  hasSetLineUp: z.boolean().default(false),
}).partial();
