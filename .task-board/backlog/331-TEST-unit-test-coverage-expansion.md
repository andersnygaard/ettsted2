# 331 - TEST: Expand Unit Test Coverage

**Status**: Backlog
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

- [ ] Unit tests for `useAuth` hook
- [ ] Unit tests for `useImportChat` hook
- [ ] Unit tests for shared formatting utilities
- [ ] All new tests passing
- [ ] Coverage report shows improvement

## Files to Create

- `frontend/src/features/auth/__tests__/useAuth.test.ts`
- `frontend/src/features/import/__tests__/useImportChat.test.ts`
- `frontend/src/shared/utils/__tests__/formatting.test.ts`

## Technical Approach

Follow existing test patterns from `useDashboardData.test.ts`:
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

---

**Next Steps**: Ready for implementation. Move to `.task-board/in-progress/` when starting work.
