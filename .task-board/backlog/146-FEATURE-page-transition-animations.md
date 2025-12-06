# 121-FEATURE: Page Transition Animations

## Summary
Add smooth page transition animations when navigating between routes. Currently pages render instantly without any entrance animation.

## Context
Design drafts show staggered fadeUp animations on page load. While some CSS animations exist, the page transition experience lacks polish. React Router v6 with Framer Motion or CSS-based transitions can improve this.

## Acceptance Criteria
- [ ] Add fadeIn animation on route change
- [ ] Implement staggered children animation for page sections
- [ ] Ensure no layout shift during transitions
- [ ] Animation duration: 300-400ms
- [ ] Respect `prefers-reduced-motion` preference

## Technical Approach
### Option A: CSS-only (Preferred for simplicity)
1. Add `page-enter` animation class to main page containers
2. Use CSS `@keyframes fadeUp` on route mount
3. Add staggered delays to child sections

### Option B: Framer Motion
1. Install `framer-motion`
2. Wrap routes with `AnimatePresence`
3. Add `motion.div` to page containers

## Files to Modify
- [App.tsx](frontend/src/App.tsx) - Add animation wrapper
- [animations.css](frontend/src/styles/animations.css) - Add page transition keyframes
- Individual page CSS files for section staggering

## Priority
High

## Effort
Medium (4-6 hours)

## Labels
design, animation, ux, polish
