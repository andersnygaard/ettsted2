# 335 - TEST: E2E Tests for User Profile Settings (Wizard Step 1)

**Status**: Done
**Created**: 2025-12-30
**Completed**: 2026-01-25
**Priority**: High
**Labels**: test, e2e, coverage

## Context & Motivation

The OnboardingWizard Step 1 (StepUser) is NOT covered by E2E tests. This step contains profile fields that drive ALL financial calculations:
- `monthlySalary` - Used in savings rate calculation
- `monthlySavings` - Used in savings rate, F.I.R.E. calculations
- `birthYear` - Used in pension projections
- `plannedRetirementAge` - Used in pension projections
- `nickname` - Display name

Current `account-management.spec.ts` only tests Steps 2-4 (Sparing/Gjeld/Pensjon accounts). Step 1 is skipped entirely.

## Acceptance Criteria

- [x] Test: Can edit nickname field
- [x] Test: Can edit monthly salary field (Norwegian number format)
- [x] Test: Can edit monthly savings field
- [x] Test: Validation errors shown for invalid values (negative, zero)
- [x] Test: Profile changes persist after wizard save
- [x] Test: Savings rate updates based on salary/savings changes

## Resolution

All tests were already implemented in `account-management.spec.ts` (lines 466-718).

**Tests implemented**:
- `can navigate to Step 1 of wizard` - Verifies Step 1 navigation works
- `can edit nickname field` - Tests nickname input editing
- `can edit monthly salary field (Norwegian number format)` - Tests salary input with Norwegian formatting
- `can edit monthly savings field` - Tests savings input
- `can edit birth year field` - Tests birth year input
- `can edit planned retirement age field` - Tests retirement age input
- `shows validation error for empty nickname` - Validation for empty nickname
- `shows validation error for zero monthly salary` - Validation for zero salary
- `profile changes persist after wizard save` - Persistence test
- `savings rate on dashboard updates based on profile changes` - Integration test
- `F.I.R.E. number defaults to 25x annual expenses` - F.I.R.E. calculation test
- `can edit custom F.I.R.E. number` - Custom F.I.R.E. number editing

**Helper functions added to fixtures.ts**:
- `getProfileFieldValue(page, fieldName)` - Get profile field value
- `setProfileFieldValue(page, fieldName, value)` - Set profile field value

**Files changed**:
- `e2e/tests/account-management.spec.ts` - Added 12 tests in "User Profile Settings (Step 1)" describe block
- `e2e/tests/fixtures.ts` - Added profile helper functions

---

**Dependencies**: None
