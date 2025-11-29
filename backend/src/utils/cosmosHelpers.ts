/**
 * CosmosDB Helper Utilities
 *
 * Provides error handling and utility functions for CosmosDB operations.
 */

import { logger } from './logger';

/**
 * Custom error classes for database operations
 */
export class DatabaseError extends Error {
  constructor(message: string, public readonly originalError?: unknown) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class NotFoundError extends DatabaseError {
  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends DatabaseError {
  constructor(message: string = 'Resource already exists') {
    super(message);
    this.name = 'ConflictError';
  }
}

export class ValidationError extends DatabaseError {
  constructor(message: string = 'Validation failed') {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Handle CosmosDB errors and convert to application-specific errors
 *
 * Maps CosmosDB error codes to appropriate application errors:
 * - 404 NotFound → NotFoundError
 * - 409 Conflict → ConflictError
 * - 400 BadRequest → ValidationError
 * - Other → DatabaseError
 *
 * @param error - Error from CosmosDB operation
 * @returns Application-specific error
 */
export function handleCosmosError(error: unknown): Error {
  // Type guard for CosmosDB errors
  if (error && typeof error === 'object' && 'code' in error) {
    const cosmosError = error as { code: number; message?: string };

    switch (cosmosError.code) {
      case 404:
        return new NotFoundError(cosmosError.message || 'Resource not found in database');

      case 409:
        return new ConflictError(cosmosError.message || 'Resource already exists (duplicate key)');

      case 400:
        return new ValidationError(cosmosError.message || 'Invalid request to database');

      case 429:
        // Too many requests (rate limited by CosmosDB)
        // SDK handles automatic retry with backoff
        logger.warn('CosmosDB rate limit hit (429), SDK will retry', { error: cosmosError.message });
        return new DatabaseError('Database temporarily unavailable, please retry', error);

      default:
        logger.error('CosmosDB operation failed', {
          code: cosmosError.code,
          message: cosmosError.message,
        });
        return new DatabaseError(
          cosmosError.message || 'Database operation failed',
          error
        );
    }
  }

  // Generic error fallback
  logger.error('Unknown database error', { error });
  return new DatabaseError('Unexpected database error', error);
}

/**
 * Check if error is a NotFoundError (404)
 *
 * Useful for returning null instead of throwing for optional resources
 */
export function isNotFoundError(error: unknown): boolean {
  if (error && typeof error === 'object' && 'code' in error) {
    return (error as { code: number }).code === 404;
  }
  return error instanceof NotFoundError;
}

/**
 * Build parameterized query specification
 *
 * Helper to safely construct CosmosDB queries with parameters
 * to prevent NoSQL injection.
 *
 * @example
 * const query = buildParameterizedQuery(
 *   'SELECT * FROM c WHERE c.userId = @userId AND c.date >= @date',
 *   { userId: '123', date: '01.01.2024' }
 * );
 */
export function buildParameterizedQuery(
  query: string,
  parameters: Record<string, string | number | boolean>
): { query: string; parameters: Array<{ name: string; value: string | number | boolean }> } {
  const params = Object.entries(parameters).map(([key, value]) => ({
    name: `@${key}`,
    value,
  }));

  return { query, parameters: params };
}
