# 125-FEATURE: Progress Bar Animations

## Summary
Add smooth fill animations to ProgressBar component and milestone progress bars. Bars should animate from 0% to target width on mount.

## Context
Progress bars currently render at their final width. Animating the fill creates visual interest and helps users notice progress metrics. Used in:
- Dashboard milestone section
- F.I.R.E. progress on Sparing page
- Onboarding wizard

## Acceptance Criteria
- [ ] Progress bar width animates from 0 to target on mount
- [ ] Animation duration: 600-800ms
- [ ] Use ease-out timing function
- [ ] Optional delay prop for staggered effects
- [ ] Animate on value change (not just mount)
- [ ] Respect `prefers-reduced-motion`

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

## Priority
Medium

## Effort
Simple (2-3 hours)

## Labels
design, animation, component, polish
