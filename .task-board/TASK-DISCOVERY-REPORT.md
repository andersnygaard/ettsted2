# Task Discovery Report - 2025-12-03

## Summary

**Tasks Created**: 6 new tasks (108-113)
**Total Backlog**: 6 tasks
**Total Completed**: 93 tasks
**Focus**: Bug fixes, missing features, and test coverage

## Current Project State

### Completed Major Milestones
- ✅ Backend API (users, accounts, snapshots, calculators)
- ✅ Frontend pages (Dashboard, Portfolio, Sparing, Gjeld, Pensjon, Calculators)
- ✅ All 4 calculators (Compound, F.I.R.E., Loan, Monte Carlo)
- ✅ Component library migrated to @finans/components
- ✅ Storybook with 100+ stories
- ✅ Nordic Minimal design system
- ✅ Onboarding and economy wizard
- ✅ CI/CD workflows

### Identified Gaps

| # | Task | Type | Priority | Effort |
|---|------|------|----------|--------|
| 108 | Sparing Use API Data | BUG FIX | High | Simple |
| 109 | LLM Data Import | EPIC | High | Complex |
| 110 | Milestone Detection | FEATURE | Medium | Medium |
| 111 | E2E Test Coverage | FEATURE | Medium | Medium |
| 112 | Delete Snapshot UI | FEATURE | Low | Simple |
| 113 | Economy Wizard Values | FEATURE | Low | Simple |

## Gap Analysis

### Critical Bug (Task 108)
**Issue**: [useSparingData.ts:191](frontend/src/features/sparing/useSparingData.ts#L191) uses hardcoded values:
```typescript
const annualExpenses = 256000;  // HARDCODED
const annualIncome = 800000;    // HARDCODED
```
**Impact**: F.I.R.E. metrics display incorrect values for all users.
**Fix**: Use API response values instead of calculating locally.

### Major Missing Feature (Task 109)
**Feature**: LLM Data Import from CLAUDE.md
**Current State**: Not implemented. Backend route comment: `// router.use('/import', validateAuth, importRoutes);`
**Scope**: OpenAI integration, Langfuse observability, chat UI, batch insert

### UX Improvements (Tasks 110-113)
- **Milestone Detection**: Component supports it, not wired up
- **E2E Tests**: Only page load tests exist
- **Delete Snapshot**: Backend exists, no UI
- **Economy Wizard**: Shows 0 instead of actual values

## Breakdown by Priority

| Priority | Count | Total Effort |
|----------|-------|--------------|
| High | 2 | ~25 hours |
| Medium | 2 | ~8 hours |
| Low | 2 | ~4 hours |

## Breakdown by Type

| Type | Count |
|------|-------|
| BUG FIX | 1 |
| EPIC | 1 |
| FEATURE | 4 |

## Recommended Implementation Order

### Phase 1: Quick Wins (1-2 days)
1. **108 - Sparing Bug Fix** - Critical bug, 1-2 hours

### Phase 2: Core Feature (1-2 weeks)
2. **109 - LLM Data Import** - Major feature, break into sub-tasks:
   - 109a: OpenAI Service (4-6 hrs)
   - 109b: Langfuse Integration (2-3 hrs)
   - 109c: Import Routes (4-6 hrs)
   - 109d: Import Page UI (6-8 hrs)

### Phase 3: Polish (3-5 days)
3. **110 - Milestone Detection** - Visual enhancement
4. **111 - E2E Test Coverage** - Quality improvement

### Phase 4: Nice-to-Haves
5. **112 - Delete Snapshot UI**
6. **113 - Economy Wizard Values**

## What's NOT Needed

The following areas are complete and don't require tasks:
- All 6 main pages implemented
- All 4 calculators functional
- Authentication flow working
- Data hooks for all pages
- Component library complete
- Design system applied
- CI/CD pipelines configured

## Code Quality Notes

Only 1 TODO found in codebase:
- `frontend/src/features/sparing/useSparingData.ts:191` - Addressed by task 108

No FIXMEs or HACKs found.

## Next Steps

1. Start with **108** (bug fix) - immediate user impact
2. Plan **109** (LLM import) - break into smaller tasks
3. Review backlog after 109 completion
4. Add 110-113 based on capacity

---

*Previous discovery: 2025-11-29 - 50 tasks for Nordic Minimal design (all completed)*
