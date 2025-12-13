# FEATURE: Migrate Data Display Components to Storybook

**Status**: In Progress
**Created**: 2025-12-01
**Priority**: Medium
**Labels**: components, storybook, migration, charts
**Estimated Effort**: Medium - 3-4 hours

## Context & Motivation

10 data display components for charts, tables, and financial metrics exist in frontend. These follow the Nordic Minimal design system and are used across dashboard, portfolio, sparing, gjeld, and pensjon pages.

## Desired Outcome

Data display components are in `/components/src/data/` and `/components/src/charts/` with comprehensive stories showing various data scenarios.

## Acceptance Criteria

**Data components (src/data/):**
- [x] Migrate HeroNumber.tsx + story (large value with change badge)
- [x] Migrate StatCard.tsx + story (clickable metric card)
- [x] Migrate MilestoneCard.tsx + story (progress toward target)
- [x] Migrate StatsRow.tsx + story (3-column stats grid)
- [x] Migrate SpreadsheetTable.tsx + story (collapsible groups, sticky columns)
- [x] Migrate TableHeader.tsx + story (with filter controls)
- [x] Migrate TableFooter.tsx + story (with pagination)

**Chart components (src/charts/):**
- [x] Migrate AreaChart.tsx + story (D3.js line/area chart)
- [x] Migrate StackedAreaChart.tsx + story (D3.js multi-series)
- [x] Migrate DonutChart.tsx + story (CSS donut)

- [x] Add D3.js dependency to components package.json
- [x] Export all from `components/src/index.ts`
- [x] All charts render with mock data in Storybook

## Technical Approach

**SpreadsheetTable stories (most complex):**
- Basic table with data
- With collapsible column groups
- With milestone highlighting (gold stars)
- With inline editing
- Loading state
- Empty state

**Chart stories:**
- With sample financial data
- Different time ranges (6mo, 1yr, 5yr)
- Positive/negative trends
- Responsive sizing demo

**D3.js setup:**
Add to `components/package.json`:
```json
"d3": "^7.8.5",
"@types/d3": "^7.4.3"
```

**Source files:**
- `frontend/src/shared/components/HeroNumber.tsx`
- `frontend/src/shared/components/StatCard.tsx`
- `frontend/src/shared/components/MilestoneCard.tsx`
- `frontend/src/shared/components/StatsRow.tsx`
- `frontend/src/shared/components/SpreadsheetTable.tsx`
- `frontend/src/shared/components/TableHeader.tsx`
- `frontend/src/shared/components/TableFooter.tsx`
- `frontend/src/shared/components/AreaChart.tsx`
- `frontend/src/shared/components/StackedAreaChart.tsx`
- `frontend/src/shared/components/DonutChart.tsx`

## Dependencies

- Task 101 (Storybook config) must be complete
- Task 103 (ProgressBar used by MilestoneCard)

---

**Next Steps**: Migrate layout components (105)
