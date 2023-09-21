import { window, type TextEditor, TabInputTextDiff, Uri } from "vscode";

/**
* Extension events limiter.
* This class is responsible for managing  the  events of the extension to
* avoid duplicated events, because the debouncing method didn't work well.
* First we initilize EventsLimit with desired limit in ms and then we register
* the function to be fired one time immediatly(leading) or the last (trailing)
* until the timeout is over.
*/
export class EventsLimit {
  private trailTimer: number = undefined;
  private leadTimer: number = undefined;
  private isCalled: boolean = false;
  private timeout: NodeJS.Timeout;
  private func: Function = undefined;

  /**
  * EventsLimit constructor.
  * @param _trailTimer The limit in milliseconds for the trailing event.
  * @param _leadTimer The limit in milliseconds for the leading event.
  */
  constructor (_trailTimer: number = 100, _leadTimer: number = 100) {
    this.trailTimer = _trailTimer;
    this.leadTimer = _leadTimer;
  }

  /**
  * Register callback function
  * @param func The function to be fired one time immediatly(leading) or the last (trailing)
  */
  public Register = (func: Function) => {
    this.func = func;
  }

  /* Checking if the function is called, if not it calls the registered function
  * and then resets the timer.
  */
  public Lead = () => {
    if (!this.isCalled) {
      this.isCalled = true;
      this.func();
    }
    setTimeout(() => {
      this.isCalled = false;
    }, this.leadTimer)
  }

  /**
  * Because some events like onDidChangeActiveTextEditor get fired twice when
  * an editor tab is opened. The first event is for the visible range of pre
  * mouse position and then gets another event but with the correct visible range.
  * So we will use this method to fire the last passed event.
  */
  public Trail = () => {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.func(), this.trailTimer);
  }
}

/**
 * Determines whether the provided `editor` is a main editor.
 *
 * @returns `true` if the `editor` is a main editor,
 * otherwise (e.g. embedded editor) `false`.
 */
export function isMainEditor(editor: TextEditor): boolean {
  return editor.viewColumn !== undefined;
}

/**
 * Determines whether the provided `uri` is currently opened within a Diff Editor.
 *
 * @returns `true` if a tab with the provided `uri` is opened in a Diff Editor, otherwise `false`.
 */
export function isOpenedWithDiffEditor(uri: Uri): boolean {
  const tabs = window.tabGroups.all.flatMap((tabGroup) => tabGroup.tabs);
  return tabs.some((tab) =>
    tab.input instanceof TabInputTextDiff &&
    (tab.input.modified.path === uri.path ||
      tab.input.original.path === uri.path)
  );
}
