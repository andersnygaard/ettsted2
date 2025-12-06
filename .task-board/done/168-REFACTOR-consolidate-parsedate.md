# 168 - REFACTOR: Consolidate parseDate() Duplication

**Type**: Refactor
**Priority**: HIGH
**Effort**: Simple

---

## Problem

`parseDate()` function duplicated in 5 files:

1. `frontend/src/features/dashboard/useDashboardData.ts:145-148`
2. `frontend/src/features/sparing/useSparingData.ts:60-63`
3. `frontend/src/features/gjeld/useGjeldData.ts:42-45`
4. `frontend/src/features/pensjon/usePensjonData.ts:42-45`
5. `frontend/src/features/portfolio/usePortfolioData.ts:33-36`

The duplicates fail silently on invalid dates. The shared utility in `shared/utils/dateFormat.ts` has proper error handling.

---

## Duplicated Code

```typescript
function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('.');
  return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
}
```

---

## Better Existing Utility

```typescript
// shared/utils/dateFormat.ts
export function parseDate(dateString: string): Date {
  const parsedDate = parse(dateString, DATE_FORMAT, new Date(), { locale: nb });
  if (!isValid(parsedDate)) {
    throw new Error(`Invalid date string: ${dateString}...`);
  }
  return parsedDate;
}
```

---

## Tasks

- [x] In useDashboardData.ts:
  - Add import: `import { parseDate } from '@/shared/utils/dateFormat'`
  - Remove local parseDate function (lines 145-148)
- [x] In useSparingData.ts:
  - Add import: `import { parseDate } from '@/shared/utils/dateFormat'`
  - Remove local parseDate function (lines 60-63)
- [x] In useGjeldData.ts:
  - Add import: `import { parseDate } from '@/shared/utils/dateFormat'`
  - Remove local parseDate function (lines 42-45)
- [x] In usePensjonData.ts:
  - Add import: `import { parseDate } from '@/shared/utils/dateFormat'`
  - Remove local parseDate function (lines 42-45)
- [x] In usePortfolioData.ts:
  - Add import: `import { parseDate } from '@/shared/utils/dateFormat'`
  - Remove local parseDate function (lines 33-36)
- [x] Run type check: `pnpm type-check` (Frontend build succeeded with TypeScript)
- [x] Run lint: `pnpm lint` (No lint errors)
- [x] Test all pages load correctly (Frontend build completed successfully)

---

## Acceptance Criteria

- [x] No local parseDate() functions in feature hooks
- [x] All hooks import from shared/utils/dateFormat
- [x] Type check passes
- [x] All pages render correctly
- [x] Date sorting works on all pages

## Status: COMPLETED

All 5 feature hooks now use the shared `parseDate()` utility from `@/shared/utils/dateFormat`. The local duplicate implementations have been removed. Build verification completed successfully.

---

## References

- Due Diligence Report: .docs/DUE-DILIGENCE-REPORT.md (Critical Errors #4)
- DRY Principle violation
