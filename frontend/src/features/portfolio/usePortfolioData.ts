import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { snapshotApi } from '@/shared/api/services';
import { QUERY_KEYS, invalidateAllPortfolioQueries } from '@/shared/api/queryHelpers';
import type { MonthlySnapshot, Account } from '@/shared/types';
import { getAccountCategory } from '@/shared/types';
import { parseDate } from '@/shared/utils/dateFormat';
import { PORTFOLIO_MILESTONES, QUERY_CONFIG } from '@/config/constants';

/**
 * Portfolio row for spreadsheet table display
 */
export interface PortfolioRow {
  id: string;
  date: string;
  dateObj: Date;
  accounts: Account[];
  totalNetWorth: number;
  totals: {
    sparing: number;
    gjeld: number;
    pensjon: number;
  };
}

/**
 * Portfolio data including rows and milestone information
 */
export interface PortfolioData {
  rows: PortfolioRow[];
  milestones: Record<string, number[]>;
}


/**
 * Calculate category totals for a set of accounts
 */
function calculateTotals(accounts: Account[]): { sparing: number; gjeld: number; pensjon: number } {
  return accounts.reduce(
    (totals, acc) => {
      const category = getAccountCategory(acc.assetClass);
      if (category === 'gjeld') {
        // Gjeld is stored as negative, display as positive absolute value
        totals.gjeld += Math.abs(acc.value);
      } else {
        totals[category] += acc.value;
      }
      return totals;
    },
    { sparing: 0, gjeld: 0, pensjon: 0 }
  );
}

/**
 * Detect milestone crossings for each account across consecutive snapshots
 *
 * Returns a map of "snapshotId-accountName" to array of thresholds crossed
 */
function detectMilestones(snapshots: MonthlySnapshot[]): Record<string, number[]> {
  const milestones: Record<string, number[]> = {};

  // Sort by date ascending so we can compare consecutive snapshots
  const sorted = [...snapshots].sort((a, b) =>
    parseDate(a.date).getTime() - parseDate(b.date).getTime()
  );

  // Compare each snapshot to the previous one
  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const previous = sorted[i - 1];

    // Check each account in current snapshot
    current.accounts.forEach((acc) => {
      // Find same account in previous snapshot
      const prevAcc = previous.accounts.find(a => a.name === acc.name);
      const prevValue = prevAcc?.value ?? 0;
      const currValue = acc.value;

      // For negative values (gjeld/debt), use absolute values for milestone detection
      const prevAbsValue = Math.abs(prevValue);
      const currAbsValue = Math.abs(currValue);

      // Find all thresholds crossed between previous and current
      const crossed = PORTFOLIO_MILESTONES.filter(
        t => prevAbsValue < t && currAbsValue >= t
      );

      // Store milestones if any thresholds were crossed
      if (crossed.length > 0) {
        const key = `${current.id}-${acc.name}`;
        milestones[key] = crossed;
      }
    });
  }

  return milestones;
}

/**
 * Fetch and transform portfolio data for table display
 */
async function fetchPortfolioData(): Promise<PortfolioData> {
  try {
    const snapshots = await snapshotApi.getAll();

    if (!snapshots || snapshots.length === 0) {
      return {
        rows: [],
        milestones: {}
      };
    }

    // Detect milestones across snapshots
    const milestones = detectMilestones(snapshots);

    // Transform snapshots to portfolio rows and sort by date descending
    const rows = snapshots
      .map((snapshot) => ({
        id: snapshot.id,
        date: snapshot.date,
        dateObj: parseDate(snapshot.date),
        accounts: snapshot.accounts,
        totalNetWorth: snapshot.totalNetWorth,
        totals: calculateTotals(snapshot.accounts)
      }))
      .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());

    return { rows, milestones };
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    throw error;
  }
}

/**
 * Hook to fetch portfolio data for spreadsheet table
 *
 * Fetches all monthly snapshots and transforms them for table display.
 * Returns data sorted by date (most recent first).
 *
 * @returns TanStack Query result with portfolio rows
 */
export function usePortfolioData() {
  return useQuery({
    queryKey: QUERY_KEYS.PORTFOLIO,
    queryFn: fetchPortfolioData,
    staleTime: QUERY_CONFIG.STALE_TIME,
    retry: QUERY_CONFIG.RETRY_COUNT
  });
}

/**
 * Hook to create a new monthly snapshot
 *
 * Creates a new snapshot with accounts and invalidates all related queries.
 *
 * @returns Mutation function for creating snapshots
 */
export function useCreateSnapshot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<MonthlySnapshot, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
      return await snapshotApi.create(data);
    },
    onSuccess: () => invalidateAllPortfolioQueries(queryClient)
  });
}

/**
 * Hook to update an existing snapshot
 *
 * Updates snapshot data and invalidates all related queries.
 *
 * @returns Mutation function for updating snapshots
 */
export function useUpdateSnapshot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data
    }: {
      id: string;
      data: Partial<Omit<MonthlySnapshot, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>;
    }) => {
      return await snapshotApi.update(id, data);
    },
    onSuccess: () => invalidateAllPortfolioQueries(queryClient)
  });
}

/**
 * Hook to delete a snapshot
 *
 * Deletes a snapshot and invalidates all related queries.
 *
 * @returns Mutation function for deleting snapshots
 */
export function useDeleteSnapshot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await snapshotApi.delete(id);
    },
    onSuccess: () => invalidateAllPortfolioQueries(queryClient)
  });
}
