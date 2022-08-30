import { WorkspaceConfiguration } from "vscode";
import { CONFIGS } from "./enums";

class ExtSettingsInstance {
  private static sharedInstance: ExtSettingsInstance;
  public static get instance(): ExtSettingsInstance {
    if (!ExtSettingsInstance.sharedInstance) {
      ExtSettingsInstance.sharedInstance = new ExtSettingsInstance();
    }
    return ExtSettingsInstance.sharedInstance;
  }

  // Workspace extension's configuration.
  private configs: WorkspaceConfiguration;

  /*
  * Get the current state of the extension.
  */
  private get currentState(): boolean {
    return this.configs.get<boolean>(CONFIGS.ENABLED);
  }

  /**
   * Triggered when any of the extension's configuration changes.
   * @param _configs : the key of the configuration
   */
  public UpdateConfigs(_configs: WorkspaceConfiguration) {
    this.configs = _configs;
  }

  /**
   * Set the extension default state either to be activated or not.
   */
  public setDefault() {
    this.configs.update(CONFIGS.ENABLED, !this.currentState);
  }

  /**
   * Get typed configs.
   * @param section : the key of the configuration
   * @returns Workspace extension's configuration value of the section
   */
  public get<T>(section: CONFIGS): T {
    return this.configs.get<T>(section);
  }

  constructor () { }
}

/**
 * Shared instance of the extension config. 
 * Yes, a singleton :0
 */
export const ExtSettings = ExtSettingsInstance.instance;