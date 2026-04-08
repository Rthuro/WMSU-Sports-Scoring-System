/**
 * Express middleware factory for Zod schema validation.
 * 
 * Usage in routes:
 *   import { validate } from "../middleware/validate.js";
 *   import { createSportSchema } from "../validators/sportSchema.js";
 *   router.post("/", validate(createSportSchema), createSport);
 * 
 * @param {import("zod").ZodSchema} schema - Zod schema to validate req.body against
 * @returns {Function} Express middleware
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  // Replace req.body with the parsed/transformed data (strips unknown fields)
  req.body = result.data;
  next();
};

/**
 * Validate route params against a Zod schema.
 */
export const validateParams = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.params);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Invalid parameters",
      errors,
    });
  }

  req.params = result.data;
  next();
};
