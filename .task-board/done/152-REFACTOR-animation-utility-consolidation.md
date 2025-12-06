# 152-REFACTOR: Animation Utility Consolidation

## Summary
Standardize animation usage across all pages. Some pages use inline CSS animations while others use utility classes. Create a consistent system.

## Status
COMPLETED

## Context
Current state:
- `frontend/src/styles/animations.css` defines utility classes (`animate-fade-up`, `animate-delay-1`, etc.)
- Multiple CSS files had duplicate `@keyframes` definitions
- Inconsistent animation usage created maintenance burden

## Acceptance Criteria
- [x] Single source of truth for animations in `animations.css`
- [x] All pages use utility classes instead of inline animations
- [x] Remove duplicate `@keyframes` definitions
- [x] Add `prefers-reduced-motion` support for all animations
- [x] Create animation timing presets (fast, normal, slow)

## Implementation Summary

### Consolidated Keyframes
All unique animations moved to single `animations.css`:
1. **fadeUp** - Fade in with upward translation (10px)
2. **fadeIn** - Simple opacity fade
3. **scaleIn** - Scale from 0.95 with fade
4. **modalEnter** - Scale + vertical translate for modals
5. **pulse** - Pulsing scale animation for loading indicators
6. **spin** - 360-degree rotation for spinners

### New Utility Classes
- **Animation presets**: `.animate-fade-up`, `.animate-fade-in`, `.animate-scale-in`
- **Duration utilities**: `.animate-duration-fast` (200ms), `.animate-duration-normal` (400ms), `.animate-duration-slow` (800ms)
- **Delay utilities**: `.animate-delay-1` through `.animate-delay-10` (50ms increments, 0.05s - 0.5s)
- **Legacy support**: Page section delays preserved for backward compatibility

### Accessibility
- Added comprehensive `prefers-reduced-motion` support
- Disables all animations when user prefers reduced motion
- Sets animation-duration to 0.01ms for instant feedback

### Files Modified
- **Consolidated in**: `frontend/src/styles/animations.css`
- **Removed duplicates from**:
  - `frontend/src/features/auth/TermsDialog.css` (terms-dialog-enter → modalEnter)
  - `frontend/src/features/auth/LoginModal.css` (modal-enter → modalEnter)
  - `frontend/src/features/auth/DeleteAccountModal.css` (added modal animation)
  - `frontend/src/shared/components/AvatarMenu.css` (avatarMenuFadeIn → fadeUp)
  - `frontend/src/features/import/ImportPage.css` (removed local fadeUp reference)
  - `frontend/src/features/import/ChatMessage.css` (messageIn → fadeUp)
  - `frontend/src/features/auth/onboarding/OnboardingWizard.css` (removed spin keyframe)
  - `frontend/src/shared/components/LoadingSpinner.css` (removed spin keyframe)

## Build Status
✓ Frontend build successful: `pnpm --filter frontend build` passed with no errors

## Priority
Medium

## Effort
Completed (2 hours)

## Labels
refactor, animation, dx, consistency, accessibility
