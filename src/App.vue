<template>
  <div class="relative w-screen h-screen">
    <div class="absolute inset-0 flex flex-col justify-center items-center blur-lg">
      <h1 class="text-5xl text-violet-700"> Hello Web Spice! </h1>
      <h2 class="text-gray-400"> an online circuit simulation app </h2>
    </div>

    <div class="absolute inset-0 flex items-stretch justify-items-stretch">
      <!-- panels -->

      <div class="flex-1 flex flex-col gap-5">
        <CodeEditorView class="flex-1 basis-0 " @change="code = $event" />
      </div>


      <div class="flex-1 flex flex-col gap-2 m-2 relative">
        <button @click="startSimuation()"
          class="absolute right-0 top-0 rounded-lg p-2 bg-violet-500 hover:bg-violet-400 text-white shadow-lg">
          <PlayIcon class="size-6 " />
        </button>
        <!-- <PlotterView class="flex-1 basis-0" :result="result" /> -->
        <SchematicView class="flex-1 basis-0" :circuit="circuit" v-if="circuit" />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue';
import CodeEditorView from './components/CodeEditorView.vue';
import PlotterView from './components/PlotterView.vue';
import SchematicView from './components/SchematicView.vue';
import { PlayIcon } from '@heroicons/vue/24/solid'

import { runSimulation } from './simulation';
import { ResultType } from './sim/readOutput';
import { useState } from './hook/useState';

const code = ref(""); // watchEffect(() => { console.log(code.value); });
const result = ref<ResultType>();

const startSimuation = async () => {
  const results = await runSimulation(code.value);
  result.value = results.results[0]
}

onMounted(() => {
  startSimuation();
})

const { circuit } = useState();

</script>
