# Enterprise UI

候选：AppShell、ResourceTable、ObjectDetail、ReviewWorkbench、TaskQueue、EvidencePanel、AuditTimeline、CompareView、ExceptionPanel。

组件验收矩阵至少覆盖 default/loading/empty/error/disabled/permission-denied；AI工作面另覆盖 running/needs-review/accepted/rejected/escalated/missing-evidence。

默认方向是统一企业组件语言；Ant Design作为优先参考。版本与具体依赖在实现ADR中决定。Storybook的 `component × state × fixture` 是拟采用的可执行契约方法，本轮尚未创建stories。
