import { useQuery } from '@tanstack/react-query';
import { snapshotApi } from '@/shared/api/services';
import { QUERY_KEYS } from '@/shared/api/queryHelpers';
import type { Account } from '@/shared/types';
import { getAccountCategory } from '@/shared/types';
import { parseDate } from '@finans/components';
import { GROWTH_RATES, RETIREMENT, QUERY_CONFIG } from '@/config/constants';

/**
 * Pension source breakdown
 */
interface PensjonBreakdown {
  id: string;
  name: string;
  amount: number;
  percent: number;
  isPublicPension?: boolean;
}

/**
 * Pensjon (pension) metrics and historical data
 */
export interface PensjonData {
  totalPension: number;
  breakdown: PensjonBreakdown[];
  privatePercent: number; // Private pension as % of total
  publicPercent: number; // Public pension (Folketrygden) as % of total
  estimatedAtRetirement: number;
  history: { date: Date; value: number; privatePension: number; publicPension: number }[];
  accountHistory: Array<{ date: Date; [accountId: string]: Date | number }>;
  accounts: Array<{ id: string; name: string }>;
}

/**
 * Calculate sum of pensjon (pension) accounts
 */
function calculateSumPensjon(accounts: Account[]): number {
  return accounts.reduce((sum, account) => {
    if (getAccountCategory(account.assetClass) === 'pensjon') {
      return sum + account.value;
    }
    return sum;
  }, 0);
}


/**
 * Empty pensjon data (no snapshots yet)
 */
function getEmptyPensjonData(): PensjonData {
  return {
    totalPension: 0,
    breakdown: [],
    privatePercent: 0,
    publicPercent: 0,
    estimatedAtRetirement: 0,
    history: [],
    accountHistory: [],
    accounts: []
  };
}

/**
 * Estimate pension at retirement using compound growth
 * Assumes 5% annual growth and retirement at 67
 */
function estimatePensjonAtRetirement(
  currentValue: number,
  currentAge: number = RETIREMENT.DEFAULT_CURRENT_AGE,
  retirementAge: number = RETIREMENT.DEFAULT_RETIREMENT_AGE
): number {
  const yearsToRetirement = retirementAge - currentAge;
  const annualGrowth = GROWTH_RATES.CONSERVATIVE;

  if (yearsToRetirement <= 0) {
    return currentValue;
  }

  return currentValue * Math.pow(1 + annualGrowth, yearsToRetirement);
}

/**
 * Fetch and calculate pensjon data from API
 */
async function fetchPensjonData(): Promise<PensjonData> {
  try {
    const snapshots = await snapshotApi.getAll();

    if (!snapshots || snapshots.length === 0) {
      return getEmptyPensjonData();
    }

    // Sort by date descending (most recent first)
    const sorted = [...snapshots].sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return dateB.getTime() - dateA.getTime();
    });

    const latest = sorted[0];
    const pensjonAccounts = latest.accounts.filter(
      (account) => getAccountCategory(account.assetClass) === 'pensjon'
    );
    const totalPension = calculateSumPensjon(latest.accounts);

    // Build breakdown
    const breakdown: PensjonBreakdown[] = pensjonAccounts.map((acc) => ({
      id: acc.id,
      name: acc.name,
      amount: acc.value,
      percent: totalPension > 0 ? (acc.value / totalPension) * 100 : 0,
      isPublicPension: acc.isPublicPension
    }));

    // Calculate private vs public pension percentages
    const publicPensionTotal = pensjonAccounts
      .filter(acc => acc.isPublicPension === true)
      .reduce((sum, acc) => sum + acc.value, 0);
    const privatePensionTotal = totalPension - publicPensionTotal;

    const publicPercent = totalPension > 0 ? (publicPensionTotal / totalPension) * 100 : 0;
    const privatePercent = totalPension > 0 ? (privatePensionTotal / totalPension) * 100 : 0;

    // Estimated value at retirement
    const estimatedAtRetirement = estimatePensjonAtRetirement(totalPension);

    // History for stacked chart
    const history = sorted
      .map((s) => {
        const accounts = s.accounts.filter(
          (account) => getAccountCategory(account.assetClass) === 'pensjon'
        );
        const publicValue = accounts
          .filter(a => a.isPublicPension === true)
          .reduce((sum, a) => sum + a.value, 0);
        const privateValue = accounts
          .filter(a => !a.isPublicPension)
          .reduce((sum, a) => sum + a.value, 0);

        return {
          date: parseDate(s.date),
          value: calculateSumPensjon(s.accounts),
          privatePension: privateValue,
          publicPension: publicValue
        };
      })
      .reverse();

    // Build per-account history for ChartWithTabs
    // Collect unique pension accounts from ALL snapshots (not just latest)
    // This ensures accounts that existed historically appear in the Per Konto view
    const uniqueAccounts = new Map<string, { id: string; name: string }>();
    sorted.forEach(snapshot => {
      snapshot.accounts.forEach(account => {
        if (getAccountCategory(account.assetClass) === 'pensjon') {
          // Use the latest name for each account ID
          uniqueAccounts.set(account.id, { id: account.id, name: account.name });
        }
      });
    });

    const accounts = Array.from(uniqueAccounts.values());

    // Build history with per-account breakdown
    // For Totalt tab: ChartWithTabs will automatically sum all account values
    // For Per Konto tab: Each account is displayed as a stacked area
    const accountHistory = sorted
      .map((snapshot) => {
        const point: { date: Date; [accountId: string]: Date | number } = {
          date: parseDate(snapshot.date)
        };

        // Add value for each pension account (from all snapshots)
        // This ensures historical accounts appear in the legend
        accounts.forEach(account => {
          const acc = snapshot.accounts.find(a => a.id === account.id);
          const value = acc && getAccountCategory(acc.assetClass) === 'pensjon' ? acc.value : 0;
          point[account.id] = value;
        });

        // Add aggregated privatePension and publicPension values
        // Only count accounts that actually exist in this snapshot
        const pensionAccountsInSnapshot = snapshot.accounts.filter(
          acc => getAccountCategory(acc.assetClass) === 'pensjon'
        );
        point['privatePension'] = pensionAccountsInSnapshot
          .filter(acc => !acc.isPublicPension)
          .reduce((sum, acc) => sum + acc.value, 0);
        point['publicPension'] = pensionAccountsInSnapshot
          .filter(acc => acc.isPublicPension === true)
          .reduce((sum, acc) => sum + acc.value, 0);

        return point;
      })
      .reverse(); // Oldest first

    return {
      totalPension,
      breakdown,
      privatePercent,
      publicPercent,
      estimatedAtRetirement,
      history,
      accountHistory,
      accounts
    };
  } catch (error) {
    console.error('Error fetching pensjon data:', error);
    throw error;
  }
}

/**
 * Hook to fetch and calculate pensjon/pension data
 *
 * Fetches all snapshots from the portfolio API and calculates:
 * - Total pension value (sum of pensjon accounts)
 * - Breakdown of pension sources (private vs public/Folketrygden)
 * - Private and public pension percentages
 * - Estimated value at retirement (compound growth projection)
 * - Historical data for stacked area charting
 *
 * @returns TanStack Query result with pensjon data
 */
export function usePensjonData() {
  return useQuery({
    queryKey: QUERY_KEYS.PENSJON,
    queryFn: fetchPensjonData,
    staleTime: QUERY_CONFIG.STALE_TIME,
    retry: QUERY_CONFIG.RETRY_COUNT
  });
}
