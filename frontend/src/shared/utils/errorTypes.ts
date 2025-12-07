/**
 * Error type utilities for type-safe error handling
 *
 * Provides type guards and interfaces for handling different error types
 * across the application, replacing ad-hoc `any` types in catch blocks.
 */

/**
 * Standard API error interface
 * Matches the ApiError class thrown by axios interceptor
 */
export interface ApiError {
  message: string;
  statusCode?: number;
  code?: string;
  details?: unknown;
}

/**
 * Type guard to check if an error is an ApiError instance
 * Safely narrows `unknown` to ApiError
 *
 * @param error - Unknown error value
 * @returns true if error is an ApiError-like object
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

/**
 * Extract error message from any error type
 * Handles ApiError, Error, and unknown types
 *
 * @param error - Error of unknown type
 * @returns User-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'En uventet feil oppstod. Vennligst prøv igjen.';
}

/**
 * Check if error is a specific HTTP status code
 *
 * @param error - Error to check
 * @param statusCode - HTTP status code
 * @returns true if error has matching statusCode
 */
export function isStatusCode(error: unknown, statusCode: number): boolean {
  return isApiError(error) && error.statusCode === statusCode;
}
