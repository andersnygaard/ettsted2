# Design: Mobile-First Auth Pages (Login, Onboarding)

**Status**: Backlog
**Created**: 2025-12-08
**Priority**: Medium
**Labels**: frontend, design, mobile, auth, onboarding
**Estimated Effort**: Medium - 2-3 hours

## Context & Motivation

Auth pages (Login, Onboarding) are critical user journey touchpoints. Users on mobile need seamless login and onboarding experiences. Current implementation has some mobile styles but uses desktop-first approach.

## Current State

### LoginPage
- Centered card works well on mobile
- Padding reduces on mobile (good)
- Uses `max-width` queries
- Button touch targets adequate

### OnboardingPage/Wizard
- Wizard container adapts but could be tighter on mobile
- Step navigation buttons might be cramped
- Account lists in steps need mobile optimization
- Progress bar works but could be more prominent on mobile

## Desired Outcome

- All auth pages use mobile-first CSS
- Login card fills more width on mobile (less wasted space)
- Onboarding wizard feels native on mobile
- Navigation buttons have proper touch targets
- Account lists are easy to manage on mobile

## Acceptance Criteria

- [ ] Refactor LoginPage.css to mobile-first
- [ ] Refactor OnboardingPage.css to mobile-first
- [ ] Refactor OnboardingWizard.css to mobile-first
- [ ] Refactor step CSS files to mobile-first
- [ ] Login card uses more horizontal space on mobile
- [ ] Wizard navigation buttons 44px touch targets
- [ ] Account list items have proper mobile spacing
- [ ] Works on 320px width screens

## Affected Components

### Frontend
- **Files**:
  - `frontend/src/features/auth/LoginPage.css`
  - `frontend/src/features/auth/OnboardingPage.css`
  - `frontend/src/features/auth/onboarding/OnboardingWizard.css`
  - `frontend/src/features/auth/onboarding/WizardProgressBar.css`
  - `frontend/src/features/auth/onboarding/steps/StepUser.css`
  - `frontend/src/features/auth/onboarding/steps/StepAccounts.css`
  - `frontend/src/features/auth/onboarding/steps/AccountsList.css`

## Technical Approach

### Implementation Steps

1. **LoginPage mobile-first**:
   ```css
   /* BASE: Mobile */
   .login-page {
     padding: var(--space-lg);
   }

   .login-card {
     padding: var(--space-xl);
     max-width: none;  /* Full width minus padding */
   }

   .login-title {
     font-size: var(--font-size-lg);
   }

   /* TABLET+ */
   @media (min-width: 768px) {
     .login-page {
       padding: var(--space-4xl);
     }
     .login-card {
       padding: var(--space-4xl);
       max-width: 400px;
     }
     .login-title {
       font-size: var(--font-size-xl);
     }
   }
   ```

2. **OnboardingWizard mobile-first**:
   ```css
   /* BASE: Mobile */
   .onboarding-wizard {
     padding: var(--space-md) var(--space-sm);
   }

   .onboarding-wizard__btn {
     padding: var(--space-sm) var(--space-lg);
     min-height: 44px;  /* Touch target */
     font-size: 0.875rem;
   }

   .onboarding-wizard__nav {
     gap: var(--space-sm);
   }

   /* TABLET+ */
   @media (min-width: 768px) {
     .onboarding-wizard {
       padding: 2rem 1rem;
     }
     .onboarding-wizard__btn {
       padding: 0.75rem 1.5rem;
       min-height: auto;
       font-size: 0.9375rem;
     }
     .onboarding-wizard__nav {
       gap: 1rem;
     }
   }
   ```

3. **AccountsList mobile optimization**:
   ```css
   /* BASE: Mobile */
   .accounts-list__item {
     padding: var(--space-md);
     gap: var(--space-sm);
   }

   .accounts-list__actions {
     flex-direction: column;
     gap: var(--space-xs);
   }

   .accounts-list__action-btn {
     min-height: 44px;
     min-width: 44px;
   }

   /* TABLET+ */
   @media (min-width: 768px) {
     .accounts-list__item {
       padding: var(--space-sm);
     }
     .accounts-list__actions {
       flex-direction: row;
     }
     .accounts-list__action-btn {
       min-height: auto;
       min-width: auto;
     }
   }
   ```

4. **Progress bar mobile enhancement**:
   ```css
   /* BASE: Mobile - More prominent */
   .wizard-progress {
     height: 6px;
     margin-bottom: var(--space-lg);
   }

   /* TABLET+ */
   @media (min-width: 768px) {
     .wizard-progress {
       height: 4px;
       margin-bottom: var(--space-md);
     }
   }
   ```

### Dependencies

- 238-DESIGN-mobile-first-refactor-foundation

### Risks & Considerations

- **Risk**: Full-width login card might look strange on very wide phones
- **Mitigation**: Add `max-width: 100%` with side margins

## Code References

### Current Pattern
```css
/* LoginPage.css:97-109 - Desktop-first */
@media (max-width: var(--bp-md)) {
  .login-page {
    padding: var(--space-xl);
  }
  .login-card {
    padding: var(--space-2xl);
  }
}

/* OnboardingWizard.css:103-112 - Desktop-first */
@media (max-width: var(--bp-sm)) {
  .onboarding-wizard {
    padding: 1rem 0.5rem;
  }
}
```

---

**Next Steps**: Ready for implementation after 238 foundation task.
