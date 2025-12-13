# FEATURE: Container Component

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: Medium
**Labels**: component, layout
**Estimated Effort**: Simple - 30 minutes

## Context & Motivation

Consistent container widths across pages (wide for portfolio table, narrow for focused pages).

## Reference

Design drafts show different max-widths per page type

## Desired Outcome

Container component with width variants.

## Acceptance Criteria

- [ ] Create `/frontend/src/shared/components/Container.tsx`
- [ ] Props: `children`, `width` (default/narrow/wide)
- [ ] Default: 1200px (dashboard)
- [ ] Narrow: 900px (calculators, sparing, gjeld, pensjon)
- [ ] Wide: 1800px (portfolio table)
- [ ] Responsive padding

## Technical Approach

```tsx
// Container.tsx
interface ContainerProps {
  children: React.ReactNode;
  width?: 'default' | 'narrow' | 'wide';
  className?: string;
}

export function Container({ children, width = 'default', className }: ContainerProps) {
  return (
    <div className={`container container--${width} ${className || ''}`}>
      {children}
    </div>
  );
}
```

```css
.container {
  margin: 0 auto;
  padding: 0 48px;
}

.container--default { max-width: 1200px; }
.container--narrow { max-width: 900px; }
.container--wide { max-width: 1800px; padding: 0 40px; }

@media (max-width: 768px) {
  .container { padding: 0 24px; }
}
```

## Dependencies

- `021-FEATURE-design-tokens.md`

---

**Next Steps**: Implement with layout
