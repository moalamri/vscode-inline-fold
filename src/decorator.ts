import { DecorationOptions, Position, Range, TextEditor, WorkspaceConfiguration } from "vscode";
import { Settings } from "./settings";
import { DecoratorTypeOptions } from "./decoration";
import { EnuSettings as EnumSettings } from "./enums";

export class Decorator {
  TextDecorationOptions = new DecoratorTypeOptions();
  CurrentEditor: TextEditor;
  SupportedLanguages: string[] = [];
  Active: boolean = true;
  Offset: number = 30;
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
    Settings.Update(extConfs);
    this.SupportedLanguages = Settings.Get<string[]>(EnumSettings.supportedLanguages);
    this.TextDecorationOptions.ClearCache();
  }

  updateDecorations() {
    if (!this.SupportedLanguages || !this.SupportedLanguages.includes(this.CurrentEditor.document.languageId)) {
      return;
    }

    const langId: string = this.CurrentEditor.document.languageId;
    const regEx: RegExp = RegExp(Settings.Get<RegExp>(EnumSettings.regex), Settings.Get<string>(EnumSettings.regexFlags));
    const text: string = this.CurrentEditor.document.getText();
    const regexGroup: number = Settings.Get<number>(EnumSettings.regexGroup) as number | 1;
    const matchDecorationType = this.TextDecorationOptions.MaskDecorationTypeCache(langId);
    const unfoldDecorationType = this.TextDecorationOptions.UnfoldDecorationTypeCache(langId);
    const plainDecorationType = this.TextDecorationOptions.PlainDecorationTypeCache(langId);
    const unfoldDecorationOptions: DecorationOptions[] = [];
    const matchDecorationOptions: DecorationOptions[] = [];
    let match;
    while (match = regEx.exec(text)) {
      
      const matched = match[regexGroup];
      const skip = match[0].indexOf(matched.replace(match[regexGroup])) + 1;
      const foldIndex = match[0].substring(skip).indexOf(matched) + skip;
      const startPosition = this.startPositionLine(match.index, foldIndex);
      const endPosition = this.endPositionLine(match.index, foldIndex, matched.length);
      const range = new Range(startPosition, endPosition);

      if (!this.Active) {
        this.CurrentEditor.setDecorations(plainDecorationType, []);
        break;
      }

      if (!(this.StartLine <= range.start.line && range.end.line <= this.EndLine)) {
        continue;
      }

      // The only possible way to fix tooltip hover flickering
      if(this.CurrentEditor.selection.contains(range) || this.CurrentEditor.selections.find(s => range.contains(s))) {
        unfoldDecorationOptions.push(this.TextDecorationOptions.UnfoldedDecorationOptions(range, matched));
      } else {
        matchDecorationOptions.push(this.TextDecorationOptions.MatchedDecorationOptions(range, langId));
      }
    }

    this.CurrentEditor.setDecorations(unfoldDecorationType, unfoldDecorationOptions);
    this.CurrentEditor.setDecorations(matchDecorationType, matchDecorationOptions);
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

  constructor () { }
}
