# 123-FEATURE: Chart Entry Animations

## Summary
Add smooth entry animations to D3 charts (AreaChart, StackedAreaChart, DonutChart). Charts should animate in on mount rather than appearing instantly.

## Context
D3 charts currently render immediately. Adding entrance animations improves perceived performance and creates a more polished experience. Design drafts imply animated data visualization.

## Acceptance Criteria
- [ ] AreaChart: Line draws from left to right
- [ ] StackedAreaChart: Areas fade and grow from bottom
- [ ] DonutChart: Segments animate in clockwise
- [ ] Animation duration: 800-1000ms
- [ ] Smooth easing (ease-out or cubic-bezier)
- [ ] Respect `prefers-reduced-motion` preference

## Technical Approach
### AreaChart
1. Use SVG `stroke-dasharray` and `stroke-dashoffset` for line draw effect
2. Animate path length from 0 to total length

### StackedAreaChart
1. Animate `transform: scaleY(0)` to `scaleY(1)` on areas
2. Transform origin at bottom

### DonutChart
1. Use `stroke-dasharray` animation on arc paths
2. Stagger each segment's animation

## Files to Modify
- [AreaChart.tsx](components/src/charts/AreaChart/AreaChart.tsx)
- [AreaChart.css](components/src/charts/AreaChart/AreaChart.css)
- [StackedAreaChart.tsx](components/src/charts/StackedAreaChart/StackedAreaChart.tsx)
- [DonutChart.tsx](components/src/charts/DonutChart/DonutChart.tsx)

## Priority
Medium

## Effort
Medium (4-6 hours)

## Labels
design, animation, d3, charts, polish
