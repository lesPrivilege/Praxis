# Writing · 成文、内容组织与语言

主张、论证、内容怎样组织、用什么文体、按哪门语言的约定写，以及谁的口吻。产物是论证连贯、证据身份不变的成文，或交给 Publish 编排的底稿。本层常驻：本页和 [底线](evidence.md#底线)每次任务都在，其余按任务展开。用户已给出的口吻和阅读偏好决定此次行文基调，具体个人用字不自动成为通用规则。

| 分支 | 管什么 | 什么时候读 |
|---|---|---|
| [证据与来源](evidence.md) | 四条底线，claim → source → output 的对应，投影与改编之分 | 常驻；开始引用、改写或转换材料时读全文 |
| [成文原理](principles.md) | 承重、主语、先答后说、证据强度、语体与结构位置、连贯、说完即止 | 写作或改写对外技术成文 |
| [内容组织](organization/README.md) | 读者与任务、论证与证据链、机制讲解 | 任务列出，或卡在“先讲什么、怎样排论据”时 |
| [文体](genres/README.md) | 文体选择、答卷、口播旁白、微文案 | 任务有专门文体时 |
| [语言约定](language/README.md) | 中文约定、格式检查、多语言关系 | 按输出语言；只规范空格、标点或链接时只读格式检查 |
| [审阅](review.md) | 审校与逐条裁决他人修改，常见偏差 | 审校、裁决，或交付前自查 |
| [作者语体](author-profile.md) | personal：仓库所有者本人的口吻 | 默认关闭；任务要求本人口吻，或项目 AGENTS.md 写有 `作者语体：开` |

把撰写交给别人或别的代理时，把适用的条文写进任务书。主笔读过规则，不等于撰写者读过。

## 规则有三种强度

| 强度 | 管什么 | 在哪里 | 什么时候适用 |
|---|---|---|---|
| 底线 | 事实不虚构不歪曲；指称与逻辑关系可靠；范围、条件和确定性准确；改写、摘要和重排不悄悄丢掉任务需要的信息与推理 | [证据与来源](evidence.md) | 任何语言、任何模式 |
| 语言约定 | 搭配、术语和目标语言的表达习惯 | [语言约定](language/README.md)；中文在 [中文语言约定](language/zh.md)，其他语言目前没有维护；标点与空格按 [格式检查](language/format.md)取项目约定 | 按输出语言取用；混排文本各区域用各自的约定 |
| 编辑启发式与文体 | 承重、主语、先答后说、语体、连贯、收尾，以及专门文体 | [成文原理](principles.md)、[文体](genres/README.md) | 对外中文技术成文的默认；按任务和读者调整，影响含义或交付约束的取舍需说明 |

要求相互冲突时，先守住任务的准确、完整、可访问和交付约束，再依次是本次明确的风格要求、语言约定、文体、作者或品牌偏好、通用启发式。两条强要求不能同时满足时写明裁决，不靠谁后加载来决定。

## 有具体疑问时深入

| 当前问题 | 可选参考 |
|---|---|
| 谁在什么情境下读，材料需要帮他完成什么 | [读者与任务](organization/audience.md) |
| 证据怎样支持建议，推理缺了哪一环 | [论证与证据链](organization/argument.md) |
| 向不读原件的人讲清一个系统的各个局部 | [机制讲解](organization/mechanism.md) |
| 按钮、空状态、校验与超时如何写 | [微文案与错误恢复](genres/microcopy.md) |
| 跨语言、地区或文字方向怎样保住含义，外文来源怎样提炼成中文 | [多语言与本地化边界](language/multilingual.md) |
| 操作指南、解释、参考页或决策材料如何选 | [文体选择](genres/selection.md) |

这些是普通优先级的可选参考；[写作书目](../../../vault/provenance/design-writing-encyclopedia/writing/README.md)保留来源各自的论述，不将品牌语气或英文规则通用化。

项目 skill `writing` 是本层的薄入口，原理只在这里维护。页面和图表编排转 [Publish](../publish/html/README.md)，视觉表现转 [Design](../../../kit/design/README.md)；分层见 [分层体例](../../layers.md)。

## 按需取用外部参考

外部指南提供具体问题的参考，权重低于本次任务与适用的 Kit 规则，不默认整份加载。先取足以支持判断的部分，需要细节才读来源卡和原文。

- 段落与列表：围绕一个主题组织段落，按顺序、集合或术语解释选择列表，同类结构保持对应。取用 [Google 段落结构](../../../vault/provenance/writing-structure-20260927/cards/google-paragraph-structure.md)和 [列表](../../../vault/provenance/writing-structure-20260927/cards/google-lists.md)；句数与英文标点不转成中文硬规则。
- 中文技术文档：需要检查指代或表达习惯时，查 [中文技术文档指南 · 文本](../../../vault/provenance/write-present-supplement-20261002/cards/p04-ruanyf-document-style-guide-text.md)。只取与任务相符的提示，不采纳其句长阈值或将作者取舍视为普适规范；这份补充来源未恢复早期 Chat 的指南引用身份。
- 空泛写法的自查：想对照一份“删掉也不改变后文”的句式清单时，查 [Writing Grammar 与 Kill AI Slop](../../../vault/distilled/reporting/writing-anti-slop.md)。它是 Vault 里的候选提炼，不是已采纳的规则，也不当禁词表用；句式重复的检查以 [审阅方法](review.md)为准。
- ASD-STE100：仅在任务要求该受控英文标准时再核对官方版本、全文与适用范围。已有核查记录显示官方访问受限，未提炼规则，也不宣称按该标准合规；访问范围见 [审阅回执](../../../docs/verification/writing-review-20261003.md#外部参考核查)。

### 更细的结构选择

需要决定标题、段落、列表或表格的语义结构时，查 [写作结构补充语义](../../../vault/distilled/writing-structure-20260927/README.md)，按其中的 heading、paragraph、list、table 选择启发式消费；需要逐 URL 回查时进入该页列出的 provenance 卡片。该目录是 supplemental-candidate，来源未恢复原 Chat 占位，也不是已采纳的 Kit 规则或 HTML 通过结论。

写作时只取与当前 artifact family 和语言/renderer 有关的结构判断，并把实际采用的结构和验收反馈记入项目 index；“需要标题/段落/列表时查该提炼”是发现入口，不等于固定句数、行数或中文机械规则。
