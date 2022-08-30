import { ExtensionContext, window, workspace, WorkspaceConfiguration } from "vscode";
import { Decorator } from "./decorator";
import { CONFIGS } from "./enums";
import { EventsLimit } from "./utils";
import { registerCommands } from "./commands";

export function activate(context: ExtensionContext) {
   const config: WorkspaceConfiguration = workspace.getConfiguration(CONFIGS.IDENTIFIER);
   const decorator = new Decorator();
   const elimit = new EventsLimit();
   decorator.updateConfigs(config);
   registerCommands(context, decorator);
   elimit.Register(triggerUpdateDecorations)
   elimit.Lead();

   function triggerUpdateDecorations(): void {
      const textEditor = window.activeTextEditor;
      if (!textEditor) return
      decorator.activeEditor(textEditor);
   }

   window.onDidChangeActiveTextEditor((e) => {
      if (!e) return;
      elimit.Tail()
   }, null, context.subscriptions);

   window.onDidChangeTextEditorSelection(
      (e) => {
         // event.kind is undefined when the selection change happens from tab switch
         // good to limit the number of times the decoration is updated, so no need 
         // to wrap the event.
         if (!e.kind || !e.textEditor) return
         elimit.Lead()
      }, null, context.subscriptions
   );

   window.onDidChangeTextEditorVisibleRanges((e) => {
      if (!e.textEditor) return
      elimit.Tail()
   }, null, context.subscriptions);

   workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration(CONFIGS.IDENTIFIER)) {
         decorator.updateConfigs(workspace.getConfiguration(CONFIGS.IDENTIFIER));
      }
   }, null, context.subscriptions);

}
