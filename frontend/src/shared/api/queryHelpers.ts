import { QueryClient } from '@tanstack/react-query';

/**
 * Centralized query key definitions for portfolio-related queries
 *
 * Using a QUERY_KEYS object ensures:
 * - Consistency across all hooks and mutations
 * - Type safety for query key strings
 * - Single source of truth for invalidation logic
 */
export const QUERY_KEYS = {
  USER: ['user'],
  PORTFOLIO: ['portfolio'],
  DASHBOARD: ['dashboard'],
  SPARING: ['sparing'],
  GJELD: ['gjeld'],
  PENSJON: ['pensjon'],
} as const;

/**
 * Invalidate all portfolio-related queries
 *
 * Called after snapshot mutations (create, update, delete) to refresh:
 * - Portfolio spreadsheet data
 * - Dashboard aggregates
 * - Sparing/F.I.R.E. metrics
 * - Gjeld/debt metrics
 * - Pensjon/pension metrics
 *
 * @param queryClient TanStack Query client instance
 */
export function invalidateAllPortfolioQueries(queryClient: QueryClient): void {
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PORTFOLIO });
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SPARING });
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GJELD });
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PENSJON });
}
