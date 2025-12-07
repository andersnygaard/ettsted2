import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../api/queryHelpers';
import { userApi } from '../api/services';

/**
 * Hook to fetch current authenticated user
 *
 * Returns null if user is not authenticated.
 * Caches for 5 minutes before refetching.
 *
 * @example
 * ```typescript
 * const { data: user, isLoading, error } = useUser();
 * ```
 */
export function useUser() {
  return useQuery({
    queryKey: QUERY_KEYS.USER,
    queryFn: userApi.getMe,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1
  });
}

/**
 * Hook for first-time user setup
 *
 * Initializes user profile with username and optional email.
 * Invalidates user query on success to refetch updated data.
 *
 * @example
 * ```typescript
 * const setup = useUserSetup();
 * await setup.mutateAsync({ username: 'John Doe' });
 * ```
 */
export function useUserSetup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.setup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER });
    }
  });
}

/**
 * Hook for updating user settings
 *
 * Updates user profile data (email, preferences, etc.).
 * Invalidates user query on success to refetch updated data.
 *
 * @example
 * ```typescript
 * const update = useUpdateUser();
 * await update.mutateAsync({ email: 'new@example.com' });
 * ```
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER });
    }
  });
}
