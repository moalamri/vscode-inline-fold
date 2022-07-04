import { ExtensionContext, TextEditor, window, workspace, WorkspaceConfiguration } from "vscode";
import { Decorator } from "./decorator";
import { EnumConfigs } from "./enums";

// this method is called when vs code is activated
export function activate(context: ExtensionContext) {let activeEditor: TextEditor = window.activeTextEditor;
   const config: WorkspaceConfiguration = workspace.getConfiguration(EnumConfigs.identifier);
   const decorator = new Decorator(activeEditor);

   console.log("inline-fold extension is activated");
   decorator.updateConfigs(config);

   function triggerUpdateDecorations() {
      decorator.start();
   }

   workspace.onDidOpenTextDocument((e) => {
      console.log('onDidOpenTextDocument is fired');
      triggerUpdateDecorations()
   }, null, context.subscriptions);

   window.onDidChangeActiveTextEditor(
      (editor) => {
         if(!editor) return
         console.log('onDidChangeActiveTextEditor is fired');
          decorator.activeEditor(editor);
      },
      null,
      context.subscriptions
   );

   // The current event fires twice when the editor tab is opened.
   window.onDidChangeTextEditorVisibleRanges((e) => {
      console.log('onDidChangeTextEditorVisibleRanges is fired');
   }), null, context.subscriptions);

   window.onDidChangeTextEditorSelection(
      (event) => {
         // event.kind is undefined when the selection change happens from tab switch
         // good to limit the number of times the decoration is updated.
         console.log('onDidChangeTextEditorSelection is fired');
         if(!event.kind) return 
         triggerUpdateDecorations();
      },
      null,
      context.subscriptions
   );

   workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration(EnumConfigs.identifier)) {
         decorator.updateConfigs(workspace.getConfiguration(EnumConfigs.identifier));
      }
   });

}
