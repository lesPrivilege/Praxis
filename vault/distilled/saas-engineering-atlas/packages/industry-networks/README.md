# P06 · 生产、资产、公用与供应网络

区分 design baseline、recipe、production order、work order、VEE 和 service activation；讲依赖、约束与现场反馈，不把计划当执行。

唯一写入范围：`vault/distilled/saas-engineering-atlas/packages/industry-networks/`。建议 branch：`cloud/saas-atlas-industry-networks-20261014`。公共文件只读；从父线程给出的 checkpoint SHA 开始，不跟随移动中的 main。

先读 [worker 契约](../../worker-contract.md)、[案例模板](../../case-template.md)、[验证方法](../../validation.md)。

| Case ID | 工作链 |
|---|---|
| V07 | 发布设计 → 生产 → 检验 → 发货 → 收款 |
| V08 | Recipe → batch record → 质量处置 → lot release |
| V09 | RTL baseline → 实现证据 → signoff → release |
| V10 | 资产信号 → 获许可工作 → 维护确认 → 关闭 |
| V11 | Meter data → VEE → bill determinant → 账单 → 结算 |
| V21 | 约束计划 → 供应批准 → 运输 → 交付 → 运费支付 |
| V22 | Product order → service activation → usage → bill → retirement |

来源种子：`AUTODESK`, `AUTODESK_CAE`, `CADENCE`, `D365_FS_ARCH`, `EPCIS`, `IBP`, `IBP_SAMPLE`, `IFS`, `ISA95`, `LABWARE`, `MAXIMO`, `ORACLE_VEE`, `SAP_GI`, `SAP_O2C`, `SAP_PP`, `SAP_PP_DETAIL`, `TMF622`, `TMF_DIR`。公共 [来源登记](../../../../provenance/saas-engineering-atlas/catalog.json)的未读条目必须实际核查后才能支持事实。

`SIEMENS_AI` 是尚未映射到单例的补充种子；判断其与 V07/V10 是否相关后再引用，不能仅为覆盖来源数而使用。

逐例交付 `<case-id>.md` / `<case-id>.json`，公共证据写本包 `evidence.json`，执行与缺口写 `CHANGELOG.md`，最后写 `handoff.md`。未核实的来源留缺口；本包没有市场排名或跨产品能力评测任务。
