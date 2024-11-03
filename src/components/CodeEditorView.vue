<template>
  <div class="relative">
    <vue-monaco-editor v-model:value="code" theme="vs-dark" :language="LANGUAGE" :options="MONACO_EDITOR_OPTIONS"
      @before-mount="beforeMonacoMount" @mount="monacoMount" />
    <SyntaxTreePreview class="absolute right-2 bottom-2 w-[400px] h-[300px] z-50" :tree="treeRef" />
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { type MonacoEditor } from '@guolao/vue-monaco-editor';
import { editor } from 'monaco-editor';
import { defineEmits, ref, watchEffect } from 'vue';
import { useSavedCode } from '../hook/useSavedCode';
import { useState } from '../hook/useState';
import { useTreeSitter } from '../hook/useTreeSitter';
import { useCircuit } from '../model/Circuit';
import { monarchNgspiceTokenizer } from '../model/monarchNgspiceTokenizer';
import SyntaxTreePreview from './SyntaxTreePreview/SyntaxTreePreview.vue';


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
const parser = useTreeSitter();
const state = useState();
const { devices, model, editor: codeEditor, tree: treeRef } = useCircuit({ code, parser });

watchEffect(() => { emits('change', code.value); });

watchEffect(() => { state.devices.value = devices.value; })


const beforeMonacoMount = async (monaco_: MonacoEditor) => {
  monaco.value = monaco_;
  monaco_.languages.register({ id: LANGUAGE });
  monaco_.languages.setMonarchTokensProvider(LANGUAGE, monarchNgspiceTokenizer);
}

const monacoMount = async (editor_: editor.IStandaloneCodeEditor, _monaco: MonacoEditor) => {
  codeEditor.value = editor_;

  model.value = (() => {
    const model = editor_.getModel();
    if (!model) throw new Error('Model not found');
    return model
  })();

}

watchEffect(() => {
  if (devices.value.length)
    console.table(devices.value);
})

</script>
