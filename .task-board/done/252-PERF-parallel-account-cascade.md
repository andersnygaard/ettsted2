# 252 - Parallelize Account Cascade Updates

## Type
Performance

## Priority
Medium

## Description
Account removal currently updates snapshots sequentially (N+1 pattern). For users with 36+ months of data, this is slow. Parallelize with `Promise.all()`.

## Source
Due Diligence Report - Critical Error #5

## Implementation

### File: `backend/src/services/userService.ts` (lines 175-212)

Replace sequential loop:
```typescript
// Before (sequential)
for (const snapshot of snapshots) {
  if (hadRemovedAccount) {
    await portfoliosContainer.item(snapshot.id, userId).replace(snapshot);
  }
}

// After (parallel)
const snapshotsToUpdate = snapshots.filter(snapshot =>
  snapshot.accounts.some(a => accountIdSet.has(a.id))
);

const updatePromises = snapshotsToUpdate.map(snapshot => {
  snapshot.accounts = snapshot.accounts.filter(a => !accountIdSet.has(a.id));
  snapshot.totalNetWorth = calculateNetWorth(snapshot.accounts);
  snapshot.updatedAt = new Date();
  return portfoliosContainer.item(snapshot.id, userId).replace(snapshot);
});

await Promise.all(updatePromises);
```

## Acceptance Criteria
- [x] Snapshot updates run in parallel
- [x] Log shows number of snapshots updated
- [x] Error handling catches partial failures
- [x] Performance improved for large datasets

## Effort
Low (30 min)
