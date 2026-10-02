# SourceWeft / Praxis 来源登记

本目录登记 [比较 SourceWeft 与 Praxis](../../archive/chat/sourceweft-praxis-20260928.json) Chat 中的每个显式 URL 身份，并为本批有限核实的 SourceWeft 官方文件提供逐源卡。

- [catalog.json](catalog.json)：机器登记、URL 规范化、Chat 出现位置、支持主张和重访边界。
- [cards/](cards/README.md)：按 URL 阅读的 source cards。
- [材料 intake](../../intake/sourceweft-praxis-20260928.json)：消息覆盖、缺口和消费去向。
- [distilled 交接](../../distilled/sourceweft-praxis-20260928/README.md)：供 Kit/consumer 路由读取的泛化摘要。

## 核查范围

2026-09-28 通过官方 GitHub raw URL 读取 SourceWeft 提交 f88212b91216267f3dc1053f9424010cae9de5b6 的五个文件：HTML-slides SKILL、runtime catalog、capability manifest、explore.ts、context-compression.ts。源仓库只读；没有安装、克隆、运行或修改。

其余 URL 仍逐项登记，但状态为 identity-only、unverified 或 missing-original 相关，不支持本批事实主张。URL 上的 utm_source 和 twclid 原样保留在 original_url，canonical_url 去除跟踪参数；同一 canonical URL 的多个 Chat 身份以 related_source_ids 和 duplicate_group 明确关联。

## 使用和退出

先读 distilled README 决定是否需要展开某张卡；只有需要证据、回查或重访时才打开原 URL。verified-primary-web 只表示指定固定提交文件在本批被读取，不表示 SourceWeft 产品整体、运行时质量或 Praxis 采纳。源文件变更、需要运行验证、manifest/schema 进入 consumer contract 或 Chat 补充完整来源时重访。
