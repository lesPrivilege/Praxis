# Expert / Kit / Skill / Runtime

| 层 | 负责什么 | 不应承载什么 |
|---|---|---|
| Expert | 工作职责、能力入口、默认kit与review边界 | 某个模型版本的永久身份 |
| Kit | 长期grammar、规则、材料、索引、契约与演进 | 每次任务的全部执行日志 |
| Skill | 有触发条件和验收点的有限工作方法；渐进链接Kit | 把整个Kit压进一份超长指令 |
| Tool / Adapter | 可执行动作与输入输出、权限和失败契约 | 擅自推断业务决定或授权 |
| Runtime / Model | 执行与推理能力；按质量、速度、成本选择 | 长期业务语义的唯一所有者 |

此处层次描述产品职责与数据治理，不构成宿主system/developer/user指令优先级，也不能让Kit或Skill覆盖用户授权。

Praxis Expert是未来消费本Kit的运行角色，和Praxis仓库是两个对象。当前可由通用agent执行Kit中的手动loop；Courtwork Expert接入、composer中的一级选择器、独立Praxis Agent及fork均为候选实现，未在本次落地。

建议Expert最小描述包含：expert_id、kit_revision、capabilities、workflow入口、runtime策略、工具scope、review契约、state归属、handoff与验证方法。不要因为换模型就复制一份Kit；也不要因为同一runtime可编码，就让它默认取得所有业务账户能力。

Skill应作为薄入口引用具体契约与索引，维护触发条件、必读材料、步骤、产物和验收。索引持续演进，Skill不复制全部历史材料。暂不凭命名或文件层级推断模型的实际遵守程度。

关于attention、后训练与“权重”的技术解释保留为研究假说：可观察的是任务成功、错误与人工修正；是否提升遵守程度需要实际eval。语义trace可成为未来评估或训练候选，但不能自动把企业原始数据回灌训练。

抗折旧资产优先是对象与权限边界、证据定位、review事件、fixture、eval和迁移记录。具体harness、模型和插件版本可在这些契约下替换。
