# ADR-048：本地产物分三类，过程记录不留，维护要收敛

日期：2026-10-27。状态：accepted。用户在 ADR-047 之后补充：本地产物有三类。一是真实生产交付，质量较高，管线或可复用；二是预先做好的范例，强模型可以自己设计，受限模型可以照着做；三是其他 dogfooding 记录，保留太多 review 记录反而增加噪声，只做最少或不做。希望每次施工都复利，结果可能尾大不掉，所以要收敛与舍弃。外部来源与已经稳定的产出是优先取用的对象，可作“标准化重复加组装”，其余当作噪声。设计语法的分类不求预先穷举，但要有清晰的指引，让 agent 不经一次很重的 explore 就能自己维护。用户同意了主会话（Claude Opus 5.5）提出的方案与逐条清理；grammar-demos 的对页映射由一个 Sonnet 子代理初拟，主会话裁定。

## 问题

- **trace 混着三种东西。** ADR-047 迁出的 63 件 trace 里，有样张，有成品，有管线说明，也有研究笔记、审阅记录、项目约定和本地快照。前三种可以直接取用，后几种只对当初那件工作成立，与前者混在一起，范例找不出来，记录却越积越多。
- **管线挂在来源包里。** ADR-043 把 5 条本地管线登记为 vault 来源包的条目，挂到 publish 页上，与网页来源并列。
- **review 越积越多。** 挂载、编目与产物都把每次 review 追加进数组；信号只看最后一条，前面的只占地方。
- **upkeep 有两类长期不消的项。** 15 个项目“有未登记的最终产物”、6 条“交付后单元又改过的运行”。在有人再交付之前，没有人要处理它们。
- **分类靠探索。** 编目的形态与区域没有写成规则，每次登记都要先探索一遍。

## 决定

### 本地产物三类

产物的 `kind` 为：
- `delivery`：真实交付，必须在已登记项目里；
- `pipeline`：再做同类交付的方法，构建脚本或写明步骤的 README；
- `example`：为示范某种做法预先做的样张，或作为成品展示的页面与截图。

`serves` 写这件产物在哪些 Kit 页上作为范例、何时对照。pipeline 与 example 可以不在项目里，不按项目布局检查。`made_with` 指向 pipeline 产物，不再指向来源。

过程记录不登记：dogfooding、review 记录、蒸馏笔记、会话纪要、项目内部约定、本地快照。运行记录是它们唯一的痕迹。

### 取用顺序：先网页来源，再范例

`praxis_resolve` 先给网页素材，再给 `exemplars`：服务所选单元的 pipeline、example，以及最新版本经 review 接受（accepted）的 delivery。按 pipeline、example、delivery 排序，每类至多三件，共至多八件；文件找不到或 review 待改的不给。控制面任务页在素材之后列“范例与管线”。

### review 只留最近一次

挂载、编目与产物各存一个 `review`，信号只看它。产物的 review 写明针对哪一版，新版本不继承。更早的结论留在 `history.jsonl`。

### upkeep 只列现在能处理的事

“交付后所用单元又改过的运行”与“项目里未登记的最终产物”不再进 upkeep，各自在运行记录与项目上标出。现在 upkeep 只有六类：
- 挂载与编目的信号；
- 编目放不下的来源；
- 集合的上游变化；
- 单元修订冲突；
- 产物信号；
- reload。

### 分类指引写进工具说明

`praxis_capture` 与 `praxis_file` 的说明给出形态判断表与区域规则：
- 形态看来源本身；
- 区域填会用到它的 Kit 页所在的区域；
- 拿不准就填层，不自建区域。

`praxis_consume` 与 `praxis_artifact_update` 的说明写明本地产物只登记三类，过程记录不登记。agent 照说明一次调用即可维护，分类不求预先穷举。

## 迁移

- **63 件 trace，留下 13 件：**
  - example 11 件：Courtwork 的图标族样张、字阶消融页、上下文动效研究、两张页面截图；编排样张的两个原子与总览；关系语法样板；career-kit 图式样张；Schema Engineering 阅读版。
  - pipeline 2 件：svg-01 关系生成器、Agent 系统设计动态简报的 Remotion 工程。
- **6 件由 README 代表的，改指成品：**
  - AI 能力测试答卷改为成品 HTML，作 example；
  - Write Kit 无声片改为其 `build/README.md`，作 pipeline；
  - DeerFlow 讲解页、AgentScope 第三版成片、MC01、A3 改为成品文件，作 delivery。这 4 件还没有 review，要主人接受后才作为范例给到任务。
- **本地 skill 安装：** 找到公开原件 `github.com/emilkowalski/skills`，登记为 skill 形态的网页来源。
- **离开的记录：** 其余 43 件过程记录，加上 6 件被替换的 README 与 1 件 skill 安装，共 50 条，从 `artifacts.json` 删除。删除前的整条记录写进 `history.jsonl`（`op: migrate-out`），文件本身原地不动。
- **vault 来源包的 5 条管线：** 改登记为 pipeline 产物，服务页与说明取自原挂载。来源包声明的 5 条挂载标为移除，来源包本身不动；8 个版本与对应运行记录里的 `made_with` 改指 pipeline 产物。
- **grammar-demos：** 43 个条目改为 example，名称取各自 `entry.md` 的标题。39 个写了服务的页；4 个没有足够贴切的页，只作 example 不挂页：lasseter-1987，以及初拟里偏弱的 duarte-sparkline、disney-12-principles、murch-rule-of-six。
- **review：** 135 条记录的 review 数组收成一条。
- **结果：**
  - 产物：交付 26、管线 8、范例 55；
  - 写了服务页的 example 51 件、pipeline 8 件，另有 4 件交付写了服务页、待接受；
  - upkeep 为空。

## 后果

- 新的本地产物只在它能被取用时登记，种类与服务页在 consume 时写明。不确定是不是范例的，先不登记。
- 4 件待接受的交付，接受后才进入取用。
- Design 类书的收录照 ADR-047 的后续进行，按工具说明里的规则登记，不再先做一轮探索。
