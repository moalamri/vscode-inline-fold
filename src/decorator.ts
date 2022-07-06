import { DecorationOptions, Position, Range, Selection, TextDocument, TextEditor, TextEditorDecorationType, window, workspace, WorkspaceConfiguration } from "vscode";
import { Configs } from "./enums";
import { maskDecorationOptions, unfoldedDecorationOptions, noDecoration } from "./decoration";

export class Decorator {
  WorkspaceConfigs: WorkspaceConfiguration;
  UnfoldedDecoration: TextEditorDecorationType;
  MaskDecoration: TextEditorDecorationType;
  NoDecorations: TextEditorDecorationType;
  CurrentEditor: TextEditor;
  SupportedLanguages: string[] = [];
  Offset: number = 15;
  Active: boolean = true;
  StartLine: number = 0;
  EndLine: number = 0;

  /**
   * To set/update the current working text editor.
   * It's neccessary to call this method when the active editor changes
   * because somethimes it return as undefined.
   * @param textEditor TextEditor
   */
  set activeEditor(textEditor: TextEditor) {
    if (!textEditor) {
      return;
    }
    if (this.StartLine === 0 && this.EndLine === 0) return
    this.CurrentEditor = textEditor;
  }

  /**
   * Set the number of the starting line of the targeted text.
   * @param n number
   */
  startLine(n: number) {
    this.StartLine = n - this.Offset <= 0 ? 0 : n - this.Offset;
  }

  /**
   * Set the number of the ending line of the targeted text.
   * @param n number
   */
  endLine(n: number) {
    this.EndLine = n + this.Offset >= this.CurrentEditor?.document.lineCount ? this.CurrentEditor.document?.lineCount : n + this.Offset;
  }

  /**
   * Unlike set activeEditor, this method is a trigger for a guaranteed
   * active editor.
   */
  activeEditorChanged() {
    this.activeEditor = window.activeTextEditor;
  }

  /**
   * Set the active state of the decorator (used for command)
   */
  toggle() {
    this.Active = !this.Active;
    this.updateDecorations();
  }

  /**
   * Do some checking before triggering the decoration update.
   */
  start() {
    if (!this.CurrentEditor && !this.CurrentEditor.visibleRanges) {
      return;
    }
    this.updateDecorations()
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
    let match: string[] | any = [];
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
        hoverMessage: `Full Text **${matched}**`,
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

  constructor (editor?: TextEditor) {
    this.startLine(editor.visibleRanges[0].start.line)
    this.endLine(editor.visibleRanges[0].end.line)
    this.activeEditorChanged();
  }

}