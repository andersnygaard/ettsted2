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
- [ ] All manual `.replace('.', ',')` removed
- [ ] All currency values use `formatCurrency(value)`
- [ ] All percentage values use consistent formatting (e.g., `${value.toFixed(2).replace('.', ',')}%` → utility)
- [ ] All plain numbers use `formatNumber(value)`
- [ ] No direct `.toFixed()` calls without Norwegian locale formatting
- [ ] Consistent formatting across all pages

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
