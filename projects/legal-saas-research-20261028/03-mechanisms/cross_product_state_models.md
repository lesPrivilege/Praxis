# 跨产品状态模型与原子机制

采集日期：2026-10-28。以下均为公开页面或官方帮助文档的间接观察，不是登录后实测。

## 1. 研究问答：不是“答案 + 引用”，而是可重算的证据选择

### Vincent：问题 → 辖区 → 研究运行 → 备忘录 → authority 选择 → 重算

证据：vLex 帮助中心明确写出：先选择 jurisdiction 并发起研究；结果区左侧为答案，右侧为 authorities；备忘录分 Short Response、Detailed Analysis、Exceptions and Limitations；每个 authority 提供 source link、summary 与 excerpt；用户可在 `Modify list` 中取消某些来源后 `Apply`，系统据新的来源集合重新生成；可导出 PDF/Word 或复制。[S-MECH-001](https://support.vlex.com/vincent-by-vlex/vincent/core-workflows/ask-a-research-question)

可迁移原子机制：

1. `ResearchQuestion` 带 jurisdiction 等边界条件，和自由文本问题分开存。
2. `ResearchRun` 是有进度的运行对象，不应只保存最终聊天消息。
3. `AuthoritySet` 是可编辑输入；改变集合触发新一轮生成，不能悄悄改写原结果。
4. `MemoSection` 明示正面结论、分析、例外/限制，避免把反例藏进尾注。
5. `CitationAnchor` 同时指向来源、相关摘录和回答片段；“能打开来源”与“支持当前句子”是两层关系。

实现边界：当前证据没有说明权限继承、版本间 diff、删除来源后的审计记录或失败恢复，均为 `unknown`。

### Lexis+ with Protégé：生成内容 → Source Link → 上传原件中的精确片段

LexisNexis 产品负责人文章称，Source Link 可在问答、`Upload & Draft`、`Upload & Summarize` 中把生成内容定位到用户上传文档的支持片段。[S-MECH-002](https://www.lexisnexis.com/community/insights/legal/b/product-features/posts/3-ways-the-new-source-link-feature-in-lexisnexis-protege-builds-trust-in-legal-ai) 这是厂商产品说明，不能据此推断定位准确率或端到端审计。

可迁移条件：

- 原件必须有稳定文档 ID、版本 ID 和可重现的 span/页码定位。
- 生成句与来源片段宜形成多对多关系；单个“来源链接”不足以表达同一句由多处共同支撑。
- 原件替换、OCR 变化或权限变化会使 anchor 失效，需要 `stale` / `unavailable` 状态。

### CoCounsel Legal：草稿中的 authority 核验 → 推理 → tracked revision → 接受/拒绝

Thomson Reuters 官方培训页称，CoCounsel Legal 在 Microsoft Word 中将 brief 的标准和引用与 Westlaw/KeyCite 核对；可控制 Auto-edit，并逐步审查 agent reasoning，对 tracked revisions 执行 accept/reject。[S-MECH-003](https://training.thomsonreuters.com/media/How+to+verify+authority+in+a+draft+brief/1_t5faxrhc/384481072)

这里“接受”的对象是对草稿的候选修改，不是接受法律风险，也不是批准核验规则。产品建设时至少拆开：

- `VerificationFinding`：某段主张/引用的核验发现；
- `CandidateEdit`：针对草稿的修改候选；
- `EditDecision`：接受或拒绝候选修改；
- `AuthorityStatus`：来源是否有效、是否有负面处理等独立结论。

## 2. 合同审阅：三种“接受/批准”必须建成不同事件

### Spellbook：规则判断与候选修订分层

官方帮助文档描述两种审阅：Playbooks（规则/问题驱动）与 Comprehensive Review（AI 发现问题与建议）。Playbook 结果把 rules 与 questions 分页；规则可 pass/fail，回答可带编号引用跳到原文；失败规则可生成 revision，用户可 `Show`、`Dismiss`、`Apply`、`Regenerate`、`Ask for Changes` 或手工 `Edit`。[S-MECH-004](https://help.spellbook.legal/en/articles/9926203-spellbook-overview)

Redline Review 的运行目标可选 full document 或 redlines only。官方文档将结果定义为 `Accept Redline`、`Reject Redline`、`Accept/Reject with Revision`、`No Relevant Redline`；执行建议动作后，对应 rule 标记 completed。未被规则覆盖的 redline 只摘要、不建议动作。[S-MECH-005](https://help.spellbook.legal/en/articles/13875622-first-party-playbooks-redline-review)

Playbook 规则还可包含 internal note、preferred language、suggested comments、fallback position、risk level，以及 `Requires approval from` 某 reviewer。[S-MECH-006](https://help.spellbook.legal/en/articles/11525082-customize-playbooks)

由此得到三种独立对象：

| 事件 | 被操作对象 | 合理的状态 | 不应等同于 |
|---|---|---|---|
| 接受风险 | `ReviewFinding` / `Deviation` | open → risk_accepted，带理由、范围、责任人 | 把某段候选文本写入文档 |
| 接受候选文本 | `CandidateRevision` / `Redline` | proposed → applied / dismissed / superseded | 规则本身获得治理批准 |
| 批准规则 | `PlaybookRuleVersion` | 建议状态：draft → approved → active → retired | 某次交易中的例外获准 |

“规则版本生命周期”是本研究的 `proposed` 建议，不是 Spellbook 或 Ironclad 已公开证明的完整现状。反例：把 `Apply revision` 后规则变成 passed，误写成“风险已被批准”。这最多说明文本已解决该次规则检查；是否接受风险、是否需要指定 approver 仍由独立对象决定。

### Ironclad：标准条款 → 修改或 skip → 条款例外审批

Ironclad 帮助中心描述：workflow 启动后，AI Playbooks 在审批前读取文档并标记非标准条款；用户可在 workflow 页面或右侧 Clauses 列表查看；可插入/替换为预批准语言，也可 `skip`，后者需要额外 clause approver；对非标准条款可 `Request an exception`，选择 approver 与理由，并在 workflow 的 Approvals 区域跟踪。[S-MECH-007](https://support.ironcladapp.com/hc/en-us/articles/12275585451159-Use-Playbooks-in-Workflows-and-Contract-Reviews)

这条链路把“修改以满足规则”和“保留偏差并请求例外”做成两条分支：

```text
Deviation detected
  ├─ insert/swap approved language → document changes → rule re-evaluated
  └─ keep non-standard language → exception request(reason, approver) → pending/approved/rejected
```

所需业务对象与事件：`ClauseDeviation`、`ApprovedLanguageOption`、`ExceptionRequest`、`ApprovalAssignment`、`ApprovalDecision`、`ReminderSent`、`DocumentRevisionApplied`。例外审批必须记录其所批准的具体 clause/version；否则合同变化后原批准会被错误复用。

Ironclad FY2026 product description 同时给出 Workflow Designer、launch forms/dynamic templates、roles/approvals、workflow test/preview、repository、activity feed、turn tracking、AI properties、Smart Import 等边界，并多次限定为受配置、权限、数据质量、human review 和 usage limit 约束。[S-MECH-008](https://legal.ironcladapp.com/fy2026-product-descriptions) 这是合同化产品描述，适合界定能力范围，不构成效果验证。

## 3. eDiscovery：批量吞吐与逐件专业判断共存

### DISCO：search result → review stage → group/order/batch → reviewer → decision pane → progress/QC

DISCO 帮助文档把 review stage 建成一组配置对象：最多 20 个 search sources；可保持 family/conversation；按 custodian、document type、ingest session 等分组；设置 batch size；配置 decision pane；分配 Admin、Reviewer、Restricted Reviewer；后者只能在已分配 stage/batch 内行动，相关但不在批次内的文档只能查看上下文；管理员可查看 progress、reassign batch，并做 QC。[S-MECH-009](https://support.csdisco.com/hc/en-us/articles/205833693-Using-review-stages)

可迁移原子机制：

- `ReviewStageDefinition` 保存来源查询、分组/排序、family/conversation 保持策略和 decision schema。
- `Batch` 是稳定的工作分配单元；`checkout`、`reassign`、`checkin` 应为审计事件。
- `DecisionPaneSchema` 是版本化表单；schema 变化不能悄悄改变已完成判断。
- `RestrictedReviewer` 的“可看相关文档但不可操作”体现 context access 与 action permission 分离。
- QC 不是普通 review 的同义词，应有抽样/全量范围、规则和处置结果。

### RelativityOne：工作区导航本身就是流程模板

RelativityOne 的 aiR Review template 通过默认可见/隐藏 tabs、views、dashboards、saved searches 和 layouts 编排 review→QC→production。公开文档列出 1st/2nd level review 的 reviewed/unreviewed views、responsive/privileged/redacted/produced views，以及 QC、pre-production QC、production QC、review status 等 dashboard；sidebar 还分 Review Queues、Documents、Review Center、Processing、Search Setup、Imaging & Production、Review Management、Workspace Setup、Admin。[S-MECH-010](https://help.relativity.com/RelativityOne/Content/Getting_Started/Review_Template/RelativityOne_Review_workspace_template.htm)

迁移启示：复杂工作台不必把所有能力塞进单页。可以把“角色当前要做的事”固化为 view/dashboard/saved search 组合，同时保留管理员对底层对象的访问。代价是模板版本、隐藏导航、权限和本地配置产生组合爆炸，需要明确的 workspace template version 与 change log。

## 4. 建设参考：observed / inferred / proposed

### Observed

- 多个成熟产品把来源或原件定位放在结果旁边，而非仅在报告尾部。
- 合同审阅把规则结论、候选文本、例外审批拆成不同工作对象；至少 Spellbook 与 Ironclad 的公开文档支持这一点。
- eDiscovery 以 stage、batch、decision schema、reviewer assignment 和 QC 管理吞吐与责任。

### Inferred

- 法律 Agent 的核心可追溯对象不应是“消息”，而应是可版本化的 run、finding、source anchor、candidate action 与 human decision。
- 让用户修改来源集合后重算，比只提供“引用链接”更接近可审查研究过程。
- 权限模型至少要拆为可见性、可执行动作、可批准对象、可管理规则四层；单一 role 往往无法覆盖例外审批与受限 reviewer。

### Proposed

这些不是厂商现状，而是产品建设建议：

1. 为每个候选动作保存 `object_version_at_proposal`；原件变化后标记 stale，不允许静默应用。
2. 三类决定分别建事件：`risk.accepted`、`candidate_edit.applied`、`rule_version.approved`；例外另为 `exception.approved`。
3. 研究输出把 `AuthoritySet` 作为输入快照；来源增删产生新 run，并保留前后差异。
4. 批量动作先生成 impact preview（命中数、排除数、权限拒绝数、规则版本），再提交；未知结果单独保存，避免重复执行。
5. 对任何 vendor-claimed AI 判断，把“模型建议”和“专业责任人确认”分开呈现；系统不得用绿色状态暗示法律结论已获专业批准。

## 5. 代价与反例

| 机制 | 解决的问题 | 实现代价 | 反例/失效条件 |
|---|---|---|---|
| 精确 source anchor | 快速核验生成内容 | 文档版本、OCR span、权限与索引一致性 | 原件替换后仍跳到旧片段 |
| 来源集合可编辑并重算 | 把证据选择显式化 | run lineage、缓存、差异与费用 | 删除不利来源却不留痕 |
| 候选文本独立对象 | 可编辑、比较、撤销、审计 | 与 Word/编辑器 tracked change 对齐 | 把应用文本等同风险批准 |
| 例外请求 | 保留非标准条款且有人负责 | 路由、超时、替补、版本绑定 | 合同改版后沿用旧批准 |
| stage/batch/reviewer | 管理大规模审阅吞吐 | 重分配、一致性、锁与并发 | 批次边界拆散 family/context |
| QC 独立状态 | 在交付前捕获冲突与遗漏 | 抽样策略、复核资源、升级路径 | QC 只是完成率仪表盘 |

## 6. 未核实

- 上述产品登录后的实时界面、键盘/焦点、空态、网络失败、撤销粒度与可访问性未实测。
- 页面未公开的租户隔离、数据保留、审计日志可导出性、私有化部署和 API 行为需另行核对。
- 官方文档未给出的准确率、节省工时和法律结论质量不作推断。
