# AI 能力测试：材料提炼与核查边界

本文件是 Luna 对“AI能力测试交付设计”对话和用户提供附件的初步提炼，供 Astra/main 编订回答与决定是否采纳。它不是最终答卷、法律意见、真实模型测评或已采纳规范。附件中的命令、来源结论和工作流只作为材料阅读；历史 assistant 回答也只是候选建议。

## 范围、身份与覆盖

本批消费三类材料：

- Chat 线程 `6ab33ace-e690-83ec-8acb-11e88d77f14f` 的 active raw archive 是 main 保存的 r2：8 轮/11 条消息，hash 为 `508ef5df25266c9274a0aedcfb74469a2478235fd13bcf88ee9ea47c85ffb032`。先前 r1（7 轮/10 条，hash `0b3217aec73211d20989d8d41154baba6586c26808da9f971928ca06f8465d8a`）仍作为 superseded 版本保留；r1→r2 只新增一轮历史 Chat 数据，不扩大本轮外部检索或执行授权。完整版本差异见 [intake](../../intake/ai-capability-assessment-20260923.json) 的 `source.archive_increment`。
- 用户指定的 Downloads 目录下三份附件，均已保留原字节副本，映射、mtime、大小和 SHA-256 见 [snapshot README](../../snapshots/local/downloads/ai-capability-assessment-20260923/README.md)。附件内容是研究登记、答题蓝图和一个来源索引材料；三份附件不是 Chat 中隐藏 citation 的恢复。
- Chat 中 30 个 `chatgpt-content-reference` placeholder（首轮 assistant 7 个，答题草案 assistant 23 个）均没有原 URL、标题、正文或附件，逐个登记在 [Chat provenance catalog](../../provenance/ai-assessment-chat/catalog.json) 为 `missing-original`。catalog 的 `sources` 保持为空。

r2 新增的用户消息说明：Jev 既有 Chat 讨论可能已经过时，应先 explore 新的社区实践，再作为答题参考。它强化了时效边界，却没有给出可以直接写入 Kit 的规则；这条新增消息已随 r2 归档，仍属于历史 Chat 数据。

## 用户目标与偏好

对话最终要处理的是一套入职前 AI 能力测试：五道题覆盖长会话与工具账单、推理路由与价值、computer use 的副作用与重试、Jev 的类型/概率/降级、以及受控的 playbook 自我改进。用户允许使用任何 AI 和模型，不限制答题方式，提出过“两天”背景，并询问每题独立工件与统一 HTML 导览的取舍。

应保留的用户偏好如下：

- 快速变化的模型、缓存、工具发现、Jev 与 agent 实践必须带日期、版本和重访触发；旧快照不能被包装成当前事实。
- `Kit`、`Spark`、`Expert` 等自研语义要翻译成外部读者能理解的状态、供给、授权、证据、验收和生效语义；内部名称可留在证据详情，不应成为答案正文的前提。
- 个人 repo 或 Chat 可以进入答卷的证据层，展示问题如何被发现、反例如何改变判断和如何验收；它们不能变成项目宣传，也不能把仓库一致性检查包装成业务效果。
- 外部成熟实践先登记，再形成通行解法；Jev 要单独看近期实践，不能只重复历史讨论。
- 交付应以判断和证据为先。两天预算内，保留静态可核查工件，交互只在能直接证明分歧处投入。

## 每轮、每条消息与引用占位

| turn | raw 状态 | item（角色） | 长度 | placeholder | 主要作用 |
|---|---|---|---:|---:|---|
| `e7835cd0…` | archived | user | 40 | 0 | 补充工具后续加载/热插拔语境 |
| `e7835cd0…` | archived | `cac16eff…`（assistant） | 3378 | 7（0–6） | 工具发现、延迟加载、热插拔、缓存条件分支 |
| `0a309392…` | archived | user | 23 | 0 | 要求注意时效 |
| `e0774919…` | archived | user | 81 | 0 | 要求翻译自研语义 |
| `009a458a…` | archived | user | 4639 | 0 | Claude review：缓存、HCI、UNKNOWN、取整、法律陷阱等修正 |
| `009a458a…` | archived | `155dafa1…`（assistant） | 4517 | 0 | 个人实践作为证据层的整合建议 |
| `e425e863…` | archived | user | 31 | 0 | 询问是否纳入个人 repo/Chat 案例 |
| `a3ef5815…` | archived | user | 4 | 0 | 请求外部 explore |
| `a3ef5815…` | archived | `01df3e51…`（assistant） | 9019 | 23（20、0–18、21–23） | 五题通行解法与交付形式草案 |
| `40db57bd…` | archived | user | 936 | 0 | 完整五题、外部实践和交付任务 |
| `038cb4d9…` | r2 archived（r1→r2 新增） | user | 71 | 0 | 要求先 explore 新 Jev/community practice，再作答题参考 |

完整身份、长度和 distilled 路径见 [intake JSON](../../intake/ai-capability-assessment-20260923.json)。placeholder 的每个 claim、turn/item/index 和 `missing-original` 证据状态见 [catalog](../../provenance/ai-assessment-chat/catalog.json)。

## 附件中的 S01–S28：历史身份与本批状态

外部实践登记材料自称在 2026-09-23 通过 Exa 主检索登记 28 条来源，并将其分成官方工程文档、厂商自评、研究原型、开源实现和法源。下表只保留身份、用途和本批边界；完整摘要与 URL 在 [原字节快照](../../snapshots/local/downloads/ai-capability-assessment-20260923/external-practice-registration-20260923.md)。**下列 28 条均是附件中的历史研究身份，本批未把附件登记自动当作 verified，也未把它们当作 Chat 原始引用恢复。**

| ID | 历史来源身份 | 题目 | 本批消费边界 |
|---|---|---|---|
| S01 | Anthropic · Effective context engineering for AI agents | Q1 | 官方工程实践候选；未在本 intake 逐页复核 |
| S02 | Claude Code · How Claude Code uses prompt caching | Q1/Q2 | 产品实现/计费候选；effort 与缓存细节可能已变，需当前文档复核 |
| S03 | Manus · Context Engineering for AI Agents | Q1 | 厂商工程经验摘录；不能压过当前原生能力 |
| S04 | OpenAI · Reasoning models | Q2 | 官方 API 文档候选；不能横比各厂商 effort |
| S05 | Anthropic · Steering thinking | Q2 | 官方 API 文档候选；未独立核查任务级预算含义 |
| S06 | OpenAI · Latency optimization | Q2 | 官方工程指南候选；不能提供本产品 p95 |
| S07 | OpenAI · Computer use | Q3 | 官方执行/安全指南候选；需按实际接入核验 |
| S08 | OpenAI · Guardrails and human review | Q3 | 官方工作流候选；不能替代环境隔离 |
| S09 | Anthropic · How we contain Claude across products | Q3 | 厂商生产安全经验候选；未独立核查 |
| S10 | AWS Builders Library · Making retries safe with idempotent APIs | Q3 | 分布式重试实践候选；GUI 不自动具备幂等 |
| S11 | OSWorld 2.0 · Official project | Q3 | 研究基准候选；分数不是生产安全认证 |
| S12 | TypeSafe · Introducing System One Models and Jev | Q4 | 厂商能力声明/自评；不替代业务标签集 |
| S13 | TypeSafe · Score | Q4 | API 语义候选；期望分数不等于损失 |
| S14 | TypeSafe · Confidence | Q4 | API 语义候选；confidence 不等于真实正确率 |
| S15 | TypeSafe · Jev 1.13 jaggedness | Q4 | 版本限制候选；需要固定实际版本 |
| S16 | TypeSafe · Self-consistency: choices | Q4 | 厂商演示候选；小样本不能证明业务一致性 |
| S17 | TypeSafe · Guardrails for LLMs | Q4 | 示例代码候选；样例阈值不是上线标准 |
| S18 | Pydantic AI · TypeSafe (Jev) | Q4 | 第三方集成候选；集成成功不是效果验证 |
| S19 | Pydantic AI · models.typesafe API | Q4 | 第三方接口候选；`latest` 不适合作永久版本标识 |
| S20 | Google Research · RRSI repository | Q5 | 研究/开源参考；不是 Google 受支持产品或法律保证 |
| S21 | HarnessDev · Can LLMs Create and Evolve Their Own Agent Harness? | Q5 | 研究基准候选；迁移收益不稳定，不能归属某厂商 |
| S22 | RSI-Exam · Benchmarking Recursive Self-Improvement | Q5 | 研究评估协议候选；容器隔离不能创造法律真值 |
| S23 | AHE · Agentic Harness Engineering | Q5 | 开源工程参考；示例结果不等于法律治理效果 |
| S24 | Anthropic · Natural emergent misalignment from reward hacking | Q5 | 安全研究威胁模型候选；不证明本系统必然同样失配 |
| S25 | Singapore Court of Appeal · Man Financial v Wong Bark Chuan David [2007] SGCA 53 | Q5 | 一手判决候选；不能穷尽当前新加坡法 |
| S26 | Germany · Handelsgesetzbuch §74 | Q5 | 法条候选；需连同适用对象、基数、期间和其他条文复核 |
| S27 | OpenAI · Evaluation best practices | Q1–Q5 | 方法指南候选；不自动提供指标门槛 |
| S28 | US Treasury OFAC · Entities Owned by Blocked Persons (50 Percent Rule) | Q5 | 同名规则候选；不能据此断言题干原作者意图 |

## 五道题的完整覆盖与解题注意点

### Q1：长会话、文件重读和中途新增工具

题目实际考三件事：第 40 轮“忘约束”如何诊断，文件重复读取是否真是无效，以及三个新工具进入系统后账单如何变化。

建议的判断顺序是：先回放 1/20/40/60 轮，区分约束未进入本轮、被摘要删掉、已进入但未遵守、与新指令冲突、或已被合法撤销。文件重读按 file id、版本/hash、范围、目的和时点计数；同版同目的无新增价值的重读才是优化目标。将原始事件/证据、当前任务状态和本轮模型上下文拆开，最小状态对象可包含 Task、Constraint、Evidence、Action、Decision。权限和租户隔离必须在工具入口再次确定性检查，不依赖模型记忆。

三个工具不是“三倍费用”的充分条件。答题要明确检查：工具定义改变已缓存前缀时的受影响旧 token、普通输入/缓存创建/缓存读取单价与 TTL；定义追加到后部时可保留的旧前缀与新增 schema；只改可搜索目录时的目录摘要和发现调用；热更新重连、重试、实际工具调用及返回内容。缓存增量只能写成条件式：

`受影响旧 token 数 ×（重新处理单价 − 缓存读取单价） + 新 schema/发现/执行/返回成本`。

历史 assistant 曾给过 15 万 token、不同 TTL 和具名模型倍率示例；它们是未恢复引用下的历史建议，不能写成统一报价。用户 review 还指出 S02 的 effort/cache 细节可能过期，必须按当前产品、模型、通道和请求实测。工具发现、定义进入上下文、服务可执行、调用获授权也是四个不同状态；MCP 目录通知不等于热插拔或缓存不变。

可核查工件是上下文策略、长轨迹回放和工具新增前后账单拆解。没有真实 usage 时只给参数化示例，分开报告约束违例率、无效重读率、cache hit、任务质量、总成本和 p95。

### Q2：推理强度、等待时间、单位经济性和信任

先决定某一步是否需要模型，再决定推理强度：权限、格式、日期和已确立公式由确定性代码处理；边界清楚且可自动验证的分类/抽取可候选低 effort；多源冲突、跨法域分析、复杂规划和高后果判断才升档并要求来源验证或专业复核。高 effort 不构成权限。

成本主指标是“每个被接受结果的总成本”：所有模型输入、缓存创建/读取、隐藏推理、输出、工具、浏览器/沙箱、人工审阅、纠错和返工都进分子，失败和重试不能删掉。满足硬性安全后，才用 `降低的错误概率 × 错误损失 > 新增模型费 + 等待成本 + 新增验证成本` 判断是否升档。任何人工 12 分钟、300 元/小时、AI 2 元之类都只能作为标明假设的演算。

等待应分为收到确认、首次有用结果、完整候选和最终接受。历史 review 补充了 0.1/1/10 秒的人机交互经验阈值；它们是设计锚点，不是模型 SLA，需标为历史参考并由本产品 p95 验证。复杂审阅应展示真实阶段、可取消、离开与返回入口，不用打字动画冒充进度。

不展示原始思考时，界面展示输入文件/版本、证据、冲突、未核实项、准备改变的对象、审批状态、执行回执和结果未知状态。模型/effort 的缓存关系按具体产品和通道核查；不能把 Claude Code 的历史实现外推为所有 API 的契约。

### Q3：云端/本机 agent、人工闸门、重试和向导消融

自动化边界由账号、文件挂载、网络出口、目标对象、动作副作用、可逆性和影响面决定，不由“云端”或“本机”二分决定。授权范围内读取、检索、草稿和工作副本编辑可自动；外发、敏感披露、覆盖关键文件、权限/凭证/生产状态变化须在具体副作用发生前确认。输入敏感信息、上传或自动保存也可能早于最终提交产生传输，网页和工具返回文字不能自行授予权限。

审批绑定动作、目标系统/租户、接收人或资源、具体 payload/hash、版本、范围、时效和授权人；审批后对象或内容变化则旧批准失效。状态应能表达 `PROPOSED → VALIDATED → WAITING_APPROVAL → EXECUTING → VERIFIED`，并有 `UNKNOWN → RECONCILING` 分支。

外部写入超时先核验权威回执；只有确认未提交，或服务端确有与相同业务意图绑定的幂等契约，才有界重试。邮件的 Message-ID 可帮助事后查已发送记录，但客户端自造 ID 不能让普通接口自动去重；GUI 点击通常没有服务端幂等。权限拒绝、参数错误和安全阻断不能靠反复尝试绕过。

模型强十倍后，可逐步移除教模型“怎么点”的步骤，但必须保留目标确认、必要取舍、批准、证据核验、可访问性与人工接管。每次只移除一个步骤，在真实任务留出集检查危险副作用率的置信上界不劣于保留版本加容差，同时用户介入量确实下降，才能删除。OSWorld 只能借鉴测试设计，不能替代生产安全验收。

交付可用权限矩阵、状态机和正常发送/超时核验/页面注入三条静态回放。个人 LP-R6 中断恢复案例只能证明“已有结果可恢复但 UNKNOWN 仍阻止重试”的本地离线边界，不能声称真实邮件或生产配置已验证。

### Q4：Jev 的类型保证、独立验收、1.99 阈值和降级

“输出空间锁死，所以没有幻觉”只能收窄为类型合法或 schema 合法；它不推出业务正确、概率校准、动作稳定或输入抗注入。上线前应补独立业务适用性验证与发布批准包：用途/禁用用途、精确模型/rubric/policy/输入版本、合法业务样本、独立标注与争议裁决、开发/校准/最终测试隔离、混淆矩阵、严重漏报上界、可靠性指标/置信区间、risk-coverage、自动覆盖率与人工交接率、中文/数字/日期/否定/长文/选项顺序/对抗切片、网络 p50/p95/p99、限流/故障/恢复和批准回退条件。

三次结果不一致时，先核对实际应答版本、输入是否字节级一致、rubric/包装版本、选项顺序和配置，再分别测原始浮点/分布、选择标签和最终动作；多数票不是正确性证明，也不应循环调用直到“通过”。`latest` 别名不能替代已校准版本。

规则必须明确读取原始概率向量、原始 score 还是包装后的离散字段。历史 review 提醒 Pydantic 集成可能有取整层（半数进位）与原始分数分离；这一细节需重新核对后才可写成契约。两个人工合成例子足够揭示均值陷阱：`[0, .01, .99, 0]` 的期望是 1.99，但 `P(level≥2)=99%`；`[.5, 0, 0, .5]` 的期望是 1.5，但 `P(level≥2)=50%`。它们不是 Jev 实测，不能画真实校准曲线；四舍五入也不能修复风险决策。

网络不可用与语义不确定要走不同回退：网络用有界重试、熔断和可观测性；业务判断转入已独立验收的本地模型、规则或人工。统一的是 `allow/review/deny/unknown` 动作接口，不是跨模型照搬原始分数/阈值。高影响动作在服务不可用、版本未验收、输入分布外或证据冲突时停在草稿/人工，不能 fail-open。历史 review 关于托管区域、SLA、合同限制和参数已发送等说法需逐项复核，不能从附件摘要当成事实。

### Q5：外部律师修改、RSI、客户隔离和 playbook 生效

当场处理是保存事实但不直接全平台生效。删除风险句 D1 与新增补偿公式 D2 是两个原子候选，可分别补证、通过或拒绝。记录原文和 redline、父版本、作者/角色/执业法域、事项/客户/法域、理由、法源、有效期、支持/反对证据、失败案例、评估结果、批准人、发布版本和回滚目标。合同已交付不等于平台规则已批准。

“50%”必须先识别规则身份、法律概念、适用对象、法域和日期。材料登记将德国 HGB §74 的一半与竞业限制补偿联系起来，并区分了 OFAC 的同名所有权制裁规则；这只说明题干可能发生同名/跨场景混淆。即便德国测试算出相同数字，也必须核查基数（含哪些合同给付）、期间、法律性质、适用对象和例外；不能把月薪×12×当地系数变成通用参数。新加坡判决和越南事项不能在无完整法源、事实和当地复核时被压成同一个系数。香港律师的执业法域也应单独登记，作者身份不降低证据门槛。

适用层至少拆成：事项事实、客户 A 私有 overlay、经验证的 SG/DE/VN 法域规则、可跨客户复用的平台审查流程。A 的红线不能进入 B 的检索、摘要、提示、记忆、评估或诊断日志；有版本号但不是 `active` 或已过期的候选不进入当前规则供给。若新加坡公式只是一项合同起草偏好，它最多停留在 A 事项/overlay，不进入 SG 法域通则。

独立评估要由相应法域能力的人复核法源，并让提议规则的学习器无法修改最终验收集、评分器、硬性策略和生效状态。对照原版、仅 D1、仅 D2、组合版，先在开发/选择集定位收益，再冻结候选，用未调参的隐藏验收材料检查回归、隔离和跨域反事实；隐藏集不能持续回流调参。至少测试 SG→DE、SG→VN 无有效规则、A→B、作者换名、非 active、删除警告却增加漏报等情况。

奖励黑客既包括删除警告、套公式、避开难题、记住答案、修改评分器，也包括把全部事项送人工来刷安全指标。先设不可补偿的法源、适用范围、隔离、必检项和批准门槛，再比较正确率、覆盖率、人工时间和成本。RRSI、HarnessDev、RSI-Exam 和 AHE 只能提供候选生成、历史保留、泄漏检查、隐藏评估和失败记录的研究参考；不能提供法律真值或自动晋升授权。

个人 Praxis 审阅案例能支持“来源保留、主张拆分、逐项裁决、版本化修订”，但不能证明自动学习平台或法律业务效果。第五题真正可泛化的候选经验是审查方法：同名数字规则先核对法律身份，删除和新增分审，公式必须带法源、适用范围和版本；那条 50% 公式本身不应晋升。

## 交付判断

统一入口与分题工件可以同时采用：一个离线、可打印、无需登录/API key 的 HTML 导览承载三层阅读，题目各自用最能证明判断的工件。推荐映射是：

| 题目 | 主工件 | 两天内的投入 |
|---|---|---|
| Q1 | 上下文策略、长轨迹与账单条件分支 | 静态表格和参数化演算；不伪造 usage |
| Q2 | 节点路由、单位经济性、证据/等待/审批/未知状态 | 静态状态样例；计算器可后置 |
| Q3 | 权限矩阵、状态机、超时/注入回放 | 静态回放足够，重点是 UNKNOWN 语义 |
| Q4 | 独立验收协议、字段语义、概率分布与降级 | 唯一优先交互：分布滑块并显示期望、严重尾部概率、动作 |
| Q5 | D1/D2 变更记录、版本状态和跨客户/法域反事实矩阵 | 静态矩阵；不用为切换应用增加展示成本 |

页面正文先给每题判断、理由和最大失败模式，再给机制/取舍，最后给来源、版本、数据、脚本和失败案例。真实实测、确定性脚本验证、人工构造数据、设计假设和历史建议必须有不同标签；HTML 与 Markdown 应来自同一份内容数据。加入一份交叉核验记录，列出 effort/cache 过期、Jev 取整、德国 50% 同构陷阱等被发现和修正的地方，能直接展示使用 AI 后如何复核。

每题写作顺序可固定为：`我的判断 → 为什么 → 如何执行 → 何时停止/降级 → 怎么验收`。答卷还应明确“什么证据会让我改变判断”和“什么情况绝不能自动继续”。

## 交接给 Astra/main

- 已完成：三份附件原字节快照、三份附件元数据、r2 的 8 轮/11 条 raw archive 对照、r1→r2 新增轮次记录、30 个 placeholder 独立 `missing-original`、五题初步提炼和个人案例边界。
- main 需裁决：是否把附件 S01–S28 逐 URL 复核为独立 supplemental provenance；是否采用 Q4 唯一交互与 HTML 单入口；哪些写作约定进入回答体例/ADR。r2 已解决 r1 的 Chat 覆盖缺口，不代表 Jev 外部实践已经完成核查。
- 不可宣称：外部 S01–S28 已全部 verified、Jev 已在法律业务上校准、真实邮件/桌面/生产配置已测试、德国/新加坡/越南已形成法律意见、任一历史 assistant 引用已经恢复。
- 相关产物：[answer draft](answer-draft.md)、[delivery plan](delivery-plan.md)、[intake](../../intake/ai-capability-assessment-20260923.json)、[Chat placeholder catalog](../../provenance/ai-assessment-chat/catalog.json)。
