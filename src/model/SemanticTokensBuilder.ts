export class SemanticTokensBuilder {
  private _previousLine: number;
  private _previousChar: number;
  private _tokens: number[];

  constructor() {
    this._previousLine = 0;
    this._previousChar = 0;
    this._tokens = [];
  }

  /**
   * Add a token to the builder.
   * @param line The line number of the token (0-based).
   * @param startChar The start character of the token (0-based).
   * @param length The length of the token.
   * @param tokenType The type of the token (index of the type in the legend).
   * @param tokenModifiers The modifiers of the token (bitwise flags based on legend modifiers).
   */
  public push(line: number, startChar: number, length: number, tokenType: number, tokenModifiers: number = 0): void {
    if (line < this._previousLine || (line === this._previousLine && startChar < this._previousChar)) {
      throw new Error('Tokens must be added in order: increasing line numbers, and increasing character positions.');
    }

    // Relative line number (delta from previous line)
    const deltaLine = line - this._previousLine;
    // Relative start character (delta from previous token on the same line)
    const deltaChar = deltaLine === 0 ? startChar - this._previousChar : startChar;

    this._tokens.push(deltaLine, deltaChar, length, tokenType, tokenModifiers);

    // Update previous position
    this._previousLine = line;
    this._previousChar = startChar;
  }

  /**
   * Builds and returns the final semantic tokens data.
   * @returns An object containing the resultId and the semantic tokens array in the expected format.
   */
  public build(): { data: Uint32Array } {
    return {
      data: new Uint32Array(this._tokens)
    };
  }
}