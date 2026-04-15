import { workspace, WorkspaceConfiguration } from 'vscode';
import { SETTINGS } from './enums';

export function getConfigPerLang<T>(section: string, languageId: string): T {
      // Get the configuration of the active language id
      const langConfig = workspace.getConfiguration(SETTINGS.IDENTIFIER, {
            languageId
      });
      // return the configuration for the given section
      return langConfig.get<T>(section);
}

export function getConfiguredLangs(): string[] {
      const extenstionConfig: WorkspaceConfiguration = workspace.getConfiguration(
            SETTINGS.IDENTIFIER
      );
      // skip unnecessary keys excludedSettings
      const excludedSettings: string[] = ['inlineFold', 'supportedLanguages'];
      const settings = Object.values(SETTINGS).filter(v => !excludedSettings.includes(v));
      const langs: string[] = [];
      settings.forEach(v => {
            const lang = extenstionConfig.inspect(v).languageIds;
            if (lang) {
                  langs.push(...lang);
            }
      });
      return langs;
}

export function getConfig<T>(section: SETTINGS, langId?: string): T {
      // Try to get language scope configuration, otherwise fallback to global configuration
      const getGlobal: WorkspaceConfiguration = workspace
            .getConfiguration(SETTINGS.IDENTIFIER)
            .get(SETTINGS.USE_GLOBAL);
      if (getGlobal || langId === undefined) {
            return workspace.getConfiguration(SETTINGS.IDENTIFIER).get(section) as T;
      } else {
            return getConfigPerLang<T>(section, langId);
      }
}

export function getRegexConfig(langId?: string): RegExp {
      const regex = getConfig<string>(SETTINGS.REGEX, langId);
      const flags = getConfig<string>(SETTINGS.REGEX_FLAGS, langId);
      return new RegExp(regex, flags);
}

export function getSupportedLanguages(): string[] {
      const langs: string[] = getConfig<string[]>(SETTINGS.SUPPORTED_LANGUAGES);
      const withLangs: string[] = getConfiguredLangs();
      const supported: string[] = [...new Set([...langs, ...withLangs])];
      return supported;
}
