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
   elimit.Register(triggerUpdateDecorations)
   elimit.Lead();

   function triggerUpdateDecorations(): void {
      const textEditor = window.activeTextEditor;
      if (!textEditor) return
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
      elimit.Tail()
   });

   const changeSelection = window.onDidChangeTextEditorSelection(
      (e) => {
         // event.kind is undefined when the selection change happens from tab switch
         // good to limit the number of times the decoration is updated, so no need 
         // to wrap the event.
         if (!e.kind || !e.textEditor) return
         elimit.Lead()
      });

   const changeVisibleRange = window.onDidChangeTextEditorVisibleRanges((e) => {
      if (!e.textEditor) return
      elimit.Tail()
   });

   const changeConfiguration = workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration(Settings.identifier)) {
         if(!event.affectsConfiguration(Settings.autoFold)) {
            Cache.ClearCache();
         }
         decorator.updateConfigs(workspace.getConfiguration(Settings.identifier));
      }
   });

   // Add to a list of disposables to the editor context
   // which are disposed when this extension is deactivated.
   context.subscriptions.push(toggleCommand);
   context.subscriptions.push(changeSelection);
   context.subscriptions.push(activeTextEditor);
   context.subscriptions.push(clearCacheCommand);
   context.subscriptions.push(changeVisibleRange);
   context.subscriptions.push(changeConfiguration);
}
