<p align="center">
    <img width="128" alt="preview" src="https://raw.githubusercontent.com/moalamri/vscode-inline-fold/master/res/icon.png">
</p>
<br />

<h2 align="center"> Inline Fold - VSCode Extension </h2>
<p align="center">
<img alt="preview" src="https://vsmarketplacebadge.apphb.com/version-short/moalamri.inline-fold.svg">
<img alt="preview" src="https://vsmarketplacebadge.apphb.com/downloads-short/moalamri.inline-fold.svg">
<img alt="preview" src="https://vsmarketplacebadge.apphb.com/installs-short/moalamri.inline-fold.svg">
<br/>
<img alt="preview" src="https://vsmarketplacebadge.apphb.com/rating-star/moalamri.inline-fold.svg">
</p>

### Inline Fold

VS Code Inline Fold extension mimics VS Code's [folding](https://code.visualstudio.com/docs/editor/codebasics#_folding) experience for inline code.
This is especially useful when working with frameworks like Tailwind CSS which use lots of utility classes that often disfigure code visual structure. You can expand the folds by clicking on them. You can also configure the extension to target specific attributes in your markup.
The characters used as a mask can be configured in the settings and you can update the regex expression to match any code pattern you want.
The extension also enables folding of attribute values within HTML/JSX tags. It makes your code tidy and easier to navigate.

<br />

<p align="center">
    <img width="650" alt="preview" src="https://raw.githubusercontent.com/moalamri/vscode-inline-fold/master/res/preview.png">
</p>

## Examples
> **Note**: The following examples uses unescaped regex, use VS Code Settings UI for easier escaping.
### React Component className value
These settings can help you fold your React component's className attribute values with template strings.
```
Regex to Match: (className)=(({(`|))|(['"`]))(.*?)(\2|(\4)})
Regex Flags: g
Regex Group: 6
```

### Fold class/className value after set number of characters. [#60](https://github.com/moalamri/vscode-inline-fold/issues/60)
Sometimes you have only a couple of short classnames which you don't necessarily want to fold, so you could modify the regex to only fold a list of classes if it's longer than 30 characters.

>**Note**: This doesn't work with template strings.
```
Regex to Match: (class|className)=[`'{"]([^`'"}]{30,})[`'"}]
Regex Flags: g
Regex Group: 2
```

### SVG
Embeded SVG also tend to have alot of code, that you just dont wanna focus on.
So with this settings below you can fold the ugly part.

**Note**: Minfing SVG maybe required for better experience. Beside we looking forward that this extension will support multiple Regex soon.
```
Regex to Match: <svg(\s*.*?\s*)<\/svg>
Regex Flags: gs
Regex Group: 2
```
<p align="center">
  <img width="40%" src="https://raw.githubusercontent.com/moalamri/vscode-inline-fold/master/res/svg-fold-settings.png">
  <img width="40%" src="https://raw.githubusercontent.com/moalamri/vscode-inline-fold/master/res/svg-fold.png">
</p>

### Markdown links
The extension is very useful for collapsing markdown link URLs [#70](https://github.com/moalamri/vscode-inline-fold/issues/70):
```
Regex: \[.*\]\((.*)\)
Regex Flags: g
Regex Group: 1
Supported languages: markdown
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


## Running the extension
You can install the extension <a href="https://marketplace.visualstudio.com/items?itemName=moalamri.inline-fold"> in the marketplace here</a>. If you encounter any issue or would like to contribute, <a href="https://github.com/moalamri/vscode-inline-fold">visit the GitHub page</a>.

### Notes
* Use settings UI to configure the extension (better for regex escaping).
* If the extension doesn't work, then check for your language id, you can add it from the settings under `inlineFold.supportedLanguages` using the specific language Id.
* You can set a keyboard shortcut to toggle the folding on and off. Search for "Inline Fold" in the commands panel, then click the gear icon and set the desired keybinding.

Current default language Ids (see [here](https://code.visualstudio.com/docs/languages/identifiers#_known-language-identifiers) for more):
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
<a href="https://github.com/moalamri/inline-fold/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=moalamri/vscode-inline-fold" />
</a>

Screenshot by [Cody](https://github.com/ccccooooddddyyyy)
