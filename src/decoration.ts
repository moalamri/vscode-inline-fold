import { DecorationInstanceRenderOptions, DecorationOptions, DecorationRangeBehavior, DecorationRenderOptions, Range, TextEditorDecorationType, window } from "vscode";
import { Settings } from "./settings";
import { EnuSettings } from "./enums";

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

  public UnfoldedDecorationType = (langId: string /* To use later for lang scoped configs */): DecorationRenderOptions => {
    return {
      rangeBehavior: DecorationRangeBehavior.ClosedClosed,
      opacity: Settings.Get<string>(EnuSettings.unfoldedOpacity).toString()
    }
  }

  public MatchedDecorationType = (langId: string /* To use later for lang scoped configs */): DecorationRenderOptions => {
    return {
      before: {
        contentText: Settings.Get<string>(EnuSettings.maskChar),
        color: Settings.Get<string>(EnuSettings.maskColor),
      },
      after: {
        contentText: Settings.Get<string>(EnuSettings.after)
      },
      letterSpacing: "-2ch",
      textDecoration: "none; display: none;"
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

  public MatchedDecorationOptions = (range: Range, _languageId: string): DecorationOptions => {
    const configs = Settings.Get<DecorationInstanceRenderOptions>(EnuSettings.perLanguageOptions);
    return {
      range,
      renderOptions: configs
    }
  }

  public UnfoldedDecorationOptions = (range: Range, text: string): DecorationOptions => {
    return {
      range,
      hoverMessage: `Full text: ${text}`,
    }
  }

  public PlainDecorationType = (): DecorationRenderOptions => {
    return { rangeBehavior: DecorationRangeBehavior.ClosedClosed }
  }

  constructor () { }

}