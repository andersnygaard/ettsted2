# Task 224: Add Calculator E2E Tests

**Priority**: Medium
**Category**: Testing
**Effort**: High (2 hours)
**Impact**: Code Quality +2 points

## Problem

Zero functional tests for calculator math. Only page loading tested.

## Files

- `e2e/tests/calculators.spec.ts` (new)

## Implementation

Test each calculator:
```typescript
test('compound calculator calculates correctly', async ({ page }) => {
  await page.goto('/kalkulatorer/rentes-rente');
  await page.fill('[name="principal"]', '100000');
  await page.fill('[name="rate"]', '7');
  await page.fill('[name="years"]', '10');
  await page.click('button[type="submit"]');
  await expect(page.locator('.result')).toContainText('196 715');
});
```

## Acceptance Criteria

- [x] Compound calculator tested
- [x] F.I.R.E. calculator tested
- [x] Loan calculator tested
- [x] Monte Carlo tested
- [x] Edge cases (zero, negative) tested
