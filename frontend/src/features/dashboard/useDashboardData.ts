import { useQuery } from '@tanstack/react-query';
import { snapshotApi } from '@/shared/api/services';
import { QUERY_KEYS } from '@/shared/api/queryHelpers';
import type { Account, AssetCategory } from '@/shared/types';
import { getAccountCategory } from '@/shared/types';
import { parseDate } from '@finans/components';
import { MILESTONES, QUERY_CONFIG } from '@/config/constants';

/**
 * Dashboard data aggregated from portfolio snapshots
 */
export interface DashboardData {
  netWorth: number;
  monthlyChange: number;
  sumSavings: number;
  totalDebt: number;
  pensjon: number;
  savingsRate: number;
  nextMilestone: number;
  currentTowardsMilestone: number;
  sparingMonthlyChange: number;
}

/**
 * Empty dashboard data (no snapshots yet)
 */
function getEmptyDashboardData(): DashboardData {
  return {
    netWorth: 0,
    monthlyChange: 0,
    sumSavings: 0,
    totalDebt: 0,
    pensjon: 0,
    savingsRate: 0,
    nextMilestone: MILESTONES[0],
    currentTowardsMilestone: 0,
    sparingMonthlyChange: 0
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
 * Note: Gjeld values are stored as negative numbers, so we ADD them
 */
function calculateNetWorth(accounts: Account[]): number {
  const sumSavings = calculateCategorySum(accounts, 'sparing');
  const sumGjeld = calculateCategorySum(accounts, 'gjeld');
  return sumSavings + sumGjeld; // gjeld is already negative
}

/**
 * Find the next milestone target
 */
function findNextMilestone(current: number): number {
  const nextMilestone = MILESTONES.find(m => m > current);
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

    const sumSavings = calculateCategorySum(latest.accounts, 'sparing');
    const totalDebt = calculateCategorySum(latest.accounts, 'gjeld');
    const pensjon = calculateCategorySum(latest.accounts, 'pensjon');
    const netWorth = sumSavings + totalDebt; // gjeld is already negative

    // Calculate monthly change percentage (based on net worth)
    let monthlyChange = 0;
    let sparingMonthlyChange = 0;
    if (previous) {
      const previousNetWorth = calculateNetWorth(previous.accounts);
      const previousSumSparing = calculateCategorySum(previous.accounts, 'sparing');

      if (previousNetWorth !== 0) {
        monthlyChange = ((netWorth - previousNetWorth) / Math.abs(previousNetWorth)) * 100;
      }

      if (previousSumSparing !== 0) {
        sparingMonthlyChange = ((sumSavings - previousSumSparing) / previousSumSparing) * 100;
      }
    }

    const nextMilestone = findNextMilestone(sumSavings);

    return {
      netWorth,
      monthlyChange,
      sumSavings,
      totalDebt,
      pensjon,
      savingsRate: 0, // Calculated in DashboardPage from user profile
      nextMilestone,
      currentTowardsMilestone: sumSavings,
      sparingMonthlyChange
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
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
    queryKey: QUERY_KEYS.DASHBOARD,
    queryFn: fetchDashboardData,
    staleTime: QUERY_CONFIG.STALE_TIME,
    retry: QUERY_CONFIG.RETRY_COUNT
  });
}
