# Schema Engineering 前端设计消费记录

本页是对 `/Users/lesprivilege/Projects/Schema Engineering` 的定向设计召回，服务于 Praxis 后续前端设计复用。它记录“来源 → 本地记录 → 采用/拒绝/review → 体现位置 → 验证状态”，不把 Schema Engineering 的论文语义、reader 实现或外部参考自动升级为 Praxis 规范。

本批只读了发布面、阅读器验收、Practice/Practice Index、设计 brief 和 reader CSS/JS；未执行 SE 构建或脚本，未打开外部当前正文，未做浏览器视觉复验。原件快照和 mtime/hash 登记见 [se-frontend-recall-20260923.json](../../intake/se-frontend-recall-20260923.json)，快照目录为 [se-frontend-recall-20260923](../../snapshots/local/downloads/se-frontend-recall-20260923/)。

## 设计消费链

| 来源 ID / URL | 本地记录与定位 | 采用、拒绝或 review | 体现在哪个文件/页面 | 验证状态 |
|---|---|---|---|---|
| `se-publication-surface-20260923` | `papers/notes/publication-surface.md`；“阅读结构”“图与文案”“来源消费”“Reader controls” | **采用为信息架构约束**：阅读入口、发布版本、候选/已发布区分、图文语义一致；**拒绝**把页面当作正文或把外部产品状态复制进 SE | `papers/notes/publication-surface.md`；README/Pages 入口与 reader revision 记录 | 历史发布回执；本轮未重跑发布 |
| `se-reader-controls-evidence-20260923` | `papers/evidence/reader-controls-20260911/README.md`；390/320 窄屏、主题/语言切换、Index 未声称视觉验收 | **采用为验证措辞纪律**：已测交互与未测交互分开写；不把截图存在当作全站视觉验收 | Reader controls；对应 `papers/reader/reader.css` / `reader.js` | 历史浏览器截图/validator 回执；本轮未复验 |
| `se-release-qa-20260915` | `papers/qa/2026-09-15/README.md`；前态 hash、14 项 reader checks、历史 HTML 字节核对、无新增视觉验收 | **采用为发布 review 边界**：小范围改动也核对源码/结构/字节；**拒绝**把构建通过写成新增视觉证明 | 9.8 release QA 与 `papers/qa/2026-09-15/*` | 历史 QA 回执；状态需按实际 HEAD 重查 |
| `se-schema-engineering-brief-20260923` | `papers/notes/2026-08-25-schema-engineering-brief.md`；“四个消费者”“renderer/uiTemplate”“E2E” | **采用为设计语义候选**：schema 同时服务用户、Agent、上下游模型和 renderer；**不采纳为实现状态** | 仅进入本交接的前端语义说明，不改 Praxis kit | 设计叙事，未连接 Praxis 实现 |
| `se-practice-20260923` | `papers/src/practice.md`；§2.8、§3.1、§3.2、§5.3、§5.4 | **采用为可复用工作面语法**：文档/图形是表示；renderer 由 Work Contract 决定；Review surface 展示 Candidate delta、Evidence、Authority、uncertainty、side effect、reversibility；Current→Proposed→Reviewed→Committed | Praxis 后续前端设计素材与 review packet 结构；尚未写入 kit | 论文规范/候选实践，非 Praxis 运行验证 |
| `se-practice-index-20260923` | `papers/src/practice-index.md`；PI-09、PI-20、PI-21、PI-24、来源登记 §六及 2026-09-14 复核记录 | **采用为证据/裁决纪律**：外部参考、观察、最小命题、检验、处置、状态分开；**拒绝**把外部 UI/Runtime 语义当 SE 事实；保护性措辞保留在 Index 而非 UI 文案 | 本页 catalog 与 Praxis 前端设计消费记录；不复制全文进入页面 | 本地 Index 已有状态；外部正文本轮未重核 |
| `se-reader-css-20260923` | `papers/reader/reader.css`；`:root` tokens、`.reader-masthead`、`.reader-actions`、`.reader-toc`、窄屏 media query、print/forced-colors/reduced-motion | **可复用实现素材**：一条安静 sticky reading row、内容/目录分层、44px 控件、窄屏降级、打印和可访问性分支；**不复制** SE palette/品牌或页面语义 | 仅快照供后续 frontend 工单参考；没有改 Praxis CSS | 源 CSS hash 已登记；本轮未渲染 |
| `se-reader-js-20260923` | `papers/reader/reader.js`；`modeFromLocation`、hash/history、主题 localStorage、目录折叠、`popstate`/`hashchange` | **可复用实现素材**：URL 是可恢复状态、主题为可选偏好、页面模式渐进增强；**拒绝**把 reader JS 当通用审批/工作状态机 | 仅快照供后续 frontend 工单参考；没有改 Praxis JS | 源 JS hash 已登记；本轮未执行 |

## 已采用的前端语义

Schema Engineering 对 Human Work Surface 的最小要求是语义先于装饰：页面应使 `Current → Proposed → Reviewed → Committed` 的差异、依据、未决问题和后果可见；用户审阅的是工作变化及其 consequence，而不是模型内部计划、Agent avatar 或完整 chronology。图、表、HTML 和 Markdown 都只是 renderer 输出，按钮/评论/勾选只有在形成 typed Candidate Decision、通过 Authority/validation 并写入 Committed Event 后，才可更新正式状态。

这给 Praxis 的后续页面一个可复用结构：

```text
Current state
  → Candidate delta
  → Evidence / automated checks
  → uncertainty / open questions
  → Authority / side effect / reversibility
  → Review action
  → committed consequence / recovery point
```

适合先做静态或半交互的 renderer grammar：Anchored Document、Diff/Lineage、Timeline、State Graph、Matrix、Queue/Coverage，以及一张简短 Review packet。动作名称可以复用 accept、reject、revise、request evidence、defer、escalate、approve、withdraw；动作是否真正改变状态要由 Praxis 自己的 Contract/Authority 定义。

## 可复用的实现与验证素材

SE reader 的实现有三项适合转为后续前端工单的素材：

1. `reader.css` 将阅读宽度、目录 rail、控制行、状态色、打印、forced colors 和 reduced motion 作为同一阅读 surface 的约束；不是追求“漂亮”，而是把长文定位、窄屏、打印和可访问性一起验收。
2. `reader.js` 把当前模式、语言、hash 和主题偏好接到 URL/history/localStorage，并在 JS 不可用时保留基本内容；这适合低风险的渐进增强，不能直接用于正式工作提交。
3. `reader-controls` 与 9.8 QA 把“做过浏览器验证”“只做源/结构/字节验证”“本轮未视觉验收”分开写。Praxis 后续消费图式或页面时，应沿用这类证据分层。

## 外部参考消费地图

以下 URL 来自 SE 已有记录，本轮没有重新打开外部当前正文。它们只保留当时实际消费用途；catalog 独立逐 URL 登记为 `partial`，不表示当前页面或版本已复核。

| 来源 | SE 当时消费什么 | Praxis 可复用的边界 |
|---|---|---|
| [REEF README](https://github.com/Human-Agent-Society/reef/blob/8e87829572b210572cad2008c28d39888b2b8396/README.md) | 双语 README、Docs、公开 roadmap 的发布面信息结构 | 可借鉴入口/信息架构；不复制 REEF 产品能力或当前状态 |
| [REEF i18n check](https://github.com/Human-Agent-Society/reef/blob/8e87829572b210572cad2008c28d39888b2b8396/.github/scripts/check_readme_i18n.py) | README 结构同步检查 | 可借鉴“入口同步可机器检查”；不把其脚本当 Praxis 验收器 |
| [DeepSeek extension cookbook](https://deepseek-harness.github.io/deepseek-harness/en/reference/cookbook/extension-cookbook) | UI extension surface 的公开参考 | 可借鉴可插拔 renderer/extension seam；运行时 API 和兼容性需重核 |
| [DeepSeek user questions](https://deepseek-harness.github.io/deepseek-harness/en/reference/subsystems/user-questions) | provider-neutral question vocabulary / presentation intent | 可借鉴问题/确认表面的语义分层；不把通用 question API 当正式 Authority |
| [DeepSeek architecture](https://deepseek-harness.github.io/deepseek-harness/en/reference/) | session/agent/capability events、turn flow、session log 的公开定义 | 可借鉴事件到 UI 投影的查考路径；不把 Runtime event 等同 Committed Event |

## 采纳、拒绝与待 main 裁决

已采纳到本批共享设计素材的内容是：

- 前端入口按消费者任务和阅读层级组织；发布候选、已发布版本和实现采用版本分开显示。
- Renderer 只负责把正式状态、候选差异、证据和 review 后果投影给人；UI 视觉完整度不能代替 Authority、validation 或 commit。
- 外部参考保留 URL、版本/commit（如来源记录已有）、实际消费用途和边界；不因链接存在就提升为外部共识或当前事实。
- 验收记录必须明确浏览器/打印/窄屏/可访问性/源码字节分别测了什么，未测什么。

本批拒绝升级的内容是：

- 不把 Schema Engineering 的论文模型、DeepSeek/REEF 的宿主能力或 reader CSS/JS 直接写入 Praxis kit 规范。
- 不把历史 QA 的通过数字当作当前 Praxis 页面视觉验收。
- 不把“页面有按钮/图/状态色”当作已建立的工作提交、权限或审计能力。
- 不重新核对外部 URL，不据此做当前供应商/框架推荐。

需要 main 裁决的下一步是：是否把 `Current → Proposed → Reviewed → Committed` 与 `Review packet` 作为 Praxis 前端 design grammar 的候选；以及是否消费 SE reader 的窄屏/打印/reduced-motion 细节作为实现验收模板。当前没有修改 kit、docs、前端或共享索引。
