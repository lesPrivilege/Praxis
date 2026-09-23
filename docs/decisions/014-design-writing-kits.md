# ADR-014：跨项目的 Design 与 Writing kit

日期：2026-09-24。状态：accepted（知识组织）。裁决：用户；编订：Claude。

## 问题

设计调研、选型裁决和产出分散在 kit、vault 提炼稿、来源目录和快照中，并有几组重复登记。每次新任务都要重新召回，已裁决的取舍难以复用。旧的全局写作 skill 带有个人用字习惯，容易过拟合。

## 裁决

- 设计与写作是最泛化的两部分，分别建立 [kit/design](../../kit/design/README.md) 与 [kit/writing](../../kit/writing/README.md)。Design 分三层：原则与选型结论、参考索引、vault 原件；内容分“内容与数据可视化编排”和“产品软件界面”两支。
- 两个 kit 只收跨项目可复用的结论。各项目保留自己的 index 与 grammar；项目中的裁决与消费先记在项目内，能跨项目复用时才回流。
- 不设全局设计 skill。写作原理由项目内 skill `writing` 自足承载，不依赖外部文件，只在明确需要撰写时加载；旧的全局 `house-style` skill 停用，已移入废纸篓。
- 新参考经 explorer 登记到 vault 后，以 `candidate` 进入参考索引，使用后裁决；状态沿用[状态词表](../governance/status-vocabulary.md)。

## 暂不处理

盘点确认的重复登记（两层来源目录、两个 kit 各自消费同一批快照、两处验收记录未互链）列在 kit/design 的“待合并”一节，按规则逐步合并。CW 的设计记录只作为带日期的证据引用，取用前对照当前提交复核。
