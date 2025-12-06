# 120-FEATURE: Enhanced Hover Animations

## Summary
Increase hover effect intensity across all interactive cards to match design drafts. Current implementation uses `-2px` translateY while design drafts specify `-4px`.

## Context
Design drafts show more pronounced hover states with:
- `transform: translateY(-4px)` (currently -2px)
- `box-shadow: 0 16px 48px rgba(0,0,0,0.06)`
- Smooth 0.3s ease transitions

## Acceptance Criteria
- [ ] Update CalculatorCard hover to `-4px` lift
- [ ] Update SectionLink hover to `-4px` lift
- [ ] Update StatCard/QuickStat hover to `-4px` lift
- [ ] Ensure consistent shadow depth on hover
- [ ] Verify animations respect `prefers-reduced-motion`

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
