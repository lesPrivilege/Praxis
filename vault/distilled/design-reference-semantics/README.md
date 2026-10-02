# Design 外部参考语义提炼

本目录把 Design 参考消费成可召回的语义索引。它回答四个问题：参考材料是什么、Kit 消费什么、哪些判断仍属于项目自己的取舍、什么时候需要回到原件。它不把外部页面、历史 Chat 或单次答卷直接升格为 Kit 规范。

当前范围覆盖：

- [Design 参考分支](../../../kit/design/references/README.md) 的 C01–C25、U01–U09、P01；旧的 `kit/design/references.md` 仍保留为兼容入口；
- 已登记的 Design System 与 frontend URL 卡片（ref-*）；
- CW、Schema Engineering、解释与可视化上游的本地消费记录；
- Design Grammar 与 Opus 5.5 Remotion Chat 的已保存原件。

主索引是 [Design 参考分支](../../../kit/design/references/README.md)，逐用途入口分别是 [composition](../../../kit/design/references/composition.md)、[interface](../../../kit/design/references/interface.md)、[systems](../../../kit/design/references/systems.md) 和 [specimens](../../../kit/design/references/specimens.md)；旧的 [兼容入口](../../../kit/design/references.md) 仍可用于历史链接。本页是语义解释层；需要逐条状态、消费位置或证据路径时回到对应分支。

## 如何区分来源说法和项目决定

| 标签 | 含义 | 可否直接进入 Kit |
|---|---|---|
| source | 原件或 URL 卡片明确写出的内容；只在证据范围内成立 | 不能自动进入 |
| local-consumption | CW/SE/答卷等本地记录已经消费过的内容 | 仍需按项目范围使用 |
| project-decision | Praxis 或来源项目对材料作出的采用、改用或拒绝 | 只有 Astra 采纳后才进入公共 Kit |
| chat-candidate | 历史 Chat 中的用户意图或 assistant 建议 | 用户意图可作方向；assistant 建议只能作候选 |
| reference-only | 便于重访的材料或观察，没有当前消费决定 | 不作为行为要求 |

accepted 在 references.md 中表示本地消费处置；它不表示来源主张已经核实，也不表示当前渲染或无障碍检查已经通过。verified、partial 是 URL 卡片的来源证据状态，和 Kit 的采纳状态分开。

本页还区分三个时间层：两份 Chat 原件先完成初次消费并保留为 `chat-candidate`；[ADR-015](../../../docs/decisions/015-kit-editorial-contract.md) 是首轮治理收敛，接受渐进阅读、证据边界和初步 ownership 路由；[ADR-016](../../../docs/decisions/016-progressive-kit-structure.md) 是本轮后续采纳，把入口落实为真实的 [Write](../../../kit/write/README.md) 与 [Design](../../../kit/design/README.md) 分支。ADR-015 的历史叙述和 Chat 候选继续保留，ADR-016 不等于采纳所有候选 schema、样张或 renderer。

## 读取窗口和证据范围

本页采用仓库已有的登记和快照，不把它们伪装成本轮新访问。

| 材料集 | 已登记读取窗口 | 本地证据 | 本页使用方式 |
|---|---|---|---|
| Design System / frontend URL 卡片 | 2026-09-18 | vault/references/design-systems/、vault/references/frontend/ | verified 是该轮官方入口核验；partial 保留未核实差异 |
| CW/SE 前端消费链 | 2026-09-23；CW/SE 记录各自保留源提交 | vault/distilled/frontend-design/、vault/provenance/*-frontend-references/、vault/snapshots/local/downloads/ | 消费边界和验证缺口以本地记录为准 |
| 解释、结构化与可视化上游 | 2026-09-23，固定 commit 快照 | vault/distilled/frontend-design/explanation-visualization-index.md 与对应快照 | 可复用方法参考；未安装、未执行 |
| GOV.UK、ONS、W3C、MDN、Vercel、Clerk、Refero、Opus 页面 | 2026-09-24，按 references.md 记录 | [Design composition route](../../../kit/design/references/composition.md) 的 C13–C24 | 无正文快照；引用前重新核对 |
| Design Grammar Chat | 2026-09-27，5 turns / 10 messages | vault/archive/chat/design-grammar-20260927.json；登记见 vault/intake/chat-captures.json | 用户意图和 assistant 候选分开读取 |
| Opus 5.5 Remotion Chat | 2026-09-27，5 turns / 10 messages | vault/archive/chat/opus-remotion-video-20260927.json；登记见 vault/intake/chat-captures.json | Kit/Reference/Demo 边界的候选语义，不是当前规范 |

本批没有补做无目标的外部浏览。外部页面的现状、版本、许可证和实现能力，只有在对应卡片明确记录的范围内可说；其余保持 partial、reference-only 或待复查。

## 可先消费的语义路线

| 需要回答的问题 | 先读 | 当前状态 |
|---|---|---|
| 这段内容是否需要图，以及图应表达什么关系 | [D04 论证到视觉路由](#d04-论证关系先于图式) | ADR-016 后进入 [Write/Publish](../../../kit/write/publish/README.md) 与 [Design/Composition](../../../kit/design/composition/README.md)；通用 registry 仍候选 |
| 图、表、正文和证据怎样分工 | [D05 证据装置](#d05-证据装置与-description) | [Write/Publish](../../../kit/write/publish/exhibits.md) 与 [Write/Shared](../../../kit/write/shared/evidence.md) 提供薄入口；完整 schema 仍候选 |
| 版面或页面怎样保留层级、导航和退化路径 | [D06 层级与编排](#d06-层级与编排)、[D07 导航与渐进增强](#d07-导航与渐进增强) | [Write/Publish](../../../kit/write/publish/README.md) 与 [Design/Composition](../../../kit/design/composition/README.md) / [Interaction](../../../kit/design/interaction/README.md) 分工；不是单一模板 |
| 交互状态、未知结果、权限和可达性如何表达 | [D08 状态、权限与可达性](#d08-状态权限与可达性) | [Design/Interaction](../../../kit/design/interaction/README.md) 与 [Write/Shared](../../../kit/write/shared/README.md)；实际 conformance 仍需项目验证 |
| 需要动效或 Remotion 时怎样划边界 | [D09 动效与 Opus 样本](#d09-动效与-opus-样本) | [Write/Motion](../../../kit/write/motion/README.md) 与 [Design/Motion](../../../kit/design/motion/README.md) 提供语义交接；通用 renderer 仍候选 |
| 要不要引入某个设计系统或组件库 | [D10 外部设计系统是 donor](#d10-外部设计系统是-donor) | [Design/references/systems](../../../kit/design/references/systems.md) 提供 URL 路由；状态仍为 verified / partial，不作为依赖 |
| Kit 本身如何挂载、查找和消费参考 | [D01 Kit 边界](#d01-kit边界与渐进披露)、[D02 索引和 registry](#d02-索引与-atompatterncomposition) | D01 已由 ADR-016 落实为真实分支；D02 的 registry/schema 仍为 chat-candidate |

## D01 Kit 边界与渐进披露

### 是什么

Design Grammar Chat 的用户明确希望把 Astra 的裁决、Luna 的外部探索、Opus 的穷举与打样分开，原件保留在本地，消费后再泛化登记。对话原件是 chat:6ab64deb-7870-83ec-8e5c-0f78ccd7340b，用户 turn bbb219f1-346d-47e8-ae83-50f30b446f83；对应 assistant 建议是 item 642af881-392e-4183-823b-690570044254。Opus Chat 的用户 turn bbb21f32-d1b9-4593-b30a-097977fab3c7 与 assistant item 73690319-a4c0-4c2e-98c9-965b8782032d 进一步把 Kit 描述成可挂载、可导航、渐进披露的工作语境。

### Kit 消费什么

Kit 的入口应提供目录语义、README 路由和按需展开的文档；Reference 保留可召回的外部材料；Grammar 只承载已经决定要重复使用的行为或判断。Agent 的消费顺序可以是：任务语义 → Kit 分支 → README → 必要 grammar → 需要时进入 reference；无需每次把整套材料注入工作记忆。

### 边界

这两段 assistant 文字是历史建议，不是当前平台规则。它们不能授权新增 Skill、自动把整个 vault 作为指令，或把某个 reference 变成事实。当前仓库仍需 Astra 将候选写入 canonical Kit 位置。

### 本轮处置

初次消费后的“可挂载、可导航、渐进阅读”体例由 [ADR-015](../../../docs/decisions/015-kit-editorial-contract.md) 首轮采纳，目录表达职责，README 按任务选路，正文解释判断和完成条件；本页保留 Chat 作为来源和召回材料，不把 assistant 的整段建议复制进 Kit。本轮后续采纳由 [ADR-016](../../../docs/decisions/016-progressive-kit-structure.md) 落实为真实分支：任务从 [Write](../../../kit/write/README.md) 的 `prose/`、`publish/`、`motion/`、`shared/`，或 [Design](../../../kit/design/README.md) 的 `foundations/`、`composition/`、`interaction/`、`motion/`、`references/` 进入；参考再按 [Design references README](../../../kit/design/references/README.md) 分用途展开。对应的结构原则仍由 [文档结构契约](../../../docs/architecture/documentation.md) 维护。

### 何时重访

当 Write/Design 的分支 README、ownership 边界或参考路由发生变化后，回到本节核对任务是否仍能发现对应 grammar 和 reference；若分支只剩扁平索引、某条 grammar 没有重复 consumer，或新目录只是空壳，应降级或重写。

## D02 索引与 Atom/Pattern/Composition

### 是什么

Design Grammar Chat 的 assistant item 642af881-392e-4183-823b-690570044254 建议把可复用资产拆成 Atom → Pattern → Composition，并要求每个 grammar 至少登记 semantic_job、input_shape、visual_structure、encoding、variants、use_when、avoid_when、content_limits、annotation_rules、failure_modes、reference 和 render_targets。同一 item 还建议把 specimen 区分为 canonical 与 expressive。以上属于 chat-candidate。

### Kit 消费什么

索引至少应让 Agent 找到：它解决的语义问题、需要的输入形状、选择条件、边界、失败模式、参考 specimen 和目标媒介。原子应停在可组合的内容语义单元，例如 evidence excerpt、comparison row、timeline event、figure caption、source note，而不是把 icon、divider 或圆角框登记成 UI 组件。

### 边界

仓库当前没有经过 Astra 采纳的 Atom/Pattern/Composition registry，也没有因为这段 Chat 自动生成 canonical specimen。历史 LNG 样本仍是项目产出或粗 specimen，不能因为被列举就成为通用 grammar。

### 本轮处置

初次消费后的字段建议由 [ADR-015](../../../docs/decisions/015-kit-editorial-contract.md) 留作 candidate。[ADR-016](../../../docs/decisions/016-progressive-kit-structure.md) 只建立了真实的 Write/Design 任务分支和参考路由，没有建立 Atom/Pattern/Composition registry、完整 schema、canonical/expressive specimen 库或通用 renderer contract。当前没有生产样本、独立 consumer 和验证闭环，因此本轮仍不把字段写成运行时 contract。

### 何时重访

当 Opus/Remotion 或其他 specimen lab 产出可重复的样本，并且至少有独立 consumer、验收和失败记录时重访；届时再决定是否进入 [Design / Foundations](../../../kit/design/foundations/README.md)、[Design / Composition](../../../kit/design/composition/README.md) 的规范位置，或保留在 demos/vault。

## D03 Write 与 Design 的 ownership 候选

### 是什么

Design Grammar Chat 的 assistant item 8c00023e-4b1c-4ffc-9773-0c33bf80c0ac 提出：Write 负责内容表达的语义必要性，Design 负责视觉处理和审美可能性；Opus Chat 的 assistant item c3bd95ec-3bb3-4362-a49d-ad5feb0022ab 用 “Write owns semantic necessity; Design owns aesthetic possibility” 表达同一候选边界。

### Kit 消费什么

这条边界可用来路由交叉任务。Write 可以说明何时需要图、图应表达何种关系、标题/description/source 的职责和阅读顺序；Design 再决定色彩、字体、线条、surface、motion style、camera 或更激进的 composition。Write 的 publish/motion 只保留足以保证可读、可理解和可交付的薄投影。

### 边界

这是 Chat 中的候选划界；初次收敛由 ADR-015 表述为 Reporting、Writing、Design 的路由。本节不规定具体色值、字号、圆角、时长或 renderer API。

### 本轮处置

[ADR-015](../../../docs/decisions/015-kit-editorial-contract.md) 保留为初次治理收敛：Reporting 维护论证、内容结构和证据职责，现有 Writing skill 保留成文职责，Design 维护视觉与交互判断。此处的 Write/Design assistant 建议仍作为语义来源保留，不把 Writing skill 搬入 Design，也不新建重复的 ownership contract。[ADR-016](../../../docs/decisions/016-progressive-kit-structure.md) 后续把这条边界落实为 [Write](../../../kit/write/README.md) 的四个 mode 与 [Design](../../../kit/design/README.md) 的五个分支；这是可发现性和维护位置的采纳，不改变 semantic necessity 与 aesthetic treatment 的分工。

### 何时重访

若 Reporting、Writing 或 Design 的 ownership 文档发生变化，或同一规则需要同时修改两套 Kit，回到本节判断它是 semantic necessity 还是 aesthetic treatment，再决定唯一归属。

## D04 论证关系先于图式

### 是什么

固定版本的 show-me、visual-explainer 和 data-visualization 原文快照，分别登记为 show-me、visual-explainer、data-visualization，入口见 [解释与可视化索引](../frontend-design/explanation-visualization-index.md)。它们被本地记录消费为：先辨认问题、机制或数据形态，再选择表达方式；图注应说明支持的判断；第一屏应能看到主要判断。CW 本地记录 C05、C06、C07 进一步把这条原则映射为直接标值、分层增量、按任务选择表/图/正文。

### Kit 消费什么

在生成图前先登记 semantic job、输入数据/关系、读者要作的判断和必要的 caption/source。条件、流程、比较、数量、状态、变更和证据分别寻找能够表达该关系的图式；图负责关系，正文负责推导。直接标值、缺失与零值区分、共同尺度和证据邻接是可复用的候选检查项。

### 边界

这些来源不要求每个节点都画图，不要求仪表盘，不证明当前答卷或任何页面已通过视觉验收。C05 的数量和数据处理规则属于本地消费，不能泛化成“所有数量图必须零起点”；基线和刻度取决于数据语义，需由具体图表任务裁决。

### 本轮处置

初次收敛后的通用判断继续由 [Design / Foundations](../../../kit/design/foundations/grammar.md) 与 [Design / Composition](../../../kit/design/composition/README.md) 承载：从读者任务、材料关系、证据和媒介开始，选择表、图或正文；[Write / Publish](../../../kit/write/publish/README.md) 负责内容展项和阅读职责。历史答卷的线型、强调色、排印和交付参数留在 Vault profile。C05–C07 继续作为进入 grammar 的证据路径，不再把单次 profile 当全局规则；ADR-016 只是把这些入口分支化，不把所有图表 schema 或 renderer 变成公共 contract。

### 何时重访

准备安装、复制实现、采用新版本或遇到新的图表类型时，按固定 commit 重新核对原文和许可证；准备发布页面时重新验收图注、数据口径、窄屏顺序和真实渲染。

## D05 证据装置与 description

### 是什么

Design Grammar Chat 的 assistant item a0f8bc40-fbf7-4103-a3c7-a34d402e68a3 建议将 Exhibit 视为一级语义，并把 title、description、visual、annotation、caption、source 分开；同一条建议把 source、footnote、method note 与 bibliography 分层。用户 turn bbb2195b-0728-4d12-a1ed-9cfecc42c78d 明确希望为类 PPT HTML 登记文本编排、图表、引用和 description。CW C05/C06 与本地 composition-anchors.md 提供了部分消费证据。

### Kit 消费什么

description 应说明读者正在看什么、范围和阅读口径；caption 解释必要的异常、编码或主张；source 指向产生材料的实体、文档、日期和 locator；method/note 交代计算口径。来源应贴近它所支持的命题或 exhibit，而不是全部堆在页面末尾。

### 边界

这是跨 Write/Design 的候选 apparatus 语义；ADR-016 已提供 [Write / Publish / Exhibits](../../../kit/write/publish/exhibits.md) 与 [Write / Shared / Evidence](../../../kit/write/shared/evidence.md) 的薄入口，并由 Design 的 Composition 分支承接视觉投影，但尚未采纳完整 publishing grammar。它不规定字体、色值、间距，也不替代来源核验；截图、引文和图表仍需保持真实 provenance。

### 何时重访

[Write / Publish](../../../kit/write/publish/README.md)、[Write / Shared](../../../kit/write/shared/README.md) 或 Design 分支发生字段裁决时重访；若同一字段在 HTML、PDF、Slides 或 Remotion 中含义不同，应保留共享语义并在 renderer 层分别说明。

## D06 层级与编排

### 是什么

CW C01–C06、C10 和本地 [composition anchors](../frontend-design/composition-anchors.md) 显示：标题、分论点、正文和图形要形成真实的论证层级；Paper 与 Tour 等不同入口有不同内容对象；关系、状态、数量和变化需要不同图式；宽窄版本可以共享语义但应按媒介重排。career-kit 的样张只作为总览、单页、页序与翻页关系参考。

### Kit 消费什么

页面或长文先决定阅读顺序和主要判断，再选择一个主要 exhibit；分区标题提出子命题，正文解释，图形承担关系。下一层应增加信息而不是复述上一层；不把所有内容强塞进等权卡片，也不把一个产品样张变成固定舞台比例。

### 边界

CW/SE/career-kit 的页面是历史样本或本地消费记录，不证明当前源仓库、当前浏览器或答卷已渲染成同样结果。C04 的衬线、灰底等视觉处理和 C10 的结构关系应分开；前者不能自动升为通用主题。

### 何时重访

换内容家族、增加窄屏/打印/视频 renderer 或遇到页面层级争议时，回到 [Write / Publish](../../../kit/write/publish/README.md) 与 [Design / Composition](../../../kit/design/composition/README.md) 的职责，再回具体快照做实际输出验收；若引用的是未存快照的源仓库坐标，先复核当前 commit。

## D07 导航与渐进增强

### 是什么

SE C08 的 reader 记录使用原生 details 目录、无 JS 可用和打印隐藏；CW C09 记录窄屏章节路径纵向排列；C13 的 GOV.UK、C14 的 ONS、C15 的 W3C APG Disclosure 和 C18 的 MDN 记录了目录、当前项、展开控件和过渡的外部参考。C20 仅从 Opus 5.5 100 HTML Files 的 008 长文页取阅读进度线。

### Kit 消费什么

目录、章节状态和折叠控件应提供清晰的位置语义、键盘路径和关闭 JS 后的基本阅读顺序；小节少时不强加吸附侧栏；宽窄布局保持同一内容，不让横向滚动成为唯一导航。动效只作为语义增强，不能隐藏必要内容。

### 边界

目录条目数、当前项、sticky 侧栏、details-content 过渡和阅读进度线来自不同来源，不能拼成一套统一的外部标准。C18 为 reference，C20 的进度线是单次页面消费；C13/C14/C15/C18/C20 没有正文快照，引用前需重新核对。

### 何时重访

长文超过当前目录复杂度、引入新的移动端导航、需要打印/无 JS 保证或浏览器行为发生变化时，回到 [Design / Interaction](../../../kit/design/interaction/README.md) 与 [Write / Publish](../../../kit/write/publish/README.md) 的当前职责，重新读取官方页面并验收键盘、焦点、顺序和分页。

## D08 状态、权限与可达性

### 是什么

CW 的本地消费记录提供了两组不同语义。U01/CW-FE-R01 把 24 CSS px 作为本地报告的 AA 下限、44 px 作为 coarse/high-consequence 路径的本地选择，并把 200% 文字缩放、布局重排、文字间距分别列为待验约束；U02–U07 记录对象 tab 身份、录入/启用/已用/已加载、人审 Apply/Reject、未知结果、Host 授权与取消。对应的外部 URL 卡片 cw-wcag-target-size-minimum、cw-wcag-resize-text、cw-wai-aria-tabs、cw-vscode-contribution-points 均明确记录本批未重新打开正文。

### Kit 消费什么

把对象身份、视图动作、提议、审阅、已生效和运行中状态分别表达；请求发出但结果未知时保持 unknown；授权、取消、终态和后端事实由对应 owner 提供；键盘、缩放、重排和目标几何在真实界面验收，而不是从 token 名称推导。

### 边界

24 px 与 44 px 不是同一个准则：本地记录没有把 44 px 说成通用 WCAG 要求。accepted 也不等于 WCAG conformance、读屏通过或所有控件都已测；U03/U07 是 CW 的工作面和协议消费边界，不是 Praxis 通用后端 contract。未重读的标准不能写成当前法律或规范结论。

### 何时重访

实现或修改 tabs、menus、proposals、unknown/error、touch/coarse 操作和 responsive layout 时，先按 [Design / Interaction](../../../kit/design/interaction/README.md) 与 [Write / Shared](../../../kit/write/shared/README.md) 的职责重新读取对应标准，再按实际 target geometry、200% 文字缩放、布局重排、文字间距、键盘/焦点和真实状态分别运行验收。标准版本、源页面或本地 owner 改变时也应重访。

## D09 动效与 Opus 样本

### 是什么

C16 的 WCAG 2.2 SC 2.3.3 记录用户触发的非必要动效可以关闭；C18 记录 details-content 可做展开/收起过渡；C19 是本地 emil-design-eng 方法，强调先判断是否值得动，再决定属性和曲线；C20 从 Opus 5.5 100 HTML Files 008 只采纳阅读进度线，C21 拒绝奶油色纸底、Didone、首字下沉、滚动淡入和数据竞速等一次性样式或非必要动效。

Opus Remotion Chat 的用户 turn bbb21e83-d73a-4a39-82dc-0eda0bebf39a 与 assistant item c3bd95ec-3bb3-4362-a49d-ad5feb0022ab 把 Motion 放在 Design/Media，并主张 Write/Motion 只保留节奏、驻留、状态变化和一次画面可承载的认知任务；更完整的 camera、spring、kinetic typography、材质和镜头语言留给 Design。这是 chat-candidate。

### Kit 消费什么

只在状态变化、关系变化、定位或阅读反馈需要时间维度时使用动效；先写清楚状态/关系/节奏语义，再由 Design/Motion 决定风格和 renderer。为减弱动效提供明确替代路径，但替代形式应随内容和实现验证决定，不默认强制“只留淡入”。

### 边界

C20/C21 是单个页面集合的 profile 选择，不是 Design Kit 的普遍风格；C19 是本地方法入口，不是外部标准。240ms、缓出、冷色、衬线或任何具体 token 若只来自答卷 profile，应留在该 profile，不能因为 C16/C20 被写成通用事实。当前没有据此声称任何 Remotion 输出满足无障碍或节奏验收。

### 何时重访

新增视频/Remotion renderer、交互动效、字幕/音频或减弱动效分支时，先按 [Write / Motion](../../../kit/write/motion/README.md) 与 [Design / Motion](../../../kit/design/motion/README.md) 的语义交接重新裁决；Opus 页面更新、skill 版本变化或准备复制样式时重新读取来源并核对许可证。分支存在不代表通用 renderer 已采纳。

## D10 外部设计系统是 donor

### 是什么

URL 级卡片把每条外部来源的状态和边界分开。ref-atlassian、ref-carbon、ref-polaris、ref-primer、ref-ant-design、ref-ant-design-pro、ref-refine、ref-storybook、ref-mui-x、ref-blueprint 的入口页在 2026-09-18 记录为 verified；ref-lightning 因页面抽取为空保留 partial。按任务的 Design 路由见 [Design references/systems](../../../kit/design/references/systems.md)，逐条原 URL 卡片仍见 [Vault references](../../references/README.md)。

### Kit 消费什么

按任务选择 donor 的语义层：tokens/foundations、enterprise shell、resource/object、provider boundary、isolated story、data-dense grid、reader/a11y 等。只取需要的抽象和边界；组件 API、数值、许可证和版本在具体施工前重新核对。

### 边界

这些卡片不是 Praxis 的组件依赖、品牌视觉或已实现 contract。入口页只支持卡片写明的范围；例如 Carbon 的详细 form pattern、Polaris 的 progressive disclosure、Blueprint 的 tree/inspector、Lightning 的 CRM record grammar 仍需按卡片状态复查。CW 的 cw-carbon-button-style 与 cw-radix-spacing 只把 Carbon/Radix 作为概念 donor，并明确不复制数值或引入依赖。

### 何时重访

需要具体组件、token、form mode、extension、provider、grid/tree、a11y 或 migration 时，打开对应 URL 卡片的官方 evidence link，固定版本/截图范围并更新 card；外部 license、API 或页面结构变化时不要沿用旧摘要。

## D11 不把一次性答卷 profile 当通用语法

### 是什么

P01 是 2026-09-24 能力测试答卷的产出索引，能复用问题—答案结构、线图、窄屏菜单、翻页位置提示、打印和离线检查。C20/C21 以及答卷所用的色彩、排印、动效组合属于这次交付的 profile。

### Kit 消费什么

把 P01 当作历史 specimen 和验收线索：需要同类答卷时可查结构、证据邻接和检查脚本；需要其他 artifact family 时只取已经证明与语义任务相关的局部机制。

### 边界

答卷没有资格单独生成 Design 的全局 color/type/motion contract。数量基线、240ms、淡入、衬线、冷色、A4 或单文件交付都必须注明 artifact/profile 适用范围；脱离该任务后，回到 D04–D10 重新裁决。

### 何时重访

新的独立消费者或实际任务反馈触发复核；是否 promotion 仍由 Astra 按 ADR-015 的首轮治理原则、ADR-016 的当前分支入口和修订机制裁决。如果每次都覆盖或重写，应保留在 profile/demo，而不是继续扩张 Kit。

## 覆盖、缺口与本轮处置

本次索引覆盖 Design 参考分支的 35 条设计参考（C01–C25、U01–U09、P01）和 11 条 ref-* URL 卡片；C01–C12、U01–U07 主要依赖本地 CW/SE/career 记录，C13–C24 依赖在线读取记录，解释与可视化上游依赖固定快照。ref-lightning、CW/SE frontend provenance cards 仍保持 partial，不能扩大为当前官方页面结论。

未覆盖或未在本页升格的内容：

- Design Grammar 与 Opus Chat 的 assistant 建议仍是 chat-candidate；原件可由 [Design Grammar archive](../../archive/chat/design-grammar-20260927.json) 和 [Opus archive](../../archive/chat/opus-remotion-video-20260927.json) 召回，未替代 Astra 的采纳。
- CW/SE 中标为未存快照、未重跑浏览器或未复核当前 HEAD 的坐标，仍需按原项目 owner 回查；本页不把历史提交行号说成当前实现。
- C13–C24 的在线读取没有在 Praxis 保存正文快照；重新引用时需按索引日期和官方 URL 复查。
- 本页没有产生新的公共 Design grammar、token、组件依赖或 renderer 实现。

本轮已完成的主要处置：

1. D01 的渐进阅读体例由 ADR-015 首轮采纳；本轮由 [ADR-016](../../../docs/decisions/016-progressive-kit-structure.md) 将 canonical 入口落实到 [Write](../../../kit/write/README.md) 与 [Design](../../../kit/design/README.md)，结构原则仍由 [文档结构契约](../../../docs/architecture/documentation.md)维护。
2. D02 的 Atom/Pattern/Composition 资产 schema、canonical/expressive specimen 库和通用 renderer contract 仍为 candidate；没有生产样本和独立 consumer，本轮不建立 registry。
3. D03 初次按 Reporting → Writing → Design 路由收敛；本轮由 ADR-016 细化为 Write 的 `prose/publish/motion/shared` 与 Design 的 `foundations/composition/interaction/motion/references`，材料目的、组织动作和 brief 仍由 Reporting 维护，具体成文、展项、时间交接、证据与视觉判断按分支进入。
4. D04 的通用判断现在按任务进入 [Design / Foundations](../../../kit/design/foundations/README.md)、[Design / Composition](../../../kit/design/composition/README.md) 与 [Write / Publish](../../../kit/write/publish/README.md)；答卷 profile、色值、字号、动效参数和交付参数留在 Vault profile。
5. D05 的 Exhibit、description、source、method note 仍是薄的跨模式语义；Write/Publish 与 Write/Shared 提供入口，但完整内容 registry 和 renderer schema 未采纳。
6. D09 的 Write/Motion 与 Design/Motion 分支已建立语义交接；Remotion 工程、camera、spring、曲线库和通用 renderer 仍待实际 consumer、观看验收和失败证据。

仍需在后续实际任务中裁决：D02 registry 是否有真实 consumer，D09 的具体参数与通用 renderer 是否值得长期维护，以及各 URL 的上游页面或许可证是否发生变化。24/44 px、motion fallback 和 profile token 继续保持项目或 artifact 范围。
