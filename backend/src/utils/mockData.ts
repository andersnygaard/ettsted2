/**
 * Mock Data for CI Testing
 *
 * Provides static mock data for API endpoints when running in CI_MOCK_MODE.
 * This allows E2E tests to run without a database connection.
 */

import { User, UserProfile, AccountConfig } from '../models/User';
import { MonthlySnapshot, Account } from '../models/Portfolio';

const mockUserId = 'ci-mock-user-001';

export const mockUser: User = {
  id: mockUserId,
  nickname: 'CI Test User',
  email: 'ci-test@finans.no',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-12-01'),
  profile: {
    monthlySalary: 65000,
    monthlySavings: 15000,
    birthYear: 1990,
    plannedRetirementAge: 62,
    fireNumber: 10000000,
  } as UserProfile,
  accounts: [
    { id: 'acc-nordnet', name: 'Nordnet', category: 'sparing', isActive: true, sortOrder: 1, createdAt: new Date() },
    { id: 'acc-fond', name: 'Fond', category: 'sparing', isActive: true, sortOrder: 2, createdAt: new Date() },
    { id: 'acc-bank', name: 'Bankkonto', category: 'sparing', isActive: true, sortOrder: 3, createdAt: new Date() },
    { id: 'acc-boliglan', name: 'Boliglån', category: 'gjeld', isActive: true, sortOrder: 1, createdAt: new Date(), loanDetails: { interestRate: 5.5, remainingYears: 20 } },
    { id: 'acc-otp', name: 'OTP', category: 'pensjon', isActive: true, sortOrder: 1, createdAt: new Date() },
    { id: 'acc-nav', name: 'NAV', category: 'pensjon', isActive: true, sortOrder: 2, createdAt: new Date() },
  ] as AccountConfig[],
};

// Generate 12 months of mock snapshots
function generateMockSnapshots(): MonthlySnapshot[] {
  const snapshots: MonthlySnapshot[] = [];
  const baseDate = new Date('2024-01-01');

  for (let i = 0; i < 12; i++) {
    const date = new Date(baseDate);
    date.setMonth(date.getMonth() + i);
    const dateStr = `01.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;

    // Simulate growth over time
    const growthFactor = 1 + (i * 0.02);

    const accounts: Account[] = [
      { id: 'acc-nordnet', name: 'Nordnet', assetClass: 'aksjer', value: Math.round(500000 * growthFactor) },
      { id: 'acc-fond', name: 'Fond', assetClass: 'fond', value: Math.round(300000 * growthFactor) },
      { id: 'acc-bank', name: 'Bankkonto', assetClass: 'bankkonto', value: Math.round(150000 + i * 10000) },
      { id: 'acc-boliglan', name: 'Boliglån', assetClass: 'lån', value: -Math.round(2500000 - i * 8000) },
      { id: 'acc-otp', name: 'OTP', assetClass: 'pensjon', value: Math.round(400000 * growthFactor) },
      { id: 'acc-nav', name: 'NAV', assetClass: 'pensjon', value: Math.round(200000 * growthFactor) },
    ];

    const totalNetWorth = accounts.reduce((sum, acc) => sum + acc.value, 0);

    snapshots.push({
      id: `snap-2024-${String(i + 1).padStart(2, '0')}`,
      userId: mockUserId,
      date: dateStr,
      accounts,
      totalNetWorth,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  return snapshots;
}

export const mockSnapshots = generateMockSnapshots();

// Get latest snapshot for summary calculations
export const latestSnapshot = mockSnapshots[mockSnapshots.length - 1];

// Calculate mock summary data
export function getMockOversikt() {
  const sparingTotal = latestSnapshot.accounts
    .filter(a => a.assetClass !== 'lån' && a.assetClass !== 'pensjon')
    .reduce((sum, a) => sum + a.value, 0);

  const gjeldTotal = Math.abs(latestSnapshot.accounts
    .filter(a => a.assetClass === 'lån')
    .reduce((sum, a) => sum + a.value, 0));

  const pensjonTotal = latestSnapshot.accounts
    .filter(a => a.assetClass === 'pensjon')
    .reduce((sum, a) => sum + a.value, 0);

  return {
    nettoFormue: latestSnapshot.totalNetWorth,
    sparing: sparingTotal,
    gjeld: gjeldTotal,
    pensjon: pensjonTotal,
    sparerate: Math.round((mockUser.profile!.monthlySavings / mockUser.profile!.monthlySalary) * 100),
    fireProgress: Math.round((sparingTotal / (mockUser.profile!.fireNumber || 10000000)) * 100),
    dekning: Math.round((sparingTotal / gjeldTotal) * 100),
  };
}

export function getMockSparing() {
  const accounts = latestSnapshot.accounts.filter(a =>
    a.assetClass !== 'lån' && a.assetClass !== 'pensjon'
  );
  const sumSavings = accounts.reduce((sum, a) => sum + a.value, 0);
  const savingsRate = Math.round(
    (mockUser.profile!.monthlySavings / mockUser.profile!.monthlySalary) * 100
  );

  return {
    sumSavings,
    savingsRate,
    fireNumber: mockUser.profile!.fireNumber || 10000000,
    fireProgress: Math.round((sumSavings / (mockUser.profile!.fireNumber || 10000000)) * 100),
    monthsFree: Math.round(sumSavings / ((mockUser.profile!.monthlySalary - mockUser.profile!.monthlySavings) || 1)),
    history: mockSnapshots.map(s => ({
      date: s.date,
      value: s.accounts
        .filter(a => a.assetClass !== 'lån' && a.assetClass !== 'pensjon')
        .reduce((sum, a) => sum + a.value, 0),
    })),
  };
}

export function getMockGjeld() {
  const accounts = latestSnapshot.accounts.filter(a => a.assetClass === 'lån');
  const total = Math.abs(accounts.reduce((sum, a) => sum + a.value, 0));
  const sparingTotal = latestSnapshot.accounts
    .filter(a => a.assetClass !== 'lån' && a.assetClass !== 'pensjon')
    .reduce((sum, a) => sum + a.value, 0);

  return {
    total,
    accounts: accounts.map(a => ({ ...a, value: Math.abs(a.value) })),
    dekning: Math.round((sparingTotal / total) * 100),
    history: mockSnapshots.map(s => ({
      date: s.date,
      total: Math.abs(s.accounts
        .filter(a => a.assetClass === 'lån')
        .reduce((sum, a) => sum + a.value, 0)),
    })),
  };
}

export function getMockPensjon() {
  const accounts = latestSnapshot.accounts.filter(a => a.assetClass === 'pensjon');
  const total = accounts.reduce((sum, a) => sum + a.value, 0);

  return {
    total,
    accounts,
    history: mockSnapshots.map(s => ({
      date: s.date,
      total: s.accounts
        .filter(a => a.assetClass === 'pensjon')
        .reduce((sum, a) => sum + a.value, 0),
    })),
  };
}
