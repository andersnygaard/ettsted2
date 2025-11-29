import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { AppError } from '../errors';

/**
 * Standard error response format (from CLAUDE.md API specification)
 */
interface ErrorResponse {
  error: {
    message: string;
    code: string;
    details?: unknown;
  };
  success: false;
}

/**
 * Global error handler middleware
 *
 * Catches all errors (both sync and async) and formats them
 * according to the standard error response format.
 *
 * IMPORTANT: This must be the last middleware in the stack!
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log the error with context
  logger.error('Request error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    statusCode: (err as AppError).statusCode || 500
  });

  // Determine status code
  const statusCode = (err as AppError).statusCode || 500;

  // Determine error code
  const errorCode = (err as AppError).code || 'INTERNAL_ERROR';

  // Build error response
  const response: ErrorResponse = {
    error: {
      message: err.message || 'Internal server error',
      code: errorCode,
      // Only include details/stack in development
      details: process.env.NODE_ENV === 'development'
        ? { stack: err.stack, ...((err as AppError).details || {}) }
        : (err as AppError).details
    },
    success: false
  };

  // Send error response
  res.status(statusCode).json(response);
};

/**
 * Async handler wrapper to catch async errors
 *
 * Usage:
 *   router.get('/endpoint', asyncHandler(async (req, res) => {
 *     // async code that might throw
 *   }))
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
