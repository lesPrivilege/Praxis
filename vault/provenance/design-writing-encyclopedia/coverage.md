# 书目覆盖与操作地图

这份地图界定参考范围，帮助找到足够的解释或明确缺口。它不是全学科目录，也不是需要全部读完的基础课。已有比较、注释、图形编码、中文成文与证据底线继续在原位置维护；新增条目用 normal / reference 标出可选方法。

| 当前判断 | 可先用的正文 | 书目家族与不同前提 | 深度与尚缺部分 |
|---|---|---|---|
| 同属性比较，注释不能离开所指对象 | [比较](../../../kit/design/references/curated/comparison-continuity.md)、[注释](../../../kit/design/references/curated/note-adjacency.md)、[指向](../../../kit/design/foundations/anchoring.md) | 既有本地结构样张；参考用途通过与代码成熟度分开 | 未重验全部旧样张，代码、读屏与真实读者效果不能继承 |
| 字阶、字族角色、中文/拉丁混排与断行 | [排印](../../../kit/design/composition/typography.md) | USWDS 网页默认、CSS Text 处理规则、CLReq gap 实现缺口 | 英文行长不能变成中文阈值；字体许可、竖排与双向文本深入测试仍缺 |
| 品牌色、状态色与数据色不互相误导 | [颜色](../../../kit/design/composition/color.md) | W3C 非色彩线索、ColorBrewer 定类/顺序/发散地图编码 | 地图色板不等于所有图表配方；感知、色觉与复杂背景未做本地实验 |
| 平面、线描、浅色填充实体与白模如何选 | [对象表现](../../../kit/design/composition/object-representation.md) | Anatomy 的结构实体与读数、Hairline 的小型线图仪器 | 有两件静态图像观察；运动/工程正确性未验。白模只是操作对照，工业设计深入来源未取得 |
| 控件图标、直接操纵与可访问替代 | [控件](../../../kit/design/interaction/controls.md) | APG 模式、WCAG 准则、React Aria 实现分工、Apple 图标用途 | 文档已读与产品已运行分开；原生移动控件/系统平台完整行为仍缺 |
| 导航、焦点、草稿连续与渐进披露 | [导航](../../../kit/design/interaction/navigation.md) | Tabs / Accordion / Dialog 各有语义与焦点前提 | 不把必要决策信息收起；没有通用存储/恢复实现 |
| 请求未知、错误、完成和运动反馈 | [反馈](../../../kit/design/interaction/feedback.md)、[运动](../../../kit/design/motion/choreography.md) | 状态消息与内容更新不同；Apple HIG 与网页 WCAG 适用范围不同 | Prompt Motion 仅作品发现线索；没有连续播放、设备或辅助技术实测 |
| 读者任务、论证、操作/解释/参考的区别 | [读者](../../../dsh-praxis/kit/writing/organization/audience.md)、[论证](../../../dsh-praxis/kit/writing/organization/argument.md)、[文体选择](../../../dsh-praxis/kit/writing/genres/selection.md) | GOV.UK 用户需要；Purdue 的 Toulmin 教学解释；Google 项目优先；Diátaxis 文档需要 | Toulmin 原著未读；学术、新闻、创意、法律等专门文体未系统展开 |
| 中文技术 prose、编辑与反套话 | [中文成文](../../../dsh-praxis/kit/writing/principles.md)、[审阅](../../../dsh-praxis/kit/writing/review.md) | 沿用既有中文原则；外部英文指南不提升为中文规则 | 不新增禁词表；无跨作者/人类受众普遍效果证明 |
| 微文案、表单校验与服务故障恢复 | [微文案](../../../dsh-praxis/kit/writing/genres/microcopy.md) | GOV.UK actionable error；Microsoft 品牌 voice/tone；Ant Design 中文文案 | 品牌人格与公共服务语气可以不同；示范图、实现与多语读屏未验 |
| 翻译、本地化、地区词汇与语义保留 | [多语言边界](../../../dsh-praxis/kit/writing/language/multilingual.md) | Microsoft 全球沟通、中文 UI 语境、既有中文原理 | 明确源语言/目标语言；非中英语种、地方语言习惯仍缺原生编辑来源 |
| 正文、图、交互对象与动画怎样分工 | [媒介选择](../../../dsh-praxis/kit/task/media-choice.md)、[读来源](../../../kit/design/references/reading-sources.md) | Tversky 综述要求可比信息；NASA 产物说明；WAI 替代内容 | 论文从副本读取，出版版一致性未知；NASA 影片未观看，Eyes 未操作 |

更深处仍未充分覆盖：触觉/空间音频、地理投影误差、摄影裁切与伦理、复杂数学符号、竖排/双向细排、跨文化色义、辅助技术实测、读者实验、长篇叙事和行业专门规范。遇到这些任务时应补相应来源，不把相邻概念类推成证据。

## 按分面交叉寻找

[机器交叉索引](index.json)从来源 catalog 生成，列出唯一来源卡与有关语法。只有被实际标注的来源参与某个筛选；未标注不是“不适用”。下列例子演示边界，不是对整套书目的完整标签覆盖。

| 想找什么 | 真实例子与分面 | 读后仍要区分 |
|---|---|---|
| 解释结构，但不先绑定技术栈 | DWV-01：diagram 与 interactive-object 多媒介；SVG/WebGL 为作者明示实现；风格谱系 unknown | Anatomy 的填充实体不是白模通用定义，读数/动作仅有作者文档描述 |
| 从制图借用分类颜色 | DWV-09：来源行业 cartography，向 data-visualization 迁移标为 inferred；stack_runtime 不适用 | 作者行业与经过验证的适用行业不同；正文保留地图的条件 |
| 可换栈的数值操作 | DWI-007：keyboard-input + direct-manipulation，React 为文档实现语境 | 控件语义可迁移，API/依赖并未采纳或运行 |
| 中文和英文表单文字 | DWW-004 的 English/public-service 与 DWW-006 的 Chinese/product-design | 两套品牌/语言前提不合并；行业效果 unknown 不能用组织名代替 |
| 静态和动态对照 | DWX-04：diagram/motion/interactive-object 多值，任务 choose-medium 为本仓库推断 | 论文质疑不等价对照，不是宣称动画无效 |
| 找灵感但还没有可用行为证据 | DWI-006：motion 线索；stack_runtime 与 style_lineage unknown | 搜索摘录、静态图片、连续播放、运行测试分开 |

例如运行 `python3 scripts/reference_index.py --facet task=error-recovery` 找到 DWW-004；`--facet artifact=interactive-object` 找到不同前提下的多条来源。CLI 只是可选查找工具，离线阅读可以直接用上面的任务链接和书目索引。

别名解析和退役转向按 [现有入账规则](../../../docs/governance/intake.md#可选的分面交叉索引)维护；分类和新词只在实际发现缺口时扩展。用户的项目和设计选择仍可以采用其他媒介、风格或实现。
