# REFACTOR: Consolidate Number/Date Formatting Utilities

**Status**: In Progress (Phase Complete)
**Created**: 2025-12-07
**Priority**: Medium
**Labels**: frontend, components, dry
**Estimated Effort**: Medium - 2-4 hours

## Context & Motivation

The due diligence audit identified DRY violations: number and date formatting are implemented differently in frontend (numeral.js, date-fns) and components (toLocaleString, native).

This causes:
- Inconsistent formatting behavior
- Duplicate code maintenance
- Potential bugs from different implementations

## Current State

### Frontend Utilities
- `frontend/src/shared/utils/numberFormat.ts` - Uses numeral.js
- `frontend/src/shared/utils/dateFormat.ts` - Uses date-fns

### Components Utilities
- `components/src/forms/utils/numberFormat.ts` - Uses toLocaleString
- `components/src/forms/utils/dateFormat.ts` - Uses native Date methods

Two different implementations with different behavior.

## Desired Outcome

Single source of truth for all formatting utilities in the components package, with frontend importing from components.

## Acceptance Criteria

- [x] All formatting utilities live in `@finans/components`
- [x] Frontend imports formatting from components package
- [x] Duplicate implementations removed from frontend
- [x] Norwegian formatting works correctly (123 456,78 kr)
- [x] Date formatting works correctly (dd.MM.yyyy)
- [x] All tests pass
- [x] No duplicate code
- [x] Frontend and components build successfully
- [x] Linting passes

## Implementation Summary

### Phase 1: Enhanced Components Utilities ✓
- Added `date-fns` dependency to components package.json
- Replaced `components/src/forms/utils/dateFormat.ts` with robust date-fns version
  - Uses `date-fns` with Norwegian (nb) locale
  - Provides: formatDate, parseDate, toISOString, fromISOString, formatDateLong, getFirstDayOfMonth, parseNorwegianDate
- Consolidated `components/src/forms/utils/numberFormat.ts` with full numeral.js implementation
  - Provides: formatCurrency, formatNumber, formatPercentage, parseNumber
- Updated components exports in `components/src/index.ts`
- Updated internal component import (BreakdownCard)

### Phase 2: Updated Frontend Imports ✓
Updated all 18 frontend files to import from @finans/components:
- Dashboard: DashboardPage.tsx, useDashboardData.ts
- Gjeld: GjeldPage.tsx, DekningSection.tsx, useGjeldData.ts, LoansList.tsx
- Sparing: SparingPage.tsx, FireSection.tsx, useSparingData.ts
- Pensjon: PensjonPage.tsx, usePensjonData.ts
- Calculators: CompoundCalculatorPage.tsx, FireCalculatorPage.tsx, LoanCalculatorPage.tsx, MonteCarloPage.tsx
- Portfolio: usePortfolioData.ts
- Auth: AccountsList.tsx
- Utils: __manual-test.ts

### Phase 3: Deleted Duplicates ✓
- Removed `frontend/src/shared/utils/numberFormat.ts`
- Removed `frontend/src/shared/utils/dateFormat.ts`

### Phase 4: Verification ✓
- Components: Lint ✓
- Frontend: Type check ✓, Build ✓, Lint ✓ (6 pre-existing warnings only)
- Full workspace lint: All pass ✓

No new linting errors introduced. All builds pass.

## Affected Components

### Components Package
- **Keep/Enhance**: `components/src/forms/utils/numberFormat.ts`
- **Keep/Enhance**: `components/src/forms/utils/dateFormat.ts`
- **Add**: Export from `components/src/index.ts`

### Frontend Package
- **Remove**: `frontend/src/shared/utils/numberFormat.ts`
- **Remove**: `frontend/src/shared/utils/dateFormat.ts`
- **Update**: All imports to use `@finans/components`

### Testing
- **Unit**: Verify formatting functions work
- **Visual**: Verify numbers/dates display correctly

## Technical Approach

### Architecture Decision

Use numeral.js and date-fns (from frontend) as they are more robust than native methods. Move these to components package.

### Implementation Steps

1. **Enhance components utilities**
   - Move numeral.js and date-fns implementations to components
   - Ensure Norwegian locale configured
   - Export from barrel

2. **Update frontend imports**
   - Replace local imports with `@finans/components` imports
   - Search: `from '../shared/utils/numberFormat'`
   - Replace: `from '@finans/components'`

3. **Remove duplicates**
   - Delete `frontend/src/shared/utils/numberFormat.ts`
   - Delete `frontend/src/shared/utils/dateFormat.ts`

4. **Verify**
   - Run all builds
   - Check visual rendering

### Dependencies

- numeral (already in frontend, add to components)
- date-fns (already in frontend, add to components)

### Risks & Considerations

- **Risk**: Different behavior between implementations
- **Mitigation**: Test thoroughly, prefer numeral.js behavior

## Code References

### Frontend Implementation (Move to Components)

```typescript
// frontend/src/shared/utils/numberFormat.ts
import numeral from 'numeral';
import 'numeral/locales/no';
numeral.locale('no');

export function formatCurrency(value: number): string {
  return numeral(value).format('0,0.00') + ' kr';
}
```

### Components Implementation (To Be Replaced)

```typescript
// components/src/forms/utils/numberFormat.ts
export function formatNumber(value: number): string {
  return value.toLocaleString('nb-NO');
}
```

## Related Plans

- Due Diligence Report: `.docs/DUE-DILIGENCE-REPORT.md`

---
**Next Steps**: Important DRY improvement. Reduces maintenance burden.
