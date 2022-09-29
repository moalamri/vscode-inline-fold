import path = require("path");
import { DecorationRangeBehavior, DecorationRenderOptions, TextEditorDecorationType, Uri, window } from "vscode";
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

  /** @param langId To use later for lang scoped configs */
  private UnfoldedDecorationType = (langId?: string): TextEditorDecorationType => {
    return window.createTextEditorDecorationType({
      rangeBehavior: DecorationRangeBehavior.ClosedOpen,
      opacity: ExtSettings.Get<string>(Settings.unfoldedOpacity)
    })
  }

  /** @param langId To use later for lang scoped configs */
  private MatchedDecorationType = (langId?: string /* To use later for lang scoped configs */): TextEditorDecorationType => {
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


  private noDecoration = (): TextEditorDecorationType => window.createTextEditorDecorationType({})

  public UnfoldDecorationTypeCache(langId: string): TextEditorDecorationType {
    if (this.cache.has(langId)) {
      return this.cache.get(langId) as TextEditorDecorationType;
    }
    const decorationType = this.UnfoldedDecorationType();
    this.cache.set(langId, decorationType);
    return decorationType;
  }

  public MaskDecorationTypeCache(langId: string): TextEditorDecorationType {
    if (this.cache.has(langId)) {
      return this.cache.get(langId) as TextEditorDecorationType;
    }
    const decorationType = this.MatchedDecorationType();
    this.cache.set(langId, decorationType);
    return decorationType;
  }

  public PlainDecorationTypeCache(langId: string): TextEditorDecorationType {
    if (this.cache.has(langId)) {
      return this.cache.get(langId) as TextEditorDecorationType;
    }
    const decorationType = this.noDecoration();
    this.cache.set(langId, decorationType);
    return decorationType;
  }

  constructor () { }

}