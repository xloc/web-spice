import { languages } from 'monaco-editor';


export const monarchNgspiceTokenizer: languages.IMonarchLanguage = {
  keywords: [
    'sin',
  ],

  tokenizer: {
    root: [
      [/.+/, { token: 'string', next: '@rest' }]  // first line as title line
    ],

    rest: [
      // identifiers and keywords
      [/^[a-zA-z][a-zA-Z0-9]*/, 'type.identifier'],
      [/^\.\w+/, 'keyword'],
      [/[a-zA-z][a-zA-Z0-9]*/, { cases: { '@keywords': 'keyword', '@default': 'identifier' } }],

      // whitespace
      { include: '@whitespace' },

      // numbers
      [/\d+(\.\d+)?([eE](-)?\d+)?(\w+)?/, 'number'],
      // 12 . 34     e   -  15    uOhm
    ],

    whitespace: [
      [/[ \t\r\n]+/, 'white'],
      [/[;$].*$/, 'comment'],
      [/^\*.*$/, 'comment'],
    ],
  },
};