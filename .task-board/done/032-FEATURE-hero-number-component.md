# FEATURE: Hero Number Component

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: High
**Labels**: component, ui, dashboard
**Estimated Effort**: Simple - 1 hour

## Context & Motivation

The hero number is the large, centered value displayed prominently on each page (net worth, sum sparing, etc.) with an optional change badge.

## Reference

Design file: `.docs/design-drafts/draft-1-nordic-minimal.html` (lines 111-143, 318-324)

## Desired Outcome

Large centered value display with label and change indicator.

## Acceptance Criteria

- [ ] Create `/frontend/src/shared/components/HeroNumber.tsx`
- [ ] Props: `label`, `value`, `change` (optional), `changeLabel`
- [ ] Large Cormorant Garamond value (72-84px)
- [ ] Small caps label above
- [ ] Change badge below (green for positive)
- [ ] Centered layout with proper spacing

## Technical Approach

```tsx
// HeroNumber.tsx
interface HeroNumberProps {
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
}

export function HeroNumber({ label, value, change, changeLabel }: HeroNumberProps) {
  const isPositive = change && change > 0;

  return (
    <div className="hero-section">
      <div className="hero-label">{label}</div>
      <div className="hero-value">{value}</div>
      {change !== undefined && (
        <div className={`hero-change ${isPositive ? 'hero-change--positive' : 'hero-change--negative'}`}>
          {isPositive ? '+' : ''}{change.toFixed(2)}% {changeLabel}
        </div>
      )}
    </div>
  );
}
```

```css
.hero-section {
  text-align: center;
  margin-bottom: 64px;
}

.hero-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.hero-value {
  font-family: var(--font-heading);
  font-size: 84px;
  font-weight: 300;
  letter-spacing: -0.02em;
  line-height: 1;
  margin-bottom: 20px;
}

.hero-change {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 2px;
}

.hero-change--positive {
  background: rgba(139, 154, 125, 0.12);
  color: var(--muted-sage);
}
```

## Dependencies

- `021-FEATURE-design-tokens.md`
- `022-FEATURE-typography-setup.md`

---

**Next Steps**: Core dashboard component
