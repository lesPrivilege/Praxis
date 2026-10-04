# Design · 视觉与媒介表达

从正在做的判断进入有关分支。内容为何需要表达、图注和来源承担什么职责，由 [Write](../write/README.md)维护；本目录处理如何让这些关系可见、可操作或随时间呈现。

| 当前需要 | 分支 | 产物 |
|---|---|---|
| 判断视觉方案是否服务任务 | [Foundations](foundations/README.md) | 目标、约束、取舍与证据范围 |
| 诉求还说不清属于哪类问题，或涉及色彩、形状、图像、材质、文字方向 | [构成关系与问题地图](foundations/relations.md) | 对应的构成问题、要保住的语义和检验方法 |
| 编排页面、关系与数量 | [Composition](composition/README.md) | 阅读层级、空间关系与编码选择 |
| 表达对象、操作和状态 | [Interaction](interaction/README.md) | 状态矩阵、反馈与可达性检查 |
| 选择运动与时间表现 | [Motion](motion/README.md) | 运动目的、连续性、可中断与替代方式 |
| 查成熟方法、来源或样张 | [References](references/README.md) | 按任务消费的解释、限制和原件来路 |
| 需求里出现风格名，或要探索一种视觉语言 | [视觉语言参考](references/languages.md) | 名字对应的范围、可以试的构成关系与来源状态 |

图表和界面任务可以直接从这里开始，不必先走 Write 的成文流程；产物上写给读者的成句文字，包括说明、标注、按钮、状态提示和图注，仍按 [Write / Prose](../write/prose/README.md)写和审。纯文字校对不涉及视觉时不用进来。不需要所有任务都先读一遍基础，遇到取舍争议再回 Foundations。

下列情形先读对应参考，再动手：

| 情形 | 先读 |
|---|---|
| 窄屏下还要保持几个对象的比较 | [按属性维持比较](references/curated/comparison-continuity.md) |
| 局部注释在宽屏和窄屏都要跟着它解释的内容 | [注释保持邻接](references/curated/note-adjacency.md) |
| 需求里出现风格名 | [视觉语言参考](references/languages.md) |
| 界面控件、对象状态和可达性检查 | [界面参考 U01–U09](references/interface.md) |
| 关系图、数据图、导航和页面节奏 | [编排参考 C01–C25](references/composition.md) |
| 图里或页面里既有已定的、也有未定的、被否的或等人决定的内容 | [成立程度与归属的标记](foundations/standing.md) |
| 证据、条件、注释或判断要指向某个对象的某个版本、某一处 | [精确指向](foundations/anchoring.md) |
| 需要可改文字、关系、数据并可组合的原生 SVG | [SVG 需求与绘制项目](../../demos/editable-native-svg/README.md)：候选登记与分批工单；第一批有四个关系图件和一个组合件，仍是候选，未经用户 review |

其余情形依据不足时，再展开 [References](references/README.md) 和 Vault。配色、字体、密度与媒介参数在消费者项目决定，历史 accepted 不自动扩散为全局规则。

新参考在 Vault 登记，实际使用在项目 index 记录；可复用结论由 [维护流程](../../docs/governance/evolution.md)回流。[原子化编排实验](../../vault/distilled/layout-specimens-20260927/README.md)已形成样张，可直接用作参考或改编样板，已有局部筛选；[筛选记录](../../vault/distilled/layout-specimens-20260927/review.md)区分可复验的语义与尚未稳定的实现，不能视为已验收组件库。

结构迁移与旧入口映射见 [ADR-016](../../docs/decisions/016-progressive-kit-structure.md)。
