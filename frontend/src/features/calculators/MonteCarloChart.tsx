import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './MonteCarloChart.css';

/**
 * MonteCarloChart Component
 *
 * D3.js visualization showing Monte Carlo scenario paths.
 * Displays sample scenario paths with percentile bands overlay.
 *
 * Features:
 * - Shows up to 20 sample scenario paths (gray lines)
 * - Displays percentile bands (10th, 25th, 50th, 75th, 90th)
 * - Interactive hover showing values
 * - Responsive to container width
 *
 * Based on Nordic Minimal design system.
 */

interface MonteCarloChartProps {
  scenarios: number[][];
  percentiles: {
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  };
  years: number;
  height?: number;
}

function MonteCarloChart({ scenarios, percentiles, years, height = 320 }: MonteCarloChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || scenarios.length === 0) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Get container width
    const containerWidth = containerRef.current.clientWidth;
    const margin = { top: 40, right: 20, bottom: 50, left: 80 };
    const width = containerWidth - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr('width', containerWidth)
      .attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Prepare data for percentile lines
    const maxLength = Math.max(...scenarios.map((s) => s.length));
    const yearIndices = Array.from({ length: maxLength }, (_, i) => i);

    // Calculate percentile bands at each year
    const percentileBands = yearIndices.map((yearIndex) => {
      const valuesAtYear = scenarios
        .filter((s) => s.length > yearIndex)
        .map((s) => s[yearIndex])
        .sort((a, b) => a - b);

      if (valuesAtYear.length === 0) return null;

      return {
        year: yearIndex,
        p10: d3.quantile(valuesAtYear, 0.1) || 0,
        p25: d3.quantile(valuesAtYear, 0.25) || 0,
        p50: d3.quantile(valuesAtYear, 0.5) || 0,
        p75: d3.quantile(valuesAtYear, 0.75) || 0,
        p90: d3.quantile(valuesAtYear, 0.9) || 0,
      };
    }).filter((d) => d !== null) as Array<{
      year: number;
      p10: number;
      p25: number;
      p50: number;
      p75: number;
      p90: number;
    }>;

    // Scales
    const xScale = d3.scaleLinear().domain([0, years]).range([0, width]);

    const allValues = scenarios.flat();
    const yMax = d3.max(allValues) || 0;
    const yScale = d3.scaleLinear().domain([0, yMax * 1.1]).range([chartHeight, 0]).nice();

    // Axes
    const xAxis = d3.axisBottom(xScale).ticks(Math.min(years, 10)).tickFormat((d) => `År ${d}`);
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(6)
      .tickFormat((d) => {
        const millions = Number(d) / 1000000;
        return millions >= 1 ? `${millions.toFixed(1)}M kr` : `${(Number(d) / 1000).toFixed(0)}k kr`;
      });

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(xAxis)
      .selectAll('text')
      .style('font-family', 'DM Sans, sans-serif')
      .style('font-size', '12px')
      .style('fill', 'var(--text-secondary)');

    g.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .selectAll('text')
      .style('font-family', 'JetBrains Mono, monospace')
      .style('font-size', '12px')
      .style('fill', 'var(--text-secondary)');

    // Style axis lines
    g.selectAll('.x-axis path, .y-axis path').style('stroke', 'var(--border)');
    g.selectAll('.x-axis line, .y-axis line').style('stroke', 'var(--border)');

    // Line generator
    const line = d3
      .line<number>()
      .x((_, i) => xScale(i))
      .y((d) => yScale(d))
      .curve(d3.curveMonotoneX);

    // Draw percentile area (25th to 75th)
    const area25to75 = d3
      .area<typeof percentileBands[0]>()
      .x((d) => xScale(d.year))
      .y0((d) => yScale(d.p25))
      .y1((d) => yScale(d.p75))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(percentileBands)
      .attr('class', 'percentile-band-core')
      .attr('d', area25to75)
      .style('fill', 'var(--muted-sage)')
      .style('opacity', 0.2);

    // Draw percentile area (10th to 90th)
    const area10to90 = d3
      .area<typeof percentileBands[0]>()
      .x((d) => xScale(d.year))
      .y0((d) => yScale(d.p10))
      .y1((d) => yScale(d.p90))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(percentileBands)
      .attr('class', 'percentile-band-outer')
      .attr('d', area10to90)
      .style('fill', 'var(--pale-blue)')
      .style('opacity', 0.15);

    // Draw sample scenario paths (first 20 scenarios)
    const sampleScenarios = scenarios.slice(0, 20);
    sampleScenarios.forEach((scenario) => {
      g.append('path')
        .datum(scenario)
        .attr('class', 'scenario-path')
        .attr('d', line)
        .style('fill', 'none')
        .style('stroke', 'var(--charcoal)')
        .style('stroke-width', 0.5)
        .style('opacity', 0.15);
    });

    // Draw median line (50th percentile)
    const medianLine = d3
      .line<typeof percentileBands[0]>()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.p50))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(percentileBands)
      .attr('class', 'median-line')
      .attr('d', medianLine)
      .style('fill', 'none')
      .style('stroke', 'var(--muted-sage)')
      .style('stroke-width', 2)
      .style('opacity', 0.8);

    // Title
    svg
      .append('text')
      .attr('x', margin.left)
      .attr('y', 20)
      .style('font-family', 'Cormorant Garamond, serif')
      .style('font-size', '18px')
      .style('fill', 'var(--charcoal)')
      .style('font-weight', '300')
      .text('Simuleringsscenarioer');

    // Legend
    const legend = svg
      .append('g')
      .attr('transform', `translate(${containerWidth - margin.right - 200}, 20)`);

    const legendItems = [
      { label: '10-90 persentil', color: 'var(--pale-blue)', opacity: 0.3 },
      { label: '25-75 persentil', color: 'var(--muted-sage)', opacity: 0.4 },
      { label: 'Median', color: 'var(--muted-sage)', opacity: 1, isLine: true },
    ];

    legendItems.forEach((item, i) => {
      const legendRow = legend.append('g').attr('transform', `translate(0, ${i * 20})`);

      if (item.isLine) {
        legendRow
          .append('line')
          .attr('x1', 0)
          .attr('x2', 16)
          .attr('y1', 6)
          .attr('y2', 6)
          .style('stroke', item.color)
          .style('stroke-width', 2)
          .style('opacity', item.opacity);
      } else {
        legendRow
          .append('rect')
          .attr('width', 16)
          .attr('height', 12)
          .style('fill', item.color)
          .style('opacity', item.opacity);
      }

      legendRow
        .append('text')
        .attr('x', 24)
        .attr('y', 10)
        .style('font-family', 'DM Sans, sans-serif')
        .style('font-size', '12px')
        .style('fill', 'var(--text-secondary)')
        .text(item.label);
    });
  }, [scenarios, percentiles, years, height]);

  return (
    <div ref={containerRef} className="monte-carlo-chart">
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default MonteCarloChart;
