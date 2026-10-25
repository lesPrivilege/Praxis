<a id="asa-g-open-score"></a>

# 乐谱、事件与时间

<!-- ASA-G-OPEN-SCORE -->

把图形谱或事件谱转成时序内容、交互动画时，分清谱面约束、可选解释与本次 realization，并让事件时间与画面、声音的同步可检查。

## 来路与范围

战后实验谱可用图形、文字和 diagrams 将解释留给演奏者。Getty 的 *The Scores Project* 记录了特定欧美谱系；其 *December 1952* 条目称，矩形可表示声音事件，演奏者可选择时值、音高聚合、强度与页面方向。这不是所有图形谱或即兴音乐的通史。Brown 对作品和表演时间的说明见 [作者说明](../../../../vault/provenance/art-software-atlas/temporal/cards/asa-t-10-earle-brown-prefatory-note.md)；来源文本没有替代谱面图像或演出记录。[Getty 导论](../../../../vault/provenance/art-software-atlas/temporal/cards/asa-t-02-getty-introduction.md) 与 [Brown 作品记录](../../../../vault/provenance/art-software-atlas/temporal/cards/asa-t-01-getty-december-1952.md)保留各自范围。

### 取用目的

在时序内容或交互动画中，“score”可组织事件、关系、持续、触发和留白；时间轴只是可能的表达之一，不能预设所有事件都落在单一线性轴上。这里的模式是软件设计推论，不是对特定作品的程序化复现。

## 可操作关系与不变量

- 先说明谱面在约束什么：事件身份、先后/同时、持续、重复、触发，还是这些属性中的可选集合。
- 把明确规则与可选解释分开；来源未说明的部分记为未知；只有明确留给演奏者的部分才作为开放选择，不补成唯一解。
- 把实现记录为可检查的 realization，例如一套声部、镜头或运动时间及其映射。作者规则、程序随机和执行者选择来源不同。
- 提供播放、暂停、停止或重置；另给静态顺序或状态索引。非必要交互动画尊重 `prefers-reduced-motion`。WCAG 2.3.3 的适用范围见 [W3C 来源卡](../../../../vault/provenance/art-software-atlas/temporal/cards/asa-t-09-wcag-animation-from-interactions.md)。
- 区分计划事件时间、回调执行时间和最终输出时间；音频排程时间不保证画面同步。

## 软件路径与取舍

1. **SVG/HTML 事件图与 playhead**：适合小型静态谱、复杂文字和焦点交互；规则可留在 DOM，也便于静态输出。播放器和时钟需另行实现，不能用帧循环冒充音频时钟。
2. **p5.js/Processing 图形与独立事件数据**：适合规则化图形和多种 realization；事件表可作为静态索引。画布需等价文本和控制，浏览器帧率不适合作高精度声音时钟。
3. **Tone.js Transport 或 SuperCollider 排程**：适合按音乐时间安排事件；图像若使用 `requestAnimationFrame`，须另行同步并在目标环境测量。[Tone.js](../../../../vault/provenance/art-software-atlas/temporal/cards/asa-t-07-tonejs-transport.md) 文档展示回调时间传给音源；[SuperCollider](../../../../vault/provenance/art-software-atlas/temporal/cards/asa-t-08-supercollider-server-timing.md) 说明逻辑时钟与 latency 时间戳。

## 构造性检查

构造一张 6 事件示范谱：A、B 可交换，C 在 A 后，D、E 可同时，F 仅手动触发。分别列“来源规则”和“本次 realization”，输出事件表、静态关键帧和动效版；暂停、停止、重启或减少动态后，三者仍表达相同关系。声音参数保留为数据，并提供静音或替代说明。

## 反例与失效模式

- 把没有轴和标度的图形谱擅自解释为“左到右时间线”，并把一份实现伪装成原谱唯一演奏法。
- 音频由独立时钟排程、视频按掉帧帧数推进，久播后画声漂移；页面仍声称同步。
- 自动循环持续播放且无停/暂停控制；减少动态设置被忽略，或只有关闭所有视觉反馈这一种替代。
- 把来源文字提到的可能声音写成“听来松散/紧张”等实际听觉判断。

## 邻接研究

后续可比较明确时间轴、文字指令、自由阅读与 performer realization；跨到舞蹈、现场行为或视频时，可再区分可编译关系与演出者判断。

Brown 的原说明以直接演出为先，除总时长外不预先定义事件；进一步确定须有谱与说明依据。见 [ASA-T-10 原说明](../../../../vault/provenance/art-software-atlas/temporal/cards/asa-t-10-earle-brown-prefatory-note.md)。
