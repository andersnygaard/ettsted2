# 108 - Refactor: Sparing Page Use API Data

**Type**: REFACTOR (Bug Fix)
**Priority**: High
**Effort**: Simple (1-2 hours)
**Labels**: frontend, bug, data-integration

---

## Context

The `useSparingData.ts` hook calculates F.I.R.E. metrics using hardcoded values instead of using the API response from `/api/v1/sparing`. This causes incorrect calculations.

**Current behavior** (bug):
```typescript
// Line 191-196 in useSparingData.ts
// TODO: Get these from user settings once implemented
const annualExpenses = 256000;  // HARDCODED
const annualIncome = 800000;    // HARDCODED
const currentAge = 35;          // HARDCODED
const annualGrowthRate = 0.07;
```

**Expected behavior**:
The hook should use values from the API response, which correctly calculates metrics using user profile data:
- `sparerate` - from API
- `fireNumber` - from API
- `fireProgress` - from API
- `monthsFree` - from API

---

## Acceptance Criteria

- [x] Remove hardcoded values from useSparingData.ts
- [x] Use API response values directly for all metrics
- [x] Handle loading/error states properly
- [x] Sparing page displays correct user-specific F.I.R.E. metrics
- [x] Verify calculations match user profile (monthlySalary, annualExpenses)

---

## Technical Approach

1. **Read API response structure** from [backend/src/routes/summaryRoutes.ts](backend/src/routes/summaryRoutes.ts):
   ```typescript
   {
     sumSparing, sparerate, monthsFree, fireNumber, fireProgress, history
   }
   ```

2. **Refactor useSparingData.ts**:
   - Remove lines 191-209 (hardcoded calculations)
   - Map API response directly to component props
   - Add `yearlyChange` calculation from history if needed

3. **Update SparingPage.tsx** if needed to use new data structure

---

## Files to Modify

- [frontend/src/features/sparing/useSparingData.ts](frontend/src/features/sparing/useSparingData.ts) - Remove hardcoded values
- [frontend/src/features/sparing/SparingPage.tsx](frontend/src/features/sparing/SparingPage.tsx) - Verify props match

---

## Dependencies

None - straightforward bug fix

---

## Verification

1. Create test user with specific profile values
2. Navigate to Sparing page
3. Verify displayed metrics match user profile:
   - Sparerate = (monthlySalary*12 - annualExpenses) / (monthlySalary*12) * 100
   - F.I.R.E. number = annualExpenses * 25
4. Change profile values and verify page updates

---

## Progress Log

**Completed**: Removed all hardcoded values and integrated API data

### Changes Made

1. **useSparingData.ts** - Refactored `fetchSparingData()` function:
   - Removed hardcoded values: `annualExpenses` (256000), `annualIncome` (800000), `currentAge` (35)
   - Added parallel fetch calls to `/api/v1/sparing` and `/api/v1/users/me` endpoints
   - Mapped API response values directly to SparingData interface:
     - `sparerate` from API
     - `fireNumber` from API
     - `monthsFree` from API
     - `fireProgress` from API
   - Used user profile data (`birthYear`, `monthlySalary`, `annualExpenses`) to calculate:
     - `minRetireAge` = currentAge + yearsToFire
     - `yearsToSalary` = calculated from actual user income
   - Retained snapshot-based calculations for:
     - `yearlyChange` (year-to-date comparison)
     - `monthlyChange` (month-to-month comparison)
     - `totalGrowth` (first snapshot to latest)

### Files Modified
- `/frontend/src/features/sparing/useSparingData.ts` (Lines 161-285)

### How It Works
1. Hook calls `fetchSparingData()` which fetches from two API endpoints in parallel
2. API data is used for F.I.R.E. metrics (calculated server-side from user profile)
3. User profile data is fetched to calculate retirement age projections
4. Historical snapshots are still fetched to calculate changes and growth metrics
5. All values now reflect actual user settings instead of hardcoded defaults

### Verification
- SparingPage component uses all data fields correctly (already verified)
- Loading/error states handled by TanStack Query hook
- Empty state returns default data when no snapshots exist
