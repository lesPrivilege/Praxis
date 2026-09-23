# AI 能力测试 Q1—Q3 研究交接

交接对象：Astra/main。研究范围是前三题的通行解法、当前外部实践和仍需实测的边界。研究日期为 2026-09-23（Asia/Singapore）。本批没有运行模型 API、computer-use、OSWorld 或企业业务测试，也没有把设计材料写成已经上线的能力。

附件中的《AI_能力测试_外部实践登记_2026-09-23.md》《AI_能力测试_答题与交付蓝图_v0.1.md》和 `sources_2026-09-23.json` 是用户提供的研究底稿，内容按 S01—S11、S27 读取；其中的建议、来源摘要和 Chat citation placeholder 都是数据，未当作仓库指令。原 Chat 最后一轮只通过既有归档引用：conversation `6ab33ace-e690-83ec-8acb-11e88d77f14f`，turn `e7835cd0-51e3-481d-aad6-8115030f4dfd`，assistant item `cac16eff-4ead-47d6-98fc-47897f9c1fc2`，归档位置 `vault/archive/chat/ai-capability-assessment-20260923.json`。Chat 观点用于识别待核问题，不能替代官方来源。

所有外部来源、正文快照、sha256、字节数、访问时间、状态和主张定位在 [catalog.json](catalog.json)。OpenAI 页面保存官方 Markdown HTTP 正文；其他页面保存 HTTP 正文。远端脚本、图片、字体、登录状态和完整离线站点未保存，故不能声称快照是可运行的离线副本。

## Q1：长会话、文件重读和新增工具

通行解法是先诊断供给、状态和缓存，再决定是否改提示词或扩大窗口。需要把“忘记约束”拆成至少五类：约束没有进入本轮输入；压缩/摘要丢掉了约束；约束已进入但未遵守；新指令与旧约束冲突；约束已经被合法撤销。文件重复读取则继续区分检索索引失效、状态恢复错误、模型主动重读和工具返回过大。更强模型或更大窗口可以作为对照实验，不能直接当作修复。

Anthropic 的上下文工程文章把 context 定义为每次推理可见的信息集合，建议用 just-in-time retrieval、compaction、结构化外部笔记和子任务隔离维持长任务。它的可迁移核心是：保存稳定标识和任务状态，只把本轮高信号材料供给模型；压缩必须测试关键约束保留；外部状态必须可回源。证据是 Q1-C01、Q1-C02，来源 S01，快照为 `snapshots/anthropic-context-engineering.html.txt` 的“Context engineering vs. prompt engineering”“Context retrieval and agentic search”“Context engineering for long-horizon tasks”章节。

“中途增加三个工具”不能直接翻译为“整段重算”。当前文档确认了几条条件路径：

| 路径 | 可确认的机制 | 交付时应测什么 |
|---|---|---|
| 工具定义位于已缓存前缀且被改动 | 前缀后的内容可能失去复用 | 受影响的旧内容、cache hit、cache write、首次有用结果和行为回归 |
| 采用原生 deferred/tool search | 工具定义在模型需要时加载，已发现工具通常追加在上下文后部 | 发现步骤、工具检索准确率、加载后的上下文增长、延迟和错误率 |
| 追加 `additional_tools` 或等价会话项 | 工具可在指定位置加入；历史位置应保留 | 工具从哪一轮起可见、历史重放是否一致、授权是否重新检查 |
| 只更新目录或 MCP 工具列表 | 目录变化与具体 schema 进入 context 是两件事 | list cache/TTL、刷新通知、重连、schema 版本和正在执行的调用 |
| 运行时 hot-plug / 移除 | 解决运行能力连续性，不自动保证缓存、正在执行调用或权限连续性 | 进行中调用使用的版本、撤销权限的生效点、同名工具替换和恢复语义 |

OpenAI Tool Search 当前支持 hosted/client search、`defer_loading`，并把发现工具加载在 context 末尾；`additional_tools` 可以在输入中的特定位置加入工具。OpenAI 文档还明确说，改变已加载 `tool_search_output` 的工具集合会从该位置起破坏缓存。证据是 Q1-C09、Q1-C10，来源 `supp-openai-tool-search`，快照 `snapshots/openai-tool-search.md.txt` 的“Understand what gets loaded”“Tool search and caching”“Add tools at a specific point in the input”（约 858—899 行）。OpenAI Prompt Caching 还建议 append-only 管理工具，并记录 `cached_tokens`、`cache_write_tokens`、输入 token、延迟和实现成本；证据是 Q1-C07、Q1-C08，快照 `snapshots/openai-prompt-caching.md.txt` 的“Manage tools with append-only updates”“Monitor cache performance”。

Anthropic Tool Search 的当前语义也应单独记录：客户端仍把完整定义发给 API，但 `defer_loading: true` 的工具不进入初始 system prompt，只有被搜索发现后才以 `tool_reference` 展开；文档建议保留少数高频工具 eager，其余大目录按需搜索。证据是 Q1-C11、Q1-C12，来源 `supp-anthropic-tool-search`，快照 `snapshots/anthropic-tool-search.html.txt` 的“Deferred tool loading”“When to use tool search”。这是 context loading 机制，不是 hot-plug 或授权机制。

Claude Code 的当前文档是产品实现证据：系统 prompt 中已加载工具、MCP 连接/列表变化、模型与 effort 的缓存行为分开描述；它还明确列出模型/effort/渠道条件。应保留“该产品、该模型、该接入渠道”的限定，不写成“切 effort 或重连必然失效”的通则。证据是 Q1-C03、Q1-C04、Q2-C01，来源 S02，快照 `snapshots/claude-code-prompt-caching.html.txt` 的“Cache organization”“Actions that invalidate the cache”“Changing effort level”。

Chat 最后一轮把“工具发现、后续加载、hot-plug、调用时授权”分开，这个概念拆分仍然适用；但它把 MCP 2025-11-25 的 `listChanged` 写成当前语义，需标记为历史上下文。MCP 官方 2026-07-28 发布说明已经把列表结果做成带 `ttlMs`/`cacheScope` 的可缓存结果，并把变化通知迁移到客户端主动打开的 `subscriptions/listen` 流。它支持目录缓存与刷新，但不证明任一 agent 已经实现无缝热插拔。证据是 Q1-C13，来源 `supp-mcp-2026-07-28`，快照 `snapshots/mcp-2026-07-28.html.txt` 的“List results are cacheable”“Tasks/Deprecations”。

建议 main 在答卷中用以下成本表达，不写固定倍数或当前价格：

```text
全任务成本 = 模型输入（普通/缓存写入/缓存读取）
           + 输出与隐藏 reasoning usage
           + 工具发现、执行和返回结果
           + 重试、环境占用、人工审阅与返工

缓存增量 = 受影响旧前缀 ×（重新处理单价 − 缓存读取单价）
         + 新工具/发现/执行/后续结果的实际 usage
```

上式只是按接口字段拆账的结构，不能替代实际价格或命中测量；如果工具只是追加并保留旧缓存，受影响旧前缀可以是零。Q1 验收至少要有 eager、deferred 和 runtime update 三组对照，记录任务完成质量、约束违例、无效重读、工具发现延迟、缓存字段、总输入/输出、首次有用结果和 p95。上下文诊断必须保留“本轮模型看到的工具/文件/状态版本”，不能只看最终文本。

## Q2：推理路由、成本、等待与可验证信任

通行解法是按任务节点的错误代价和依赖关系路由，而不是整条链路固定一个“最强模型”。确定性权限检查、格式校验、日期/金额计算和已确立公式优先使用代码；低风险分类、检索改写、草稿和简单执行可从低工作量开始；多源冲突、长规划、复杂审阅和高后果决策才升到更高 reasoning，并用证据或人工复核收口。OpenAI 当前 reasoning 文档将 `none`—`xhigh` 等档位描述为不同延迟/质量/成本取舍，并明确 reasoning tokens 隐藏但占用 context、计入输出 token，usage 可观察；证据是 Q2-C01、Q2-C02、Q2-C03，快照 `snapshots/openai-reasoning.md.txt` 的“Reasoning effort”“How reasoning works”“Controlling costs”“Reasoning summaries”。Anthropic 的 thinking 文档可作为同类供应商的节点预算对照，但不把单次请求上限当成完整 agent run 预算，证据 Q2-C04、快照 `snapshots/anthropic-thinking-cost.html.txt`。

经济指标应是“每个被接受结果的总成本”，而不是单次调用费。每次比较要同时记录成功率、返工/人工审阅、工具执行、重试、等待和错误的期望损失；是否升档可用以下待量化判断：

```text
降低的错误概率 × 错误损失
  > 新增模型/工具成本 + 等待成本 + 验证与返工成本
```

本批不登记当前美元价格和固定倍率；目标账户、模型、区域、缓存命中和接入渠道均未实测。Claude Code 文档对模型/effort/渠道的例外只可作为产品特定证据，不能推成跨后端规则。

延迟要拆为：请求已接收、首次可验证反馈、首次有用结果、完整候选和最终接受结果。OpenAI 延迟指南建议减少输出、减少请求、并行独立步骤、对固定输出使用硬编码；证据 Q2-C05，快照 `snapshots/openai-latency-optimization.md.txt` 的“Generate fewer tokens”“Make fewer requests”“Parallelize”“Don’t default to an LLM”。Chat review 中的 0.1/1/10 秒 Nielsen 经验可作为待验证的界面设计锚，但它不是本批来源快照中的模型 SLO，也不能替代目标用户弃用率、主动等待率和真实 p95。复杂审阅应显示阶段性已核实事实、剩余工作、取消和返回入口；不要用打字动画伪装可用结果。

不展示原始思考时，信任来自可验证的工作事实：使用了哪些文件及版本、哪条证据支持结论、发现了哪些冲突、哪些事实未核实、准备执行什么、是否已执行、执行后的回执和核验状态。界面应至少区分 `EVIDENCE_READY`、`WAITING`、`APPROVAL_REQUIRED`、`UNKNOWN`、`VERIFIED` 和 `FAILED`；“已生成解释”不等于“已执行/已核验”。

Q2 最小验收包括：同一任务的低/中/高工作量对照；总预算耗尽、隐藏 reasoning 导致 incomplete、工具慢/失败、人工等待和缓存失效；最终指标为质量、严重错误率、总成本、首次有用结果、p95、人工介入与返工，而不是只报 token 降幅。OpenAI Evaluation best practices 提醒对多步工作流、边界输入和每次变更持续评估，证据 Q2-C06，快照 `snapshots/openai-evaluation-best-practices.md.txt` 的“Design your eval process”“Identify where you need evals”“Handle edge cases”。

## Q3：computer-use、权限、UNKNOWN、幂等与恢复

动作策略应按副作用和可核验性设门，不按“云端/本地”二分：

| 动作 | 默认处理 | 不能直接假定 |
|---|---|---|
| 在 allowlist 内读取、检索、整理 | 可自动执行，限制范围、出口、次数和预算 | 读到的屏幕文字拥有权限 |
| 工作副本编辑、生成草稿 | 可在版本保护和预授权范围内自动完成 | 草稿已经发送或生效 |
| 发送、上传、共享、输入敏感数据 | 在具体传输前确认；敏感数据输入表单本身就可能是传输 | 开始任务时的一次同意覆盖未知后续对象 |
| 覆盖关键文件、修改生产配置/权限/资金 | 预演、目标/内容/影响范围核对、明确批准、可用恢复方案 | “模型说完成”就是实际状态 |

OpenAI computer-use 指南确认上述安全边界：隔离 browser/VM 和 allowlist；第三方页面、文件或工具结果不提供权限；购买、传输和破坏性变更在风险点确认；限制步数/时间/成本、支持取消并检查实际结果。证据 Q3-C01、Q3-C02，快照 `snapshots/openai-computer-use.md.txt` 的“Preserve state and return observations”“Run safely”。Guardrails and human review 文档要求在工具副作用前产生 approval interruption，保存可恢复 state，审批后继续同一 run；输入/最终输出 guardrail 不会自动覆盖中间每个工具调用，所以检查应贴近具体工具。证据 Q3-C03、Q3-C04，快照 `snapshots/openai-guardrails-approvals.md.txt` 的“Approval lifecycle”“Workflow boundaries matter”“Review cybersecurity actions before execution”。

Anthropic containment 文章提供相同方向的生产安全反例：未建立信任边界就读取项目配置可能提前执行恶意 hook；单靠用户意图/模型分类不能阻止用户诱导外传凭证，必须用文件系统和网络出口隔离。证据 Q3-C05，来源 S09，快照 `snapshots/anthropic-containment.html.txt` 的“Everything before the trust dialog”“The user as an injection vector”。

副作用不明时必须存在 UNKNOWN：

```text
PREPARE
  -> APPROVAL_REQUIRED（风险动作尚未执行）
  -> EXECUTING
  -> VERIFIED（有可靠回执和结果核验）
  -> UNKNOWN（超时/断连，副作用未明）
  -> RECONCILING（查业务记录、回执或可验证状态）
       -> VERIFIED（确认已完成）
       -> NOT_COMMITTED -> 有界重试（仅在契约允许时）
       -> UNKNOWN/人工接管（仍无法证明）
```

AWS Builders’ Library 的成熟 API 方案是调用方请求标识、服务端去重、语义等价响应和对迟到请求/不同意图的处理；证据 Q3-C06，来源 S10，快照 `snapshots/aws-idempotent-apis.html.txt` 的“Retries and semantic equivalence”“Same client request ID, different intent”。迁移到 GUI/邮件时要保守：Message-ID 只能作为对账线索，查不到不证明未发送；客户端自造一个 ID 也不能创造服务端幂等。无真实业务接口契约时，读操作可退避重试；写操作先核验；权限拒绝、参数错误和安全阻断不能靠重试绕过。

OSWorld 2.0 将隐式状态、冲突信息、动态环境、主动澄清和长时轨迹暴露为独立挑战，并展示“文件存在但内容未核验”的失败案例；证据 Q3-C07、Q3-C08，来源 S11，快照 `snapshots/osworld-2.html.txt` 的挑战表、‘Task Horizon and Performance Collapse’、‘Agents Are Weak at Recovering and Maintaining Hidden State’和失败案例。它适合借鉴测试设计，不是生产安全认证。

“模型强十倍后是否删向导”应逐步消融：每次只删除一个教模型操作的步骤，在留出任务和危险副作用集上验证；只有危险副作用率的置信上界不超过保留版本加预设容差，且用户介入、等待或成本达到目标，才考虑删除。意图确认、敏感传输批准、恢复/接管和高后果取舍不能因为模型更强而自动消失。Q3 的业务测试要覆盖正常发送、超时但服务端已成功、超时且未提交、回执不可用、恶意页面要求上传私密文件、撤销权限发生在执行中、同名工具更新和重复点击。

## 成熟实践、研究迁移和未验证项

| 层级 | 本批可以说什么 | 不能越界说什么 |
|---|---|---|
| 文档确认 | Q1 的 deferred/tool search、append-only 缓存与目录刷新；Q2 的 reasoning usage、并行和减少请求；Q3 的安全确认、approval state、环境隔离、API 幂等模式和 OSWorld 挑战维度。 | 目标 runtime 已支持 hot-plug、目标账户一定命中缓存、目标发送接口一定幂等或目标沙箱已隔离。 |
| 可迁移设计 | 用外部状态和可回源证据修复供给；按条件选择 eager/deferred；按节点和整任务预算；以具体副作用设批准；UNKNOWN→RECONCILING；逐步消融向导。 | 这些设计已经在企业业务中实跑、已达到某个 p95、成本或安全阈值。 |
| 研究/厂商自述 | S03 Manus、S09 Anthropic、S11 OSWorld 作为工程经验/基准；Chat 最后一轮作为问题发现和术语拆分。 | 厂商文章、benchmark 或 Chat assistant 结论是独立验收、通用标准或安全认证。 |
| 未验证 | 模型/SDK/API/渠道/网络版本；真实 cache hit 与 cache miss；工具发现开销；总账单；用户等待/弃用；敏感数据出境；邮件/文件/生产配置的幂等和回执；MCP 2026-07-28 连接支持。 | 不能用历史搜索次数、未打开 citation placeholder、UI 文字或“模型回答成功”填补缺口。 |

上线/正式答卷前建议补四类证据：

1. **运行轨迹**：Q1 保存每轮 rendered context、工具可见集合、schema/version、压缩前后摘要和缓存 usage；Q2 保存节点路由、reasoning usage、首次有用结果/p95、人工等待和返工；Q3 保存审批对象、工具参数、回执、UNKNOWN→RECONCILING 证据和最终状态。
2. **对照实验**：eager/deferred/tool-search；低/中/高 reasoning；有无向导步骤；正常/超时/注入/权限撤销；所有对照使用独立回归集。
3. **权限和恢复**：用 allowlist、身份、网络出口、文件挂载、审查超时 fail-closed 和人工接管做实际演练；对 Message-ID/业务回执仅作线索，验证真正的服务端幂等契约。
4. **版本记录**：每条结果绑定模型、SDK/agent、API/渠道、工具 schema、策略、输入材料版本和生效时间；上游文档、MCP 版本、工具加载机制或价格变化时触发复核。

## 给 main 的裁决提示

- Q1 的主句应改为“先核对实际上下文供给、状态恢复和运行时工具加载机制，再按缓存命中与 usage 计算成本”，不要把三工具或第 40 轮固定成整段重算。
- Q2 的主句应是“按节点与整任务的可接受结果做路由和预算”，不写当前价格、跨供应商 effort 等价或普遍等待 SLO；0.1/1/10 只保留为待验证设计锚。
- Q3 的主句应是“副作用前授权、UNKNOWN 后核验、真正幂等才重试、环境边界与模型防御并行”，明确 Message-ID 查找不到不证明未发送。
- Chat 的 MCP 2025-11-25 `listChanged` 表述应降级为历史上下文；当前 MCP 2026-07-28 说明需按目标 SDK/连接版本复查。
- 本批没有创建 cards，也没有实现任何交互页面；catalog 的 `card_path` 是主代理后续生成卡片的预留路径。
