# Writing skill 与成文规则差异审阅 · 2026-10-03

基线：`b76ece44264a4dd3efe767d3b4e8b829c8e7a778`。本轮使用独立分支 `codex/writing-review-20261003`；main 有其他未提交工作，本轮未带入或改动。没有 merge、push、部署或全局 skill 安装。

## 证据与实际入口

R1 是本轮委托提供的可复用要求及召回摘要，不是原 Chat 的消息身份。摘要标明角色与时间，但没有取得逐条原文或原消息 ID；本回执不伪造引文、来源映射或原文覆盖数量，不保存私有原 Chat。当前委托授权最小修订，具体架构建议仍须对照正式裁决。

真实路径为 [Write](../../kit/write/README.md)下的 Prose、Publish、Motion、Shared；[旧 Writing](../../kit/writing/README.md)只有导航。writing skill 位于 [项目薄入口](../../.claude/skills/writing/SKILL.md)，仓库没有 `.agents/skills`。上下游从 [Kit](../../kit/README.md)、[Reporting](../../kit/reporting/README.md)及 [Agent 指引](../../kit/Agent.md)到达；成文经 grammar/review、Shared 和相应文体交付。没有预设新目录。

主代理读治理、关键成文页并编订；Luna 只读 Write 全部页面、上下游入口、相关 ADR 和 Vault 摘要，不读原 Chat，不修改文件。规范裁决见 [ADR-023](../decisions/023-prose-defaults-and-review-scope.md)。

## 对照表

| Chat 裁决或建议（R1 转述） | 现有文件 / 正式裁决 | 差异 | 保留或修订理由 |
|---|---|---|---|
| Agent 自然发现、按任务渐进消费，默认薄 | skill、Prose README、ADR-016/019/020 | skill 与 Kit 对简单改句的触发边界不齐；skill 重复专门文体入口 | 保留薄入口，明确成段中文文本与简单请求的边界，专门文体回到 Prose 路由；未安装或宣称已验证宿主发现 |
| 信息增量也包含导航、记忆、无障碍、情境与安全 | grammar 第 1/8 条与例外表、Shared verification | 默认正文仍排除阅读指引；review 验收没有应用例外 | 直接按任务作用判断，保留有用导航与重复，避免例外被绝对措辞覆盖 |
| 不固定短句、标题判断或叙事顺序 | grammar 第 3/5/7 条，review 次序 | 一问一句与名词短语要求可能取代论证；技术报告语体被归为语言约定 | 改为实际问题覆盖、条件可见、结构对应与连贯；语体归任务默认，保留必要复杂度 |
| 四条语义底线可审；Core 清单与目录只是建议 | Shared evidence、ADR-019 | 底线已经存在；不需再复制或建 Core | 保留唯一正文与应用性提醒，没有增加底线清单 |
| 个人偏好可以先形成行文基调，非普适真理 | grammar 个人语体、Prose README | 现行只在要求本人口吻时启用，不能直接表达一般阅读或口吻偏好 | 已给出的口吻用于当前任务，个人用字不默认复刻；摘要中的具体基调清单是助手建议，未采纳 |
| 外部规范低权重，只取足以对齐输出的最小部分 | 写作结构来源、P04 来源卡、Prose README | 原入口只连一整批结构研究；没有 STE 实际规则或来源卡 | 用途与取用边界直接可见，按需继续；中文指南只补指代判断，STE 留访问缺口，不声称合规 |
| 不用禁词表或统一收尾 | review、答卷 genre | “更像人写的”没有判准；答卷按第一人称句式删除，命名表述过绝对 | 用准确、信息作用、术语、范围和连贯裁决；允许承担职责或承诺的第一人称，允许有定义的必要新名称 |
| Write 较新收缩为纯文本 | ADR-016/019、Write/Kit/Agent/架构及旧导航 | 与已接受的 Publish/Motion/Shared 落位冲突 | 列为职责迁移待裁决；本轮只修成文，不将摘要直接解释为新目录授权 |
| authorial baseline→description→language→references、Present、Profiles/lint 拆分为助手建议 | ADR-019 已拒绝或延后相关新层 | 不是已采纳架构 | 不落地整套；利用现有 README、grammar、review、genre、format 承担已存在的职责 |

## 分类、重复与入口检查

| 审阅分类 | 判断与处理 |
|---|---|
| semantic invariant | Shared 四条底线是唯一正文；grammar 证据强度、review 不可损失项是执行提示，保留 |
| language convention | 中文搭配与术语按读者取用；不扩张到其他语言、代码、引文或标识符 |
| task convention | 技术报告语体、答卷体例、brief 条件和交付形式按任务收窄；不推广为所有材料模板 |
| personal preference | 已给出的口吻可用；具体文言字词、音律与助手提出的基调清单不晋升为默认 |
| 机械可查 | format 的保护范围与可改 / 只报不改 / 判断边界保留；没有新增 lint 或用正则判断语义 |
| 过时冗余 | ADR-014/015 的历史被替代部分已有索引说明；旧 Writing 是导航。Publish 原只链 ADR-015，补当前落位链接；grammar 的“迁入后含义不变”已失准，删去 |

另发现 Reporting README 允许信息齐全时跳过 brief，但 grammar 要先填六项；本轮只对齐这个前提。没有迁移其他职责，也没有重写历史 ADR。原有 Shared 强度、术语、数字与必要条件保持；语义适用性靠人工审阅，不由仓库链接验证证明。

## 现有写作片段的边界检查

以下取自仓库现有正文。除 Reporting 前提外，这些源段未改；“退回候选”是本回执用来检查规则边界的反例，不是仓库曾采用的文本。

| 来源片段 | 审阅后 / 退回候选 | 检查结果 |
|---|---|---|
| [Kit 入口](../../kit/README.md)：读到输入、约束和完成标准都清楚、要求之间没有冲突，就可以开工 | 保留原句；退回“读到输入清楚就开工” | 完成条件与冲突限定承重。导航不增加事实，仍帮助行动；不因“阅读指引”标签删除 |
| [Reporting grammar](../../kit/reporting/grammar.md)：先填写 brief 的六项最小契约，再选文体 | 改为信息尚不清楚时补 brief，已清楚时直接取用；后续 evidence-led 等区别和证据身份保留 | 只修矛盾前提，保留术语、材料混合方式和 Demo 的证据边界，不以短句减少必要复杂度 |
| [工作方式](../../kit/environment/working-methods.md)：压力情形下的遵循从十次里八次降到五次，普通情形不变；这是维护者报告的小样本，本仓库没有复跑 | 保留；退回“删短规则会降低遵循率” | 后者把转述小样本泛化成规律，丢了样本、情形和未复跑范围；短了却破坏准确性 |
| [分镜交接](../../kit/write/motion/narrative.md)：只有声音承担的信息需要可达的文字替代；只是装饰的声音不承担事实证明 | 保留；退回“声音都要配字幕” | 条件与两类声音的区别不能丢；分号连接对照关系，不能靠统一短句或同义词替换改掉 |

这些是规则适用与不适用的人工检查，不是模型效果对照实验。没有真实读者、独立留出任务或自动发现数据，不声称减少用时或提升理解。

## 外部参考核查

2026-10-03 独立读取下列作者 / 官方来源。仅短摘要，不保存全文与 renderer 依赖；既有引用占位不改为已恢复。

| 来源身份与链接 | 实际范围与本轮取用 |
|---|---|
| `google-paragraph-structure`：[Google Paragraph structure](https://developers.google.com/style/paragraph-structure) | 读取段落主题与结构部分；页面允许围绕一个主题的较长段。本轮提示主题与连贯，不采纳句数上限，沿用已有来源卡身份 |
| `google-lists`：[Google Lists](https://developers.google.com/style/lists) | 读取列表类型、引导语与平行结构；顺序 / 集合 / 术语说明帮助选路。标点与 HTML 实现留在来源范围，沿用已有来源卡身份 |
| `p04-ruanyf-document-style-guide-text`：[作者仓库](https://github.com/ruanyf/document-style-guide/blob/master/docs/text.md)，经 [原文端点](https://raw.githubusercontent.com/ruanyf/document-style-guide/master/docs/text.md)读取 | 读文本章的指代、句长、风格与空格部分；只取指代明确的提醒。个人维护指南，句长上限不采纳；不冒充早期 Chat 那份未恢复的指南 |
| `asd-ste100-home`：[官方首页](https://www.asd-ste100.org/) | 返回 403；没有读取正文。只能作为待重访入口，不证明版本或规则 |
| `asd-ste100-issue9-route`：[官方 PDF 路由](https://www.asd-ste100.org/assets/files/ASD-STE100_ISSUE9.pdf) | 返回 403；URL 中的 issue 标识不作为现行版本核验，未读全文、未提炼规则 |
| `asd-ste100-about-route`：[官方介绍路由](https://asd-ste100.org/about.html) | 返回 403；没有用第三方摘要补成已核实规则 |

已有三项参考的本轮核查范围留在本表，不覆盖历史来源状态。新增的三个官方访问缺口按逐 URL 身份登记在 [来源记录](../../vault/provenance/writing-review-20261003/catalog.json)，本回执复用为手写来源卡；[统一来源投影](../../vault/registry.json)由既有脚本生成。

## 职责迁移仍需的裁决

需要明确 Publish、Motion 的长期所有者与复用入口，Shared 四条底线的维护位置，以及 Kit、Reporting、Agent、架构、旧导航和既有消费者的迁移映射。名称“Present”及 Core/Language/Profiles 的整套目录不能从助手提案推出。此处只列出影响范围，既有入口仍保持有效；不能把本轮说成 Write 纯文本重构完成。

## 验证与未验项

基线 `python3 scripts/validate_repository.py` 通过：957 Markdown、170 JSON、843 快照，错误为零。改后同一校验通过：960 Markdown、171 JSON、843 快照、573 来源记录，错误为零。`build_registry.py` 重建新增三个访问缺口，原消息覆盖、引用映射和快照数不变。

`skill-creator/scripts/quick_validate.py` 检查现有 writing skill 通过；另查其中四条本地引用路径可达，`git diff --check` 通过。来源生成函数的结果与当前 registry JSON 一致，可从 catalog 重建。本轮新文件与增量文本另作披露筛查，没有新增私有身份、Chat 定位或本机路径；此筛查不声称覆盖历史材料。

仓库验证不遍历 `.claude`，因此 skill 的 frontmatter、引用路径及其任务边界另查。没有安装、Claude 执行或宿主自动发现测试；没有真实读者理解测试、标准合规测试或 STE 全文核验。没有取得原始 Chat 的逐条身份、没有新快照或离线网页依赖。原始个人材料与身份未进入本轮新增文件；历史公开面未清理。
