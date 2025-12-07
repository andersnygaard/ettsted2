/**
 * Account Service
 *
 * Provides CRUD operations for AccountConfig objects embedded in User documents.
 * Accounts are managed as a collection within the User document in CosmosDB.
 */

import { getUsersContainer, getPortfoliosContainer } from '../config/cosmosdb';
import { User } from '../models/User';
import { AccountConfig, Category } from '../models/Account';
import { MonthlySnapshot } from '../models/Portfolio';
import { logger } from '../utils/logger';
import { handleCosmosError, isNotFoundError } from '../utils/cosmosHelpers';
import { v4 as uuid } from 'uuid';
import { calculateNetWorth } from './calculationService';

/**
 * Get all accounts for a user
 *
 * @param userId - User ID (partition key)
 * @returns Array of all accounts for the user (active and inactive)
 * @throws DatabaseError if operation fails
 */
export async function getAccounts(userId: string): Promise<AccountConfig[]> {
  try {
    const container = getUsersContainer();
    const { resource } = await container.item(userId, userId).read<User>();

    if (!resource) {
      return [];
    }

    return resource.accounts || [];
  } catch (error) {
    if (isNotFoundError(error)) {
      return [];
    }
    logger.error('Failed to get accounts', { userId, error });
    throw handleCosmosError(error);
  }
}

/**
 * Get only active accounts for a user
 *
 * @param userId - User ID (partition key)
 * @returns Array of active accounts only
 * @throws DatabaseError if operation fails
 */
export async function getActiveAccounts(userId: string): Promise<AccountConfig[]> {
  const accounts = await getAccounts(userId);
  return accounts.filter(a => a.isActive);
}

/**
 * Get accounts filtered by category
 *
 * @param userId - User ID (partition key)
 * @param category - Category to filter by ('sparing', 'gjeld', or 'pensjon')
 * @returns Array of active accounts in the specified category
 * @throws DatabaseError if operation fails
 */
export async function getAccountsByCategory(
  userId: string,
  category: Category
): Promise<AccountConfig[]> {
  const accounts = await getActiveAccounts(userId);
  return accounts.filter(a => a.category === category);
}

/**
 * Create a new account for user
 *
 * @param userId - User ID (partition key)
 * @param data - Account data (id and createdAt will be generated)
 * @returns Created account with generated id and createdAt
 * @throws NotFoundError if user doesn't exist
 * @throws DatabaseError if operation fails
 */
export async function createAccount(
  userId: string,
  data: Omit<AccountConfig, 'id' | 'createdAt' | 'sortOrder'>
): Promise<AccountConfig> {
  try {
    const container = getUsersContainer();
    const { resource: user } = await container.item(userId, userId).read<User>();

    if (!user) {
      throw new Error('User not found');
    }

    // Calculate sortOrder based on existing accounts in category
    const categoryAccounts = user.accounts.filter(a => a.category === data.category);
    const maxSortOrder = Math.max(...categoryAccounts.map(a => a.sortOrder), -1);

    const account: AccountConfig = {
      ...data,
      id: uuid(),
      sortOrder: maxSortOrder + 1,
      createdAt: new Date(),
    };

    user.accounts.push(account);
    user.updatedAt = new Date();

    await container.item(userId, userId).replace(user);
    logger.info('Account created', { userId, accountId: account.id, name: account.name });

    return account;
  } catch (error) {
    logger.error('Failed to create account', { userId, error });
    throw handleCosmosError(error);
  }
}

/**
 * Update an account configuration
 *
 * @param userId - User ID (partition key)
 * @param accountId - Account ID to update
 * @param updates - Partial account object with fields to update
 * @returns Updated account
 * @throws NotFoundError if user or account doesn't exist
 * @throws DatabaseError if operation fails
 */
export async function updateAccount(
  userId: string,
  accountId: string,
  updates: Partial<Omit<AccountConfig, 'id' | 'createdAt'>>
): Promise<AccountConfig> {
  try {
    const container = getUsersContainer();
    const { resource: user } = await container.item(userId, userId).read<User>();

    if (!user) {
      throw new Error('User not found');
    }

    const accountIndex = user.accounts.findIndex(a => a.id === accountId);
    if (accountIndex === -1) {
      throw new Error('Account not found');
    }

    user.accounts[accountIndex] = {
      ...user.accounts[accountIndex],
      ...updates,
    };
    user.updatedAt = new Date();

    await container.item(userId, userId).replace(user);
    logger.info('Account updated', { userId, accountId });

    return user.accounts[accountIndex];
  } catch (error) {
    logger.error('Failed to update account', { userId, accountId, error });
    throw handleCosmosError(error);
  }
}

/**
 * Hard delete account
 *
 * Removes the account from user.accounts AND from all snapshot.accounts.
 * This ensures the account is completely removed from calculations.
 *
 * @param userId - User ID (partition key)
 * @param accountId - Account ID to delete
 * @throws NotFoundError if user or account doesn't exist
 * @throws DatabaseError if operation fails
 */
export async function deleteAccount(userId: string, accountId: string): Promise<void> {
  try {
    const usersContainer = getUsersContainer();
    const portfoliosContainer = getPortfoliosContainer();

    // 1. Remove from user.accounts
    const { resource: user } = await usersContainer.item(userId, userId).read<User>();
    if (!user) {
      throw new Error('User not found');
    }

    const accountExists = user.accounts.some((a) => a.id === accountId);
    if (!accountExists) {
      throw new Error('Account not found');
    }

    user.accounts = user.accounts.filter((a) => a.id !== accountId);
    user.updatedAt = new Date();
    await usersContainer.item(userId, userId).replace(user);

    // 2. Remove from all snapshots
    const { resources: snapshots } = await portfoliosContainer.items
      .query<MonthlySnapshot>({
        query: 'SELECT * FROM portfolios p WHERE p.userId = @userId',
        parameters: [{ name: '@userId', value: userId }],
      })
      .fetchAll();

    for (const snapshot of snapshots) {
      const hadAccount = snapshot.accounts.some((a) => a.id === accountId);
      if (hadAccount) {
        snapshot.accounts = snapshot.accounts.filter((a) => a.id !== accountId);
        snapshot.totalNetWorth = calculateNetWorth(snapshot.accounts);
        snapshot.updatedAt = new Date();
        await portfoliosContainer.item(snapshot.id, userId).replace(snapshot);
      }
    }

    logger.info('Account hard deleted', { userId, accountId, snapshotsUpdated: snapshots.length });
  } catch (error) {
    logger.error('Failed to delete account', { userId, accountId, error });
    throw handleCosmosError(error);
  }
}
