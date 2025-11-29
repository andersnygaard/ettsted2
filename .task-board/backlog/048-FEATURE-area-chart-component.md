# FEATURE: Area Chart Component (D3.js)

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: High
**Labels**: component, d3, visualization
**Estimated Effort**: Complex - 3-4 hours

## Context & Motivation

Area charts are used on multiple pages (Sparing, Gjeld, Pensjon) to show value trends over time. D3.js implementation with consistent Nordic Minimal styling.

## Reference

Design files:
- Sparing: `.docs/design-drafts/draft-1-sparing.html` (lines 251-306)
- Gjeld: `.docs/design-drafts/draft-1-gjeld.html` (lines 263-314)

## Desired Outcome

Reusable D3.js area chart component.

## Acceptance Criteria

- [ ] Create `/frontend/src/shared/components/AreaChart.tsx`
- [ ] Props: `data`, `xKey`, `yKey`, `color`, `title`, `subtitle`
- [ ] SVG-based responsive chart
- [ ] Gradient fill with low opacity
- [ ] Smooth curve interpolation
- [ ] X-axis with date labels
- [ ] Hover tooltip (optional)
- [ ] Consistent styling across all uses

## Technical Approach

```tsx
// AreaChart.tsx
interface DataPoint {
  date: Date;
  value: number;
}

interface AreaChartProps {
  data: DataPoint[];
  color?: string;
  title?: string;
  subtitle?: string;
  height?: number;
}

export function AreaChart({
  data,
  color = 'var(--muted-sage)',
  title,
  subtitle,
  height = 200
}: AreaChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = containerRef.current?.clientWidth || 400;

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date) as [Date, Date])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .range([height, 0]);

    const area = d3.area<DataPoint>()
      .x(d => x(d.date))
      .y0(height)
      .y1(d => y(d.value))
      .curve(d3.curveMonotoneX);

    const line = d3.line<DataPoint>()
      .x(d => x(d.date))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    // Area fill
    svg.append('path')
      .datum(data)
      .attr('fill', color)
      .attr('fill-opacity', 0.1)
      .attr('d', area);

    // Line
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 2)
      .attr('d', line);
  }, [data, color, height]);

  return (
    <div className="chart-section" ref={containerRef}>
      {(title || subtitle) && (
        <div className="chart-header">
          {title && <span className="chart-title">{title}</span>}
          {subtitle && <span className="chart-subtitle">{subtitle}</span>}
        </div>
      )}
      <div className="chart-area">
        <svg ref={svgRef} width="100%" height={height} preserveAspectRatio="none" />
      </div>
      <XAxisLabels data={data} />
    </div>
  );
}
```

## Dependencies

- `021-FEATURE-design-tokens.md`
- D3.js dependency (already installed)

---

**Next Steps**: Core visualization component
