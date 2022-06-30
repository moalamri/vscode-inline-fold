import { Decorator } from "./decorator";

export enum configs {
   identifier = "inlineFold",
   regex = "regex",
   regexFlags = "regexFlags",
   regexGroup = "regexGroup",
   maskChar = "maskChar",
   maskColor = "maskColor",
   unfoldedOpacity = "unfoldedOpacity",
   after = "after",
   supportedLanguages = "supportedLanguages",
}

export type VisibleRange = {
   StartLine: number;
   EndLine: number;
};

declare class Decorator {
   constructor(editor: TextEditor);
   Configs: WorkspaceConfiguration;
   UnfoldedDecoration: TextEditorDecorationType;
   MaskDecoration: TextEditorDecorationType;
   CurrentEditor: TextEditor;
   SupportedLanguages: string[];
   VisibleRange: VisibleRange;
   Range: Range;
   activeEditor(textEditor: TextEditor): void;
   init(): void;
   updateConfigs(conf: WorkspaceConfiguration): void;
   updateDecorations(): void;
   startPositionLine(matchIndex: number, startIndex: number): Position;
   endPositionLine(matchIndex: number, startIndex: number, length: number): Position;
}