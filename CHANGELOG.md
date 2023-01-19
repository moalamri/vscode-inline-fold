## Change log:

<br/>

> ### v0.2.0
- feat: add language-specific settings [#27](https://github.com/moalamri/vscode-inline-fold/issues/27) by [@Zer0xTJ](https://github.com/Zer0xTJ)
- feat: add astro as a supported language by [@Aunali321](https://github.com/Aunali321)

> ### v0.1.10:
- fix: [#63](https://github.com/moalamri/vscode-inline-fold/issues/63)

> ### v0.1.9:
- fix: extension crashing when the regex is misconfigured.
- now all the extensions commands starts with `Inline Fold:`

> ### v0.1.8:
- feat: each session will have its own folding state (per file).
- new: an option for default folding state when new file is opened [#53](https://github.com/moalamri/vscode-inline-fold/issues/53) `inlineFold.autoFold`
- new: a command to clear the current session folding state `Inline Fold: Clear session cache`.
- fix: [#23](https://github.com/moalamri/vscode-inline-fold/issues/23)
- fix: [#50](https://github.com/moalamri/vscode-inline-fold/issues/50) by [@e-medeiros](https://github.com/e-medeiros)
- fix: [#46](https://github.com/moalamri/vscode-inline-fold/issues/46) by [@e-medeiros](https://github.com/e-medeiros)
- fix: [#39](https://github.com/moalamri/vscode-inline-fold/issues/39) by [@e-medeiros](https://github.com/e-medeiros)
- fix: [#20](https://github.com/moalamri/vscode-inline-fold/issues/20) by [@e-medeiros](https://github.com/e-medeiros)
- perf: custom cache for the decorations per languageid (to avoid re-rendering the decorations when the language changes).

> ### v0.1.7
- new: add settings for auto-unfold when any part of the line is selected. [@Zoha](https://github.com/Zoha)

> ### v0.1.6
- fix: [#24](https://github.com/moalamri/vscode-inline-fold/issues/24) by [@JasperSurmont](https://github.com/JasperSurmont)

> ### v0.1.5
- cleaned up debugging code & removed unused imports

> ### v0.1.4
- fix: [#19](https://github.com/moalamri/vscode-inline-fold/issues/19)
- fix: [#17](https://github.com/moalamri/vscode-inline-fold/issues/17)
- optimized events debouncing.

> ### v0.1.2
- fix: [#17](https://github.com/moalamri/vscode-inline-fold/issues/17)

> ### v0.1.1
- (hotfix) Fixed issue that could cause the extension to crash.

> ### v0.1.0
- new: offsets to the visible part of the editor.
- new: support for react out of the box [#9](https://github.com/moalamri/vscode-inline-fold/issues/9) [#10](https://github.com/moalamri/vscode-inline-fold/issues/10) [#12](https://github.com/moalamri/vscode-inline-fold/issues/12)
- new: registered toggle command [#1](https://github.com/moalamri/vscode-inline-fold/issues/1)
- update: default regex to support react.
- fixed: multi cursor selection doesn't unfold text [#6](https://github.com/moalamri/vscode-inline-fold/issues/6)
- fixed: no decoration when file has lines lower than visiual range

> ### v0.0.8
- perf: new approach to boost performance [#2](https://github.com/moalamri/vscode-inline-fold/issues/2)

> ### v0.0.7
- init version