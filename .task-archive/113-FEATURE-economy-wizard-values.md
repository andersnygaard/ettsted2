# 113 - Feature: Load Account Values in Economy Wizard

**Type**: FEATURE
**Priority**: Low
**Effort**: Simple (2-3 hours)
**Labels**: frontend, ux, economy-wizard

---

## Context

The Economy Wizard (edit mode) shows `0` for all account values because it only loads account configurations, not latest balance values.

**Current state** ([frontend/src/features/auth/EconomyPage.tsx](frontend/src/features/auth/EconomyPage.tsx)):
```typescript
.map(acc => ({
  tempId: acc.id,
  name: acc.name,
  category: acc.category,
  value: 0, // VALUES NOT LOADED
  isActive: acc.isActive,
}));
```

**Expected**: Show latest snapshot values so users see current balances when editing.

---

## Acceptance Criteria

- [x] Economy wizard shows latest balance for each account
- [x] If no snapshot exists, show 0 (current behavior)
- [x] Loading state while fetching snapshot data
- [x] Values are display-only (not editable in wizard)

---

## Technical Approach

### Option A: Fetch Latest Snapshot in EconomyPage

```typescript
// EconomyPage.tsx
const { user } = useAuth();
const { data: latestSnapshot } = useQuery({
  queryKey: ['snapshot', 'latest'],
  queryFn: () => api.get('/snapshots?limit=1&orderBy=date&ascending=false'),
  enabled: !!user,
});

function convertUserToInitialState(user, snapshot) {
  const sparingAccounts = user.accounts
    .filter(acc => acc.category === 'sparing')
    .map(acc => {
      // Find value from latest snapshot
      const snapshotAccount = snapshot?.accounts.find(
        s => s.name.toLowerCase() === acc.name.toLowerCase()
      );
      return {
        tempId: acc.id,
        name: acc.name,
        category: acc.category,
        value: snapshotAccount?.value ?? 0,
        isActive: acc.isActive,
      };
    });
  // ... same for gjeld, pensjon
}
```

### Option B: Add Endpoint for User with Values

Create `/api/v1/users/me/with-balances` that combines user data with latest snapshot values.

**Recommendation**: Option A is simpler, uses existing endpoints.

---

## Files to Modify

- [frontend/src/features/auth/EconomyPage.tsx](frontend/src/features/auth/EconomyPage.tsx) - Fetch and merge snapshot data

---

## Dependencies

- Snapshot API endpoint exists
- TanStack Query configured

---

## Design Note

The wizard displays values for context but doesn't allow editing them. Account values are edited in the Portfolio page. The wizard is for account configuration (names, categories, active status).

Consider adding a note: "Balanser oppdateres i Portefølje-siden"

---

## Verification

1. Create user with accounts and snapshots
2. Navigate to Economy Wizard (via avatar menu)
3. Verify each account shows its latest snapshot value
4. Verify values display with Norwegian formatting (123 456 kr)

---

## Implementation Complete

**Status**: COMPLETED

### Changes Made

**File: `frontend/src/features/auth/EconomyPage.tsx`**

1. **Added imports**:
   - `useQuery` from '@tanstack/react-query'
   - `snapshotApi` from '@/shared/api/services'

2. **Updated `convertUserToInitialState` function**:
   - Added optional `latestSnapshot` parameter
   - Added `getAccountValue()` helper to match account by name (case-insensitive)
   - Updated all three category mappings (sparing, gjeld, pensjon) to use `getAccountValue()` instead of hardcoded `0`
   - Falls back to `0` if no snapshot exists

3. **Updated `EconomyPage` component**:
   - Added `useQuery` to fetch latest snapshot: `snapshotApi.getAll({ orderBy: 'date', ascending: false, limit: 1 })`
   - Renamed `isLoading` to `userLoading` for clarity
   - Added `snapshotsLoading` state
   - Combined loading check: `if (userLoading || snapshotsLoading)`
   - Passed `latestSnapshot` to `convertUserToInitialState`

### Key Features

- **Account Value Loading**: Latest snapshot values loaded and matched by name (case-insensitive)
- **Fallback Handling**: Shows `0` if no snapshot exists yet
- **Loading State**: Both user and snapshot data loading states handled
- **Display Only**: Values are read-only in wizard (configured in OnboardingWizard component)
- **Type Safe**: Full TypeScript support with proper types
- **Performance**: 5-minute cache for snapshot data to avoid repeated fetches

### Build Verification

✓ TypeScript compilation successful
✓ Vite build completed successfully (0 errors)
