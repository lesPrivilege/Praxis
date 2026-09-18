# Downloads 本地设计与汇报材料快照

本轮（2026-09-18 开始、2026-09-19 完成）对 `/Users/lesprivilege/Downloads` 先做文件名与元数据筛查，再读取命中的 design、reporting、CourtWork/schema、HTML prototype 与交付包。机器可读清单在 [downloads.json](../../intake/downloads.json)，每个源文件和 ZIP 都保留原路径、mtime epoch/UTC、大小、SHA-256、选择理由和快照路径。

## 扫描范围与边界

- 初筛：`find -maxdepth 2 -type f` 看到 201 个文件；随后对相关命名目录递归检查。排除三个嵌套项目目录后共见 250 个文件；包含所有嵌套目录的全树为 3,231 个文件。Downloads 总体 `du -sh` 为 1.7G，主要由无关的大型个人 PDF 和项目目录构成。
- 选入：109 个相关源文件、10 个相关 ZIP；另有 136 个从 ZIP 解出的文档/HTML/JSON/资源。快照位于 [local/downloads](../../snapshots/local/downloads/)。
- ZIP 在解包前检查了绝对路径、`../` 路径和 symlink；10 个包均未发现这些问题。每包使用独立目录，未运行 HTML、Python、shell 或包内 verify 脚本。
- HTML 只做静态文本、标题、标签和相对依赖扫描。快照不是已经运行过的离线站点；远端字体、CDN 和外部链接没有下载。

## 权威设计材料

旧的 `anti-ai-slop-design` 和 `Design_Analysis_Report` 都有 MOVED 指针，权威副本是 [anti-ai-slop-kit](../../snapshots/local/downloads/files/anti-ai-slop-kit/README.md)。本地快照仍保留旧 [anti-ai-slop-design/MOVED.md](../../snapshots/local/downloads/files/anti-ai-slop-design/MOVED.md)、历史报告和报告引用的截图，便于 provenance 追溯。

深读 [总序](../../snapshots/local/downloads/files/anti-ai-slop-kit/00-发凡起例.md)、[清洗方案](../../snapshots/local/downloads/files/anti-ai-slop-kit/04-清洗与实践/07-清洗方案四大支柱.md)、[法律工作台场景](../../snapshots/local/downloads/files/anti-ai-slop-kit/04-清洗与实践/08-产品场景-法律工作台.md)、[检测清单](../../snapshots/local/downloads/files/anti-ai-slop-kit/05-可执行工具/09-检测清单.md)、[Prompt 工具包](../../snapshots/local/downloads/files/anti-ai-slop-kit/05-可执行工具/10-Prompt工具包.md)、[Tokens 与布局配方](../../snapshots/local/downloads/files/anti-ai-slop-kit/05-可执行工具/11-Tokens与布局配方.md)、[AGENTS 规则片段](../../snapshots/local/downloads/files/anti-ai-slop-kit/05-可执行工具/12-AGENTS规则片段.md) 后，能稳定提炼出一条工作顺序：先写语义 token、禁止清单和验收门，再生成界面；用 source material、具体取舍、反例和 edge-case grid 约束生成；最后做 computed-style、可访问性、视觉回归和内容审阅。材料把 AI slop 定义为无约束的训练分布采样，强调 typography、密度、留白、状态、动效和 copy 都应有产品理由。

[历史法律工作台推演](../../snapshots/local/downloads/files/Design_Analysis_Report/legal_workstation_design_consulting.md)补充了可操作的工作面规则：语义色优先于装饰色，卡片必须承担边界/层级/交互职责，右侧 dock 通过 tab 与可拖动 splitter 组织上下文，并保持双 viewport；focus、empty、loading、skeleton、hover、text wrapping 都是验收面。旧报告的截图依赖也保留在 [Design_Analysis_Report/screenshots](../../snapshots/local/downloads/files/Design_Analysis_Report/screenshots/)。

## CourtWork、Schema 与汇报 grammar

深读 [data surfaces/version priority](../../snapshots/local/downloads/files/CourtWork-data-surfaces-version-priority-2026-09-12.md)、[professional work-product panel spec](../../snapshots/local/downloads/files/professional-work-product-panel-spec.md)、[GUI review runtime index](../../snapshots/local/downloads/files/courtwork_se_gui_review_runtime_index_2026-09-08.md)、[UI consumption index](../../snapshots/local/downloads/files/ui-design-consumption-index.md) 和 [frontend layering spec](<../../snapshots/local/downloads/files/CourtWork-frontend-layering-customization-spec-v0.1-2026-09-08(1).md>)，得到以下可复用 grammar：

- 材料、工作面和版本状态分开；主阅读区只承载当前判断所需内容，agent activity 放在次级层；图谱必须有等价列表，不自动重排或替用户阅读。
- 工作产物的叙事链是 source → observation → extraction → compile → counterexample；“专家 demo → work contract → agent extension”比孤立的聊天演示更适合汇报。
- 高风险动作要经过 Observation、Elicitation、Permission、Proposal Review、Commit gate；权限、提议、提交和恢复是产品 grammar，不是 toast 文案。
- Schema Engineering 宣讲/定本把事项、对象、契约、提议与承诺分开，强调用户管理的是事项而不是 transcript；适合作为汇报页的 claim → evidence → visual → annotation → provenance 顺序。对应 HTML 是 [宣讲本](../../snapshots/local/downloads/files/schemaengineeringbriefing.html) 与 [定本](../../snapshots/local/downloads/files/schemaengineeringcanon.html)。
- [harness primitive index](../../snapshots/local/downloads/files/harness-primitive-index.md)、[implementation/handoff docs](../../snapshots/local/downloads/files/schema-engineering-definitive-handoff.md) 和 ZIP 中的 release/runtime/chat-governance 包是交付与治理证据，按“阅读/索引”保留；包内脚本未执行。

## HTML 原型与可见 grammar

下表记录静态读取到的主要界面意图；链接指向原文件快照。可运行性按依赖清单判断。

| 原型 | 观察到的内容 grammar | 依赖边界 |
|---|---|---|
| [Agent UI 原型](<../../snapshots/local/downloads/files/Agent UI 原型.dc.html>) | 直接说任务即可开始；blank/run/long/ask/perm/attach/output/offline/stopped/partial 场景；输入、权限和结果状态并列 | 缺 `support.js` 与 `_ds` CSS/bundle |
| [Agent 评估工作台](<../../snapshots/local/downloads/files/Agent 评估工作台.dc.html>) | “该不该上 agent / 上线后表现如何”；复杂度阶梯、跨 agent 质量仪表盘、silent failure、风险覆盖、confidence calibration | 缺 `support.js`；Google Fonts 远端 |
| [Jev Workflow](../../snapshots/local/downloads/files/Jev-Workflow.html) | 21 页自足演示；通过具体期限/日历问题展示材料、判断、证据和测试；含 TypeSafe、Every、Empryo、GitHub、Qwen 外链 | HTML 内部无脚本/样式依赖；外链未下载 |
| [Mnemos Mindmap Redesign](<../../snapshots/local/downloads/files/Mnemos Mindmap Redesign.html>) | mindmap redesign、多视图画布与调参结构 | 缺 `styles.css`、多个 JSX；远端 React/ReactDOM/Babel 与 Google Fonts |
| [Phase A 方向板](<../../snapshots/local/downloads/files/Phase A - 方向板.dc.html>) | Mnemos 方向板、章节/内容载体、图灵机章的视觉方向 | 缺 `support.js`；Google Fonts 远端 |
| [Phase B Token 定案](<../../snapshots/local/downloads/files/Phase B - Token 定案.dc.html>) | Token 全值定案提案，说明设计决策先于页面铺陈 | 缺 `support.js`；Google Fonts 远端 |
| [Phase B 全量稿](<../../snapshots/local/downloads/files/Phase B - 全量稿.dc.html>) | Mnemos 全量稿、章节阅读和页面变体 | 缺 `support.js`；Google Fonts 远端 |
| [设计语言三档评估板](<../../snapshots/local/downloads/files/设计语言三档评估板.dc.html>) | Pages/Work Agent/Schema 三档足量实现；模型只生成、不裁决；横切缺口含 fonts/themes/primitive completeness | 缺 `support.js` |
| [内容治理策略中台](<../../snapshots/local/downloads/files/内容治理策略中台 Demo.html>) | C-193 站外导流/疑似虚假好评变体，运行概览与治理工作面 | 内联 CSS/JS；未发现本地依赖或远端资产 |
| [巧思生长谱](<../../snapshots/local/downloads/files/巧思生长谱-版本学与写本.dc.html>) | 以版本学/写本传统替换路径依赖；平阙、版框、夹注、牌记等内容结构 | 缺 `support.js` |
| [通用表基线](<../../snapshots/local/downloads/files/prototype/通用表基线.dc.html>) | PM 域表格、schema exemplar、one-shot 过门测试 | 缺 `support.js` |
| [卷宗时序图谱](<../../snapshots/local/downloads/files/prototype/卷宗时序图谱.dc.html>) | 时序 × 关系图谱共面联动，产出面有列表/图谱联动 | 缺 `support.js` |
| [晨曦风险审阅](<../../snapshots/local/downloads/files/prototype/晨曦风险审阅.dc.html>) | 风险清单逐条确认门、法理之线、凡例面 | 缺 `support.js` |
| [修订预览](<../../snapshots/local/downloads/files/prototype/修订预览.dc.html>) | 红删蓝增 → 冻结仪式 → 未落格确认知悉 → 已编译终态 | 缺 `support.js` |
| [Work 画布对话区](<../../snapshots/local/downloads/files/prototype/Work画布对话区.dc.html>) | 对话与场景 trace 共存，适合作为工作上下文而非聊天列表 | 缺 `support.js` |
| [纸墨谱样张](<../../snapshots/local/downloads/files/uploads/Deswrit kit/04-纸墨谱/样张.dc.html>) | 纸墨谱、版/语义槽、诸宗著录、月白/磁青等 token 体系 | 本地 support.js/token CSS 已一起快照；Google Fonts 远端 |
| [纸墨谱覆盖度审](<../../snapshots/local/downloads/files/uploads/Deswrit kit/04-纸墨谱/覆盖度审.dc.html>) | 以缺/半/覆审查交互式样是否被素材覆盖，形成可验收的设计 coverage 门 | 本地 support.js/token CSS 已一起快照；Google Fonts 远端 |
| [Schema Engineering 宣讲本](../../snapshots/local/downloads/files/schemaengineeringbriefing.html) | 工作结构、事项、九个一等对象、互补契约，不让 transcript 承担全部职责 | inline CSS/JS；Google Fonts 远端 |
| [Schema Engineering 定本](../../snapshots/local/downloads/files/schemaengineeringcanon.html) | 定义、术语、结构化契约、提议不等于承诺 | inline CSS/JS；Google Fonts 远端 |
| [合规审查 demo](../../snapshots/local/downloads/files/compliance-review-agent/docs/index.html) / [合同审批 demo](../../snapshots/local/downloads/files/contract-approval-agent/docs/index.html) | 两个可视化业务工作面；对应 demo-data.js 也被复制 | 本地 demo-data.js 已快照；Google Fonts 远端 |

## ZIP 交付包

ZIP 原件在 [archives](../../snapshots/local/downloads/archives/)，每包有独立解包目录和 extractedFiles 哈希映射：

- [FD-1 产品官网设计稿](<../../snapshots/local/downloads/archives/FD-1产品官网设计稿.zip>)：README、官网 HTML、OG 卡、UI review、icons、support.js；对应 [解包目录](../../snapshots/local/downloads/extracted-bsdtar/fd-1-design/)。
- [Schema 工作面排版架构典范](<../../snapshots/local/downloads/archives/Schema工作面排版架构典范.zip>)：README、index、14 个工作面 HTML/说明；[解包目录](../../snapshots/local/downloads/extracted-bsdtar/schema-layout/)。
- [Courtwork 设计语言定稿](<../../snapshots/local/downloads/archives/Courtwork 设计语言定稿.zip>)：principles、tokens、typography-density、signature-line、northstar HTML；[解包目录](../../snapshots/local/downloads/extracted-bsdtar/courtwork-design-language/)。
- [版本设计语言的复用包体系](<../../snapshots/local/downloads/archives/版本设计语言的复用包体系.zip>)：只保留 ZIP 哈希；同内容的展开包已经以 [Deswrit kit](<../../snapshots/local/downloads/files/uploads/Deswrit kit/04-纸墨谱/>) 快照，避免重复展开。
- [harness release plan](<../../snapshots/local/downloads/archives/CourtWork-harness-release-plan-2026-09-12.zip>)：architecture/boundaries/PR/RD/release gates/handoff/source manifests；verify 脚本未执行；[解包](../../snapshots/local/downloads/extracted-bsdtar/harness-release/)。
- [runtime composition v2](<../../snapshots/local/downloads/archives/CourtWork-runtime-composition-v2-2026-09-12.zip>)：runtime contract/model adaptation/role compositions/maintenance/implementation；verify 与嵌套 previous-release ZIP 未解包；[解包](../../snapshots/local/downloads/extracted-bsdtar/runtime-composition/)。
- [chat governed data research](<../../snapshots/local/downloads/archives/CourtWork-chat-governed-data-research-2026-09-12.zip>)：channel/data organization/governed disclosure/implementation/handoff/source ledger；verify 未执行；[解包](../../snapshots/local/downloads/extracted-bsdtar/chat-governed-data/)。
- [CourtWork review](<../../snapshots/local/downloads/archives/CourtWork-review-24bd954-20260913.zip>)：review/handoff、product definition draft、sources、manifest；[解包](../../snapshots/local/downloads/extracted-bsdtar/review/)。
- [implementation plan](<../../snapshots/local/downloads/archives/courtwork-implementation-plan-20260910.zip>)：README/plan/backlog/tickets/work orders/contracts/evidence；scripts 未解包；[解包](../../snapshots/local/downloads/extracted-bsdtar/implementation-plan/)。
- [frontend harness v3](<../../snapshots/local/downloads/archives/Courtwork-Claude-Frontend-Harness-2026-09-16-v3.zip>)：README、frontend audit、sidebar trace、verification 已解包；patch/APPLY/PR_BODY 只保留在 ZIP 原件。

## 依赖与离线限制

manifest 静态扫描到 13 个远端引用族和 11 个缺失本地依赖。缺口主要是 exported `.dc.html` 所需的 `support.js`、Agent UI 的 `_ds` bundle、Mnemos 的 JSX/CSS；这些文件在 Downloads 相邻位置不存在，未擅自借用其他目录的同名文件。远端依赖包括 Google Fonts，以及 Mnemos 的 React 18.3.1、ReactDOM 和 Babel CDN；Jev 的 TypeSafe/Every/Empryo/GitHub/Qwen 链接也未下载。因而这些快照适合离线阅读和 provenance 检查，不能宣称每个 HTML 都可离线运行。

## 排除与阅读深度

排除个人照片、通用截图、简历、考试书、学术论文 PDF、恢复码、无关 agent/repo source tree，以及明确命名为 `oh-my-pi-main/`、`bub-main/`、`wx-cli-again/` 的嵌套项目。核心 anti-slop、legal workstation、CourtWork/schema 文档与 HTML headings/依赖做了深读；anti-ai-slop-kit 中的全部文件、截图和 data 则按自足包登记，关键入口深读，其余以 metadata/indexed 方式保留。所有源文件只读，完整 mtime/sha256 见 intake manifest。
