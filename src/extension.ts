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
    for (const textEditor of window.visibleTextEditors) {
      decorator.editor(textEditor);
    }
  }

  const toggleCommand = commands.registerCommand(Commands.InlineFoldToggle, () => {
    Cache.ToggleShouldFold(window.activeTextEditor?.document.uri.path)
    triggerUpdateDecorations()
  });

  const clearCacheCommand = commands.registerCommand(Commands.InlineFoldClearCache, () => {
    Cache.Clear();
  });

  const changeVisibleTextEditors = window.onDidChangeVisibleTextEditors((editors) => {
    if (editors.length < 1) return;
    elimit.Trail();
  });

  const changeSelection = window.onDidChangeTextEditorSelection((e) => {
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
    // so to limit the decoration it will fire when the change is caused by undo/redo
    // since `changeSelection` gets fired as well while typing or moving lines.
    if (e.reason !== 1 && e.reason !== 2) return;
    elimit.Trail();
  });

  const changeConfiguration = workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration(Settings.identifier)) {
      if (!event.affectsConfiguration(Settings.autoFold)) {
        Cache.Clear();
      }
      decorator.updateConfigs(workspace.getConfiguration(Settings.identifier));
    }
  });

  // Add to a list of disposables to the editor context
  // which are disposed when this extension is deactivated.
  context.subscriptions.push(changeText);
  context.subscriptions.push(toggleCommand);
  context.subscriptions.push(changeSelection);
  context.subscriptions.push(changeVisibleTextEditors);
  context.subscriptions.push(clearCacheCommand);
  context.subscriptions.push(changeVisibleRange);
  context.subscriptions.push(changeConfiguration);
}

// this method is called when your extension is deactivated
export function deactivate(context: ExtensionContext) {
  context.subscriptions.forEach((d) => d.dispose());
}
