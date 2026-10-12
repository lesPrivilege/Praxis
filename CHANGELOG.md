# Changelog

## 2026-10-12 · 无配音知识片

- 新增 [Write 分支知识片](demos/write-kit-film/README.md)：只给题目（编译成知识讲解视频，不做配音），由主会话沿 Kit 入口取用 Write 各页，引用 Netflix 简体中文字幕规范的读速上限（成人每秒 9 字），沿用薪酬基线说明片的管线、去掉配音与混音，做成 245 秒的无声片。时间由人定，读速写成检查：任意 4 秒窗口新出现的字不超过 36 个。
- 画面文字由一位未参与撰写的 Opus 审阅者做结构审阅并对照 Kit 原文核对事实，主会话裁决：13 项采纳（含 1 项改写后采纳）、2 项保留；其中四条底线、三档强度与验收表的几处措辞回到原文，一处页面没有的说法（“无对照组”）去掉。
- Kit 只动一处入口：[Write / Motion](kit/write/motion/README.md)的制作记录加一行，写明无声片怎样定时。规则含义没有改，没有新增目录、ADR 或依赖；观察和复用说明留在项目说明里。
- 成片检查六项通过（流、保真、静止、空白、读速、字号）；制作方没有按实际速度完整看过，没有受众测试，审阅只有一位审阅者、一轮。验证：`python3 scripts/validate_repository.py`。

## 2026-10-10 · 视频能力测试与一次回流

- 新增 [薪酬基线说明片](demos/role-baseline-film/README.md)：只给题目，由主会话沿 Kit 入口取用规则、参考和金字塔片的管线，做成 97 秒说明片与一份 txt（另编 Word 与 PDF），材料合成。成片检查七项通过；制作方没有听过声音，独立冷读没有完成，没有受众测试。
- Kit 只动两处入口：[内容验收](kit/write/shared/verification.md)加一句，指向“感知不到的部分”和“自查通过之后”两条备用做法，这次从内容表达的入口读不到它们；[Write / Motion](kit/write/motion/README.md)的制作记录加一行，写明短片从哪个项目起步。规则含义没有改，没有新增目录、ADR 或依赖。
- 取用记录、观察和复用说明都留在项目说明里，没有写进各规则页。引擎与管线仍是从金字塔片拷来的一份，没有抽公共层。
- 主会话（Opus）完成；交给独立审阅者的一次冷读随会话中断，没有交回。验证：`python3 scripts/validate_repository.py` 通过。

## 2026-10-09 · 会话入账与 harness 边界

- 两份讨论摘录按现有 Vault 结构归档、提炼与登记；原会话历史未提供，外部官方来源作为补充来源，不冒充原引用恢复。
- 全局指引新增薄会话入账契约；Praxis 收窄维护前必读范围，将固定模型分工与会话授权改为能力偏好和当前授权判断。保留工作规则、来源边界和仓库验证，见 [ADR-030](docs/decisions/030-session-ingestion-and-harness-boundaries.md)。
- 具体改动、风险、验证及未决项见 [审计回执](docs/verification/harness-audit-20261009.md)。

## 2026-10-08 · 技术文档文案收敛

- 精简架构与治理文档中的重复提醒、抽象术语和保护性措辞；将动作、条件、去向和必要依赖写明。架构与 Motion 入口按用途链接正文，ADR-029 校正文句，规则含义保持不变。
- 按仓库中文成文规范审校，重访中文技术文档指南和 ASD 官方说明；来源取得范围、消费方式和缺口见 [复核记录](docs/verification/writing-review-20261003.md#2026-10-08-复核与文案清理)。
- 图文、网页、Slides 与视频入口同时连接 Write 和 Design；Design 参考表补外部作品与 Opus 制作研究，语法仍按分支维护。旧参考页收为兼容导航，保留既有锚点；修正 Write 的样张阶段描述。
- 仓库校验与 `git diff --check` 通过；首轮检查的 227 个本地链接与锚点可达，改后五条定向导航与三个兼容锚点检查通过。未制作新材料或复验外部作品。

## 2026-10-08 · 持续维护与互著别裁

- 按用户要求，在既有文档结构与修订流程中补充多入口单正文、按用途提炼、显式必要依赖，以及增量、合并、迁移、移交和清退的去向记录，见 [ADR-029](docs/decisions/029-content-discovery-and-retirement.md)。没有新增目录、索引系统或运行依赖，没有实际迁移或删除材料。
- 主代理编订，Luna 核对既有规则；三种维护情形的条文走读未发现职责冲突，未做真实生命周期操作或对照实验。来源与快照覆盖没有变化，既有未核实来源及未快照依赖仍按原记录保留。
- 验证：`python3 scripts/validate_repository.py` 通过（1,207 份 Markdown、478 份 JSON、866 个快照，0 错误）；本轮既有文件的 `git diff --check` 通过。

## 2026-10-08 · 发现入口与消费记录

- 保留现有目录；在 [Write / Motion](kit/write/motion/README.md)连接长片、机制演算、空间表达的施工与消费记录，[Design / Motion](kit/design/motion/README.md)补外部研究入口，[demos](demos/README.md)补 Motion ceiling 工场。各项目的技术与参数继续留在项目内。
- [Palantir reading list](palantir/references/README.md)逐项链接已有候选笔记；上层入口区分候选提炼与已采纳正文，历史任务书标明已经执行，主题入口补已有消费项目。补金字塔过程重建的 intake 导航。
- 本轮由主代理编订、两位 Luna 只读追溯；只核对仓库内记录，没有重新访问外部来源、补快照、运行渲染或制作视频。金字塔主日志与研究网页未快照，A3 部分运行依赖未快照，Motion ceiling 多数外部来源仍未读；四本阅读材料全文仍缺。未新增专用交接文档或重复的制作流程。
- 验证：`python3 scripts/validate_repository.py` 通过；Luna 定向走读 Dalio 已读边界、Impro 缺正文、机制类视频选型与金字塔过程追溯四条路径，无断链。属于维护走读，未做新主笔制作或对照实验。

## 2026-10-06 · Palantir 阅读清单拿到原本

- 逐条实访阅读清单的 8 个 URL，取得 9 个文件、3,998,632 字节：[原件快照](vault/snapshots/local/palantir-20261006/README.md)。此前 8 个 URL 全部 `unverified`、7 个对象都没有本地原件。
- 三份是全文：Qureshi、Lonsdale，以及 Dalio 的 2011 版权 106 页 PDF。四本书只有片段：Portigal 的第 2 版第 1 章、Wright 的出版方授权节选、Allen 的官方节选，Johnstone 只有出版方描述与目录。
- 原站直连两个被拒：Qureshi 返回 429，Rosenfeld 与 Bloomsbury 返回 403，都没有绕过；这三份经 Internet Archive 存档取得。Dalio 的登记 URL 已失效为官网首页，PDF 是经 2016 年存档取回的。
- 阅读清单与[主题入口](palantir/README.md)改写为按实际证据边界登记；`unverified` 归零，改为 3 个 `verified`、5 个 `partial`。GTD 的节选据版权页为 2001 年版，与登记 URL 所指 2015 版不同，已写明。
- 另取得 Portigal 自行免费发布的 6 份实践 PDF（363,054 字节：筛选问卷、访谈提纲、现场参与说明、两份复盘表、顶部摘要），取自作者自己站点的媒体库，不是第三方转载。共 15 个文件、4,365,133 字节。
- Internet Archive 有 Impro、The Looming Tower、Getting Things Done 三份扫描件，但都是受控借阅（`access-restricted-item`，抓取全文返回 401），需用使用者自己的账号借阅；本轮没有登录、没有替借、没有绕过闸门。
- 影子图书馆（zlib、Anna’s Archive、libgen 等）未接触：所涉四本为版权期内商业书，是来源不授权，个人学习用途不构成豁免。补齐只走购买、借阅或使用者提供合法副本。
- [回执](docs/verification/palantir-source-acquisition-20261006.md)记录逐件核对、取得依据、放弃的路径与未做项。没有提炼，没有 Kit 采纳。
- 随后按先写好的八份任务书完成初次提炼，在 dsh 里由主会话串行执行（claude 未登录、无 codex CLI，派不出 subagent，故不是 Luna 集群）。七份笔记见 [Palantir 初次提炼](vault/distilled/palantir-reading-20261006/README.md)。
- **最主要的发现：这七份材料不是散书。** Qureshi 原文说明 Impro、The Looming Tower、Interviewing Users、Getting Things Done 加 Dalio 早期 PDF，是 Palantir 当年发给新人的入职书单；Lonsdale 那篇曾是对内文件。清单的关联来自这份书单本身。
- 核对确认两条旧记录：Lonsdale 第 5、6 条（第 5 条用细小迹象看整体，第 6 条当场想清楚）；Portigal 高层计划只有三项、参与者提问另列。
- **更正两处数字**：Looming Tower 的节选是 2,470 词，不是回执记的 3,448 词（旧值把出版方奖项与评价文案算进去了）；Dalio 106 页在手但 Part 3 的 210 条基本未读。
- 三处如实记下「不足以支撑」：Impro 的三个关注维度与目录标题重合，目前是循环论证；Looming Tower 的四个维度在节选中一个都支撑不了；GTD 的四类边界在节选中未出现。

## 2026-10-05 · 知识片的做法留作可取用的参考

- 把 ADR-027、ADR-028 新增的两种独立审阅写明是可以取用的做法，不是每件任务的必经步骤；口播旁白页的随稿材料改成按任务取用。条文的含义没有变，强度写清了。
- [工作开展方式 · 备用素材](kit/environment/working-methods.md)加三条：把研究交出去、自查通过之后、感知不到的部分。它们是备用素材，不默认加载。
- [Motion 入口](kit/write/motion/README.md)、[演示实现](demos/README.md)和 [Distilled](vault/distilled/README.md)各加一处指向 Knowledge Film 001 的样例和过程重建。
- Knowledge Film 001 第五版收尾：片尾塔补上第五片叶子，成片检查六项通过（旁白转写比对第一次跑）。记录在 [回执](docs/verification/narration-distill-20261005.md)的“收尾时的调整”一节。

## 2026-10-05 · 口播旁白与独立冷读

- Write / Prose 新增文体页 [口播旁白](kit/write/prose/genres/narration.md)：为耳朵写的指代、主干、读音和叫法，口播里要数的六种句式，旁白与画面文字的对应，随稿交付的句式统计和读音清单。见 [ADR-028](docs/decisions/028-narration-genre-and-cold-read.md)。
- [审阅方法](kit/write/prose/review.md)新增“成文的独立冷读”，结构文字的独立审阅补三项产出，常见偏差表加七行结构文字的例子；[成文原理](kit/write/prose/grammar.md)第 5 条加一句“同一句话在几处出现时逐字一致”。
- Prose 入口加两处：把撰写交给别人时把条文写进任务书；空泛写法的自查指向 Vault 里已有的候选提炼。
- 属于兼容扩展。[回执](docs/verification/narration-distill-20261005.md)记录这次提炼对照的过程、进入与没有进入的内容、一次入口走读。使用证据只有一条片子和同一名主笔。

## 2026-10-05 · 成文审阅的目标与结构位置

- Write / Prose 按用户裁决恢复两项，见 [ADR-027](docs/decisions/027-prose-review-goal-and-structural-text.md)：[审阅方法](kit/write/prose/review.md)以让成文更接近人类作者写出的中文为目标；[成文原理](kit/write/prose/grammar.md)第 5 条的结构位置回到凝练、并列的短语，画面上的短文字计入结构位置，第 6 条恢复“模型惯用的搭配”。
- 审阅新增两步：通篇检查句式是否重复；结构文字多的材料由没有参与撰写的审阅者单独审。
- Write / Motion 的 [叙事与分镜交接](kit/write/motion/narrative.md)新增“旁白与屏幕文字的审阅”一节，把旁白接到成文审阅、屏幕上的结构文字接到独立审阅，并要求写进撰写者的任务书。属于兼容扩展。
- 属于规则含义的变化，修订 ADR-024 的两处。新任务适用；ADR-024 生效期间按旧条文审过的材料没有重审。[回执](docs/verification/prose-review-restoration-20261005.md)记录召回、核对、改动和未做的事。

## 2026-10-04 · 排列与刻度

- Design / Foundations 新增 [排列与刻度](kit/design/foundations/placement.md)：把几项内容沿一条线排开时，位置回答了哪几个问题要写成一句读法放进图里；没有量就不按比例画；并排的线要么共用一条标尺，要么写明各排各的。见 [ADR-026](docs/decisions/026-placement-and-scale.md)。属于兼容扩展：新增一页和几处入口链接；[图形编码](kit/design/composition/encoding.md)、[成立程度与归属的标记](kit/design/foundations/standing.md)、[精确指向](kit/design/foundations/anchoring.md)各补了半句，原有规则的含义没有变。
- 可编辑原生 SVG 的图件升到 0.3.0：新增 `rel-rail` 和 `rel-pair` 两件，版本图在图脚补上位置的读法；样板页加第三节。它们是 demo 里的候选实现，不是 Kit 的共享组件。
- [回执](docs/verification/placement-grammar-20261004.md)记录检查、独立复查、两次冷读与对照、未做的事。使用证据只有合成内容和同一名制作者。

## 2026-10-04 · 关系图的成立程度与精确指向

- Design / Foundations 新增 [成立程度与归属的标记](kit/design/foundations/standing.md)和 [精确指向](kit/design/foundations/anchoring.md)，各给不随画法改变的约束、关系图的默认和“只用文字、一张图、几张图连起来”的三级做法，见 [ADR-025](docs/decisions/025-relation-marks-and-anchors.md)。属于兼容扩展：新增两页和几处入口链接，既有规则的含义没有变。
- 可编辑原生 SVG 的四个关系图件升到 0.2.0，状态词和指向改用共同的一套，新增组合件；另有一页样板。它们是 demo 里的候选实现，不是 Kit 的共享组件。
- [回执](docs/verification/relation-grammar-20261004.md)记录检查、两次冷读与对照、未做的事。使用证据只有合成内容和同一名制作者。

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

## 2026-10-04 · 企业工作面语法实验第一轮

- 按用户贴入的两段任务来文，用 Kit 的企业工作语法和一份场景契约施工了 [事项工作台](demos/enterprise-grammar-lab/README.md)：React 与 Ant Design 前端、OpenAPI 契约、模拟冲突与结果未知等行为的假后端，数据全部合成。来文没有入账 Vault；技术栈只在该目录内选定，没有写实现 ADR。
- [施工发现](demos/enterprise-grammar-lab/evals/README.md)记录了逐项判据、Kit 起作用和没有内容的地方，以及独立复查找出的缺陷和处置。只做了受 Kit 约束的一组，没有对照组，没有换领域。
- 用户随后给了一份研究 brief 作参考（未入账）。按它的反例表对照后补了 fixture 自洽检查、风险的下一步归属和离开前的拦截；它建议的付款复核场景留作第二个独立场景的候选。
- Kit、docs 和 Vault 没有改动；`.gitignore` 增加 `node_modules/`，`.claude/launch.json` 增加两条本地启动配置。

## 2026-10-04 · 企业工作面语法实验第二轮

- 用户决定做研究 brief 建议的场景。在同一目录加了第二个工作台 [付款复核台](demos/enterprise-grammar-lab/scenarios/payment-review.md)：规则检查、预制的机器提议和人的判断分开呈现，金额是带币种的精确值，依据按“材料、版本、位置”打开。
- 为了让两个场景共用，把契约的公共部分、后端内核和工作面与场景解开。[第二轮施工发现](demos/enterprise-grammar-lab/evals/round-2.md)记录了改了多少、公共层里原先藏着哪些第一个场景的形状，以及两个场景各写了一遍、暂不抽取的部分。
- Kit、docs 和 Vault 没有改动。工作面按 ADR-002 是两个独立场景在用的候选，没有申请晋升。

## 2026-10-04 · 企业工作面语法实验收尾

- 按用户转来的三条收尾建议处置第二轮末留下的问题：不做无 Kit 对照组，结论限定为两轮怎样消费了 Kit；技术栈记在只对该 demo 有效的 [实现 ADR](demos/enterprise-grammar-lab/stack-adr.md)，不进 `docs/decisions`；教训先留成四条带反例的 [候选条目](demos/enterprise-grammar-lab/evals/candidates.md)，没有提交裁决。
- 用户给的交接稿（未入账）推荐的场景已经做完，只拿它的 12 条不变量对照了现状：五条有，七条部分有，没有因此改代码。
- Kit、docs 和 Vault 没有改动。

## 2026-10-04 · 企业工作面语法实验：合并后的独立复验

- 用户另找的执行者在 `9514ce4` 上做了独立复验（交接稿未入账），只到代码和后端。它报告的两处 fixture 检查漏检属实并已修：状态与记录是否一致改为把记录按动作允许的步骤走一遍；付款复核台的记录不能指向不存在的机器提议。测试 43 项变 45 项。
- 它报告的另外两处是已记录的未修项（材料版本不带动事项版本；切换身份和整页离开绕过离开前的拦截），没有改；后一处补了浏览器实测。记录见 [合并后的独立复验](demos/enterprise-grammar-lab/evals/reverification.md)。
- 用户随后决定给关标签页和刷新加离开确认：有未提交的填写或结果未知时页面请求浏览器确认。页面侧的行为已验证；确认框本身在内置浏览器面板里不显示，没有在普通浏览器里看过。
