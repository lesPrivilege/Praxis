# Changelog

## 2026-10-03 · 成文规则与 writing 薄入口

- 对照委托提供的召回摘要与当前 Write 实现，窄修订语体、句式、信息作用、审阅判准和修改记录默认，见 [ADR-024](docs/decisions/024-prose-defaults-and-review-scope.md)。四条语义底线和现有目录保持，个人口吻只用于当前任务。
- Prose 直接说明外部参考的用途与低权重边界；既有三个来源重访，ASD-STE100 三个官方路由访问受限，未提炼规则或声称合规。Reporting 的 brief 前提与入口对齐，Publish 补当前职责裁决链接。
- [回执](docs/verification/writing-review-20261003.md)保留对照表、四段现有文本的适用边界和未验项。Write 纯文本收缩与既有 ADR 落位的冲突已列明，未实施职责迁移。

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

## 2026-10-02 · 工单提案入账与工单一

- 入账 dot 的 [下一轮串行工单与 Motion 提案](vault/distilled/design-kit-workorders-20261002/README.md)：五包工单逐包裁决，附录的 16 个外部链接登记为 unverified。
- 执行工单一：九项更正逐条对回包内原句，主会话直接重读 16 条来源并看了一张原作海报；三行首轮记法撤回，atlas 来源现为 34 verified、12 partial、1 unavailable。
- Kit 只改措辞：[视觉语言参考](kit/design/references/languages.md)的 VL01、VL03、VL07 与图像说明，[问题地图](kit/design/foundations/relations.md)的 G12 一句。没有新增条目或规则。
- 放行给下一包的输入、悬置项与未做项见 [回执](docs/verification/design-kit-wo1-20261002.md)。工单二至五未开工。

## 2026-10-02 · 工单二：陌生 brief 冷读

- 三份合成内容（迁移、拒用、补充），预期判断在代理开跑前冻结；九次 Sonnet 冷读，其中三次是不读仓库的对照。
- 读过 Kit 的六次全部到达所需页面并作出预期决定。对照组在版面结构上决定相同，只在把字体与颜色归给风格名这一点上不同。
- 修订一处：A01 的字重观察补了适用范围。VL01 与问题地图登记了这次取用。没有新增条目、参数或样张。
- 结果、限制与给下一包的输入见 [冷读结果](vault/distilled/design-kit-workorders-20261002/wo2-unfamiliar-briefs/README.md)与 [回执](docs/verification/design-kit-wo2-20261002.md)。

## 2026-10-02 · 表达规则的归属、强度与入口

- 入账 dot 的 [Write / Present 架构校订补充](vault/distilled/write-present-supplement-20261002/README.md)；它审的是远端旧基线，对照本地后按 [ADR-019](docs/decisions/019-expression-owners-and-entry-paths.md)落位，不新建 Present。
- 根 `AGENTS.md` 与 Kit 入口分成“做任务”与“维护仓库”两条路，写明读到哪里停。
- Write 的规则分底线、语言约定、编辑启发式三种强度；成文原理八条原文不改，新增强度表；新增 [格式检查](kit/write/prose/format.md)。
- 换媒介或改篇幅分投影、改编与新增，改编附变动说明；配一件 [对照样张](vault/distilled/write-present-supplement-20261002/projection-vs-adaptation/README.md)。
- 图形语义去掉第二份正文；运动判断补“补间不是观测”。
- 四条取用路线前后走读共十次：内容都守住，读取量只在一个任务上下降。见 [回执](docs/verification/write-present-supplement-20261002.md)。
- 用户下载的 Poster House PDF 里看了四张海报，H02 与 VL01 的来源状态更新。

## 2026-10-02 · 内容架构审阅：入口校订

- 入账一份没有署名的 [内容架构与能力语法审阅](vault/distilled/content-architecture-review-20261002/README.md)；它读的是远端旧基线，逐条对照本地后只执行第一批，裁决见 [ADR-020](docs/decisions/020-entry-calibration-and-depth-check.md)。目录不动。
- [Kit 任务入口](kit/README.md)写明改一句话、解释通用概念、规则确定的转换不必进分支，只守证据底线；改正一处把企业工作面九项标成“共同语法”的链接。
- [Reporting 入口](kit/reporting/README.md)把“写明要对方决定或去做什么”提到产物一行，做到就停。[工作系统](kit/work-system/README.md)的研究层改为按需；[企业工作面九项](kit/grammar/README.md)写明什么任务不必读。
- [文档结构契约](docs/architecture/documentation.md)加场景取值与工具能力两行，加写深条目的五问检查。
- 六个合成任务前后走读共十四次：三条企业工作路线改动前就走得通；小请求的读取量从 6、7 个文件降到 2、3 个；个人经营一题的提案改动后有了明确请求。见 [回执](docs/verification/content-architecture-review-20261002.md)。
- 九类能力语法候选、交付生命周期与后四批没有进 Kit，等真实素材；13 个外部来源没有打开。

## 2026-10-02 · 社区实践里的工作方式：备用素材

- 入账三份没有署名的文件：[社区 Skills 与 Prompts 的可迁移语法](vault/distilled/community-grammar-20261002/README.md)、版本与读取范围、给 Opus 的消费建议。十个样本不安装、不导入、不做成 skill；45 个外部链接里主会话按固定提交回读了 8 个，与研究包的说法一致。
- 新增 [工作开展方式 · 备用素材](kit/environment/working-methods.md)一页：部分成功后的对账、原因不明时的单一假设、对照留出与代价、分支终态、检查的覆盖范围，以及从外面拿一条做法之前的四层拆法。normal 参考，不是规则。
- [文档结构契约](docs/architecture/documentation.md)的验收加一条默认做法：说规则起了作用之前留对照和留出任务。
- [Kit 任务入口](kit/README.md)的企业工作表加一行，把恢复类任务指向工作契约和共同工作语法。
- 八次走读含三次不读仓库的对照：对照把“部分成功先对账”该做的全做到了，所以没有写成规则；读仓库的那次原先到不了已有的不变量，加路由后到了。裁决见 [ADR-021](docs/decisions/021-community-mechanisms-and-attribution-check.md)，结果见 [回执](docs/verification/community-grammar-20261002.md)。

## 2026-10-02 · 自足性审查：来源卡归属与当前状态校订

- 入账一份没有署名的 [自足性审查](vault/distilled/self-contained-review-20261002/README.md)，读的是 `main@ff96b9a`。十一条建议逐条对回本地，裁决见 [ADR-022](docs/decisions/022-source-card-ownership.md)，过程见 [回执](docs/verification/self-contained-review-20261002.md)。
- 每份 provenance catalog 加 `cards` 字段声明来源卡是生成的还是手写的。[生成脚本](scripts/render_source_cards.py)只写 `generated` 的 17 份，内容相同不写，不再写整层的 Provenance 索引。改之前照说明运行会覆盖 108 张手写卡和 24 页索引。
- [仓库校验](scripts/validate_repository.py)加两项：生成的卡和索引与 catalog 逐字相同；共用一张卡的几条来源在卡里都有 URL。第二项查出一处缺口并已补上。
- 工单提案的现状只留在主题页的裁决表，两个上层入口不再复述；[决定索引](docs/decisions/README.md)注明 ADR-014、015、016 被后来的决定替代或修订的部分；根 README 的设计任务直链参考路由。
- 没有做：按用途投影、用真实任务做带对照的消费验收、兼容入口的瘦身。没有改任何 Kit 规则。

## 2026-10-03 · Palantir 首次设计打样

- 入账用户交来的 [设计交接包](vault/snapshots/local/palantir-design-handoff-20261003/README.md)（七个文件），登记见 [入账记录](vault/intake/palantir-design-handoff-20261003.json)。
- 据此做了 [从诉求到决定](demos/palantir-discovery/README.md)：一页离线交互网页，读者加减五张合成材料，台账和四个分支的判读随之改写，选择只模拟；同一文件打印成 A4 带 S0/S1 对照表。
- 复查三篇公开来源：Lonsdale 第 5、6 条在交接里对应反了，作品已逐条改写；Portigal 页面遇到人机验证，主会话没有亲自读到。
- 没有做：受众测试、减少动效和读屏软件下的实际检查。方法仍是项目候选，`palantir/` 主题和 Kit 规则没有改。
- 用户读页面后指出文案别扭：页面文字没有经过 Write / Prose，Design 参考卡也没读。按 [审阅方法](kit/write/prose/review.md)改了 63 处，按两张优先参考卡加了“判读一览”，记录见作品 README。
- 入口修订见 [ADR-023](docs/decisions/023-consume-by-artifact-component.md)：[Kit 任务入口](kit/README.md)按产物的组成部分分到几支；[Design 入口](kit/design/README.md)写明页面文字仍按 Prose 写和审，并加一张先读哪张参考的表；[媒介验收](kit/write/shared/verification.md)加交付前的分工核对；[成文原理](kit/write/prose/grammar.md)的结构位置加上按钮、图例和状态提示；`writing` skill 在产物含中文文字时也加载。一次改前改后对照：改后的代理打开了审阅方法和四种 Design 参考，改前只看到名字。

## 2026-10-03 · 成文原理开头的写作姿态

- 用户贴来一份写作姿态建议，主张单立 preamble 文件；按用户要求由 Opus 裁决，目标是文质彬彬、辞达。没有新建文件，把八条原理里还没写明的部分写成 [成文原理](kit/write/prose/grammar.md)开头一段：文辞与内容相称，不凑结构，不抹平复杂与分歧。裁决记在 [审阅方法](kit/write/prose/review.md#审阅裁决记录)。
