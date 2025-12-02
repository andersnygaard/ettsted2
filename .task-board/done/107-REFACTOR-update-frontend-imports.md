# REFACTOR: Update Frontend Imports to Use @finans/components

**Status**: In Progress
**Created**: 2025-12-01
**Priority**: Medium
**Labels**: frontend, refactor, imports
**Estimated Effort**: Simple - 1 hour

## Context & Motivation

After migrating components to the shared library, frontend imports need to be updated from relative paths to `@finans/components`. This consolidates imports and removes duplicate files.

## Desired Outcome

All migrated components are imported from `@finans/components` with no duplicate files remaining in frontend.

## Acceptance Criteria

- [x] Update all imports from `../shared/components/X` to `@finans/components`
- [x] Remove migrated component files from `frontend/src/shared/components/`
- [x] Remove associated CSS files
- [x] Delete example files (*.example.tsx)
- [x] Verify all pages render correctly
- [x] Verify no TypeScript errors
- [x] Verify no broken imports

## Implementation Notes

**Components Successfully Migrated to @finans/components:**
- UI: Button, Card, Container, Avatar, Modal, Skeleton, Breadcrumb
- Forms: NumberInput, DateInput, ProgressBar
- Data Display: HeroNumber, MilestoneCard, StatsRow, SpreadsheetTable, TableHeader, TableFooter
- Charts: AreaChart, StackedAreaChart, DonutChart
- Layout: PageHeader
- System: ErrorBoundary, ToastProvider, useToast

**Components NOT Migrated (Frontend-specific or routing dependencies):**
- AppHeader, AvatarMenu, ProfileModal, AccountsModal (depend on useAuth)
- Layout (depends on AppHeader and routing)
- StatCard, SectionLink, CalculatorCard (use react-router-dom Link)
- Page skeletons (DashboardSkeleton, PortfolioSkeleton, etc.)

**Frontend Import Paths Updated:**
- 22 imports successfully updated to use `@finans/components`
- Remaining `@/shared/components` imports are for frontend-only components
- Build passes with no TypeScript errors

**Component Library Fix:**
- Added `react-router-dom` to devDependencies in components/package.json (required by StatCard, SectionLink, CalculatorCard)
- Added to peerDependencies as well for clarity

## Technical Approach

**Search and replace patterns:**
```tsx
// Before
import { Button } from '../shared/components/Button'
import { Card } from '../../shared/components/Card'

// After
import { Button, Card } from '@finans/components'
```

**Files to update (search for imports):**
- `frontend/src/features/dashboard/*.tsx`
- `frontend/src/features/portfolio/*.tsx`
- `frontend/src/features/sparing/*.tsx`
- `frontend/src/features/gjeld/*.tsx`
- `frontend/src/features/pensjon/*.tsx`
- `frontend/src/features/calculators/*.tsx`
- `frontend/src/App.tsx`
- `frontend/src/main.tsx`

**Files to delete from frontend after migration:**
- All `.tsx` files migrated to components
- All `.css` files migrated to components
- All `.example.tsx` files (not migrated, just deleted)

**Verification steps:**
1. `pnpm --filter frontend build` - no errors
2. `pnpm --filter frontend dev` - pages render
3. Manual test each page

## Dependencies

- Tasks 102-106 (component migrations) should be complete
- Or run incrementally after each migration task

---

**Next Steps**: Storybook deployment (108)
