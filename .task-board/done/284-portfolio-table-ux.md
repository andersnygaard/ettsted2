# Portfolio: "Alle år" Should Show 24 Months

**Status**: Done
**Completed**: 2025-12-10

## Problem
When selecting "Alle år" filter on Portefølje page, only 12 months are shown. Should show up to 24 months for better historical overview.

**Current**: 12 months max
**Expected**: Up to 24 months

## Solution
Modified pagination logic in `PortfolioPage.tsx` to show 24 items per page when "Alle år" is selected, and 12 items per page for specific year selections.

## Files Updated
- `frontend/src/features/portfolio/PortfolioPage.tsx`
  - Replaced static `ITEMS_PER_PAGE = 12` with dynamic `itemsPerPage` variable
  - `itemsPerPage = 24` when `selectedYear === null` (all years)
  - `itemsPerPage = 12` when specific year is selected
  - Updated pagination logic to use `itemsPerPage` instead of constant

## Acceptance Criteria
- [x] "Alle år" displays up to 24 months of snapshots

## Verification
- Frontend build successful
- No TypeScript errors
- Pagination logic correctly uses dynamic items per page
