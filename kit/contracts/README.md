# 工作与接口契约

填写 [场景模板](../../scenarios/_template/README.md) 时按下表确定字段；术语定义见 [共同工作语法](../grammar/work.md)。

| 契约面 | 必须明确 | 检查点 |
|---|---|---|
| 对象与范围 | 对象 ID、版本、owner、权威状态位置、输入输出 | 同名对象在不同宿主中有显式映射 |
| 证据与规则 | 来源定位、证据支持的主张、规则版本、缺项 | 来源、推断、规则结果、人工决定可区分 |
| 动作与批准 | actor、scope、允许动作、批准对象及版本 | 输入实质变更后重新检查批准范围 |
| 状态与事件 | 前置状态、转换、外部确认、事件身份 | 运行状态和业务状态分别保存 |
| 失败与恢复 | 缺上下文、拒绝、结果未知、核对方法、重试条件 | 写入超时先核对外部影响；重复执行有稳定身份 |
| 产物与交接 | 验收者、标准、接收依据、未决项、下一责任、观察点 | 接收材料与批准业务动作分别记录 |

业务 schema 在 scenario 维护；API 与结构化输出引用同一契约源。首次实现登记 schema/API 版本、验证工具及兼容范围；共享运行契约按 [晋升规则](../../docs/decisions/002-promotion.md) 采纳。

交付检查见 [分层验收](../verification/README.md)。

## 任务参考路由

需要把权限、策略和审批写入契约时，查 [governance 参考族](../../vault/references/governance/README.md)：[OPA](../../vault/references/governance/opa.md) 用于 input/policy/decision 的分层，[OpenFGA](../../vault/references/governance/openfga.md) 用于 subject/relation/object 的授权关系，[Keycloak](../../vault/references/governance/keycloak.md) 用于 identity/access 与 federation 的边界。消费这些已核实的词汇和反例，不把外部实现、协议清单或 demo role 变成当前权限保证。

需要描述长流程、人工节点、重试或恢复时，查 [workflow 参考族](../../vault/references/workflow/README.md) 的 [Camunda](../../vault/references/workflow/camunda.md) 与 [Temporal](../../vault/references/workflow/temporal.md)，消费 process/task/runtime 或 workflow/activity/durability 的区分；不因此选定引擎，也不把 durable execution 当作业务补偿。

需要对照内部工作面或 SaaS 的对象边界时，查 [internal-tools](../../vault/references/internal-tools/README.md) 与 [saas](../../vault/references/saas/README.md) 参考族，消费 page/query/component、object/field/view、resource/work-item 等命名来补映射；外部产品领域不得成为本契约的 schema owner，未核实的产品字段保持候选。
