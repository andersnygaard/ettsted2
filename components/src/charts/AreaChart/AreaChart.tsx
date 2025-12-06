import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import './AreaChart.css';

export interface DataPoint {
  date: Date;
  value: number;
}

export interface AreaChartProps {
  data: DataPoint[];
  color?: string;
  title?: string;
  subtitle?: string;
  height?: number;
  showXAxis?: boolean;
  xAxisFormat?: (date: Date) => string;
}

/**
 * AreaChart Component
 *
 * D3.js-based area chart for displaying value trends over time.
 * Used on Sparing, Gjeld, and Pensjon pages.
 *
 * Based on Nordic Minimal design system.
 */
export function AreaChart({
  data,
  color = 'var(--muted-sage)',
  title,
  subtitle,
  height = 200,
  showXAxis = true,
  xAxisFormat,
}: AreaChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 400 });

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({ width: containerRef.current.clientWidth });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Draw chart
  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width } = dimensions;
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date) as [Date, Date])
      .range([0, innerWidth]);

    const y = d3
      .scaleLinear()
      .domain([0, (d3.max(data, (d) => d.value) || 0) * 1.1])
      .range([innerHeight, 0]);

    // Area generator
    const area = d3
      .area<DataPoint>()
      .x((d) => x(d.date))
      .y0(innerHeight)
      .y1((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    // Line generator
    const line = d3
      .line<DataPoint>()
      .x((d) => x(d.date))
      .y((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Area fill
    const areaPath = g
      .append('path')
      .datum(data)
      .attr('class', 'area-chart__fill')
      .attr('fill', color)
      .attr('d', area);

    if (prefersReducedMotion) {
      areaPath.attr('fill-opacity', 0.1);
    } else {
      areaPath
        .attr('fill-opacity', 0)
        .transition()
        .duration(800)
        .delay(200)
        .ease(d3.easeCubicOut)
        .attr('fill-opacity', 0.1);
    }

    // Line stroke
    const linePath = g
      .append('path')
      .datum(data)
      .attr('class', 'area-chart__line')
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 2)
      .attr('stroke-linecap', 'round')
      .attr('d', line);

    if (!prefersReducedMotion) {
      const totalLength = (linePath.node() as SVGPathElement).getTotalLength();
      linePath
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(1000)
        .delay(300)
        .ease(d3.easeCubicOut)
        .attr('stroke-dashoffset', 0);
    }
  }, [data, color, height, dimensions]);

  // Generate x-axis labels
  const getXAxisLabels = () => {
    if (!data.length || !showXAxis) return null;

    const labelCount = 5;
    const step = Math.max(1, Math.floor(data.length / (labelCount - 1)));
    const labels: Date[] = [];

    for (let i = 0; i < data.length; i += step) {
      labels.push(data[i].date);
    }
    // Always include the last point
    if (labels[labels.length - 1] !== data[data.length - 1].date) {
      labels.push(data[data.length - 1].date);
    }

    const formatDate = xAxisFormat || ((date: Date) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'];
      return `${months[date.getMonth()]} ${date.getFullYear()}`;
    });

    return (
      <div className="area-chart__x-axis">
        {labels.map((date, i) => (
          <span key={i}>{formatDate(date)}</span>
        ))}
      </div>
    );
  };

  return (
    <section className="area-chart" ref={containerRef}>
      {(title || subtitle) && (
        <div className="area-chart__header">
          {title && <span className="area-chart__title">{title}</span>}
          {subtitle && <span className="area-chart__subtitle">{subtitle}</span>}
        </div>
      )}
      <div className="area-chart__container">
        <svg
          ref={svgRef}
          width="100%"
          height={height}
          preserveAspectRatio="none"
          className="area-chart__svg"
        />
      </div>
      {getXAxisLabels()}
    </section>
  );
}
