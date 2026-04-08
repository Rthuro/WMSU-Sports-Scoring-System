// Custom error class for operational errors (known, expected errors)
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handling middleware — must have 4 params for Express to recognize it
export const errorHandler = (err, req, res, next) => {
  // Default values
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational || false;

  // Always log the error server-side
  console.error(`❌ [${req.method}] ${req.originalUrl} →`, err.message);
  if (!isOperational) {
    console.error(err.stack);
  }

  // In development, send full error details
  if (process.env.NODE_ENV === "development") {
    return res.status(statusCode).json({
      success: false,
      error: err.message,
      stack: err.stack,
    });
  }

  // In production, hide internal details
  if (isOperational) {
    return res.status(statusCode).json({
      success: false,
      error: err.message,
    });
  }

  // Unknown/programming errors — don't leak details
  return res.status(500).json({
    success: false,
    error: "Internal Server Error",
  });
};
