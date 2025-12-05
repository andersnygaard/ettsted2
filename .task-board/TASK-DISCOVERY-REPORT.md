# Task Discovery Report - 2025-12-05

## Summary

**Focus**: Design System Consistency & Storybook
**Tasks Created**: 7 new design-related tasks (001-007)
**Total Backlog**: 7 tasks

## Issues Discovered

### 1. Duplicate Components (Critical)
21 components exist in BOTH `frontend/src/shared/components/` AND `components/src/`:
- Button, Card, Avatar, Container, Skeleton
- HeroNumber, ProgressBar, MilestoneCard, SectionLink
- TableHeader, TableFooter, DateInput, CalculatorCard
- StatsRow, AreaChart, DonutChart, NumberInput
- StackedAreaChart, SpreadsheetTable, ErrorBoundary, Toast

### 2. Hardcoded CSS Values
- **Colors**: 50+ instances of hardcoded hex colors instead of tokens
- **Fonts**: 21 instances of hardcoded font-family instead of `var(--font-*)`
- **Animations**: `@keyframes fadeUp` duplicated in 5 files
- **Spacing**: Many hardcoded pixel values instead of spacing tokens

### 3. Design Documentation
- Current design guide outdated
- No design principles documented
- User requested `.docs/design-system/` folder

### 4. Storybook Coverage
- All components have stories but quality varies
- Missing interaction tests
- Some stories may lack all variants/states

## Tasks Created

| # | Type | Title | Priority | Effort |
|---|------|-------|----------|--------|
| 001 | REFACTOR | Consolidate Duplicate Components | High | 3-4 days |
| 002 | REFACTOR | Replace Hardcoded Colors with CSS Tokens | High | 2-3 days |
| 003 | REFACTOR | Replace Hardcoded Font-Family with Tokens | Medium | 1 day |
| 004 | REFACTOR | Centralize Animation Keyframes | Low | 0.5 day |
| 005 | REFACTOR | Standardize Spacing Token Usage | Medium | 2 days |
| 006 | FEATURE | Create Design System Documentation | High | 2 days |
| 007 | REFACTOR | Improve Storybook Coverage and Quality | Medium | 3 days |

**Total Estimated Effort**: ~14 days

## Breakdown by Priority

| Priority | Count | Total Effort |
|----------|-------|--------------|
| High | 3 | ~8 days |
| Medium | 3 | ~6 days |
| Low | 1 | ~0.5 day |

## Breakdown by Type

| Type | Count |
|------|-------|
| REFACTOR | 6 |
| FEATURE | 1 |

## Recommended Implementation Order

### Phase 1: Document & Plan (2 days)
1. **006-FEATURE-design-system-documentation.md** - Establish principles before refactoring

### Phase 2: Component Cleanup (4 days)
2. **001-REFACTOR-consolidate-duplicate-components.md** - Eliminate duplication

### Phase 3: CSS Token Cleanup (4-5 days)
3. **002-REFACTOR-hardcoded-colors-to-tokens.md** - Consistent colors
4. **003-REFACTOR-hardcoded-fonts-to-tokens.md** - Font consistency
5. **005-REFACTOR-spacing-tokens-usage.md** - Spacing consistency

### Phase 4: Documentation & Polish (3-4 days)
6. **007-REFACTOR-improve-storybook-coverage.md** - Better component docs
7. **004-REFACTOR-centralize-animations.md** - Quick cleanup

## Quality Bar Applied

These tasks meet the quality bar because:
- **Clear value**: Reduces maintenance burden, improves consistency
- **Well-scoped**: Each task is 0.5-4 days, not weeks
- **Actionable**: Specific files and patterns identified
- **Domain-aligned**: Improves the Nordic Minimal design system

## Next Steps

1. Review generated tasks in `.task-board/backlog/`
2. Add top 3 priorities to `PLANNING-BOARD.md`
3. Start with `006-FEATURE-design-system-documentation.md`
4. Use `start-working` skill to begin implementation

---

*Previous discovery: 2025-12-03 - Tasks 108-113 for bugs and features*
