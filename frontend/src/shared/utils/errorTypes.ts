/**
 * Error type utilities for type-safe error handling
 *
 * Provides type guards and utilities for handling different error types
 * across the application, replacing ad-hoc `any` types in catch blocks.
 *
 * Single source of truth: ApiError class is defined in client.ts and re-exported here.
 */

import { ApiError } from '../api/client';

export type { ApiError };

/**
 * Type guard to check if an error is an ApiError instance
 * Safely narrows `unknown` to ApiError
 *
 * @param error - Unknown error value
 * @returns true if error is an ApiError instance
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Extract error message from any error type
 * Handles ApiError, Error, and unknown types
 *
 * @param error - Error of unknown type
 * @returns User-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
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
  return error instanceof ApiError && error.statusCode === statusCode;
}
