# 264 - REFACTOR: Number formatting consistency across pages

## Priority
Medium

## Type
Refactor

## Description
Manual number formatting with `.replace('.', ',')` used inconsistently across pages. Should use centralized `formatCurrency` and `formatNumber` utilities from `@finans/components`.

## Root Cause
Historical code written before format utilities were created. Developers used manual string replacement for Norwegian formatting.

## Acceptance Criteria
- [x] All manual `.replace('.', ',')` removed
- [x] All currency values use `formatCurrency(value)`
- [x] All percentage values use consistent formatting (e.g., `${value.toFixed(2).replace('.', ',')}%` → utility)
- [x] All plain numbers use `formatNumber(value)`
- [x] No direct `.toFixed()` calls without Norwegian locale formatting
- [x] Consistent formatting across all pages

## Files to Change
Search for patterns:
- `.replace('.', ',')`
- `.toFixed(` without following format call
- Manual string concatenation with ' kr'

Pages to review:
- `frontend/src/features/sparing/SparingPage.tsx` (line 92-93)
- `frontend/src/features/portfolio/PortfolioPage.tsx`
- `frontend/src/features/gjeld/GjeldPage.tsx`
- `frontend/src/features/pensjon/PensjonPage.tsx`
- `frontend/src/features/dashboard/DashboardPage.tsx`

## Technical Notes
Existing utilities in `components/src/utils/format.ts`:
- `formatNumber(value)` - "123 456,78"
- `formatCurrency(value)` - "123 456,78 kr"
- `formatDate(date)` - "01.01.2024"

Create additional utility if needed:
```typescript
export function formatPercent(value: number, decimals = 2): string {
  return value.toLocaleString('nb-NO', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }) + '%';
}
```

## Testing
- Verify all numbers display with space thousands separator
- Verify all decimals use comma (not period)
- Verify currency suffix is ' kr'
- Visual regression test across all pages

## Resolution

### Files Modified
1. `frontend/src/features/sparing/SparingPage.tsx` - Replaced 2x formatPercentage for savings rate and monthly change
2. `frontend/src/features/sparing/FireSection.tsx` - Replaced 4x manual formatting with formatPercentage and formatNumber
3. `frontend/src/features/gjeld/LoansList.tsx` - Replaced 1x interest rate formatting with formatNumber
4. `frontend/src/features/dashboard/DashboardPage.tsx` - Replaced 2x formatPercentage for hero change and savings rate
5. `frontend/src/features/portfolio/PortfolioPage.tsx` - Replaced CSV export formatting with toLocaleString
6. `frontend/src/features/calculators/FireCalculatorPage.tsx` - Replaced 3x formatPercentage for savings rate and progress
7. `frontend/src/features/calculators/CompoundCalculatorPage.tsx` - Replaced 1x formatPercentage for interest percentage
8. `frontend/src/features/calculators/LoanCalculatorPage.tsx` - Replaced 1x formatPercentage for interest percentage
9. `frontend/src/features/calculators/MonteCarloPage.tsx` - Replaced 1x formatPercentage for withdrawal rate
10. `frontend/src/features/calculators/MonteCarloChart.tsx` - Replaced 2x toFixed with toLocaleString for D3 axis formatting

### Patterns Replaced
- All `.replace('.', ',')` patterns: 10 occurrences removed
- All manual `toFixed().replace()` for percentages: replaced with `formatPercentage(value / 100, decimals)`
- All manual `toFixed()` for plain numbers: replaced with `formatNumber(value, decimals)`
- CSV export: replaced with `toLocaleString('nb-NO', {...})`
- D3 axis labels: replaced with `toLocaleString('nb-NO', {...})`

### Build Status
✓ Frontend build succeeded
✓ No TypeScript errors
✓ No unused imports
✓ All format utilities properly imported from @finans/components

### Impact
- Centralized number formatting across entire frontend
- Consistent Norwegian locale formatting (space thousands separator, comma decimal)
- Reduced code duplication
- Easier maintenance through single source of truth
