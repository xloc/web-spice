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
import { defineEmits, ref, shallowRef, watchEffect } from 'vue';
import { useSavedCode } from '../hook/useSavedCode';
import { useState } from '../hook/useState';
import { useTreeSitter } from '../hook/useTreeSitter';
import { Circuit } from '../model/Circuit';
import { NgspiceProvider } from '../model/LanguageServer';
import { monarchNgspiceTokenizer } from '../model/monarchNgspiceTokenizer';
import { editor, Range } from 'monaco-editor';
import { Edit, Tree } from 'web-tree-sitter';
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
const treeRef = shallowRef<Tree>();


watchEffect(() => {
  emits('change', code.value);
});


const beforeMonacoMount = async (monaco_: MonacoEditor) => {
  monaco.value = monaco_;
  monaco_.languages.register({ id: LANGUAGE });
  monaco_.languages.setMonarchTokensProvider(LANGUAGE, monarchNgspiceTokenizer);

  await treesitterReady();
  const parser_value = parser.value!;

  const provider = new NgspiceProvider(parser_value);
}


const monacoMount = async (editor: editor.IStandaloneCodeEditor, _monaco: MonacoEditor) => {
  await treesitterReady();
  const parser_value = parser.value!;
  let tree = parser_value.parse(code.value);
  treeRef.value = tree;

  editor.onDidChangeModelContent((e) => {
    const model = editor.getModel();
    if (!model) throw new Error('Model not found');
    e.changes.forEach((change) => {
      tree.edit(buildEditFromChange(change, model));
    });
    tree = parser_value.parse(model.getLinesContent().join('\n'), tree);
    treeRef.value = tree;
  });
}


const buildEditFromChange = (change: editor.IModelContentChange, model: editor.ITextModel): Edit => {
  const range = Range.lift(change.range);
  const start = model.getOffsetAt(range.getStartPosition());
  const end = model.getOffsetAt(range.getEndPosition());
  return {
    startIndex: start - 1,
    oldEndIndex: end - 1,
    newEndIndex: end - 1,
    startPosition: { row: range.startLineNumber - 1, column: range.startColumn - 1 },
    oldEndPosition: { row: range.endLineNumber - 1, column: range.endColumn - 1 },
    newEndPosition: { row: range.endLineNumber - 1, column: range.endColumn - 1 },
  }
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
