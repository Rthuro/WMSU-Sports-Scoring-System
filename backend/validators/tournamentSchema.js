import { z } from "zod";

// ── Create Tournament (with nested teams — backend generates brackets) ───
export const createTournamentSchema = z.object({
  tournament_id: z.string().min(1, "Tournament ID is required"),
  event_id: z.string().optional().nullable(),
  sport_id: z.number({ message: "Sport ID is required" }).int().positive(),
  name: z.string().min(1, "Tournament name is required").max(255),
  description: z.string().optional().nullable(),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  location: z.string().max(255).optional().nullable(),
  banner_image: z.string().optional().nullable(),
  bracketing: z.enum(["single-elimination", "double-elimination", "round-robin"], {
    message: "Bracketing must be 'single-elimination', 'double-elimination', or 'round-robin'",
  }),

  // Nested team IDs — backend will create tournament_teams, tally, and bracket matches
  teams: z.array(z.number().int().positive()).optional().default([]),
});

// ── Update Tournament ────────────────────────────────
export const updateTournamentSchema = z.object({
  event_id: z.string().optional().nullable(),
  sport_id: z.number().int().positive().optional(),
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional().nullable(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  location: z.string().max(255).optional().nullable(),
  banner_image: z.string().optional().nullable(),
}).partial();
