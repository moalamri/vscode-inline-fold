import { SETTINGS } from './enums';
import { getConfig } from './config';

export default class FoldState {
      private cache = new Map<string | undefined, boolean>();

      // Get the togglePerFile setting
      private togglePerFile(langId?: string) {
            return getConfig<boolean>(SETTINGS.TOGGLE_PER_FILE, langId);
      }

      // Set the state of the extension
      public setShouldFold(key: string | undefined, shouldToggle: boolean, langId?: string) {
            key = key || 'global'; // Default to 'global' if key is undefined
            if (this.togglePerFile(langId)) {
                  this.cache.set(key, shouldToggle);
            } else {
                  this.cache.set(key, shouldToggle);
            }
      }

      // Get the state of the extension
      public shouldFold(key: string | undefined, langId?: string): boolean {
            key = key || 'global'; // Default to 'global' if key is undefined
            // Get the autoFold setting
            const autoFold = getConfig<boolean>(SETTINGS.AUTOFOLD, langId);
            if (this.togglePerFile(langId)) {
                  return this.cache.get(key) ?? autoFold;
            } else {
                  return this.cache.get('global') ?? autoFold;
            }
      }

      // Toggle the state of the extension
      public toggleShouldFold(key: string | undefined, langId?: string) {
            key = key || 'global'; // Default to 'global' if key is undefined
            // Toggle the state for the given key
            this.setShouldFold(key, !this.shouldFold(key, langId), langId);
      }

      // Clear the state cache
      public reset() {
            this.cache.clear();
      }
}
