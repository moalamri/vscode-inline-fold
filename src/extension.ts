import { commands, ExtensionContext, window, workspace, WorkspaceConfiguration } from "vscode";
import { Decorator } from "./decorator";
import { Commands, Configs } from "./enums";
import { EventsLimit } from "./utils";

export function activate(context: ExtensionContext) {
   const config: WorkspaceConfiguration = workspace.getConfiguration(Configs.identifier);
   const decorator = new Decorator(window.activeTextEditor);
   const evwrapper = new EventsLimit(200,100);

   /**
    * Those events get triggered when simply switching to a different tab,
    * onDidChangeActiveTextEditor x1
    * onDidChangeTextEditorSelection x1
    * onDidChangeTextEditorVisibleRanges x2
    * onDidOpenTextDocument x1
    * 
    * To have them all trigger the decorator is not a good idea even if it
    * is only applying  the decorations to the  visible  part of the code.
    * And as you can see, onDidChangeTextEditorVisibleRanges gets triggered
    * twice (BUG?)  with  different  visibleRanges each time, so I'm using
    * a custom events limiter to avoid that.
    */
   evwrapper.Register(triggerUpdateDecorations);

   console.log("inline-fold extension is activated");
   decorator.updateConfigs(config);
   triggerUpdateDecorations();

   function triggerUpdateDecorations(): void {
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
   window.onDidChangeVisibleTextEditors((e) =>
   {
   if(e.length !== 1) {
      return;
    }
    decorator.startLine(e[0].visibleRanges[0].start.line);
    decorator.endLine(e[0].visibleRanges[0].end.line);
    decorator.activeEditor = e[0];
    evwrapper.Trail();
   }, null, context.subscriptions);

   window.onDidChangeTextEditorSelection(
      (event) => {
         // event.kind is undefined when the selection change happens from tab switch
         // good to limit the number of times the decoration is updated, so no need 
         // to wrap the event.
         if(!event.kind) return 
         triggerUpdateDecorations();
      }, null,context.subscriptions
   );

   /* The current event fires 2-3 times when the user switch the active tab to another
   * open tab that has an active line (active cursor).
   * This is a workaround to avoid the unnecessary triggers.
   */
   window.onDidChangeTextEditorVisibleRanges((e) => {
      if(!e.visibleRanges) return
      decorator.startLine(e.visibleRanges[0].start.line);
      decorator.endLine(e.visibleRanges[0].end.line);
      evwrapper.Trail();
   }
   , null, context.subscriptions);

   workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration(Configs.identifier)) {
         decorator.updateConfigs(workspace.getConfiguration(Configs.identifier));
      }
   });

}
