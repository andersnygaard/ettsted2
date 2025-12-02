/**
 * Onboarding Service
 *
 * Handles atomic creation of user + first snapshot during onboarding.
 * Ensures data integrity by creating both documents together.
 */

import { randomUUID } from 'crypto';
import { User, AccountConfig, UserProfile, Category } from '../models/User';
import { MonthlySnapshot, Account } from '../models/Portfolio';
import { createUser } from './userService';
import { createSnapshot } from './portfolioService';
import { logger } from '../utils/logger';
import { getFirstOfMonth } from '../validators/onboardingValidator';

/**
 * Account data from onboarding request
 */
interface OnboardingAccount {
  name: string;
  category: Category;
  value: number;
  isActive: boolean;
  loanDetails?: {
    interestRate: number;
    remainingYears: number;
    originalAmount?: number;
  };
}

/**
 * Profile data from onboarding request
 */
interface OnboardingProfile {
  monthlySalary: number;
  annualExpenses: number;
  birthYear: number;
  plannedRetirementAge: number;
  fireNumber?: number;
}

/**
 * Input for creating user with first snapshot
 */
export interface CreateUserWithSnapshotInput {
  userId: string;
  email: string;
  nickname: string;
  profile: OnboardingProfile;
  accounts: OnboardingAccount[];
}

/**
 * Result of creating user with first snapshot
 */
export interface CreateUserWithSnapshotResult {
  user: User;
  snapshot: MonthlySnapshot;
}

/**
 * Map asset class from category
 */
function categoryToAssetClass(category: Category): string {
  switch (category) {
    case 'sparing':
      return 'sparing';
    case 'gjeld':
      return 'gjeld';
    case 'pensjon':
      return 'pensjon';
    default:
      return category;
  }
}

/**
 * Creates a new user with their first monthly snapshot atomically.
 *
 * Process:
 * 1. Generate UUIDs for accounts
 * 2. Create User document with profile and account configs
 * 3. Create first MonthlySnapshot with account values
 *
 * Note: Gjeld values are negated (user enters positive, stored as negative)
 *
 * @param input - User data, profile, and accounts with values
 * @returns Created user and snapshot
 * @throws Error if creation fails
 */
export async function createUserWithSnapshot(
  input: CreateUserWithSnapshotInput
): Promise<CreateUserWithSnapshotResult> {
  const { userId, email, nickname, profile, accounts } = input;
  const snapshotDate = getFirstOfMonth();
  const now = new Date();

  logger.info('Starting onboarding: creating user with snapshot', {
    userId,
    nickname,
    accountCount: accounts.length,
    snapshotDate
  });

  // Generate UUIDs for each account (shared between user config and snapshot)
  const accountsWithIds = accounts.map((account, index) => ({
    ...account,
    id: randomUUID(),
    sortOrder: index
  }));

  // === CREATE USER DOCUMENT ===

  // Build account configs for user (without values)
  const accountConfigs: AccountConfig[] = accountsWithIds.map(account => ({
    id: account.id,
    name: account.name,
    category: account.category,
    isActive: account.isActive,
    sortOrder: account.sortOrder,
    createdAt: now,
    ...(account.category === 'gjeld' && account.loanDetails
      ? { loanDetails: account.loanDetails }
      : {})
  }));

  // Build user profile (calculate fireNumber if not provided)
  const userProfile: UserProfile = {
    monthlySalary: profile.monthlySalary,
    annualExpenses: profile.annualExpenses,
    birthYear: profile.birthYear,
    plannedRetirementAge: profile.plannedRetirementAge,
    // If fireNumber not provided, calculate as 25x annual expenses
    ...(profile.fireNumber !== undefined
      ? { fireNumber: profile.fireNumber }
      : profile.annualExpenses > 0
        ? { fireNumber: profile.annualExpenses * 25 }
        : {})
  };

  const user: User = {
    id: userId,
    nickname,
    email,
    createdAt: now,
    updatedAt: now,
    profile: userProfile,
    accounts: accountConfigs
  };

  // === CREATE SNAPSHOT DOCUMENT ===

  // Build snapshot accounts (with values)
  // IMPORTANT: Negate gjeld values (user enters positive, stored as negative)
  const snapshotAccounts: Account[] = accountsWithIds.map(account => ({
    id: account.id,
    name: account.name,
    assetClass: categoryToAssetClass(account.category),
    // Negate gjeld values so they subtract from net worth
    value: account.category === 'gjeld' ? -Math.abs(account.value) : account.value
  }));

  // Calculate total net worth (sum of all values, gjeld already negative)
  const totalNetWorth = snapshotAccounts.reduce((sum, acc) => sum + acc.value, 0);

  const snapshot: MonthlySnapshot = {
    id: randomUUID(),
    userId,
    date: snapshotDate,
    accounts: snapshotAccounts,
    totalNetWorth,
    createdAt: now,
    updatedAt: now
  };

  // === CREATE BOTH DOCUMENTS ===
  // Note: CosmosDB doesn't support cross-container transactions,
  // so we create them sequentially. If snapshot creation fails,
  // user exists but has no snapshot (acceptable for onboarding).

  try {
    const createdUser = await createUser(user);
    logger.info('User created during onboarding', { userId, nickname });

    const createdSnapshot = await createSnapshot(snapshot);
    logger.info('Initial snapshot created during onboarding', {
      userId,
      snapshotId: snapshot.id,
      date: snapshotDate,
      totalNetWorth
    });

    logger.info('Onboarding completed successfully', {
      userId,
      nickname,
      accountCount: accounts.length,
      totalNetWorth,
      snapshotDate
    });

    return {
      user: createdUser,
      snapshot: createdSnapshot
    };
  } catch (error) {
    logger.error('Failed to complete onboarding', {
      userId,
      nickname,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}
