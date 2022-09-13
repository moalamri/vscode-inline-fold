## Change log:

<br/>

> ### 0.2.0:
    - Added: support for language scoped settings.
    - Added: custom cache for the decorations per languageid (to avoid re-rendering the decorations when the language changes).
    - Fixed: [#23](https://github.com/moalamri/vscode-inline-fold/issues/23)
    - Exposed some DecorationInstanceRenderOptions to allow for customizating the decoration.

### v 0.1.7
- feat: Add settings for auto-unfold when any part of the line is selected. [@Zoha](https://github.com/Zoha)

> ### v 0.1.6
- fix: [#24](https://github.com/moalamri/vscode-inline-fold/issues/24) by [@JasperSurmont](https://github.com/JasperSurmont)

> ### v 0.1.5
- cleaned up debugging code & removed unused imports

> ### v 0.1.4
- fix: [#19](https://github.com/moalamri/vscode-inline-fold/issues/19)
- fix: [#17](https://github.com/moalamri/vscode-inline-fold/issues/17)
- optimized events debouncing.

> ### v 0.1.2
- fix: [#17](https://github.com/moalamri/vscode-inline-fold/issues/17)

> ### v 0.1.1
- (hotfix) Fixed issue that could cause the extension to crash.

> ### v 0.1.0
- new: offsets to the visible part of the editor.
- new: support for react out of the box [#9](https://github.com/moalamri/vscode-inline-fold/issues/9) [#10](https://github.com/moalamri/vscode-inline-fold/issues/10) [#12](https://github.com/moalamri/vscode-inline-fold/issues/12)
- new: registered toggle command [#1](https://github.com/moalamri/vscode-inline-fold/issues/1)
- update: default regex to support react.
- fixed: multi cursor selection doesn't unfold text [#6](https://github.com/moalamri/vscode-inline-fold/issues/6)
- fixed: no decoration when file has lines lower than visiual range

> ### v 0.0.8
- perf: new approach to boost performance [#2](https://github.com/moalamri/vscode-inline-fold/issues/2)

> ### v 0.0.7
- Working version