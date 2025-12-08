# Design: Mobile-First Landing Page (HomePage)

**Status**: Backlog
**Created**: 2025-12-08
**Priority**: Medium
**Labels**: frontend, design, mobile, landing
**Estimated Effort**: Simple - 1-2 hours

## Context & Motivation

Landing page (HomePage) is the first page visitors see. It needs to make a strong mobile impression with the Nordic Minimal aesthetic. Current implementation already has good mobile styles but uses desktop-first pattern.

## Current State

- Hero section: Uses `clamp()` for title (excellent)
- Hero actions: Stack on mobile (good)
- Features grid: 3→2→1 column progression
- CTA section: Works reasonably
- Uses `max-width` media queries (desktop-first)
- Buttons center and stretch on mobile

## Desired Outcome

- Refactor to mobile-first CSS pattern
- Hero has proper breathing room on mobile
- Feature cards feel native on mobile
- CTA section is compelling on small screens
- Touch targets 44px minimum

## Acceptance Criteria

- [ ] Refactor HomePage.css to mobile-first
- [ ] Hero padding optimized for mobile
- [ ] Feature cards have proper mobile spacing
- [ ] CTA buttons full-width on mobile
- [ ] Touch targets 44px minimum
- [ ] Works on 320px width screens

## Affected Components

### Frontend
- **Files**:
  - `frontend/src/features/dashboard/HomePage.css`

## Technical Approach

### Implementation Steps

1. **Refactor to mobile-first**:
   ```css
   /* BASE: Mobile */
   .landing-hero {
     padding: var(--space-3xl) var(--space-lg);
     min-height: 50vh;
   }

   .landing-hero__title {
     font-size: clamp(36px, 10vw, 56px);
   }

   .landing-hero__subtitle {
     font-size: var(--font-size-md);
   }

   .landing-hero__actions {
     flex-direction: column;
     align-items: center;
   }

   .landing-btn {
     width: 100%;
     max-width: 280px;
     justify-content: center;
     min-height: 44px;
   }

   .landing-features {
     padding: var(--space-3xl) var(--space-lg);
   }

   .landing-features__grid {
     grid-template-columns: 1fr;
   }

   .landing-feature-card {
     text-align: center;
   }

   .landing-feature-card__icon {
     margin: 0 auto var(--space-lg);
   }

   .landing-cta {
     padding: var(--space-3xl) var(--space-lg);
   }

   /* TABLET */
   @media (min-width: 768px) {
     .landing-hero {
       padding: var(--space-4xl) var(--space-lg);
       min-height: 60vh;
     }

     .landing-hero__title {
       font-size: clamp(36px, 10vw, 56px);
     }

     .landing-hero__actions {
       flex-direction: row;
     }

     .landing-btn {
       width: auto;
       max-width: none;
     }

     .landing-features__grid {
       grid-template-columns: repeat(2, 1fr);
     }

     .landing-feature-card {
       text-align: left;
     }

     .landing-feature-card__icon {
       margin: 0 0 var(--space-lg) 0;
     }
   }

   /* DESKTOP */
   @media (min-width: 1024px) {
     .landing-hero {
       padding: var(--space-6xl) var(--space-4xl);
       min-height: 70vh;
     }

     .landing-hero__title {
       font-size: clamp(48px, 8vw, 84px);
     }

     .landing-hero__subtitle {
       font-size: var(--font-size-lg);
     }

     .landing-features {
       padding: var(--space-6xl) var(--space-4xl);
     }

     .landing-features__grid {
       grid-template-columns: repeat(3, 1fr);
     }

     .landing-cta {
       padding: var(--space-6xl) var(--space-4xl);
     }
   }
   ```

### Dependencies

- 238-DESIGN-mobile-first-refactor-foundation

### Risks & Considerations

- **Risk**: Feature cards centered text might not align well with icon
- **Mitigation**: Center icon as well on mobile

## Code References

### Current Pattern
```css
/* HomePage.css:249-299 - Desktop-first */
@media (max-width: var(--bp-lg)) {
  .landing-features__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: var(--bp-md)) {
  .landing-hero {
    padding: var(--space-4xl) var(--space-lg);
    min-height: 60vh;
  }
  /* ... */
}
```

---

**Next Steps**: Ready for implementation after 238 foundation task.
