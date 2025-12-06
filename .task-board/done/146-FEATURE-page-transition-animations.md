# 146-FEATURE: Page Transition Animations

## Summary
Add smooth page transition animations when navigating between routes. Currently pages render instantly without any entrance animation.

## Context
Design drafts show staggered fadeUp animations on page load. While some CSS animations exist, the page transition experience lacks polish. React Router v6 with Framer Motion or CSS-based transitions can improve this.

## Acceptance Criteria
- [x] Add fadeIn animation on route change
- [x] Implement staggered children animation for page sections
- [x] Ensure no layout shift during transitions
- [x] Animation duration: 300-400ms (350ms)
- [x] Respect `prefers-reduced-motion` preference

## Technical Approach
### Option A: CSS-only (Preferred for simplicity) ✓ USED
1. Add `page-enter` animation class to main page containers
2. Use CSS `@keyframes fadeUp` on route mount
3. Add staggered delays to child sections

## Implementation Details

### Files Modified

1. **frontend/src/styles/animations.css**
   - Updated `fadeUp` keyframe to use 10px translateY (was 20px)
   - Added `.page-enter` class with 350ms duration and ease-out timing
   - Added `.page-section-delay-0` through `.page-section-delay-5` for staggered entry
   - Updated `@media (prefers-reduced-motion: reduce)` to include `.page-enter`

2. **components/src/layout/PageSkeleton/PageSkeleton.css**
   - Added `@keyframes fadeUp` definition (required in component workspace)
   - Applied fade-up animation to `.page-skeleton` main element (no delay)
   - Applied staggered animations to breadcrumb (50ms delay), page header (100ms delay), and content (150ms delay)
   - Added `@media (prefers-reduced-motion: reduce)` support

3. **components/src/layout/PageSkeleton/PageSkeleton.tsx**
   - No changes needed - already imports PageSkeleton.css

## Results
- All pages now fade in smoothly on mount with 350ms duration
- Child elements (breadcrumb, header, content) stagger entry with 50ms increments
- Animations respect user's prefers-reduced-motion accessibility preference
- No layout shift during transitions (uses transform, not width/height changes)
- Build verified: `pnpm --filter frontend build` passed successfully

## Status
COMPLETED

## Labels
design, animation, ux, polish
