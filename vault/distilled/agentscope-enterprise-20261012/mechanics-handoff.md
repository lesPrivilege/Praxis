# AgentScope Python 2.0.10dev：机制交接

## 版本、来源与读法

本批次以官方仓库 agentscope-ai/agentscope 的 main commit e4c1e074dee3f0f6cca28ca29e934c4ec0605354 为唯一 source 基线（访问日 2026-10-12；该 commit 提交于 2026-10-10）。同一 commit 的 source/src/agentscope/_version.py 是 2.0.10dev；因此正文使用官方 2.0.10dev 文档。2.0.9 只保留为稳定版入口对照，没有拿它补写新增 API。文档索引明确要求不要把 1.x 和 2.x API 混用。

源码证据 URL 的规律是 https://github.com/agentscope-ai/agentscope/blob/e4c1e074dee3f0f6cca28ca29e934c4ec0605354/<path>#Lx-Ly，文档使用 https://docs.agentscope.io/en/versions/2.0.10dev/<page>。对应原件、URL、SHA-256 和用途在 sources.json；必要原件副本在 source/。本批次保存 98 个选定 Python source 文件和 30 个 docs/index/API/配置文件，按模块做了有限阅读，不是逐行审计。

下面每节按产品经理需要的顺序回答：问题 → 输入 → 内部流程 → 输出 → 失败/边界。行号是本地副本行号，URL 仍指向官方版本。

局部定位约定：完整路径写成 source/src/…；为便于阅读，省略 source/src/agentscope/ 前缀的源码路径（如 agent/_agent.py）相对于 source/src/agentscope/，省略 source/docs/ 前缀的文档路径相对于 source/docs/。

## 1. Msg、content block 与 Event：一次回复如何变成可恢复的消息

**PM问题：前端、模型和多智能体之间传递的最小事实单元是什么？**

**输入。** Msg 是带 name、role、有序 content、metadata/id/timestamp 的 Pydantic 对象；字符串会被包装成 TextBlock。用户消息只允许 text/data，系统消息只允许 text，assistant 消息允许所有块（source/src/agentscope/message/_base.py:32-129）。块类型是 TextBlock、可保留 provider extra 字段的 ThinkingBlock、base64/URL 二选一的 DataBlock、运行时提示 HintBlock、ToolCallBlock 和 ToolResultBlock（source/src/agentscope/message/_block.py:11-126, 128-235）。

**内部流程。** 流式输出用 reply_id 标识一次回复，再用 block_id 或 tool_call_id 标识块；文字、思考、数据、工具调用和工具结果一般走 start → delta → end，Hint 是一次性完整事件。事件枚举还包括 REQUIRE_USER_CONFIRM、REQUIRE_EXTERNAL_EXECUTION、确认结果、外部执行结果、用户中断和 CUSTOM（服务层状态通知）（source/src/agentscope/event/_event.py:25-66, 288-405, 442-595）。Msg.append_event() 校验 reply_id，按事件追加/更新块，累计每次 MODEL_CALL_END 的 token 使用，并在 REPLY_END 写入完成原因/error；错 reply 或缺失目标块只记录 warning 后跳过（source/src/agentscope/message/_base.py:243-317, 355-517）。

**输出。** 一次 reply_stream 的事件可以在后端、浏览器或 TS 客户端重建出完整 assistant Msg；最终消息带 finished_reason、累计 usage、可选 structured_output 和 error。ToolCallBlock 状态是 pending → asking → allowed/submitted → finished；工具结果是 running/success/error/interrupted/denied。官方说明与重建表见 docs/building-blocks_message-and-event.md:21-59, 249-309, 546-589。

**失败/边界。** 输入角色的块类型不对会在构造时失败；数据 delta 要求 data 与 url 恰好一个，base64 delta 逐块 decode/再 encode，不能简单拼接（event/_event.py:212-235；message/_base.py:325-353）。缺失 start 的 delta、错 reply 的事件会被跳过，不能把事件到达当成状态一定改变。Thinking 块可能包含 provider 私有签名，不能把 type=thinking 当作只含可显示思维。音频 assistant DataBlock 会在写入 agent context 时过滤，仍通过事件给前端播放（agent/_agent.py:3428-3478）。

## 2. ReAct loop：Agent 如何在推理、工具和结束之间循环

**PM问题：一轮聊天从哪里开始，什么时候真正结束，什么时候只是暂停？**

**输入。** Agent.reply/reply_stream 接受一条或多条 Msg 开始新回复；也接受 UserConfirmResultEvent、ExternalExecutionResultEvent 续接停在外部交互的回复、UserInterruptEvent 放弃停住的回复，None 则从当前状态继续（docs/building-blocks_agent_run-agent.md:21-45）。状态由 AgentState 承载。

**内部流程。** _reply_impl 先把输入分成消息或事件，校验是否真的在等待对应的 HITL/外部结果；新消息写入 context 并建立新的 ReplyContext，续接则只处理事件。然后动态增删结构化输出工具，循环调用只读的 _next_action：

1. 有可执行 tool call 时进入 Acting；没有时进入 Reasoning。
2. Reasoning 前做 context compression 和 runtime-state injection，然后 _prepare_model_input 组装 system prompt、summary、context 和 activated groups 的 tool schemas，再调用模型。
3. 模型响应转成事件；有 tool call 就进入 Acting，否则产出候选 final message。is_concurrency_safe 的工具并发执行，其余按连续顺序执行；一轮只有在工具全部有结果后才增加 cur_iter（agent/_agent.py:1035-1270, 2096-2134, 3241-3277）。
4. 若存在等待权限/外部执行的调用，loop 返回 waiting notice，不发 ReplyEndEvent；开发者把结果事件喂回才会继续。若完成或超过预算，发 ReplyEndEvent 和最终 Msg。middleware 若吞掉结束事件可要求再跑一轮，但连续两次吞掉且中间没有推理/执行会触发 busy-loop RuntimeError（agent/_agent.py:1143-1176）。

**输出。** reply 吞掉中间事件只返回最终 Msg；reply_stream 逐事件输出，可选最后再给完整 Msg。正常文本是 completed；普通 max-iteration 结束前会强制一次禁用工具的总结调用；结构化输出还会给 structured_output_grace_iters 次机会。停在 HITL 时 finished_reason=None，代表未完成，不是成功（docs/building-blocks_agent_run-agent.md:46-85；agent/_agent.py:3550-3760）。

**失败/边界。** 新输入不能含 system、thinking、tool call/result 块，否则 _handle_incoming_messages 抛 ValueError；不支持的附件若 formatter 不接收，会尝试 offload 成路径文本，否则只给 system reminder（agent/_agent.py:2035-2095）。模型流没有 is_last=True 会抛 RuntimeError；API 异常由模型层 retry/fallback 后再抛；并发工具会等全部 worker，异常合并为 ExceptionGroup。超出 max_iters 的消息可能仍有可用文本，但 finished_reason 是 exceed_max_iters。

## 3. Permission：tool schema 合法不等于可以执行

**PM问题：模型已经给了合法函数参数，系统还在哪一层决定能不能真的做？**

**输入。** Agent 先查工具是否可用，再用 JSON repair 解析 raw tool input，按 input_schema 校验，成功后才把 ToolBase、解析后的 dict 和持久化 PermissionContext 送进 PermissionEngine（agent/_agent.py:2431-2525）。Context 有 mode、allow/deny/ask 规则；规则匹配委托给具体工具（Bash 子串/前缀、Read/Write/Edit 路径 glob 等）（permission/_engine.py:17-30；permission/_context.py:24-46）。

**内部流程。** DEFAULT 的固定顺序是 deny rule → ask rule → read-only fast path → tool 自检 → allow rule → 默认 ASK；EXPLORE 对非 read-only 直接 DENY，故意不调用 tool 自检，也不让 allow rule 解除只读保证（permission/_engine.py:117-212, 214-295）。ACCEPT_EDITS 允许工作目录内的编辑；BYPASS 只保留显式 deny/ask rule 和 tool DENY，工具 safety ASK 不强制；DONT_ASK 把所有 ASK（包括 safety ASK）转成 DENY（permission/_types.py:18-102；permission/_engine.py:297-486）。

**输出。** ALLOW 才发 ToolResultStartEvent 并进入工具；DENY 或输入错误会变成 ToolResultBlock(state=denied/error) 回喂模型；ASK 会更新调用为 asking 并发 RequireUserConfirmEvent，续接后的允许规则可在同批并发调用中去重（agent/_agent.py:2518-2599）。

**失败/边界。** 未注册工具、inactive group、JSON 修复失败、schema 不匹配都不触发副作用，直接返回模型可读错误。EXPLORE 是产品级绝对只读模式；BYPASS 是相反的信任边界，不能被描述成安全沙箱。外部工具的成功结果还要按 metadata_schema 校验，失败时保持 parked 让执行方修正（tool/_base.py:265-320）。

## 4. Model 与 Formatter：供应商差异停在哪一层

**PM问题：同一 Agent 怎样切换模型供应商，同时保持 Msg、工具和流式协议稳定？**

**输入。** ChatModelBase.__call__ 接收 list[Msg]、工具 function schemas、ToolChoice，provider 子类的 _call_api 完成实际转换；共有 credential、model、stream、max_retries、context_size（model/_base.py:37-99, 182-216）。Formatter 负责 Msg → list[dict]，并用 input_types 声明可接收的 MIME 类型（formatter/_formatter_base.py:20-67）。

**内部流程。** model base 对可重试 provider 异常做 max_retries+1 次尝试；streaming 时把 delta 累加成最终 chunk，取消时给出带 partial content 的 FinishedReason.INTERRUPTED。Agent 再把 chunk 转成 Msg/Event。结构化输出是临时注册 generate_structured_output function，强制/自动/关闭 thinking 等策略逐级 fallback，并对 Pydantic/JSON Schema 做校验（model/_base.py:457-593, 595-741）。

FormatterBase 对工具结果中的多模态块做能力分流：支持的媒体会被提升到后续 user message，不支持的 URL 用 URL、base64 则写临时文件路径；稳定 block id 保证重复格式化不生成新 id（formatter/_formatter_base.py:69-187）。OpenAI 普通 formatter 保留 native role/tool_call/tool result；thinking history 被跳过，Hint 被转为 user message；OpenAIMultiAgentFormatter 把多名 speaker 组成带 history 的命名 transcript，而工具序列仍用原生格式（formatter/_openai_formatter.py:229-420, 423-570）。

**输出。** 非流式模型返回完整 ChatResponse；流式模型返回 is_last=False 的 delta 和 is_last=True 的完整响应，均包含 content blocks、usage 和 finished reason。结构化输出返回经过 schema 验证的 dict，Agent 最终放在 Msg.structured_output。模型 card 还把 context size、输入/输出 MIME、参数 schema 提供给前端（docs/building-blocks_model_overview.md:12-32, 52-105）。

**失败/边界。** tool_choice 中不存在的工具在 model base 先失败；自定义 provider 不能把 delta 自己累加两次。流中没有最终 chunk 会由 Agent 报错；取消会保留 partial 响应但不能当完成。Formatter 的媒体能力是 provider/model 约束，不能只因为 Msg 有 DataBlock 就断言模型看到了它。普通 formatter 会丢多实体名称，必须显式选 MultiAgentFormatter（docs/building-blocks_agent_configure-agent.md:114-190）。

## 5. Toolkit、function schema 与 ToolResponse

**PM问题：模型看到的函数定义、运行时允许的工具、最终工具结果为何不是同一个对象？**

**输入。** Toolkit 注册 Python ToolBase、MCP clients、Skills 和 tool groups；basic group 总是参与，其他 group 要在 AgentState.tool_context.activated_groups 中激活。工具声明 input_schema、并发安全、read-only、external/state-injected、可选 metadata_schema（tool/_base.py:100-135；tool/_toolkit.py:66-169）。RegisteredTool.get_tool_schema 删除 preset kwargs、移除 titles、合并 properties/required/$defs，冲突会抛 ValueError（tool/_types.py:24-153）。

**内部流程。** Agent 在每次模型调用前取 activated tools 的 JSON schemas（tool/_toolkit.py:171-223）。工具调用时 Toolkit 再次按 activated group 检查，修复 JSON 参数，按需注入 live AgentState，把 sync/async/streaming 函数统一成 ToolChunk async stream。每个 chunk 同时 yield 给事件层并 append 到一个 ToolResponse；最后 Agent 把它转成 ToolResultBlock 写回上下文（tool/_toolkit.py:225-330；tool/_base.py:42-97, 190-263）。

**输出。** 模型看到的是 type=function/function.name/description/parameters；工具执行中是 ToolChunk(content, state=running, metadata, is_last)；聚合结果是 ToolResponse(content, state=success/error/denied/interrupted, metadata)，按 block id 合并文字/base64 并保留最严重错误状态（tool/_response.py:28-170）。

**失败/边界。** inactive group 和不存在的 tool 都生成模型可读 error chunk；MCP 列举失败只撤下该 MCP 的工具并 warning，不拖垮整轮（tool/_toolkit.py:473-554）。工具 schema 的重复字段或 $defs 内容冲突会在注册/扩展时失败；external 工具不能直接 call，只发 RequireExternalExecutionEvent；state-injected 工具拿到 live state，middleware 若后台化可能产生并发状态突变（agent/_agent.py:2773-2801）。ToolResponse 的 URL DataBlock 不能像 base64 一样继续追加，否则抛 ValueError。

## 6. AgentState、上下文压缩与 Service Session

**PM问题：怎样把一个停在工具确认上的长会话交给另一个进程，且知道它究竟是 running 还是 waiting？**

**输入。** AgentState 是可 JSON 序列化的持久单元：session_id、summary、未压缩 context、reply_context、permission、tool cache/activated groups、tasks 和 middleware context（state/_state.py:182-298）。ReplyContext 会把进程内 Pydantic class schema 序列化成 JSON Schema dict；重启后可恢复结构化要求，但 custom validator/default_factory 与进程内 class 校验语义可能不同（docs/building-blocks_agent_run-agent.md:133-228）。

**内部流程。** 同一 reply 的 assistant 块按 reply_id 合并到一个 Msg；等待状态只看 context 尾部该 agent 的 ASKING 或无结果 SUBMITTED 调用（state/_state.py:298-403）。Reasoning 前用 model count_tokens 比较 trigger_ratio × context_size，可保留最近消息、用 structured summarization 生成 summary，并把压缩内容 offload 到 workspace；工具结果也可按 token limit 截断并交给 offloader（docs/building-blocks_context_compress-context.md:12-112；docs/building-blocks_context_offload-context.md:12-116）。

Service 层把 durable storage 和 live message bus 分开：创建 session 以 (user_id, agent_id, workspace_id) 唯一，重复调用 upsert；状态先查 cluster-wide run lock，只有无人运行时才从持久化 context 尾部推导 IDLE/AWAITING_PERMISSION/AWAITING_EXTERNAL_RESULT（app/_router/_session.py:288-374；app/_service/_session.py:61-180）。SSE 先回放当前 run replay log 再接 live events；跨 session 的 team HITL UI card 用 projection 存在 bus 上并复用目标 session 的 SSE（app/_service/_session_projection.py:45-186；官方 api-reference/sessions/subscribe-to-a-sessions-event-stream-sse.md:10-39）。

**输出。** 应用侧可保存/读取完整 AgentState，Service 侧给 session id、状态、持久消息和事件流。POST /sessions/{id}/interrupt 对 running 广播 cancel，对 parked 入队 UserInterruptEvent，idle 是 no-op，成功返回 202 且对已有 session 幂等（app/_router/_session.py:418-458；官方 api-reference/sessions/interrupt-a-running-or-hitl-parked-chat-run-for-a-session.md:123-138）。

**失败/边界。** running 时持久快照可能 stale，不能用它覆盖 worker 的 live state；run lease 过期后才从 RUNNING 退回可推导状态。首次保存应 upsert，直接 update_session_state 对不存在 session 抛 KeyError（docs/building-blocks_agent_run-agent.md:230-314）。删除 session 是级联动作：先跨进程取消/等锁释放，再删除 storage、bus replay/inbox/workspace；应与普通清空对话区分。

## 7. RAG 与长期记忆：检索结果怎样进入 loop

### RAG

**输入。** KnowledgeBase 绑定 embedding model、vector store、collection 和可选 metadata_filter；文件先经 parser 得 Section，再经 chunker 成 Chunk，最后统一 embedding + insert（docs/building-blocks_rag.md:12-24, 97-219；rag/_knowledge.py:47-126）。

**内部流程/输出。** search 批量 embed queries、并发查 vector store、按 (document_id, chunk_index) 去重、过滤 score、降序排序、截断 top_k；绑定 text-only embedding 时 DataBlock query 被静默丢弃。metadata_filter 同时约束 search/list，并强制写到 insert 的每个 chunk，形成多租户边界（rag/_knowledge.py:190-273, 279-355）。RAGMiddleware 有两种路径：agentic 暴露 search_knowledge 工具，必须手动把 middleware 的工具加入 Toolkit；static 在每个 reply 第一次 reasoning 前检索，把结果做成 HintBlock，可选择是否持久化（middleware/_rag.py:6-25, 626-666, 831-1006）。可选 reranker 先扩大候选再让 chat model 选 top_k，失败只 warning 并回退 vector order。

**失败/边界。** parser、PDF/PPT/Word/Excel 依赖是可选 extra；不同 embedding/metric 的 score 不能跨知识库比较，L2 可能是负数；rerank_candidate_k 必须不小于 top_k 且最多 50（docs/building-blocks_rag.md:298-311, 388-500）。static Hint 默认不持久化，避免污染下一轮；文本 embedding 对多模态 query 的静默丢弃是产品上必须显示/记录的边界。

### Long-term memory

**输入/流程。** 长期记忆全部是 middleware：Agentic Memory 维护 workspace-local Markdown 并让 agent 自主读写；ReMe 在 on_reply 捕获会话、按 agent.state.session_id 做自动 write-back，检索可 static/agent/both；Mem0 也提供 static_control（middleware 自动搜索、注入 AssistantMsg(name=memory)、回写）和 agent_control（暴露 search_memory/add_memory 工具），both 两者都开（docs/building-blocks_long-term-memory.md:10-24, 65-104, 218-320, 312-439；reme/_middleware.py:475-551；mem0/_middleware.py:86-115, 283-411）。

**输出/边界。** 写回跨 session，static 检索结果进入当前 context；ReMe search 覆盖 workspace，不只当前 session，且 middleware 生命周期需要显式 close()。缺 session id 时 ReMe 跳过写回，外部 memory 调用失败按实现记录 warning/不阻断主回复；可选依赖、embedding dimension、远程 memory 服务和异步回写都不属于 Agent core 的强保证。

## 8. Multi-agent、pipeline 与“MsgHub”版本差异

**PM问题：2.0 中多个 Agent 如何共享工作而不把旧 1.x 的消息总线概念误当成当前 API？**

当前 commit 的 Python 包/2.0.10dev docs 未出现 MsgHub/msghub API；当前多实体对话的官方路径是：给同一个 Agent 喂多名 Msg(name=...)，用 provider 的 MultiAgentFormatter 保留 speaker transcript；Agent 间单向传递可用 observe。这不是 1.x MsgHub 的等价命名，主代理不要把旧 tutorial 的 MsgHub 讲成 2.0 contract（docs/building-blocks_agent_configure-agent.md:114-190；本批次抓取的 98 个 source 文件中 rg MsgHub|msg_hub|msghub 无命中）。

**GoalPipeline。** 输入是一个 goal Msg，第一次同时定义 executor 要做什么和 verifier 要检查什么。内部是 executor → structured report → verifier 返回 pass/fail/impossible；fail 才消耗 max_iters，invalid structured output 走 max_retries，拒绝可把 message 反馈给 executor；verifier_reset_context 默认清空 verifier context。输出是两者事件合流的单一 reply_stream，用各自 reply_id 区分；HITL 续接按 reply id 路由，预算在 pipeline instance 上，不会因 resume 重置（pipeline/_goal_pipeline.py:55-177, 225-329；docs/building-blocks_pipeline_goal.md:10-29, 106-173）。边界是 verifier 也是普通 Agent，可能失败、需要工具或被 HITL；达到 max_iters 后 stream 关闭，最后 message 留在 verifier context。

**TeamPipeline。** 输入是 leader、带 description 的 member 列表和 leader 的用户消息。构造时注册 TeamAssign external tool；leader 传 member + 完整 prompt，member 在自己的 context 中运行，最终 text/data 变成 TeamAssign tool result 回 leader。相同 member 的 assignment 串行，不同 member 可并发；member 自己的 permission 仍生效，TeamAssign 本身跳过 permission。leader/member 事件合流，HITL 结果按 parked member 的 reply_id 路由；默认 leader reply 结束时清空 member context（pipeline/_team_pipeline.py:37-126, 130-205, 284-414；docs/building-blocks_pipeline_team.md:10-36, 138-203）。Pipeline 文档标明该模块 experimental，接口可变（docs/building-blocks_pipeline_overview.md:10-69）。

## 9. Hooks、streaming、tracing：企业线的可观测插槽

**PM问题：需要加计费、fallback、审计、限流或观测时，能插在哪里而不改 Agent loop？**

MiddlewareBase 提供七个生命周期插槽：on_reply、on_reasoning、on_check_permission、on_acting、on_model_call、on_compress_context 是 onion before/after；on_system_prompt 是按顺序变换字符串的 transformer。middleware 还可提供 tools、用稳定 key 写入 AgentState（middleware/_base.py:13-31, 68-303）。重要职责边界是 on_acting 只包 toolkit.call_tool 的纯 I/O，输入解析、permission 和 context 写入在 hook 外完成；state-injected 工具若被后台 offload 可能并发改 state。

TracingMiddleware 在 tracing 未 setup 时直接透传；配置后建立 reply、LLM、tool spans，收集 session/reply id、模型请求/响应 usage、工具参数/结果、HITL/external pending；外部执行结果补 synthetic tool span。streaming model/tool generator 要等最后一块后再关 span，异常记录并设 ERROR（middleware/_tracing/_trace.py:117-255, 259-374）。这说明 streaming 是运行契约：观察者应消费事件/最终 Msg，而不能在每个 delta 上假设一次完整工具结果。

## 10. Interrupt、HITL 与 evaluation 语义

**PM问题：用户确认、外部执行、人为中断和自动评估怎样共用一套暂停/恢复协议？**

HITL 的输入是 RequireUserConfirmEvent 或 RequireExternalExecutionEvent；Agent 更新 tool state 后结束当前 stream，既不保留等待 coroutine，也不发 completed end。调用者把 UserConfirmResultEvent 或 ExternalExecutionResultEvent 喂回，Agent 按 tool call id 校验并继续。UserInterruptEvent 只对 parked reply 有意义：关闭未完成 tool calls，产生 INTERRUPTED tool result 和 fallback assistant Msg；正在生成的模型/工具则由取消 asyncio task 处理，保留 partial output（event/_event.py:495-518；agent/_agent.py:1079-1122, 1271-1305；docs/building-blocks_agent_human-in-the-loop.md:10-103；docs/building-blocks_agent_interrupt-agent.md:10-88）。

自动 evaluation 在当前 2.0 core 没有单独的 evaluate 包；当前可组合的“评估”原语是 GoalPipeline verifier、SOP step verifier、结构化输出校验和外部工具/测试返回。GoalPipeline 的 verifier 可以自己读文件、跑命令或请求人，再用 pass/fail/impossible structured result 判定；SOP 也以 executor/verifier 的 verdict 推进固定 milestone（docs/building-blocks_pipeline_goal.md:106-145；docs/building-blocks_sop.md:10-26, 123-178）。因此 PM 叙事应说“可编排的 verifier/evaluation primitive”，不要说仓库提供独立 benchmark runner 或统一评测平台。

**失败/边界。** 给 idle session 发 interrupt 是 no-op；给错误 reply id 的 resume event 会 ValueError；在 parked reply resume 时重新传 structured_schema 会被 warning 并忽略，继续使用 parked schema。对 running session 的 HTTP interrupt 依靠 bus cancel/lease，返回 202 只表示请求接受，不代表下游工具已经完成清理。取消和 HITL 都必须在消费端检查最终 finished_reason/tool state，不能只看事件流是否断开。

## 覆盖缺口与需主代理裁决

- 版本边界已确定：source 与 docs 同为 2.0.10dev；2.0.9 只作为稳定版入口，不能混入新增接口。官方 docs 内嵌的一些 OpenAPI 代码块仍指向 2.0.2/2.0.4，属于文档生成版本漂移；写 Service API 时优先用当前 commit 的 router/service source，并把该漂移登记为局部缺口。
- MsgHub：当前 2.0 snapshot 没有 MsgHub；主代理应决定视频是否用“1.x 迁移差异”单独一场，或直接以 observe + MultiAgentFormatter + Pipeline 讲 2.0。
- 企业 Service：已读 session router/service、message projection 和 SSE API；未逐行覆盖全部 ChatService、Storage/Redis、workspace/channel/hub 路由。Service 的跨租户、credential 和 workspace 权限仍需主代理按场次回查。
- 外部依赖：未安装/执行 provider SDK、MCP server、vector DB、ReMe、Mem0 或 OpenTelemetry exporter；本文是源码/文档机制证据，不是运行连通性或性能验证。
- 未覆盖：TTS/realtime provider、A2A、permission tool-level parser 细节、全部 formatter/provider 差异、Java 2.0 Service。用户要求的无 TTS 讲解已遵守；Java/Service 线由主代理另行消费。

本批次没有目标项目测试结果，也没有声称 API 在本机可运行。主代理可直接从 handoff.md 取机制叙事，再按 sources.json 的 URL/行号回查原件并入 Praxis Vault。
