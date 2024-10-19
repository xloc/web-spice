<template>
  <vue-monaco-editor v-model:value="code" theme="vs-dark" :language="LANGUAGE" :options="MONACO_EDITOR_OPTIONS"
    @before-mount="beforeMonacoMount" />
</template>

<script setup lang="ts">
import { defineEmits, ref, watchEffect } from 'vue';
import { useSavedCode } from '../hook/useSavedCode';
import { type MonacoEditor } from '@guolao/vue-monaco-editor';
import { useTreeSitter } from '../hook/useTreeSitter';


const emits = defineEmits<{
  change: [code: string]
}>();
const LANGUAGE = 'ngspice'


const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
}
const code = useSavedCode();
const monaco = ref<MonacoEditor>();
const parser = useTreeSitter();

watchEffect(() => {
  emits('change', code.value);
});


const beforeMonacoMount = async (monaco_: MonacoEditor) => {
  monaco.value = monaco_;
  monaco_.languages.register({ id: LANGUAGE });
}

watchEffect(() => {
  if (!parser.value || !monaco.value) return;
  if (!code.value.trim()) return;

  const tree = parser.value.parse(code.value);
  tree.rootNode.descendantsOfType('instance_line').forEach((node) => {
    console.log(node.descendantsOfType('node').map(n => n.text), node.text);
  });
})

</script>
