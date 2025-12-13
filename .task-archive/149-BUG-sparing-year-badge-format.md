# 150-BUG: Sparing Page Year Badge Shows "+-" Prefix

## Summary
The Sparing page's year change badge shows an incorrect format: "+-66 817,80 kr" with a weird "+-" prefix instead of proper positive/negative indicator.

## Context
Screenshot shows badge: "-15.65% i 2025 · +-66 817,80 kr"

The "+-" should be either "+" or "-", not both. This is likely a string formatting bug where negative handling isn't working correctly.

## Acceptance Criteria
- [ ] Badge shows "+" for positive values
- [ ] Badge shows "-" for negative values
- [ ] Never shows "+-" together

## Technical Approach
1. Find badge rendering logic in SparingPage
2. Fix conditional +/- prefix logic
3. Test with both positive and negative values

## Files to Modify
- [SparingPage.tsx](frontend/src/features/sparing/SparingPage.tsx)
- Or HeroNumber component if formatting is there

## Priority
Medium

## Effort
Simple (30 min)

## Labels
bug, formatting, display
