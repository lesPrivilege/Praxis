# 验收记录

由管线生成的检查结果和画面文字清单放在这里；检查结果汇总、各轮审阅的裁决和要由人来做的事见 [验收](acceptance.md)。

| 文件 | 来自 |
|---|---|
| `voice-report.json` | `assemble.py`：每段语速、基频、与文稿的字符匹配率、没有时间戳的语音 |
| `mix-<编排>.json` | `mix.py`：整合响度、真峰值、人声与铺底差 |
| `check-<编排>.json` | `check.py`：成片检查各项与原始数据 |
| `screen-text-<编排>.{md,json}` | `screen_text.py`：画面文字清单 |
| `heard.json` | `check.py`：转写缓存，按音频哈希 |

静止一项只把超过 10 秒画面不变当作失败：一屏停多久由内容决定，6–10 秒的停留列在 `holds_to_review` 里，由人看是否该加一拍。空白一项把 1 秒以下的空纸当作场景之间的换气，列在 `breaths` 里。

返回 [系列说明](../README.md)。
