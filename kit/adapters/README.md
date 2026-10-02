# Adapter boundaries

| 边界 | 责任 |
|---|---|
| LLM | provider调用、结构化结果、失败和来源元数据 |
| Storage | 原件、版本、定位及访问接口 |
| Identity / access | actor、能力检查；demo persona明确标注 |
| Enterprise | 只读导入/人工上传起步；系统专有协议留在适配层 |

客户策略不得硬编码进通用组件，外部provider不得成为领域schema的所有者。尚无已实现adapter。

## 任务参考路由

需要定义 provider、模型、配置变更、stream、重试或续接时，先读 [Agent Runtime 机制研究（2026-09-25）](../../vault/distilled/agent-runtime-survey-20260925/README.md)，再查 [DeepSeek Harness](../../vault/distilled/agent-runtime-survey-20260925/deepseek.md) 与 [三网关对照](../../vault/distilled/agent-runtime-survey-20260925/gateways.md)；消费的是 route generation、credential reference、attempt trail、流式提交和 opaque state 的边界。需要一个本地 CLI 的 attach/resume/stop 适配时，再看 [Orchestra 候选](../../vault/distilled/agent-runtime-survey-20260925/orchestra.md) 与 [消费边界](../../vault/distilled/agent-runtime-survey-20260925/consumption-boundary.md)，消费 native session 与 unknown outcome 的验收反例。

以上材料均锚定 2026-09-25 的研究，外部项目未安装或运行；[候选工单](../../vault/distilled/agent-runtime-survey-20260925/disposition.md)只提供 ARS-01–04 的验证方向，不能证明 adapter 已实现、provider 已授权或可直接照搬。

冷启动只需描述当前适配问题：研究入口会把 provider/model、CLI 生命周期和网关边界引到对应语义页，再由 [Agent Runtime 快照索引](../../vault/snapshots/agent-runtime-survey-20260925/README.md)核对日期、版本、来源和证据。只有验收、冲突或缺口需要时才回查快照原件；未命名的材料不要求先通读整批研究。

需要把内部工具的数据源、查询和工作面接入 adapter 时，查 [internal-tools 参考族](../../vault/references/internal-tools/README.md) 及 [ToolJet 词汇卡](../../vault/references/internal-tools/tooljet-ubiquitous-language.md)，消费 page/query/component、environment/release 等命名；这些外部产品不成为 Praxis domain schema 或默认技术选型。
