import { ExtensionContext, TextEditor, window, workspace, WorkspaceConfiguration } from "vscode";
import { Decorator } from "./decorator";
import { EnumConfigs } from "./enums";

// this method is called when vs code is activated
export function activate(context: ExtensionContext) {
   const activeEditor: TextEditor = window.activeTextEditor;
   const config: WorkspaceConfiguration = workspace.getConfiguration(EnumConfigs.identifier);
   const decorator = new Decorator(activeEditor);

   console.log("inline-fold extension is activated");
   decorator.updateConfigs(config);

   function triggerUpdateDecorations() {
      decorator.init();
   }

   window.onDidChangeActiveTextEditor(
      (editor) => {
         if (!editor) return;
         decorator.activeEditor(editor);
         throttle(triggerUpdateDecorations(), 500);
      },
      null,
      context.subscriptions
   );

   window.onDidChangeTextEditorVisibleRanges(
      (editor) => {
         triggerUpdateDecorations();
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
      if (event.affectsConfiguration(EnumConfigs.identifier)) {
         decorator.updateConfigs(workspace.getConfiguration(EnumConfigs.identifier));
      }
   });

   function throttle(callback, limit: number) {
      let isWaiting = false;
      return function () {
         if (isWaiting) return;
         callback.apply(this, arguments);
         isWaiting = true;
         setTimeout(() => {
            isWaiting = false;
         }, limit);
      };
   }

   function newThrottle(fn: Function, wait: number) {
      let isCalled = false;
      return (...args) => {
         if (isCalled) return;
         fn(...args);
         isCalled = true;
         setTimeout(() => {
            isCalled = false;
         }, wait);
      };
   }
}
