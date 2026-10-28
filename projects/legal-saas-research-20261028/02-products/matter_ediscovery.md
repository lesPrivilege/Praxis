# Matter / Case 管理与 eDiscovery 深描

采集日期：2026-10-28（UTC）  
范围：Clio Manage、Litify、Relativity aiR / RelativityOne、Everlaw  
检索：Exa 4 条产品工作流，共检查 90 个搜索结果槽位；筛选后深读并保留 34 条来源记录（40 个唯一 URL）。  
证据边界：当前无云端交互式浏览器。本文件所称“观察”均是公开帮助中心、开发者文档或厂商页面的间接观察，不是登录后实测；没有公开页面支持的状态标为 `unknown`。

## 先给结论

四个产品不是同一套“法律工作台”的不同皮肤。Clio 与 Litify把 **matter** 作为业务主记录；Relativity 与 Everlaw 把 **workspace/project 中的文档集合、搜索/队列与 production** 作为工作主干。对 Agent 产品建设最有价值的差异有四个：

1. **对象锚点不同**：Clio 的时间、账单、任务、共享都回到 matter；Litify 还把 intake 与可配置 Matter Plan 连接到 matter；Relativity 的 reviewer 从 queue/batch 进入 document；Everlaw 从 homepage object 或 search results table 进入 document。
2. **人审不是单一按钮**：Clio 客户完成任务后可撤销/重开；Relativity reviewer 保存的是 coding decision，batch 另有 complete/pending；Everlaw 批量修改先显示影响范围，再异步执行并允许符合条件的批次撤销。它们都不同于“批准规则”。
3. **失败对象决定恢复动作**：Relativity 区分 file exception 与阻塞整个 job 的 job exception；Everlaw 把 native upload 拆成 Examine、PDF conversion、Text conversion、Artifact conversion 四阶段并给出 `Complete with errors`；这比只显示“处理失败”更利于 Agent 恢复。
4. **商业单位跟价值对象一致**：Clio 主要按用户/套餐；Litify 的公开旧资料写年度、每个需要访问的团队成员；Relativity 按承诺数据量且不另收用户费；Everlaw按数据量/用量，用户与上传不限，批量 AI 另按 credits。价格数字缺失不等于免费。

---

## 1. Clio Manage

### 证据等级与定位

- 证据等级：**A-**。公开帮助中心对导航、matter dashboard、task、client portal 的对象和状态描述具体，页面更新至 2026-10；商业与安全来自官方页。未登录，未验证实际布局、延迟、空态、错误文案和所有套餐门控。
- 目标用户：solo 到中大型律师事务所的律师、助理、财务、管理员；portal 侧为客户。
- 购买者：律所 owner/管理者、运营与 IT；大所另有 Enterprise 路线。
- 核心任务：管理 matter、团队任务、时间与费用、账单/收款、文档和客户协作。

### 全局导航与工作面

公开导航文档显示，顶栏提供全局搜索、最近查看的 contacts/matters、billing timer、新建入口与通知；侧栏按模块进入 Personal/Firm Dashboard、Calendar、Tasks、Matters、Contacts、Activities、Billing、Documents 等。每个模块通常有子标签与可筛选表格。[导航说明](https://help.clio.com/hc/en-us/articles/9290390462875-Navigate-Clio-Manage)

`Matter` 是中心记录：开发者文档明确说 activities、bills、documents、calendar entries、tasks 多数与 matter 关联。[Matter API 指南](https://docs.developers.clio.com/guides/clio-manage/)

### 关键页面/对象

| 页面/对象 | 公开证据支持的内容 | 未核实 |
|---|---|---|
| Matters list | 按 open/pending/closed 状态查看；关键词搜索；列配置与过滤；新建 matter | 空态、批量关闭、权限拒绝文案 |
| Matter dashboard | financials、WIP、outstanding balance、trust funds、budget、time/expenses、基本信息、custom fields、timeline、contacts；可 quick bill、请求 trust、加 time/expense | 各卡片排序、移动端差异、加载失败 |
| Tasks | outstanding/completed、date range/filter；可从全局 Tasks 或 matter subtab 创建；支持 private task、记录 time、complete | 批量任务冲突、审批链 |
| Client portal | 一案一条共享 conversation；Messages、Tasks、Documents、Events、Bills；case stage 可按律所配置展示 | client portal 的品牌定制、账户恢复、细粒度角色 |
| Shared resources | 文档、文件夹、invoice、trust request、event、task 的共享记录，含 who/when；可 unshare | unshare 后的缓存/下载副本处置 |

来源：[Matter dashboard](https://help.clio.com/hc/en-us/articles/16681289917595-Matter-s-Dashboard)、[任务](https://help.clio.com/hc/en-us/articles/9204917906971-Manage-Tasks-in-Clio-Manage)、[客户 portal](https://help.clio.com/hc/en-us/articles/57018750464283-Work-With-Your-Law-Firm-in-Clio-for-Clients)、[共享资源](https://help.clio.com/hc/en-us/articles/57017985344923-Share-Documents-Invoices-and-Events-With-Clients)。

### 流程 A：matter → task → 客户完成 → 律所继续处理

| 状态 | 触发/动作 | 结果与可逆性 | 证据状态 |
|---|---|---|---|
| matter 已存在 | 律所从 Tasks 或 matter 的 Tasks subtab 新建，至少填写 name 与 assignee | task 与 matter 关联；出现在 matter timeline、due date 的 Calendar 与 Firm Feed（private task 例外） | `observed_public_page` |
| assigned | 指派给律所成员或 portal participant；可选通知内部 assignee，客户自动获 email/push | assignee 获得待办；private task 只对 creator、assignee、admin 可见 | `observed_public_page` |
| outstanding | 客户在 Tasks 打开详情与附件，点 `Mark as complete` | 立即进入 Completed；律所指派人获邮件；提示提供 `Undo` | `observed_public_page` |
| completed（可能正由律所复核，但不是独立 machine state） | 客户可在 Completed 点 `Mark as not complete` 或再次选 checkbox | task 回到 Outstanding | `observed_public_page` |

这条流中，“客户完成任务”是**业务对象状态变更**，不是律所对法律结论的批准；公开文档未说明额外 accept/reject 审核状态。

### 流程 B：matter document → portal share → revoke

1. 律所从全局 Documents 或 matter 的 Documents subtab 选择一个或多个文件/文件夹。
2. 选择 Share → Client portal，增删 participants，可附 message；若尚无 portal，分享动作会创建 portal 并邀请 matter contacts。
3. shared folder 后续新增文件会自动对客户可见；每次 share 触发通知。
4. Shared resources 记录资源、分享者和时间；律所可 `Unshare/Stop sharing`，客户失去 portal 访问。

公开文档同时写明：portal 分享文件必须位于 matter folder；这是一项适合 Agent 在执行前做的可验证前置条件。[共享资源](https://help.clio.com/hc/en-us/articles/57017985344923-Share-Documents-Invoices-and-Events-With-Clients)

### 权限、审计、失败

- 标准角色与 custom roles 控制用户能看到和执行什么；多角色用户继承**最宽松**角色权限。task 没有独立权限开关，但可设为 private。[角色与权限](https://help.clio.com/hc/en-us/articles/9200279456667-Roles-and-Permissions-in-Clio-Manage)
- portal 分享对象可撤销；公开页面没有证明客户已下载文件也能远程收回，因此处置边界为 `unknown`。
- 官方安全页声称年度 SOC 2 Type II / SOC 1 Type II、TLS 1.2+、AES-256、区域内 AI 处理、既有权限约束 AI；这些均为 `vendor_claim`，没有在本轮独立审计。[安全页](https://www.clio.com/security/)

### 商业与服务

- 2026-10 官方定价页公开起价 `US$49/user`，分 Starter、Core、Signature、Elite；Core 起包含 AI，Signature 增加 unlimited custom roles、matter stages/kanban 等，Elite 再含 Clio Grow。具体地区、月/年付、税和所有套餐金额需以购买页面为准。[定价页](https://www.clio.com/pricing/)
- 定价页写有 7-day free trial、24/5 live support、training 和 data migration；应视为厂商当前承诺，不等于服务质量独立验证。
- API/集成：开发者文档公开 Matters、Payments、webhooks、custom actions 等；webhook 在 record 变化时发送 signed HTTP request。公开文档没有说明每个套餐 API 限额。

### Agent 建设可取用

- **Observed**：以 matter 为根对象，派生 task、bill、document、communication、time/expense；同一 task 在 timeline、calendar、dashboard 是投影，不应复制成多个身份。
- **Inferred**：Agent 执行动作前要检查对象归属与权限（例如文档是否位于 matter folder、用户是否可见 billing）；否则“生成分享链接”可能在最后一步失败。
- **Proposed**：把 `task_completion` 与 `legal_review_approval` 分成不同事件；客户完成任务只进入 `completed_by_client`，是否需要律师审核由独立规则决定。

### 待补拍（公开 URL）

1. `https://help.clio.com/hc/en-us/articles/9290390462875-Navigate-Clio-Manage`：顶栏+侧栏总览。
2. `https://help.clio.com/hc/en-us/articles/16681289917595-Matter-s-Dashboard`：matter dashboard 与财务卡片。
3. `https://help.clio.com/hc/en-us/articles/57018750464283-Work-With-Your-Law-Firm-in-Clio-for-Clients`：case stage、Outstanding/Completed、Undo。
4. `https://help.clio.com/hc/en-us/articles/57017985344923-Share-Documents-Invoices-and-Events-With-Clients`：Share modal、Shared resources、Unshare。

---

## 2. Litify

### 证据等级与定位

- 证据等级：**B-**。公开页能支持对象关系与服务模式，但详细帮助中心/字段级文档多在客户登录后；多数交互描述来自厂商产品页，属于 `vendor_claim`，不能当成实测。
- 目标用户：中大型律所、企业法务、公共法律服务机构；依赖 Salesforce 生态与可配置流程的组织。
- 购买者：律所管理层、legal ops、IT/Salesforce owners。
- 核心任务：intake、matter/case management、document、time/billing、legal spend、reporting；以 no-code workflow 与 Matter Plan 标准化流程。

### 对象与工作面

官方平台页列出的主对象包括 Intake / Legal Service Request、Matter、Matter Plan、Task、Document、Time Entry、Bill/Invoice、Report/Dashboard。Matter record 被官方博客描述为中心 hub，连接 events、documents、call logs、emails、time entries；Case Activity Timeline 按时间呈现文件、邮件、日历等。[平台页](https://www.litify.com/platform)、[企业法务页](https://www.litify.com/enterprise-legal-management-software)

公开页面没有给出完整全局导航、列表列项、详情页 tab、空态、失败态或手机布局，全部标 `unknown`。

### 流程 A：dynamic intake → matter → Matter Plan

| 状态 | 公开证据支持的动作 | 结果 | 边界 |
|---|---|---|---|
| request/intake started | Dynamic Intake Questionnaire 根据回答跳到下一相关问题；企业场景可提交并跟踪 Legal Service Request | 形成 intake/LSR 记录 | 分支规则编辑器、撤销与失败 `unknown` |
| triaged | 厂商声称可用自动 triage / Intake Qualifier Agent 按条件筛选 | 请求进入合适 specialist 或被判定不合格 | AI 决策依据、人工 override `unknown` |
| matter opened | matter 汇集事件、文档、邮件、通话、time entries | 成为团队协作 hub | intake→matter 的确切转换状态 `unknown` |
| plan applied | Matter Plan 把按 practice area/case type 配置的 task lists 套到 matter | 任务、负责人和进度被标准化 | 任务依赖、例外批准、版本迁移 `unknown` |

这里不能把“intake criteria 命中”写成法律结论；公开页没有证明系统会自动拒绝案件或拥有最终接受权限。

### 流程 B：matter data → document generation / live edit → e-sign / filing

官方 Docrio 文章支持以下链条：使用 Litify 已存数据 auto-fill document；template 支持 conditional logic 与 freeform text；用户 inline/live edit，可生成 shareable link 或送 e-sign；结果自动保存到正确 case file；文档还能关联 task set。Live Edit 被描述为把 new version、check-out、edit、check-in 合为连续操作，并支持协同编辑。[Docrio 文章](https://www.litify.com/blog/docriov3)

版本冲突、接受/拒绝修订、锁定、回滚和 e-sign 失败的产品状态在公开页未核实。

### 权限、审计、失败

- 平台建立在 Salesforce，公开页声称有 MFA、specific user-level permissions；Docrio 文件在 AWS。Litify support 如需排障，客户必须主动授予 login access。[安全文章](https://www.litify.com/blog/data-security-best-practices-at-litify)
- 厂商 2024 新闻稿声称其生成式 AI 使用 single-tenant architecture，客户数据不进入模型持久化；这是 `vendor_claim`，且不能外推为整个 Litify 数据平面的租户结构。[AI 安全声明](https://www.litify.com/news/litify-announces-responsible-ai-development-approach-with-aws-anthropic)
- 公开页面没有足够证据支持 matter-level ethical wall、审计日志 UI、失败重试或批量操作撤销。

### 商业与服务

- 当前官网以 `Book a demo` 为主要采购入口，未公开数字价格。2022 年 buyer guide 写明按年订阅、每个需要访问 Litify 的团队成员计价，并称 Salesforce 能力包含在单价；这是**旧资料**，只能做历史线索，2026 当前收费单位仍需销售报价核实。[2022 buyer guide PDF](https://web.litify.com/rs/722-RPB-496/images/PracticeManagement-BuyersGuide2022-1.pdf)
- 实施与服务有明确分层：Implement（内部/认证伙伴）、Train（在线与现场 workshop、change management）、Accelerate（Salesforce 专家继续配置）、Succeed（dedicated customer success、定期 check-in）。[Services & Customer Success](https://www.litify.com/services-customer-success)
- API：官方协议明确 Salesforce REST API 与 Docrio API，需 approved integrator key token；API 是订阅/合同能力，不应假设公开自助开通。[API agreement](https://www.litify.com/legal/litify-api-integration-agreement)

### Agent 建设可取用

- **Observed**：Matter Plan 是“模板化任务列表+业务规则”的可配置对象，和某一 matter 的执行实例应分开。
- **Inferred**：Salesforce 底座使可配置性强，但也意味着 Agent 要面对客户自定义字段、对象和权限；不能把一套默认 schema 当成所有租户事实。
- **Proposed**：intake agent 输出 `qualification_recommendation` 与依据，不直接写 `matter_rejected`；最终接受案件需要组织规则与授权角色的独立事件。

### 待补拍（公开 URL）

1. `https://www.litify.com/platform`：Matter Plans、Case Activity Timeline、Document Assistant、Time Entry Calendar。
2. `https://www.litify.com/enterprise-legal-management-software`：LSR portal、matter、outside counsel collaboration。
3. `https://www.litify.com/blog/docriov3`：文档版本/Live Edit 图示（如公开页仍显示）。
4. 详细产品 UI 位于登录墙内；在没有授权账号时不补拍、不推断。

---

## 3. Relativity aiR / RelativityOne

### 证据等级与定位

- 证据等级：**A**。官方帮助中心公开到对象、按钮、状态与异常恢复；商业、安全和 API 有官方页。未登录，因此实际视觉密度、性能、权限拒绝和跨 workspace 行为未实测。
- 目标用户：eDiscovery service provider、law firm review team、corporate legal/investigation、政府。
- 购买者：litigation support/eDiscovery leaders、法务运营、信息安全与采购。
- 核心任务：collect、process、search/analytics、review/code/redact、QC、produce；workspace 是案件/项目容器。

### 全局对象与工作面

时效说明：2026-10-28 的独立云端观察发现，原 `RelativityOne` review template URL 自动转向 `https://help.relativity.com/RelativityaiR/Content/Getting_Started/Review_Template/RelativityOne_Review_workspace_template.htm`，页面标示 2026-09-17 更新；其中嵌入的空工作区图仍显示 RelativityOne 品牌。本文因此并列使用 `Relativity aiR / RelativityOne`，不据此宣称全产品当前界面已统一换版。

主要对象链：`matter → workspace → data source / custodian / collection job → processing set → saved search → review queue / batch → document + coding layout → production set/export`。公开 Review Interface 的构成包括 breadcrumbs、document actions、document navigation、viewer settings、document list、viewer type tabs、coding layouts、viewer、related items card。[Review Interface](https://help.relativity.com/RelativityOne/Content/System_Guides/User_quick_reference/Review_Interface_QRG/Review_interface.htm)

### 流程 A：collection → processing → 异常恢复

1. 先建立 matter、workspace data source 与 custodians；data source 保存 communication channel 的连接/收集配置。保存时系统验证参数与 connectivity，失败则显示连接失败，修正后再保存。[Data sources](https://help.relativity.com/RelativityOne/Content/Collect/Data_sources/Data_sources.htm)
2. 在 Collect wizard 依次填写 collection details、custodians、data sources 等；跨步骤自动保存。缺少/错误必填项时不能进入下一步。
3. 在 Collection Details console 执行 `Run Collection`；结束后下载 item results report 与 summary report。[Collection](https://help.relativity.com/RelativityOne/Content/Collect/Collection/Collection.htm)
4. Processing 区分 file exception 与 job exception：file exception 只影响单文件，job 继续；job exception 阻塞整个作业。Discover/Publish 的 warning 可继续但可能缺 metadata，error 会阻塞。
5. 可按状态执行 Retry、Download/Replace、补 password 等。Inventory exception 不可直接 retry，需要从同一 processing set 重跑 Inventory。[异常恢复](https://help.relativity.com/RelativityOne/Content/Relativity/Processing/Processing_error_resolution.htm)

这是“失败类型→恢复动作”的强机制：Agent 不能统一重试；必须先判断作用域、阶段、是否可重试，以及是否需要替换原文件或支持介入。

### 流程 B：saved search → review queue → coding → batch check-in

| 状态 | 操作 | 结果/下一状态 | 冲突与权限 |
|---|---|---|---|
| saved search prepared | admin 从 saved search 建 queue，决定 linear/batched 与排序；可用 AI prioritization | queue ready/started | AI prioritized queue 至少需正负样本才能早期训练；具体阈值以当前文档为准 |
| assigned/available batch | reviewer 在 Review Queues 展开 queue；未分配 batch 可 `Check Out` | batch checked out | 无 Start 可能是 queue paused 或 admin 未 start |
| reviewing | 点 `Start` 进入 viewer；按组织 protocol 在 coding layout 填字段 | current document has coding decision | 同文档在两个 queue 可被并发打开；后保存者可能看到“edited elsewhere”，需 reload |
| saved | `Save and Next` | 保存当前 coding，打开下一 document | 保存的是 coding decision，不是批准整条规则 |
| batch end | `Check in as complete` 或 `Check in as pending` | complete 消失；pending 排到列表后部，可继续下一 batch | 即使未看完所有文档也可标 complete/pending；管理流程要额外校验完整性 |

来源：[Review queue 操作](https://help.relativity.com/RelativityOne/Content/Relativity/Review_Center/Reviewing_documents_using_Review_Center.htm)、[Review Center Guide](https://help.relativity.com/PDFDownloads/R1_PDF/RelativityOne%20-%20Review%20Center%20Guide.pdf)。

### 流程 C：review population → pre-production → production

官方 review template 描述：批量分发 review → reviewer coding → 二级 QC/privilege handling → 定义 draft production population → conflict checks → 修正缺失 coding → 移除 privileged documents / family → 以 production approval 标签指定 image/native/placeholder → 运行 production set 加 Bates/confidentiality stamp → 导出 TIFF/text/metadata/load files → QC、加密并交付。[Reviewing and producing](https://help.relativity.com/RelativityOne/Content/Getting_Started/Review_Template/Reviewing_and_producing_documents.htm)

`production approval` 是对文档输出方式的批准；它不同于 reviewer 对“responsive/privileged”等内容 coding，也不同于 admin 对 queue configuration 的批准。

### 权限与审计

- Processing 权限通过 groups 应用到 workspace、object type、tab 和 individual item，并能到 granular action；这是多层 permission graph，不只是角色名。[Processing Guide](https://help.relativity.com/PDFDownloads/R1_PDF/RelativityOne%20-%20Processing%20User%20Guide.pdf)
- 官方安全页列出 ISO 27001/27018、SOC 2 Type II、SOC 3、HIPAA、IRAP、FedRAMP 等，并说明 Azure 托管；均按 `vendor_claim` 记录。[合规页](https://www.relativity.com/calder7-security/compliance-privacy/)
- API 覆盖 Audit、Batches、Batch Sets、Collect、Automated Workflows、Billing Insights 等；接口本身不证明调用者有相应 workspace permission。[API 列表](https://platform.relativity.com/RelativityOne/Content/Integrate/APIS-Services.htm)

### 商业与服务

- 当前官方页以 committed data volume 为定价核心，可 pay-as-you-go 或 1/3 年承诺；核心 AI 能力随承诺数据量包含，不另收 AI license / per-user fee；Legal Hold、Translate、Data Breach Response、FOIA 等列为另购 add-on。没有公开具体金额，需报价。[定价页](https://www.relativity.com/platform/pricing/)
- Standard / Enhanced / Premier Success 体现服务分层：自助内容+24/7/365 support，到 dedicated success manager、roadmap engagement，再到 ROI 设定与 proactive technical guidance。[Customer Success](https://www.relativity.com/support/customer-success/)
- 帮助文档显示 review/repository/cold storage 按 subscription volume、staging 按月峰值等不同 billing considerations；Agent 进行数据生命周期动作时应暴露成本影响，而非只写“移动到冷存储”。[Data management](https://help.relativity.com/RelativityOne/Content/Relativity/Data_Management.htm)

### Agent 建设可取用

- **Observed**：queue 是 saved search 的执行投影；batch 是工作分配对象；coding decision 落在 document 字段；production set 是独立输出对象。
- **Inferred**：同一文档可能同时处于多个 queue，Agent 必须对版本/并发编辑做乐观锁或显式冲突提示。
- **Proposed**：把 error recovery 建模为 `classify → show blast radius → show allowed remedies → human confirm → retry/replace/escalate`，并保留原 job identity 和重试记录。

### 视觉证据状态（公开 URL）

已核验视觉项：当前 RelativityaiR 帮助页、其官方嵌入的空 Review Template 工作区图，以及仅包含 Review Queues / Review Center 导航图标的两张低信息量素材。导航图标不可用于推断完整队列或 dashboard；图像在独立 Library ZIP 中，当前研究执行环境未能材料化复核字节。以下流程页面仍只有文本证据：

1. `https://help.relativity.com/RelativityOne/Content/Relativity/Review_Center/Reviewing_documents_using_Review_Center.htm`：Review Queues、batch 展开、Start、complete/pending modal。
2. `https://help.relativity.com/RelativityOne/Content/System_Guides/User_quick_reference/Review_Interface_QRG/Review_interface.htm`：viewer + coding layout + related items。
3. `https://help.relativity.com/RelativityOne/Content/Relativity/Processing/Processing_error_resolution.htm`：file/job exception、mass actions、retry。
4. `https://help.relativity.com/RelativityOne/Content/Getting_Started/Review_Template/Reviewing_and_producing_documents.htm`：production approval 与导出步骤。

---

## 4. Everlaw

### 证据等级与定位

- 证据等级：**A**。公开知识库详细支持 homepage、results table、review window、batch action、upload error 与 pre-production QC；商业/专业服务/安全也有官方页。
- 目标用户：律所、企业、政府、service provider 的 litigation/investigation/eDiscovery 团队。
- 购买者：eDiscovery/litigation support、法务、政府采购与信息安全。
- 核心任务：upload/process、search、review/code/redact、batch、Storybuilder、production 与协作。

### 全局导航与工作面

Project homepage 是对象入口，sidebar 管 views/filters/folders，顶部 tabs 按对象分：All、Assignments、Searches、Binders、Storybuilder、Document Sets、Batches & Exports。首页按 user+project 个性化，权限与最近活动会导致同项目两名用户看到不同内容。[Homepage](https://support.everlaw.com/hc/en-us/articles/205124389-General-Homepage-Overview)

Search Results Table 是 review 入口：可从 Search、My Assignment、Binder、Native/Processed/Production document set 进入。点一行在新 tab 打开 review window；工具栏可 group、view、copy、export、visualize、share、批量 coding、AI Assistant、assignment、delete、reprocess。[Results table](https://support.everlaw.com/hc/en-us/articles/204778899-Search-Results-Table)

Full-screen review window 左/右并置 document 与工具 panel；panel 可包含 codes、ratings、annotations、redactions、translations、history、metadata、predictive coding 等，并能保存/分享 layout 或设为 assignment/project 默认。[Review window](https://support.everlaw.com/hc/en-us/articles/115003480583-Full-Screen-Review-Window-Customization)

### 流程 A：search/result set → review → batch modify → monitor/undo

1. 用户运行或打开 search，进入 results table；document access permission 会缩小可见集合。
2. 默认情况下 results table **全选当前结果**。用户可先 deselect all，再逐项/区间选；这是高风险默认，批量 Agent 必须强制展示 scope。
3. `Batch > Modify` 打开 batch coding panel；可应用 rating、codes、freeform code、preset、note、binder、Storybuilder、user-editable field；只有 project admin 能 resolve coding conflicts。
4. panel 显示变更摘要与受影响文档数；点 `Apply` 启动异步 task。大数据集不会立即完成。
5. 在 homepage 的 Batches & Exports 跟踪进度；知识库说明可 undo eligible batch actions，但不是所有动作都保证可撤销。[Batch Modify](https://support.everlaw.com/hc/en-us/articles/204779929-Batch-Modify)

这里“Apply batch coding”是对文档集合施加候选/既定 coding，不等于批准一套 coding rule；auto-code 规则本身应由独立配置与权限管理。

### 流程 B：native upload → staged processing → complete with errors → 定位修复

Native files 经 Examine、PDF conversion、Text conversion、Artifact conversion 四阶段。任一阶段出错时 upload card 显示 `Complete with errors` 与各阶段计数；Examine 失败会使后续阶段也被视为失败。用户从 `View Report` 进入 Upload details，再定位 container error、missing password、unsupported/corrupt/malware 等类别并处理。[Upload errors](https://support.everlaw.com/hc/en-us/articles/360002614631-Identifying-and-Troubleshooting-Native-Upload-Errors)

值得迁移的不是四个固定阶段名，而是：阶段有稳定身份；总任务可以“完成但有错误”；错误计数回到具体文档；后续阶段是否实际执行必须可区分。

### 流程 C：production protocol → standard/custom QC → resolve → produce

创建 production protocol 与 criteria 后，系统自动运行 pre-production QC。标准 checks 由 Everlaw 提供，可个别关闭；custom checks 在 project 级创建，可复用到多个 protocol，也可随 project template 迁移。custom check 定义“希望所有输出文档都满足的条件”，不满足者触发 warning。检查包括 privileged、未 coding、broken family、missing password、invalid Bates、malware native 等。[Pre-production QC](https://support.everlaw.com/hc/en-us/articles/38847085136795-Pre-Production-QC-Checks)

此处 warning 不是系统自动拒绝；用户可修复、调整 protocol/check，或在授权下继续。公开页没有支持“Agent 可自动豁免 warning”。

### 权限、审计与安全

- Project Admin 管 document access；结果表、batch menu、review tools 会随 permission 改变。homepage 本身是权限过滤后的投影。
- DPA 写明用户活动、配置变更、删除/更新自动写 audit logs，含 timestamp、IP、action、requested metadata；应用内向客户提供 user activity metrics。[DPA](https://www.everlaw.com/legal/customer-data-processing-addendum/)
- 官方安全页声称 MFA、SSO、granular user management、TLS 1.2+、AES-256、AWS 与 99.9% 以上平均 uptime；均为厂商/审计材料陈述。[Security](https://www.everlaw.com/trust/security/)

### 商业与服务

- 官方定价页：case 或 annual platform subscription，按 data managed 与 usage；core platform 以 per-GB rate，unlimited user licenses / uploads；standard migration、onboarding、training/support、processing、productions 等列为 included。Single-document AI 与 Writing Assistant 包含，batch AI / Deep Dive 某些动作需要 credits；未公开每 GB 数字。[Pricing](https://www.everlaw.com/pricing-b/)
- Professional Services 页把 included services 与收费服务明确拆开：kickoff、标准 migration、initial database、live training、ESI protocol review 等包含；由 Everlaw 代做 STR、复杂 export/load file、custom script 等可能需 SOW 并按小时收费。[Professional Services](https://support.everlaw.com/hc/en-us/articles/4428367197851-Everlaw-Professional-Services)
- 这不是法律专业服务的默示授权；页面主要描述平台/数据操作支持。对证据策略、privilege 或 production 的法律判断仍应由客户的法律责任人承担。

### Agent 建设可取用

- **Observed**：homepage 把“对象”和“异步事件”共同组织，但 Batches & Exports 明确承载长任务状态；review window layout 可由 assignment/project admin 设默认。
- **Inferred**：由于默认全选结果，任何批量 Agent 必须在执行前显示 `selected_count / total_count / filter_snapshot`，并对不可撤销动作再确认。
- **Proposed**：QC check 产出 warning object，字段至少含 check version、违反对象集合、建议修复、豁免人/理由、是否阻塞 production；不要把 warning 直接改写为失败。

### 待补拍（公开 URL）

1. `https://support.everlaw.com/hc/en-us/articles/205124389-General-Homepage-Overview`：sidebar + object tabs + Batches & Exports。
2. `https://support.everlaw.com/hc/en-us/articles/204778899-Search-Results-Table`：结果表工具栏与默认全选。
3. `https://support.everlaw.com/hc/en-us/articles/115003480583-Full-Screen-Review-Window-Customization`：document + panel 布局。
4. `https://support.everlaw.com/hc/en-us/articles/204779929-Batch-Modify`：变更摘要、影响数、异步进度/undo。
5. `https://support.everlaw.com/hc/en-us/articles/38847085136795-Pre-Production-QC-Checks`：standard/custom QC 与 warnings。

---

## 跨产品原子机制矩阵

| 原子机制 | Clio | Litify | Relativity | Everlaw | Agent 建设条件 |
|---|---|---|---|---|---|
| 主记录锚定 | matter | matter / intake / LSR | workspace + document | project + document | 稳定对象 ID，投影不复制身份 |
| 模板→实例 | task list / workflow | Matter Plan | saved search→queue/batch | project template / assignment | 模板版本与实例偏离要可见 |
| 人工工作分发 | task assignee | Matter Plan task owner | queue/batch checkout | assignment/batch | assignee、claim/check-in、重分配事件 |
| 单对象审阅 | task/document/bill | document/matter | document viewer + coding layout | review window + panel | 原件、字段、决定、决定者、时间 |
| 批量作用域 | bill/share 等局部 | 公开证据不足 | batches/mass actions | results default all + Batch Modify | filter snapshot、影响数、权限、可撤销性 |
| 进度与长任务 | dashboard/timeline | reports/dashboard（厂商声称） | queue/report/job status | Batches & Exports | queued/running/partial/failed/completed |
| 部分成功 | 未公开核实 | 未公开核实 | job 继续但 file exception | Complete with errors | total/succeeded/failed/skipped + retry scope |
| 失败恢复 | task reopen、unshare | 未公开核实 | retry/replace/rerun/escalate 按异常类型 | error report→定位文档→修复/reprocess | 禁止统一重试；保留原 job 和证据 |
| QC 与批准 | task complete ≠ legal approval | intake recommendation ≠ matter acceptance | coding ≠ production approval | coding ≠ QC waiver | 将接受风险、接受文本、批准规则/输出分开 |
| 外部协作 | client portal | LSR portal/outside counsel（厂商页） | workspace access/share | project access/share | 外部主体、有效期、撤销、下载后边界 |
| 成本感知 | user/plan + payment fees | annual/team member（旧资料） | committed data volume + storage tier | per GB + AI credits | 动作前暴露边际成本与报价未知 |

## 三类容易混淆的“接受/批准”

| 对象 | 本域实例 | 不应混为 |
|---|---|---|
| 接受业务风险/法律判断 | 将 privileged family 继续纳入 production、豁免 QC warning | 接受某段候选文字 |
| 接受候选文本/字段决定 | 保存 document coding、确认 redaction/metadata、客户完成 task | 批准以后所有 matter 都采用一条规则 |
| 批准规则/模板/输出 | 发布 Matter Plan、设默认 review layout、批准 production protocol/QC check | 对当前单一文档做事实判断 |

公开材料没有给出所有系统的明确三分法；上表中“本域实例”部分为机制归类，若落地必须绑定组织权限与审计事件。

## 证据缺口

- 无登录交互，因此没有亲测空态、加载、键盘/焦点、移动端、权限拒绝、跨租户隔离和实际导出。
- Litify 公开帮助文档不足，导航、详情 tab、例外处理、版本冲突与审计 UI 多为 `unknown`。
- Clio/Litify 的 current enterprise 报价、最低席位、API 限额与实施费用未公开。
- Relativity/Everlaw 没有公开具体 per-GB 金额；地区、合同量阶与 service provider 转售价需报价。
- 厂商安全与 AI 数据承诺未作独立技术验证；认证存在不等于本轮核验了控制有效性。

## 来源登记（本文件使用）

### Clio（8 条记录 / 9 个 URL）

1. [Navigate Clio Manage](https://help.clio.com/hc/en-us/articles/9290390462875-Navigate-Clio-Manage) — help，updated 2026-09-15。
2. [Matter's Dashboard](https://help.clio.com/hc/en-us/articles/16681289917595-Matter-s-Dashboard) — help，updated 2026-09-23。
3. [Manage Tasks](https://help.clio.com/hc/en-us/articles/9204917906971-Manage-Tasks-in-Clio-Manage) — help，updated 2026-10-15。
4. [Share Documents, Invoices, and Events](https://help.clio.com/hc/en-us/articles/57017985344923-Share-Documents-Invoices-and-Events-With-Clients) — help，updated 2026-10-15。
5. [Work With Your Law Firm in Clio for Clients](https://help.clio.com/hc/en-us/articles/57018750464283-Work-With-Your-Law-Firm-in-Clio-for-Clients) — help，updated 2026-10-14。
6. [Roles and Permissions](https://help.clio.com/hc/en-us/articles/9200279456667-Roles-and-Permissions-in-Clio-Manage) — help，updated 2026-07-30。
7. [Clio pricing](https://www.clio.com/pricing/) — official commercial page，accessed 2026-10-28。
8. [Clio Manage developer guide](https://docs.developers.clio.com/guides/clio-manage/) / [Security](https://www.clio.com/security/) — official developer/security pages，accessed 2026-10-28。

### Litify（8 条记录 / 8 个 URL）

9. [Platform](https://www.litify.com/platform) — official product page，accessed 2026-10-28。
10. [Enterprise Legal Management](https://www.litify.com/enterprise-legal-management-software) — official product page，accessed 2026-10-28。
11. [Docrio v3](https://www.litify.com/blog/docriov3) — official product article，published 2025-04-21。
12. [Services & Customer Success](https://www.litify.com/services-customer-success) — official services page，accessed 2026-10-28。
13. [API Integration Agreement](https://www.litify.com/legal/litify-api-integration-agreement) — official legal/API page，accessed 2026-10-28。
14. [Data and Security Best Practices](https://www.litify.com/blog/data-security-best-practices-at-litify) — official security article，published 2022-06-30。
15. [Responsible AI announcement](https://www.litify.com/news/litify-announces-responsible-ai-development-approach-with-aws-anthropic) — official press release，published 2024-07-09。
16. [Practice Management Buyer’s Guide 2022](https://web.litify.com/rs/722-RPB-496/images/PracticeManagement-BuyersGuide2022-1.pdf) — third-party buyer guide hosted by Litify；old commercial evidence。

### Relativity（10 条记录 / 13 个 URL）

17. [Reviewing documents using Review Center](https://help.relativity.com/RelativityOne/Content/Relativity/Review_Center/Reviewing_documents_using_Review_Center.htm) — official help。
18. [Review Interface quick reference](https://help.relativity.com/RelativityOne/Content/System_Guides/User_quick_reference/Review_Interface_QRG/Review_interface.htm) — official help。
19. [Review Center Guide PDF](https://help.relativity.com/PDFDownloads/R1_PDF/RelativityOne%20-%20Review%20Center%20Guide.pdf) — official guide。
20. [Reviewing and producing documents](https://help.relativity.com/RelativityOne/Content/Getting_Started/Review_Template/Reviewing_and_producing_documents.htm) — official workflow guide。
21. [Data sources](https://help.relativity.com/RelativityOne/Content/Collect/Data_sources/Data_sources.htm) / [Collection](https://help.relativity.com/RelativityOne/Content/Collect/Collection/Collection.htm) — official help。
22. [Processing error resolution](https://help.relativity.com/RelativityOne/Content/Relativity/Processing/Processing_error_resolution.htm) — official help。
23. [Processing User Guide](https://help.relativity.com/PDFDownloads/R1_PDF/RelativityOne%20-%20Processing%20User%20Guide.pdf) — official guide。
24. [Pricing](https://www.relativity.com/platform/pricing/) / [Data management](https://help.relativity.com/RelativityOne/Content/Relativity/Data_Management.htm) — official commercial/help pages。
25. [Customer Success](https://www.relativity.com/support/customer-success/) — official services page。
26. [Compliance & Privacy](https://www.relativity.com/calder7-security/compliance-privacy/) / [Integration APIs](https://platform.relativity.com/RelativityOne/Content/Integrate/APIS-Services.htm) — official security/developer pages。

### Everlaw（8 条记录 / 10 个 URL）

27. [Homepage Overview](https://support.everlaw.com/hc/en-us/articles/205124389-General-Homepage-Overview) — help，updated 2026-08-06。
28. [Search Results Table](https://support.everlaw.com/hc/en-us/articles/204778899-Search-Results-Table) — help，updated 2026-10-16。
29. [Batch Modify](https://support.everlaw.com/hc/en-us/articles/204779929-Batch-Modify) — help，updated 2026-02-26。
30. [Full Screen Review Window](https://support.everlaw.com/hc/en-us/articles/115003480583-Full-Screen-Review-Window-Customization) — help，updated 2026-10-08。
31. [Native Upload Errors](https://support.everlaw.com/hc/en-us/articles/360002614631-Identifying-and-Troubleshooting-Native-Upload-Errors) — help，updated 2026-10-08。
32. [Pre-Production QC](https://support.everlaw.com/hc/en-us/articles/38847085136795-Pre-Production-QC-Checks) — help，updated 2026-05-11。
33. [Pricing](https://www.everlaw.com/pricing-b/) / [Professional Services](https://support.everlaw.com/hc/en-us/articles/4428367197851-Everlaw-Professional-Services) — official commercial/help pages。
34. [Security](https://www.everlaw.com/trust/security/) / [Customer DPA](https://www.everlaw.com/legal/customer-data-processing-addendum/) — official security/legal pages。

## 复查建议

下一次公共页面复查日期：**2027-01-28**，或在任一产品套餐/品牌整合、定价页或帮助中心大改时提前复查。动态帮助文档以访问日为证据边界。
