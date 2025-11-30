# FEATURE: Stacked Area Chart Component

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: Medium
**Labels**: component, d3, visualization
**Estimated Effort**: Medium - 2-3 hours

## Context & Motivation

The Pensjon page shows a stacked area chart with two series (Arbeidsgiver and NAV pension sources).

## Reference

Design file: `.docs/design-drafts/draft-1-pensjon.html` (lines 241-307, 381-404)

## Desired Outcome

D3.js stacked area chart with legend.

## Acceptance Criteria

- [ ] Create `/frontend/src/shared/components/StackedAreaChart.tsx`
- [ ] Props: `data`, `series` (array of { key, color, label })
- [ ] Stacked areas with different colors
- [ ] Legend showing series labels
- [ ] X-axis with year labels
- [ ] Smooth curve interpolation

## Technical Approach

```tsx
// StackedAreaChart.tsx
interface Series {
  key: string;
  color: string;
  label: string;
}

interface StackedAreaChartProps {
  data: Record<string, any>[];
  series: Series[];
  title?: string;
  height?: number;
}

export function StackedAreaChart({ data, series, title, height = 200 }: StackedAreaChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const stack = d3.stack()
      .keys(series.map(s => s.key));

    const stackedData = stack(data);

    // ... D3 stacked area implementation
  }, [data, series, height]);

  return (
    <div className="chart-section">
      {title && (
        <div className="chart-header">
          <span className="chart-title">{title}</span>
        </div>
      )}
      <div className="chart-area">
        <svg ref={svgRef} width="100%" height={height} />
      </div>
      <div className="chart-legend">
        {series.map(s => (
          <span key={s.key} className={s.key}>
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}
```

```css
.chart-legend {
  display: flex;
  gap: 24px;
  margin-top: 16px;
}

.chart-legend span {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--text-secondary);
}

.chart-legend span::before {
  content: '';
  width: 12px;
  height: 4px;
  border-radius: 2px;
}

.chart-legend .arbeidsgiver::before { background: var(--pale-blue); }
.chart-legend .nav::before { background: var(--orange); }
```

## Dependencies

- `021-FEATURE-design-tokens.md`
- D3.js dependency

---

**Next Steps**: Implement for Pensjon page
