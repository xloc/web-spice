<template>
  <textarea class="bg-gray-200 bg-opacity-20 rounded-lg p-2 font-mono resize-none" v-model="code">
  </textarea>
</template>

<script setup lang="ts">
import { defineEmits, watchEffect } from 'vue';
import { useSavedCode } from '../hook/useSavedCode';

const emits = defineEmits<{
  change: [code: string]
}>();

const code = useSavedCode();

watchEffect(() => {
  emits('change', code.value);
});

</script>
