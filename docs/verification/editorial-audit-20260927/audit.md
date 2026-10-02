# Kit 体例与阶段材料审计 · 2026-09-27

## 裁决摘要

本次按 [文档结构契约](../../architecture/documentation.md)、[入账规范](../../governance/intake.md) 和 [ADR-015](../../decisions/015-kit-editorial-contract.md)审计当前未提交工作树。契约已提出 Kit、候选研究、历史证据与实现状态的边界，但 Kit 内容仍以较扁平的页面和能力表组织，实际消费尚未完全按任务与工作 mode 落地；`scenarios/`、`demos/`、`templates/` 的入口在抽样中能说明产物和前置条件。最需要处理的是：能力测试主题的当前入口仍把已完成的页面和视频写成未来阶段，旧施工工单继续被导向为当前任务；若直接公开或同步仓库，已跟踪原件和索引元数据仍须先审查披露范围。

审计只提出处置，不迁移、删除或改写规范。历史验收、原 Chat、来源卡和旧工单作为当时证据保留；它们的旧状态不是“错误事实”，问题在于当前入口没有标明时间与替代路径。审计角色为 Sol；最终采用与编订由 Astra/main 裁决。

迁移前的内容职责建议：材料任务从 [Reporting brief](../../../templates/reporting/README.md) 确定读者与所需决定，由 [Reporting grammar](../../../kit/reporting/grammar.md) 拥有 artifact family、论证、证据和内容结构；只有进入对外中文成文时，加载项目 Writing skill 处理句法、语体和段落；需要图表、视觉、界面或动效判断时进入 [Design grammar](../../../kit/design/grammar.md)；交付按 [Kit 验收](../../../kit/verification/README.md) 收束。[能力测试回答体例](../../../kit/reporting/assessment-answer-profile.md) 属开放题专用 profile，不应被读成所有材料的默认文体。当前 `kit/README.md` 的任务表可承接这条路径，能力表应回到查定义与状态用途；内容搬运由主代理按实际消费者决定，不预建空分支。

## 范围和方法

审计开始时 `rg --files` 枚举 1,339 个非忽略文件：`kit` 24、`docs` 58、`templates` 6、`scenarios` 2、`demos` 1、`vault` 1,248。核心治理文档共 81 个 Markdown/JSON；另对 Vault 入口、106 个 distilled Markdown 中的高风险阶段材料及索引、目录职责作有界抽样。实际逐行细读 47 个文件，清单见 [inventory.json](inventory.json)。目录完整性扫描未发现 Kit、Docs、Templates、Scenarios、Demos、Vault distilled/intake/provenance/references/archive 的可见目录缺 README；快照副本中的目录不按本仓库新增目录规则裁判。

`vault/snapshots` 582 个、`vault/archive` 20 个、`vault/provenance` 与 `vault/references` 合计 454 个文件，仅盘点入口、身份与披露生命周期，未逐件审校原文；rendered/motion 生成物及源码只核对入口与少数路径。没有重验外部 URL、原仓库、页面视觉、视频播放、文档所述产品行为或未保存依赖。并行新增的 `vault/distilled/layout-specimens-20260927/` 是待手动派发的合成样张 brief，尚无样张；仅记为审计期间的新材料，不对其内容另作判断。

## 发现

### F1 · P1 · 当前主题入口把已形成的产物写成未执行

- **定位**：[主题 README](../../../vault/distilled/ai-capability-assessment/README.md#L3) 第 3、10–12、29 行；[交付蓝图](../../../vault/distilled/ai-capability-assessment/delivery-plan.md#L3) 第 3、34–36 行。相反，[rendered README](../../../vault/distilled/ai-capability-assessment/rendered/README.md#L3) 第 3–10 行和 [motion README](../../../vault/distilled/ai-capability-assessment/motion/README.md#L3) 第 3–11 行已记录页面与视频路径。
- **契约与影响**：`documentation.md` 第 8、19、42 行要求 README 给当前状态和下一产物，回执注明版本与范围。新读者从 Kit 的 [Reporting 入口](../../../kit/reporting/README.md#L18) 到此，会把旧的“尚未生成页面”“交给 Claude 实现”当成当前计划，找不到现有呈现及其未完成验收。
- **建议**：修导航并补状态。主题 README 用日期分开“历史研究/施工输入”和“当前可查产物/未验收”；把 rendered、motion 与各自 verification 作为现状入口。交付蓝图保留原貌或加历史阶段说明，停止作为当前执行指令。不要据文件存在声称视觉、交互或招聘交付通过。

### F2 · P1 · 原件披露边界有规则但尚无发布前清单

- **定位**：[入账规范](../../governance/intake.md#L29) 第 29–33 行已经明确原件本地索引不构成外发授权、索引元数据也须检查；[Kit Design 参考](../../../kit/design/references.md#L7) 第 7 行直接写本机用户名和源仓库绝对路径；[frontend catalog](../../../vault/distilled/frontend-design/catalog.json#L13) 第 13、21、29、37 行也保存本机源仓库路径。审计时 `git ls-files` 显示 `vault/archive/chat` 17、`vault/snapshots` 545、`vault/chat-inventory.json` 与 `vault/registry.json` 各 1 个已跟踪文件，合计 564 个。
- **契约与影响**：这是披露准备缺口，不能由 `vault` 目录名或 `.gitignore` 自动化解。若将 Git 历史、仓库或生成索引交给外部，原件内容和身份/路径信息都可能随之传播；本审计未发现也未声称这些文件已经公开，亦未逐项判定敏感性。
- **建议**：保持原件及稳定 ID；在任何公开/云端交付前按目标受众列出实际同步集合，逐项审查原件、catalog、README 和生成投影，决定需要泛化、过滤或独立存储的范围。物理分仓、历史清理和迁移须另做消费者盘点与决定，不在本审计执行。

### F3 · P1（并行变更组）· 答卷改名后的旧路径和重建约定未收敛

- **定位**：[rendered README](../../../vault/distilled/ai-capability-assessment/rendered/README.md#L9) 第 9–12、31 行仍指 `answer.html`/`answer.pdf`；[build.py](../../../vault/distilled/ai-capability-assessment/rendered/build.py#L364) 第 364–366 行仍输出旧名；[argument tree](../../../vault/distilled/ai-capability-assessment/argument-tree.md#L9) 第 9 行起有旧锚点。审计前其他并行工作已经删除/改名两个原文件，已有约 40 处断链。
- **契约与影响**：当前入口与构建行为可能把旧文件重新生成为并列版本，读者也无法沿稳定链接到现有产物。这是**一个改名生命周期问题**，不按断链数充作 40 个问题。
- **建议**：由现有答卷改名工作所有者统一确定 canonical 文件名，随后同步生成器、PDF 命令、README、相对锚点及验证回执，并运行链接检查。本审计不抢改这些文件。

### F4 · P2 · Vault 首层说明仍停留在早期单一批次

- **定位**：[Vault distilled README](../../../vault/distilled/README.md#L1) 第 1–3 行把整个目录定义成 `enterprise-kit.json` 的结构化消费；同一文件第 34–46 行已经汇集能力测试、前端设计、Agent Runtime 与 Write/Design 等不同批次。[Vault README](../../../vault/README.md#L21) 第 21 行称 2026-09-20 的研究为“本轮”，第 23–25 行已有之后的材料。
- **契约与影响**：`documentation.md` 第 3、8 行要求 README 说明目录职责和选路。首次进入 Vault 的读者可能误以为后来主题都来自早期原 Chat，或把旧“本轮”当当前工作。
- **建议**：修导航。distilled 首页改为跨批次主题路由，早期 enterprise-kit 放在其专属小节；Vault 首页用日期标历史研究，不以无时效的“本轮”描述它。

### F5 · P2 · Intake 首页保留已过时的“入口预留”

- **定位**：[Intake README](../../../vault/intake/README.md#L23) 第 23 行把 platform-product 的 distilled 三文件称为“后续消费入口预留”，而 [distilled README](../../../vault/distilled/README.md#L32) 第 32 行及文件本身已提供实际入口。
- **契约与影响**：登记页的处理状态会落后于真实消费，干扰 `discover → register → distill → index` 的追溯判断。
- **建议**：补描述，仅把这句更新为“已形成的提炼入口”，保留当时的材料覆盖与引用缺口；不改登记原件身份。

### F6 · P2 · Design 活跃索引仍集中承载一次答卷的风格裁决

- **定位**：[Design 参考](../../../kit/design/references.md#L32) 第 32–37 行的 C20–C25 含阅读进度线、奶油纸底/Didone、Vercel 字阶、Clerk 渐变等一次答卷采纳或拒绝；同页第 57 行 P01 才把答卷标为历史 specimen/profile。[Design README](../../../kit/design/README.md#L11) 第 11、13 行已明确项目 profile 与跨项目规则的边界。
- **契约与影响**：ADR-015 裁决项目配色、字体和动效参数留在 Vault profile；参考索引可保留稳定 ID，但在活跃 Kit 主表连续展示项目 taste，增加新任务把 `accepted/rejected` 误读为通用判断的机会。现有边界文字缓和了风险，因此是导航清晰度问题，不是宣称已错误晋升。
- **建议**：合并入口，不删历史。主索引保留 ID、来源身份、消费位置和一行边界；把详细答卷风格取舍集中到已有 [design profile](../../../vault/distilled/ai-capability-assessment/design-profile-20260924.md)。通用 grammar 只接受可迁移的判断和失败路径。

### F7 · P2 · UI 候选入口缺选择触发和退出依据

- **定位**：[Kit UI README](../../../kit/ui/README.md#L3) 第 3–7 行列出九个候选组件、状态矩阵、Ant Design 与 Storybook 方向；[Kit 总入口](../../../kit/README.md#L28) 第 28 行把 UI 标为“组件候选，无实现”。
- **契约与影响**：状态标注准确，但 `documentation.md` 第 21–23、34 行要求活跃 Kit 内容说明必要性、重复消费者、使用入口和重访/退出。当前 UI 页面未说明哪个具体场景触发这些候选，怎样验证组件取舍，何时停止推荐 Ant Design/Storybook。读者可能把候选清单当成默认采购或实现计划。
- **建议**：补描述或降级。保留当前状态矩阵作为场景填写时的检查参考；为组件/工具候选补“仅首个 demo 确定后选择、由场景契约与 fixture 验证、未采用则回到研究参考”等触发与退出条件。没有消费者前不新增空组件目录。

### F8 · P2 · Frontend 提炼首页的归属说明过窄

- **定位**：[frontend-design README](../../../vault/distilled/frontend-design/README.md#L3) 第 3–7 行称目录仅保存 Courtwork 记录；[catalog](../../../vault/distilled/frontend-design/catalog.json#L14) 第 14–44 行列有 career、Schema Engineering 和解释可视化上游；首页第 9–11 行又引用了跨来源材料。
- **契约与影响**：目录职责与真实内容不一致，可能让读者跳过非 CW 来源，或把跨来源综合误归于 CW；违背 README 的职责与取用边界要求。
- **建议**：补描述。首页写明是多来源的前端设计消费索引，按“CW / SE / career / 上游方法”选路，明确各自证据等级；catalog 的来源身份和历史消费记录保持不动。

## 正确保留的历史证据

- [assessment-layout-review](../assessment-layout-review-20260923.md#L3) 第 3、11–15 行记录当时静态截图范围、未通过与后续授权；[Astra 验收](../assessment-astra-20260923/README.md#L3) 第 3、15–23 行把文字修订、浏览器限制和未验收分开。这些记录不应因后续页面存在而改写为“已通过”。
- [write-design-grammar README](../../../vault/distilled/write-design-grammar/README.md#L3) 第 3、25–33 行将 Chat 候选与 ADR-015 采纳范围分开；[reference semantics](../../../vault/distilled/design-reference-semantics/README.md#L24) 第 24、67–95 行区分本地消费、证据和候选。它们属于 Vault 研究层，重复解释是追溯用途，不等于规范重复。
- [writing-structure 补充提炼](../../../vault/distilled/writing-structure-20260927/README.md#L40) 第 40–57 行保留未快照和 missing-original 边界；[Design 参考](../../../kit/design/references.md#L5) 第 5、7 行也明确在线读取与历史源坐标。审计没有把这些缺口误记为已核实来源。

## 可独立分派的文件所有权工单

| 工单 | 文件所有权 | 完成条件 | 前置/冲突 |
|---|---|---|---|
| A · 当前能力测试入口 | `vault/distilled/ai-capability-assessment/README.md`、`delivery-plan.md`、`five-page-outline.md`、`claude-paste-order.md` | 当前产物、历史阶段、未验收项分开；从 Kit Reporting 到 rendered/motion 有明确路线 | 与答卷改名工单确认 canonical 文件名后定稿；不改 rendered 实现 |
| B · Vault 主题导航 | `vault/README.md`、`vault/distilled/README.md`、`vault/intake/README.md` | 首层目录职责准确，旧批次有日期，预留状态更新 | 可独立于答卷源码；避免重写登记 JSON |
| C · Design 参考收敛 | `kit/design/references.md`、`vault/distilled/ai-capability-assessment/design-profile-20260924.md` | 保留 C/U/P 稳定 ID，项目 taste 归 profile，主索引说明取用条件 | Astra 裁决跨项目取用；不改来源 catalog |
| D · UI 候选准入 | `kit/ui/README.md` | 说明场景触发、实际消费者、验证和重访/退出 | 首个 demo 尚不存在；不创建运行组件 |
| E · Frontend 首页 | `vault/distilled/frontend-design/README.md` | 多来源归属和选路与 catalog 一致 | 可独立；不改 catalog 身份 |
| F · 答卷改名收敛 | `vault/distilled/ai-capability-assessment/rendered/` 及所有旧 `answer.html/pdf` 链接 | 一套 canonical 文件名、构建和 PDF 命令一致，链接检查无旧路径 | 已由并行工作所有者处理；不得与 A 同时编辑 README 相同文件 |
| G · 披露范围清单 | 新的交付范围/发布清单及相应消费索引；先盘点，文件所有权另定 | 对指定外发目标逐项列入/排除原件和元数据，说明替代路径 | 涉及发布边界与历史清理，需先确定实际消费者；本审计不迁移 |

## 验证与限制

本审计验证了列出的当前文件内容、路径是否存在、目录 README 分布、`rg --files` 数量及 `git ls-files` 的已跟踪原件数量。没有执行全库 validator；答卷旧路径断链为开工前并行改名的一组已知问题，交由主代理整体验证。未核实外部网页现状、未保存快照依赖、源仓库现状、实际用户消费效果及公开渠道同步配置。覆盖是体例和入口的定向审计，不是 1,339 个文件的逐行审校，也不构成视觉、浏览器或视频验收。
