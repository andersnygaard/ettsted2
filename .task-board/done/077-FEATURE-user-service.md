# FEATURE: User Service with Profile Management

**Status**: Backlog
**Created**: 2025-11-30
**Priority**: High
**Labels**: backend, services, data-model
**Estimated Effort**: Medium - 1 hour

## Context & Motivation

Create user service to handle CRUD operations for users with embedded profile and accounts.

## Desired Outcome

Service layer for user operations including profile updates and default account creation.

## Acceptance Criteria

- [ ] Create `/backend/src/services/userService.ts`
- [ ] Implement `createUser(id, nickname, email, profile)` - creates user with default accounts
- [ ] Implement `getUserById(id)` - returns user with profile and accounts
- [ ] Implement `updateProfile(id, profile)` - updates user profile
- [ ] Implement `deleteUser(id)` - deletes user and all their data
- [ ] Use CosmosDB `users` container

## Technical Approach

```typescript
// /backend/src/services/userService.ts

import { User, UserProfile } from '../models/User';
import { AccountConfig, DEFAULT_ACCOUNTS } from '../models/Account';
import { cosmosDb } from '../database/cosmos';
import { v4 as uuid } from 'uuid';

const container = cosmosDb.container('users');

export async function createUser(
  id: string,
  nickname: string,
  email: string,
  profile: UserProfile
): Promise<User> {
  const now = new Date();

  const accounts: AccountConfig[] = DEFAULT_ACCOUNTS.map((acc, index) => ({
    ...acc,
    id: uuid(),
    createdAt: now,
  }));

  const user: User = {
    id,
    nickname,
    email,
    createdAt: now,
    updatedAt: now,
    profile,
    accounts,
  };

  await container.items.create(user);
  return user;
}

export async function getUserById(id: string): Promise<User | null> {
  const { resource } = await container.item(id, id).read<User>();
  return resource || null;
}

export async function updateProfile(id: string, profile: Partial<UserProfile>): Promise<User> {
  const user = await getUserById(id);
  if (!user) throw new Error('User not found');

  user.profile = { ...user.profile, ...profile };
  user.updatedAt = new Date();

  await container.item(id, id).replace(user);
  return user;
}
```

## Dependencies

- 073, 074 (User and Account models)
- CosmosDB connection (already exists)

---

**Next Steps**: Create accountService (078)
