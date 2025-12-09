# 268 - PERF: Chart render optimization (memoization)

## Priority
Low

## Type
Performance

## Description
AreaChart and StackedAreaChart re-render on every parent component update due to missing memoization. Should use React.memo and useMemo for expensive D3 calculations.

## Root Cause
Charts recalculate D3 scales and redraw SVG on every render, even when data hasn't changed.

## Acceptance Criteria
- [ ] Chart components wrapped in React.memo with custom comparison
- [ ] D3 scale calculations memoized with useMemo
- [ ] SVG path data cached when data unchanged
- [ ] No unnecessary re-renders when parent updates
- [ ] Chart still updates when data/dimensions change
- [ ] Performance improvement measurable (React DevTools Profiler)

## Files to Change
- `components/src/charts/AreaChart/AreaChart.tsx`
- `components/src/charts/StackedAreaChart/StackedAreaChart.tsx`

## Technical Notes
Wrap component export:
```tsx
export const AreaChart = React.memo(AreaChartComponent, (prev, next) => {
  return (
    prev.data === next.data &&
    prev.color === next.color &&
    prev.height === next.height
  );
});
```

Memoize calculations:
```tsx
const scales = useMemo(() => {
  const x = d3.scaleTime()...
  const y = d3.scaleLinear()...
  return { x, y };
}, [data, dimensions]);
```

## Testing
- Use React DevTools Profiler
- Measure render count before/after
- Test with frequent parent re-renders
- Verify charts still update when data changes
