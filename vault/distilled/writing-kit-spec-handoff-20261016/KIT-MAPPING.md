# 现状与增量映射

现行 Kit 已具备大部分要求。本包应帮助找出缺口和不一致，而不是另建一套并行规范。固定版本与实际读取范围见 [快照记录](SNAPSHOT.md)，公开定位见 [来源索引](SOURCE-INDEX.md)。

## 已有能力与待裁决增量

| 要求 | 现行位置与覆盖 | 建议处置 |
|---|---|---|
| 跨语言、跨媒介保住事实、条件、逻辑与证据强度 | `kit/write/shared/evidence.md` 的四条底线；`kit/write/prose/grammar.md` 第 4 条；`kit/write/prose/review.md` 不可损失项 | 已采纳，保留。不另写第二份通用底线。可用含义改变但字面量未丢的例子补审阅 |
| 完整度按读者理解与任务完成判断，不按短句或少字衡量 | `kit/write/prose/grammar.md` 开篇、第 1、7 条及强度表；`kit/write/prose/audience.md`；`kit/write/prose/genres/selection.md` | 已有。个人学习所需的“问题类别、方向、机制与取舍”在读者页或讲解页中澄清，不能把全部文体改成教材 |
| 先建立准确整体图景，再小步展开局部 | `kit/write/publish/explainer.md` 已有机制颗粒度、四问和四层；`kit/write/publish/composition.md` 已有依赖关系与阅读顺序 | 部分覆盖。补强总览怎样由问题、对象与约束建立，以及树形主干与跨分支关系如何连接。沿用可选讲解参考，不把四层升级为全局模板 |
| 根据知识状态确定深度，不把读者固定为 PM 或工程师 | `kit/write/publish/explainer.md` 已明确；ADR-031 已裁决 | 已采纳。个人学习与借助模型编程是本次使用情境，不能重新缩成职位画像 |
| 不强制金字塔、故事线、三点式、练习先行 | `kit/write/prose/grammar.md`、`kit/write/prose/review.md`、`kit/write/prose/genres/selection.md` 已按实际关系取形；ADR-034 排除了练习先行的通用化 | 保留这些决定。另处理共享验收页的固定故事线次序，见下节 |
| 限定说一次，独立页面保留必要重复 | `kit/write/prose/grammar.md` 第 8 条及强度表；`kit/write/prose/review.md`；ADR-034 | 已采纳。不能把重复减少等同于限定减少，也不需要新增禁词或次数阈值 |
| 正文与过程记录分开，正文仍保留解释性历史与争论 | `kit/write/shared/evidence.md`、`kit/write/publish/exhibits.md`、`docs/architecture/documentation.md`；ADR-034 | 过程分离已采纳。可澄清“对象自身的历史、设计缘由和实质分歧”与“这次编订的工作日志”的区别，防止误删 |
| 自然、连贯的中文；结构位置单独写 | `kit/write/prose/grammar.md` 第 5—7 条；`kit/write/prose/review.md`；ADR-027 | 已采纳。继续按真实偏差修例，不重写成“去模型味”提示词或个人偏好词表 |
| 标题、图注、表头、图例、界面、错误、旁白分别处理 | grammar/review；`kit/write/publish/exhibits.md`；`kit/write/prose/microcopy.md`；`kit/write/motion/narrative.md` | 职责已有。若发现性不足，在 `kit/write/prose/README.md` 或相应入口补一处按位置路由；不复制全部角色说明 |
| 术语优先稳定既有说法，无稳定中文时用原词 | `kit/write/prose/grammar.md` 第 6 条；review 偏差表；ADR-031 | 已采纳。不新造统一译名清单，不因当前 AI 领域用英语多而推成“所有术语都优先英语” |
| 缩写首用展开；原语言来源与中文提炼保持身份 | grammar 已要求英文原词首用解释；`kit/write/prose/multilingual.md` 管语言边界；`kit/write/prose/README.md` 保护代码、路径与引文 | 部分覆盖。专业缩写的全称与含义不是同一件事；建议在 multilingual 或 grammar 第 6 条附近小幅澄清，再由现有入口指向。来源保存职责仍在 `docs/governance/intake.md`，无需复制到 prose |
| 个人语体作为可选作者资料，不成为通用 grammar | grammar 的“个人语体”；Prose 入口；Write 冲突次序；ADR-019 曾拒绝新建通用 Profiles 配置层 | 边界已有。单独作者资料可供指定任务取用，不改变现有优先级，也不由这一份资料建立新的全局配置层 |
| 审阅语义、结构、逻辑、连贯和结构文字；脚本不证明语义 | review 第 1、2、4、6、7 步及验收；ADR-034 | 已采纳。补充反例或局部澄清即可；不能把机器 diff 升级为必过语义门禁 |
| 入口薄、渐进发现，真实使用反馈后再晋升 | `.claude/skills/writing/SKILL.md`；`kit/write/README.md`；`docs/governance/reference-lifecycle.md`；`docs/architecture/documentation.md`；ADR-016、019 | 已采纳。修正实际路由断点，不堆长提示词、不新建空目录、不要求每次任务填写全套日志 |

## 一处需要明确裁决的不一致

`kit/write/shared/verification.md` 的“Review 顺序”以“标题与故事线”开始，把受众与 ask 放在靠后位置，末尾才处理文字。其他现行页面已按任务与对象关系组织，允许非叙事、非决策材料，并要求依据读者需要确定范围。

建议将这一固定箭头顺序改为适用的检查面：读者任务与范围；主张、证据与推理；整体结构及局部连贯；结构文字；实际媒介中的可见性、可访问性与内容完整。按风险和产物选择切入点，不规定每次依次完成，也不要求每份材料都有故事线或行动请求。该页已有的最终导出、交互状态和实际速度观看要求应保留。

这不是增加新工作流，而是让共享验收与现行规则一致。是否仅改该行，还是顺便调整两处说明，由 Opus 根据实际上下文决定。

## 建议落位

**核心正文继续留在原位置。** 成文和审阅不变成研究综述。候选说明优先补入 `kit/write/publish/explainer.md`、`kit/write/prose/multilingual.md` 和相关既有段落；只有内容确实独立、现有页面放不下其判断职责时，才讨论新页。

**薄入口只补路由。** `kit/write/README.md` 保持 Prose / Publish / Motion / Shared 分工；`.claude/skills/writing/SKILL.md` 仍只导入必要规则。发现性问题先修 description、链接或归属，不以资料增多为理由另建总提示词。

**个人作者资料单独审。** [作者资料候选](AUTHOR-PROFILE.md)随包提供，默认不启用。本包不指定其长期存放路径，也不预建 `kit/write/profiles/`。若采用，由 Opus 在现有项目或参考位置选择单点维护处；通用入口最多保留按需取用说明。资料里的置信度表示个人表达归纳的把握，不是通用规则的效果证明。

## 本包怎样进入现有索引

建议目录：`vault/distilled/writing-kit-spec-handoff-20261016/`。包内 README 负责选路，来源与快照分别维护；现行 Kit 不因交接包存在而改变状态。

在 `vault/distilled/README.md` 的“按工作问题进入”中，紧接 Write/Design 候选入口增加一行：

| 工作问题 | 先读 | 内容边界 |
|---|---|---|
| 需要审阅 Writing Kit 的学习型讲解与成文修订 | [Writing Kit 修订交接](README.md) | 现行规则与候选增量的映射、规格及试用要求；待 Opus 裁决，不替代现行 Kit |

落入上层索引时，链接使用 `writing-kit-spec-handoff-20261016/README.md`。这一条即可从既有 Vault 路线发现本包，不必同时改根 README、Kit 主入口和多个并列索引。

后续真正改变 grammar 或 review 时，补一份短 ADR，记录具体决定、与既有决定的关系、实际证据及重访条件；同步根 CHANGELOG、ADR 索引和受影响的任务入口。只登记本包时，不新增“已采纳”ADR，也不把文档交付写成规则效果已验证。
