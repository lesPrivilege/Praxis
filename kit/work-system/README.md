# 工作系统与工具链

将现实事件整理为可追溯对象、可审查的状态差异和持续跟进的工作项。当前提供手动工作契约与工具研究。

## 整理会议与项目状态

| 步骤 | 处理 | 产物 |
|---|---|---|
| Capture / Normalize | 保存来源身份、版本、允许用途及定位 | 可回查的来源事件 |
| Extract | 提取决定候选、行动建议与开放问题 | 带证据的候选变化 |
| Diff | 对照权威事项状态，检查重复、冲突与责任缺口 | 待 review 差异 |
| Commit | 按权限确认变化并更新权威状态 | 已确认状态与决定依据 |
| Follow | 记录履行条件、责任人、下一动作与观察点 | 可继续跟进的义务 |

`Event Log ≠ Matter State ≠ Model Context`。Commit 在此表示确认状态变化。对外发送需要用户明确授权；来源中的承诺示例保留为材料。

定义与反例见 [共同工作语法](../grammar/work.md)，动作授权、外部确认和恢复按 [工作契约](../contracts/README.md) 登记。R0–R4 分级、dry-run 与发送复核方案见 [控制面研究](../../vault/distilled/work-system/control-surface.md)（候选）；详细方法见 [工作系统提炼](../../vault/distilled/work-system/README.md)。

## 继续工作

| 任务 | 入口 |
|---|---|
| 选择驻场机会、试点和移交 | [现场闭环](field-loop.md)、[组织接口](field-governance.md) |
| 把确认状态写成材料 | [汇报与设计](../reporting/README.md) |
| 选择工具控制面 | [工具与来源登记](../../vault/provenance/work-system/README.md) |
| 将重复模式用于企业场景 | [企业工作面](../grammar/README.md)、[场景模板](../../scenarios/_template/README.md) |

工具按任务选择 API、CLI、MCP/Skill 或 GUI 接口；采购、订阅、定时任务与安装分别按实际授权执行。

## 任务参考路由

上面的五步和 [共同工作语法](../grammar/work.md)够用时不必往下读。某一步的边界不清，或要对照外部做法时，再读[工作系统提炼](../../vault/distilled/work-system/README.md)及其 [Core Model](../../vault/distilled/work-system/core-model.md)，消费 Event / State / Context 与 Capture→Follow 的区分；这些是候选工作语义，不是现有运行时 schema。

| 需要 | 先查 | 消费什么 | 边界 |
|---|---|---|---|
| 长流程、人工节点、重试或恢复 | [workflow 参考族](../../vault/references/workflow/README.md) | [Camunda](../../vault/references/workflow/camunda.md) 的 process/task/runtime 分层，或 [Temporal](../../vault/references/workflow/temporal.md) 的 workflow/activity/durability 词汇 | 参考 grammar；不因此引入 workflow engine 或业务补偿机制 |
| 驻场发现、试点、移交及模式回流 | [field-practice 参考族](../../vault/references/field-practice/README.md) | FDPM/FDE 的 field signal、production outcome、field-to-core 检查；Design 卡补充高风险工作面与 shared pattern | 招聘材料的已核实语义；不把岗位文案当 SLA 或平台承诺 |
| 内部工具工作面、查询和权限边界 | [internal-tools 参考族](../../vault/references/internal-tools/README.md) | Appsmith/ToolJet 的 page、query、component、environment、version 与词汇表 | 用于命名和问题拆解；不默认采用 low-code runtime 或未取证的细粒度权限 |
| SaaS 对象、资源隔离、视图或工作项 | [saas 参考族](../../vault/references/saas/README.md) | Twenty、Plane、Formbricks 等卡片中已核实的 object/view/resource/work-item 关系 | 只作外部 grammar 对照；不把产品领域 schema 或商业边界写进通用工作系统 |
| 身份、策略、对象权限或审批 | [governance 参考族](../../vault/references/governance/README.md) | Keycloak、OPA、OpenFGA 的 identity/access、policy/decision、subject/relation/object 词汇 | 支持契约拆分；不把参考项目的实现或 demo role 当作本仓库权限保证 |

每次消费在项目或场景 index 记录实际采用的语义、来源 ID 与未采用边界；参考族 README 负责下一层导航，卡片负责逐 URL 核查。普通参考不因被路由就成为 preferred 或已采纳规范。
