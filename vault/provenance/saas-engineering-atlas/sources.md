# 来源总表

按 canonical URL 汇集材料，原 ID 作为别名保留。每条主张的范围独立；当前可用状态、读取日期与失败记录见 [catalog](catalog.json) 和 [reviews](reviews.json)。包内 evidence 是原始编辑源，本页由索引脚本生成。

## APQC

[Process Frameworks](https://www.apqc.org/process-frameworks)

本教材保留此研究入口；所列读取记录未形成支持事实的主张。


消费：[README](../../../projects/books/saas-engineering/README.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## ISA95

[ISA-95 Enterprise-Control System Integration](https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard)

- `V07:claim:enterprise-control-boundary`：ISA-95 官方公开简介讨论制造控制功能与企业业务功能之间的信息集成边界。 定位：What Is ISA-95?; Purpose of ISA-95; web lines 41–44, 113–115。边界：仅公开简介的主题范围；未读取付费标准全文，不提炼条文或声称标准符合性。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V07](../../../projects/books/saas-engineering/packages/industry-networks/V07.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## EPCIS

[EPCIS and Core Business Vocabulary](https://www.gs1.org/standards/epcis)

本教材保留此研究入口；所列读取记录未形成支持事实的主张。


消费：[README](../../../projects/books/saas-engineering/README.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## SAP_PP

[Processing Production Orders](https://learning.sap.com/courses/executing-basic-erp-processes-with-sap-s-4hana/processing-production-orders)

- `V07:claim:production-steps`：SAP 课程分别解释生产单创建、放行、耗料出库、生产确认和成品收货；放行后可做相关过账，确认用于跟踪生产进度。 定位：Processing of Production Orders; Production Order in Detail; web lines 70–98。边界：课程的离散制造场景；未运行演示或 SAP 实例；正文合成状态机不是 SAP 完整状态定义。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V07](../../../projects/books/saas-engineering/packages/industry-networks/V07.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## SAP_PP_DETAIL

[Production order and process order](https://help.sap.com/docs/SUPPORT_CONTENT/prodord/3138697900.html)

本教材保留此研究入口；所列读取记录未形成支持事实的主张。


消费：[README](../../../projects/books/saas-engineering/README.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## SAP_GI

[Posting Goods Issues for Production Orders](https://learning.sap.com/courses/manage-production-orders-in-sap-s-4hana-manufacturing/posting-goods-issues-for-production-orders)

- `V07:claim:goods-movement-boundary`：SAP 耗料课程将系统库位转移过账与实物转移区分，并说明库存不足时可产生需后处理的记录。 定位：Material Staging / Pull List; Negative Stocks and Postprocessing; web lines 118–124, 181–197。边界：原课程也讨论可配置负库存；本例禁止负库存是独立合成策略，不声称 SAP 普遍禁止。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V07](../../../projects/books/saas-engineering/packages/industry-networks/V07.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## SAP_O2C

[Navigating the Order-to-Cash Process Steps](https://learning.sap.com/courses/discovering-the-basics-of-sap-s-4hana-sales/executing-sales-order-management_cad9dfbe-bafc-4ed9-ac2e-6fd8422430e4)

- `V07:claim:sales-schedule-lines`：SAP 销售单据有 header、item 与 schedule line 层，schedule line 记录交付日期和数量，一个行项目可有多个分期交付计划行。 定位：Structure of Sales Documents; web lines 68–85。边界：只核查所列段落；原目录标题与当前页面题名不完全一致；不由此推断客户合同允许部分交付。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V07](../../../projects/books/saas-engineering/packages/industry-networks/V07.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## SF_QTC

[What is Quote-to-Cash?](https://www.salesforce.com/eu/sales/cpq/quote-to-cash/)

- `H01:claim:qtc-scope`：Salesforce 的 QTC 范围涉及报价、履约、开票、应收与收款分配。 定位：Introduction; What is the quote-to-cash process?; Send the Invoice, Collect Payment, and Allocate Cash。边界：仅流程范围；营销效果、收入可确认时点及技术实现未采纳。

消费：[README](../../../projects/books/saas-engineering/README.md)、[H01](../../../projects/books/saas-engineering/packages/commercial-finance/H01.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## STRIPE_INV

[How invoicing works](https://docs.stripe.com/invoicing/overview)

- `STRIPE_INV-C1`：Stripe 的 invoice lifecycle 区分 draft、open、paid、void 与 uncollectible；finalization 使 draft 进入 open。页面 badge 不总是底层状态。 定位：Invoice lifecycle; Draft invoices; Open invoices。边界：仅所列章节与主张已作文本核查；未执行 provider、未保存网页快照。
- `H01:claim:paid-evidence`：Stripe invoice.paid 可由信用余额、免费/试用、out-of-band 等情况产生，不能单凭事件认定一次关联 PaymentIntent 成功。 定位：Paid invoices; Out of band invoices。边界：只说明 listed 状态证据差异；不是银行结算确认或通用会计规则。
- `V01:claim:stripe-paid`：Stripe invoice 的 paid 可由客户余额、低于最低扣款额或线下支付标记等形成；不等同于某次卡支付成功。 定位：Invoice lifecycle; Invoice statuses; Paid invoices; Out of band invoices。边界：仅 Stripe 产品公开语义；不是医疗支付方或银行到账保证，未执行 Stripe。

消费：[README](../../../projects/books/saas-engineering/README.md)、[H01](../../../projects/books/saas-engineering/packages/commercial-finance/H01.md)、[V01](../../../projects/books/saas-engineering/packages/health-science/V01.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## STRIPE_WEBHOOK

[Receive Stripe events in your webhook endpoint](https://docs.stripe.com/webhooks)

- `STRIPE_WEBHOOK-C1`：Stripe 不保证事件按生成顺序送达，可能重复投递；文档要求验证签名，并讨论 event ID 去重和异步处理。 定位：Event ordering; Handle duplicate events; Handle events asynchronously; Create a handler。边界：仅所列章节与主张已作文本核查；未执行 provider、未保存网页快照。
- `V04:claim:webhook-boundary`：Stripe 文档说明 webhook 可重复、无生成顺序送达保证，并要求验证签名及讨论异步处理。 定位：Event ordering; Handle duplicate events; Handle events asynchronously; Verify events are sent from Stripe; lines 511–543, 571–594。边界：保持已有 STRIPE_WEBHOOK-C1；只核对这些章节，未调用 webhook，不扩展为其他 provider 的保证。
- `V05:claim:webhook-boundary`：Stripe 文档说明 webhook 可重复、无生成顺序送达保证，并要求验证签名及讨论异步处理。 定位：Event ordering; Handle duplicate events; Handle events asynchronously; Verify events are sent from Stripe; lines 511–543, 571–594。边界：保持已有 STRIPE_WEBHOOK-C1；Toast 与 Stripe 在此是不同机制参照，不构成已配置集成。
- `X01:claim:webhook-boundary`：Stripe webhook 文档要求签名验证并说明事件可能重复、顺序不保证，可通过 API 补查对象。 定位：Create a handler / raw body; Event ordering; Handle duplicate events; Handle events asynchronously。边界：本次重读；与公共 STRIPE_WEBHOOK-C1 语义重叠，父线程可保留原公共 claim 并建立别名。未真实接收 webhook。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V04](../../../projects/books/saas-engineering/packages/commerce-property/V04.md)、[V05](../../../projects/books/saas-engineering/packages/commerce-property/V05.md)、[X01](../../../projects/books/saas-engineering/packages/data-ai-control/X01.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## STRIPE_REV

[Revenue Recognition with subscriptions and invoicing](https://docs.stripe.com/revenue-recognition/methodology/subscriptions-and-invoicing)

- `STRIPE_REV-C1`：Stripe Revenue Recognition 按 finalized invoice 的 line item 服务期间处理收入；取消 subscription 不自动改写已开票的收入计划。 定位：Licensed subscriptions; Subscription cancellations; Standalone invoices。边界：仅所列章节与主张已作文本核查；未执行 provider、未保存网页快照。
- `H01:claim:period-input`：Stripe 收入计划基于 finalized invoice 与服务行期间；取消 subscription 不自动改写已开票计划，独立发票未设行期间会影响确认时点。 定位：Introduction; Licensed subscriptions; Subscription cancellations; Standalone invoices。边界：不支持本例整数日累计算法、合规性、退款调整分录或 provider 内部实现。

消费：[README](../../../projects/books/saas-engineering/README.md)、[H01](../../../projects/books/saas-engineering/packages/commercial-finance/H01.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## ORACLE_MATCH

[Match Approval Level Options](https://docs.oracle.com/en/cloud/saas/procurement/26b/oapro/match-approval-level-options.html)

- `H02:claim:oracle-match-levels`：Oracle 26b区分Two-Way、Three-Way、Four-Way数量匹配级别，逐步加入receipt与inspection accepted quantity；invoice match option决定匹配到PO或receipt，与审批级别独立。 定位：ORACLE_MATCH: Note; Two-Way; Three-Way; Four-Way。边界：不支持任何具体租户政策、默认值、价格容差或内部实现。

消费：[README](../../../projects/books/saas-engineering/README.md)、[H02](../../../projects/books/saas-engineering/packages/commercial-finance/H02.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FHIR_ORDER

[FHIR ServiceRequest](https://hl7.org/fhir/servicerequest.html)

- `V01:claim:fhir-request`：ServiceRequest 表达请求、提议或计划，执行后产生的报告等资源可以关联该请求。 定位：FHIR v5.0.0 R5 §12.18.1 Scope and Usage; §12.18.2 Boundaries and Relationships。边界：定义不证明实际服务已执行，不证明任何厂商部署；未读取特定 implementation guide。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V01](../../../projects/books/saas-engineering/packages/health-science/V01.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FHIR_REPORT

[FHIR DiagnosticReport](https://fhir.hl7.org/fhir/diagnosticreport.html)

- `V01:claim:fhir-report`：DiagnosticReport 提供报告上下文与解释，Observation 提供原子结果，报告可关联请求及影像研究。 定位：FHIR v5.0.0 §10.3.1–3; §10.3.6.3–6。边界：未验证某医院的报告流程、通知、签名或历史留存实现；标准不证明临床结论正确。
- `V01:claim:report-correction`：DiagnosticReport 讨论修订和撤回报告的处理，接收方须留意这些变化。 定位：§10.3.6.5 Diagnostic Report Revisions。边界：具体替代关系、版本存储、提醒与重新收费策略属于应用设计。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V01](../../../projects/books/saas-engineering/packages/health-science/V01.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## DICOM

[About DICOM: Overview](https://www.dicomstandard.org/about-home)

本教材保留此研究入口；所列读取记录未形成支持事实的主张。


消费：[README](../../../projects/books/saas-engineering/README.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## CTMS

[Veeva CTMS](https://www.veeva.com/products/veeva-ctms/)

- `V02:claim:ctms-scope`：Veeva CTMS 的产品页自述提供试验管理与监查，包含入组、里程碑、访视报告和偏离处理。 定位：Improve Trial Visibility for Faster, Better Decisions; main product description, lines 434–439。边界：marketing-self-description; no API, stack, performance or compliance verification

消费：[README](../../../projects/books/saas-engineering/README.md)、[V02](../../../projects/books/saas-engineering/packages/health-science/V02.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## EDC

[Medidata Rave EDC](https://www.medidata.com/en/data-experience/edc-systems/)

- `V02:claim:edc-scope`：Medidata Rave EDC 的产品页自述支持临床试验数据采集、管理、清理与报告。 定位：Rave main description, lines 398–401; How Rave Moves Trials Forward, lines 420–462。边界：marketing-self-description; not evidence for Veeva semantics, specific workflow guards or implementation

消费：[README](../../../projects/books/saas-engineering/README.md)、[V02](../../../projects/books/saas-engineering/packages/health-science/V02.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## LABWARE

[LabWare QAQC SaaS LIMS](https://www.labware.com/lims/saas/qaqc)

- `V03:claim:labware-workflow`：LabWare QAQC 官方页面自述 sample chain of custody、lot data review/release、CoA 自动生成与报告审批功能。 定位：Top SaaS LIMS Features for QAQC: Sample Management; Lot Management & Release; More LabWare QAQC Features: COAs。边界：仅厂商公开功能自述；未核验产品、配置、API、验证包、实际部署或客户效果；不支持合成状态机/算法/栈。
- `V03:claim:labware-instruments`：LabWare QAQC 页面自述仪器性能检查、仪器集成与标准文件格式自动导入结果。 定位：More LabWare QAQC Features: Instruments; Questions about QAQC: Can LabWare QAQC help manage my Instruments?。边界：未取得特定仪器协议、版本或接口契约；不得据此声称所有仪器可接或导入必然正确。
- `V08:claim:lims-objects`：LabWare QAQC 自述提供样品接收链、结果录入、批次跟踪、数据复核、lot release 与 COA 功能；Batch Manager 可组合样品形成测试批。 定位：Top SaaS LIMS Features for QAQC: Sample Management, Results Entry, Lot Management & Release; More Features: Batch Manager; web lines 79–86, 108–109。边界：营销产品能力自述；未核查实际租户、默认规则、验证范围、API或性能，测试批不能自动等同生产批。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V03](../../../projects/books/saas-engineering/packages/health-science/V03.md)、[V08](../../../projects/books/saas-engineering/packages/industry-networks/V08.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## SHOPIFY

[Apps in order management](https://shopify.dev/docs/apps/build/orders-fulfillment/order-management-apps)

- `V04:claim:shopify-model`：Order、FulfillmentOrder、Fulfillment 分别承载订单、同地点待履约项目数量、实际发货与追踪信息；订单可有多种交付方式。 定位：How it works; API objects and relationships; Statuses; lines 133–170。边界：仅对象关系及多个交付方式；未读取图像状态机，不证明库存优化、栈或本例生命周期。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V04](../../../projects/books/saas-engineering/packages/commerce-property/V04.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## TOAST

[Order object summary](https://doc.toasttab.com/doc/devguide/apiOrdersOrderObjectSummary.html)

- `V05:claim:toast-statuses`：approvalStatus 只反映是否送厨；selection 的 NEW/HOLD/SENT/READY 描述制作，READY 依赖 Toast KDS；check 的 PAID/CLOSED 与付款和小费调整有关。 定位：Order status information: Order status values; Check status values; Menu item selection status values; lines 36–115。边界：仅公开状态说明；未将其等同本例简化状态；不声称全流程、所有设备或 API 权限。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V05](../../../projects/books/saas-engineering/packages/commerce-property/V05.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## MEWS_RES

[Reservations](https://docs.mews.com/connector-api/operations/reservations)

- `V06:claim:mews-res-model`：Mews Reservation separates requested resource category from optional assigned resource and scheduled from actual times; Confirmed/Started/Processed identify confirmation/check-in/check-out states. 定位：Reservations → Reservation (ver 2023-06-06) and Service order state。边界：Not a complete reservation lifecycle or internal room-assignment algorithm.
- `V06:claim:mews-start`：Mews Start reservation requires starting conditions including Confirmed, no future start and an assigned inspected room. 定位：Reservations → Start reservation。边界：The documented list is illustrative, not exhaustive. Local role and version policy is synthetic.
- `V06:claim:mews-process`：Mews Process reservation distinguishes processing conditions, CloseBills and AllowOpenBalance; allowing an open balance requires Notes. 定位：Reservations → Process reservation → Conditions; AllowOpenBalance / CloseBills / Notes properties。边界：Does not mean every reservation can depart with debt or all bills are automatically closed. Teaching policy is separately synthetic.

消费：[README](../../../projects/books/saas-engineering/README.md)、[V06](../../../projects/books/saas-engineering/packages/commerce-property/V06.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## MEWS_POS

[Point of sale integration](https://docs.mews.com/connector-api/use-cases/point-of-sale)

- `V06:claim:mews-pos-routing`：Mews POS orders post to a customer profile rather than a room/reservation; LinkedReservationId can associate the reservation. Cashlist does not automatically block API posting, so POS enforcement matters. 定位：Point of sale → General principles; Customer search; Charge posting / Linking orders to reservations。边界：Mews also documents in-house and Paymaster paths; the case deliberately uses a stricter in-house-only synthetic policy. No proof of a particular POS implementation.

消费：[README](../../../projects/books/saas-engineering/README.md)、[V06](../../../projects/books/saas-engineering/packages/commerce-property/V06.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## GUIDEWIRE

[PolicyCenter submissions](https://docs.guidewire.com/cloud/pc/202507/cloudapibf/cloudAPI/topics/122-PCjobTypes/01-submissions/c_submissions.html)

- `V13:claim:submission`：Guidewire PolicyCenter 202507投保交易由Draft报价到Quoted，编辑需回Draft再报价；bind与issue有不同含义且可分开处理。 定位：Submissions: Overview of policy transaction management; Editing a quoted job; Completing the submission。边界：仅该公开产品文档，不泛化为所有保险业务的法律规则；V13自建状态不等于原生API状态全集。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V13](../../../projects/books/saas-engineering/packages/commercial-finance/V13.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## ACORD

[ACORD Reference Architecture](https://www.acord.org/standards-architecture/reference-architecture)

本教材保留此研究入口；所列读取记录未形成支持事实的主张。


消费：[README](../../../projects/books/saas-engineering/README.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## MAMBU

[Loan Account Life Cycle and States](https://docs.mambu.com/docs/loan-account-life-cycle-and-states/)

- `V12:claim:mambu-states`：Mambu区分不完整申请、待审、已批准、放款后Active、逾期与不同关闭情形；批准后条款不能直接修改。 定位：Loan Account Life Cycle and States: Partial Application / Pending Approval / Approved / Disburse a Loan / Active (in Arrears) / Closed。边界：产品文档语义，不是银行到账证明，也不证明V12合成计息或复核实现。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V12](../../../projects/books/saas-engineering/packages/commercial-finance/V12.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## MAMBU_APPROVE

[Approving a Loan](https://docs.mambu.com/docs/approving-a-loan/)

- `V12:claim:mambu-approval`：Mambu贷款放款前需要具有Approve Loan权限的用户批准；批准入口限定Pending Approval。 定位：Approving a Loan: warning and paragraph following it, lines 91–98。边界：按钮可见性不替代本例的服务端授权设计；不推断其他权限规则。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V12](../../../projects/books/saas-engineering/packages/commercial-finance/V12.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FIX

[Order State Changes](https://www.fixtrading.org/online-specification/order-state-changes/)

本教材保留此研究入口；所列读取记录未形成支持事实的主张。


消费：[README](../../../projects/books/saas-engineering/README.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## PROCORE_CHANGE

[Create Change Events](https://support.procore.com/products/online/user-guide/project-level/change-events/tutorials/create-change-events)

- `V15:claim:change-uncertainty`：Procore change event 可记录影响原范围、进度或潜在成本的变化；范围可待定，Cost ROM 输入本身不影响其它工具财务值，预算视图可另行配置显示。 定位：Background; Create a New Change Event > Scope; Add Change Event Line Items > Cost ROM。边界：未断言估算等同授权或已发生成本，不推断未公开算法。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V15](../../../projects/books/saas-engineering/packages/commerce-property/V15.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## PROCORE_ORDER

[Change Orders](https://support.procore.com/products/online/user-guide/project-level/change-orders)

- `V15:claim:order-types`：Procore Change Orders 目录分别列出 Prime Contract、Commitment、Client Contract 与 Funding change orders。 定位：Examples/tutorial categories。边界：目录仅支持分类，审批权限另有来源。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V15](../../../projects/books/saas-engineering/packages/commerce-property/V15.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## EDRM2

[Current EDRM Model](https://edrm.net/edrm-model/current/)

- `V18:claim:edrm-phases`：EDRM 2.0区分保全、审阅和交付，并说明模型非字面线性流程。 定位：EDRM Model 2.0 (2026), Definitions; What’s New: Reading the model; lines 79–106。边界：EDRM概念模型，不证明厂商执行、司法要求或本例状态机。仅原创短释义；未下载/转载图。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V18](../../../projects/books/saas-engineering/packages/people-service/V18.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## ONEROSTER

[Rostering, Resources, and Gradebook Standards](https://www.1edtech.org/blog/rostering-resources-and-gradebook-standards)

- `V17:claim:exchange-scope`：1EdTech 对 OneRoster 的用途描述包括班级名单、学习资源使用名单与gradebook交换，并提供CSV与REST交换途径；互通需核对具体能力。 定位：Opening use-cases; BACKGROUND; CSV exchange and certification scope paragraphs。边界：说明文章不是学校评分政策；不把标准标签等同两个实际产品全功能互通。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V17](../../../projects/books/saas-engineering/packages/people-service/V17.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## EDU_PORTAL

[1EdTech Standards](https://standards.1edtech.org/)

- `V17:claim:standards-boundary`：1EdTech门户区分K–12 OneRoster交换、高等教育Edu-API和学习成果记录CLR。 定位：Integration / Digital Credentials category descriptions。边界：仅门户定位；本例 transcript 为学校合成记录，不声称实现CLR。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V17](../../../projects/books/saas-engineering/packages/people-service/V17.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## OKTA

[Understanding SCIM](https://developer.okta.com/docs/concepts/scim/)

- `H08:claim:okta-scim`：For the documented Okta-driven deprovision path, the downstream SCIM user is updated active=false; deleting an already deactivated Okta user does not send a downstream resource DELETE. 定位：How does SCIM work? / Delete (Deprovision)。边界：Limited to described direction and setup; does not prove arbitrary downstream access/session revocation or erasure.
- `H04:claim:deprovision-not-delete`：Okta 描述取消配置时将目标 SCIM 用户 active 置 false；后续删除 Okta 已停用用户不发送目标用户 DELETE。 定位：How does SCIM work? / Delete (Deprovision)。边界：目标应用会话、token、物理资产与工资不在该事实范围内。

消费：[README](../../../projects/books/saas-engineering/README.md)、[H08](../../../projects/books/saas-engineering/packages/data-ai-control/H08.md)、[H04](../../../projects/books/saas-engineering/packages/people-service/H04.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## OKTA_SCIM

[Okta and SCIM Version 2.0](https://developer.okta.com/docs/api/openapi/okta-scim/guides/scim-20)

- `X01:claim:scim-deactivate`：Okta SCIM 2.0 移除或停用用户时设置 active=false，不执行 user DELETE；suspended 无 deprovisioning event。 定位：SCIM user operations > Update a specific user (PATCH); Delete users。边界：OIN 与 AIW 的 PUT/PATCH 区别保留在原文；不推导应用会话已撤销或数据已删除。
- `H04:claim:suspend-boundary`：Okta SCIM 2.0 guide 的 Delete users 节说明停用或移除集成会设置 active=false；在 Okta 中 suspended 不发送 deprovisioning event。 定位：Delete users, lines 496-504。边界：不把 suspend、deactivate、delete 混为一类；不同集成 PUT/PATCH 方法另有差异。

消费：[README](../../../projects/books/saas-engineering/README.md)、[X01](../../../projects/books/saas-engineering/packages/data-ai-control/X01.md)、[H04](../../../projects/books/saas-engineering/packages/people-service/H04.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## SERVICENOW

[Life cycle of an Incident](https://www.servicenow.com/docs/r/it-service-management/incident-management/c_IncidentManagementStateModel.html)

- `H05:claim:incident-states`：ServiceNow incident 生命周期区分 New、In Progress、On Hold、Resolved、Closed、Canceled，On Hold 原因包含等待 caller/change/problem/vendor。 定位：Table 1. Incident states。边界：状态名称不自动定义本例SLA暂停规则；不使用概览的强措辞推导根因必消除。

消费：[README](../../../projects/books/saas-engineering/README.md)、[H05](../../../projects/books/saas-engineering/packages/people-service/H05.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## D365_FS

[Work order lifecycle and system statuses](https://learn.microsoft.com/en-us/dynamics365/field-service/work-order-status-booking-status)

- `V20:claim:status-boundary`：工单和 booking 生命周期独立；默认多 booking 完成/取消组合影响 Completed，Posted 的 Invoice/Actuals 受配置影响。 定位：Statuses in the work order lifecycle，步骤 3 注记及步骤 6—7；Work order system status processes / Posted；Complete your booking without completing your work order for follow-up activity。边界：不是任何自定义状态下的通用聚合定理；不证明客户验收、零欠款或所有配置均开票。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V20](../../../projects/books/saas-engineering/packages/people-service/V20.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## D365_FS_ARCH

[Work order architecture](https://learn.microsoft.com/en-us/dynamics365/field-service/field-service-architecture)

- `V16:claim:booking-work`：Dynamics 365 Field Service 架构文档区分 work order、resource requirement 和 booking；同一 requirement 可以多次 booking，技师更新 booking，服务经理复核关闭工单。 定位：The work order is scheduled to resources; A field technician performs the work order; The work order is reviewed and completed。边界：未断言产品自动应用本例全部必需任务 guard；未支持租约或押金规则。
- `V10:claim:field-service-objects`：Microsoft Field Service distinguishes work order, Resource Requirement and Booking, permits multiple bookings for a requirement, and describes technician performance followed by service-manager review/closure. 定位：https://learn.microsoft.com/en-us/dynamics365/field-service/field-service-architecture — The work order is scheduled to resources; A field technician performs the work order; The work order is reviewed and completed.。边界：Only the reviewed process/object separation; no claim that synthetic permits, states, databases or algorithms are Microsoft implementations.
- `V20:claim:requirement-booking`：Resource Requirement 表达安排需求；Booking 表达资源时段，同一需求可多次预约；自动同步针对主要需求，手工多需求需另行处理。 定位：The work order is scheduled to resources，正文第 1—4 段。边界：Dynamics 365 文档的对象说明；不支持本例自建排程算法、接收规则或 provider 内部栈。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V16](../../../projects/books/saas-engineering/packages/commerce-property/V16.md)、[V10](../../../projects/books/saas-engineering/packages/industry-networks/V10.md)、[V20](../../../projects/books/saas-engineering/packages/people-service/V20.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## ZENDESK

[About the ticket lifecycle and ticket statuses](https://support.zendesk.com/hc/en-us/articles/8263915942938-About-the-ticket-lifecycle-and-ticket-statuses)

- `H06:claim:ticket-status`：Zendesk 标准状态区分等待客户、等待其他方、客服提交方案和系统关闭；solved 回复可重开，closed 回复产生关联 follow-up。 定位：About standard ticket statuses; Understanding how tickets are closed; About reopened and follow-up tickets。边界：状态与配置有产品范围；不声称 Zendesk 默认要求明确客户确认。

消费：[README](../../../projects/books/saas-engineering/README.md)、[H06](../../../projects/books/saas-engineering/packages/people-service/H06.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## ZENDESK_AI_FAILURE

[Auto assist creates a loop for solved tickets](https://support.zendesk.com/hc/en-us/articles/9947838310298-Auto-assist-creates-a-loop-for-solved-tickets)

- `H06:claim:auto-assist-loop`：Zendesk 官方故障页记录接受带 solved 动作的 auto assist 建议后客户回复可能导致重复建议，并建议拆开回复和 solved 动作或人工接管。 定位：Issue symptoms; Resolution steps。边界：仅官方描述的故障条件，没有现场复现或发生率结论。

消费：[README](../../../projects/books/saas-engineering/README.md)、[H06](../../../projects/books/saas-engineering/packages/people-service/H06.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## SNOWFLAKE

[Introduction to streams](https://docs.snowflake.com/en/user-guide/streams-intro)

- `H07:claim:stream-offset`：Snowflake stream 保存源对象消费位置并借助版本历史返回变化；单纯查询不推进位置，消费 DML 提交后推进，事务回滚则不推进。 定位：Introduction to streams → Offset storage; Table versioning; Repeatable read isolation; public page lines 113–150。边界：范围是所读 stream 事务语义；不证明外部 CDC connector、业务事件唯一性或跨系统事务保证。
- `H07:claim:stream-net-delta`：Snowflake standard stream 给出两个位置间的净变化；该区间新增后又删除的行不出现在净变化结果中。 定位：Introduction to streams → Types of streams → Standard; lines 194–200。边界：只用于解释 standard stream 的净变化语义，不等于 append-only stream 或完整业务审计历史。
- `H07:claim:stream-stale`：stream 位置越过源表历史保留范围后可能 stale，未消费变化不可再访问；重新创建 stream 用于继续跟踪后续变化。 定位：Introduction to streams → Data retention period and staleness; lines 219–222, 241–252。边界：未声称固定保留期；实际参数、对象类型与账户配置需核对。补数流程是案例设计，不是此页面保证。

消费：[README](../../../projects/books/saas-engineering/README.md)、[H07](../../../projects/books/saas-engineering/packages/data-ai-control/H07.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## GREENHOUSE

[Harvest API](https://docs.greenhouse.io/harvest.html)

- `H04:claim:offer-identity`：Greenhouse Harvest offer 分别暴露 id、version、application_id、starts_at；更新既有 offer 时通常创建递增版本。 定位：The offer object / Noteworthy attributes。边界：不声称每次更新都产生版本；不构成雇佣、付款或薪资权威。
- `H04:claim:hire-guard`：Harvest Hire Application 要求不是 prospect，且岗位和 offer 所有相关审批已发生。 定位：POST: Hire Application, paragraph before HTTP Request。边界：仅该公开 API 操作的前提；不代表应用层已完成 HR 入职。

消费：[README](../../../projects/books/saas-engineering/README.md)、[H04](../../../projects/books/saas-engineering/packages/people-service/H04.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## IRONCLAD

[What is new in Ironclad: April 2025](https://support.ironcladapp.com/hc/en-us/articles/30977258163607-What-s-New-in-Ironclad-April-2025)

- `H01:claim:contract-workspace`：Ironclad 发布说明将合同状态、未完成任务、协作者责任和统一合同搜索作为界面能力。 定位：New Workflow Page; Unified Dashboard and Repository。边界：2025 年发布说明的产品自述；不证明内部存储、授权或财务机制。
- `H09:claim:provider-ai`：Ironclad April 2025 更新介绍 Custom AI Properties，可用示例改进合同字段抽取。 定位：Custom AI Properties，页面 lines 141–159。边界：只证明当时的功能自述与条件；不证明准确率、当前所有套餐可用或 AI 有批准权限。

消费：[README](../../../projects/books/saas-engineering/README.md)、[H01](../../../projects/books/saas-engineering/packages/commercial-finance/H01.md)、[H09](../../../projects/books/saas-engineering/packages/data-ai-control/H09.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## CADENCE

[RTL-to-GDSII Back-End Flow: Synthesis to Timing Signoff](https://www.cadence.com/en_US/home/company/events/webinars/navigating-from-synthesis-to-timing-signoff.html)

- `V09:claim:cadence-flow`：Cadence 培训页列出综合、可测试性逻辑、等价检查、实现和时序签核主题。 定位：Training Webinar 描述段：You’ll learn concepts such as…；web text lines 8–10。边界：仅课程范围；没有读取注册内容，不证明生产流程、算法或栈。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V09](../../../projects/books/saas-engineering/packages/industry-networks/V09.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## MAXIMO

[Allowable Status Changes for Work Orders](https://www.ibm.com/support/pages/maximo-support-desk-allowable-status-changes-work-orders)

- `V10:claim:maximo-transitions`：The IBM Maximo support article says available target work-order statuses depend on current status; its list gives COMP→Closed and no ordinary state changes from CLOSE. 定位：https://www.ibm.com/support/pages/maximo-support-desk-allowable-status-changes-work-orders — Body; From COMP; From CLOSE.。边界：Canonical IBM body read after seed403. Preserve source identity; historical support guidance is not proof of every version/customization.

消费：[README](../../../projects/books/saas-engineering/README.md)、[V10](../../../projects/books/saas-engineering/packages/industry-networks/V10.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## TMF622

[Product Ordering Management API](https://www.tmforum.org/open-digital-architecture/open-apis/product-ordering-management-api-tmf622/v5.0)

- `V22:claim:product-order`：TMF622 overview describes a product order based on a catalog product offering containing commercial characteristics such as price and product options. 定位：v5.0 Overview line15。边界：Public overview only; no complete status/schema/implementation claim.

消费：[README](../../../projects/books/saas-engineering/README.md)、[V22](../../../projects/books/saas-engineering/packages/industry-networks/V22.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## TMF_DIR

[TM Forum Open API Directory](https://www.tmforum.org/open-digital-architecture/open-apis)

本教材保留此研究入口；所列读取记录未形成支持事实的主张。


消费：[README](../../../projects/books/saas-engineering/README.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## KINGDEE

[金蝶 EAS 集中销售、分开发货、集中结算](https://vip.kingdee.com/eascloud/help/8.6/SCM.web/topics/noname1184.html)

- `X02:claim:kingdee-flow`：金蝶 EAS 8.6 documents direct shipment by the shipping company, two virtual documents at the sales company for internal/external settlement, and parameter-dependent mirrored receivable/payable/payment/receipt generation with described reverse-approval deletions. 定位：1.11.4.9.3 steps3–15, especially4–5 and7–8。边界：No inference about APIs, database atomicity, all reversal guards, accounting policy or deployment. Source step1 wording is not generalized.

消费：[README](../../../projects/books/saas-engineering/README.md)、[X02](../../../projects/books/saas-engineering/packages/commercial-finance/X02.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FRONTIER

[Introducing OpenAI Frontier](https://openai.com/index/introducing-openai-frontier/)

- `X01:claim:frontier-identity`：OpenAI 官方将 Frontier 描述为帮助企业构建、部署和管理 AI agents 的平台，并讨论身份权限与评估。 定位：Introducing OpenAI Frontier: introductory paragraph; Improve quality on real work; Identity, permissions, and boundaries。边界：产品自述；不核验营销效果，不继承旧报告的假想产品定义，不据此断言内部算法、计费或数据库实现。

消费：[README](../../../projects/books/saas-engineering/README.md)、[X01](../../../projects/books/saas-engineering/packages/data-ai-control/X01.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## IFS

[IFS Nexus Black builds industrial AI with Claude](https://claude.com/customers/ifs)

- `V10:claim:ifs-assistance`：Anthropic’s IFS case study describes Resolve using equipment images and sensor readings to assist field diagnosis. 定位：https://claude.com/customers/ifs — introduction; Claude enables production-ready AI for critical industries.。边界：Attributed supplier narrative only; no independent accuracy, production deployment breadth or outcome guarantee.

消费：[README](../../../projects/books/saas-engineering/README.md)、[V10](../../../projects/books/saas-engineering/packages/industry-networks/V10.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## SIEMENS_AI

[Siemens Industrial Copilot expanded, adopted by thyssenkrupp](https://press.siemens.com/global/ro/node/7042)

本教材保留此研究入口；所列读取记录未形成支持事实的主张。


消费：[README](../../../projects/books/saas-engineering/README.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## D365_CLOSE

[Financial period close workspace](https://learn.microsoft.com/en-us/dynamics365/finance/general-ledger/financial-period-close-workspace)

- `H03:claim:d365-close-dependencies`：Dynamics 365 Finance关账工作台可按公司、领域和责任人查看任务；前提未完成的任务不能标为完成；任务支持附加材料，完成动作记录完成时间。 定位：Financial period close workspace: Tasks and status section; Templates。边界：仅任务协调产品行为；不证明任务证据真实、自动过账锁定或算法实现。

消费：[README](../../../projects/books/saas-engineering/README.md)、[H03](../../../projects/books/saas-engineering/packages/commercial-finance/H03.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## CERTINIA

[Timecards](https://help.certinia.com/main/2022.3/Subsystems/PSA/Content/topics/Timecards/AboutTimecards.htm)

- `V19:claim:certinia-timecards`：Certinia PSA 2022.3 Timecards页提供列表筛选及工时记录详情入口。 定位：Timecards; list view and record-detail entry; lines 1–6。边界：固定2022.3文档，只支持列表/详情入口，未断言当前UI或默认审批状态。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V19](../../../projects/books/saas-engineering/packages/people-service/V19.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## CERTINIA_BILL

[Billing Event Generation Tab](https://help.certinia.com/main/2022.2/Subsystems/PSA/Content/topics/BillingItemsEvents/GeneratingBEsTab.htm)

- `V19:claim:certinia-billing`：Certinia PSA 2022.2 Billing Event Generation区分生成批次与release for invoicing，可选择工时等业务来源记录。 定位：Billing Event Generation Tab; opening paragraphs and processing status; lines 1–4, 28–31。边界：固定2022.2文档，生成与release for invoicing分开；不支持收款、当前默认配置或本例原子扣减实现。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V19](../../../projects/books/saas-engineering/packages/people-service/V19.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## ORACLE_VEE

[About VEE](https://docs.oracle.com/en/industries/energy-water/meter-solution-cloud-service/23c/mscs-user-guides/Topics/D1_BG_About_VEE.html)

- `V11:claim:vee-rules`：Oracle23c documents VEE validation/estimation/editing, ordered groups, configurable targeted rules, Issue versus Terminate exception behavior, and preservation of corrected exceptions as closed records. 定位：https://docs.oracle.com/en/industries/energy-water/meter-solution-cloud-service/23c/mscs-user-guides/Topics/D1_BG_About_VEE.html — VEE Groups; VEE Rules; VEE Exceptions.。边界：No authority inferred for averaging, estimate thresholds, customer tariffs, billing legality or settlement.

消费：[README](../../../projects/books/saas-engineering/README.md)、[V11](../../../projects/books/saas-engineering/packages/industry-networks/V11.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## SENTINEL

[Automate incident handling with automation rules](https://learn.microsoft.com/en-us/azure/sentinel/automate-incident-handling-with-automation-rules)

- `H08:claim:sentinel-incident`：Microsoft Sentinel documents incidents as containers of investigation evidence and automation rules as triggers, conditions and actions that may update incidents or invoke playbooks. 定位：Components; Incident-based or alert-based automation。边界：Does not support the synthetic risk score, grouping, source authority or database implementation.

消费：[README](../../../projects/books/saas-engineering/README.md)、[H08](../../../projects/books/saas-engineering/packages/data-ai-control/H08.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## AUTODESK

[CAD/CAM software](https://www.autodesk.com/ca-en/solutions/cad-cam)

- `V15:claim:cad-scope`：Autodesk 的 CAD/CAM 说明把 CAD 的图形设计与技术文档能力和 CAM 的制造指令用途区分；该源不支持建筑变更审批。 定位：FAQ: What is the difference between AutoCAD and CAM?; what is the difference between CAD and CAM。边界：仅概念与产品用途范围；本例不可变设计版本是合成设计。
- `V07:claim:cad-cam`：Autodesk 说明 CAD/CAM 将设计模型与制造编程连接，CAM 使用 CAD 模型生成加工刀具路径。 定位：What is CAD/CAM?; How do I use CAD/CAM software?; web lines 115–123。边界：厂商公开说明，仅支持职责解释；不支持本例发布状态、集成接口或内部实现。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V15](../../../projects/books/saas-engineering/packages/commerce-property/V15.md)、[V07](../../../projects/books/saas-engineering/packages/industry-networks/V07.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## AUTODESK_CAE

[Computer-Aided Engineering](https://www.autodesk.com/in/solutions/computer-aided-engineering-cae)

- `V07:claim:cae-scope`：Autodesk 将 CAE 描述为通过计算与仿真评估工程设计在给定条件下的行为。 定位：What is computer-aided engineering (CAE)?; What is CAE software?; web lines 124–148。边界：设计分析能力自述；不证明现场每件产品质量，不支持本例批准策略。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V07](../../../projects/books/saas-engineering/packages/industry-networks/V07.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## IWMS

[What is IWMS?](https://www.servicenow.com/in/workflows/employee-workflows/what-is-iwms.html)

同源 ID：`WB-SRC-iwms`。

- `V16:claim:iwms-scope`：ServiceNow 的 IWMS 介绍将空间/占用、租约信息与维护请求、工单等列为工作场所管理关注范围。 定位：Functional areas > Facilities management; Facilities maintenance; Real estate lifecycle management。边界：类别说明，不支持住宅押金、责任归属或退款法律主张。
- `WB:claim:term-iwms`：IWMS 在该 ServiceNow 说明中指 integrated workplace management systems，关联工作场所设施、维护和房地产管理。 定位：Opening definition; functional areas。边界：名称与所述用途；未把厂商定义扩为本例全部内部实现。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V16](../../../projects/books/saas-engineering/packages/commerce-property/V16.md)、[terminology](../../../projects/books/saas-engineering/terminology.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## ELM

[Enterprise Legal Management](https://www.wolterskluwer.com/en/solutions/enterprise-legal-management)

- `V18:claim:elm-scope`：Wolters Kluwer ELM Solutions公开自述包含案件管理、法律支出和账单审阅能力。 定位：Enterprise Legal Management; Award-winning solutions to address your legal business needs; lines 864–870。边界：厂商自述仅支持matter/spend/bill review能力存在，不采纳排名、节省比例、AI效果或API细节。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V18](../../../projects/books/saas-engineering/packages/people-service/V18.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## SAAS_LENS

[General design principles: SaaS Lens](https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/general-design-principles.html)

- `SAAS_LENS-C1`：AWS SaaS Lens 将 SaaS 解释为业务策略，并要求技术与运营支持持续演进和服务体验。 定位：General design principles: SaaS is a business strategy—not a technical implementation。边界：仅所列章节与主张已作文本核查；未执行 provider、未保存网页快照。
- `X01:claim:tenant-context`：AWS SaaS Lens 要求绑定用户与租户身份，并在架构各层隔离租户资源。 定位：General design principles: Isolate all tenant resources; Bind user identity to tenant identity。边界：只核查架构原则，不证明某个应用已实现隔离；保留已有 SAAS_LENS-C1 身份，本条为不同主张。

消费：[README](../../../projects/books/saas-engineering/README.md)、[X01](../../../projects/books/saas-engineering/packages/data-ai-control/X01.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## SAAS_SILO

[Full stack isolation](https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/full-stack-isolation.html)

- `X01:claim:silo-model`：AWS full stack isolation 可为租户配置独享基础设施，同时保持统一开通、管理和运营。 定位：Full stack isolation, paragraphs 1–6; Unified onboarding, management, and operations。边界：架构参照，不是本例已部署方案；未复刻图像或把示例栈当成所有 SaaS 的要求。

消费：[README](../../../projects/books/saas-engineering/README.md)、[X01](../../../projects/books/saas-engineering/packages/data-ai-control/X01.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## IBP

[Supply Planning](https://help.sap.com/docs/SAP_INTEGRATED_BUSINESS_PLANNING/c1fb60cb1e9c49d99ada277ae57e9e6c/66a038fcf40f4f779c6b4696aede83a6.html)

本教材保留此研究入口；所列读取记录未形成支持事实的主张。


消费：[README](../../../projects/books/saas-engineering/README.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## IBP_SAMPLE

[Integrated Planning Process with Unified Planning Area](https://help.sap.com/docs/SAP_INTEGRATED_BUSINESS_PLANNING/feae3cea3cc549aaa9d9de7d363a83e6/bea60e563f3e787fe10000000a441470.html)

本教材保留此研究入口；所列读取记录未形成支持事实的主张。


消费：[README](../../../projects/books/saas-engineering/README.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P05-SRC-shopify-returns

[Build for return management](https://shopify.dev/docs/apps/build/orders-fulfillment/returns-apps/build-return-management)

- `V04:claim:shopify-return-separation`：Return 表达退回意图；returnProcess 支持全部、部分或延后退款及是否返库的处置。 定位：Introduction; Step 1: Query returnable fulfillments; Step 9: Issue a refund and dispose return items; lines 124–135, 3008–3013。边界：仅返回意图、可退行与处理选项；未调用 mutation，未证明特定政策、实际到账或本例检验流程。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V04](../../../projects/books/saas-engineering/packages/commerce-property/V04.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P05-SRC-shopify-refund

[Refund - GraphQL Admin](https://shopify.dev/docs/api/admin-graphql/latest/objects/Refund)

- `V04:claim:shopify-refund-status`：Refund 对象存在不保证已返款，需检查关联 OrderTransaction 的状态。 定位：Refund introductory Note; transactions field; lines 107–126, 408–414; page selected version 2026-10 latest。边界：仅退款记录与资金处理的区别；未验证交易、到账时限、费率或会计处理。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V04](../../../projects/books/saas-engineering/packages/commerce-property/V04.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P05-SRC-toast-modifiers

[Specifying modifiers and instructions for menu item selections](https://doc.toasttab.com/doc/devguide/apiSpecifyingModifiersAndInstructions.html)

- `V05:claim:toast-modifiers`：Modifiers 属于 Selection；modifier 数量应等于所属选择数量，不同配置份数应使用分开的 Selection。 定位：Applying modifiers and pre-modifiers; Structure of a modifiers entry; Requirements for modifier quantities。边界：只核对结构与数量约束；未证明菜单安全、价格算法或合成树验证实现。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V05](../../../projects/books/saas-engineering/packages/commerce-property/V05.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P05-SRC-toast-split

[Split Checks on the POS](https://support.toasttab.com/en/article/Splitting-Checks-by-Item-1492811097734)

- `V05:claim:toast-split-modes`：Toast 文档分别说明保持账单并逐次使用付款方式，以及按项目创建或移动到新账单。按项目拆账时服务费和项目级折扣不会自动继承，需要重新处理。 定位：Split Checks Using Different Forms of Payment; Split Checks by Item; Split a Check More Than Nine Ways; lines 27–39, 59–76, 125–130。边界：页面更新 2026-09-17；功能有模式、设备和权限边界，未作全面能力承诺。文档指出拆项目的折扣/服务费不自动继承；本例折扣守恒是自定政策，不是 Toast 事实。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V05](../../../projects/books/saas-engineering/packages/commerce-property/V05.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P05-SRC-mews-preauthorizations

[Mews Connector API — Preauthorizations](https://docs.mews.com/connector-api/operations/preauthorizations)

- `V06:claim:mews-preauth`：Mews exposes preauthorizations separately with states including Chargeable, Pending, Charged and Expired. 定位：Preauthorizations → Preauthorization state。边界：No assumption about capture endpoint, validity period or partial capture.

消费：[README](../../../projects/books/saas-engineering/README.md)、[V06](../../../projects/books/saas-engineering/packages/commerce-property/V06.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P05-SRC-mews-payments

[Mews Connector API — Payments](https://docs.mews.com/connector-api/operations/payments)

- `V06:claim:mews-refund`：Mews Refund payment creates a refund represented as its own payment with RefundId; a pending refund may fail and needs status lookup. 定位：Payments → Refund payment。边界：Only supported payment types qualify. Neither refund initiation nor a demo response proves bank receipt.

消费：[README](../../../projects/books/saas-engineering/README.md)、[V06](../../../projects/books/saas-engineering/packages/commerce-property/V06.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P05-SRC-mews-bills

[Mews Connector API — Bills](https://docs.mews.com/connector-api/operations/bills)

- `V06:claim:mews-bill-close`：Mews Close bill prevents further modification. After closure, Receipt means fully paid with zero balance while Invoice means invoiced but not yet fully paid. 定位：Bills → Close bill introduction and Type property。边界：Bill semantics do not define the synthetic folio lifecycle or universal accounting compliance.

消费：[README](../../../projects/books/saas-engineering/README.md)、[V06](../../../projects/books/saas-engineering/packages/commerce-property/V06.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P05-SRC-stripe-hold

[Stripe — Place a hold on a payment method](https://docs.stripe.com/payments/place-a-hold-on-a-payment-method)

- `V06:claim:stripe-hold`：Stripe supports separate authorization and capture for eligible methods; capture must precede the authorization expiry and expired uncaptured funds are released. 定位：Place a hold on a payment method → Introduction and Payment method limitations。边界：Provider-specific behavior. No universal expiry duration, no assumption all methods qualify, and no claim that Mews uses Stripe.

消费：[README](../../../projects/books/saas-engineering/README.md)、[V06](../../../projects/books/saas-engineering/packages/commerce-property/V06.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P05-SRC-autodesk-rfi

[RFIs — Autodesk Forma](https://construction.autodesk.com/tools/construction-rfi-tracking/)

- `V15:claim:rfi-links`：Autodesk 官方 RFI 页面描述在图纸/模型位置关联上下文、配置角色动作，并从 RFI 建立 PCO 或关联已有 PCO。 定位：Manage RFIs; Configure workflows; Connect RFIs。边界：产品自述，不证明 RFI 答复等同合同批准，也不提供 API/内部栈。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V15](../../../projects/books/saas-engineering/packages/commerce-property/V15.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P05-SRC-procore-pcco-review

[Approve or Reject Prime Contract Change Orders](https://support.procore.com/products/online/user-guide/project-level/change-orders/tutorials/approve-or-reject-prime-contract-change-orders)

同源 ID：`WB-SRC-pcco`。

- `V15:claim:pcco-review`：Procore 文档的 PCCO review flow 要求指定审核人、相应权限及 Pending - In Review 或 Pending - Revised 状态；批准或拒绝会更新状态及审核记录。 定位：Background; Things to Consider; Steps > after approve/reject。边界：仅文档对应流程；不证明任何合同的法律效力或付款已发生。
- `WB:claim:term-pcco`：PCCO 在该 Procore 文档中展开为 Prime Contract Change Order。 定位：Objective; opening Background。边界：名称与所述用途；未把厂商定义扩为本例全部内部实现。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V15](../../../projects/books/saas-engineering/packages/commerce-property/V15.md)、[terminology](../../../projects/books/saas-engineering/terminology.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P05-SRC-postgresql-ranges

[PostgreSQL 18 — Range Types](https://www.postgresql.org/docs/18/rangetypes.html)

- `V06:claim:range-constraint`：PostgreSQL 的 daterange 采用含下界不含上界的规范形式；范围排除约束可以拒绝同一资源的重叠区间，GiST 可索引范围重叠查询。 定位：8.17.7 Discrete Range Types; 8.17.9 Indexing; 8.17.10 Constraints on Ranges (room_reservation example)。边界：支持数据库能力，不证明 Mews 技术栈或任何容量业务规则；未安装 btree_gist，未执行 PostgreSQL。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V06](../../../projects/books/saas-engineering/packages/commerce-property/V06.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P05-SRC-postgresql-isolation

[PostgreSQL 18 — Transaction Isolation](https://www.postgresql.org/docs/18/transaction-iso.html)

- `V06:claim:serializable-retry`：PostgreSQL Serializable 使已提交事务的效果符合某种串行次序，但应用必须准备对 serialization failure 重试事务；Read Committed 普通 SELECT 使用语句开始时的快照。 定位：13.2.1 Read Committed Isolation Level; 13.2.3 Serializable Isolation Level, SQLSTATE 40001。边界：必须让所有相关写入遵循一致约束；不能把外部支付副作用放进可自动重跑的事务；未执行数据库并发实验。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V06](../../../projects/books/saas-engineering/packages/commerce-property/V06.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P01-SRC-stripe-payment-application

[Payment application](https://docs.stripe.com/invoicing/apply-payments)

- `H01:claim:invoice-reopen`：Stripe Payment application 允许 send_invoice 发票取消付款分配并重开；不能推广到所有 collection_method。 定位：Before applying or unapplying; Unapply a payment from an invoice; Subscription status。边界：API 示例含 preview 版本；需按实际账户版本复核。overview 的 Paid invoices 段仍称终态，与其生命周期表及此专页冲突，采用窄范围专页而不强行统一。

消费：[README](../../../projects/books/saas-engineering/README.md)、[H01](../../../projects/books/saas-engineering/packages/commercial-finance/H01.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P01-SRC-stripe-idempotency

[Idempotent requests](https://docs.stripe.com/api/idempotent_requests)

同源 ID：`FND-SRC-stripe-idempotency`。

- `H01:claim:provider-idempotency`：Stripe API v1 在 endpoint 开始执行后保存同幂等 key 的响应，包括 500；key 清理后重用会发起新请求，参数变化受检查。 定位：Body paragraphs API v1 saved responses; pruning after at least 24 hours; validation/concurrent conflicts。边界：区分 v1/v2；不视为永久防重、数据库事务或失败自动成功保证。
- `FND-CLM-stripe-idempotency`：所读版本明确区分 v1/v2、执行前验证、保存响应与保留窗口；适用所选 API 协议。 定位：API v1 response replay, parameter comparison, execution start and key pruning; API v2 difference note。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[09-from-ui-to-recovery](../../../projects/books/saas-engineering/foundations/09-from-ui-to-recovery.md)、[H01](../../../projects/books/saas-engineering/packages/commercial-finance/H01.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P01-SRC-stripe-credit-notes

[Generate credit notes programmatically](https://docs.stripe.com/invoicing/integration/programmatic-credit-notes)

- `H01:claim:credit-note`：Stripe credit note 调整已最终化发票；对 paid 发票可选择退款、客户余额或外部处理。 定位：Credit notes for open invoices; Credit notes for paid invoices。边界：本例未执行 credit note/refund API；贷项不自动证明现金到账。

消费：[README](../../../projects/books/saas-engineering/README.md)、[H01](../../../projects/books/saas-engineering/packages/commercial-finance/H01.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P01-SRC-postgres-constraints

[PostgreSQL 18 — Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)

同源 ID：`P03-SRC-postgresql-constraints`、`P04-SRC-postgresql-constraints`。

- `H01:claim:db-identity`：PostgreSQL 支持组合唯一约束，默认唯一约束允许多个 NULL；主键同时要求唯一和非空。 定位：5.5.3 Unique Constraints; 5.5.4 Primary Keys。边界：只支持本地数据库身份约束的可选实现，不证明跨系统 exactly-once。
- `H09:claim:storage-constraints`：PostgreSQL 的 UNIQUE 可约束一组列的组合唯一性；默认 NULL 行为需配合 NOT NULL 或相应唯一性语义。 定位：5.5.2 Not-Null Constraints; 5.5.3 Unique Constraints，lines 102–213。边界：核查页面显示 PostgreSQL 18；只是数据库约束能力，不证明本例已经建表或外部副作用幂等。
- `V01:claim:postgres-constraints`：PostgreSQL 支持复合唯一约束；默认 NULL 的唯一语义需注意；普通 CHECK 不支持可靠的跨行/跨表约束。 定位：PostgreSQL 18 §5.5.1 Check Constraints; §5.5.3 Unique Constraints; §5.5.5 Foreign Keys。边界：文档能力不等于本例数据库已实现。current 指向读取时18版，未进行数据库测试。

消费：[README](../../../projects/books/saas-engineering/README.md)、[H01](../../../projects/books/saas-engineering/packages/commercial-finance/H01.md)、[H09](../../../projects/books/saas-engineering/packages/data-ai-control/H09.md)、[V01](../../../projects/books/saas-engineering/packages/health-science/V01.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P01-SRC-oracle-invoice-tolerances

[Invoice Tolerances](https://docs.oracle.com/en/cloud/saas/financials/26b/fappp/invoice-tolerances.html)

- `H02:claim:oracle-tolerances`：Oracle Invoice Tolerances说明超容差匹配会hold且解除前不能付款，区分数量/价格/金额容差；零百分比禁止差异，启用但未赋值的容差允许无限差异。 定位：Invoice Tolerances introduction, Note, Quantity-Based Tolerances。边界：本例数量0与单价2%为合成选择；不扩展到所有其他配置。

消费：[README](../../../projects/books/saas-engineering/README.md)、[H02](../../../projects/books/saas-engineering/packages/commercial-finance/H02.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P01-SRC-d365-period-status

[Mass financial period close](https://learn.microsoft.com/en-us/dynamics365/finance/general-ledger/tasks/mass-financial-period-close)

- `H03:claim:d365-period-status`：Microsoft Mass financial period close文档说明Open允许在权限下过账，On hold不能过账但可重开，Permanently closed不能重开或再过调整；模块可限制用户组访问。 定位：Mass financial period close: Update module access; Update period status。边界：与关账日程Closed区分；本例frozen/reopened为独立合成状态，不当作厂商状态。

消费：[README](../../../projects/books/saas-engineering/README.md)、[H03](../../../projects/books/saas-engineering/packages/commercial-finance/H03.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P01-SRC-postgresql-locking

[13.3. Explicit Locking](https://www.postgresql.org/docs/current/explicit-locking.html)

同源 ID：`P04-SRC-postgresql-locking`。

- `H02:claim:postgres-locking`：PostgreSQL FOR UPDATE对选中行阻挡冲突修改至事务结束；显式锁可能形成死锁，检测后会中止一个事务；一致取锁顺序有助减少死锁。 定位：§13.3.2 Row-Level Locks and §13.3.4 Deadlocks。边界：数据库机制无法自行保证累计分配正确或外部付款恰好一次；无实际性能与并发测试。
- `V01:claim:postgres-locks`：FOR UPDATE 协调同一行的竞争修改，通常持锁到事务结束；锁顺序和短事务有助于处理死锁风险。 定位：PostgreSQL 18 §13.3.2 Row-Level Locks; §13.3.4 Deadlocks。边界：不是分布式事务或外部副作用幂等保证；未实际运行 PostgreSQL。
- `V02:claim:postgres-locks`：PostgreSQL 文档说明 FOR UPDATE 阻挡同一行的不兼容修改直到事务结束；多对象锁顺序和长事务会影响死锁与等待。 定位：13.3.2 Row-Level Locks (FOR UPDATE); 13.3.4 Deadlocks。边界：database semantics only; application must make every relevant writer obey common gate; no PostgreSQL instance executed

消费：[README](../../../projects/books/saas-engineering/README.md)、[H02](../../../projects/books/saas-engineering/packages/commercial-finance/H02.md)、[V01](../../../projects/books/saas-engineering/packages/health-science/V01.md)、[V02](../../../projects/books/saas-engineering/packages/health-science/V02.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P01-SRC-postgresql-numeric

[8.1. Numeric Types](https://www.postgresql.org/docs/current/datatype-numeric.html)

- `H03:claim:postgres-numeric`：PostgreSQL numeric/decimal属于精确数字类型；声明scale后输入会按scale舍入，real/double precision是不精确类型。 定位：§8.1.2 Arbitrary Precision Numbers; §8.1.3 Floating-Point Types。边界：不支持货币政策或分类正确性，不证明其他厂商栈。

消费：[README](../../../projects/books/saas-engineering/README.md)、[H03](../../../projects/books/saas-engineering/packages/commercial-finance/H03.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P01-SRC-guidewire-reserves

[Guidewire ClaimCenter 202507 — Overview of reserves in ClaimCenter](https://docs.guidewire.com/cloud/cc/202507/cloudapibf/cloudAPI/topics/112-CCFin/01-reserves/c_overview-of-reserves-in-ClaimCenter.html)

- `V13:claim:reserve-model`：ClaimCenter exposure关联coverage和claimant，reserve line按cost type/category分类；reserve set一起审批，交易批准后的submitting与下游确认后的submitted分别记录。 定位：Overview of reserves in ClaimCenter: Reserve lines; Reserve sets and approval; Reserve transactions and acknowledgment。边界：没有据此声称已付现金或资金被隔离；本例付款模型是合成。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V13](../../../projects/books/saas-engineering/packages/commercial-finance/V13.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P01-SRC-guidewire-create-reserves

[Guidewire ClaimCenter 202507 — Creating reserves](https://docs.guidewire.com/cloud/cc/202507/cloudapibf/cloudAPI/topics/112-CCFin/01-reserves/c_creating-reserves.html)

- `V13:claim:reserve-authority`：ClaimCenter创建reserve set时检查对应用户authority limits；超限会创建审批活动且未向reserve line增加金额，限额可涉及claim total或exposure total。 定位：Creating reserves: Approval status, lines 22–29。边界：3,000/6,000等额度与并发反拆分实现不是文档事实。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V13](../../../projects/books/saas-engineering/packages/commercial-finance/V13.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P01-SRC-guidewire-financial-calculations

[Guidewire ClaimCenter 202507 — Financial calculations](https://docs.guidewire.com/cloud/cc/202507/cloudapibf/cloudAPI/topics/112-CCFin/05-financial-calculations/c_financial_calculations.html)

- `V13:claim:financial-dimensions`：ClaimCenter财务Transaction包含Reserve、Payment、RecoveryReserve、Recovery；交易保留CostType、CostCategory、ReservingCurrency和Exposure维度，claim-level时Exposure可为空。 定位：Financial calculations: Financial calculations in ClaimCenter, lines 3–7。边界：本例只模拟reserve/payment子集；不使用文档中的原始示例数据或声称复现财务表达式。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V13](../../../projects/books/saas-engineering/packages/commercial-finance/V13.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P01-SRC-fix-order-states-ep284

[FIX Application Layer — Order State Changes, FIX Latest as of EP284, November 2023](https://www.fixtrading.org/wp-content/uploads/download-manager-files/FIX-Latest-as-of-EP284-Order-State-Changes.pdf)

- `V14:claim:fix-state-semantics`：FIX separates execution-report cause from order status; pending cancellation can coexist with further fills, cancellation may be too late, and execution corrections/cancellations can change previously reported quantities. 定位：§1–2; B.1.b–c; J.1.a–b, printed pp.4–5,13–14,46–47。边界：Does not describe a specific broker, mandate a local state machine or prove legal trade finality; source is EP284, not asserted newest.

消费：[README](../../../projects/books/saas-engineering/README.md)、[V14](../../../projects/books/saas-engineering/packages/commercial-finance/V14.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P01-SRC-fix-allocation-instruction

[FIX 4.4 AllocationInstruction (J)](https://orchimate.org/fixtrading/fix-4.4/messages/AllocationInstruction?ref=fiximate)

- `V14:claim:allocation-message`：FIX 4.4 AllocationInstruction identifies account allocation and exposes allocation identity/reference, quantity and average-price fields. 定位：AllocationInstruction description; fields70,71,72,53,6。边界：Schema does not prescribe largest-remainder allocation, pro-rata policy, fairness or a provider algorithm.

消费：[README](../../../projects/books/saas-engineering/README.md)、[V14](../../../projects/books/saas-engineering/packages/commercial-finance/V14.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P01-SRC-fix-settlement-instructions

[FIX Latest SettlementInstructions (T)](https://orchimate.org/fixtrading/fix-latest/messages/SettlementInstructions?ref=fiximate)

- `V14:claim:settlement-message`：SettlementInstructions communicates trade settlement instructions and has distinct message and instruction-mode identities. 定位：SettlementInstructions description; fields777,160。边界：No evidence of completed asset/cash settlement is established by this message description.

消费：[README](../../../projects/books/saas-engineering/README.md)、[V14](../../../projects/books/saas-engineering/packages/commercial-finance/V14.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P01-SRC-d365-consolidation-overview

[Consolidation and elimination overview — Dynamics 365 Finance](https://learn.microsoft.com/en-us/dynamics365/finance/budgeting/consolidation-elimination-overview)

- `X02:claim:consolidation-options`：Dynamics 365 Finance documents multiple consolidation methods and elimination rules/proposals or a separate company for elimination entries. 定位：Opening options and database-elimination FAQ, lines31–47。边界：Microsoft feature scope; not Kingdee feature evidence or a generic legal consolidation rule.

消费：[README](../../../projects/books/saas-engineering/README.md)、[X02](../../../projects/books/saas-engineering/packages/commercial-finance/X02.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P03-SRC-snowflake-row-access

[Understanding row access policies](https://docs.snowflake.com/en/user-guide/security-row-intro)

- `H07:claim:row-policy-scope`：Snowflake row access policy 按查询上下文控制返回的可见行，本身不阻止插入，也不阻止修改或删除已可见行；文档标注 Enterprise Edition 或更高版本。 定位：Understanding row access policies → Enterprise Edition Feature; What is Row-level Security?; lines 233–251。边界：未验证账户、实际策略 SQL 或其他权限配置；不可由行可见性推断写接口已授权。

消费：[README](../../../projects/books/saas-engineering/README.md)、[H07](../../../projects/books/saas-engineering/packages/data-ai-control/H07.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P03-SRC-snowflake-lineage

[Data Lineage](https://docs.snowflake.com/en/user-guide/ui-snowsight-lineage)

- `H07:claim:lineage-scope`：Snowflake lineage 区分数据移动与对象依赖；仅作过滤或连接而未向目标移动数据的表，可能不包含于其 lineage。 定位：Data Lineage → opening relationship definitions; Limitations and considerations; lines 204–208, 434–451。边界：此局部行为不代表完整功能评测；外部 lineage、受限对象及历史覆盖需另外核对。没有实际执行示例查询。

消费：[README](../../../projects/books/saas-engineering/README.md)、[H07](../../../projects/books/saas-engineering/packages/data-ai-control/H07.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P03-SRC-sentinel-playbooks

[Automate threat response with playbooks in Microsoft Sentinel](https://learn.microsoft.com/en-us/azure/sentinel/automation/automate-responses-with-playbooks)

- `H08:claim:playbook-authority`：Microsoft Sentinel playbooks use Azure Logic Apps. Its documented prerequisites distinguish incident access, manual playbook operation and automation execution roles, with separate service-account resource-group permissions. 定位：Prerequisites; Extra permissions required for Microsoft Sentinel to run playbooks。边界：No role assignment or live run performed. Synthetic approval hash, five-minute TTL and duty split are not product facts.

消费：[README](../../../projects/books/saas-engineering/README.md)、[H08](../../../projects/books/saas-engineering/packages/data-ai-control/H08.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P03-SRC-okta-revoke-tokens

[Revoke Tokens](https://developer.okta.com/docs/guides/revoke-tokens/main/)

- `H08:claim:okta-revoke`：Okta Classic Engine guide distinguishes access/refresh token revocation and session cookies; revoking access does not revoke associated refresh, revoking refresh also revokes associated access, and invalid/expired/already revoked token requests can return 200. 定位：Classic Engine note; About the revoke request; Revoke an access token or a refresh token; Remove a user session。边界：Not a current endpoint-schema verification or claim about all engines, application-local sessions or offline token checking.

消费：[README](../../../projects/books/saas-engineering/README.md)、[H08](../../../projects/books/saas-engineering/packages/data-ai-control/H08.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P03-SRC-okta-user-sessions-api

[User Sessions API](https://developer.okta.com/docs/api/openapi/okta-management/management/tags/usersessions)

本教材保留此研究入口；所列读取记录未形成支持事实的主张。


消费：[README](../../../projects/books/saas-engineering/README.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P03-SRC-okta-sessions-api

[Sessions API](https://developer.okta.com/docs/api/openapi/okta-management/management/tags/session)

本教材保留此研究入口；所列读取记录未形成支持事实的主张。


消费：[README](../../../projects/books/saas-engineering/README.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P03-SRC-ironclad-approval-resets

[Configure Approval Resets in Workflow Designer](https://support.ironcladapp.com/hc/en-us/articles/40675997675031-Configure-Approval-Resets-in-Workflow-Designer)

- `H09:claim:provider-resets`：Ironclad 区分工作流、文档和字段变化的审批重置；上传文件改变字段含义时，需更新结构化字段才触发相应字段更新条件。 定位：Configure Approval Resets; Approval Reset Options / Property Updates，lines 35–99。边界：不把本例整体版本绑定归给产品；与 Cancel Signatures 页对全部 reset/owner 概述存在差异。Documents moved out 行正文与标题不一致，未用于主张。

消费：[README](../../../projects/books/saas-engineering/README.md)、[H09](../../../projects/books/saas-engineering/packages/data-ai-control/H09.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P03-SRC-ironclad-api-model

[Getting Started — Workflows and Records](https://developer.ironcladapp.com/reference/getting-started-api)

- `H09:claim:provider-records`：Ironclad API 区分 Workflow 与 Record；完成流程的 Record 保存签署文件与元数据，具有独立 ID，Ironclad ID 可连接同一合同流程与记录。 定位：Workflows / Records / Unique IDs / Ironclad ID，lines 23–82。边界：说明 API 对象及身份，不证明每种无签署工作流、手工导入或任意集成都会产生相同字段。

消费：[README](../../../projects/books/saas-engineering/README.md)、[H09](../../../projects/books/saas-engineering/packages/data-ai-control/H09.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P03-SRC-ironclad-webhooks

[Webhooks](https://developer.ironcladapp.com/reference/webhooks)

- `H09:claim:provider-webhooks`：Ironclad 文档区分 signatures collected、fully signed 与 workflow completed 事件；手动上传的 fully signed 可来自用户声明，产品不验证上传文件是否含正确签名；completed payload 含 recordIDs。 定位：Event Types: workflow_completed (80–100); workflow_signature_packet_signatures_collected (655–658); workflow_signature_packet_fully_signed (691–695)。边界：未据本页推断全局唯一事件 ID、投递顺序、接收鉴权方案或用户声明的法律有效性；未调用 API。

消费：[README](../../../projects/books/saas-engineering/README.md)、[H09](../../../projects/books/saas-engineering/packages/data-ai-control/H09.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P03-SRC-ironclad-cancel-signatures

[Cancel Signatures and Return a Workflow to Review](https://support.ironcladapp.com/hc/en-us/articles/12274796145303-Cancel-Signatures-and-Return-a-Workflow-to-Review)

- `H09:claim:provider-cancel`：Ironclad 提供在签署期间取消签署请求并返回 Review 的操作。 定位：Cancel All Signatures，lines 24–36。边界：不据此推断已生效合同可以被撤销；本页对 all approvers / owner 的概述与审批重置细则不完全一致，正文不采用该细节。

消费：[README](../../../projects/books/saas-engineering/README.md)、[H09](../../../projects/books/saas-engineering/packages/data-ai-control/H09.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P03-SRC-pdfjs

[PDF.js — Home](https://mozilla.github.io/pdf.js/)

- `H09:claim:preview-capability`：PDF.js 提供基于 Web 标准的 PDF 解析与渲染。 定位：Home capability statement，lines 0–2。边界：不支持 DOCX 编辑保真、批注合规或预览与原始文件逐字一致的结论。

消费：[README](../../../projects/books/saas-engineering/README.md)、[H09](../../../projects/books/saas-engineering/packages/data-ai-control/H09.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P03-SRC-temporal-activities

[What is a Temporal Activity?](https://docs.temporal.io/activities)

- `H09:claim:durable-activities`：Temporal Activity 可执行外部调用等动作，官方建议 Activity 幂等以避免重试产生重复副作用。 定位：What is a Temporal Activity?，lines 74–89。边界：文档建议不自动保证业务幂等、权限或外部动作只发生一次；本例未运行 Temporal。

消费：[README](../../../projects/books/saas-engineering/README.md)、[H09](../../../projects/books/saas-engineering/packages/data-ai-control/H09.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P03-SRC-stripe-meter-events

[Record usage for billing with the API](https://docs.stripe.com/billing/subscriptions/usage-based/recording-usage-api)

- `X01:claim:metering-api`：Stripe meter events 异步聚合；事件被接受不保证已定稿账单更新；文档提供事件 identifier 与幂等建议。 定位：Record usage for billing with the API: introduction; Create meter events > Idempotency; Event timestamps。边界：不把当前窗口/限流常数变成通用合同；未测试 sandbox、去重期限或账单调整。

消费：[README](../../../projects/books/saas-engineering/README.md)、[X01](../../../projects/books/saas-engineering/packages/data-ai-control/X01.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P03-SRC-postgresql-rls

[Row Security Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)

同源 ID：`P04-SRC-postgresql-rls`。

- `X01:claim:rls-boundary`：PostgreSQL RLS 约束普通行访问，但超级用户、BYPASSRLS 角色和通常的表 owner 会绕过。 定位：Row Security Policies §5.9, opening paragraphs through BYPASSRLS / FORCE ROW LEVEL SECURITY。边界：读取时页面标为 PostgreSQL 18；未建立 PostgreSQL 实例验证连接池、角色或策略。
- `V02:claim:postgres-rls`：PostgreSQL 文档说明行安全策略约束普通行访问，superuser、BYPASSRLS 和通常的表所有者可绕过。 定位：5.9 opening paragraphs: policy enforcement, default deny and BYPASSRLS/table-owner exceptions, lines 19–33。边界：does not prove any clinical system isolation; application roles, policies, caches and exports remain untested
- `V03:claim:postgres-rls`：PostgreSQL 行级安全控制行访问，但超级用户与 BYPASSRLS 总会绕过，表所有者通常绕过，需在真实角色下验证。 定位：5.9 Row Security Policies, opening paragraphs; explicit bypass paragraph; referential integrity caveat。边界：公开文档当前解析为 PostgreSQL 18；本例未运行 PostgreSQL，SQLite fixture 不验证 RLS。

消费：[README](../../../projects/books/saas-engineering/README.md)、[X01](../../../projects/books/saas-engineering/packages/data-ai-control/X01.md)、[V02](../../../projects/books/saas-engineering/packages/health-science/V02.md)、[V03](../../../projects/books/saas-engineering/packages/health-science/V03.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P04-SRC-fhir-observation

[FHIR Observation](https://hl7.org/fhir/R5/observation.html)

同源 ID：`REPAIR-SRC-fhir-observation-r5`。

- `V01:claim:fhir-observation`：Observation 表达测量或简单断言，可作为 DiagnosticReport 的原子结果。 定位：R5 §10.1.1 Scope and Usage。边界：Observation 不是完整报告或自动诊断；不验证测量解释。
- `REPAIR:claim:fhir-observation-r5`：Observation 表达测量与简单断言，可被 DiagnosticReport 引用为原子结果。 定位：§10.1.1 Scope and Usage; §10.1.2 Boundaries and Relationships。边界：仅核对所列资源角色与关联，不证明临床完成、正确性、整合实现或其他版本等价。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V01](../../../projects/books/saas-engineering/packages/health-science/V01.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P04-SRC-fhir-claim

[FHIR Claim](https://hl7.org/fhir/R5/claim.html)

- `V01:claim:fhir-claim`：Claim 是面向支付方的请求，区分 claim、preauthorization、predetermination 用途。 定位：R5 §13.6.1–2 Scope and Usage; Boundaries and Relationships。边界：不定义真实承保、费用合法性或具体赔付规则。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V01](../../../projects/books/saas-engineering/packages/health-science/V01.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P04-SRC-fhir-claimresponse

[FHIR ClaimResponse](https://hl7.org/fhir/R5/claimresponse.html)

- `V01:claim:fhir-adjudication`：ClaimResponse 报告处理与裁决或授权结果，不能据此断言资金已到账。 定位：R5 §13.7.1–2 Scope and Usage; Boundaries and Relationships。边界：必须结合 Claim.use；未验证支付方实现；患者展示需另做权限与信息筛选。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V01](../../../projects/books/saas-engineering/packages/health-science/V01.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P04-SRC-fhir-paymentreconciliation

[FHIR PaymentReconciliation](https://hl7.org/fhir/R5/paymentreconciliation.html)

- `V01:claim:fhir-remittance`：PaymentReconciliation 将付款金额关联到裁决等财务对象；规范明确 ClaimResponse 不表示付款已经发生。 定位：R5 §13.9.1–2 Scope and Usage; Boundaries and Relationships; allocation字段。边界：付款分配信息不等于独立银行清算证明，本例额外核对凭证是合成政策。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V01](../../../projects/books/saas-engineering/packages/health-science/V01.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P04-SRC-fhir-imagingstudy

[FHIR ImagingStudy](https://hl7.org/fhir/R5/imagingstudy.html)

- `V01:claim:imaging-reference`：ImagingStudy 保存 DICOM 检查元数据与检索信息，DICOM 实例本身通过其他服务存取。 定位：R5 §10.5.1–2 Scope and Usage; Boundaries and Relationships。边界：不证明特定 PACS 支持某项服务，也不证明医学解释。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V01](../../../projects/books/saas-engineering/packages/health-science/V01.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P04-SRC-dicomweb

[DICOM PS3.18 Web Services](https://dicom.nema.org/medical/dicom/current/output/html/part18.html)

- `V01:claim:dicomweb`：DICOMweb 定义 studies、series、instances 的查询、存储与检索等事务；实现范围需查 Conformance Statement。 定位：§6 Conformance; §10.1 Studies Service and Resources; Annex H Table H-1。边界：只支持信息存取机制，不是诊断服务；current URL 会变化，未存快照、未验证设备。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V01](../../../projects/books/saas-engineering/packages/health-science/V01.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P04-SRC-tanstack-invalidation

[TanStack Query: Query Invalidation](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation)

- `V01:claim:query-invalidation`：invalidateQueries 将匹配查询标为 stale，活跃查询可后台 refetch。 定位：Query Invalidation; Query Matching with invalidateQueries。边界：刷新不是业务授权；未使用依赖、未构建前端、未验证敏感数据缓存。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V01](../../../projects/books/saas-engineering/packages/health-science/V01.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P04-SRC-hapi-jpa

[Getting Started with HAPI FHIR JPA Server](https://hapifhir.io/hapi-fhir/docs/server_jpa/get_started.html)

- `V01:claim:hapi-server`：HAPI FHIR JPA starter 提供标准资源操作并可配置数据库。 定位：Getting Started with HAPI FHIR JPA Server; starter paragraph。边界：只是技术选项；不证明租户权限、profile、术语或此临床流程已正确实现。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V01](../../../projects/books/saas-engineering/packages/health-science/V01.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P04-SRC-fda-eic-guidance

[FDA/OHRP Use of Electronic Informed Consent: Questions and Answers (2016)](https://www.fda.gov/media/116850/download)

- `V02:claim:consent-process`：指南将知情同意视为提供信息、促进理解和提问的持续过程；Q2 说明研究者及适当受委派人员保留责任。 定位：II Background (printed p.3); Q1–Q7 (printed pp.4–8); Q9 (printed p.9)。边界：guidance includes nonbinding recommendations and cited regulatory requirements; only selected sections reviewed, no complete jurisdictional or current-regulation applicability analysis

消费：[README](../../../projects/books/saas-engineering/README.md)、[V02](../../../projects/books/saas-engineering/packages/health-science/V02.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P04-SRC-sitevault-consent-status

[SiteVault: Track Participant eConsent Form Status](https://sites.veevavault.help/gr/sitevault/econsent/track-status/)

- `V02:claim:consent-status`：SiteVault 文档区分参与者同意概况和表单交付、签署、中心会签/完成状态，说明部分表单不需中心会签，并可回查已签 ICF 的批准版本。 定位：Participant Consent Status; Veeva eConsent Status; Tracing Signed ICFs and Approved Versions, lines 61–101。边界：product documentation; configuration affects behavior; not a generic clinical authorization rule

消费：[README](../../../projects/books/saas-engineering/README.md)、[V02](../../../projects/books/saas-engineering/packages/health-science/V02.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P04-SRC-sitevault-reconsent

[SiteVault: Reconsent a Participant](https://sites.veevavault.help/gr/sitevault/econsent/reconsent/)

- `V02:claim:reconsent`：SiteVault 文档描述重新发送相同或新版本 ICF，以及已签署参与者收到新版本后重新签署并产生中心会签任务的流程。 定位：Reconsent a Participant, lines 60–69。边界：not proof all amendments require reconsent; no live SiteVault execution

消费：[README](../../../projects/books/saas-engineering/README.md)、[V02](../../../projects/books/saas-engineering/packages/health-science/V02.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P04-SRC-veeva-edc-queries

[Veeva EDC: Answering Queries](https://cdmshelp.veeva.com/gr/sites/answering-queries/)

- `V02:claim:query-lifecycle`：Veeva EDC 文档区分 system/manual query 与 Open/Answered/Closed；满足条件的数据更正可关闭 Open system query，manual query 由有权者复核。 定位：Types of Queries, lines 68–73; How to Answer, lines 93–115; Query Statuses, lines 136–145。边界：specific product behavior; answered system queries have distinct closure handling; not Rave documentation

消费：[README](../../../projects/books/saas-engineering/README.md)、[V02](../../../projects/books/saas-engineering/packages/health-science/V02.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P04-SRC-veeva-edc-signatures

[Veeva EDC: Providing Signatures](https://cdmshelp.veeva.com/gr/sites/signatures/)

- `V02:claim:signature-scope`：Veeva EDC 文档支持按表单/事件/病例册签署，列出数据和部分定义变更导致签名失效，并说明 Data Model 2 可配置带 open queries 签署。 定位：Required Permissions; When Can You Sign, lines 63–110; How to Clear a Signature and Actions that Break a Signature, lines 137–169。边界：configuration- and signature-level-dependent; no claim of universal clean→sign→lock order or specific cryptographic implementation

消费：[README](../../../projects/books/saas-engineering/README.md)、[V02](../../../projects/books/saas-engineering/packages/health-science/V02.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P04-SRC-veeva-edc-locking

[Veeva EDC: Locking Data](https://cdmshelp.veeva.com/gr/monitors/locking/)

- `V02:claim:lock-scope`：Veeva EDC 文档将 lock 描述为保存当前状态的限制，禁止被锁范围的数据修改、签署和 query 动作，并提供相应解锁动作。 定位：Introduction and permissions, lines 77–96; Disabled Actions, lines 99–130; How to Lock/Unlock, lines 131–179。边界：locking can occur before or after review; does not imply scientific validity, completion or universal signature prerequisite

消费：[README](../../../projects/books/saas-engineering/README.md)、[V02](../../../projects/books/saas-engineering/packages/health-science/V02.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P04-SRC-veeva-edc-freezing

[Veeva EDC: Freezing Data](https://cdmshelp.veeva.com/gr/monitors/freezing/)

- `V02:claim:freeze-scope`：Veeva EDC 的 freeze 阻止数据修改，但仍允许签署、query、SDV 和 DMR 等动作。 定位：Introduction, lines 77–84; Available Actions on Frozen Data, lines 148–155。边界：product-specific distinction; no compliance attestation or live validation

消费：[README](../../../projects/books/saas-engineering/README.md)、[V02](../../../projects/books/saas-engineering/packages/health-science/V02.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P04-SRC-fda-oos-2022

[FDA — Investigating Out-of-Specification (OOS) Test Results for Pharmaceutical Production, May 2022, Revision 1](https://www.fda.gov/media/158416/download)

- `V03:claim:fda-oos`：FDA OOS 指南反对反复测试到合格再无科学理由忽略 OOS；重测计划及次数预定，原始数据保留。 定位：IV.B.1 Retesting, printed pp.7–8 / PDF pp.10–11; IV.A, printed p.6。边界：药品生产指南的非约束建议与所引法规处于特定范围；本例泛化记录原则，不提供法律判断或实验方案。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V03](../../../projects/books/saas-engineering/packages/health-science/V03.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P04-SRC-fda-data-integrity

[FDA — Data Integrity and Compliance With Drug CGMP: Questions and Answers, December 2018](https://www.fda.gov/media/119267/download)

- `V03:claim:fda-records`：FDA 数据完整性指南讨论 metadata/audit trail、作废结果仍保留原数据和科学理由，以及记录和轨迹的复核。 定位：III Q1b–c printed p.4; Q2 p.6; Q7–8 p.8; Q12 p.10。边界：仅读取明确章节；没有验证本案例电子记录、权限或签署符合 CGMP/Part 11。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V03](../../../projects/books/saas-engineering/packages/health-science/V03.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P04-SRC-who-qcl-2024

[WHO TRS 1052 Annex 4 — WHO good practices for pharmaceutical quality control laboratories, 2024](https://cdn.who.int/media/docs/default-source/medicines/norms-and-standards/guidelines/quality-control/trs1052_annex4.pdf)

- `V03:claim:who-report`：WHO 指南规定修订分析报告要有新身份、修改理由及对原报告的引用；6.89–6.90 讨论 CoA 与分析报告。 定位：6.10 Reporting of results, paragraphs 6.84–6.90, printed pp.198–199 / PDF pp.60–61。边界：药品质量控制实验室指南；6.90 对 NQCL 的 CoA 例外保留，不主张所有实验室每次必须发 CoA，也不把 CoA 等同放行。
- `V03:claim:who-decision`：WHO 药典与上市许可规格规则不允许任意再加容差；6.67 讨论估计不确定度超过目标时判定不确定与调查。 定位：6.7 Measurement uncertainty, 6.65–6.67, printed pp.194–195 / PDF pp.56–57; context 6.55。边界：用于限制迁移，绝不支持本例 c+U 自定义 guard 是药典规则；未对具体药品选定适用规范。
- `V03:claim:who-equipment`：WHO 指南 5.33–5.44 讨论设备维护/校准/资格计划、身份与状态、记录及责任。 定位：5.3 Equipment, paragraphs 5.33–5.44, printed pp.175–177 / PDF pp.37–39。边界：不支持本例校准区间长度或通用重校准周期；仪器计量校准与分析曲线分别处理。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V03](../../../projects/books/saas-engineering/packages/health-science/V03.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P06-SRC-epcis-guideline

[GS1 EPCIS and CBV Implementation Guideline, Release 2.0](https://ref.gs1.org/guidelines/epcis-cbv/2.0.0/)

- `V08:claim:transformation-genealogy`：GS1 EPCIS/CBV 指南用 TransformationEvent 表示全部或部分消耗输入并产生输出，任一输入可能贡献于各输出；长时间转换可用相同 transformation identifier 连接事件。 定位：Release 2.0, March 2023; §5.5 Transformation Events pp.54–55 and §5.5.2 Long-Running Transformations p.56; PDF zero-based pages 53–55; numbered lines 1583–1599, 1617–1637。边界：仅核查转换和追踪语义；未验证 EPCIS 接口、schema、供应商符合性或本例质量/召回策略。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V08](../../../projects/books/saas-engineering/packages/industry-networks/V08.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P06-SRC-openroad-overview

[OpenROAD documentation — About and physical implementation stages](https://openroad.readthedocs.io/en/latest/main/README.html)

- `V09:claim:openroad-stages`：OpenROAD 文档的物理实现阶段包括布局、时钟树、布线、寄生提取和最终时序/物理验证。 定位：Getting Started with OpenROAD-flow-scripts > main steps；lines 99–148。边界：只概括所列步骤；不采用营销性能数字，不据此声称真实项目已完成签核。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V09](../../../projects/books/saas-engineering/packages/industry-networks/V09.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P06-SRC-opensta-readme

[Parallax OpenSTA — official README](https://github.com/parallaxsw/OpenSTA)

- `V09:claim:opensta-inputs`：OpenSTA 官方 README 将网表、Liberty、SDC、SPEF 等作为时序校验输入，并列出时钟不确定性和路径例外。 定位：README > Parallax Static Timing Analyzer；Clocks；Exception paths。边界：文件格式与能力范围；不证明本例缓存、签核规则或简化公式涵盖真实时序模型。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V09](../../../projects/books/saas-engineering/packages/industry-networks/V09.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P06-SRC-orfs-tutorial

[OpenROAD Flow Scripts Tutorial](https://openroad-flow-scripts.readthedocs.io/en/latest/tutorials/FlowTutorial.html)

- `V09:claim:orfs-evidence`：ORFS 教程区分 logs/results/reports，展示时序和 DRC 检查，并分别演示 setup 与 hold 处理。 定位：Viewing OpenROAD-flow-scripts Directory Structure And Results；Timing；DRC Viewer；Fixing Setup Violations；Fixing Hold Violations。边界：已读相应段落；没有安装、运行或复制示例长文本和图片，不把教程结果作为本例执行证据。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V09](../../../projects/books/saas-engineering/packages/industry-networks/V09.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P06-SRC-oracle-imd

[Oracle Utilities Meter Solution Cloud Service 23c — About Initial Measurement Data](https://docs.oracle.com/en/industries/energy-water/meter-solution-cloud-service/23c/mscs-user-guides/Topics/D1_BG_About_Initial_Measurement_Data.html)

- `V11:claim:imd-lineage`：Oracle23c distinguishes raw initial measurements, Pre VEE/Post VEE quantities and their quality conditions, followed by final measurements used for usage calculation. 定位：https://docs.oracle.com/en/industries/energy-water/meter-solution-cloud-service/23c/mscs-user-guides/Topics/D1_BG_About_Initial_Measurement_Data.html — definition/process and Pre VEE/Post VEE condition-code discussion.。边界：Documented conceptual path only; final does not imply physical certainty or authorize charging.

消费：[README](../../../projects/books/saas-engineering/README.md)、[V11](../../../projects/books/saas-engineering/packages/industry-networks/V11.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P06-SRC-oracle-usage-transactions

[Oracle Utilities Meter Solution Cloud Service 23c — About Usage Transactions](https://docs.oracle.com/en/industries/energy-water/meter-solution-cloud-service/23c/mscs-user-guides/Topics/D1_BG_About_Usage_Transactions.html)

- `V11:claim:usage-transaction`：Oracle23c describes usage transactions as bill-determinant calculations for a usage subscription; calculated service quantities carry UOM and measuring-component provenance, with calculation periods, date breaks and configurable quality information. 定位：https://docs.oracle.com/en/industries/energy-water/meter-solution-cloud-service/23c/mscs-user-guides/Topics/D1_BG_About_Usage_Transactions.html — opening; Calculation Period; Date Breaks; Service Quantities; Quality Assessment.。边界：Only reviewed23c concepts. No assertion that all product configurations use the optional quality assessment or that bill determinants establish payment.

消费：[README](../../../projects/books/saas-engineering/README.md)、[V11](../../../projects/books/saas-engineering/packages/industry-networks/V11.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P06-SRC-ibp-overview

[SAP Integrated Business Planning for Supply Chain](https://www.sap.com/products/scm/integrated-business-planning.html)

- `V21:claim:ibp-scope`：SAP describes IBP as integrating demand, supply, inventory and S&OP planning; response and supply planning considers capacity constraints, lead times and inventory. 定位：What is SAP IBP; FAQ Which modules are part of SAP IBP? item2。边界：Provider self-description at planning-scope level; does not prove implementation algorithm, optimality, execution or freight accounting.

消费：[README](../../../projects/books/saas-engineering/README.md)、[V21](../../../projects/books/saas-engineering/packages/industry-networks/V21.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P06-SRC-epcis-standard

[EPCIS Standard, retrieved PDF cover: Release 2.0, Jun 2022](https://ref.gs1.org/standards/epcis/2.0.1/)

- `V21:claim:epcis-time`：EPCIS eventTime identifies when the capturing application asserts the event occurred; recordTime is repository record time and does not describe the real-world event. 定位：§7.4.1 EPCISEvent, pp74–75。边界：Applies to EPCIS event representation; receiver must still verify origin and business relevance.
- `V21:claim:epcis-correction`：An EPCIS ErrorDeclaration asserts previous assertions are erroneous, preserves the prior event, may link correctiveEventIDs, and has the same fields as the original except errorDeclaration and recordTime, including the same eventID when present. 定位：§7.4.1 eventID field p75; §7.4.1.2 ErrorDeclaration p76。边界：This exceptional identity rule does not permit arbitrary changed payload under a reused eventID; ordinary real-world follow-up should be modeled as ordinary events where possible.

消费：[README](../../../projects/books/saas-engineering/README.md)、[V21](../../../projects/books/saas-engineering/packages/industry-networks/V21.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P06-SRC-tmf640

[Service Activation Management API TMF640 v4.0](https://www.tmforum.org/open-digital-architecture/open-apis/service-activation-management-api-TMF640/v4.0)

- `V22:claim:activation-monitor`：TMF640 overview supports service operations and retrieval of a monitor resource for execution of asynchronous requests. 定位：v4.0 Overview line15。边界：Does not assert actual network success, health-probe policy or the chapter synthetic state machine.

消费：[README](../../../projects/books/saas-engineering/README.md)、[V22](../../../projects/books/saas-engineering/packages/industry-networks/V22.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P06-SRC-tmf635

[Product Usage Management API TMF635, v4.0 view](https://www.tmforum.org/open-digital-architecture/open-apis/usage-management-api-TMF635/v4.0)

- `V22:claim:usage-separation`：TMF635 overview distinguishes rated and non-rated usage, including retrieval of partner usage for rating and provision of rated usage to a partner. 定位：v4.0 page Overview line15; version history line24 noted separately。边界：Current v5 scope/endpoint changes are not silently applied to v4. No allowance or tariff policy specified.

消费：[README](../../../projects/books/saas-engineering/README.md)、[V22](../../../projects/books/saas-engineering/packages/industry-networks/V22.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P06-SRC-tmf678

[Customer Bill Management API TMF678 v4.0](https://www.tmforum.org/open-digital-architecture/open-apis/customer-bill-management-api-TMF678/v4.0)

- `V22:claim:bill-query`：TMF678 overview describes finding and retrieving customer bills and details of applied customer billing rates. 定位：v4.0 Overview line15。边界：Not proof of payment, chosen rating algorithm or implementation stack.

消费：[README](../../../projects/books/saas-engineering/README.md)、[V22](../../../projects/books/saas-engineering/packages/industry-networks/V22.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P02-SRC-servicenow-resolution

[Incident resolution and closure](https://www.servicenow.com/docs/r/it-service-management/incident-management/c_IncidentResolutionAndRecovery.html)

- `H05:claim:restoration-closure`：ServiceNow 专门文档允许临时 workaround 或永久方案使 incident resolved；caller 可以审阅结果，关闭可由确认或配置的自动关闭发生。 定位：Incident resolution and closure, lines 24-31。边界：不泛化为所有部署、所有角色或所有业务的自动关闭资格。

消费：[README](../../../projects/books/saas-engineering/README.md)、[H05](../../../projects/books/saas-engineering/packages/people-service/H05.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P02-SRC-servicenow-change-states

[State progression for change models](https://www.servicenow.com/docs/r/it-service-management/change-management/normal-standard-emergency-states.html)

- `H05:claim:change-types`：ServiceNow 文档 normal 经过 Assess 和 Authorize；standard 预授权跳过二者；emergency 跳过 Assess 但仍经过 Authorize。 定位：Change type progression, lines 2830-2834。边界：只描述该文档列出的模型，不证明客户实际配置或本例授权实现。

消费：[README](../../../projects/books/saas-engineering/README.md)、[H05](../../../projects/books/saas-engineering/packages/people-service/H05.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P02-SRC-oneroster-roster-model

[IMS OneRoster Rostering Service Version 1.2 — Information Model](https://www.imsglobal.org/spec/oneroster/v1p2/rostering/info)

- `V17:claim:roster-identity`：OneRoster 1.2 Base定义sourcedId等交换属性；Enrollment联系user、class、school、role，并定义beginDate含起日、endDate不含止日。 定位：§6.1.4 Base; §6.1.14 Enrollment。边界：这是规范模型事实；复合scope和本例学籍状态属于合成设计，未做供应商兼容测试。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V17](../../../projects/books/saas-engineering/packages/people-service/V17.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P02-SRC-oneroster-gradebook-model

[IMS OneRoster Gradebook Service Version 1.2 — Information Model](https://www.imsglobal.org/spec/oneroster/v1p2/gradebook/info)

- `V17:claim:result-context`：OneRoster Result由分数及其上下文组成，关联student与lineItem并含scoreStatus以及学习活动相关状态属性。 定位：§6.1.24 Result, especially §§6.1.24.1–6.1.24.5 and status attributes。边界：未把Result状态等同成绩批准；权重、免交和发行仍由学校规则定义。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V17](../../../projects/books/saas-engineering/packages/people-service/V17.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P02-SRC-oneroster-csv

[1EdTech OneRoster: CSV Binding 1.2.1](https://www.imsglobal.org/spec/oneroster/v1p2/bind/csv/)

- `V17:claim:csv-integrity`：OneRoster CSV Binding要求manifest，bulk中每项对象引用须能在该交换文件集合中解析；manifest记录文件bulk/delta模式。 定位：§2.1 Binding of the Data; §3.1 manifest.csv。边界：标准事实支持预检；本例整批隔离、发布revision、外部结果核对是原创工程选择。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V17](../../../projects/books/saas-engineering/packages/people-service/V17.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P02-SRC-relativity-processing-profile

[Relativity — Processing profiles](https://help.relativity.com/RelativityaiR/Content/Relativity/Processing/Processing_profiles.htm)

- `V18:claim:relativity-dedupe`：Relativity Processing profiles区分Global/Custodial去重并提供保管人与路径元数据传播选项。 定位：Deduplication settings; Global/Custodial and Propagate deduplication data; lines 548–569。边界：原RelativityOne URL重定向RelativityaiR；只核对该页配置行为，未验证产品运行，不把本例hash/法律判断算法归给厂商。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V18](../../../projects/books/saas-engineering/packages/people-service/V18.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P02-SRC-purview-edisc

[Microsoft Purview — Learn about eDiscovery](https://learn.microsoft.com/en-us/purview/edisc)

- `V18:claim:purview-case`：Microsoft Purview概览说明case包含相关searches/holds/review sets，review set中的材料从源位置复制。 定位：Features and capabilities: Case management, Place content locations on hold, Review sets; lines 104–109。边界：只说明当前概览中的case/hold/review set关系，不引入旧hold页的时延与具体限制，不宣称已接API或核验许可。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V18](../../../projects/books/saas-engineering/packages/people-service/V18.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P02-SRC-certinia-approval

[Certinia PSA 2022.3 — Approving and Rejecting Timecards Overview](https://help.certinia.com/main/2022.3/Subsystems/PSA/Content/topics/Timecards/AboutApprovingRejectingTimecards.htm)

- `V19:claim:certinia-approval`：Certinia PSA 2022.3工时审批需管理员配置审批流程，提交与批准/拒绝依配置执行。 定位：Approving and Rejecting Timecards Overview; opening paragraphs; lines 1–5。边界：固定2022.3文档，审批需配置；本例状态机和职责分离是合成政策。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V19](../../../projects/books/saas-engineering/packages/people-service/V19.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P02-SRC-certinia-budget-cap

[Certinia PSA 2025.1 — Applying a Billing Cap to Individual Budgets](https://help.certinia.com/main/2025.1/Content/PSA/Features/Budgets/ApplyBillingCapOnBudgets.htm)

- `V19:claim:certinia-cap`：Certinia PSA 2025.1预算可开票额以Amount减Amount Released for Invoicing计算，Amount Consumed不参与；有容差配置且禁止同项目双层cap。 定位：How PSA Calculates a Budget’s Amount Available to Bill; lines 54–62; warning at 38–39; tolerance at 40–53。边界：固定2025.1预算级cap，不推广到所有项目/合同配置；本例零容差、行切分及600处理不是厂商实现。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V19](../../../projects/books/saas-engineering/packages/people-service/V19.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P02-SRC-postgres-ranges

[PostgreSQL — Range Types](https://www.postgresql.org/docs/current/rangetypes.html)

- `V20:claim:range-exclusion`：PostgreSQL 区间排他约束可拒绝重叠值；文档用 btree_gist 将房间相等与时间重叠组合。 定位：8.17.10 Constraints on Ranges，reservation 与 room_reservation 示例。边界：仅支持技术选项可行性；没有运行 PostgreSQL，未验证本例租户、状态过滤、时区、锁或吞吐。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V20](../../../projects/books/saas-engineering/packages/people-service/V20.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P02-SRC-zendesk-ticket-collisions

[Zendesk Tickets API — collision protection lead](https://developer.zendesk.com/api-reference/ticketing/tickets/tickets/#protecting-against-ticket-update-collisions)

本教材保留此研究入口；所列读取记录未形成支持事实的主张。


消费：[README](../../../projects/books/saas-engineering/README.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P02-SRC-relativity-deduplication-lead

[Relativity Deduplication — unused retrieval lead](https://help.relativity.com/RelativityOne/Content/Relativity/Processing/Deduplication.htm)

本教材保留此研究入口；所列读取记录未形成支持事实的主张。


消费：[README](../../../projects/books/saas-engineering/README.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## P02-SRC-purview-classic-hold-lead

[Microsoft Purview classic hold guidance — excluded lead](https://learn.microsoft.com/en-us/purview/ediscovery-create-holds)

本教材保留此研究入口；所列读取记录未形成支持事实的主张。


消费：[README](../../../projects/books/saas-engineering/README.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-ods-hash

[Open Data Structures — 5.1 ChainedHashTable: Hashing with Chaining](https://opendatastructures.org/ods-python/5_1_ChainedHashTable_Hashin.html)

- `FND-CLM-ods-hash`：链地址法、碰撞检查与装载受控时的期望/摊还成本；字符串算 hash 的长度成本另计。 定位：§5.1; add/find/remove; Analysis of Chained Hashing。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[02-lookup-and-indexes](../../../projects/books/saas-engineering/foundations/02-lookup-and-indexes.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-python-bisect

[bisect — Array bisection algorithm](https://docs.python.org/3/library/bisect.html)

- `FND-CLM-python-bisect`：有序序列的分割位置、对数查找与线性插入；不能把插入也称为对数成本。 定位：bisect_left; Performance Notes。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[02-lookup-and-indexes](../../../projects/books/saas-engineering/foundations/02-lookup-and-indexes.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-ods-python-btree

[Open Data Structures — 14.2 B-Trees](https://opendatastructures.org/ods-python/14_2_B_Trees.html)

- `FND-CLM-ods-python-btree`：多键节点、平衡树高、外存块访问与分裂；不据此指定某数据库的内部页布局。 定位：§14.2 definition and height; §14.2.1 Searching; §14.2.2 Addition。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[02-lookup-and-indexes](../../../projects/books/saas-engineering/foundations/02-lookup-and-indexes.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-pg-index

[PostgreSQL — 11.2. Index Types](https://www.postgresql.org/docs/current/indexes-types.html)

- `FND-CLM-pg-index`：PostgreSQL B-tree 的等值、范围和排序能力，以及 Hash 索引的简单等值能力。 定位：§11.2.1 B-Tree; §11.2.2 Hash。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[02-lookup-and-indexes](../../../projects/books/saas-engineering/foundations/02-lookup-and-indexes.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-ods-binary-trie

[Open Data Structures — 13.1 BinaryTrie: A digital search tree](https://opendatastructures.org/ods-python/13_1_BinaryTrie_digital_sea.html)

- `FND-CLM-ods-binary-trie`：按位路径表示整数键；本书字符路径算例属于明确说明的教学推广。 定位：§13.1 path-by-bits representation and find。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[02-lookup-and-indexes](../../../projects/books/saas-engineering/foundations/02-lookup-and-indexes.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-cmu-sorting

[Comparison-based Lower Bounds for Sorting — 15-451 lecture notes](https://www.cs.cmu.edu/~avrim/451f11/lectures/lect0913.pdf)

- `FND-CLM-cmu-sorting`：比较排序的最坏情况 Ω(n log n) 下界只适用于比较模型。 定位：§5.1 Overview; §5.2 Lower bounds for comparison-based sorting, pp. 1–3。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[03-order-and-intervals](../../../projects/books/saas-engineering/foundations/03-order-and-intervals.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-python-heap

[heapq — Heap queue algorithm](https://docs.python.org/3/library/heapq.html)

- `FND-CLM-python-heap`：堆的局部顺序、少量最大/最小项选择与并列处理；业务评分和教学算例是本地定义。 定位：Heap invariant; nlargest/nsmallest; Priority Queue Implementation Notes。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[03-order-and-intervals](../../../projects/books/saas-engineering/foundations/03-order-and-intervals.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-cses

[Competitive Programmer’s Handbook — Antti Laaksonen](https://cses.fi/book/book.pdf)

- `FND-CLM-cses`：双指针的单调移动、静态前缀和、最早结束的无权区间选择与回溯剪枝；不借用书中数据或性能表。 定位：Draft July 3, 2018; §5.3 Backtracking, pp. 50–51; §5.4 Pruning the search, pp. 51–54; §6.2 Scheduling, pp. 58–60; §8.1 Two pointers method, pp. 77–79; §9.1 Static array queries / Sum queries, p. 84。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[03-order-and-intervals](../../../projects/books/saas-engineering/foundations/03-order-and-intervals.md)、[06-choices-and-optimization](../../../projects/books/saas-engineering/foundations/06-choices-and-optimization.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-beam-window

[Apache Beam Programming Guide](https://beam.apache.org/documentation/programming-guide/)

- `FND-CLM-beam-window`：事件时间、处理时间、水位线和迟到数据影响窗口结果的完整性与修订。 定位：§8 Windowing; §8.4 Watermarks and late data。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[03-order-and-intervals](../../../projects/books/saas-engineering/foundations/03-order-and-intervals.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-ods-graph

[Open Data Structures — 12.3 Graph Traversal](https://opendatastructures.org/ods-python/12_3_Graph_Traversal.html)

- `FND-CLM-ods-graph`：BFS 层次、DFS 访问颜色和有向环，邻接表遍历 O(V+E)。 定位：§12.3.1 Breadth-First Search; §12.3.2 Depth-First Search。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[04-graphs-and-connectivity](../../../projects/books/saas-engineering/foundations/04-graphs-and-connectivity.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-mit-dijkstra

[MIT 6.006 Lecture 16: Shortest Paths II — Dijkstra](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/6277a1f06100c26a7ff21031af6757b5_MIT6_006F11_lec16.pdf)

- `FND-CLM-mit-dijkstra`：松弛、非负前提、DAG 顺序松弛及不同优先队列的成本；教学路线另行演算。 定位：Fall 2011; Relaxation, p. 1; DAGs, p. 2; Dijkstra and nonnegative edges, pp. 3–5; Analysis, p. 6。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[04-graphs-and-connectivity](../../../projects/books/saas-engineering/foundations/04-graphs-and-connectivity.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-opendsa-union

[OpenDSA — 13.2. Union/Find and the Parent Pointer Implementation](https://opendsa-server.cs.vt.edu/ODSA/Books/CS3/html/UnionFind.html)

- `FND-CLM-opendsa-union`：互不相交集合、按规模合并和路径压缩；近常数描述为大量操作的摊还性质。 定位：§13.2.1.1 Parent Pointer Trees; §13.2.1.2 Equivalence Classes; §13.2.1.3 Weighted Union; §13.2.1.4 Path Compression。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[04-graphs-and-connectivity](../../../projects/books/saas-engineering/foundations/04-graphs-and-connectivity.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-python-graphlib

[graphlib — Functionality to operate with graph-like structures](https://docs.python.org/3/library/graphlib.html)

- `FND-CLM-python-graphlib`：拓扑序与无环条件；已就绪、已领取、已完成分别处理，运行中暂时无就绪项不推出有环。 定位：TopologicalSorter; prepare; is_active; get_ready; done。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[05-dependencies-and-queues](../../../projects/books/saas-engineering/foundations/05-dependencies-and-queues.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-rabbitmq-confirms

[RabbitMQ — Consumer Acknowledgements and Publisher Confirms](https://www.rabbitmq.com/docs/confirms)

- `FND-CLM-rabbitmq-confirms`：发布确认与消费确认相互独立；确认的边界不能升级为端到端恰好一次。 定位：Are Publisher Confirms Related to Consumer Delivery Acknowledgements?; Consumer Acknowledgements。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[05-dependencies-and-queues](../../../projects/books/saas-engineering/foundations/05-dependencies-and-queues.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-aws-outbox

[AWS Prescriptive Guidance — Transactional outbox pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)

- `FND-CLM-aws-outbox`：本地数据库更新与待发消息原子交接，派发可能重复、消费仍需幂等；不声称跨 provider 原子事务。 定位：Intent; Motivation; Issues and considerations / Duplicate messages; Implementation / Outbox table。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[05-dependencies-and-queues](../../../projects/books/saas-engineering/foundations/05-dependencies-and-queues.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-mit-knapsack

[MIT 6.006 Lecture 21: Dynamic Programming III](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/3484e876d81aba07911a1109f5b5e81e_MIT6_006F11_lec21.pdf)

- `FND-CLM-mit-knapsack`：子问题必须携带剩余容量；O(nS) 相对于数字大小是伪多项式成本。 定位：Fall 2011; Knapsack / First Attempt / Correct, pp. 4–5; Pseudopolynomial Time, p. 5。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[06-choices-and-optimization](../../../projects/books/saas-engineering/foundations/06-choices-and-optimization.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-stanford-bound

[Branch and Bound Methods — Stephen Boyd and Jacob Mattingley](https://web.stanford.edu/class/ee364b/lectures/bb_notes.pdf)

- `FND-CLM-stanford-bound`：可靠上下界、分割、剪枝与停止条件；正文将最小化方向转换为合成最大化背包示例。 定位：April 1, 2018; introduction; §1 Unconstrained nonconvex minimization, pp. 1–3。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[06-choices-and-optimization](../../../projects/books/saas-engineering/foundations/06-choices-and-optimization.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-ortools-status

[Google OR-Tools — CP-SAT Solver](https://developers.google.com/optimization/cp/cp_solver)

- `FND-CLM-ortools-status`：OPTIMAL、FEASIBLE、INFEASIBLE、MODEL_INVALID、UNKNOWN 的区分；不是本书执行了 OR-Tools。 定位：CP-SAT return values / solver status table。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[06-choices-and-optimization](../../../projects/books/saas-engineering/foundations/06-choices-and-optimization.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-python-cache

[functools — Higher-order functions and operations on callable objects](https://docs.python.org/3/library/functools.html)

- `FND-CLM-python-cache`：按参数复用、有限缓存及线程安全缓存仍可重复执行函数体；适用纯计算。 定位：cache; lru_cache。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[07-reuse-and-invalidation](../../../projects/books/saas-engineering/foundations/07-reuse-and-invalidation.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-redis-eviction

[Redis — Key eviction](https://redis.io/docs/latest/develop/reference/eviction/)

- `FND-CLM-redis-eviction`：Redis LRU/LFU 的采样近似与频率衰减；正文精确手算不映射为 Redis 的逐次轨迹。 定位：Eviction policies; Approximated LRU algorithm; LFU eviction。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[07-reuse-and-invalidation](../../../projects/books/saas-engineering/foundations/07-reuse-and-invalidation.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-redis-bloom

[Redis — Bloom filters](https://redis.io/docs/latest/develop/data-types/probabilistic/bloom-filter/)

- `FND-CLM-redis-bloom`：概率成员判断、误报、容量和扩展。正文误报率的分母明确为实际不存在的查询，公式是本地推导的独立性近似。 定位：Introduction; Use cases; Resizing Bloom filters; Performance。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[08-approximation-and-search](../../../projects/books/saas-engineering/foundations/08-approximation-and-search.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-hll-paper

[HyperLogLog: the analysis of a near-optimal cardinality estimation algorithm](https://algo.inria.fr/flajolet/Publications/FlFuGaMe07.pdf)

- `FND-CLM-hll-paper`：分桶、最大前导零模式、调和组合、渐近标准误差与小范围校正；四桶例只检查寄存器更新。 定位：P. Flajolet, É. Fusy, O. Gandouet, F. Meunier (2007); Abstract; §1 / Figure 2 / Theorem 1; §4 / Figure 3 practical corrections。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[08-approximation-and-search](../../../projects/books/saas-engineering/foundations/08-approximation-and-search.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-redis-hll

[Redis — HyperLogLog](https://redis.io/docs/latest/develop/data-types/probabilistic/hyperloglogs/)

- `FND-CLM-redis-hll`：成熟实现提供基数估计和摘要合并；未把产品说明当作本书性能实测。 定位：Introduction; Basic commands / PFADD, PFCOUNT, PFMERGE。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[08-approximation-and-search](../../../projects/books/saas-engineering/foundations/08-approximation-and-search.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-hnsw-paper

[Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs](https://arxiv.org/abs/1603.09320)

- `FND-CLM-hnsw-paper`：只支持分层邻近图的结构直觉；不据摘要断言任意数据的最坏 O(log n)，也不称全文复现。 定位：Yu. A. Malkov and D. A. Yashunin; arXiv:1603.09320v4; Abstract。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[08-approximation-and-search](../../../projects/books/saas-engineering/foundations/08-approximation-and-search.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-pgvector

[pgvector/pgvector — README](https://github.com/pgvector/pgvector)

- `FND-CLM-pgvector`：精确和近似检索的选择、搜索预算与过滤导致结果不足；未运行扩展。 定位：Indexing; HNSW; Filtering; Iterative Index Scans。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[08-approximation-and-search](../../../projects/books/saas-engineering/foundations/08-approximation-and-search.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-pg-isolation

[PostgreSQL — 13.2. Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

- `FND-CLM-pg-isolation`：更新冲突、隔离级别和事务重试要求；SQLite 教学检查不验证 PostgreSQL 锁/隔离。 定位：§13.2.1 Read Committed Isolation Level; §13.2.2 Repeatable Read; §13.2.3 Serializable。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[09-from-ui-to-recovery](../../../projects/books/saas-engineering/foundations/09-from-ui-to-recovery.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-react-state

[React — Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure)

- `FND-CLM-react-state`：界面状态避免矛盾与冗余；未强制使用 React，也不据页面状态推断业务已确认。 定位：Principles for structuring state; Avoid contradictions in state; Avoid redundant state。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[09-from-ui-to-recovery](../../../projects/books/saas-engineering/foundations/09-from-ui-to-recovery.md)、[11-stacks-and-research](../../../projects/books/saas-engineering/foundations/11-stacks-and-research.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-hypothesis

[Introduction to Hypothesis](https://hypothesis.readthedocs.io/en/latest/tutorial/introduction.html)

- `FND-CLM-hypothesis`：生成输入、与独立参照比较、反例及输入域约束；本地程序采用标准库穷举而非执行 Hypothesis。 定位：Testing a sorting algorithm; Adding floats to our test; Preventing floats from generating nan。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[10-verification-and-evals](../../../projects/books/saas-engineering/foundations/10-verification-and-evals.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-pact

[Pact — Introduction](https://docs.pact.io/)

- `FND-CLM-pact`：消费者与提供者的契约兼容测试；不等于真实服务可用或业务闭环。 定位：What is contract testing?; consumer-driven contract testing。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[10-verification-and-evals](../../../projects/books/saas-engineering/foundations/10-verification-and-evals.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-playwright

[Playwright — Best Practices](https://playwright.dev/docs/best-practices)

- `FND-CLM-playwright`：以用户可见行为和稳健定位组织浏览器测试；本轮未运行浏览器。 定位：Testing philosophy / Test user-visible behavior, Make tests as isolated as possible; Best practices / Use locators。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[10-verification-and-evals](../../../projects/books/saas-engineering/foundations/10-verification-and-evals.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-chaos

[Principles of Chaos Engineering](https://principlesofchaos.org/)

- `FND-CLM-chaos`：用可测业务输出、假设和扰动实验验证韧性；正文给实验设计，不记录真实生产故障。 定位：Four-step experiment description; Advanced Principles / Build a Hypothesis around Steady State Behavior; Minimize Blast Radius。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[10-verification-and-evals](../../../projects/books/saas-engineering/foundations/10-verification-and-evals.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-k6-load

[Grafana k6 — Open and closed models](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/open-vs-closed/)

- `FND-CLM-k6-load`：闭合客户端模型在变慢时降低到达率；开放模型解耦到达与执行时长。 定位：Drawbacks of using the closed model; Open model。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[10-verification-and-evals](../../../projects/books/saas-engineering/foundations/10-verification-and-evals.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-sre-monitor

[Site Reliability Engineering — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

- `FND-CLM-sre-monitor`：延迟、流量、错误、饱和度与尾延迟；本书负载数字是合成目标。 定位：The Four Golden Signals; Worrying About Your Tail (or, Instrumentation and Performance)。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[10-verification-and-evals](../../../projects/books/saas-engineering/foundations/10-verification-and-evals.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-helm-paper

[Holistic Evaluation of Language Models](https://arxiv.org/abs/2211.09110)

- `FND-CLM-helm-paper`：多场景、多指标的评估视角；仅摘要已读，不借此声称复现 HELM 或得到模型分数。 定位：arXiv:2211.09110; Abstract。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[10-verification-and-evals](../../../projects/books/saas-engineering/foundations/10-verification-and-evals.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-openai-eval

[OpenAI — Evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices)

- `FND-CLM-openai-eval`：确定目标、数据集、指标、比较与持续评估；自动评分用人工判断校准。 定位：Eval-driven development; Designing evals; Eval process; Human evaluation / calibrating automated metrics。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[10-verification-and-evals](../../../projects/books/saas-engineering/foundations/10-verification-and-evals.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-django

[Django at a glance](https://docs.djangoproject.com/en/5.2/intro/overview/)

- `FND-CLM-django`：模型、数据库访问、模板和管理界面是可组合成熟能力；不宣称最新版本或性能排名。 定位：Django 5.2; Design your model; A dynamic admin interface; Design your templates。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[11-stacks-and-research](../../../projects/books/saas-engineering/foundations/11-stacks-and-research.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-fastapi

[FastAPI — Features](https://fastapi.tiangolo.com/features/)

- `FND-CLM-fastapi`：OpenAPI 接口描述和 JSON Schema 模型文档/校验；事务与任务仍需另行设计。 定位：Based on open standards; Automatic docs; Validation。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[11-stacks-and-research](../../../projects/books/saas-engineering/foundations/11-stacks-and-research.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-aspnet

[What is ASP.NET?](https://dotnet.microsoft.com/en-us/learn/aspnet/what-is-aspnet)

- `FND-CLM-aspnet`：请求处理、模板和认证的官方能力说明；不指定部署形态。 定位：ASP.NET features; Back-end code; Dynamic pages using C#, HTML, CSS, and JavaScript; Authentication。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[11-stacks-and-research](../../../projects/books/saas-engineering/foundations/11-stacks-and-research.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## FND-SRC-vue

[Vue.js — Introduction](https://vuejs.org/guide/introduction.html)

- `FND-CLM-vue`：声明式视图、响应式状态和渐进采用；不是固定框架套餐。 定位：What is Vue?; The Progressive Framework。边界：范围由原 source 的 claim_scope 与 locators、所关联 review 的 scope 限定。

消费：[README](../../../projects/books/saas-engineering/README.md)、[11-stacks-and-research](../../../projects/books/saas-engineering/foundations/11-stacks-and-research.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## EM-SRC-ontology

[Ontology building](https://www.palantir.com/docs/foundry/ontology/overview)

- `EM-C01`：Ontology connects integrated digital assets to organizational objects; public concepts include objects, properties, links, actions and functions. 定位：Ontology building; Object and link types; Action types and functions。边界：产品公开概念；不证明本例的数据模型、内部存储或业务保证。

消费：[README](../../../projects/books/saas-engineering/README.md)、[01-organization-to-system](../../../projects/books/saas-engineering/enterprise-mechanisms/01-organization-to-system.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## EM-SRC-compensation

[Compensation events](https://docs.camunda.io/docs/8.8/components/modeler/bpmn/compensation-events/)

- `EM-C02`：Compensation handlers are associated with completed activities and are invoked within defined scopes; ordering requires explicit modeling. 定位：Compensation events; Triggering compensation; Triggering compensation for a specific activity。边界：限定 Camunda 8.8 已读语义；不推导退款或配置恢复必然成功。

消费：[README](../../../projects/books/saas-engineering/README.md)、[01-organization-to-system](../../../projects/books/saas-engineering/enterprise-mechanisms/01-organization-to-system.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## EM-SRC-carbon-table

[Data table](https://www.carbondesignsystem.com/building-blocks/core/components/data-table/guidelines)

- `EM-C03`：Carbon distinguishes table-level, selected-set and row actions; batch mode disables row actions to clarify the active interaction mode. 定位：Variants: Expandable, Selectable; Universal behaviors: Table toolbar, Batch actions, Inline actions。边界：组件指导；不指定数据库分页、快照、事务或本册视觉布局。

消费：[README](../../../projects/books/saas-engineering/README.md)、[02-enterprise-frontend](../../../projects/books/saas-engineering/enterprise-mechanisms/02-enterprise-frontend.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## EM-SRC-w3c-grid

[Grid (Interactive Tabular Data and Layout Containers) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)

- `EM-C04`：Interactive grids require focus and keyboard navigation behavior; semantic roles alone do not implement these interactions. 定位：About This Pattern; Data Grids For Presenting Tabular Information; Keyboard Interaction For Data Grids。边界：APG 模式与交互说明；不声称示例经过浏览器或辅助技术实测。

消费：[README](../../../projects/books/saas-engineering/README.md)、[02-enterprise-frontend](../../../projects/books/saas-engineering/enterprise-mechanisms/02-enterprise-frontend.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## EM-SRC-govuk-errors

[Error summary](https://design-system.service.gov.uk/components/error-summary/)

- `EM-C05`：Error summaries accompany field errors, link to affected inputs, and receive focus so users can find and correct validation errors. 定位：When to use this component; How it works; Linking from the error summary to each answer。边界：表单验证指导；不把业务证据不足当成任意可改的输入错误。

消费：[README](../../../projects/books/saas-engineering/README.md)、[02-enterprise-frontend](../../../projects/books/saas-engineering/enterprise-mechanisms/02-enterprise-frontend.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## EM-SRC-actions

[Action types](https://www.palantir.com/docs/foundry/action-types/overview)

- `EM-C06`：Action types define changes to objects, properties and links; action logic and validation can be reused across user-facing applications. 定位：Action types, opening definition and shared logic paragraphs。边界：不把 Ontology 内部事务描述扩展为外部系统的分布式事务保证。

消费：[README](../../../projects/books/saas-engineering/README.md)、[03-schema-tools-completion](../../../projects/books/saas-engineering/enterprise-mechanisms/03-schema-tools-completion.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## EM-SRC-action-permissions

[Permissions](https://www.palantir.com/docs/foundry/action-types/permissions)

- `EM-C07`：Action application depends on configured object/link permissions and submission criteria; read controls, writes and side effects have distinct conditions. 定位：Apply action; Read-time enforcement only; Submission criteria; Side effect permissions。边界：未测试账户配置；细节随对象安全模型及版本变化，未概括成所有 SaaS 的权限实现。

消费：[README](../../../projects/books/saas-engineering/README.md)、[03-schema-tools-completion](../../../projects/books/saas-engineering/enterprise-mechanisms/03-schema-tools-completion.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## EM-SRC-job-workers

[Job workers](https://docs.camunda.io/docs/8.8/components/concepts/job-workers/)

- `EM-C08`：Job activation can time out and be reassigned; delivery may lead to multiple workers processing a job, requiring idempotent worker behavior. 定位：Requesting jobs; Completing or failing jobs; Timeouts。边界：仅取用所读 8.8 文档的重复执行边界；未运行 Camunda 或推断 exactly-once 外部效果。

消费：[README](../../../projects/books/saas-engineering/README.md)、[03-schema-tools-completion](../../../projects/books/saas-engineering/enterprise-mechanisms/03-schema-tools-completion.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## EM-SRC-pact-how

[How Pact works](https://docs.pact.io/getting_started/how_pact_works)

- `EM-C09`：Consumer tests encode expected interactions; provider verification replays requests and compares required response content; message tests focus on messages. 定位：Consumer testing; Provider verification; Non-HTTP testing (Message Pact)。边界：本地实验采用契约思路但未安装或运行 Pact framework/broker。

消费：[README](../../../projects/books/saas-engineering/README.md)、[03-schema-tools-completion](../../../projects/books/saas-engineering/enterprise-mechanisms/03-schema-tools-completion.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## EM-SRC-pact-faq

[FAQ](https://docs.pact.io/faq)

- `EM-C10`：Response contract matching does not by itself test provider side effects or replace core business logic tests. 定位：What is Pact not good for?; Why Pact may not be the best tool for testing pass through APIs?; Do I still need end-to-end tests?。边界：不把消息兼容性检查提升为业务正确性、性能或外部运行验收。

消费：[README](../../../projects/books/saas-engineering/README.md)、[03-schema-tools-completion](../../../projects/books/saas-engineering/enterprise-mechanisms/03-schema-tools-completion.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## EM-SRC-data-management

[Manage your data in Dynamics 365 implementation projects](https://learn.microsoft.com/en-us/dynamics365/guidance/implementation-guide/data-management)

- `EM-C11`：Data governance includes stewardship, data quality, primary data and use cases; data stewardship assigns responsibility for content and metadata fitness. 定位：Data governance; Data stewardship; Data quality; Primary data; Proper use cases。边界：官方实施指南，非普遍组织法定职责定义；data steward 不等于数据库管理员。

消费：[README](../../../projects/books/saas-engineering/README.md)、[04-implementation-reality](../../../projects/books/saas-engineering/enterprise-mechanisms/04-implementation-reality.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## EM-SRC-extend

[Extend Dynamics 365 apps without compromising performance](https://learn.microsoft.com/en-us/dynamics365/guidance/implementation-guide/extend-your-solution)

- `EM-C12`：Extensions should be assessed for business need and impact on usability, performance, security, maintainability and evolution; legacy behavior should not be copied without assessment. 定位：Introduction; What does it mean to extend?; Determine the need; Don’t replicate your legacy solution; Performance。边界：不替代实际产品版本、支持合同或定制成本测量；本册成本为合成输入。

消费：[README](../../../projects/books/saas-engineering/README.md)、[04-implementation-reality](../../../projects/books/saas-engineering/enterprise-mechanisms/04-implementation-reality.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## EM-SRC-migration

[Manage configuration and migration data for Dynamics 365 projects](https://learn.microsoft.com/en-us/dynamics365/guidance/implementation-guide/data-management-configuration-data-migration)

- `EM-C13`：Configuration data and migration data differ; migration planning covers scope, mapping, dependencies, roles, and pre/post-cutover activities. 定位：Configuration data; Use a configuration plan; Migration data; Define a migration strategy; How to assign roles and responsibilities。边界：厂商实施指导；未将其专属环境建议提升为所有系统的必要条件。

消费：[README](../../../projects/books/saas-engineering/README.md)、[04-implementation-reality](../../../projects/books/saas-engineering/enterprise-mechanisms/04-implementation-reality.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## EM-SRC-training

[Develop your own training strategy for your Dynamics 365 implementations](https://learn.microsoft.com/en-us/dynamics365/guidance/implementation-guide/training-strategy)

- `EM-C14`：Training should enable users to do their jobs and should continue after go-live; objectives can distinguish attendance from task competence. 定位：Introduction; Training objectives; What not to do。边界：培训目标指导；本册六人通过率是合成演算，不是实施成效数据。

消费：[README](../../../projects/books/saas-engineering/README.md)、[04-implementation-reality](../../../projects/books/saas-engineering/enterprise-mechanisms/04-implementation-reality.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## EM-SRC-support

[Create a support strategy for your Dynamics 365 solution](https://learn.microsoft.com/en-us/dynamics365/guidance/implementation-guide/transition-to-support)

- `EM-C15`：Support planning distinguishes scope, team and operations and includes readiness, service coverage and escalation before go-live. 定位：Support scope; Support team; Support operations。边界：不许诺任何供应商响应时限或客户 SLA。

消费：[README](../../../projects/books/saas-engineering/README.md)、[04-implementation-reality](../../../projects/books/saas-engineering/enterprise-mechanisms/04-implementation-reality.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## EM-SRC-testing

[Test your Dynamics 365 solution before deployment](https://learn.microsoft.com/en-us/dynamics365/guidance/implementation-guide/testing-strategy)

- `EM-C16`：Testing is an ongoing lifecycle activity with scope, test cycles, objectives, entry/exit criteria and outcome tracking. 定位：Why testing matters; testing strategy elements。边界：不把本文的本地测试扩展为产品上线、真实用户或厂商验收。

消费：[README](../../../projects/books/saas-engineering/README.md)、[04-implementation-reality](../../../projects/books/saas-engineering/enterprise-mechanisms/04-implementation-reality.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## EM-SRC-http-semantics

[RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html#name-202-accepted)

- `EM-C17`：HTTP 202 Accepted means accepted for processing but not completed; the request might or might not eventually be acted upon. 定位：15.3.3. 202 Accepted。边界：仅引用 §15.3.3；不把 HTTP 状态码解释为特定业务接收或效果保证。

消费：[README](../../../projects/books/saas-engineering/README.md)、[03-schema-tools-completion](../../../projects/books/saas-engineering/enterprise-mechanisms/03-schema-tools-completion.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## ED-SRC-li-infra-references

[本地参考资料库](https://github.com/bojieli/ai-infra-book/blob/main/references/README.md)

- `EDITORIAL:claim:1`：该仓库把来源材料、可搜索文本、登记与证据缺口分开管理，并区分材料取得和实际审阅。 定位：README 开篇：资料、快照与下载状态；引用范围和测量边界。边界：这里只核查编订流程说明；未下载其书目中的材料，未判断每篇事实或整本书质量。

消费：[README](../../../projects/books/saas-engineering/README.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## ED-SRC-li-teaching-plan

[全书图文教学修订计划](https://github.com/bojieli/ai-infra-book/blob/main/archive/reviews/book-teaching-plan-2026-09-10/README.md)

- `EDITORIAL:claim:2`：修订计划围绕读者的理解过程组织教学单元，用样张检验讲法，再检查全书的概念进入、章际分工与迁移练习。 定位：总体判断；编辑原则 1–4、7–10；实施阶段 0 与 7；验收标准。边界：这是作者的编订计划与标准；不将计划中其他参考书的特征转述为本次已核查事实，不复制目录或视觉规格。

消费：[README](../../../projects/books/saas-engineering/README.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## ED-SRC-li-chapter-review

[第四章全章连贯性复核](https://github.com/bojieli/ai-infra-book/blob/main/research/ch04-whole-chapter-review-2026-09-11/README.md)

- `EDITORIAL:claim:3`：全章复核记录把重复解释、突入案例和缺少定义逐项定位，保留独有算例，并将修订与检查产物关联。 定位：全篇20行：逐节调整、重复推导、定义补充及最终检查说明。边界：本次只读复核记录，未复跑该书计算、PDF构建或渲染；其通过数不作为本书测试证据。

消费：[README](../../../projects/books/saas-engineering/README.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## REPAIR-SRC-fhir-servicerequest-r5

[ServiceRequest - FHIR v5.0.0](https://hl7.org/fhir/R5/servicerequest.html)

- `REPAIR:claim:fhir-servicerequest-r5`：ServiceRequest 表达请求、提议或计划，执行后的诊断结果可通过报告或观察关联请求。 定位：§12.18.1 Scope and Usage; §12.18.2 Boundaries and Relationships。边界：仅核对所列资源角色与关联，不证明临床完成、正确性、整合实现或其他版本等价。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V01](../../../projects/books/saas-engineering/packages/health-science/V01.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## REPAIR-SRC-fhir-diagnosticreport-r5

[DiagnosticReport - FHIR v5.0.0](https://hl7.org/fhir/R5/diagnosticreport.html)

- `REPAIR:claim:fhir-diagnosticreport-r5`：DiagnosticReport 包含报告上下文、结果与解释，可关联请求和原子观察。 定位：§10.3.1 Scope and Usage; §10.3.2 Background and Context; §10.3.3 Boundaries and Relationships。边界：仅核对所列资源角色与关联，不证明临床完成、正确性、整合实现或其他版本等价。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V01](../../../projects/books/saas-engineering/packages/health-science/V01.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## REPAIR-SRC-postgres-range-18

[PostgreSQL 18 — 8.17. Range Types](https://www.postgresql.org/docs/18/rangetypes.html#RANGETYPES-CONSTRAINT)

- `REPAIR:claim:postgres-range-18`：标量相等与范围重叠可组合成 GiST 排斥约束，普通标量类型需合适运算符类，文档以 btree_gist 为例。 定位：§8.17.10 Constraints on Ranges; room_reservation example after CREATE EXTENSION btree_gist。边界：仅核对文档先决条件；未创建 PostgreSQL DDL、安装扩展或运行排斥约束实验。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V06](../../../projects/books/saas-engineering/packages/commerce-property/V06.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## REPAIR-SRC-postgres-gist-18

[PostgreSQL 18 — 65.2. GiST Indexes](https://www.postgresql.org/docs/18/gist.html#GIST-INTRO)

- `REPAIR:claim:postgres-gist-18`：GiST 是 Generalized Search Tree 的缩写；PostgreSQL 将其描述为可供实现不同索引方案的平衡树形访问方法。 定位：§65.2.1 Introduction, opening definition。边界：仅核对名称与访问方法类别，不声称安装扩展、运行数据库或复核后续实现章节。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V06](../../../projects/books/saas-engineering/packages/commerce-property/V06.md)、[terminology](../../../projects/books/saas-engineering/terminology.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## WB-SRC-sdc

[Technology Access Program (TAP-in)](https://www.synopsys.com/community/interoperability-programs/tap-in.html)

- `WB:claim:term-sdc`：SDC 展开为 Synopsys Design Constraints，用于描述设计意图及其时序等约束。 定位：Synopsys Design Constraints (SDC) entry。边界：名称与所述用途；未把厂商定义扩为本例全部内部实现。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V09](../../../projects/books/saas-engineering/packages/industry-networks/V09.md)、[terminology](../../../projects/books/saas-engineering/terminology.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。

## WB-SRC-spef

[Synopsys Donation of Variation-Aware Extension to SPEF Format Approved by IEEE 1481 Working Group](https://news.synopsys.com/home?item=122632)

- `WB:claim:term-spef`：SPEF 展开为 Standard Parasitic Exchange Format；该公告说明其用于工具间寄生参数信息交换。 定位：Opening announcement, first paragraph。边界：名称与所述用途；未把厂商定义扩为本例全部内部实现。

消费：[README](../../../projects/books/saas-engineering/README.md)、[V09](../../../projects/books/saas-engineering/packages/industry-networks/V09.md)、[terminology](../../../projects/books/saas-engineering/terminology.md)。

复查：实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。
