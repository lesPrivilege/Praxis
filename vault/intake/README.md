# Intake · 材料登记

Intake 只登记材料身份、覆盖、处理状态、附件和缺口，不重复保存 raw 对话全文，也不把登记结果写成 Kit 规范。需要消费时进入对应的 `vault/distilled` 目录；需要逐 URL 证据时进入 `vault/references` 或 `vault/provenance`。

## 按登记任务进入

- [Drift 社区探针](drift-checkers-20260930.json)与[提供方实践](drift-providers-20260930.json)：选定源码、许可证、官方接口与消费边界；原对话来源的后续核查追加在 [来源登记 reviews](environment-observation-20260930.json)。

- [环境观测来源 · 2026-09-30](environment-observation-20260930.json)：4 轮 8 消息的独立批次登记；[迁移官方来源](anthropic-migration-evidence-20260930.json)单独核查，不冒充恢复原对话引用。

| 任务 | 入口 | 下一步 |
|---|---|---|
| 登记早期 Enterprise kit Chat | [`materials.json`](materials.json) | 从 [早期主题提炼](../distilled/README.md#早期-enterprise-kit-批次) 读取，缺口仍回查原归档 |
| 登记一批 Chat 或增量 | [统一 Chat 登记](chat-captures.json) | 逐条保留 conversation/turn/item 身份和消费去向 |
| 登记本地下载、项目或附件 | [local-projects.json](local-projects.json) · [downloads.json](downloads.json) | 对照快照和 hash，说明未保存依赖 |
| 查看统一覆盖和快照状态 | [registry.json](../registry.json) · [snapshot-manifest.json](../snapshot-manifest.json) | 继续到 distilled、references 或 snapshots |

## 早期材料与现有消费入口

[`materials.json`](materials.json) 记录早期线程的 10 个 turn、20 条消息、主题映射和消费状态。

缺口保持显式：

- 归档文本中的 `:chatgpt-content-reference{index="..."}` 只保留引用占位，无法从该 JSON 还原具体来源 URL、标题或正文；相关主张仍标为待核实。
- 源数据没有可消费的附件条目；按“附件为空”登记，不推断对话外附件。
- CW 治理、Jev/结构化模型和企业内部平台状态在早期线程中没有可独立验证的附件或定义；保留为上下文线索，不展开成事实。

### Reporting 与 Work System

- Reporting / 本地设计材料：[`reporting-materials.json`](reporting-materials.json)、[`local-projects.json`](local-projects.json)；结构化入口为 [`../distilled/reporting/README.md`](../distilled/reporting/README.md) 与 [`../distilled/reporting/local-design.md`](../distilled/reporting/local-design.md)。
- Work System 原始材料：[`work-system-materials.json`](work-system-materials.json)（5 轮/10 条消息）、[`work-system-increment-r2.json`](work-system-increment-r2.json)（r2 4 轮/8 条消息）；结构化入口为 [`../distilled/work-system/README.md`](../distilled/work-system/README.md)。
- 2026-09-19 增量：[r3 登记](work-system-increment-r3.json)（10 轮/20 条消息）、[r4 登记](work-system-increment-r4.json)（1 轮/2 条消息）；结构化入口见 Work System 的 r3/r4 目录。
- [材料分类体系登记](material-classification.json)：独立对话 2 轮/4 消息，无外部 URL 或 citation。

### Platform product、架构与文档

- [平台类产品 grammar 扫盲 · 2026-09-22](platform-grammar-20260922.json)：原线程读取 6 轮/12 消息，按主题归档 4 轮/8 消息；11 个 citation placeholder 仍为 `missing-original`。结构化消费已经存在于 [`../distilled/platform-product/README.md`](../distilled/platform-product/README.md)、[`../distilled/platform-product/outline.md`](../distilled/platform-product/outline.md) 与 [`../distilled/platform-product/annotated.md`](../distilled/platform-product/annotated.md)，不再标为预留入口。
- 2026-09-20 [架构审阅入账](architecture-review-2026-09-20.json)：两份原件、1 轮/2 消息、7 个引用占位及交付缺口。
- 2026-09-20 [文档实践研究](documentation-practices-2026-09-20.json)：6 个官方 URL 的问题、证据、选型建议和未快照依赖；来源登记见 [`../provenance/documentation-practices/catalog.json`](../provenance/documentation-practices/catalog.json)。

### 2026-09-23 研究与前端材料

- [AI 能力测试登记](ai-capability-assessment-20260923.json)：r2 8 轮/11 条可见消息（保留 r1）、3 个附件原件与逐消息覆盖；消费入口为 [`../distilled/ai-capability-assessment/README.md`](../distilled/ai-capability-assessment/README.md)。
- [Jev 社区研究包增量](jev-community-20260923.json)：4 个包文件与 1 份粘贴文本；24 个历史来源入口另行核查，状态见 [`../distilled/jev-practices/README.md`](../distilled/jev-practices/README.md)。
- [CW Pages 召回](cw-pages-recall-20260923.json) 与 [career HTML 召回](career-html-recall-20260923.json)：实际图式/编译入口、展示 HTML、定向快照和未保存依赖，供 [`五页答卷`](../distilled/ai-capability-assessment/five-page-outline.md) 消费。
- [CW 前端消费链](cw-frontend-consumption-20260923.json) 与 [SE 前端消费链](se-frontend-recall-20260923.json)：统一归入 [`前端设计资料目`](../distilled/frontend-design/README.md)。
- [用户 Q1 截图审阅](assessment-layout-review-20260923.json) 与 [真实编排参考](frontend-composition-anchors-20260923.json)：保存问题证据与历史设计参考，二者不混作当前页面验收。

### 2026-09-25–27 增量、两份 Chat 与外部补充

- 2026-09-25 [Agent Runtime 机制研究](agent-runtime-survey-20260925.json)：DeepSeek 新版、Orchestra 同名候选及多 provider 网关；研究与裁决见 [`../distilled/agent-runtime-survey-20260925/README.md`](../distilled/agent-runtime-survey-20260925/README.md)。
- 2026-09-27 [Opus 5.5 remotion video](opus-remotion-video-20260927.json) 与 [Design Grammar](design-grammar-20260927.json)：各 5 轮/10 消息，附件为空；原件见 [Opus archive](../archive/chat/opus-remotion-video-20260927.json) 与 [Design archive](../archive/chat/design-grammar-20260927.json)，共同消费入口为 [`Write / Design grammar`](../distilled/write-design-grammar/README.md)。Design Grammar 的 7 个 citation placeholder 保留为 `missing-original`。
- 2026-09-27 [写作结构补充来源](../provenance/writing-structure-20260927/catalog.json)：5 个 Google / Microsoft supplemental URL；消费语义见 [`../distilled/writing-structure-20260927/README.md`](../distilled/writing-structure-20260927/README.md)，不恢复原 Chat 的隐藏引用。
- 2026-09-27 [原子化编排实验登记](layout-specimens-20260927.json)：样张已完成，可直接作为参考或改编样板；[gallery](../distilled/layout-specimens-20260927/index.html)、[检查](../distilled/layout-specimens-20260927/checks/README.md)与[局部筛选](../distilled/layout-specimens-20260927/review.md)分别说明产物和覆盖。[原工单](../distilled/layout-specimens-20260927/brief.md)保留来路，未晋升为通用组件。

统一索引和快照完整性仍以 [`../registry.json`](../registry.json) 与 [`../snapshot-manifest.json`](../snapshot-manifest.json) 为准。当前目录的登记、来源状态和缺口不能推断外部页面已重新访问、项目已安装或产物已通过视觉/运行验收。

- [原子化编排实验 · 2026-09-27](layout-specimens-20260927.json)：接收本地样张、检查报告与有限筛选；候选与未检查边界见 [review](../distilled/layout-specimens-20260927/review.md)。

- [SourceWeft比较 · 2026-09-28](sourceweft-praxis-20260928.json)：1轮2消息及逐URL补充核查，原citation占位保留缺口；消费至 [研究与架构差异](../distilled/sourceweft-praxis-20260928/README.md)。

- [视觉语法语料库 · 2026-09-28](visual-grammar-20260928.json)：3轮6消息及技术栈截图，Luna本地项目与外部来源定向追溯；[Opus施工入口](../../demos/visual-grammar/README.md)。

- [Palantir · 2026-10-01](palantir-20261001.json)：4轮7消息、8个未核实 URL 与10个 missing-original 引用占位；[阅读入口](../../palantir/README.md)。

- [Tally · SaaS · 2026-10-01](tally-saas-20261001.json)：72文件完整快照与hash；[书稿阅读入口](../../tally/README.md)。

- [Design grammar atlas · 2026-10-02](design-grammar-atlas-20261002.json)：44 文件研究包的完整快照与 hash，另记 47 条来源的重访与六题冷启动走读；[消费与裁决](../distilled/design-grammar-atlas-20261002/README.md)。
- [PraxisDesignKit 工单提案 · 2026-10-02](design-kit-workorders-20261002.json)：单文件提案的快照与 hash，另记 16 个未重访的外部链接；[入账与裁决](../distilled/design-kit-workorders-20261002/README.md)。
- [Write / Present 架构校订补充 · 2026-10-02](write-present-supplement-20261002.json)：单文件校订意见的快照与 hash，5 个外部链接里 4 个已重读；[对照与裁决](../distilled/write-present-supplement-20261002/README.md)。
- [内容架构与能力语法审阅 · 2026-10-02](content-architecture-review-20261002.json)：单文件建议稿的快照与 hash，13 个外部链接都没有打开；[对照与裁决](../distilled/content-architecture-review-20261002/README.md)。
- [社区 Skills 与 Prompts 研究包 · 2026-10-02](community-grammar-20261002.json)：三个文件的快照与 hash，45 个外部链接里主会话读了 8 个；[对照与裁决](../distilled/community-grammar-20261002/README.md)。
- [自足性审查 · 2026-10-02](self-contained-review-20261002.json)：单文件审查的快照与 hash，引用的都是本仓库自己的文件，没有外部来源；[对照与裁决](../distilled/self-contained-review-20261002/README.md)。
