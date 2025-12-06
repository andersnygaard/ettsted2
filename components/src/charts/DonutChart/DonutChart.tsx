/**
 * DonutChart Component
 *
 * D3-based donut chart showing a percentage value with animated arc.
 * Used for coverage visualization on the Gjeld page.
 *
 * Based on Nordic Minimal design from draft-1-gjeld.html
 */

import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './DonutChart.css';

export interface DonutChartProps {
  percentage: number;
  label?: string;
  size?: number;
}

export function DonutChart({
  percentage,
  label = 'Dekning',
  size = 180,
}: DonutChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const radius = size / 2;
    const strokeWidth = size * 0.14; // 14% of size for donut thickness
    const innerRadius = radius - strokeWidth;

    const g = svg
      .append('g')
      .attr('transform', `translate(${radius}, ${radius})`);

    // Background arc (full circle)
    const backgroundArc = d3
      .arc<null>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .startAngle(0)
      .endAngle(2 * Math.PI);

    g.append('path')
      .attr('class', 'donut-chart__background')
      .attr('d', backgroundArc(null))
      .attr('fill', 'var(--bone)');

    // Foreground arc (percentage)
    const endAngle = (clampedPercentage / 100) * 2 * Math.PI;
    const foregroundArc = d3
      .arc<null>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .startAngle(0);

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const foregroundPath = g
      .append('path')
      .attr('class', 'donut-chart__foreground')
      .attr('fill', 'var(--muted-sage)');

    if (prefersReducedMotion) {
      foregroundPath.attr('d', foregroundArc.endAngle(endAngle)(null));
    } else {
      // Animate arc from 0 to target percentage
      foregroundPath
        .attr('d', foregroundArc.endAngle(0)(null))
        .transition()
        .duration(1000)
        .delay(200)
        .ease(d3.easeCubicOut)
        .attrTween('d', function () {
          const interpolate = d3.interpolate(0, endAngle);
          return function (t) {
            return foregroundArc.endAngle(interpolate(t))(null) as string;
          };
        });
    }
  }, [percentage, size, clampedPercentage]);

  return (
    <div className="donut-chart" style={{ width: size, height: size }}>
      <svg ref={svgRef} width={size} height={size} className="donut-chart__svg" />
      <div className="donut-chart__inner">
        <div className="donut-chart__value">
          {clampedPercentage.toFixed(1).replace('.', ',')}%
        </div>
        <div className="donut-chart__label">{label}</div>
      </div>
    </div>
  );
}
