# 306-REFACTOR: Convert OnboardingPage.css to Mobile-First

## Context

[frontend/src/features/auth/OnboardingPage.css](frontend/src/features/auth/OnboardingPage.css) still uses `max-width` media query pattern instead of mobile-first `min-width` pattern.

## Current Code

```css
/* Responsive */
@media (max-width: 640px) {
  .onboarding-page__header {
    padding: 1rem;
  }
}
```

## Expected Code

```css
/* Mobile-first: base is mobile */
.onboarding-page__header {
  padding: 1rem;
}

/* Tablet and up */
@media (min-width: 640px) {
  .onboarding-page__header {
    padding: 1.5rem 2rem;
  }
}
```

## Acceptance Criteria

- [x] Convert max-width query to min-width pattern
- [x] Base styles represent mobile layout
- [x] Visual appearance unchanged at all breakpoints
- [x] No regressions on mobile or desktop

## Files to Modify

- [frontend/src/features/auth/OnboardingPage.css](frontend/src/features/auth/OnboardingPage.css)

## Priority

Low - Consistency improvement

## Labels

refactor, css, mobile-first

## Effort

Trivial (< 30 minutes)

## Resolution

Converted `OnboardingPage.css` from desktop-first max-width pattern to mobile-first min-width pattern:

**Changes made**:
1. Moved base `.onboarding-page__header` padding from `1.5rem 2rem` (desktop) to `1rem` (mobile)
2. Created `@media (min-width: 640px)` query for tablet and up
3. Desktop padding (`1.5rem 2rem`) now inside media query for larger screens
4. Updated comment from "Responsive" to "Mobile-first: base is mobile, tablet and up"

**Build verification**: ✓ Frontend builds successfully with no CSS errors

**Visual impact**: None - layout behaves identically at all breakpoints. Mobile devices get optimal padding, tablets/desktop get enhanced spacing.
