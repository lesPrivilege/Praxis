<a id="asa-g-open-score"></a>

# 乐谱、事件与时间

语法 ID：`ASA-G-OPEN-SCORE` · 取用：可选普通参考（`normal` / `reference`）。

## 来路与范围

音乐谱常把事件组织到时间里；战后实验谱进一步用图形、文字和 diagrams 令演奏者在实现中作出解释。Getty 的 *The Scores Project* 将这一特定的战后欧美馆藏谱系与 1950 年代作曲家、David Tudor 的 “realization” 联系起来；Earle Brown 的 *December 1952* 是该项目记录的一件作品。该记录称矩形可被读作声音事件，开放到时值、音高聚合、强度与页面方向等演奏选择。以上是具体的来源描述，不是所有图形谱或即兴音乐的统一历史。Brown 本人关于作品的术语和表演时间观见 [作者说明](../../../vault/provenance/art-software-atlas/temporal/cards/asa-t-10-earle-brown-prefatory-note.md)；馆藏层的历史框架与具体作品条目见 [Getty 导论](../../../vault/provenance/art-software-atlas/temporal/cards/asa-t-02-getty-introduction.md) 和 [Brown 作品记录](../../../vault/provenance/art-software-atlas/temporal/cards/asa-t-01-getty-december-1952.md)。本次只读取到作者说明的 PDF 文本，没有查看图像。

### 取用目的

在时序内容或交互动画里，使用“score”比把一条线性时间轴当作唯一真相更合适：它能安排事件、关系、持续、进入条件和留白，同时让解释空间保持可见。Kit 的泛化是一个设计推论；它不等同于把某件作品程序化，也不能声称实现了其文化或表演语境。

## 可操作关系与不变量

- 先说明谱面在约束什么：事件身份、先后/同时、持续、重复、触发，还是这些属性中的可选集合。
- 把来源明确确定的规则与实现者仍可选择的部分分开标记。若无说明，视作未知；不要替空白补上隐含唯一解。
- 把实现解释保留为可检查的 realization：例如选择一套声部、镜头或运动时间，再记录对应的映射。作者规则、程序随机、执行选择是不同来源，不能混称为“随机”。
- 展示时给观者控制播放、暂停/恢复、停止或重置的入口；运动负责提供时间关系时，也提供静态顺序/状态索引。为非必要的交互动画尊重 `prefers-reduced-motion` 或等效用户设置；必要于功能或信息的动效单独论证。WCAG 2.3.3 的理解文件只覆盖其范围内的交互触发动画，另见 [W3C 来源卡](../../../vault/provenance/art-software-atlas/temporal/cards/asa-t-09-wcag-animation-from-interactions.md)。
- 时间描述要区分“计划事件的时间”“代码回调执行时间”和最终展示/输出时间。音频 API 返回可排程时间并不保证画面同步或听感。

## 软件路径与取舍

1. **SVG/HTML 事件图 + 明确的 playhead 状态**：适合小型静态谱、复杂文字和交互焦点；易把规则解释作为可访问 DOM 内容，也容易离线输出。需要自行提供播放器和时间推进；不要用 frame loop 偷偷充当音频时钟。
2. **p5.js/Processing 可视图 + 独立事件数据**：适合规则化图形、快速多种 realization；画布运动可重绘，事件表可复用为静态索引。画布本身的内容需要等价文本/控制；浏览器帧率不应作高精度声音时钟。
3. **Tone.js Transport 或 SuperCollider 排程**：适合把音乐事件绑定到时间线。Tone.js 文档示例将回调时间传给预定音源，SuperCollider 指南描述逻辑时钟与 latency timestamp。两者各自依赖运行时版本及设备/服务器条件；若图像另有 requestAnimationFrame，必须显式同步并实际测量。文档分别见 [Tone.js 14.7.77](../../../vault/provenance/art-software-atlas/temporal/cards/asa-t-07-tonejs-transport.md) 与 [SuperCollider 3.14.0](../../../vault/provenance/art-software-atlas/temporal/cards/asa-t-08-supercollider-server-timing.md)。本条并未执行它们。

## 构造性检查

可做一张 6 个事件的示范谱：规定事件 A 与 B 可交换，C 必须在 A 后，D 与 E 可同时，F 仅在手动触发时出现；给一行“来源规则”和一行“本次 realization”。生成简化事件列表、静态关键帧与动效版。切换暂停、停止、重新开始和减少动态后，三个表现仍表示同一事件关系。声音参数如果需要，保留为事件数据并提供静音/替代说明；没有实际 audition 前不要用听感形容词验收。

## 反例与失效模式

- 把没有轴和标度的图形谱擅自解释为“左到右时间线”，并把一份实现伪装成原谱唯一演奏法。
- 音频由独立时钟排程、视频按掉帧帧数推进，久播后画声漂移；页面仍声称同步。
- 自动循环持续播放且无停/暂停控制；减少动态设置被忽略，或只有关闭所有视觉反馈这一种替代。
- 将从来源文字转述的可能声音事件写成“听来松散/紧张”等听觉判断。

## 邻接研究

后续可比较其他实验谱中明确的时间轴、文字指令、自由阅读与 performer realization；也可检视事件谱跨到舞蹈、现场行为或视频叙事时，哪些关系可编译、哪些必须留给演出者。研究到具体来源与实际观看/聆听之前，不主张谱面视觉或演出声响特征。

Brown 原说明的具体边界：除约定总时长外，直接演出不以事前定义事件为首要方式；进一步确定须在谱与说明内有依据。本页构造的事件表是现代软件设计试验，不能称为忠实复演 Brown 程序。见 [ASA-T-10 原说明](../../../vault/provenance/art-software-atlas/temporal/cards/asa-t-10-earle-brown-prefatory-note.md)。
