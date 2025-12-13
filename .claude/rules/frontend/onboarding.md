---
paths:
  - frontend/**/*
---

# Onboarding Rules

## Stack
useReducer, react-router-dom, TanStack Query mutations

## Structure
- `/features/auth/onboarding/OnboardingWizard.tsx` - Main orchestrator (4 steps)
- `/features/auth/onboarding/WizardProgressBar.tsx` - Step indicator
- `/features/auth/onboarding/steps/StepUser.tsx` - Profile setup
- `/features/auth/onboarding/steps/StepSparing.tsx` - Savings accounts
- `/features/auth/onboarding/steps/StepGjeld.tsx` - Debt accounts
- `/features/auth/onboarding/steps/StepPensjon.tsx` - Pension accounts
- `/features/auth/onboarding/steps/AccountsList.tsx` - Shared account list
- `/features/auth/onboarding/defaultAccounts.ts` - Default account presets
- `/features/auth/onboarding/types.ts` - State/action types

## Patterns

### State Management via useReducer
```typescript
interface OnboardingState {
  currentStep: WizardStep;           // 1 | 2 | 3 | 4
  userInfo: { nickname: string };
  profile: ProfileData;
  accounts: {
    sparing: OnboardingAccount[];
    gjeld: OnboardingAccount[];
    pensjon: OnboardingAccount[];
  };
  errors: Record<string, string>;
  isSubmitting: boolean;
  submitError: string | null;
}
```

### Action Dispatch Pattern
```typescript
dispatch({ type: 'UPDATE_USER_INFO', payload: { nickname: 'JohnDoe' } });
dispatch({ type: 'ADD_ACCOUNT', category: 'sparing' });
dispatch({ type: 'UPDATE_ACCOUNT', category: 'gjeld', tempId, updates });
dispatch({ type: 'REMOVE_ACCOUNT', category: 'pensjon', tempId });
dispatch({ type: 'SET_STEP', step: 2 });
```

### Two Modes
- **create**: Initial onboarding → `POST /users/me/onboarding`
- **edit**: Edit existing economy → `PATCH /users/me`

### Validation Per Step
```typescript
// Step 1: validateStep1() - nickname, profile fields
// Steps 2-4: validateAccountsStep(accounts, category)
```

## Decisions
- useReducer over useState for complex nested state
- `tempId` for new accounts (prefixed `temp-`), converted to real ID on save
- Debt values stored as positive, converted to negative on display
- Must have at least one account per category

## Gotchas
- **tempId prefix check**: `acc.tempId.startsWith('temp-')` → new account, don't send ID
- **refreshUser after submit**: Call `refreshUser()` to update AuthContext
- **Loan details required**: gjeld accounts MUST have `loanDetails` object
- **Validation on navigate**: Validate current step before allowing `handleNext()`
- **isSubmitting guard**: Disable buttons while submitting to prevent double-submit
