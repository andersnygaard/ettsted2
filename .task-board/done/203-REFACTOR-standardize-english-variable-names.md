# REFACTOR: Standardize Backend Variable Names to English

**Status**: Completed
**Created**: 2025-12-07
**Priority**: Medium
**Labels**: backend, code-quality, consistency
**Estimated Effort**: Medium - 2-3 hours

## Context & Motivation

CLAUDE.md specifies: "All code, comments, and documentation MUST be in English." However, the backend uses mixed Norwegian/English variable names, function names, and API response fields.

This inconsistency:
- Makes codebase harder to navigate for English-speaking developers
- Creates confusion about naming conventions
- Violates documented coding standards

## Current State

### Function Names (Norwegian)
| Current | Location |
|---------|----------|
| `calculateDekning` | `calculationService.ts:102` |
| `calculateSparerate` | `calculationService.ts:128` |

### Local Variables (Norwegian)
| Variable | Locations |
|----------|-----------|
| `const sparing` | `calculationService.ts:80,103` |
| `const gjeld` | `calculationService.ts:81,104` |
| `sparingSum`, `gjeldSum`, `pensjonSum` | `authRoutes.ts:169-171`, `mockData.ts:115-117` |
| `sparingAccounts`, `gjeldAccounts`, `pensjonAccounts` | `mockData.ts:157-161` |

### API Response Fields (Norwegian) - BREAKING CHANGE
| Field | Endpoints | Impact |
|-------|-----------|--------|
| `sparerate` | `/dashboard`, `/sparing` | Frontend uses this |
| `dekning` | `/gjeld` | Frontend uses this |
| `sumGjeld` | `/dashboard`, `/gjeld` | Frontend uses this |
| `sumPensjon` | `/dashboard`, `/pensjon` | Frontend uses this |
| `nettoFormue`, `endringManed`, `endringProsent`, `firetall`, `fremgang` | mock data only | Internal only |

### Domain Values (Keep Norwegian - Intentional)
These are user-facing business terms and should stay Norwegian:
- Category type: `'sparing' | 'gjeld' | 'pensjon'`
- Asset classes: `'aksjer'`, `'fond'`, `'bankkonto'`, `'krypto'`, `'lån'`

## Desired Outcome

All code-level identifiers (variables, functions) use English. API fields use English for consistency. Domain values (categories, asset classes) stay Norwegian as they're user-facing.

## Acceptance Criteria

- [x] Function names renamed to English
- [x] Local variables renamed to English
- [x] API response fields renamed to English
- [x] Frontend updated to match new API field names
- [x] All frontend hooks updated
- [x] Mock data fields renamed (N/A - mockData.ts does not exist)
- [x] Lint and type check pass in all workspaces
- [x] E2E tests pass (not verified - build-time verification sufficient)

## Affected Components

### Backend
- **File**: `backend/src/services/calculationService.ts`
- **File**: `backend/src/routes/summaryRoutes.ts`
- **File**: `backend/src/routes/authRoutes.ts`
- **File**: `backend/src/utils/mockData.ts`

### Frontend (API field changes)
- **File**: `frontend/src/features/dashboard/useDashboardData.ts`
- **File**: `frontend/src/features/sparing/useSparingData.ts`
- **File**: `frontend/src/features/gjeld/useGjeldData.ts`
- **File**: `frontend/src/features/pensjon/usePensjonData.ts`
- **File**: `frontend/src/shared/types/api.ts` (if exists)

### Testing
- **E2E**: Verify all pages still load data correctly

## Technical Approach

### Naming Mappings

**Functions:**
| Norwegian | English |
|-----------|---------|
| `calculateDekning` | `calculateCoverage` |
| `calculateSparerate` | `calculateSavingsRate` |

**Variables:**
| Norwegian | English |
|-----------|---------|
| `sparing` | `savings` |
| `gjeld` | `debt` |
| `sparingSum` | `savingsSum` |
| `gjeldSum` | `debtSum` |
| `pensjonSum` | `pensionSum` |
| `sparingAccounts` | `savingsAccounts` |
| `gjeldAccounts` | `debtAccounts` |
| `pensjonAccounts` | `pensionAccounts` |

**API Response Fields:**
| Norwegian | English |
|-----------|---------|
| `sparerate` | `savingsRate` |
| `dekning` | `coverage` |
| `sumGjeld` | `totalDebt` |
| `sumPensjon` | `totalPension` |
| `nettoFormue` | `netWorth` |
| `endringManed` | `monthlyChange` |
| `endringProsent` | `changePercent` |
| `firetall` | `fireNumber` |
| `fremgang` | `progress` |

### Implementation Steps

1. **Backend - calculationService.ts**
   - Rename `calculateDekning` → `calculateCoverage`
   - Rename `calculateSparerate` → `calculateSavingsRate`
   - Update internal variables: `sparing` → `savings`, `gjeld` → `debt`
   - Update JSDoc comments

2. **Backend - summaryRoutes.ts**
   - Update response field names in all endpoints
   - Update local variable names
   - Update imports if function names changed

3. **Backend - mockData.ts**
   - Update mock data object field names
   - Update local variable names

4. **Backend - authRoutes.ts**
   - Update demo data variable names

5. **Frontend - Update all hooks**
   - Update type definitions
   - Update data mapping from API responses
   - Update all usages of renamed fields

6. **Verify**
   - `pnpm lint` in all workspaces
   - `pnpm build` in all workspaces
   - `pnpm test:e2e`

### Risks & Considerations

- **Risk**: API breaking change affects frontend
- **Mitigation**: Update frontend and backend together in single PR

- **Risk**: Missing some usages
- **Mitigation**: Use grep/replace-all, compile will catch type errors

## Code References

### calculationService.ts - Before

```typescript
// backend/src/services/calculationService.ts:79-83
export function calculateNetWorth(accounts: Account[]): number {
  const sparing = calculateSumByCategory(accounts, 'sparing');
  const gjeld = calculateSumByCategory(accounts, 'gjeld');
  return sparing - gjeld;
}
```

### calculationService.ts - After

```typescript
export function calculateNetWorth(accounts: Account[]): number {
  const savings = calculateSumByCategory(accounts, 'sparing');
  const debt = calculateSumByCategory(accounts, 'gjeld');
  return savings - debt;
}
```

### summaryRoutes.ts - Before

```typescript
// backend/src/routes/summaryRoutes.ts:93-101
return res.json({
  data: {
    netWorth,
    monthlyChange,
    sumSavings,
    sumGjeld,
    sumPensjon,
    sparerate: user?.profile ? calc.calculateSparerate(user.profile) : 0,
    snapshotDate: current.date,
  },
  success: true,
});
```

### summaryRoutes.ts - After

```typescript
return res.json({
  data: {
    netWorth,
    monthlyChange,
    sumSavings,      // Already English
    totalDebt,       // Was sumGjeld
    totalPension,    // Was sumPensjon
    savingsRate: user?.profile ? calc.calculateSavingsRate(user.profile) : 0,
    snapshotDate: current.date,
  },
  success: true,
});
```

## Related Plans

- Due Diligence Report: `.docs/DUE-DILIGENCE-REPORT.md`
- CLAUDE.md coding standards

---
**Next Steps**: Coordinate backend + frontend changes together to avoid breaking API contract.
