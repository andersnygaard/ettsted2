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
- [ ] X-axis labels show unique values only
- [ ] Labels evenly distributed across chart width
- [ ] First and last data points always labeled
- [ ] Maximum 5 labels shown (current behavior)
- [ ] No visual overlap of labels

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
