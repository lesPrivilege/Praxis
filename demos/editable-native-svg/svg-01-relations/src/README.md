# 源码

四个生成器和它们共用的底层，没有依赖，Node 18 以上即可运行；本批在 Node v25.9.0 下运行。

| 文件 | 职责 |
|---|---|
| `kernel.mjs` | 文字估宽与换行、SVG 节点、实例作用域内的 ID、指向（`anchor`）、图例、拒用（`Refusal`） |
| `standing.mjs` | 成立程度与归属的词表，以及每个取值的线型和端点 |
| `fan.mjs` | `rel-fan`：一个对象的分支或汇合 |
| `scope.mjs` | `rel-scope`：容器、成员与跨界关系 |
| `qualify.mjs` | `rel-qualify`：条件、注释、证据各自限定的主张或片段 |
| `tracks.mjs` | `rel-tracks`：各对象的版本线与绑定 |
| `sheet.mjs` | `rel-sheet`：把几件图叠成一张，按共同的指向连线 |
| `cases.mjs` | 输入清单：`inputs/` 里的文件、上层 `fixtures.json` 的适配、在两者上做的语义修改 |
| `build.mjs` | 重建 `svg/`、`svg/manifest.json` 和 `index.html` |
| `check.mjs` | 自动检查，结果写入 `evidence/check.json` |

每个生成器的签名相同：`gen(model, { width, scope })`，返回 `{ svg, width, height, boxes, labels, mentions, marks, equivalent }`。`scope` 由调用方传入，是这个实例里所有 DOM ID 的前缀；`boxes` 和 `labels` 的坐标与 SVG 的 viewBox 同一坐标系，单位是 SVG 用户单位。输入不合法或超出已测试的容量时抛出 `Refusal`，带 `code` 和可以直接给人看的理由。

文字宽度在 Node 里只能估算。估算刻意偏宽，`check.mjs` 的浏览器段用实际渲染结果核对；换字体或换平台后应重跑。
