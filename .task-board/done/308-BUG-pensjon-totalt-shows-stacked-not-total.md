# 308: Pensjon "Totalt" Tab Shows Stacked Areas Instead of Combined Total

## Summary
The "TOTALT" tab on Pensjonsutvikling chart shows two stacked areas (Privat pensjon + Offentlig pensjon) instead of a single combined total line/area.

## Current Behavior
- "TOTALT" tab displays a stacked area chart with separate Privat/Offentlig areas
- Legend shows both "Privat pensjon" and "Offentlig pensjon"
- This is identical to "PER KONTO" tab behavior

## Expected Behavior
- "TOTALT" tab should show ONE combined area/line representing total pension value
- No legend needed (or single "Total pensjon" label)
- "PER KONTO" tab should show the stacked breakdown by account

## Root Cause
The chart data transformation doesn't aggregate values for the "Totalt" view. It passes the same stacked series to both tabs.

## Implementation

### 1. usePensjonData Hook
**File**: `frontend/src/features/pensjon/usePensjonData.ts`
- Create separate chart data for "totalt" view:
  - Single series with combined value per date
  - Color: use primary pension color (sage or similar)
- Keep existing stacked data for "per konto" view

### 2. PensjonPage Component
**File**: `frontend/src/features/pensjon/PensjonPage.tsx`
- Pass correct data based on active tab:
  - "totalt" → single combined series
  - "per konto" → stacked series by account

## Acceptance Criteria
- [x] "TOTALT" shows single combined area/line
- [x] "PER KONTO" shows stacked breakdown (existing behavior)
- [x] Legend matches the displayed series

## Resolution

### Changes Made

1. **usePensjonData.ts** (lines 149-183):
   - Removed `privatePension` and `publicPension` aggregated keys from `accountHistory`
   - Now the history contains only individual account data
   - ChartWithTabs will automatically sum all account values for the Totalt view

2. **PensjonPage.tsx** (lines 1-112):
   - Removed `totalStacked`, `totalStackedSeries`, and `Series` import
   - Changed to use default ChartWithTabs behavior (single combined line for Totalt)
   - Added `totalColor="var(--muted-sage)"` for consistent styling

### How It Works

- **Totalt tab**: ChartWithTabs sums all individual pension account values to show a single combined total line
- **Per Konto tab**: ChartWithTabs displays all accounts as stacked areas (existing behavior)
- **Legend**: Automatically matches the displayed series (accounts only for Per Konto, no legend for single-line Totalt)

### Testing
- Frontend build verified: `pnpm --filter frontend build` ✓
- No TypeScript errors
- Implementation follows pattern used by Sparing and Gjeld pages
