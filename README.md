<p align="center">
    <img src="./res/icon.png" width="128" />
</p>
<br />

## Inline Fold - VSCode Extension
⚠️ NOTICE: this extension is still under development! ⚠️

<br />

An extension that enables inline folding of attribute values within HTML/JSX tags. It makes your code tidy and easier to navigate.

This is especially useful when working with frameworks like Tailwind CSS which use lots of utility classes that often disfigure code visual structure. You can expand the folds by clicking on them. You can also configure the extension to target specific attributes in your markup.

<p align="center">
    <img src="./res/carbon.png" />
</p>

### Supported languages

If the extension doesn't work for your language out of the box, you can add it from the settings:

- `javascript`
- `typescript`
- `javascriptreact`
- `typescriptreact`
- `vue`
- `vue-html`
- `html`
- etc . . . *Check here for <a href="https://code.visualstudio.com/docs/languages/identifiers#_known-language-identifiers">more options</a>*

### Available Settings
- `inlineFold.regex` regex to match the code line
- `inlineFold.regexFlags` regex flags
- `inlineFold.regexGroup` regex group that match the code that should be folded
- `inlineFold.unfoldedOpacity` opacity of the unfolded code when it's clicked or is selected
- `inlineFold.maskChar` text/character to mask the code when it is folded
- `inlineFold.maskColor` color of the mask character
- `inlineFold.after` an optional text/character to append to the end of folded code

### Running the extension
You can install the extension <a href="https://marketplace.visualstudio.com/items?itemName=moalamri.inline-fold"> in the marketplace here</a>. If you encounter any issue or would like to contribute, <a href="https://github.com/moalamri/vscode-inline-fold">visit the GitHub page</a>.

### Notes
- Use settings UI to configure the extension.
- No registered commands yet.
- I would love to hear your suggestions. 😃

### Changelog
See the project's <a href="CHANGELOG.md"> changelog</a> here.
