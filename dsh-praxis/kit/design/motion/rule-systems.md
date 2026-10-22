<a id="asa-g-rule-systems"></a>

# 规则系统、有限扰动与生成时间

<!-- ASA-G-RULE-SYSTEMS -->

## 来路与边界

V&A 将 Molnar 的 “machine imaginaire” 描述为以网格、数学和自设约束手工探索几何组合；Morgan Library 记录称 *Interruptions*（1968）由她编程、经穿孔卡输入绘图仪，随机成分形成空隙。[V&A 来源卡](../../../../vault/provenance/art-software-atlas/temporal/cards/asa-t-04-va-molnar-machine-imaginaire.md)保存策展解释，[Morgan 对象记录](../../../../vault/provenance/art-software-atlas/temporal/cards/asa-t-03-morgan-molnar-interruptions.md)保存馆藏说明。

规则是作者选择的约束或映射；伪随机是算法按种子产生的数列；不确定性也可能来自演奏者、输入、环境或数据。称结果为“偶然”时说明机制，不能从视觉结果倒推作者使用过随机数。

## 操作与不变量

- 定义基础对象、可变参数、范围、顺序和排除规则；区分硬约束与倾向。
- 分开记录规则与参数的选择、算法展开方式和实例选择者。
- 重现状态时固定 seed 并记录规则版本；探索变化时让 seed 或参数可见。固定 seed 可重现指定伪随机序列，换 seed 不等于作者意图。
- 区分穷举、抽样和每次运行扰动；它们的覆盖率与重复性不同。
- 若规则随时间更新，定义时钟、暂停/重置和回放；提供 play/pause/stop/step/reseed。减少动态时改用静态比较、逐步选择或用户触发。

## 软件路径与取舍

1. **枚举参数表与 SVG/canvas**：适合小集合的审阅和逐项比较，可附索引；组合数会快速膨胀，抽样不可称为穷举。
2. **Processing 或 p5.js 固定种子**：用 `randomSeed()` 重现指定伪随机函数的序列，并让 seed 成为探索控制项。不同 API、版本和语言不因此共享序列。见 [Processing](../../../../vault/provenance/art-software-atlas/temporal/cards/asa-t-05-processing-random-seed.md) 与 [p5.js](../../../../vault/provenance/art-software-atlas/temporal/cards/asa-t-06-p5-random-seed.md)。
3. **事件与声音层**：Tone.js Transport 可在浏览器侧按 transport 时间排程；SuperCollider 提供服务器、clock 与 latency 模型。图像与声音的同步仍取决于目标环境。见 [Tone.js](../../../../vault/provenance/art-software-atlas/temporal/cards/asa-t-07-tonejs-transport.md) 和 [SuperCollider](../../../../vault/provenance/art-software-atlas/temporal/cards/asa-t-08-supercollider-server-timing.md)。

## 构造性夹具

使用 8 个同形线段组成 4×2 网格，只改一个变量：角度偏移 ±8°、位置偏移一个网格单位、每轮最多省略 2 段。并列三种输出：

- **规则序列**：按第 1、2、3… 个元素固定递增，不使用随机数。
- **采样序列**：固定 seed `17`，对每个位置独立生成偏角/是否省略。
- **有意选择**：设计者手动指定一个 variant，并写一句为何保留它。

显示规则、seed、所选索引和播放速率。静态模式并列基础形、输出形与差异；动画或声音只作可选阅读层。

## 反例与失效模式

- 把固定 seed 的同一结果说成每次都不同，或默认 seed 却声称可复现。
- 把枚举参数生成的 variant 叫“AI 设计”，隐藏参数与取舍规则的选择者。
- 只看部分样本，却声称覆盖“全部可能”。
- 规则持续变化却没有暂停、重播或 step，或暂停状态与静态状态不一致。
- 以随机缺口类比 Molnar，暗示自己的代码共享其历史、技术或意图。
- 让音频播放回调依赖画布帧数；切后台或掉帧会改变事件节奏。

## 邻接研究

可扩展到手工步骤谱、游戏规则、绘图仪和变奏编辑器，比较伪随机、演奏者选择、环境噪声与作者规则留下的 provenance。交互动画的适用范围见 [WCAG 2.2 2.3.3 来源卡](../../../../vault/provenance/art-software-atlas/temporal/cards/asa-t-09-wcag-animation-from-interactions.md)。
