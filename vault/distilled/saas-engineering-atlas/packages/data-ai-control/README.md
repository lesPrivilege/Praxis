# P03 · 数据、文档、安全与 AI SaaS

贯通版本、lineage、租户、授权、metering 与异步恢复；Frontier 只按官方实际身份核查，不继承假想产品定义。

唯一写入范围：`vault/distilled/saas-engineering-atlas/packages/data-ai-control/`。建议 branch：`cloud/saas-atlas-data-ai-control-20261014`。公共文件只读；从父线程给出的 checkpoint SHA 开始，不跟随移动中的 main。

先读 [worker 契约](../../worker-contract.md)、[案例模板](../../case-template.md)、[验证方法](../../validation.md)。

| Case ID | 工作链 |
|---|---|
| H07 | 源数据变化 → 治理 → BI 发布 |
| H08 | 安全信号 → 事件 → 授权响应 → 恢复 |
| H09 | 文档版本 → 审批 → 下游集成记录 |
| X01 | Tenant onboarding → isolated service → metering → bill → offboard |

来源种子：`APQC`, `FRONTIER`, `IRONCLAD`, `OKTA`, `OKTA_SCIM`, `SAAS_LENS`, `SAAS_SILO`, `SENTINEL`, `SNOWFLAKE`, `STRIPE_WEBHOOK`。公共 [来源登记](../../../../provenance/saas-engineering-atlas/catalog.json)的未读条目必须实际核查后才能支持事实。

逐例交付 `<case-id>.md` / `<case-id>.json`，公共证据写本包 `evidence.json`，执行与缺口写 `CHANGELOG.md`，最后写 `handoff.md`。未核实的来源留缺口；本包没有市场排名或跨产品能力评测任务。
