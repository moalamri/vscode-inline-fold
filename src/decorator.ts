import { DecorationOptions, DecorationRangeBehavior, Position, Range, TextEditor, TextEditorDecorationType, WorkspaceConfiguration } from "vscode";
import { window } from "vscode";
import { configs } from "./enum";
import { IDecorator, VisibleRange } from "./global";

export class Decorator implements IDecorator {
  Configs: WorkspaceConfiguration;
  UnfoldedDecoration: TextEditorDecorationType;
  MaskDecoration: TextEditorDecorationType;
  CurrentEditor: TextEditor;
  SupportedLanguages: string[] = [];
  VisibleRange: VisibleRange;
  Range: Range;

  activeEditor(textEditor: TextEditor) {
    if (textEditor) {
      this.CurrentEditor = textEditor;
    }
  }

  init() {
    this.Range = this.CurrentEditor.visibleRanges[0];
    if (this.CurrentEditor && !this.Range) {
      this.VisibleRange = {
        StartLine: this.Range.start.line,
        EndLine: this.Range.end.line
      };
      this.updateDecorations()
    }
  }

  updateConfigs(extConfs: WorkspaceConfiguration) {
    this.Configs = extConfs;
    this.SupportedLanguages = extConfs.get(configs.supportedLanguages) || [];
    this.UnfoldedDecoration = window.createTextEditorDecorationType({
      rangeBehavior: DecorationRangeBehavior.ClosedClosed,
      opacity: extConfs.get(configs.unfoldedOpacity),
    });
    this.MaskDecoration = window.createTextEditorDecorationType({
      before: {
        contentText: extConfs.get(configs.maskChar),
        color: extConfs.get(configs.maskColor),
      },
      after: {
        contentText: extConfs.get(configs.after),
      },
      letterSpacing: "-1ch",
      textDecoration: "none; display: none;"
    });
  }

  updateDecorations() {
    if (!this.VisibleRange || !this.SupportedLanguages || !this.SupportedLanguages.includes(this.CurrentEditor.document.languageId)) {
      return;
    }
    const regEx: RegExp = RegExp(this.Configs.get(configs.regex), this.Configs.get(configs.regexFlags));
    const text: string = this.CurrentEditor.document.getText();
    const regexGroup: number = this.Configs.get(configs.regexGroup) as number | 1;
    const decorators: DecorationOptions[] = [];
    let match;
    while (match = regEx.exec(text)) {
      const matched = match[regexGroup];
      const startIndex = match[0].indexOf(matched);
      const startPosition = this.startPositionLine(match.index, startIndex);
      const endPostion = this.endPositionLine(match.index, startIndex, matched.length);
      const range = new Range(startPosition, endPostion);

      //TODO: Apply decoration to lines visible in the editor

      const decoration = {
        range,
        hoverMessage: `Full Text **${matched}**`,
      };
      decorators.push(decoration);
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
