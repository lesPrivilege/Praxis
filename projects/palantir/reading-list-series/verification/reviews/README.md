# 审阅原始记录

各轮审阅代理交回的原始结果，按轮次排列。每条怎样裁决、改了什么，写在 [验收](../acceptance.md) 的“系列层面的审阅”和“各集”两节；这里留原话，供回查某条裁决从哪条意见来。

| 轮次 | 文件 | 谁交回的 | 交回什么 |
|---|---|---|---|
| 稿子 | `script-cold-<单元>.json` | 每集一位 Opus 冷读代理，没有写作上下文 | 逐条意见（必改 / 应改 / 可改）、句式计数、建议不动的地方 |
| 稿子 | `script-fact-<单元>.json` | 每集一位 Sonnet 事实核对代理 | 逐句对来源的核对行 |
| 画面 | `episode-review-<集>.json` | 每集两位 Opus 审阅代理：画面与念白、画面文字与出处 | 每条发现的时间、严重程度和建议 |
| 结构文字 | `copy-structural.json` · [copy-adjudication.md](copy-adjudication.md) | 一位 Opus 代理按 Write 的结构文字审阅过全部画面文字与封面；裁决由主会话写 | 76 条意见；采纳、改写后采纳、不采纳的计数与例子 |
| 镜头与动效 | `motion-polish.json` | 每集一位 Opus 导演代理 | 改动、仍未解决的地方、对引擎提的要求 |
| 成片 A | `final-review-a.json` · `final-fixes-a.json` | 四集成片审阅加一位首次观看者，之后的修复代理 | 发现与修复报告 |
| 终审 B | `final-review-b.json` · `final-fixes-b.json` | 两位分集审阅、一位横看六集，每条由 Sonnet 代理尝试驳回；之后每集一位修复代理 | 经核验的发现与修复报告 |

记录按原样保存，只把会话临时目录的路径写成 `<scratchpad>/` 或 `<session-tmp>`；其中提到的联络表和截图是过程文件，没有入库，要看画面就用 `build/frames.py` 从成片重新取帧。研究阶段的探索与核验记录在 [研究交接](../../research/handoffs/README.md)。

返回 [验收记录](../README.md)。
