/**
 * Demo Service
 *
 * Handles demo user creation and data reset.
 * Demo user is shared across all demo sessions.
 */

import { getUsersContainer, getPortfoliosContainer } from '../config/cosmosdb';
import { logger } from '../utils/logger';

// Demo user constant ID
export const DEMO_USER_ID = 'demo-user-finans';
const DEMO_USER_EMAIL = 'demo@finans.no';
const DEMO_USER_NICKNAME = 'DemoUser';

/**
 * Demo user seed data structure
 */
interface DemoSeedData {
  user: {
    id: string;
    nickname: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    profile: {
      monthlySalary: number;
      annualExpenses: number;
      birthYear: number;
      plannedRetirementAge: number;
      fireNumber: number;
    };
    accounts: Array<{
      id: string;
      name: string;
      category: 'sparing' | 'gjeld' | 'pensjon';
      isActive: boolean;
      sortOrder: number;
      createdAt: string;
      loanDetails?: {
        interestRate: number;
        remainingYears: number;
      };
    }>;
  };
  snapshots: Array<{
    id: string;
    userId: string;
    date: string;
    accounts: Array<{
      id: string;
      name: string;
      assetClass: string;
      value: number;
    }>;
    totalNetWorth: number;
    createdAt: string;
    updatedAt: string;
  }>;
}

/**
 * Generate demo seed data with 12 months of history
 */
function generateDemoSeedData(): DemoSeedData {
  const now = new Date();
  const createdAt = now.toISOString();

  // Demo accounts
  const accounts = [
    { id: 'demo-acc-aksjer', name: 'Aksjer', category: 'sparing' as const, isActive: true, sortOrder: 1 },
    { id: 'demo-acc-fond', name: 'Fond', category: 'sparing' as const, isActive: true, sortOrder: 2 },
    { id: 'demo-acc-bank', name: 'Bankkonto', category: 'sparing' as const, isActive: true, sortOrder: 3 },
    { id: 'demo-acc-krypto', name: 'Krypto', category: 'sparing' as const, isActive: true, sortOrder: 4 },
    { id: 'demo-acc-boliglan', name: 'Boliglån', category: 'gjeld' as const, isActive: true, sortOrder: 1, loanDetails: { interestRate: 4.5, remainingYears: 22 } },
    { id: 'demo-acc-studielan', name: 'Studielån', category: 'gjeld' as const, isActive: true, sortOrder: 2, loanDetails: { interestRate: 2.5, remainingYears: 8 } },
    { id: 'demo-acc-otp', name: 'Arbeidsgiver (OTP)', category: 'pensjon' as const, isActive: true, sortOrder: 1 },
    { id: 'demo-acc-nav', name: 'Folketrygden (NAV)', category: 'pensjon' as const, isActive: true, sortOrder: 2 },
  ];

  // Demo user
  const user = {
    id: DEMO_USER_ID,
    nickname: DEMO_USER_NICKNAME,
    email: DEMO_USER_EMAIL,
    createdAt,
    updatedAt: createdAt,
    profile: {
      monthlySalary: 55000,
      annualExpenses: 420000,
      birthYear: 1990,
      plannedRetirementAge: 62,
      fireNumber: 10500000, // 25x expenses
    },
    accounts: accounts.map((acc) => ({
      ...acc,
      createdAt,
    })),
  };

  // Generate 12 months of snapshots (growing trend)
  const snapshots: DemoSeedData['snapshots'] = [];
  const baseValues = {
    aksjer: 350000,
    fond: 280000,
    bank: 85000,
    krypto: 45000,
    boliglan: -2800000,
    studielan: -180000,
    otp: 420000,
    nav: 180000,
  };

  for (let i = 11; i >= 0; i--) {
    const snapshotDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const dateStr = snapshotDate.toLocaleDateString('nb-NO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).replace(/\//g, '.');

    // Growth factor (older months have lower values)
    const growthFactor = 1 - (i * 0.02); // ~2% monthly growth
    const randomVariance = () => 1 + (Math.random() - 0.5) * 0.03; // ±1.5% variance

    const snapshotAccounts = [
      { id: 'demo-acc-aksjer', name: 'Aksjer', assetClass: 'aksjer', value: Math.round(baseValues.aksjer * growthFactor * randomVariance()) },
      { id: 'demo-acc-fond', name: 'Fond', assetClass: 'fond', value: Math.round(baseValues.fond * growthFactor * randomVariance()) },
      { id: 'demo-acc-bank', name: 'Bankkonto', assetClass: 'bankkonto', value: Math.round(baseValues.bank * growthFactor * randomVariance()) },
      { id: 'demo-acc-krypto', name: 'Krypto', assetClass: 'krypto', value: Math.round(baseValues.krypto * growthFactor * randomVariance()) },
      { id: 'demo-acc-boliglan', name: 'Boliglån', assetClass: 'gjeld', value: Math.round(baseValues.boliglan * (1 + i * 0.003)) }, // Debt decreases
      { id: 'demo-acc-studielan', name: 'Studielån', assetClass: 'gjeld', value: Math.round(baseValues.studielan * (1 + i * 0.005)) },
      { id: 'demo-acc-otp', name: 'Arbeidsgiver (OTP)', assetClass: 'pensjon', value: Math.round(baseValues.otp * growthFactor * randomVariance()) },
      { id: 'demo-acc-nav', name: 'Folketrygden (NAV)', assetClass: 'pensjon', value: Math.round(baseValues.nav * growthFactor * randomVariance()) },
    ];

    const totalNetWorth = snapshotAccounts.reduce((sum, acc) => sum + acc.value, 0);

    snapshots.push({
      id: `demo-snap-${snapshotDate.getFullYear()}-${String(snapshotDate.getMonth() + 1).padStart(2, '0')}`,
      userId: DEMO_USER_ID,
      date: dateStr,
      accounts: snapshotAccounts,
      totalNetWorth,
      createdAt,
      updatedAt: createdAt,
    });
  }

  return { user, snapshots };
}

/**
 * Delete all demo user data (user + snapshots)
 */
async function deleteDemoData(): Promise<void> {
  const usersContainer = getUsersContainer();
  const portfoliosContainer = getPortfoliosContainer();

  try {
    // Delete demo user
    try {
      await usersContainer.item(DEMO_USER_ID, DEMO_USER_ID).delete();
      logger.debug('Deleted demo user');
    } catch (error: any) {
      if (error.code !== 404) {
        throw error;
      }
      // User doesn't exist, that's fine
    }

    // Delete all demo snapshots
    const { resources: snapshots } = await portfoliosContainer.items
      .query({
        query: 'SELECT c.id FROM c WHERE c.userId = @userId',
        parameters: [{ name: '@userId', value: DEMO_USER_ID }],
      })
      .fetchAll();

    for (const snapshot of snapshots) {
      await portfoliosContainer.item(snapshot.id, DEMO_USER_ID).delete();
    }

    logger.debug('Deleted demo snapshots', { count: snapshots.length });
  } catch (error) {
    logger.error('Error deleting demo data', { error });
    throw error;
  }
}

/**
 * Seed demo user data with fresh values
 */
async function seedDemoData(): Promise<DemoSeedData> {
  const usersContainer = getUsersContainer();
  const portfoliosContainer = getPortfoliosContainer();
  const seedData = generateDemoSeedData();

  try {
    // Create demo user
    await usersContainer.items.create(seedData.user);
    logger.debug('Created demo user');

    // Create demo snapshots
    for (const snapshot of seedData.snapshots) {
      await portfoliosContainer.items.create(snapshot);
    }
    logger.debug('Created demo snapshots', { count: seedData.snapshots.length });

    return seedData;
  } catch (error) {
    logger.error('Error seeding demo data', { error });
    throw error;
  }
}

/**
 * Reset demo user - deletes all existing data and creates fresh seed data
 */
export async function resetDemoUser(): Promise<{
  user: DemoSeedData['user'];
  snapshotCount: number;
}> {
  logger.info('Resetting demo user data');

  // Delete existing data
  await deleteDemoData();

  // Seed fresh data
  const seedData = await seedDemoData();

  logger.info('Demo user reset complete', {
    userId: seedData.user.id,
    snapshotCount: seedData.snapshots.length,
  });

  return {
    user: seedData.user,
    snapshotCount: seedData.snapshots.length,
  };
}

/**
 * Get demo user (creates if doesn't exist)
 */
export async function getDemoUser(): Promise<DemoSeedData['user'] | null> {
  const usersContainer = getUsersContainer();

  try {
    const { resource } = await usersContainer.item(DEMO_USER_ID, DEMO_USER_ID).read();
    return resource || null;
  } catch (error: any) {
    if (error.code === 404) {
      return null;
    }
    throw error;
  }
}
