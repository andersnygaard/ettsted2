# 182-BUG: Monte Carlo E2E Test Flaky Auth Issue

## Context

The Monte Carlo calculator page is excluded from E2E tests due to a flaky authentication issue. See TODO in [fixtures.ts](e2e/tests/fixtures.ts#L18):

```typescript
// Monte Carlo excluded - known flaky auth issue (TODO: investigate)
```

The page works in browser but E2E tests fail intermittently, suggesting a race condition or timing issue with auth state during test execution.

## Type

BUG

## Priority

Medium - Test coverage gap, not user-facing

## Affected Files

- [e2e/tests/fixtures.ts](e2e/tests/fixtures.ts) (line 18)
- [frontend/src/features/calculators/MonteCarloPage.tsx](frontend/src/features/calculators/MonteCarloPage.tsx)

## Acceptance Criteria

- [x] Monte Carlo page included in `CALCULATOR_PAGES` array
- [x] E2E test for Monte Carlo passes consistently (10+ runs without failure)
- [x] TODO comment removed from fixtures.ts

## Resolution

Fixed on 2025-12-06. The original flaky auth issue was resolved by previous Monte Carlo refactoring (task 143 moved simulation to client-side useMemo).

**Changes:**
- Added `{ path: '/kalkulatorer/monte-carlo', name: 'Monte Carlo' }` to CALCULATOR_PAGES
- Removed TODO comment about flaky test

**Verification:**
- Ran E2E suite 10 times consecutively: 10/10 passed
- Monte Carlo page included in "visit all pages" test

## Technical Approach

1. **Investigation Phase:**
   - Add Monte Carlo back to CALCULATOR_PAGES temporarily
   - Run `pnpm test:e2e` multiple times to reproduce failure
   - Check console errors, network requests, auth state
   - Identify if issue is race condition, slow API, or auth timing

2. **Fix Options (based on investigation):**
   - Add explicit waitFor for API response before test assertions
   - Increase page load timeout for Monte Carlo
   - Fix auth state initialization order if race condition
   - Add retry logic for flaky network calls

3. **Verification:**
   - Run E2E suite 10+ times to confirm stability
   - Remove TODO comment once stable

## Effort Estimate

Medium - 2-4 hours investigation + fix
