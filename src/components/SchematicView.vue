<template>
  <div class="">
    <ul>
      <li v-for="device in circuit.devices">
        {{ device.id }}
      </li>
    </ul>
    <ul>
      <li v-for="net in circuit.nets">
        {{ net.id }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Circuit } from '../model/Circuit';

const props = defineProps<{
  circuit: Circuit
}>();


</script>
