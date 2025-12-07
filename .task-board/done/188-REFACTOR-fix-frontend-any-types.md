# 188 - Fix Frontend `any` Types in Error Handlers

**Type**: REFACTOR
**Priority**: High
**Effort**: Small (1-2 hours)
**Labels**: typescript, code-quality

---

## Context

The due diligence audit (2025-12-07) found 4 instances of `any` type in frontend error handlers. This defeats TypeScript strict mode benefits and allows type errors to slip through.

## Problem

Error catch blocks use untyped `error: any` instead of proper TypeScript types:
- `error.statusCode` accessed without type checking
- No type guards for error handling
- ESLint warns but doesn't error on `any` usage

## Locations

1. [AuthContext.tsx:56](../frontend/src/features/auth/AuthContext.tsx#L56) - catch block error
2. [OnboardingWizard.tsx:258](../frontend/src/features/auth/onboarding/OnboardingWizard.tsx#L258) - mutation error
3. [OnboardingWizard.tsx:267](../frontend/src/features/auth/onboarding/OnboardingWizard.tsx#L267) - mutation error
4. [OnboardingWizard.tsx:292](../frontend/src/features/auth/onboarding/OnboardingWizard.tsx#L292) - mutation error

## Acceptance Criteria

- [ ] All 4 `any` types replaced with proper types
- [ ] Type guard function created for error handling
- [ ] No new `any` types introduced
- [ ] TypeScript compiles without errors
- [ ] ESLint passes

## Technical Approach

1. Create error type utilities in `frontend/src/shared/utils/errorTypes.ts`:
   ```typescript
   export interface TypedError {
     message: string;
     statusCode?: number;
     code?: string;
   }

   export function isApiError(error: unknown): error is TypedError {
     return (
       typeof error === 'object' &&
       error !== null &&
       'message' in error
     );
   }
   ```

2. Update AuthContext.tsx catch block to use type guard

3. Update OnboardingWizard.tsx mutation error handlers

## Related

- Due diligence report: [.docs/DUE-DILIGENCE-REPORT.md](../.docs/DUE-DILIGENCE-REPORT.md)
- ESLint config improvement: 192-REFACTOR-eslint-any-error.md
