# REFACTOR: Fix PageSkeleton/PageHeader Prop Mismatch

**Status**: Completed
**Created**: 2025-12-07
**Priority**: High
**Labels**: frontend, components, typescript
**Estimated Effort**: Simple - 30 minutes

## Context & Motivation

The due diligence audit identified a TypeScript prop mismatch: PageSkeleton passes a `centered` prop to PageHeader, but PageHeader's interface doesn't define this property.

This causes TypeScript errors and may break builds in strict mode.

## Current State

FIXED: All `centered` props have been removed from PageSkeleton usages.

## Desired Outcome

Either:
- A) Add `centered?: boolean` to PageHeader interface
- B) Remove `centered` from PageSkeleton's PageHeader usage

Based on CLAUDE.md: "PageHeader: Always centered (text-align: center). Never left-aligned."

Since PageHeader is always centered by design, option B (remove the prop) is preferred.

## Acceptance Criteria

- [x] TypeScript compilation succeeds without errors
- [x] PageHeader still renders correctly (centered)
- [x] All pages using PageSkeleton work correctly
- [x] Lint and type check pass

## Affected Components

### Components
- **File**: `components/src/layout/PageSkeleton/PageSkeleton.tsx`
- **File**: `components/src/layout/PageHeader/PageHeader.tsx` (interface only if option A)

### Testing
- **Visual**: Verify page headers still centered
- **Build**: `pnpm build` succeeds

## Technical Approach

### Option B (Preferred): Remove unused prop

1. Open `PageSkeleton.tsx`
2. Remove `centered` prop from PageHeader usage
3. Verify CSS already centers PageHeader by default

### Option A (Alternative): Add prop to interface

1. Add `centered?: boolean` to PageHeaderProps
2. Apply className conditionally

### Implementation Steps

1. **Check PageHeader CSS**
   - Verify `.page-header` has `text-align: center` by default

2. **Remove centered prop from PageSkeleton**
   - Find and remove the `centered` prop usage

3. **Run checks**
   - `pnpm --filter @finans/components build`
   - `pnpm --filter frontend build`

## Code References

### PageSkeleton (Fix This)

```typescript
// components/src/layout/PageSkeleton/PageSkeleton.tsx:45
// Remove 'centered' prop from this line
<PageHeader {...} centered />
```

## Progress Log

### Implementation Summary

1. **Verified PageHeader.css** - Confirmed `text-align: center` is already set on `.page-header` (line 4)
2. **Removed `centered` prop from PageSkeleton interface** - Deleted from `PageSkeletonProps` type definition
3. **Removed `centered` parameter from function signature** - Cleaned up destructuring in component
4. **Removed `centered` prop from PageHeader component usage** - Now passes only `title` and `subtitle`
5. **Fixed all downstream usages** in frontend pages:
   - `CalculatorsPage.tsx` (1 occurrence removed)
   - `DashboardPage.tsx` (3 occurrences removed)
6. **Fixed type coercion issue** - Changed `||` to `??` in DashboardPage data fallback for proper nullish coalescing

### Build & Verification
- `pnpm --filter frontend build` - **PASSED** (0 TypeScript errors)
- `pnpm lint` - **PASSED** (0 new lint errors, pre-existing warnings only)

### Files Modified
1. `components/src/layout/PageSkeleton/PageSkeleton.tsx` - Removed `centered` prop
2. `frontend/src/features/calculators/CalculatorsPage.tsx` - Removed `centered` usage
3. `frontend/src/features/dashboard/DashboardPage.tsx` - Removed 3x `centered` usages

## Related Plans

- Due Diligence Report: `.docs/DUE-DILIGENCE-REPORT.md`

---
**Completion Date**: 2025-12-07
