# Retrieval Protocol｜Agent 按需展开协议

## 快速读取

1. 先读 [`INDEX.md`](INDEX.md) 的章节定位与处理类型，或对 `catalog.csv` 按标签 / 文字线索搜索。
2. 根据需求至多展开 **1–2 个章节 Distill**；不必每次把 90 条加载进上下文。
3. 从章节内选 **2–5 个稳定 ID**（例如 `anthropic-bloom`），先读压缩视觉线索，再打开其原始作品/原站图片。
4. 只有涉及颜色、字级、动效节奏、精细光影或细部位置时，才读取高分辨率图片并进行截图 / 视觉审查。
5. 分别记录：`observed_fact`（可验证）、`source_curator_note`（原站观察）、`distill_inference`（本包归纳）、`proposed_application`（拟用法）。

## 建议检索词 → 入口

| 需求 | 优先章节 | 代表 IDs |
|---|---|---|
| 法财税研究报告封面、证据感 | Anthropic | `anthropic-zero-days`, `anthropic-claude-shaped-science`, `anthropic-bloom` |
| 背景纸纹、绘图、档案 | Anthropic | `anthropic-persona-selection-model`, `anthropic-enabling-independent-research` |
| 统一 Skin 品牌视觉 | Perplexity / OpenAI | `perplexity-poster-system-board`, `openai-brand-photographic-system` |
| 感官性 Hero、空间光影 | Grok / Anthropic | `grok-launch-4`, `anthropic-opus-5-5-atmospheric-horizon` |
| 多端与线下延展 | Perplexity / OpenAI | `perplexity-street-campaign`, `openai-with-chatgpt-window` |
| 简明内容与空白 | OpenAI | `openai-student-pasta-billboard`, `openai-with-chatgpt-garage` |

## 更新 / 修订

- 原始记录：`https://github.com/Azivor/reference/blob/main/data/references.json`。
- 原始发布映射：`https://github.com/Azivor/reference/blob/main/dist/library.json`。
- 当前快照树：`2cc52b3a4b6d4723a984d39f2094030547733322`，源记录 blob：`ddf48f02932b351dae3d3f73f766266dea6b6d57`。
- 更新时先对比稳定 ID 的增删改，优先只修订变化章节和视觉语法 crosswalk。
- 不要以原站图片补齐第三方未明确授权的重制素材库。原站链接可供审阅，生产素材应独立创作或取得授权。

## 当前包的证据限制

本包逐条覆盖 90 个来源记录及其作者附带的视觉观察，并做独立中文提炼；没有逐张打开高清图片进行像素/色值/动画核验，未二次核实全部外链内容与发布日期。故不输出伪精确色值、字体规格或声称为品牌官方规则。
