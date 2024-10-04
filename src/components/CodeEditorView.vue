<template>
  <textarea class="bg-gray-200 bg-opacity-20 rounded-lg p-2 font-mono resize-none" v-model="code">
  </textarea>
</template>

<script setup lang="ts">
import { ref, defineEmits, watchEffect } from 'vue';

const INIT_CODE = `
Basic RLC circuit 
.include modelcard.CMOS90

r vdd 2 100.0
l vdd 2 1
c vdd 2 0.01
m1 2 1 0 0 N90 W=100.0u L=0.09u
vdd vdd 0 1.8

vin 1 0 0 pulse (0 1.8 0 0.1 0.1 15 30)
.tran 0.1 50

.end
`.trim();


const emits = defineEmits<{
  change: [code: string]
}>();

const code = ref(INIT_CODE);
watchEffect(() => {
  emits('change', code.value);
});

</script>
