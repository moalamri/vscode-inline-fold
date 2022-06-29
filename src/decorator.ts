import { DecorationOptions, DecorationRangeBehavior, Range, TextEditor, TextEditorDecorationType,  WorkspaceConfiguration } from "vscode";
import { window } from "vscode";
import { configs } from "./enum";

export class Decorator {
  configs!: WorkspaceConfiguration;
  unfoldedDecoration!: TextEditorDecorationType;
  maskDecoration!: TextEditorDecorationType;
  editor: TextEditor;
  supportedLanguages: string[] = [];

  set activeEditor(textEditor: TextEditor) {
    if(textEditor) {
      this.editor = textEditor;
    }
  }
  
  updateConfigs(conf: WorkspaceConfiguration) {
    this.configs = conf;
    this.supportedLanguages = conf.get(configs.supportedLanguages) || [];
    this.unfoldedDecoration = window.createTextEditorDecorationType({
      rangeBehavior: DecorationRangeBehavior.ClosedClosed,
      opacity: conf.get(configs.unfoldedOpacity),
    });
    this.maskDecoration = window.createTextEditorDecorationType({
      before: {
        contentText: conf.get(configs.maskChar),
        color: conf.get(configs.maskColor),
      },
      after: {
        contentText: conf.get(configs.after),
      },
      letterSpacing: "-1ch",
      textDecoration: "none; display: none;"
    });
  }

  updateDecorations() {
    if (!this.editor || !this.supportedLanguages || !this.supportedLanguages.includes(this.editor.document.languageId)) {
      return;
    }

    let regEx: RegExp = RegExp(this.configs.get(configs.regex) as string, this.configs.get(configs.regexFlags));
    let text: string = this.editor.document.getText();
    let regexGroup: number = this.configs.get(configs.regexGroup) as number | 1;
    let decorators: DecorationOptions[] = [];
    let match;
    while (match = regEx.exec(text)) {
      let matched = match[regexGroup];
      let startIndex = match[0].indexOf(matched);
      const startPosition = this.editor.document.positionAt(
        match.index + startIndex
      );
      const endPostion = this.editor.document.positionAt(
        match.index + startIndex + matched.length
      );
      const decoration = {
        range: new Range(startPosition, endPostion),
        hoverMessage: "Full Text **" + matched + "**",
      };
      decorators.push(decoration);
    }

    this.editor.setDecorations(this.unfoldedDecoration, decorators);
    this.editor.setDecorations(
      this.maskDecoration,
      decorators
        .map(({ range }) => range)
        .filter((i) => i.start.line !== this.editor!.selection.start.line)
    );
  }

  constructor(editor: TextEditor) {
    this.editor = editor;
  }
}