import { useQuery } from '@tanstack/react-query';
import { snapshotApi } from '@/shared/api/services';
import type { Account } from '@/shared/types';
import { getAccountCategory } from '@/shared/types';

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
  sumPensjon: number;
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
 * Parse Norwegian date format (dd.MM.yyyy) to Date object
 */
function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('.');
  return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
}

/**
 * Empty pensjon data (no snapshots yet)
 */
function getEmptyPensjonData(): PensjonData {
  return {
    sumPensjon: 0,
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
  currentAge: number = 35,
  retirementAge: number = 67
): number {
  const yearsToRetirement = retirementAge - currentAge;
  const annualGrowth = 0.05; // 5% conservative estimate

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
    const sumPensjon = calculateSumPensjon(latest.accounts);

    // Build breakdown
    const breakdown: PensjonBreakdown[] = pensjonAccounts.map((acc) => ({
      id: acc.id,
      name: acc.name,
      amount: acc.value,
      percent: sumPensjon > 0 ? (acc.value / sumPensjon) * 100 : 0
    }));

    // OTP = Arbeidsgiver as percent of total
    const arbeidsgiver = breakdown.find((b) =>
      b.name.toLowerCase().includes('arbeidsgiver')
    );
    const otpPercent = arbeidsgiver?.percent || 0;

    // Estimated value at retirement
    const estimatedAtRetirement = estimatePensjonAtRetirement(sumPensjon);

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
      sumPensjon,
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
    queryKey: ['pensjon'],
    queryFn: fetchPensjonData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1
  });
}
