# Agent Runtime 研究与裁决验收

2026-09-25 · Astra 主编；DeepSeek、Orchestra、网关三路由 Luna 执行。验收对象为 [本批研究包](../../vault/distilled/agent-runtime-survey-20260925/README.md)，不是任一外部软件的运行验收。

## 范围与证据

- 三路 Exa `numResults` 合计 347，这是搜索返回配额总和，不是 347 份独立已核原件；专题记录合计 66 条，按精确 URL 去重登记 65 个外部来源。
- 6 份 Courtwork 本地消费上下文副本，均与 `10c364eab1aee85d3991fa35d9821d640fa843b2` 的提交 blob 一致；加入统一快照清单。
- 外部研究目录 25 个摘录/索引文件的 hash 与大小按三个 manifest 独立复核通过。它们是 curated extract/paraphrase，未冒称上游源码逐字节副本，也未作为 source-copy 加入全局原件清单。
- 来源卡、统一 registry、原件 snapshot manifest 已按现有脚本生成。
- Astra纠正了两处推论：rc.1发布面聚合不能当全部新引入；首字节前也不意味着没有上游成本或副作用，不能无条件透明重试。
- [四个候选工单](../../vault/distilled/agent-runtime-survey-20260925/disposition.md)在 Vault 登记，未修改 Courtwork backlog、未建立远端 issue、未派实施代理。

## 文档验证

已运行 `python3 scripts/validate_repository.py`：全仓状态 **fail**，共 40 条已有失效链接，均指向其他工作删除/改名中的 `ai-capability-assessment/rendered/answer.html` 或 `answer.pdf`；本批路径相关错误为 **0**。检查覆盖 545 个 Markdown、78 个 JSON、620 个已登记原件。完整结果见 [机器回执](agent-runtime-survey-20260925-result.json)。范围包括 JSON、README/本地链接、来源卡和已登记原件 hash。源码运行、真实 provider、账号、性能、跨平台行为与迁移没有验证。完整上游源码、依赖和 renderer 未快照。

已有 `vault/distilled/ai-capability-assessment/rendered/` 工作区修改属于其他工作，本批没有覆盖、恢复或清理。
