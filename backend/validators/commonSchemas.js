import { z } from "zod";

// ── Account ──────────────────────────────────────────
export const createAccountSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(150),
  lastName: z.string().min(1, "Last name is required").max(150),
  middleName: z.string().max(5).default(""),
  role: z.enum(["super_admin", "admin"], { message: "Role must be 'super_admin' or 'admin'" }),
  email: z.string().email("Invalid email format").max(255),
  passwordHash: z.string().min(1, "Password is required"),
});

export const updateAccountSchema = createAccountSchema.partial();

// ── Department ───────────────────────────────────────
export const createDepartmentSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  abbreviation: z.string().max(50).optional().nullable(),
  logo: z.string().optional().nullable(),
});

export const updateDepartmentSchema = createDepartmentSchema.partial();

// ── Event ────────────────────────────────────────────
export const createEventSchema = z.object({
  event_id: z.string().min(1, "Event ID is required"),
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().optional().nullable(),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  location: z.string().max(255).optional().nullable(),
  banner_image: z.string().optional().nullable(),
});

export const updateEventSchema = createEventSchema.omit({ event_id: true }).partial();

// ── Player ───────────────────────────────────────────
export const createPlayerSchema = z.object({
  sport_id: z.number({ message: "Sport ID is required" }).int().positive(),
  first_name: z.string().min(1, "First name is required").max(100),
  last_name: z.string().min(1, "Last name is required").max(100),
  middle_initial: z.string().max(10).optional().nullable(),
  gender: z.enum(["Male", "Female"], { message: "Gender must be 'Male' or 'Female'" }).optional().nullable(),
  student_id: z.string().max(50).optional().nullable(),
  photo: z.string().optional().nullable(),
});

export const updatePlayerSchema = createPlayerSchema.partial();

// ── Reusable param schemas ───────────────────────────
export const idParamSchema = z.object({
  id: z.string().or(z.coerce.number()),
});

export const sportIdParamSchema = z.object({
  sportId: z.coerce.number().int().positive(),
});
