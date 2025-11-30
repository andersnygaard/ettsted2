# FEATURE: Account Service CRUD

**Status**: Backlog
**Created**: 2025-11-30
**Priority**: High
**Labels**: backend, services, data-model
**Estimated Effort**: Medium - 1 hour

## Context & Motivation

Create account service to handle CRUD operations for user account configurations.

## Desired Outcome

Service layer for managing accounts within a user document.

## Acceptance Criteria

- [ ] Create `/backend/src/services/accountService.ts`
- [ ] Implement `getAccounts(userId)` - returns all accounts for user
- [ ] Implement `getActiveAccounts(userId)` - returns only active accounts
- [ ] Implement `createAccount(userId, name, category, loanDetails?)` - adds new account
- [ ] Implement `updateAccount(userId, accountId, updates)` - updates account name/details
- [ ] Implement `deleteAccount(userId, accountId)` - soft delete (isActive: false)
- [ ] Implement `reorderAccounts(userId, accountIds)` - update sortOrder

## Technical Approach

```typescript
// /backend/src/services/accountService.ts

import { AccountConfig, LoanDetails } from '../models/Account';
import { Category } from '../models/User';
import { getUserById } from './userService';
import { cosmosDb } from '../database/cosmos';
import { v4 as uuid } from 'uuid';

const container = cosmosDb.container('users');

export async function getAccounts(userId: string): Promise<AccountConfig[]> {
  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');
  return user.accounts;
}

export async function getActiveAccounts(userId: string): Promise<AccountConfig[]> {
  const accounts = await getAccounts(userId);
  return accounts.filter(a => a.isActive);
}

export async function createAccount(
  userId: string,
  name: string,
  category: Category,
  loanDetails?: LoanDetails
): Promise<AccountConfig> {
  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');

  const maxSortOrder = Math.max(...user.accounts
    .filter(a => a.category === category)
    .map(a => a.sortOrder), -1);

  const account: AccountConfig = {
    id: uuid(),
    name,
    category,
    isActive: true,
    sortOrder: maxSortOrder + 1,
    createdAt: new Date(),
    loanDetails,
  };

  user.accounts.push(account);
  user.updatedAt = new Date();
  await container.item(userId, userId).replace(user);

  return account;
}

export async function deleteAccount(userId: string, accountId: string): Promise<void> {
  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');

  const account = user.accounts.find(a => a.id === accountId);
  if (!account) throw new Error('Account not found');

  account.isActive = false;
  user.updatedAt = new Date();
  await container.item(userId, userId).replace(user);
}
```

## Dependencies

- 077-FEATURE-user-service

---

**Next Steps**: Create snapshotService (079)
