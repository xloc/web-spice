<template>
  <div ref="container" class="relative">

    <svg ref="plot-svg"></svg>

    <button class="absolute right-0 bottom-0 p-2
     bg-slate-500 hover:bg-slate-400 text-white rounded-lg">
      <RectangleGroupIcon class="size-6 " />
    </button>

  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef, watchEffect } from 'vue';
import { Circuit, Device } from '../model/Circuit';
import * as d3 from 'd3';
import { useElementSize } from '@vueuse/core';
import { RectangleGroupIcon } from '@heroicons/vue/24/solid'

const props = defineProps<{
  circuit: Circuit
}>();
const svgElement = useTemplateRef('plot-svg')

const container = useTemplateRef('container')
const { width, height } = useElementSize(container)



watchEffect(() => {
  const { circuit } = props;
  if (!circuit) return;

  const svg = d3.select(svgElement.value)
    .attr('width', width.value)
    .attr('height', height.value);

  const nodes = circuit.devices;


  const drag = d3.drag<SVGCircleElement, Device>()
    .on("start", function () { d3.select(this).attr("stroke", "black"); })
    .on("drag", function (event, d) {
      d3.select(this).raise()
        .attr("cx", d.x = event.x)
        .attr("cy", d.y = event.y);
      simulation.alpha(0.2).restart();
      update()
    })
    .on("end", function () { d3.select(this).attr("stroke", null); });


  const d3node = svg.selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", 20)
    .attr("fill", d => Circuit.colorMap[d.type.toUpperCase()] ?? 'black')
    .call(drag as any)

  const update = () => {
    svg.selectAll('text')
      .data(nodes)
      .join('text')
      .style('user-select', 'none')
      .attr('x', (d: any) => d.x)
      .attr('y', (d: any) => d.y)
      .attr('dx', 30)
      .attr('dy', 7)
      .text((d: any) => d.id)

    const links = svg.selectAll("line")
      .data(circuit.getLinks())
      .join("line")
      .attr("x1", d => nodes[d[0]].x)
      .attr("y1", d => nodes[d[0]].y)
      .attr("x2", d => nodes[d[1]].x)
      .attr("y2", d => nodes[d[1]].y)
      .attr("stroke", "black")
      .attr("stroke-width", 2);
  }



  const simulation = d3.forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-5))
    .force("center", d3.forceCenter(width.value / 2, height.value / 2))
    .force("link", d3
      .forceLink(circuit.getLinks().map(l => ({ source: l[0], target: l[1] })))
      .id((d, i) => { return i }).distance(200).strength(0.1)
    )

  simulation.on('tick', () => {
    d3node
      .attr('cx', (d: any) => d.x)
      .attr('cy', (d: any) => d.y);
    update();
  });

})


</script>
