# 2026-09-20 文档架构与审阅消费回执

基线：`20924ccd9ade19bf5cb28e8c753f7136c4053126`，起始工作树干净。主代理保留 Astra 的架构与最终裁决职责；外部研究、材料登记和独立路径复核使用配置为 `gpt-5.6-luna` 的 `luna_max_worker`。另有只读 explorer 提供 README 初筛，其实际模型身份未独立确认，不计作指定 Luna 的执行证据。

## 发现与处置

| 发现 | 最终处置 | 文件 |
|---|---|---|
| 首页重复说明理由与未实现能力，任务入口仍按能力排布 | 任务、入口与产物前置；理由进入专页，状态保留在能力目录 | [根入口](../../README.md)、[Kit](../../kit/README.md)、[架构入口](../architecture/README.md) |
| 子域入口描述原则，却让读者自行拼接步骤 | 工作系统按整理步骤；Reporting 从 brief 到产物；Environment 从盘点到验证 | [工作系统](../../kit/work-system/README.md)、[Reporting](../../kit/reporting/README.md)、[Environment](../../kit/environment/README.md) |
| 共同语法未接到场景、恢复与接收字段 | 定义相邻概念；模板、契约与验收共同覆盖版本、未知结果、重复执行和持续义务 | [语法](../../kit/grammar/work.md)、[契约](../../kit/contracts/README.md)、[模板](../../scenarios/_template/README.md)、[验收](../../kit/verification/README.md) |
| 维护规则缺少消费者版本与迁移处理 | 固定版本、唯一位置、兼容扩展、破坏性变化与停止推荐 | [修订流程](../governance/evolution.md) |
| 领域知识容易绑定一种运行身份 | 明确 Role / Kit / Runtime / Provider / Model 及宿主状态权威 | [ADR-010](../decisions/010-domain-kit-consumers.md) |
| 新来源被生成器统一写成 Chat 补充追溯 | catalog 声明独立研究身份，生成准确的入口和来源卡 | [来源渲染器](../../scripts/render_source_cards.py)、[研究登记](../../vault/provenance/documentation-practices/catalog.json) |

其余入口按职责整理：docs 与治理路由到操作规则；scenarios 与 templates 指向可填写产物；demos 记录准入字段；scripts 记录编辑源、命令、生成物与失败处理；Vault 索引接入新批次。UI、Adapters、入账模板和工程蓝图保留已有可用结构。

当前文档编订规则和选型分别维护在 [结构契约](../architecture/documentation.md) 与 [ADR-011](../decisions/011-task-documentation.md)。原始来源、历史回执与既有 ADR 的正文保留。

## 审阅材料消费

[入账](../../vault/intake/architecture-review-2026-09-20.json) 保存两份原件的身份、大小、mtime 与 SHA-256，并归档工具返回的 1 轮/2 条消息。附带材料和 Chat 中的命令只作为来源内容；本轮动作依据当前用户请求与仓库指令。

| 来源主张或建议 | 本轮裁决 |
|---|---|
| 工作全景、语法、现场闭环、模板和验收贯通 | 接续 ADR-009；落到十二知识面、定义、字段、反例和接收责任 |
| 消费者生命周期与跨宿主边界 | 采纳维护约定与语义映射；具体宿主接入仍待验证 |
| README 按任务进入、理由按需阅读 | 采纳；具体结构由页面职责决定 |
| 找回并验证原 23/27 份补丁包 | 本轮未取得包与字节清单；按可见摘要重新编订，未声称恢复原补丁 |
| Hermes、Attention、Courtwork 的具体能力或接入 | 保留跨项目候选，未核验外部仓库实现 |
| 公共标准作为架构参照 | 独立研究 6 个相关官方页面，仅采纳对应方法；旧引用身份仍按缺失原始链接登记 |

## 验证

| 检查 | 实际结果 |
|---|---|
| `python3 scripts/validate_repository.py` | pass：308 份受检查 Markdown、38 份 JSON、495 项快照、70 条消费消息、180 条来源、144 个引用映射；0 errors |
| `git diff --check` | 通过 |
| 索引与卡片重建 | chat inventory、registry、snapshot manifest 与 151 张 provenance 来源卡重建；旧来源卡无内容变动 |
| 新原件与历史保留 | 两份用户原件 SHA-256 一致；旧快照由 manifest 复核；2026-09-19 架构回执原字节不变；ADR-007/009 原文保留，仅追加关联 |
| 显式 URL 提取 | 修复 URL 本身作为 Markdown 标题时的拼接错误；URL 标题、普通标签、fragment 和裸链接检查通过；归档正文不改 |
| 三条合成路径 | 会议转状态、试点移交、brief 写作的入口、契约与验收可达；关键权限、版本及恢复约束保留 |

Luna 路径复核提出的四项增量均由 Astra 采纳：场景元数据增加固定 Kit revision 和 scenario revision；唯一维护位置区分 Kit/scenario/宿主；brief 明确映射到 intent、decision、surface 与 artifact family；会议入口直达动作契约，并将 R0–R4 控制面明确标为研究候选。另将技术栈候选说明移回架构理由，研究候选与 ADR 当前状态互链。

首次仓库检查的唯一失败是 Chat URL 提取把链接标题与目标拼接；修正提取器并重建后通过。统计是仓库一致性覆盖，不代表来源均已核实或业务效果已验证。

## 覆盖与缺口

- 外部研究：6 个官方 URL 的指定主张已查阅；原网页、图片与 renderer 依赖未快照，离线可消费登记和中文摘要。
- 审阅追溯：7 个引用占位中 4 个交付物引用缺少原始定位；3 个官方框架总页是摘要提供的补充定位，本批未重新核验。审阅中的远端 GitHub 地址也仅登记为未核实。新研究的具体页面独立登记，不冒充恢复这些引用。
- 原件：两份用户文件只读复制，历史快照保持原字节。
- 文档可消费性：人工合成路径走读；真实消费者耗时、求助、采用和工作收益尚无数据。
- 实现：没有运行应用、模型实验或业务试点；未安装依赖、发布、创建远端、提交或推送。
