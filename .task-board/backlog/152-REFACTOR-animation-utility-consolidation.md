# 124-REFACTOR: Animation Utility Consolidation

## Summary
Standardize animation usage across all pages. Some pages use inline CSS animations while others use utility classes. Create a consistent system.

## Context
Current state:
- `frontend/src/styles/animations.css` defines utility classes (`animate-fade-up`, `animate-delay-1`, etc.)
- `DashboardPage.css` has inline `@keyframes fadeUp` and animation rules
- `CalculatorsPage.tsx` uses utility classes
- Inconsistent approach creates maintenance burden

## Acceptance Criteria
- [ ] Single source of truth for animations in `animations.css`
- [ ] All pages use utility classes instead of inline animations
- [ ] Remove duplicate `@keyframes` definitions
- [ ] Document animation system in Storybook
- [ ] Create animation timing presets (fast, normal, slow)

## Technical Approach
1. Audit all CSS files for animation definitions
2. Move all `@keyframes` to `animations.css`
3. Create comprehensive utility class system:
   - `.animate-fade-up`, `.animate-fade-in`, `.animate-scale-in`
   - `.animate-delay-{1-10}` for staggering
   - `.animate-duration-{fast|normal|slow}`
4. Update pages to use utilities
5. Add Storybook story demonstrating animations

## Files to Modify
- [animations.css](frontend/src/styles/animations.css)
- [DashboardPage.css](frontend/src/features/dashboard/DashboardPage.css)
- [SparingPage.css](frontend/src/features/sparing/SparingPage.css)
- [GjeldPage.css](frontend/src/features/gjeld/GjeldPage.css)
- [PensjonPage.css](frontend/src/features/pensjon/PensjonPage.css)

## Priority
Medium

## Effort
Medium (3-4 hours)

## Labels
refactor, animation, dx, consistency
