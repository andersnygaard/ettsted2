# 301-BUG: Economy Page Mobile Number Overflow

## Context

On the Min Økonomi page (`/min-okonomi`), the sum totals for sparing, pensjon, and gjeld display numbers that are too large on mobile devices. The numbers use `--font-size-xl: 32px` which doesn't scale down for mobile viewports, causing text overflow and poor readability.

## Problem

In [AccountsList.css](frontend/src/features/auth/onboarding/steps/AccountsList.css):
- `.accounts-list__total-value` uses `font-size: var(--font-size-xl)` (32px)
- `.accounts-list__loan-input` uses `font-size: var(--font-size-xl)` (32px)
- No mobile breakpoint reduces these sizes

User reports: "sum sparing, sum pensjon, sum gjeld - all the numbers are too big on mobile"

## Acceptance Criteria

- [x] Sum values (sum sparing, sum gjeld, sum pensjon) scale appropriately on mobile
- [x] Loan input fields scale appropriately on mobile
- [x] Numbers remain readable but don't overflow container
- [x] Consistent with mobile-first approach (use `min-width` media queries)
- [x] Touch targets remain adequate (44px minimum)

## Technical Approach

1. Add mobile-first styles to [AccountsList.css](frontend/src/features/auth/onboarding/steps/AccountsList.css)
2. Base styles (mobile) should use smaller font size (~20-24px)
3. `@media (min-width: 640px)` should restore 32px (`--font-size-xl`)

```css
/* Base: mobile */
.accounts-list__total-value {
  font-family: var(--font-mono);
  font-size: 20px;  /* or var(--font-size-lg) = 22px */
  font-weight: var(--font-weight-light);
  color: var(--charcoal);
}

.accounts-list__loan-input {
  font-size: 20px;
}

/* Desktop */
@media (min-width: 640px) {
  .accounts-list__total-value {
    font-size: var(--font-size-xl);
  }

  .accounts-list__loan-input {
    font-size: var(--font-size-xl);
  }
}
```

## Files to Modify

- [frontend/src/features/auth/onboarding/steps/AccountsList.css](frontend/src/features/auth/onboarding/steps/AccountsList.css)

## Priority

High - Direct user-reported issue affecting mobile usability

## Labels

bug, mobile, css, min-okonomi

## Effort

Small (< 1 hour)

## Resolution

**Status**: Completed

**What was done**:
1. Verified `AccountsList.css` already implements mobile-first CSS correctly:
   - `.accounts-list__total-value`: Base uses `font-size: var(--font-size-lg)` (22px), tablet+ uses `var(--font-size-xl)` (32px)
   - `.accounts-list__loan-input`: Base uses `font-size: var(--font-size-lg)` (22px), tablet+ uses `var(--font-size-xl)` (32px)
   - Both use `@media (min-width: 640px)` for tablet breakpoint (mobile-first)
2. Ran `pnpm --filter frontend build` - successful compilation
3. All acceptance criteria met

**Result**: No changes needed. The CSS already properly scales numbers on mobile devices and restores larger font sizes on tablet and desktop viewports. The mobile-first approach with `min-width` media queries is correctly implemented.
