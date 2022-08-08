import { ConfigurationScope, workspace, WorkspaceConfiguration } from "vscode";
import { Configs, PerLanguageOptions } from "./enums";

class ExtensionConfig {
  private static _instance: ExtensionConfig;
  public static get instance(): ExtensionConfig {
    if (!ExtensionConfig._instance) {
      ExtensionConfig._instance = new ExtensionConfig();
    }
    return ExtensionConfig._instance;
  }
  private configs: WorkspaceConfiguration;

  /**
   * Get the workspace configuration for the given language
   * @param _languageId : editor's active language id
   * @returns Workspace configration scoped for specific languageid
   */
  private WorkSpaceConfig(_languageId: string): WorkspaceConfiguration {
    return workspace.getConfiguration(Configs.identifier, {
      languageId: _languageId
    });
  }

  /**
   * Gets triggered when any of the extension configuration changes.
   * @param _configs : the key of the configuration
   * @param _languageid : editor's active language id
   */
  public UpdateConfigs(_configs: WorkspaceConfiguration, _languageid?: string) {
    this.configs = _configs;
  }

  /**
   * 
   * @param _section : the key of the configuration
   * @param _languageId : editor's active language id
   * @returns Language's scoped configuration or fall back to global configuration
   */
  public get<T>(_section: Configs | PerLanguageOptions): T {
    return this.configs.get<T>(_section);
  }

  /**
   * Check if the active editor's language has configuration
   * for the given key.
   * @param _section : the key of the configuration
   * @param _languageid : editor's active language id
   * @returns {boolean} true if the language has the configuration
   */
  public HasLanguageConfigs(_section: Configs, _languageid?: string): boolean {
    const config = this.configs.inspect(_section);
    if (!config.languageIds) return false;
    return true
  }

  public GetLanguageConfig<T>(_section: Configs | PerLanguageOptions, _languageId: string): T {
    const scope: ConfigurationScope = {
      languageId: _languageId,
    };
    const config: T = workspace.getConfiguration(`${Configs.identifier}`, scope).get<T>(_section);
    if(!config) return;
    return config;
  }


  /**
   * Wildcard language scoped configuration 
   */
  constructor () {}
}

// Yes, a singleton :0
export const ExtensionConfigs = ExtensionConfig.instance;