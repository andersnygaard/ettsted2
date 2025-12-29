# 330 - QUALITY: Remove Debug Console.log from OnboardingWizard

**Status**: Backlog
**Created**: 2025-12-29
**Priority**: Low
**Labels**: quality, cleanup, frontend
**Estimated Effort**: Simple (15 min)

## Context & Motivation

Debug `console.log` statements remain in production code. While task 184 removed most console logs, one debug statement was added later in OnboardingWizard.tsx.

## Current State

```typescript
// frontend/src/features/auth/onboarding/OnboardingWizard.tsx
console.log('handleSubmit called', { mode, requestBody });
// ...
console.log('Calling updateMutation with accounts:', requestBody.accounts);
```

These debug logs expose internal state to browser console in production.

## Desired Outcome

No debug console.log statements in production code. Error logging via `console.error` is acceptable for legitimate error handling.

## Acceptance Criteria

- [ ] Remove `console.log('handleSubmit called'...)`
- [ ] Remove `console.log('Calling updateMutation...')`
- [ ] Build passes
- [ ] No other debug console.log introduced

## Files to Change

- `frontend/src/features/auth/onboarding/OnboardingWizard.tsx`

## Technical Approach

Simple removal of debug statements. No replacement needed - these are development debug logs, not user-facing functionality.

---

**Next Steps**: Quick fix - can be done directly without moving to in-progress.
