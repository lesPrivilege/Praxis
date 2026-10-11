# AgentScope 企业线：从运行机制到业务交付

[影片舞台](film/index.html) · [分镜与时间](script/beats.json)

AgentScope 把 Agent 的推理、工具、上下文与权限，接到持续运行的会话、工作区、事件与服务。Python 和 Java 提供各自的实现路径。下面按文档系统对应的问题逐层展开。

## 01 · 项目全貌

### 01 · AgentScope：把 Agent 接成工作系统

合同助手接到任务后，需要读取材料、查规则、形成意见，必要时等待审批，再把文件和结果交回业务应用。模型生成文字只是其中一步。AgentScope 覆盖推理与工具循环，也覆盖托管会话、执行环境和前端事件。

把这些职责分开，PM 才能判断一个功能应该修改提示词、增加工具、调整服务，还是接入业务系统的控制。贯穿本片的合同助手用于解释对象和动作怎样流转。

| 局部 | 实现与作用 |
|---|---|
| Agent | 决定下一步，调用工具，维护工作上下文。 |
| Service | 接收请求，管理会话，把进展和结果送回应用。 |
| Workspace | 为文件、终端和工具提供执行环境。 |

产品需求同时涉及推理、执行、状态与交付。

依据：[as-13b26f7a4513](https://docs.agentscope.io/en/versions/2.0.9/index.md) · [as-dc202a66c974](https://docs.agentscope.io/en/versions/2.0.9/deploy/agent-service.md)

### 02 · 文档目录对应四类实现问题

构建块回答局部对象的契约，编排回答它们如何组成任务，部署回答实例和状态如何被长期托管，企业接入回答应用怎样提交工作、观察进展并取得结果。文档目录因此可以作为架构的发现入口。

阅读顺序先确定业务问题，再找对象与接口，最后回查源码的控制点。同名的“会话”“事件”“工具”要放回各自层次理解。

| 局部 | 实现与作用 |
|---|---|
| 构建块 | 消息、模型、工具、上下文：运行由什么组成。 |
| 编排 | 团队、计划、流水线：复杂工作如何组织。 |
| 部署 | 服务、存储、事件：多人如何持续使用。 |
| 企业接入 | 身份、权限、文件、恢复：业务怎样接管。 |

每个需求先定位职责，再进入对应文档。

依据：[as-e800b6665911](https://docs.agentscope.io/_llms/en/agent-scope/2-0-10dev.txt) · [as-822919440da3](https://java.agentscope.io/llms.txt)

### 03 · Python 与 Java 各有完整运行路径

Python 2.0 主项目已包含 Agent Service。Java 文档把应用侧 Harness 与平台侧 Service 分开：前者维护 Agent 的构建和持续工作语义，后者统一管理执行目标、Session、Turn、权限与交付。

Python 2.0 的主项目提供 Agent 与托管服务。Java Harness 与 Java Service 分别维护应用侧和平台侧的契约。

| 局部 | 实现与作用 |
|---|---|
| Python · Agent | 推理、工具、权限、上下文与工作区。 |
| Java · Harness | 构建 Agent，保存历史与恢复点。 |
| Python · Agent Service | 托管用户、会话、资源与事件流。 |
| Java · Service | 把执行目标接成统一 Session API。 |

两条实现路径分别核对状态和接入契约。

依据：[as-dc202a66c974](https://docs.agentscope.io/en/versions/2.0.9/deploy/agent-service.md) · [as-0a3782c37016](https://java.agentscope.io/v2/en/intro.md) · [as-9d9136196aa8](https://java.agentscope.io/v2/en/service/index.md)

### 04 · Runtime、Studio 的职责归入 2.0

独立 Runtime 与 Studio 的 README 已给出归档和迁移提示。Runtime 原来承接沙箱、Agent-as-a-Service 和观测；Studio 原来提供开发期可视化与调试。2.0 的服务架构与内置 Web UI 成为新入口。

旧文档适合回查机制来路。旧 Runtime 的 AgentApp、Runner 和旧 Studio 项目结构应放在迁移对照中，不能直接用来解释新 Service 的接口。

| 局部 | 实现与作用 |
|---|---|
| 原 Runtime | 沙箱、Agent 服务、部署与观测。 |
| 原 Studio | 运行轨迹、调试与人工输入。 |
| AgentScope 2.0 | 主项目承接执行服务和内置 Web UI。 |

新方案从 2.0 进入，旧方案按原版本迁移。

依据：[as-38708b217d1d](https://github.com/agentscope-ai/agentscope-runtime/blob/22072fd7075ce0c6f43cb39509d6a14b0e60ddb5/README.md) · [as-ed35bc95bfb2](https://github.com/agentscope-ai/agentscope-studio/blob/20e7638273d3726732eb317b440bfa34e6694e17/README.md) · [as-13b26f7a4513](https://docs.agentscope.io/en/versions/2.0.9/index.md)

### 05 · 合同助手的一次工作

设想用户提交一份合同，Agent 检索制度和历史条款，形成风险清单，调用工具保存批注文件，需要时等待负责人的确认。检索结果进入上下文，确认事件解除暂停，文件进入交付登记。

合同规则、可执行动作与最终接受标准由业务应用定义。框架提供运行基础，产品把它接到已有业务控制中。

| 局部 | 实现与作用 |
|---|---|
| 接收任务 | 读取合同与复核要求。 |
| 获取依据 | 检索规则，核对版本。 |
| 生成候选 | 形成风险条目与修改建议。 |
| 交回业务 | 确认动作，保存并发布结果。 |

建议生成与业务动作完成分别记录。

依据：[as-dc202a66c974](https://docs.agentscope.io/en/versions/2.0.9/deploy/agent-service.md) · [as-69ccfb190c6d](https://java.agentscope.io/v2/en/service/files.md)

## 02 · Agent 内核

### 06 · Agent 是推理与行动的循环引擎

Agent 执行循环，配置说明它能使用什么，AgentState 说明这次工作到了哪里。新消息进入上下文并开始回复；确认事件或外部结果续接一个暂停中的回复。

Agent 根据状态选择推理、行动、暂停或结束。服务层把同一会话的状态交给正确运行实例，才能在多个请求之间维持连续工作。

| 局部 | 实现与作用 |
|---|---|
| 配置 | 模型、工具、提示词、权限与中间件。 |
| 运行状态 | 上下文、当前消息、工具与暂停信息。 |
| 调用入口 | 接收消息或事件，返回结果或等待输入。 |

连续工作需要保存和恢复正确的运行状态。

依据：[as-f2b9fa0f0bea](https://docs.agentscope.io/en/versions/2.0.10dev/building-blocks/agent_overview.md) · [as-188d64eb8aa5](https://docs.agentscope.io/en/versions/2.0.10dev/building-blocks/agent_run-agent.md)

### 07 · Msg 把一次回复收成完整记录

Msg 是通信与持久化的单位。2.0 一次 reply 可累积多轮思考、工具调用和执行结果，最后形成一条助手消息。content 的有序类型块保留过程，不能只保存最后一句话。

finished_reason 区分完成、中断、超限和错误；暂停时还没有结束原因。角色约束在构造时校验：用户消息与系统消息可携带的内容类型有明确范围。

| 局部 | 实现与作用 |
|---|---|
| 身份 | id、发送者、role 与时间。 |
| 内容块 | 文字、思考、工具调用、结果及提示。 |
| 结束状态 | 完成、中断、迭代超限或错误。 |
| 附加结果 | 用量、结构化输出与错误信息。 |

一条助手消息可以包含多轮工具调用。

依据：[as-24299c5c3ff5](https://docs.agentscope.io/en/versions/2.0.10dev/building-blocks/message-and-event.md)

### 08 · Event 把运行进展送到界面

事件使用 reply_id、block_id 和 tool_call_id 标识回复与内部对象。start、delta、end 表达块的生成过程，Msg.append_event 按这些身份更新块、累计用量并记录结束原因。

回复身份错误或缺少目标块时，事件可能被跳过。因此收到事件和成功改变视图是两步。前端应按稳定身份更新对象，重连时恢复先前记录，再应用新增量。

| 局部 | 实现与作用 |
|---|---|
| 文字增量 | 更新同一文字块。 |
| 工具事件 | 呈现参数、进展与结果。 |
| 确认请求 | 显示待确认动作并接收答复。 |
| 完整消息 | 收成可保存的回复记录。 |

界面按稳定 ID 更新对象。

依据：[as-24299c5c3ff5](https://docs.agentscope.io/en/versions/2.0.10dev/building-blocks/message-and-event.md)

### 09 · 推理与工具结果组成反馈回路

ReAct 的核心是反馈。模型返回工具请求后，Agent 校验并执行；工具结果进入当前消息，下一轮模型据此决定继续或结束。每轮还会处理上下文压缩与运行提示。

等待人工确认或外部执行时，循环暂停，当前事件流结束而回复尚未完成。后续结果事件到达才续接。超过迭代预算有明确结束状态，普通文本还可进行禁用工具的总结。

| 局部 | 实现与作用 |
|---|---|
| 检查状态 | 选择推理、行动、暂停或结束。 |
| 调用模型 | 发送上下文；无工具请求时形成答复。 |
| 执行工具 | 按参数运行可用工具。 |
| 接收结果 | 写回消息，再决定下一步。 |

工具失败也是下一轮推理的输入。

依据：[as-f2b9fa0f0bea](https://docs.agentscope.io/en/versions/2.0.10dev/building-blocks/agent_overview.md)

### 10 · Model 与 Formatter 分担协议转换

Formatter 把内部 Msg 转成供应商请求格式，Model 处理调用、重试、流式返回和用量。流式接口输出增量及最终完整响应，Agent 再转成事件。

格式统一仍保留供应商差异。某些媒体不能进入模型时，适配层会转为 URL 或文件路径；多名说话者需要 MultiAgentFormatter 保留身份。产品切换模型要核对这些能力，而不只替换名称。

| 局部 | 实现与作用 |
|---|---|
| 内部消息 | 保留消息与内容块。 |
| Formatter | 转换角色、工具与媒体表示。 |
| Model | 发送请求，读取响应与用量。 |
| 统一输出 | 回到 Agent 可消费的结构。 |

更换模型时核对工具、媒体与输出能力。

依据：[as-d47e94c7be0b](https://docs.agentscope.io/en/versions/2.0.10dev/building-blocks/model_overview.md) · [as-07cb85f8aa73](https://docs.agentscope.io/en/versions/2.0.10dev/building-blocks/model_llm.md)

### 11 · 工具把模型请求接到真实函数

Toolkit 把 Python 函数、MCP 工具和工具组收成可调用集合。模型看见函数名称、说明和参数 Schema，运行时再次检查工具是否激活并校验输入。ToolChunk 表达进展，ToolResponse 聚合最终结果。

未注册工具、未激活工具组或参数不匹配会返回模型可读的错误。业务工具边界应与动作一致，例如查询合同状态、保存候选批注和发布文件，分别配置输入与授权。

| 局部 | 实现与作用 |
|---|---|
| 登记函数 | 读取签名、类型与说明。 |
| 形成 Schema | 公开名称和可填参数。 |
| 执行调用 | 找到函数，校验并传入参数。 |
| 返回结果 | 聚合执行内容，写回消息。 |

参数校验通过后才进入副作用执行。

依据：[as-47c09ed8a575](https://docs.agentscope.io/en/versions/2.0.10dev/building-blocks/tool_python-tool.md) · [as-13c3e91cfe2f](https://docs.agentscope.io/en/versions/2.0.10dev/building-blocks/tool_overview.md)

### 12 · 工具属性决定并行与串行

2.0 的工具包含 is_concurrency_safe 等属性。并发安全调用可并行，其他调用按顺序组织；结果汇合后进入下一轮推理。同一批工具中，错误也要写回可识别的结果。

同时查两个知识源适合并发。生成文件后才能发布文件，则要保持依赖。属性声明错误会让调度与业务要求不一致，验收应检查真实动作，而不只观察等待时间。 生成文件再发布文件的先后关系，由编排或后续推理轮表达。调度器不自动推断业务依赖。

| 局部 | 实现与作用 |
|---|---|
| 独立读取 | 多个查询可以同时执行。 |
| 依赖步骤 | 先取得前一步结果，再发起后一步。 |
| 工具属性 | 声明并发安全与执行特征。 |
| 结果汇合 | 全部结果重新进入反馈。 |

副作用和依赖决定真实执行顺序。

依据：[as-2fea42114514](https://docs.agentscope.io/en/versions/2.0.10dev/building-blocks/tool_manage-tools.md) · [as-13c3e91cfe2f](https://docs.agentscope.io/en/versions/2.0.10dev/building-blocks/tool_overview.md)

### 13 · 权限判定发生在工具执行前

DEFAULT 模式按 deny、ask、只读快速路径、工具自检、allow 和默认 ASK 等阶段判定。EXPLORE 先检查显式 deny/ask 规则；未命中这些规则的非只读请求才默认拒绝。显式 ask 仍可在人工确认后执行，allow 规则不能改变非只读的默认拒绝。BYPASS 的控制含义不同，需要明确配置。

权限系统决定是否执行，工具审查检查实际输入，沙箱限制运行环境。三个层次共同工作。人工确认应展示具体工具、参数和作用对象，答复要关联等待中的调用。

| 局部 | 实现与作用 |
|---|---|
| ALLOW | 继续执行工具。 |
| DENY | 返回拒绝结果，交回推理循环。 |
| ASK | 暂停并发出人工确认事件。 |

批准关联具体动作与参数。

依据：[as-7dad78a203b5](https://docs.agentscope.io/en/versions/2.0.9/building-blocks/permission-system/overview.md) · [as-7bfd7ee86f21](https://docs.agentscope.io/en/versions/2.0.10dev/building-blocks/agent_human-in-the-loop.md)

### 14 · 人工确认把暂停接回执行

ASK 把工具状态改为 asking，并发出 RequireUserConfirmEvent。当前运行不会一直占着等待的协程；调用方保存状态、展示确认请求，随后以 UserConfirmResultEvent 续接。

外部执行使用相似机制：external 工具发出执行请求，外部完成后带回结果。回复身份或工具身份错误会阻止续接，结果结构也需要按工具契约校验。

| 局部 | 实现与作用 |
|---|---|
| 形成调用 | 保存工具、参数与身份。 |
| 停在确认点 | 发出请求，保存等待状态。 |
| 接收答复 | 关联用户选择与待确认对象。 |
| 继续循环 | 执行动作或返回拒绝结果。 |

多个待确认动作分别关联答复。

依据：[as-7bfd7ee86f21](https://docs.agentscope.io/en/versions/2.0.10dev/building-blocks/agent_human-in-the-loop.md)

### 15 · Python、MCP 与 Skill 有不同入口

Python 工具连接已有函数，MCP 连接外部工具服务，Skill 提供任务说明与资源。工具组可按任务激活，减少模型一次看见的工具集合。MCP 列举失败时，组件可撤下该服务的工具并记录问题。

连接生命周期、凭据、技能资源和执行授权分别配置。技能文本不能为真实业务写入自动授予权限。

| 局部 | 实现与作用 |
|---|---|
| Python 工具 | 本地函数直接承担动作。 |
| MCP 工具 | 发现并调用外部服务工具。 |
| Skill | 提供任务说明和按需读取的资源。 |

技能说明与实际工具授权分别配置。

依据：[as-13c3e91cfe2f](https://docs.agentscope.io/en/versions/2.0.10dev/building-blocks/tool_overview.md) · [as-2fea42114514](https://docs.agentscope.io/en/versions/2.0.10dev/building-blocks/tool_manage-tools.md)

## 03 · 上下文与协作

### 16 · 模型输入由三层组装

上下文是 Agent 的工作记忆。每轮模型调用组装系统提示、历史摘要和近期消息。系统提示还会经过 on_system_prompt 变换，工具 Schema 取自当前激活集合。

会随执行变化的时间、任务状态和用量以运行提示注入上下文。讨论回答质量时，应检查必要材料和约束是否进入了本轮输入，而不只分析模型型号。

| 局部 | 实现与作用 |
|---|---|
| 系统提示 | 基础提示、技能说明与中间件变换。 |
| 压缩摘要 | 保留较早历史的必要信息。 |
| 近期上下文 | 最近消息、结果和运行提示。 |

上下文决定模型下一步能依据什么。

依据：[as-524cfb38d8f2](https://docs.agentscope.io/en/versions/2.0.10dev/building-blocks/context_overview.md)

### 17 · 压缩给长任务腾出上下文空间

Agent 根据 trigger_ratio 与模型窗口比较 token 用量，保留近期消息并生成较早历史的结构化摘要。工具结果也可按 token 限制截短。压缩后的摘要继续作为推理输入。

长期任务的约束、待处理动作和材料身份应纳入摘要质量验收。丢失这些信息可能改变下一步选择，因此仅用对话轮数评价压缩不够。

| 局部 | 实现与作用 |
|---|---|
| 检查用量 | 按阈值判断是否压缩。 |
| 处理历史 | 较旧消息收成摘要。 |
| 截短结果 | 处理过大的工具返回。 |
| 重新组装 | 摘要与近期消息进入推理。 |

压缩策略决定后续仍可见的细节。

依据：[as-761fb054c0df](https://docs.agentscope.io/en/versions/2.0.10dev/building-blocks/context_compress-context.md)

### 18 · 卸载保留被压缩内容的回查路径

压缩减少模型输入，卸载保存被移出输入的内容。offloader 把较早消息和截短结果交给存储，后续可以按引用读回。工作区提供相关文件能力。

有效回查需要存储、引用和读取工具一同可用。业务材料还要保持版本和访问范围，避免不同任务读取同一文件名下已经改变的内容。

| 局部 | 实现与作用 |
|---|---|
| 原始内容 | 较早消息或大型结果。 |
| 外部保存 | offloader 写入存储。 |
| 保留引用 | 上下文留下定位与摘要。 |
| 按需读回 | 通过文件能力取回细节。 |

摘要支持推理，原件支持细节回查。

依据：[as-c3e41125204e](https://docs.agentscope.io/en/versions/2.0.10dev/building-blocks/context_offload-context.md)

### 19 · 长期记忆跨越当前对话

长期记忆通过中间件接入。Agentic Memory 用工作区 Markdown 支持自主读写，ReMe 和 Mem0 等方案提供检索、注入和回写路径，静态检索与工具检索也可组合。

不同方案的数据归属与生命周期不同。ReMe 缺少 session_id 时会跳过回写，其检索范围又可能覆盖工作区。采用前应明确用户、Agent 和组织的记忆边界，以及修改和清除入口。

| 局部 | 实现与作用 |
|---|---|
| 本轮上下文 | 支持当前推理与工具反馈。 |
| 长期记忆 | 保存跨任务可再利用的信息。 |
| 记忆写入 | 选择需要留下的内容。 |
| 记忆检索 | 按当前需要取回相关信息。 |

用户、会话与记忆归属保持一致。

依据：[as-1223f953ff05](https://docs.agentscope.io/en/versions/2.0.10dev/building-blocks/long-term-memory.md)

### 20 · RAG 把知识材料接到推理输入

KnowledgeBase 组织 parser、chunker、embedding 和 vector store。查询会批量嵌入、检索、去重、按分数过滤并选取 top_k。RAGMiddleware 可在推理前静态注入，也可公开搜索工具让 Agent 主动查询。

metadata_filter 约束检索与写入，可承担数据分区。API 与后台索引 worker 要使用一致的存储、总线、文件和向量后端。文本嵌入对多模态输入还有能力边界，需要在产品输入上明确处理。

| 局部 | 实现与作用 |
|---|---|
| 导入材料 | 解析文档并切片。 |
| 建立索引 | 嵌入片段，写入后端。 |
| 查询片段 | 按问题检索、排序与去重。 |
| 形成回答 | 把相关材料交给 Agent。 |

检索与回答质量分别检查。

依据：[as-8379a990984a](https://docs.agentscope.io/en/versions/2.0.9/deploy/rag.md) · [as-29e364404cfc](https://docs.agentscope.io/en/versions/2.0.10dev/building-blocks/rag.md)

### 21 · 结构化输出让结果进入后续流程

结构化输出通过临时生成工具和 Schema 校验形成结果，最终放入 Msg.structured_output。模型策略可以做 fallback，超限时还有有限宽限机会。

Schema 解决字段、类型和结构，业务校验解决风险是否成立和依据是否正确。应用可以据此生成可逐项复核的列表，并在真实动作前检查授权和状态。

| 局部 | 实现与作用 |
|---|---|
| 定义字段 | 风险类型、位置、建议和依据。 |
| 要求结构 | 给 Agent 提供输出 Schema。 |
| 校验结果 | 获得可解析的结构化字段。 |
| 业务核对 | 检查依据与权限后使用。 |

字段形状与业务结论分别验收。

依据：[as-188d64eb8aa5](https://docs.agentscope.io/en/versions/2.0.10dev/building-blocks/agent_run-agent.md)

### 22 · 中断与继续各有明确状态

运行中通常取消异步任务，暂停中的回复则通过 UserInterruptEvent 处理等待工具并形成中断结果。idle 会话的中断是无操作。服务接受中断请求和实际工具清理完成是两个阶段。

已经送到业务系统的请求可能继续完成，取消界面等待不能替代下游撤销。恢复时先查询外部结果，再决定继续或重试。

| 局部 | 实现与作用 |
|---|---|
| 运行中断 | 取消当前模型或工具任务。 |
| 暂停中断 | 向等待中的回复送入中断事件。 |
| 保留记录 | 保存部分输出和工具状态。 |
| 恢复核对 | 确认外部动作实际结果。 |

停止等待后，外部动作仍需核对。

依据：[as-1787397c3223](https://docs.agentscope.io/en/versions/2.0.10dev/building-blocks/agent_interrupt-agent.md) · [as-79adbb1a7334](https://java.agentscope.io/v2/en/service/session-event-log.md)

### 23 · 中间件在生命周期接入规则

MiddlewareBase 提供 on_reply、on_reasoning、on_check_permission、on_acting、on_model_call、on_compress_context 等环绕阶段，以及顺序变换的 on_system_prompt。它还可通过稳定 key 在 AgentState 中保存状态。

on_acting 主要包工具 I/O，参数解析、权限判定和写入上下文在它之外。加入审计或后台卸载时要选择正确阶段，尤其注意可注入 live state 的工具所带来的并发影响。

| 局部 | 实现与作用 |
|---|---|
| 系统提示 | 按用户与场景调整指导。 |
| 模型阶段 | 处理输入、输出和调用。 |
| 工具阶段 | 审查、变换与记录 I/O。 |
| 运行阶段 | 组织日志、压缩与回复逻辑。 |

规则的作用范围与执行顺序明确配置。

依据：[as-cc1c5a96c71f](https://docs.agentscope.io/en/versions/2.0.10dev/building-blocks/middleware.md)

### 24 · GoalPipeline 用执行与核验推进目标

GoalPipeline 把 executor 与 verifier 接成目标闭环。失败结果回到执行者，格式无效有单独重试，HITL 事件按 reply_id 送回对应 Agent。预算属于 pipeline 实例，续接不会重新计数。

verifier 可以读取文件、使用工具或请求人工判断，它也是普通 Agent。产品应为核验提供明确的可观察标准；不能把模型返回 pass 直接当成业务已经接收。

| 局部 | 实现与作用 |
|---|---|
| 执行目标 | executor 形成工作结果。 |
| 结构报告 | 以约定格式提交候选。 |
| 核验判定 | 返回 pass、fail 或 impossible。 |
| 反馈修正 | 未通过且预算允许时继续。 |

结果核验与输出格式校验承担不同职责。

依据：[as-986459b99a69](https://docs.agentscope.io/en/versions/2.0.10dev/building-blocks/pipeline_goal.md)

### 25 · 团队把工作拆给不同 Agent

TeamPipeline 给 leader 注册分配工具。不同成员可并发，同一成员的任务串行；成员保留自己的权限要求，人工答复按回复身份路由。默认 leader 回复结束后清理成员上下文。

Agent Service 还提供托管团队的工具与会话能力。产品应明确每个成员的材料、工具和结果责任，避免重复工作或把只负责研究的成员授予业务写入能力。

| 局部 | 实现与作用 |
|---|---|
| 分配任务 | leader 给成员完整任务输入。 |
| 独立执行 | 成员在自己的上下文中工作。 |
| 传回结果 | 成员结果成为 leader 的工具结果。 |
| 统一汇总 | leader 形成最终回复。 |

成员权限仍各自生效。

依据：[as-0c1773327b10](https://docs.agentscope.io/en/versions/2.0.10dev/building-blocks/pipeline_team.md) · [as-dc202a66c974](https://docs.agentscope.io/en/versions/2.0.9/deploy/agent-service.md)

### 26 · 计划与 SOP 组织复杂工作的约束

计划让当前步骤和剩余工作可见，SOP 用 executor 与 verifier 推进固定里程碑。二者用于组织工作，不替代工具回执或最终接受。

用户改变要求时，要判断是调整后续计划，还是改变业务规则。流程内的核验应连接文件、测试或人工结果，确保完成标签有依据。

| 局部 | 实现与作用 |
|---|---|
| 计划 | 记录任务、进度和后续步骤。 |
| SOP | 约束特定工作流程。 |
| 任务变化 | 根据新材料调整后续计划。 |
| 核验推进 | 按阶段结果决定继续。 |

计划完成状态依据实际执行结果。

依据：[as-ae1de456793f](https://docs.agentscope.io/en/versions/2.0.10dev/building-blocks/plan.md) · [as-6c4048dcd902](https://docs.agentscope.io/en/versions/2.0.10dev/building-blocks/sop.md)

## 04 · Python 服务

### 27 · Agent Service 托管循环之外的资源

create_app 接受 storage、message_bus 和 workspace_manager 等依赖。启动生命周期连接资源，ChatService 处理会话输入和运行，路由层管理订阅、确认、中断和资源访问。

本地 Agent 的循环无需重新编写，服务把它接到多用户、多会话请求。多个标签页可观察同一事件流，提交和订阅不必由一个 HTTP 请求一直托住。

| 局部 | 实现与作用 |
|---|---|
| 请求层 | FastAPI 路由取得用户与会话。 |
| 托管层 | 恢复状态，分配工作区，运行 Agent。 |
| 持久层 | 保存记录，通过总线送出事件。 |

执行与多个观察者分别管理。

依据：[as-dc202a66c974](https://docs.agentscope.io/en/versions/2.0.9/deploy/agent-service.md)

### 28 · 用户身份必须来自可信入口

服务用 user_id 组织资源归属，路由层核对会话和凭据等对象的所有者。默认 X-User-ID 只是占位依赖，企业接入需要用 JWT、OAuth 或已有登录中间件替换。

共享资源另有访问策略，默认 DenyAllResourceAccessPolicy。组织关系和 IAM 由接入方实现；用户拥有某个 Agent 的访问权，也不意味着获得其全部工作区、MCP、技能和记忆。

| 局部 | 实现与作用 |
|---|---|
| 认证入口 | 验证登录会话或令牌。 |
| 用户身份 | 取得可信 user_id。 |
| 资源归属 | 检查会话、Agent 和凭据的所有者。 |
| 执行请求 | 通过校验后进入运行。 |

默认 X-User-ID 占位头需要替换。

依据：[as-dc202a66c974](https://docs.agentscope.io/en/versions/2.0.9/deploy/agent-service.md) · [as-bd153c6e3a04](https://docs.agentscope.io/en/versions/2.0.9/deploy/sharing.md)

### 29 · 存储与总线分担会话运行

持久存储保存可恢复对象，消息总线组织锁、队列、回放日志和唤醒。服务先查看 cluster-wide run lock，再从上下文推导 idle、等待确认或等待外部结果状态。

运行期间快照可能尚未反映最新进展，不能拿旧快照覆盖 worker 的 live state。删除 Session 还涉及取消运行、等待锁释放、清理消息与工作区，不能与清空聊天视图区混为一个动作。

| 局部 | 实现与作用 |
|---|---|
| Storage | 保存 Agent、Session、消息和配置。 |
| Message Bus | 管理运行锁、收件队列与唤醒。 |
| 事件回放 | 重连客户端先取得已有进展。 |
| 执行所有权 | 同一会话的运行需要协调。 |

运行中的持久快照可能落后于实时状态。

依据：[as-dc202a66c974](https://docs.agentscope.io/en/versions/2.0.9/deploy/agent-service.md)

### 30 · 长工具转入后台继续执行

后台工具卸载让耗时动作与当前前端连接解耦。服务维护执行，结果完成后进入事件流并唤醒 Agent。状态应覆盖等待、完成、失败、取消和晚到结果。

CPU 密集的文档解析要移到进程执行，避免占住 API 的事件循环。工具工作仍要关联原任务身份，防止重新连接触发重复执行。

| 局部 | 实现与作用 |
|---|---|
| 提出长任务 | 执行需要较长等待。 |
| 交给后台 | 服务维护执行与等待状态。 |
| 结果到达 | 送入同一会话事件流。 |
| 继续推理 | Agent 使用结果完成工作。 |

前端断开与后台停止分别控制。

依据：[as-dc202a66c974](https://docs.agentscope.io/en/versions/2.0.9/deploy/agent-service.md)

### 31 · Workspace 组织文件与执行环境

工作区组织目录、文件、终端、MCP 连接和技能资源。服务默认 per_agent，也支持按用户或会话分配。MCP 与技能还有自己的隔离维度。

选择粒度时，明确后续任务可见哪些材料和中间结果、何时清理，以及谁能访问。共享目录与资源授权是不同配置，位置不能代替权限判断。

| 局部 | 实现与作用 |
|---|---|
| per_agent | 同一 Agent 的会话共享工作区。 |
| per_session | 每个会话有独立环境。 |
| per_user | 同一用户的 Agent 共享环境。 |
| 生命周期 | 管理目录、连接与清理。 |

共享粒度改变文件可见范围。

依据：[as-e8bf00e52cb9](https://docs.agentscope.io/en/versions/2.0.9/building-blocks/workspace/overview.md) · [as-dc202a66c974](https://docs.agentscope.io/en/versions/2.0.9/deploy/agent-service.md)

### 32 · 沙箱限制工具在哪个环境运行

权限判定决定能否执行，沙箱决定在哪里执行。工作区接口可连接本地文件系统或隔离后端。工具对文件路径的理解还要与后端映射一致。

容器、网络出口、挂载目录、凭据、配额和回收需要共同配置。PM 可以把它们转成具体运行条件，例如可读取哪些文件、能访问哪些服务、环境保留多久。

| 局部 | 实现与作用 |
|---|---|
| 工具请求 | 文件、终端或代码执行。 |
| 工作区接口 | 把操作交给所选后端。 |
| 沙箱后端 | Docker、E2B 或 K8s 等环境。 |
| 执行结果 | 返回输出和错误。 |

网络、挂载与凭据范围显式配置。

依据：[as-e8bf00e52cb9](https://docs.agentscope.io/en/versions/2.0.9/building-blocks/workspace/overview.md) · [as-13b26f7a4513](https://docs.agentscope.io/en/versions/2.0.9/index.md)

### 33 · 部署一致性影响具体运行结果

多副本中，每个进程分别启动内存 cron 会重复触发。download_secret 不一致会使下载 token 在另一个副本验证失败。RAG 的 API 与 worker 后端不一致会使索引链出错。

这些条件可直接变成上线验收场景。分布式部署文档仍在建设，应按所用版本核对运行锁、状态、工作区和调度的所有权。

| 局部 | 实现与作用 |
|---|---|
| 共享后端 | API 与 worker 使用一致的存储和总线。 |
| 调度所有权 | 内存定时器由一个进程持有。 |
| 下载密钥 | 副本共用 download_secret。 |
| 解析负载 | CPU 密集任务进入进程执行。 |

重复触发、下载失败和阻塞各有原因。

依据：[as-dc202a66c974](https://docs.agentscope.io/en/versions/2.0.9/deploy/agent-service.md) · [as-8379a990984a](https://docs.agentscope.io/en/versions/2.0.9/deploy/rag.md) · [as-c788c6cd8525](https://docs.agentscope.io/en/versions/2.0.9/others/faq.md)

### 34 · 轨迹连接模型、工具与会话

TracingMiddleware 在配置 tracing 后建立 reply、LLM 和工具 spans，记录身份、用量、参数、结果和异常；流式 generator 要等最后一块再关闭 span。

前端事件、消息与 trace 是不同数据。产品分别定义用户可见内容、运维诊断内容、敏感资料处理和保留范围。耗时与用量帮助理解成本和等待，质量验收仍需看结果。

| 局部 | 实现与作用 |
|---|---|
| 界面事件 | 呈现进展与人工确认。 |
| 调用轨迹 | 关联模型和工具执行阶段。 |
| 消息记录 | 保存会话与最终结果。 |
| 运行诊断 | 定位等待、错误、用量和耗时。 |

从会话身份追到具体工具调用。

依据：[as-13b26f7a4513](https://docs.agentscope.io/en/versions/2.0.9/index.md) · [as-dc202a66c974](https://docs.agentscope.io/en/versions/2.0.9/deploy/agent-service.md)

## 05 · Java 企业接入

### 35 · 身份键关联每次调用

Java Harness 把 Agent 能力嵌入应用。Builder 保存稳定配置，运行实例接收 RuntimeContext；namespace、userId、agentId 和 sessionId 共同参与工作身份。

缺失或复用身份键可能使本应独立的会话共用状态。应用要在请求入口显式确定身份，再把会话记录、工作区和恢复路径关联起来。

| 局部 | 实现与作用 |
|---|---|
| RuntimeContext | 每次调用显式传入用户与会话身份 |
| HarnessAgent.Builder | 直接请求按次构建；后台会话保留实例。 |
| AgentState | 上下文、权限与工具状态随会话走 |

先确认身份键，再谈多租户恢复

依据：[as-0cf03f3aa25d](https://java.agentscope.io/v2/en/docs/harness/architecture.md) · [as-66d70ed869dd](https://java.agentscope.io/v2/en/docs/others/going-to-production.md)

### 36 · 即时调用与后台会话分别选择

直接调用与 AgentSession 是两种执行入口，同一会话选择其中一种。直接调用由应用管理执行；后台任务由会话调度，观察日志不会启动另一次推理。

观察连接断开后，后台工作继续，运行实例仍由会话管理器持有。respond 回答待处理交互，resume 继续未完成任务；已完成或取消的任务不能通过该操作续跑。checkpoint 恢复工作状态，外部结果仍需核对。

| 局部 | 实现与作用 |
|---|---|
| 直接调用 | call / streamEvents 由应用管理执行。 |
| 后台会话 | AgentSession 接收任务并管理排队。 |
| 运行实例 | 会话管理器持有 Agent，关闭时中断工作。 |
| 任务继续 | respond 回答等待，resume 继续未完成任务。 |

观察后台任务时，不再发起另一轮执行。

依据：[as-0cf03f3aa25d](https://java.agentscope.io/v2/en/docs/harness/architecture.md) · [as-e60a2f6c58b3](https://java.agentscope.io/v2/en/docs/harness/session-log.md)

### 37 · 执行目标确定运行所有权

Managed把Agent定义、运行时和会话交给Service平台；External保留已有应用的进程与部署，只把可观察、可执行的能力接入目录；Hosted则由Runtime Host在指定机器上启动Coding Agent提供方。

三种目标可以进入同一Session/Turn观察面，却不代表拥有相同交互能力。注册可见性、会话查询和任务派发要分开验证，不能因能看到Agent就推断它能执行全部工作。

| 局部 | 实现与作用 |
|---|---|
| Managed | Service托管Harness运行时与会话 |
| External | 应用保留进程并实现执行适配器 |
| Hosted | Runtime Host启动Coding Agent进程 |
| 共同观察面 | 都走Session/Turn，能力仍需查询 |

先选运行所有权，再选API

依据：[as-9d9136196aa8](https://java.agentscope.io/v2/en/service/index.md) · [as-d5dd49d8dc6e](https://java.agentscope.io/v2/en/service/external-agent.md) · [as-556d0c6a5726](https://java.agentscope.io/v2/en/service/runtime-host.md)

### 38 · Session 固定目标，Turn 承载任务

Session先选定Agent、Team或Workflow，并冻结创建时的目标配置；Turn才是一次提交的工作单元。这样应用可以把业务对象与Session、Turn建立稳定关联，而不必把页面状态当作任务状态。

网络重试必须保留同一个幂等键与请求体，服务会返回原Turn。只有真正的新任务才换键；排队、审批或前一Turn未结束时，后续Turn可能保持等待。 Managed 在同一 Session 保留上下文；Team 和 Workflow 每个 Turn 启动独立协作或流程。

| 局部 | 实现与作用 |
|---|---|
| Session | 固定目标配置或已发布的流程版本。 |
| Turn | 一次提交对应一项工作任务。 |
| Idempotency-Key | 同键同体重试取回原Turn |
| queue / approval | 排队或审批会阻塞后续Turn |

重试沿用原键，新增任务才换键

依据：[as-9d9136196aa8](https://java.agentscope.io/v2/en/service/index.md) · [as-79adbb1a7334](https://java.agentscope.io/v2/en/service/session-event-log.md)

### 39 · 快照与事件恢复同一视图

页面刷新时先读取Session或Turn的Snapshot，再用其中的as_of连接SSE；事件流只负责补上快照之后的变化。游标属于具体资源，不能在Session、Turn和子Agent之间混用。

事件游标过期返回410时，正确动作是加载新Snapshot并从新的as_of继续观察。重新提交任务会制造重复执行，不能用来修复一次观察断线。

| 局部 | 实现与作用 |
|---|---|
| Snapshot | 先载入消息、工具与待处理动作 |
| as_of | 从快照游标之后订阅事件 |
| Cursor | 成功应用事件后再保存 |
| 游标过期：410 | 读取新快照，从新的 as_of 继续订阅。 |

刷新先恢复状态，不重投任务

依据：[as-528e3df546ca](https://java.agentscope.io/v2/en/service/sse-events.md) · [as-eb83f48e5259](https://java.agentscope.io/v2/en/service/operations.md)

### 40 · 控制入口按目标能力提供

Service 把指导、材料注入、动作答复和继续执行分开：steer 影响后续步骤，inject 添加背景，Turn 的 /actions 接收 request_id 与 payload 回答 required action，resume 继续原任务。

前端先读取 Turn 的 /capabilities 和 available_commands 再展示控件。Hosted 目标按提供方能力处理；事件流恢复观察，进程恢复还要有对应运行材料。

| 局部 | 实现与作用 |
|---|---|
| steer | 修改后续步骤，已发模型请求不变 |
| inject | 注入背景，不立即触发推理 |
| actions | 按 request_id 回答待处理动作。 |
| resume | 动作处理后按能力继续原Turn |

先看capabilities，再展示按钮

依据：[as-79adbb1a7334](https://java.agentscope.io/v2/en/service/session-event-log.md) · [as-528e3df546ca](https://java.agentscope.io/v2/en/service/sse-events.md) · [as-556d0c6a5726](https://java.agentscope.io/v2/en/service/runtime-host.md)

### 41 · 文件发布为可取得的 Artifact

输入文件先上传到Session并取得file_id，再作为结构化任务输入；它属于这个Session，是否可用还取决于目标的file_input能力。Agent工作目录里的文件不会自动变成应用可下载的结果。

交付时要把实际文件显式发布为Artifact，读取记录后再按权限下载。Team与Workflow成员不自动共享文件系统，跨成员传递应使用可访问的Artifact，并核对内容、版本和业务验收。

| 局部 | 实现与作用 |
|---|---|
| Session file | 上传文件绑定当前Session并受能力限制 |
| Artifact | 发布实际文件，建立可下载交付记录。 |
| Team / Workflow | 成员通过 Artifact 交付，文件系统不自动共享。 |

应用按交付记录取得明确版本的文件。

依据：[as-69ccfb190c6d](https://java.agentscope.io/v2/en/service/files.md) · [as-675c5fc9c363](https://java.agentscope.io/v2/en/service/orchestration.md)

### 42 · 身份、资源与运行通道分别授权

企业接入至少有三条身份链：平台账户和Namespace决定管理范围，应用凭证决定业务调用，External运行凭证决定已注册实例如何连接。它们不能互相替代，尤其不能把一个应用Key当成终端用户的Namespace授权。

External的初始注册端点在预览文档中不负责认证调用者，应限制网络入口；注册后返回的凭证才用于后续运行连接。应用还要分别验证目录可见、Session可用和任务派发能力。

| 局部 | 实现与作用 |
|---|---|
| Account / Namespace | 先确定用户身份与资源作用域 |
| Application key | 调用Service，不替代用户权限 |
| External registration | 初始注册端点本身不认证调用者 |
| Runtime credential | 后续连接凭证需保护与轮换 |

External 注册入口由网关或受控网络保护。

依据：[as-c4d45549fd7a](https://java.agentscope.io/v2/en/service/access.md) · [as-d5dd49d8dc6e](https://java.agentscope.io/v2/en/service/external-agent.md) · [as-13473668ae95](https://github.com/agentscope-ai/agentscope-java/blob/65a35d40abc2925b57c2d23c65f2081a599972a8/agentscope-service/README.md)

### 43 · 恢复同时核对状态与副作用

跨进程继续需要会话日志、checkpoint、workspace 和 sandbox 状态各自正确保存；调度锁与运行所有权还需要明确协调。共享后端与隔离策略是不同配置，改变隔离范围不会自动迁移既有数据。

恢复前查询目标能力、Turn 状态、待处理动作和不确定结果。事件重连恢复观察，Hosted 统一调用路径标记 checkpoint_restore:false；已发生的外部写入还需业务系统核对。

| 局部 | 实现与作用 |
|---|---|
| Capabilities | 决定互动、取消与resume是否可用 |
| 共享持久层 | 会话日志、工作文件和沙箱快照各有后端。 |
| External effects | 恢复记录，不撤销已发出的操作 |

恢复是条件分支，不是回到原点

依据：[as-e60a2f6c58b3](https://java.agentscope.io/v2/en/docs/harness/session-log.md) · [as-556d0c6a5726](https://java.agentscope.io/v2/en/service/runtime-host.md) · [as-79adbb1a7334](https://java.agentscope.io/v2/en/service/session-event-log.md)

### 44 · 协作有三种不同层次

Subagent 是当前 Agent 内的委派，Team 组织独立成员协作，Workflow 把过程写成明确步骤。三者可以组合，但不是同一层的不同名字。Service 把 Team 和 Workflow 接入 Session API，内部还需要检查成员实际承担的工作与结果。

Team 的成员并不自动共享文件系统。协作应通过明确的文件或 Artifact 传递关系组织，最后由相应成员汇总。需要人工接受的成果再进入业务工作记录。

| 局部 | 实现与作用 |
|---|---|
| Subagent | 当前 Agent 内委派一段有界任务。 |
| Team | 不同成员分工、沟通与汇总。 |
| Workflow | 按显式步骤和依赖推进工作。 |

文件共享通过明确交付关系配置。

依据：[as-675c5fc9c363](https://java.agentscope.io/v2/en/service/orchestration.md)

### 45 · Issue 把执行接到工作接受

当任务需要负责人、讨论和人工接受时，Issue 提供工作层记录。它保存目标与交付标准，再把执行交给 Agent 或 Team。Run 和相关记录说明系统做了什么，Issue 的接受或退回说明负责人如何判断成果。

用户提出修改要求与启动执行也需要区分。若工作已到达却没有结果，应从 Run、Node 和最新 Attempt 检查依赖、等待批准、缺输入、失败或部分交付，而不是只看最后一条聊天消息。

| 局部 | 实现与作用 |
|---|---|
| 定义 Issue | 保存目标、负责人和交付标准。 |
| 分配执行 | 交给 Agent 或 Team 处理。 |
| 跟踪过程 | 检查执行记录、结果与讨论。 |
| 人工接收 | 接受或退回需要判断的工作。 |

执行完成与工作被接收分别记录。

依据：[as-675c5fc9c363](https://java.agentscope.io/v2/en/service/orchestration.md) · [as-eb83f48e5259](https://java.agentscope.io/v2/en/service/operations.md)

### 46 · 调用资源与读取工作分别授权

Service 区分账户身份、Namespace 角色、资源操作和工作可见性。Namespace 是授权边界，Workspace 则提供运行文件；二者不能用同一种“空间”概念替代。资源发现、use 操作和读取私人工作是不同判断。

访问失败时，按身份和 namespace、资源决策、依赖权限、Issue 分享逐层排查。团队自身有 use 权限，也需要核对成员 Agent 以及 Memory、Vault、Environment 等依赖。

| 局部 | 实现与作用 |
|---|---|
| 账户身份 | 确认访问者是谁。 |
| Namespace | 选择资源与授权边界。 |
| 资源动作 | 判断是否可以发现、使用或管理。 |
| 工作共享 | 决定能否读取某个 Issue、会话或文件。 |

可调用 Agent，不等于可读他人的工作。

依据：[as-c4d45549fd7a](https://java.agentscope.io/v2/en/service/access.md)

### 47 · 预算控制工作能继续到哪一步

Managed Session 的 /budget 限制模型调用次数和已报告的累计用量。Token 与费用预算无法强制截断已经启动的并行调用；费用上限还需要模型定价。

应用级并发与 Token 预算另行管理。预算调整和任务继续是不同操作，续跑仍围绕原任务状态和可用控制进行。

| 局部 | 实现与作用 |
|---|---|
| 用量归属 | 按 Session 和任务记录消耗。 |
| Managed 预算 | 限制模型调用次数或累计用量。 |
| 达到上限 | 按能力和状态决定是否停止。 |
| 继续工作 | 调整额度后对原任务执行控制。 |

已启动的并行调用不会被额度强行截断。

依据：[as-79adbb1a7334](https://java.agentscope.io/v2/en/service/session-event-log.md)

### 48 · 消息渠道连接外部对话与任务

渠道接入负责消息接收、目标路由和结果回传。外部对话与执行记录应保持稳定关联。当前飞书的 Issue 路由支持 Agent 或 Team，其他适配器要分别查询能力。

渠道与 Automation 独立配置。当前 Automation 不能直接以 Workflow 为目标，已有 Workflow 需要通过发布后的 Session API 接入应用。这些具体边界影响产品触发方式的设计。

| 局部 | 实现与作用 |
|---|---|
| 消息渠道 | 接收外部平台的工作请求。 |
| 目标路由 | 关联到配置的 Agent 或 Team。 |
| 执行观察 | 跟踪对应会话、Issue 和结果。 |
| 渠道回传 | 把结果送回原外部对话。 |

飞书 Issue 路由当前不接 Workflow 目标。

依据：[as-675c5fc9c363](https://java.agentscope.io/v2/en/service/orchestration.md)

### 49 · Webhook 重复投递按事件身份合并

Webhook 的至少一次投递允许同一事件重试，接收方应按事件身份去重并持久记录处理结果。接收确认只说明通知通道处理到了相应阶段。

通知触发的邮件、系统写入或支付类动作还需要自身幂等与结果查询。重投事件不能直接再次执行副作用，否则通知的可靠性反而带来重复业务操作。 接收方先验证原始请求体签名与时间，再持久化并按事件身份去重。

| 局部 | 实现与作用 |
|---|---|
| 发出事件 | 运行产生带身份的通知。 |
| 接收投递 | 同一事件可能重复到达。 |
| 身份去重 | 接收方合并同一事件。 |
| 业务处理 | 副作用使用自己的幂等契约。 |

通知已接收与业务事务完成分别核对。

依据：[as-528e3df546ca](https://java.agentscope.io/v2/en/service/sse-events.md) · [as-eb83f48e5259](https://java.agentscope.io/v2/en/service/operations.md)

### 50 · 恢复需要成套的数据与密钥

运维文档把数据库、共享 Workspaces 和 Artifacts 列为持久数据，同时要求保留加密数据所需的原 Vault master key。恢复需要这些材料对应同一备份点，并使用匹配组件版本。

恢复验收包含登录、已有 Agent、Session 历史、文件、Vault 解密、runtime 连接和一项新工作。只打开知识问答页面不能证明凭据恢复正常；工作接受状态也应与备份点一致。

| 局部 | 实现与作用 |
|---|---|
| 数据库 | 保存定义、会话、任务与工作状态。 |
| 文件快照 | 保存对应 Workspace 和 Artifact。 |
| Vault 密钥 | 使用原密钥解密已经保存的凭据。 |

恢复后核对历史、文件、解密和新任务。

依据：[as-eb83f48e5259](https://java.agentscope.io/v2/en/service/operations.md)

## 06 · 从机制到方案

### 51 · 失败处理沿原任务身份闭环

企业失败场景可以映射到已有控制点：上下文补件、权限拒绝、回执查询、去重、指导和新任务。业务方把具体规则、责任人与下游接口接入。

执行中、等待确认、已生成、已发布与已接收应分别定义，使用户能够判断下一步，而不只看到一个错误提示。

| 局部 | 实现与作用 |
|---|---|
| 缺少依据 | 补材料后再推理。 |
| 权限拒绝 | 返回拒绝结果，停止外部执行。 |
| 结果未知 | 查询下游回执，再决定重试。 |
| 输入改变 | 更新后续要求，核对受影响动作。 |

状态、事件和外部回执决定下一步。

依据：[as-f2b9fa0f0bea](https://docs.agentscope.io/en/versions/2.0.10dev/building-blocks/agent_overview.md) · [as-79adbb1a7334](https://java.agentscope.io/v2/en/service/session-event-log.md)

### 52 · 合同助手需要可检查的契约

输入契约定义材料与版本，动作契约定义副作用和授权，状态契约区分暂停、取消和未知结果，交付契约定义结构化结果与文件身份。

这一组契约把合同助手分到构建块、服务、工作区和业务应用。各层可以独立实现，也能沿同一任务回查其关系。

| 局部 | 实现与作用 |
|---|---|
| 输入契约 | 合同版本、依据与访问范围。 |
| 动作契约 | 查询、保存和发布的参数与授权。 |
| 状态契约 | 等待、完成、中断与结果未知。 |
| 交付契约 | 结果字段、依据与文件版本。 |

每项需求找到对应文档和实现层。

依据：[as-dc202a66c974](https://docs.agentscope.io/en/versions/2.0.9/deploy/agent-service.md) · [as-69ccfb190c6d](https://java.agentscope.io/v2/en/service/files.md)

### 53 · 从 Agent 循环走到企业工作闭环

AgentScope 把推理、工具与持续运行的机制接起来。需求从任务进入，逐层确定输入、动作、暂停、状态保存、执行所有权和交付。

Python 和 Java 各给出对应入口，最终方案把企业已有的身份、审批、权威记录与文件交付接到请求链上。

| 局部 | 实现与作用 |
|---|---|
| 构建能力 | 消息、模型、工具、上下文与权限。 |
| 托管执行 | 会话、工作区、事件、状态与恢复。 |
| 接入业务 | 身份、任务、副作用与交付。 |

PM 用业务状态提问，研发用契约回答。

依据：[as-13b26f7a4513](https://docs.agentscope.io/en/versions/2.0.9/index.md) · [as-9d9136196aa8](https://java.agentscope.io/v2/en/service/index.md)
