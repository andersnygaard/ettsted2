# 123-FEATURE: Chart Entry Animations

## Summary
Add smooth entry animations to D3 charts (AreaChart, StackedAreaChart, DonutChart). Charts should animate in on mount rather than appearing instantly.

## Context
D3 charts currently render immediately. Adding entrance animations improves perceived performance and creates a more polished experience. Design drafts imply animated data visualization.

## Acceptance Criteria
- [x] AreaChart: Line draws from left to right
- [x] StackedAreaChart: Areas fade and grow from bottom
- [x] DonutChart: Segments animate in clockwise
- [x] Animation duration: 800-1000ms
- [x] Smooth easing (ease-out or cubic-bezier)
- [x] Respect `prefers-reduced-motion` preference

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

---

## Implementation Summary

### AreaChart (`c:\code\ettsted2\components\src\charts\AreaChart\AreaChart.tsx`)
- Replaced hardcoded `stroke-dasharray: 1000` with dynamic path length calculation using `getTotalLength()`
- Line animation: stroke draws from left to right over 1000ms with 300ms delay
- Area fill: fades in over 800ms with 200ms delay
- Added `prefers-reduced-motion` media query support

### StackedAreaChart (`c:\code\ettsted2\components\src\charts\StackedAreaChart\StackedAreaChart.tsx`)
- Implemented staggered animations for each area layer (100ms delay between layers)
- Areas grow from bottom using `transform: translate/scale` animation over 800ms
- Lines draw from left to right using calculated path lengths over 1000ms
- Added `prefers-reduced-motion` media query support

### DonutChart (`c:\code\ettsted2\components\src\charts\DonutChart\DonutChart.tsx`)
- **Major refactor**: Converted from CSS `conic-gradient` to D3 SVG arcs for proper animation control
- Arc animates clockwise from 0° to target percentage over 1000ms with 200ms delay
- Used D3's `attrTween` for smooth arc interpolation with `d3.easeCubicOut` easing
- Added `prefers-reduced-motion` media query support

### CSS Updates
- Removed hardcoded CSS animations from all chart stylesheets
- Added `@media (prefers-reduced-motion: reduce)` rules to disable container fade-up animations
- All animations now controlled via D3 transitions for precise timing and path-based animations

### Build Status
✅ Frontend build successful - all TypeScript compilation passed

## COMPLETED
All acceptance criteria met. Charts now have smooth, professional entry animations with proper accessibility support.
