import { z } from "zod";

// ── Create Team (with nested player assignments) ─────
export const createTeamSchema = z.object({
  event_id: z.string().optional().nullable(),
  department_id: z.number().int().positive().optional().nullable(),
  sport_id: z.number({ message: "Sport ID is required" }).int().positive(),
  name: z.string().min(1, "Team name is required").max(255),
  short_name: z.string().max(50).optional().nullable(),
  banner_image: z.string().optional().nullable(),

  // Nested player IDs (optional — for batch creation)
  players: z.array(z.number().int().positive()).optional().default([]),
});

// ── Update Team ──────────────────────────────────────
export const updateTeamSchema = z.object({
  department_id: z.number().int().positive().optional().nullable(),
  sport_id: z.number().int().positive().optional().nullable(),
  name: z.string().min(1).max(255).optional(),
  short_name: z.string().max(50).optional().nullable(),
  banner_image: z.string().optional().nullable(),
  is_active: z.boolean().optional(),
}).partial();
