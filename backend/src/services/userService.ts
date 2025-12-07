/**
 * User Service
 *
 * Provides CRUD operations for User documents in CosmosDB.
 * All operations use parameterized queries to prevent NoSQL injection.
 */

import { getUsersContainer, getPortfoliosContainer } from '../config/cosmosdb';
import { User } from '../models/User';
import { MonthlySnapshot } from '../models/Portfolio';
import { logger } from '../utils/logger';
import {
  handleCosmosError,
  isNotFoundError,
  buildParameterizedQuery,
} from '../utils/cosmosHelpers';
import { calculateNetWorth } from './calculationService';

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
