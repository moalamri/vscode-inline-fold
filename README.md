<p align="center">
    <img src="./res/icon.png" width="128" />
</p>

<p align="center"> 
<a href="https://marketplace.visualstudio.com/items?itemName=moalamri.inline-fold"> Download</a>
</p>

<p align="center">
    <img src="./res/carbon.png" />
</p>


## VS Code Inline Fold Extension

VS Code Inline Fold extension mimics VS Code's [folding](https://code.visualstudio.com/docs/editor/codebasics#_folding) experience for inline code.

The extension works great with utility-first CSS framework such as Tailwind CSS. It makes your code more readable by masking long strings of CSS classes.

The code can be folded/unfolded by clicking on or selecting the code block mask.

The characters used as a mask can be configured in the settings and you can update the regex expression to match any code pattern you want.

### Available Settings:
- `inlineFold.regex` regex pattern that will be used to mask the code block
- `inlineFold.regexFlags` regex flags
- `inlineFold.regexGroup` regex group that match the code that should be folded
- `inlineFold.unfoldedOpacity` opacity of the masked code block when unfolded or highlighted
- `inlineFold.maskChar` text/character to mask the code when it is folded
- `inlineFold.maskColor` color of the mask character(s)
- `inlineFold.after` an optional text/character that will be appended to the end of folded code

### Notes!
- Use settings UI to configure the extension.
- No registered commands yet.
- I would love to hear some suggestions :)


<a href="CHANGELOG.md">Changelog</a>
