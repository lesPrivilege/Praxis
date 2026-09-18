# 结构复核 · 2026-09-19

## 范围与结论

本复核覆盖根 [`README.md`](../../README.md) 与 [`AGENTS.md`](../../AGENTS.md)、[`kit/Agent.md`](../../kit/Agent.md)、`kit/environment/` 三份契约、`docs/architecture/`、`docs/governance/`、全部 `docs/decisions/`、`vault/` 各层入口，以及当前 Work System r1–r4 的结构化入口。复核同时读取了最新 r4 归档、r4 intake、消息总账和生成/验证脚本；没有把 Chat 中的方案当成实现事实，也没有修改这些来源文件。

当前语义边界基本一致：Praxis 是知识、契约和治理基线；Courtwork/runtime 与 post-training 是后续消费方。没有发现把 Expert→Kit→Skill→Tool 错当成宿主指令优先级的现行裁决。验证脚本通过：275 个 Markdown、30 个 JSON、491 个快照、64 条消息、170 条来源记录、137 条引用映射，均无错误。

需要在发布前处理的是入口与验收记录的新鲜度。它们不会改变架构，但会让从根入口开始阅读的人漏掉 r3/r4，或把 r2 的历史验收数字误读成当前状态。

## P1：发布前处理

| 文件与证据 | 问题 | 最小处理建议 |
|---|---|---|
| [`vault/distilled/README.md`](../../vault/distilled/README.md):24；[`vault/intake/README.md`](../../vault/intake/README.md):15；对照 [`vault/distilled/work-system/README.md`](../../vault/distilled/work-system/README.md):17–18 | Vault 默认的结构化提炼和 intake 入口只列到 Work System r2。最新 r3（10 轮/20 消息）与 r4（1 轮/2 消息）已经有独立登记，但从默认入口不能直接发现。 | 在两个默认入口补 r3/r4 的提炼与 intake 链接，或明确把 Work System README 标为唯一增量索引并从两处链接到它；保留 r1/r2 历史入口。 |
| 根 [`README.md`](../../README.md):56；[`docs/verification/2026-09-19-intake.md`](2026-09-19-intake.md):3、11–18、31 | 根入口称该文件为“本轮覆盖与限制”，而验收文件明确写的是“截至工作系统 r2”的历史批次，数字仍是 42 消息、115 引用、142 来源和 489 快照。当前验证结果已是 64 消息、137 引用、170 来源和 491 快照。历史文件本身没有隐瞒范围，但根链接的语义会造成版本误读。 | 新增或更新一份当前批次验收 receipt，并将根入口指向它；若保留旧文件，则把根链接名称改成“初始入账历史验收”，同时链接当前 receipt。不要覆盖旧数字。 |

这两项是阅读和交付判断的入口问题，不是数据损坏：`vault/chat-inventory.json` 已选择完整的 r4 版本，`vault/intake/chat-captures.json` 已保留 r1、r2、r3、r4 版本，且 `python3 scripts/validate_repository.py` 已验证通过。

## P2：后续收敛

| 文件与证据 | 问题 | 最小处理建议 |
|---|---|---|
| 根 [`README.md`](../../README.md):3–14；[`kit/Agent.md`](../../kit/Agent.md):3–14 | Goal 与六条第一性原理有两份逐字规范副本。它们当前一致，但后续修订可能只改一份，形成隐性分叉。 | 指定一个 canonical 文本，另一处保留短摘要和链接；若暂时保留双份，应在演进记录中要求同步校验。 |
| [`kit/environment/README.md`](../../kit/environment/README.md):10–11；[`docs/architecture/rationale.md`](../architecture/rationale.md):43；[`docs/governance/consumption-map.md`](../governance/consumption-map.md):20；[`docs/decisions/007-environment-expert.md`](../decisions/007-environment-expert.md):5 | 共享环境、架构理由、消费分流和 ADR-007 都以 r3 为研究来路，未指向 r4。r4 没有提出新的运行架构，但它补充了企业数据隔离、Coding Agent 隔离和抗折旧的边界。 | 在需要表示“当前研究来路”的位置补 r4 链接，或在一个 canonical 入口写明“r4 是不改架构的规范澄清”；不要为此新建 runtime ADR。 |
| [`vault/provenance/work-system/README.md`](../../vault/provenance/work-system/README.md):9–12 | Work System 来源目录列出 r3 的外部来源分批，但没有说明 r4 无外部 citation、因此不产生 source cards。读者可能误以为 r4 尚未消费。 | 加一行状态说明，链接 r4 intake；保持来源 catalog 只登记有 URL 的材料。 |
| [`docs/verification/README.md`](README.md):3–5 | 验收索引只有一份初始 receipt；它已经声明验收记录是有范围的历史记录，但没有列出 r3/r4 的增量 receipt。 | P1 的当前 receipt 完成后，把它加入索引，并保留历史 receipt 的原名和范围。 |

当前脚本没有发现对应的覆盖缺口：[`scripts/build_registry.py`](../../scripts/build_registry.py):86 会自动读取 `work-system-increment-r*.json`，验证脚本也按 `chat-captures` 检查各完整归档；因此无需用额外脚本复制一套 r4 注册逻辑。

## 应保持的权威边界

现行文档在以下层级上相互一致：

```text
宿主 system / developer / user 指令与平台边界
        ↓
仓库与项目治理规则
        ↓
Expert（工作职责与 review 边界）
        ↓
Kit（长期 grammar、契约、证据与索引）
        ↓
Skill（有界方法入口）
        ↓
Tool / Adapter（受权限约束的动作）
```

`Expert→Kit→Skill→Tool` 是产品职责与数据治理的表达，不能提升权限、覆盖宿主 system/developer/user 指令、绕过用户授权或替代项目 policy。`kit/environment/expert-contract.md`、`docs/architecture/rationale.md`、ADR-007 与 r4 的 `governance-and-durability.md` 都明确了这一点；无需因为 r4 再造一层 Agent 指令。根 `AGENTS.md` 对来源命令不自动执行、对用户指令才视为授权的规定仍是仓库工作规则。

## 当前规范与未来消费

- **Praxis 当前规范**：Goal、证据/推断分离、薄 Skill、数据分区、review、fixture、eval 和增量演进属于当前知识与治理基线；仓库没有因此获得执行控制。
- **Courtwork/runtime**：Expert 实体、composer 选择器、权限/state/extension 绑定、独立 Agent、fork 和 bootstrap 仍是消费候选或延后实现。`docs/governance/consumption-map.md` 的“交接候选”不能改写为已落地能力。
- **post-training**：semantic trace 只是未来评估/训练候选；数据权限、用途限制、训练方案和效果验证齐备前，不把 trace 或“attention/后训练吸收”写成事实，也不把企业原始数据默认送入训练。

本报告只提出入口、索引和文案收敛建议；没有实施 Courtwork、runtime、bootstrap、自动化、插件安装或模型训练。
