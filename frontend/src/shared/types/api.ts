/**
 * API Response and Error Types
 *
 * Shared types for all API communication
 */

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
}

/**
 * Standard API error response
 */
export interface ApiError {
  error: {
    message: string;
    code: string;
    details?: Record<string, unknown>;
  };
  success: false;
}
