import { useMemo } from 'react';
import type { ColumnGroup, Column } from '@finans/components';
import type { AccountConfig } from '@/features/auth/types';

const CATEGORY_COLORS: Record<string, string> = {
  sparing: '#5a6d7a',
  gjeld: '#8a7060',
  pensjon: '#6a7a60',
};

const CATEGORY_LABELS: Record<string, string> = {
  sparing: 'Sparing',
  gjeld: 'Gjeld',
  pensjon: 'Pensjon',
};

// Map category to sum column ID (English naming)
export const CATEGORY_SUM_IDS: Record<string, string> = {
  sparing: 'sumSavings',
  gjeld: 'sumGjeld',
  pensjon: 'sumPensjon',
};

export function usePortfolioColumns(accounts: AccountConfig[] | undefined): ColumnGroup[] {
  return useMemo(() => {
    if (!accounts) return [];

    const categories: ('sparing' | 'gjeld' | 'pensjon')[] = ['sparing', 'gjeld', 'pensjon'];

    return categories.map((category) => {
      const categoryAccounts = accounts
        .filter((acc) => acc.category === category && acc.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder);

      const columns: Column[] = categoryAccounts.map((acc) => ({
        id: acc.id,
        label: acc.name,
      }));

      // Add sum column
      columns.push({
        id: CATEGORY_SUM_IDS[category],
        label: `Sum ${CATEGORY_LABELS[category].toLowerCase()}`,
        isTotal: true,
      });

      return {
        id: category,
        label: CATEGORY_LABELS[category],
        color: CATEGORY_COLORS[category],
        columns,
      };
    });
  }, [accounts]);
}
