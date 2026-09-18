# UI / Design SaaS Consumption Index

> 调研日期：2026-09-07  
> 方法：Exa 6 个 workstreams，共浏览 90 个搜索结果；对 15 个高信号来源进一步全文复核。  
> 目标：不是建立“灵感收藏夹”，而是建立一个可供人类与施工 Agent 渐进披露、按任务消费的 UI / Design 知识索引。

## 0. Index contract

### 评级

- **P0**：应进入默认设计参考面；可以形成规则、pattern 或 implementation baseline。
- **P1**：按任务选择性披露；用于特定布局、视觉语言、editor/canvas 或交互细节。
- **P2**：实验性或社区方案；值得借鉴其信息架构/agent consumption 机制，但不默认视为生产基线。

### 来源等级

- **A / Canonical**：产品或 Design System 官方一手文档。
- **B / Practitioner**：实际 ship 该产品/网站的设计师或工程师复盘。
- **C / OSS**：可运行、可审计的开源实现。
- **D / Experimental**：新项目、社区规范或尚未形成广泛生产验证的方案。

### Consumption tags

`CRAFT` 品味/细节 · `RULES` 规范 · `PATTERN` 页面/交互模式 · `SHELL` 工作台框架 · `TOKENS` token/主题 · `MOTION` 动效 · `A11Y` 可访问性 · `CODE` 可复用代码 · `CANVAS` editor/canvas · `AGENT` agent-readable 设计知识 · `GATE` lint/review/质量闸门

---

# 1. P0 — 默认消费层

| Source | Level | Tags | 应消费什么 | 不应消费什么 |
|---|---|---|---|---|
| [Vercel — Web Interface Guidelines](https://vercel.com/design/guidelines) | A · P0 | `RULES` `CRAFT` `A11Y` `MOTION` `GATE` | 键盘、focus、URL-as-state、deep-link、loading、empty/error、target size、motion、optical alignment、typography、performance 等“完整行为契约”。几乎可直接转成 UI review checklist。 | 不把 Vercel-specific 美学偏好当通用法则。 |
| [Vercel Labs — AGENTS.md form](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/AGENTS.md) | A · P0 | `AGENT` `RULES` `GATE` | MUST/SHOULD/NEVER 形式特别适合直接喂给 coding agent；可作为 UI Skill / verifier 的模板。 | 不整份永久塞入 context；应按任务路由。 |
| [Linear — How we redesigned the Linear UI](https://linear.app/now/how-we-redesigned-the-linear-ui) | A/B · P0 | `CRAFT` `SHELL` `PATTERN` `TOKENS` | “先 stress-test 所有真实 view/state，再定行为”的方法；sidebar/tabs/headers/panels 的层级；高密度但低噪声；LCH 主题生成；behavior definition → feature flag → rollout。 | 不直接复制 Linear 外观或布局比例。 |
| [GitHub Primer — Product UI](https://primer.style/product/) | A · P0 | `RULES` `PATTERN` `A11Y` `CODE` | developer/productivity tool 的成熟组件、patterns、primitives、accessibility；尤其适合 forms、tables、navigation、dialogs、data UI。 | 不把 GitHub 信息架构原样移植。 |
| [Atlassian — DESIGN.md](https://atlassian.design/DESIGN.md) | A · P0 | `TOKENS` `RULES` `AGENT` | portable token-first manifest；把“氛围/颜色语义/排版/布局/elevation/components/do-don’t”压成 agent 可读的设计合同。 | 官方已明确：不要仅凭 DESIGN.md 猜具体 production API；实现细节应再查 MCP/Skill。 |
| [Cognite Aura — AI-native Design System](https://docs.cognite.com/aura-design-system/what-is-aura) | A · P0 | `AGENT` `RULES` `PATTERN` `TOKENS` | 最清楚的 agent-native DS 分层之一：Foundations→DESIGN.md；Primitives→package/Storybook/llmUsage；Patterns→Skills/docs。重点消费“human 与 agent 共用同一系统”的封装方式。 | 不必照搬 Cognite 组件风格。 |
| [NVIDIA Elements — DESIGN.md for AI Agents](https://nvidia.github.io/elements/docs/design-md/) | A · P0 | `AGENT` `TOKENS` `RULES` | 官方维护、与真实实现联动的 DESIGN.md；明确区分“官网视觉仿写”与“维护中的产品 UI contract”。可作为 canonical vs inferred design language 的范例。 | 不把公开网站 scrape 出来的品牌风格等同于官方 DS。 |
| [Ant Design — For Agents](https://ant-design.antgroup.com/docs/react/for-agents) | A · P0 | `AGENT` `CODE` `GATE` | `design.md + llms.txt + CLI + MCP + lint/migrate` 的完整 agent consumption pipeline；证明成熟组件系统正在把 AI 消费面做成一等公民。 | 不必采用 Ant 视觉语言；重点看工具链封装。 |
| [Rauno Freiberg — What will you ship?](https://rauno.me/craft/vercel) | B · P0 | `CRAFT` `MOTION` `CODE` `A11Y` | 视觉语言如何从约束和隐喻长出来；grid/crosshair、字体、响应式、container query、reduced motion、VoiceOver；“performance + restraint + rhythm”比装饰重要。 | 不把 crosshair/grid/pixelation 当通用 aesthetic recipe。 |
| [Dani Asyrofi — Interface Tuning](https://daniasyrofi.com/writing/details-that-make-interfaces-feel-better/) | B · P0 | `CRAFT` `RULES` `CODE` `MOTION` | 31 个可验证、可 demo、可安装的 interface details；从 tabular nums、concentric radii、optical alignment 到 motion/loading/focus。最适合做“micro-craft index”。 | 个别“in the wild”观察仍需按产品复核；规则不可机械全局化。 |
| [Cube UI Kit](https://github.com/cube-js/cube-ui-kit/) | C · P0 | `CODE` `PATTERN` `A11Y` `SHELL` | 真正由 Cube Cloud 使用的 100+ React components；React Aria、CommandMenu、FilterPicker、FileTabs、ResizablePanel、forms、Storybook。适合作为成熟 SaaS/tool UI 的代码 baseline。 | 不必采用 Tasty styling engine；可以只消费 interaction/API pattern。 |

---

# 2. P1 — Design SaaS / editor / canvas 工作台

| Source | Level | Tags | 应消费什么 |
|---|---|---|---|
| [Figma — Navigating UI3](https://help.figma.com/hc/en-us/articles/23954856027159-Navigating-UI3) | A · P1 | `SHELL` `CANVAS` `PATTERN` | toolbar + navigation + left/right panels + canvas 的职责拆分；resizable/collapsible panels；feature placement 随 context 变化；复杂产品如何通过 chrome 重组降低认知负担。 |
| [Figma — Navigation bar and left sidebar](https://help.figma.com/hc/en-us/articles/360039831974-Explore-the-navigation-bar-and-left-sidebar) | A · P1 | `SHELL` `CANVAS` | 当前 Figma 五区工作台结构；navigation rail 与 contextual sidebar 的分离；Agents/Assets/Variables 等进入同一工作台语义。 |
| [OpenPencil — Architecture](https://openpencil.dev/guide/architecture) | C/D · P1 | `CANVAS` `SHELL` `CODE` `AGENT` | 极高相关的开源 editor：framework-agnostic core + Vue headless SDK；CanvasRoot、LayerTree、PropertySection/Grid/List、Toolbar、selection composables、commands、MCP/CLI。适合拆 editor shell 而非只看成品 UI。 |
| [OpenPencil — AGENTS.md](https://github.com/open-pencil/open-pencil/blob/bff889577503e030505a942655713183a1cab4d1/AGENTS.md) | C/D · P1 | `CANVAS` `AGENT` `CODE` | editor core 与 UI wrapper 解耦、renderVersion vs sceneVersion、side-panel repaint isolation、shortcut、scrub input、splitter 等大量“隐性施工知识”。 |
| [tldraw SDK](https://tldraw.dev/) | C · P1 | `CANVAS` `CODE` `PATTERN` | selection/transforms、camera、multiplayer/presence、history、adaptive UI、theme、自定义 shape/tool/UI；适合作为 infinite canvas 的成熟 runtime/UI primitive 来源。 |
| [Excalidraw](https://github.com/excalidraw/excalidraw) | C · P1 | `CANVAS` `CODE` `PATTERN` | 建议直接看源码中的 ActionManager / LayerUI / CommandPalette / SelectedShapeActions：同一个 Action 同时被 keyboard、menu、property panel、command palette、API 消费，是很干净的“行为先于表面”结构。 |
| [GrapesJS](https://grapesjs.com/) | C · P1 | `CANVAS` `CODE` `SHELL` | visual editor 的 panels、layers/pages/assets/components/plugin extension points；适合需要页面/内容编辑器时消费。 |

### Design SaaS 的共同结构

不是“一个 canvas + 两侧栏”这么简单，而是：

1. **scene / document state** 与 **ephemeral UI state** 分离；
2. **selection** 是 inspector、context menu、command availability 的共同输入；
3. **action/command** 是真正稳定的行为原语，toolbar/menu/shortcut/palette 只是不同投影；
4. **canvas render** 与 **UI overlay** 分层，避免高频 interaction 牵动整个 DOM/UI；
5. panel 在 wide / narrow / mobile 之间不只是缩放，而会变成 docked → compact popover → sheet/bottom surface；
6. history/undo、mixed values、scrubbing、multi-selection、focus/keyboard 都属于核心产品语义，不是 polish。

---

# 3. P1 — 个人网站 / 品味与陌生化

| Source | Level | Tags | 应消费什么 |
|---|---|---|---|
| [V.H. Belvadi — An exercise in restraint](https://www.vhbelvadi.com/redesign-2025) | B · P1 | `CRAFT` | 用明确约束塑造个人站：spacing scale、单字体、弱化颜色、减少 multi-level nav、click > hover、progressive enhancement。重点是“限制选择空间产生风格”。 |
| [Sidney Alcantara — Design notes 2026](https://sidney.me/writing/design-notes-2026) | B · P1 | `CRAFT` `MOTION` | paper/postcard/typewriter 的可解释隐喻；hover、paper sheen、glass nav、popover、progressive blur 都服务于统一语汇。适合研究“陌生化但不破坏可用性”。 |
| [Aarron Walter — Colophon](https://aarronwalter.com/colophon) | B · P1 | `CRAFT` `A11Y` | browser-first / Claude Code 辅助设计；明确视觉来源、字体、motion，同时做 WCAG AA、reduced motion、focus management。 |
| [Arnaud Rocca portfolio case study](https://tympanus.net/codrops/2026/03/31/arnaud-roccas-portfolio-from-a-gsap-powered-motion-system-to-fluid-webgl/) | B · P1 | `CRAFT` `MOTION` `CODE` | 把 GSAP/WebGL 特效收束成 reusable motion system，并补 touch/keyboard/reduced-motion/no-JS；适合研究“高表现力但仍工程化”。 |

### 从个人站点只抽这四种东西

- **signature motif**：一个能反复出现但不喧宾夺主的视觉语法；
- **constraint set**：字体/颜色/间距/交互方式的限制；
- **rhythm**：内容密度、留白、滚动、motion 的节拍；
- **craft exception**：允许 ±1–2px optical correction、特殊 easing、非标准但有理由的细节。

不要把个人站的 hero、WebGL、glass、grain、cursor effect 当作组件库。

---

# 4. P1 — 成熟 Design System / 业务 pattern 补充

| Source | Level | Tags | 应消费什么 |
|---|---|---|---|
| [Primer — Forms](https://primer.style/product/ui-patterns/forms/) | A · P1 | `PATTERN` `A11Y` | field grouping、validation、focus/error、scanability；适合所有专业工作流。 |
| [Primer — Data visualization](https://primer.style/product/ui-patterns/data-visualization/) | A · P1 | `PATTERN` `A11Y` | chart anatomy、非颜色 cue、table/download fallback；适合 dashboard。 |
| [Primer — Color usage](https://primer.style/product/getting-started/foundations/color-usage/) | A · P1 | `TOKENS` | base → functional → component token 的分层。 |
| [Shopify Polaris — Color tokens](https://polaris.shopify.com/design/colors/color-tokens) | A · P1 | `TOKENS` | semantic color roles、interaction state、Figma variables ↔ code token。 |
| [IBM Carbon](https://github.com/carbon-design-system/carbon) | A/C · P1 | `CODE` `TOKENS` `RULES` | 大规模产品 DS 的 package/tokens/icon/motion/grid/test 架构；不一定追求其视觉，但工程成熟度很高。 |
| [Vercel Geist — Sheet](https://vercel.com/geist/sheet) | A · P1 | `PATTERN` `A11Y` | contextual detail panel 与 modal/drawer 的边界；trigger-side、focus return、explicit close、read-mostly。非常适合 master-detail。 |
| [Linear — A Linear spin on Liquid Glass](https://linear.app/now/linear-liquid-glass) | A/B · P1 | `CRAFT` `SHELL` `MOTION` | “Aqua aesthetic + ProKit discipline”：专业工具可以借材质感，但必须为密集阅读与持续工作让路；其主动放弃 refraction 的理由尤其值得消费。 |

---

# 5. P1/P2 — 开源 implementation candidates

| Source | Level | Tags | 建议定位 |
|---|---|---|---|
| [ReUI](https://github.com/keenthemes/reui/) | C · P1 | `CODE` `PATTERN` `AGENT` | 3k+ stars；shadcn copy-own；Data Grid / Gantt / Kanban / Tree / Timeline / Resizable；大量真实 dashboard compositions。适合“不要重新造复杂 UI primitive”。 |
| [Arkite UI](https://github.com/foson-co/arkite-ui) | C/D · P1 | `CODE` `AGENT` `PATTERN` | 新项目但结构很对：SaaS-first、density、FilterBar/BulkActionBar/VirtualList，且内置 `llms.txt` / `DESIGN.md` / `registry.json` recipes。适合研究 agent-readable package。生产采用前需 code audit。 |
| [EPAM UUI](https://github.com/epam/UUI/) | C · P1 | `CODE` `PATTERN` | 企业级 tables/forms/lazy lists/timeline/service primitives；视觉不是主要参考，复杂业务组件实现值得看。 |
| [SaaS UI](https://saas-ui.dev/) | C · P1 | `CODE` `PATTERN` `TOKENS` | semantic tokens + recipes + SaaS flows；可作为常见业务 surface 参考。 |

---

# 6. P0/P2 — 让 Design Knowledge 真正可被 Agent 消费

| Source | Level | Tags | 可迁移机制 |
|---|---|---|---|
| [Cypress Design — AGENTS.md](https://github.com/cypress-io/cypress-design/blob/main/AGENTS.md) | C/A · P0 | `AGENT` `GATE` | `index/router → only fetch needed pillar/component → review-checklist`；明确“code is truth, Figma is sketch”；rules 随 package 一起 ship。非常接近理想 consumption architecture。 |
| [Design Cortex](https://github.com/nico-scheinkman/Design-Cortex) | D · P1 | `AGENT` | `index.json → component/index.md → variants/*` 两级渐进披露；大 Figma DS 被 shard 后 agent 首屏成本保持稳定。其“KB is interface between design system and agent”值得直接借鉴。 |
| [Layout context CLI](https://github.com/uselayout/cli/blob/main/README.md) | D · P1 | `AGENT` `GATE` | MCP 的 `get_design_system / get_tokens / get_component / check_compliance / preview`；还能导出 DESIGN.md/AGENTS.md/Codex Skill。适合研究“read → build → verify”的闭环。 |
| [coss-ui-mcp](https://github.com/Zoot01/coss-ui-mcp) | D · P2 | `AGENT` | `plan → search → get_component → theme` 的 on-demand retrieval；说明 giant DESIGN.md 与 MCP 分工：portable summary vs task-time detail。 |
| [AgentsORG .design](https://github.com/AgentsORG/design) | D · P2 | `AGENT` `TOKENS` | 一个 self-contained living visual contract：tokens + components + rationale + voice + rules + integration；适合参考 schema，不宜直接视作标准。 |
| [Operant Design System](https://github.com/proteendas/operant-design-system) | D · P2 | `AGENT` `PATTERN` | 专为 agentic workflow：prompt composer、run card、streaming response、approval bar、event log、citations、HITL。很适合做 UI specimen；成熟度需单独审计。 |

---

# 7. 建议的本地索引形态

```text
design-index/
├── INDEX.md                    # 只放路由、优先级、来源与一句话摘要
├── craft/
│   ├── typography.md           # tnum / line length / balance / antialiasing
│   ├── geometry.md             # optical alignment / concentric radii / borders
│   ├── motion.md               # durations / easing / springs / reduced motion
│   └── restraint.md            # color / whitespace / novelty budget
├── patterns/
│   ├── app-shell.md            # rail / sidebar / main / inspector / responsive contract
│   ├── master-detail.md
│   ├── tables-and-lists.md
│   ├── command-palette.md
│   ├── forms.md
│   ├── loading-empty-error.md
│   └── keyboard-and-focus.md
├── editor/
│   ├── canvas-shell.md
│   ├── selection-inspector.md
│   ├── action-command-model.md
│   ├── history-undo.md
│   └── responsive-panels.md
├── systems/
│   ├── vercel.md
│   ├── primer.md
│   ├── linear.md
│   ├── atlassian.md
│   └── aura.md
├── implementations/
│   ├── cube-ui.md
│   ├── reui.md
│   ├── tldraw.md
│   ├── openpencil.md
│   └── excalidraw.md
└── agent/
    ├── DESIGN-MD.md             # portable compact contract
    ├── ROUTER.md                # progressive disclosure rules
    ├── component-index.json     # component/pattern lookup
    ├── REVIEW.md                # visual + behavior quality gate
    └── provenance.md            # source, version/date, canonical/inferred
```

## INDEX.md 每条建议字段

```yaml
id: vercel-web-interface-guidelines
priority: P0
source_type: canonical
url: https://vercel.com/design/guidelines
consume_for:
  - interaction-completeness
  - keyboard-focus
  - loading-empty-error
  - motion
  - responsive
avoid:
  - blindly-copying-vercel-brand-style
fetch:
  mode: on-demand
  sections: [Interactions, Animations, Layout, Content, Forms, Performance, Design]
last_verified: 2026-09-07
```

真正给 Agent 的 `INDEX.md` 不要保存长篇摘要。它只负责**知晓存在 + 路由**；需要实施某个 surface 时，再披露对应 pattern/source/component。

---

# 8. 从调研中可以直接定下来的几条原则

1. **“成熟感” = interaction completeness，而不是 decoration density。** 视觉上越成熟的工具往往越克制，但 hover/focus/keyboard/loading/error/history/URL state 等行为密度极高。
2. **先确定 frame，再填内容。** 专业工具的 app shell、panel budget、master-detail、overlay/inspector contract 应先于 card/component 拼装。
3. **Action/command 是比按钮更稳定的 UI 原语。** 同一动作应该可以被 button、menu、shortcut、command palette、API 投影，而不是每个入口自带一份业务逻辑。
4. **Taste 应编码为约束与例外，而不是截图。** “少用 accent、一个 novelty motif、optical correction 可 ±1px、motion 必须有因果、nested radii 同心”比“像 Linear/Vercel”更可迁移。
5. **Design System 给 Agent 至少需要三层：**
   - compact portable contract：`DESIGN.md` / rules；
   - progressive lookup：index / MCP / sharded KB；
   - executable gate：lint / screenshot review / behavior checklist。
6. **Figma 不是唯一 truth。** 可视设计、code primitives、tokens、agent-readable guidance 必须有明确 authority；最成熟的新方案开始把规则与 package/code 同步发布。
7. **开源库优先消费复杂 primitive，而不是默认 aesthetic。** DataGrid、tree、resizable、command、canvas selection、undo、property panel 等隐性成本远高于换一套颜色/圆角。

---

# 9. Recommended first consumption pass

若下一轮只允许施工 Agent 读很少内容，顺序建议：

1. Vercel Web Interface Guidelines — 完整 UI 行为底线；
2. Linear UI redesign — 专业工作台如何从 concept 压到真实 view/state；
3. Primer Product UI — 普通专业 SaaS / developer tool patterns；
4. Figma UI3 + OpenPencil/tldraw — editor/canvas 与多 panel 工作台；
5. Rauno + Interface Tuning — 品味与 micro-craft；
6. Atlassian DESIGN.md + Aura + Cypress AGENTS — 把上述知识编译成 Agent 可消费 contract；
7. Cube UI / ReUI — 遇到实际组件时优先复用、适配、审计，而不是重造。

这套顺序刻意把 **规范 → 真实案例 → 特殊工作台 → craft → agent packaging → implementation** 分开，避免“先看漂亮组件，然后用卡片拼 demo”的逆向路径。
