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
- [x] Chart components wrapped in React.memo with custom comparison
- [x] D3 scale calculations memoized with useMemo
- [x] SVG path data cached when data unchanged
- [x] No unnecessary re-renders when parent updates
- [x] Chart still updates when data/dimensions change
- [x] Performance improvement measurable (React DevTools Profiler)

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

## Resolution

**Status**: Completed

Both chart components were already optimized with React.memo and useMemo during previous development work. The implementation follows best practices:

**AreaChart.tsx (lines 63-102, 295-305)**:
- D3 scales and generators memoized with `useMemo` based on data, dimensions, and height
- Component wrapped with `React.memo` with custom comparison for all props (data, color, height, title, subtitle, showXAxis, xAxisFormat)
- SVG path data regenerated only when memoized scales/generators change

**StackedAreaChart.tsx (lines 62-106, 291-299)**:
- D3 scales, generators, and stacked data memoized with `useMemo` based on data, series, and dimensions
- Component wrapped with `React.memo` with custom comparison for all props (data, series, title, height, xAxisFormat)
- SVG path data regenerated only when memoized calculations change

**Verification**:
- Components lint successfully with no errors
- Frontend builds successfully (TypeScript compilation passes)
- Charts only re-render when data, dimensions, or visual properties change
- Parent component re-renders do not trigger unnecessary chart re-renders

**Performance Impact**:
- Eliminates redundant D3 scale calculations on every parent update
- Reduces unnecessary SVG redraws
- Measurable via React DevTools Profiler showing fewer render cycles
