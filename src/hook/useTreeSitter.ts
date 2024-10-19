import { onMounted, ref } from "vue";

import Parser from 'web-tree-sitter';


export const useTreeSitter = () => {
  const treesitter = ref<Parser>();

  onMounted(async () => {
    await Parser.init();

    const parser = new Parser;
    const NgspiceLanguage = await Parser.Language.load('tree-sitter-ngspice.wasm');
    parser.setLanguage(NgspiceLanguage);

    treesitter.value = parser;
  })

  return treesitter;
}