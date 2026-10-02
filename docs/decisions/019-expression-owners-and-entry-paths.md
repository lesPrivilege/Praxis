# ADR-019：表达规则的归属、强度与两条入口路径

日期：2026-10-02。状态：accepted（知识所有权、规则强度与入口）。用户当日批准按 dot 的架构校订补充施工；Opus 5.5 主会话对照本地、裁决并编订，Sonnet 5.5 只读代理做前后走读。Luna 在本会话不可用。

## 问题

补充文件审的是远端 `main@3417dca`，那里还没有 Write 与 Design 的分支。它提出三件事：要不要在 Write、Design、Motion 之外再立一个 Present；Write 的规则哪些是底线、哪些只是启发式；Agent 做一件任务时最少要读什么。

本地已按 ADR-016 建了 Write（Prose、Publish、Motion、Shared）和 Design（Foundations、Composition、Interaction、Motion、References）。对照之后有四处需要裁决：

- 补充文件说的 Present，本地由 Write 的 Publish 和 Motion 两支承担，但入口没有“改成另一种媒介”这类说法，也没有区分投影与改编。
- 成文原理的八条写在同一层，其中有底线、有中文约定、有编辑启发式，读者分不出强度；改写英文时没有说明哪些适用。
- 图形编码的语义在 Write/Publish 和 Design/Composition 各写了一份。
- 根 `AGENTS.md` 让所有任务先读 Kit 使用约定、架构和入账规范。当日工单二的六次冷读每次都读了 Kit 使用约定，其中两次还读了架构与入账规范；改动前的四次路线走读里，三次没有读任务入口。

## 决定

1. 不新建 Present。空间上的编排由 [Write / Publish](../../kit/write/publish/README.md)维护，时间上的显现由 [Write / Motion](../../kit/write/motion/README.md)维护；入口补上“改成另一种媒介或篇幅”“阅读单元、分页、密度、收起”这些说法。出现第二类独立消费者反复绕过 Write 只取编排规则时再议。
2. Reporting、Write、Design 按所作的决定分工，任务只取用得着的分支，不是依次都要过的流程。编排、图形或运动改变了事实、限定、证据关系或因果含义时，回到维护那条规则的分支重新判断。八类编排问题的归属见 [归属表](../../vault/distilled/write-present-supplement-20261002/README.md#八类问题的归属)。
3. 每条规则只有一份正文。图形怎样忠实表达数量、关系和状态，正文在 [图形编码](../../kit/design/composition/encoding.md)；Publish 只决定用哪种展项并链接过去。
4. Write 的规则分三种强度，写在 [Write 入口](../../kit/write/README.md#规则有三种强度)：
   - 底线四条，正文在 [证据与来源](../../kit/write/shared/evidence.md#底线)，任何语言和模式都适用。
   - 语言约定按输出语言取用。目前只有中文；不为英文预建空文件。
   - 编辑启发式与文体是对外中文技术成文的默认，[成文原理](../../kit/write/prose/grammar.md#强度与适用范围)逐条写明强度和可以不照做的情形。八条原文不改。
5. 换媒介或改篇幅分投影、改编和新增三种。只有投影可以说内容没有变；改编和新增附变动说明。正文在 [证据与来源](../../kit/write/shared/evidence.md)。
6. 机械检查另设入口 [格式检查](../../kit/write/prose/format.md)：先划不动的范围，可以直接改的、只报不改的、需要判断的分开。本仓库没有 lint 工具，这一页定的是边界。
7. 入口分两条路。做任务从 [Kit 任务入口](../../kit/README.md)进，读到输入、约束和完成标准都清楚就开工；维护仓库才读 Kit 使用约定、架构和入账规范。根 `AGENTS.md` 与 `kit/AGENTS.md` 相应改写，授权、来源只读、分工与校验几条不变。

## 没有采纳的

| 补充文件或原 proposal 的内容 | 处置 |
|---|---|
| 把 Present 与 Write、Design、Motion 并列为四套规范 | 不采纳。本地的 Publish 已是它的落点 |
| 十条 Write Core 作为所有任务的不变量 | 不采纳。本地是八条，按强度分档，底线只留四条 |
| Core 加语言层对任何 Agent 默认加载 | 不采纳。按任务和输出语言取用 |
| 为 Present 预建 principles、recipes、antipatterns 等六类目录 | 不采纳。先有内容再定位置 |
| 为四个入口各写 description 元数据 | 部分采纳。入口表写明什么时候用、什么时候不用进来；宿主的 skill 元数据只有 `writing` 一个，未新增 |
| Profiles 作为新的配置层 | 不新建。本地已有 Genres 和默认关闭的个人语体，冲突时的次序写进 Write 入口 |

## 与既有决定的关系

延续 ADR-015、016 的分层，不改目录结构，新增一页 `format.md`。修订 ADR-016 里“写作原理”的读法：八条不再是同一强度。不改 ADR-002 的晋升门槛，不改 ADR-017 的参考优先级。

根 `AGENTS.md` 是本仓库的指令文件。本次只把第一段拆成两条路，其余约束逐字保留；这是用户批准施工范围内的改动，在回执里单列。

## 验证与限制

四条取用路线在改动前后各走读一次，其中两条在再改两处之后复跑，预期先冻结。要守住的内容前后都守住了，三处产出因新规则而不同；读取量只在一个任务上下降，一个任务上升。架构与入账两份维护文档改动后没有再被读到。结果见 [走读记录](../../vault/distilled/write-present-supplement-20261002/route-walkthroughs/README.md)与 [回执](../verification/write-present-supplement-20261002.md)。每条路线每个时点一次、一种模型，差别只能当线索。

没有验证的：真实读者的理解效果；英文以外的其他语言；任何宿主里的自动发现（本仓库只有一个项目 skill）；补充文件列的六个冷启动反例里，只走了与四条路线重合的部分。

重访：出现只取编排规则的独立消费者；有了第二种语言的写作任务并形成约定；格式检查有了真的工具；或走读出现“读了入口仍然加载无关分支”的反例。

来路见 [提炼与裁决](../../vault/distilled/write-present-supplement-20261002/README.md)。
