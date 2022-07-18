import { DecorationOptions, Position, Range, TextEditor, TextEditorDecorationType, WorkspaceConfiguration } from "vscode";
import { maskDecorationOptions, noDecoration, unfoldedDecorationOptions } from "./decoration";
import { Configs } from "./enums";

export class Decorator {
  WorkspaceConfigs: WorkspaceConfiguration;
  UnfoldedDecoration: TextEditorDecorationType;
  MaskDecoration: TextEditorDecorationType;
  NoDecorations: TextEditorDecorationType;
  CurrentEditor: TextEditor;
  SupportedLanguages: string[] = [];
  Offset: number = 30;
  Active: boolean = true;
  StartLine: number = 0;
  EndLine: number = 0;

  /**
  * To set/update the current working text editor.
  * It's neccessary to call this method when the active editor changes
  * because somethimes it return as undefined.
  * @param textEditor TextEditor
  */
  activeEditor(textEditor: TextEditor) {
    if (!textEditor) return;
    this.CurrentEditor = textEditor;
    this.startLine(textEditor.visibleRanges[0].start.line);
    this.endLine(textEditor.visibleRanges[0].end.line);
    this.updateDecorations();
  }

  /**
  * Set the number of the starting line of where the decoration should be applied.
  * @param n number
  */
  startLine(n: number) {
    this.StartLine = n - this.Offset <= 0 ? 0 : n - this.Offset;
  }

  /**
  * Set the number of the ending line of where the decoration should be applied.
  * @param n number
  */
  endLine(n: number) {
    this.EndLine = n + this.Offset >= this.CurrentEditor.document.lineCount ? this.CurrentEditor.document.lineCount : n + this.Offset;
  }

  /**
  * Set the active state of the decorator (used for command)
  */
  toggle() {
    this.Active = !this.Active;
    this.updateDecorations();
  }

  /**
  * This method gets triggered when the extension settings are changed
  * @param extConfs: Workspace configs
  */
  updateConfigs(extConfs: WorkspaceConfiguration) {
    this.WorkspaceConfigs = extConfs;
    this.SupportedLanguages = extConfs.get(Configs.supportedLanguages) || [];
    this.UnfoldedDecoration = unfoldedDecorationOptions(extConfs);
    this.MaskDecoration = maskDecorationOptions(extConfs);
    this.NoDecorations = noDecoration();
  }

  updateDecorations() {
    if (!this.SupportedLanguages || !this.SupportedLanguages.includes(this.CurrentEditor.document.languageId)) {
      return;
    }

    const regexGroup: number = parseInt(this.WorkspaceConfigs.get(Configs.regexGroup)) || 1;
    const parsedRegexStr = this.parseRegexString(this.WorkspaceConfigs.get(Configs.regex), regexGroup);
    const regEx: RegExp = RegExp(parsedRegexStr, this.WorkspaceConfigs.get(Configs.regexFlags));
    const text: string = this.CurrentEditor.document.getText();
    const decorators: DecorationOptions[] = [];

    let match;
    while (match = regEx.exec(text)) {
      if (match.length <= regexGroup + 1) {
        console.error("The regex was wrong");
        break;
      }
      const foldIndex = match[1].length;
      const foldEndIndex = match[1 + regexGroup].length;

      // match.index is the start of the entire match
      const startFoldPosition = this.startPositionLine([match.index, foldIndex])
      const endFoldPosition = this.endPositionLine([match.index, foldIndex + foldEndIndex])
      /* Creating a new range object from the calculated positions. */
      const range = new Range(startFoldPosition, endFoldPosition);

      /* Checking if the toggle command is active or not. If it is not active, it will remove all decorations. */
      if (!this.Active) {
        this.CurrentEditor.setDecorations(this.NoDecorations, []);
        break;
      }

      /* Checking if the range is within the visible area of the editor plus a specified offset for a head decoration. */
      if (!(this.StartLine <= range.start.line && range.end.line <= this.EndLine)) {
        continue;
      }

      /* Pushing the range and the hoverMessage to the decorators array to apply later. */
      decorators.push({
        range,
        hoverMessage: `Full text **${match[2]}**`
      });
    }

    this.CurrentEditor.setDecorations(this.UnfoldedDecoration, decorators);
    this.CurrentEditor.setDecorations(
      this.MaskDecoration,
      decorators
        .map(({ range }) => range)
        .filter((r) => !r.contains(this.CurrentEditor.selection) && !this.CurrentEditor.selection.contains(r))
        .filter((r) => !this.CurrentEditor.selections.find((s) => r.contains(s)))
    )
  }

  /**
   * Parse the regex in such a way that the to-be-folded group is always group number 2.
   */
  parseRegexString(reg: string, regexGroup: number): string {

    // find the start of the to-be-folded group
    const foldStart = reg.split('(', regexGroup).join('(').length;

    // place a ( at the front and a ) before the to-be-folded group
    reg = '(' + reg.substring(0, foldStart) + ')' + reg.substring(foldStart);
    return reg;
  }

  /**
   * It sums an array of numbers and returns a Position object that 
   * represents the end position of the matched column.
   * 
   * @param totalOffset number[]
   * @return The position of the cursor in the document.
   */
  startPositionLine(totalOffset: any): Position {
    return this.CurrentEditor.document.positionAt(
      totalOffset.reduce((partialSum: number, a: number) => partialSum + a, 0)
    );
  }

  /**
   * It takes an array of numbers, and returns a Position object that 
   * represents the end position of the matched column.
   * 
   * @param totalOffset number[]
   * @return The position of the end of the line.
   */
  endPositionLine(totalOffset: any): Position {
    return this.CurrentEditor.document.positionAt(
      totalOffset.reduce((thisSum: number, next: number) => thisSum + next, 0)
    );
  }

  constructor () { }
}