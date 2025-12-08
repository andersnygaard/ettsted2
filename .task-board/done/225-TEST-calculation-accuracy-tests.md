# Task 225: Add Calculation Accuracy E2E Tests

**Priority**: Medium
**Category**: Testing
**Effort**: High (2 hours)
**Impact**: Code Quality +2 points

## Problem

Core calculations not tested:
- Net worth
- Savings rate
- F.I.R.E. number
- Coverage %
- Måneder fri

## Files

- `e2e/tests/calculations.spec.ts` (new)

## Implementation

Test calculation accuracy:
```typescript
test('net worth calculates correctly', async ({ page }) => {
  // Setup: Create accounts with known values
  // Verify: Net worth = sum(sparing) - sum(gjeld)
});

test('coverage percentage calculates correctly', async ({ page }) => {
  // Verify: Coverage = savings / debt * 100
});
```

## Acceptance Criteria

- [x] Net worth calculation tested
- [x] Savings rate tested
- [x] F.I.R.E. number tested
- [x] Coverage % tested
- [x] Måneder fri tested

## Resolution

Created `e2e/tests/calculations.spec.ts` with 16 comprehensive tests:
- Net worth: 2 tests (dashboard display, formula verification)
- Savings rate: 2 tests (calculation, formula)
- F.I.R.E. number: 2 tests (annual expenses * 25, progress display)
- Coverage %: 2 tests (savings / debt * 100)
- Måneder fri: 2 tests (savings / monthly expenses)
- Edge cases: 4 tests (zero handling, accessibility, consistency, updates)
- Cross-page: 2 tests (dashboard vs detail pages, consistency)

Test results: 14 passed, 2 flaky (login timeout issues in CI, not test logic)

Completed: 2025-12-08
