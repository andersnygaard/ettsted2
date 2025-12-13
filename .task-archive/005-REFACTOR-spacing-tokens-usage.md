# REFACTOR: Standardize Spacing Token Usage

**Status**: Completed
**Created**: 2025-12-05
**Started**: 2025-12-05
**Completed**: 2025-12-05
**Priority**: Medium
**Labels**: frontend, css, design-system, spacing
**Estimated Effort**: Medium - 2 days

## Acceptance Criteria

- [x] Common spacing values (8, 12, 16, 20, 24, 32, 40, 48, 64, 80px) use tokens
- [x] Gap, padding, and margin properties use tokens where appropriate
- [x] Visual spacing looks unchanged (same values, just tokenized)
- [x] Build passes (pre-existing TypeScript error unrelated to this task)

## Token Mapping

| Value | Token |
|-------|-------|
| 8px | `var(--space-xs)` |
| 12px | `var(--space-sm)` |
| 16px | `var(--space-md)` |
| 20px | `var(--space-lg)` |
| 24px | `var(--space-xl)` |
| 32px | `var(--space-2xl)` |
| 40px | `var(--space-3xl)` |
| 48px | `var(--space-4xl)` |
| 64px | `var(--space-5xl)` |
| 80px | `var(--space-6xl)` |

## Values to Leave Hardcoded

- 1px, 2px - Border widths
- 4px - Border radius
- 10px, 14px - Non-standard values
- 1em, 1.5em - Relative units

## Implementation Summary

**Files Modified**: 16 CSS files across frontend and components workspaces

**Total Replacements**: 100+ hardcoded spacing values replaced with CSS tokens

**Files Updated**:
1. `frontend/src/features/dashboard/QuickStatsGrid.css` - 2 replacements
2. `frontend/src/features/dashboard/DashboardPage.css` - 18 replacements
3. `frontend/src/features/portfolio/PortfolioPage.css` - 5 replacements
4. `components/src/data/SpreadsheetTable/SpreadsheetTable.css` - 13 replacements
5. `frontend/src/shared/components/AvatarMenu.css` - 3 replacements
6. `frontend/src/features/portfolio/NewMonthModal.css` - 13 replacements
7. `frontend/src/features/auth/onboarding/steps/StepUser.css` - 7 replacements
8. `frontend/src/features/auth/onboarding/steps/AccountsList.css` - 18 replacements
9. `frontend/src/features/auth/onboarding/WizardProgressBar.css` - 2 replacements
10. `frontend/src/features/auth/DeleteAccountModal.css` - 10 replacements
11. `frontend/src/features/auth/LoginModal.css` - 4 replacements
12. `components/src/ui/Button/Button.css` - 2 replacements
13. `components/src/forms/ProgressBar/ProgressBar.css` - 1 replacement
14. `components/src/data/MilestoneCard/MilestoneCard.css` - 2 replacements
15. `frontend/src/features/auth/TermsDialog.css` - 7 replacements
16. `frontend/src/features/dashboard/HomePage.css` - 3 replacements

## Progress Log

- 2025-12-05 - Task moved to in-progress
- 2025-12-05 - Systematically replaced 100+ hardcoded spacing values with CSS tokens
- 2025-12-05 - Task completed. All spacing values standardized.
