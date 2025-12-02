# Planning Board - Finans

**Current Focus**: Storybook Component Library Migration

---

## Dependency Graph

```
101 Storybook Config ✅
 ├── 102 Core UI Components ✅
 ├── 103 Form Components ✅
 ├── 104 Data Display Components ✅
 ├── 105 Layout Components ✅
 └── 106 System Components ✅
      └── 107 Update Frontend Imports ✅

100 Design Polish ✅
```

---

## Top Priorities

*No tasks in progress - Storybook migration complete! Awaiting new priorities.*

---

## Backlog Tasks (Detailed)

### 101 - Storybook Config ✅ DONE
**Priority**: High | **Effort**: 1 hr | **File**: `done/101-FEATURE-storybook-config.md`
**Completed**: 2025-12-01

Setup Storybook infrastructure in `/components` workspace.

**Deliverables**:
- `.storybook/main.ts` - Vite builder, addons
- `.storybook/preview.ts` - Global decorators
- `.storybook/preview.css` - BeerCSS + Nordic Minimal variables
- `tsconfig.json` - TypeScript support
- `src/index.ts` - Barrel exports
- Directory structure: `ui/`, `forms/`, `data/`, `layout/`, `charts/`
- Introduction.mdx welcome page

**Verify**: `pnpm --filter components storybook` starts without errors

**Dependencies**: None (packages already installed)

---

### 102 - Migrate Core UI Components
**Priority**: High | **Effort**: 2-3 hrs | **File**: `backlog/102-FEATURE-migrate-core-ui-components.md`

Move 7 generic UI components to `/components/src/ui/`.

**Components**:
| Component | Variants/Notes |
|-----------|----------------|
| Button | Primary/secondary variants |
| Card | Base card styling |
| Container | 3 width variants |
| Avatar | 3 size variants |
| Modal | Focus trap, keyboard handling |
| Skeleton | Shimmer animation |
| Breadcrumb | Navigation path |

**For each**: Copy .tsx/.css → create .stories.tsx → export from index.ts

**Dependencies**: 101

---

### 103 - Migrate Form Components
**Priority**: High | **Effort**: 2 hrs | **File**: `backlog/103-FEATURE-migrate-form-components.md`

Move 3 form components to `/components/src/forms/` with Norwegian formatting.

**Components**:
| Component | Stories |
|-----------|---------|
| NumberInput | Empty, with value (123 456,78 kr), suffix, disabled, error |
| DateInput | Date picker, month picker, disabled |
| ProgressBar | Default, gold, blue, with label, 0%/50%/100% |

**Include utilities**: `formatNumber()`, `formatDate()` with nb-NO locale

**Dependencies**: 101

---

### 104 - Migrate Data Display Components
**Priority**: Medium | **Effort**: 3-4 hrs | **File**: `backlog/104-FEATURE-migrate-data-display-components.md`

Move 10 components to `/components/src/data/` and `/components/src/charts/`.

**Data components** (src/data/):
- HeroNumber - Large value with change badge
- StatCard - Clickable metric card
- MilestoneCard - Progress toward target
- StatsRow - 3-column stats grid
- SpreadsheetTable - Collapsible groups, sticky columns, milestone highlights
- TableHeader - With filter controls
- TableFooter - With pagination

**Chart components** (src/charts/):
- AreaChart - D3.js line/area
- StackedAreaChart - D3.js multi-series
- DonutChart - CSS donut

**Note**: Add D3.js deps to components/package.json

**Dependencies**: 101, 103 (ProgressBar used by MilestoneCard)

---

### 105 - Migrate Layout Components
**Priority**: Medium | **Effort**: 1-2 hrs | **File**: `backlog/105-FEATURE-migrate-layout-components.md`

Move 3 layout components to `/components/src/layout/`.

**Components**:
| Component | Stories |
|-----------|---------|
| PageHeader | Centered, left-aligned, with actions, with breadcrumb |
| SectionLink | Default with arrow, hover state, 3-column grid |
| CalculatorCard | With emoji icon, with description, 2x2 grid |

**Dependencies**: 101

---

### 106 - Migrate System Components
**Priority**: Low | **Effort**: 2 hrs | **File**: `backlog/106-FEATURE-migrate-system-components.md`

Move Toast and ErrorBoundary to `/components/src/system/`.

**Components**:
| Component | Stories |
|-----------|---------|
| Toast + ToastContext | Success, error, warning, info, stacked, manual dismiss |
| ErrorBoundary | Default fallback, custom fallback, trigger error demo |

**Deferred** (auth dependency):
- AvatarMenu - depends on useAuth
- AppHeader - depends on useAuth + routes

**Dependencies**: 101

---

### 107 - Update Frontend Imports
**Priority**: Medium | **Effort**: 1 hr | **File**: `backlog/107-REFACTOR-update-frontend-imports.md`

Update all frontend imports to use `@finans/components`.

**Pattern**:
```tsx
// Before
import { Button } from '../shared/components/Button'

// After
import { Button, Card } from '@finans/components'
```

**Steps**:
1. Search/replace imports in all feature folders
2. Delete migrated files from `frontend/src/shared/components/`
3. Delete .example.tsx files
4. Verify: `pnpm --filter frontend build` passes

**Dependencies**: 102-106 (or run incrementally)

---

---

## Recently Completed

### 107 - Update Frontend Imports (2025-12-01)
22 imports updated to @finans/components. Build passes with no TypeScript errors.

### 106 - Migrate System Components (2025-12-01)
Toast and ErrorBoundary migrated. 10 stories created.

### 105 - Migrate Layout Components (2025-12-01)
4 components migrated (PageHeader, SectionLink, CalculatorCard, Container). 24 stories created.

### 104 - Migrate Data Display Components (2025-12-01)
10 components migrated (HeroNumber, StatCard, MilestoneCard, StatsRow, SpreadsheetTable, TableHeader, TableFooter, AreaChart, StackedAreaChart, DonutChart). 61 stories created.

### 100 - Design Polish (2025-12-01)
Unified hover states (-2px lift), design tokens applied across 11 files, typography/spacing verified.

### 103 - Migrate Form Components (2025-12-01)
NumberInput, DateInput, ProgressBar migrated to `/components/src/forms/` with Norwegian formatting utilities. 26 Storybook stories created.

### 099 - Monte Carlo Frontend (2025-12-01)
Form inputs, API integration, D3.js chart, loading/error states.

### 098 - Gjeld Data Integration (2025-12-01)
Wired GjeldPage to real API data. Merged loan details from user accounts.

### 097 - Sparerate Calculation (2025-12-01)
Fixed broken sparerate metric on dashboard.

---

## Statistics

| Status | Count |
|--------|-------|
| Done | 93 |
| Backlog | 0 |
| In Progress | 0 |

**Total Effort Estimate**: ~15-18 hours

**Next Milestone**: Complete Storybook setup and component library migration

**Last Updated**: 2025-12-01
