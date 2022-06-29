import { ExtensionContext, TextEditor, window, workspace, WorkspaceConfiguration} from "vscode";
import { configs } from "./enum";
import { Decorator } from "./decorator";

// this method is called when vs code is activated
export function activate(context: ExtensionContext) {
  console.log('inline-fold is activated');

  let timeout: NodeJS.Timer = undefined;
  const activeEditor: TextEditor = window.activeTextEditor;
  const config: WorkspaceConfiguration = workspace.getConfiguration(configs.identifier);

  const decorator = new Decorator(activeEditor);
  decorator.updateConfigs(config);

  function updateDecorations() {
    decorator.updateDecorations();
  }

  function triggerUpdateDecorations(throttle = false) {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }
    if (throttle) {
      timeout = setTimeout(updateDecorations, 500);
    } else {
      updateDecorations();
    }
  }

  if (activeEditor) {
    triggerUpdateDecorations();
  }

  window.onDidChangeActiveTextEditor(
    (editor) => {
      if (editor) {
        decorator.activeEditor = editor;
        triggerUpdateDecorations();
      }
    },
    null,
    context.subscriptions
  );

  workspace.onDidChangeTextDocument(
    (event) => {
      if (activeEditor && event.document === activeEditor.document) {
        triggerUpdateDecorations(true);
      }
    },
    null,
    context.subscriptions
  );

  window.onDidChangeTextEditorSelection(
    () => {
      	triggerUpdateDecorations();
    },
    null,
    context.subscriptions
  );

	workspace.onDidChangeConfiguration((event) => {
		if (event.affectsConfiguration(configs.identifier)) {
			decorator.updateConfigs(workspace.getConfiguration(configs.identifier));
		}
	});
}