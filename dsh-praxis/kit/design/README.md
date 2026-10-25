# Design · 视觉与媒介表达

决定网页、原生应用、开发者工具、数据可视化、游戏与空间界面里的关系怎样可见、可操作或随时间呈现；图表、界面与运动任务从这里按当前判断选分支。

内容为何需要表达、图注和来源承担什么职责，由 [Writing](../writing/README.md)与 [Publish](../publish/README.md)维护。按平台查现有入口和待研究项，见 [软件交互范围](../../../vault/provenance/art-software-atlas/software-scope.md)。

| 当前需要 | 分支 | 产物 |
|---|---|---|
| 判断视觉方案是否服务任务 | [Foundations](foundations/README.md) | 目标、约束、取舍与证据范围 |
| 诉求还说不清属于哪类问题，或涉及色彩、形状、图像、材质、文字方向 | [构成关系与问题地图](foundations/relations.md) | 对应的构成问题、要保住的语义和检验方法 |
| 编排阅读层级、关系与数量，选择字阶、混排、色彩或对象表现 | [Composition](composition/README.md) | 构成关系、编码选择与表现取舍 |
| 表达对象、操作和状态 | [Interaction](interaction/README.md) | 状态矩阵、反馈与可达性检查 |
| 选择运动与时间表现 | [Motion](motion/README.md) | 运动目的、连续性、可中断与替代方式 |
| 从传统、作品、实验或工具生态寻找可试的软件操作 | [艺术与软件操作入口](references/art-software-atlas.md) | 语境、变量、实现取舍与反例 |
| 按作者或材料找方法，比较不同前提与证据 | [来源书目选路](references/README.md#按来源进入) | 自足摘要、实际读取范围、原始定位与语法链接 |
| 查成熟方法、来源或样张 | [References](references/README.md) | 按任务消费的解释、限制和原件来路 |
| 需求里出现风格名，或要探索一种视觉语言 | [视觉语言参考](references/languages.md) | 名字对应的范围、可以试的构成关系与来源状态 |

说明、标注、按钮、状态提示和图注按 [Writing](../writing/README.md)撰写与审阅。设计取舍有争议时，回查 Foundations。

可按更具体的问题继续：

| 情形 | 先读 |
|---|---|
| 窄屏下还要保持几个对象的比较 | [按属性维持比较](references/curated/comparison-continuity.md) |
| 局部注释在宽屏和窄屏都要跟着它解释的内容 | [注释保持邻接](references/curated/note-adjacency.md) |
| 需求里出现风格名 | [视觉语言参考](references/languages.md) |
| 界面控件、对象状态和可达性检查 | [Interaction 任务入口](interaction/README.md)；需要原始模式时再查 [U01–U09](references/interface.md) |
| 关系图、数据图、导航和页面节奏 | [编排参考 C01–C25](references/composition.md) |
| 图里或页面里既有已定的、也有未定的、被否的或等人决定的内容 | [成立程度与归属的标记](foundations/standing.md) |
| 证据、条件、注释或判断要指向某个对象的某个版本、某一处 | [精确指向](foundations/anchoring.md) |
| 把步骤、版本、事件、层级或前后对照沿一条线排开，或者把几条线并排 | [排列与刻度](foundations/placement.md) |
| 需要可改文字、关系、数据并可组合的原生 SVG | [SVG 需求与绘制项目](../../../demos/editable-native-svg/README.md)：候选登记与分批工单；第一批有六个关系图件和一个组合件，仍是候选，未经用户 review |

## 自撰库

本仓库自己画的图形和页面，与外部参考分开，不走来源书目；可以直接拷走整套用、只取几项、按同一套含义重画，或改用外部图标库。

- [记号、控件与运动](marks/README.md)：57 个原生 SVG 记号、11 个控件、10 种运动，含义与一版参考画法分开写。给节点、状态或步骤配小记号，或取用讲解页常见的控件时看；较重的编排仍按内容绘制。

文字、图、可操作对象或运动之间拿不定时，读 [媒介选择](../task/media-choice.md)。想知道当前有哪些可用判断和盲区，查 [覆盖地图](../../../vault/provenance/design-writing-encyclopedia/coverage.md)。

其余情形依据不足时，再展开 [References](references/README.md) 和 Vault。配色、字体、密度与媒介参数在消费者项目决定，历史 accepted 不自动扩散为全局规则。

新参考在 Vault 登记，实际使用在项目 index 记录；可复用结论由 [维护流程](../../../docs/governance/evolution.md)回流。[原子化编排实验](../../../vault/distilled/layout-specimens-20260927/README.md)已形成样张，可直接用作参考或改编样板，已有局部筛选；[筛选记录](../../../vault/distilled/layout-specimens-20260927/review.md)区分可复验的语义与尚未稳定的实现，不能视为已验收组件库。

结构迁移与旧入口映射见 [ADR-016](../../../docs/decisions/016-progressive-kit-structure.md)。
