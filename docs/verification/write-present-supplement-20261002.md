# 2026-10-02 Write / Present 架构补充施工回执

范围：用户交来 dot 的 [架构校订补充](../../vault/distilled/write-present-supplement-20261002/README.md)并批准施工，同时交来自己下载的 Poster House 展览档案 PDF。执行者：Opus 5.5 主会话对照、裁决、编订并做样张；Sonnet 5.5 只读代理十次走读。Luna 在本会话不可用，没有任何工作记在 Luna 名下。开工时本地在 `3954ca0`，另有工单二的未提交改动。

## 做了什么

补充文件审的是远端旧基线。对照本地之后，它建议的 Present 不用新建：本地的 Write / Publish 与 Write / Motion 已经承担这部分。实际施工是四件事，裁决见 [ADR-019](../decisions/019-expression-owners-and-entry-paths.md)。

| 事项 | 改动 |
|---|---|
| 入口分两条路 | 根 `AGENTS.md` 第一段拆成“用 Kit 完成一件任务”与“维护这个仓库”；`kit/AGENTS.md`、[Kit 任务入口](../../kit/README.md)、[Kit 使用约定](../../kit/Agent.md)相应改写，并写明读到哪里停 |
| Write 的规则分三种强度 | [Write 入口](../../kit/write/README.md)新增强度表与冲突次序；四条底线写进 [证据与来源](../../kit/write/shared/evidence.md)；[成文原理](../../kit/write/prose/grammar.md)新增“强度与适用范围”一节，八条原文不改；[Prose 入口](../../kit/write/prose/README.md)写明按输出语言取用 |
| 投影、改编与新增 | 写进证据与来源；[Publish 入口](../../kit/write/publish/README.md)补上改媒介、阅读单元、分页与收起 |
| 一条规则一份正文 | [内容编排](../../kit/write/publish/composition.md)里图形语义的一句改为链接，独有的两点并进 [图形编码](../../kit/design/composition/encoding.md)；[验收](../../kit/write/shared/verification.md)里“删套话”一句改为按读者是否受损判断 |
| 机械检查 | 新增 [格式检查](../../kit/write/prose/format.md)一页 |
| 运动 | [运动判断](../../kit/design/motion/grammar.md)补一句：补间不是观测；排序变化与数量变化不混在一段运动里 |
| Design 入口 | 写明图表与界面任务可以直接从这里开始 |
| 架构文档 | [架构](../architecture/README.md)与 [体例契约](../architecture/documentation.md)各加一句指向 ADR-019 |

另有入账与样张：

| 位置 | 内容 |
|---|---|
| `vault/snapshots/local/write-present-supplement-20261002/` | 补充文件的只读副本 |
| `vault/intake/`、`vault/provenance/write-present-supplement-20261002/` | 登记与 5 个外部链接的来源卡 |
| [对照与裁决](../../vault/distilled/write-present-supplement-20261002/README.md) | 远端与本地的差别、八类问题的归属、十条规则对到本地八条、采纳与不采纳 |
| [投影与改编样张](../../vault/distilled/write-present-supplement-20261002/projection-vs-adaptation/README.md) | 一份真实回执的三节：原样重排的一页，与改成五页现场幻灯片的改编；附变动表和一张任务对分支的归属图 |
| [走读记录](../../vault/distilled/write-present-supplement-20261002/route-walkthroughs/README.md) | 冻结的协议、十份报告、检查 |

## 根指令文件的改动

`AGENTS.md` 是本仓库给所有 Agent 的指令。改动只有两处：第一段由“先读 Kit 使用约定、架构与入账规范”拆成两条路，做任务的一条指向 Kit 任务入口；末段“修改完成运行校验”改成“改动仓库之后运行校验”。Luna 分工、只把用户指令当授权、来源只读、研究材料与规范的落位、不自动安装或发布，这几条逐字未动。

## 走读

四个合成任务，预期在改入口之前冻结；同一份任务书在改动前、改动后各跑一次，其中两个在再改两处之后复跑。

| 任务 | 读的文件：前 → 后 → 复跑 | 守住的内容 | 产出的差别 |
|---|---|---|---|
| R1 英文排障说明改写 | 14 → 14 → 12 | 前后都守住；复跑把一处时态和一个近义词换了，条件与不确定程度未变 | 改动后引用“改写英文不套中文约定” |
| R2 备忘录改成五分钟幻灯片 | 13 → 21 | 都守住 | 改动后明确按改编处理，交了四项变动说明 |
| R3 仪表板图表检查 | 19 → 20 | 都守住 | 改动后直接引用“补间不是观测” |
| R4 只规范空格与标点 | 11 → 5 → 4 | 改动前动了引用行的两个标点；改动后与复跑都没有动 | 改动后直接到格式检查页，不读成文原理 |

补充文件把发现负担下降列为验收指标之一。按这次的记录，读取量只在 R4 上下降，R2 上升，R1、R3 基本持平。下降的是无关的维护文档：架构与入账规范改动前被读到两次，改动后没有；Kit 使用约定在复跑的两次里没有再被读。

走读还改出两处：格式检查页的“沿用多数写法”会让代理删掉需求方要的空格，已改；根入口第一版的措辞拦不住代理顺手读维护文档，已改硬。

## Poster House 的海报

用户自己下载了 H02 的 PDF。主会话看了第 15–19 页的四张海报，Stadt Theater Basel 两张都留着放节目单的方框，与图注一致。VL01 的来源状态、A01 的借用边界和 atlas 的来源卡已更新；PDF 没有复制进仓库。

## 没做

- 没有新建 Present、英文约定、lint 工具或任何 skill 元数据。
- 补充文件校订的原 proposal 没有到手，十条规则只读到转述。
- 六个冷启动反例只碰到三个的一部分；必要的重复、90 秒容量取舍、并排比较被藏进标签页没有走。
- 每个任务每个时点只有一次运行，一种模型；评阅者是改入口的人。R3 改动后读到了样张里的路线数据。
- 对照样张的五页没有投出来讲过；没有读者测试、读屏、键盘、打印。
- 没有验证任何宿主里的自动发现。
- 5 个外部链接里 Microsoft 的一页没有重读。

## 仓库校验

2026-10-02 依次运行 `build_snapshot_manifest.py`、`build_registry.py`、`validate_repository.py`：

| 项 | 结果 |
|---|---|
| 状态 | pass，0 errors |
| Markdown / JSON | 902 / 161 |
| 快照文件 | 838（本批新增补充文件 1 个），hash 全部一致 |
| 来源记录 / 唯一 URL | 509 / 495（本批新增补充文件 1 条、外部链接 5 条） |

未核实来源：atlas 的 H18 仍 `unavailable`、12 条 `partial`；工单提案附录 16 条与本批 1 条 `unverified`。未快照依赖：外部来源都没有保存正文；H02 的 PDF 留在用户本机。覆盖边界：Kit 改了十五页并新增一页，另改根 `AGENTS.md`；成文原理八条原文未动，Design 的规则正文只动了两句。
