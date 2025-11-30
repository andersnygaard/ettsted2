import { useQuery } from '@tanstack/react-query';
import { snapshotApi } from '@/shared/api/services';
import type { Account, AssetCategory } from '@/shared/types';
import { getAccountCategory } from '@/shared/types';

/**
 * Dashboard data aggregated from portfolio snapshots
 */
export interface DashboardData {
  netWorth: number;
  monthlyChange: number;
  sumSparing: number;
  sumGjeld: number;
  pensjon: number;
  sparerate: number;
  nextMilestone: number;
  currentTowardsMilestone: number;
}

/**
 * Empty dashboard data (no snapshots yet)
 */
function getEmptyDashboardData(): DashboardData {
  return {
    netWorth: 0,
    monthlyChange: 0,
    sumSparing: 0,
    sumGjeld: 0,
    pensjon: 0,
    sparerate: 0,
    nextMilestone: 100000,
    currentTowardsMilestone: 0
  };
}

// Import getAccountCategory and ASSET_CLASS_CATEGORIES from shared types above

/**
 * Calculate sum of accounts for a specific category
 */
function calculateCategorySum(accounts: Account[], category: AssetCategory): number {
  return accounts.reduce((sum, account) => {
    if (getAccountCategory(account.assetClass) === category) {
      return sum + account.value;
    }
    return sum;
  }, 0);
}

/**
 * Calculate net worth from accounts
 */
function calculateNetWorth(accounts: Account[]): number {
  const sumSparing = calculateCategorySum(accounts, 'sparing');
  const sumGjeld = calculateCategorySum(accounts, 'gjeld');
  return sumSparing - sumGjeld;
}

/**
 * Find the next milestone target
 */
function findNextMilestone(current: number): number {
  const milestones = [
    100000, 250000, 500000, 750000,
    1000000, 2000000, 3000000, 4000000, 5000000,
    7500000, 10000000, 15000000, 20000000
  ];

  const nextMilestone = milestones.find(m => m > current);
  if (nextMilestone) {
    return nextMilestone;
  }

  // Double the current value if we've exceeded all milestones
  return current * 2;
}

/**
 * Fetch and aggregate dashboard data from API
 */
async function fetchDashboardData(): Promise<DashboardData> {
  try {
    const snapshots = await snapshotApi.getAll();

    if (!snapshots || snapshots.length === 0) {
      return getEmptyDashboardData();
    }

    // Sort by date descending (most recent first)
    const sorted = [...snapshots].sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return dateB.getTime() - dateA.getTime();
    });

    const latest = sorted[0];
    const previous = sorted[1];

    const sumSparing = calculateCategorySum(latest.accounts, 'sparing');
    const sumGjeld = calculateCategorySum(latest.accounts, 'gjeld');
    const pensjon = calculateCategorySum(latest.accounts, 'pensjon');
    const netWorth = sumSparing - sumGjeld;

    // Calculate monthly change percentage
    let monthlyChange = 0;
    if (previous) {
      const previousNetWorth = calculateNetWorth(previous.accounts);
      if (previousNetWorth !== 0) {
        monthlyChange = ((netWorth - previousNetWorth) / Math.abs(previousNetWorth)) * 100;
      }
    }

    const nextMilestone = findNextMilestone(netWorth);

    return {
      netWorth,
      monthlyChange,
      sumSparing,
      sumGjeld,
      pensjon,
      sparerate: 0, // TODO: Calculate from income/expenses when data available
      nextMilestone,
      currentTowardsMilestone: netWorth
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}

/**
 * Parse Norwegian date format (dd.MM.yyyy) to Date object
 */
function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('.');
  return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
}

/**
 * Hook to fetch and aggregate dashboard data
 *
 * Fetches all snapshots from the portfolio API and calculates:
 * - Net worth (sum sparing - sum gjeld)
 * - Monthly change percentage
 * - Sum of each asset class category
 * - Next milestone target
 *
 * @returns TanStack Query result with dashboard data
 */
export function useDashboardData() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1
  });
}
