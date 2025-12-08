# Task 215: Add Division by Zero Guards

**Priority**: High
**Category**: Bug
**Effort**: Medium (30 min)
**Impact**: Code Quality +2 points

## Problem

Multiple calculation functions lack zero guards:
- `GjeldPage.tsx:79` - `totalDebt = 0` causes Infinity
- `LoanCalculatorPage.tsx:163` - `numPayments = 0` causes NaN
- `calculatorService.ts` - Various edge cases

## Files

- `frontend/src/features/gjeld/GjeldPage.tsx`
- `frontend/src/features/calculators/LoanCalculatorPage.tsx`
- `backend/src/services/calculatorService.ts`

## Implementation

Add guards before divisions:
```typescript
const changePercentage = data.totalDebt > 0
  ? (data.monthlyChange / data.totalDebt) * 100
  : 0;
```

## Acceptance Criteria

- [x] No division by zero in calculations
- [x] Edge cases return 0 or appropriate default
- [x] All calculators handle zero inputs gracefully
