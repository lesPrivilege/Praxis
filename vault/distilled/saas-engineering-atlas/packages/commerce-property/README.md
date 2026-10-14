# P05 · 消费履约、住宿与空间

追踪拆单、部分交付、占用时间、变更、退货和押金；用库存/容量及资金的不同确认边界解释系统。

唯一写入范围：`vault/distilled/saas-engineering-atlas/packages/commerce-property/`。建议 branch：`cloud/saas-atlas-commerce-property-20261014`。公共文件只读；从父线程给出的 checkpoint SHA 开始，不跟随移动中的 main。

先读 [worker 契约](../../worker-contract.md)、[案例模板](../../case-template.md)、[验证方法](../../validation.md)。

| Case ID | 工作链 |
|---|---|
| V04 | 产品目录 → 拆分履约 → 退货 → 净结算 |
| V05 | 菜单选择 → 出餐 → split tender → 结账 |
| V06 | Reservation → 入住夜数 → folio → check-out |
| V15 | 发布设计 → RFI → change event → approved variation → 付款 |
| V16 | 租约 → 入住 → 维护 → 押金对账 |

来源种子：`AUTODESK`, `D365_FS_ARCH`, `IWMS`, `MEWS_POS`, `MEWS_RES`, `PROCORE_CHANGE`, `PROCORE_ORDER`, `SHOPIFY`, `STRIPE_WEBHOOK`, `TOAST`。公共 [来源登记](../../../../provenance/saas-engineering-atlas/catalog.json)的未读条目必须实际核查后才能支持事实。

逐例交付 `<case-id>.md` / `<case-id>.json`，公共证据写本包 `evidence.json`，执行与缺口写 `CHANGELOG.md`，最后写 `handoff.md`。未核实的来源留缺口；本包没有市场排名或跨产品能力评测任务。
