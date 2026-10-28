# 合同审阅、Playbook 与 CLM 深描

采集日期：2026-10-28（UTC）  
方法：Exa 25 个检索式，共 `sources_reviewed: 125`；检索结果去重后保留 37 个高相关 URL，深读 23 个官方页面。  
证据边界：当前没有交互式云浏览器。下文的 `observed_public_page` 指公开帮助中心或公开页面中的可核对描述，不是登录后实测；营销页中的性能、安全和自动化表述标为 `vendor_claim`。

## 先给建设结论

四个产品不是同一套“合同 AI”。Spellbook 把 Microsoft Word 中的 Playbook 规则直接映射为可定位、可编辑、可批量应用的修改候选；Luminance 把历史 precedent、playbook 和 workflow 条件连接到同一合同上下文；Ironclad 把合同视为跨 Create / Review / Sign / Archive 的 workflow，并让任何会改变版本的动作重新触发审批；Juro 则把 first-party redline 与 third-party paper 分成两条不同 review state machine。

对 Agent 产品最重要的三个对象必须分开：

1. **接受风险 / 例外**：批准某个非标准条款继续存在，审批对象是 deviation 或 exception；Ironclad 的 `Request an exception` 最清楚。
2. **接受候选文本**：把 AI 或对手方给出的具体文本合并进文档，审批对象是 revision/redline；Spellbook、Juro 与 Ironclad Jurist 均有明确动作。
3. **批准规则**：把 Playbook position、fallback 或条件发布为团队标准，审批对象是 rule/configuration；四者公开资料都未给出完整的“草拟—复核—发布—撤销”状态机，不能拿前两类动作代替。

## 选样与降级

| 产品 | 深描理由 | 相对独特的机制 | 证据级别 |
|---|---|---|---|
| Spellbook | Help Center 到按钮和状态，Word 工作面证据密集 | redline-aware Playbook 直接产出 Accept / Reject / Revise；规则与原文编号引用 | A：官方帮助中心程序性描述 + 定价页 |
| Luminance | 从 negotiation、workflow、repository 到安全条款有连续公开证据 | precedent + playbook + Traffic Light + 条件 workflow；合同上下文跨 Word 与 repository | B：官方产品/博客/法律条款；页面流程多为厂商描述 |
| Ironclad | 完整 CLM 状态转移、版本再审批、签署回退、归档记录均可核对 | launch form 条件生成、版本级审批、条款 exception approval、Repository record | A：官方帮助中心程序性描述 + 定价/实施页 |
| Juro | intake agent、AI review、异步 negotiation、approval/signing 的公开帮助细节充分 | first-party 只审 redlines；third-party 审全文；reviewer 完成人审后才流转 | A：官方帮助中心程序性描述 + 定价/实施/信任页 |

Icertis 与 ContractPodAi/Leah 本轮降为广索引候选：两者有平台、培训、集成、安全与服务证据，但公开页面对具体编辑器状态、候选修改处置、撤销和审批对象的颗粒度弱于以上四个。降级不表示功能缺失。

---

## 1. Spellbook

### 用户、购买者与任务

- 目标使用者：律所律师与 in-house legal teams；购买按 license 上的 team members 计费，公开页没有金额，属于定制报价。[定价页](https://spellbook.com/pricing)（`observed_public_page`）
- 核心任务：在 Word add-in 中审阅、起草、问答、使用 Benchmarks / Playbooks；Associate 处理多文档事项。`Associate` 的端到端页面状态本轮未核实。

### 工作面与对象

公开帮助显示 Word 侧栏至少有 `Review`、`Playbooks`，Playbook 运行后分 `Rules` 与 `Questions` 两个 tab。核心对象是 `Document`、`Playbook`、`Rule`、`Question`、`Revision`、`Comment`、`Reference`、`Prompt`；团队治理对象另有 Team、Library folder、Saved prompt / Review instruction。[Playbooks Overview](https://help.spellbook.legal/en/articles/9926250-playbooks-overview)（`observed_public_page`）

`Questions` 的回答旁有编号 reference bubble，可跳到原文；`Rules` 中绿色勾表示 passed，红色点圈表示 failed，展开规则后可看 AI Reasoning 与引用。这个设计把“判断—依据—原件位置”放在同一 detail expansion 内，而不是只给风险标签。

### 流程 A：Playbook 规则 → 审阅 → 候选文本 → 人类确认

1. 用户选择 Playbook；系统可按当前文档建议相关 Playbook。
2. 选择 run target：`Standard Review / Full Document` 或 `Redline Review / Redlines`。两者不是同一范围的过滤器：redline 模式只评估 tracked changes，不能同时做完整 clean-copy 规则评估。
3. 结果落到 Rules / Questions；规则出现 passed / failed / fallback 等状态，问题答案带原文 reference。
4. failed rule 可展开 `Add Language`，并用 target icon 定位预期插入处。
5. 候选文本可以 copy、edit、regenerate / ask for changes、insert at cursor 或自动 insert；也有 `Apply All` 批量动作。
6. Playbook 可导出摘要、下载或邮件分享。

依据：[Playbooks Overview](https://help.spellbook.legal/en/articles/9926250-playbooks-overview)、[Comprehensive Review](https://help.spellbook.legal/en/articles/15656286-comprehensive-review)（`observed_public_page`）。

人审边界明确：AI 产出 revision，用户用 `Show / Dismiss / Apply` 处置；`Edit` 与 `Regenerate` 发生在 apply 之前。公开资料没有说明 `Apply All` 前是否有二次确认、失败回滚或 undo。

### 流程 B：first-party redline review

Prerequisite 是文档已有 tracked changes 和现成 Playbook。系统按 impacted rule 给出 `Accept Redline`、`Reject Redline`、`Accept/Reject with Revision` 或 `No Relevant Redline`，而非简单 pass/fail。[First Party Playbooks](https://help.spellbook.legal/en/articles/13875622-first-party-playbooks-redline-review)（`observed_public_page`）

这里的状态语义尤其值得复用：

- `Accept`：接受现有 redline，并附 comment。
- `Reject`：先接受该 redline，再把 original text 作为新的 redline 加回，形成可审计的“回退建议”，而非静默恢复。
- `Accept/Reject with Revision`：先接受当前变化，再把 Spellbook 候选文本作为新 redline 加入。
- 应用动作后，对应 rule 标为 completed。
- 未匹配任何 rule 的 redline 只进入 summary，不给动作；由人手工处理。

这不是“接受风险”。被接受的是 counterparty redline；风险级规则本身不稳定映射到动作，帮助中心反而建议若需要动作化结果，应采用 pass/fail 或 fallback rule。

### Comprehensive Review

用户可选整个文档或 section，设置 party、jurisdiction、附加 instructions、是否同时运行 Playbook，以及 light / standard / heavy markup。完成后 revisions/comments 汇集到列表；设置可切换 Revisions、Comments、Audience、Expand all issues 与 Tracked Changes。Playbook 与 Comprehensive Review 视图可切换。[Comprehensive Review](https://help.spellbook.legal/en/articles/15656286-comprehensive-review)（`observed_public_page`）

公开资料未说明运行中的可取消性、部分失败、重新运行后的 diff、同一候选在多人环境中的冲突解决。

### 权限、批量与审计

管理员可按 Admin / Editor / Viewer / Consumer 管理资源，资源范围分 All / Own / Shared；Team 可用于 Associate workflow 和共享资源。Playbook、prompts、review instructions 可向 team 或全 license 共享，但不能按 individual user 共享；Library 只支持 folder-level sharing。帮助页明确写明目前没有 role/resource sharing 的 audit log，也没有独立 admin portal。[Access Controls](https://help.spellbook.legal/en/articles/12650543-access-controls)（`observed_public_page`）

这形成一个反例：有 RBAC 不等于有治理可追溯性。若 Agent 产品允许规则改变合同文本，规则发布和权限变更日志不应缺席。

### 商业与服务

- 公开价格：没有；custom pricing。
- 收费单位：team members on a license。
- 试用：厂商称 7 天；大型组织可谈 extended trial。
- 服务：law firms 有 group training、online support，10 人以上 dedicated support；in-house 另有 team training 和 Playbook Build Service。
- 软件/服务边界：Playbook Build Service 是配置/实施型服务，不是法律意见；定价页没有声明提供法律专业服务。
- 数据/安全：定价页声称 Zero Data Retention、客户数据不用于训练及 SOC 2 Type II；均为 `vendor_claim`，本轮未读取独立审计报告。

### 页面证据缺口与待截图

1. `https://help.spellbook.legal/en/articles/9926250-playbooks-overview`：Word 侧栏 Rules / Questions、编号 reference bubble、passed/failed、Add Language 与 Apply All。
2. `https://help.spellbook.legal/en/articles/13875622-first-party-playbooks-redline-review`：run target 与四种 redline outcome。
3. `https://help.spellbook.legal/en/articles/15656286-comprehensive-review`：markup depth、revision list 与 Show/Dismiss/Apply。
4. `https://help.spellbook.legal/en/articles/12650543-access-controls`：RBAC matrix 与明确的 audit-log 缺口。

---

## 2. Luminance

### 用户、购买者与任务

购买者主要是企业 Legal / Legal Ops，也覆盖 Procurement、Finance、Sales 等业务团队。任务横跨 negotiation、repository intelligence 与 workflow automation。[平台首页](https://www.luminance.com/)（`vendor_claim`）

### 工作面与对象

2022 年官方 feature spotlight 描述了一个 live-contract home screen：列表显示合同名、age、language、approval deadline 与 Traffic Light Analysis；用户可按权限看到全局合同或仅自己负责的合同。可配置阶段示例包括 `Under Review`、`With Counterparty`、`Executed`，也可按 priority、project 或 specialist review 建阶段。点击合同可在 Word 打开并显示 Traffic Light Analysis。[Workflow Editor spotlight](https://www.luminance.com/blogs/product-feature-spotlight-luminance%E2%80%99s-workflow-editor)（`observed_public_page`，旧版 2022；当前 UI 需复核）

核心对象：Matter/Contract、Clause/Position、Playbook、Checklist、Precedent、Workflow stage、Condition、Task/Approval、Repository record/contract family、Obligation/Renewal。当前产品页强调 Negotiation、Repository、Workflows 三个面，但具体全局导航仍 `unknown`。

### 流程 A：precedent / playbook → checklist → mark-up → 例外路由

1. 系统将 preferred positions、fallback language 和 review criteria 作为 structured negotiation standards。
2. incoming contract 以 Checklist 对照标准，并结合 portfolio precedent 与同一 counterparty 的历史 positions/concessions。
3. AI 在 Microsoft Word 生成 context-aware redlines；Auto Mark-Up 以 tracked changes 呈现，用户可 review / approve modifications。
4. 非标准 terms / exceptions 可根据规则路由回 Legal；角色权限决定业务团队的自治范围。

依据：[Negotiation](https://www.luminance.com/platform/product/negotiation)、[2024 feature recap](https://www.luminance.com/blogs/the-latest-from-luminance)（均为官方页面；具体能力 `vendor_claim`，交互细节不是实测）。

### 流程 B：workflow 条件 → 并行审批 → owner 回收

Workflow Editor 被描述为 drag-and-drop flowchart，可用条件构建层级 routing：例如反贿赂相关合同送 ESG，counterparty 改动超过 50% 的合同送 senior Legal。2024 官方 recap 称 Collaborative Workflows 支持 simultaneous reviews、individual notifications 与 direct links；全部 reviewer 完成后，合同自动回到 owner，并显示 rejected language 与可一键插入的 recommended amendments。[Workflow Editor spotlight](https://www.luminance.com/blogs/product-feature-spotlight-luminance%E2%80%99s-workflow-editor)、[2024 recap](https://www.luminance.com/blogs/the-latest-from-luminance)（`vendor_claim`）

这里“approval”对象是协作 review/合同流转；“recommended amendment”仍是候选文本。资料没有证明 rule 自身的 publish approval，也没有说明某个 reviewer 拒绝时是短路、等待全员还是进入人工分支。

### 流程 C：跨合同抽取 → portfolio 结果 → 原件回溯

Repository 产品页称可一次按 playbook 比较最多 10,000 份合同，识别 deviation/risk，并把 related agreements 与 amendments 连接成上下文；Lumi 回答被描述为 source-backed，能回到相关文档。[Repository](https://www.luminance.com/platform/product/repository)（`vendor_claim`）

这是适合 Agent 的“表格/报告不是终点”机制：portfolio row 必须保留 contract family、source span、rule/position 与当前责任人。但公开资料没有核实批量结果的表格列、选择/批量接受、冲突处理、导出权限和长任务失败状态。

### 商业、服务与部署

- 公开价格：没有；费用写入 Product Order Form。[Master Agreement 3.1](https://www.luminance.com/legal/master-agreement)（`observed_public_page`）
- 收费/使用约束：协议写明 subscription allowance 是最大 Documents 数；每年上传有相对 allowance 的 200% fair-usage cap。具体计价公式和 seat 关系未公开。
- 软件/支持边界：Master Agreement 的公开摘要明确 Support 默认不包括对产品输出的 monitoring、interpretation 或 corrective action；这支持将软件支持与法律专业判断分开。
- 托管：法律条款描述 AWS cloud web app；客户可选可用 data centre，之后 data residency 固定在该中心及同区域 backup。安全页另称可部署于客户自身环境，但具体私有化产品/价格未公开。
- 安全承诺：单客户隔离 instance、at-rest/in-transit encryption、MFA、SSO on request、24 小时备份、完整故障 RTO/RPO 24 小时；删除后主存储 30 天内移除，备份再 30 天内移除。[TOMs v3.0](https://www.luminance.com/legal/technical-organisational-measures)、[Security](https://www.luminance.com/security/)（厂商合同/声明，未独立审计）

### 页面证据缺口与待截图

1. `https://www.luminance.com/blogs/product-feature-spotlight-luminance%E2%80%99s-workflow-editor`：home screen、Traffic Light、stage 与 flowchart（旧版页面，必须标 2022）。
2. `https://www.luminance.com/resources/videos/luminance-ai-powered-negotiation/`：官方录屏入口；需截取 color-coded analysis 与 Auto Mark-Up，并记录时间点。
3. `https://www.luminance.com/platform/product/negotiation`：precedent / checklist / role guardrail。
4. `https://www.luminance.com/platform/product/repository`：portfolio-scale comparison 与 source-backed answer。

---

## 3. Ironclad

### 用户、购买者与任务

用户跨 contract requester、workflow participant、approver、clause approver、signature coordinator、Legal Ops / admin。产品不是只给律师的编辑器；业务用户从 launch form 发起，法律与业务审批者按 workflow 进入，operational role 在 Archive 做最终数据确认。[Requester Guide](https://support.ironcladapp.com/hc/en-us/articles/12403203760663-Get-Started-with-Ironclad-for-Contract-Requesters)（`observed_public_page`）

### 全局工作面与对象

- Dashboard：跨 in-progress workflow 与 archived record 搜索/筛选；Saved Views；contract preview 显示 title、documents、properties。
- Start Workflow：左侧选择 workflow type 并预览 launch form。
- Workflow page：Create / Review / Sign / Archive 以及 Approvals、Activity Feed、Info / Playbook sidebar。
- Repository：workflow 完成后生成 Repository record，保存 documents、properties 与 workflow history。
- Workflow Designer：管理员配置 form question、property、condition、approval 和 Playbook。

这套对象模型的关键是 `workflow` 与 `record` 不相同：前者是运行中的过程，后者是完成后系统记录；Dashboard 让两者可一起搜，但 Archive 是从过程到记录的显式转换。

### 流程 A：launch form → 条件路由 → 版本级审批

1. requester 选择可访问的 workflow；权限决定能看到哪些 contract type。
2. launch form 收集生成合同或上传外部 paper、review、signature 所需信息；required question 未答不能进入 Review/Signature，回答可触发 additional questions。
3. 未提交可 `Save Form`，之后 update 或 delete。
4. form response 成为 property，可驱动后续 condition 与 reporting；某些 question 可 locked，只允许 external source（如 Salesforce）更新。
5. 根据 contract type 与答案，系统拉入 approvers；支持 sequential / parallel layers，并按每个 version 审批。

依据：[Requester Guide](https://support.ironcladapp.com/hc/en-us/articles/12403203760663-Get-Started-with-Ironclad-for-Contract-Requesters)、[Customize Launch Forms](https://support.ironcladapp.com/hc/en-us/articles/12403007165847-Customize-Launch-Forms-in-Workflow-Designer)（`observed_public_page`）。

### 流程 B：编辑 → 新版本 → 再审批

Review 时有三种不同写入路径：

- `Edit Info`：改 launch answers；可能重生成新 version，并可能要求已批准者重新审批。
- `Update Document`：上传最新 Word/PDF 替换当前 version；之后 Edit Info 不再能更新原先由 form answers 填充的正文段。
- `Ironclad Editor`：在应用内改文本；tracked changes，可能触发 internal approval；需 Standard seat/权限。

每种编辑都要求给 Activity Feed 留 note。用户还可比较 versions、@mention、提醒 participant，或邮件分享 latest/redlined PDF/Word；Activity Feed 能记录收件人是否打开分享邮件。[Requester Guide](https://support.ironcladapp.com/hc/en-us/articles/12403203760663-Get-Started-with-Ironclad-for-Contract-Requesters)（`observed_public_page`）

这是成熟的“变更使批准失效”机制；但帮助页只说 `may` reapproval，精确触发条件取决于配置，不能推成全局规则。

### 流程 C：条款风险 → preferred/fallback → exception approval

AI Playbooks 检测 clause，给 preferred / fallback language；非标准 term 可配置 clause approver。Precise Redlining 在 Review 侧边栏列出需注意 term，并可给从少到多的候选 redline、解释改了什么/为何重要/怎样解决。[AI Playbooks Overview](https://support.ironcladapp.com/hc/en-us/articles/12275685560215-Ironclad-AI-Playbooks-Overview)、[AI Precise Redlining](https://support.ironcladapp.com/hc/en-us/articles/28661084734999-Use-AI-Precise-Redlining-to-Review-a-Contract)（`observed_public_page`）

三类动作可明确区分：

- `Insert into document` 或 Jurist 的 Accept/Reject：接受/拒绝候选文本。
- `Request an exception`：选择 approver、写理由；批准对象是非标准条款/exception，状态可在 Approvals 查看并提醒/改 approver。
- Playbook configuration approval：本轮公开证据只看到 admin 配置和权限，没有 rule draft/review/publish 状态机，仍 `unknown`。

Jurist 支持逐条 Accept/Reject，也可高亮跨多项 suggestions 后批量处置。[Accept and Reject Jurist’s Changes](https://support.ironcladapp.com/hc/en-us/articles/37137144013207-Accept-and-Reject-Jurist-s-Changes)（`observed_public_page`）。公开资料未说明批量动作的 undo。

### 流程 D：签署回退与归档

Signature Coordinator 管理 send、signer/order、tag、CC 与外部已签 packet 上传。如果需要继续谈判，可 `Go back to Review`；这可能重置审批，并会 void 已发 eSignature envelope，同时通知各方。全部签署后，Archive step 做最终 data approval，之后才生成 Repository record。[Requester Guide](https://support.ironcladapp.com/hc/en-us/articles/12403203760663-Get-Started-with-Ironclad-for-Contract-Requesters)（`observed_public_page`）

这条回退路径值得直接进入 Agent 事件设计：`signature_packet_voided` 与 `approval_invalidated` 必须是显式事件，不能只把 stage 从 Sign 改回 Review。

### 商业、服务、安全与集成

- 公开价格：没有；tailored quote。
- 定价维度：products、users、workflows、growth；API/integrations、additional instances、enhanced success plan 可能另加。
- 实施：self-led、Ironclad legal engineers 或 partner；实施包从 self-service 到 full-service；complex requirement 可 custom SOW。
- 培训/成功：Academy、live group sessions、in-app guides、customer success、不同 support level。[Pricing](https://ironcladapp.com/pricing)、[Implementation Success](https://ironcladapp.com/why/implementation-success)（`vendor_claim`）
- 安全：官方页称 TLS 1.2+、AES-256、US-hosted GCP、多 zone；Security Portal 列 SOC/ISO 等，部分文档需申请。[Security](https://ironcladapp.com/security)（`vendor_claim`）
- 审计：Audit Log 是付费 `Security & Data Pro` add-on，启用前数据不 backfill；UI 可按 date/actor/event filter 并导出 CSV，早期日志另可走 SDP API / Snowflake Data Share。[Audit Log Overview](https://support.ironcladapp.com/hc/en-us/articles/33834526166807-Audit-Log-Overview)（`observed_public_page`）

### 页面证据缺口与待截图

1. `https://support.ironcladapp.com/hc/en-us/articles/12403203760663-Get-Started-with-Ironclad-for-Contract-Requesters`：Dashboard、launch、approval layers、Activity Feed、Sign 回退、Archive。
2. `https://support.ironcladapp.com/hc/en-us/articles/28661084734999-Use-AI-Precise-Redlining-to-Review-a-Contract`：Playbook sidebar、Approve/exception/redline suggestions。
3. `https://support.ironcladapp.com/hc/en-us/articles/37137144013207-Accept-and-Reject-Jurist-s-Changes`：单项与批量文本处置。
4. `https://support.ironcladapp.com/hc/en-us/articles/33834526166807-Audit-Log-Overview`：filter/export 和 add-on gating。

---

## 4. Juro

### 用户、购买者与任务

Juro 面向 workspace admins、business requesters、legal reviewers、approvers、signers 与 Legal Ops。其公开帮助把 Operator（入口对话）、workspace/document record、Word add-in、template/playbook/approver 连接成一条 intake-to-sign 流程。[Contract intake and review](https://intercom.help/juro/en/articles/15922311-contract-intake-and-review)（`observed_public_page`，该功能标 beta）

### 工作面与对象

- `Workflows > Agents`：workspace admin 配置 Contract intake agent。
- Operator：business user 上传 third-party paper 并回答 intake questions。
- Document record：Document Members、Intake Review、Internal comments、status、approvers/signatories。
- Word add-in：第三方 paper 的 AI Review、internal collaboration、external sharing、signature；changes/comments/redlines/version 回写 Juro。
- To Do：legal reviewer/approver 的工作队列。
- Timeline/version：公开 collection 说明可 view、compare、export previous versions；bulk create 支持 CSV。

### 流程 A：intake agent → 分类确认 → AI review → human gate

1. admin 定义 document type 与 identifiers；AI 可建议类型，但 requester 必须确认。
2. 每类绑定 template，并继承 smartfields、rules、approvers、signatories；配置 intake questions 和是否自动 AI review。
3. 自动 review 只适用于 unsigned `.docx`；PDF 不执行。admin 必须指定 Playbook 与 legal reviewer。
4. requester 在 Operator 选择 workspace/type、回答 context，再从 summary 选择 `Yes, upload` 或 `Start over`。单文件限制：DOCX 30MB、PDF 100MB。
5. 系统自动 AI extract 填 smartfields，问题答案存为 internal comment。
6. 若自动 review 且无问题，直接到 template approvers；有 flag 则状态 `Sent for legal review`，legal reviewer 收到 redlined document。
7. reviewer 在 Word 中 sync 为 new version，查看 internal context，打开 suggestions，逐项 `approve / decline`，再 `Complete`。之后 requester 可送回 counterparty 或送 approvers。

依据：[Contract intake and review](https://intercom.help/juro/en/articles/15922311-contract-intake-and-review)（`observed_public_page`）。

这条流程明确把“AI 建议类型”与“用户确认类型”分开，也把“AI review 完成”与“法律 reviewer 完成”分开。未知：extract/review 部分失败、重复上传幂等、队列超时和 reviewer replacement。

### 流程 B：first-party vs third-party AI Review

Juro 帮助文档明确给出两条 review 语义：

- own paper：在 Juro 内只审 counterparty redlines；按 Playbook 给 `Acceptable / Unacceptable`，用户 Accept / Reject suggestion。
- third-party paper：在 Word add-in 审整个文档；按 priority 生成 redlines 与 explanation，用户逐项 accept / reject，也可 comment 或 query/rewrite markup。

来源：[AI Review in Juro](https://intercom.help/juro/en/articles/12691465-ai-review-in-juro)、[Setting up AI Review playbooks](https://intercom.help/juro/en/articles/16019964-setting-up-ai-review-playbooks)、[AI Review in Word](https://intercom.help/juro/en/articles/11321326-ai-review-in-word)（`observed_public_page`）。

重要边界：帮助页称 redline 一旦 accept/reject 不能 undo；可 `Mark review as complete` 关闭 cycle，之后能开新 cycle 或 reopen previous cycle。不可撤销动作与可重开 review cycle 是两层不同状态，产品建设时应同时保存 decision event 与 review-cycle state。

### 流程 C：异步 negotiation → document lock → 交换版本

Asynchronous mode 默认在 template 关闭；可在 template 或单合同启用。首次 counterparty redline 将状态改为 `NEGOTIATION` 并生成包含 suggestions 的新 version。对方编辑期间文档对内部修改 locked；对方 `Send back new version` 后解锁，内部用户在 prompt panel accept/reject，再决定是否重复一轮。[Negotiating in Juro](https://intercom.help/juro/en/articles/5897857-negotiating-in-juro)（`observed_public_page`）

一旦单合同触发 asynchronous flow，不能 retroactively turn off；该流只支持最终用 Juro signature execution，新 negotiation version 不能上传为 fully signed。这是强 workflow invariant，不应被 UI toggle 掩盖。

### 流程 D：approval 与 signing gate

Approver 可以来自 template，也可按条件加入。`Prepare approval request` 替代原本的 `Prepare signing request`；approver 的 To Do 出现 `TO APPROVE`。Approve 后合同才可发签；Reject 把合同送回 creator 修改并重新提交。支持 internal 与 external approver。[Handling approvals](https://intercom.help/juro/en/articles/5653139-handling-approvals)（`observed_public_page`）

这里 Approve 的对象是 document/version，不是 Playbook rule，也不是 AI revision。官方帮助明确：批准后发生 internal changes 会重新触发审批；绑定 specific smartfields 的 approver 只在相关字段变化时重新进入后续审批轮次。外部修改、签署回退是否 void envelope，以及完整的版本/hash 绑定仍未核实。

### 商业、服务、安全与集成

- 公开价格：没有；pricing page 以 contract volume/type、AI features、integrations 问卷形成 package。
- 收费单位：当前公开页未明确；不能把问卷中的 volume 当作唯一计费单位。
- 服务：按 workflow complexity 选择 implementation support；Legal Engineers 协助 template/workspace/integration，另有 admin training、activation/adoption support。[Pricing](https://juro.com/pricing)、[Implementation guide](https://juro.com/learn/implementing-juro)（`vendor_claim`）
- 实施时长：同一官方 guide 同时出现平均 21 天与“at time of writing 18 days”，而 info page 又称 average 21 days；这是厂商材料的时间口径不一致，不宜写成稳定 SLA。
- 集成：Word、Salesforce、HubSpot 等；pricing page 另提 API、SSO、MCP，但哪些包含在 package 未公开。
- 安全：Trust Center 列 SOC 2 Type II、Cyber Essentials、GDPR；AWS/Mongo Atlas，at-rest AES-256、TLS 1.2/1.3；官方 resilience 页称全量备份每 2 小时、RPO/RTO 各 2 小时。[Trust Center](https://trust.juro.com/)、[Application Security](https://juro.com/trust/application-security)、[Application Resilience](https://juro.com/trust/application-resilience)（`vendor_claim`；未读取审计报告本体）

### 页面证据缺口与待截图

1. `https://intercom.help/juro/en/articles/15922311-contract-intake-and-review`：Agents configuration、Operator confirmation、Intake Review、人审 Complete。
2. `https://intercom.help/juro/en/articles/12691465-ai-review-in-juro`：Acceptable/Unacceptable、Accept/Reject、cycle completion。
3. `https://intercom.help/juro/en/articles/5897857-negotiating-in-juro`：NEGOTIATION、lock、Send back new version、prompt panel。
4. `https://intercom.help/juro/en/articles/5653139-handling-approvals`：TO APPROVE 与 approve/reject 回路。

---

## 跨产品原子机制矩阵

| 原子机制 | Spellbook | Luminance | Ironclad | Juro | Agent 建设含义 |
|---|---|---|---|---|---|
| 输入范围选择 | Full Document / Redlines；section | contract / portfolio；具体 selector 未核 | workflow document / version / clause | own-paper redlines / third-party full doc | scope 必须是一等对象，写入 run record |
| 规则命中与依据 | passed/failed/fallback + reference bubble | checklist/Traffic Light + precedent；细节多为 claim | clause position + explanation + repository insight | Acceptable/Unacceptable + position/conclusion tooltip | 结果必须同时保留 rule、reason、source span |
| 候选文本处置 | Show/Dismiss/Apply/Edit/Regenerate/Apply All | tracked Auto Mark-Up review/approve | Insert；Jurist Accept/Reject，支持批量 | Accept/Reject；可 rewrite/comment；不可 undo | 文本 decision 与风险 decision 分开存事件 |
| 接受风险/例外 | 未见独立 exception object | non-standard term 路由 Legal，批准状态未核 | Request an exception + approver + reason + status | document approver gate；clause exception 未见 | exception 要有对象、理由、责任人、到期/再验证 |
| 规则批准 | 未核；资源 owner/admin 可 edit/share | 未核；Playbook Agent 有自校验 claim | admin 配置/权限，publish approval 未核 | admin 创建 playbook，publish approval 未核 | 不可用“应用候选文本”冒充规则发布审批 |
| 版本使审批失效 | 未核 | 未核 | Edit/Review 回退可生成新版本并 reapproval；Sign 回退 void packet | negotiation 新 version；approval 失效规则未核 | approval 需绑定 artifact version/hash |
| 长任务/进度 | running tabs；cancel/partial failure 未核 | portfolio-scale claim；进度/失败未核 | workflow stage 明确；AI job 进度未核 | status + To Do；AI job retry/partial failure 未核 | 至少建 queued/running/partial/failed/cancelled |
| 权限 | team/license resource scopes；无 audit log | role/division、single-tenant；细粒度未核 | seat + workflow/playbook permission；Audit Log add-on | workspace admin/reviewer/approver；细粒度未核 | permission decision 和 policy change 都要审计 |
| 共享/导出 | Playbook summary download/email/export | Playbook Excel、repository/Word；权限未核 | PDF/Word latest/redline、Repository、CSV audit log | Word sync、timeline export、external share | export 要带 source pointers、version、policy watermark |
| 失败/不可逆 | unmatched redline 手工；undo 未核 | reviewer reject 分支细节未核 | Salesforce locked field launch error；Sign 回退 void envelope | accept/reject 不可 undo；async flow 不能关闭 | 把不可逆点前置警示，保留补偿动作 |

## 建设参考：observed / inferred / proposed

### Observed

- Playbook 的运行目标会改变应评估的对象集合；clean copy 与 redline 不是同一结果的两个视图。
- revision acceptance、exception approval、document approval 是三个不同 decision target。
- 版本更新可能使之前的批准失效；签署回退还可能 void 外部 envelope。
- Word 是重要执行面，但成熟 CLM 会把 Word 结果同步回 workflow、record、approval 与 audit trail。

### Inferred

- “依据可定位”只有在 rule/answer/revision 与 source span 共享稳定 identity 时才能跨 Word、web、export 保持一致。
- 可批量 Apply/Accept 的产品如果没有 preview、scope summary 与 undo，错误半径会明显放大；公开资料未足以证明四者都补齐了这些保护。
- 把 rule publishing 留在普通资源共享权限里会形成治理缺口：规则变更可能影响大量后续合同，却没有独立 approval/audit object。

### Proposed

以下是建设建议，不声称来自某个厂商：

1. 定义 `ReviewRun`，固定 `artifact_version_id`、`scope`、`playbook_version_id`、initiator、started/completed time 和 job state。
2. 定义 `Finding`，分别链接 `rule_evaluation`、`source_span`、`risk/deviation` 与零到多个 `RevisionCandidate`。
3. 定义三种 decision event：`revision_decision`、`exception_decision`、`rule_release_decision`；每种各自有 actor、reason、version、permission 与撤销/补偿语义。
4. 所有 approval 绑定 version/hash；文本或 material metadata 改变后生成 `approval_invalidated`，不得静默沿用。
5. bulk action 前展示范围、候选数、不可处理项和预计变更；执行后生成逐项结果，支持 partial failure 与人工接管。
6. 外部签署/邮件/集成超时一律进入 `outcome_unknown`，先核对 remote state，再决定 retry。
7. Playbook rule 采用 draft → peer review → approved → published → superseded；规则 owner 和使用者权限分开，发布必须有 audit trail。

## 证据限制与复查建议

- 公开帮助中心只证明厂商公开描述的当前流程，不等于本轮亲自操作。
- Luminance 具体 UI 证据部分来自 2022/2024 官方文章，当前 2026 界面必须补拍复核。
- 公开资料普遍缺少空态、partial failure、cancel/retry、并发编辑冲突、undo 与无权限拒绝画面。
- 定价全部为报价制或公开金额缺失；不可推断免费，也不能从试用推断正式价格。
- 复查日期建议：2027-01-28；若任一帮助页更新时间、产品包装或安全条款更改，应提前复查。
