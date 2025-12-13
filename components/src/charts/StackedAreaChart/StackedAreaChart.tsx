/**
 * StackedAreaChart Component
 *
 * D3.js-based stacked area chart for visualizing multiple data series.
 * Used for pension development on the Pensjon page.
 *
 * Based on Nordic Minimal design from draft-1-pensjon.html
 */

import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import './StackedAreaChart.css';
import { formatCurrency, formatDate } from '@finans/components';
import { ChartTooltip } from '../ChartTooltip';
import type { TooltipValue } from '../ChartTooltip';

const isDevelopment = import.meta.env.DEV;

export interface Series {
  key: string;
  color: string;
  label: string;
}

export interface StackedDataPoint {
  date: Date;
  [key: string]: number | Date;
}

export interface StackedAreaChartProps {
  data: StackedDataPoint[];
  series: Series[];
  title?: string;
  height?: number;
  xAxisFormat?: (date: Date) => string;
}

function StackedAreaChartComponent({
  data,
  series,
  title,
  height = 200,
  xAxisFormat = (d) => d.getFullYear().toString(),
}: StackedAreaChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height });

  // Tooltip state
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    date: new Date(),
    values: [] as TooltipValue[],
    total: 0,
  });

  // Handle resize
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [height]);

  // Memoize D3 scales and generators - only recalculate when data, series, or dimensions change
  const { scales, generators, stackedData, yMax } = useMemo(() => {
    if (!data.length || dimensions.width === 0) {
      return { scales: null, generators: null, stackedData: null, yMax: 0 };
    }

    const keys = series.map((s) => s.key);
    const stack = d3.stack<StackedDataPoint>().keys(keys).order(d3.stackOrderNone);
    const stacked = stack(data);
    const yMaxValue = d3.max(stacked, (layer) => d3.max(layer, (d) => d[1])) || 0;

    const margin = { top: 10, right: 10, bottom: 5, left: 10 };
    const width = dimensions.width - margin.left - margin.right;
    const chartHeight = dimensions.height - margin.top - margin.bottom;

    // Create scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date) as [Date, Date])
      .range([0, width]);

    const yScale = d3.scaleLinear().domain([0, yMaxValue]).range([chartHeight, 0]).nice();

    // Create area generator
    const area = d3
      .area<d3.SeriesPoint<StackedDataPoint>>()
      .x((d) => xScale(d.data.date))
      .y0((d) => yScale(d[0]))
      .y1((d) => yScale(d[1]))
      .curve(d3.curveMonotoneX);

    // Create line generator for top edge of each area
    const lineGenerator = d3
      .line<d3.SeriesPoint<StackedDataPoint>>()
      .x((d) => xScale(d.data.date))
      .y((d) => yScale(d[1]))
      .curve(d3.curveMonotoneX);

    return {
      scales: { x: xScale, y: yScale, width, chartHeight },
      generators: { area, lineGenerator },
      stackedData: stacked,
      yMax: yMaxValue
    };
  }, [data, series, dimensions]);

  // Render chart
  useEffect(() => {
    if (!data.length) {
      if (isDevelopment) console.log('[StackedAreaChart] No data to render');
      return;
    }
    if (!svgRef.current || dimensions.width === 0) {
      if (isDevelopment) console.log('[StackedAreaChart] Waiting for container dimensions:', dimensions.width);
      return;
    }
    if (!scales || !generators || !stackedData) {
      return;
    }

    // Calculate statistics for accessibility labels
    const minDate = formatDate(data[0].date);
    const maxDate = formatDate(data[data.length - 1].date);

    if (isDevelopment) {
      console.log('[StackedAreaChart] Rendering chart with data:', {
        dataPoints: data.length,
        series: series.map(s => s.key),
        width: dimensions.width,
        dateRange: [data[0]?.date, data[data.length - 1]?.date]
      });
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Add SVG title and description for accessibility
    svg
      .append('title')
      .text(title || 'Stacked Area Chart');

    svg
      .append('desc')
      .text(
        `Stacked area chart showing ${series.length} data series (${series.map(s => s.label).join(', ')}) ` +
        `with ${data.length} data points from ${minDate} to ${maxDate}. ` +
        `Total values range up to ${formatCurrency(yMax)}.`
      );

    const margin = { top: 10, right: 10, bottom: 5, left: 10 };

    const g = svg
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create color mapping
    const colorMap = new Map(series.map((s) => [s.key, s.color]));

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Draw areas (in reverse order so first series is on top visually)
    const reversedData = stackedData.slice().reverse();

    reversedData.forEach((layerData, index) => {
      const areaPath = g
        .append('path')
        .attr('class', 'stacked-area__fill')
        .attr('d', generators.area(layerData))
        .attr('fill', colorMap.get(layerData.key) || '#ccc');

      if (prefersReducedMotion) {
        areaPath.attr('opacity', 0.35);
      } else {
        // Stagger animations - each layer animates slightly after the previous
        areaPath
          .attr('opacity', 0)
          .attr('transform', `translate(0, ${scales.chartHeight}) scale(1, 0)`)
          .transition()
          .duration(800)
          .delay(200 + index * 100)
          .ease(d3.easeCubicOut)
          .attr('transform', 'translate(0, 0) scale(1, 1)')
          .attr('opacity', 0.35);
      }
    });

    // Draw lines on top of areas (in reverse order to match areas)
    reversedData.forEach((layerData, index) => {
      const linePath = g
        .append('path')
        .attr('class', 'stacked-area__line')
        .attr('d', generators.lineGenerator(layerData))
        .attr('fill', 'none')
        .attr('stroke', colorMap.get(layerData.key) || '#ccc')
        .attr('stroke-width', 2)
        .attr('stroke-linecap', 'round');

      if (!prefersReducedMotion) {
        const totalLength = (linePath.node() as SVGPathElement).getTotalLength();
        linePath
          .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
          .attr('stroke-dashoffset', totalLength)
          .transition()
          .duration(1000)
          .delay(300 + index * 100)
          .ease(d3.easeCubicOut)
          .attr('stroke-dashoffset', 0);
      }
    });

    // Add hover interaction elements
    const hoverLineGroup = g.append('g').attr('class', 'stacked-area-chart__hover-elements').style('opacity', 0);

    // Vertical hover line
    const hoverLine = hoverLineGroup
      .append('line')
      .attr('class', 'stacked-area-chart__hover-line')
      .attr('y1', 0)
      .attr('y2', scales.chartHeight)
      .attr('stroke', 'var(--charcoal)')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.3);

    // Hover dots for each series
    const hoverDots = hoverLineGroup
      .selectAll('.stacked-area-chart__hover-dot')
      .data(series)
      .enter()
      .append('circle')
      .attr('class', 'stacked-area-chart__hover-dot')
      .attr('r', 4)
      .attr('fill', (d) => colorMap.get(d.key) || '#ccc')
      .attr('stroke', 'var(--warm-white)')
      .attr('stroke-width', 2);

    // Bisector for finding nearest data point
    const bisect = d3.bisector((d: StackedDataPoint) => d.date).left;

    // Invisible overlay for mouse tracking
    const overlay = g
      .append('rect')
      .attr('class', 'stacked-area-chart__overlay')
      .attr('width', scales.width)
      .attr('height', scales.chartHeight)
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

      // Calculate total and values for tooltip
      let total = 0;
      const tooltipValues: TooltipValue[] = [];

      // Get values for each series at this data point
      series.forEach((s) => {
        const value = (d[s.key as keyof StackedDataPoint] as number) || 0;
        total += value;
        tooltipValues.push({
          label: s.label,
          value,
          color: s.color,
        });
      });

      // Update hover elements
      hoverLineGroup.style('opacity', 1);
      hoverLine.attr('x1', xPos).attr('x2', xPos);

      // Position dots at their respective y-positions in the stack
      let cumulativeY = 0;
      hoverDots.attr('cx', xPos).attr('cy', (s) => {
        const value = (d[s.key as keyof StackedDataPoint] as number) || 0;
        cumulativeY += value;
        return scales.y(cumulativeY);
      });

      // Update tooltip state
      setTooltip({
        visible: true,
        x: xPos + margin.left,
        y: margin.top + scales.chartHeight / 2,
        date: d.date,
        values: tooltipValues,
        total,
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
  }, [data, series, dimensions, scales, generators, stackedData, yMax]);

  // Generate x-axis labels
  const xAxisLabels = data.length > 0 ? getXAxisLabels(data, xAxisFormat) : [];

  // Build aria-label for the chart
  const getAriaLabel = () => {
    if (!data.length) return 'Empty stacked area chart';
    const minDate = formatDate(data[0].date);
    const maxDate = formatDate(data[data.length - 1].date);
    const seriesNames = series.map(s => s.label).join(', ');
    return `${title || 'Stacked Area Chart'}: Chart with ${series.length} data series (${seriesNames}) from ${minDate} to ${maxDate}`;
  };

  return (
    <section
      className="stacked-area-chart"
      role="img"
      aria-label={getAriaLabel()}
    >
      {title && (
        <div className="stacked-area-chart__header">
          <span className="stacked-area-chart__title">{title}</span>
        </div>
      )}
      <div ref={containerRef} className="stacked-area-chart__container">
        <svg ref={svgRef} className="stacked-area-chart__svg" />
        <ChartTooltip
          visible={tooltip.visible}
          x={tooltip.x}
          y={tooltip.y}
          date={tooltip.date}
          values={tooltip.values}
          total={tooltip.total}
          containerRef={containerRef}
        />
      </div>
      <div className="stacked-area-chart__x-axis">
        {xAxisLabels.map((label, i) => (
          <span key={i}>{label}</span>
        ))}
      </div>
      <div className="stacked-area-chart__legend">
        {series.map((s) => (
          <span key={s.key} className={`stacked-area-chart__legend-item`}>
            <span
              className="stacked-area-chart__legend-color"
              style={{ backgroundColor: s.color }}
            />
            {s.label}
          </span>
        ))}
      </div>

      {/* Screen reader accessible data table */}
      <table className="sr-only" aria-label={`${title || 'Stacked Area Chart'} data table`}>
        <caption className="sr-only">{title} - Detailed data values by series</caption>
        <thead>
          <tr>
            <th>Date</th>
            {series.map((s) => (
              <th key={s.key}>{s.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((d, idx) => (
            <tr key={idx}>
              <td>{formatDate(d.date)}</td>
              {series.map((s) => (
                <td key={s.key}>
                  {formatCurrency((d[s.key as keyof StackedDataPoint] as number) || 0)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

/**
 * Memoized StackedAreaChart with custom comparison
 * Only re-renders when data, series, or title change
 */
export const StackedAreaChart = React.memo(StackedAreaChartComponent, (prev, next) => {
  return (
    prev.data === next.data &&
    prev.series === next.series &&
    prev.title === next.title &&
    prev.height === next.height &&
    prev.xAxisFormat === next.xAxisFormat
  );
});

function getXAxisLabels(
  data: StackedDataPoint[],
  format: (date: Date) => string,
  maxLabels = 5
): string[] {
  if (data.length === 0) return [];

  // Get all unique labels
  const allLabels = data.map((d) => format(d.date));
  const uniqueLabels = [...new Set(allLabels)];

  if (uniqueLabels.length <= maxLabels) {
    return uniqueLabels;
  }

  // Sample evenly from unique labels
  const result: string[] = [uniqueLabels[0]]; // Always include first
  const step = (uniqueLabels.length - 1) / (maxLabels - 1);

  for (let i = 1; i < maxLabels - 1; i++) {
    const index = Math.round(i * step);
    result.push(uniqueLabels[index]);
  }

  result.push(uniqueLabels[uniqueLabels.length - 1]); // Always include last

  return [...new Set(result)]; // Final deduplication
}
