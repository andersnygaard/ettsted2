import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';

/**
 * Create a test query client with no retries and caching disabled
 */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * Wrapper component for providing QueryClient to tests
 */
export function createQueryWrapper(queryClient: QueryClient) {
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

/**
 * Utility to render hooks with QueryClient wrapper
 */
export function renderHookWithQueryClient<TResult, TProps>(
  hook: (props: TProps) => TResult,
  queryClient?: QueryClient
) {
  const client = queryClient || createTestQueryClient();
  return {
    ...renderHook(hook, { wrapper: createQueryWrapper(client) }),
    queryClient: client,
  };
}
