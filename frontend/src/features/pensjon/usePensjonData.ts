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
}

/**
 * Pensjon (pension) metrics and historical data
 */
export interface PensjonData {
  totalPension: number;
  breakdown: PensjonBreakdown[];
  otpPercent: number; // OTP (arbeidsgiver) as % of total
  estimatedAtRetirement: number;
  history: { date: Date; value: number; arbeidsgiver: number; folketrygden: number }[];
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
    otpPercent: 0,
    estimatedAtRetirement: 0,
    history: []
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
      percent: totalPension > 0 ? (acc.value / totalPension) * 100 : 0
    }));

    // OTP = Arbeidsgiver as percent of total
    const arbeidsgiver = breakdown.find((b) =>
      b.name.toLowerCase().includes('arbeidsgiver')
    );
    const otpPercent = arbeidsgiver?.percent || 0;

    // Estimated value at retirement
    const estimatedAtRetirement = estimatePensjonAtRetirement(totalPension);

    // History for stacked chart
    const history = sorted
      .map((s) => {
        const accounts = s.accounts.filter(
          (account) => getAccountCategory(account.assetClass) === 'pensjon'
        );
        const arbValue =
          accounts.find((a) =>
            a.name.toLowerCase().includes('arbeidsgiver')
          )?.value || 0;
        const folkValue =
          accounts.find((a) =>
            a.name.toLowerCase().includes('folketrygd')
          )?.value || 0;

        return {
          date: parseDate(s.date),
          value: calculateSumPensjon(s.accounts),
          arbeidsgiver: arbValue,
          folketrygden: folkValue
        };
      })
      .reverse();

    return {
      totalPension,
      breakdown,
      otpPercent,
      estimatedAtRetirement,
      history
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
 * - Breakdown of pension sources (arbeidsgiver vs folketrygden)
 * - OTP percentage (employer pension as % of total)
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
