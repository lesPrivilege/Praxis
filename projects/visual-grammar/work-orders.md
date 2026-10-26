# 开放工单与素材起点

这些工单为Opus节省重新找材料的成本，不规定顺序、数量、时长、技术栈或风格。可以任选、组合、拆分、并行或另立题材。Astra只整理来源关系；画面、grammar、激进效果与实现架构由Opus自由发挥。

先从每行的材料入口读摘要与稳定ID，只有需要时展开原件。所有作品可采用合成数据；产品已有实现、概念延展与艺术隐喻各自标清。

| 工单 | 可探索的主张/问题 | 最小召回入口 | 可自由扩展的方向 |
|---|---|---|---|
| VG-01 · 事件、状态与上下文 | 同一工作过程如何留下历史、形成当前状态、进入一次模型调用？ | [Courtwork](../../vault/provenance/visual-grammar-courtwork-20260928/README.md) 的日志/上下文材料；不要先假定来源与Chat的三分术语完全一致 | 多层空间、信息流、时间倒带、对象morph、镜头穿越、交互与成片双模式 |
| VG-02 · Attention 的生命周期 | 线索如何进入注意、等待、重新浮现或结束？ | Courtwork索引中的Attention代码与设计状态；[Praxis邻近项目](../../vault/provenance/visual-grammar-praxis-20260928/README.md)可作不同系统对照 | UI剧场、空间工作台、节奏型字幕、声音提示、夸张镜头、产品concept film |
| VG-03 · Schema 让意义成为可检查对象 | 字段、约束、关系、版本与解释如何共同组织一份材料？ | [Schema Engineering](../../vault/provenance/visual-grammar-schema-20260928/README.md)，区分论文论证与校验代码 | schema变形成scene、约束碰撞、编译管线、图网络、3D对象拆解 |
| VG-04 · 一条材料如何被消费 | discover/register/distill/verify/index/govern如何让后续工作起点改变？ | [Praxis召回](../../vault/provenance/visual-grammar-praxis-20260928/README.md)与本仓库入账链 | 证据星图、档案空间、可执行信息建筑、长镜头、时间回溯 |
| VG-05 · 同一语义，多种grammar | 同一个对象或关系能否用完全不同的视觉语法表达？ | 从任一上述工单取同一synthetic输入；[创作地图](creative-map.md) | typography、morph、particles、camera、simulation、音频同步混合；数量自选 |
| VG-06 · 声音写入时间 | 词、节拍、能量与人工事件如何共同塑造作品？ | [外部参考](../../vault/provenance/visual-grammar-external-20260928/README.md)中的音频入口；原Chat截图只作二手线索 | kinetic typography、声场、procedural音色、音乐驱动空间；素材自制或有许可 |
| VG-07 · 进入空间与模拟 | 抽象关系或自然过程怎样成为可操纵、可穿越的世界？ | 外部索引中的camera lab、continuous zoom、水模拟源仓库、黑洞lab | Three.js、GLSL/WebGPU、物理、流体、粒子、沉浸空间与科学/艺术混合 |
| VG-08 · 一份输入，多种作品 | 如何复用成熟renderer、schema与已有作品形成生成流水线？ | Schema/Praxis材料、外部Remotion/Headless/FFmpeg入口 | 任意输入协议、编排器、scene模板、批量变体、自动review与交互预览 |

## 语义与失败样例的素材建议

Opus可重新设计fixture和形式；下表用于避免只剩happy-path展示。

| 工单 | 可用synthetic输入 | 可观察的正常结果 | 可探索的反例 |
|---|---|---|---|
| VG-01 | 同一对象的创建、修正、拒绝事件与两次上下文选择 | 历史保留；当前状态与每次选入上下文可以不同 | 重放同一event不凭空生成新事实；上下文未选中不等于事实被删除 |
| VG-02 | 新线索、等待、到期/重新出现、人工处理 | 画面清楚说明当前Attention阶段 | 重复信号、取消、人工拒绝、不知道结果；不能靠动画结束替代真实完成 |
| VG-03 | 一个有效输入及缺字段/类型冲突/版本变化输入 | 约束的作用可以被看到与定位 | 无效输入、翻译或导出破坏结构、规则版本不匹配 |
| VG-04 | 一份可读取材料、一份重复材料、一条缺原件引用 | 材料身份与消费去向可追溯 | 缺原文不能伪造成已核实；distilled不等于adopted |
| VG-05 | 同一组内容与多个视觉配置 | 语义相同而风格、节奏和空间完全不同 | 信息遗漏、难以辨认、运动造成不存在的关系；艺术隐喻可明示 |
| VG-06 | 已知标注的短合成音频/人工事件 | 声音与画面时间关系可检查 | 静音、词时间戳偏移、无节拍段、尾音被截；自动分析可失败 |
| VG-07 | 固定seed、时间与交互序列 | 给定参数可以再次观察同一过程 | 帧率变化、重置、数值失稳、GPU差异；物理效果不自动等于科学准确 |
| VG-08 | 正常输入、缺资产、非法schema、导出失败 | 每阶段有可定位产物与复现配置 | 错误被吞、时长/音轨错配、重复任务、资源未加载；产物存在不等于可播放 |

这些是记录可观察结果的建议，不是创作审批关卡。每件作品的README说明实际选择了什么、复用了什么、完成与未完成什么；其他记录见 [工程交接](demo.md)。

## 已定位的 Schema 复用单元

`VG-01` 可同时召回 `SE-PRACTICE-01..04`：Schema、检索、Context Projection和Human Work Surface是不同职责。`VG-03` 的进一步切口为 `SE-SCHEMA-01..05` 的候选→验证→提交，以及同一状态的Model Context / Reviewer Packet / Retrieval Index三种投影；见 [文件级索引](../../vault/provenance/visual-grammar-schema-20260928/index.json)。这些是论文语义，不是现成业务runtime。

想借现成工程而非重写验证思路，可看 `SE-BUILD-01`、`SE-VALIDATE-01`、`SE-QA-01..02`：reader资源完整性、固定源版本与翻译hash发布门已有代码和本轮测试记录。它们可作为版本/资产失败语义的实现参考，不能冒充Work Contract运行证明。Luna另备有 [stale candidate合成样例](../../vault/provenance/visual-grammar-schema-20260928/normal-failure-stale-candidate.json)，可直接改编或另造fixture。

## Praxis 与相邻项目的现成入口

`VG-01` 有直接语义定位 `VG-PX-CORE-MODEL`（Event / State / Context），`VG-AA-CONTRACT`提供文件化Attention状态与人工决定trace模板，可共同展开或分别做作品。`VG-02`可用同一合同做另一种系统的对照，不必等待Courtwork的所有链路具备相同语义。

想借现成表现实现，先看 `VG-MN-PROGRAMME`（Mnemos Showroom、tokens及交互实现）、`VG-PX-LAYOUT`（已有布局样张实验）和 `VG-PX-REMOTION`（已有动态简报工程）。`VG-MN-PROTOTYPE`保留历史设计演变入口。定位、版本、文件hash与未验证项统一见 [Praxis sources](../../vault/provenance/visual-grammar-praxis-20260928/sources.json)，不把已有研究成品等同于通用组件或完整依赖快照。

## Courtwork 的实现召回提示

[Courtwork索引](../../vault/provenance/visual-grammar-courtwork-20260928/sources.json)把Attention、Work Core与Model Context的具体文件分别登记。`VG-01/VG-02`取材时可保持这种区别：Attention的 `next_action` 不等同于Core `obligation`；对象级 `attention_event` 不等同于Work Core B1 event表；Context的 `basis.current` 是输入适用性，不是接受授权。

索引召回了Courtwork内部FE01（共享packet fixture与Control Grammar）和FE03（Attention triage、revision/idempotency、丢回执恢复）两个开放素材入口。它们在原项目工单记录中仍是 `blocked-by-dependencies`，不代表本demo的创作被阻塞：Opus可以用合成数据自由构造concept或技术实验，注明与原项目状态的关系即可。
