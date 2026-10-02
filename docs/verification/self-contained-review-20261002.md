# 2026-10-02 自足性审查的消费回执

范围：用户交来一份没有署名的《Praxis 自足性审查与最小增量方案》，没有另加说明。审查读的是远端 `main@ff96b9a`，与本地 `main` 相同。执行者：Opus 5.5 主会话，登记、对照、实跑、裁决和编订都在主会话里完成，没有派代理。Luna 在本会话不可用，没有任何工作记在 Luna 名下。工作分支 `self-contained-review-20261002`，没有提交。

## 结果

审查的十一条里，三条已改（S1、S4 的一处、S7），一条照目标修了但换了做法（A1），一条做了一半（A4），三条同意保持现状（S3、S5、S6），一条只改了已经出问题的那一处（S2），两条没有做（A2、A3）。

最要紧的一条是 A1。审查从静态阅读看出来源卡的生成脚本与社区语法一批对不上。主会话在隔离副本里照 [脚本说明](../../scripts/README.md)实跑了一次：这条命令会覆盖 108 张手写卡和 24 页索引，另多写 137 个文件。现在每份 catalog 声明卡片由谁维护，脚本只写自己负责的 17 份，校验对两种都查。

## 改了什么

裁决见 [ADR-022](../decisions/022-source-card-ownership.md)，逐条对照见 [提炼页](../../vault/distilled/self-contained-review-20261002/README.md)。

| 位置 | 改动 |
|---|---|
| 31 份 `vault/provenance/**/catalog.json` | 各加一行 `"cards"`：17 份 `generated`，14 份 `maintained`。其余字节不变 |
| [scripts/render_source_cards.py](../../scripts/render_source_cards.py) | 只为 `generated` 的 catalog 生成；内容相同就不写；不再写整层的 Provenance 索引；缺声明、slug 不安全或重复、`card_path` 不在默认位置时报错 |
| [scripts/validate_repository.py](../../scripts/validate_repository.py) | 加两项：生成的卡和索引与 catalog 的投影逐字相同；几条来源共用一张卡时卡里有每一条的 URL |
| [scripts/README.md](../../scripts/README.md) | 命令表改成实际覆盖的范围，加一节“来源卡由谁维护” |
| [drift-checkers 的目录说明](../../vault/provenance/drift-checkers-20260930/README.md) | 补上 Pages 部署的 URL。新检查查出来的 |
| [Vault 入口](../../vault/README.md)、[Distilled 入口](../../vault/distilled/README.md) | 工单提案那一条不再写做到哪一步，指向主题页的裁决表 |
| [工单提案主题页](../../vault/distilled/design-kit-workorders-20261002/README.md) | 状态行说明现状只在裁决表里记，补上工单二的执行者；接收时的对照表标明时点；边界一节指向两份回执 |
| [Provenance 索引](../../vault/provenance/README.md) | 加一句：本页手写，各批卡片的维护方式看 catalog 的 `cards` |
| [决定索引](../decisions/README.md) | ADR-014、015、016 三行各注明被哪一条替代或修订了哪一部分 |
| [根 README](../../README.md) | 设计任务直链参考路由，不再经兼容入口 |
| [修订流程](../governance/evolution.md) | 加一个指向下面那一节的链接 |

共同工作语法、工作契约、Kit 的任务入口和根 `AGENTS.md` 都没有动。

## 一次维护修订的全程

审查的 A4 要一条从真实问题走到保留或撤回的样例。A1 是一件真实的维护问题，下面按 [修订流程](../governance/evolution.md)的字段串一遍。这是维护一侧的样例：它说明一处工具缺口怎样被发现、验证和修掉，不说明任何规则对执行者的行为有效果。

| 环节 | 这一次 |
|---|---|
| 触发 | 外部审查静态阅读 `ff96b9a`：catalog 有 `card_path`，生成脚本不读它 |
| 旧判断 | 脚本说明：来源卡是 catalog 的生成投影，登记更新后运行生成脚本。修订流程：新批次接入须能重复生成相同结果 |
| 新证据 | 把 `ff96b9a` 导出到隔离目录实跑。702 个文件变成 839 个；108 张手写卡和 24 页索引被覆盖；286 张卡没有变化 |
| 与旧判断的关系 | challenges。旧判断对 17 份 catalog 成立，对 14 份不成立 |
| 候选 | 一处：让 catalog 声明卡片由谁维护。没有采用审查建议的“脚本读 `card_path` 并聚合” |
| 正例 | 17 份 `generated`：连续生成两次都写 0 个文件；改一条摘要，只重写对应的一张 |
| 反例 | 四种坏输入各在一份副本里试：slug 写成 `../../x`、两条 slug 相同、`card_path` 指到 `vault/README.md`、删掉 `cards`。都报错，不写文件 |
| 对照 | 改之前的脚本在同一份导出上的结果就是上面“新证据”一行。改之后 14 份 `maintained` 的目录逐字不变 |
| 再消费 | 校验加上两项后在仓库里运行：共用卡检查报出 drift-checkers 的目录说明缺一个 URL，补上后通过。全量副本里手改一张生成卡、从共用卡里删一个 URL，两项都报出 |
| 回退点 | 三件改动互相独立：删掉 31 行 `cards`、还原两个脚本，就回到 `ff96b9a` 的行为。没有任何卡片的内容因为这次修订而改变 |
| 什么会让它撤回 | 手写卡因为没有跟着 catalog 更新而被读错，说明“手写”这一种守不住；或出现第三种维护方式，两个取值不够 |
| 没有测过的消费者 | 根据 `local_card` 读卡的下游只有 registry 和校验。有没有别的工具按“一个 slug 一张卡”的假设读目录，没有查 |

## 核对审查时发现它没有写到的

- 手写卡不止社区语法一批，是 14 批。
- 生成脚本会覆盖整层的 Provenance 索引。
- 工单状态除了审查点到的三处，Distilled 入口还有一处；主题页的对照表里“仍未推送”也过期了。
- 指向设计参考兼容入口的现行页面不止根 README，参考分支的五页各有一处。

## 没做

- A2 没有做。带 `used_for` 的三份 catalog 都是手写卡，生成脚本不碰。
- A3 没有做。它要一件真实的、已授权的任务，带对照和留出；ADR-021 最后加的两句入口仍然没有走读经过。
- S2 只改了工单提案一个主题。两个上层入口里其余批次的描述没有缩。
- S4 没有瘦身兼容入口 `kit/design/references.md`。
- 审查的六条静态走读没有复跑。它引用的十五个路径都在。
- 四种坏输入和两种漂移的试验都在隔离副本里做，仓库里没有留测试文件。
- 手写卡与 catalog 之间，除 URL 身份之外的一致性没有检查。
- 没有提交，没有推送。没有安装或运行任何外部代码。

## 仓库校验

2026-10-02 依次运行 `build_snapshot_manifest.py`、`build_registry.py`、`render_source_cards.py`、`validate_repository.py`：

| 项 | 结果 |
|---|---|
| 状态 | pass，0 errors |
| Markdown / JSON | 957 / 170 |
| 快照文件 | 843（加 1：审查原件） |
| 来源记录 / 唯一 URL | 570 / 550（加 1 条记录：审查本身） |
| 生成的来源卡与索引 | 319 个文件与 catalog 的投影逐字相同；生成脚本写 0 个 |

未核实来源：本批没有外部来源。审查引用的 52 个链接都是本仓库自己的文件。此前各批的 `unverified` 不变。

未快照依赖：没有新增。

覆盖边界：两个脚本、31 份 catalog 各一行、九个已有文档页的措辞，另有四处索引各加一行。没有改任何 Kit 规则和任何一张来源卡的正文（drift-checkers 的目录说明加了一个链接）。没有代理走读，没有行为一侧的证据。
