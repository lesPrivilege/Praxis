# 法律研究、引用核验与 AI-native 律师工作台

采集日期：2026-10-28（UTC）  
范围：CoCounsel Legal / Westlaw、Lexis+ with Protégé（原 Lexis+ AI）、vLex Vincent、Legora  
证据：公开官网、公开帮助中心、官方用户指南、官方训练目录与公开条款。未登录产品，未观看完整录屏，未亲自操作。

## 结论先行

四个产品都把“对话”降为入口，真正承载法律判断的是可定位的业务对象：CoCounsel 的 matter / chat / database / skill，Lexis 的 task / conversation / Vault / editable draft，Vincent 的 workflow / authority list / table，Legora 的 project / workflow / Tabular Review / Editor / Portal。对 Agent 建设最可迁移的不是聊天框，而是三类控制面：

1. **证据控制面**：答案旁边保留 authorities、引用片段或原件链接，并允许用户改变证据集合后再生成，而不是只改最终文本。
2. **工作对象控制面**：同一批输入在研究、抽取、起草和导出之间保持身份；原件、结果、人工修订和交付物不能被压成一段不可追溯的对话。
3. **运行控制面**：`running`、等待补充、等待批准、`failed` 和完成交付物是不同状态。Legora 的公开 MCP 帮助把这些状态写得最清楚；CoCounsel 的 connector 也把 session、upload、run、deliverable 分开。

下文的 `observed_public_page` 表示公开页面或官方文档明确写出；`vendor_claim` 表示厂商对准确性、安全或性能的主张；`inferred` 是由多个页面推断；`unknown` 表示公开证据不足。没有 `verified_interaction`。

## 1. CoCounsel Legal / Westlaw

### 用户、购买者与任务

- **目标用户**：律师、法务、知识与创新团队；官方训练还给出 courts / law schools 场景。`observed_public_page`
- **采购对象**：律师事务所、企业/政府机构，通常由管理员或采购人管理 entitlement；connector 要求有效 Thomson Reuters 账户和 CoCounsel Legal package。`observed_public_page`
- **核心任务**：法律研究、Deep Research、文档审阅/比较/总结、timeline、合同政策合规、起草、Brief Builder、检索 Practical Law 或组织自有数据库。`observed_public_page`

### 工作区与对象

官方 CoCounsel 2.0 训练目录列出 homepage、new chat、Matter Folders、Chat History、Library 中的 Prompts / Skills、Databases、从设备/数据库/DMS 上传文件；这是一套“会话 + matter + 知识库 + 技能”的工作面，而非单一问答页。[训练目录](https://training.thomsonreuters.com/playlist/1_ve1fdgp8) `observed_public_page`

可确认的业务对象：

| 对象 | 公开可确认动作 | 未确认 |
|---|---|---|
| Chat / session | 新建、保留上下文、追问、历史返回 | 版本分支、并发编辑 |
| Matter Folder | 从主页访问和组织会话/材料 | folder 内权限继承、跨 matter 移动 |
| Skill / Prompt | 从 Library 发现并运行；研究、Review、Compare、Summarize 等有独立技能 | 自定义技能版本、审批 |
| Database | 创建/搜索组织文档库；结果引用数据库内具体文档/片段 | 索引失败、删除/重建状态 |
| Uploaded File | 从设备、数据库或外部 DMS 输入；connector 中文件只属于当前 CoCounsel session | web 产品的配额与保留细节 |
| Deliverable | connector 可按具体 deliverable 取回；Brief Builder 终点是可下载 draft | deliverable 的版本/权限 |

### 流程 A：研究 → 来源 → 可用文书

1. 用户从 AI-Assisted Research / Deep Research 等入口给出法律问题；部分界面让用户指定 jurisdiction。`observed_public_page`
2. Deep Research 调查大量法律内容并生成完整 cited report；AI-Assisted Research 返回 Westlaw authority 的 linked references。`vendor_claim`（调查质量）+ `observed_public_page`（输出形态）
3. 引用跳转到 Westlaw 或 Practical Law 许可内容；CoCounsel MCP 输出也可能带回这些链接，且明确提醒 proprietary content 的再分发受许可限制。[connector guide](https://cocoagent-service.cocounsel.thomsonreuters.com/mcp/guide) `observed_public_page`
4. 用户可以继续追问，conversation 内保留上下文；connector 的 concise research 通常数分钟，expanded research 可超过 10 分钟。时间是官方说明，不是本轮实测。`vendor_claim`
5. Brief Builder 是五阶段 guided workflow，公开说明只确认“上传材料 → 下载完成 draft”的端点；各阶段字段、接受/撤销与失败状态未公开。[Brief Builder 训练页](https://training.thomsonreuters.com/media/Understanding%20Westlaw%20Brief%20Builder/1_fhd0i5g2) `unknown`

**机制辨析**：这里被接受的是“研究输出或引用后的工作成果”，不是“批准研究规则”。公开资料没有证据证明用户能像 Vincent 那样修改 authority list 后触发重生成。

### 流程 B：跨文档审阅 → 表格 → 原件定位

1. 上传合同、案卷或证据材料；旧公开说明给出最多 10 份合同、最多 10 个问题的 Extract Contract Data，但 2.0/Tabular Analysis 的现行配额未核实。`observed_public_page`（历史说明，时效受限）
2. Review / Extract / Tabular Analysis 以问题为列、文档/答案为结构化结果；官方训练说明可在处理过程中管理 documents 和 questions，并把结果置于可 review 的 table。[Tabular Analysis 训练页](https://training.thomsonreuters.com/media/How+to+review+and+analyze+documents+with+Tabular+Analysis/1_yqpl3s0t) `observed_public_page`
3. 结果可链接到对应文档片段；chronology 的事件也连接 supporting evidence。`observed_public_page`
4. 公开资料没有确认 cell 级人工修订标记、恢复 AI 原值、锁定单元格或“标记已复核”机制。`unknown`

### Agent / connector 状态机

CoCounsel Legal MCP 暴露一个面向模型的 `Ask CoCounsel`，而 session、upload、list files、get deliverable 是配套工具。法律技能选择留在 CoCounsel 内部，而不是让宿主 agent 猜测。会话不存在时自动启动；上传文件与宿主的普通附件不是同一通道；失败消息应指向 retry、重新登录或联系支持。[官方 connector guide](https://cocoagent-service.cocounsel.thomsonreuters.com/mcp/guide) `observed_public_page`

```text
no_session → start_session → upload/list_files → ask_cocounsel
                                      ↘ processing/waiting (inferred from documented duration)
                                      ↘ cited answer / deliverable
                                      ↘ error → retry | re-auth | support
```

这套分层避免“附件已经在宿主聊天里”被误认为“专业系统已拿到附件”。

### 商业、服务、内容与安全

- **软件/内容分层**：CoCounsel Essentials 是文档分析与起草层；CoCounsel Legal 把 Westlaw / Practical Law 内容与 AI 工作流组合。内容访问受订阅和许可约束。`observed_public_page`
- **定价**：加拿大官方 pricing 页面说明在线价格为新客户、长期合约可折扣、现有客户需联系销售；本轮文本抓取未暴露动态金额。美国/其他市场也按 sector、attorney 数、jurisdiction/content package 与期限配置。不能据此写成免费或统一单价。[加拿大 pricing](https://www.thomsonreuters.ca/en-ca/products/cocounsel-essentials/plans-pricing) `observed_public_page`
- **实施/培训**：公开 Product Training、trainer、technical/sign-in support、account/billing support；复杂客户另有 client manager 协助配置保留策略。`observed_public_page`
- **集成**：Microsoft 365、Word、Teams、Outlook，及 SharePoint、OneDrive、NetDocuments、iManage、HighQ 等；MCP connector 是额外分发面。`observed_public_page`
- **安全**：澳大利亚官方页承诺 prompts/content 不训练自身或第三方模型、TLS 1.2 / AES-256、LLM provider zero retention、组织级可配置 retention、用户可删除、澳洲数据本地处理；这些是厂商承诺，且地域条件不能外推到全球。[澳大利亚产品页](https://www.thomsonreuters.com.au/en-au/products/cocounsel.html) `vendor_claim`

## 2. Lexis+ with Protégé（原 Lexis+ AI）

### 用户、购买者与任务

- **目标用户**：律师、法务、研究人员；购买者涵盖小所、大所、企业、政府与院校。`observed_public_page`
- **核心任务**：Ask a legal question、Generate a draft、Summarise a case、上传材料问答/摘要、Vault 文档分析、timeline、transactional / litigation workflow、Shepard’s 引用核验。`observed_public_page`
- 2026 年 2 月美国页面将 Lexis+ AI 更名为 Lexis+ with Protégé；旧指南仍有效但 UI 可能不同。[资源页](https://www.lexisnexis.com/en-us/products/lexis-plus-protege/resources.page) `observed_public_page`

### 工作区与对象

| 对象 | 页面/状态 | 公开可确认动作 |
|---|---|---|
| AI Assistant / Protégé | Lexis+ experience dock 左上入口；主页任务卡 | 选择 task、输入 prompt、追问 |
| Conversation | 左侧 Recent Conversations / history | 返回旧对话、在同一会话中追问 |
| Temporary Upload | 上传框；文件逐个出现，完成后底部动作激活 | drag/drop、browse、问答或摘要；会话结束删除（旧 UK 指南） |
| Vault | 左侧 pane 中新建并命名；现行 UK 指南给出最多 50 vaults、每个 500 文档、单文档 20MB | 持久保存到用户删除、复用为 workflow 输入 |
| Draft | 右侧 editable draft；左侧 citations / follow-up options | 直接改、track changes、选中局部扩写/压缩/简化/重写、Save and Exit、Download to Word |
| Source / citation | 回答中的 linked citation；新 Source Link 与 Shepard’s | 跳到来源、查看状态；unlinked citation 表示数据库未能核验 |

数量来自 UK 指南，地区/套餐差异需单独核对。[UK Protégé User Guide](https://supportcenter.lexisnexis.com/euf/assets/files/UK_LexisPlus_with_Protege_User_Guide.pdf) `observed_public_page`

### 流程 A：法律问题 → 引用 → 核验

1. 从主页选择 Ask a legal question，或在主输入框给出问题与 jurisdiction / facts / source type。`observed_public_page`
2. 系统显示生成中，完成后给出回答、citations 和 source links；来源包括 cases、statutes、regulations、court rules、Practical Guidance、treatises 等，但 draft 任务对部分 agency decisions 有明确范围限制。[FAQ](https://help.lexisnexis.com/Flare/lexisplusai/US/en_US/Content/FAQ/whatisAI.htm) `observed_public_page`
3. 用户点击 citation 进入 Lexis 内容核对；任何 unlinked citation 都应视为“数据库无法验证”，官方也要求用户检查准确性。`observed_public_page`
4. 对上传 draft 可运行 Shepardize citations，结果以 Shepard’s graph / full analysis 表示引用后续效力；该动作是**核验文书中的引用**，不是批准文书内容。[官方 research tip](https://www.lexisnexis.com/community/infopro/b/researchtip/posts/knowledge-research-consultant-research-tip-shepardize-the-citations-in-an-uploaded-document) `observed_public_page`

### 流程 B：上传 → 动作激活 → 分文档结果

1. 点击 `Document` / Upload，拖放或 browse；公开 US help 给出 10 文件、每个 20MB，支持 PDF/DOC/DOCX/TXT，文本有字符上下限。`observed_public_page`
2. 文件出现在 Upload box；完成前底部 `Ask questions about your uploads` / `Summarize your uploads` 不可用，完成后按钮激活。`observed_public_page`
3. 提交后可连续追问，直到 conversation limit；摘要结果按每份上传文档对应一个 tab。`observed_public_page`
4. 临时上传与 Vault 是不同对象：前者用于当前 session，后者可持久复用。当前可核对的 Upload Help 没有给出 temporary upload 的精确删除时点，因此保留期记为 `unknown`；实现中必须显式区分 temporary upload 与持久 Vault。[Upload Help](https://help.lexisnexis.com/Flare/lexisplusai/US/en_US/Content/FAQ/upload.htm) `observed_public_page`

### 流程 C：研究/材料 → editable draft → Word

1. Generate a Draft 接受法律 argument、research note、clause、letter、email 或完整 transactional document。`observed_public_page`
2. 完成后分屏：右 pane 是可编辑 draft，左 pane 保留 authoritative citations 与 follow-up。`observed_public_page`
3. 人可直接编辑、使用 track changes，或选择局部让 AI expand/condense/simplify/redraft；这类接受/拒绝是**候选文本的处理**，不等于接受法律风险，也不等于批准生成规则。`observed_public_page`
4. `Save and Exit` 保存工作对象，`Download to Word` 形成外部交付物。公开指南未说明 AI 建议逐条拒绝后的版本图、多人同时编辑与 matter 权限。`unknown`

### 商业、服务、内容与安全

- **定价**：美国官方页明确 Lexis+ with Protégé 采用 customized pricing，取决于组织规模、所需能力与内容范围，需提交信息或致电获取报价；Lexis+（不含生成式 AI）的在线价格不能代替 Protégé 报价。[官方产品页](https://www.lexisnexis.com/en-us/products/lexis-plus-protege.page) `observed_public_page`
- **内容订阅**：Lexis+ with Protégé 包含 Lexis+ 内容层并增加生成式 AI；不同 jurisdiction、secondary content 与 firm document/Vault 能力可能改变报价。`observed_public_page`
- **服务**：官方支持中心、webinar、tutorial、客户代表与培训材料；具体实施包和 customer success SLA 未公开。`observed_public_page` / `unknown`
- **API/集成**：Lexis APIs 以 REST/JSON、OAuth 连接内容、analytics 与 Protégé 能力；Microsoft 365 Copilot 集成在资源页中列出。API 权限、配额和单价未公开。[Lexis APIs](https://www.lexisnexis.com/en-us/products/lexis-api.page) `observed_public_page`
- **安全**：2023 security sheet 声称 in-transit/at-rest encryption、closed-loop deployment、customer data 不训练模型、chat history 90 天（除非保存到 folder）、limited support staff access、SOC 2 Type II controls。它晚于产品 launch 但早于 2026 Protégé 重命名，应列为“待现行条款复核”，不外推所有 Vault 状态。[Security Information](https://www.lexisnexis.com/documents/20231025032201_small.pdf) `vendor_claim`

## 3. vLex Vincent

### 用户、购买者与任务

- **目标用户/购买者**：律师事务所、法务、政府、院校与个人研究者；组织管理员管理 users、SSO/IP access 与订阅。`observed_public_page`
- **任务结构**：不是一条万能 prompt，而是 workflow library：Ask a Research Question、Build an Argument、Explore a Legal Proposition、Compare Jurisdictions、50-State Survey、case analysis、document review/table、timeline、contract/redline、litigation intelligence。`observed_public_page`

### 工作区与对象

| 对象 | 界面关系 | 关键动作 |
|---|---|---|
| Workflow | landing page library，可按任务选择 | 启动、上传/粘贴、jurisdiction、运行 |
| Research Question | prompt + jurisdiction selector | 生成 memo；history 可回看而不重跑 |
| Authority List | 结果右侧；answer/memo 左侧 | 查看 source link、summary、excerpt；Modify list、取消某些 authority、Apply 后重生成 |
| Comparative Result | jurisdiction 单独答案 + 底部 comparative table | 展开 Full answer、复制/下载、分享 URL |
| Vincent Table | 文档批量输入，动态 table | 增删/改 column、改输出类型、筛选、回溯 citation、人工改 cell、恢复 AI 原值、CSV/Excel |
| Uploaded Document | 文件或文本；workflow-specific | 多种格式；部分 workflow 对内容不持久保存，仅保存 result list |

### 流程 A：问题 → authority graph → 人工改证据 → 重生成

1. 选择 `Ask a Research Question` 或直接输入问题，再选择 jurisdiction 并运行。`observed_public_page`
2. 结果两栏：左侧 memo，右侧 cited authorities；memo 有 Short Response、Detailed Analysis、Exceptions and Limitations。`observed_public_page`
3. authority entry 包含 source link、summary、relevant excerpt，可在生成期间查看。`observed_public_page`
4. 选择 `Modify list`，去除不相关 authorities，`Apply` 后系统基于新集合重生成 memo。这里用户接受/拒绝的是**证据候选**，不是最终候选文本，也不是规则批准。[Ask a Research Question](https://support.vlex.com/vincent-by-vlex/vincent/core-workflows/ask-a-research-question) `observed_public_page`
5. 输出可复制、下载 PDF/Word；history 回到旧结果不重跑。`observed_public_page`

这是四个产品中公开证据最完整的“证据集合可编辑”机制：source list 本身是可操作对象，变更会触发 derived output 再计算。

### 流程 B：跨司法辖区比较

1. 输入同一 legal question，选择两个或更多 jurisdictions；实际可选数量取决于 subscription。`observed_public_page`
2. 每个 jurisdiction 有独立 detailed answer，可展开短答、讨论和 authority。
3. 页面底部生成横向 comparative table，突出差异与共同点。
4. 可复制、下载，并生成 shareable URL；帮助文档声称接收方无需登录即可查看 full memo，但分享权限/失效期未说明，落地前必须复核。[Compare Jurisdictions](https://support.vlex.com/vincent-by-vlex/vincent/core-workflows/compare-jurisdictions) `observed_public_page` / `unknown`

### 流程 C：跨文档抽取 → 表格 → 人工修订来路

1. Document Review with Vincent Tables 接受批量材料并生成动态 table；用户定义要提取的列/问题和预期输出类型。`observed_public_page`
2. 用户可以增删改列，修改列 prompt 或输出类型；改变 format 会触发该列重新评估而非重跑整个文档集。`observed_public_page`
3. 每个 cell 链接到原件具体 clause；hover 看原文 quote，click 在全文中定位。`observed_public_page`
4. 人工改 cell 后以视觉标记区分，并保留 Vincent 原始答案；可一键恢复 AI 原值，也可再次采用人工修订。这里接受的是**人类修正后的字段值**，不是接受风险。[Correct a Cell](https://support.vlex.com/vincent-by-vlex/vincent/core-workflows/tabular-review/correct-a-cell-in-tabular-review-and-revert-to-vincents-answer) `observed_public_page`
5. table 可导出 CSV/Excel。`observed_public_page`

### 商业、服务、内容与安全

- **定价/采购**：公开支持文档将 Vincent 的采购引向 personalized demo 和 structured trial；订阅具体价格、seat 或 usage 单位在本轮未找到。vLex Library 另有 named-user / institution-wide subscriptions 与内容按 collection/credit 访问，但不能直接当作 Vincent AI 单价。[Demo/Trial](https://support.vlex.com/vincent-by-vlex/vincent/support-and-account-administration/requesting-a-demo-or-trial-of-vincent) `observed_public_page`
- **内容**：官方帮助声称由 vLex 全球数据库（超过 10 亿文档）与 licensed/public/user content 支撑；具体 jurisdiction coverage 由单独 coverage 工具/订阅决定。数量与完备性是厂商主张。`vendor_claim`
- **服务**：定制 demo、共同定义 success criteria 的 structured trial、订阅内 free training（通常 30–60 分钟）、webinar、video、account manager 与支持。`observed_public_page`
- **集成**：Word、iManage、OneDrive/Dropbox/PACER 等 native integration，API 定义见 Terms；具体 API 商业条款需 order form。`observed_public_page`
- **安全**：官方页承诺 SOC 2、ISO 27001、envelope encryption、model provider zero retention；帮助中心另称上传材料不训练、session isolation、RBAC audit、可配置 US/AU/EU data residency。这些是厂商陈述，未独立验证。[Security](https://vlex.com/security) [Data Protection](https://support.vlex.com/vincent-by-vlex/vincent/security-privacy-and-compliance/understanding-data-protection) `vendor_claim`

## 4. Legora

### 官方 Word add-in 演示图（非插件实测）

[Word add-in](https://legora.com/product/word-add-in) 的三张官方合成产品图由独立云端 worker 于 2026-10-28 核验：Drafting 图显示 Word 红线与 `Edit suggestions`、逐条编号、Dismiss / Apply；Playbooks 图显示 Mutual NDA 规则卡、Reasoning / Suggestion、Not acceptable 与红黄绿状态、`Apply 24 suggestions`；Fill template 图只展示拖放材料的输入概念。它们均为 `official_marketing_product_illustration`，不是完整真实窗口、未播放视频、未运行插件，不能证明批量效果、格式/容量或准确率。

### 用户、购买者与任务

- **目标用户**：大型/中型律师事务所、企业法务、知识管理与法律运营团队；Portal 还面向客户/外部协作者。`observed_public_page`
- **购买者**：firm/in-house leadership、innovation/knowledge、IT/security、procurement；Order Form 管平台、credits、implementation 与外部 Portal cap。`observed_public_page`
- **任务**：Legal Research、Tabular Review、Editor、Word/Outlook add-in、Workflows、Agent、Intake、Portal、client collaboration。`observed_public_page`

### 工作区与对象

Legora 的公开导航把能力分为 Agent、Assistant、Projects、Workflows、Legal Research、Tabular Review、Editor、Portal 与 add-ins。可确认的对象关系：

| 对象 | 作用 | 公开状态/动作 |
|---|---|---|
| Project | Agent 的 scope / 私有 workspace 或明确 project | MCP 可传 project ID/URL；沿用当前用户权限 |
| Workflow definition | 组合 Tabular Review、Research、Translation、Drafting、Database search、reference docs、precedents、style guides | build、permission、share to library、run、iterate |
| Workflow run / Agent chat | 运行具体任务 | `running`、等待回答、等待批准、继续、completed answer、terminal `failed` |
| Tabular Review | 文档为 rows、prompts 为 columns | format、filter、sort、Mark as Reviewed、Lock Cells、Review Mode、协作 |
| Editor document | 从 Assistant/Tabular/Research 结果形成工作文书 | 共同编辑、AI refinement、accept/reject、Word export |
| Portal share | branded external workspace | host 选择发布 files/reviews/workflows；admin/role controls、audit trail |

### 流程 A：Legal Research → exact passage → Editor

1. Legal Research 对多个 jurisdictions/sources 规划检索、并行调查并按 authority 排序；厂商称每个 finding 会在 primary law 上核验。准确性与“still holds”是 `vendor_claim`。`vendor_claim`
2. 结果显示 citation，并能打开 hosted source 的 exact passage in context；这是官网明确描述的结果形态。[Legal Research](https://legora.com/product/legal-research) `observed_public_page`
3. 研究或 Tabular Review 输出可进入 Editor，形成带 underlying data citations 的 document。`observed_public_page`
4. 在 Editor 内协作与 AI-assisted refinement，用户对候选改动 accept/reject；随后按 firm house style 导出 Word。[Editor](https://legora.com/product/editor) `observed_public_page`

**对象区分**：Editor 的 accept/reject 对象是候选文本；Legal Research 的 source verification 是证据核验；公开资料没有显示律师在 UI 内“批准研究规则”。

### 流程 B：跨文档抽取 → 受控协作 → 决策

1. 从 DMS、internal repository 或 VDR 导入文档。
2. 每份 document 成为 row，prompt 成为 column；用户定义 format、filter 与 sort。
3. 团队实时 review；`Mark as Reviewed`、`Lock Cells`、`Review Mode` 是避免协作冲突与误改的 guardrails。
4. 表格继续作为 Assistant / Editor 的上下文，转入文书或判断。

[Tabular Review](https://legora.com/product/tabular-review) 支持以上页面级机制；cell 级人工修订是否保留 AI 原值/修订者和撤销链未公开，不能类推 Vincent。`observed_public_page` / `unknown`

### 流程 C：Workflow definition → run → 人类解锁

1. lawyer / knowledge manager 用自然语言、工具、reference docs、precedents、style guides 组合 workflow；配置 flexible permissions。`observed_public_page`
2. workflow 发布到 firm library 或使用预置模板；runner 提供所需文件和上下文。
3. Legora Agent/MCP run 若在 20 秒内未完成，返回 `running` 和 chat link。`running` 可能表示仍在工作，也可能正在等待用户回答问题、批准动作或继续任务；用户必须打开 chat 查看进度、citations 或解锁。[How to connect an MCP client to Ask Legora（官方西语帮助页）](https://support.legora.com/es/how-to-use-legora-from-an-mcp-client) `observed_public_page`
4. `failed` 是 terminal，`answer: null`，仍返回 chat link 供查看失败上下文；客户端不应对同一任务盲目重复提交。`observed_public_page`
5. workflow 依据测试和反馈迭代。公开页面未说明 definition version、已运行实例与新版本的绑定、审批发布和 rollback。`unknown`

```text
definition(draft) → permission/share → run(inputs)
                                 ↘ running(work)
                                 ↘ running(waiting for answer/approval/continue)
                                 ↘ completed(answer + citations)
                                 ↘ failed(terminal, answer=null, inspect chat)
```

这一机制明确分开：**批准某个 agent 动作**、**接受候选文本**、**批准 workflow definition**。公开资料只充分支持前两类；第三类发布审批仍未知。

### Portal：客户协作与知识封装

Portal 允许 law firm 把自有 workflow 发布给 client 使用，同时隐藏 underlying prompt、logic 与 institutional knowledge；host 决定分享哪些 files、reviews 和 workflows，敏感操作要求 admin permission，matter 级角色与 audit trail 用于治理。外部 guest 不需要 Legora license 的页面主张，仍受 Order Form 中 External User Cap 和 credits 条款限制。[Portal](https://legora.com/product/portal) [Global Terms](https://legora.com/legal/cbp-general-terms-and-conditions-_aug26) `observed_public_page`

### 商业、服务、内容与安全

- **收费单位**：2026 Global Terms 明确 `Platform Fee + Credits`；所有 AI / agentic features 消耗 Credits，价格、commit 与 billing interval 在 Order Form / Credit Terms。公开页面没有金额，故为报价制/订单制，不能写免费。`observed_public_page`
- **Portal 商业边界**：external users 在 Order Form cap 内无额外 fee 且不消耗 Credits；超过 cap 需书面商业约定，internal Portal users 与一般服务相同消耗 Credits。`observed_public_page`
- **实施/服务**：Terms 把 Implementation Work 与软件分开；Advisory Services 另含 AI Readiness、4–6 个月 delivery lead 的 Champions Program、Human-AI Advisory，属于变革/专业服务，不是法律专业意见。[Advisory](https://legora.com/landing/advisory-services) `observed_public_page`
- **内容授权**：研究内容来自自有/合作来源与客户资料；官网列内容伙伴但具体 collection 权限和费用未知。`observed_public_page`
- **API/集成**：browser/desktop、Word/Outlook、DMS、Slack/Teams、MCP；API 仅在 Order Form 特别约定时提供。`observed_public_page`
- **安全**：Security Measures 写明 ISO 27001:2022 ISMS、AES-256 at rest、TLS 1.2+、yearly pen test、4 小时备份、tenant logical separation、critical security log 至少 12 个月、retention 由 subscriber instruction。均为厂商/合同陈述，未独立验证。[Security Measures](https://legora.com/legal/security-measures) `vendor_claim`

## 跨产品机制矩阵

| 原子机制 | CoCounsel | Lexis+ with Protégé | Vincent | Legora | 建设参考 |
|---|---|---|---|---|---|
| 研究入口 | skill / chat / Deep Research | task card / Protégé | workflow library | Legal Research / Agent / Workflow | 入口可以统一，任务对象不要统一消失 |
| jurisdiction | 研究技能中指定；connector 最多 3 个 US jurisdictions | prompt/context，地区内容受订阅 | 显式 selector；比较可多辖区 | MCP 可显式 1–2 jurisdictions | jurisdiction 是 run scope，应进状态而非仅 prompt 文本 |
| 来源可见 | Westlaw/Practical Law linked refs | linked citations / Source Link / Shepard’s | 右侧 authority list + excerpt | exact passage in hosted source | citation 应指向版本化原件局部 |
| 人工改证据集 | 未证实 | 未证实 | `Modify list` → `Apply` → regenerate | 未证实 | 把证据集合当一等对象，修改需触发派生物失效/重算 |
| 跨文档结构 | Tabular Analysis | 每文档 tab；Vault workflows | dynamic table | docs=rows, prompts=columns | 行/列/单元格必须能回到原件 |
| 人工修正保留 | 未证实 | draft track changes；table 未证实 | cell 标记人工修改，AI 原值可恢复 | lock/review 已证实，AI 原值保留未知 | `value + producer + source + reviewer + prior_value` 比干净结果更重要 |
| 候选文本确认 | Draft/Live Draft，逐条状态未知 | editable draft / track changes / save/export | 主要在 memo/table，不是核心证据 | Editor accept/reject | 接受文本不等于接受风险或批准规则 |
| 运行状态 | run 时间与 error guidance；connector 分 session/upload/deliverable | generating / Response completed；更多失败未知 | 处理、重生成；错误细节未知 | running/等待回答或批准/failed terminal | `running` 要有 reason，避免把等待人误判为仍计算 |
| 外部分享 | 下载/connector deliverable；许可限制 | Word/save；Vault 分享权限未知 | download + shareable URL | Portal host-controlled publish | 分享对象、权限、期限、许可应独立建模 |
| 商业计量 | 内容/AI package + attorney/sector/term/jurisdiction | customized by seats/capabilities/content | subscription/order form；AI 单价未知 | platform fee + credits | 软件、内容、usage、实施与 advisory 分账 |

## Agent 建设参考：observed / inferred / proposed

### Observed：可以直接据产品证据建模

1. **EvidenceSet 是可操作对象**：Vincent 允许删除 authority 后重生成，证明“证据候选集”可以独立于答案存在。
2. **HumanCorrection 不能覆盖 AI 原值**：Vincent table 把人工 cell 与 AI answer 并存并支持恢复，便于审计、学习和争议处理。
3. **Input scope 有持久层级**：temporary upload、Vault/database、matter/project 是不同保留与权限对象。
4. **Run reason 要比 run status 更细**：Legora 的 `running` 可能是计算、等回答、等批准或等继续；客户端要显示 next responsible actor。
5. **Deliverable 与 chat answer 分离**：CoCounsel connector 的 `Get Deliverable` 和 Lexis/Legora Editor 的保存/导出说明，最终文书不是聊天文本的别名。

### Inferred：需要更多产品或实测验证

1. 四类平台都在从 task menu 迁到 agentic orchestration，但公开资料不足以证明旧 skills 已被完全替代。`inferred`
2. 内容平台的护城河不只是模型，而是 authority graph、citator、licensed corpus 与可追溯 source viewer 的组合。`inferred`
3. Portal / MCP / Microsoft add-in 把“专业系统能力”嵌到客户已有工作面；因此 entitlement、source licensing 与附件通道比 UI 统一更难。`inferred`

### Proposed：可迁移的实现边界

1. **对象**：`Matter/Project`、`SourceDocument(version)`、`EvidenceAnchor`、`EvidenceSet`、`Run`、`ResultSection`、`CandidateEdit`、`HumanCorrection`、`Approval`、`Deliverable(version)`；不要强行把供应商对象名统一成一张表。
2. **事件**：`source_added/removed`、`anchor_opened`、`run_waiting(reason)`、`run_resumed`、`candidate_accepted/rejected`、`cell_corrected/reverted`、`workflow_published`、`deliverable_exported/shared`。
3. **权限**：来源许可、matter membership、外部 guest、workflow definition 编辑权、run 执行权、动作批准权、最终文书发布权必须分开。
4. **人审边界**：引用存在只证明可回查，不证明法律结论正确；所有 external legal work product 仍需具备资质的人复核。风险接受、候选文本接受、规则批准要用不同动作与审计记录。
5. **代价**：证据局部定位、跨版本 anchor 稳定性、派生结果失效、DMS 权限同步、内容再分发许可和 cell 级 provenance 是高成本部分；一个漂亮 chat UI 不能替代它们。
6. **反例**：把 `running` 只显示 spinner 会掩盖等待批准；把人工修正直接覆盖 AI 值会丢审计；把临时上传与 Vault 合并会误导保留；把 citation count 当 accuracy 会把供应商承诺误写成验证。

## 视觉证据状态与后续清单

本研究主会话没有云端交互式浏览器；独立云端 worker 已核验 Vincent workflow、Legal Authorities 官方产品图，以及 CoCounsel 官方培训视频 00:22、01:02、01:52 三个帧。Vincent 支持页在本次浏览器中呈现原始 Markdown，媒体 URL 所得图像只算 `official_documentation_embedded_product_image`，不算网页视觉设计或产品实测。CoCounsel 帧只说明官方演示如何把 Word 草稿、进度说明、审批模式和权威链接并置，不证明真实工具日志或核验正确性。图像 ZIP 已保存 Library，但本执行器未能材料化或做像素复核；按视觉账本编号关联。下表其余项仍为公开 URL 的建议状态：

| 建议编号 | 产品 | URL | 建议页面/状态 | 核验点 |
|---|---|---|---|---|
| RAI-01 | CoCounsel | https://training.thomsonreuters.com/playlist/1_ve1fdgp8 | playlist 展开 | 13 个训练项、技能命名与发布日期 |
| RAI-02 | CoCounsel | https://training.thomsonreuters.com/media/Understanding%20Westlaw%20Brief%20Builder/1_fhd0i5g2 | guide / video 首屏与阶段图 | 五阶段实际标签、上传→下载中间状态 |
| RAI-03 | CoCounsel | https://www.thomsonreuters.com.au/en-au/products/cocounsel-legal/features.html | Deep Research / Tabular Analysis 区 | 卡片分组与引用/表格视觉 |
| RAI-04 | CoCounsel | https://cocoagent-service.cocounsel.thomsonreuters.com/mcp/guide | Available tools 表、FAQ | session/upload/deliverable 与 failure guidance |
| RAI-05 | Lexis | https://www.lexisnexis.com/pdf/lexis-plus-ai-user-guide.pdf | home task cards、generate、upload 页面 | 旧 UI 仅作时点证据，图注标 2024 |
| RAI-06 | Lexis | https://supportcenter.lexisnexis.com/euf/assets/files/UK_LexisPlus_with_Protege_User_Guide.pdf | split draft / Vault / workflow 页面 | 左 citation、右 editor、Save/Download |
| RAI-07 | Lexis | https://help.lexisnexis.com/Flare/lexisplusai/US/en_US/Content/FAQ/upload.htm | upload 前后两种状态 | 按钮 disabled→active、每文档 tab |
| RAI-08 | Lexis | https://www.lexisnexis.com/en-us/products/lexis-plus-protege/resources.page | tutorial tiles | 标明部分视频 UI 已过期的警示 |
| RAI-09 | Vincent | https://support.vlex.com/vincent-by-vlex/vincent/core-workflows/ask-a-research-question | 结果双栏 / Modify list | authority list、excerpt、Apply 后重生成 |
| RAI-10 | Vincent | https://support.vlex.com/vincent-by-vlex/vincent/core-workflows/compare-jurisdictions | individual answers + table | Full answer、比较表、export/share |
| RAI-11 | Vincent | https://support.vlex.com/vincent-by-vlex/vincent/core-workflows/tabular-review/correct-a-cell-in-tabular-review-and-revert-to-vincents-answer | 人工改 cell / AI 原值 | 人工标记、source highlight、revert |
| RAI-12 | Vincent | https://support.vlex.com/vincent-by-vlex/vincent/core-workflows/performing-a-redline-analysis | 上传两版本→结果 | list/table、后续 workflow 建议 |
| RAI-13 | Legora | https://legora.com/product/tabular-review | product demo section | docs rows / prompts columns、review guards |
| RAI-14 | Legora | https://legora.com/product/editor | 07:01 Editor demo | 记录准确时间点：citation pane、AI suggestion、accept/reject、export |
| RAI-15 | Legora | https://legora.com/product/workflows | 01:00 Workflows demo | builder、inputs、library、run state |
| RAI-16 | Legora | https://legora.com/product/portal | access controls / shared workspace | host 与 guest 的可见范围、branding |

## 来源与覆盖统计

- Exa 搜索：43 次调用，申请 344 个 result slots；其中初始并发有 4 次 `INVALID_ARGUMENT`，因此实际返回槽位按 312 计。后续所有关键结论均回到公开原始页面/帮助文档全文。
- 深描：4 个产品；文中引用 31 个去重原始 URL（均为厂商官网、帮助中心、用户指南、条款或官方训练材料）。
- 证据强度：公开帮助/指南最强；官网功能页可支撑对象与结果形态，但准确性、安全性和效率仍是 vendor claim；训练目录只证明材料存在，不等于本轮观看录屏。
- 未验证：登录后全局导航视觉、实际 latency、error/empty state、权限拒绝、多人编辑冲突、undo/version graph、动态定价金额、API 配额、交互可达性。
- 建议复查日期：2027-01-28，或产品/套餐/帮助中心发生重大改版时提前复查。
