# Task 231: Standardize Norwegian Route Names

**Priority**: Medium
**Category**: Consistency
**Effort**: Low (20 min)
**Impact**: Code Quality +1 point

## Problem

Per CLAUDE.md: "Route naming: Norwegian names with æøå replaced by aoa"

Current inconsistencies:

### Frontend Routes (`frontend/src/routes/index.tsx`)
| Current | Should Be | Status |
|---------|-----------|--------|
| `/economy` | `/okonomi` | ❌ Wrong - English |
| `/min-okonomi` | `/min-okonomi` | ✅ Correct |
| `/import` | `/import` | ⚠️ Acceptable (no Norwegian equivalent) |

### Backend Routes
| Current | Should Be | Status |
|---------|-----------|--------|
| `/users` | `/brukere` or `/users` | ⚠️ Acceptable (API internal) |
| `/accounts` | `/kontoer` or `/accounts` | ⚠️ Acceptable (API internal) |
| `/snapshots` | `/snapshots` | ✅ OK |
| `/kalkulatorer` | `/kalkulatorer` | ✅ Correct |
| `/oversikt` | `/oversikt` | ✅ Correct |
| `/sparing` | `/sparing` | ✅ Correct |
| `/gjeld` | `/gjeld` | ✅ Correct |
| `/pensjon` | `/pensjon` | ✅ Correct |

## Files to Modify

- `frontend/src/routes/index.tsx`
- `frontend/src/shared/components/AppHeader.tsx` (lines 95, 148)

## Implementation

1. Change primary route from `/economy` to `/okonomi`:
```tsx
<Route
  path="okonomi"  // Changed from "economy"
  element={
    <ProtectedRoute>
      <EconomyPage />
    </ProtectedRoute>
  }
/>
```

2. Add redirect from old English route:
```tsx
<Route path="economy" element={<Navigate to="/okonomi" replace />} />
```

3. Keep `/min-okonomi` as alias (already correct)

4. Update AppHeader navigation:
```tsx
// Line 95
navigate('/okonomi');

// Line 148
onEconomyClick={() => navigate('/okonomi')}
```

## Acceptance Criteria

- [x] `/okonomi` is primary route for EconomyPage
- [x] `/economy` redirects to `/okonomi`
- [x] `/min-okonomi` still works (redirect or alias)
- [x] AppHeader.tsx uses `/okonomi` (lines 95, 148)
- [x] E2E tests pass (frontend build successful)
