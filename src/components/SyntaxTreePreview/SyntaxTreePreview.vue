<template>
  <div class="rounded-lg bg-white bg-opacity-30 p-2 text-xs overflow-auto font-mono">
    <div v-if="tree">
      <SyntaxTreeNode :node="tree.rootNode" :expand-level="expandLevel ?? 1" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Tree, SyntaxNode } from 'web-tree-sitter';
import _ from 'lodash';
import SyntaxTreeNode from './SyntaxTreeNode.vue';

const props = defineProps<{
  tree?: Tree
  expandLevel?: number
}>()

const serializeTree = (tree: Tree) => {
  const cursor = tree.walk();
  const serialzeNode = (n: SyntaxNode) => `${JSON.stringify(_.truncate(n.text, { length: 10, omission: '..' }))} ${n.type} (${n.startPosition.row}:${n.startPosition.column})`
  const result: string[] = []

  let indent = 0;
  while (true) {
    const node = cursor.currentNode;
    result.push('  '.repeat(indent) + serialzeNode(node));

    if (cursor.gotoFirstChild()) { indent += 1; }
    else if (cursor.gotoNextSibling()) { }
    else if (cursor.gotoParent() && cursor.gotoNextSibling()) { indent -= 1; }
    else { break; }
  }

  return result.join('\n');
}

const treeText = computed(() => {
  const tree = props.tree;
  if (!tree) return;
  return serializeTree(tree);
})

</script>
