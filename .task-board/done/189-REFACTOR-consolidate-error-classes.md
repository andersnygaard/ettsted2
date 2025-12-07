# 189 - Consolidate Duplicate Error Classes

**Type**: REFACTOR
**Priority**: High
**Effort**: Small (1 hour)
**Labels**: backend, dry, code-quality

---

## Context

The due diligence audit (2025-12-07) found duplicate error class definitions in the backend. This violates DRY principles and creates maintenance burden.

## Problem

`backend/src/utils/cosmosHelpers.ts` defines its own error classes:
- `NotFoundError`
- `ConflictError`
- `ValidationError`

These duplicate the canonical classes in `backend/src/errors/AppError.ts`.

## Locations

- Duplicates: [cosmosHelpers.ts](../backend/src/utils/cosmosHelpers.ts)
- Canonical source: [errors/AppError.ts](../backend/src/errors/AppError.ts)

## Acceptance Criteria

- [ ] Remove duplicate error class definitions from cosmosHelpers.ts
- [ ] Import error classes from errors/AppError.ts
- [ ] Update all usages in cosmosHelpers.ts
- [ ] Verify error handling still works correctly
- [ ] TypeScript compiles without errors
- [ ] All tests pass

## Technical Approach

1. Read cosmosHelpers.ts to identify duplicate class definitions
2. Remove the duplicate class definitions
3. Add import statement:
   ```typescript
   import { NotFoundError, ConflictError, ValidationError } from '../errors/AppError';
   ```
4. Verify error throwing logic unchanged
5. Run backend type-check and tests

## Related

- Due diligence report: [.docs/DUE-DILIGENCE-REPORT.md](../.docs/DUE-DILIGENCE-REPORT.md)
