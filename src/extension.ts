import { commands, ExtensionContext, window, workspace, WorkspaceConfiguration } from "vscode";
import { Decorator } from "./decorator";
import { Commands, Configs } from "./enums";

export function activate(context: ExtensionContext) {
   const config: WorkspaceConfiguration = workspace.getConfiguration(Configs.identifier);
   const decorator = new Decorator(window.activeTextEditor);

   console.log("inline-fold extension is activated");
   decorator.updateConfigs(config);

   function triggerUpdateDecorations(): void {
      if(!window.activeTextEditor) return
      decorator.activeEditor(window.activeTextEditor);
      decorator.startLine(window.activeTextEditor.visibleRanges[0].start.line);
      decorator.endLine(window.activeTextEditor.visibleRanges[0].end.line);
      decorator.start();
   }

   commands.registerCommand(Commands.InlineFoldToggle, () => {
      decorator.toggle();
   })

   /**
    * This event fires before onDidChangeActiveTextEditor
    * which is good for fast processing, but sometimes it first returns nothing
    * before the active editor is set.
    */
   window.onDidChangeVisibleTextEditors((e) => {
      if (e.length === 0) {
         return;
      }
      if(!e[0].document) return
      triggerUpdateDecorations();
   }, null, context.subscriptions);

   window.onDidChangeTextEditorSelection(
      (event) => {
         // event.kind is undefined when the selection change happens from tab switch
         // good to limit the number of times the decoration is updated, so no need 
         // to wrap the event.
         if (!event.kind) return
         triggerUpdateDecorations();
      }, null, context.subscriptions
   );

   window.onDidChangeTextEditorVisibleRanges((e) => {
      if (!e.visibleRanges) return
      triggerUpdateDecorations();
   }
      , null, context.subscriptions);

   workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration(Configs.identifier)) {
         decorator.updateConfigs(workspace.getConfiguration(Configs.identifier));
      }
   });

}
