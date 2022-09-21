import { DecorationOptions, Position, Range, TextEditor, WorkspaceConfiguration } from "vscode";
import { Settings } from "./settings";
import { DecoratorTypeOptions } from "./decoration";
import { EnumSettings } from "./enums";
import { LineNavigate } from "./helpers/jsx"
import examples from './tests/helper/examples'

export class Decorator {
  TextDecorationOptions = new DecoratorTypeOptions();
  CurrentEditor: TextEditor;
  ParsedRegexString: string;
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
    //const regEx: RegExp = RegExp(Settings.Get<RegExp>(EnumSettings.regex), Settings.Get<string>(EnumSettings.regexFlags));

    // Only lines with tags and attributes
    //const regEx = RegExp(/(?!<[a-zA-z0-9]\s+)([a-zA-Z0-9-:])*?(?=\s*?[^\w]*?=)/, 'g')
    // Break by line
    //const textLines: string[] = this.CurrentEditor.document.getText().split(/[\n]+/);
    // Break by line from examples 
    const textLines: string[] = examples.comp.split(/[\n]+/);

    const text: string = this.CurrentEditor.document.getText();
    const regexGroup: number = Settings.Get<number>(EnumSettings.regexGroup) as number | 1;
    const matchDecorationType = this.TextDecorationOptions.MaskDecorationTypeCache(langId);
    const unfoldDecorationType = this.TextDecorationOptions.UnfoldDecorationTypeCache(langId);
    const plainDecorationType = this.TextDecorationOptions.PlainDecorationTypeCache(langId);
    const unfoldDecorationOptions: DecorationOptions[] = [];
    const matchDecorationOptions: DecorationOptions[] = [];
    const unFoldOnLineSelect = Settings.Get<boolean>(EnumSettings.unfoldOnLineSelect);
    let match;

    for (let i = 0; i < textLines.length; i++) {

      const line = textLines[i];
      const nav = new LineNavigate(line);
      if (nav.hasPre()) {
        nav.indexAfterPre();
        if (nav.hasPre()) {
          if (nav.hasStart()) {
            console.log(nav.match)
          }
        }
      }

      //   const matched = match[regexGroup];
      //   const skip = match[0].indexOf(matched.replace(match[regexGroup])) + 1;
      //   const foldIndex = match[0].substring(skip).indexOf(matched) + skip;
      //   const startPosition = this.startPositionLine(match.index, foldIndex);
      //   const endPosition = this.endPositionLine(match.index, foldIndex, matched.length);
      //   const range = new Range(startPosition, endPosition);

      //   /* Checking if the toggle command is active or not. If it is not active, it will remove all decorations. */
      //   if (!this.Active) {
      //     this.CurrentEditor.setDecorations(plainDecorationType, []);
      //     break;
      //   }

      //   /* Checking if the range is within the visible area of the editor plus a specified offset for a head decoration. */
      //   if (!(this.StartLine <= range.start.line && range.end.line <= this.EndLine)) {
      //     continue;
      //   }

      //   // The only possible way to fix tooltip hover flickering
      //   if (this.CurrentEditor.selection.contains(range) || 
      //       this.CurrentEditor.selections.find(s => range.contains(s))) {
      //     unfoldDecorationOptions.push(this.TextDecorationOptions.UnfoldedDecorationOptions(new Range(startPosition, endPosition), matched));
      //   } else {
      //     matchDecorationOptions.push(this.TextDecorationOptions.MatchedDecorationOptions(range));
      //   }
    }

    // this.CurrentEditor.setDecorations(unfoldDecorationType, unfoldDecorationOptions);
    // this.CurrentEditor.setDecorations(matchDecorationType, matchDecorationOptions);
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

  constructor() { }
}
