# Praxis 视觉语法本地探索追溯

状态：`partial` 的有界本地探索，检查日期 2026-09-28（Asia/Singapore）。本批登记 Praxis 中已有视觉 / motion / 视频 specimen，以及三个优先本地项目候选：Mnemos、Mnemos Prototype、Attention Assistant。来源仓库只读；没有安装依赖、写入来源仓库、访问外部网页或重读 Courtwork / Schema Engineering 源仓库。

机器证据索引使用 [`sources.json`](sources.json)，特意不使用 `catalog.json`，以免被外部 URL catalog 规则误读。需要回查原文件时，先看 `sources.json` 的 `original_locator`、`source_commit`、`sha256`、`read_locator` 与 `status`，再打开来源或本地快照。精选快照位于 [`vault/snapshots/local/visual-grammar-praxis-20260928/`](../../snapshots/local/visual-grammar-praxis-20260928/)，其相对路径和 hash 与索引逐项对应。

本批的证据状态分开记录：

- `implemented-research-specimen`：Praxis 或 Mnemos 中确有源码 / 产物，且本地文档记录实现或检查；不等于已进入 Kit，也不自动证明当前环境可重建。
- `candidate-semantic-source`：有本地语义、状态或流程材料，可作为工单输入；没有对应视觉实现或重复 consumer 证据。
- `candidate-visual-specimen`：有本地样张、代码或动态输出，仍需 Astra / 用户按场景筛选；不等于 canonical。
- `reference-pointer`：复用已有索引、来源卡或 Chat intake 的身份与边界；本批未重新核验外部正文。
- `gap`：未找到可核实来源或当前缺少验证；不得用邻近记录补齐。

首件候选的最短阅读路径和 6 个有界工单见 [`vault/distilled/visual-grammar-20260928/local-exploration.md`](../../distilled/visual-grammar-20260928/local-exploration.md)。视觉语法的对外施工入口由主线 `demos/visual-grammar/` 维护；原 Chat 仅通过 intake/archive 回查，本目录不复制对话正文。

本批对探索前已有的 scoped prior-index 搜索没有发现 `Skillry` / `skillry` 的 ID、URL 或 source card。随后独立的 Luna 外部追溯已登记 [`visual-grammar-external-20260928`](../visual-grammar-external-20260928/README.md) 共 21 个 URL，其中包含 Skillry specimen；这批 supplemental 记录不能冒充原 Chat 隐藏引用，也不能把 Skillry 作者自述提升为独立验证。现有 `SourceWeft skill provenance` 卡片仍只是相邻 runtime 参考，不能代替 Skillry。

以上Skillry缺口指探索前已有索引；本轮另有 [外部Luna追溯](../visual-grammar-external-20260928/README.md)登记21个URL，供Opus直接取用。
