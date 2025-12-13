import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import './AreaChart.css';
import { formatCurrency, formatDate } from '@finans/components';
import { ChartTooltip } from '../ChartTooltip';

const isDevelopment = import.meta.env.DEV;

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
 * Memoized to prevent unnecessary re-renders when parent updates.
 * D3 scales and generators are cached via useMemo.
 *
 * Based on Nordic Minimal design system.
 */
function AreaChartComponent({
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
  const [dimensions, setDimensions] = useState({ width: 0 });

  // Tooltip state
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    date: new Date(),
    value: 0,
  });

  // Handle resize with ResizeObserver for reliable width detection
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        setDimensions({ width });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Memoize D3 scales and generators - only recalculate when data or dimensions change
  const { scales, generators } = useMemo(() => {
    if (!data.length || dimensions.width === 0) {
      return { scales: null, generators: null };
    }

    const { width } = dimensions;
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date) as [Date, Date])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, (d3.max(data, (d) => d.value) || 0) * 1.1])
      .range([innerHeight, 0])
      .nice(); // Round to nice values

    // Create generators
    const area = d3
      .area<DataPoint>()
      .x((d) => xScale(d.date))
      .y0(innerHeight)
      .y1((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    const line = d3
      .line<DataPoint>()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    return {
      scales: { x: xScale, y: yScale, innerWidth, innerHeight },
      generators: { area, line }
    };
  }, [data, dimensions, height]);

  // Draw chart
  useEffect(() => {
    if (!data.length) {
      if (isDevelopment) console.log('[AreaChart] No data to render');
      return;
    }
    if (!svgRef.current || dimensions.width === 0) {
      if (isDevelopment) console.log('[AreaChart] Waiting for container dimensions:', dimensions.width);
      return;
    }
    if (!scales || !generators) {
      return;
    }

    // Calculate min/max for accessibility labels
    const values = data.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const minDate = formatDate(data[0].date);
    const maxDate = formatDate(data[data.length - 1].date);
    const trend = maxValue >= minValue ? 'increasing' : 'decreasing';

    if (isDevelopment) {
      console.log('[AreaChart] Rendering chart with data:', {
        dataPoints: data.length,
        width: dimensions.width,
        dateRange: [data[0]?.date, data[data.length - 1]?.date],
        valueRange: [minValue, maxValue]
      });
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Add SVG title and description for accessibility
    svg
      .append('title')
      .text(title || 'Chart');

    svg
      .append('desc')
      .text(
        `Line chart showing ${data.length} data points from ${minDate} to ${maxDate}. ` +
        `Values range from ${formatCurrency(minValue)} to ${formatCurrency(maxValue)}. ` +
        `Overall trend is ${trend}.`
      );

    const margin = { top: 10, right: 10, bottom: 10, left: 10 };

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Area fill
    const areaPath = g
      .append('path')
      .datum(data)
      .attr('class', 'area-chart__fill')
      .attr('fill', color)
      .attr('d', generators.area);

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
      .attr('d', generators.line);

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

    // Add hover interaction elements
    const hoverLineGroup = g.append('g').attr('class', 'area-chart__hover-elements').style('opacity', 0);

    // Vertical hover line
    const hoverLine = hoverLineGroup
      .append('line')
      .attr('class', 'area-chart__hover-line')
      .attr('y1', 0)
      .attr('y2', scales.innerHeight)
      .attr('stroke', 'var(--charcoal)')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.3);

    // Hover dot
    const hoverDot = hoverLineGroup
      .append('circle')
      .attr('class', 'area-chart__hover-dot')
      .attr('r', 4)
      .attr('fill', color)
      .attr('stroke', 'var(--warm-white)')
      .attr('stroke-width', 2);

    // Bisector for finding nearest data point
    const bisect = d3.bisector((d: DataPoint) => d.date).left;

    // Invisible overlay for mouse tracking
    const overlay = g
      .append('rect')
      .attr('class', 'area-chart__overlay')
      .attr('width', scales.innerWidth)
      .attr('height', scales.innerHeight)
      .attr('fill', 'transparent')
      .attr('cursor', 'crosshair');

    // Mouse event handlers
    const handleMouseMove = (event: MouseEvent) => {
      const [mx] = d3.pointer(event);
      const x0 = scales.x.invert(mx);
      const i = bisect(data, x0, 1);
      const d0 = data[i - 1];
      const d1 = data[i];

      if (!d0 && !d1) return;

      // Find closest data point
      const d = d1 && d0 ? (x0.getTime() - d0.date.getTime() > d1.date.getTime() - x0.getTime() ? d1 : d0) : d0 || d1;

      const xPos = scales.x(d.date);
      const yPos = scales.y(d.value);

      // Update hover elements
      hoverLineGroup.style('opacity', 1);
      hoverLine.attr('x1', xPos).attr('x2', xPos);
      hoverDot.attr('cx', xPos).attr('cy', yPos);

      // Update tooltip state
      setTooltip({
        visible: true,
        x: xPos + margin.left,
        y: yPos + margin.top,
        date: d.date,
        value: d.value,
      });
    };

    const handleMouseLeave = () => {
      hoverLineGroup.style('opacity', 0);
      setTooltip((prev) => ({ ...prev, visible: false }));
    };

    // Attach event listeners
    overlay.on('mousemove', handleMouseMove);
    overlay.on('mouseleave', handleMouseLeave);
    overlay.on('touchstart', handleMouseMove);
    overlay.on('touchmove', handleMouseMove);
    overlay.on('touchend', handleMouseLeave);
  }, [data, color, height, dimensions, scales, generators]);

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

  // Build aria-label for the chart
  const getAriaLabel = () => {
    if (!data.length) return 'Empty chart';
    const values = data.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const minDate = formatDate(data[0].date);
    const maxDate = formatDate(data[data.length - 1].date);
    return `${title || 'Chart'}: Line chart showing values from ${minDate} to ${maxDate}, ranging from ${formatCurrency(minValue)} to ${formatCurrency(maxValue)}`;
  };

  return (
    <section
      className="area-chart"
      ref={containerRef}
      role="img"
      aria-label={getAriaLabel()}
    >
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
        <ChartTooltip
          visible={tooltip.visible}
          x={tooltip.x}
          y={tooltip.y}
          date={tooltip.date}
          values={[{ label: title || '', value: tooltip.value, color }]}
          containerRef={containerRef}
        />
      </div>
      {getXAxisLabels()}

      {/* Screen reader accessible data table */}
      <table className="sr-only" aria-label={`${title || 'Chart'} data table`}>
        <caption className="sr-only">{title} - Detailed data values</caption>
        <thead>
          <tr>
            <th>Date</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, idx) => (
            <tr key={idx}>
              <td>{formatDate(d.date)}</td>
              <td>{formatCurrency(d.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

/**
 * Memoized AreaChart with custom comparison
 * Only re-renders when data, color, or height change
 */
export const AreaChart = React.memo(AreaChartComponent, (prev, next) => {
  return (
    prev.data === next.data &&
    prev.color === next.color &&
    prev.height === next.height &&
    prev.title === next.title &&
    prev.subtitle === next.subtitle &&
    prev.showXAxis === next.showXAxis &&
    prev.xAxisFormat === next.xAxisFormat
  );
});
