# 输入

本目录是本批新写的合成输入，内容是虚构的图书馆借阅与调阅场景，不是真实馆务，也不取自客户资料。每个文件带 `synthetic: true`。

| 字段 | 含义 |
|---|---|
| `asset` | 用哪个件画：`rel-fan`、`rel-scope`、`rel-qualify`、`rel-tracks`、`rel-rail`、`rel-pair`、`rel-sheet` |
| `role` | `normal` 正常输入，`stress` 压力输入，`refuse` 应当被拒用的输入 |
| `refuse` | 仅 `refuse`：预期的拒用代码；实际代码不符时 build 失败 |
| `requirements` | 这份输入用来检验的需求 ID |
| `model` | 交给生成器的语义输入 |

F01、F02、F04、F06 四份 fixture 不在这里，留在上层的 [fixtures.json](../../fixtures.json)（修订 `20261004-r1`），由 `src/cases.mjs` 适配成模型，压力与反例输入也在那里由 fixture 修改得到。适配时有一处假设：F01 的 `proposal` 没有 `basis` 字段，按它的文字“复核 v2”绑定到最新的材料版本。F04 的三种偏移并存，适配时把标尺定为 UTC；它的 `presentation`（播放帧率和时长）是 Motion 的内容，静态图没有取。

`rail-*`、`pair-*` 和 `sheet-day` 是 0.3.0 加的，沿用同一张调阅单的内容。

这些输入已经用来调整过图形，不能再当作 SVG-05 的陌生内容。
