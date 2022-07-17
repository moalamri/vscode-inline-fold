import { ConfigurationScope, workspace, WorkspaceConfiguration } from "vscode";
import { Configs } from "./enums";

class ExtensionConfig {
  private static _instance: ExtensionConfig;
  public static get instance(): ExtensionConfig {
    if (!ExtensionConfig._instance) {
      ExtensionConfig._instance = new ExtensionConfig();
    }
    return ExtensionConfig._instance;
  }
  private languageConfig: WorkspaceConfiguration;

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
    this.languageConfig = _configs;
  }

  /**
   * 
   * @param _section : the key of the configuration
   * @param _languageId : editor's active language id
   * @returns Language's scoped configuration or fall back to global configuration
   */
  public get<T>(_section: Configs, _languageId: string): T {
    const config = this.WorkSpaceConfig(_languageId).get<T>(_section);
    return config ? config : this.languageConfig.get<T>(_section);
  }

  /**
   * This function will return the supported languages by using the old config key
   * and return all the languages that have custom configuration for the extension
   * @returns {array} of supported language ids
   */
  public GetSupportedLanguages(): string[] {
    const scope: ConfigurationScope = {
      languageId: "*",
    };
    const scopedLanguages = workspace
      .getConfiguration(Configs.identifier, scope)
      .inspect(Configs.decorationOptions).languageIds || [];
    return [...new Set(scopedLanguages
      .concat(...this.languageConfig
        .get(Configs.supportedLanguages) as string[]))];
  }


  /**
   * Check if the active editor's language has configuration
   * fot the given key.
   * @param _section : the key of the configuration
   * @param _languageid : editor's active language id
   * @returns {boolean} true if the language has the configuration
   */
  public HasLanguageConfigs(_section: Configs, _languageid?: string): boolean {
    const config = this.languageConfig.inspect(_section);
    if (!config.languageIds) return false;
    return true
  }

  /**
   * This will force to return the configuration for the given language 
   * regardless of how VS Code is ordering configuration
   * @param _section: the key of the configuration
   * @param _languageid: editor's active language id
   * @returns configuration value
   */
  public GetLanguageScopedConfig<T>(_section: Configs, _languageid: string) {
    if (this.HasLanguageConfigs(_section, _languageid)) {
      return workspace.getConfiguration(Configs.identifier, {
        languageId: _languageid
      }).get<T>(_section);
    }
    return;
  }

  /**
   * Another attempt to get language scoped configuration, this one is independent.
   * TODO: decide which one to use later ..
   * @param {Configs} _section: the key of the configuration
   * @param {string} _key - The key of the config value you want to get.
   * @returns The value of the key in the config file.
   */
  public GetLanguageConfigValue(_section: Configs, _key: string): any {
    const config = this.languageConfig.inspect(_section);
    for (let k in config) {
      if (typeof config[k][_key] !== "undefined") {
        return config[k][_key];
      }
    }
    return;
  }

  /**
   * Wildcard language scoped configuration 
   */
  constructor () {
    this.languageConfig = workspace.getConfiguration(Configs.identifier, {
      languageId: "*"
    });
  }
}

// Yes, a singleton :0
export const ExtensionConfigs = ExtensionConfig.instance;