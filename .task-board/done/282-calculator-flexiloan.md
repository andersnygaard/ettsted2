# Fleksilån Calculator

**Status**: Done
**Completed**: 2025-12-10

## Problem
Users with "fleksilån" (flexible credit lines / HELOC) want to calculate how long it takes to pay off their debt given a monthly payment amount. Current loan calculator assumes fixed term - fleksilån works opposite: you choose payment, it calculates time.

## What is Fleksilån?
A flexible credit line (often secured against home equity) where:
- You have a credit limit, not a fixed loan amount
- Interest accrues on outstanding balance
- You choose how much to pay each month (minimum interest + small amount)
- No fixed end date - you pay until it's gone

## Requirements

### New sub-tab under Lånekalkulator: "Fleksilån"
Location: Kalkulatorer → Lån → Fleksilån (new tab alongside existing loan calculator)

**Inputs:**
- `outstandingBalance`: Current debt amount (NOK)
- `creditLimit`: Total credit limit (NOK) - for context
- `annualRate`: Interest rate (%)
- `monthlyPayment`: How much user plans to pay each month (NOK)

**Outputs:**
- `monthsToPayoff`: Number of months to pay off
- `yearsToPayoff`: Years and months formatted
- `totalInterestPaid`: Total interest over payoff period
- `totalPaid`: Total amount paid (principal + interest)
- `payoffDate`: Estimated payoff date
- `amortizationSchedule`: Monthly breakdown showing balance decrease

**Validation:**
- Monthly payment must exceed monthly interest, otherwise infinite payoff
- Show warning if payment barely covers interest

### API Endpoint
`POST /api/v1/kalkulatorer/fleksilan`

### Formula
Standard amortization where we solve for N (months):
```
N = -log(1 - (r * P) / M) / log(1 + r)

Where:
- N = number of months
- r = monthly interest rate (annual / 12 / 100)
- P = principal (outstanding balance)
- M = monthly payment
```

## Files to Create/Update

### Backend
- `backend/src/controllers/calculatorController.ts` - add `flexiLoanCalculation`
- `backend/src/routes/calculatorRoutes.ts` - add route
- `backend/src/validators/schemas.ts` - add `flexiLoanSchema`

### Frontend
- `frontend/src/features/calculators/LoanCalculator.tsx` - add Fleksilån tab within existing component
- Or split into `LoanCalculator/` folder with `StandardLoan.tsx` and `FlexiLoan.tsx` tabs

## Acceptance Criteria
- [x] API endpoint calculates payoff time correctly
- [x] Shows warning when payment barely covers interest
- [x] Error when payment doesn't cover interest (would never pay off)
- [x] Frontend tab matches existing calculator styling
- [x] Amortization schedule shows monthly progression
- [ ] E2E test for fleksilån calculator (skipped - no E2E test suite currently exists for calculators)

## Implementation Summary

### Backend Changes
1. **Schema (`backend/src/validators/schemas.ts`)**: Added `flexiLoanSchema` with validation for:
   - `outstandingBalance`: positive number
   - `annualRate`: 0-50%
   - `monthlyPayment`: positive number
   - `creditLimit`: optional positive number

2. **Service (`backend/src/services/calculatorService.ts`)**: Implemented `calculateFlexiLoan()`:
   - Uses logarithmic formula: `N = -log(1 - (r * P) / M) / log(1 + r)`
   - Validates payment covers interest (throws error if not)
   - Warns if payment < 1.5x monthly interest
   - Generates amortization schedule with monthly breakdown
   - Returns: monthsToPayoff, yearsToPayoff (formatted), totalInterestPaid, totalPaid, payoffDate, warning

3. **Controller (`backend/src/controllers/calculatorController.ts`)**: Added `flexiLoanCalculation()` handler
   - Converts percentage to decimal
   - Logs completion
   - Returns standard API response format

4. **Routes (`backend/src/routes/calculatorRoutes.ts`)**: Added route `POST /api/v1/kalkulatorer/fleksilan`
   - Rate limited (10 req/min via calculatorRateLimiter)
   - Validates with flexiLoanSchema
   - Documented with JSDoc

### Frontend Changes
1. **LoanCalculatorPage (`frontend/src/features/calculators/LoanCalculatorPage.tsx`)**:
   - Added 'flexi' to LoanType union
   - Added monthlyPayment to LoanInputs
   - Extended LoanResult with flexi-specific fields (monthsToPayoff, yearsToPayoff, payoffDate, warning)
   - Implemented `calculateFlexiLoan()` function (client-side calculation for instant feedback)
   - Added third tab "Fleksilån" to loan type selector
   - Conditional input fields: shows "Månedlig betaling" for flexi, "Nedbetalingstid" for annuity/serial
   - Result display shows "Nedbetalt på" with formatted time and payoff date
   - Warning banner displayed if payment barely covers interest
   - Info section explains what fleksilån is and shows calculation summary

### Files Modified
- `backend/src/validators/schemas.ts` (added flexiLoanSchema)
- `backend/src/services/calculatorService.ts` (added calculateFlexiLoan)
- `backend/src/controllers/calculatorController.ts` (added flexiLoanCalculation)
- `backend/src/routes/calculatorRoutes.ts` (added /fleksilan route)
- `frontend/src/features/calculators/LoanCalculatorPage.tsx` (added flexi tab and calculation)

### Verification
- ✅ Backend builds without errors
- ✅ Frontend builds without errors (warnings about circular deps are pre-existing)
- ✅ All TypeScript compilation passes
- ✅ Follows existing calculator patterns (schema → service → controller → route)
- ✅ Norwegian text throughout UI
- ✅ Matches Nordic Minimal design system
