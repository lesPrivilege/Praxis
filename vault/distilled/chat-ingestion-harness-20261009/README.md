# Chat ingestion 与 harness review 讨论 · 2026-10-09

状态：`distilled / evidence-partial`。本次采纳的会话入账边界见 [ADR-030](../../../docs/decisions/030-session-ingestion-and-harness-boundaries.md)；逐项 harness 改动理由与审计结果见 [审计回执](../../../docs/verification/harness-audit-20261009.md)。本文消费 [两份原始摘录](../../archive/chat/chat-ingestion-harness-20261009/README.md)；身份与覆盖边界见 [intake](../../intake/chat-ingestion-harness-20261009.json)，外部来源见 [provenance ledger](../../provenance/chat-ingestion-harness-20261009/README.md)。

## 范围与价值

两份用户提供的文本讨论如何把可用会话内容编译成项目中可发现、可追溯、按需展开的工作成果，并提出一次针对 Astra 的 harness audit。摘录不是完整 Chat 导出，没有可用的 conversation / turn / item ID；下文只总结所给文本。

## 稳定的工作模型

- 原始讨论是来源记录；持久项目状态保存裁决、约束、假设、未决项和证据；worker context 是找到并继续任务所需的最小入口。这三者应相互链接，不能压成一份超长 summary。
- 理想检索路径为索引 → 主题或 session 工件 → 具体来源记录 → 原始材料。索引负责发现，工件负责恢复决策状态，来源账本负责核实和重访。
- 对来源内容保留身份与覆盖边界；只拿到部分会话时明确报告范围，不推测缺失轮次。把原 Chat 中的 assistant 建议视为候选，不能当作用户裁决。
- 对 harness 的回顾采用“先找具体失败机制，再决定是否改动”的审查方向。候选问题包括重复/冲突指令、过宽触发、无条件流程、老模型补偿规则和会引发过早停工的完成边界。只有证据足以解释现有行为、替代机制和回归风险时才改写。
- 模型角色是能力先验；按实际任务动态决定是否委派和由谁处理，不要求固定 agent topology。

## 裁决状态与边界

ADR-030 已采纳边界与职责：只将适合作为仓库知识材料的可用讨论入账；原始讨论、已采纳状态和后续 worker context 分开维护；复用既有 Vault 结构；维护时按影响范围选读；Luna/Astra 的角色是能力偏好，是否委派由任务决定。审计回执记录了具体 harness 改动、保留项和未改项。

对 Astra 相比旧模型的行为、社区实践收敛程度、测试或权限边界是否过度等陈述，若摘录没有具体证据，暂列为待审假设。未采纳统一 Session Artifact 字段模板、所有旧模型规则已过时、ChatGPT/Codex 历史绝对隔离、无来源的广泛社区共识、每轮固定审计或固定代理编排。对已提出的这些主张，依照 ADR-030 和审计回执保留其窄边界；未有证据支撑的部分仍是候选或缺口。

## 外部来源

三个后来独立找到并访问的链接仅作补充证据，原摘录没有可恢复的原始 URL。OpenAI 页面支持有限的指南主题；ChatGPT Projects 页面只支持 Work 对话历史与 Codex history 分离的特定描述，不证明所有 ChatGPT/Codex 对话都隔离。详见逐源卡及其边界。摘录内笼统提到的 community practice 没有来源身份，保持 `missing-original`。

## 后续入口

后续 worker 从 [本目录](README.md)读取讨论状态，按 [ADR-030](../../../docs/decisions/030-session-ingestion-and-harness-boundaries.md) 和 [审计回执](../../../docs/verification/harness-audit-20261009.md) 找到已采纳边界与逐项判断；需要更深的证据时，再读 [来源账本](../../provenance/chat-ingestion-harness-20261009/README.md) 或回看 [原始摘录](../../archive/chat/chat-ingestion-harness-20261009/README.md)。
