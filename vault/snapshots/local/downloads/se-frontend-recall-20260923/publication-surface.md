# Schema Engineering · 对外阅读与发布面

## 2026-09-15 · 发布状态与跨仓入口

中文9.8已由`ec8d57ea9d2e69e84ebdc187472c5c50795804f7`的[Pages运行34778033066](https://github.com/lesPrivilege/Schema-Engineering/actions/runs/34778033066)发布。英文历史译文为9.6；当前入口因源绑定不匹配保持withheld。CourtWork工程采用9.6 / `d78fd312955c1f594e59cbdcbb0d3074ac355940`，其最新发布与开工基线为`caf3edbceb8cf9b535a28c547088874852752a1e`。

用户授权在现有main完成内容收敛并push部署，不开额外分支。Astra保留本地README/CHANGELOG已有的发布状态修正，公开README以中英文版本入口及独立CourtWork定义收敛，既有阅读页页脚仅加产品链接；不改Canonical/Practice、CSS、JS、图或语言门禁。新reader revision为2026-09-15，以独立文件保存Index修订而保全历史HTML。原文中的候选和未部署描述按各自日期理解，当前状态由本节及[本次发布回执](../qa/2026-09-15/README.md)接续。

下一轮SE从包含本回执的main实际HEAD接续；先读README/CONTRIBUTING和Index原条目。CourtWork产品任务回其current及原owner，SE只编订论文与出版设施。两个仓库的main都可作为新的接续节点，“fresh”只是当前基线的描述，不新增Fresh开发线。

## 历史发布面约定

2026-09-08 · 发布准备稿。本文只管理论文仓的公众入口、文本/图/版本及跨仓引用，不记录CourtWork产品任务或改变Canonical/Practice。具体编订与发布仍沿 [CONTRIBUTING](../../CONTRIBUTING.md)；当前候选/已发布必须分别查验。

## 对外定位草稿

**Schema Engineering**  
**Governing agentic work through stable, reviewable state.**

中文：

> Schema Engineering 是一组持续修订的工作论文，讨论 Agent 如何参与可提交、可恢复、可审阅的正式工作。它区分工作状态、供模型使用的上下文、候选提案与取得效力的变更，并考察这些边界如何影响执行、审阅、连续性与验证。

English:

> Schema Engineering is a series of evolving working papers on agent participation in work that can be committed, recovered, and reviewed. It distinguishes governed work state, model context, candidate proposals, and changes that acquire effect, and examines how these boundaries shape execution, human review, continuity, and evaluation.

首屏入口：Read the paper / 中文 / Practice / Experimental implementation。read链接指实际已发布Pages与带版本文件；英文入口只有对应内容完成翻译与复核后才出现，不能把英文README当成英文全文。

## 阅读结构

| 层 | 内容 | 责任 |
|---|---|---|
| README | 定位、短摘要、Canonical/Practice/Index入口、版本与引用、实现桥 | 最短理解路径；不复制完整论文 |
| 阅读Pages | 持续可读的文本、目录、图和版本切换 | 复用现有`papers/build.py`、`validate.py`与Pages链；设计更新不得重写历史发布物 |
| 固定文本/产物 | Canonical、Practice、Index及带日期/版本的文件 | 保持现有编订源和发布对应；PDF/英文全文未生成时不放下载按钮 |
| Practice/evidence | 来源、边界、检验和裁决 | 仍由Practice Index承担唯一逐项修订账本 |
| Citation/version | 真实作者/标题/版本/日期/固定URL，按需要生成引用信息 | 不编造DOI、学术发表或许可证；候选版本不写作已发布 |
| CourtWork桥 | 实验中的实现、采用的Paper SHA与固定工程证据 | 实现探索不等于Paper命题已被验证，不把产品状态复制到本仓 |

## 图与文案

首轮可围绕“State → Context → Proposal → Committed Change”与“Store → Govern → Retrieve → Compile”制作少量核心图，但每张图先对齐当版正文、标明转换与责任边界，再进入发布产物。箭头表示机制关系，不表示无需授权自动取得效力。

不采用讨论稿“Schema = model context = human review surface = persistent work state”的等号。状态与不同投影共享来源而承担不同责任；公众图不能为简洁而改变正文含义。CourtWork视觉可共用字标尺度与图表语言，论文页面仍以文本、注释、版本和阅读层级为主。

## 双语与版本

正文继续遵守中文为主的现有编订协议。若增加英文README或全文翻译，记录原文固定SHA、译文hash、语义复核日期、真实作者/复核者与遗漏范围（本次由AI翻译及非作者AI审读，不冒称人工签核）；结构/链接检查不能代替译文审阅。原文修订后把译文标为对应旧版或待同步，不同时维护两份独立Canonical。

历史登记：9.6 于 2026-09-08 获发布裁定并由 CourtWork `PAPER.md` 采用（`d78fd31`）。2026-09-14 的当前编订候选为 9.8，仍未推送或部署；英文绑定 9.6 并 withheld。历史登记不代表当前部署或工程采用值。对外入口应同时区分最新已发布阅读版本、当前编订候选与实现采用版本；具体值在每次发布前从源与远端工作流核对。

## 发版与交叉引用

当前Pages工作流在`main`上接收到`papers/**`、README、CHANGELOG或工作流相关变化时会构建发布。因此即使是本页这类说明文档，推到main也可能触发Pages。准备稿先本地/候选审阅；本轮用户安排的CourtWork候选push不自动触发SE 9.6发版。

实际发布沿现有build→validate→Pages工作流成功的判定，保留历史带日期产物；不为了两仓同日发布覆盖旧文件或临时升级Paper版本。只改变入口文案和链接时不触发论文版本号变化，但仍须核对发布工作流实际影响。

跨仓固定入口：[CourtWork main](https://github.com/lesPrivilege/Courtwork/tree/main)、[其采用的Paper版本](https://github.com/lesPrivilege/Courtwork/blob/main/PAPER.md)。产品发布/迭代计划保存在CourtWork `engineering/release/2026-09-08/`；本仓只保存论文发布责任。

## 来源消费

Chat《筹备两个仓库发布》（`6a9f20a0-898c-83ec-9813-a401199d00d2`）提供发布结构候选。REEF官方发布面的限定核验固定到`8e87829572b210572cad2008c28d39888b2b8396`：双语README、Docs与公开roadmap可作信息结构参考，详见 [其README](https://github.com/Human-Agent-Society/reef/blob/8e87829572b210572cad2008c28d39888b2b8396/README.md) 与 [结构同步检查](https://github.com/Human-Agent-Society/reef/blob/8e87829572b210572cad2008c28d39888b2b8396/.github/scripts/check_readme_i18n.py)。仅消费发布机制，不将REEF实例作为SE正文命题或验证结论；无需为本次入口筹备新增Practice Index观察。

## 2026-09-09 · CourtWork Pages 与本仓的关系

CourtWork 发布面于 2026-09-09 重开筹备（Courtwork `engineering/release/publishing-surface-2026-09-09/`，裁定 PS-1…PS-15）。与本仓相关的裁定：

- 页面定位为 repository → publication surface → executable evidence：Paper 提出命题，repo 给出实现，Pages 允许访客检查命题。页面引用 Paper 只用两种方式：`PAPER.md` 所列 9.6 三份文本的固定 SHA 链接，以及本仓的最新阅读入口。页面需要而 Paper 没有的句子写在页面，不写进 Paper。
- 本批不修订 Canonical、Practice 或 Index；发布面筹备不产生 Practice Index 观察。页面的命题段引用 9.6 摘要链 B 与 §4.6 / §4.9，转写须与当版正文语义一致，"Schema = model context = review surface = work state"的等号写法仍不采用。
- 语言：一页，中文为主，English 保留在字标、命题句、术语、UI 词与代码处；不做机械双语两版。本仓英文 README 或全文翻译仍按上文"双语与版本"的条件处理。
- 本仓 Pages 入口仍是论文三视图，不另建 landing page。论文页页脚加一条指向 CourtWork Pages 的链接是 `infra:` 候选：push 会触发本仓 Pages 重建，留用户裁定，宜与 CourtWork main 推送同期。
- CourtWork 本地 main 领先远端 135 个提交（2026-09-09）；其 Pages 由 main 的 workflow 构建，未推送则不部署。本仓不代行推送。
- 用户同日转交的商业化与 Eval 两条线只在 CourtWork 登记；Eval 的可复现部分进入 CourtWork Pages 证据区，八问结构（What was tested · Against what · With which model · Which harness · Which fixture · What was held constant · What failed · Can I reproduce it），有界模型 pilot 未跑之前不出现对比分数。商业化不进页面。是否形成 Practice Index 观察，待有固定工程证据后另议。

## 2026-09-10 · 阅读器与英文独立编译

用户已授权将本地材料、阅读器与译文合并推送。中文继续采用自然中文与必要的英文术语；三份英文全文是固定中文源的派生 cache，由独立入口编译，不成为第二套 Canonical。来源固定到 `a0234bc42dda75767554a2da89c247d66c2ad022`，hash、实际复核范围与遗漏在 `papers/translations/` 登记。旧日期发布物不重写；本次使用独立 reader revision 文件，论文仍为9.6。

阅读页保留 Canonical / Practice / Index 三种职责，采用冷白、灰阶和稀疏的 review 提示色。语言切换须保留当前文档与章节，页面不依赖外部字体或运行服务。发布完成以 Pages 工作流结果为准。

## Reader controls · 2026-09-11

Canonical / Practice / Index 为中英文阅读页共用的三宗标签。移动端三宗导航与语言、主题两个控件保持同一行，两组分居左右；均保留44px高的触控区域。只修阅读设施，9.6正文、译文与历史产物不改；本次reader revision单列2026-09-11。
