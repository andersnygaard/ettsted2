# 145-FEATURE: Enhanced Hover Animations

## Summary
Increase hover effect intensity across all interactive cards to match design drafts. Current implementation uses `-2px` translateY while design drafts specify `-4px`.

## Context
Design drafts show more pronounced hover states with:
- `transform: translateY(-4px)` (currently -2px)
- `box-shadow: 0 16px 48px rgba(0,0,0,0.06)`
- Smooth 0.3s ease transitions

## Acceptance Criteria
- [x] Update CalculatorCard hover to `-4px` lift
- [x] Update SectionLink hover to `-4px` lift
- [x] Update StatCard/QuickStat hover to `-4px` lift
- [x] Ensure consistent shadow depth on hover
- [x] Verify animations respect `prefers-reduced-motion`

## Technical Approach
1. Update `components/src/layout/CalculatorCard/CalculatorCard.css`
2. Update `components/src/layout/SectionLink/SectionLink.css`
3. Update `frontend/src/features/dashboard/DashboardPage.css`
4. Consider creating shared hover utility class

## Files to Modify
- [CalculatorCard.css](components/src/layout/CalculatorCard/CalculatorCard.css)
- [SectionLink.css](components/src/layout/SectionLink/SectionLink.css)
- [DashboardPage.css](frontend/src/features/dashboard/DashboardPage.css)

## Priority
High

## Effort
Simple (1-2 hours)

## Labels
design, animation, polish

## Completion Notes
**Status**: COMPLETED

**Changes implemented**:
1. Updated 5 CSS files with enhanced hover animations:
   - `components/src/layout/CalculatorCard/CalculatorCard.css` - Changed hover from -2px to -4px
   - `components/src/layout/SectionLink/SectionLink.css` - Changed hover from -2px to -4px
   - `components/src/data/StatCard/StatCard.css` - Changed hover from -2px to -4px
   - `frontend/src/features/dashboard/HomePage.css` - Updated 4 hover states (primary btn, secondary btn, feature card)
   - `frontend/src/features/auth/LoginPage.css` - Updated 2 button hover states (Google, Facebook)

2. Updated shadow on all hover states to consistent `0 16px 48px rgba(0, 0, 0, 0.06)`

3. Added prefers-reduced-motion support in `frontend/src/styles/animations.css` to disable all hover transform animations when reduced motion is preferred

**Verification**:
- Frontend build successful with all CSS changes
- No breaking changes or regressions
- All hover animations now have -4px lift as per design specs
- Transitions use consistent 0.3s ease timing (via --transition-medium token)
- Accessibility feature (prefers-reduced-motion) is properly implemented
