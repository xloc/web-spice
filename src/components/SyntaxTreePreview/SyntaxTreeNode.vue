<template>
  <template v-if="node.children.length === 0">
    <div v-if="!isNewline(node.text)">
      <span class="bg-orange-400 text-white px-1 mr-2 rounded-sm"> {{ node.type }} </span>
      <span> {{ JSON.stringify(text) }} </span>
    </div>
  </template>

  <details v-else :open="expandLevel > 0">
    <summary>
      <span class="bg-orange-400 text-white px-1 mr-2 rounded-sm"> {{ node.type }} </span>
      <span> {{ JSON.stringify(text) }} </span>
    </summary>
    <div class="pl-2 ml-1 border-l border-black">
      <SyntaxTreeNode :node="child" v-for="child in node.children" :key="child.id" :expand-level="expandLevel - 1" />
    </div>
  </details>

</template>

<script setup lang="ts">
import { truncate } from 'lodash';
import { computed } from 'vue';
import { SyntaxNode } from 'web-tree-sitter';

const props = defineProps<{
  node: SyntaxNode,
  expandLevel: number
}>()

const text = computed(() => truncate(props.node.text, { length: 20, omission: '...' }))
const isNewline = (text: string) => !!text.match(/\n+/)

</script>
