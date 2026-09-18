# Enterprise product grammar

最小语句：`Object → Context → State → Action → Rule → Evidence → Human → Trace → Next`。

前端通过列表、详情、表单、review工作面表达对象；后端通过entity/state/action/rule/event保存变化；workflow表达角色交接。AI是extract/check/compare/draft等worker动作，必须返回可审查的结构化结果。

每个demo回答：谁处理什么材料、哪条规则允许什么动作、证据在哪、何时交人、变化如何记录、结果交给谁。专业人员的确认与AI建议分开保存。

详细研究入口：[主题提炼](../../vault/distilled/README.md)。不将原Chat中金额、覆盖率等示例当真实客户数据。
