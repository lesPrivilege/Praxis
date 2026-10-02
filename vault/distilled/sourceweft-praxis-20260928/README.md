# SourceWeft 与 Praxis：邻近运行时参考

状态：candidate / supplemental-reference / 未采纳。  
原始 Chat：[sourceweft-praxis-20260928.json](../../archive/chat/sourceweft-praxis-20260928.json)  
材料登记：[intake](../../intake/sourceweft-praxis-20260928.json)  
逐 URL 身份与证据：[provenance catalog](../../provenance/sourceweft-praxis-20260928/catalog.json)  
架构差异交接：[architecture-diff.md](architecture-diff.md)

## 这批材料是什么

SourceWeft 是一个带有多 Agent、Skill、MCP、sandbox、来源和产物能力的 workstation/runtime 参照。Praxis 负责长期 Kit、工作 grammar、契约、来源生命周期与晋升治理。两者相邻，但职责层不同：

    Praxis:     source → consume → distill → judge → Kit / contract
    consumer:   task → route → load relevant branch → execute → review
    SourceWeft: conversation/workspace → skills/tools/subagents → artifacts

本批只把固定提交中的五个文件当作已核实的 supplemental evidence。其余 Chat 中的 URL 仍保留身份和定位，但不支持当前事实主张。distilled 也不表示已采纳。

## 已核实的五个事实

来源卡位于 [cards/](../../provenance/sourceweft-praxis-20260928/cards/)，每张卡包含原 URL、去跟踪参数后的 canonical URL、固定提交、消费方式、边界和重访条件。

- HTML Slides 的 Skill 先给出短 workflow，再要求按任务读取 design、layout、theme 与 catalog；默认 16:9、离线单文件和 QA/视觉复核/发布都写进工作流。[SW-HS-SKILL-01..03]
- catalog 是机器可读的主题、layout、effect、animation 枚举，并固定上游依赖引用；它可作为运行时路由目录，不能代替设计判断或 Praxis 规范。[SW-HS-CATALOG-01]
- capability manifest 把 skill 的 identity、version、visibility、工具、输出 artifact 和 publisher 结构化。[SW-HS-MANIFEST-01]
- explore 明确是 read-only 的 context quarantine：子调查消耗自己的上下文，返回 summary、findings（claim / citationMarkers / sourceReferences）和 limitations；不能写入、执行或发布。[SW-EXPLORE-01..02]
- context compression 明确把 summary 定义为 conversation memory，不是 source evidence；保留 locator hints，移除可复用 citation marker，并保留 Non-Evidence Reminder 等结构段落。[SW-COMPRESS-01..02]

这些事实支持“短入口 + 按需展开 + 结构化交接 + 证据边界”的实践参考；它们不证明 SourceWeft 的完整产品质量、稳定性、性能、RAG 方案或与 Praxis 的运行兼容性。

## 可交给 Astra/main 的候选增量

1. Consumer route contract（候选）：为未来 Kit consumer 规定入口 README、相关分支、机器目录、执行工具和验收回执的连接方式。它属于 consumer adapter/contract 草案，不应把 capability manifest 原样移入 Kit。
2. Luna handoff schema（候选）：在现有 handoff 规范上保留 summary、findings、evidence_ids/locators、limitations、candidate_increment、needs_main_decision、consumption_status；SourceWeft 的 read-only findings 结构只能作为运行时参照。
3. Memory/evidence boundary（候选强化）：把压缩摘要、当前工作状态和可核实证据继续分开；压缩摘要只保存回查线索，不能直接支持事实 claim。
4. Catalog 与 provenance bridge（候选）：未来 consumer 可以拥有版本化 manifest 与 pinned source provenance，但 Kit 仍以 source card、snapshot/hash、distill、ADR 和验证为长期治理层。

以上均停留在候选；没有新增 Kit、ADR、runtime 或 schema 采纳。

## 当前处置

Main 将本批作为 normal runtime-consumer / capability-packaging 参考，挂到 Environment expert-contract 的后续消费路径；它不是 highweight canonical reference，也不把 SourceWeft 整体提升为 Praxis 标准。可先吸收“压缩摘要用于回查、不能替代事实证据”的边界澄清。manifest、machine schema 和实际宿主接入继续保留为候选，不在本批实现。

## 保留的边界与缺口

- provenance.ts、context-assembly.ts、PPT skill、releases、仓库主页和 Praxis ADR URL 已逐项登记，但本批未将其内容作为已核实技术证据；详见各 source card。
- Chat 中 citation placeholder index=6 仍是 missing-original，没有伪恢复。
- 未保存 SourceWeft 原始源码、依赖、renderer 或运行结果；本地可消费层是摘要与逐 URL source cards。
- 未安装、运行或修改 SourceWeft，也没有把其 Skill、manifest、RAG 或 artifact lifecycle 写入当前 Kit。

## 取用路径

涉及 Kit 入口、按需路由或长期维护时，先读本文件，再读 [architecture-diff.md](architecture-diff.md)；需要具体来源证据时只打开对应 [source card](../../provenance/sourceweft-praxis-20260928/cards/README.md)，需要恢复 Chat 语境时回查 archive。后续若 demo 产生独立重复证据，应新建增量 intake/provenance/review，而不是覆盖本批。
