<template>
  <div class="border min-h-10 min-w-5 p-5">
    Plotter
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Variable } from '../types';

const props = defineProps<{
  time?: Variable;
  variable?: Variable;
}>();
</script>
