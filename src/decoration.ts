import { window, DecorationRangeBehavior, WorkspaceConfiguration, TextEditorDecorationType } from "vscode";
import { EnumConfigs } from "./enums";

export const unfoldedDecorationOptions = (extConfs: WorkspaceConfiguration): TextEditorDecorationType => window.createTextEditorDecorationType({
  rangeBehavior: DecorationRangeBehavior.ClosedClosed,
  opacity: extConfs.get(EnumConfigs.unfoldedOpacity),
});

export const maskDecorationOptions = (extConfs: WorkspaceConfiguration): TextEditorDecorationType => window.createTextEditorDecorationType({
  before: {
    contentText: extConfs.get(EnumConfigs.maskChar),
    color: extConfs.get(EnumConfigs.maskColor),
  },
  after: {
    contentText: extConfs.get(EnumConfigs.after),
  },
  letterSpacing: "-1ch",
  textDecoration: "none; display: none;"
});
