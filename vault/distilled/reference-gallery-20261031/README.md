# Reference Gallery · Visual Distill / Index

**快照日期**：2026-10-31　**记录数**：90（Anthropic 60 / Perplexity 12 / OpenAI 11 / Grok 7）

> **读取目的**：把公开图库整理为独立、结构化、可追溯的参考层。短索引先定位，再展开章节；仅在需要时访问原图。服务于 Praxis/Fresh Agent UI 的设计研究，而非直接输入整个网站或替代现有 Design Kit。

## 入口

- **[INDEX.md](INDEX.md)**：章节导航、类型索引与 90 条完整快速定位。
- **[01-anthropic.md](01-anthropic.md)**：科研编辑拼贴与纸张、实物、摄影的组合（60）。
- **[02-perplexity.md](02-perplexity.md)**：天体图像、探索叙事与跨媒介系统（12）。
- **[03-openai.md](03-openai.md)**：人类场景、摄影、留白与产品广告（11）。
- **[04-grok-xai.md](04-grok-xai.md)**：黑场、弧光、柔焦与粒子（7）。
- **[05-image-treatment.md](05-image-treatment.md)**：按图像类型交叉检索。
- **[06-grammar-crosswalk.md](06-grammar-crosswalk.md)**：视觉语法与组件边界。
- **[07-fresh-ui-application.md](07-fresh-ui-application.md)**：与 Fresh Agent UI 的区域匹配与减法原则。
- **[08-retrieval-protocol.md](08-retrieval-protocol.md)**：按需检索、展开、核验与更新约定。

## 数据

`catalog.jsonl`、`catalog.csv` 保留原来源链接、公开画廊中分辨率图片链接、稳定 ID、视觉类型、精简中文线索、检索标签；`manifest.json` 包含来源指纹和覆盖情况。`catalog.compact.txt` 与 `cues.compact.txt` 是可再生构建输入，`build.py` 可重编译本包。

## 来源与限制

- 网站：[Reference Gallery](https://azivor.github.io/reference/)
- 公开源仓库：[Azivor/reference](https://github.com/Azivor/reference)
- 原始记录：[data/references.json](https://github.com/Azivor/reference/blob/main/data/references.json)
- 本次快照 Git tree：`2cc52b3a4b6d4723a984d39f2094030547733322`，源数据 blob：`ddf48f02932b351dae3d3f73f766266dea6b6d57`。
- **验证范围**：90/90 条元数据及原站视觉说明；未对 90 张图片逐张做高清图视觉核验，也未批量检查所有原出处链接的存活状态。记录日期以原数据为准。
- **版权与合规**：不复制图片资源，不将第三方品牌设计或摄影直接作为新产品素材。本包文字是基于参考元数据的独立提炼；实际上线素材需自创或明确授权。

## Agent Context Hygiene

不需要把整个包注入 Context。先读索引选择约 2–5 条 ID，只展开相关章节和必要图片。细节不确定就回原出处核对，不把归纳观察写成品牌官方规范。

## 入账

2026-11-02 入账。ChatGPT 编译的 2026-10-31 快照，除本节与 `catalog.json` 外保持原样；`catalog.json` 是 `catalog.jsonl` 转成的列表，供来源包读取。原 ZIP 在 [snapshots](../../snapshots/local/reference-gallery-distill-20261102/README.md)，原 Chat 见 [archive](../../archive/chat/reference-gallery-distill-20261102.md)，登记见 [intake](../../intake/reference-gallery-distill-20261102.json)。

名册里有两处入口：`praxis:azivor-reference` 是图库本身；来源包 `azivor-reference` 把 90 条接入，可用 `praxis_search` 按标签或线索找到 `azivor-reference:<id>`，再回原出处。`build.py` 是包内材料，入账时没有运行。

包内写的 Git tree `2cc52b3a…` 实为 commit，tree 是 `3d01c685`；提交本身有效，文件未改。
