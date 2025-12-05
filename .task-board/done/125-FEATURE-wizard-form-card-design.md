# 125-FEATURE: Economy Wizard Form Card Design

**Priority**: Medium
**Effort**: Medium (1-2 hours)
**Labels**: frontend, design, onboarding

---

## Context

In the onboarding wizard at `/economy`, the "Brukerinformasjon" and "Din økonomi" forms (Step 1) have input boxes that would look better on a white background rather than the current bone background.

Wrapping the form in a Card component would improve visual hierarchy and input field contrast.

**Use frontend-design skill for implementation.**

---

## Acceptance Criteria

- [x] Step 1 form content wrapped in a Card component
- [x] Input fields appear on white background (via Card)
- [x] Consistent with Nordic Minimal design system
- [x] Maintains responsive behavior
- [x] Other wizard steps (accounts) may already use cards - check for consistency

---

## Resolution (2025-12-04)

**Files modified**:
- `frontend/src/features/auth/onboarding/steps/StepUser.tsx` - Added Card wrapper
- `frontend/src/features/auth/onboarding/steps/StepUser.css` - Added flexbox layout, card padding

**Design**: Card uses `--warm-white` background, consistent with AccountsList items in other steps.

---

## Technical Approach

1. Import `Card` from `@finans/components`
2. Wrap `<StepUser>` content in `<Card>` component
3. Adjust padding/spacing as needed
4. Review other steps for consistency

---

## Files to Modify

- [StepUser.tsx](frontend/src/features/auth/onboarding/steps/StepUser.tsx)
- [StepUser.css](frontend/src/features/auth/onboarding/steps/StepUser.css)

---

## Design Notes

Use frontend-design skill to ensure the implementation matches the Nordic Minimal aesthetic with proper spacing and hierarchy.
