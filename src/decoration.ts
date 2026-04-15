import { DecorationRangeBehavior, TextEditorDecorationType, window } from 'vscode';
import { SETTINGS } from './enums';
import { getConfig } from './config';

/**
 * Caches decoration types to avoid creating overlapping types on each trigger.
 * Manages fold, unfold, and plain decoration types for different languages.
 */
export class DecorationType {
      private cache = new Map<string | undefined, TextEditorDecorationType>();

      public resetTypeCache() {
            this.cache.forEach(option => {
                  option.dispose();
            });
            this.cache.clear();
      }

      public unfoldDecorationType = (langId: string): TextEditorDecorationType => {
            return window.createTextEditorDecorationType({
                  rangeBehavior: DecorationRangeBehavior.ClosedOpen,
                  opacity: getConfig<string>(SETTINGS.UNFOLDED_OPACITY, langId).toString()
            });
      };

      public plainDecorationType = (): TextEditorDecorationType => {
            return window.createTextEditorDecorationType({});
      };

      /**
       * Get the cached fold (mask) decoration type for a specific language.
       * @param langId The language id to get the decoration type for.
       * @returns The fold (mask) TextEditorDecorationType
       */
      public foldDecorationType(langId: string): TextEditorDecorationType {
            if (this.cache.has(langId)) {
                  return this.cache.get(langId) as TextEditorDecorationType;
            }
            const decorationType = window.createTextEditorDecorationType({
                  before: {
                        contentText: getConfig<string>(SETTINGS.MASK_CHAR, langId),
                        color: getConfig<string>(SETTINGS.MASK_COLOR, langId)
                  },
                  after: {
                        contentText: getConfig<string>(SETTINGS.AFTER, langId)
                  },
                  textDecoration: 'none; display: none;'
            });
            this.cache.set(langId, decorationType);
            return decorationType;
      }
}
