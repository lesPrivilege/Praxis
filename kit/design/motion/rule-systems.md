<a id="asa-g-rule-systems"></a>

# 规则系统、有限扰动与生成时间

语法 ID：`ASA-G-RULE-SYSTEMS` · 取用：可选普通参考（`normal` / `reference`）。

## 来路与边界

Véra Molnar 的馆藏资料与博物馆文章提供了重要的非计算机前身：馆方将她的 “machine imaginaire” 描述为用网格、数学和自设约束手工探索几何组合；Morgan Library 对 *Interruptions* 的记录称 1968 年的 plotter 绘图由她自编程序和穿孔卡执行，并含随机造成的空隙。V&A 对作者性的解释属于该文的策展观点，不能从“由规则生成”推断出固定的作者意图。参见 [V&A 来源卡](../../../vault/provenance/art-software-atlas/temporal/cards/asa-t-04-va-molnar-machine-imaginaire.md) 与 [Morgan 对象记录](../../../vault/provenance/art-software-atlas/temporal/cards/asa-t-03-morgan-molnar-interruptions.md)。

算法、随机和作者判断须分开：规则是作者选择的约束/映射；伪随机是算法按种子产生的数列；不确定性可能来自演奏者、输入、运行环境、数据或算法。把伪随机称作“偶然”时应限定来源和实现，不可仅凭视觉结果推断作者曾使用随机数。

## 操作与不变量

- 先写出受控的基础对象、可变参数、允许区间、次数/顺序与排除规则。指出哪些约束不可破坏，哪些只是倾向。
- 将意图、程序和选取分层：人选择哪些规则与参数；算法如何展开它们；人/观众如何选择具体实例。它们可以交叠，但不自动互相替代。
- 需要重访同一状态时固定 seed 并保留规则版本；探索变化时，显式让 seed 或参数成为控制项。固定 seed 表示可复现的伪随机结果，不是“没有规则”的保证；换 seed 的变化也不是作者意图本身。
- 区分“遍历所有可枚举组合”“从集合抽样”“每次运行加扰动”。这三者带来不同覆盖率与重复性，不能用一个 random slider 概括。
- 如果规则输出随时间更新，明确更新时钟、暂停/重置行为、时间是否可回放。动画系统可提供 play/pause/stop/step/reseed 控件；减少动态模式下将连续运动改为静态比较、逐步选择或用户触发，不让持续动画成为唯一读懂差异的方法。

## 软件路径与取舍

1. **枚举式参数表 + SVG/canvas renderer**：由可枚举数组或手写生成器创建完整 variant 集，再用简单绘制器展示。适合小集合、审阅和可追溯比较，可附精确索引并避免随机覆盖遗漏；组合数会快速膨胀，不能假称穷举已完成。
2. **Processing 或 p5.js + 固定种子**：用 `randomSeed()` 复现伪随机序列，再让用户换 seed 探索。两份官方文档说明各自的 `randomSeed()` 会让其指定伪随机函数按常量种子重复；不同 API、版本和语言并不因此共享同一序列。见 [Processing](../../../vault/provenance/art-software-atlas/temporal/cards/asa-t-05-processing-random-seed.md) 与 [p5.js](../../../vault/provenance/art-software-atlas/temporal/cards/asa-t-06-p5-random-seed.md)。
3. **事件/声音层**：Tone.js Transport 适合浏览器侧按 transport 时间排程；SuperCollider 提供独立服务器、clock 与 latency 概念。前者便于与 Web UI 放在同一程序，后者对客户端/服务器时间边界提供明确模型；任何实际同步质量都要在目标系统测试。见 [Tone.js](../../../vault/provenance/art-software-atlas/temporal/cards/asa-t-07-tonejs-transport.md) 和 [SuperCollider](../../../vault/provenance/art-software-atlas/temporal/cards/asa-t-08-supercollider-server-timing.md)。本条没有执行或聆听示例。

## 构造性夹具

使用 8 个同形线段，在 4×2 网格内只改一个变量：角度偏移限于 ±8°；位置偏移限于一个固定网格单位；每轮最多省略 2 段。提供三个可并列的输出：

- **规则序列**：按第 1、2、3… 个元素固定递增，不使用随机数。
- **采样序列**：固定 seed `17`，对每个位置独立生成偏角/是否省略。
- **有意选择**：设计者手动指定一个 variant，并写一句为何保留它。

显示完整规则、seed、seed 是否缺省、所选索引、播放速率与静态导出。静态模式应可并排比较基础形、输出形和差异；动画/声音作为可选阅读层，不把缓慢渐变当唯一证据。

## 反例与失效模式

- 把 seed 固定后把独特的一次结果说成每次随机生成；或者默认 seed 却声称可复现。
- 将一组枚举参数生成的 variant 叫“AI 设计”，抹去是谁选择了参数和取舍规则。
- 面对大量组合只看若干抽样，却用“全部可能”来描述范围。
- 规则持续变化但没有停、重播或 step；暂停与静态状态不一致。
- 以随机缺口类比 Molnar，暗示自己的代码共享其历史、技术或意图。
- 让音频播放回调直接依赖画布帧数；页面切后台/掉帧时事件节奏可能变化。Tone.js 与 SuperCollider 文档描述了各自的时钟机制，但没有替代目标环境的同步验证。

## 邻接研究

可扩展到手工步骤谱、游戏规则、绘图仪和可交互的变奏编辑器；比较伪随机、演奏者选择、环境噪声和作者规则如何留下不同的 provenance。可再找一份具体 Molnar 工作的可检查图像或程序档案，并执行一次有固定/不同 seed 的可重复性检查。W3C 对交互触发动画有范围限定，详见 [WCAG 2.2 2.3.3 来源卡](../../../vault/provenance/art-software-atlas/temporal/cards/asa-t-09-wcag-animation-from-interactions.md)。
