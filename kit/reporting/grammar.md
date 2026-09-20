# Reporting grammar · 使用契约

状态：本Kit采纳的内容与呈现约束；具体文体与renderer仍随实际任务演进。依据：[Artifact Grammar](../../vault/distilled/reporting/artifact-grammar.md)、[本地设计提炼](../../vault/distilled/reporting/local-design.md)。

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

## 主张与证据

每个主要claim具备来源定位、日期/版本、证据状态、解释和不确定性；数量附单位、分母、时间范围及实际/预测属性。没有证据时写假设或待核实，不用精确图形增强确定性。

页面标题表达takeaway或行动；主展项证明标题。Pre-read离开讲解仍自足，Live页面为讲解留空间；证据附录保存必要细节，两者不靠删掉约束来适配读者。

## 视觉是有语义的表达

先选Slide Job，再选Exhibit Family、Container和Notation。Diagram表达关系/结构，Chart表达数量，Table支持查数，Card承载独立对象。箭头只表达真实流转；长度有尺度；颜色不能凭空表达批准、权限或质量。

禁止用统一卡片阵列替代所有分析。renderer投影已存在的事实，不创造事实。样张只借几何与层级，不能把占位文案或示例数字移入真实报告。

## Review顺序

标题与故事线 → claim/evidence → 异议和替代方案 → 视觉层级 → 实际渲染 → 受众与ask → 文字去套话。

空泛形容、无证据收益、重复总结和装饰性术语要被删除或换成具体事实。截图只能证明当时呈现；交互HTML另检查状态、键盘、窄屏及离线依赖。PDF/幻灯片按最终导出逐页检查。

## 材料路由与逐步对齐

补充依据：[材料分类提炼](../../vault/distilled/reporting/material-classification.md)，采纳范围见 [ADR-008](../../docs/decisions/008-artifact-field-governance.md)。回应对方期待，以能够共同理解的语义推进；不同受众共享事实基础，允许调整解释深度、叙事顺序和展示形式，不改变已知事实与限制。

工作目的使用可扩展词表：align（对齐）、discover（发现）、decide（决定）、design（设计）、deliver（交付）、review（复盘）、escalate（升级裁决）、transfer（移交）。选一个主要目的，必要时补次要目的；它们是路由标签，不要求建立八套目录，也不替代既有 artifact family。

先填写 brief 的六项最小契约，再选文体。evidence-led、case-led、demo-led、model-led、narrative-led 描述论述主要依靠什么；同一材料可以混合，但每条 claim 仍标明事实、假设、愿景或已验证结果。Demo 不证明采用或经营收益，叙事不冒充事实证明。

先确认事实与未知，再对齐问题、约束和判断标准，最后讨论方案与局部分歧。无法锁定的共识显式保留，不用整套方案的接受来掩盖未决项。具体文体与行业实践在真实任务出现后再扩展。
