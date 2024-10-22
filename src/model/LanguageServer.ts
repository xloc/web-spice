import { CancellationToken, editor, IEvent, languages, Position } from 'monaco-editor';
import Parser, { SyntaxNode } from "web-tree-sitter";
import { SemanticTokensBuilder } from "./SemanticTokensBuilder";
import _ from 'lodash';


export class TokenState<T> {
  constructor(public state: T) { }
  clone() { return new TokenState(this.state); }
  equals(other: TokenState<T>) { return other.state === this.state; }
}

export class NgspiceProvider implements languages.DocumentSemanticTokensProvider, languages.HoverProvider {
  constructor(public parser: Parser) { }

  // #region DocumentSemanticTokensProvider
  onDidChange?: IEvent<void> | undefined;
  getLegend(): languages.SemanticTokensLegend {
    return {
      tokenTypes: ['variable', 'number', 'keyword', 'string', 'comment'],
      tokenModifiers: []
    }
  }
  provideDocumentSemanticTokens(
    model: editor.ITextModel,
    _lastResultId: string | null,
    _token: CancellationToken
  ): languages.ProviderResult<languages.SemanticTokens | languages.SemanticTokensEdits> {
    const tree = this.parser.parse(model.getValue());

    const builder = new SemanticTokensBuilder();
    addAllTokens(tree.rootNode, builder);
    return { data: builder.build().data };
  }

  releaseDocumentSemanticTokens(_resultId: string | undefined): void {
    // throw new Error("releaseDocumentSemanticTokens not implemented.");
  }
  // #endregion

  // #region HoverProvider
  provideHover(
    model: editor.ITextModel,
    position: Position,
    _token: CancellationToken,
    _context?: languages.HoverContext<languages.Hover> | undefined
  ): languages.ProviderResult<languages.Hover> {
    const tree = this.parser.parse(model.getValue());
    const node = tree.rootNode.namedDescendantForPosition({ row: position.lineNumber - 1, column: position.column - 1 });
    if (!node || node.type === 'comment') return;

    let parents: SyntaxNode[] = [];
    let curr: SyntaxNode | null = node;
    while (true) {
      parents.push(curr);
      if (curr.type === 'instance_line' || curr.type === 'control_line') break;
      curr = curr.parent;
      if (!curr) break;
    }

    return {
      range: {
        startColumn: node.startPosition.column + 1,
        startLineNumber: node.startPosition.row + 1,
        endColumn: node.endPosition.column + 1,
        endLineNumber: node.endPosition.row + 1
      },
      contents: parents.map(node => {
        let text = node.text.replace(/\s*\n\+\s*/g, ' ')
        text = _.truncate(text, { length: 40, omission: '...', })

        return {
          value: `\`${node.type}\` ${text}`
        }
      })
    }
  }
  // #endregion

}

function addAllTokens(rootNode: Parser.SyntaxNode, builder: SemanticTokensBuilder) {
  const cursor = rootNode.walk();

  const add = (node: SyntaxNode, type: number) => {
    builder.push(node.startPosition.row, node.startPosition.column, node.endIndex - node.startIndex, type, 0);
  }

  do {
    const node = cursor.currentNode;

    if (node.type === 'node') add(node, 0)
    else if (node.type === 'value') add(node, 1);
    else if (node.type.startsWith('.')) add(node, 2);
    else if (node.type === 'title_line') add(node, 3);
    else if (node.type === 'comment') add(node, 4);

  } while (cursor.gotoFirstChild() || cursor.gotoNextSibling() || (cursor.gotoParent() && cursor.gotoNextSibling()));
}

