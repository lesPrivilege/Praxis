# 软件工程的视觉与交互范围

所有与软件工程有关的视觉表达和交互都在目录收录范围内：软件怎样呈现对象、接收输入、表达变化，以及让人理解结果、继续或恢复操作。网页只是其中一种交付环境。平台、输入方式、媒介、任务与技术栈分别检索，不组成互斥分类树。

下面区分已经有正文的局部判断、可借用的邻近方法和待研究部分。研究范围比当前条目覆盖更广；没有深条目的领域仍有明确入口和下一步。

## 交付环境与软件类型

| 领域 | 现有发现入口 | 当前覆盖与缺口 | 下一次有界研究的起点与完成条件 |
|---|---|---|---|
| Web / 浏览器应用 | [控件](../../../kit/design/interaction/controls.md)、[导航](../../../kit/design/interaction/navigation.md)、[编排](../../../kit/design/composition/layout.md) | 已有语义、焦点、状态与响应式关系；组件实现、浏览器和辅助技术组合仍需逐项目验收 | 从既有 APG/WCAG 与目标组件官方资料出发，选一个完整任务，检查正常、慢加载、失败、键盘与触屏路径 |
| 原生移动应用 | [状态与可达性](../../../kit/design/interaction/states.md)、[运动编排](../../../kit/design/motion/choreography.md)、[图标与控件](../../../kit/design/interaction/controls.md) | 可借用状态与连续性判断，已有局部 Apple 指南来源；系统导航、应用生命周期、手势冲突和移动辅助技术未形成完整条目 | 选一个操作系统和一个任务，读该平台原生控件/导航/辅助技术官方文档；在前后台切换、返回、输入与错误恢复中保持同一对象状态 |
| 原生桌面与多窗口应用 | [导航连续性](../../../kit/design/interaction/navigation.md)、[高密度系统参考](../../../kit/design/references/systems.md) | 已有工作区、草稿与对象连续性判断；网页的 desktop-first 组件不构成原生桌面证据。窗口、菜单、快捷键、拖放与系统整合仍缺 | 选一个桌面平台和双窗口编辑任务，读取系统控件与窗口管理资料；检查焦点、命令作用域、未保存内容及窗口关闭/任务取消的区别 |
| 开发者工具、编辑器、调试器、CLI / TUI | [操作反馈](../../../kit/design/interaction/feedback.md)、[状态](../../../kit/design/interaction/states.md)、[精确指向](../../../kit/design/foundations/anchoring.md)、[微文案](../../../kit/write/prose/microcopy.md) | 可复用诊断定位、真实进度、取消与恢复；尚无终端显示、命令可发现性、流式输出或调试交互深条目。agent adapter 文档是接入资料，不是终端 UX 证据 | 选一项构建/调试任务，回到目标工具的命令手册、实际输出和实现；比较交互终端与重定向输出，检查诊断定位、无色输出、中断和部分结果 |
| 信息与数据可视化、分析工作台 | [图形编码](../../../kit/design/composition/encoding.md)、[范围选择](../../../kit/design/interaction/extent-selection.md)、[比较连续性](../../../kit/design/references/curated/comparison-continuity.md) | 已有编码、计量、上下文与选择；科学体数据、地图投影、流数据及大数据操作性能仍缺专门条目 | 沿 [D3 与实例来源](discovery/README.md)选择一个真实数据任务，保留单位、缺失和分母；对照两种编码或选择路径并检查错误解释 |
| 游戏与实时交互 | [规则系统](../../../kit/design/motion/rule-systems.md)、[运动编排](../../../kit/design/motion/choreography.md)、[对象状态](../../../kit/design/interaction/states.md) | 规则、可中断运动是邻近方法；HUD、游戏菜单、控制映射、实时状态可读性与游戏可达性尚未研究 | 选一个引擎和一个菜单/游戏内操作，读取其 UI、输入和可达性官方资料；用键鼠与手柄对照，验证焦点、暂停、重新映射与高负载状态反馈 |
| 3D、空间界面、AR / VR / XR | [对象表现](../../../kit/design/composition/object-representation.md)、[空间关系](../../../kit/design/composition/spatial-materials.md)、[控件语义](../../../kit/design/interaction/controls.md) | 已有视点、遮挡和空间示意；建筑/光艺术研究不构成 XR 输入、定位或舒适性证据。射线、手势、注视、空间锚定仍缺 | 固定一种设备和拾取/定位任务，读取设备输入与坐标系统资料；检验遮挡、参照系变化、追踪丢失与替代输入；现场身体体验单独记录 |
| 嵌入式、穿戴式与实体设备界面 | [媒介选择](../../../kit/write/publish/media-choice.md)、[反馈](../../../kit/design/interaction/feedback.md)、[状态](../../../kit/design/interaction/states.md) | 是收录范围；当前只有邻近的反馈判断，未研究小屏、实体控件、传感输入与设备约束 | 选一个设备任务和一种输出，读取设备/控件资料；在离线、单手或受限注意条件中核对输入、状态及恢复，缺设备时只完成资料比较 |

## 跨平台的交互问题

| 问题 | 现有发现入口 | 当前覆盖与缺口 | 下一次有界研究的完成条件 |
|---|---|---|---|
| 输入方式与等效操作 | [控件与非拖动替代](../../../kit/design/interaction/controls.md)、[范围选择](../../../kit/design/interaction/extent-selection.md) | 已有键盘、指针、触屏与非拖动路径；笔压力、手柄、语音、注视、手势与开关输入缺专门研究 | 选一个动作和两种输入，用目标平台官方输入资料定义同一结果；检查焦点、误触、取消及动作等效性 |
| 状态、反馈、错误与恢复 | [状态](../../../kit/design/interaction/states.md)、[反馈](../../../kit/design/interaction/feedback.md)、[微文案](../../../kit/write/prose/microcopy.md) | 已有请求未知、真实进度、安全重试和焦点恢复；离线/冲突/多端同步的完整实现需另查 | 对一个有副作用的操作列正常、未知、失败和取消状态；实际检查重复输入、断连和部分成功后怎样核对、继续或撤销 |
| 运动与时间 | [运动编排](../../../kit/design/motion/choreography.md)、[乐谱与时间](../../../kit/design/motion/score-and-time.md)、[规则系统](../../../kit/design/motion/rule-systems.md) | 已有连续性、中断、时钟与选择的区别；平台 spring/physics、实时同步及触发语法未全面展开 | 选一个状态变化，对照运动与静态替代；检查连续输入、暂停、反向和减少动态，记录真实事件与输出时序 |
| 声音与空间音频 | [乐谱与时间](../../../kit/design/motion/score-and-time.md)、[时间叙事](../../../kit/write/motion/narrative.md) | 有 Tone.js / SuperCollider 文档入口；尚无音频试听、通知声辨识或空间定位验证 | 选两种含义不同的声音事件，读取对应运行时资料并实际聆听；比较触发、延迟、静音和替代通道；空间定位另需相应设备与场景 |
| 触觉与多感官反馈 | [反馈](../../../kit/design/interaction/feedback.md)、[乐谱与时间](../../../kit/design/motion/score-and-time.md) | 当前只有反馈/时间的邻近关系；未登记触觉模式、设备能力或感知证据，材料触感不能代替 haptics 接口研究 | 选一个设备和两个状态，读取官方触觉接口与限制；在设备上比较强度/时序、关闭偏好和视觉/声音替代，明确哪些感觉未验证 |
| 无障碍与辅助技术 | [状态与可达性](../../../kit/design/interaction/states.md)、[控件](../../../kit/design/interaction/controls.md)、[颜色](../../../kit/design/composition/color.md)、[减少动态](../../../kit/design/motion/choreography.md) | 已有网页语义与部分平台指导；原生辅助技术、游戏、终端和 XR 的能力映射及使用者检验仍缺 | 选一个平台、一个完整任务与明确辅助技术组合；核对适用标准和系统 API，执行可达路径与失败恢复，网页要求不直接改称其他平台验收 |
| 感知性能与响应 | [反馈](../../../kit/design/interaction/feedback.md)、[慢载入导航](../../../kit/design/interaction/navigation.md)、[可中断运动](../../../kit/design/motion/choreography.md) | 已有及时反馈、不伪造进度、慢面板手动激活和不阻塞操作；尚无输入延迟、帧节奏、渲染负载或设备调度的专门证据 | 选一个高频动作，在正常与受限环境对照；用目标运行时测量输入、状态确认和可见/可听反馈，记录卡顿、误操作和恢复；不预设通用毫秒阈值 |

表中尚未登记的平台/工具资料是下一轮待选来源类型，不是新增书目或已读取参考。每轮只取一个平台、一个任务与少数对照条件；来源身份、实际输出和失败路径齐备后再增补深条目。历史艺术与材料方向继续沿 [研究流](streams.md)展开，两种路线可在同一消费任务汇合。

当前已分类对象使用 [分面查询](facets.md)查找；本表中的缺口不会作为伪造的 source、exemplar 或 implementation 加入索引。设计师决定任务、平台和呈现取舍，覆盖地图负责把可用解释和未完成研究分开。
