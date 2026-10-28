# Lawhive 服务模式：平台、AI 与受托律师的责任边界

采集时间：2026-10-28（UTC）  
范围：Lawhive 官方公开页面、法律条款、面向律师的公开产品页；未注册、未提交 intake、未联系销售或律师、未上传任何数据。  
检索：Exa，4 个调查角度、12 条查询，`sources_reviewed = 80`；搜索返回 67 行结果，去重后 31 个唯一 URL。  
证据边界：本轮没有云端交互浏览器；`observed_public_page` 仅表示公开文本可读，不代表登录后或委托后的流程实测。

## 一句话结论

Lawhive 不是单一的“法律 AI SaaS”，也不宜只写成律师 marketplace。官方法律条款支持的准确结构是：**Lawhive Ltd 运营网站与技术平台、完成转介并提供通信/文档/支付能力；客户通过平台直接聘用具体 Lawyer；实际法律服务由该 Lawyer 提供。Lawyer 可能来自关联的 SRA 受监管律所 Lawhive Legal Ltd，也可能是其他律所、自由执业律师、认可的 sole practice、licensed conveyancer、CILEX lawyer 等。** [LH-01][LH-02]

AI 是这套服务生产系统中的律师工具。公开面向律师的页面称 AI associate 用于法律问题、drafting 与沟通，研发页展示 briefing、demand letter 和 next steps 的示意；但公开条款没有证明“AI 产物必须经过某个具体按钮/审批状态后才能发给客户”。可以确定的是 Lawyer 才提供法律服务、承担专业义务；AI 草稿如何变成外部指示材料，仍需把“律师复核并采用”作为建议控制，而不能写成已经观察到的产品状态。[LH-02][LH-06][LH-07]

## 服务栈：五层必须分开

| 层 | 公开证据支持的角色 | 收费 / 责任 | 不应混写成什么 |
|---|---|---|---|
| 网站与一般信息 | Lawhive Ltd 运营公开网站；条款称网站内容是一般法律信息，Lawhive Ltd 不是律所、网站使用不创建 solicitor-client relationship | 网站条款约束使用；不构成针对个案的法律意见 | “浏览页面/和员工对话已获得法律建议” [LH-01] |
| 平台与 SaaS | Lawhive Ltd 的 Service 包括网站、技术平台、通信工具、文档管理/存储和支付服务 | Lawyer 向 Lawhive 支付转介与平台费；平台服务与法律服务责任分离 | “Lawhive Ltd 自己承办所有案件” [LH-02] |
| 入口 / 匹配 / 转介 | 用户在公开页面回答若干问题，随后与团队成员沟通报价或预约回电；提交信息授权 Lawhive 转给 Lawyer | 公开页面称 quote 可无义务；具体转介算法、律师排序和拒绝规则未公开 | 纯价格比较站；也不是只卖线索，因为律师页称会交付已预付客户 [LH-01][LH-03][LH-06] |
| 法律服务 | 客户通过 Service 直接聘用具体 Lawyer；Lawyer 独自提供法律服务并受各自监管要求约束 | 客户预付后 Lawyer 才开工；专业责任、冲突、AML/KYC、保密和投诉首先落在 Lawyer/律所 | “AI 或平台员工自动成为受托律师” [LH-02] |
| AI 生产工具 | 面向 Lawyer 的 AI associate 用于问答、drafting、沟通与任务预测；研发页展示内部 briefing / demand letter 示例 | 产品页未公开单列 AI 价格；未证明 AI 直接向客户出具可依赖的法律意见 | “AI 草稿已经是外部法律意见” [LH-06][LH-07][LH-08] |

## 实体、合同与责任

### Lawhive Ltd

- 公司号 13800100；运营网站与平台。[LH-01]
- 官方 Terms of Service 明确写明其不是律所、不提供法律意见；平台员工与网站一般信息不构成 solicitor-client relationship。[LH-01]
- 客户提交个案信息时，授权 Lawhive 为该事项采取转介动作，并把案件详情安全转给 Lawyer。[LH-01]
- Client Solicitor Terms 将 Service 定义为网站、通信、文档管理/存储与支付服务。[LH-02]
- 条款称 Lawhive 及其董事/员工/顾问不对 Lawyer 独自提供的法律服务承担责任，但网站另有 Lawhive guarantee：在 Lawhive 自行判断付费法律工作未达到可接受标准时可能适用；该保证不承诺案件结果。[LH-01][LH-02]

### Lawhive Legal Ltd

- 公司号 14651095，SRA ID 8003766；属于 Lawhive 网络中的关联受监管律所。[LH-01][LH-05]
- 公开 onboarding 页再次声明：询问先到 Lawhive Ltd；网络包括 Lawhive Legal Ltd，且两家公司分离。[LH-04]
- Lawhive Legal Ltd 有独立投诉页；先向承办 Lawyer 反馈，未解决可进入律所投诉程序，符合条件时再到 Legal Ombudsman。[LH-05]

### 具体 Lawyer

- 条款对 Lawyer 的定义覆盖 law firm、freelance solicitor、recognised sole practice、licensed conveyancer、chartered legal executive 或其他通过平台直接受聘的 lawyer。[LH-02]
- Lawyer 只提供法律服务；给客户的建议只为该客户利益，第三方不得未经书面批准依赖。[LH-02]
- Lawyer 与 Lawhive 有书面转介/平台协议并支付平台费；这说明平台有 marketplace/referral 成分，但实际 engagement 是客户与 Lawyer 直接形成。[LH-01][LH-02]
- Lawyer 在接受 instructions 前做 conflict check，并通过 Service 做身份验证与持续 AML monitoring；验证不通过或出现可疑情况时可以暂停或终止。[LH-02]
- 自由执业律师的 PII 安排可能不同于 SRA 最低条款；具体保险证书和保额需向 Lawyer/Lawhive 核实。[LH-02]

## 从访客到受托：公开证据支持到哪一步

下表是状态/闸门目录，不是所有案件都严格遵循的线性漏斗。条款只支持部分顺序：conflict 与 identity/KYC 必须在接受客户/指示前完成；款项到账先于 Lawyer 开工；书面 instructions 可授权冷静期内提前工作。quote、Lawyer assignment、client-care 接受、付款与 instructions 的实际先后可能按案件变化，公开页面未给出统一编排。

| 状态 | 触发 / 动作 | 公开可见结果 | 责任与限制 | 证据状态 |
|---|---|---|---|---|
| `visitor` | 从首页或具体服务页选择法律问题 | 看到服务领域、律师网络、透明价格表述与“回答几个问题”CTA | 页面信息不是个案法律意见 | `observed_public_page` [LH-01][LH-03] |
| `enquiry_started` | 进入 `/onboarding/journey`；公开文本显示实体免责声明；独立云端 worker 另核验加载完成首步 | 首步为 `Tell us about your case`，含三段进度、自由文本、Relevant dates / Deadlines / ideal outcome 提示和 Continue | 未填内容、未点 Continue；不能推断后续字段、校验、上传、报价或律师分配 | `observed_public_page_partial` + delegated visual observation [LH-04] |
| `case_information_submitted` | 用户向网站提交事项信息 | 条款称用户授权 Lawhive 转介并安全传递案件详情 | 提交信息本身仍不等于 Lawhive Ltd 提供法律意见 | `observed_terms`；界面未实测 [LH-01] |
| `quote_or_callback` | 回答问题后与团队成员沟通，或预约回电 | 服务页称可得到报价；多类服务声称 no-obligation fixed-fee quote | 首页同时写“fixed fee or billed by the hour”；不能把所有服务一概写成固定价 | `vendor_claim` [LH-03][LH-09][LH-10] |
| `lawyer_candidate` | 平台匹配/转介律师 | 页面称选择或分配合适 Lawyer | 匹配规则、排序、冲突前后顺序和用户是否可选 Lawyer 未公开 | `unknown` |
| `pre-engagement_checks` | Lawyer 做 conflict check；Service 请求身份/AML 材料 | 通过后方可接受新客户；失败可拒绝/暂停/终止 | 不应在 quote 状态就显示“律师已接受委托” | `observed_terms` [LH-02] |
| `engaged` | 客户直接聘用 Lawyer，并同意 Lawyer 的 terms of business / client care letter | 形成客户—Lawyer 的专业服务关系 | 使用网站不会自动形成；具体每案受托实体可能不同 | `observed_terms` [LH-01][LH-02] |
| `funded` | 客户通过 Service 用卡或转账预付 | 账户到款后 Lawyer 方可开始工作 | 额外 disbursements、scope change 的具体报价流程未完整公开 | `observed_terms` [LH-02] |
| `work_authorised` | 客户通过 Service 给 Lawyer 书面 instructions | 客户明确同意在 14 天冷静期内开工，并对取消前已做工作付费 | 若在取消前工作全部完成，取消权可能丧失 | `observed_terms` [LH-02] |
| `matter_active` | Lawyer 研究、draft、谈判、沟通；平台承载消息与文档 | About 页称登录后可看更新、联系 Lawyer、查看案件；Terms 称主要通过 Service 沟通 | 登录后列表/详情、任务、版本、权限未实测 | `observed_public_page` + `unknown_ui` [LH-02][LH-11] |
| `completed_or_terminated` | 工作完成、取消或终止 | 文件按法律/SRA 要求保存；欠费时 Lawyer 可对文件主张 lien | 销毁期通常七年是条款表述；具体每案保留责任仍需 client care letter | `observed_terms` [LH-02] |

## 定价与报价

### 可以确认

- 多个现行服务页把流程写为“回答几个问题→团队成员提供 quote 或安排 callback”。[LH-03]
- Commercial、Family、Small Business 等页面宣传个性化或即时 fixed-fee quote，且无义务承诺；Small Business 页给出“独立交易法律意见低至 £199”“GDPR policy 起草低至 £149”的示例，不是通用价目表。[LH-09][LH-10]
- Client Solicitor Terms 写明开工前严格预付，通过 Service 用卡或银行转账，除非 Lawhive 另行授权。[LH-02]
- 诉讼等页面说明 court fees、experts' fees、Counsel/hearing/travel 等可能是额外 disbursements；fixed legal fee 不应被理解为全包诉讼成本。[LH-12]

### 冲突与未知

- 首页和 About 页写“whether fixed fee or billed by the hour”，但多个服务页写固定费且“不按小时”。公开页面没有统一到一种模型，因此本研究记录为 `case_and_service_specific`，不能写“Lawhive 所有事项只收固定费”。[LH-03][LH-11]
- FAQ 列出最低费用、no win no fee、付款等问题，但公开抓取未展开答案；本轮不填猜测。[LH-13]
- quote 的组成、VAT、scope change、退款/取消计算、disbursement 预存、客户款账户路径均需看每案 quote、client care letter 和承办 Lawyer 条款。
- 律师页称平台带来已预付客户；这支持“非纯线索 marketplace”，但客户资金何时从 Service 结算给具体 Lawyer、平台费率和 fee share 未公开。[LH-06]

## 客户 intake 与公开页面交互

### Observed

- 首页导航核心对象是法律事项类别与 Lawyer；CTA 是回答问题以获得 quote 或 callback。[LH-03]
- `/onboarding/journey` 是公开 intake 路由，抓取时只得到加载态 “Warming up” 与 Lawhive Ltd / Lawhive Legal Ltd 分离的免责声明。[LH-04]
- 具体服务页先给服务范围、费用解释、律师匹配与 CTA；Small Business 页还给出“initial consultation→agree plan→collaborate→completion”的说明。[LH-10]
- 登录入口文案称客户可查看更新、给 Lawyer 发消息、查看案件状态；条款还把文档管理、存储、通信和支付列为平台能力。[LH-02][LH-11]

### Unknown

- intake 的真实字段、材料上传、进度、校验、失败/撤回、保存草稿、同意条款与身份验证的页面次序。
- quote 是规则引擎生成、人工生成还是混合；报价前后 Lawyer 是否已选定。
- 付款、冲突检查、KYC 与 client care letter 的强制顺序是否因案件类型变化。
- 客户 portal 的导航、matter 列表/详情、消息/文档版本、权限、审计日志与错误状态。

## AI 产物如何成为外部 instruction materials

### Observed

1. 面向律师的官方页面把 AI associate 描述为回答法律问题、简化 drafting 和沟通；client specialists 负责 sales、qualification、engagement letters、payment collection 与 ongoing communication。[LH-06]
2. Labs 页面公开展示一个示意工作面：AI 生成 case briefing、demand letter 和 next-step draft，并组合 Land Registry plan、照片证据和 surveyor report。该页是招聘/研发叙事，不是已验证客户 matter 流程。[LH-07]
3. 一名律师的厂商页面 testimonial 称 Lawrence 会总结通话、起草 next steps；这是 vendor-hosted testimonial，不是独立审计。[LH-06]
4. 早期官方研究页面记录 Lawrence 在复杂推理、相似概念和 client empathy 上的不足，并把未来定位为支持律师的 co-pilot；它说明有人审必要性，但发布时间为 2023-11，不能单独代表 2026 当前实现。[LH-08]
5. 法律条款把所有 legal services 与对客户的 advice 责任放在 Lawyer；Lawhive Ltd 网站信息/员工对话不构成个案法律意见。[LH-01][LH-02]

### Inferred

- 结合律师工具页与责任条款，最稳妥的解释是：AI 产物先属于 Lawyer 工作面的候选材料，只有具体 Lawyer 审阅、修改并以自己的专业身份采用后，才应成为 client-facing advice、letter、pleading 或 external instruction。这个“应当”来自责任边界推断；公开材料没有显示强制 review gate。
- 平台同时处理 intake facts、律师消息、文档和支付，具备把 client-supplied facts 与 AI draft 关联到 matter 的基础；但是否保存 prompt、source trace、draft lineage 和 acceptance event 未知。
- “Lawrence autonomous AI lawyer”是 Labs 的产品/招聘表述；不能据此推断 AI 自主接受委托、签署律师函或承担执业责任。

### Proposed

对 Agent 产品建设，建议把外部材料的状态机显式化：

`client_input_received → facts_normalised → ai_working_draft → lawyer_review_required → lawyer_revised/adopted → client_instruction_confirmed → approved_for_external_use → sent/filed`

每个转换应记录：

- `matter_id`、client 与实际受托 Lawyer/firm；
- 输入材料及权限、来源和时间；
- AI 生成版本、模型/工具、引用/证据指针；
- Lawyer 的接受、修改、拒绝理由与签名；
- 客户指示是否齐备、scope 与费用是否覆盖；
- 外发对象、渠道、最终版本和发送/提交回执；
- conflict/KYC/engagement/payment 的前置闸门。

不得把三种动作合并：

- **接受 AI 候选文本**：Lawyer 采用某一 draft；
- **确认客户指示**：客户确认事实、目标或授权；
- **批准外发/提交**：具备专业权限的人批准对外发送、签署或 filing。

实现代价包括版本图、来源追溯、授权与 scope 检查、律师监管/保险差异、跨组织数据隔离和撤回/结果未知。反例是把“AI 已生成 demand letter”直接映射为“律师已发函”；公开证据不能支持这种自动状态跳转。

## 商业模式判断

### Observed

- 客户端：按具体 legal matter 取得报价并预付，不是面向消费者的公开席位 SaaS。[LH-02][LH-03]
- Lawyer 端：Lawyer 向 Lawhive 支付转介与平台费；consultant 页面称平台处理 marketing、qualification、onboarding、engagement letters、payments、compliance 与 billing，并给律师已预付客户。[LH-01][LH-02][LH-06]
- 平台/品牌内同时存在 Lawhive Ltd、Lawhive Legal Ltd 与其他法律服务提供者。[LH-01][LH-04]

### Inferred

- 这是双边平台与受监管服务交付的复合模式：客户端按 matter 付法律服务费，Lawyer 端以平台/转介费换取获客、软件和运营服务；关联律所提供一部分 regulated delivery capacity。
- “marketplace”只描述匹配/转介，不足以描述 Lawhive 的全套运营；“law firm”只描述受监管 affiliate/consultancy 部分，也不足以覆盖 Lawhive Ltd 的非律所平台角色。

### Unknown

- 平台费/fee share、不同 Lawyer 类型的费率与结算；
- 每类案件由 Lawhive Legal Ltd、partner firm 或 freelance Lawyer 承办的分配逻辑；
- AI 工具是否另行收费或包含在平台费；
- 获客成本、quote margin、write-off/guarantee 实际会计处理；
- 美国等其他司法辖区是否使用相同实体与 engagement 结构。本报告只按英国公开页面描述。

## 对主研究的比较价值

| 与典型 legal SaaS 的差别 | Lawhive 机制 | Agent 产品启示 |
|---|---|---|
| 购买单位 | 主要是 legal matter / scoped service quote，不是公开按席位订阅 | 把 `matter_scope`、quote、付款、engagement 与 SaaS entitlement 分开 |
| 责任主体 | 平台与具体 Lawyer/firm 分离，且每案实际受托者可能不同 | 运行时必须显示实际 responsible professional，不只显示平台品牌 |
| 人审边界 | 条款把专业服务责任放在 Lawyer；AI 是律师生产工具 | AI 结果只能是候选，外部法律材料需要可证明的 Lawyer adoption |
| 服务运营 | 平台同时做 intake、qualification、KYC/AML 支持、支付、文档与沟通 | Agent 不只是 chat；需处理合规闸门、任务、资金和文件状态 |
| 市场模式 | Lawyer 支付转介/平台费，客户端按 matter 付费 | 把 referral economics 与 legal fee 分账，避免利益冲突和披露缺失 |

## 待补截图

独立云端 worker 已捕获 LH-SS-01 首页、LH-SS-02 intake 首步和英国首页服务模式段；图像由父任务在 `05-evidence/visual/supplement/` 装配，本 executor 未持有图像字节。其余项为 `pending_browser_capture`。

| screenshot_id | URL | 页面 / 状态 | 目的 |
|---|---|---|---|
| LH-SS-01 | https://lawhive.co.uk/ | 首页，法律事项入口、律师、quote CTA | `captured_worker`；初访 US 分流弹窗图不用于 UK 承诺；另有重新选择 UK 后的服务模式段 |
| LH-SS-02 | https://lawhive.co.uk/onboarding/journey | 初始 loading 完成后的第一题，不提交 | `captured_worker`；自由文本首步、三段进度与 Continue；未输入或提交 |
| LH-SS-03 | https://lawhive.co.uk/legal/terms-of-service | 第 9 与第 15 节 | 证明 Lawhive Ltd 非律所、转介和直接聘用 Lawyer |
| LH-SS-04 | https://lawhive.co.uk/legal/client-solicitor-engagement-terms | 定义、conflict/AML、payments 与第 22 节 | 证明平台/律师责任、预付和书面指示 |
| LH-SS-05 | https://lawhive.co.uk/work-with-us | consultant 模式、AI/运营支持、pre-paid clients | 证明律师侧价值与平台运营边界 |
| LH-SS-06 | https://labs.lawhive.co.uk/ | Lawrence briefing / demand letter 示意 | 仅作为厂商产品叙事，不标为实测 matter UI |
| LH-SS-07 | https://lawhive.co.uk/small-business | 价格示例、四步工作说明、portal 文案 | 证明 scoped quote 与律师交付路径 |

## 来源账本

| source_id | 类型 | 页面 | 日期 | 支持的主张 | 质量 / 限制 |
|---|---|---|---|---|---|
| LH-01 | 官方法律条款 | [Terms of Service](https://lawhive.co.uk/legal/terms-of-service) | 访问 2026-10-28 | Lawhive Ltd 非律所；affiliate；网站不创设关系；转介授权；平台费/guarantee | 高：角色边界的直接条款；版本/生效日页面未显示 |
| LH-02 | 官方 engagement 条款 | [Client Solicitor Terms](https://lawhive.co.uk/legal/client-solicitor-engagement-terms) | 访问 2026-10-28 | Lawyer 定义、Service、责任、conflict、AML、预付、书面指示、投诉/保险 | 高：专业服务直接条款；每案 client care letter 仍优先 |
| LH-03 | 官方首页 | [Lawhive](https://lawhive.co.uk/) | 访问 2026-10-28 | 事项入口、quote/callback、律师网络、fixed/hourly 透明定价 | `vendor_claim`；推荐/人数/价格优势未独立验证 |
| LH-04 | 官方 intake 路由 | [Onboarding journey](https://lawhive.co.uk/onboarding/journey) | 访问 2026-10-28 | 加载态、Lawhive Ltd / Legal Ltd 分离免责声明 | 部分观察；动态问题未抓取、未提交 |
| LH-05 | 关联律所官方投诉 | [Lawhive Legal Feedback and Complaints](https://lawhive.co.uk/legal/lawhive-legal-feedback-complaints) | 访问 2026-10-28 | 关联律所监管身份与投诉路径 | 高：Lawhive Legal Ltd 事项；不自动适用于其他 Lawyer |
| LH-06 | 官方 Lawyer 招募页 | [Work with us](https://lawhive.co.uk/work-with-us) | 访问 2026-10-28 | consultant 模式、平台运营、AI 工具、pre-paid clients | `vendor_claim`；fee share 未公开 |
| LH-07 | 官方研发/招聘页 | [Lawhive Labs](https://labs.lawhive.co.uk/) | 访问 2026-10-28 | AI briefing/draft 示例、OS/marketplace/law firm 组合叙事 | `vendor_demo_claim`；不是生产 matter 审计 |
| LH-08 | 官方研究文章 | [Lawrence AI paralegal](https://lawhive.co.uk/data-insight/lawrence-ai-paralegal) | 更新 2023-11-27；访问 2026-10-28 | AI 局限、人类 empathy、co-pilot 定位 | 历史厂商研究；不能代表 2026 当前功能 |
| LH-09 | 官方服务页 | [Commercial](https://lawhive.co.uk/commercial) | 访问 2026-10-28 | no-obligation fixed-fee quote、匹配律师 | `vendor_claim`；具体 scope/金额需 quote |
| LH-10 | 官方服务页 | [Small Business](https://lawhive.co.uk/small-business) | 访问 2026-10-28 | £149/£199 起价示例、固定费、工作四步、portal | `vendor_claim`；“as little as”不是统一价 |
| LH-11 | 官方 About | [About us](https://lawhive.co.uk/about-us) | 访问 2026-10-28 | 平台+AI+regulated law firm；登录后更新/消息/案件 | 品牌叙事；实体边界以法律条款为准 |
| LH-12 | 官方服务页 | [Litigation](https://lawhive.co.uk/litigation) | 访问 2026-10-28 | quote 与额外 court/expert/disbursement 成本 | `vendor_claim`；个案金额未知 |
| LH-13 | 官方 FAQ | [FAQs](https://lawhive.co.uk/faqs) | 访问 2026-10-28 | FAQ 问题清单 | 折叠答案未抓取；不用于具体金额/政策结论 |

## 复查条件

- 进入采购、合作或产品仿制前，在浏览器中补拍 intake、quote 与 portal 的公开状态；登录墙内需另行授权。
- 任何具体案件都应以实际 Lawyer、client care letter、scope/quote、监管身份与 PII 为准。
- 定价与服务范围建议最迟 2026-11-28 复查；法律条款在无显式版本号情况下也应在每次使用前复查。
- 若要把 Lawhive 作为“AI 产物外发”证据，必须取得当前生产流程、mandatory review gate、版本/审计记录或官方录屏；现有 Labs 页面不足以证明。
