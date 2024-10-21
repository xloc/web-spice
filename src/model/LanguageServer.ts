import { CancellationToken, editor, IEvent, languages } from 'monaco-editor';
import Parser, { SyntaxNode } from "web-tree-sitter";
import { SemanticTokensBuilder } from "./SemanticTokensBuilder";


export class TokenState<T> {
  constructor(public state: T) { }
  clone() { return new TokenState(this.state); }
  equals(other: TokenState<T>) { return other.state === this.state; }
}

export class NgspiceSemanticTokenProvider implements languages.DocumentSemanticTokensProvider {
  constructor(public parser: Parser) { }

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
    throw new Error("releaseDocumentSemanticTokens not implemented.");
  }
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

