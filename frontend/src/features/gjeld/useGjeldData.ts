import { useQuery } from '@tanstack/react-query';
import { snapshotApi } from '@/shared/api/services';
import type { Account } from '@/shared/types';
import { getAccountCategory } from '@/shared/types';

/**
 * Information about a single loan
 */
interface LoanInfo {
  id: string;
  name: string;
  balance: number;
}

/**
 * Gjeld (debt) metrics and historical data
 */
export interface GjeldData {
  sumGjeld: number;
  monthlyChange: number;
  dekning: number; // Coverage: sparing / gjeld * 100
  remaining: number; // How much gjeld remains uncovered
  loans: LoanInfo[];
  history: { date: Date; value: number }[];
}

/**
 * Calculate sum of gjeld (debt) accounts
 */
function calculateSumGjeld(accounts: Account[]): number {
  return accounts.reduce((sum, account) => {
    if (getAccountCategory(account.assetClass) === 'gjeld') {
      return sum + Math.abs(account.value);
    }
    return sum;
  }, 0);
}

/**
 * Calculate sum of sparing (savings) accounts
 */
function calculateSumSparing(accounts: Account[]): number {
  return accounts.reduce((sum, account) => {
    if (getAccountCategory(account.assetClass) === 'sparing') {
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
 * Empty gjeld data (no snapshots yet)
 */
function getEmptyGjeldData(): GjeldData {
  return {
    sumGjeld: 0,
    monthlyChange: 0,
    dekning: 100,
    remaining: 0,
    loans: [],
    history: []
  };
}

/**
 * Fetch and calculate gjeld data from API
 */
async function fetchGjeldData(): Promise<GjeldData> {
  try {
    const snapshots = await snapshotApi.getAll();

    if (!snapshots || snapshots.length === 0) {
      return getEmptyGjeldData();
    }

    // Sort by date descending (most recent first)
    const sorted = [...snapshots].sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return dateB.getTime() - dateA.getTime();
    });

    const latest = sorted[0];
    const previous = sorted[1];

    const sumGjeld = calculateSumGjeld(latest.accounts);
    const sumSparing = calculateSumSparing(latest.accounts);

    // Monthly change (absolute, not percentage - gjeld goes down)
    const prevGjeld = previous ? calculateSumGjeld(previous.accounts) : sumGjeld;
    const monthlyChange = sumGjeld - prevGjeld;

    // Dekning (coverage) - what % of gjeld is covered by sparing
    const dekning = sumGjeld > 0 ? (sumSparing / sumGjeld) * 100 : 100;

    // Remaining - how much gjeld is uncovered
    const remaining = Math.max(0, sumGjeld - sumSparing);

    // Extract loan details
    const loans: LoanInfo[] = latest.accounts
      .filter((account) => getAccountCategory(account.assetClass) === 'gjeld')
      .map((acc) => ({
        id: acc.id,
        name: acc.name,
        balance: Math.abs(acc.value)
      }));

    // History for chart (reversed to chronological order)
    const history = sorted
      .map((s) => ({
        date: parseDate(s.date),
        value: calculateSumGjeld(s.accounts)
      }))
      .reverse();

    return {
      sumGjeld,
      monthlyChange,
      dekning,
      remaining,
      loans,
      history
    };
  } catch (error) {
    console.error('Error fetching gjeld data:', error);
    throw error;
  }
}

/**
 * Hook to fetch and calculate gjeld/debt data
 *
 * Fetches all snapshots from the portfolio API and calculates:
 * - Total debt (sum of gjeld accounts)
 * - Monthly change in debt
 * - Coverage ratio (dekning) - what % of debt is covered by savings
 * - Remaining uncovered debt
 * - List of individual loans
 * - Historical data for charting
 *
 * @returns TanStack Query result with gjeld data
 */
export function useGjeldData() {
  return useQuery({
    queryKey: ['gjeld'],
    queryFn: fetchGjeldData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1
  });
}
