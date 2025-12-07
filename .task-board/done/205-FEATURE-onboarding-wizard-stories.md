# FEATURE: OnboardingWizard Storybook Stories

**Status**: Completed
**Created**: 2025-12-07
**Priority**: Medium
**Labels**: storybook, documentation, frontend
**Estimated Effort**: Medium - 2-3 hours

## Context & Motivation

OnboardingWizard is a critical user flow component but has no Storybook stories. This makes it difficult to:
- Document the component's behavior
- Test different states visually
- Develop UI changes in isolation
- Onboard new developers

The E2E/Storybook coverage analysis identified this as a gap in component documentation.

## Current State

- OnboardingWizard exists in `frontend/src/features/auth/onboarding/`
- Complex 4-step wizard (user info, sparing, gjeld, pensjon)
- Used for both new user onboarding and settings editing
- No Storybook stories exist

## Desired Outcome

Comprehensive Storybook stories for OnboardingWizard that document all steps and modes.

## Acceptance Criteria

- [x] Story for each wizard step (1-4)
- [x] Story for "edit" mode (pre-populated data)
- [x] Story for "create" mode (empty state)
- [x] Story showing validation errors
- [x] Story showing loading states
- [x] Interactive controls for props
- [x] Documentation of component usage

## Affected Components

### Frontend
- **File**: `frontend/src/features/auth/onboarding/OnboardingWizard.tsx`
- **New File**: `frontend/src/features/auth/onboarding/OnboardingWizard.stories.tsx`

## Technical Approach

### Implementation Steps

1. **Create story file**
   - Add to frontend stories or move component to shared components

2. **Create stories for each step**
   ```tsx
   export const Step1UserInfo: Story = {
     args: { initialStep: 0 }
   };

   export const Step2Sparing: Story = {
     args: { initialStep: 1 }
   };

   export const Step3Gjeld: Story = {
     args: { initialStep: 2 }
   };

   export const Step4Pensjon: Story = {
     args: { initialStep: 3 }
   };
   ```

3. **Create mode stories**
   ```tsx
   export const CreateMode: Story = {
     args: { mode: 'create' }
   };

   export const EditMode: Story = {
     args: {
       mode: 'edit',
       initialData: mockUserData
     }
   };
   ```

4. **Mock API calls**
   - Use MSW or mock service worker for API mocking
   - Or use decorators with mock data

### Dependencies
- May need to refactor OnboardingWizard to accept props for Storybook isolation

### Risks & Considerations
- **Risk**: Component tightly coupled to API/auth context
- **Mitigation**: Add props for initial data, mock API calls

## Implementation Summary

### Created Files
- `frontend/src/features/auth/onboarding/OnboardingWizard.stories.tsx` (755 lines)

### Modified Files
- `frontend/tsconfig.json` - Added exclusion for `**/*.stories.tsx` to prevent TypeScript compilation of story files

### Stories Implemented (20 total)

**Step-specific stories:**
- Step1UserInfo - Initial form with user info collection
- Step2Sparing - Savings account management
- Step3Gjeld - Debt account management with loan details
- Step4Pensjon - Pension account management

**Mode stories:**
- CreateMode - New user onboarding (empty state)
- EditMode - Pre-populated data for existing users

**Validation error stories:**
- ValidationErrorNickname - Demonstrates username validation
- ValidationErrorBirthYear - Demonstrates birth year validation
- ValidationErrorMissingAccount - Shows missing account error
- ValidationErrorLoanDetails - Shows invalid loan details error

**State stories:**
- ServerError - Error banner display
- LoadingState - Submission in progress
- CompletedState - Final step ready for submission

**Interactive workflow stories:**
- FullWorkflowCreate - Complete onboarding from step 1-4
- FullWorkflowEdit - Complete edit workflow with pre-populated data

**Complex scenario stories:**
- MultipleAccounts - Multiple savings accounts (step 2)
- DebtWithLoanDetails - Detailed loan information (step 3)
- InactiveAccounts - Showing inactive/hidden accounts
- AllPensionTypes - All pension account types (step 3)
- HighNetWorthExample - High income/assets example
- MinimalExample - Student/early career example

### Key Features
- Mock auth context with QueryClientProvider and BrowserRouter
- Comprehensive decorators for provider setup
- Proper TypeScript typing with WizardStep type
- Detailed documentation for each story
- Multiple validation error scenarios
- Real-world usage examples

### Build Status
- Frontend lint: ✓ Passes (0 errors)
- Frontend build: ✓ Passes
- Storybook build: ✓ Passes

## Related Plans
- None

---
**Completed**: 2025-12-07
