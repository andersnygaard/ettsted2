import { useEffect } from 'react';
import { useToast } from '../components/Toast';
import { ApiError } from '../api/client';

/**
 * Hook to handle API errors with toast notifications
 *
 * Usage:
 *   const handleError = useApiError();
 *   try {
 *     await apiCall();
 *   } catch (error) {
 *     handleError(error);
 *   }
 *
 * Or with TanStack Query:
 *   const { error } = useQuery(...);
 *   useApiError(error);
 */
export function useApiError(error?: Error | null): (error: unknown) => void {
  const { showError } = useToast();

  // Auto-show toast if error is passed directly
  useEffect(() => {
    if (error) {
      handleError(error);
    }
  }, [error]);

  const handleError = (error: unknown): void => {
    console.error('Handling API error:', error);

    if (error instanceof ApiError) {
      // Use the user-friendly message from ApiError
      showError(error.message);
    } else if (error instanceof Error) {
      // Generic error
      showError(error.message || 'En uventet feil oppstod');
    } else {
      // Unknown error type
      showError('En uventet feil oppstod');
    }
  };

  return handleError;
}
