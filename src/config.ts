import { WorkspaceConfiguration, workspace, ConfigurationScope } from "vscode";
import { Configs } from "./enums";

export class ExtensionConfig {
  private workspaceConfig: WorkspaceConfiguration;

  public getConfig(_section: Configs, _languageid: string) {
    const languageConfig = this.getLanguageScopedConfig(_section, _languageid);
    return languageConfig ? languageConfig : this.workspaceConfig.get(_section);
  }

  private getLanguageScopedConfig(_section: Configs, _languageid: string) {
    const scope: ConfigurationScope = { 
      languageId: _languageid
    };
    const languageConfig = workspace.getConfiguration(Configs.identifier, scope);
    return languageConfig.get(_section);
  }

  constructor() {
    this.workspaceConfig = workspace.getConfiguration(Configs.identifier);
  }
}