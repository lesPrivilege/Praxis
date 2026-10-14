# 证据侧栏

本页保存来源原题、实际读取范围、原创取用与边界。正文只引用支持相应判断的段落；`EM-C` 为公开来源事实，`EM-I` 为本册解释，`EM-S` 为合成例子。逐 URL 身份、读取日期、固定案例提交与排除项由 [evidence.json](evidence.json)保存。外部网页未保存全文快照；本册正文与代码可本地阅读，原文复访仍需网络。

<a id="ontology"></a>
## EM-C01 · Palantir — Ontology building

[Ontology building](https://www.palantir.com/docs/foundry/ontology/overview)

读取定位：Ontology building; Object and link types; Action types and functions。工具展开行：L556-L577；行号只帮助恢复本轮读取，稳定定位以原文标题为主。

消费：Ontology connects integrated digital assets to organizational objects; public concepts include objects, properties, links, actions and functions.
边界：产品公开概念；不证明本例的数据模型、内部存储或业务保证。
正文去向：[相关章节](01-organization-to-system.md)。

<a id="compensation"></a>
## EM-C02 · Camunda — Compensation events

[Compensation events](https://docs.camunda.io/docs/8.8/components/modeler/bpmn/compensation-events/)

读取定位：Compensation events; Triggering compensation; Triggering compensation for a specific activity。工具展开行：L73-L116；行号只帮助恢复本轮读取，稳定定位以原文标题为主。

消费：Compensation handlers are associated with completed activities and are invoked within defined scopes; ordering requires explicit modeling.
边界：限定 Camunda 8.8 已读语义；不推导退款或配置恢复必然成功。
正文去向：[相关章节](01-organization-to-system.md)。

<a id="carbon-table"></a>
## EM-C03 · IBM Carbon — Data table

[Data table](https://www.carbondesignsystem.com/building-blocks/core/components/data-table/guidelines)

读取定位：Variants: Expandable, Selectable; Universal behaviors: Table toolbar, Batch actions, Inline actions。工具展开行：L205-L229; L254-L289；行号只帮助恢复本轮读取，稳定定位以原文标题为主。

消费：Carbon distinguishes table-level, selected-set and row actions; batch mode disables row actions to clarify the active interaction mode.
边界：组件指导；不指定数据库分页、快照、事务或本册视觉布局。
正文去向：[相关章节](02-enterprise-frontend.md)。

<a id="w3c-grid"></a>
## EM-C04 · W3C WAI — Grid (Interactive Tabular Data and Layout Containers) Pattern

[Grid (Interactive Tabular Data and Layout Containers) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)

读取定位：About This Pattern; Data Grids For Presenting Tabular Information; Keyboard Interaction For Data Grids。工具展开行：L16-L64；行号只帮助恢复本轮读取，稳定定位以原文标题为主。

消费：Interactive grids require focus and keyboard navigation behavior; semantic roles alone do not implement these interactions.
边界：APG 模式与交互说明；不声称示例经过浏览器或辅助技术实测。
正文去向：[相关章节](02-enterprise-frontend.md)。

<a id="govuk-errors"></a>
## EM-C05 · GOV.UK Design System — Error summary

[Error summary](https://design-system.service.gov.uk/components/error-summary/)

读取定位：When to use this component; How it works; Linking from the error summary to each answer。工具展开行：L57-L59; L105-L118; L165-L169；行号只帮助恢复本轮读取，稳定定位以原文标题为主。

消费：Error summaries accompany field errors, link to affected inputs, and receive focus so users can find and correct validation errors.
边界：表单验证指导；不把业务证据不足当成任意可改的输入错误。
正文去向：[相关章节](02-enterprise-frontend.md)。

<a id="actions"></a>
## EM-C06 · Palantir — Action types

[Action types](https://www.palantir.com/docs/foundry/action-types/overview)

读取定位：Action types, opening definition and shared logic paragraphs。工具展开行：L555-L570；行号只帮助恢复本轮读取，稳定定位以原文标题为主。

消费：Action types define changes to objects, properties and links; action logic and validation can be reused across user-facing applications.
边界：不把 Ontology 内部事务描述扩展为外部系统的分布式事务保证。
正文去向：[相关章节](03-schema-tools-completion.md)。

<a id="action-permissions"></a>
## EM-C07 · Palantir — Permissions

[Permissions](https://www.palantir.com/docs/foundry/action-types/permissions)

读取定位：Apply action; Read-time enforcement only; Submission criteria; Side effect permissions。工具展开行：L555-L601；行号只帮助恢复本轮读取，稳定定位以原文标题为主。

消费：Action application depends on configured object/link permissions and submission criteria; read controls, writes and side effects have distinct conditions.
边界：未测试账户配置；细节随对象安全模型及版本变化，未概括成所有 SaaS 的权限实现。
正文去向：[相关章节](03-schema-tools-completion.md)。

<a id="job-workers"></a>
## EM-C08 · Camunda — Job workers

[Job workers](https://docs.camunda.io/docs/8.8/components/concepts/job-workers/)

读取定位：Requesting jobs; Completing or failing jobs; Timeouts。工具展开行：L74-L92; L109-L117; L155-L160；行号只帮助恢复本轮读取，稳定定位以原文标题为主。

消费：Job activation can time out and be reassigned; delivery may lead to multiple workers processing a job, requiring idempotent worker behavior.
边界：仅取用所读 8.8 文档的重复执行边界；未运行 Camunda 或推断 exactly-once 外部效果。
正文去向：[相关章节](03-schema-tools-completion.md)。

<a id="pact-how"></a>
## EM-C09 · Pact — How Pact works

[How Pact works](https://docs.pact.io/getting_started/how_pact_works)

读取定位：Consumer testing; Provider verification; Non-HTTP testing (Message Pact)。工具展开行：L21-L46; L63-L101；行号只帮助恢复本轮读取，稳定定位以原文标题为主。

消费：Consumer tests encode expected interactions; provider verification replays requests and compares required response content; message tests focus on messages.
边界：本地实验采用契约思路但未安装或运行 Pact framework/broker。
正文去向：[相关章节](03-schema-tools-completion.md)。

<a id="pact-faq"></a>
## EM-C10 · Pact — FAQ

[FAQ](https://docs.pact.io/faq)

读取定位：What is Pact not good for?; Why Pact may not be the best tool for testing pass through APIs?; Do I still need end-to-end tests?。工具展开行：L27-L37; L86-L96；行号只帮助恢复本轮读取，稳定定位以原文标题为主。

消费：Response contract matching does not by itself test provider side effects or replace core business logic tests.
边界：不把消息兼容性检查提升为业务正确性、性能或外部运行验收。
正文去向：[相关章节](03-schema-tools-completion.md)。

<a id="data-management"></a>
## EM-C11 · Microsoft — Manage your data in Dynamics 365 implementation projects

[Manage your data in Dynamics 365 implementation projects](https://learn.microsoft.com/en-us/dynamics365/guidance/implementation-guide/data-management)

读取定位：Data governance; Data stewardship; Data quality; Primary data; Proper use cases。工具展开行：L47-L79；行号只帮助恢复本轮读取，稳定定位以原文标题为主。

消费：Data governance includes stewardship, data quality, primary data and use cases; data stewardship assigns responsibility for content and metadata fitness.
边界：官方实施指南，非普遍组织法定职责定义；data steward 不等于数据库管理员。
正文去向：[相关章节](04-implementation-reality.md)。

<a id="extend"></a>
## EM-C12 · Microsoft — Extend Dynamics 365 apps without compromising performance

[Extend Dynamics 365 apps without compromising performance](https://learn.microsoft.com/en-us/dynamics365/guidance/implementation-guide/extend-your-solution)

读取定位：Introduction; What does it mean to extend?; Determine the need; Don’t replicate your legacy solution; Performance。工具展开行：L29-L31; L47-L69; L94-L106；行号只帮助恢复本轮读取，稳定定位以原文标题为主。

消费：Extensions should be assessed for business need and impact on usability, performance, security, maintainability and evolution; legacy behavior should not be copied without assessment.
边界：不替代实际产品版本、支持合同或定制成本测量；本册成本为合成输入。
正文去向：[相关章节](04-implementation-reality.md)。

<a id="migration"></a>
## EM-C13 · Microsoft — Manage configuration and migration data for Dynamics 365 projects

[Manage configuration and migration data for Dynamics 365 projects](https://learn.microsoft.com/en-us/dynamics365/guidance/implementation-guide/data-management-configuration-data-migration)

读取定位：Configuration data; Use a configuration plan; Migration data; Define a migration strategy; How to assign roles and responsibilities。工具展开行：L31-L79; L91-L98；行号只帮助恢复本轮读取，稳定定位以原文标题为主。

消费：Configuration data and migration data differ; migration planning covers scope, mapping, dependencies, roles, and pre/post-cutover activities.
边界：厂商实施指导；未将其专属环境建议提升为所有系统的必要条件。
正文去向：[相关章节](04-implementation-reality.md)。

<a id="training"></a>
## EM-C14 · Microsoft — Develop your own training strategy for your Dynamics 365 implementations

[Develop your own training strategy for your Dynamics 365 implementations](https://learn.microsoft.com/en-us/dynamics365/guidance/implementation-guide/training-strategy)

读取定位：Introduction; Training objectives; What not to do。工具展开行：L42-L60; L70-L90；行号只帮助恢复本轮读取，稳定定位以原文标题为主。

消费：Training should enable users to do their jobs and should continue after go-live; objectives can distinguish attendance from task competence.
边界：培训目标指导；本册六人通过率是合成演算，不是实施成效数据。
正文去向：[相关章节](04-implementation-reality.md)。

<a id="support"></a>
## EM-C15 · Microsoft — Create a support strategy for your Dynamics 365 solution

[Create a support strategy for your Dynamics 365 solution](https://learn.microsoft.com/en-us/dynamics365/guidance/implementation-guide/transition-to-support)

读取定位：Support scope; Support team; Support operations。工具展开行：L30-L50；行号只帮助恢复本轮读取，稳定定位以原文标题为主。

消费：Support planning distinguishes scope, team and operations and includes readiness, service coverage and escalation before go-live.
边界：不许诺任何供应商响应时限或客户 SLA。
正文去向：[相关章节](04-implementation-reality.md)。

<a id="testing"></a>
## EM-C16 · Microsoft — Test your Dynamics 365 solution before deployment

[Test your Dynamics 365 solution before deployment](https://learn.microsoft.com/en-us/dynamics365/guidance/implementation-guide/testing-strategy)

读取定位：Why testing matters; testing strategy elements。工具展开行：L31-L52；行号只帮助恢复本轮读取，稳定定位以原文标题为主。

消费：Testing is an ongoing lifecycle activity with scope, test cycles, objectives, entry/exit criteria and outcome tracking.
边界：不把本文的本地测试扩展为产品上线、真实用户或厂商验收。
正文去向：[相关章节](04-implementation-reality.md)。

<a id="http-semantics"></a>
## EM-C17 · IETF / RFC Editor — RFC 9110: HTTP Semantics

[RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html#name-202-accepted)

读取定位：15.3.3. 202 Accepted，工具展开 L3327–L3331。202 表示已受理但处理未完成，也不保证最终执行；只支持协议状态语义，不证明业务完成。正文去向：[第三章](03-schema-tools-completion.md)。

## 原创解释与合成推演

组织对象划分、七种前端语法、三个 schema 层次、五个完成门槛及实施调查方法，都是本册将来源与工程约束连接后的原创解释。它们没有被伪装成任何厂商的一套既有架构。两条贯穿例子、数值、角色政策、操作 ID、迁移状态与成本估算都是原创构造，演算核对见 [验证记录](verification.md)。

## 排除项与覆盖边界

SAP Fiori 两个直接定位未取得正文；数个 Microsoft 初始路径不可达，随后通过官方链接读取迁移与训练的准确页面。未取得的页面没有承担正文主张。搜索返回的非相关结果均未用于论证。来源仅为公开官方文档和授权只读的仓库案例；没有读取私人聊天、用户业务数据或凭据。

案例链接用于迁移学习；33 例各自的证据仍归对应案例包。本册读取案例索引、各分支开篇机制段与相关案例局部，不声称替所有案例重新完成厂商事实核查。
