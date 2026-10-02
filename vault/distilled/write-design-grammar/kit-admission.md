# Kit 条目的 admission 与退出候选

状态：`candidate`。来源为 `6ab72e8e-00f0-83ec-b5e1-1155a6e6c68c`，主要证据是 turn `bbb21206-3286-42f9-91e4-9ff0272713bf` 与 assistant item `1ce253d6-1578-4749-8ae6-72fb4863220a`。

## 何时值得进入 Kit

对话将 Kit 定义为仍在运行中的规范，而不是整理得比较好的知识库。候选条目至少要能回答：

- `Necessary`：缺少它会让 agent 重复犯错或重新推导。
- `Reusable`：不依赖单一项目的一次性上下文。
- `Discoverable`：能从任务意图找到，有明确触发条件。
- `Actionable`：能改变实际施工行为。
- `Dogfoodable`：能在真实任务中验证是否有效。
- `Maintainable`：有办法判断何时过时。

对话还给出一个有用的生命周期：`discover / experiment → demo → repeated usefulness → generalize → kit → dogfood → revise / demote / remove`。它强调 Kit 可以很小，而 evidence 和 Demo 可以更丰富。

## 使用和治理痕迹

真实任务可以留下很薄的 usage trace：使用了哪些条目、没有使用哪些条目、观察到什么失败或 override。长期积累后，这些痕迹可支持三种维护动作：

- 反复出现的项目 pattern 进入候选 generalization；
- 一直没有 consumer、每次都被覆盖或依赖已漂移的条目进入 review；
- 只对某一模型或一次案例成立的规则降为 reference/snapshot，不继续污染 active Kit。

## 当前裁决

必要、可复用、可发现、可执行、可验证与可维护，以及真实使用反馈支持复核和退出，属于初次消费后由 [ADR-015](../../../docs/decisions/015-kit-editorial-contract.md) 接入文档结构契约与修订流程的治理语义。[ADR-016](../../../docs/decisions/016-progressive-kit-structure.md) 进一步把“可发现”落到真实的 Write/Design README 与分支路由；它没有自动晋升条目，也没有改变 `promotion`、`demotion` 仍需证据和 Astra 裁决的边界。条目仍需以实际消费者、失败证据和维护判断为准。
