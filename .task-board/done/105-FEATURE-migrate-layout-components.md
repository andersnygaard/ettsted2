# FEATURE: Migrate Layout Components to Storybook

**Status**: In Progress
**Created**: 2025-12-01
**Priority**: Medium
**Labels**: components, storybook, migration, layout
**Estimated Effort**: Simple - 1-2 hours

## Context & Motivation

4 layout components define page structure and navigation patterns. These are used across all pages and follow consistent spacing/styling from Nordic Minimal design.

## Desired Outcome

Layout components are in `/components/src/layout/` with stories showing various configurations.

## Acceptance Criteria

- [x] Migrate PageHeader.tsx + PageHeader.css + story
- [x] Migrate SectionLink.tsx + SectionLink.css + story
- [x] Migrate CalculatorCard.tsx + CalculatorCard.css + story
- [x] Migrate Container.tsx (if not already in ui/)
- [x] Stories demonstrate:
  - PageHeader: centered vs left-aligned, with/without actions
  - SectionLink: with arrow navigation
  - CalculatorCard: with icon and description
- [x] Export all from `components/src/index.ts`

## Technical Approach

**PageHeader stories:**
- Centered layout (dashboard style)
- Left-aligned layout (detail page style)
- With action buttons
- With breadcrumb

**SectionLink stories:**
- Default with title/subtitle/arrow
- Hover state demo
- Grid layout (3-column)

**CalculatorCard stories:**
- With emoji icon
- With description
- Grid layout (2x2)

**Source files:**
- `frontend/src/shared/components/PageHeader.tsx`
- `frontend/src/shared/components/SectionLink.tsx`
- `frontend/src/shared/components/CalculatorCard.tsx`

## Dependencies

- Task 101 (Storybook config) must be complete

---

**Next Steps**: Migrate system components (106)
