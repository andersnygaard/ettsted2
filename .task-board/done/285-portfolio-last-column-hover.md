# Portfolio: Last Column Width and Hover Artifact

**Status**: Done
**Completed**: 2025-12-10

## Problem
On the SpreadsheetTable (Portefølje page):
1. Last column can become extremely narrow (~40px) - hard to read values and doesn't meet 44px touch target minimum
2. When hovering over values in the last column, tooltip/popover gets cut off or overflows outside viewport

## Expected Behavior
1. Last column should have minimum 44px width (per touch target standard from task 228)
2. Tooltip positions itself to the left (instead of right) when on rightmost columns to stay within viewport

## Reference
- Task 228 established 44px as minimum touch target size
- `--touch-target-min: 44px` CSS variable in tokens.css

## Files Updated
- `components/src/data/SpreadsheetTable/SpreadsheetTable.css` - Added min-width: 80px to table cells and headers
- `components/src/data/SpreadsheetTable/SpreadsheetTable.tsx` - Integrated Tooltip component into formatCell
- `components/src/ui/Tooltip/Tooltip.tsx` - NEW: Smart positioning tooltip component
- `components/src/ui/Tooltip/Tooltip.css` - NEW: Tooltip styling with left/right positioning
- `components/src/ui/Tooltip/index.ts` - NEW: Tooltip exports
- `components/src/index.ts` - Added Tooltip to barrel exports

## Acceptance Criteria
- [x] Last column has minimum readable width (not collapsed to ~40px)
- [x] Hover tooltips stay within viewport on last column

## Implementation Details

### 1. Minimum Column Width
- Added `min-width: 80px` to `.spreadsheet td` and `.spreadsheet th`
- 80px provides comfortable readability and exceeds 44px touch target minimum
- All numeric values now display with consistent width across columns

### 2. Smart Tooltip Component
Created new `Tooltip` component with:
- Auto-flip positioning (left/right) based on viewport space
- Auto-detects when near right edge and flips to left positioning
- 44px minimum touch target for accessibility
- Arrow indicator pointing to trigger element
- Keyboard accessible (Escape to close)
- Fade-in animation with accessibility support (prefers-reduced-motion)
- ARIA labels for screen readers

### 3. Integration with SpreadsheetTable
- Updated `formatCell` to wrap numeric values in Tooltip
- Tooltip displays formatted value on hover
- Maintains milestone highlighting with tooltip
- Smart positioning ensures tooltips never overflow viewport

## Testing Notes
- Tooltip automatically flips to left when value is in rightmost columns
- Works on mobile (hover timeout: 200ms)
- All numeric values show readable tooltip on hover
- Milestone highlighting preserved with tooltip
