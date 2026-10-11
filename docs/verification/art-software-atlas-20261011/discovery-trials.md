# 新上下文任务的原创建议与阅读回执

## 2026-10-11

以下保存 agent 为合成任务写出的决策 memo 和读取清单，不是用户会话或私有项目材料。根代理的纠偏与取舍见 [薄消费记录](consumption.md)；原回执中的失误不静默改写。

## 纺织收藏

### 纺织收藏展网页：两种可试的表达方式

## 决策 memo

**建议先做一组小样，对比“连续经纬索引”与“分区接续图”。** 两者把手工秩序放在对象和资料关系里，不用民族风背景、仿古装饰或不明来源的传统纹样。它们是当代的信息设计假设，不是织物复原。现有材料只支持结构类比，尚不能替真实藏品判断织法、颜色意义或视觉特征。

| 试法 | 观感与组织 | 怎样转为软件 | 何时值得试 / 主要风险 |
|---|---|---|---|
| **A. 连续经纬索引** | 以轻细、稳定的横纵线组织藏品索引和比较字段；选中的对象列按同一顺序并置，局部详情用放大线迹或对象图。秩序来自规则、重复和明确的交叉，不靠“手工纸纹”背景。 | 藏品、属性、媒材结构分别存成有 ID 的数据；若做结构示意，用 SVG 路径和显式 over/under 次序，保留对象图、文字和语义 HTML。数百件先用筛选/搜索目录，再选一小组进比较台；窄屏按属性分组，固定对象顺序和字段口径。 | 适合对象有可比的共同字段、希望读者横向扫差异。经纬网格只是当代界面骨架，不能让人误认藏品都按同一种连续织法制作；没有结构资料时只画索引线，不模拟纱线。比较卡片参考仅在少量对象上看过结构，扩到藏品总览及窄屏实现都要实测。 |
| **B. 分区接续图** | 把一件藏品拆成有边界的色区/织造区，路径在区界处明确接续、回转或留空；不同藏品的分区并置，读者比较“结构如何变化”。空隙只表示已记录的开口/断接，不能用作缺失资料的漂亮隐喻。 | 每件作品按来源记录的区域、线段、连接关系建拓扑数据；局部以 SVG 分层绘制，交叉顺序、边界及未知状态可检查。若要密集动态绘制可将 Canvas 当渲染层，但另存可编辑的路径/连接图和对象 ID。目录仍由结构化字段筛选；比较视图可把同一属性/结构区域并列，点选区域回到整件作品。 | 适合藏品确有离散色区、接续、开口或多种结构组合，且有细节图/技术记录。Nasca 来源卡只支持一件具体作品的“discontinuous warp and weft”文字描述，且未能看结构图；不能把它泛化成全展的拼布语法，也不能声称软件图还原了历史工序。 |

### 两种试法共用的比较界面

首页承担数百件的查找：用真实目录字段筛选、排序和搜索，并显示结果数及当前条件。比较不是把几百张卡片都做成一张“织物墙”；让读者选取少量对象到比较台，按同一组字段逐行比较，始终看得到对象名/图像和字段单位。小屏可先选一个字段，再并列看各对象数值/说明。已采纳的比较参考来自 4 件对象、5 个属性，不能证明此方案对数百件、长标签、字段不齐、辅助技术或窄屏已有效；这些都要用真实目录和页面原型检查。筛选子集与全体藏品分清，保留清除条件和返回总览的操作。

**建议的第一轮取舍：**先做 A 的一个总览与两件藏品比较样张，验证字段是否真能横向比较；只有在藏品资料确实记录分区/接续且高清细节可核对时，再做 B。若目录没有共同字段或结构证据，先补资料模型/查看图像，不要从“织物感”推导出图案。

### 不应借用或暗示的内容

- 不借安第斯或其他社群的图案、颜色搭配、符号、服饰轮廓、仪式含义、名称或所谓“民族气质”来做通用皮肤。材料参考指出古代安第斯纺织连接身体、社会传递和仪式语境，且具体图像含义难以恢复；这不是可抽离的装饰库。
- 不把某件 Chimú 或 Nasca 的馆藏记录当作所有纺织品的制作规范；连续 tapestry weave 与 discontinuous warp/weft 不能合并成一种万能网格。
- 不以线条、动效或随机噪声冒充真实纤维、张力、厚薄、手工误差或穿戴动作。若是示意，明确标为当代示意；若讲对象结构，回到该对象的来源和图版核对。
- 不让线宽、颜色或“破损感”代替数据状态。缺图、未知、未编目、对象损坏和结构开口是不同事实；分别标注。

## 参考处置与对 memo 的影响

- **选用：ASA-G-ANDEAN-WOVEN-GARMENTS / ASA-M-01–03。** 给出两条结构方向：明确经纬遮盖次序的连续系统，以及允许色区改变经纬路径的离散系统；同时限定为特定安第斯来源，阻止把结构类比写成普遍传统或文化装饰。
- **选用：REF-COMP-001《按属性维持比较》。** 将比较建议从“对象卡片堆叠”改成同属性并置、对象顺序稳定；其 4×5 小样证据范围很小，因此 memo 把它当布局线索，并明确大型馆藏、窄屏、长字段仍须验证。
- **选用：ASA-G-EXTENT《范围选择与上下文保留》。** 促使目录筛选与比较选择分开表达：选集不必隐藏总览，过滤需显示当前范围/数量并可清除；也提醒要提供键盘及非拖动输入路径。
- **拒绝：ASA-G-ISLAMIC-GEOMETRIC-SURFACES / ASA-M-04–07。** 虽谈重复、交错和建构规则，但其语境是特定伊斯兰几何表面、单件砖、研究模型及馆教活动，与纺织收藏的来源不匹配；套用会把另一文化的图形特征变成“手工感”捷径。其是否能作为纯数学铺砌机制，当前需求也未提出，故不引入。
- **拒绝：把任何外部交互组件或展览风格作为现成方案。** 当前任务的两个参考足以形成可试机制；未查外站 demo、代码或素材许可，避免把演示画面当成适用于馆藏目录的已验实现。

## 还缺的信息

- 藏品数量、目录字段及其完整率；首要比较问题（年代、地域、材料、织法、用途或图像主题）和一次比较希望并列多少件。
- 每件作品可用的正反面/细节图、图像版权与放大许可；是否已有可信的织法、接缝、开口、修补或改制记录。
- 观众语言、屏幕/展场条件、需不需要打印或离线、无障碍要求及是否支持研究者导出。
- 是否涉及当代在世织作者/社群；若涉及，应由相应贡献者确认术语、署名、图像使用和解释边界。

## 本次阅读边界

没有查看藏品数据、原始博物馆网页、图像或外部源码，所以 memo 不作单件视觉判断、传统技法复原、图像意义解读、图像授权结论、可访问性符合声明或用户效果判断。初始路由是 Kit 的 Design → 艺术与软件操作入口 → 材料关系与来源接力；到两个结构假设和一个比较机制足以开样即止。整个 `material-relations.md` 还包含伊斯兰几何分支；那是相邻内容的过读，已明确拒用。未搜寻或猜测藏品集名称，也未编辑仓库。

## 实际读取的仓库文件（按读取顺序）

1. `AGENTS.md`
2. `kit/AGENTS.md`
3. `kit/README.md`
4. `kit/design/README.md`
5. `kit/design/references/README.md`
6. `kit/design/references/art-software-atlas.md`
7. `vault/provenance/art-software-atlas/README.md`
8. `kit/design/references/discovery-relay.md`
9. `kit/design/composition/material-relations.md`
10. `kit/design/composition/README.md`
11. `vault/provenance/art-software-atlas/material/README.md`
12. `vault/provenance/art-software-atlas/material/cards/asa-m-01-weaving-abstraction-ancient-and-modern.md`
13. `vault/provenance/art-software-atlas/material/cards/asa-m-02-met-chimu-shirt.md`
14. `vault/provenance/art-software-atlas/material/cards/asa-m-03-brooklyn-nasca-poncho.md`
15. `kit/design/references/curated/comparison-continuity.md`
16. `kit/design/composition/layout.md`
17. `kit/design/composition/encoding.md`
18. `kit/design/interaction/extent-selection.md`


## 设计资源

### Proposal: make brand rules and components discoverable to a coding agent

## Decision to review

Run a small, local-first pilot for one product surface. Treat “Open Design” as a likely name for **OpenDesign** (`nexu-io/open-design`, product site `open-design.ai`), but confirm the intended project by repository URL before choosing any integration. The research records a different, only partially checked candidate at `opendesigner.io`; the shared words do not establish shared identity.

The first deliverable should be a versioned design-system package in the application repository, plus one agent task that exercises it. Do not start with a remote design-file connection or a component installer. A readable package is the smallest route that makes current brand rules available without granting an agent new tools or account access.

## Materials to ask the designer for

1. **Authoritative rules and ownership:** current brand/product guidance, source owner, version/date, scope (which product and surfaces), and rules that are fixed versus negotiable. Include provenance or links for borrowed assets and third-party material.
2. **Semantic tokens:** canonical token names and values for the pilot surface (for example surface, text, border, focus, spacing, radius, and typography). State which file is canonical and how any JSON/Tailwind/CSS build output is derived.
3. **Real component contract, if components exist:** source or package location, supported framework/version, component names and legal variants, API, dependencies, license, and examples. For each pilot component, show key states such as default, disabled, focus, and error as applicable. If there is no reusable implementation, say so; do not imply a prose rule is an executable component.
4. **Examples and counterexamples:** one approved screen or fixture for the pilot, plus a few explicit “do not” cases. Include narrow-screen behavior, content constraints, and accessibility expectations where they affect the design.
5. **Change and exception path:** who approves updates, how product-specific exceptions are recorded, and how the agent should surface a missing rule instead of inventing one.

A workable pilot package can be as small as `manifest.json`, `DESIGN.md`, and `tokens.css`, with an optional `USAGE.md` and a fixture for the actual components. The manifest should give the package a stable identity and point to its source/provenance. Keep generated token indexes marked as derived and check them against the canonical token file. These fields follow the OpenDesign package documentation; they are a proposed pilot shape, not a universal format requirement.

## Integration path

**Stage 1 — local context.** Put the package beside the product code, pin its version or commit, and add a short project-level discovery pointer (for example in the repository's agent instructions) to the package and its precedence rules. Keep `DESIGN.md` readable by a coding agent; keep tokens machine-readable and importable. Record where the rules came from and which package version the task used.

**Stage 2 — prove the current code path.** If the team already has shared components, point the agent to those actual implementations and their examples. Link or expose them as a local registry only if retrieval is needed; inspect the exact files, dependencies, licenses, and diff before adding code. A registry distributes implementation files, so it is a different integration from a visual-rule package. If the team has only design files in Figma, defer that connection; it introduces account permissions and may expose write tools, and it is not required to test whether local brand instructions help.

**Stage 3 — consider richer access only after the pilot.** If local package updates are too manual, assess a read-only catalog/import workflow. If the needed source of truth is live Figma variables/components, separately assess an MCP connection: check the exact client and server, tool schemas, data destination, account scope, approval UI, and whether write tools can be disabled. Keep reads and writes distinct. A product's protocol or compatibility documentation does not prove the user's client is supported, connected, or safely configured.

OpenDesign’s own docs distinguish design-system packages, functional Skills, renderable design templates, plugins, CLI adapters, and MCP tools. Choose by need: brand rules belong first in the design-system package; use a Skill only if the agent needs a reusable workflow; use a component registry when it needs actual code; use MCP only when it needs live or writable external design data. Do not bundle these under one vague “design skill.”

## First validation

Use one bounded, representative task: ask the coding agent to implement a small settings-page change using **about six semantic tokens, two real components, and three relevant states**. Provide one approved fixture and the counterexamples. Ask it to identify the package/version it used, name any absent rule, and avoid silently creating a new component API.

Review the output against four checks:

- **Discovery:** Did the agent find and name the intended package and version without relying on an ambiguous product name?
- **Rule use:** Do produced styles use the canonical tokens and allowed component variants, with no unexplained hard-coded substitutes?
- **Behavior:** Do the required states, responsive behavior, and stated accessibility expectations appear in the implementation?
- **Traceability:** Can a reviewer connect each material design choice to a rule, token, component example, or explicitly labeled unresolved question?

Check token references and component API usage mechanically where the repository already supports it; review rendered output and accessibility behavior with a person. Record failures and the exact missing material. Do not treat one passing screen as proof of general brand compliance or OpenDesign runtime quality. The first result should decide whether the package was enough, whether real component retrieval is needed, and what the next smallest test should cover.

## Open questions for the review

- Which OpenDesign project does the team mean? Confirm via URL/repository before selecting product-specific instructions.
- Does the designer own an implementation package and token source, or only a visual guideline and Figma library?
- Which coding-agent host and framework will the pilot use? This changes the discovery pointer and component retrieval path.
- Are any brand assets or component implementations restricted to particular products, teams, or licenses?

## Evidence boundary

This is a proposal based on repository guidance and linked source cards, not a live product evaluation. The cards report text-only reading of vendor and protocol documents; their referenced pages lack saved body snapshots. No application was installed, account connected, package imported, MCP server called, code run, visual output inspected, or permission behavior tested. Vendor feature, privacy, compatibility, and security statements remain vendor claims. The source cards themselves warn that a package name or declared tool schema does not prove implementation behavior or authorization.

### References that shape this proposal

- Praxis [agent design resources](file://kit/design/references/agent-design-resources.md): package contents and choice among local instructions, registry, adapter, and MCP; prototype fixture and failure cases.
- OpenDesign [package contract card](file://vault/provenance/art-software-atlas/ecosystem/cards/asa-a-03-opendesign-design-systems.md): minimum package shape, provenance, optional fixtures, and derived-token caveat.
- OpenDesign [repository card](file://vault/provenance/art-software-atlas/ecosystem/cards/asa-a-02-opendesign-repository.md), [site card](file://vault/provenance/art-software-atlas/ecosystem/cards/asa-a-01-opendesign-site.md), and [distinct-name candidate card](file://vault/provenance/art-software-atlas/ecosystem/cards/asa-a-06-opendesigner-candidate.md): identity distinction and vendor-claim limits.
- OpenDesign [skills protocol card](file://vault/provenance/art-software-atlas/ecosystem/cards/asa-a-04-opendesign-skills-protocol.md): Skill and design-template distinction.
- MCP [tools specification card](file://vault/provenance/art-software-atlas/ecosystem/cards/asa-a-08-mcp-tools-spec.md), Figma [MCP card](file://vault/provenance/art-software-atlas/ecosystem/cards/asa-a-10-figma-mcp.md), and shadcn [registry card](file://vault/provenance/art-software-atlas/ecosystem/cards/asa-a-09-shadcn-registry.md): why live access, write permissions, and code distribution need separate review.
- [Ordered read log and navigation audit](file:///tmp/art-atlas/trial-ecosystem-read-log.md): exact local files read, in order, with source selections, omissions, and limits.

# Discovery trial read log: design resources for coding agents

Scope: follow the normal Kit entry for the user’s request; do not scan for hidden collection names. Paths below are exact workspace paths, in the order actually read. “Read” means file contents were opened in the shell; linked source cards contain summaries of their own cited web pages, which were not revisited here.

## Exact files read, in order

1. `AGENTS.md`
2. `README.md`
3. `kit/AGENTS.md`
4. `kit/README.md`
5. `kit/design/README.md`
6. `kit/design/references/README.md`
7. `kit/design/references/systems.md`
8. `kit/design/references/art-software-atlas.md`
9. `kit/design/references/agent-design-resources.md`
10. `vault/provenance/art-software-atlas/ecosystem/cards/asa-a-01-opendesign-site.md`
11. `vault/provenance/art-software-atlas/ecosystem/cards/asa-a-02-opendesign-repository.md`
12. `vault/provenance/art-software-atlas/ecosystem/cards/asa-a-03-opendesign-design-systems.md`
13. `vault/provenance/art-software-atlas/ecosystem/cards/asa-a-04-opendesign-skills-protocol.md`
14. `vault/provenance/art-software-atlas/ecosystem/cards/asa-a-05-opendesign-agent-adapters.md`
15. `vault/provenance/art-software-atlas/ecosystem/cards/asa-a-06-opendesigner-candidate.md`
16. `vault/provenance/art-software-atlas/ecosystem/cards/asa-a-08-mcp-tools-spec.md`
17. `vault/provenance/art-software-atlas/ecosystem/cards/asa-a-09-shadcn-registry.md`
18. `vault/provenance/art-software-atlas/ecosystem/cards/asa-a-10-figma-mcp.md`
19. `vault/provenance/design-grammar-atlas-20261002/cards/d01-agent-skills-specification.md`

No other repository files were opened. In particular, no AGENTS files in snapshots were used as instructions, and no search for hidden collection names was run. `find .. -name AGENTS.md -print` was used only to locate repository instruction files; its results showed the root and Kit instructions, which were read first.

## Navigation taken and dead ends

- Root `AGENTS.md` directs task work to `kit/README.md`; Kit entry routes design work to `kit/design/README.md`.
- Design README points to References and the art/software discovery route. The reference index then points directly to `art-software-atlas.md`, whose row “设计系统怎样供 agent 使用；Open Design 是哪一个” links the exact `agent-design-resources.md` grammar. That was the decisive route.
- The Systems page was read because the Design reference index offers it for known design-system sources. It lists common systems such as Atlassian, Carbon, Polaris, Primer, and frontend references; it does not identify the OpenDesign product. It was a useful classification check, then a dead end for identity/integration specifics.
- No broken links or dead filesystem paths were encountered. No external pages were opened directly; the source cards point to URLs but state their body snapshots were not captured.

## Chosen references and their concrete effect

- **`agent-design-resources.md`** — Primary local synthesis. It separates design-system package, component registry, Skill, CLI adapter, and MCP. This yielded a local package as the low-permission first pilot and a staged decision for code retrieval or remote/live access.
- **ASA-A-01 and ASA-A-02 (OpenDesign site/repository)** — Treat `open-design.ai` and `nexu-io/open-design` as the likely candidate and retain all feature, privacy, and compatibility claims as vendor-authored. This led to the proposal’s identity confirmation step and explicit evidence limits.
- **ASA-A-03 (design-system package)** — The card describes `manifest.json`, `DESIGN.md`, and `tokens.css` as a minimum package shape; optional usage, component fixture, derived indexes, previews, assets, and provenance add richer context. It drove the suggested package fields while labeling them a project format example, not a universal standard.
- **ASA-A-04 plus D01 (Skills)** — OpenDesign’s own protocol distinguishes functional Skills from rendering templates; the Agent Skills spec separately describes progressive loading and says a format does not guarantee host discovery. This prevents calling every brand file a “skill” and bounds workflow reuse claims.
- **ASA-A-05 (agent adapters)** — Records an adapter architecture claim but no tested implementation. Kept CLI adapter selection out of the first pilot; no claim that an adapter inherits safe host permissions.
- **ASA-A-06 (opendesigner.io)** — A distinct, partial name candidate, with no traced source repository or behavioral verification. This caused the proposal to ask for the exact URL/repository before making any product-specific decision; no claims from this page were attributed to nexu-io/OpenDesign.
- **ASA-A-09 (shadcn registry)** — Describes code distribution rather than visual guidance. This led to separating component implementation retrieval and reviewing dependencies, license, and diff from the design-rule package.
- **ASA-A-08 (MCP tools) and ASA-A-10 (Figma MCP)** — Protocol/vendor pages describe schema discovery, calls, and possible canvas writes but do not verify a particular server, client, account, or approval UI. This led to deferring MCP and requiring tool-scope, data-routing, permission, and read/write checks if later needed.

## References deliberately not pursued

- The catalog JSON, provenance stream, other ecosystem cards, and entire Vault were not traversed; the linked grammar and directly relevant source cards already answer the scoped proposal question.
- `systems.md` did not lead to an OpenDesign identity, so no individual vendor design-system cards (Atlassian/Carbon/etc.) were read. Their design rules would not establish what this designer owns or what project the user means.
- The full OpenDesign source repository, package contents, runtime implementation, issues, releases, demo/gallery, client compatibility, security policy, privacy implementation, and current product behavior were not checked. The source cards explicitly report text-only reading and no captured page snapshots.
- No current web search was performed; the trial was constrained to the Kit-linked evidence already available in the workspace. Any decision to use the named product should recheck the direct project URL and current docs.

## Overreading controls and evidence limits

- “Verified” on the source cards means the cited URL/text was checked when those cards were prepared. It is not independent verification of behavior or a guarantee the URL is current.
- OpenDesign package details, compatibility, data handling, and adapter behavior are vendor/repository statements, not runtime evidence. The proposal therefore recommends a pilot and tests outputs rather than promises compliance or quality.
- `opendesigner.io` is recorded as `partial`; it is not inferred to be the intended product or related to `open-design.ai`.
- An `SKILL.md` or `DESIGN.md` gives an agent text context; alone it cannot enforce code tokens, component APIs, accessibility, or visual fidelity. A registry can add source files and dependencies. An MCP server can expose live data or writes. Their names or schemas do not establish safety or access.
- The exact brand rules, component package, licensing, approval owner, coding agent host, framework, and target product were not supplied. These remain discovery questions, not assumptions resolved by these files.
- No install, account connection, network tool call, code execution, renderer, accessibility check, or visual inspection occurred.


## 留出：时序与比较

### Held-out discovery trial: breathing data, pauses, and comparison

**Question.** Turn “a few data groups should feel like breathing, paused musical phrases, while visitors can stop and compare at any time” into two interaction mechanisms, and name when sound or animation should be dropped.

## Decision memo

Treat “breathing” as a rhythm cue, not as a claim about the data. Keep the measured values, units, labels, and group identity visible in every state. The motion or sound may organize attention; it must not imply changing values or fabricate observations between them.

| Mechanism | How it works | Best fit |
|---|---|---|
| **A. Pausable event score** | Give each data group a labeled event in a visible sequence. Use a restrained expand/settle cue or optional, brief sound at event entry, then an explicit silence/visual hold. Expose Play, Pause/Resume, Stop, and Restart; Pause freezes the current group and leaves its values readable. A fixed event list and current-position marker remain available as a static index. | Visitors benefit from a guided, shared first pass through a small number of groups. Choose this only when the order or duration helps explain a real relationship. Do not interpolate values between observations. |
| **B. Pinned comparison bench** | Show groups as persistent, directly selectable cards or columns. Tapping a group highlights its identity; visitors can pin two or more groups side by side and switch focus at will. Keep the transition instantaneous or use only a brief, nonessential focus cue. No autoplay, soundtrack, or timed sequence is needed. | Comparison, self-directed browsing, repeat visits, or an exhibit where visitors may arrive mid-sequence. This is the default if order and duration carry no evidence-based meaning. |

**Drop sound** when it adds atmosphere but no distinct, consistently mapped information; when it could be mistaken for the measurement itself; when the shared exhibit space makes it intrusive or hard to hear; or when visitors cannot mute it and still get the same information visually. Keep sound optional. If a tone is meant to encode data, define the mapping and test it with actual listening before relying on it; no audition was done for this memo.

**Drop animation** when it delays selection or comparison, obscures labels, suggests a value changing when it is only a transition, or cannot be interrupted and replaced by a static state. Also remove nonessential motion for visitors who request reduced motion or when the target display makes it uncomfortable. Preserve the meaning with the selected-group outline, label, position marker, or updated text. Motion is warranted only when it clarifies a real state or relationship.

**Recommendation.** Prototype B as the always-available comparison state. Add A as an optional “guided sequence” only if curators can explain why the order and rests matter. Sound and motion should be independent switches, so either can be absent without losing data or control.

## Reference trail and decisions

| Reference ID | Use decision | Concrete change to the memo |
|---|---|---|
| `ASA-G-OPEN-SCORE` | Used | Reframed the metaphor as an event score with explicit identity, order, duration/rest, and visitor controls; retained a static sequence index. |
| `ASA-T-10` | Used as a boundary | Did not treat Brown’s open score as a ready-made UI recipe or imply one canonical realization. The event sequence is a new exhibit design choice, not a faithful recreation. |
| `DWG-M-CHOREOGRAPHY` / `C19` | Used | Made motion subordinate to true state, immediately interruptible, and optional; removed any idea that a transition can block the next action. |
| `C16` / `ASA-T-09` | Used with scope caveat | Added a way to disable nonessential interaction-triggered motion. Kept the memo from claiming that this alone establishes compliance for an unspecified exhibit/platform. |
| `DWG-I-FEEDBACK` / `G09` | Used | Required visible, persistent pause/selection status and retained focus and control in the current state. |
| `G10` | Used | Kept observed values, units, and identity visible; disallowed interpolated frames from reading as data. |
| `G15` | Used as a partial cue | Made sound optional and required an alternate visual channel. The Kit marks sound-space guidance as partial, so this does not establish a full audio-accessibility design. |
| `C18` | Not used (out of scope) | The browser `details-content` transition reference concerns an implementation technique; no disclosure control is required to decide these two mechanisms. |

No reference was rejected as universally bad. `C20–C25` were outside this task’s need; their unrelated specimen/style decisions were not imported.

## Evidence limits and dead ends

- This is a concept decision memo, not a tested prototype. There was no visitor observation, target-device run, reduced-motion walk-through, or screen-reader test.
- No sound was composed or auditioned, so no timbral or emotional claim is supported. The Kit itself says actual listening is needed before using listening adjectives as acceptance evidence.
- Sound guidance in `G15` is explicitly partial. The memo’s mute-and-visual-alternative recommendation is a design constraint, not proof of audio accessibility or compliance.
- The exhibit’s data, group relationships, audience, ambient noise, hardware, and curation rationale were not supplied. Therefore the sequence order, beat/rest lengths, sound mapping, and whether movement carries useful meaning remain open decisions.
- An initial `find .. -name AGENTS.md` from `/workspace` wandered beyond the project into system directories and returned permission errors. It was a poor-bounded discovery command; it read no extra file contents and did not guide the design. No whole-repository search for hidden work was used. A later `rg` was scoped to `kit/design` for sound-related routing, and another to the two named reference indexes.

## Exact files read, in order

1. `AGENTS.md`
2. `kit/AGENTS.md`
3. `kit/README.md`
4. `kit/design/README.md`
5. `kit/design/interaction/README.md`
6. `kit/design/motion/README.md`
7. `kit/design/motion/choreography.md`
8. `kit/design/motion/grammar.md`
9. `kit/design/interaction/states.md`
10. `kit/design/references/README.md`
11. Search excerpts only from `kit/design/references/composition.md` and `kit/design/references/interface.md` (scoped term search)
12. Search excerpts from `kit/design/references/art-software-atlas.md`, `kit/design/references/discovery-relay.md`, `kit/design/motion/score-and-time.md`, `kit/design/motion/rule-systems.md`, `kit/design/motion/grammar.md`, `kit/design/foundations/relations.md`, and `kit/design/foundations/README.md` (scoped sound-related route search)
13. `kit/design/motion/score-and-time.md`
14. `kit/design/references/art-software-atlas.md`
15. Excerpts only from `kit/design/references/composition.md` and `kit/design/foundations/relations.md`
16. `vault/provenance/art-software-atlas/temporal/cards/asa-t-10-earle-brown-prefatory-note.md`
17. `vault/provenance/art-software-atlas/temporal/cards/asa-t-09-wcag-animation-from-interactions.md`
18. `kit/design/interaction/feedback.md`

No repository files were changed; no packages or accounts were installed or connected.
