# FEATURE: Dekning Section Component

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: Medium
**Labels**: component, ui, gjeld
**Estimated Effort**: Simple - 1 hour

## Context & Motivation

The dekning section combines the donut chart with explanatory text showing how much savings cover debt.

## Reference

Design file: `.docs/design-drafts/draft-1-gjeld.html` (lines 137-216, 357-369)

## Desired Outcome

Two-column section with donut chart and info text.

## Acceptance Criteria

- [ ] Create `/frontend/src/features/gjeld/DekningSection.tsx`
- [ ] Props: `sumSparing`, `sumGjeld`
- [ ] DonutChart on left
- [ ] Title, description, and remaining amount on right
- [ ] Responsive layout (stacks on mobile)

## Technical Approach

```tsx
// DekningSection.tsx
interface DekningSectionProps {
  sumSparing: number;
  sumGjeld: number;
}

export function DekningSection({ sumSparing, sumGjeld }: DekningSectionProps) {
  const percentage = Math.min(100, (sumSparing / sumGjeld) * 100);
  const remaining = Math.max(0, sumGjeld - sumSparing);

  return (
    <div className="dekning-section">
      <DonutChart percentage={percentage} label="Dekning" />

      <div className="dekning-info">
        <h3>Dekning for gjeld</h3>
        <p>
          Din sparing dekker nå {percentage >= 100 ? 'all' : 'nesten all'} gjeld.
          Ved 100% har du teknisk sett null netto gjeld - sparingen din kan betale ned alt.
        </p>
        <div className="dekning-highlight">
          Gjenstår: {formatCurrency(remaining)}
        </div>
      </div>
    </div>
  );
}
```

```css
.dekning-section {
  background: var(--warm-white);
  padding: 48px;
  border-radius: 2px;
  margin-bottom: 48px;
  display: flex;
  align-items: center;
  gap: 48px;
}

@media (max-width: 768px) {
  .dekning-section {
    flex-direction: column;
    text-align: center;
  }
}

.dekning-info h3 {
  font-family: var(--font-heading);
  font-size: 24px;
  font-weight: 400;
  margin-bottom: 12px;
}

.dekning-info p {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.7;
  margin-bottom: 20px;
}

.dekning-highlight {
  font-family: var(--font-mono);
  font-size: 18px;
  font-weight: 500;
}
```

## Dependencies

- `050-FEATURE-dekning-circle-component.md`

---

**Next Steps**: Implement for Gjeld page
