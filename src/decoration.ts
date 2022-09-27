import { DecorationOptions, DecorationRangeBehavior, DecorationRenderOptions, Range, TextEditorDecorationType, window } from "vscode";
import { ExtSettings } from "./settings";
import { Settings } from "./enums";

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
    this.cache.clear();
  }

  public UnfoldedDecorationType = (langId?: string /* To use later for lang scoped configs */): DecorationRenderOptions => {
    return {
      rangeBehavior: DecorationRangeBehavior.ClosedClosed,
      opacity: ExtSettings.Get<string>(Settings.unfoldedOpacity)
    }
  }

  public MatchedDecorationType = (langId?: string /* To use later for lang scoped configs */): DecorationRenderOptions => {
    return {
      before: {
        contentText: ExtSettings.Get<string>(Settings.maskChar),
        color: ExtSettings.Get<string>(Settings.maskColor),
      },
      after: {
        contentText: ExtSettings.Get<string>(Settings.after)
      },
      letterSpacing: "-2ch",
      textDecoration: "none; display: none;",
    }
  };

  public UnfoldDecorationTypeCache(langId: string): TextEditorDecorationType {
    return this.cache.has(langId) ? this.cache.get(langId) as TextEditorDecorationType :
      this.cache.set(langId, window.createTextEditorDecorationType(this.UnfoldedDecorationType(langId)))
        .get(langId);
  }

  public MaskDecorationTypeCache(langId: string): TextEditorDecorationType {
    return this.cache.has(langId) ? this.cache.get(langId) as TextEditorDecorationType :
      this.cache.set(langId, window.createTextEditorDecorationType(this.MatchedDecorationType(langId)))
        .get(langId);
  }

  public PlainDecorationTypeCache(langId: string): TextEditorDecorationType {
    return this.cache.has(langId) ? this.cache.get(langId) as TextEditorDecorationType: 
      this.cache.set(langId, window.createTextEditorDecorationType(this.PlainDecorationType()))
        .get(langId);
  }

  public PlainDecorationType = (): DecorationRenderOptions => {
    return { rangeBehavior: DecorationRangeBehavior.ClosedClosed }
  }

  constructor () { }

}