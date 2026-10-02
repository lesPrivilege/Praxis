# Kit 是可导航的工作语境

状态：`candidate`。来源为 `6ab72e8e-00f0-83ec-b5e1-1155a6e6c68c`，主要证据是 turn `bbb21f32-d1b9-4593-b30a-097977fab3c7` 的 user item `bbb21f32-d1b9-4593-b30a-097977fab3c7` 与 assistant item `73690319-a4c0-4c2e-98c9-965b8782032d`。

## 提炼语义

对话把 Skill 与 Kit 分成两个职责：Skill 是有界的触发—指令—执行流程；Kit 是可挂载、可导航、渐进披露的工作语境。挂载 Kit 的结果应是获得一张地图和访问路径，而不是要求 agent 先读完所有正文。

目录和 README 本身承载 routing：

- 顶层 README 回答用途、主要分支、选择入口、常驻规则、深入路径和禁区。
- 二级 README 按输出意图继续分流；只有任务跨越多个模式时才展开多个分支。
- 文档开头可登记 `Use when`、`Usually read with`、`Consult ... when`，帮助 agent 在不加载全文的情况下回到正确节点。
- `grammar` 表达期望行为，`reference` 保留可供判断的外部材料，二者不应拥有同等约束力。

这种结构更接近 filesystem-native RAG：任务语义 → 域 → 目录 → README → 明确关系 → 目标文档 → 可选 reference。文件放在哪里、与哪些节点相邻，本身就是工作语义。

## 当前裁决

初次消费后的路由原则由 [ADR-015](../../../docs/decisions/015-kit-editorial-contract.md) 采纳，并落在文档结构契约中；它保留了“目录和 README 承担渐进引导”的历史治理语义。本轮后续采纳由 [ADR-016](../../../docs/decisions/016-progressive-kit-structure.md) 落实为真实入口：

- [Write](../../../kit/write/README.md) → `prose/`、`publish/`、`motion/`、`shared/`；
- [Design](../../../kit/design/README.md) → `foundations/`、`composition/`、`interaction/`、`motion/`、`references/`。

因此本页来源中的示例目录不再是当前入口的唯一依据，当前任务应按上述 README 选路；目录存在也不证明通用 renderer 或所有下游契约已经完成。

## 不应由此推出的结论

对话中的目录是蓝图，不是当前仓库已经存在的实现。它没有证明某个 Write、Design 或 Motion 文件已经完成，也没有证明某个 renderer 已安装。后续如果采用该路线，应先以一个真实任务验证 routing 是否能减少重复阅读和错误落点。
