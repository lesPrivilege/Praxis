# Environment contract

Praxis可以作为工作环境的能力索引与治理契约：声明需要哪些能力、数据分区、身份边界、工作对象与review点；真实账号、数据和运行状态在受控本地环境中生成。

本目录是三个消费域共享的环境层，不替代Enterprise、Reporting和Work System入口。当前只有契约，没有可执行bootstrap或已部署Expert。

- [环境与数据分区](workspace-contract.md)
- [Expert / Kit / Skill / Runtime边界](expert-contract.md)
- [Agent使用与额度登记](agent-usage.md)
- [Astra裁决](../../docs/decisions/007-environment-expert.md)
- [r3来源提炼](../../vault/distilled/work-system/r3/README.md)

第一次在新机器消费本Kit时，先盘点可用能力与缺口，编排具体计划，再执行已授权的安装/目录/账号操作并验证。索引中的工具条目本身不授权安装、联网、读取企业资料或发送内容。
