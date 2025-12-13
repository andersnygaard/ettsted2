# FEATURE: Page Header Component

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: High
**Labels**: component, layout
**Estimated Effort**: Simple - 1 hour

## Context & Motivation

Page headers appear at the top of each page with a title and optional subtitle. Some pages have action buttons (Portfolio), others are centered (Calculators).

## Reference

Design files:
- Centered: `.docs/design-drafts/draft-1-nordic-minimal.html` (lines 94-109)
- With actions: `.docs/design-drafts/draft-1-portfolio.html` (lines 116-167)

## Desired Outcome

Flexible page header component supporting multiple layouts.

## Acceptance Criteria

- [ ] Create `/frontend/src/shared/components/PageHeader.tsx`
- [ ] Props: `title`, `subtitle`, `centered`, `actions` (React nodes)
- [ ] Cormorant Garamond font for title (42-44px, weight 300)
- [ ] Subtitle in secondary text color
- [ ] Centered variant for pages like Calculators
- [ ] Left-aligned with right actions for pages like Portfolio

## Technical Approach

```tsx
// PageHeader.tsx
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, centered, actions }: PageHeaderProps) {
  return (
    <div className={`page-header ${centered ? 'page-header--centered' : ''}`}>
      <div className="page-header__content">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </div>
  );
}
```

## Dependencies

- `021-FEATURE-design-tokens.md`
- `022-FEATURE-typography-setup.md`

---

**Next Steps**: Implement after typography setup
