# Architecture

本repo是kit知识与契约的权威位置。先建立可导航、可溯源的架构，不因参考清单很长而安装完整平台。

先读 [架构理由](rationale.md)，再看 [工作全景](../../kit/landscape.md) 了解如何从当前任务进入知识；了解数据安全、薄Skill、抗折旧和跨项目消费如何决定组织方式。

## 层次

`vault（证据/提炼） → docs（治理裁决） → kit（采纳契约） → scenario/demo（消费）` 表示知识晋升。

运行代码未来的依赖方向相反：客户overlay依赖行业scenario，scenario依赖kit，kit不引用客户逻辑。资料依赖与代码依赖不可混写。

`kit/reporting` 是与企业工作面并列的独立条目；分享来源登记、证据规则及验证，不强迫两者共用页面模板。

## 所有权

| 位置 | 唯一职责 |
|---|---|
| vault/intake | 材料inventory和覆盖记录 |
| vault/distilled | 中文主题消费成果，默认研究入口 |
| vault/references | 原对话明确URL的逐源登记 |
| vault/provenance | 引用占位、补充查证和缺口 |
| vault/snapshots | 本地材料必要原件及依赖快照 |
| vault/archive/chat | 原始对话，只供备查 |
| docs/decisions | 接受/延后/拒绝及原因 |
| kit | 使用契约和成熟能力目录 |

以相对路径互相链接，不依赖来源机器的绝对路径才能阅读。绝对原路径只能作为溯源元数据。快照不自动获得执行权限。

## Build surface

原Chat提出React/TypeScript/Vite、Ant Design、FastAPI/Pydantic、PostgreSQL与Compose的候选golden path。此轮采纳边界，不锁版本、不建应用。Camunda/Temporal/IAM等保留触发条件；首次运行demo按实际约束出实现ADR。

## 工作系统扩展

[kit/work-system](../../kit/work-system/README.md) 单列个人工作对象、状态更新与工具控制面。与reporting共享证据，与enterprise共享可泛化grammar；不把个人工作目录直接当产品runtime。

## Demo与客户资料

`scenarios/` 是闭环定义，`demos/` 是未来运行实现；真实项目与按组织治理的Source Vault独立。这里的vault仅保存Kit研究资产。详见 [ADR-006](../decisions/006-demo-project-vault.md)。

## 共享环境层

[kit/environment](../../kit/environment/README.md) 声明跨消费域的能力、数据/账号分区、Expert/Skill边界及Agent使用登记。它不存机器secret或真实客户运行state；runtime接入仍独立裁决。
