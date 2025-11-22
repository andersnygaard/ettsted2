import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { YearData } from './compound';
import { formatNOK } from './format';

interface GrowthChartProps {
  data: YearData[];
}

export default function GrowthChart({ data }: GrowthChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const margin = { top: 20, right: 30, bottom: 30, left: 70 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3
      .scaleLinear()
      .domain([0, data[data.length - 1].year])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.balance) || 0])
      .range([height, 0]);

    // Line generator
    const line = d3
      .line<YearData>()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.balance));

    // Add grid
    svg
      .append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-width)
          .tickFormat(null as any)
      );

    // Add line path
    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#2196F3')
      .attr('stroke-width', 3)
      .attr('d', line);

    // Add circles for data points
    svg
      .selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', (d) => xScale(d.year))
      .attr('cy', (d) => yScale(d.balance))
      .attr('r', 4)
      .attr('fill', '#2196F3')
      .on('mouseover', function (event, d) {
        d3.select(this).attr('r', 6);
        tooltip.style('opacity', 1);
        tooltip.html(`År ${d.year}<br/>${formatNOK(d.balance)}`);
        tooltip
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('r', 4);
        tooltip.style('opacity', 0);
      });

    // Tooltip
    const tooltip = d3
      .select('body')
      .append('div')
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px 12px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('opacity', 0)
      .style('pointer-events', 'none');

    // X-axis
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format('d')))
      .append('text')
      .attr('x', width / 2)
      .attr('y', 40)
      .attr('fill', 'black')
      .style('text-anchor', 'middle')
      .text('År');

    // Y-axis
    svg
      .append('g')
      .call(d3.axisLeft(yScale).tickFormat((d) => formatNOK(d as number)))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -50)
      .attr('fill', 'black')
      .style('text-anchor', 'middle')
      .text('Balanse (kr)');

    return () => {
      tooltip.remove();
    };
  }, [data]);

  return (
    <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
      <h3 style={{ marginTop: 0 }}>Vekst over tid</h3>
      <svg ref={svgRef}></svg>
    </div>
  );
}
