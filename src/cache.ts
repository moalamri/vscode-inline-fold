import { window } from "vscode";
import { Settings } from "./enums";
import { ExtSettings } from "./settings";

class CacheClass {
  private static _instance: CacheClass;
  public static get Instance(): CacheClass {
    this._instance = this._instance ? this._instance : new CacheClass();
    return this._instance;
  }
  StateCache: Map<string, boolean> = new Map<string, boolean>();

  autoFold() {
    return ExtSettings.Get<boolean>(Settings.autoFold);
  }

  init() {
    this.State = this.autoFold();
  }

  set State(_state: boolean) {
    this.StateCache.set(window.activeTextEditor?.document.uri.path, _state);
  }

  get State(): boolean {
    const state = this.StateCache.get(window.activeTextEditor?.document.uri.path);
    if(state === undefined) {
      this.init();
      return this.State;
    } else {
      return state;
    }
  }

  public ToggleState() {
    this.State = !this.State;
  }

  public ClearCache() {
    this.StateCache.clear();
  }

  constructor() {}
}

// We will use singleton pattern to make sure that we only have one instance of the class
export const Cache = CacheClass.Instance;