# BUG: "År til årslønn" uses wrong formula

**Status**: Done
**Created**: 2025-12-15
**Priority**: Medium
**Labels**: frontend, sparing, calculation
**Estimated Effort**: Simple - 15 minutes

## Context & Motivation

The "År til årslønn" (years to annual salary) KPI on the Sparing page shows incorrect values. This metric should answer: "How many years until I've saved one full year's salary?" using a simple savings rate formula.

## Current State

The current implementation in `useSparingData.ts` uses:
1. A non-existent `profile.annualExpenses` field (falls back to 0)
2. Complex `calculateYearsToValue` function with compound growth
3. Wrong annual savings calculation: `annualIncome - 0 = fullIncome`

**Result**: Shows impossibly fast time because it assumes 100% savings rate.

```typescript
// Current broken code (lines 241-261)
const annualIncome = (profile.monthlySalary || 0) * 12;
const annualExpenses = profile.annualExpenses || 0;  // BUG: field doesn't exist!
const annualSavings = annualIncome - annualExpenses; // Wrong: becomes full income

yearsToSalary = calculateYearsToValue(
  sparingData.sumSavings,
  annualIncome,
  annualSavings,  // Wrong value passed
  annualGrowthRate
);
```

## Desired Outcome

Use the correct simple formula based on savings rate:

```
År til årslønn = 1 / sparerate
```

Or equivalently: `1 + (1 - sparerate) / sparerate`

**Example**: 38% savings rate → `1 / 0.38 = 2.63 years`

This is a pure ratio calculation - no compound growth, no current savings needed.

## Acceptance Criteria

- [x] "År til årslønn" displays correct value based on savings rate
- [x] Formula: `1 / (savingsRate / 100)` where savingsRate is percentage
- [x] Handle edge case: savingsRate = 0 → show "—" (infinity)
- [x] Update explanation text to match new formula (no 7% growth mention)
- [x] Remove unused `annualExpenses` variable
- [x] Lint and type-check pass

## Affected Components

### Frontend
- **File**: `frontend/src/features/sparing/useSparingData.ts` - calculation fix
- **File**: `frontend/src/features/sparing/FireSection.tsx` - explanation text update (line 116)

### Backend
- None (backend calculation is correct, this is frontend-only bug)

## Technical Approach

### Implementation Steps

1. **Replace yearsToSalary calculation** (line ~256-261):

```typescript
// Before (broken)
yearsToSalary = calculateYearsToValue(
  sparingData.sumSavings,
  annualIncome,
  annualSavings,
  annualGrowthRate
);

// After (correct)
const savingsRateDecimal = sparingData.savingsRate / 100;
yearsToSalary = savingsRateDecimal > 0 ? 1 / savingsRateDecimal : Infinity;
```

2. **Update explanation text** in `FireSection.tsx` (line 116):

```typescript
// Before
'Basert på nåværende sparing, månedlig sparing, og forventet avkastning (7% årlig). Dette er en milepæl på veien mot F.I.R.E.'

// After
'Antall år det tar å spare én årslønn med din sparerate. Formel: 1 / sparerate.'
```

3. **Clean up unused variables**:
   - Remove `annualExpenses` variable (line 242)
   - Keep `annualSavings` only if needed for `minRetireAge` calculation
   - If `annualSavings` is needed, fix it: `(profile.monthlySavings || 0) * 12`

4. **Verify minRetireAge calculation**:
   - Check if it also uses wrong `annualSavings`
   - Fix if needed (use `monthlySavings * 12`)

### Code Reference

Backend has correct expense derivation pattern:

```typescript
// File: backend/src/services/calculationService.ts (lines 26-28)
export function deriveAnnualExpenses(profile: UserProfile): number {
  return (profile.monthlySalary - profile.monthlySavings) * 12;
}
```

## Verification

1. Login with demo user (has 38% savings rate roughly)
2. Navigate to Sparing page
3. Check "År til årslønn" shows ~2.6 years (not 0 or very low number)
4. Verify "Min. pensjonsalder" still calculates correctly

---

**Next Steps**: Ready for implementation. Move to `.task-board/in-progress/` when starting work.
