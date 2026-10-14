# SaaS 来源阅读卡

按稳定 source ID 回查公开 primary source。`unverified` 条目只说明研究用途；已读条目的 locator 与 claim ID 见 [catalog](catalog.json)。日期、获取范围与缺口在 [CHANGELOG](CHANGELOG.md)。消费入口：[SaaS 工程全景](../../distilled/saas-engineering-atlas/README.md)。

## APQC

[Process Frameworks](https://www.apqc.org/process-frameworks)

研究用途：H07。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## ISA95

[ISA-95 Enterprise-Control System Integration](https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard)

研究用途：V07, V08。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## EPCIS

[EPCIS and Core Business Vocabulary](https://www.gs1.org/standards/epcis)

研究用途：V11, V21。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## SAP_PP

[Processing Production Orders](https://learning.sap.com/courses/executing-basic-erp-processes-with-sap-s-4hana/processing-production-orders)

研究用途：V07。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## SAP_PP_DETAIL

[Production order and process order](https://help.sap.com/docs/SUPPORT_CONTENT/prodord/3138697900.html)

研究用途：V07, V08。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## SAP_GI

[Posting Goods Issues for Production Orders](https://learning.sap.com/courses/manage-production-orders-in-sap-s-4hana-manufacturing/posting-goods-issues-for-production-orders)

研究用途：V07。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## SAP_O2C

[Navigating the Order-to-Cash Process Steps](https://learning.sap.com/courses/discovering-the-basics-of-sap-s-4hana-sales/executing-sales-order-management_cad9dfbe-bafc-4ed9-ac2e-6fd8422430e4)

研究用途：V07, V21。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## SF_QTC

[What is Quote-to-Cash?](https://www.salesforce.com/eu/sales/cpq/quote-to-cash/)

研究用途：H01。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## STRIPE_INV

[How invoicing works](https://docs.stripe.com/invoicing/overview)

Stripe 的 invoice lifecycle 区分 draft、open、paid、void 与 uncollectible；finalization 使 draft 进入 open。页面 badge 不总是底层状态。

读取定位：Invoice lifecycle; Draft invoices; Open invoices。主张 `STRIPE_INV-C1`。用于区分业务事实、状态或系统设计前提；不据此判断其它产品的实现。未运行服务、未快照原文；当对应状态或接口变化时重访。

## STRIPE_WEBHOOK

[Receive Stripe events in your webhook endpoint](https://docs.stripe.com/webhooks)

Stripe 不保证事件按生成顺序送达，可能重复投递；文档要求验证签名，并讨论 event ID 去重和异步处理。

读取定位：Event ordering; Handle duplicate events; Handle events asynchronously; Create a handler。主张 `STRIPE_WEBHOOK-C1`。用于区分业务事实、状态或系统设计前提；不据此判断其它产品的实现。未运行服务、未快照原文；当对应状态或接口变化时重访。

## STRIPE_REV

[Revenue Recognition with subscriptions and invoicing](https://docs.stripe.com/revenue-recognition/methodology/subscriptions-and-invoicing)

Stripe Revenue Recognition 按 finalized invoice 的 line item 服务期间处理收入；取消 subscription 不自动改写已开票的收入计划。

读取定位：Licensed subscriptions; Subscription cancellations; Standalone invoices。主张 `STRIPE_REV-C1`。用于区分业务事实、状态或系统设计前提；不据此判断其它产品的实现。未运行服务、未快照原文；当对应状态或接口变化时重访。

## ORACLE_MATCH

[Match Approval Level Options](https://docs.oracle.com/en/cloud/saas/procurement/26b/oapro/match-approval-level-options.html)

研究用途：H02。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## FHIR_ORDER

[FHIR ServiceRequest](https://hl7.org/fhir/servicerequest.html)

研究用途：V01。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## FHIR_REPORT

[FHIR DiagnosticReport](https://fhir.hl7.org/fhir/diagnosticreport.html)

研究用途：V01。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## DICOM

[About DICOM: Overview](https://www.dicomstandard.org/about-home)

研究用途：V01。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## CTMS

[Veeva CTMS](https://www.veeva.com/products/veeva-ctms/)

研究用途：V02。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## EDC

[Medidata Rave EDC](https://www.medidata.com/en/data-experience/edc-systems/)

研究用途：V02。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## LABWARE

[LabWare QAQC SaaS LIMS](https://www.labware.com/lims/saas/qaqc)

研究用途：V03, V08。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## SHOPIFY

[Apps in order management](https://shopify.dev/docs/apps/build/orders-fulfillment/order-management-apps)

研究用途：V04。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## TOAST

[Order object summary](https://doc.toasttab.com/doc/devguide/apiOrdersOrderObjectSummary.html)

研究用途：V05。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## MEWS_RES

[Reservations](https://docs.mews.com/connector-api/operations/reservations)

研究用途：V06。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## MEWS_POS

[Point of sale integration](https://mews-systems.gitbook.io/connector-api/use-cases/point-of-sale)

研究用途：V06。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## GUIDEWIRE

[PolicyCenter submissions](https://docs.guidewire.com/cloud/pc/202507/cloudapibf/cloudAPI/topics/122-PCjobTypes/01-submissions/c_submissions.html)

研究用途：V13。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## ACORD

[ACORD Reference Architecture](https://www.acord.org/standards-architecture/reference-architecture)

研究用途：V13。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## MAMBU

[Loan Account Life Cycle and States](https://docs.mambu.com/docs/loan-account-life-cycle-and-states/)

研究用途：V12。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## MAMBU_APPROVE

[Approving a Loan](https://docs.mambu.com/docs/approving-a-loan/)

研究用途：V12。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## FIX

[Order State Changes](https://www.fixtrading.org/online-specification/order-state-changes/)

研究用途：V14。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## PROCORE_CHANGE

[Create Change Events](https://support.procore.com/products/online/user-guide/project-level/change-events/tutorials/create-change-events)

研究用途：V15。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## PROCORE_ORDER

[Change Orders](https://support.procore.com/products/online/user-guide/project-level/change-orders)

研究用途：V15。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## EDRM2

[Current EDRM Model](https://edrm.net/edrm-model/current/)

研究用途：V18。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## ONEROSTER

[Rostering, Resources, and Gradebook Standards](https://www.1edtech.org/blog/rostering-resources-and-gradebook-standards)

研究用途：V17。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## EDU_PORTAL

[1EdTech Standards](https://standards.1edtech.org/)

研究用途：V17。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## OKTA

[Understanding SCIM](https://developer.okta.com/docs/concepts/scim/)

研究用途：H04, H09。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## OKTA_SCIM

[Okta and SCIM Version 2.0](https://developer.okta.com/docs/api/openapi/okta-scim/guides/scim-20)

研究用途：H04, H08。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## SERVICENOW

[Life cycle of an Incident](https://www.servicenow.com/docs/r/it-service-management/incident-management/c_IncidentManagementStateModel.html)

研究用途：H05。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## D365_FS

[Work order lifecycle and system statuses](https://learn.microsoft.com/en-us/dynamics365/field-service/work-order-status-booking-status)

研究用途：V20。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## D365_FS_ARCH

[Work order architecture](https://learn.microsoft.com/en-us/dynamics365/field-service/field-service-architecture)

研究用途：V10, V16, V20。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## ZENDESK

[About the ticket lifecycle and ticket statuses](https://support.zendesk.com/hc/en-us/articles/8263915942938-About-the-ticket-lifecycle-and-ticket-statuses)

研究用途：H06。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## ZENDESK_AI_FAILURE

[Auto assist creates a loop for solved tickets](https://support.zendesk.com/hc/en-us/articles/9947838310298-Auto-assist-creates-a-loop-for-solved-tickets)

研究用途：H06。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## SNOWFLAKE

[Introduction to streams](https://docs.snowflake.com/en/user-guide/streams-intro)

研究用途：H07。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## GREENHOUSE

[Harvest API](https://developers.greenhouse.io/harvest.html)

研究用途：H04。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## IRONCLAD

[What is new in Ironclad: April 2025](https://support.ironcladapp.com/hc/en-us/articles/30977258163607-What-s-New-in-Ironclad-April-2025)

研究用途：H01, H09。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## CADENCE

[RTL-to-GDSII Back-End Flow: Synthesis to Timing Signoff](https://www.cadence.com/en_US/home/company/events/webinars/navigating-from-synthesis-to-timing-signoff.html)

研究用途：V09。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## MAXIMO

[Allowable Status Changes for Work Orders](https://supportcontent.ibm.com/support/pages/maximo-support-desk-allowable-status-changes-work-orders)

研究用途：V10。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## TMF622

[Product Ordering Management API](https://www.tmforum.org/open-digital-architecture/open-apis/product-ordering-management-api-tmf622/v5.0)

研究用途：V22。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## TMF_DIR

[TM Forum Open API Directory](https://www.tmforum.org/open-digital-architecture/open-apis)

研究用途：V22。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## KINGDEE

[金蝶 EAS 集中销售、分开发货、集中结算](https://vip.kingdee.com/eascloud/help/8.6/SCM.web/topics/noname1184.html)

研究用途：X02。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## FRONTIER

[Introducing OpenAI Frontier](https://openai.com/index/introducing-openai-frontier/)

研究用途：X01。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## IFS

[IFS Nexus Black builds industrial AI with Claude](https://claude.com/customers/ifs)

研究用途：V10。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## SIEMENS_AI

[Siemens Industrial Copilot expanded, adopted by thyssenkrupp](https://press.siemens.com/global/ro/node/7042)

研究用途：跨案例补充候选。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## D365_CLOSE

[Financial period close workspace](https://learn.microsoft.com/en-us/dynamics365/finance/general-ledger/financial-period-close-workspace)

研究用途：H03。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## CERTINIA

[Timecards](https://help.certinia.com/main/2022.3/Subsystems/PSA/Content/topics/Timecards/AboutTimecards.htm)

研究用途：V19。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## CERTINIA_BILL

[Billing Event Generation Tab](https://help.certinia.com/main/2022.2/Subsystems/PSA/Content/topics/BillingItemsEvents/GeneratingBEsTab.htm)

研究用途：V19。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## ORACLE_VEE

[About VEE](https://docs.oracle.com/en/industries/energy-water/meter-solution-cloud-service/23c/mscs-user-guides/Topics/D1_BG_About_VEE.html)

研究用途：V11。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## SENTINEL

[Automate incident handling with automation rules](https://learn.microsoft.com/en-us/azure/sentinel/automate-incident-handling-with-automation-rules)

研究用途：H08。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## AUTODESK

[CAD/CAM software](https://www.autodesk.com/ca-en/solutions/cad-cam)

研究用途：V07, V15。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## AUTODESK_CAE

[Computer-Aided Engineering](https://www.autodesk.com/in/solutions/computer-aided-engineering-cae)

研究用途：V07。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## IWMS

[What is IWMS?](https://www.servicenow.com/in/workflows/employee-workflows/what-is-iwms.html)

研究用途：V16。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## ELM

[Enterprise Legal Management](https://www.wolterskluwer.com/en/solutions/enterprise-legal-management)

研究用途：V18。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## SAAS_LENS

[General design principles: SaaS Lens](https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/general-design-principles.html)

AWS SaaS Lens 将 SaaS 解释为业务策略，并要求技术与运营支持持续演进和服务体验。

读取定位：General design principles: SaaS is a business strategy—not a technical implementation。主张 `SAAS_LENS-C1`。用于区分业务事实、状态或系统设计前提；不据此判断其它产品的实现。未运行服务、未快照原文；当对应状态或接口变化时重访。

## SAAS_SILO

[Full stack isolation](https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/full-stack-isolation.html)

研究用途：X01。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## IBP

[Supply Planning](https://help.sap.com/docs/SAP_INTEGRATED_BUSINESS_PLANNING/c1fb60cb1e9c49d99ada277ae57e9e6c/66a038fcf40f4f779c6b4696aede83a6.html)

研究用途：V21。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

## IBP_SAMPLE

[Integrated Planning Process with Unified Planning Area](https://help.sap.com/docs/SAP_INTEGRATED_BUSINESS_PLANNING/feae3cea3cc549aaa9d9de7d363a83e6/bea60e563f3e787fe10000000a441470.html)

研究用途：V21。当前为未读种子，不支持具体主张；开始相关案例前核对正文、版本和章节。来源标题保留 provider 及原词，不据此作能力排名。

