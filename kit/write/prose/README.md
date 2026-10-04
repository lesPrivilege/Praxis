# Prose · 成文与审校

用于以自然语言为主的答卷、报告、备忘录与说明。产物是论证连贯、证据身份不变的成文。用户已给出的口吻和阅读偏好决定此次行文基调，具体个人用字不自动成为通用规则。

1. 开始写作或改写中文，读 [成文原理](grammar.md)；[底线与证据](../shared/evidence.md)一并读。
2. 需要审校或裁决他人修改，读 [审阅方法与偏差](review.md)。
3. 任务有专门文体要求，进入 [Genres](genres/README.md)：目前有答卷和口播旁白两种；不用将答卷体例套到所有材料。
4. 只规范空格、标点或链接，不动措辞：读 [格式检查](format.md)，不读成文原理。
5. 把撰写交给别人或别的代理时，把适用的条文写进任务书。主笔读过规则，不等于撰写者读过。

## 按输出语言取用

成文原理是为中文写的。改写英文或其他语言的文本时，适用的是 [底线](../shared/evidence.md#底线)和 [审阅方法](review.md)里的不可损失项；中文的语体与搭配约定不套到别的语言上，那门语言的写法按任务指定的风格指南或需求方的要求来。本仓库目前没有维护英文约定。中英混排的文本各区域用各自的约定，代码、命令、标识符、路径、URL 和引文原样保留。

项目 skill `writing` 是此分支的薄入口。直接挂载 Kit 也可按本页执行，原理只在 Kit 维护。页面和图表编排转 [Publish](../publish/README.md)，视觉表现转 [Design](../../design/README.md)。

## 按需取用外部参考

外部指南提供具体问题的参考，权重低于本次任务与适用的 Kit 规则，不默认整份加载。先取足以支持判断的部分，需要细节才读来源卡和原文。

- 段落与列表：围绕一个主题组织段落，按顺序、集合或术语解释选择列表，同类结构保持对应。取用 [Google 段落结构](../../../vault/provenance/writing-structure-20260927/cards/google-paragraph-structure.md)和 [列表](../../../vault/provenance/writing-structure-20260927/cards/google-lists.md)；句数与英文标点不转成中文硬规则。
- 中文技术文档：需要检查指代或表达习惯时，查 [中文技术文档指南 · 文本](../../../vault/provenance/write-present-supplement-20261002/cards/p04-ruanyf-document-style-guide-text.md)。只取与任务相符的提示，不采纳其句长阈值或将作者取舍视为普适规范；这份补充来源未恢复早期 Chat 的指南引用身份。
- 空泛写法的自查：想对照一份“删掉也不改变后文”的句式清单时，查 [Writing Grammar 与 Kill AI Slop](../../../vault/distilled/reporting/writing-anti-slop.md)。它是 Vault 里的候选提炼，不是已采纳的规则，也不当禁词表用；句式重复的检查以 [审阅方法](review.md)为准。
- ASD-STE100：仅在任务要求该受控英文标准时再核对官方版本、全文与适用范围。本轮官方访问受限，未提炼规则，也不宣称按该标准合规；访问范围见 [审阅回执](../../../docs/verification/writing-review-20261003.md#外部参考核查)。

### 更细的结构选择

需要决定标题、段落、列表或表格的语义结构时，查 [写作结构补充语义 · 2026-09-27](../../../vault/distilled/writing-structure-20260927/README.md)，按其中的 heading、paragraph、list、table 选择启发式消费；需要逐 URL 回查时进入该页列出的 provenance 卡片。该目录是 supplemental-candidate，来源未恢复原 Chat 占位，也不是已采纳的 Kit 规则或 HTML 通过结论。

写作时只取与当前 artifact family 和语言/renderer 有关的结构判断，并把实际采用的结构和验收反馈记入项目 index；“需要标题/段落/列表时查该提炼”是发现入口，不等于固定句数、行数或中文机械规则。
