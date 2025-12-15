# FEATURE: Replace "Min. pensjonsalder" KPI with "Måneder dekket"

**Status**: Done
**Created**: 2025-12-15
**Priority**: Medium
**Labels**: frontend, sparing, fire
**Estimated Effort**: Simple - 20 minutes

## Context & Motivation

The "Min. pensjonsalder" (minimum retirement age) KPI uses complex compound growth projections that are hard to understand and currently buggy (wrong annualSavings value). Replace with a simpler, more intuitive metric that directly shows F.I.R.E. progress.

## Current State

**Current KPI**: "Min. pensjonsalder"
- Shows projected age when you can retire
- Uses compound growth formula (7% årlig)
- Complex calculation with multiple inputs
- Currently buggy (uses non-existent `annualExpenses` field)

## Desired Outcome

**New KPI**: "Måneder dekket"
- Shows months of expenses covered by 4% annual withdrawal
- Simple formula: `annualWithdrawal / monthlyExpenses`
- When it reaches **12** → You've hit F.I.R.E.! 🔥
- Direct, intuitive measure of financial independence progress

## Formula

```
månederDekket = (sumSavings × 0.04) / (monthlySalary - monthlySavings)
              = annualWithdrawal / monthlyExpenses
```

**Example**:
- Sum savings: 6 129 000 kr
- Annual withdrawal (4%): 245 160 kr
- Monthly expenses: 33 333 kr
- Months covered: 245 160 / 33 333 = **7.4 months**

**Interpretation**:
- < 12: Not yet F.I.R.E.
- = 12: Exactly F.I.R.E. (4% covers all expenses)
- > 12: Beyond F.I.R.E. (buffer/margin)

## Acceptance Criteria

- [x] Replace "Min. pensjonsalder" with "Måneder dekket" in FireSection
- [x] Calculate: `annualWithdrawal / monthlyExpenses`
- [x] Handle edge case: monthlyExpenses = 0 → show "—"
- [x] Update label: "Måneder dekket"
- [x] Update explanation: "Antall måneder av utgifter dekket av årlig 4%-uttak. Ved 12 måneder er du økonomisk uavhengig."
- [x] Remove `minRetireAge` from useSparingData (no longer needed)
- [x] Lint and type-check pass

## Affected Components

### Frontend
- **File**: `frontend/src/features/sparing/useSparingData.ts`
  - Remove `minRetireAge` calculation
  - Add `monthsCovered` calculation
- **File**: `frontend/src/features/sparing/FireSection.tsx`
  - Update props interface (remove `minRetireAge`, add `monthsCovered`)
  - Update stat config (label, value, explanation)

## Technical Approach

### Implementation Steps

1. **Update useSparingData.ts** - Replace minRetireAge with monthsCovered:

```typescript
// Before
const yearsToFire = calculateYearsToValue(...);
minRetireAge = yearsToFire === Infinity ? 999 : currentAge + yearsToFire;

// After
const monthlyExpenses = (profile.monthlySalary || 0) - (profile.monthlySavings || 0);
const monthsCovered = monthlyExpenses > 0
  ? sparingData.annualWithdrawal / monthlyExpenses
  : 0;
```

2. **Update SparingData interface**:

```typescript
// Remove
minRetireAge: number;

// Add
monthsCovered: number;
```

3. **Update FireSection props**:

```typescript
// Before
minRetireAge: number;

// After
monthsCovered: number;
```

4. **Update FireSection stat config**:

```typescript
// Before
{
  id: 'pensjonsalder',
  value: minRetireAgeFormatted,
  label: 'Min. pensjonsalder',
  explanation: '...'
}

// After
{
  id: 'maneder-dekket',
  value: monthsCoveredFormatted,
  label: 'Måneder dekket',
  explanation: 'Antall måneder av utgifter dekket av årlig 4%-uttak. Ved 12 måneder er du økonomisk uavhengig.'
}
```

5. **Format the value**:

```typescript
const monthsCoveredFormatted = monthsCovered === 0 ? '—' : formatNumber(monthsCovered, 1);
```

### Cleanup

- Remove `minRetireAge` from return object in useSparingData
- Remove `calculateYearsToValue` call for minRetireAge
- Can potentially remove `calculateYearsToValue` function entirely if no longer used

## Verification

1. Login with demo user
2. Navigate to Sparing page
3. Check "Måneder dekket" shows reasonable value (e.g., 7.4)
4. Click to expand explanation - verify text
5. Verify other KPIs still work correctly

## Related Plans

- [328-BUG-sparing-years-to-salary.md](328-BUG-sparing-years-to-salary.md) - Fixes "År til årslønn" KPI

---

**Next Steps**: Ready for implementation. Move to `.task-board/in-progress/` when starting work.
