import { DecorationOptions, DecorationRangeBehavior, DecorationRenderOptions, Range, TextEditorDecorationType, window } from "vscode";
import { CONFIGS } from "./enums";
import { ExtSettings } from "./settings";

/**
 * With each time the decorator is triggered, and the method setDecoration is called,
 * The extension will create a new decoration type with sequential numbers. This will
 * Create large number of decoration types which will overlapse each other.
 * This class DecoratorTypeOptions is used to cache the decoration type with each trigger
 * To only have single applied set of decoration type per language id.
 */
export class DecoratorTypeOptions {
  private cache = new Map<string, TextEditorDecorationType>();

  public ClearCache() {
    this.cache.clear();
  }

  public UnfoldedDecorationType = (langId: string /* To use later for lang scoped configs */): DecorationRenderOptions => {
    return {
      rangeBehavior: DecorationRangeBehavior.ClosedClosed,
      opacity: ExtSettings.Get<string>(CONFIGS.UNFOLDED_OPACITY).toString()
    }
  }

  public MatchedDecorationType = (langId: string /* To use later for lang scoped configs */): DecorationRenderOptions => {
    return {
      before: {
        contentText: ExtSettings.Get<string>(CONFIGS.MASK_CHAR),
        color: ExtSettings.Get<string>(CONFIGS.MASK_COLOR),
      },
      after: {
        contentText: ExtSettings.Get<string>(CONFIGS.AFTER),
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
    return this.cache.has(langId) ? this.cache.get(langId) as TextEditorDecorationType :
      this.cache.set(langId, window.createTextEditorDecorationType(this.PlainDecorationType()))
        .get(langId);
  }

  // NOTE: This method is for language scoped settings in the upcomming release

  // public MatchedDecorationOptions = (range: Range, _languageId: string): DecorationOptions => {
  //   const configs = ExtSettings.Get<DecorationInstanceRenderOptions>(Configs.perLanguageOptions);
  //   return {
  //     range,
  //     renderOptions: configs
  //   }
  // }

  public MatchedDecorationOptions = (range: Range, _languageId: string): DecorationOptions => {
    return {
      range
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