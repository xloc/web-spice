<template>
  <vue-monaco-editor v-model:value="code" theme="vs-dark" :language="LANGUAGE" :options="MONACO_EDITOR_OPTIONS"
    @before-mount="beforeMonacoMount" />
</template>

<script setup lang="ts">
import { type MonacoEditor } from '@guolao/vue-monaco-editor';
import { defineEmits, ref, watchEffect } from 'vue';
import { useSavedCode } from '../hook/useSavedCode';
import { useState } from '../hook/useState';
import { useTreeSitter } from '../hook/useTreeSitter';
import { Circuit } from '../model/Circuit';
import { NgspiceSemanticTokenProvider } from '../model/LanguageServer';


const emits = defineEmits<{
  change: [code: string]
}>();
const LANGUAGE = 'ngspice'


const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
  'semanticHighlighting.enabled': true // default is depend-on-theme
}
const code = useSavedCode();
const monaco = ref<MonacoEditor>();


watchEffect(() => {
  emits('change', code.value);
});


const beforeMonacoMount = async (monaco_: MonacoEditor) => {
  monaco.value = monaco_;
  monaco_.languages.register({ id: LANGUAGE });

  await treesitterReady();
  const parser_value = parser.value!;
  monaco_.languages.registerDocumentSemanticTokensProvider(LANGUAGE, new NgspiceSemanticTokenProvider(parser_value))
}

const treesitterReady = () => {
  return new Promise<void>((resolve) => {
    const checkParser = () => {
      if (parser.value) resolve();
      else setTimeout(checkParser, 100);
    }
    checkParser();
  });
}

const parser = useTreeSitter();
const state = useState();
watchEffect(() => {
  if (!parser.value || !monaco.value) return;
  if (!code.value.trim()) return;

  const tree = parser.value.parse(code.value);
  const circuit = Circuit.fromTree(tree);
  state.circuit.value = circuit;
})

</script>
