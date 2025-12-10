# 265 - BUG: Pensjon chart has duplicate x-axis labels

## Priority
Low

## Type
Bug

## Description
StackedAreaChart x-axis generates labels that may show duplicate years when data spans multiple years with same year values (e.g., "2024, 2024, 2024, 2025").

## Root Cause
`getXAxisLabels` function in `StackedAreaChart.tsx` (lines 197-220) uses evenly-spaced sampling which can create duplicate labels when multiple data points share the same year.

## Acceptance Criteria
- [x] X-axis labels show unique values only
- [x] Labels evenly distributed across chart width
- [x] First and last data points always labeled
- [x] Maximum 5 labels shown (current behavior)
- [x] No visual overlap of labels

## Files to Change
- `components/src/charts/StackedAreaChart/StackedAreaChart.tsx`

## Technical Notes
Current logic (line 197-220):
```typescript
function getXAxisLabels(
  data: StackedDataPoint[],
  format: (date: Date) => string,
  maxLabels = 5
): string[] {
  if (data.length === 0) return [];
  if (data.length <= maxLabels) {
    return data.map((d) => format(d.date));
  }

  const step = Math.floor(data.length / (maxLabels - 1));
  const labels: string[] = [];

  for (let i = 0; i < data.length; i += step) {
    labels.push(format(data[i].date));
  }

  // Always include the last label
  if (labels.length < maxLabels) {
    labels.push(format(data[data.length - 1].date));
  }

  return labels.slice(0, maxLabels);
}
```

Solution:
Use Set to deduplicate labels or use smarter sampling based on date ranges.

Alternative approach:
```typescript
const labels = new Set<string>();
// Sample and deduplicate
```

Or use D3's tick generation for time scales.

## Testing
- Test with 12 months of data (same year)
- Test with 24 months (two years)
- Test with single data point
- Verify labels don't overlap
- Verify visual spacing is even

## Resolution

### Implementation Details
Fixed the `getXAxisLabels` function in `components/src/charts/StackedAreaChart/StackedAreaChart.tsx` to deduplicate labels using a Set-based approach.

**Key changes:**
1. First, extract all unique labels using `new Set(allLabels)`
2. If unique labels fit within maxLabels, return them directly
3. Otherwise, sample evenly from unique labels while ensuring:
   - First label always included (index 0)
   - Last label always included (index length-1)
   - Even distribution across middle labels
4. Final deduplication pass with Set to prevent edge-case duplicates

**Algorithm:**
- Build unique label set from all data points
- Use proportional step calculation: `step = (length - 1) / (maxLabels - 1)`
- Sample indices using `Math.round(i * step)` for smooth distribution
- Return only unique values via Set

### Build Status
✓ ESLint: No errors or warnings
✓ Full pnpm build: Successful (5.33s)
✓ No TypeScript errors

### Testing Notes
The fix handles:
- Single data point (returns that point's label)
- Data with fewer unique labels than maxLabels (returns all)
- Data with duplicate consecutive dates (e.g., multiple entries same year)
- Multiple years spanning data (even distribution across years)
