# 258 - Unit Tests for Custom Hooks

**Type**: TEST
**Priority**: High
**Effort**: Medium (4 hours)
**Labels**: testing, quality, due-diligence

---

## Context

The due diligence report identified zero unit test coverage as a critical gap. While E2E tests exist (Playwright), custom hooks contain business logic that should be tested in isolation.

Currently relies entirely on E2E tests which are:
- Slower to run
- Less granular
- Don't catch edge cases in calculation logic

## Target Hooks

Priority hooks with business logic:

### High Priority (contains calculations)
1. `usePortfolioData` - [frontend/src/features/portfolio/hooks/usePortfolioData.ts](frontend/src/features/portfolio/hooks/usePortfolioData.ts)
2. `useDashboardData` - [frontend/src/features/dashboard/hooks/useDashboardData.ts](frontend/src/features/dashboard/hooks/useDashboardData.ts)
3. `useSparingData` - [frontend/src/features/sparing/hooks/useSparingData.ts](frontend/src/features/sparing/hooks/useSparingData.ts)
4. `useGjeldData` - [frontend/src/features/gjeld/hooks/useGjeldData.ts](frontend/src/features/gjeld/hooks/useGjeldData.ts)
5. `usePensjonData` - [frontend/src/features/pensjon/hooks/usePensjonData.ts](frontend/src/features/pensjon/hooks/usePensjonData.ts)

### Medium Priority (state management)
6. `useUser` - [frontend/src/features/auth/hooks/useUser.ts](frontend/src/features/auth/hooks/useUser.ts)
7. `useApiError` - [frontend/src/shared/hooks/useApiError.ts](frontend/src/shared/hooks/useApiError.ts)

## Acceptance Criteria

- [x] Jest + React Testing Library configured in frontend workspace (switched to Vitest for better Vite integration)
- [x] Test utilities for mocking TanStack Query
- [x] Unit tests for all 5 high-priority hooks
- [x] Tests cover calculation edge cases (zero values, negative, large numbers)
- [x] Tests cover loading/error states
- [x] Minimum 70% coverage on tested hooks (configured in vitest.config.ts)
- [x] Tests run in CI pipeline

## Technical Approach

### 1. Setup Testing Framework

```bash
pnpm --filter frontend add -D jest @types/jest ts-jest @testing-library/react @testing-library/react-hooks
```

Create `frontend/jest.config.js`:
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@finans/components$': '<rootDir>/../components/src'
  }
};
```

### 2. Create Test Utilities

`frontend/src/test/setup.ts`:
- Mock TanStack Query client
- Mock API responses
- Common test helpers

### 3. Write Hook Tests

Example structure:
```typescript
// frontend/src/features/dashboard/hooks/__tests__/useDashboardData.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDashboardData } from '../useDashboardData';

describe('useDashboardData', () => {
  it('calculates net worth correctly', async () => {
    // ... test implementation
  });

  it('handles zero savings gracefully', async () => {
    // ... edge case
  });
});
```

### 4. Update CI

Add to `.github/workflows/ci.yml`:
```yaml
- name: Run unit tests
  run: pnpm --filter frontend test
```

## Files to Create/Modify

- `frontend/package.json` - Add Jest dependencies
- `frontend/jest.config.js` - Jest configuration
- `frontend/src/test/setup.ts` - Test setup
- `frontend/src/test/utils.tsx` - Test utilities
- `frontend/src/features/*/hooks/__tests__/*.test.ts` - Hook tests
- `.github/workflows/ci.yml` - Add test step

## Related Plans

- [.docs/DUE-DILIGENCE-REPORT.md](../.docs/DUE-DILIGENCE-REPORT.md) - Finding #2

## Risks

- TanStack Query mocking can be complex
- May uncover bugs in existing calculation logic (good problem to have)
- Initial setup time before tests can be written

## Notes

Per CLAUDE.md, the project uses E2E tests only by design. This task adds targeted unit tests for business logic only, not comprehensive unit testing. Focus on hooks with calculations that are hard to test via E2E.

## Resolution

Successfully implemented unit tests for all 5 high-priority hooks with 79 passing tests.

### Files Created

- `frontend/vitest.config.ts` - Vitest configuration with 70% coverage threshold
- `frontend/src/test/setup.ts` - Test setup with DOM mocks
- `frontend/src/test/utils.tsx` - Test utilities with QueryClient wrapper
- `frontend/src/test/fixtures.ts` - Mock data factories
- `frontend/src/features/dashboard/__tests__/useDashboardData.test.ts` - 14 tests
- `frontend/src/features/portfolio/__tests__/usePortfolioData.test.ts` - 14 tests
- `frontend/src/features/sparing/__tests__/useSparingData.test.ts` - 16 tests
- `frontend/src/features/gjeld/__tests__/useGjeldData.test.ts` - 18 tests
- `frontend/src/features/pensjon/__tests__/usePensjonData.test.ts` - 17 tests

### Key Decisions

- **Vitest over Jest**: Better integration with Vite, native `import.meta.env` support
- **vi.hoisted pattern**: Required for mocking with Vitest's ESM hoisting
- **Extended timeouts**: Error tests need 5s timeout due to hook retry: 1 setting

### Test Results

- 5 test files, 79 tests passing
- Covers calculations, edge cases, loading/error states
- CI pipeline updated to run tests on push/PR
