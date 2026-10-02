# 企业工作面语法

跨域定义先查 [共同工作语法](work.md)。企业 demo 用以下九项将业务契约落实到工作面。

| 检查项 | 要回答的问题 |
|---|---|
| Object | 谁处理哪个有身份和版本的对象？ |
| Context | 天然输入件、场景与任务范围是什么？ |
| State | 当前状态由哪个系统、哪位责任人确认？ |
| Action | 当前允许做什么，前置条件是什么？ |
| Rule | 使用哪版规则，例外交给谁？ |
| Evidence | 每项判断的依据定位在哪里？ |
| Human | 谁复核、修正、批准或拒绝？ |
| Trace | 提议、决定、动作与结果怎样关联？ |
| Next | 产物交给谁，剩余义务如何继续？ |

前端用列表、详情、表单和 review 工作面表达这些内容；后端保存对象与变化；workflow 表达角色交接。AI 的 extract/check/compare/draft 动作返回可审查结果，人工决定保留独立记录。

填写 [场景模板](../../scenarios/_template/README.md) 后按 [验收](../verification/README.md) 检查。研究与来源见 [主题提炼](../../vault/distilled/README.md)。

## 按问题消费外部语法

需要把九项工作语法映射到成熟产品或现场实践时，按问题展开对应参考族，消费卡片中已核实的词汇和边界；这些链接提供研究语境，不改变上面的通用语法，也不构成实现承诺。

| 当前问题 | 参考入口 | 消费重点 |
|---|---|---|
| 对象、字段、视图、查询或工作项怎样命名 | [internal-tools](../../vault/references/internal-tools/README.md) / [saas](../../vault/references/saas/README.md) | page/query/component、object/field/view、resource/work-item 的关系；保留本地 Object/State/Action 归属 |
| 谁能看、改、批准哪个对象 | [governance](../../vault/references/governance/README.md) | identity/access、policy/decision、subject/relation/object；不把外部角色模型当本地权限实现 |
| 长流程、任务执行、重试或恢复如何表达 | [workflow](../../vault/references/workflow/README.md) | process/task/runtime、workflow/activity/durability；不把产品引擎态当业务状态 |
| 现场信号如何进入可复用平台语法 | [field-practice](../../vault/references/field-practice/README.md) | field signal、production outcome、shared pattern、field-to-core；不把每个客户特例平台化 |

消费后把采用的映射写回场景或项目 index，并保留 reference ID 与未采用边界；普通参考仍是 candidate，是否成为更高权重入口另由验收和裁决登记。

## 平台产品扫盲

理解供需匹配、流量、交易、履约与经营指标，先读 [平台产品词表与解释](../../vault/distilled/platform-product/README.md)；用 XMind 阅读或查找其他任务的导图，进入 [思维导图](../../vault/mindmaps/README.md)。这是研究学习入口，定义企业工作状态与责任仍使用上面的共同工作语法。归属与扩展规则见 [ADR-012](../../docs/decisions/012-platform-grammar-mindmaps.md)。
