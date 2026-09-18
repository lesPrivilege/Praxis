# Artifact Grammar：工作动作先于文件格式

## 定位

用户明确提出两件事：要为 PM/FDE 岗位穷举需要撰写的文体 grammar，登记写法、内容编排和是否使用可视化；同时要适配高管及不同阅读风格/水平（T1/U）。用户随后把这个对话正式限定为一个可复用的 Reporting Kit，服务临时汇报、材料写作、PPT 式 HTML、内容编排、数据可视化和 Kill AI Slop（T2/U）。

历史回答的建议是把边界提升为 PM/FDE **Artifact Grammar**，并使用如下共同管线：

```text
source material
  → claim / evidence 编排
  → presentation grammar / writing grammar
  → renderer
  → review
```

PPT、HTML、PDF、Markdown 是不同 renderer；同一组判断应能针对 live、pre-read、独立阅读和 evidence appendix 改变表面，而不重新发明内容（T2/A）。这条管线是候选治理模型，不是仓库根架构事实。

## 稳定的最小元数据

每个 artifact 先选择工作动作，再选择文体。回答提出的登记字段可整理为：

```yaml
artifact:
  name:
  lifecycle_stage:
  intent: inform | explore | align | decide | approve | execute | handoff | learn
  primary_audience:
  decision_owner:
  reading_mode: live | pre-read | async-reference
  attention_budget:
  required_claims:
  required_evidence:
  required_ask:
  structure:
  visual_grammar:
  prohibited_visuals:
  appendix_policy:
  source_policy:
  writing_profile:
  lifecycle:
  review_checks:
```

最有承重力的选择顺序是：

```text
intent → audience → decision → evidence → visual → surface
```

同一事实从 `inform` 变成 `approve`，不能只改标题；证据顺序、trade-off、风险与 ask 都应重新编排（T1/A）。

## Artifact lifecycle 与文体 registry

下面把历史回答的完整清单压成可检索登记。每行的 visual 是首选语言，不是强制模板；一个 artifact 可以组合多个 primitive。

| 阶段/组织动作 | 典型文体 | 主要问题 | 候选 visual grammar |
|---|---|---|---|
| **Discover** | Discovery memo、Field note、访谈 synthesis、Current-state brief | 现实怎样运行，问题是否真实 | workflow、swimlane、system map、evidence table、quote + observation |
| **Frame** | Problem brief、Opportunity memo、Product brief | 什么问题值得解决，边界在哪里 | problem tree、journey、规模数字、before-state |
| **Research** | Market scan、competitive analysis、technology scout、vendor comparison | 外部选择与证据是什么 | matrix、landscape、timeline、small multiples、benchmark |
| **Decide** | Decision memo、Options memo、Strategy memo | 现在选哪个决定 | options × criteria、trade-off、scenario、sensitivity |
| **Invent** | PR/FAQ、future-state narrative | 成功后的用户体验是什么 | 文字主叙事，journey / target-state 辅助 |
| **Specify** | PRD、requirements brief、acceptance spec | 具体构建什么 | user flow、state diagram、requirements table、wireframe |
| **Design** | RFC、technical design、solution design | 如何实现、哪些问题未决 | architecture、sequence、data flow、dependency graph |
| **Record** | ADR / decision record | 为什么做这个决定 | 通常无图；必要时 option topology |
| **Evaluate** | Eval plan、benchmark report、experiment analysis、acceptance report | 是否有效、失败在哪里 | distribution、comparison、failure taxonomy、trace examples |
| **Sell internally** | Business case、investment memo、funding ask | 为什么值得投入资源 | waterfall、ROI、scenario、sensitivity、resource profile |
| **Deploy** | Deployment brief、PoV/pilot plan、implementation plan | 如何进入真实工作流 | current→target、timeline、RACI、integration map |
| **Operate** | 3P、weekly update、WBR/MBR/QBR、status report | 当前运行状况与异常 | stable KPI series、plan vs actual、small multiples |
| **Escalate** | Risk memo、issue brief、executive escalation | 哪个阻塞需要谁处理 | risk matrix、dependency chain、decision tree |
| **Recover** | Incident update、postmortem、COE | 发生什么、为什么、如何避免 | timeline、causal chain、impact table |
| **Adopt** | Change/readiness plan、training brief、adoption report | 是否进入真实工作流 | funnel、cohort、workflow adoption、before/after |
| **Handoff** | Implementation handoff、CS handoff、runbook | 知识如何留在组织 | ownership matrix、open-issue table、system map |
| **Executive** | Executive brief、board paper、pre-read | 高管需知道和决定什么 | 少量关键指标、options、risks、ask |
| **Customer-facing** | Solution proposal、executive readout、workshop pre-read、RFP/RFI | 如何形成共同问题定义与下一步 | workflow、architecture、value map、implementation sequence |
| **Demo** | Demo narrative、storyboard、demo script | 展示什么来证明哪个命题 | screen sequence、before/after、live evidence |
| **Career** | Case study、take-home、portfolio case、30/60/90 | 证明 PM/FDE 的判断与执行 | 与实际工作 artifact 同构，不另造面试腔 |

这份清单是“穷举候选”，不要求每个文体都有独立 Skill，也不表示每次任务都要生成一份材料（T1/A）。

## RFC、ADR 与其它边界

历史回答明确建议严格区分：

- **RFC**：仍待讨论的 proposal，必须暴露未决问题、替代方案和反馈入口；
- **ADR**：已经形成的 decision record，记录一个决定、context、decision 和重要后果；
- **Eval report**：证明质量/效果的证据包，不把建议写成已通过；
- **Executive brief**：把 decision owner 的 ask 放到读者一开始就能看到的位置；
- **Pre-read**：脱离讲解者仍需自足；
- **Live deck**：为现场口述留空间，页面更稀疏，但不能隐藏关键约束。

这些界限来自 T1/A；仓库既有 ADR/治理文件应优先于此处候选。

## Claim/evidence 与 review 的位置

Artifact 的内容不从模板起步，而从 claim 和 evidence 起步：

```text
claim
  → evidence / provenance
  → interpretation / uncertainty
  → decision or ask
  → delivery surface
```

每个页面或段落只保留一个主要阅读动作；详细规则见 [`claim-evidence.md`](claim-evidence.md)。事实状态、版本、单位、来源和 actual/forecast 区分属于内容 grammar，不应等渲染后才补脚注（T2/A）。

## 与本地设计规则的对接

本地快照提供了两个互补的约束：

- Courtwork 的 UX grammar 要先明确“对哪个对象做什么、什么条件可做、成功/失败留下什么、如何恢复”，并把对象、状态、权限和保存事实交回 owner；参见 [`local-design.md`](local-design.md)。
- career-kit 的汇报图式库要求先选 `Slide Job → Exhibit Family → Container → Notation`，并把 Diagram、Chart、Table、Card 的工作区分开。

因此 Reporting Kit 的 renderer 不能为了好看创造事实、权限、状态或数字；它只负责把已绑定的 claim/evidence 组织为相应阅读表面。

## 待核实

- 外部来源中关于 OpenAI FDE、Amazon/AWS、Anthropic Skills、Atlassian、McKinsey、Sequoia、Duarte、Fowler 等主张的原文需另行取证；chat 只有 20 个 citation placeholder。
- 哪些文体会高频出现、哪些应合并为 Skill、哪些要有 HTML renderer，需由本地实际任务量校准。
- 同一事实在 deck、HTML、memo 与 evidence appendix 的最小可追溯字段尚未在仓库中形成统一 schema。

## 来源

用户目标：T1/U、T2/U。  
Artifact registry、metadata、RFC/ADR、lifecycle 建议：T1/A。  
Reporting pipeline、claim/evidence、renderer、anti-slop 方向：T2/A。  
本地约束入口：`vault/snapshots/local/courtwork/engineering/design/ux-grammar.md`、`vault/snapshots/local/career-kit/10-Vault/地基/企业汇报图式库/绘制规范.md`。

