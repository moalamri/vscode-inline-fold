import { commands, ExtensionContext, window, workspace } from 'vscode';
import { Decorator } from './decorator';
import { COMMANDS, SETTINGS } from './enums';
import { EventThrottler } from './utils';

export function activate(context: ExtensionContext) {
      const decorator = new Decorator();
      const eventThrottler = new EventThrottler(triggerUpdateDecorations);

      window.showInformationMessage('Starting all tests.');

      function triggerUpdateDecorations(): void {
            for (const textEditor of window.visibleTextEditors) {
                  decorator.editor(textEditor);
            }
      }

      const toggleCommand = commands.registerCommand(COMMANDS.INLINE_FOLD_TOGGLE, () => {
            decorator.toggleFoldState();
            triggerUpdateDecorations();
      });

      const clearCacheCommand = commands.registerCommand(COMMANDS.INLINE_FOLD_CLEAR_CACHE, () => {
            decorator.resetFoldState();
      });

      const changeVisibleTextEditors = window.onDidChangeVisibleTextEditors(editors => {
            if (editors.length < 1) {
                  return;
            }
            eventThrottler.trail();
      });

      const changeSelection = window.onDidChangeTextEditorSelection(e => {
            eventThrottler.lead();
      });

      const changeVisibleRange = window.onDidChangeTextEditorVisibleRanges(e => {
            if (!e.textEditor) {
                  return;
            }
            eventThrottler.trail();
      });

      const changeText = workspace.onDidChangeTextDocument(e => {
            // e.reason = 1 when undo
            // e.reason = 2 when redo
            // this event gets fired when any change happens to any text document in the workspace
            // so to limit the decoration it will fire when the change is caused by undo/redo
            // since `changeSelection` gets fired as well while typing or moving lines.
            if (e.reason !== 1 && e.reason !== 2) {
                  return;
            }
            eventThrottler.trail();
      });

      const changeConfiguration = workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration(SETTINGS.IDENTIFIER)) {
                  if (!event.affectsConfiguration(SETTINGS.AUTOFOLD)) {
                        decorator.resetFoldState();
                  }
                  decorator.resetDecorationType();
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
      context.subscriptions.forEach(d => d.dispose());
}
