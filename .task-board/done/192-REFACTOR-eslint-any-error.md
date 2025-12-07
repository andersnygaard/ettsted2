# 192 - Change ESLint no-explicit-any to Error

**Type**: REFACTOR
**Priority**: Medium
**Effort**: Small (30 min)
**Labels**: eslint, typescript, code-quality

---

## Context

The due diligence audit (2025-12-07) found that `@typescript-eslint/no-explicit-any` is set to 'warn' instead of 'error'. This allows `any` types to slip through without blocking builds.

## Problem

Current ESLint config allows `any` types with just a warning:
```javascript
'@typescript-eslint/no-explicit-any': 'warn'
```

This should be 'error' to enforce strict typing.

## Locations

- [frontend/.eslintrc.cjs](../frontend/.eslintrc.cjs)
- [backend/.eslintrc.cjs](../backend/.eslintrc.cjs) (if applicable)
- [components/.eslintrc.cjs](../components/.eslintrc.cjs) (if applicable)

## Acceptance Criteria

- [ ] Change no-explicit-any from 'warn' to 'error' in all workspaces
- [ ] Fix any existing violations (should be 0 after task 188)
- [ ] ESLint passes in all workspaces
- [ ] CI build still passes

## Technical Approach

1. Update ESLint config in each workspace:
   ```javascript
   '@typescript-eslint/no-explicit-any': 'error'
   ```

2. Run `pnpm lint` to verify no violations

3. This task depends on 188-REFACTOR-fix-frontend-any-types being completed first

## Dependencies

- 188-REFACTOR-fix-frontend-any-types (must be done first)

## Related

- Due diligence report: [.docs/DUE-DILIGENCE-REPORT.md](../.docs/DUE-DILIGENCE-REPORT.md)
