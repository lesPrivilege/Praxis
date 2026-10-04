# 证据

| 文件 | 内容 | 怎么得到 |
|---|---|---|
| `check.json` | 自动检查的逐项结果、Node 与浏览器版本 | `node src/check.mjs` |
| `probe.html` | 浏览器段用的页面：全部 SVG（含组合图）、十个同款实例和三张故意画错的对照图 | 同上，每次运行重写 |
| `wide-fan.png`、`wide-scope-qualify.png`、`wide-tracks.png`、`wide-sheet.png` | 预览页在 1440 宽视口下的四段截图，宽版与窄版并置；0.2.0 重新截过 | 本机 Chrome 无界面模式截整页后裁切 |
| `narrow-375.png` | 预览页在 375 宽视口下的三段截图 | 本机 Chrome 无界面模式，预览页放进 375 宽的 iframe 后截图（无界面窗口最窄 500） |

截图是作者看图的依据，不是独立看图或读者效果的证据。看过哪些图、没有看哪些，见 [验收回执](../acceptance.md)。
