import { Position, Range, TextEditor, DecorationOptions, window } from 'vscode';
import * as vscode from 'vscode';
import FoldState from './state';
import { DecorationType } from './decoration';
import { SETTINGS } from './enums';
import { isMainEditor, isOpenedWithDiffEditor } from './utils';
import { getConfig, getRegexConfig, getSupportedLanguages } from './config';

export class Decorator extends DecorationType {
      private foldState: FoldState;
      currentEditor: TextEditor;
      offset: number = 50;
      startLine: number = 0;
      endLine: number = 0;

      /**
       * To set/update the current visible text editor.
       * @param textEditor TextEditor
       */
      editor(textEditor: TextEditor) {
            if (!textEditor) {
                  return;
            }
            this.currentEditor = textEditor;
            this.setStartLine(textEditor.visibleRanges[0].start.line);
            this.setEndLine(textEditor.visibleRanges[0].end.line);
            this.updateDecorations();
      }

      /**
       * Set the number of the starting line of where the decoration should be applied.
       * @param n number
       */
      setStartLine(n: number) {
            if (n - this.offset < 0) {
                  this.startLine = 0;
            } else {
                  this.startLine = n - this.offset;
            }
      }

      /**
       * Set the number of the ending line of where the decoration should be applied.
       * @param n number
       */
      setEndLine(n: number) {
            if (n + this.offset > this.currentEditor.document.lineCount) {
                  this.endLine = this.currentEditor.document.lineCount;
            } else {
                  this.endLine = n + this.offset;
            }
      }

      /**
       * This method gets triggered when the extension settings are changed
       */
      resetDecorationType() {
            this.resetTypeCache();
      }

      updateDecorations() {
            const currentLangId = this.currentEditor.document.languageId;

            if (!getSupportedLanguages().includes(currentLangId)) {
                  return;
            }

            const disableInDiffEditor = getConfig<boolean>(
                  SETTINGS.DISABLE_IN_DIFF_EDITOR,
                  currentLangId
            );
            if (disableInDiffEditor) {
                  if (
                        !isMainEditor(this.currentEditor) && // Idea from: https://github.com/usernamehw/vscode-error-lens/issues/72#issuecomment-1062046817
                        isOpenedWithDiffEditor(this.currentEditor.document.uri)
                  ) {
                        return;
                  }
            }

            const regEx: RegExp = getRegexConfig(currentLangId);
            const text = this.currentEditor.document.getText();
            const regexGroup: number = getConfig<number>(SETTINGS.REGEX_GROUPS, currentLangId) as
                  | number
                  | 1;
            const matchDecorationType = this.foldDecorationType(currentLangId);
            const plainDecorationType = this.plainDecorationType();
            const unfoldDecorationType = this.unfoldDecorationType(currentLangId);
            const foldRanges: DecorationOptions[] = [];
            const unfoldRanges: Range[] = [];

            let match: RegExpExecArray | null;
            while ((match = regEx.exec(text))) {
                  // if the matched content is undefined, skip it and continue to the next match
                  if (match && !match[regexGroup]) {
                        continue;
                  }

                  const matched = match[regexGroup];
                  const foldIndex = match[0].lastIndexOf(matched);
                  const startPosition = this.startPositionLine(match.index, foldIndex);
                  const endPosition = this.endPositionLine(match.index, foldIndex, matched.length);
                  const range: Range = new Range(startPosition, endPosition);

                  /* Checking if the fold state is enabled for the current language id. if not, remove all decorations */
                  if (!this.foldingEnabled(currentLangId)) {
                        this.currentEditor.setDecorations(plainDecorationType, []);
                        break;
                  }

                  /* Checking if the range is not within the visible area. */
                  if (this.notVisibleRange(range)) {
                        continue;
                  }

                  if (this.rangeToFold(range)) {
                        foldRanges.push({
                              range,
                              hoverMessage: 'Content **' + matched + '**'
                        });
                  } else {
                        unfoldRanges.push(range);
                  }
            }

            this.currentEditor.setDecorations(unfoldDecorationType, unfoldRanges);
            this.currentEditor.setDecorations(matchDecorationType, foldRanges);
      }

      startPositionLine(matchIndex: number, startIndex: number): Position {
            return this.currentEditor.document.positionAt(matchIndex + startIndex);
      }

      endPositionLine(matchIndex: number, startIndex: number, length: number): Position {
            return this.currentEditor.document.positionAt(matchIndex + startIndex + length);
      }

      /* Checking if the toggle command is active or not. without conflicts with default state settings.
   If it is not active, it will remove all decorations. */
      foldingEnabled(currentLangId: string): boolean {
            return this.foldState.shouldFold(this.currentEditor.document.uri.path, currentLangId);
      }

      notVisibleRange(range: Range): boolean {
            return this.startLine > range.start.line && this.endLine < range.end.line;
      }

      isWrapped(range: Range): boolean {
            const editorConfigs = vscode.workspace.getConfiguration('editor');
            const wordWrap: 'on' | 'off' = editorConfigs.get('wordWrap');
            if (wordWrap === 'off') {
                  return false;
            }
            const wordWrapColumn: number = editorConfigs.get('wordWrapColumn');
            console.log(
                  `End character: ${range.end.character}, Word wrap column: ${wordWrapColumn}`
            );
            if (range.end.character > wordWrapColumn) {
                  // If the end character is beyond the line length, it means the line is wrapped
                  return true;
            }
            return false;
      }

      rangeToFold(range: Range): boolean {
            const currentLangId = this.currentEditor.document.languageId;
            const unfoldOnLineSelect =
                  getConfig<boolean>(SETTINGS.UNFOLD_ON_LINE_SELECT, currentLangId) === true &&
                  this.currentEditor.selections.find(s => s.start.line === range.start.line) !==
                        undefined;

            /* Checking if the range is selected by the user. first check is for single selection,
             * second is for multiple cursor selections */
            if (
                  this.isWrapped(range) ||
                  this.currentEditor.selection.contains(range) ||
                  this.currentEditor.selections.find(s => range.contains(s)) ||
                  unfoldOnLineSelect
            ) {
                  // If the range is selected or unfoldOnLineSelect is enabled, return false to indicate it should not be folded
                  return false;
            }
            return true;
      }

      /* reset the fold state cache */
      resetFoldState() {
            this.foldState.reset();
      }

      toggleFoldState() {
            this.foldState.toggleShouldFold(
                  window.activeTextEditor?.document.uri.path,
                  window.activeTextEditor?.document.languageId
            );
      }

      constructor() {
            super();
            this.foldState = new FoldState();
      }
}
