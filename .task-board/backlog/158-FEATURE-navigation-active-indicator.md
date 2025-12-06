# 128-FEATURE: Navigation Active Indicator Animation

## Summary
Add animated indicator for active navigation items. Design drafts show active state but current implementation may lack smooth transition.

## Context
Header navigation links show active state on current page. Adding an animated underline or background that transitions between items creates a more polished navigation experience.

## Acceptance Criteria
- [ ] Active nav item has visual indicator (underline or background)
- [ ] Indicator animates when switching pages
- [ ] Smooth color transitions on hover
- [ ] Works in both desktop and mobile navigation
- [ ] Indicator position transitions smoothly

## Technical Approach
### Option A: Animated Underline
1. Use `::after` pseudo-element for underline
2. Animate `width` or `transform: scaleX()` on active state
3. Use `transform-origin: left` for left-to-right animation

### Option B: Background Pill
1. Add background pill that moves between items
2. Use CSS custom properties for position
3. Animate with `transition: transform`

## Files to Modify
- [AppHeader.css](frontend/src/shared/components/AppHeader.css)
- [Layout.css](frontend/src/shared/components/Layout.css)

## Priority
Low

## Effort
Medium (2-3 hours)

## Labels
design, animation, navigation, polish
