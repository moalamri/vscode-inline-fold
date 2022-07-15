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
    const regEx: RegExp = RegExp(this.WorkspaceConfigs.get(Configs.regex), this.WorkspaceConfigs.get(Configs.regexFlags));
    const text: string = this.CurrentEditor.document.getText();
    const regexGroup: number = this.WorkspaceConfigs.get(Configs.regexGroup) as number | 1;
    const decorators: DecorationOptions[] = [];
    let match;
    while (match = regEx.exec(text)) {
      const matched = match[regexGroup];
      const startIndex = match[0].indexOf(matched);
      const startPosition = this.startPositionLine(match.index, startIndex);
      const endPostion = this.endPositionLine(match.index, startIndex, matched.length);
      const range = new Range(startPosition, endPostion);

      if (!this.Active) {
        this.CurrentEditor.setDecorations(this.NoDecorations, []);
        break;
      }

      if (!(this.StartLine <= range.start.line && range.end.line <= this.EndLine)) {
        continue;
      }

      decorators.push({
        range,
        hoverMessage: `Full text **${matched}**`
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
  * 
  * @param matchIndex number
  * @param startIndex number
  * @returns position
  */
  startPositionLine(matchIndex: number, startIndex: number): Position {
    return this.CurrentEditor.document.positionAt(
      matchIndex + startIndex
    );
  }

  /**
  * 
  * @param matchIndex number
  * @param startIndex number
  * @returns position
  */
  endPositionLine(matchIndex: number, startIndex: number, length: number): Position {
    return this.CurrentEditor.document.positionAt(
      matchIndex + startIndex + length
    );
  }

  constructor () { }
}