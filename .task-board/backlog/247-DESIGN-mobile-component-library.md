# Design: Mobile-First Component Library Polish

**Status**: Backlog
**Created**: 2025-12-08
**Priority**: Medium
**Labels**: components, design, mobile, library
**Estimated Effort**: Medium - 3-4 hours

## Context & Motivation

The shared component library (`/components`) provides the building blocks for all pages. Ensuring these components are mobile-first creates a strong foundation and reduces per-page mobile work. Some components already have responsive styles but use desktop-first patterns.

## Current State

### Cards
- **StatCard**: Has mobile responsive styles (desktop-first)
- **CalculatorCard**: Basic styles, needs mobile review
- **Card**: Base card component

### Data Display
- **HeroNumber**: Large numbers that need scaling
- **StatsRow**: Grid layout needs mobile handling
- **TableHeader/TableFooter**: Part of SpreadsheetTable

### Forms
- **NumberInput**: Needs 16px font for iOS
- **DateInput**: Dropdowns need touch-friendly sizing
- **Button**: Touch targets review

### Layout
- **Container**: Padding scales
- **PageHeader**: Already centered, review mobile padding
- **PageSkeleton**: Loading states

### System
- **Toast**: Position and sizing on mobile
- **Modal**: Base modal styles

## Desired Outcome

- All components use mobile-first CSS
- Consistent touch targets (44px minimum)
- Form inputs prevent iOS zoom (16px font)
- Components adapt gracefully to small screens

## Acceptance Criteria

- [ ] Refactor StatCard.css to mobile-first
- [ ] Refactor CalculatorCard.css to mobile-first
- [ ] Refactor HeroNumber.css to mobile-first
- [ ] Refactor StatsRow.css to mobile-first
- [ ] Refactor NumberInput.css to mobile-first with 16px font
- [ ] Refactor DateInput.css to mobile-first with 16px font
- [ ] Refactor Button.css touch targets
- [ ] Refactor PageHeader.css to mobile-first
- [ ] Refactor Container.css to mobile-first
- [ ] Refactor Toast.css to mobile-first
- [ ] All interactive elements have 44px minimum touch targets

## Affected Components

### Components Library
- **Files**:
  - `components/src/cards/StatCard/StatCard.css`
  - `components/src/cards/CalculatorCard/CalculatorCard.css`
  - `components/src/cards/Card/Card.css`
  - `components/src/data/HeroNumber/HeroNumber.css`
  - `components/src/data/StatsRow/StatsRow.css`
  - `components/src/forms/NumberInput/NumberInput.css`
  - `components/src/forms/DateInput/DateInput.css`
  - `components/src/ui/Button/Button.css`
  - `components/src/layout/PageHeader/PageHeader.css`
  - `components/src/layout/Container/Container.css`
  - `components/src/system/Toast/Toast.css`

## Technical Approach

### Implementation Steps

1. **Form inputs - prevent iOS zoom**:
   ```css
   /* NumberInput.css - BASE: Mobile */
   .number-input__field {
     font-size: 16px;  /* Prevents iOS zoom */
     min-height: 44px;
     padding: var(--space-sm);
   }

   /* TABLET+ */
   @media (min-width: 768px) {
     .number-input__field {
       font-size: 14px;
       min-height: auto;
     }
   }
   ```

2. **Button touch targets**:
   ```css
   /* Button.css - BASE: Mobile */
   .btn {
     min-height: 44px;
     padding: var(--space-sm) var(--space-lg);
   }

   .btn--icon {
     min-width: 44px;
     min-height: 44px;
   }

   /* TABLET+ */
   @media (min-width: 768px) {
     .btn {
       min-height: auto;
     }
     .btn--icon {
       min-width: auto;
       min-height: auto;
     }
   }
   ```

3. **HeroNumber scaling**:
   ```css
   /* HeroNumber.css - BASE: Mobile */
   .hero-number {
     font-size: clamp(36px, 12vw, 84px);
   }

   .hero-number__label {
     font-size: 10px;
   }

   /* TABLET+ */
   @media (min-width: 768px) {
     .hero-number__label {
       font-size: 11px;
     }
   }
   ```

4. **StatsRow grid**:
   ```css
   /* StatsRow.css - BASE: Mobile */
   .stats-row {
     display: grid;
     grid-template-columns: 1fr;
     gap: var(--space-sm);
   }

   /* TABLET */
   @media (min-width: 768px) {
     .stats-row {
       grid-template-columns: repeat(2, 1fr);
       gap: var(--space-md);
     }
   }

   /* DESKTOP */
   @media (min-width: 1024px) {
     .stats-row {
       grid-template-columns: repeat(3, 1fr);
     }
   }
   ```

5. **Container padding**:
   ```css
   /* Container.css - BASE: Mobile */
   .container {
     padding: 0 var(--space-md);
   }

   /* TABLET+ */
   @media (min-width: 768px) {
     .container {
       padding: 0 var(--space-xl);
     }
   }

   /* DESKTOP+ */
   @media (min-width: 1024px) {
     .container {
       padding: 0 var(--space-4xl);
     }
   }
   ```

6. **Toast positioning**:
   ```css
   /* Toast.css - BASE: Mobile */
   .toast {
     left: var(--space-md);
     right: var(--space-md);
     bottom: var(--space-md);
     max-width: none;
   }

   /* TABLET+ */
   @media (min-width: 768px) {
     .toast {
       left: auto;
       right: var(--space-xl);
       bottom: var(--space-xl);
       max-width: 400px;
     }
   }
   ```

### Dependencies

- 238-DESIGN-mobile-first-refactor-foundation

### Risks & Considerations

- **Risk**: Changing component library affects all pages
- **Mitigation**: Test each component in Storybook before and after
- **Risk**: iOS zoom prevention might change appearance
- **Mitigation**: 16px is only slightly larger, usually unnoticeable

## Code References

### Current Pattern
```css
/* StatCard.css:64-68 - Desktop-first */
@media (max-width: var(--bp-md)) {
  .stat-card {
    width: 100%;
  }
}

/* StatsRow has some responsive but needs review */
```

## Testing Strategy

1. Open Storybook
2. For each component:
   - View at 320px width
   - Test all interactive states
   - Verify touch targets
   - Check text doesn't overflow
3. Run E2E tests after changes

---

**Next Steps**: Ready for implementation after 238 foundation task.
