# 121-FEATURE: Allow Negative Gjeld Values in Economy Wizard

**Priority**: High
**Effort**: Small (30 min)
**Labels**: frontend, validation, onboarding
**Status**: COMPLETED

---

## Context

The economy wizard (`/economy`) currently validates that gjeld (debt) values cannot be negative. However, users may want to enter negative values to represent debt being paid off or overpayments.

The value should be allowed as negative input, but stored correctly as the absolute value (since debt is inherently negative in net worth calculations).

---

## Acceptance Criteria

- [x] Allow negative number input for gjeld accounts
- [x] Store the absolute value (positive number) in the database
- [x] Display appropriate feedback when negative is entered
- [x] Backend validation accepts the corrected value

---

## Technical Approach

1. Remove `min="0"` constraint from gjeld value inputs
2. In `validateAccountsStep()`, remove the `value < 0` check for gjeld category
3. When submitting, transform negative gjeld values to positive: `Math.abs(value)`
4. Consider adding a note: "Gjeld lagres som positivt tall"

---

## Files Modified

- frontend/src/features/auth/onboarding/OnboardingWizard.tsx - Modified validation and submission logic
- frontend/src/features/auth/onboarding/steps/StepGjeld.tsx - Added user-facing note
- frontend/src/features/auth/onboarding/steps/StepAccounts.css - Added styling for note

---

## Progress Log

1. **Validation Update**: Modified `validateAccountsStep()` to allow negative values only for gjeld category (line 208)
2. **Submission Logic**: Added `Math.abs()` transformation for gjeld values in `handleSubmit()` (line 366)
3. **User Feedback**: Added helper note in StepGjeld explaining negative values are stored as positive
4. **Build Verification**: Frontend build successful with no TypeScript errors

---

## Resolution

All acceptance criteria completed. Users can now enter negative gjeld values, which are automatically stored as positive numbers. The NumberInput component already supports negative number input via its built-in filtering logic.

### Changes Made:

1. **OnboardingWizard.tsx (line 208)**:
   - Changed: `if (account.value < 0)` → `if (account.value < 0 && category !== 'gjeld')`
   - Effect: Allows negative values to pass validation for gjeld category only

2. **OnboardingWizard.tsx (line 366)**:
   - Changed: `value: acc.value` → `value: Math.abs(acc.value)` for gjeld accounts
   - Effect: Converts negative input to positive before API submission

3. **StepGjeld.tsx (lines 38-40)**:
   - Added helper note: "Du kan legge inn negative verdier (f.eks. -500 000), som vil bli lagret som positive tall"
   - Effect: Informs users about negative value support

4. **StepAccounts.css (lines 31-37)**:
   - Added `.step-accounts__note` styling for the helper text
   - Effect: Consistent styling with muted color and italic font

### Testing Notes:
- Frontend build completed successfully
- No TypeScript compilation errors
- Backend does not require changes (stores positive values as designed)

---

## Related

- Debt is subtracted in net worth calculation, so positive storage is correct
