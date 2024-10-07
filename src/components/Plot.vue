<template>
  <div>
    <svg ref="plot-svg"></svg>
  </div>
</template>

<script setup lang="ts">
import * as d3 from 'd3';
import { useTemplateRef, watchEffect } from 'vue';
import { Variable } from '../types';

const props = defineProps<{
  xVar: Variable
  yVars: Variable[]
}>()
const svgElement = useTemplateRef('plot-svg')

// Set up dimensions
const margin = { top: 20, right: 30, bottom: 30, left: 40 };
const width = 500 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom;

watchEffect(() => {
  const { xVar, yVars } = props;
  if (!xVar || !yVars) return;

  // Clear previous plots
  d3.select(svgElement.value).selectAll('*').remove();
  // Create an SVG element
  const svg = d3.select(svgElement.value)
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Set up x and y scales
  const xAxis = d3.scaleLinear()
    .domain(d3.extent(xVar.data) as [number, number])
    .range([0, width]);
  const yAxis = d3.scaleLinear()
    .domain(d3.extent(yVars.flatMap(y => y.data)) as [number, number])
    .range([height, 0]);

  props.yVars.forEach((y) => {
    const data = d3.zip(xVar.data, y.data);
    const line = d3.line<number[]>()
      .x(d => xAxis(d[0]))
      .y(d => yAxis(d[1]));
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', y.color ?? 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line);
  })

  // Add x/y-axis
  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(xAxis).ticks(10, '~s'))
  svg.append('g')
    .call(d3.axisLeft(yAxis).ticks(10, '~s'));
})
</script>
