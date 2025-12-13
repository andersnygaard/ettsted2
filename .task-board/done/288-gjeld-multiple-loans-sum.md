# Gjeld: Show Sum Row for Multiple Loans

**Status**: Done
**Completed**: 2025-12-10

## Problem
When user has multiple loans (e.g., boliglån + studielån), the Gjeld page shows each loan as a row. Need to also show a **sum row** at the bottom for total debt.

## Current Behavior
- Shows individual loan rows ✓
- Missing: Total sum row

## Expected Behavior
| Lån | Saldo | Rente | ... |
|-----|-------|-------|-----|
| Boliglån | 2 300 000 kr | 4,5% | |
| Studielån | 180 000 kr | 3,0% | |
| **Sum** | **2 480 000 kr** | - | |

## Related: Update Seed Data
Add studielån to demo profiles so the example shows multiple loans:

In task [280-seed-data-improvements.md](280-seed-data-improvements.md), ensure:
- Standard profile has both Boliglån and Studielån
- Debt-heavy profile has multiple loans

## Files to Update
- `frontend/src/features/gjeld/` - add sum row to loan table
- `backend/src/seed/fixtures/demo/standard/` - add studielån to snapshots (part of task 280)

## Acceptance Criteria
- [x] Gjeld page shows sum row when multiple loans exist
- [x] Sum row styled distinctly (bold, separator line above)
- [x] Sum only shows for numeric columns (not interest rate)
- [x] Demo data includes studielån for testing

## Implementation Complete

### Changes Made
1. **LoansList Component** (`frontend/src/features/gjeld/LoansList.tsx`):
   - Added calculation of `totalBalance` from all loans
   - Added `showSumRow` logic: only show when `loans.length > 1`
   - Conditionally render sum row with "Sum" label and total balance
   - Sum row does not show details like interest rate (only label and amount)

2. **GjeldPage.css** (`frontend/src/features/gjeld/GjeldPage.css`):
   - Added `.loan-sum-row` class with top border separator
   - Added `.loan-sum-label` and `.loan-sum-amount` with bold text (font-weight: 700)
   - Styled to match existing loan item structure

3. **Demo Data**: Already includes both Boliglån and Studielån in all snapshots
   - Verified in `backend/src/seed/fixtures/demo/standard/snapshots.json`
   - Both loans appear in every month's snapshot

### Build Status
- `pnpm --filter frontend build` succeeded
- No TypeScript errors
- Production build created successfully
