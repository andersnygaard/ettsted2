# 179-DESIGN: Buttons Should Have White Background

## Summary
Some buttons use transparent backgrounds instead of solid white. Buttons should have `var(--warm-white)` or `var(--surface)` background for visual consistency.

## Priority
MEDIUM

## Effort
Simple

## Context
Buttons with transparent backgrounds blend into the page background, reducing visual hierarchy. They should have solid backgrounds for better clickability affordance.

## Acceptance Criteria
- [x] Primary buttons have solid colored background (charcoal/accent)
- [x] Secondary buttons have white/surface background
- [x] Ghost/tertiary buttons can remain transparent (intentional)
- [x] Consistent button styling across all pages

## Technical Approach
1. Audit button styles across codebase
2. Update secondary button backgrounds from `transparent` to `var(--warm-white)`
3. Ensure hover states still work with solid backgrounds
4. Document button hierarchy in design system

## COMPLETED

### Changes Made
1. **components/src/ui/Button/Button.css** - `.btn--secondary`
   - Changed `background: transparent` to `background: var(--warm-white)`
   - Updated hover state to `background: var(--bone)` for better UX

2. **frontend/src/features/dashboard/HomePage.css** - `.landing-btn--secondary`
   - Changed `background: transparent` to `background: var(--warm-white)`

3. **components/src/data/TableFooter/TableFooter.css** - `.table-footer__page-btn`
   - Changed `background: transparent` to `background: var(--warm-white)`

4. **frontend/src/features/auth/TermsDialog.css** - `.terms-dialog__tab`
   - Changed `background: transparent` to `background: var(--warm-white)`

### Intentional Transparent Buttons (Tertiary/Ghost)
- `.login-modal__close` - Icon close button with hover state
- `.terms-dialog__close` - Icon close button with hover state
- `.agent-actions__toggle` - Toggle button for accordion

### Testing
- Frontend build: SUCCESS
- All CSS changes verified
- Button hierarchy established: Primary (colored) → Secondary (white) → Tertiary (transparent with hover)
