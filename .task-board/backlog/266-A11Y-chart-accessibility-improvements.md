# 266 - A11Y: Chart accessibility improvements

## Priority
Medium

## Type
Accessibility

## Description
AreaChart and StackedAreaChart components lack proper ARIA labels, screen reader announcements, and keyboard navigation for data points.

## User Story
As a screen reader user, I want to understand chart data through accessible alternatives so that I can track my financial progress without relying on visual charts.

## Acceptance Criteria
- [ ] Charts have `role="img"` and descriptive `aria-label`
- [ ] SVG has `<title>` and `<desc>` elements
- [ ] Screen reader announces summary (min, max, trend)
- [ ] Keyboard navigation to explore data points (optional enhancement)
- [ ] Data table alternative available (hidden visually, exposed to SR)
- [ ] Color contrast meets WCAG AA standards
- [ ] Reduced motion preference respected (already implemented)

## Files to Change
- `components/src/charts/AreaChart/AreaChart.tsx`
- `components/src/charts/StackedAreaChart/StackedAreaChart.tsx`
- `components/src/charts/AreaChart/AreaChart.css`
- `components/src/charts/StackedAreaChart/StackedAreaChart.css`

## Technical Notes
Add ARIA attributes:
```tsx
<section className="area-chart" role="img" aria-label={`${title}: Chart showing values from ${minDate} to ${maxDate}`}>
  <svg ref={svgRef}>
    <title>{title}</title>
    <desc>Line chart showing {data.length} data points ranging from {minValue} to {maxValue}</desc>
  </svg>
</section>
```

Add visually hidden data table:
```tsx
<table className="sr-only" aria-label={`${title} data table`}>
  <thead>
    <tr><th>Date</th><th>Value</th></tr>
  </thead>
  <tbody>
    {data.map(d => <tr key={d.date}><td>{formatDate(d.date)}</td><td>{formatCurrency(d.value)}</td></tr>)}
  </tbody>
</table>
```

## Testing
- Test with NVDA/JAWS screen readers
- Test keyboard navigation
- Run axe DevTools
- Verify color contrast ratios
- Test with reduced motion enabled
