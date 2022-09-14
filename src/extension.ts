import { commands, ExtensionContext, window, workspace, WorkspaceConfiguration } from "vscode";
import { Decorator } from "./decorator";
import { Commands, EnumSettings } from "./enums";
import { EventsLimit } from "./utils";

export function activate(context: ExtensionContext) {
   const workspaceConfig: WorkspaceConfiguration = workspace.getConfiguration(EnumSettings.identifier);
   const decorator = new Decorator();
   const elimit = new EventsLimit();
   updateConfigs(workspaceConfig);
   elimit.Register(triggerUpdateDecorations)
   elimit.Lead();

   function updateConfigs(_config: WorkspaceConfiguration) {
      decorator.updateConfigs(_config);
   }

   function triggerUpdateDecorations(): void {
      const textEditor = window.activeTextEditor;
      if (!textEditor) return
      decorator.activeEditor(textEditor);
   }

   commands.registerCommand(Commands.InlineFoldToggle, () => {
      decorator.toggle();
   }, null);

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
         triggerUpdateDecorations();
      }, null, context.subscriptions
   );

   window.onDidChangeTextEditorVisibleRanges((e) => {
      if (!e.textEditor) return
      elimit.Tail()
   }, null, context.subscriptions);

   workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration(EnumSettings.identifier)) {
         updateConfigs(workspace.getConfiguration(EnumSettings.identifier));
      }
   }, null, context.subscriptions);
}
