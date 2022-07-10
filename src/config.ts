import { WorkspaceConfiguration, window, workspace } from "vscode";
import { Configs } from "./enums";

export class ConfigsManager {
  private workspaceConfig: WorkspaceConfiguration = workspace.getConfiguration(Configs.identifier);

  public getConfig(section: Configs): string {
    return this.workspaceConfig.get(section).toString();
  }

  public getLanguageConfig(section: Configs): string {
    return this.workspaceConfig.inspect(section).defaultLanguageValue?.toString();
  }

  constructor() {

  }
}