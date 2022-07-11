import { window, DecorationRangeBehavior, WorkspaceConfiguration, TextEditorDecorationType } from "vscode";
import { Configs } from "./enums";

/**
 * The unfolded text decoration
 * @param extConfs Workspace configs
 * @returns TextEditorDecorationType with custom modifications
 */
export const unfoldedDecorationOptions = (extConfs: WorkspaceConfiguration): TextEditorDecorationType => window.createTextEditorDecorationType({
  rangeBehavior: DecorationRangeBehavior.ClosedClosed,
  opacity: extConfs.get(Configs.unfoldedOpacity).toString()
});

/**
 * The decoration of the mask for the folded text
 * @param extConfs Workspace configs
 * @returns TextEditorDecorationType with custom modifications
 */
export const maskDecorationOptions = (extConfs: WorkspaceConfiguration): TextEditorDecorationType => window.createTextEditorDecorationType({
  before: {
    contentText: extConfs.get(Configs.maskChar),
    color: extConfs.get(Configs.maskColor)
  },
  after: {
    contentText: extConfs.get(Configs.after),
  },
  letterSpacing: "-1ch",
  textDecoration: "none; display: none;"
});

/**
 * This is used to reset the decorations when toggle command is fired
 * @param extConfs Workspace configs
 * @returns TextEditorDecorationType with custom modifications
 */
export const noDecoration = (): TextEditorDecorationType => window.createTextEditorDecorationType({
  rangeBehavior: DecorationRangeBehavior.ClosedClosed,
})
