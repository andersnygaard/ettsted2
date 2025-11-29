/**
 * Custom Error Classes
 *
 * Standardized error classes for the application.
 * Each error maps to a specific HTTP status code.
 */

/**
 * Base application error
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 - Validation Error
 * Used when request data fails validation
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(400, 'VALIDATION_ERROR', message, details);
    this.name = 'ValidationError';
  }
}

/**
 * 403 - Forbidden Error
 * Used when user is authenticated but not authorized to access resource
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Access forbidden', details?: unknown) {
    super(403, 'FORBIDDEN', message, details);
    this.name = 'ForbiddenError';
  }
}

/**
 * 404 - Not Found Error
 * Used when requested resource doesn't exist
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', details?: unknown) {
    super(404, 'NOT_FOUND', message, details);
    this.name = 'NotFoundError';
  }
}

/**
 * 409 - Conflict Error
 * Used when request conflicts with current state (e.g., duplicate username)
 */
export class ConflictError extends AppError {
  constructor(message: string, details?: unknown) {
    super(409, 'CONFLICT', message, details);
    this.name = 'ConflictError';
  }
}

/**
 * 500 - Internal Server Error
 * Used for unexpected server errors
 */
export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error', details?: unknown) {
    super(500, 'INTERNAL_SERVER_ERROR', message, details);
    this.name = 'InternalServerError';
  }
}
