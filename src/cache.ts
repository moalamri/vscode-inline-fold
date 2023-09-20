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
  private autoFold() {
    return ExtSettings.Get<boolean>(Settings.autoFold);
  }

  // Get the togglePerFile setting
  private togglePerFile() {
    return ExtSettings.Get<boolean>(Settings.togglePerFile)
  }

  // Set the state of the extension
  public SetShouldFold(key: string | undefined, shouldToggle: boolean) {
    if (this.togglePerFile()) {
      this.CacheMap.set(key, shouldToggle);
    } else {
      this.CacheMap.set("global", shouldToggle);
    }
  }

  // Get the state of the extension
  public ShouldFold(key: string | undefined): boolean {
    if (this.togglePerFile()) {
      return this.CacheMap.get(key) ?? this.autoFold();
    } else {
      return this.CacheMap.get("global") ?? this.autoFold();
    }
  }

  // Toggle the state of the extension
  public ToggleShouldFold(key: string) {
    this.SetShouldFold(key, !this.ShouldFold(key))
  }

  // Clear the state cache
  public Clear() {
    this.CacheMap.clear();
  }

  constructor () { }
}

// We will use singleton pattern to make sure that we only have one instance of the state
export const Cache = CacheClass.Instance;
