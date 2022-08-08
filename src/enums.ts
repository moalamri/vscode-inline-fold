export enum Commands {
   InlineFoldToggle = "inlineFold.toggle",
}

export enum Configs {
   identifier = "inlineFold",
   languageId = "languageId",
   regex = "regex",
   regexFlags = "regexFlags",
   regexGroup = "regexGroup",
   maskChar = "maskChar",
   maskColor = "maskColor",
   unfoldedOpacity = "unfoldedOpacity",
   after = "after",
   supportedLanguages = "supportedLanguages",
   perLanguageOptions = "perLanguage.options"
}

export enum PerLanguageOptions {
   before = `perLanguage.options.before`,
   start = "perLanguage.options.start",
   end = "perLanguage.options.end",
}