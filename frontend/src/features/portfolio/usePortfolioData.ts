import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { snapshotApi } from '@/shared/api/services';
import type { MonthlySnapshot, Account } from '@/shared/types';
import { getAccountCategory } from '@/shared/types';

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
 * Parse Norwegian date format (dd.MM.yyyy) to Date object
 */
function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('.');
  return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
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
 * Fetch and transform portfolio data for table display
 */
async function fetchPortfolioData(): Promise<PortfolioRow[]> {
  try {
    const snapshots = await snapshotApi.getAll();

    if (!snapshots || snapshots.length === 0) {
      return [];
    }

    // Transform snapshots to portfolio rows and sort by date descending
    return snapshots
      .map((snapshot) => ({
        id: snapshot.id,
        date: snapshot.date,
        dateObj: parseDate(snapshot.date),
        accounts: snapshot.accounts,
        totalNetWorth: snapshot.totalNetWorth,
        totals: calculateTotals(snapshot.accounts)
      }))
      .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());
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
    queryKey: ['portfolio'],
    queryFn: fetchPortfolioData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1
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
    onSuccess: () => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['sparing'] });
      queryClient.invalidateQueries({ queryKey: ['gjeld'] });
      queryClient.invalidateQueries({ queryKey: ['pensjon'] });
    }
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
    onSuccess: () => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['sparing'] });
      queryClient.invalidateQueries({ queryKey: ['gjeld'] });
      queryClient.invalidateQueries({ queryKey: ['pensjon'] });
    }
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
    onSuccess: () => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['sparing'] });
      queryClient.invalidateQueries({ queryKey: ['gjeld'] });
      queryClient.invalidateQueries({ queryKey: ['pensjon'] });
    }
  });
}
