<template>
  <div class="flex flex-col border border-black rounded-lg min-h-10 min-w-5 p-1">
    <Plot v-if="xVar && allYs" :x-var="xVar" :y-vars="selectedYs"></Plot>

    <div class="flex flex-wrap">
      <button class="bg-gray-600 bg-opacity-10 px-2 p-1 m-1 rounded-lg" v-for="yVar in allYs"
        :class="{ 'ring-2 ring-violet-500': yNames.has(yVar.name) }" :style="{ color: yVar.color }" :key="yVar.name"
        @click="toggle(yVar.name)">
        {{ yVar.name }}
      </button>
      <button v-if="allYs.length > 0" @click="yNames.clear(); allYs.forEach(y => y.name)"></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import * as d3 from 'd3';

import { ResultType } from '../sim/readOutput';
import { Variable } from '../types';
import Plot from './Plot.vue';

import { useSavedStringSet } from '../hook/useSavedStringSet';


const props = defineProps<{
  result?: ResultType
}>();

const xVar = ref<Variable>();
const yNames = useSavedStringSet('selected-y-vars');
const selectedYs = computed(() => allYs.value.filter(v => yNames.value.has(v.name)));
const allYs = ref<Variable[]>([]);

const toggle = (name: string) => {
  if (yNames.value.has(name)) { yNames.value.delete(name); }
  else { yNames.value.add(name); }
}

watch(() => props.result, (result) => {
  if (!result) return;

  const xIndex = result.param.variables.findIndex(v => v.name === 'time');
  xVar.value = {
    name: result.param.variables[xIndex].name,
    type: result.param.variables[xIndex].type as any,
    data: result.data[xIndex] as number[]
  }

  allYs.value = result.param.variables
    .filter(v => v.name !== 'time')
    .map((v, i) => ({
      name: v.name,
      type: v.type as any,
      data: result.data[i] as number[],
      color: d3.schemeCategory10[i % 10]
    }))
})

</script>
