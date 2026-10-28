# Harvey 聚焦深描：Harness、Playbook、Source 与多文档工作面

采集日期：2026-10-28（UTC）  
定位：在 12 个完整深描之外增加的证据分级聚焦条目；用于补强用户现有法律 Harness 参考。  
方法：Exa 10 个检索式、86 个请求/返回槽位；深读 8 个 Harvey 官方帮助、开发者、产品与条款页面。  
证据边界：公开文档间接观察，不是登录后实测；Harvey II 在 2026-10 持续更新，帮助页明确提示不同账户界面可能不同。

## 结论

Harvey 的关键不是一个 Assistant，而是四层工作面：

1. **Command plane**：Sidebar / Global Search / Assistant，负责找到对象、给出意图和调度来源。
2. **Domain workspace**：Vault、Review Tables、Playbooks、Workflow Agents，把材料、规则、运行和结果变成可版本化对象。
3. **Verification plane**：句子级/文档内 citations、reasoning、cell verification、原件跳转。
4. **Governance plane**：Playbook managers、Run/View/Edit/Full 权限、sharing-level approval、connector/tool human confirmation。

这一分层与 Harness 建设高度相关：右侧侧栏不是“再放一个聊天框”，而是呈现当前对象的 source、rule、finding、candidate edit、review progress 和 human decision。

证据等级：

- **A-**：导航、Playbook Review、Playbook Builder、Review Table 数据对象与主要动作，均有 2026 官方帮助/开发者文档。
- **B**：Agent/Workflow sharing governance 主要来自 2025–2026 release notes 与 topic pages，当前帮助正文的精确按钮和失败状态仍不足。
- **C/unknown**：公开定价、登录后空态/失败/撤销、多人并发冲突、完整审计导出与实施服务收费。

### 官方演示图补充（非产品实测）

[Contract review agents in Harvey](https://www.harvey.ai/blog/contract-review-agents-in-harvey) 的三张官方博客产品演示图由独立云端 worker 于 2026-10-28 核验：

- agent setup 将 Instructions、Files（Playbook / Precedent Bank / Negotiation Guidelines）、Sources、Connectors、schedule 与 Run agent 放在同一配置面；这支持“定义/知识/连接器/调度”是独立对象。
- benchmark 图把合同红线、建议卡、Sources、`Modify language / Accept their edit / Reject their edit` 与先例分布、Playbook Standard Position 同屏；它支持候选动作与证据邻接，但不证明模型判断正确。
- Contract Intelligence 图展示 Overview / Agents / Insights / Assignments、标准坚持/争议/回合等示例指标，并建议将成交 fallback 反馈给 review agent。图中数字是示例，不是业务绩效。

这些均为 `official_marketing_product_illustration`，未播放视频、未登录、未运行 Agent。它们支持“配置→逐条决定→组合洞察反馈标准”的公开设计叙事，不支持性能、权限、失败或真实闭环效果验证。

## 1. 导航与工作对象

[Getting Started with Harvey](https://help.harvey.ai/articles/getting-started-with-harvey)（更新 2026-10-07）列出 Sidebar、Global Search、Assistant、Vault、Workflow Agents、History、Library。Global Search 可查 vault、Assistant thread 和 saved Workflow agent；Vault 在侧栏有可折叠子栏，折叠偏好会保存。

核心对象：

| 对象 | 公开页面支持的关系 | Harness 含义 |
|---|---|---|
| Assistant Thread | prompt + uploaded documents + selected knowledge sources；答案链接到所用 source | 意图/调度层，不应独占版本与审批 |
| Vault | 大量文档、targeted Q&A、bulk summary、Review Table、Vault agent | 业务材料作用域与权限边界 |
| Review Table | 文档/文件组为 row，问题为 column，cell 保存答案/推理/引用/核验状态 | 多文档结构化审阅的稳定工作面 |
| Playbook | rules、standard/fallback position、guidance、human action/escalation | 规则对象与合同审阅策略 |
| Agent/Workflow | guided inputs、tools、embedded files/vaults/knowledge、run/share | 可复用任务定义与运行实例 |
| History / Library | 过去运行/材料与可复用 workflow/table/prompt/playbook | 检索、复用、治理，不是产品营销入口 |

帮助页同时声明 Assistant 不擅长自动发现多文档矛盾，两个版本比较应使用 Redline workflow。这是一条产品自述的适用边界，不应把通用 Assistant 当成所有工作面的替代品。

## 2. Contract Playbook：rule → finding → candidate redline → human decision

[Harvey for Word: Playbooks Guide](https://help.harvey.ai/articles/word-add-in-playbooks-guide)（更新 2026-06-02）给出公开证据最完整的合同链：

1. 在 Word 打开合同，底部导航选择 Playbooks。
2. 选择 Playbook，运行全部 rules 或选中的 rules；可先配置 representing party、paper type、review mode 与 additional context。
3. 每条规则得到 `Acceptable`、`Needs review`、`Not acceptable`。`Needs review` 表示符合 fallback、需要律师判断；不是系统已接受风险。
4. Rules view 按文档出现顺序列规则；侧栏另有 `Provisions Not Covered by Playbook` 与 escalation flags。Suggestions view 提供压缩的建议列表。
5. 选择 recommended language 后展开并跳到文档对应位置；可直接 `Apply`、先手工 edit、用 magic edit 改写、`Dismiss` 或 `Ask for revision` 后重跑该 rule。
6. 应用后以 redline 写入文档；可附 comment。`Apply all suggestions` 批量形成单一 redlined document，也可批量附 comments。
7. 用户可把 rule 标为 reviewed；suggestion 变灰，顶部 progress bar 更新。这是 review progress，不是风险批准或文本采用。

三类事件必须拆开：

| 页面动作 | 被操作对象 | 合理事件 |
|---|---|---|
| Mark rule reviewed | finding/review item | `finding.reviewed` |
| Apply / Dismiss / Ask for revision | candidate redline | `candidate_edit.applied|dismissed|regenerated` |
| Edit positions and guidance | Playbook rule definition | `rule_version.edited`；是否可发布仍受权限/分享治理 |

公开帮助没有证明 `Apply all` 的 impact preview、partial failure、undo 或多人冲突；这些状态保持 `unknown`。

## 3. Playbook Builder：从先例形成规则，但 Save 不等于组织批准

[Create a Playbook](https://help.harvey.ai/articles/create-a-playbook)（更新 2026-07-20）支持两条创建路径：

- 从 Harvey template 手工建立；
- 用 Playbook creation agent，从现有 playbook、最多 10 份已谈判合同、Vault files、标注合同 comments、Harvey template 或空白开始。

Agent 会提出规则、追问澄清、形成 rule table、explanations 和回到源文件的 citations。编辑器左侧是 rules list，可搜索、增删和拖动排序；右侧编辑 guidance、positions、conditional rules、optional rule，以及需要人工步骤/升级的 Action（含 Scenario 与 Instruction）。Assistant 编辑模式与手工 panel 可来回切换，最后 `Save`。

公开文档支持 view/edit access 与 Playbook manager；release notes 还显示版本历史和谁修改了什么的产品方向。它没有支持一个稳定、跨租户一致的 `draft → peer review → approved → published → retired` 完整状态机。因此：

- `Save`：规则版本已保存。
- `Share`：向指定用户/范围开放。
- `Approved organization policy`：只有在组织配置明确要求且审批完成时才能成立；本轮公开证据不足以一概而论。

## 4. Review Tables：跨文档抽取、右侧解释与 cell 人审

[Review Tables](https://help.harvey.ai/topics/review-tables) 与 [Review Table API guide](https://developers.harvey.ai/guides/review_tables) 支持如下对象关系：

- 一个 row 对应一份 document 或 file group；一个 column 对应一个问题。
- cell 可含短答、reasoning、supporting citations、verification/flag status；user-edited value 优先于 AI-generated value。
- conditional column 可引用前列回答，形成后续逻辑；新增文档可沿用既有 columns，而不重建整张表。
- 2026 release notes 明确给出 inline edit、comment、refresh、verify、activity tracking、cell lock、cell-level refresh 和 sentence-level citations；cell lock 会阻止 edit、re-run 或被其他用户覆盖。
- 导出可带 source text snippets；大型导出后台运行，完成后通知并在 dedicated view 查找。

适合右侧卡片/侧栏的最小信息：

```text
Cell answer
Reasoning
Sentence-level source anchors
AI value / human value
Verified / flagged / locked
Comments and activity
Refresh eligibility
```

公开资料没有说明 cell 冲突合并、批量 edit 的预览/undo、verified 后 source 改变的 stale 传播；这些是 Harness 必须补的实现约束。

## 5. Agent / Workflow：定义、运行与分享治理

[Agents & Workflows](https://help.harvey.ai/topics/workflows) 列出 Workflow Builder、custom agents、run/schedule、permissions/sharing、embedded Vault/knowledge sources 和 admin management。2026-10 release notes 说明：agent/workflow 保存后即可自用；是否需要 admin approval 取决于组织对 sharing level 的选择。2026-03 资料列出 `Run / View / Edit / Full` 四种 access；2025-09 的“请求 publication approval”是较早状态，不能无条件当作 2026 的现行全局规则。

因此应把定义与运行分开：

```text
AgentDefinition(draft/saved, owner, tools, embedded_sources, access_policy)
  → ShareRequest(scope, requested_access)
  → approval_required? pending : shared
  → AgentRun(inputs, actor, status, outputs, human_confirmations)
```

Harvey Connector Library 公开写明：workspace admin 可选择谁/哪些 group 能用 connector、开放哪些 tools、哪些 tool 调用必须 human confirmation。连接 iManage、Teams、Outlook、Everlaw、Docusign、Datasite、NetDocuments、Box、Drive、SharePoint 等时，Harness 必须保留 connector scope、source system identity 与 confirmation policy。公开通用页面没有证明每个 connector 都继承底层对象权限、ethical wall 与撤权状态；“Agent 能调用不等于用户对底层对象有权限”是 `inferred / must_verify_per_connector` 的建设边界，不是已观察的 Harvey 保证。

## 6. Source 回溯

已观察的三种 source 指针：

1. Assistant 回答链接到所用 knowledge source 或上传文档。
2. Review Table cell 保存 reasoning 与 sentence-level citations，API 也返回 citations 与 verification status。
3. Harvey for Word 的 in-document / edit citations 把回答或建议修改定位到当前文档段落、上传材料或 precedent。

它们分别服务研究回答、批量抽取和候选文本，不应统一成“来源链接”。最小 anchor 应包含 source system、document/version、span/paragraph、claim/cell/edit relation、权限与 stale 状态。

## 7. 商业、服务、集成与安全边界

- 公开页面没有固定价格或收费单位；本轮只能记 `public_price = not_found`、`commercial_model = unknown`，不能自动推成报价制，更不能写免费。
- [Harvey Academy](https://help.harvey.ai/articles/harvey-academy) 与帮助中心支持 onboarding/training；具体实施、customer success 和专家服务收费范围未公开。
- Service Terms 明确某些 Targeted Source、Ask LexisNexis、Covered AI Services 可为 Basic Service 之外的单独能力，并可能有不同的存储/处理位置或保留条件。软件、内容/外部 source、connector 与附加服务必须分开看。
- Connector Library 的认证与安全表述、Harvey 的数据隔离/加密/认证均为 `vendor_claim` 或合同承诺；没有在本轮独立审计证书。
- 外部 connector 调用涉及原系统许可、ethical walls 和 human confirmation；底层 object permission / ethical wall 是否逐 connector 继承属于 `inferred / unknown`，必须在各连接器文档和真实权限拒绝场景中验证。

## 8. Observed / inferred / proposed

### Observed

- Sidebar / Global Search / Vault sidebar / Assistant / Library 把命令入口与业务对象分开。
- Playbook Review 提供 rule 状态、解释、原文定位、candidate redline、逐条/批量处置与 progress。
- Playbook Builder 可从先例提炼规则并附 citations；Review Table cell 保存答案、推理、引用与人审状态。
- agent/workflow sharing 有 Run/View/Edit/Full 等访问层，admin approval 是否触发取决于 sharing policy。

### Inferred

- 右侧侧栏适合承载当前对象的 evidence、rule、finding、candidate action 与 human decision；聊天只负责发起/追问。
- Playbook rule edit、contract suggestion apply、finding reviewed 需要不同事件，否则 audit trail 会把“看过”误成“采纳”。
- Review Table 的 user-edited precedence 若没有原 AI value、source version 与 stale 传播，会产生不可见的数据漂移。

### Proposed

- `RuleVersion` 加 draft/saved/share-policy/approval-required/published/superseded；公开证据只支持部分环节，完整生命周期是建设建议。
- `BulkApply` 前展示命中、未覆盖、无法处理、权限拒绝与 version conflict；执行后逐项结果与补偿动作。
- `SourceAnchor` 在 Word、Vault、Table、Assistant 和导出物间保持稳定 identity；原件更新后标 stale。
- 侧栏把 `Accept risk`、`Apply text`、`Approve rule` 做成不同控件和权限，不复用一个 `Approve`。

## 9. 明确证据缺口

- 未登录，未观察真实 Harvey II rollout、账户级功能差异、视觉密度、空态、error、timeout、无权限拒绝和键盘/焦点。
- Playbook `Apply all` 的 preview、partial failure、undo、version conflict 未公开。
- Playbook 规则的 peer review、组织级发布审批、retire/rollback 不是公开稳定状态机。
- Review Table verified/locked 后上游文档变化如何失效、多人同时 edit 如何冲突处理未公开。
- Agent run 的 queued/running/waiting-for-human/failed 细状态与取消/重试未取得同等质量证据。
- 定价、席位/用量、实施包、support SLA 与私有化/数据驻留报价需销售或合同材料；本轮未联系销售。

## 10. 待补拍公开页面

| ID | URL | 页面/状态 | 证据类型 |
|---|---|---|---|
| HV-01 | https://help.harvey.ai/articles/getting-started-with-harvey | Sidebar、Global Search、Vault sidebar、Assistant/Library 图 | 官网帮助截图；非实测 |
| HV-02 | https://help.harvey.ai/articles/word-add-in-playbooks-guide | Rules/Suggestions view、三种 outcome、recommended language、progress、Apply/Dismiss | 官网帮助截图；非实测 |
| HV-03 | https://help.harvey.ai/articles/create-a-playbook | 左 rules list / 右 editor、citations、guidance、Action | 官网帮助截图；非实测 |
| HV-04 | https://help.harvey.ai/topics/review-tables | cell edit/verify/comment/activity 与 source | 官网帮助截图；非实测 |
| HV-05 | https://help.harvey.ai/release-notes/category/review-tables | sentence-level citation、cell lock、export状态 | 官方 release notes 截图 |
| HV-06 | https://help.harvey.ai/topics/workflows | builder、Run/View/Edit/Full、sharing approval | 官网帮助截图；非实测 |

没有截图不会取消本条目；只表示视觉结构与交互质量仍待父任务浏览器 worker 或后续授权环境补证。
