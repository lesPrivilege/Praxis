# Praxis 覆盖与增量

本页只比较实际读取的入口与材料，不对整个 Vault 作穷尽覆盖声明。Kit 起点与 SaaS 只读提交见 [研究记录](CHANGELOG.md)。SaaS 的文件均以该分支固定提交为准；它们不在本研究分支的主线基底上，因此用固定 GitHub 链接定位。

## 已有覆盖

| 需要 | 已有位置 | 现状与研究增量 |
|---|---|---|
| 中文成文、原词、结构文字 | [Prose 原理](../../../kit/write/prose/grammar.md)、[审阅](../../../kit/write/prose/review.md) | 已要求证据强度不变、术语稳定、标题/标签单独撰写。无需再造“技术风格指南” |
| 原语言与翻译 | [多语言](../../../kit/write/prose/multilingual.md) | 已有源语言、locale、事实/单位保护和术语表；本书补实际首用位置和独立阅读面检查 |
| 证据、公开边界、原件 | [Shared evidence](../../../kit/write/shared/evidence.md)、[入账](../../../docs/governance/intake.md) | 已区分事实/推断/合成与逐 URL 身份；无需复制一套来源库 |
| 图文、图注与跨媒介 | [Exhibits](../../../kit/write/publish/exhibits.md)、[Shared verification](../../../kit/write/shared/verification.md) | 已有图注、来源、方法说明职责；待实际教材渲染后检查是否保住这些职责 |
| 页面类型与维护 | [文档实践](../themes/documentation-practices.md)、[文档体例](../../../docs/architecture/documentation.md) | 已消费 Diátaxis、任务导航、唯一规则位置与使用反馈；无需重做全站分类 |
| 薄 skill 入口 | [writing skill](../../../.claude/skills/writing/SKILL.md) | 已路由到唯一规则；社区短 skill 不是当前缺失能力 |
| SaaS 共同语义、学习路径 | [learning-path](https://github.com/lesPrivilege/Praxis/blob/6d9e6c1807f7f77f36ef1cbd4e5c1a090d6a8cc8/books/saas-engineering/learning-path.md)、[semantics](https://github.com/lesPrivilege/Praxis/blob/6d9e6c1807f7f77f36ef1cbd4e5c1a090d6a8cc8/books/saas-engineering/semantics.md) | 已有三条路线、变式和状态/权威区别；本研究不将它们误报为待新建 |
| SaaS 术语与机器索引 | [terminology](https://github.com/lesPrivilege/Praxis/blob/6d9e6c1807f7f77f36ef1cbd4e5c1a090d6a8cc8/books/saas-engineering/terminology.md)、[JSON](https://github.com/lesPrivilege/Praxis/blob/6d9e6c1807f7f77f36ef1cbd4e5c1a090d6a8cc8/vault/distilled/saas-engineering-atlas/terminology.json) | 已有原词、全称、中文含义与稳定 term ID；不要建立第二份全局词表 |
| SaaS 来源与例题检查 | [validation](https://github.com/lesPrivilege/Praxis/blob/6d9e6c1807f7f77f36ef1cbd4e5c1a090d6a8cc8/books/saas-engineering/validation.md)、[整合验收](https://github.com/lesPrivilege/Praxis/blob/6d9e6c1807f7f77f36ef1cbd4e5c1a090d6a8cc8/docs/verification/saas-engineering-atlas-20261014.md) | 已区分定义的检查、运行的合成脚本和未执行的外部接入；本研究不重跑这些脚本，也不把既有数量计入本次通过数 |
| 编订参考与 Claude 交接 | [editorial-method](https://github.com/lesPrivilege/Praxis/blob/6d9e6c1807f7f77f36ef1cbd4e5c1a090d6a8cc8/vault/provenance/saas-engineering-atlas/editorial-method.md)、[claude-handoff](https://github.com/lesPrivilege/Praxis/blob/6d9e6c1807f7f77f36ef1cbd4e5c1a090d6a8cc8/books/saas-engineering/claude-handoff.md) | 已引用本次指定的三份 AI Infra 材料，并赋予 Claude 完整表达自由。本研究的独立增量是回查实际配置、版本适用性和跨来源比较 |

## 仍需在实际成书中检验

**章际接口。** 已有阅读路线与迁移边，不等于所有章节已经按该路线编成连续读物。需要给主线段落标明前置、首次解释、后续新增条件与算例身份。这个小记录放在项目编辑侧车，不写进每个读者页面，也不要求每节固定字段。

**审阅版本的绑定。** 已有主张与读取记录、脚本回执，仍需在最终成书时绑定整本稿、术语索引、关键计算输入与图稿版本。AI Infra 的历史 hash 差异说明为什么“旧稿通过”不能自动沿用；这不意味着 SaaS 已有回执错误。

**两类独立审阅。** 已读 SaaS 验收明确说当前路线走读是整合者完成，独立技术与教学审阅待后续，完整稿还待接收其他贡献的精确最终提交。本研究不会以再次静态阅读替代这两项。完成这些工作应由研究/技术与教学审阅负责人承担，再把解决后的材料交给 Claude。

**独立阅读面的首用。** 全书已有首用和词表，未来交互页面、弹出图、跳转片段可能改变实际首次接触。需在最终媒介检查，而不因源稿扫描通过就标为完成。标签可短，邻接解释须可取得且无需回到聊天背景。

**计算与全文之间的漂移。** 检查脚本能验证合成模型；若正文的时间边界、舍入说明、图中数值与脚本输入不同，脚本仍可能通过。优先给代表算例绑定正文定位和输入身份，再看是否值得自动化。不要为了统一而把所有行业都改成 H01 的算式。

**维护入口。** 来源更新应定位受影响主张、例题、图、译文和学习路线。一般条款已有，真正缺的是教材实际修订时的成本与遗漏证据。先作一轮受控改动演练，再决定是否增加全局自动检查。

## 保持的职责边界

正文保留必要前提、推理、例子与公共引用；编辑日志保存获取过程、未决问题、审阅裁决和工具输出；来源卡保存原语言依据。现有 Source/Claim/Case/Term 身份继续使用，不另造兼容层。待真实试用形成有效增量后，才考虑在现有 Prose/Publish/Shared 的正确位置采纳；本分支不改它们。
