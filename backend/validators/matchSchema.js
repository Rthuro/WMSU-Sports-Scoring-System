import { z } from "zod";

const participantSchema = z.object({
  team_id: z.number().int().positive().optional().nullable(),
  player_id: z.number().int().positive().optional().nullable(),
});

// ── Create Match (with nested participants) ──────────
export const createMatchSchema = z.object({
  match_id: z.string().min(1, "Match ID is required"),
  sport_id: z.number({ message: "Sport ID is required" }).int().positive(),
  match_name: z.string().max(255).optional().nullable(),
  match_date: z.string().optional().nullable(),
  start_time: z.string().optional().nullable(),
  end_time: z.string().optional().nullable(),
  location: z.string().max(255).optional().nullable(),
  is_team: z.boolean().default(true),
  team_a_id: z.number().int().positive().optional().nullable(),
  team_b_id: z.number().int().positive().optional().nullable(),

  // Nested participants (optional — for batch creation)
  participants: z.array(participantSchema).optional().default([]),
});

// ── Update Match ─────────────────────────────────────
export const updateMatchSchema = z.object({
  match_name: z.string().max(255).optional().nullable(),
  match_date: z.string().optional().nullable(),
  start_time: z.string().optional().nullable(),
  end_time: z.string().optional().nullable(),
  location: z.string().max(255).optional().nullable(),
  is_finished: z.boolean().optional(),
}).partial();

// ── Match Points ─────────────────────────────────────
export const createMatchPointsSchema = z.object({
  match_id: z.string().min(1),
  team_a_id: z.number().int().positive().optional().nullable(),
  team_b_id: z.number().int().positive().optional().nullable(),
  player_a_id: z.number().int().positive().optional().nullable(),
  player_b_id: z.number().int().positive().optional().nullable(),
  a_score: z.number().int().min(0, "Score cannot be negative"),
  b_score: z.number().int().min(0, "Score cannot be negative"),
  set_number: z.number().int().positive(),
  time: z.string().optional().nullable(),
});
