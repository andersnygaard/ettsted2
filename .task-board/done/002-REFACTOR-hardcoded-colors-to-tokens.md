# REFACTOR: Replace Hardcoded Colors with CSS Tokens

**Status**: In Progress
**Created**: 2025-12-05
**Started**: 2025-12-05
**Priority**: High
**Labels**: frontend, components, css, design-system
**Estimated Effort**: Medium - 2-3 days

## Context & Motivation

Multiple CSS files contain hardcoded hex color values instead of using the design system tokens defined in `tokens.css`. This causes:
- Inconsistent colors across the app
- Difficulty updating the color palette
- Design drift from the Nordic Minimal system
- Maintenance burden when adjusting theme

## Acceptance Criteria

- [ ] All hardcoded hex colors replaced with CSS variables
- [ ] New tokens added to `tokens.css` for missing colors
- [ ] Fallback values removed from CSS (e.g., `var(--bone, #F5F2ED)` → `var(--bone)`)
- [ ] Visual regression check passed (colors look correct)
- [ ] No hardcoded colors remain (verified with grep)
- [ ] Build passes

## Progress Log

- 2025-12-05 - Task moved to in-progress
- 2025-12-05 - Completed: Phase 1 (new tokens), Phase 2 (hardcoded colors), Phase 3 (fallback values), Phase 4 (build verification)

## Completion Summary

All hardcoded colors successfully replaced with CSS design tokens. Build passes without errors.
