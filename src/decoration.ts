import { DecorationRangeBehavior, TextEditorDecorationType, window } from "vscode";
import { Settings } from "./enums";
import { ExtSettings } from "./settings";

/**
 * With each time the decorator is triggered, and the method setDecoration is called,
 * The extension will create a new decoration type with sequential numbers. This will
 * Create large number of decoration types which will overlapse each other.
 * This class DecoratorTypeOptions is used to cache the decoration type for each trigger
 * To only have single applied set of decoration type per language id.
 * on demand.
 */
export class DecoratorTypeOptions {
  private cache = new Map<string, TextEditorDecorationType>();

  public ClearCache() {
    this.cache.forEach((decOp) => {
      decOp.dispose();
    });
    this.cache.clear();
  }

  public UnfoldDecorationType = (): TextEditorDecorationType => {
    return window.createTextEditorDecorationType({
      rangeBehavior: DecorationRangeBehavior.ClosedOpen,
      opacity: ExtSettings.Get<string>(Settings.unfoldedOpacity).toString()
    })
  }

  public MatchedDecorationType = (): TextEditorDecorationType => {
    return window.createTextEditorDecorationType({
      before: {
        contentText: ExtSettings.Get<string>(Settings.maskChar),
        color: ExtSettings.Get<string>(Settings.maskColor),
      },
      after: {
        contentText: ExtSettings.Get<string>(Settings.after),
      },
      textDecoration: "none; display: none;"
    });

  };

  public PlainDecorationType = (): TextEditorDecorationType => window.createTextEditorDecorationType({})

  public MaskDecorationTypeCache(): TextEditorDecorationType {
    const langId = window.activeTextEditor.document.languageId;
    if (this.cache.has(langId)) {
      return this.cache.get(langId) as TextEditorDecorationType;
    }
    const decorationType = this.MatchedDecorationType();
    this.cache.set(langId, decorationType);
    return decorationType;
  }

  constructor () { }

}