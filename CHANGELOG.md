# Changelog

## 2026-09-27 · Kit 体例与设计参考消费

- 消费两份指定 Chat，由 Luna 探索与登记、Astra/main 裁决；覆盖与缺口见 [验收回执](docs/verification/kit-editorial-review-20260927.md)。
- 补齐 Kit 准入、渐进阅读、参考 distilled 语义、使用反馈与退出机制，见 [ADR-015](docs/decisions/015-kit-editorial-contract.md)。
- Design 入口改为任务导航，通用判断独立维护；答卷的固定样式与交付参数迁入 Vault 历史 profile，既有产物未改动。

## 2026-09-18 · 初始入账

- 以用户建立的Praxis远端为总名，建立Enterprise、Reporting与Work System三个入口。
- 登记三份Chat、外部溯源、本地设计材料的提炼与快照。
- 建立Goal/第一性原理、Luna/Astra分工、晋升与增量修订规则。
- 本版本是知识与契约基线；应用、组件与真实客户场景尚未实现。

后续语义变化须关联证据或ADR；来源入账数量与缺口以vault登记为准。

## 2026-09-19 · 工作系统增量与发布收敛

- 保留r1/r2，新增r3/r4完整快照；消费分流区分当前Praxis治理与其他项目候选。
- Goal扩展到工作环境、业务探索与专业交付；编订Kit/Skill、数据分区、Expert职责和抗折旧理由。
- 增加可重建的Chat inventory、统一registry、来源卡与不可静默覆盖的快照hash清单。
- 最终结构与公开范围review由Luna独立完成，Astra负责修复、验收与提交。

## 2026-09-19 · 材料分类小单

消费独立对话 2 轮/4 消息；补充 Reporting 六项 brief 与目的路由，采纳驻场组织接口、净减负和双账本约束。见 ADR-008。

## 2026-09-20 · 文档架构与审阅消费

- 将根、Kit 与各工作入口按任务和产物组织；定义、理由、状态与验证各自维护，见 ADR-011。
- 接续 ADR-009：共同语法、十二知识面、场景字段、分层验收、移交和消费者维护闭合。
- ADR-010 区分领域 Kit 与运行消费者，保留宿主状态和权限归属。
- 登记两份审阅原件、关联会话与 6 个官方文档实践页面；原补丁包未取得，具体范围见本轮验收回执。
- 新批次接入既有索引生成；独立研究的来源卡使用独立来源身份说明。

## 2026-09-22 · 平台产品 grammar 与 XMind Profile

- 按 ADR-012 为平台产品扫盲建立十章词表、自然语言解释与迁移案例，研究材料留 Vault，Kit 提供消费入口。
- 新建跨任务思维导图索引，原稿按主题单点维护；核心词表限定规模，推荐与采纳分开记录。
- 采纳用户提供的 `xmind-md/0.1`，增加静态 preflight；应用基线来源和实际导入状态分开报告。

## 2026-09-23 · AI 能力测试研究与回答体例

- 登记关联 Chat 与 3 个附件，Luna 分题核查外部实践并保存正文快照；原引用占位与补充证据分别登记。
- Astra 编订五题母稿、交付蓝图与 ADR-013，采纳面向外部读者的回答体例；页面与产品实验待后续工单。
- 外部正文快照接入 hash 清单，保留既有平台 grammar 工作树修改。

同日追加Jev社区研究包：独立登记24个来源入口，分清重复任务、独立样本、同研究多入口与线上/离线回放；增量进入研究地图，并少量修订Q2/Q4正文，Claude工单仍为单张。

同日续订：Luna召回CW Pages实际图表/编译与career展示HTML；答卷采用五个阅读页和共用纲要卡，参考定位并入原Claude单工单，保留正文/index分工。

前端设计资料在vault/distilled/frontend-design单设一目，集中CW、SE、career原件定位、前端绘制消费记录与外部参考；答卷作为消费者，避免通用素材仅挂在单次考题下。

同日版式复审：根据用户Q1截图否决仅去卡片的修补，建立五页论证/主展项和37段内容映射，重写Claude单工单；保留用户截图、CSS与两张历史Pages编排参考，未将文档改动称为页面已修复。

## 2026-09-22 至 24 · 平台扫盲、能力测试答卷与 Design/Writing kit

- 平台产品扫盲与思维导图归属，见 ADR-012。
- AI 能力测试：研究登记、五题回答母稿、问题—答案树与离线 HTML 答卷（`vault/distilled/ai-capability-assessment/rendered/`），回答体例见 ADR-013。
- 前端设计与可视化参考的召回、裁决与消费记录（CW、Schema Engineering、career-kit、外部 DESIGN.md、W3C/WCAG、GOV.UK、ONS）。
- 建立 [kit/design](kit/design/README.md) 与 [kit/writing](kit/writing/README.md)，写作原理由项目 skill `writing` 自足承载，见 ADR-014；旧的全局 house-style skill 停用。
- 第三方网页快照中的预签名 S3 凭证已脱敏，另存为带日期的新版本路径。

## 2026-09-27 · Kit 结构落实与独立审计

- 按用户指出的结构缺口建立 Write 的 prose/publish/motion/shared 分支，Design 按判断和参考用途分层；规则迁入唯一位置，旧路径保留导航，见 [ADR-016](docs/decisions/016-progressive-kit-structure.md)。
- Writing skill 改为读取 Kit 的薄入口；专门答卷体例放入 Prose/Genres。
- Sol 完成迁移前的 [治理审计](docs/verification/editorial-audit-20260927/README.md)，Luna整理参考与Vault导航。
- Opus 改为用户手动paste的 [原子化编排工单](vault/distilled/layout-specimens-20260927/brief.md)，开放Design探索，尚无样张产物。

## 2026-09-27 · 参考发现、优先取用与回流

- 按 [ADR-017](docs/decisions/017-reviewed-reference-priority.md)区分参考取用优先级、证据状态和规范采纳；两项经限定用途验收的结构说明进入Kit任务优先层。
- 建立demo/实际消费的增量回流、降级与退出路径；修正样张父级入口的旧状态，并补非Design与Runtime的任务参考路由。
- 全仓本地材料覆盖与无额外提示的真实消费效果仍须继续验证，详见 [发现性验收](docs/verification/reference-discovery-20260928.md)。

2026-09-28续订：以不点名材料的任务验证渐进披露；完整atom与事件快照保留探索入口，发现性断点也作为长期维护的反馈。


## 2026-09-28/29 · 视觉语法材料与当前工作收尾

- 入账“建立视觉语法语料库”3轮6消息及截图；四组Luna追溯Courtwork、Schema Engineering、Praxis与相邻项目，以及21个独立外部URL。
- 在 [视觉语法工场](demos/visual-grammar/README.md)准备8个开放工单、原仓库/外部索引和Opus唤醒prompt。Astra整理材料结构，Opus自由选择技术栈、grammar、激进效果与实现。
- 梳理既有Kit迁移、研究入口与答卷产物改名后的链接；历史研究与验收保留其原范围，当前入口采用最新状态。原子化编排实验现已有产物，27日“尚无样张”是当时状态，当前见 [研究与筛选](vault/distilled/layout-specimens-20260927/README.md)。
- 本轮材料检查与全仓收尾结果见 [验收](docs/verification/visual-grammar-20260928.md)，不代表新demo或视频已经制作。

同轮结构接管验证：布局样张明确为可直接参考/改编，消费与审阅状态分离。两项HTML工件和一项文字布局只作验证证据，归入docs/verification；发现的参考机制误读回写唯一卡片，并经新上下文复测，未将测试工件晋升为产品或组件。

## 2026-10-02 · Design grammar atlas 消费

- 入账用户提供的 44 文件研究包并逐文件 hash；47 条外部来源各重访一次，32 verified、11 partial、4 unavailable，只读文字。
- 包的校订意见基于远端旧基线；关于入口与路由的部分，本地已由 ADR-015/016/017 覆盖。
- 按用户裁决保留泛化层（[ADR-018](docs/decisions/018-generalized-design-relations.md)）：新增 [构成关系与问题地图](kit/design/foundations/relations.md)，收十五个构成问题、约束强度与检验方法；[视觉语言参考](kit/design/references/languages.md)（VL01–VL08）、样张和打样提案作为它的取用方式挂出。
- 按包内 A01 提案做了一件 [阅读关系样张](vault/distilled/design-grammar-atlas-20261002/a01-reading-relations/README.md)：一份夹具、一份 HTML、五套样式；得到断行与字重两处失配。
- 六题冷启动走读、补入口后的复跑与全部未做项见 [回执](docs/verification/design-grammar-atlas-20261002.md)。Opus 主会话裁决，Sonnet 只读代理对照、重访与走读。
