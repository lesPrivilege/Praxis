# 法律科技 SaaS / AI SaaS 产品机制参考库

研究日期：2026-10-28（UTC）  
建议复查：2027-01-28；动态定价页建议 2026-11-28 前复查  
权威文本：本文件；产品级细节以链接的分域深描为准  
证据边界：公开页面、官方帮助/文档、官方培训/录屏；42 项视觉观察由独立云端 worker 核验，图像 ZIP version 1 已独立保存 Library；未登录、未注册、未付费、未上传文件

## 使用这份库

本研究把产品拆成四层：工作域 → 产品 → 流程/页面 → 原子机制。Agent 设计时先按业务对象和状态找到对应机制，再回到产品深描与来源 URL；不要从产品名直接复制功能清单。

完整深描 12 个，另有 Harvey 1 个聚焦深描、Lawhive 1 个服务模式对照、24 个候选的广索引和 3 个中国局部深描。结构化工件合并后有 153 个去重 URL。检索工作流共请求 1,216 个结果槽位；4 次参数校验失败，实际返回/检查 1,171 个槽位。来源在各工作流内去重后再筛选，不能把槽位数当成独立证据篇数。

关键入口：

- [自然版图与 24 个候选](../01-landscape/explorer_landscape.md)
- [研究/引用核验/AI-native 工作台](../02-products/research_ai_workbench.md)
- [Harvey：Harness / Playbook / Source / Review Table 聚焦深描](../02-products/harvey_focused_profile.md)
- [合同审阅、Playbook 与 CLM](../02-products/contracts_clm.md)
- [Matter / case 与 eDiscovery](../02-products/matter_ediscovery.md)
- [跨产品状态模型](../03-mechanisms/cross_product_state_models.md)
- [中国代表与商业/服务模式](../04-commercial/china_and_business.md)
- [Lawhive：平台、AI 与受托律师服务模式](../04-commercial/lawhive_service_model.md)
- [定价与服务机制](../04-commercial/cross_product_pricing_patterns.md)
- [来源账本](../05-evidence/source_ledger.csv)
- [截图待补与采集状态](../05-evidence/screenshot_backlog.md)
- [独立复核](../06-review/independent_review.md)

## 一、法律工作的自然版图

| 工作域 | 主业务对象 | 典型主干 | 代表深描 |
|---|---|---|---|
| 法律研究与引用核验 | question、jurisdiction、authority、memo、citation | 提问→检索运行→候选权威→核验/调整→备忘录→导出 | CoCounsel/Westlaw、Lexis+ Protégé、vLex Vincent、Legora |
| 合同审阅/redlining/Playbook | document、clause、rule、position、redline、exception | 载入→识别→对照规则→偏差→候选文本→人类决定→例外 | Spellbook、Luminance |
| CLM/审批签署 | request、workflow、agreement version、approval、signature packet、record | intake→create→review/approve→sign→archive→obligation | Ironclad、Juro |
| Matter/case 管理 | contact、matter、task、document、time/expense、bill、portal | intake→开立→任务/材料→计时/账单→客户协作→结案 | Clio、Litify |
| 诉讼证据/eDiscovery | corpus、document、search、queue/batch、coding、production | collect/process→search→review/code→QC→produce | Relativity aiR / RelativityOne、Everlaw |
| 知识/drafting/协作 | project/vault、knowledge source、thread、draft、table、shared artifact | 材料→抽取/研究→编辑→原件回溯→共享/导出 | 贯穿 Legora、Lexis、vLex、CoCounsel |

自然边界很重要：成熟 SaaS 多用稳定的业务主对象承载状态，AI-native 工作台更常以 thread/project/workflow 组合任务。Agent 不应把两者都压成聊天消息。

## 二、12 个完整深描：机制定位

| 产品 | 稳定对象 | 最值得取用的流程/机制 | 主要证据限制 |
|---|---|---|---|
| CoCounsel Legal / Westlaw | matter、chat/session、database、skill、deliverable | 专业系统的 session/upload/run/deliverable 分层；Word 中 authority reasoning 与 tracked revision | 动态定价与登录后失败态未实测；内容许可限制需保留 |
| Lexis+ with Protégé | task、conversation、temporary upload、Vault、editable draft | 临时上传与持久 Vault 分开；引用链接、Shepard’s 与上传原件 Source Link 是不同核验对象 | 2023 security sheet 需按现行 Protégé 条款复核 |
| vLex Vincent | workflow、authority list、memo、Vincent Table、cell | authority list 可修改并触发 memo 重算；cell 人工修订保留 AI 原值并可恢复 | 分享 URL 失效期、权限和运行失败未公开 |
| Legora | project、workflow definition/run、Tabular Review、Editor、Portal | run 明确区分计算中、等待回答、等待批准；table 有 reviewed/lock guardrails | 官网对准确性/“still holds”属 vendor claim；细粒度撤销未知 |
| Spellbook | Word document、Playbook、rule、question、revision | redline-aware Playbook 的 Accept/Reject/Revise；rule 依据与原文定位；candidate 可 edit/regenerate | Apply All 的确认、partial failure、undo 未公开；权限变化无 audit log |
| Luminance | contract、position、checklist、precedent、workflow stage | precedent + playbook + Traffic Light + 条件路由；portfolio-scale comparison | 具体 UI 主要来自 2022/2024 厂商材料，必须补拍复核 |
| Ironclad | workflow、agreement version、clause deviation、exception、signature packet、record | launch form→版本级审批→候选文本或 exception 分支→Sign 回退→Archive record | 规则自身 draft/review/publish 状态未公开；Audit Log 为付费 add-on |
| Juro | intake agent、document record/version、review cycle、approver、signatory | first-party 只审 redline，third-party 审全文；异步 negotiation lock；legal reviewer gate | accept/reject 不可 undo；internal changes 会重新触发审批，字段级 approver 只在绑定字段变化时重入 |
| Clio Manage | matter、task、document、time/expense、bill、portal share | matter 作为唯一主记录；客户任务可完成/撤销；portal 分享可 revoke | 已下载副本处置、套餐 API 限额和失败态未公开 |
| Litify | intake/LSR、matter、Matter Plan、task、document、time/bill | dynamic intake→matter→Matter Plan；模板实例与执行任务分开 | 详细产品状态在登录墙内；Salesforce 能力与 Litify 自身需区分 |
| Relativity aiR / RelativityOne | matter/workspace、processing job、saved search、queue/batch、document coding、production set | file exception 与 job exception 分开；queue/batch/coding/production 各自有状态与恢复 | 当前帮助域已转至 Relativity aiR，但嵌入截图仍含 RelativityOne 品牌；不能据此推断整个产品已统一改版 |
| Everlaw | project、search results、batch task、document code、production | 批量动作先显示影响范围，再异步执行；eligible undo；`Complete with errors` | per-GB/AI credits 具体金额与部分 production rollback 未公开 |

Harvey 不计入上述 12 个完整深描数量，另作用户 Harness 重点的聚焦深描。它的 Playbook Review 已公开到 `Acceptable / Needs review / Not acceptable`、rule reasoning、原文定位、候选 redline 的 Edit/Apply/Dismiss/Ask for revision、批量 Apply 和 review progress；Review Table 公开到 cell reasoning、sentence citation、edit/verify/comment/activity/lock；Agent sharing 公开 Run/View/Edit/Full 与按 sharing policy 触发的 admin approval。完整对象、状态与缺口见独立条目。

## 三、六条应优先进入 Agent 架构的机制

### 1. Evidence set 是可编辑输入，不是报告尾部的一串链接

Vincent 允许用户修改 authority list 后重算 memo。Lexis Source Link 把生成内容定位到上传原件片段；CoCounsel 把草稿 authority verification 变成可审查 finding；这些对象不可合并为一个 `citation_url`。

建议最小对象：

```text
ResearchQuestion(boundaries)
  → ResearchRun(input_snapshot, status)
  → AuthorityCandidate(source, excerpt, treatment)
  → AuthoritySet(version, included/excluded)
  → GeneratedClaim ↔ CitationAnchor(document_version, span)
  → HumanVerification
```

来源集合变化必须产生新 run 或显式 revision，保留前后差异；不能在原报告上静默覆盖。

### 2. 三类“接受/批准”是不同业务事件

| 事件 | 对象 | 典型后果 | 代表证据 |
|---|---|---|---|
| `risk.accepted` / `exception.approved` | deviation / exception | 非标准条款继续存在，责任人与理由入账 | Ironclad Request an exception |
| `candidate_edit.applied` | revision/redline | 具体文本写入新版本，可产生 tracked change | Spellbook、Juro、CoCounsel |
| `rule_version.approved` | playbook rule/configuration | 团队标准开始影响后续审阅 | 本轮多数产品未公开完整状态机，需自建治理 |

不要用绿色 `passed`、`Apply` 或文档审批按钮替代上述对象。合同文档获批也不等于 Playbook 规则获批。

### 3. 跨文档抽取需要保留 cell 的来路与人工修订链

vLex Vincent Tables 公开支持 column 重算、cell 回到原件、人工修改、保留/恢复 AI 原值；Legora Tabular Review 提供 Reviewed、Lock Cells、Review Mode；eDiscovery results table 强调批量、coding 与 QC。

建议每个 cell 至少保存：`input_document_version`、`column_prompt_version`、`source_span`、`ai_value`、`human_value`、`review_state`、`reviewer`、`last_changed_at`。格式变化只重算受影响列，避免无差别重跑全部材料。

### 4. 版本变化会使批准过期

Ironclad 的编辑/替换可能触发重新审批，Sign 回 Review 会 void 已发 envelope；Juro negotiation 每轮产生新 version；Litify/Word/CLM 均涉及外部文档同步。

所有 approval 绑定 `artifact_version_id/hash`。正文、关键元数据、signer 或 source set 变化后产生 `approval.invalidated`；系统要显示受影响批准，不得沿用旧绿色状态。

### 5. 批量动作先预览影响，再异步执行并报告部分失败

Everlaw 的 batch modify 先总结影响范围、后台运行、允许部分撤销，并可能 `Complete with errors`；Relativity 按 file/job exception 决定继续还是阻塞；DISCO 用 stage/batch 分配 review 并跟踪进度。

建议事件链：

```text
bulk_action.drafted
→ impact_preview(total, eligible, excluded, permission_denied, version_conflicts)
→ human_confirmed
→ queued/running
→ completed | completed_with_errors | failed | outcome_unknown
→ item_results + eligible_compensation/undo
```

外部系统超时进入 `outcome_unknown`；先核对远端状态，再决定 retry，避免重复签署、重复发送或重复扣费。

### 6. 权限至少拆成 visibility、action、approval、policy management

DISCO Restricted Reviewer 可看相关但不在批次内的文档，却不能操作；Ironclad 的 workflow/playbook/clause approver 权限不同；Clio 多角色继承最宽松权限；Spellbook 资源共享存在缺少 audit log 的反例。

单一 `role=lawyer` 不足。权限决策本身与 policy change 都要审计；source anchor 与导出也要按当前原件权限重新判断。

## 四、页面与工作面模式

此节总结公开页面/帮助文档支持的结构，并引用独立云端 worker 于 2026-10-28 核验的 42 项视觉观察。观察分为 `public_page_screenshot`、`official_documentation_embedded_product_image`、`official_video_frame`、`official_marketing_product_illustration`；均不是登录产品实测。图像 ZIP 已保存 Library，但本执行器未能材料化或做像素复核；本包按视觉账本编号、URL、状态与文字观察关联，不提供不存在的本地图片链接。

### 1. 双栏证据工作面

左侧回答/文书，右侧 authorities / clauses / findings，选中结果后跳到原件或 Word 位置。Vincent、Spellbook、Ironclad、Lexis、CoCounsel 都出现不同变体。它解决的是“判断与依据保持邻接”，代价是窄屏、长来源列表和多层 sidebar 的空间冲突。

视觉观察强化了这一模式：Vincent 的 Legal Authorities 面板按来源类型计数并列出摘要/引用摘录；Spellbook 的失败规则卡把理由、来源气泡、Show Rule 和 Add Language 放在同一上下文；Ironclad 将合同正文、Clause List、suggested redlines 与 exception request 分层；CoCounsel 官方演示帧把 Word 草稿和权威链接结果并置。这里观察的是官方材料呈现，不是对结果正确性的验证。

### 2. 列表/详情不是简单导航，而是批量与责任边界

Clio matter list→matter dashboard；eDiscovery document list→viewer/coding panel；Ironclad Dashboard→workflow/record；Legora/Vincent 的 table→cell/source。列表负责筛选、选择、批量和进度，详情负责依据、编辑和决定。把两者合成聊天流会丢失 scope 与责任。

DISCO 官方文档嵌入图给出更明确的角色分面：配置者在 Decision Pane Editor 组合编码组件，reviewer 在三栏 viewer 中只看到所需决策、PDF 与相关文档/metadata，batch 另有领取、进度和 check-in；Pace/Metrics 再用于团队与个人质控。图中日期为历史示例，只能支持对象和布局关系。

### 3. Command plane 与 domain workspace 分离

AI-native 产品把 Assistant/Agent 作为入口，但有价值的结果落在 Project、Vault、Table、Editor、Workflow run 或 Portal。Command plane 负责意图和调度，domain workspace 负责版本、权限、协作和交付。

### 4. Progress 不是 spinner

长任务需要展示当前阶段、已处理/总量、等待用户输入或批准、可取消性、局部失败与恢复动作。Legora 公共 MCP 文档区分运行计算、等待回答、等待批准；eDiscovery 进一步把异常按 blast radius 分类。

### 5. 空态、失败态与可访问性仍是最大证据缺口

公开帮助很少完整展示无材料、无权限、索引失败、失效引用、多人冲突、键盘/焦点、缩放与屏幕阅读器行为。截图也只能说明可见风险，不能证明可访问性合规。产品建设必须用真实运行与 fixture 单独验收。

## 五、商业与服务：不要只存一个 price 字段

| 商业对象 | 代表样本 | Agent/采购系统需要保存 |
|---|---|---|
| 软件订阅 | Clio 按用户/套餐；Spellbook 按 team member 定制 | plan、seat/team、term、usage limits、region |
| 内容授权 | Westlaw、Lexis、vLex、北大法宝 | corpus/jurisdiction、引用/再分发/缓存/训练权、许可期限 |
| 用量钱包 | 法大大签署份数、通义法睿页/次、得理合同审查次数、eDiscovery 数据量 | metric、reserve/consume/release、余额、超额与到期 |
| 实施项目 | Juro Legal Engineers、Ironclad/partner、法大大混合云 | migration、template/rule config、integration、milestone、acceptance |
| 培训与 customer success | Spellbook group/team training、Clio training/data migration、Relativity Success tiers | audience、sessions、渠道、服务时段、named owner、响应目标 |
| 专业/法律服务 | 得理 AI→律师、出证/公证相关服务 | 执业/服务主体、冲突检查、委托成立、责任与交付验收 |
| 平台转介 + 受托律师 | Lawhive Ltd 平台/通信/文档/支付；具体 Lawyer 提供法律服务 | platform operator、actual retained lawyer/firm、client care、conflict/KYC、scope、prepayment、professional liability |
| 交易/第三方费用 | Clio payment、e-filing；签署/出证增购 | event、rate、processor、minimum、tax |

官方没有金额时写 `quote_based` 或 `not_found`，不能写免费。试用、学术 access 或被动接收签署也不等于通用免费层。

当前公开价格样本：Clio 美国页当前分为 Starter / Core / Signature / Elite；只有 Starter 显示 `starting at $49/user`，其余为 `Get pricing`，不能把起价扩展成统一单价。Westlaw Edge AI-Assisted Research 在 2026-10-28 抓取的 law firm / 1 attorney 状态下，single circuit `$170.95/month`、All States and Federal `$292.50/month`。本轮文本抓取没有保留可复现的 term 选择；这些金额受地区、客户规模、内容范围、期限和促销影响，不是行业基准或正式报价。

## 六、中国产品的独特信号

中国样本的价值不在补齐地域名额，而在显示三类商业/机制差异：

1. 电子签约把版本订阅、签署用量、API/集成、审批/比对/履约增购、混合云和出证拆开；法大大公开帮助还说明“免费版（非售卖）”，不能把它写成免费套餐。
2. 法律内容开始以 MCP/API 工具化：北大法宝公开法规/案例检索、法条/案号识别、引用校验、文档超链与统一鉴权；能调用不等于能缓存、再分发或训练。
3. “AI + 律师”同时包含软件输出与专业服务：得理的 AI 基础解答、律师匹配/协同办案、律所 SaaS、开放平台/API 是不同交付，必须在冲突检查、委托成立和责任边界上分开。

中国广索引共 10 个候选；法大大、北大法宝 MCP、得理形成局部深描。契约锁、上上签、通义法睿、Alpha、MeFlow、威科先行、法信作为部署、计费、内容许可或服务边界的补充。它们不计入 12 个完整深描，因为公开页面尚不足以支持同等粒度的编辑器/失败/权限状态。

### Lawhive：平台、AI 与受托律师必须拆开

Lawhive 官方条款支持的结构不是单一 SaaS 或简单 marketplace：Lawhive Ltd 运营网站、转介与通信/文档/支付平台，但不是律所；客户通过平台直接聘用具体 Lawyer。受托者可能来自关联的 SRA 受监管 Lawhive Legal Ltd，也可能是其他律所、freelance solicitor、sole practice、licensed conveyancer 或 CILEX lawyer。浏览网站、提交 inquiry 或取得 quote 都不等于专业委托已经成立。

公开材料支持这些状态/闸门，但不是一条已验证的通用线性漏斗：`visitor / enquiry / case information / quote or callback / lawyer candidate / conflict-KYC / client care-direct engagement / prepayment / written instructions / matter active`。条款只确定 conflict 与 identity/KYC 在接受客户/指示前、款项到账在 Lawyer 开工前；quote、律师分配、client-care、付款与指示的实际先后可能按案件变化。多个服务页宣传 fixed fee，但首页/关于页也允许 hourly；应记录为 `case_and_service_specific`，不能概括成全站统一固定费。

AI 页面说明律师侧 associate 可用于法律问答、drafting 与沟通；条款则把法律服务和客户建议责任放在具体 Lawyer。由此只能推断 AI 结果是候选工作材料；“律师强制审阅→采用→批准外发”的 gate 是建设建议，不是已观察的产品状态。Agent 应分别记录 `candidate_text_adopted`、`client_instruction_confirmed` 与 `approved_for_external_use`，并在外发前校验实际受托主体、scope、conflict/KYC、付款和版本。

独立云端 worker 另核验英国公开 intake 首步：`Tell us about your case`、三段进度、自由文本、日期/截止/目标提示与 Continue；未输入、未提交，也未测试报价或律师分配。初访 US 地理分流弹窗会改变页面承诺；包内 UK 服务模式图是在选择留在 UK 站后获取，不能把 US 页面承诺套到英国流程。

## 七、Observed / inferred / proposed

### Observed

- 公开帮助文档明确显示：authority set、candidate revision、exception request、document approval、rule/configuration 是不同对象。
- 多产品把来源/原件定位放在结果旁边，且部分产品允许改变证据集合或恢复 AI 原值。
- 成熟 CLM / matter / eDiscovery 用稳定对象、版本、批次、审批和审计承载 AI 动作。
- 企业法律产品的收费常同时受席位、内容范围、用量、期限、实施与集成影响。

### Inferred

- 法律 Agent 的核心可追溯单元应是 run、finding、source anchor、candidate action 与 human decision，而不是消息。
- 证据集合、规则版本或原件版本变化后，旧结果与旧批准应进入 stale/invalidated，而不是继续显示“已完成”。
- 高风险批量动作没有 impact preview、item result 与补偿语义时，AI 只会放大错误半径。

### Proposed

- 为每个候选动作保存 `object_version_at_proposal`；版本变化后禁止静默应用。
- 用独立事件记录 `risk.accepted`、`candidate_edit.applied`、`rule_version.approved`、`exception.approved`。
- 规则采用 draft→peer review→approved→published→superseded，owner、approver、runner 权限分开。
- 导出物携带 source pointers、生成/人工修订状态、版本、权限/许可水印和未核实项。
- 对外写入超时保持 `outcome_unknown`，核对后再 retry。
- 任何 vendor-claimed AI 判断都在 UI 中标示为建议；专业责任人确认独立发生。

## 八、实现代价与反例

| 机制 | 主要代价 | 最容易犯的错 |
|---|---|---|
| 精确 source anchor | OCR/版本/span 稳定性、权限与索引同步 | 原件替换后仍跳旧片段 |
| Authority set 重算 | run lineage、缓存、引用重映射、费用 | 删除不利来源却不留痕 |
| Candidate revision | Word/editor tracked change、并发、撤销 | Apply 后误写成风险获批 |
| Version-bound approval | hash、失效传播、再审批路由 | 文档变化仍沿用旧批准 |
| Batch/queue/QC | 分配锁、上下文保持、部分失败、重跑 | 只给完成率，没有 item errors |
| Content license | corpus/version、再分发/缓存/训练条款 | 能 API 检索就假设可商业再利用 |
| Professional service handoff | 冲突检查、委托、执业主体、责任 | AI 转介提示被写成“律师已接案” |

## 九、证据等级、截图与未核实项

- 完整深描：12；Harvey 聚焦深描：1；Lawhive 服务模式对照：1；中国局部深描：3；广索引候选：24。
- 结构化去重 URL：153；Exa 实际返回/检查槽位：1,171。
- `verified_product_interaction = 0`；没有登录后亲自操作。独立云端 worker 只在公开 Clio 价格页切换 AI 页签、展开 Relativity 文档、播放/暂停官方培训视频；这些动作不升级为产品实测。
- 视觉观察：42 项已核验，其中含公开页面、官方文档嵌入产品图、官方视频帧和官方营销产品图；逐项见 [视觉观察账本](../05-evidence/visual_observation_ledger.md)。图像 ZIP version 1 已获用户批准并独立保存到 Library（`libfile_a88ad92f6b5c81918600d90b21bc2ac0`，上游报告 SHA-256 `6d343bf83a676f0ad03501085b7ecdbeb9a196f3153d29d5bf40491ef3d74284`）。本研究执行环境未材料化或本地复核该版本字节；图文关系依赖 worker 的已核验账本。
- 时效限制：RelativityOne 旧 URL 已转到 `RelativityaiR` 文档（页面显示 2026-09-17 更新），但嵌入空工作区截图仍显示 RelativityOne；Vincent 支持页在本次浏览器中呈现原始 Markdown，其媒体 URL 所得图像只算官方产品图片，不算网页设计或产品交互。
- Harvey 与 Legora：补充包已加入两家的官方营销产品图。Harvey 图支持 Agent 配置、逐条红线决定/先例分布与组合层洞察的公开设计叙事；Legora 图支持 Word 内逐条建议、Playbook 状态与批量 Apply 的公开设计叙事。它们均不是完整真实窗口或插件/Agent 实测，不能证明运行结果、权限或性能，也不能用其他厂商图替代。
- 不能验证：登录墙内导航、真实空态/错误/权限拒绝、撤销粒度、多人冲突、键盘/焦点/屏幕阅读器、动态套餐完整金额、销售报价、证书原件、私有化架构、内容再分发许可和法律服务委托责任。
- 帮助文档只能支持“厂商公开描述的流程”，不构成产品审计；vendor claims 不能升级为独立效果或安全验证。

## 十、Agent 取用顺序

1. 从本文件选工作域和机制。
2. 进入对应分域深描，确认对象、状态、权限、人审点和未知。
3. 用 JSON 索引定位产品/来源与视觉观察账本；图像 ZIP 由父任务按账本编号和 `visual_handoff_manifest.json` 关联。
4. 进入来源账本或原始 URL 复核时间边界。
5. 只把 `observed` 投影为设计约束；`inferred` 作为假设；`proposed` 进入需求评审，不冒充行业事实。

全局 `source_ledger.json` / `source_ledger_full.csv` 按 URL 去重，方便检索但不保留所有产品内 source alias；产品 JSON 内的 `source_id` 与引用关系是机器反查的权威来源。不要把全局账本中空或代表性的 `source_id` 解释成悬空产品引用。

---

本文不复刻厂商专有设计。它提供的是可回查的业务对象、状态转移、人审边界、商业对象、迁移条件、实现代价和反例。
