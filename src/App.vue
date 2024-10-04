<template>
  <div class="relative w-screen h-screen">
    <div class="absolute inset-0 flex flex-col justify-center items-center blur-lg">
      <h1 class="text-5xl text-violet-700"> Hello Web Spice! </h1>
      <h2 class="text-gray-400"> an online circuit simulation app </h2>
    </div>

    <div class="absolute inset-0 flex items-stretch justify-items-stretch">
      <!-- panels -->

      <div class="flex-1 flex flex-col m-5 gap-5">
        <CodeEditorView class="flex-1 basis-0 " @change="code = $event" />
        <button @click="startSimuation()"
          class="border border-r-purple-100 rounded-lg p-2 px-5 text-2xl text-purple-900">Run
          Simulation
        </button>
      </div>

      <PlotterView class="flex-1 m-5 basis-0" :time="time" :variable="variable" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CodeEditorView from './components/CodeEditorView.vue';
import PlotterView from './components/PlotterView.vue';

import { Variable } from './types';
import { runSimulation } from './simulation';
import { ResultType, VariableType } from './sim/readOutput';

const code = ref(""); // watchEffect(() => { console.log(code.value); });
const time = ref<Variable>();
const variable = ref<Variable>();



const getVariable = (result: ResultType, predicate: (v: VariableType) => boolean): Variable | undefined => {
  const variables = result.param.variables;
  const index = variables.findIndex(predicate);
  if (index === -1) return;
  return {
    name: variables[index].name,
    type: variables[index].type as any,
    data: result.data[index]
  }
}

const startSimuation = async () => {
  const results = await runSimulation(code.value);
  const result = results.results[0]
  if (!result) return;

  console.log(result);
  time.value = getVariable(result, v => v.type === 'time');
  variable.value = getVariable(result, v => v.type !== 'time');
}

</script>
