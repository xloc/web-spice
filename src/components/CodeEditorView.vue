<template>
  <vue-monaco-editor v-model:value="code" theme="vs-dark" :language="LANGUAGE" :options="MONACO_EDITOR_OPTIONS"
    @before-mount="beforeMonacoMount" />
</template>

<script setup lang="ts">
import { defineEmits, watchEffect } from 'vue';
import { useSavedCode } from '../hook/useSavedCode';
import { type MonacoEditor } from '@guolao/vue-monaco-editor';

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

const beforeMonacoMount = async (monaco: MonacoEditor) => {
  monaco.languages.register({ id: LANGUAGE });
  monaco.languages.setMonarchTokensProvider(LANGUAGE, {
    keywords: ['.model', '.tran', '.end'],
    operators: ['='],
    symbols: /[=><!~?:&|+\-*\/\^%]+/,

    tokenizer: {
      root: [
        // identifiers and keywords
        [/[.a-z_$]\w*/, {
          cases: {
            '@keywords': 'keyword',
            '@default': 'identifier'
          }
        }],
        [/[A-Z]\w*/, 'type.identifier'],  // to show class names nicely

        // whitespace
        { include: '@whitespace' },

        // delimiters and operators
        [/[{}()\[\]]/, '@brackets'],
        [/@symbols/, {
          cases: {
            '@operators': 'operator',
            '@default': ''
          }
        }],

        // numbers
        [/\d*(\.\d+)?([eE][\-+]?\d+)?(k|u|m)?/, 'number.float'],
      ],

      whitespace: [
        [/[ \t\r\n]+/, 'white'],
        [/;.*$/, 'comment'],
      ],
    },
  })
}

watchEffect(() => {
  emits('change', code.value);
});

</script>
