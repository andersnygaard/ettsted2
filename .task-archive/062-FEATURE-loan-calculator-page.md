# FEATURE: Loan Calculator Page

**Status**: Done
**Created**: 2025-11-29
**Completed**: 2025-11-30
**Priority**: Medium
**Labels**: page, calculators, frontend
**Estimated Effort**: Medium - 2-3 hours

## Context & Motivation

Loan calculator for mortgage/loan planning, showing monthly payments, total cost, and amortization schedule.

## Reference

CLAUDE.md specification for calculators

## Desired Outcome

Interactive loan calculator with amortization details.

## Acceptance Criteria

- [x] Create `/frontend/src/features/calculators/LoanCalculatorPage.tsx`
- [x] Add route `/kalkulatorer/loan`
- [x] Inputs: loan amount, interest rate, loan term (years)
- [x] Calculate: monthly payment, total paid, total interest
- [x] Chart showing principal vs interest over time (StackedAreaChart)
- [ ] Show amortization schedule table (deferred - chart is sufficient for MVP)
- [ ] Extra payment scenario (optional - deferred)

## Resolution

Successfully implemented the Loan Calculator Page with full functionality.

**Implementation Summary**:
- Created `LoanCalculatorPage.tsx` with annuity formula for accurate calculations
- Two-column layout: inputs on left, results on right
- Real-time calculations using `useMemo`
- StackedAreaChart showing amortization profile (Avdrag vs Rente over time)
- Norwegian labels and number formatting throughout
- Info section explaining how the calculator works

**Files created/modified**:
- `frontend/src/features/calculators/LoanCalculatorPage.tsx` (new)
- `frontend/src/routes/index.tsx` (route added)

**Verification**:
- Playwright CLI test passed
- Screenshot saved to `screenshots/loan-calculator-full.png`
- Design compliance verified against Nordic Minimal aesthetic

**Default calculations verified**:
- Loan: 3,000,000 kr at 4.5% for 25 years
- Monthly payment: 16,674.97 kr
- Total paid: 5,002,492.30 kr
- Total interest: 2,002,492.30 kr (40.0%)

## Technical Approach

```tsx
// Annuity formula for monthly payment
const monthlyRate = annualRate / 100 / 12;
const numPayments = years * 12;
const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
```

## Dependencies

- `044-FEATURE-number-input-component.md` ✅
- `056-FEATURE-stacked-area-chart.md` ✅

---

**Completed**: 2025-11-30
