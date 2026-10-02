# Praxis 本地视觉 / motion 探索交接

探索批次：`visual-grammar-praxis-20260928`。检查日期：2026-09-28（Asia/Singapore）。执行角色是 `luna_max_worker`，配置模型 `gpt-5.6-luna/max`；工作范围是有界本地 explorer。源仓库只读，没有安装依赖、访问外部网页或重读 Courtwork / Schema Engineering 源仓库。

完整文件身份、版本、mtime、大小、SHA-256、快照和证据状态见 [`vault/provenance/visual-grammar-praxis-20260928/sources.json`](../../provenance/visual-grammar-praxis-20260928/sources.json)。本地快照见 [`vault/snapshots/local/visual-grammar-praxis-20260928/`](../../snapshots/local/visual-grammar-praxis-20260928/)。

## 概念材料定位

`PX-01` 可作为一件可审阅作品的材料起点：把 `Event log ≠ Matter state ≠ Model context` 表达成一个可暂停、可 seek、可回查来源的视觉解释。它不是因为 Chat 提到过才成立，而是因为 Praxis 本地已有直接语义来源：

- `VG-PX-CORE-MODEL`：[`vault/distilled/work-system/core-model.md`](../work-system/core-model.md) 第 21—35 行定义三层；第 44—136 行提供 `Capture → Normalize → Extract → Diff → Commit → Follow` 候选循环。
- `VG-PX-WORK-GRAMMAR`：[`kit/grammar/work.md`](../../../kit/grammar/work.md) 将 State / Event、Proposal、Effect、Unknown 和验收分开；其中“事件日志、事项状态、模型上下文分别维护”可以直接约束画面关系。
- `VG-AA-CONTRACT`：Attention Assistant 的 [`docs/state-contract.md`](../../snapshots/local/visual-grammar-praxis-20260928/attention-assistant/eefc5a85161f6a52d0e2d9368989286409b876df/docs/state-contract.md) 第 5—25 行把 revision、provider event、attention item、proposal、human decision、effect 和 stale 条件写成可寻址对象。
- `VG-AA-CONTRACT` 的 human loop：[`practices/human-decision-loop.md`](../../snapshots/local/visual-grammar-praxis-20260928/attention-assistant/eefc5a85161f6a52d0e2d9368989286409b876df/practices/human-decision-loop.md) 第 36—70 行提供 `read → compile → propose → decide → execute → readback → record` 的真实流程形状。

结论是：`PX-01` 有本地语义证据，但没有已完成的视觉实现；它应登记为 `candidate-semantic-source`，交由 Opus 自由选择表现。可以用 SVG/DOM、Canvas、React、Remotion、Three.js/WebGL、音频驱动或更激进的空间/程序化方法；技术路径是工单选择，不是本交接的架构裁决。

## 已实现、候选与指针

| 证据 ID | 本地材料 | 当前状态 | 可支撑的判断 | 不能据此声称 |
|---|---|---|---|---|
| `VG-MN-PROGRAMME` | Mnemos@`d925941e16e5b3c30126fb6b2027a4c06dec3966`：`docs/design/*`、`src/design/Showroom.jsx`、token、reader CSS | `implemented-research-specimen` | 有真实 React showroom；12 个场景；明暗、并置/单栏、减弱动效、200% 文字和内存 adapter 可观察 | 全面视觉/设备验收；Mnemos 学习语义可直接移入 Praxis |
| `VG-PX-REMOTION` | Praxis 动态简报：Remotion 4.0.529、`timeline.json`、MP4、contact sheet、WAV | `implemented-research-specimen` | 有项目级按帧时间线、分镜、渲染产物和审片记录 | 公共 renderer、跨项目 Timeline IR、外部播放器/移动端/观众测试通过 |
| `VG-PX-LAYOUT` | layout specimen lab：45 atoms / 244 variants、8 patterns、5 compositions | `candidate-visual-specimen` | 可在同一 fixture 上比较布局、语义职责和失败样张 | canonical 组件库或 Kit 规范；深色、打印、读屏、完整键盘和 200% 已通过 |
| `VG-PX-CORE-MODEL` | Work System `core-model.md` | `candidate-semantic-source` | Event/State/Context 的稳定语义和循环 | Courtwork runtime schema 或现成动画 |
| `VG-AA-CONTRACT` | Attention Assistant state contract / human decision loop | `candidate-semantic-source` | stale、unknown、proposal、decision、effect/readback 的状态叙事 | 视觉 runtime、ACL 服务或自动发送能力 |
| `VG-MN-PROTOTYPE` | Mnemos Prototype@`5e19dd7a1e199f2235501c6a2d7374f1213f4d93` 历史 HTML / CSS / prompt 设计稿 | `candidate-visual-specimen` | 可回查暖色版式、prompt→Markdown→card 的旧叙事和手势候选 | 当前 Mnemos 基线；历史 HTML 离线完整运行 |
| `UP-01…UP-05` | Mnemos 已有外部 URL 身份 | `reference-pointer` | Motion layout/reducedMotion、React Aria、Chrome view transition 的回查坐标 | 本批重新验证 URL、已安装依赖或当前版本兼容性 |

Mnemos 的验收账是区分“实现”和“接受”的关键：`docs/design/acceptance.md` 将 MX-01—06 记录为已实现或已收口，但明确独立交互、实际拖放、Android Back、系统文本选择、触觉、WebView 长列表和切后台恢复仍未执行。这个边界随 `VG-MN-PROGRAMME` 一起传给任何复用工单。

## 有界候选工单

下列六项是有限枚举。编号只作本地候选身份，技术栈和视觉风格都开放；每项只在消费对应来源后再施工。`candidate` 不等于已选，Opus 可依据作品目标改写实现。

| 工单 | 目标与语义 job | 主要本地证据 | 可选技术路线（开放候选） | 现状 / 交付边界 |
|---|---|---|---|---|
| `PX-01` | **三层概念解释**：让读者看懂 Event log、Matter state、Model context 的关系与边界 | `VG-PX-CORE-MODEL`、`VG-PX-WORK-GRAMMAR`、`VG-AA-CONTRACT` | SVG/DOM、Canvas、React/Remotion、Three.js/WebGL、kinetic typography、diagram construction、continuous camera、audio-aware timing | 开放候选；语义有证据，视觉仍待施工；至少保留静态终态、来源标记和未知/未确认状态 |
| `PX-02` | **Human decision loop**：把 provider event→attention item→proposal→human decision→effect/readback 变成可观察状态叙事 | `VG-AA-CONTRACT`、`VG-PX-WORK-GRAMMAR` | UI narrative、state machine、DOM/SVG、React/Motion、Remotion、mask/branch/reveal、stale/unknown 分支 | 状态契约存在，视觉实现不存在；不把 proposal 动画成已批准，不把 effect 回执当成功证明 |
| `PX-03` | **Mnemos source lens**：从原文摘录到卡片、来源回跳、复习回执的产品叙事 | `VG-MN-PROGRAMME`（MG-01—10、Showroom） | React showroom、CSS/SVG、Motion layout、Remotion UI film、object continuity、selection toolbar、source lens、undo | 已有可运行样板可供取材；复用只借视觉/interaction 观察，不复制 Mnemos 的学习调度和产品数据 |
| `PX-04` | **Layout grammar mutation**：从一个现有 atom 或 pattern 产出多种强度、空间和时间变体 | `VG-PX-LAYOUT`、`VG-PX-INTERACTION-COMPOSITION` | HTML/CSS、SVG、Canvas、GSAP/Motion、Remotion、split-screen、annotation tracking、morph/zoom-through、staged reveal | 已有样张与失败记录；选择具体 ID 后再读取单个 HTML/CSS 和检查图，不把整库塞进上下文 |
| `PX-05` | **Timeline / audio-aware specimen**：用已有动态简报的时间线结构试一件新的 beat/visual relation 作品 | `VG-PX-REMOTION`、`VG-PX-MOTION-KIT`、`opus-remotion-video-20260927` intake | Remotion/React/TypeScript、SVG、Web Audio、Python、Whisper/Demucs/CTC（仅在实际可得且单独登记时）、FFmpeg | Remotion project 和音频产物已有；音频分析链没有本批证据，编码器也未在本环境核实 |
| `PX-06` | **Spatial / procedural grammar**：将 state/context 关系做成 3D、shader、粒子或程序化解释 | `VG-PX-CORE-MODEL`、`VG-PX-REMOTION` 的时间叙事经验 | Three.js、WebGL/GLSL、Canvas、physics、procedural simulation、headless browser、FFmpeg、静态 SVG 对照 | 创作候选，当前没有本地 3D 实现或依赖版本证据；作品需自己登记版本、固定随机性、seek、降级和输出 QA |

`PX-01` 只是基于现有语义证据的首件建议，不是对 `PX-02`—`PX-06` 的创作排序禁令。若 Opus 判断某个更激进路线更能检验视觉语法，可直接选择它，同时补齐来源、版本、fixture、渲染配置、失败和 review。

## 最短渐进披露路径

### `PX-01` 概念解释

1. 先读本文件的概念材料定位和 `VG-PX-CORE-MODEL`。
2. 只展开 [`core-model.md`](../work-system/core-model.md) 的 Event/State/Context 与 Capture→Follow 段。
3. 需要状态边界时展开 Attention Assistant 快照的 `state-contract.md` 与 `human-decision-loop.md`。
4. 读主线 [`demos/visual-grammar/scenario.md`](../../../demos/visual-grammar/scenario.md) 约定的 synthetic fixture、身份字段、unknown/recovery、seek 与验收。
5. 技术路线由 Opus 选择；需要现成 motion 证据时才展开 [`kit/design/motion/grammar.md`](../../../kit/design/motion/grammar.md) 或 `VG-PX-REMOTION` 的 README / STORYBOARD / timeline。

### `PX-03` Mnemos 产品叙事

只读 `VG-MN-PROGRAMME` 的 `docs/design/README.md` → `docs/design/grammar.md` → `docs/design/acceptance.md`，再按问题展开 `src/design/Showroom.jsx` 和 `showroom.css`。不用先读整个 Mnemos 仓库，也不把历史 Prototype 一并加载。

### `PX-04` 布局变体

先读 `VG-PX-LAYOUT` 的 README → `review.md`，选一个已抽看的 ID（例如 E06-b、W03-b、Q06-d、T05-c 或 C05），再读取该 specimen 的 HTML/CSS 和对应检查图。`catalog.md` 是生成清单，除非定位具体 ID，不进入主上下文。

### `PX-05` 时间线 / 音频

先读 [`motion/README.md`](../ai-capability-assessment/motion/README.md) → [`STORYBOARD.md`](../ai-capability-assessment/motion/STORYBOARD.md) → `timeline.json`，再决定是否看 `src/`。现有 `package.json` 锁定 Remotion 4.0.529；不要把 Chat 中提到的技术栈描述或 `https://github.com/...` 占位 URL 当成外部证据。

## 来源索引复用与缺口

- `MN-01…MN-10` 和 `UP-01…UP-05` 已存在于 Mnemos `docs/design/sources.json`；本批把当前 Mnemos HEAD 与旧固定基线分开记录。`UP-*` 是回查坐标，访问日期和“未在本批重开”保持不变。
- `PX-FRONTEND-DESIGN` 指向 Praxis 已有 CW/SE 前端消费和逐 URL provenance；本批只复用本地索引，不重新读取 Courtwork / Schema Engineering 源仓库，避免把旧 source commit 或历史视觉观察误报为当前事实。
- `PX-SOURCEWEFT-ADJACENT` 的 `sw-explore-utm`、`sw-compression-utm`、`sw-provenance-utm` 等卡片只说明相邻 runtime / skill provenance 研究；它们不是视频技术栈，也不是 `Skillry` 记录。
- `PX-REMOTION-CHAT-INTAKE` 已有 archive/intake 身份，但 archive 内没有真实外部 URL，只有一个 illustrative placeholder；`PX-WRITE-DESIGN-PLACEHOLDER` 将该占位 URL 维持为 `unavailable`。
- 探索前已有索引的 scoped 搜索没有找到 `Skillry`、`skillry` 或 `skill-ry` 的 ID、URL、卡片或本地项目；随后独立的 [`visual-grammar-external-20260928`](../../provenance/visual-grammar-external-20260928/README.md) 已登记 21 个 supplemental URL，其中含 Skillry specimen。它们各自保留 verified/partial/unavailable 状态，不能冒充原 Chat 隐藏引用，也不能用 SourceWeft skill provenance 代替。
- 音频分析（Demucs / Whisper / CTC / forced alignment）、Three.js/WebGL/GLSL/physics 与 FFmpeg 的具体版本在本批都没有作为已安装依赖核实。它们可以作为开放工单路线，但施工回执必须重新登记实际环境。

## 交接给 Astra / Opus

Astra整理来源身份、材料关系和复用入口，Opus自行选择题材与表现；Kit晋升另按仓库流程；不需要替 Opus 预先决定镜头、技术栈、颜色或强度。Opus 接到一个工单后，应把 `intent / storyboard / fixture / timeline / scene code / render config / source IDs / borrowed-adapted-new / failure / review` 写入对应 `demos/visual-grammar/` 子目录。

本批已做的是本地来源登记、精选快照、实现与候选分层、短阅读路径和缺口报告；未做的是新 demo、外部 URL 验证、依赖安装、浏览器/真机验收、音频分析、3D 构建与完整视频观看。任何工单完成声明都应按自己的回执和实际检查范围重建，不从本交接自动继承“通过”。

本地候选 `PX-01…06` 与主线 `VG-01…08` 分开编号，主线见 [开放工单](../../../demos/visual-grammar/work-orders.md)。先前索引中的Skillry缺口已由本轮 [外部追溯](../../provenance/visual-grammar-external-20260928/README.md)补充21个URL；这是新登记，不是恢复旧Chat的隐藏引用。
