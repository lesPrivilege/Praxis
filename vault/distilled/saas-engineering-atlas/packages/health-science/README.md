# P04 · 医疗、临床试验与实验室

分别保留 ServiceRequest、DiagnosticReport、consent、eCRF、sample 与 lot 的语义；专业复核和放行不得被 UI 状态替代。

唯一写入范围：`vault/distilled/saas-engineering-atlas/packages/health-science/`。建议 branch：`cloud/saas-atlas-health-science-20261014`。公共文件只读；从父线程给出的 checkpoint SHA 开始，不跟随移动中的 main。

先读 [worker 契约](../../worker-contract.md)、[案例模板](../../case-template.md)、[验证方法](../../validation.md)。

| Case ID | 工作链 |
|---|---|
| V01 | 就诊 → 检验/影像证据 → 理赔 → 结算 |
| V02 | Protocol → consent → eCRF query → signed data lock |
| V03 | Sample → 校准分析 → 结果复核 → lot certificate |

来源种子：`CTMS`, `DICOM`, `EDC`, `FHIR_ORDER`, `FHIR_REPORT`, `LABWARE`, `STRIPE_INV`。公共 [来源登记](../../../../provenance/saas-engineering-atlas/catalog.json)的未读条目必须实际核查后才能支持事实。

逐例交付 `<case-id>.md` / `<case-id>.json`，公共证据写本包 `evidence.json`，执行与缺口写 `CHANGELOG.md`，最后写 `handoff.md`。未核实的来源留缺口；本包没有市场排名或跨产品能力评测任务。
