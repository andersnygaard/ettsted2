# Design: Mobile Header & Navigation Polish

**Status**: Backlog
**Created**: 2025-12-08
**Priority**: Medium
**Labels**: frontend, design, mobile, navigation, header
**Estimated Effort**: Simple - 1-2 hours

## Context & Motivation

The AppHeader already has a mobile hamburger menu implementation. This task is to polish it, ensure mobile-first CSS, and verify touch targets and animations are smooth.

## Current State

- Hamburger menu exists and works
- Mobile menu slides in from right
- Nav items have active indicators
- Close button exists
- Uses `max-width` queries (desktop-first)
- Mobile menu is full-screen overlay
- Good structure overall

## Desired Outcome

- Refactor to mobile-first CSS for consistency
- Ensure all touch targets 44px minimum
- Smooth animations at 60fps
- Consider safe area insets for notched phones

## Acceptance Criteria

- [ ] Refactor AppHeader.css to mobile-first
- [ ] Verify hamburger button is 44px minimum
- [ ] Verify close button is 44px minimum
- [ ] Verify nav items are 44px height minimum
- [ ] Test animations are smooth
- [ ] Consider safe-area-inset for notched phones
- [ ] Works on 320px width screens

## Affected Components

### Frontend
- **Files**:
  - `frontend/src/shared/components/AppHeader.css`
  - `frontend/src/shared/components/AvatarMenu.css`

## Technical Approach

### Implementation Steps

1. **Refactor AppHeader.css to mobile-first**:
   ```css
   /* BASE: Mobile */
   .app-header {
     padding: var(--space-lg) 0;
   }

   .app-header__logo {
     font-size: 18px;
     padding-left: 0;
   }

   .app-header__nav {
     display: none;
   }

   .app-header__avatar {
     display: none;
   }

   .app-header__hamburger {
     display: flex;
   }

   /* TABLET */
   @media (min-width: 640px) {
     .app-header {
       padding: var(--space-xl) 0;
     }
     .app-header__logo {
       font-size: 22px;
     }
   }

   /* DESKTOP */
   @media (min-width: 768px) {
     .app-header {
       padding: var(--space-2xl) 0;
     }
     .app-header__logo {
       font-size: 26px;
       padding-left: 32px;
     }
     .app-header__nav {
       display: flex;
     }
     .app-header__avatar {
       display: block;
     }
     .app-header__hamburger {
       display: none;
     }
   }
   ```

2. **Ensure touch targets**:
   ```css
   /* Already has min-width/height: 44px on close button */
   /* Verify hamburger: */
   .app-header__hamburger {
     min-width: 44px;
     min-height: 44px;
   }

   .app-header__mobile-nav-item {
     min-height: 44px;
     padding: 14px 20px;  /* Already good */
   }

   .app-header__mobile-logout {
     min-height: 44px;
   }
   ```

3. **Safe area insets for notched phones**:
   ```css
   .app-header__mobile-menu {
     padding-top: env(safe-area-inset-top, 0);
     padding-bottom: env(safe-area-inset-bottom, 0);
   }

   .app-header__mobile-header {
     padding-top: max(20px, env(safe-area-inset-top, 0));
   }
   ```

4. **Animation performance**:
   ```css
   /* Ensure GPU acceleration */
   .app-header__mobile-menu {
     will-change: transform;
     transform: translateX(100%);
   }

   .app-header__mobile-overlay {
     will-change: opacity;
   }
   ```

### Dependencies

- 238-DESIGN-mobile-first-refactor-foundation

### Risks & Considerations

- **Risk**: Safe area insets might have browser compatibility issues
- **Mitigation**: Use `env()` with fallbacks, test on real devices
- **Risk**: `will-change` can increase memory usage
- **Mitigation**: Only apply to animated elements

## Code References

### Current Pattern
```css
/* AppHeader.css:210-231 - Desktop-first */
@media (max-width: var(--bp-sm)) {
  .app-header {
    padding: var(--space-lg) 0;
  }
  .app-header__logo {
    font-size: 18px;
  }
  .app-header__nav {
    display: none;
  }
  .app-header__hamburger {
    display: flex;
  }
}
```

The mobile menu implementation (lines 233-403) is well done and follows good patterns.

---

**Next Steps**: Ready for implementation after 238 foundation task.
