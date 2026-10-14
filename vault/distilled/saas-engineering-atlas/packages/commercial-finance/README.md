# P01 · 交易、财务与资金

分开合同承诺、现金、应收/应付、收入、风险敞口与内部抵销；不把 paid 当所有义务完成。

唯一写入范围：`vault/distilled/saas-engineering-atlas/packages/commercial-finance/`。建议 branch：`cloud/saas-atlas-commercial-finance-20261014`。公共文件只读；从父线程给出的 checkpoint SHA 开始，不跟随移动中的 main。

先读 [worker 契约](../../worker-contract.md)、[案例模板](../../case-template.md)、[验证方法](../../validation.md)。

| Case ID | 工作链 |
|---|---|
| H01 | 报价 → 合同 → 服务 → 收款 → 收入 |
| H02 | 请购 → 验收 → 发票匹配 → 付款 |
| H03 | 子账 → 对账 → 关账 → 管理报告 |
| V12 | 申请 → 审批 → 放款 → 贷后 → payoff |
| V13 | Submission → quote → issue → claim → reserve → payment |
| V14 | 投资订单 → fills/cancel → allocation → settlement |
| X02 | Intercompany operations：集团销售 → 实物流/虚单 → 内外结算 → 合并核对 |

来源种子：`ACORD`, `D365_CLOSE`, `FIX`, `GUIDEWIRE`, `IRONCLAD`, `KINGDEE`, `MAMBU`, `MAMBU_APPROVE`, `ORACLE_MATCH`, `SF_QTC`, `STRIPE_INV`, `STRIPE_REV`, `STRIPE_WEBHOOK`。公共 [来源登记](../../../../provenance/saas-engineering-atlas/catalog.json)的未读条目必须实际核查后才能支持事实。

H01 的公共示例只作参考，完整 H01 研究写在本包；不得改公共示例。X02 保留金蝶 EAS 的原语言术语及真实 provider 身份，标题使用 Intercompany operations，不按地域分组。

逐例交付 `<case-id>.md` / `<case-id>.json`，公共证据写本包 `evidence.json`，执行与缺口写 `CHANGELOG.md`，最后写 `handoff.md`。未核实的来源留缺口；本包没有市场排名或跨产品能力评测任务。
