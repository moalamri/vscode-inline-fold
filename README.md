<p align="center">
    <img width="128" alt="preview" src="https://user-images.githubusercontent.com/964077/179586355-6d90c66a-6812-4ab7-9657-4596dd1b2a62.png">
</p>
<br />

## Inline Fold - VSCode Extension
> ⚠️ NOTICE: this extension is still under active development! ⚠️

## VS Code Inline Fold Extension

VS Code Inline Fold extension mimics VS Code's [folding](https://code.visualstudio.com/docs/editor/codebasics#_folding) experience for inline code.
This is especially useful when working with frameworks like Tailwind CSS which use lots of utility classes that often disfigure code visual structure. You can expand the folds by clicking on them. You can also configure the extension to target specific attributes in your markup.
The characters used as a mask can be configured in the settings and you can update the regex expression to match any code pattern you want.
The extension also enables folding of attribute values within HTML/JSX tags. It makes your code tidy and easier to navigate.

<br />

<p align="center">
    <img width="650" alt="preview" src="https://user-images.githubusercontent.com/964077/179401349-4b217316-3099-47d0-a8b0-10fb2381d105.png">
</p>

### SVG As For Another USE Case
Embeded SVG also tend to have alot of code, that you just dont wanna focus on.
So with this settings below you can fold the ugly part.
```
Regex to Match: <svg(\s*.*?\s*)<\/svg>
Regex Flags: gs
```
**Note**: Minfing SVG maybe required for better experience.Beside we looking forward that this extension will support multiple Regex soon.


<div class="flex">
    <img width="40%" alt="preview" src="https://github.com/n4j1Br4ch1D/vscode-inline-fold/blob/master/res/svg-fold.png">
    <img width="40%" alt="preview" src="https://github.com/n4j1Br4ch1D/vscode-inline-fold/blob/master/res/svg-fold-settings.png">
</div>

### Available Settings
- `inlineFold.regex` regex to match the code line
- `inlineFold.regexFlags` regex flags
- `inlineFold.regexGroup` regex group that match the code that should be folded
- `inlineFold.unfoldedOpacity` opacity of the unfolded code when it's clicked or is selected
- `inlineFold.maskChar` text/character to mask the code when it is folded
- `inlineFold.maskColor` color of the mask character(s)
- `inlineFold.after` an optional text/character that will be appended to the end of folded code
- `inlineFold.supportedLanguages` a list of targeted language Ids
- `inlineFold.unfoldOnLineSelect` unfold the line when any part of the line is selected


### Running the extension
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
- `javascript`
- `typescript`
- `javascriptreact`
- `typescriptreact`


### Known Issues
* Currently template literals are not fully supported.

### Changelog
See the project's <a href="CHANGELOG.md"> changelog</a> here.

### Contributors
<a href="https://github.com/moalamri/vscode-inline-fold/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=moalamri/vscode-inline-fold" />
</a>

Screenshot by [Cody](https://github.com/ccccooooddddyyyy)
