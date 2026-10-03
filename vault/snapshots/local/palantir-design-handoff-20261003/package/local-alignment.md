# 本地对齐、映射与按需消费记录

## 当前实际基线

2026-10-03 UTC只读核对：本机主 Praxis HEAD 为 b76ece44264a4dd3efe767d3b4e8b829c8e7a778，与报告基线一致；工作树和暂存区无未提交改动。此前已读27份规范未变，本轮补读场景模板与demo准入；共29份相关文件与基线逐字节一致。

没有 .agents 目录。实际指令为根 AGENTS.md、kit/AGENTS.md 和 .claude/skills/writing/SKILL.md；写作skill是Kit Prose薄入口。未采用快照中的旧指令。来源仓库只读，没有checkout、reset、清理、merge、push或覆盖改动。

父明确指定本轮使用 gpt-6.1-sol；工具未暴露可独立观测的运行模型标签，按父指定记载，不将其当作内容阻塞。没有启动额外模型或Claude。

## 报告输入与状态差异

用户手动提供下载位置后，定向找到精确文件名，报告大小、UTF-8、标题及SHA-256均通过核对，见 [sources.md](sources.md)。

本机 palantir 仍只有两个README，保持原始7对象、0/7本地原件和registered/unverified历史登记。报告中的方法卡、更新入口、来源review和设计brief是拟议增量，尚未入库。报告的公开来源复查与本文改编，不自动增加仓库快照或改变采纳状态。

本包已完成原报告Palantir内容线的独立交接。方法仍为project-candidate，真实任务使用、方法效果与作品制作/验收尚未发生。A1–A4与Tally章节不进入包。

## 拟议路径改为实际包内位置

下列源路径为仓库相对定位，仅供本机复核，不是包内链接。消费者无需读取源仓库。

| 报告拟议落点 | 本机实际状态 | 包内映射 |
|---|---|---|
| palantir/research-decision-fit.md | 不存在；方法仍在报告中 | 主Markdown“方法卡”完整承载七项记录、分工、分支、反例及边界 |
| demos/palantir-discovery/README.md | 不存在；没有实现或验收 | 主Markdown承载目的、C1–C3/D1、E0–E4/S0/S1、自由度、验收与复用 |
| palantir/README.md、palantir/references/README.md 的拟议替换 | 本机仍是初始登记版 | 主文与sources.md区分当前仓库状态和新review覆盖 |
| vault/intake/palantir-review-20261002.json | 未应用报告草案 | sources.md以9条稳定来源ID保留范围，不复制整段原JSON |
| kit/work-system/field-loop.md 条件路由及demo/intake索引 | 本轮不修改 | 独立包直接从主Markdown进入，不链接拟议文件或声称索引已集成 |

## 现行规范取用

| 源相对定位 | 本次取用 |
|---|---|
| AGENTS.md；kit/AGENTS.md；.claude/skills/writing/SKILL.md；kit/README.md | 按任务进入，来源只读，中文成文与来源指令边界 |
| palantir/README.md；palantir/references/README.md | 初始状态、身份与缺口，不覆盖历史 |
| kit/reporting/README.md；kit/write/README.md；kit/write/prose/grammar.md | 读者、决定、成文与限定 |
| kit/write/shared/evidence.md；kit/write/shared/verification.md | 证据身份、改编记录与实际媒介验收 |
| kit/design/README.md；kit/design/grammar.md；kit/design/foundations/grammar.md | 旧grammar仅导航，规则在现行分支；审美在消费者项目裁决 |
| kit/design/composition/layout.md；kit/design/composition/encoding.md；kit/design/interaction/states.md | 同一输入比较、编码真实性、状态与可达性 |
| kit/design/motion/README.md；kit/design/motion/grammar.md | 运动目的、可中断、真实状态、减少运动与完整播放 |
| kit/write/motion/README.md；kit/write/motion/narrative.md | 分镜认知任务、信息驻留、音画与字幕 |
| kit/work-system/README.md；kit/work-system/field-loop.md；kit/work-system/field-governance.md；kit/grammar/work.md | 权限、责任、基线、额外劳动、状态与交接 |
| kit/verification/README.md；docs/governance/intake.md | 分层检查、原件披露与来源范围 |
| scenarios/_template/README.md；demos/README.md | 后续固定scenario/输入版本、模拟动作、失败与接收条件 |

当前规范没有通用renderer或已验收组件库，历史样张的固定时长、曲线、材质、字体或颜色不成为本交接模板。Write负责内容与时间叙事，Design负责表现；必要时分别取用。

## 本次改编裁决

| 内容 | 裁决及原因 |
|---|---|
| 报告方法卡与核心Design brief | 保留全部承重关系、身份、分支、验收和交付；改为单文件自足交接 |
| 原候补草案的M1–M6及设施维护算式 | 删除；原报告已有明确催单研究切口，泛化单元和另造算例会分散任务 |
| C1–C3/D1来源张力 | 保留作者归属、立场与范围，不合成公司doctrine |
| E0–E4、S0/S1与错误推理 | 保留语义；fixture.json只作机器可读结构化，不新增真实证据或收益数字 |
| 方法与设计入口链接 | 映射为主文段落与包内文件，避免访问尚不存在的源路径 |
| README/review/索引施工增量 | 仅保留来源、状态和集成边界，不应用到源仓库 |
| 媒介与taste | 保留激进探索与自主裁决；扩充候选形式不增加必做格式或参数 |
| 工程/理解验收 | 保留实际检查与成本；受众比较仅在声称效果且证据不足时安排，不成为开工门槛 |
| distill | 只作为来源加工方法记在本说明；不进入主文标题、正文或未来作品叙事 |

所省略的是原报告的仓库施工文本、无关章节、私人定位和非必要工程状态。消费者仍可理解完整Palantir内容线；不承担原报告全仓集成审查。

## Library 与后续

输入由用户手动下载解决，原规定helper下载失败已属历史记录。Library保存此前及一次有界恢复均报能力不可用，没有成功回执或新ID/版本。本轮没有证据表明流程恢复，未切换直接上传、未继续重试。

下一责任是协调者安排后续设计与私下审阅；制作方选择媒介、固定输入并实际验收。继续研究的正文、图表、快照与真实现场效果缺口见主文。本轮未启动Claude、制作HTML/视频、打开邮件领取链接、申领或使用credits赠金，也未依据疑似邮件的功能说法实施。
