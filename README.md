<p align="center">
    <img width="256" alt="preview" src="https://raw.githubusercontent.com/moalamri/vscode-inline-fold/master/res/icon.png">
</p>
<br />

<h2 align="center"> Inline Fold - VSCode Extension </h2>

### Inline Fold

VS Code Inline Fold extension mimics VS Code's [folding](https://code.visualstudio.com/docs/editor/codebasics#_folding) experience for inline code.
This is especially useful when working with frameworks like Tailwind CSS which use lots of utility classes that often disfigure code visual structure. You can expand the folds by clicking on them. You can also configure the extension to target specific attributes in your markup.
The characters used as a mask can be configured in the settings and you can update the regex expression to match any code pattern you want.
The extension also enables folding of attribute values within HTML/JSX tags. It makes your code tidy and easier to navigate.

<br />

<p align="center">
    <img width="650" alt="preview" src="https://raw.githubusercontent.com/moalamri/vscode-inline-fold/master/res/preview.png">
</p>

## Settings
There are two ways to configure the extension, both can be done either by using VS Code Settings UI, or by editing user/workspace json settings file. We will cover both ways `Global Settings` and `Language-specific Settings`.
### Global Settings
You can configure the extension from the settings UI under `User` or `Workspace` tabs (or by editing the json settings file).
```jsonc
{
  "inlineFold.regex": "(class|className)=[`'{\"]([^`'\"}]{30,})[`'\"}]",
  "inlineFold.regexFlags": "g",
  "inlineFold.regexGroup": 2,
  "inlineFold.unfoldedOpacity": 0.6,
  "inlineFold.maskChar": "…",
  "inlineFold.maskColor": "#000",
  "inlineFold.supportedLanguages": ["javascriptreact", "typescriptreact"],
  "inlineFold.unfoldOnLineSelect": true,
  "inlineFold.autoFold": true
}
```
This will be the default settings for all languages in `inlineFold.supportedLanguages`. You can override these settings for specific languages by using `Language-specific Settings` (see below).
### Language-specific Settings
You can also configure the extension from the language-specific settings. This is useful if you want to configure the extension for a specific language.
For example:
```jsonc
{
  "[html]": {
    "inlineFold.regex": "class=\"([\\w\\s. -:\\[\\]]+)\"",
    "inlineFold.regexFlags": "g",
    "inlineFold.regexGroup": 1
  }
}
```
The above settings will be applied only for HTML files.

> **Note**: The extension will first check for language-specific settings, then fallback to global settings if not found.

## Keyboard Shortcuts
All the extension's commands are available under `Inline Fold` command group. No default keyboard shortcuts are provided, but you can add your own shortcuts for the commands.

## Examples
### React Component className value
These settings can help you fold your React component's className attribute values with template strings.
```jsonc
{
  "inlineFold.regex": "(className)=(({(`|))|(['\"`]))(.*?)(\\2|(\\4))",
  "inlineFold.regexFlags": "g",
  "inlineFold.regexGroup": 6
}
```

### Fold class/className value after set number of characters. [#60](https://github.com/moalamri/vscode-inline-fold/issues/60)
Sometimes you have only a couple of short classnames which you don't necessarily want to fold, so you could modify the regex to only fold a list of classes if it's longer than 30 characters.

>**Note**: This doesn't work with template strings.
```jsonc
{
  "inlineFold.regex": "(class|className)=[`'{\"]([^`'\"}]{30,})[`'\"}]",
  "inlineFold.regexFlags": "g",
  "inlineFold.regexGroup": 2
}
```

### SVG
Embeded SVG also tend to have alot of code, that you just dont wanna focus on.
So with this settings below you can fold the ugly part.

**Note**: Minfing SVG maybe required for better experience. Beside we looking forward that this extension will support multiple Regex soon.
```jsonc
{
  "inlineFold.regex":  "<svg(\\s*.*?\\s*)<\/svg>",
  "inlineFold.regexFlags": "gs",
  "inlineFold.regexGroup": 1
}
```

<p align="center">
  <img width="40%" src="https://raw.githubusercontent.com/moalamri/vscode-inline-fold/master/res/svg-fold-settings.png">
  <img width="40%" src="https://raw.githubusercontent.com/moalamri/vscode-inline-fold/master/res/svg-fold.png">
</p>

### Markdown links
The extension is very useful for collapsing markdown link URLs [#70](https://github.com/moalamri/vscode-inline-fold/issues/70):
```jsonc
{
  "inlineFold.regex": "\\[.*\\]\\((.*)\\)",
  "inlineFold.regexFlags": "g",
  "inlineFold.regexGroup": 1,
  "inlineFold.supportedLanguages": ["markdown"]
}
```
Or, as a language-specific setting:
```jsonc
{
  "[markdown]": {
    "inlineFold.regex": "\\[.*\\]\\((.*)\\)",
    "inlineFold.regexFlags": "g",
    "inlineFold.regexGroup": 1
  }
}
```

<p align="center">
  <img width="30%" src="https://raw.githubusercontent.com/moalamri/vscode-inline-fold/master/res/markdown-example.png">
</p>

## Available Settings
- `inlineFold.regex` regex to match the code line
- `inlineFold.regexFlags` regex flags
- `inlineFold.regexGroup` regex group that match the code that should be folded
- `inlineFold.unfoldedOpacity` opacity of the unfolded code when it's clicked or is selected
- `inlineFold.maskChar` text/character to mask the code when it is folded
- `inlineFold.maskColor` color of the mask character(s)
- `inlineFold.after` an optional text/character that will be appended to the end of folded code
- `inlineFold.supportedLanguages` a list of targeted language Ids
- `inlineFold.unfoldOnLineSelect` unfold the line when any part of the line is selected
- `inlineFold.autoFold` the default state of inline folding when opening a file
- `inlineFold.useGlobal` force to use the global settings for all languages


## Running the extension
You can install the extension <a href="https://marketplace.visualstudio.com/items?itemName=moalamri.inline-fold"> in the marketplace here</a>. If you encounter any issue or would like to contribute, <a href="https://github.com/moalamri/vscode-inline-fold">visit the GitHub page</a>.

### Notes
* Use settings UI to configure the extension (better for regex escaping).
* If the extension doesn't work, then check for your language id, you can add it from the settings under `inlineFold.supportedLanguages` using the specific language Id.
* You can set a keyboard shortcut to toggle the folding on and off. Search for "Inline Fold" in the commands panel, then click the gear icon and set the desired keybinding.

Current default language Ids (see [here](https://code.visualstudio.com/docs/languages/identifiers#_known-language-identifiers) for more):
- `astro`
- `vue`
- `html`
- `svelte`
- `vue-html`
- `php`
- `blade`
- `erb`
- `twig`
- `nunjucks`
- `django-html`
- `jinja-html`
- `javascript`
- `typescript`
- `javascriptreact`
- `typescriptreact`


### Known Issues
If you encounter any problems, you can open an issue at the extension's <a href="https://github.com/moalamri/vscode-inline-fold">GitHub repository</a>

### Changelog
See the project's <a href="CHANGELOG.md"> changelog</a> here.

### Contributors
<a href="https://github.com/moalamri/vscode-inline-fold/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=moalamri/vscode-inline-fold" />
</a>
