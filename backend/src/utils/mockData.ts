/**
 * Mock Data for CI Testing
 *
 * Provides hardcoded mock data for E2E tests in CI environment
 * where CosmosDB is not available.
 */

import { User } from '../models/User';
import { MonthlySnapshot } from '../models/Portfolio';

const DEMO_USER_ID = 'demo-user-001';

/**
 * Mock demo user
 */
export const mockUser: User = {
  id: DEMO_USER_ID,
  nickname: 'Demo Bruker',
  email: 'demo@finans.no',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-12-01'),
  profile: {
    monthlySalary: 55000,
    annualExpenses: 400000,
    birthYear: 1990,
    plannedRetirementAge: 60,
    fireNumber: 10000000,
  },
  accounts: [
    {
      id: 'demo-acc-nordnet',
      name: 'Nordnet',
      category: 'sparing',
      isActive: true,
      sortOrder: 1,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: 'demo-acc-kron',
      name: 'Kron',
      category: 'sparing',
      isActive: true,
      sortOrder: 2,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: 'demo-acc-sparekonto',
      name: 'Sparekonto',
      category: 'sparing',
      isActive: true,
      sortOrder: 3,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: 'demo-acc-huslan',
      name: 'Boliglån',
      category: 'gjeld',
      isActive: true,
      sortOrder: 1,
      createdAt: new Date('2024-01-01'),
      loanDetails: {
        interestRate: 5.0,
        remainingYears: 25,
        originalAmount: 3000000,
      },
    },
    {
      id: 'demo-acc-arbeidsgiver',
      name: 'Arbeidsgiver',
      category: 'pensjon',
      isActive: true,
      sortOrder: 1,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: 'demo-acc-folketrygden',
      name: 'Folketrygden',
      category: 'pensjon',
      isActive: true,
      sortOrder: 2,
      createdAt: new Date('2024-01-01'),
    },
  ],
};

/**
 * Generate mock snapshots for testing
 */
function generateMockSnapshots(): MonthlySnapshot[] {
  const snapshots: MonthlySnapshot[] = [];

  // Generate 12 months of data
  const baseValues = {
    nordnet: 280000,
    kron: 520000,
    sparekonto: 95000,
    huslan: -2400000,
    arbeidsgiver: 450000,
    folketrygden: 380000,
  };

  for (let i = 0; i < 12; i++) {
    const date = new Date(2024, 11 + i, 1);
    const dateStr = `01.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
    const monthId = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    const growthFactor = 1.01 + i * 0.002;
    const nordnetValue = Math.round(baseValues.nordnet * growthFactor);
    const kronValue = Math.round(baseValues.kron * growthFactor);
    const sparekontoValue = Math.round(baseValues.sparekonto + i * 2000);
    const huslanValue = Math.round(baseValues.huslan + i * 4000);
    const arbeidsgiverValue = Math.round(baseValues.arbeidsgiver * (1 + i * 0.005) + i * 3000);
    const folketrygdenValue = Math.round(baseValues.folketrygden + i * 1500);

    const sparingSum = nordnetValue + kronValue + sparekontoValue;
    const gjeldSum = huslanValue;
    const pensjonSum = arbeidsgiverValue + folketrygdenValue;
    const totalNetWorth = sparingSum + gjeldSum + pensjonSum;

    snapshots.push({
      id: `demo-snap-${monthId}`,
      userId: DEMO_USER_ID,
      date: dateStr,
      accounts: [
        { id: 'demo-acc-nordnet', name: 'Nordnet', assetClass: 'aksjer', value: nordnetValue },
        { id: 'demo-acc-kron', name: 'Kron', assetClass: 'fond', value: kronValue },
        { id: 'demo-acc-sparekonto', name: 'Sparekonto', assetClass: 'bankkonto', value: sparekontoValue },
        { id: 'demo-acc-huslan', name: 'Boliglån', assetClass: 'gjeld', value: huslanValue },
        { id: 'demo-acc-arbeidsgiver', name: 'Arbeidsgiver', assetClass: 'pensjon', value: arbeidsgiverValue },
        { id: 'demo-acc-folketrygden', name: 'Folketrygden', assetClass: 'pensjon', value: folketrygdenValue },
      ],
      totalNetWorth,
      createdAt: new Date('2024-12-01'),
      updatedAt: new Date('2024-12-01'),
    });
  }

  return snapshots;
}

export const mockSnapshots = generateMockSnapshots();

/**
 * Get latest mock snapshot
 */
export function getLatestMockSnapshot(): MonthlySnapshot {
  return mockSnapshots[mockSnapshots.length - 1];
}

/**
 * Calculate mock aggregated data
 */
export function getMockAggregatedData() {
  const latest = getLatestMockSnapshot();
  const previous = mockSnapshots.length > 1 ? mockSnapshots[mockSnapshots.length - 2] : latest;

  const sparingAccounts = latest.accounts.filter(a =>
    ['aksjer', 'fond', 'bankkonto', 'krypto'].includes(a.assetClass)
  );
  const gjeldAccounts = latest.accounts.filter(a => a.assetClass === 'gjeld');
  const pensjonAccounts = latest.accounts.filter(a => a.assetClass === 'pensjon');

  const sumSparing = sparingAccounts.reduce((sum, a) => sum + a.value, 0);
  const sumGjeld = Math.abs(gjeldAccounts.reduce((sum, a) => sum + a.value, 0));
  const sumPensjon = pensjonAccounts.reduce((sum, a) => sum + a.value, 0);

  return {
    dashboard: {
      nettoFormue: latest.totalNetWorth,
      endringManed: latest.totalNetWorth - previous.totalNetWorth,
      endringProsent: ((latest.totalNetWorth - previous.totalNetWorth) / Math.abs(previous.totalNetWorth)) * 100,
      sumSparing,
      sumGjeld,
      sumPensjon,
      dekning: (sumSparing / sumGjeld) * 100,
      sparerate: 25,
      firetall: mockUser.profile?.fireNumber || 10000000,
      fremgang: (sumSparing / (mockUser.profile?.fireNumber || 10000000)) * 100,
    },
    sparing: {
      total: sumSparing,
      accounts: sparingAccounts,
      history: mockSnapshots.map(s => ({
        date: s.date,
        value: s.accounts
          .filter(a => ['aksjer', 'fond', 'bankkonto', 'krypto'].includes(a.assetClass))
          .reduce((sum, a) => sum + a.value, 0),
      })),
    },
    gjeld: {
      total: sumGjeld,
      accounts: gjeldAccounts.map(a => ({ ...a, value: Math.abs(a.value) })),
      dekning: (sumSparing / sumGjeld) * 100,
      history: mockSnapshots.map(s => ({
        date: s.date,
        value: Math.abs(
          s.accounts
            .filter(a => a.assetClass === 'gjeld')
            .reduce((sum, a) => sum + a.value, 0)
        ),
      })),
    },
    pensjon: {
      total: sumPensjon,
      accounts: pensjonAccounts,
      history: mockSnapshots.map(s => ({
        date: s.date,
        value: s.accounts
          .filter(a => a.assetClass === 'pensjon')
          .reduce((sum, a) => sum + a.value, 0),
      })),
    },
  };
}
