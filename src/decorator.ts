import { DecorationOptions, Position, Range, TextEditor, WorkspaceConfiguration } from "vscode";
import { ExtSettings } from "./settings";
import { DecoratorTypeOptions } from "./decoration";
import { Settings } from "./enums";
import { Cache } from "./cache";

export class Decorator {
  TDOs = new DecoratorTypeOptions();
  CurrentEditor: TextEditor;
  ParsedRegexString: string;
  SupportedLanguages: string[] = [];
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
    if (n - this.Offset < 0) {
      this.StartLine = 0;
    } else {
      this.StartLine = n - this.Offset;
    }
  }

  /**
  * Set the number of the ending line of where the decoration should be applied.
  * @param n number
  */
  endLine(n: number) {
    if (n + this.Offset > this.CurrentEditor.document.lineCount) {
      this.EndLine = this.CurrentEditor.document.lineCount;
    } else {
      this.EndLine = n + this.Offset;
    }
  }

  /**
  * Set the active state of the decorator (used for command)
  */
  toggle() {
    Cache.ToggleState();
    this.updateDecorations();
  }

  /**
  * This method gets triggered when the extension settings are changed
  * @param extConfs: Workspace configs
  */
  updateConfigs(extConfs: WorkspaceConfiguration) {
    ExtSettings.Update(extConfs);
    this.SupportedLanguages = ExtSettings.Get<string[]>(Settings.supportedLanguages);
    this.TDOs.ClearCache();
  }

  updateDecorations() {
    if (!this.SupportedLanguages || !this.SupportedLanguages.includes(this.CurrentEditor.document.languageId)) {
      return;
    }

    const text: string = this.CurrentEditor.document.getText();
    const regEx: RegExp = RegExp(ExtSettings.Get<RegExp>(Settings.regex), 
    ExtSettings.Get<string>(Settings.regexFlags));
    const langId: string = this.CurrentEditor.document.languageId;
    const unFoldOnLineSelect = ExtSettings.Get<boolean>(Settings.unfoldOnLineSelect);
    const regexGroup: number = ExtSettings.Get<number>(Settings.regexGroup) as number | 1;
    const matchDecorationType = this.TDOs.MaskDecorationTypeCache(langId);
    const plainDecorationType = this.TDOs.PlainDecorationTypeCache(langId);
    const unfoldDecorationType = this.TDOs.UnfoldDecorationTypeCache(langId);
    const matchDecorationOptions: DecorationOptions[] = [];
    const unfoldDecorationOptions: DecorationOptions[] = [];

    let match;
    while ((match = regEx.exec(text)) !== null) {

      const matched = match[regexGroup];
      const skip = match[0].indexOf(matched.replace(match[regexGroup])) + 1;
      const foldIndex = match[0].substring(skip).indexOf(matched) + skip;
      const startPosition = this.startPositionLine(match.index, foldIndex);
      const endPosition = this.endPositionLine(match.index, foldIndex, matched.length);
      const range = new Range(startPosition, endPosition);

      /* Checking if the toggle command is active or not. without conflicts with default state settings.
         If it is not active, it will remove all decorations. */
      if (!Cache.State) {
        this.CurrentEditor.setDecorations(plainDecorationType, []);
        break;
      }

      /* Checking if the range is within the visible area of the editor plus a specified offset for a head decoration. */
      if (!(this.StartLine <= range.start.line && range.end.line <= this.EndLine)) {
        continue;
      }

      /* Checking if the range is selected by the user. 
         first check is for single selection, second is for multiple cursor selections.
         or if the user has enabled the unfoldOnLineSelect option. */
      if (this.CurrentEditor.selection.contains(range) ||
        this.CurrentEditor.selections.find(s => range.contains(s)) ||
        unFoldOnLineSelect && this.CurrentEditor.selections.find(s => s.start.line === range.start.line)) {
        unfoldDecorationOptions.push({ range });
      } else {
        matchDecorationOptions.push({ range });
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
