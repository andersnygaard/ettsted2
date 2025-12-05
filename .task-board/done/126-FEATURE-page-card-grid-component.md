# 126-FEATURE: Page Card Grid Component for Calculators

**Priority**: Medium
**Effort**: Medium (2-3 hours)
**Labels**: components, storybook, design

---

## Context

All calculator pages use a two-column layout (inputs card + results card). This pattern should be extracted into a reusable component with proper responsive behavior:

- Two equal-width columns on wide screens
- Stacked columns on mobile
- Consistent gap and alignment
- Animate nicely on load

**Use storybook-stories skill for documentation.**
**Use frontend-design skill for implementation.**

---

## Acceptance Criteria

- [x] Create `PageCardGrid` component in `/components` workspace
- [x] Support 2-column layout on desktop (min-width: 768px)
- [x] Stack to 1-column on mobile
- [x] Equal column widths by default
- [x] Optional `reversed` prop for right-to-left order
- [x] Proper gap spacing (use design tokens)
- [x] Storybook stories with all variants
- [x] Update calculator pages to use new component

---

## Resolution (2025-12-04)

**Files created**:
- `components/src/layout/PageCardGrid/PageCardGrid.tsx`
- `components/src/layout/PageCardGrid/PageCardGrid.css`
- `components/src/layout/PageCardGrid/PageCardGrid.stories.tsx`
- `components/src/layout/PageCardGrid/index.ts`

**Files updated**:
- `components/src/index.ts` - Export
- All 4 calculator pages now use `<PageCardGrid gap="lg">`

**Component API**: `columns`, `gap`, `reversed`, `className` props. 8 Storybook stories.

---

## Technical Approach

```tsx
interface PageCardGridProps {
  children: React.ReactNode;
  columns?: 1 | 2;  // default 2
  gap?: 'sm' | 'md' | 'lg';  // default 'lg'
  reversed?: boolean;  // swap column order
}
```

CSS Grid implementation:
```css
.page-card-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-2xl);
}

@media (max-width: 768px) {
  .page-card-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## Files to Create

- `components/src/layout/PageCardGrid/PageCardGrid.tsx`
- `components/src/layout/PageCardGrid/PageCardGrid.css`
- `components/src/layout/PageCardGrid/PageCardGrid.stories.tsx`

---

## Files to Update

- [CompoundCalculatorPage.tsx](frontend/src/features/calculators/CompoundCalculatorPage.tsx) - Use new grid
- [MonteCarloPage.tsx](frontend/src/features/calculators/MonteCarloPage.tsx) - Use new grid
- [FireCalculatorPage.tsx](frontend/src/features/calculators/FireCalculatorPage.tsx) - Use new grid
- [LoanCalculatorPage.tsx](frontend/src/features/calculators/LoanCalculatorPage.tsx) - Use new grid
