# 独立复核报告

复核日期：2026-10-28（UTC）  
复核者：`independent_reviewer`（未参与研究主稿撰写）  
复核对象：`research_ai_workbench`、`contracts_clm`、`matter_ediscovery`、`china_and_business`、`cross_product_state_models`、`cross_product_pricing_patterns`  
复核方式：从研究工件抽取高风险 claim，重新读取厂商公开帮助中心、合同/定价页和产品页；未使用研究者的搜索摘要作为最终证据。

## 总结

首轮抽查 29 项：**通过 20、部分通过 5、未通过 3、未执行 1**。主笔随后修正了 3 个未通过项和 5 个部分通过项；2026-10-28 定向复查确认 **8/8 已正确落入相应 Markdown 与 JSON**。四个产品研究子包、跨产品状态 JSON 与交付索引均可用 `jq` 解析。

**复核后结论：文本研究包可验收，可供 Agent 建设消费。** `observed / inferred / proposed` 的关键边界已经修正，主入口也保留了动态价格与厂商声明的限定。视觉证据仍是独立未完成项：`verified_interaction = 0`、已核截图为 0；在截图补采、逐张查看和账本关联完成前，整包只能称“公开证据支持的产品机制研究”，不能称“页面审计”或“登录后实测”。

| 结果 | 数量 | 含义 |
|---|---:|---|
| 通过 | 20 | 原稿 claim 的对象、范围和证据状态与原始公开来源一致 |
| 部分通过 | 5 | 核心方向成立，但状态名、条件或来源指针需收紧 |
| 未通过 | 3 | 与原始来源冲突，或引用不能支持该精确 claim |
| 未执行 | 1 | 缺云端交互式浏览器，截图匹配与登录后交互审计没有发生 |

## 2026-10-28 定向复查：修正状态

| 原问题 | 修正结果 | 复查结论 |
|---|---|---|
| `M-004` 误标 observed | Markdown 明写“建议状态”；JSON 设 `evidence_status: proposed`、`observed_in: []`；交付索引同步 | 已修正 |
| Juro 再审批写为未知 | Markdown/JSON 补 `internal_change_retriggers_approval` 与 smartfield 条件，外部变化/签署回退/完整 hash 仍列未知 | 已修正 |
| Lexis 临时上传 10 分钟清除 | 删除无法支持的精确时长，改为删除时点 `unknown`；保留 temporary upload 与 Vault 的对象区分 | 已修正 |
| CoCounsel `running` 证据升级 | 改为 `processing/waiting (inferred from documented duration)`，JSON 同步 | 已修正 |
| Legora 缺精确来源 | Markdown 与 JSON 登记官方西语帮助页、语言和 `observed_public_page` | 已修正 |
| Clio `under review` 冒充状态 | 改为 `completed（可能正由律所复核，但不是独立 machine state）` | 已修正 |
| 北大法宝精确返回字段 | Markdown 改为待 schema 证实；JSON 设 `exact_return_fields: unknown_pending_tool_schema` | 已修正 |
| Westlaw 动态价格绑定 3 年期 | 删除期限绑定，明确当前抓取未保留 term 状态；主入口同步限定 | 已修正 |

主入口 `07-delivery/LEGALTECH_PRODUCT_MECHANISMS.md` 已正确投影上述边界：规则版本审批列为本轮未公开的自建治理建议；Juro 重审条件、Westlaw 动态配置限制和零实测状态均保留。剩余验收条件仅是截图补采，不影响文本/JSON 研究包的可消费性。

## 首轮必须修正项（现已全部修正）

以下保留首轮发现与当时建议，作为复核来路；当前状态以上方“定向复查”表为准。

### P0-1：规则发布生命周期被误标为已观察

- 位置：`03-mechanisms/cross_product_state_models.json` 的 `M-004`；对应 Markdown 的“批准规则”行。
- 当前写法：`observed_in: [Spellbook, Ironclad]`，transition 为 `draft -> approved -> active -> retired`。
- 复核：Spellbook 与 Ironclad 的公开资料支持规则/Playbook 的配置、权限、运行与交易级 exception approval；本轮没有支持“规则版本草拟—批准—激活—退役”这一完整治理状态机的公开证据。合同深描本身也明确写了四个产品都未公开完整规则发布审批。
- 影响：Agent 会把建设建议当成厂商已观察机制；这违反 `observed / proposed` 分层。
- 修正：把 `M-004.evidence_status` 明确设为 `proposed`，`observed_in` 置空或改成“配置/发布权限线索”，并在 Markdown 表格标“建议状态，不是厂商现状”。`rule_version.approved` 可保留在 Proposed 区，不能列作 Observed。

### P0-2：Juro 再审批被写成未知，与官方帮助冲突

- 位置：`02-products/contracts_clm.md` Juro 流程 D。
- 当前写法：公开资料未说明修改后哪些 prior approvals 自动失效。
- 原始来源：[Handling approvals](https://intercom.help/juro/en/articles/5653139-handling-approvals) 明确写明，文档批准后发生 internal changes 会重新触发审批；还说明分配到 specific smartfields 的 approver 只在相关字段改变时重新进入后续审批轮次。
- 影响：遗漏了版本/字段变化使批准失效的关键机制。
- 修正：改为“内部修改会重新触发审批；字段级 approver 是否重入取决于其绑定字段是否变化。外部修改、签署回退与完整版本绑定仍未核实。”JSON 的 `juro-document-approval` 也应补该 transition。

### P0-3：Lexis 临时上传“10 分钟清除”引用不匹配

- 位置：`02-products/research_ai_workbench.md` Lexis 流程 B 第 4 步。
- 当前写法：旧 security 文档称 10 分钟不活动后清除上传文件，但段末只指向 [Upload Documents](https://help.lexisnexis.com/Flare/lexisplusai/US/en_US/Content/FAQ/upload.htm)。
- 复核：该 Upload 页面支持 10 文件、20MB、文件格式、动作激活和逐文档摘要 tab；它没有出现“10 分钟不活动后清除”。
- 影响：精确保留期属于高风险数据治理 claim，不能用相邻帮助页代证。
- 修正：补上明确写有该保留期的旧 security 文档、日期与适用产品版本；否则删除“10 分钟”并将 temporary upload 的具体删除时点标为 `unknown`。Vault 持久保存与 session upload 是不同对象的方向仍成立。

## 首轮收紧项（现已全部修正）

以下保留首轮差异；当前 Markdown、JSON 和主入口已按建议落地。

### P1-1：CoCounsel connector 的 `running` 不宜标为直接观察状态

[CoCounsel Legal MCP guide](https://cocoagent-service.cocounsel.thomsonreuters.com/mcp/guide) 直接支持 session、专用上传通道、file list、Ask CoCounsel、deliverable、时长与 error guidance，也支持“宿主附件不等于 CoCounsel 已接收”。该页没有定义一个名为 `running` 的外显状态。正文与 JSON 可把 `running` 改成 `processing/waiting (inferred from run duration)`，或只保留 `ask_cocounsel → answer/deliverable | error`。

### P1-2：Legora 运行状态内容成立，但主稿缺精确来源 URL

官方多语言帮助页明确支持：20 秒等待、`running` 可能为计算或等待回答/批准/继续、chat link、禁止同任务盲重试、terminal `failed` 与 `answer: null`。可用原始指针之一是 [How to connect an MCP client to Ask Legora（官方西语页）](https://support.legora.com/es/how-to-use-legora-from-an-mcp-client)。主稿目前只写“官方多语言 help 的搜索摘录”，机器索引无法回查；应登记 exact URL、语言与访问日期。

### P1-3：Clio `under review` 不是独立 task 状态

[Clio for Clients](https://help.clio.com/hc/en-us/articles/57018750464283-Work-With-Your-Law-Firm-in-Clio-for-Clients) 支持 Outstanding、Completed、Undo / Mark as not complete，并说明 Completed tab 包含律所正在审阅的 task。它没有把 `under review` 定义为独立状态。状态表应写 `completed (may be under firm review)`，避免 Agent 创建不存在的 machine state。

### P1-4：北大法宝 MCP 的核心机制通过，精确返回字段需另证

[北大法宝 MCP](https://mcp.pkulaw.com/) 直接支持统一 Token、MCP/CLI 两种调用面、法规/案例检索、法规/案号识别、citation validator、doc-link、CLI 原始 JSON 及页面所称 CLI 零 LLM Token 消耗。主稿“引用核验返回标准名称、法条原文、来源链接”的精确字段组合未在本轮抓到的首页 schema 中出现；若没有单独工具文档，应改成“页面列出引用核验与文档超链工具，返回字段待核”。

### P1-5：Westlaw 动态价格缺少可复现的 3 年期配置快照

[Westlaw Edge with AI-Assisted Research 定价页](https://sales.legalsolutions.thomsonreuters.com/en-us/products/westlaw-edge-aar/plans-pricing) 当前抓取支持 `$170.95/month`、原价 `$210.40`，All States and Federal `$292.50/month`、原价 `$360.00`，并支持最多 10 名律师的在线价格条件。抓取文本的 Order Summary 中 plan 仍为 pending，未保留 `3-year term`。跨产品价格稿应删除“3-year term”限定，或保存带配置参数的 URL/页面状态和截图；金额本身要带访问日与动态配置边界。

## 抽查记录

| review_id | 产品/主题 | 被核对象 | 结果 | 原始来源与说明 |
|---|---|---|---|---|
| RAI-01 | vLex Vincent | authority list 删除后 Apply 并重生成 memo | 通过 | [Ask a Research Question](https://support.vlex.com/vincent-by-vlex/vincent/core-workflows/ask-a-research-question) 明确支持左右分栏、source/summary/excerpt、Modify list、Apply、regenerate |
| RAI-02 | vLex Vincent | cell 人工修订、保留 AI 原值、双向恢复 | 通过 | [Correct a Cell](https://support.vlex.com/vincent-by-vlex/vincent/core-workflows/tabular-review/correct-a-cell-in-tabular-review-and-revert-to-vincents-answer) 明确支持，且修改列格式触发该列重算 |
| RAI-03 | Lexis | 10 文件/20MB、上传后按钮激活、逐文档 tab | 通过 | [Upload Documents](https://help.lexisnexis.com/Flare/lexisplusai/US/en_US/Content/FAQ/upload.htm) |
| RAI-04 | Lexis | temporary upload 10 分钟清除 | 未通过 | 当前引用页不含该保留期；需旧 security 原件或降级未知 |
| RAI-05 | CoCounsel | session/upload/list/ask/deliverable/error | 部分通过 | [Connector guide](https://cocoagent-service.cocounsel.thomsonreuters.com/mcp/guide) 支持对象分层；不直接定义 `running` 状态 |
| RAI-06 | Legora | running/waiting/failed/answer null/chat link | 通过 | 官方帮助正文支持上述状态语义 |
| RAI-07 | Legora | 主稿 source pointer | 部分通过 | 内容可核，但原稿未登记 exact URL |
| CLM-01 | Spellbook | full document vs redlines、Accept/Reject/Revise、Apply All | 通过 | [Playbooks Overview](https://help.spellbook.legal/en/articles/9926250-playbooks-overview)、[First Party Playbooks](https://help.spellbook.legal/en/articles/13875622-first-party-playbooks-redline-review) |
| CLM-02 | Ironclad | candidate text vs clause exception | 通过 | [Use Playbooks](https://support.ironcladapp.com/hc/en-us/articles/12275585451159-Use-Playbooks-in-Workflows-and-Contract-Reviews) 明确 `Insert` 与 `Request an exception(reason, approver)` 两条分支 |
| CLM-03 | Luminance | precedent/playbook、auto markup、collaborative workflow | 通过 | 产品页/博客只作为 `vendor_claim`，原稿没有提升为实测 |
| CLM-04 | Juro | accept/reject redline 不可撤销；review cycle 可重开 | 通过 | [AI Review in Juro](https://intercom.help/juro/en/articles/12691465-ai-review-in-juro) |
| CLM-05 | Juro | 修改后 prior approval 失效 | 未通过 | [Handling approvals](https://intercom.help/juro/en/articles/5653139-handling-approvals) 已明确 internal changes retrigger approval |
| MTR-01 | Clio | matter→task→client complete→reopen | 通过 | [Manage Tasks](https://help.clio.com/hc/en-us/articles/9204917906971-Manage-Tasks-in-Clio-Manage)、[Clio for Clients](https://help.clio.com/hc/en-us/articles/57018750464283-Work-With-Your-Law-Firm-in-Clio-for-Clients) |
| MTR-02 | Clio | portal share/unshare、bill approval/send、下载后边界 | 通过 | [Share Documents, Invoices, and Events](https://help.clio.com/hc/en-us/articles/57017985344923-Share-Documents-Invoices-and-Events-With-Clients)；原稿把下载副本处置标未知 |
| MTR-03 | Clio | `under review` 状态 | 部分通过 | 页面为 Completed tab 的描述，不是独立状态 |
| MTR-04 | Litify | Salesforce/AWS、support access、user-level permissions | 通过 | [Data and Security](https://www.litify.com/blog/data-security-best-practices-at-litify)；原稿正确限定为厂商页面且未外推完整 permission graph |
| EDS-01 | Relativity | file exception vs job exception、retry/rerun/replace | 通过 | [Exception and error resolution](https://help.relativity.com/RelativityOne/Content/Relativity/Processing/Processing_error_resolution.htm) |
| EDS-02 | Relativity | committed data volume、AI included、no per-user fee、add-ons | 通过 | [Pricing](https://www.relativity.com/platform/pricing/) |
| EDS-03 | Everlaw | 四阶段与 Complete with errors | 通过 | [Native Upload Errors](https://support.everlaw.com/hc/en-us/articles/360002614631-Identifying-and-Troubleshooting-Native-Upload-Errors) |
| EDS-04 | Everlaw | default all selected、impact count、async task、undo | 通过 | [Batch Modify](https://support.everlaw.com/hc/en-us/articles/204779929-Batch-Modify) |
| EDS-05 | Everlaw | per-GB/data usage、unlimited users/uploads、AI credits | 通过 | [Pricing](https://www.everlaw.com/pricing-b/) |
| CN-01 | 法大大 | 版本、签署用量、API/审批/集成增购、免费版非售卖 | 通过 | [定价](https://www.fadada.com/price)、[产品功能订阅](https://support.fadada.com/d/1853748778912940033.html) |
| CN-02 | 北大法宝 MCP | MCP/CLI、统一 Token、工具清单、原始 JSON | 通过 | [MCP 平台](https://mcp.pkulaw.com/) |
| CN-03 | 北大法宝 MCP | citation validator 精确返回字段 | 部分通过 | 首页只充分支持工具存在；需 schema/工具文档 |
| CN-04 | 得理 | SaaS/内容/API/律师服务边界 | 通过 | [官网](https://www.delilegal.com/)、[法搜](https://data.delilegal.com/data-vip)、[开放平台](https://open.delilegal.com/personal/overview) |
| COM-01 | Clio/Juro/Spellbook/Ironclad | 四个公开定价与实施/支持拆分 | 通过 | 四个官方定价页；无金额均被写为 quote/not found，未写免费 |
| X-01 | 跨产品机制 | rule version approval lifecycle | 未通过 | 证据只支持配置/权限/交易级 exception；完整规则发布状态是 Proposed |
| X-02 | 跨产品定价 | Westlaw 3 年期动态价格状态 | 部分通过 | 金额与律师数条件可见；3 年期未保存在可复现状态 |
| VIS-01 | 全部产品 | 截图与亲自交互 | 未执行 | 当前工具无云端交互式浏览器；所有待补拍 URL 已作为 backlog，不可称截图匹配通过 |

## Agent handoff 可消费性

### 通过项

- 产品稿普遍能从业务对象进入流程，列出输入、动作、结果、权限和未知，未强行套一张通用 schema。
- 研究、合同、matter/eDiscovery 与商业稿均把 `observed / inferred / proposed` 分层，并把软件、内容、实施与法律专业服务拆开。
- 引用大多为直接 URL；商业缺价没有写成免费；厂商准确率、安全、效率和客户数字大多保持 `vendor_claim`。
- 研究子包 JSON 均通过解析，字段适合 agent 检索。

### 条件通过项

- `cross_product_state_models.json` 在修正 `M-004` 前为**未通过**；其余子包 JSON 可用。
- 主入口合并时应保留每条机制的 `evidence_status`，不要把 Proposed 对象状态投影进 Observed 矩阵。
- 需要把 exact source URL 纳入 Legora MCP 状态；搜索摘录不能作为最终机器指针。

## 截图与证据等级

- `verified_interaction = 0`
- 实际保存并人工查看的产品截图：`0`
- 官方录屏画面级证据：`0`（没有带时间点的已核画面进入本复核）
- 公开帮助/开发文档：关键流程的主要证据
- 官方产品/定价/安全页：只支持页面明示内容；性能、安全与效果仍为厂商承诺

当前结论：文本研究可形成“产品机制参考库”，不能称为“产品可用性审计”或“登录后界面实测”。截图 backlog 中的 URL、页面状态和建议捕获点可供父任务补拍；补拍后仍需逐张查看保存文件，才能把对应 claim 升级为页面视觉证据。

## 复查时间

- 动态定价：最迟 2026-11-28，或进入采购前立即复查。
- 产品流程/帮助中心：最迟 2027-01-28；若页面更新时间、品牌整合或产品包装变化则提前。
- 安全、数据驻留、内容授权与私有化：采购/设计评审前读取合同、DPA、认证/审计原件；官网声明不自动升级为独立验证。

---

## Harvey 补充独立复核（2026-10-28）

复核对象：`02-products/harvey_focused_profile.md` 与 `.json`。Harvey 条目在上一轮主报告完成后加入，因此单独抽查 10 个高影响 claim。结果：**通过 7、部分通过 3、未通过 0、未执行 1（截图/登录后交互）**。

### 结论

Harvey 聚焦稿的核心机制可用。Playbook 三种 outcome、`Mark reviewed` 的进度语义、候选 redline 处置、Builder 的 Save/Share 边界、Review Table 的 cell/source 数据、Agent 分享权限与条件式 admin approval 都能回到 2026 官方帮助、开发者文档或 release notes。`observed / inferred / proposed` 主体分层正确，没有把完整 rule lifecycle 冒充厂商现状。

三项需在合并进主索引前收紧：

1. **Connector 底层权限不扩张只能标 inferred / unknown。** [Connector Library](https://www.harvey.ai/platform/connector-library) 直接支持 workspace admin 控制哪些用户/组可用 connector、开放哪些 tools、哪些 tool 需要 human confirmation；它没有单独证明每个 connector 都继承底层系统的 object permission、ethical wall 与 revocation。稿件“Harvey access 不自动扩大底层系统权限”是正确的设计边界，但应标为 `inferred / must_verify_per_connector`，不能视为 `observed_public_page`。
2. **价格状态要拆开。** 没有公开金额只支持 `public_price_not_found`；除非另有官方采购页明确要求询价，不能把它自动升级成 `quote_based`。JSON 的 `pricing_status: quote_based_or_not_found` 应拆为 `public_price: not_found` 与 `commercial_model: unknown`（或补官方报价来源后再设 `quote_based`）。
3. **培训主张缺来源索引。** Harvey Academy 的 onboarding/training 事实可由 [Getting Started with Harvey Academy](https://help.harvey.ai/articles/harvey-academy) 与 [Harvey Academy](https://academy.harvey.ai/) 支持；当前 Harvey JSON `sources` 未登记其中任一项。应补 source_id、URL、访问日期和 `observed_public_page`，否则商业/服务段的 training claim 无机器指针。

### 抽查记录

| review_id | 高影响 claim | 结果 | 原始官方证据与边界 |
|---|---|---|---|
| HV-R01 | Playbook outcome 为 `Acceptable / Needs review / Not acceptable`；Needs review 表示 fallback 但需律师判断 | 通过 | [Harvey for Word: Playbooks Guide](https://help.harvey.ai/articles/word-add-in-playbooks-guide) 直接定义三态；这不是准确率验证 |
| HV-R02 | `Mark reviewed` 使 suggestion 变灰并更新 progress，不等于风险批准或文本采用 | 通过 | 同一 Playbooks Guide 直接支持 UI 后果；“不等于风险批准”是对象语义解释，稿件没有冒充厂商按钮名 |
| HV-R03 | Apply/edit/magic edit/dismiss/ask for revision 与 Apply all 的 redlined document 行为 | 通过 | Playbooks Guide 直接支持；稿件把 preview、partial failure、undo、并发冲突保持 `unknown` |
| HV-R04 | Builder 从 template/既有 playbook/最多 10 份合同/Vault/comments/空白建规则，Save 不等于组织批准 | 通过 | [Create a Playbook](https://help.harvey.ai/articles/create-a-playbook) 支持输入、citations、Save、view/edit share；完整批准生命周期正确列为未知/Proposed |
| HV-R05 | Review Table：row=文档或 file group、column=问题、cell 含 answer/reasoning/citations/verification，user edit 优先 | 通过 | [Review Table API](https://developers.harvey.ai/guides/review_tables) 直接支持，并给出 scheduled run、409/422 等异常边界 |
| HV-R06 | inline edit、cell refresh、sentence-level citations、cell lock、防 overwrite | 通过 | [Review Tables release notes](https://help.harvey.ai/release-notes/category/review-tables)；cell lock 明确阻止 edit/re-run/other-user overwrite |
| HV-R07 | Agent 可 Save 后自用；Run/View/Edit/Full；admin approval 仅在组织选择的 sharing levels 触发 | 通过 | [Agents release notes](https://help.harvey.ai/release-notes/category/agents) 的 2026-03 与 2026-10 条目；稿件正确把 2025 publication approval 视为旧状态 |
| HV-R08 | Connector admin 可控制 user/group、tools 与 human confirmation；且不会扩大底层对象权限 | 部分通过 | 前半由 [Connector Library](https://www.harvey.ai/platform/connector-library) 直接支持；后半需逐 connector 文档/实测，标 inferred/unknown |
| HV-R09 | Academy / Help Center 提供 onboarding 与 training | 部分通过 | 官方 Academy 与帮助页支持，但 Harvey JSON 来源账本未登记，需补机器指针 |
| HV-R10 | 无公开金额，因此为 quote based / not found；Targeted Source、Ask Lexis、Covered AI 与 Basic Service 分层 | 部分通过 | [Service Terms](https://www.harvey.ai/legal/service-terms) 明确 Ask LexisNexis 和 Covered AI Services 不含在 Basic Service，并说明处理/保留差异；“无价”只支持 not found，不自动支持 quote based |

### 标签与 Agent handoff

- **Observed**：Playbook outcome/actions、Builder inputs/Save/share、Review Table 数据字段与 lock、Agent access levels/conditional approval、connector tool confirmation。
- **Inferred**：`Mark reviewed` 不构成法律风险批准的对象语义；connector 不扩大底层权限；侧栏适合作为 verification/governance plane。
- **Proposed**：完整 `RuleVersion` lifecycle、bulk impact preview、stable cross-surface SourceAnchor、Accept risk / Apply text / Approve rule 三控件分离。
- **Unknown**：Playbook Apply all 的 preview/undo/partial failure、cell 上游变化失效、Agent run 完整失败状态机、具体价格/计费单位、实施包与 support SLA。

Harvey JSON 可解析；除上述 `pricing_status` 和 Academy source pointer 外，结构化内容与 Markdown 一致。`verified_interaction = false` 正确；截图 backlog 仍是待补，不能据此称 Harvey 页面已审计。

---

## 最终封包门（2026-10-28）

### 门结论

**条件通过；文本包可独立发货。** 本轮共检查 10 个封包门项：**通过 8、部分通过 1、未通过 0、未执行 1**。这里的“可发货”限定为“公开证据支持、可供 Agent 建设消费的产品机制参考库”；不包含登录产品实测、页面可用性审计或本 reviewer 的像素级截图复核。

主报告和研究子稿已经把视觉附件状态统一为：图像 ZIP 已保存至 Library（`libfile_a88ad92f6b5c81918600d90b21bc2ac0`），但当前研究 executor 未能材料化，所以只按视觉账本编号、URL、状态与 worker 文字观察关联。先前“图像附件尚待确认/确认后再关联”的旧措辞已经删除。`05-evidence/README.md` 也已经明确：全局来源账本按 URL 去重，产品 JSON 内的 `source_id` 才是产品级权威机器指针。

### 封包抽查

| gate_id | 核对项 | 结果 | 复核结论 |
|---|---|---|---|
| PKG-01 | `visual_observation_ledger.md` / `.json` 与主报告视觉主张 | 通过 | 两份账本均登记 33 项；JSON 的 01–33 与 `visual_handoff_manifest.json` 一一对应，无缺号/重号。主报告只引用 `public_page_screenshot`、`official_documentation_embedded_product_image`、`official_video_frame` 三类，并明确均不是登录产品实测。双栏、规则卡、合同正文/例外、Word+authority 等摘要均可回到 MD 账本具体条目。 |
| PKG-02 | Clio 当前套餐与 Starter 起价 | 通过 | [Clio 官方定价页](https://www.clio.com/pricing/) 当前列 Starter / Core / Signature / Elite，并写 `Starting at $49/user`；FAQ 进一步写 `$49 USD per user per month`。主报告、商业稿、产品稿和 JSON 均没有把 Starter 起价外推为全部套餐单价。 |
| PKG-03 | Relativity aiR 重定向、更新时间与旧品牌嵌图 | 部分通过 | 旧 `RelativityOne` Review Template URL 可独立确认重定向到 `RelativityaiR`，当前页标题为 `Relativity aiR Review Workspace template`。`2026-09-17` 更新时间和嵌图仍显示 RelativityOne 品牌来自 worker 的页面观察；本 reviewer 未取得图像字节，不能独立做像素确认。主报告已把这两点写成时效/品牌边界，没有据此宣称全产品统一改版。 |
| PKG-04 | Vincent 原始 Markdown / 媒体图边界 | 通过 | [Vincent Ask a Research Question](https://support.vlex.com/vincent-by-vlex/vincent/core-workflows/ask-a-research-question) 在本轮文本访问中以 `text/plain` Markdown 返回，并把产品图作为独立 media URL 嵌入。主报告和研究稿正确把 15 记为页面呈现异常，把 25–26 记为官方文档嵌入产品图，不称网页设计或产品实测。 |
| PKG-05 | CoCounsel 视频帧边界 | 通过 | 视觉账本把 30 区分为播放前公开培训页，把 31–33 区分为带时间点的 `official_video_frame`，并分别注明裁切、非真实审计日志、未实际执行核验/修改。主报告只用这些帧支持“官方演示如何并置 Word、进度/审批和 authority link”，没有升级为真实工具运行或结果正确性验证。 |
| PKG-06 | Harvey connector 权限修正 | 通过 | Markdown 已明确通用 Connector Library 只直接支持 user/group、tool 与 human-confirmation 管理；底层 object permission、ethical wall 与撤权继承为 `inferred / must_verify_per_connector` 或 `unknown`，不是 Harvey 已观察保证。 |
| PKG-07 | Harvey 定价状态修正 | 通过 | Markdown 与 JSON 均拆成 `public_price = not_found`、`commercial_model = unknown`；未再用 `quote_based_or_not_found` 把“没有公开金额”自动升级成报价制。 |
| PKG-08 | Harvey Academy 来源修正 | 通过 | JSON 已加入 `HV-ACADEMY`，指向官方 Harvey Academy 帮助页；商业段的 onboarding/training 主张已有机器指针，具体实施、customer success、专家服务收费仍保持 unknown。 |
| PKG-09 | 相对 Markdown 链接 | 通过 | 机器扫描 12 个本地相对 Markdown 链接，缺失 0；外部 URL 不计入此项。 |
| PKG-10 | JSON 解析、文件指针、source 引用与视觉编号 | 通过 | 11 个 JSON 全部可解析；`product_index.json` 的 34 个本地 `.md/.json/.csv` 路径全部存在；contracts 28、research AI 28、matter/eDiscovery 40、中国/商业 34 个产品内 source 引用均在各自权威 JSON 中解析；视觉账本和 handoff manifest 均为 33 个相同 ID。全局 URL 去重账本不保证 alias 反查，现已在 `05-evidence/README.md` 明示，不再构成悬空指针。 |

### 精确残余阻碍

1. **像素复核未执行。** Library ZIP 无法在本 executor 材料化；本 reviewer 没有读取 33 个图像文件，也没有本地计算 ZIP 的 SHA-256。`5,718,578 bytes` 与 `84ea543ceb7bdfa68724f9dd79baf3e833e9f2bd96b97f657ac43223d2267fac` 只能称上游报告值。视觉 ZIP 可单独交付，但不得声称本 reviewer 已做文件/像素一致性验收。
2. **Relativity 与 CoCounsel 的画面级内容仍依赖 worker 账本。** Relativity 重定向和当前 aiR 文本可独立确认；旧品牌嵌图、页面更新时间可见位置、CoCounsel 00:22/01:02/01:52 帧内容未在本 reviewer 环境复验。报告已保留这一证据边界，因此不阻止文本包发货。
3. **Harvey 与 Legora 不在 33 图视觉包内。** `visual_handoff_manifest.json` 已把 Harvey HV-01–06 与 Legora RAI-13–16 列为明确视觉缺口并禁止用别家图片替代。它们的文本机制仍可用，但不能称视觉已覆盖。
4. **动态价格仍需短周期复查。** Clio 当前套餐/起价已通过本轮官方页复核，但动态页面建议最迟 2026-11-28 或采购前复查。

### 发货判断

- **文本包：可独立发货。** 应连同主入口、产品/机制/商业稿、JSON、来源账本、视觉观察账本和本独立复核一起交付。
- **视觉包：可作为独立 Library 附件交付，但本 reviewer 未完成像素/哈希复核。** 交付说明必须保留 Library file id、上游报告哈希和 `local_byte_verification = false`。
- **页面审计/登录后实测：不可宣称。** `verified_product_interaction_count = 0` 仍是正确门限。

---

## Lawhive 服务模式补充独立复核（2026-10-28）

复核对象：`04-commercial/lawhive_service_model.md` 与 `.json`，以及合并后的主入口、产品索引和来源账本。未注册、未提交 intake、未联系平台/律师；不做截图像素审计。

### 结论

**核心服务模式通过。** 高影响 claim 抽查共 12 项：**通过 11、部分通过 1、未通过 0**。另有封包检查：主入口/产品索引计数通过；产品内 source pointer 通过；新增视觉补证与全局 CSV 同步各为部分通过。

Lawhive 稿件最重要的边界成立：Lawhive Ltd 是网站、转介与技术平台运营者，不是提供个案法律意见的律所；客户通过 Service 直接聘用具体 Lawyer；关联的 Lawhive Legal Ltd 只是网络中的受监管提供者之一，不能把所有 matter 都归到该实体。收费也不是纯 SaaS seat price：客户按 matter quote/prepayment 购买法律服务，Lawyer 另向 Lawhive 支付 referral/platform fee。AI 页面只支持律师侧工具与厂商 demo；强制 human-review gate 没有被公开证明，稿件把它留在 inferred/proposed 是正确的。

上一轮发现的线性状态机风险已在复核期间修正：Markdown 明确状态表是 gate 目录而非通用漏斗；JSON 增加 `sequence_semantics = illustrative_gates_not_universal_linear_funnel`、三条 `partial_order_constraints` 和未知排序。当前不再把 quote、Lawyer assignment、client-care、payment、instructions 冒充跨案件统一顺序。

### 高影响 claim 抽查

| review_id | claim | 结果 | 官方原始证据与边界 |
|---|---|---|---|
| LH-R01 | Lawhive Ltd（13800100）运营网站，但不是律所、不给个案法律意见 | 通过 | [Terms of Service](https://lawhive.co.uk/legal/terms-of-service) 第 2、9、15 节直接支持；品牌页称“modern law firm”属于品牌/网络表述，不能覆盖法律实体条款。 |
| LH-R02 | Lawhive Ltd 的 Service 包含网站、技术平台、通信、文档管理/存储和支付 | 通过 | [Client Solicitor Terms](https://lawhive.co.uk/legal/client-solicitor-engagement-terms) 定义 `Service`；这是平台能力定义，不等于登录后 UI 已审计。 |
| LH-R03 | 客户通过 Service 直接聘用具体 Lawyer，法律服务由 Lawyer 提供 | 通过 | Terms of Service 第 15 节写明 Lawyer `engaged directly by you`；Client Solicitor Terms 定义 Lawyer 为经 Service 直接受聘的 law firm / freelance solicitor / recognised sole practice / licensed conveyancer / CILEX lawyer 等，并写 `Lawyer only provides legal services`。 |
| LH-R04 | Lawhive Legal Ltd（14651095，SRA 8003766）是关联律所，但不能推定承办全部案件 | 通过 | Terms of Service 将其写为 network 中的 affiliated firm，并同时使用 broader network / Lawyers；Client Solicitor Terms 的 Lawyer 类型明显更广。[独立投诉页](https://lawhive.co.uk/legal/lawhive-legal-feedback-complaints) 只证明 Lawhive Legal Ltd 自身投诉路径，稿件没有外推到全部提供者。 |
| LH-R05 | conflict 与 identity/KYC 是接受客户/指示前的 gate，失败可拒绝、暂停或终止 | 通过 | Client Solicitor Terms 15.1 写 conflict check 在 accepting instructions 前；16.2 写 prospective client 在接受为新客户前通过 Service 核验身份并持续监控；16.5–16.6 支持失败/怀疑时终止或暂停。 |
| LH-R06 | engagement、付款、书面指示存在前置约束，但不是公开证明的统一线性漏斗 | 通过 | 条款只证明 partial order：direct engagement + Lawyer terms/client-care；付款 `before Lawyer commences work`；书面 instructions 可授权 14 天冷静期内开工。稿件已把 quote、assignment、client-care、payment、instructions 的具体排序列为 unknown。 |
| LH-R07 | 固定费不是全站唯一收费模型 | 通过 | [About](https://lawhive.co.uk/about-us) 明示 `fixed fee or billed by the hour`；[Commercial](https://lawhive.co.uk/commercial)、[Small Business](https://lawhive.co.uk/small-business) 等服务页宣传 fixed-fee quote。记录为 `case_and_service_specific` 正确；服务页的“即时/低价/节省”仍是 vendor claim。 |
| LH-R08 | Lawyer 向 Lawhive 支付 referral/platform fee，但费率与结算未知 | 通过 | Client Solicitor Terms 11.2 明写书面协议、platform fee、referral of work 与 technology platform；Terms of Service 15 节也写正式 referral agreement。公开来源没有费率、fee share 或 settlement timing，稿件保持 unknown。 |
| LH-R09 | 客户预付才开工；fixed legal fee 不必然包含全部 disbursement | 通过 | Client Solicitor Terms 的 Payments & Invoices 写 `strictly payable on account before Lawyer commences work`；[Litigation](https://lawhive.co.uk/litigation) 将 court、expert、Counsel/hearing/travel 等列为额外可能成本。 |
| LH-R10 | AI associate 的公开用途包括法律问答、drafting、沟通；Labs 展示 briefing/demand-letter 示例 | 通过 | [Work with us](https://lawhive.co.uk/work-with-us) 直接支持律师侧 AI 用途；[Lawhive Labs](https://labs.lawhive.co.uk/) 展示 briefing、demand letter、next-step draft，并同时写“works alongside regulated lawyers”。这些都是 vendor/product narrative，不是 production matter 审计。 |
| LH-R11 | AI 产物应视为 candidate；公开材料未证明强制 human-review product gate | 通过 | 直接证据只证明 Lawyer 承担法律服务/建议与专业义务，以及 AI 工具/演示的存在。稿件把 “Lawyer review/adoption before external use” 标为 inferred，把完整外发状态机标为 proposed，并把 mandatory gate 列 unknown，未混写为 observed。 |
| LH-R12 | 2023 官方研究文章证明当时的推理/empathy 局限和 co-pilot 定位 | 部分通过 | `LH-08` 已正确标为 `historical_vendor_research`，且稿件明确不能代表 2026 当前实现；但本 reviewer 本轮打开该官方 URL 时正文未返回，无法对原文逐句复核。该历史 claim 不应单独承担当前人审结论。 |

### Source IDs 与 Observed / inferred / proposed

- JSON 共 13 个 source definition；递归检查到 42 个 `source_ids` 引用，缺失 0、重复 source definition 0。
- `LH-01` / `LH-02` 用于实体、直接 engagement、conflict/KYC、prepayment、platform fee 等合同事实，证据层级合理。
- 首页、服务页、律师招募页与 Labs 分别标为 `vendor_claim` / `vendor_demo_claim`；低价、速度、质量、客户数量和 AI 效果没有升级为独立验证。
- 业务复合模式、AI candidate work product 属 inferred；gate 状态机、三类外发批准事件属 proposed；分层正确。
- `LH-04` 的动态 intake 后续字段、校验与提交行为仍未知；不能因为看到首步就推断完整 onboarding。

### 合并计数与机器入口

- 主入口与 `product_index.json` 一致：完整深描 12、Harvey 聚焦 1、Lawhive 服务模式对照 1、中国局部深描 3、广索引 24。
- 两处均登记 151 个去重 URL、1,216 个请求槽位、1,171 个返回/检查槽位；Lawhive 位于 `service_model_comparisons`，没有被误计入 full/focused deep dive。
- Lawhive Markdown/JSON 路径和主入口相对链接存在；本轮全树相对 Markdown 链接 13 个，缺失 0；全树 12 个 JSON 可解析。

### 仍需修正的封包项

1. **Lawhive 新视觉补证尚未形成一致机器账本。** Markdown 称 worker 已捕获 `LH-SS-01/02`，并写出 intake 首步字段；但 JSON 的 `screenshot_backlog` 仍把两项标为 `pending_browser_capture`，`engagement_state_model` 仍只记录 loading/entity disclaimer，且本 executor 中没有 `05-evidence/visual/supplement/` 文件或 supplement manifest。应统一为 `captured_by_worker_not_materialized`，补采集日期、URL、状态、限制与机器映射；或在完成交接前把新增视觉细节降为未核实文字观察。它不能计入现有 33 图 ZIP。
2. **`source_ledger_full.csv` 未随 Lawhive 更新。** `source_ledger.json` 已有 151 条并含 LH-01–13；`source_ledger_full.csv` 仍只有 138 条数据且无 Lawhive。应重新导出 CSV，或明确标为 pre-Lawhive snapshot；否则“JSON/CSV 都是完整全局视图”的说明不成立。
3. **历史 AI 文章不可作为当前控制证据。** `LH-08` 当前正文无法由本 reviewer 重新读取；继续保留 historical/vendor 标签和 2023 日期，不得用它证明 2026 mandatory review、准确率或当前 UI。

### 验收判断

- **Lawhive 核心文本/JSON：通过，可供 Agent 建设使用。** 实体、责任、收费与 AI 边界可信。
- **合并主入口与产品索引：通过。** 数量与分类同步。
- **完整封包：部分通过。** 修正 Lawhive 视觉状态/manifest 与 `source_ledger_full.csv` 后，才能称新增工件的机器交接完全一致；未做任何 Lawhive 截图像素审计。

---

## 最终同步复核（2026-10-28）

本节复核父任务完成同步后的最终树，**取代前述封包门中关于 33 图、旧 SHA、Lawhive supplement 未登记和 `source_ledger_full.csv` 未更新的状态描述**。结论：**同步门通过，未发现新的机器封包阻碍。**

### 机器检查结果

- 12 个 JSON 文件全部通过解析。
- `visual_observation_ledger.json` 与 `visual_handoff_manifest.json` 各有 42 个唯一 evidence ID；ID 集、顺序完全一致，差集为 0。交付 ID 为 01–33、37–43、46–47；34–36、44–45 已明确记录为采集排除项，不冒充缺失证据。
- 两个视觉机器文件均指向 Library 文件 `libfile_a88ad92f6b5c81918600d90b21bc2ac0` version 1，上游报告 SHA-256 均为 `6d343bf83a676f0ad03501085b7ecdbeb9a196f3153d29d5bf40491ef3d74284`，`local_byte_verification = false` 保持一致。
- `source_ledger.json` 为 153 条；`source_ledger_full.csv` 为 153 条数据（另 1 行表头）；两者 URL 集完全一致、差集为 0。Lawhive LH-01–13 以及 Harvey/Legora 补充视觉 URL 已进入全局账本。
- `product_index.json` 的 38 个本地 `.md/.json/.csv` 路径全部存在；全树 13 个相对 Markdown 链接缺失 0。
- 主入口与索引一致：完整深描 12、Harvey 聚焦 1、Lawhive 服务模式对照 1、中国局部深描 3、广索引 24；结构化 URL 153；Exa 请求槽位 1,216、返回/检查槽位 1,171；视觉观察 42。

### 语义边界复核

- **Lawhive partial order：通过。** JSON 使用 `illustrative_gates_not_universal_linear_funnel`，明确三条 partial-order constraint 和三组未知排序；`enquiry_started` 指向视觉证据 46，且注明未输入、未点击 Continue、匿名 journey 不构成账号或咨询。`LH-SS-01/02` 已改为 `captured_by_worker_not_materialized`，分别关联 43/47 与 46。
- **Harvey marketing image：通过。** 40–42 被标为 `official_marketing_product_illustration`；只支持 Agent 配置、候选动作/来源邻接与组合层指标的公开设计叙事，不证明判断正确、权限、性能、真实闭环或 KPI。
- **Legora marketing image：通过。** 37–39 被标为官方合成营销产品图；只支持 Word 内建议、Playbook 状态和填充输入模式的公开设计叙事，不证明真实批量效果、格式/容量、准确率或插件运行。
- 主入口已把第四类视觉证据单列为 `official_marketing_product_illustration`，并明确它们不是完整真实窗口或登录后实测。

### 最终阻碍

仅保留一个证据限制，不是文本/机器封包阻碍：**本 reviewer 所在 executor 仍未材料化 Library ZIP version 1，因此没有逐像素查看 42 个文件，也没有本地重算 SHA-256。** 最终包可以交付，但只能称 worker 已核验、Library 已保存、机器账本已同步；不得称本 reviewer 完成像素或字节级验收。

### 最终验收

- 文本、JSON、CSV、主入口、产品索引与视觉机器映射：**通过，可发货**。
- Library 视觉附件：**可按现有 file id/version/SHA 交付；本 reviewer 的像素/本地哈希复核未执行**。
- 登录产品审计：**未执行，`verified_product_interaction_count = 0` 仍正确**。
