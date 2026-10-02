# ADR-015：Kit 体例、参考消费与活跃维护

日期：2026-09-27。状态：accepted（文档治理与范围收敛）。当前用户授权 review 与整理；Astra/main 裁决与编订，Luna explore 与登记。

## 问题

ADR-011 已让文档结构承担使用指引，ADR-014 已区分跨项目 Design 与项目消费。但 Design 入口仍混入答卷的具体配色、字体、动效与交付参数；参考的历史采纳也容易被读成通用规则。Kit 条目需要明确的再发现入口、真实使用反馈及退出条件，外部参考需要可消费的语义说明。

本轮消费用户指定的「Opus 5.5 remotion video」与「Design Grammar」。原对话作为研究材料，历史 assistant 的建议不自动生效；来源覆盖与裁决对应关系见本轮 [验收回执](../verification/kit-editorial-review-20260927.md)。

逐主题来路见 [Write / Design 提炼](../../vault/distilled/write-design-grammar/README.md)，旧参考的适用范围见 [Design 参考语义](../../vault/distilled/design-reference-semantics/README.md)，新补充的官方写作参考见 [结构写作提炼](../../vault/distilled/writing-structure-20260927/README.md)。补充来源支持标题、段落、列表与表格的语义选择；外部英文样式、句数/行数和表格属性数启发式未采纳为 Kit 硬规则。

## 裁决

| 事项 | 决定 | 当前维护位置 |
|---|---|---|
| 可挂载、可导航、渐进阅读的 Kit | 采纳；目录表达职责，README 按任务选路，正文解释判断与完成条件 | [体例契约](../architecture/documentation.md) |
| Kit 准入与长期维护 | 采纳必要、可复用、可发现、可执行、可验证与可维护要求；真实使用反馈支持复核和退出 | 同上；沿用 [修订流程](../governance/evolution.md) |
| 外部参考的 distilled 语义 | 采纳来源主张、项目推断、取用价值、边界与重访的区分；每 URL 身份仍由原 catalog 维护 | [入账规范](../governance/intake.md)、[Design 索引](../../kit/design/references.md) |
| Design 跨项目判断与项目样式 | 将通用判断留在 grammar；答卷参数保留到 Vault profile；历史 accepted 限定到对应消费者 | [设计语法](../../kit/design/grammar.md)、[历史 profile](../../vault/distilled/ai-capability-assessment/design-profile-20260924.md) |
| Write 与 Design 的交界 | 在现有 Reporting 维护论证、内容结构和证据职责，Writing 保留成文职责，Design 维护视觉与交互判断 | [内容结构与媒介投影](../../kit/reporting/grammar.md) |
| 内容原子与样本 registry | 采纳按语义职责描述展项；完整 Atom/Pattern/Composition schema、canonical/expressive specimen 库留作候选，由实际产出触发 | Reporting grammar；研究提炼 |
| 原 Chat 与公开面 | 原件本地备查，公开或云端交付使用经过消费、泛化与披露检查的内容；索引也检查披露范围 | [消费与披露](../governance/intake.md) |
| Demo 的材料来路 | 在既有准入中串联来源、提炼、借用范围与自身增量；原 Chat 不进入 Demo 作为规范 | [Demo 准入](../../demos/README.md) |
| Write/Motion、渲染器和空目录蓝图 | 延后；由具体时间媒介交付检验后再决定长期分支 | 保留研究来路，不宣称实现 |
| 将 Kit 扁平化为一个 Skill | 不采纳；继续使用目录与正文渐进引导 | 保留 ADR-014 的既有 Writing skill 职责 |

## 与既有决定的关系

扩展 ADR-011，收敛 ADR-014 中 Design 条目的适用范围。未改变 ADR-002 的组件晋升门槛；治理文档可通过本仓库维护消费验证，不套用组件的场景数量。没有把新的使用记录变成每次施工的全表打卡，也不以使用次数自动晋升。

ADR-014 的历史原文保留。现有 Writing skill 的自足职责未迁移；跨目录协作通过入口链接完成。参考去重保留稳定 ID，尚未统一的历史 catalog 明示为后续工作。

## 迁移、验证与限制

保留 Kit 主要路径与参考编号。原 Design README 的答卷规则移入带日期的 Vault profile；原使用者从 profile 找到旧取舍，再按自己的约束复验。新任务从 grammar 开始，既有产物不因文档修订而自动改变。

本轮检验索引可重建、来源覆盖、本地链接与合成任务导航；没有验证新的设计产物、视频或跨项目使用效果。Git 原件隔离、同步过滤及历史公开面的清理尚未实施，本次没有发布、迁移原件或改写历史。详见本轮验收回执。
