# 124-FEATURE: Wizard Button Consistent Color

**Priority**: Medium
**Effort**: Small (15 min)
**Labels**: frontend, css, ux

---

## Context

In the economy wizard (`/economy`), the "Neste" (Next) button appears black on the first step, but gray on subsequent steps until a textbox receives focus.

This inconsistency confuses users - a primary action button should always appear clickable and prominent.

**User's assessment**: The button should be black (prominent) from the start on all steps.

---

## Acceptance Criteria

- [x] "Neste" button has consistent black background on all wizard steps
- [x] Button color does not change based on form focus state
- [x] Button remains visually prominent regardless of form interaction

---

## Resolution (2025-12-04)

**Root cause**: BeerCSS global button styles overriding custom colors via CSS cascade.

**Fix**: Added `!important` to `.onboarding-wizard__btn--primary` background-color rules.

**File modified**: `frontend/src/features/auth/onboarding/OnboardingWizard.css`

---

## Technical Approach

Check for CSS rules that may be using `:focus-within` or similar selectors to modify button appearance. Remove or adjust these rules.

The button styling is in `.onboarding-wizard__btn--primary`:
```css
.onboarding-wizard__btn--primary {
  background-color: var(--charcoal, #2C2C2C);
}
```

Look for any conditional classes or state-based styling that might be overriding this.

---

## Files to Modify

- [OnboardingWizard.css](frontend/src/features/auth/onboarding/OnboardingWizard.css)
- Possibly [StepUser.css](frontend/src/features/auth/onboarding/steps/StepUser.css) if step-specific styling exists

---

## Investigation

Need to identify what's causing the gray state:
1. CSS `:focus-within` rules
2. React state-based className
3. Material UI override
4. Browser default styling
