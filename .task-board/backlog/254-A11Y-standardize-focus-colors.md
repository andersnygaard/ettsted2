# 254 - Standardize Focus Indicator Colors

## Type
Accessibility

## Priority
Medium

## Description
Focus indicators use inconsistent colors across components:
- AppHeader: `--pale-blue`
- Button: `--charcoal`
- StatCard: `--muted-sage`

Standardize to `--charcoal` for consistent accessibility experience.

## Source
Due Diligence Report - Improvement #4

## Implementation

1. Add `--focus-color: var(--charcoal)` to `tokens.css`
2. Update all components to use `--focus-color`

### Files to audit:
- `components/src/styles/tokens.css` - Add token
- `components/src/components/AppHeader/AppHeader.css`
- `components/src/components/Button/Button.css`
- `components/src/components/StatCard/StatCard.css`
- Any other components with focus styles

## Acceptance Criteria
- [ ] `--focus-color` token defined
- [ ] All focus indicators use same color
- [ ] WCAG 2.4.7 compliance maintained
- [ ] Visual consistency across components

## Effort
Low (30 min)
