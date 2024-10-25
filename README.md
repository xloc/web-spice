# Web Spice

Web Spice runs electric simulation in your web browser.

I want to recreate [EEcircuit/EEsim](https://github.com/eelab-dev/EEcircuit) using vue3. And, given the original project only takes spice code as input, I want to add schematic editor to improve the circuit readability.

## Plan
- [x] port ngspice
- [x] re-implement plotter (working on it)
- [x] port ngspice code editor
- [x] parse the spice code using tree-sitter
- [x] add schematic rendering
- [ ] add interactive schematic editing

## Known Issue
- `tree-sitter.wasm` loading issue.
  - Parser.init() tries to load it from `tree-sitter.wasm` while it is not there
  - current walkaround is to copy `node_modules/web-tree-sitter/tree-sitter.wasm` to `public`
- manual updating of `tree-sitter-ngspice.wasm`
  - again the file is copied to `public`, consider automate build through a vite plugin

## Acknowledgements
- `eecircuit`: https://github.com/eelab-dev/EEcircuit
- `ngspice`: https://ngspice.sourceforge.io/
  - tutorial: https://ngspice.sourceforge.io/ngspice-tutorial.html
  - manual: https://ngspice.sourceforge.io/docs/ngspice-43-manual.pdf
- `tree-sitter`: https://tree-sitter.github.io/tree-sitter/
  - using parser: https://tree-sitter.github.io/tree-sitter/using-parsers
  - creating parser: https://tree-sitter.github.io/tree-sitter/creating-parsers
  - web-tree-sitter: https://github.com/tree-sitter/tree-sitter/tree/master/lib/binding_web
  - parser docs: https://github.com/nvim-treesitter/nvim-treesitter/wiki
- `monaco-editor`: https://microsoft.github.io/monaco-editor/
  - docs: https://microsoft.github.io/monaco-editor/docs.html
- `@guolao/vue-monaco-editor`: https://github.com/imguolao/monaco-vue
  - github.dev: https://github.dev/imguolao/monaco-vue
  
