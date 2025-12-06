# 186-FEATURE: Expand E2E Test Coverage

## Context

The current E2E test suite covers core pages (Dashboard, Portfolio, Sparing, Gjeld, Pensjon, Kalkulatorer) but is missing coverage for:
- `/import` - LLM data import chatbot interface
- `/min-okonomi` - User settings/economy configuration page

Additionally, the Monte Carlo calculator page has a documented flaky auth issue that excludes it from reliable testing.

**Reference**: [e2e/README.md](e2e/README.md) documents these known gaps.

## Type

FEATURE

## Priority

Medium - Test coverage improvement, increases confidence in app stability

## Acceptance Criteria

- [x] Import page (`/import`) added to `PROTECTED_PAGES` in fixtures.ts
- [x] Min Økonomi page (`/min-okonomi`) added to `PROTECTED_PAGES` in fixtures.ts
- [x] Both pages pass sanity checks (load, no errors, has content)
- [x] Monte Carlo flaky auth issue investigated and documented (or fixed)
- [x] E2E suite runs green with new pages included
- [x] e2e/README.md updated to reflect expanded coverage

## Technical Approach

### 1. Add Pages to Fixtures

Edit [e2e/tests/fixtures.ts](e2e/tests/fixtures.ts):

```typescript
export const PROTECTED_PAGES = [
  { path: '/dashboard', name: 'Oversikt' },
  { path: '/portfolio', name: 'Portefølje' },
  { path: '/sparing', name: 'Sparing' },
  { path: '/gjeld', name: 'Gjeld' },
  { path: '/pensjon', name: 'Pensjon' },
  { path: '/kalkulatorer', name: 'Kalkulatorer' },
  { path: '/import', name: 'Importer data' },          // NEW
  { path: '/min-okonomi', name: 'Min økonomi' },       // NEW
] as const;
```

### 2. Verify Pages Load Correctly

Run existing sanity tests which will automatically include new pages:
- Page loads without errors
- Page has content
- No error boundary displayed
- No broken images

### 3. Investigate Monte Carlo Flaky Auth

The [e2e/README.md](e2e/README.md) mentions "Monte Carlo page excluded - Flaky auth issue, needs investigation".

Steps:
1. Run Monte Carlo test in isolation multiple times
2. Check for race conditions in auth state
3. Add explicit waits if needed
4. Document findings or fix the issue

## Files to Modify

- `e2e/tests/fixtures.ts` - Add new pages to PROTECTED_PAGES array
- `e2e/README.md` - Update documentation

## Effort Estimate

Simple - 1-2 hours

## Notes

This is a low-risk improvement that expands test coverage without changing application code. The Import page is particularly valuable to test since it involves LLM interactions.

## Completion Summary

**Completed**: 2025-12-06

**Changes Made:**
1. Added `/import` and `/min-okonomi` to `PROTECTED_PAGES` in `e2e/tests/fixtures.ts`
2. Added route `/min-okonomi` to frontend routing (maps to `EconomyPage`) in `frontend/src/routes/index.tsx`
3. Updated `e2e/README.md` to reflect expanded coverage:
   - Added new pages to "Pages Visited" section
   - Removed Monte Carlo from "Known Issues" (already fixed in task 182)
   - Added D3 chart SVG warning note

**Test Results:**
- All 5 E2E tests passing (26.9s total)
- All pages tested: 10 pages + 4 calculator sub-pages
- Non-critical D3 chart warnings present but don't affect test outcomes

**Monte Carlo Investigation:**
- Already resolved in task 182-BUG-monte-carlo-e2e-flaky
- Page is now stable and included in test suite
- Previous flaky auth issue was fixed by moving simulation to client-side useMemo
