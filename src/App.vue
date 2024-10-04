<template>
  <div class="flex flex-col justify-center items-center  h-screen">
    <h1 class="text-5xl text-violet-700"> Hello Web Spice! </h1>
    <h2 class="text-gray-400"> an online circuit simulation app </h2>

    <button @click="runSimulation()" class="border rounded-lg p-2 px-5 m-5 text-2xl">Run Simulation</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { runSimulation } from './simulation';


</script>
