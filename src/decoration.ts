import { DecorationInstanceRenderOptions, DecorationOptions, DecorationRangeBehavior, DecorationRenderOptions, Range, TextEditorDecorationType, window } from "vscode";
import { ExtensionConfigs } from "./config";
import { Configs } from "./enums";


export class DecoratorTypeOptions {
  private cache = new Map<string, TextEditorDecorationType>();

  public ClearCache() {
    this.cache.clear();
  }

  public UnfoldedDecorationType = (langId: string): DecorationRenderOptions => {
    return {
      rangeBehavior: DecorationRangeBehavior.ClosedClosed,
      opacity: ExtensionConfigs.get<string>(Configs.unfoldedOpacity, langId).toString()
    }
  }

  public MatchedDecorationType = (langId: string): DecorationRenderOptions => {
    return {
      before: {
        contentText: ExtensionConfigs.get<string>(Configs.maskChar, langId),
        color: ExtensionConfigs.get<string>(Configs.maskColor, langId),
      },
      after: {
        contentText: ExtensionConfigs.get<string>(Configs.after, langId),
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
    return this.cache.has(langId) ? this.cache.get(langId):
      this.cache.set(langId, window.createTextEditorDecorationType(this.PlainDecorationType()))
        .get(langId);
  }

  public MatchedDecorationOptions = (range: Range, _languageId: string): DecorationOptions => {
    const configs = ExtensionConfigs.get<DecorationInstanceRenderOptions>(Configs.decorationOptions, _languageId);
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