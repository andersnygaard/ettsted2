# Charts Rules

## Stack
D3.js v7 for all visualizations

## Structure
- `/charts/AreaChart/` - Single line/area trends
- `/charts/StackedAreaChart/` - Multiple stacked series
- `/charts/DonutChart/` - Pie/donut breakdown

## Patterns
- SVG-based, responsive via viewBox and ResizeObserver
- D3 rendering in useEffect with cleanup (`svg.selectAll('*').remove()`)
- Memoize scales and generators with useMemo
- React.memo wrapper with custom comparison for expensive charts

```typescript
// Pattern for chart components
const ChartComponent = ({ data, ... }: ChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0 });

  // ResizeObserver for responsive width
  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      setDimensions({ width: entries[0].contentRect.width });
    });
    observer.observe(containerRef.current!);
    return () => observer.disconnect();
  }, []);

  // Memoize D3 calculations
  const { scales, generators } = useMemo(() => {
    // ... D3 scale and generator setup
  }, [data, dimensions]);

  // Render in useEffect
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    // ... D3 rendering
  }, [data, scales, generators]);

  return (
    <div ref={containerRef}>
      <svg ref={svgRef} width="100%" height={height} />
    </div>
  );
};

export const Chart = React.memo(ChartComponent, customCompare);
```

## Data Format
- AreaChart: `{ date: Date, value: number }[]`
- StackedAreaChart: `{ date: Date, [seriesKey]: number }[]` with series config
- DonutChart: `{ label: string, value: number, color?: string }[]`

## Decisions
- Curve interpolation: `d3.curveMonotoneX` for smooth lines
- Area fill opacity: 0.1 (subtle fill under line)
- Animation: draw-in on mount, respect `prefers-reduced-motion`

## Gotchas
- D3 selections in useEffect - never mix with React state for same elements
- Width from ResizeObserver, not clientWidth (more reliable)
- Height is prop-controlled, width is container-responsive
- Colors from design tokens: `var(--muted-sage)`, `var(--negative)`, `var(--pale-blue)`
- X-axis labels generated in React, not D3 (simpler styling)
- Include sr-only data table for accessibility
