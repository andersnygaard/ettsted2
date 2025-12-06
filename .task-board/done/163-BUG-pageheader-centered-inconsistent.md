# 163-BUG: PageHeader Centered Prop Used Inconsistently

## Summary
The PageHeader component's `centered` prop usage is now consistent across pages following design drafts.

## Context
Design analysis revealed clear pattern:
- **Centered**: Dashboard (Oversikt), Calculators (Kalkulatorer) - landing pages with hero content
- **Left-aligned**: Sparing, Gjeld, Pensjon - data pages with structured content

## Acceptance Criteria
- [x] Document design decision: which pages should be centered
- [x] Apply consistent pattern across all pages
- [x] Implement centered as optional prop with sensible default

## Technical Approach
1. Review design drafts for header alignment - DONE
2. Apply consistent pattern - DONE
3. Implement centered prop with sensible defaults - DONE

## Implementation Details

### Design Draft Analysis
- **draft-1-nordic-minimal.html** (Dashboard): `text-align: center;` (line 96)
- **draft-1-kalkulatorer.html** (Calculators): `text-align: center;` (line 96)
- **draft-1-sparing.html** (Savings): NO text-align (default left)
- **draft-1-gjeld.html** (Debt): NO text-align (default left)

### Changes Made

**1. PageHeader Component** (`components/src/layout/PageHeader/PageHeader.tsx`)
- Added `centered?: boolean` prop (defaults to `false`)
- Applied `page-header--centered` class when centered

**2. PageHeader Styles** (`components/src/layout/PageHeader/PageHeader.css`)
- Changed default from `text-align: center;` to `text-align: left;`
- Added modifier `.page-header--centered` with `text-align: center;`

**3. DashboardPage** (`frontend/src/features/dashboard/DashboardPage.tsx`)
- All 3 PageHeader instances now use `centered` prop

**4. CalculatorsPage** (`frontend/src/features/calculators/CalculatorsPage.tsx`)
- PageHeader now uses `centered` prop

**5. SparingPage & GjeldPage**
- No changes needed - default left-alignment is correct

## Files Modified
- `components/src/layout/PageHeader/PageHeader.tsx`
- `components/src/layout/PageHeader/PageHeader.css`
- `frontend/src/features/dashboard/DashboardPage.tsx`
- `frontend/src/features/calculators/CalculatorsPage.tsx`

## Build Status
✓ Frontend build passes successfully

## Priority
Low

## Effort
Completed (1 hour)

## Labels
bug, design, consistency
