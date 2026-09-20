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
