import { WorkspaceConfiguration } from "vscode";
import { Settings } from "./enums";

class ExtensionSettings {
  private static _instance: ExtensionSettings;
  public static get instance(): ExtensionSettings {
    if (!ExtensionSettings._instance) {
      ExtensionSettings._instance = new ExtensionSettings();
    }
    return ExtensionSettings._instance;
  }
  private configs: WorkspaceConfiguration;


  /**
   * Gets triggered when any of the extension configuration changes.
   * @param _configs : the key of the configuration
   * @param _languageid : editor's active language id
   */
  public Update(_configs: WorkspaceConfiguration, _languageid?: string) {
    this.configs = _configs;
  }

  /**
   * Get typed configuration for the given settings key
   * @param _section : the key of the configuration
   * @param _languageId : editor's active language id
   * @returns Language's scoped configuration or fall back to global configuration
   */
  public Get<T>(_section: Settings): T {
    return this.configs.get<T>(_section);
  }

  constructor () {}
}

// Yes, a singleton :0
export const ExtSettings = ExtensionSettings.instance;