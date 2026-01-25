import type { MonthlySnapshot, Account } from '@/shared/types';

/**
 * Test fixtures for mock data
 */

export function createMockAccount(overrides?: Partial<Account>): Account {
  return {
    id: 'acc-1',
    name: 'Test Account',
    assetClass: 'aksjer',
    value: 100000,
    ...overrides,
  };
}

export function createMockSnapshot(overrides?: Partial<MonthlySnapshot>): MonthlySnapshot {
  return {
    id: 'snap-1',
    userId: 'user-1',
    date: '01.01.2024',
    accounts: [
      createMockAccount({ id: 'acc-1', name: 'Aksjer', assetClass: 'aksjer', value: 100000 }),
      createMockAccount({ id: 'acc-2', name: 'Fond', assetClass: 'fond', value: 50000 }),
      createMockAccount({ id: 'acc-3', name: 'Gjeld', assetClass: 'gjeld', value: -200000 }),
      createMockAccount({ id: 'acc-4', name: 'Pensjon', assetClass: 'pensjon', value: 75000 }),
    ],
    totalNetWorth: -50000,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

export function createMockSnapshots(count: number): MonthlySnapshot[] {
  return Array.from({ length: count }, (_, i) => {
    const month = i + 1;
    const dateStr = `01.${month.toString().padStart(2, '0')}.2024`;
    const baseValue = 100000;
    const growth = i * 10000;

    return createMockSnapshot({
      id: `snap-${i + 1}`,
      date: dateStr,
      accounts: [
        createMockAccount({
          id: 'acc-1',
          name: 'Aksjer',
          assetClass: 'aksjer',
          value: baseValue + growth
        }),
        createMockAccount({
          id: 'acc-2',
          name: 'Fond',
          assetClass: 'fond',
          value: 50000 + growth / 2
        }),
        createMockAccount({
          id: 'acc-3',
          name: 'Gjeld',
          assetClass: 'gjeld',
          value: -(200000 - growth)
        }),
        createMockAccount({
          id: 'acc-4',
          name: 'Pensjon',
          assetClass: 'pensjon',
          value: 75000 + growth / 3
        }),
      ],
      totalNetWorth: baseValue + growth + (50000 + growth / 2) - (200000 - growth) + (75000 + growth / 3),
    });
  });
}

export const mockUserData = {
  id: 'user-1',
  email: 'test@example.com',
  nickname: 'Test User',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  profile: {
    monthlySalary: 50000,
    monthlySavings: 10000,
    birthYear: 1989,
    plannedRetirementAge: 67,
  },
  accounts: [],
};

export function createMockUser(overrides?: any) {
  return {
    ...mockUserData,
    ...overrides,
  };
}

export const mockSparingData = {
  sumSavings: 250000,
  savingsRate: 20,
  monthsFree: 6.25,
  fireNumber: 12000000,
  fireProgress: 2.08,
  history: [
    { date: '01.01.2024', value: 150000 },
    { date: '01.02.2024', value: 160000 },
    { date: '01.03.2024', value: 175000 },
    { date: '01.04.2024', value: 190000 },
    { date: '01.05.2024', value: 210000 },
    { date: '01.06.2024', value: 250000 },
  ],
};

export const mockGjeldData = {
  totalDebt: 200000,
  coverage: 125,
  remaining: 0,
  loans: [
    { name: 'Boliglån', value: -150000 },
    { name: 'Studielån', value: -50000 },
  ],
  history: [
    { date: '01.01.2024', value: 250000 },
    { date: '01.02.2024', value: 240000 },
    { date: '01.03.2024', value: 230000 },
    { date: '01.04.2024', value: 220000 },
    { date: '01.05.2024', value: 210000 },
    { date: '01.06.2024', value: 200000 },
  ],
};
