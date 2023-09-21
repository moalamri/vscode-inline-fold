import { Settings } from "./enums";
import { ExtSettings } from "./settings";

class CacheClass {
  private static _instance: CacheClass;
  public static get Instance(): CacheClass {
    this._instance = this._instance ? this._instance : new CacheClass();
    return this._instance;
  }
  CacheMap = new Map<string | undefined, boolean>();

  // Get the autoFold setting
  private autoFold(langId?: string) {
    return ExtSettings.Get<boolean>(Settings.autoFold, langId);
  }

  // Get the togglePerFile setting
  private togglePerFile(langId?: string) {
    return ExtSettings.Get<boolean>(Settings.togglePerFile, langId)
  }

  // Set the state of the extension
  public SetShouldFold(key: string | undefined, shouldToggle: boolean, langId?: string) {
    if (this.togglePerFile(langId)) {
      this.CacheMap.set(key, shouldToggle);
    } else {
      this.CacheMap.set("global", shouldToggle);
    }
  }

  // Get the state of the extension
  public ShouldFold(key: string | undefined, langId?: string): boolean {
    if (this.togglePerFile(langId)) {
      return this.CacheMap.get(key) ?? this.autoFold(langId);
    } else {
      return this.CacheMap.get("global") ?? this.autoFold(langId);
    }
  }

  // Toggle the state of the extension
  public ToggleShouldFold(key: string | undefined, langId?: string) {
    this.SetShouldFold(key, !this.ShouldFold(key, langId), langId)
  }

  // Clear the state cache
  public Clear() {
    this.CacheMap.clear();
  }

  constructor () { }
}

// We will use singleton pattern to make sure that we only have one instance of the state
export const Cache = CacheClass.Instance;
