import { commands, ExtensionContext, TextEditor, TextEditorCursorStyle, window, workspace, WorkspaceConfiguration } from "vscode";
import { Decorator } from "./decorator";
import { EnumConfigs, EnumCommands } from "./enums";
import { debouncer } from "./utils";

// this method is called when vs code is activated
export function activate(context: ExtensionContext) {let activeEditor: TextEditor = window.activeTextEditor;
   const config: WorkspaceConfiguration = workspace.getConfiguration(EnumConfigs.identifier);
   const decorator = new Decorator(activeEditor);

   /**
    * Those events get triggered when simply switching to a different tab,
    * onDidChangeActiveTextEditor x1
    * onDidChangeTextEditorSelection x1
    * onDidChangeTextEditorVisibleRanges x2
    * onDidOpenTextDocument x1
    * 
    * To have them all trigger the decorator is not a good idea even if it
    * is only applying  the decorations to the  visible  part of the  code.
    * And as you can see, onDidChangeTextEditorVisibleRanges gets triggered
    * twice (BUG?)  with  different  visibleRanges values each time, so I'm
    * using a debouncer to avoid that.
    */
   const debounce = debouncer(triggerUpdateDecorations, 300);

   console.log("inline-fold extension is activated");
   decorator.updateConfigs(config);

   function triggerUpdateDecorations() {
      console.log("triggerUpdateDecorations");
      decorator.start();
   }

   commands.registerCommand(EnumCommands.InlineFoldToggle, () => {
      console.log('fired command inlineFold.toggle');
      decorator.toggle();
   })

   workspace.onDidOpenTextDocument(debounce, null, context.subscriptions);

   // changed this function to only update the current active editor 
   // without triggering the decorator
   window.onDidChangeActiveTextEditor(
      (editor) => {
         if(!editor) return
         decorator.activeEditor(editor);
      },
      null,
      context.subscriptions
   );

   // The current event fires twice when the editor tab is opened.
   // This is a workaround to avoid the double trigger.
   window.onDidChangeTextEditorVisibleRanges(debounce, null, context.subscriptions);

   window.onDidChangeTextEditorSelection(
      (event) => {
         // event.kind is undefined when the selection change happens from tab switch
         // good to limit the number of times the decoration is updated.
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
