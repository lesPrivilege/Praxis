# Reporting · 材料目的与组织动作

本分支负责材料要促成的理解、决定与行动。成文、页面和时间叙事由 [Write](../write/README.md)各 mode 执行。

## 先确定组织动作

填写 [brief](../../templates/reporting/README.md)，依次确定 intent → audience → decision → evidence → visual → surface。

| 需要完成的动作 | 起步文体 | 必须包含 |
|---|---|---|
| 发现现实 | Discovery memo / Field note | 观察、原始证据、解释与未知分别表达 |
| 请求决定 | Options / Decision memo | 明确ask、方案、代价、推荐依据、决定owner |
| 定义实现 | PRD / RFC | 边界、契约、未决项、替代方案、验收 |
| 记录决定 | ADR | context、decision、后果、替代关系 |
| 证明有效 | Eval / Acceptance report | 样本与口径、基线、失败分类、限制 |
| 推进工作 | Status / Pilot / Handoff | 当前状态、变更、阻塞、owner、下一步 |
| 复盘改进 | Postmortem | 时间线、事实、原因假设、改进与验证 |

完整20类候选见提炼层；不要求每次生成全套文档。高管、工程师或现场worker使用同一证据基础，但改变背景解释、细节深度和ask顺序。

## 材料路由与逐步对齐

补充依据：[材料分类提炼](../../vault/distilled/reporting/material-classification.md)，采纳范围见 [ADR-008](../../docs/decisions/008-artifact-field-governance.md)。回应对方期待，以能够共同理解的语义推进；不同受众共享事实基础，允许调整解释深度、叙事顺序和展示形式，不改变已知事实与限制。

工作目的使用可扩展词表：align（对齐）、discover（发现）、decide（决定）、design（设计）、deliver（交付）、review（复盘）、escalate（升级裁决）、transfer（移交）。选一个主要目的，必要时补次要目的；它们是路由标签，不要求建立八套目录，也不替代既有 artifact family。

读者、决定、主张与证据尚不清楚时，先补 brief 的六项最小契约，再选文体；已清楚时直接取用，不重复填写。evidence-led、case-led、demo-led、model-led、narrative-led 描述论述主要依靠什么；同一材料可以混合，但每条 claim 仍标明事实、假设、愿景或已验证结果。Demo 不证明采用或经营收益，叙事不冒充事实证明。

先确认事实与未知，再对齐问题、约束和判断标准，最后讨论方案与局部分歧。无法锁定的共识显式保留，不用整套方案的接受来掩盖未决项。具体文体与行业实践在真实任务出现后再扩展。

## 主张与证据

规则已迁入 [Write / Shared / 证据与来源](../write/shared/evidence.md)，本域不维护副本。

## 视觉是有语义的表达

展项选择和内容职责见 [Write / Publish](../write/publish/README.md)，表现手法见 [Design](../design/README.md)。

## 内容结构与媒介投影

段落成文进入 [Prose](../write/prose/README.md)，空间编排进入 [Publish](../write/publish/README.md)，时间叙事进入 [Motion](../write/motion/README.md)。共享信息与证据不能因媒介转换改变身份。

## Review顺序

统一执行 [内容与媒介验收](../write/shared/verification.md)，业务接收另按 [分层验收](../verification/README.md)。旧锚点保留用于历史来路，当前规则只在目标页维护。
