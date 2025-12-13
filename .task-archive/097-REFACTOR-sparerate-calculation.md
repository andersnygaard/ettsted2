# REFACTOR: Sparerate Calculation

**Status**: Done
**Created**: 2025-12-01
**Completed**: 2025-12-01
**Priority**: High
**Labels**: frontend, dashboard, calculation
**Estimated Effort**: Simple - 30 min

## Context & Motivation

Dashboard shows broken sparerate metric. There's a TODO in the code indicating this calculation needs implementation using user profile data.

## Desired Outcome

Working sparerate calculation displayed on dashboard using actual user profile data (monthlySalary, monthlySavings).

## Acceptance Criteria

- [x] Implement sparerate calculation formula: `(monthlySavings / monthlySalary) * 100`
- [x] Remove TODO comment from code
- [x] Handle edge cases (zero salary, missing profile data)
- [x] Display correct percentage on dashboard

## Technical Approach

The `useDashboardData` hook doesn't have access to user profile data, but `DashboardPage.tsx` has both:
- `user` from `useAuth()` - contains `profile.monthlySalary` and `profile.monthlySavings`
- `dashboardData` from `useDashboardData()` - portfolio-based metrics

**Solution**: Calculate sparerate directly in `DashboardPage.tsx` from user profile.

## Resolution

Successfully implemented sparerate calculation.

**Files modified**:
- `frontend/src/features/dashboard/DashboardPage.tsx` (lines 12-16)
  - Added profile extraction: `const profile = user?.profile;`
  - Added sparerate calculation with edge case handling
  - Updated display to use local `sparerate` variable
- `frontend/src/features/dashboard/useDashboardData.ts` (line 122)
  - Updated comment to clarify sparerate is calculated in DashboardPage

**Implementation**:
```typescript
// Calculate sparerate from user profile
const profile = user?.profile;
const sparerate = profile && profile.monthlySalary > 0 && profile.monthlySavings !== undefined
  ? (profile.monthlySavings / profile.monthlySalary) * 100
  : 0;
```

**Edge cases handled**:
- Zero or undefined salary: returns 0
- Missing monthlySavings: returns 0
- Undefined user/profile: returns 0

**Verification**:
- [x] Frontend build passes (`pnpm --filter frontend build`)
- [x] TypeScript compilation clean
- [x] All acceptance criteria met

---

**Next Steps**: Wire Gjeld page to real data (098)
