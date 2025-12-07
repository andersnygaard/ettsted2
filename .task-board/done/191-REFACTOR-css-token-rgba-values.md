# 191 - Replace Hardcoded RGBA Values with CSS Tokens

**Type**: REFACTOR
**Priority**: Medium
**Effort**: Medium (2-3 hours)
**Labels**: css, design-system, components

---

## Context

The due diligence audit (2025-12-07) found 12+ hardcoded rgba() values in component CSS files instead of using CSS custom properties. This deviates from the token-first approach and makes theme changes harder.

## Problem

Components use inline rgba() values like:
- `rgba(184, 197, 208, 0.3)`
- `rgba(212, 149, 106, 0.2)`
- `rgba(245, 242, 237, 0.1)`
- `rgba(90, 125, 90, 0.08)`

These should use CSS variables for consistency and maintainability.

## Locations

- [SpreadsheetTable.css](../components/src/data/SpreadsheetTable/SpreadsheetTable.css) - 12+ instances
- [BreakdownCard.css](../components/src/cards/BreakdownCard/BreakdownCard.css)
- [MilestoneCard.css](../components/src/cards/MilestoneCard/MilestoneCard.css)
- [HeroNumber.css](../components/src/data/HeroNumber/HeroNumber.css)

## Acceptance Criteria

- [ ] Define opacity variant tokens in tokens.css
- [ ] Replace all hardcoded rgba() with CSS variables
- [ ] Visual appearance unchanged (verify in Storybook)
- [ ] No new hardcoded color values introduced

## Technical Approach

1. Audit all component CSS files for rgba() usage
2. Add opacity variant tokens to `frontend/src/styles/tokens.css`:
   ```css
   :root {
     --pale-blue-light: rgba(184, 197, 208, 0.3);
     --terracotta-light: rgba(212, 149, 106, 0.2);
     --bone-light: rgba(245, 242, 237, 0.1);
     --positive-light: rgba(90, 125, 90, 0.08);
     /* etc. */
   }
   ```
3. Also add to `components/.storybook/preview.css` for Storybook
4. Replace hardcoded values in component CSS
5. Verify in Storybook that visuals unchanged

## Related

- Due diligence report: [.docs/DUE-DILIGENCE-REPORT.md](../.docs/DUE-DILIGENCE-REPORT.md)
- Design tokens: [frontend/src/styles/tokens.css](../frontend/src/styles/tokens.css)
