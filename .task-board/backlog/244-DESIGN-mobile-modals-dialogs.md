# Design: Mobile-First Modals & Dialogs

**Status**: Backlog
**Created**: 2025-12-08
**Priority**: Medium
**Labels**: frontend, design, mobile, modals, dialogs
**Estimated Effort**: Medium - 2-3 hours

## Context & Motivation

Modals and dialogs appear throughout the app (login, delete account, terms, new month). On mobile, modals should take more screen space, have larger touch targets, and potentially slide up from bottom for better UX.

## Current State

### DeleteAccountModal
- Fixed width 90%, max-width 400px - works okay
- Close button has 44px touch target (good)
- Action buttons might be cramped
- Already has modal animation

### LoginModal
- Similar to delete modal
- Demo profile selector might be small on mobile
- Close button has 44px touch target (good)
- Has reduced motion support (excellent)

### TermsDialog
- Max-height 80vh, changes to 90vh on mobile
- Tabs might be cramped on mobile
- Content padding could be tighter
- Has mobile styles but desktop-first

### NewMonthModal
- Uses Modal component base
- Form fields grid needs mobile optimization
- Date picker dropdowns work on mobile

## Desired Outcome

- All modals use mobile-first CSS
- Modals take more width on mobile (less side padding)
- Touch targets 44px minimum on all buttons
- Consider bottom sheet style on mobile for better thumb reach
- Smooth animations, respect reduced motion

## Acceptance Criteria

- [ ] Refactor DeleteAccountModal.css to mobile-first
- [ ] Refactor LoginModal.css to mobile-first
- [ ] Refactor TermsDialog.css to mobile-first
- [ ] Refactor NewMonthModal.css to mobile-first
- [ ] All buttons have 44px minimum touch targets
- [ ] Modal widths optimized for mobile (more horizontal space)
- [ ] Form inputs 16px font (prevents iOS zoom)
- [ ] Works on 320px width screens

## Affected Components

### Frontend
- **Files**:
  - `frontend/src/features/auth/DeleteAccountModal.css`
  - `frontend/src/features/auth/LoginModal.css`
  - `frontend/src/features/auth/TermsDialog.css`
  - `frontend/src/features/portfolio/NewMonthModal.css`

### Components
- `components/src/system/Modal/Modal.css` (if exists)

## Technical Approach

### Implementation Steps

1. **Base modal pattern (mobile-first)**:
   ```css
   /* BASE: Mobile - Near full width */
   .modal {
     width: calc(100% - var(--space-lg));
     max-width: none;
     margin: var(--space-sm);
     max-height: 90vh;
   }

   .modal__content {
     padding: var(--space-lg);
   }

   .modal__actions {
     flex-direction: column;
     gap: var(--space-sm);
   }

   .modal__btn {
     min-height: 44px;
     width: 100%;
   }

   /* TABLET+ */
   @media (min-width: 768px) {
     .modal {
       width: 90%;
       max-width: 400px;
       margin: auto;
       max-height: 80vh;
     }
     .modal__content {
       padding: var(--space-xl);
     }
     .modal__actions {
       flex-direction: row;
       justify-content: flex-end;
     }
     .modal__btn {
       min-height: auto;
       width: auto;
     }
   }
   ```

2. **DeleteAccountModal mobile-first**:
   ```css
   /* BASE: Mobile */
   .delete-account-modal {
     width: calc(100% - 2rem);
     max-width: none;
   }

   .delete-account-modal__content {
     padding: var(--space-lg);
   }

   .delete-account-modal__input {
     font-size: 16px;  /* Prevents iOS zoom */
   }

   .delete-account-modal__actions {
     flex-direction: column-reverse;  /* Cancel on top for safety */
   }

   .delete-account-modal__btn {
     width: 100%;
     min-height: 44px;
   }

   /* TABLET+ */
   @media (min-width: 768px) {
     .delete-account-modal {
       width: 90%;
       max-width: 400px;
     }
     .delete-account-modal__content {
       padding: var(--space-2xl) var(--space-xl) var(--space-xl);
     }
     .delete-account-modal__input {
       font-size: 14px;
     }
     .delete-account-modal__actions {
       flex-direction: row;
     }
     .delete-account-modal__btn {
       width: auto;
       min-height: auto;
     }
   }
   ```

3. **TermsDialog tabs mobile-first**:
   ```css
   /* BASE: Mobile */
   .terms-dialog__tabs {
     padding: 0 var(--space-md);
     overflow-x: auto;  /* Allow horizontal scroll if needed */
     -webkit-overflow-scrolling: touch;
   }

   .terms-dialog__tab {
     padding: var(--space-sm) var(--space-md);
     font-size: 0.875rem;
     min-height: 44px;
   }

   .terms-dialog__content {
     padding: var(--space-lg) var(--space-md);
   }

   /* TABLET+ */
   @media (min-width: 768px) {
     .terms-dialog__tabs {
       padding: 0 var(--space-xl);
       overflow-x: visible;
     }
     .terms-dialog__tab {
       padding: var(--space-sm) var(--space-xl);
       font-size: 0.9375rem;
       min-height: auto;
     }
     .terms-dialog__content {
       padding: var(--space-3xl) var(--space-xl);
     }
   }
   ```

4. **NewMonthModal form mobile-first**:
   ```css
   /* BASE: Mobile */
   .new-month-modal__fields {
     grid-template-columns: 1fr;
   }

   .new-month-modal__select {
     font-size: 16px;  /* Prevents iOS zoom */
     min-height: 44px;
   }

   /* TABLET+ */
   @media (min-width: 768px) {
     .new-month-modal__fields {
       grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
     }
     .new-month-modal__select {
       font-size: 14px;
       min-height: auto;
     }
   }
   ```

### Dependencies

- 238-DESIGN-mobile-first-refactor-foundation

### Risks & Considerations

- **Risk**: Full-width buttons might feel different from desktop
- **Mitigation**: Consistent pattern - users adapt quickly
- **Risk**: Column-reverse on delete actions might confuse
- **Mitigation**: Test with users, danger action should require more effort

## Code References

### Current Pattern
```css
/* LoginModal.css:252-265 - Desktop-first */
@media (max-width: var(--bp-sm)) {
  .login-modal__content {
    padding: 2rem 1.5rem 1.5rem;
  }
  .login-modal__title {
    font-size: 1.5rem;
  }
}

/* TermsDialog.css:176-204 - Desktop-first */
@media (max-width: var(--bp-sm)) {
  .terms-dialog {
    max-height: 90vh;
    max-width: calc(100% - 2rem);
  }
}
```

---

**Next Steps**: Ready for implementation after 238 foundation task.
