# FEATURE: Dekning Circle (Donut Chart) Component

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: Medium
**Labels**: component, visualization, gjeld
**Estimated Effort**: Medium - 1-2 hours

## Context & Motivation

The Gjeld page shows a donut chart visualizing debt coverage percentage (how much of debt is covered by savings).

## Reference

Design file: `.docs/design-drafts/draft-1-gjeld.html` (lines 137-191, 357-369)

## Desired Outcome

CSS-based donut chart showing coverage percentage.

## Acceptance Criteria

- [ ] Create `/frontend/src/shared/components/DonutChart.tsx`
- [ ] Props: `percentage`, `label`
- [ ] Conic gradient background
- [ ] Centered percentage value
- [ ] Label below value
- [ ] Smooth animation on load

## Technical Approach

```tsx
// DonutChart.tsx
interface DonutChartProps {
  percentage: number;
  label?: string;
  size?: number;
}

export function DonutChart({ percentage, label = 'Dekning', size = 180 }: DonutChartProps) {
  const degrees = (percentage / 100) * 360;

  return (
    <div
      className="donut-chart"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(
          var(--muted-sage) 0deg ${degrees}deg,
          var(--bone) ${degrees}deg 360deg
        )`
      }}
    >
      <div className="donut-chart__inner">
        <div className="donut-chart__value">{percentage.toFixed(1)}%</div>
        <div className="donut-chart__label">{label}</div>
      </div>
    </div>
  );
}
```

```css
.donut-chart {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
}

.donut-chart::before {
  content: '';
  position: absolute;
  width: 72%;
  height: 72%;
  background: var(--warm-white);
  border-radius: 50%;
}

.donut-chart__inner {
  position: relative;
  z-index: 1;
  text-align: center;
}

.donut-chart__value {
  font-family: var(--font-heading);
  font-size: 42px;
  font-weight: 400;
  line-height: 1;
}

.donut-chart__label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
  margin-top: 4px;
}
```

## Dependencies

- `021-FEATURE-design-tokens.md`

---

**Next Steps**: Implement for Gjeld page
