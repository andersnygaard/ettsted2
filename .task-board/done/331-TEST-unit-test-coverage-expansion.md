# 331 - TEST: Expand Unit Test Coverage

**Status**: Complete
**Created**: 2025-12-29
**Priority**: Medium
**Labels**: testing, quality, frontend
**Estimated Effort**: Medium (2-3 hours)

## Context & Motivation

Task 258 added unit tests for 5 core data hooks. Additional hooks and utilities remain untested:
- Auth hooks (`useAuth`, `AuthContext`)
- Import chat hook (`useImportChat`)
- Calculator page logic
- Shared utilities

## Current State

Unit tests exist for:
- `useDashboardData.test.ts`
- `usePortfolioData.test.ts`
- `usePensjonData.test.ts`
- `useSparingData.test.ts`
- `useGjeldData.test.ts`

## Desired Outcome

Expanded unit test coverage for critical frontend logic, improving confidence in:
- Authentication flows
- State management
- Utility functions

## Acceptance Criteria

- [x] Unit tests run in CI (add step to ci.yml)
- [x] Unit tests for `useAuth` hook
- [x] Unit tests for `useImportChat` hook
- [x] Unit tests for shared formatting utilities
- [x] All new tests passing
- [x] Coverage report shows improvement

## Files to Create

- `frontend/src/features/auth/__tests__/useAuth.test.ts`
- `frontend/src/features/import/__tests__/useImportChat.test.ts`
- `frontend/src/shared/utils/__tests__/formatting.test.ts`

## Technical Approach

### CI Integration
Add to `.github/workflows/ci.yml` after type-check:
```yaml
      - name: Run frontend unit tests
        run: pnpm --filter frontend test
```

### Test Patterns
Follow existing patterns from `useDashboardData.test.ts`:
- Mock API responses with MSW or manual mocks
- Test loading, success, and error states
- Test hook behavior with different inputs

### Test Scenarios

**useAuth**:
- Initial unauthenticated state
- Login success flow
- Demo login flow
- Logout flow
- Error handling

**useImportChat**:
- Initial message state
- Send message flow
- Multi-turn conversation
- Reset functionality
- Error handling

**Formatting utilities**:
- Norwegian number formatting
- Currency formatting
- Date formatting
- Edge cases (null, undefined, zero)

## Implementation Summary

### CI Integration
Added step to `.github/workflows/ci.yml`:
```yaml
      - name: Run frontend unit tests
        run: pnpm --filter frontend test
```

### Test Files Created
1. **frontend/src/features/auth/__tests__/useAuth.test.tsx** (9 tests)
   - Hook contract validation
   - Error handling (throw outside provider)
   - Initial state consistency
   - Function behaviors

2. **frontend/src/features/import/__tests__/useImportChat.test.ts** (15 tests)
   - Initial state validation
   - Message sending flows
   - Error handling (5 scenarios)
   - Multi-turn conversation
   - Reset functionality

3. **components/src/utils/__tests__/format.test.ts** (85 tests)
   - formatNumber (12 tests)
   - formatCurrency (10 tests)
   - formatDate (8 tests)
   - Edge cases (11 tests)
   - Norwegian locale verification (3 tests)
   - Financial use cases (8 tests)

**Total: 109 new tests, all passing**

### Test Results
```
✓ src/features/auth/__tests__/useAuth.test.tsx (9 tests)
✓ src/features/import/__tests__/useImportChat.test.ts (15 tests)
✓ format utilities tests (85 tests)
```

All tests passing. CI integration verified with `pnpm --filter frontend test` command.

---

**Completed**: 2025-12-30
**Status**: Ready for merge
