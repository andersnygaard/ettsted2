/**
 * StackedAreaChart Component
 *
 * D3.js-based stacked area chart for visualizing multiple data series.
 * Used for pension development on the Pensjon page.
 *
 * Based on Nordic Minimal design from draft-1-pensjon.html
 */

import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import './StackedAreaChart.css';

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

export function StackedAreaChart({
  data,
  series,
  title,
  height = 200,
  xAxisFormat = (d) => d.getFullYear().toString(),
}: StackedAreaChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height });

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

  // Render chart
  useEffect(() => {
    if (!svgRef.current || !data.length || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 10, right: 10, bottom: 5, left: 10 };
    const width = dimensions.width - margin.left - margin.right;
    const chartHeight = dimensions.height - margin.top - margin.bottom;

    const g = svg
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date) as [Date, Date])
      .range([0, width]);

    // Stack the data
    const keys = series.map((s) => s.key);
    const stack = d3.stack<StackedDataPoint>().keys(keys).order(d3.stackOrderNone);
    const stackedData = stack(data);

    // Find max y value
    const yMax = d3.max(stackedData, (layer) => d3.max(layer, (d) => d[1])) || 0;

    const yScale = d3.scaleLinear().domain([0, yMax]).range([chartHeight, 0]);

    // Create area generator
    const area = d3
      .area<d3.SeriesPoint<StackedDataPoint>>()
      .x((d) => xScale(d.data.date))
      .y0((d) => yScale(d[0]))
      .y1((d) => yScale(d[1]))
      .curve(d3.curveMonotoneX);

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
        .attr('d', area(layerData))
        .attr('fill', colorMap.get(layerData.key) || '#ccc');

      if (prefersReducedMotion) {
        areaPath.attr('opacity', 0.15);
      } else {
        // Stagger animations - each layer animates slightly after the previous
        areaPath
          .attr('opacity', 0)
          .attr('transform', `translate(0, ${chartHeight}) scale(1, 0)`)
          .transition()
          .duration(800)
          .delay(200 + index * 100)
          .ease(d3.easeCubicOut)
          .attr('transform', 'translate(0, 0) scale(1, 1)')
          .attr('opacity', 0.15);
      }
    });

    // Create line generator for top edge of each area
    const lineGenerator = d3
      .line<d3.SeriesPoint<StackedDataPoint>>()
      .x((d) => xScale(d.data.date))
      .y((d) => yScale(d[1]))
      .curve(d3.curveMonotoneX);

    // Draw lines on top of areas (in reverse order to match areas)
    reversedData.forEach((layerData, index) => {
      const linePath = g
        .append('path')
        .attr('class', 'stacked-area__line')
        .attr('d', lineGenerator(layerData))
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
  }, [data, series, dimensions]);

  // Generate x-axis labels
  const xAxisLabels = data.length > 0 ? getXAxisLabels(data, xAxisFormat) : [];

  return (
    <section className="stacked-area-chart">
      {title && (
        <div className="stacked-area-chart__header">
          <span className="stacked-area-chart__title">{title}</span>
        </div>
      )}
      <div ref={containerRef} className="stacked-area-chart__container">
        <svg ref={svgRef} className="stacked-area-chart__svg" />
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
    </section>
  );
}

function getXAxisLabels(
  data: StackedDataPoint[],
  format: (date: Date) => string,
  maxLabels = 5
): string[] {
  if (data.length === 0) return [];
  if (data.length <= maxLabels) {
    return data.map((d) => format(d.date));
  }

  const step = Math.floor(data.length / (maxLabels - 1));
  const labels: string[] = [];

  for (let i = 0; i < data.length; i += step) {
    labels.push(format(data[i].date));
  }

  // Always include the last label
  if (labels.length < maxLabels) {
    labels.push(format(data[data.length - 1].date));
  }

  return labels.slice(0, maxLabels);
}
