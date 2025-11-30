# FEATURE: Breakdown Cards Component

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: Medium
**Labels**: component, ui, pensjon
**Estimated Effort**: Simple - 1 hour

## Context & Motivation

Two-column cards showing pension breakdown (Arbeidsgiver vs NAV) on the Pensjon page.

## Reference

Design file: `.docs/design-drafts/draft-1-pensjon.html` (lines 138-189, 352-365)

## Desired Outcome

Side-by-side cards showing pension source breakdown.

## Acceptance Criteria

- [ ] Create `/frontend/src/features/pensjon/BreakdownCards.tsx`
- [ ] Props: `items` (array of icon, value, label, percentage)
- [ ] 2-column grid
- [ ] Icon with colored background
- [ ] Value in Cormorant Garamond
- [ ] Label and percentage below
- [ ] Staggered fade-in animation

## Technical Approach

```tsx
// BreakdownCards.tsx
interface BreakdownItem {
  icon: string;
  value: number;
  label: string;
  percentage: number;
  iconBg?: string;
}

interface BreakdownCardsProps {
  items: BreakdownItem[];
}

export function BreakdownCards({ items }: BreakdownCardsProps) {
  return (
    <div className="breakdown-section">
      {items.map((item, index) => (
        <div key={item.label} className={`breakdown-card animate-fade-up animate-delay-${index + 1}`}>
          <div className="breakdown-icon" style={{ background: item.iconBg }}>
            {item.icon}
          </div>
          <div className="breakdown-value">{formatCurrency(item.value)}</div>
          <div className="breakdown-label">{item.label}</div>
          <div className="breakdown-percent">{item.percentage}% av total</div>
        </div>
      ))}
    </div>
  );
}
```

```css
.breakdown-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 48px;
}

@media (max-width: 600px) {
  .breakdown-section {
    grid-template-columns: 1fr;
  }
}

.breakdown-card {
  background: var(--warm-white);
  padding: 32px;
  border-radius: 2px;
  text-align: center;
}

.breakdown-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 20px;
}

.breakdown-value {
  font-family: var(--font-heading);
  font-size: 36px;
  font-weight: 400;
  margin-bottom: 8px;
}

.breakdown-label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.breakdown-percent {
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--muted-sage);
}
```

## Dependencies

- `021-FEATURE-design-tokens.md`
- `024-FEATURE-animation-utilities.md`

---

**Next Steps**: Implement for Pensjon page
