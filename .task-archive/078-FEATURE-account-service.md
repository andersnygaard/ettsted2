# FEATURE: Account Service CRUD

**Status**: Backlog
**Created**: 2025-11-30
**Updated**: 2025-11-30
**Priority**: Medium
**Labels**: backend, services, data-model
**Estimated Effort**: Medium - 1 hour

## Context & Motivation

User accounts (investment accounts, loans) are embedded in the User document. Need service layer to manage account configurations within a user document.

**Current state**: userService handles user CRUD. Accounts are embedded in User but have no dedicated service.

## Desired Outcome

Service layer for managing account configs within a user document, following existing patterns from userService.

## Acceptance Criteria

- [ ] Create `/backend/src/services/accountService.ts`
- [ ] Implement `getAccounts(userId)` - returns all accounts for user
- [ ] Implement `getActiveAccounts(userId)` - returns only active accounts
- [ ] Implement `getAccountsByCategory(userId, category)` - filter by sparing/gjeld/pensjon
- [ ] Implement `createAccount(userId, accountData)` - adds new account to user
- [ ] Implement `updateAccount(userId, accountId, updates)` - updates account config
- [ ] Implement `deleteAccount(userId, accountId)` - soft delete (isActive: false)
- [ ] Use proper error handling with `handleCosmosError`
- [ ] Add JSDoc comments
- [ ] Add logging with `logger`

## Technical Approach

```typescript
// /backend/src/services/accountService.ts

import { getUsersContainer } from '../config/cosmosdb';
import { User } from '../models/User';
import { AccountConfig, Category } from '../models/Account';
import { logger } from '../utils/logger';
import { handleCosmosError, isNotFoundError } from '../utils/cosmosHelpers';
import { v4 as uuid } from 'uuid';

/**
 * Get all accounts for a user
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
 */
export async function getActiveAccounts(userId: string): Promise<AccountConfig[]> {
  const accounts = await getAccounts(userId);
  return accounts.filter(a => a.isActive);
}

/**
 * Get accounts filtered by category
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
 * Update an account (soft delete via isActive: false)
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
 * Soft delete account (set isActive: false)
 */
export async function deleteAccount(userId: string, accountId: string): Promise<void> {
  await updateAccount(userId, accountId, { isActive: false });
  logger.info('Account soft deleted', { userId, accountId });
}
```

## Dependencies

- User model (073)
- Account model (074)
- userService (077) - pattern reference
- cosmosHelpers utilities

---

**Next Steps**: Create account routes (082)
