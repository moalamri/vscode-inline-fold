import { DecorationOptions, Position, Range, TextEditor, TextEditorDecorationType, window, workspace, WorkspaceConfiguration } from "vscode";
import { EnumConfigs } from "./enums";
import { VisibleRange } from "./types";
import { maskDecorationOptions, unfoldedDecorationOptions } from "./decoration";

export class Decorator {
  Configs: WorkspaceConfiguration;
  UnfoldedDecoration: TextEditorDecorationType;
  MaskDecoration: TextEditorDecorationType;
  CurrentEditor: TextEditor;
  SupportedLanguages: string[] = [];
  VisibleRange: VisibleRange;
  Offset: number = 3;
  Active: boolean = true;

  activeEditor(textEditor: TextEditor) {
    if (textEditor) {
      this.CurrentEditor = textEditor;
    }
  }

  toggle() {
    this.Active = !this.Active;
    console.log(`Decorator is ${this.Active ? 'active' : 'inactive'}`);
    this.updateDecorations();
  }

  start() {
    if (!this.CurrentEditor && !this.CurrentEditor.visibleRanges) {
      return;
    }
    if(this.CurrentEditor.visibleRanges.length > 0) {
      this.VisibleRange = {
        StartLine: this.CurrentEditor.visibleRanges[0].start.line - this.Offset,
        EndLine: this.CurrentEditor.visibleRanges[0].end.line + this.Offset,
      };
      this.updateDecorations()
    }
  }

  updateConfigs(extConfs: WorkspaceConfiguration) {
    this.Configs = extConfs;
    this.SupportedLanguages = extConfs.get(EnumConfigs.supportedLanguages) || [];
    this.UnfoldedDecoration = unfoldedDecorationOptions(extConfs);
    this.MaskDecoration = maskDecorationOptions(extConfs);
  }

  updateDecorations() {
    if (!this.VisibleRange || !this.SupportedLanguages || !this.SupportedLanguages.includes(this.CurrentEditor.document.languageId)) {
      return;
    }
    const regEx: RegExp = RegExp(this.Configs.get(EnumConfigs.regex), this.Configs.get(EnumConfigs.regexFlags));
    const text: string = this.CurrentEditor.document.getText();
    const regexGroup: number = this.Configs.get(EnumConfigs.regexGroup) as number | 1;
    const decorators: DecorationOptions[] = [];
    let match;
    while (match = regEx.exec(text)) {
      const matched = match[regexGroup];
      const startIndex = match[0].indexOf(matched);
      const startPosition = this.startPositionLine(match.index, startIndex);
      const endPostion = this.endPositionLine(match.index, startIndex, matched.length);
      const range = new Range(startPosition, endPostion);

      if(!this.Active) {
        this.CurrentEditor.setDecorations(this.UnfoldedDecoration, []);
        break;
      }

      if(!(this.VisibleRange.StartLine <= range.start.line && range.end.line <= this.VisibleRange.EndLine)) {
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
        .filter((i) => i.start.line !== this.CurrentEditor.selection.start.line)
    );
  }

  startPositionLine(matchIndex: number, startIndex: number): Position {
    return this.CurrentEditor.document.positionAt(
      matchIndex + startIndex
    );
  }

  endPositionLine(matchIndex: number, startIndex: number, length: number): Position {
    return this.CurrentEditor.document.positionAt(
      matchIndex + startIndex + length
    );
  }

  constructor (editor: TextEditor) {
    this.CurrentEditor = editor;
  }
}
