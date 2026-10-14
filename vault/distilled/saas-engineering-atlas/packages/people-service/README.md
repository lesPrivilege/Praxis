# P02 · 人员、专业服务与接收

解释人员权限、工作队列、分派、时限与接收；相似的关闭状态必须保留不同的专业含义。

唯一写入范围：`vault/distilled/saas-engineering-atlas/packages/people-service/`。建议 branch：`cloud/saas-atlas-people-service-20261014`。公共文件只读；从父线程给出的 checkpoint SHA 开始，不跟随移动中的 main。

先读 [worker 契约](../../worker-contract.md)、[案例模板](../../case-template.md)、[验证方法](../../validation.md)。

| Case ID | 工作链 |
|---|---|
| H04 | Offer → 员工 → 薪资 → 离职 |
| H05 | Incident → 受控变更 → 恢复 → 关闭 |
| H06 | 支持请求 → 动作 → 客户确认 → 关闭 |
| V17 | 注册 → roster → 学习 → 成绩批准 → transcript |
| V18 | Matter intake → hold → discovery → production → legal spend |
| V19 | Engagement → 配员 → 工时批准 → capped bill → 收款 |
| V20 | 服务请求 → 两次 booking → 完成 → posting → 付款 |

来源种子：`CERTINIA`, `CERTINIA_BILL`, `D365_FS`, `D365_FS_ARCH`, `EDRM2`, `EDU_PORTAL`, `ELM`, `GREENHOUSE`, `OKTA`, `OKTA_SCIM`, `ONEROSTER`, `SERVICENOW`, `ZENDESK`, `ZENDESK_AI_FAILURE`。公共 [来源登记](../../../../provenance/saas-engineering-atlas/catalog.json)的未读条目必须实际核查后才能支持事实。

逐例交付 `<case-id>.md` / `<case-id>.json`，公共证据写本包 `evidence.json`，执行与缺口写 `CHANGELOG.md`，最后写 `handoff.md`。未核实的来源留缺口；本包没有市场排名或跨产品能力评测任务。
