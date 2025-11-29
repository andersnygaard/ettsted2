# FEATURE: Milestone Card Component

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: High
**Labels**: component, ui, dashboard
**Estimated Effort**: Simple - 1 hour

## Context & Motivation

The milestone card is a dark-themed card showing progress toward a financial milestone (e.g., 1M kr). It appears prominently on the dashboard.

## Reference

Design file: `.docs/design-drafts/draft-1-nordic-minimal.html` (lines 182-229, 345-355)

## Desired Outcome

Dark card with milestone target, progress bar, and remaining amount.

## Acceptance Criteria

- [ ] Create `/frontend/src/shared/components/MilestoneCard.tsx`
- [ ] Props: `label`, `target`, `current`, `formatValue`
- [ ] Dark background (charcoal gradient)
- [ ] Gold accent for target value
- [ ] Progress bar with gold fill
- [ ] Remaining amount and percentage labels
- [ ] Centered layout

## Technical Approach

```tsx
// MilestoneCard.tsx
interface MilestoneCardProps {
  label: string;
  target: number;
  current: number;
  formatValue?: (value: number) => string;
}

export function MilestoneCard({ label, target, current, formatValue }: MilestoneCardProps) {
  const percentage = Math.min(100, (current / target) * 100);
  const remaining = Math.max(0, target - current);
  const format = formatValue || ((v: number) => v.toLocaleString('nb-NO'));

  return (
    <div className="milestone-card">
      <div className="milestone-label">{label}</div>
      <div className="milestone-value">{format(target)} kr</div>
      <ProgressBar
        value={percentage}
        variant="gold"
        leftLabel={`Gjenstår: ${format(remaining)} kr`}
        rightLabel={`${percentage.toFixed(0)}%`}
      />
    </div>
  );
}
```

```css
.milestone-card {
  max-width: 600px;
  margin: 0 auto 80px;
  background: linear-gradient(135deg, var(--charcoal) 0%, #3a3a3a 100%);
  color: var(--warm-white);
  padding: 40px;
  border-radius: 2px;
  text-align: center;
}

.milestone-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(255,255,255,0.6);
  margin-bottom: 12px;
}

.milestone-value {
  font-family: var(--font-heading);
  font-size: 48px;
  font-weight: 300;
  color: var(--gold);
  margin-bottom: 24px;
}
```

## Dependencies

- `021-FEATURE-design-tokens.md`
- `033-FEATURE-progress-bar-component.md`

---

**Next Steps**: Implement for dashboard
