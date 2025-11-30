# FEATURE: Snapshot Service CRUD

**Status**: Backlog
**Created**: 2025-11-30
**Priority**: High
**Labels**: backend, services, data-model
**Estimated Effort**: Medium - 1 hour

## Context & Motivation

Create snapshot service to handle CRUD operations for monthly snapshots.

## Desired Outcome

Service layer for managing monthly portfolio snapshots.

## Acceptance Criteria

- [ ] Create `/backend/src/services/snapshotService.ts`
- [ ] Implement `getSnapshots(userId, options?)` - paginated list of snapshots
- [ ] Implement `getSnapshotByDate(userId, date)` - get specific month
- [ ] Implement `getLatestSnapshot(userId)` - get most recent snapshot
- [ ] Implement `createSnapshot(userId, date, balances)` - create new snapshot
- [ ] Implement `updateSnapshot(snapshotId, userId, balances)` - update existing
- [ ] Implement `deleteSnapshot(snapshotId, userId)` - delete snapshot
- [ ] Use CosmosDB `snapshots` container with userId partition key

## Technical Approach

```typescript
// /backend/src/services/snapshotService.ts

import { MonthlySnapshot, AccountBalance } from '../models/Snapshot';
import { cosmosDb } from '../database/cosmos';
import { v4 as uuid } from 'uuid';

const container = cosmosDb.container('snapshots');

export async function getSnapshots(
  userId: string,
  options?: { limit?: number; offset?: number }
): Promise<MonthlySnapshot[]> {
  const { limit = 50, offset = 0 } = options || {};

  const query = {
    query: 'SELECT * FROM c WHERE c.userId = @userId ORDER BY c.date DESC OFFSET @offset LIMIT @limit',
    parameters: [
      { name: '@userId', value: userId },
      { name: '@offset', value: offset },
      { name: '@limit', value: limit },
    ],
  };

  const { resources } = await container.items.query<MonthlySnapshot>(query).fetchAll();
  return resources;
}

export async function getLatestSnapshot(userId: string): Promise<MonthlySnapshot | null> {
  const snapshots = await getSnapshots(userId, { limit: 1 });
  return snapshots[0] || null;
}

export async function createSnapshot(
  userId: string,
  date: Date,
  balances: AccountBalance[]
): Promise<MonthlySnapshot> {
  const now = new Date();

  const snapshot: MonthlySnapshot = {
    id: uuid(),
    userId,
    date,
    createdAt: now,
    updatedAt: now,
    balances,
  };

  await container.items.create(snapshot);
  return snapshot;
}

export async function updateSnapshot(
  snapshotId: string,
  userId: string,
  balances: AccountBalance[]
): Promise<MonthlySnapshot> {
  const { resource: snapshot } = await container.item(snapshotId, userId).read<MonthlySnapshot>();
  if (!snapshot) throw new Error('Snapshot not found');

  snapshot.balances = balances;
  snapshot.updatedAt = new Date();

  await container.item(snapshotId, userId).replace(snapshot);
  return snapshot;
}
```

## Dependencies

- 075-FEATURE-snapshot-model

---

**Next Steps**: Create calculationService (080)
