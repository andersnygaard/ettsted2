# FEATURE: Stat Card Component

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: High
**Labels**: component, ui, dashboard
**Estimated Effort**: Simple - 1 hour

## Context & Motivation

Stat cards display key metrics (value + label) in a clickable card format. Used on dashboard for quick stats grid.

## Reference

Design file: `.docs/design-drafts/draft-1-nordic-minimal.html` (lines 145-180, 326-343)

## Desired Outcome

Stat card component displaying a value and label, optionally clickable.

## Acceptance Criteria

- [ ] Create `/frontend/src/shared/components/StatCard.tsx`
- [ ] Props: `value`, `label`, `href`, `onClick`
- [ ] Value in Cormorant Garamond, 32px
- [ ] Label in uppercase, small, secondary color
- [ ] Hover lift effect when clickable
- [ ] Centered text alignment

## Technical Approach

```tsx
// StatCard.tsx
interface StatCardProps {
  value: string;
  label: string;
  href?: string;
  onClick?: () => void;
}

export function StatCard({ value, label, href, onClick }: StatCardProps) {
  const content = (
    <>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__label">{label}</div>
    </>
  );

  if (href) {
    return (
      <Link to={href} className="stat-card stat-card--clickable">
        {content}
      </Link>
    );
  }

  return (
    <div className={`stat-card ${onClick ? 'stat-card--clickable' : ''}`} onClick={onClick}>
      {content}
    </div>
  );
}
```

```css
.stat-card {
  background: var(--warm-white);
  padding: 28px;
  border-radius: 2px;
  text-align: center;
  text-decoration: none;
  color: inherit;
}

.stat-card--clickable {
  cursor: pointer;
  transition: transform var(--transition-medium), box-shadow var(--transition-medium);
}

.stat-card--clickable:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(0,0,0,0.06);
}

.stat-card__value {
  font-family: var(--font-heading);
  font-size: 32px;
  font-weight: 400;
  margin-bottom: 8px;
}

.stat-card__label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-secondary);
}
```

## Dependencies

- `021-FEATURE-design-tokens.md`
- `030-FEATURE-card-component.md`

---

**Next Steps**: Implement for dashboard quick stats
