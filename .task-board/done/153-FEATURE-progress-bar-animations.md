# 125-FEATURE: Progress Bar Animations

## Summary
Add smooth fill animations to ProgressBar component and milestone progress bars. Bars should animate from 0% to target width on mount.

## Context
Progress bars currently render at their final width. Animating the fill creates visual interest and helps users notice progress metrics. Used in:
- Dashboard milestone section
- F.I.R.E. progress on Sparing page
- Onboarding wizard

## Acceptance Criteria
- [x] Progress bar width animates from 0 to target on mount
- [x] Animation duration: 600-800ms
- [x] Use ease-out timing function
- [x] Optional delay prop for staggered effects
- [x] Animate on value change (not just mount)
- [x] Respect `prefers-reduced-motion`

## Technical Approach
1. Use CSS `transition` on width property
2. Mount with `width: 0`, then apply actual width after render
3. Use `useLayoutEffect` to avoid flash of final state

### CSS
```css
.progress-bar-fill {
  width: 0;
  transition: width 0.6s ease-out;
}
.progress-bar-fill.animate {
  width: var(--progress-width);
}
```

## Files to Modify
- [ProgressBar.tsx](components/src/forms/ProgressBar/ProgressBar.tsx)
- [ProgressBar.css](components/src/forms/ProgressBar/ProgressBar.css)
- [DashboardPage.css](frontend/src/features/dashboard/DashboardPage.css) (milestone-bar-fill)

## Implementation Details

### ProgressBar Component Changes
1. Added `useLayoutEffect` hook to trigger animations after mount
2. Added `animate` prop (boolean, default: true) to enable/disable animations
3. Added `delay` prop (number in milliseconds, default: 0) for staggered effects
4. Used ref to track fill element for direct width manipulation
5. Animation starts from 0% width, then transitions to target width
6. Respects value changes - re-runs animation when value prop changes

### CSS Changes
1. Updated `.progress-bar__fill` transition to `0.6s ease-out`
2. Added `@media (prefers-reduced-motion: reduce)` to disable transitions
3. Updated `.milestone-bar-fill` transition from `0.6s ease` to `0.6s ease-out`
4. Added `@media (prefers-reduced-motion: reduce)` to DashboardPage.css

### Storybook Stories Added
- `AnimatedProgress`: Demonstrates basic animation
- `AnimatedWithDelay`: Shows staggered animations with delay prop
- `NoAnimation`: Shows static progress without animation

## Priority
Medium

## Effort
Simple (2-3 hours)

## Labels
design, animation, component, polish

## Status
COMPLETED - Animation implemented and tested. Both frontend and components builds succeed.
