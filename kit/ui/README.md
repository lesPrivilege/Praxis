# Enterprise UI

候选：AppShell、ResourceTable、ObjectDetail、ReviewWorkbench、TaskQueue、EvidencePanel、AuditTimeline、CompareView、ExceptionPanel。

组件验收矩阵至少覆盖 default/loading/empty/error/disabled/permission-denied；AI工作面另覆盖 running/needs-review/accepted/rejected/escalated/missing-evidence。

默认方向是统一企业组件语言；Ant Design作为优先参考。版本与具体依赖在实现ADR中决定。Storybook的 `component × state × fixture` 是拟采用的可执行契约方法，本轮尚未创建stories。

## 何时选择与重访

从 [Design / Interaction](../design/interaction/README.md)进入本页。当前没有已验收的组件消费者；只有具体场景需要某类工作面时，才按其数据、动作、权限与失败路径选择候选，并用该场景的 fixture 检查矩阵。Ant Design 与 Storybook 是待复核的实现方向，不构成依赖安装或默认采购决定。

首个 demo 的约束、上游许可/API 或实际使用反例变化时重访；不适用的候选退回研究参考，不为维持清单新增组件目录。场景与实现尚未出现时，本页只提供选择与验收触发，不能声明组件已完成。
