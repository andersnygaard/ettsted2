import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { YearData } from './compound';
import { formatNOK } from './format';

interface BreakdownChartProps {
  data: YearData[];
}

export default function BreakdownChart({ data }: BreakdownChartProps) {
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
      .scaleBand()
      .domain(data.map((d) => d.year.toString()))
      .range([0, width])
      .padding(0.1);

    const maxBalance = d3.max(data, (d) => d.balance) || 0;
    const yScale = d3
      .scaleLinear()
      .domain([0, maxBalance])
      .range([height, 0]);

    // Color scale
    const color = d3.scaleOrdinal<string, string>()
      .domain(['principal', 'interest'])
      .range(['#1976D2', '#2ecc71']);

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

    // Create stacked data
    const stackedData = data.map((d) => ({
      year: d.year.toString(),
      principal: d.principal,
      interest: d.interest,
    }));

    const stack = d3
      .stack<any>()
      .keys(['principal', 'interest']);

    const stackedValues = stack(stackedData);

    // Add bars for each category
    svg
      .selectAll('g.category')
      .data(stackedValues)
      .enter()
      .append('g')
      .attr('class', 'category')
      .attr('fill', (d) => color(d.key))
      .selectAll('rect')
      .data((d) => d)
      .enter()
      .append('rect')
      .attr('x', (d) => xScale(d.data.year) || 0)
      .attr('y', (d) => yScale(d[1]))
      .attr('height', (d) => yScale(d[0]) - yScale(d[1]))
      .attr('width', xScale.bandwidth())
      .on('mouseover', function (event, d) {
        const year = parseInt(d.data.year);
        const yearData = data.find((y) => y.year === year);
        if (!yearData) return;

        tooltip.style('opacity', 1);
        tooltip.html(
          `År ${year}<br/>Spart: ${formatNOK(yearData.principal)}<br/>Rente: ${formatNOK(yearData.interest)}`
        );
        tooltip
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
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
      .call(d3.axisBottom(xScale))
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
      .text('Beløp (kr)');

    // Legend
    const legend = svg
      .append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 12)
      .attr('text-anchor', 'end')
      .selectAll('g')
      .data(['principal', 'interest'])
      .enter()
      .append('g')
      .attr('transform', (_d, i) => `translate(0,${i * 20})`);

    legend
      .append('rect')
      .attr('x', width - 19)
      .attr('width', 19)
      .attr('height', 19)
      .attr('fill', (d) => color(d));

    legend
      .append('text')
      .attr('x', width - 24)
      .attr('y', 9.5)
      .attr('dy', '0.32em')
      .text((d) => (d === 'principal' ? 'Spart' : 'Renteinntekt'));

    return () => {
      tooltip.remove();
    };
  }, [data]);

  return (
    <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
      <h3 style={{ marginTop: 0 }}>Fordeling: Spart vs Renteinntekt</h3>
      <svg ref={svgRef}></svg>
    </div>
  );
}
