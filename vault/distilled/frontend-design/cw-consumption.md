# CW 通用前端设计素材消费链

状态：2026-09-23 有界只读消费。源仓库 `/Users/lesprivilege/Projects/Courtwork` HEAD 为 `59f50e09beb8d4fa43fbc0878a49979900b26f91`；本批只读取 7 份通用文本记录，未复制源码、客户数据、截图或源仓库 AGENTS/Skill。CW Pages 图式与 4 份 SVG 快照已经在 [CW Pages 参考索引](cw-pages-reference-index.md) 中登记，本页不重复那部分。

外部 URL 单独见 [CW external references catalog](../../provenance/cw-frontend-references/catalog.json)。6 条外部记录都来自本地 Courtwork 记录，本批没有重新访问正文，故保持 `partial`，不能继承 `verified`。本地快照与 hash 见 [intake](../../intake/cw-frontend-consumption-20260923.json) 和 [snapshot directory](../../snapshots/local/downloads/cw-frontend-consumption-20260923/README.md)。

## 消费链总表

| ID | source → 本地摘要 | 采纳 / 拒绝 | 代码或页面定位 | 验证边界 |
|---|---|---|---|---|
| CW-FE-R01 | 外部 accessibility、control 和 token 参考 → `cw-luna-external-index.md` | 采纳 24px AA floor、44px coarse/high-consequence、200% reflow/text-spacing、APG tabs；Carbon/Radix 只作 donor。拒绝 universal44、Primer 24/28 未核实数值、Apple sidebar 未核实。 | 现有 CW token/28 fine/44 coarse 作为消费入口；没有因本条新增 CSS 或依赖。对应外部 slug：`cw-wcag-target-size-minimum`、`cw-wcag-resize-text`、`cw-wai-aria-tabs`、`cw-carbon-button-style`、`cw-radix-spacing`。 | 索引明确没有重跑浏览器/200%/coarse 输入；这是设计约束候选，不是 CW conformance。 |
| CW-FE-R02 | grammar audit → parent disposition → `cw-disposition-20260922.md` | 采纳 scoped diagnosis；只选择 runtime-detail-local M1 spacing，不重做 global density。390px fine pointer 的 24×24 close 不自动判 AA fail；coarse path 另验。 | implementation candidate `app/web/runtime-management-view.mjs` only；M1 final selection 在 `b8cd54f/ffd4e39`，integrated `7dc852a`；related target map 留给 06d/reader owner。 | M1 有 parent browser comparison 和 Luna checks；native zoom、200%、读屏、coarse/hybrid 等仍列未执行。 |
| CW-FE-R03 | Claude 06d frontend handoff → `cw-06d-surface-continuity.md` | 采纳对象 tab、scope/kind/version identity、existing renderer、focus/close/restore；拒绝 URL bar、Browser/Terminal 假 tab、把 tab close 当取消/删除/批准。 | existing `surface-modules.mjs`、`app.mjs`、`.surface-document-tab`、tablist keyboard、`rememberSurfaceFocus` 等；A1/A2 `90be9af/dfc90b7`，B/PV-R1 follow-up `4698d8b`，主线回执 `cd6856f`/`maine525a3a`。 | 记录有 87/87 main checks、B journey 34/34、PV-R1 7/7；real Browser/native accessibility/200% 等不由此宣称完成。 |
| CW-FE-R04 | Claude capability consumption → `cw-06-capability-consumption.md` | 采纳“录入≠启用≠已用≠已加载”、proposal diff、人审 Apply/Reject、active Run freeze；拒绝模型文本直接进入 installed list、用 fixture 伪装生产能力、把 proposal ledger 当第二 registry。 | `runtime-proposals.mjs`、`runtime-proposals-view`、Workbench “Proposed by the agent”、`runtime-control.json`/CAS；commits `334848c`、`c069433`、`6df4007`、`43d498e`。 | 作者定向套件、相邻 86/86、Local test browser evidence 记录通过；非作者复核、真实 provider、200%/读屏仍未做，Governance status 为 candidate。 |
| CW-FE-R05 | Pages reference inventory → `cw-pages-reference-index.json` | 不采纳为已消费/已验证设计。Linear、Minard、Unlost、Exat、R—K、Nova、Things、Zed、Raycast 等保持 preparation-only/pending；不得由 URL 或 `courtwork_take` 推出截图、原站行为或实现。 | 页面没有可授权的代码坐标；`implementation_hint` 只是“先取证，再裁定”；由 main 的 frontend-design disposition 继续处理，不进入 CW/SE 当前绘制事实层。 | 原记录明示无 original-site captures/current visual verification；外部 URL 本批不重访。 |
| CW-FE-R06 | MCP 外部实践 → `cw-external-practices.md` | 采纳 Host owner、consent/permission、cancel 与 terminal state 分离、dispatch 后 unknown；拒绝把协议写成 local approval schema、sandbox、exactly-once 或 rollback 证明。 | local mappings P05/P06/DF-06；这是 Host/interaction responsibility boundary，不生成新 UI library 或 backend contract。 | 原记录称 3 个官方页面已读取，但本批只消费其本地摘要；不重新核验当前规范版本，也不宣称 Courtwork 已支持 Tasks extension。 |
| CW-FE-R07 | Claude polish handoff → `cw-claude-polish-handoff.md` | 采纳 clean/cool、局部陌生化、当前 Navigator/Work/Inspector、Composer/Chat/Workspace/Run inspector 的事实边界；拒绝把 fixture、参考产品菜单、截图或历史建议变成生产能力。 | baseline owner `app/web/styles.css`, `index.html`, `app.mjs`, surface/renderers；Claude 是 writer，Codex/Astra 做 integration/independent acceptance；Pages redesign/deploy 明确排除。 | 文档列出既有 tests/counterexamples 与未执行 native/IME/200%/paid provider；本批没有重新运行或重建当前 UI。 |

## 给 CW/SE 绘制的最小消费规则

CW 和 SE 共用的前端素材可以进入绘制 brief 的，是“关系和责任如何显现”的方法：

- 控件尺寸、glyph 尺寸、label type 和 group spacing 分开；24px 是需要复核的 AA floor，44px 只在 coarse/touch 或高后果动作使用。
- 文本和状态不靠固定高度裁剪；正文、菜单、tab panel 和 status text 在 200%/text-spacing 下仍需有可读路径。
- Tab 识别对象、版本和 scope；close/switch/restore 是 view action，不能悄悄取消 Run、删除成果或批准变更。
- `recorded / source / requested / effective / bound / loaded` 等责任边界保持文字可见；模型建议、Host 回执、正式接受和页面已渲染是不同事实。
- 任何“参考页面”先进入 candidate；只有有本地摘要、采纳/拒绝理由、代码/页面定位和验证证据，才能进入现行设计交付。

## 明确缺边

本批没有改 Courtwork 或 Praxis 产品代码，没有新建页面、没有运行 browser/print/zoom/reader/VoiceOver/touch/IME 验证，没有重新获取 6 条外部网页正文，也没有确认 Pages reference inventory 的任何 queued URL。M1、06d、runtime proposal 等实现坐标是源仓库记录中的事实范围，不能扩写成当前工作树重新构建或本次新实现。

源仓库有未跟踪 `.agents/`、`.obsidian/`、`skills-lock.json`；它们未复制、未解析为本仓库指令。没有复制客户材料、秘密、全量截图或运行时状态。后续若要把 partial 外部参考升级为可引用证据，应逐 URL 重新读取、保存正文快照、更新 hash/status，再由 main 决定是否进入通用设计规范。
