/**
 * User Service
 *
 * Provides CRUD operations for User documents in CosmosDB.
 * All operations use parameterized queries to prevent NoSQL injection.
 */

import { randomUUID } from 'crypto';
import { getUsersContainer, getPortfoliosContainer } from '../config/cosmosdb';
import { User, Category } from '../models/User';
import { MonthlySnapshot, Account } from '../models/Portfolio';
import { logger } from '../utils/logger';
import {
  handleCosmosError,
  isNotFoundError,
  buildParameterizedQuery,
} from '../utils/cosmosHelpers';
import { calculateNetWorth } from './calculationService';
import { getFirstOfMonth } from '../validators/onboardingValidator';

/**
 * Account data with value for updating snapshots
 */
export interface AccountWithValue {
  id: string;
  name: string;
  category: Category;
  value: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string | Date;
  loanDetails?: {
    interestRate: number;
    remainingYears: number;
    originalAmount?: number;
  };
}

/**
 * Create a new user
 *
 * @param user - User document to create
 * @returns Created user document
 * @throws ConflictError if user with same id already exists
 * @throws DatabaseError if operation fails
 */
export async function createUser(user: User): Promise<User> {
  try {
    const container = getUsersContainer();
    const { resource } = await container.items.create(user);
    logger.info('User created successfully', { userId: user.id, nickname: user.nickname });
    return resource as User;
  } catch (error) {
    logger.error('Failed to create user', { userId: user.id, error });
    throw handleCosmosError(error);
  }
}

/**
 * Get user by ID
 *
 * @param userId - User ID (partition key)
 * @returns User document or null if not found
 * @throws DatabaseError if operation fails
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const container = getUsersContainer();
    const { resource } = await container.item(userId, userId).read<User>();
    return resource || null;
  } catch (error) {
    if (isNotFoundError(error)) {
      return null;
    }
    logger.error('Failed to get user by ID', { userId, error });
    throw handleCosmosError(error);
  }
}

/**
 * Get user by nickname
 *
 * Uses parameterized query to prevent NoSQL injection.
 * Note: This is a cross-partition query (slower and more expensive).
 *
 * @param nickname - Nickname to search for
 * @returns User document or null if not found
 * @throws DatabaseError if operation fails
 */
export async function getUserByNickname(nickname: string): Promise<User | null> {
  try {
    const container = getUsersContainer();
    const querySpec = buildParameterizedQuery(
      'SELECT * FROM users u WHERE u.nickname = @nickname',
      { nickname }
    );

    const { resources } = await container.items.query<User>(querySpec).fetchAll();

    if (resources.length === 0) {
      return null;
    }

    // Return first match (nickname should be unique)
    return resources[0];
  } catch (error) {
    logger.error('Failed to get user by nickname', { nickname, error });
    throw handleCosmosError(error);
  }
}

/**
 * Update user
 *
 * When accounts are updated, detects removed accounts and hard-deletes them
 * from all snapshots to ensure calculations are correct.
 *
 * @param userId - User ID (partition key)
 * @param updates - Partial user object with fields to update
 * @returns Updated user document
 * @throws NotFoundError if user doesn't exist
 * @throws DatabaseError if operation fails
 */
export async function updateUser(
  userId: string,
  updates: Partial<Omit<User, 'id' | 'createdAt'>>
): Promise<User> {
  try {
    const container = getUsersContainer();

    // Read existing user
    const { resource: existingUser } = await container.item(userId, userId).read<User>();
    if (!existingUser) {
      throw new Error('User not found');
    }

    // Detect removed accounts if accounts are being updated
    let removedAccountIds: string[] = [];
    if (updates.accounts) {
      const newAccountIds = new Set(updates.accounts.map((a) => a.id));
      removedAccountIds = existingUser.accounts
        .filter((a) => !newAccountIds.has(a.id))
        .map((a) => a.id);
    }

    // Merge updates (preserve id and createdAt, deep-merge profile)
    const updatedUser: User = {
      ...existingUser,
      ...updates,
      // Deep-merge profile if provided
      profile: updates.profile
        ? { ...existingUser.profile, ...updates.profile }
        : existingUser.profile,
      id: existingUser.id, // Ensure id is not changed
      createdAt: existingUser.createdAt, // Ensure createdAt is not changed
      updatedAt: new Date(), // Always update timestamp
    };

    // Replace the document
    const { resource } = await container.item(userId, userId).replace(updatedUser);
    logger.info('User updated successfully', { userId, updates: Object.keys(updates) });

    // Hard-delete removed accounts from all snapshots
    if (removedAccountIds.length > 0) {
      await removeAccountsFromSnapshots(userId, removedAccountIds);
    }

    return resource as User;
  } catch (error) {
    logger.error('Failed to update user', { userId, error });
    throw handleCosmosError(error);
  }
}

/**
 * Remove accounts from all snapshots for a user
 *
 * @param userId - User ID
 * @param accountIds - Account IDs to remove
 */
async function removeAccountsFromSnapshots(
  userId: string,
  accountIds: string[]
): Promise<void> {
  const portfoliosContainer = getPortfoliosContainer();
  const accountIdSet = new Set(accountIds);

  const { resources: snapshots } = await portfoliosContainer.items
    .query<MonthlySnapshot>({
      query: 'SELECT * FROM portfolios p WHERE p.userId = @userId',
      parameters: [{ name: '@userId', value: userId }],
    })
    .fetchAll();

  let snapshotsUpdated = 0;
  for (const snapshot of snapshots) {
    const hadRemovedAccount = snapshot.accounts.some((a) => accountIdSet.has(a.id));
    if (hadRemovedAccount) {
      snapshot.accounts = snapshot.accounts.filter((a) => !accountIdSet.has(a.id));
      snapshot.totalNetWorth = calculateNetWorth(snapshot.accounts);
      snapshot.updatedAt = new Date();
      await portfoliosContainer.item(snapshot.id, userId).replace(snapshot);
      snapshotsUpdated++;
    }
  }

  logger.info('Accounts removed from snapshots', {
    userId,
    accountIds,
    snapshotsUpdated,
  });
}

/**
 * Map category to asset class for snapshot accounts
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
 * Update user with accounts including values
 *
 * Updates user document AND current month's snapshot with new account values.
 * Creates snapshot if it doesn't exist.
 *
 * @param userId - User ID (partition key)
 * @param updates - User updates including accounts with values
 * @returns Updated user document
 */
export async function updateUserWithValues(
  userId: string,
  updates: Partial<Omit<User, 'id' | 'createdAt'>> & { accounts?: AccountWithValue[] }
): Promise<User> {
  const portfoliosContainer = getPortfoliosContainer();
  const snapshotDate = getFirstOfMonth();
  const now = new Date();

  // Extract values from accounts before updating user
  const accountValues = new Map<string, { value: number; name: string; category: Category }>();
  if (updates.accounts) {
    for (const acc of updates.accounts) {
      accountValues.set(acc.id, {
        value: acc.value,
        name: acc.name,
        category: acc.category,
      });
    }
  }

  logger.info('updateUserWithValues called', {
    userId,
    accountCount: updates.accounts?.length,
    accountValues: Array.from(accountValues.entries()).map(([id, v]) => ({ id, ...v })),
    snapshotDate,
  });

  // Update user (strip values from accounts for user document)
  const userUpdates: Partial<Omit<User, 'id' | 'createdAt'>> = {
    ...updates,
    accounts: updates.accounts?.map((acc) => ({
      id: acc.id,
      name: acc.name,
      category: acc.category,
      isActive: acc.isActive,
      sortOrder: acc.sortOrder,
      createdAt: typeof acc.createdAt === 'string' ? new Date(acc.createdAt) : acc.createdAt,
      ...(acc.loanDetails ? { loanDetails: acc.loanDetails } : {}),
    })),
  };

  const updatedUser = await updateUser(userId, userUpdates);

  // If no accounts with values, skip snapshot update
  if (accountValues.size === 0) {
    return updatedUser;
  }

  // Find the latest snapshot - fetch all and sort in JS (dd.MM.yyyy doesn't sort correctly as string)
  const { resources: allSnapshots } = await portfoliosContainer.items
    .query<MonthlySnapshot>({
      query: 'SELECT * FROM portfolios p WHERE p.userId = @userId',
      parameters: [
        { name: '@userId', value: userId },
      ],
    })
    .fetchAll();

  // Sort by date descending (parse dd.MM.yyyy format)
  const sortedSnapshots = allSnapshots.sort((a, b) => {
    const parseDate = (d: string) => {
      const [day, month, year] = d.split('.');
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    };
    return parseDate(b.date).getTime() - parseDate(a.date).getTime();
  });

  const snapshot = sortedSnapshots[0];

  logger.info('Found snapshots for user', {
    userId,
    totalSnapshots: sortedSnapshots.length,
    latestSnapshotDate: snapshot?.date,
    snapshotId: snapshot?.id,
  });

  if (snapshot) {
    // Update existing snapshot
    const existingAccountIds = new Set(snapshot.accounts.map((a) => a.id));

    // Update existing accounts and add new ones
    const updatedAccounts: Account[] = [];

    for (const [accountId, { value, name, category }] of accountValues) {
      // Negate gjeld values (user enters positive, stored as negative)
      const storedValue = category === 'gjeld' ? -Math.abs(value) : value;

      if (existingAccountIds.has(accountId)) {
        // Update existing account
        const existing = snapshot.accounts.find((a) => a.id === accountId)!;
        updatedAccounts.push({
          ...existing,
          name,
          value: storedValue,
        });
        existingAccountIds.delete(accountId);
      } else {
        // Add new account
        updatedAccounts.push({
          id: accountId,
          name,
          assetClass: categoryToAssetClass(category),
          value: storedValue,
        });
      }
    }

    // Keep accounts that weren't in the update (shouldn't happen, but safe)
    for (const accountId of existingAccountIds) {
      const existing = snapshot.accounts.find((a) => a.id === accountId);
      if (existing) {
        updatedAccounts.push(existing);
      }
    }

    snapshot.accounts = updatedAccounts;
    snapshot.totalNetWorth = calculateNetWorth(updatedAccounts);
    snapshot.updatedAt = now;

    await portfoliosContainer.item(snapshot.id, userId).replace(snapshot);
    logger.info('Snapshot updated with new account values', {
      userId,
      snapshotId: snapshot.id,
      date: snapshot.date,
      accountCount: updatedAccounts.length,
      totalNetWorth: snapshot.totalNetWorth,
    });
  } else {
    // Create new snapshot
    const snapshotAccounts: Account[] = [];

    for (const [accountId, { value, name, category }] of accountValues) {
      const storedValue = category === 'gjeld' ? -Math.abs(value) : value;
      snapshotAccounts.push({
        id: accountId,
        name,
        assetClass: categoryToAssetClass(category),
        value: storedValue,
      });
    }

    const newSnapshot: MonthlySnapshot = {
      id: randomUUID(),
      userId,
      date: snapshotDate,
      accounts: snapshotAccounts,
      totalNetWorth: calculateNetWorth(snapshotAccounts),
      createdAt: now,
      updatedAt: now,
    };

    await portfoliosContainer.items.create(newSnapshot);
    logger.info('New snapshot created during user update', {
      userId,
      snapshotId: newSnapshot.id,
      date: snapshotDate,
      accountCount: snapshotAccounts.length,
      totalNetWorth: newSnapshot.totalNetWorth,
    });
  }

  return updatedUser;
}

/**
 * Delete user
 *
 * @param userId - User ID (partition key)
 * @throws NotFoundError if user doesn't exist
 * @throws DatabaseError if operation fails
 */
export async function deleteUser(userId: string): Promise<void> {
  try {
    const container = getUsersContainer();
    await container.item(userId, userId).delete();
    logger.info('User deleted successfully', { userId });
  } catch (error) {
    logger.error('Failed to delete user', { userId, error });
    throw handleCosmosError(error);
  }
}

/**
 * Check if nickname is available (not taken)
 *
 * @param nickname - Nickname to check
 * @returns true if nickname is available, false if taken
 */
export async function isNicknameAvailable(nickname: string): Promise<boolean> {
  const user = await getUserByNickname(nickname);
  return user === null;
}
