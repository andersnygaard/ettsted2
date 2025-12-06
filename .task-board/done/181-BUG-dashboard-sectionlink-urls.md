# 181-BUG: Dashboard SectionLinks Have Incorrect URLs

## Context

The Dashboard page ([DashboardPage.tsx](frontend/src/features/dashboard/DashboardPage.tsx)) has SectionLink components that link to incorrect or legacy URLs.

**Current state:**
- "Sparing & F.I.R.E." links to `/portfolio` instead of `/sparing`
- "Kalkulatorer" links to `/calculators` (legacy redirect) instead of `/kalkulatorer`

**Expected state:**
- "Sparing & F.I.R.E." should link to `/sparing`
- "Kalkulatorer" should link to `/kalkulatorer`

## Type

BUG

## Priority

High - Direct user impact, incorrect navigation

## Affected Files

- [frontend/src/features/dashboard/DashboardPage.tsx](frontend/src/features/dashboard/DashboardPage.tsx) (lines 148-163)

## Acceptance Criteria

- [x] SectionLink for "Sparing & F.I.R.E." navigates to `/sparing`
- [x] SectionLink for "Kalkulatorer" navigates to `/kalkulatorer`
- [x] E2E navigation test passes

## Resolution

Fixed on 2025-12-06. Changed href props on SectionLink components:
- Line 157: `/portfolio` → `/sparing`
- Line 162: `/calculators` → `/kalkulatorer`

All 5 E2E tests pass.

## Technical Approach

1. Open [DashboardPage.tsx](frontend/src/features/dashboard/DashboardPage.tsx)
2. Fix `href` prop on SectionLink components:
   - Line ~157: Change `/portfolio` to `/sparing`
   - Line ~162: Change `/calculators` to `/kalkulatorer`
3. Run E2E tests to verify navigation works

## Effort Estimate

Simple - 10 minutes
