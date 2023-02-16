import { commands, ExtensionContext, window, workspace, WorkspaceConfiguration } from "vscode";
import { Decorator } from "./decorator";
import { Commands, Settings } from "./enums";
import { EventsLimit } from "./utils";
import { Cache } from "./cache";

export function activate(context: ExtensionContext) {
  const config: WorkspaceConfiguration = workspace.getConfiguration(Settings.identifier);
  const decorator = new Decorator();
  const elimit = new EventsLimit();
  decorator.updateConfigs(config);
  elimit.Register(triggerUpdateDecorations);
  elimit.Lead();

  function triggerUpdateDecorations(): void {
    const textEditor = window.activeTextEditor;
    if (!textEditor) return;
    decorator.activeEditor(textEditor);
  }

  const toggleCommand = commands.registerCommand(Commands.InlineFoldToggle, () => {
    decorator.toggle();
  });

  const clearCacheCommand = commands.registerCommand(Commands.InlineFoldClearCache, () => {
    Cache.ClearCache();
  });

  const activeTextEditor = window.onDidChangeActiveTextEditor((e) => {
    if (!e) return;
    elimit.Trail();
  });

  const changeSelection = window.onDidChangeTextEditorSelection((e) => {
    // event.kind is undefined when the selection change happens from tab switch or undo/redo
    // good to limit the number of times the decoration is updated, so no need
    // to fire the event if it's undefined
    if (!e.kind) return;
    elimit.Lead();
  });

  const changeVisibleRange = window.onDidChangeTextEditorVisibleRanges((e) => {
    if (!e.textEditor) return;
    elimit.Trail();
  });

  const changeText = workspace.onDidChangeTextDocument((e) => {
    // e.reason = 1 when undo
    // e.reason = 2 when redo
    // this event gets fired when any change happens to any text document in the workspace
    // so we will limit it to only update the decoration when the change is caused by undo/redo
    // also because `changeSelection` gets fired as well while typing.
    if (e.reason !== 1 && e.reason !== 2) return;
    elimit.Trail();
  });

  const changeConfiguration = workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration(Settings.identifier)) {
      if (!event.affectsConfiguration(Settings.autoFold)) {
        Cache.ClearCache();
      }
      decorator.updateConfigs(workspace.getConfiguration(Settings.identifier));
    }
  });

  // Add to a list of disposables to the editor context
  // which are disposed when this extension is deactivated.
  context.subscriptions.push(changeText);
  context.subscriptions.push(toggleCommand);
  context.subscriptions.push(changeSelection);
  context.subscriptions.push(activeTextEditor);
  context.subscriptions.push(clearCacheCommand);
  context.subscriptions.push(changeVisibleRange);
  context.subscriptions.push(changeConfiguration);
}

// this method is called when your extension is deactivated
export function deactivate(context: ExtensionContext) {
  context.subscriptions.forEach((d) => d.dispose());
}
