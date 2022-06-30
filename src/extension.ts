import { ExtensionContext, TextEditor, window, workspace, WorkspaceConfiguration } from "vscode";
import { configs, Decorator } from ".";

const activeEditor: TextEditor = window.activeTextEditor;
const config: WorkspaceConfiguration = workspace.getConfiguration(configs.identifier);
const decorator = new Decorator(activeEditor);

// this method is called when vs code is activated
export function activate(context: ExtensionContext) {
   console.log("inline-fold is activated");
   decorator.updateConfigs(config);

   context.subscriptions.forEach((ctx) => {
      ctx.dispose()
   });

   function triggerUpdateDecorations() {
      decorator.init();
   }

   window.onDidChangeActiveTextEditor(
      (editor) => {
         if (!editor) return;
         decorator.activeEditor(editor);
         setImmediate(()=> decorator.init())
      },
      null,
      context.subscriptions
   );

   window.onDidChangeTextEditorVisibleRanges(
      () => {
         decorator.init();
      },
      null,
      context.subscriptions
   );

   window.onDidChangeTextEditorSelection(
      () => {
         decorator.init();
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
