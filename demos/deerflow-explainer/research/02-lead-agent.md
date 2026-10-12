# 主智能体、运行时与中间件链

固定提交 3f7a076（bytedance/deer-flow）。路径前缀 `H/` = `backend/packages/harness/deerflow/`。

## 一句话

主智能体是一个 LangChain `create_agent` 图：每次运行时按配置现场装配「模型 + 工具 + 静态系统提示词 + 一条长中间件链」，中间件在模型调用前后与工具调用前后改写请求、修补状态、做限流与安全拦截；`runtime/` 负责把这个图放进后台任务里跑，并管理 run 记录、流式事件、检查点和事件落库。

## 局部清单

### 主智能体工厂（`make_lead_agent` / `assemble_lead_agent` / `_assemble_lead_agent`，主智能体装配）
- 解决的问题：同一个图入口要服务不同请求：不同模型、是否思考、是否计划模式、是否允许派子智能体、自定义智能体、免人工的定时/webhook 运行。
- 实现方式：
  1. 先冻结检查点通道模式（`full`/`delta`），之后进程内不可改。
  2. 读运行时配置：`model_name`、`thinking_enabled`、`reasoning_effort`、`is_plan_mode`、`subagent_enabled`、`max_concurrent_subagents`、`max_total_subagents`、`agent_name`、`is_bootstrap`。
  3. 解析模型：请求值 → 自定义智能体配置 → `config.models[0]`；名字在配置里不存在则回退默认模型并告警；再过 `model:use` 授权，被拒则退到第一个允许的模型。
  4. 思考/推理优先级：请求 > 自定义智能体默认 > 默认值（thinking 默认 `True`，reasoning_effort 默认无），再按模型的推理契约归一（不支持思考的模型自动降为非思考）。
  5. 调 `create_chat_model` 建模型、`get_available_tools` 取工具（按 tool_groups、MCP 插件过滤，再做工具授权 Layer 1，再把 MCP 工具按 `tool_search` 拆成延迟加载集合）。
  6. `build_middlewares` 生成中间件链；`apply_prompt_template` 渲染系统提示词；`create_agent(model, tools, middleware, system_prompt, state_schema=ThreadState, context_schema=dict)` 编译成图。
  7. 若配置了追踪，回调挂在图调用根上，并把 agent_name、model_name、thinking_enabled、is_plan_mode 等写入 `config["metadata"]`。
- 关键数据与默认值：`subagent_enabled` 只能被自定义智能体的 `allowed_subagents` 收窄，`allowed_subagents=[]` 为硬禁止；`update_agent` 工具仅在有 `agent_name` 且非 webhook 渠道（目前只有 `github`）时提供；`is_bootstrap` 走一条精简路径（只带 bootstrap 技能 + `setup_agent`，用于创建自定义智能体）。
- 配置开关：`config.yaml` 的 `models[]`、`tool_search.enabled`、`skills.deferred_discovery`、`database.checkpoint_channel_mode`（默认 `full`）。
- 边界与失败行为：`config.models` 为空直接报错；无法解析出模型报错。
- 依据：`H/agents/lead_agent/agent.py`：`assemble_lead_agent`、`_assemble_lead_agent`、`_resolve_model_name`、`_resolve_runtime_option`。

### 系统提示词（`SYSTEM_PROMPT_TEMPLATE` / `apply_prompt_template`，系统提示词拼装）
- 解决的问题：让系统提示词对所有用户、所有会话保持字节级一致以复用前缀缓存；变化的东西（日期、记忆）不放进去。
- 实现方式（按模板顺序的段）：`<role>`（名字默认 "DeerFlow 2.0"）→ 用户输入边界与「系统上下文保密」声明 → `{soul}`（自定义智能体的 SOUL.md）→ `{self_update_section}` → `<thinking_style>`（含澄清优先、子智能体委派检查）→ `<clarification_system>`（交互式为「先澄清再行动」，非交互为「选最低风险路径并记录假设，高风险则返回 BLOCKED」）→ 技能段 → 记忆工具段 → 延迟工具段 → MCP 路由提示 → `<subagent_system>`（仅 `subagent_enabled` 且有可用子智能体时出现）→ `<working_directory>`（`/mnt/user-data/{uploads,workspace,outputs}`）→ `<response_style>` → `<citations>` → `<critical_reminders>`。最后可套 `lead_prompt_overlay`。
- 什么时候注入什么：
  - 技能：提示词里只放元数据（默认 `<available_skills>`；`skills.deferred_discovery` 开启时只放名字索引 `<skill_index>`，用 `describe_skill` 查）；SKILL.md 正文由模型 `read_file` 读取，或用户以 `/技能名` 开头时由 `SkillActivationMiddleware` 作为隐藏的本轮上下文注入。
  - 记忆与日期：不在提示词里，由 `DynamicContextMiddleware` 在第一条 HumanMessage 前加 `<system-reminder>`（`<memory>` + `<current_date>`），首轮后冻结；跨午夜只在当前消息前补一条日期更新。
  - 子智能体：段内写死「默认直接执行，仅在净收益明显时委派」，并把每次响应上限 N 与每次运行上限写进硬限制。
  - 上传文件：由 `UploadsMiddleware` 在最后一条用户消息前加 `<current_uploads>`。
- 关键数据：子智能体上限在提示词里的值与中间件里实际执行的值同源（见下）。
- 依据：`H/agents/lead_agent/prompt.py`：`SYSTEM_PROMPT_TEMPLATE`、`apply_prompt_template`、`get_skills_prompt_section`、`_build_subagent_section`；`H/agents/middlewares/dynamic_context_middleware.py`（类文档）。

### 线程状态（`ThreadState`，线程状态字段）
- 解决的问题：把一条对话线程跨轮需要持久化的东西放进检查点，并为并发写入定义合并规则（reducer）。
- 字段（均在 `H/agents/thread_state.py`）：
  - `messages`（继承 AgentState；delta 模式下用 `DeltaChannel`，快照间隔默认 10）
  - `sandbox`（`sandbox_id`，同线程冲突 id 直接报错）
  - `thread_data`（workspace/uploads/outputs 路径）
  - `title`
  - `artifacts`（去重保序）
  - `todos`（后写覆盖）
  - `goal`、`goal_outcome`（目标循环）
  - `uploaded_files`
  - `viewed_images`（只存路径、mime、大小、sha256，不存 base64；写空字典即清空）
  - `promoted`（已提升的延迟 MCP 工具，按 catalog_hash 作用域，hash 变化则整体替换）
  - `delegations`（子智能体委派台账，上限 50 条，终态不被非终态覆盖）
  - `skill_context`（已加载技能的引用，上限 8 条，只存名字/路径/≤500 字描述）
  - `tool_artifacts` 与 `tool_artifact_processed`（工具产物句柄，绝对上限 1000）
  - `task_notes`、`task_history`
  - `summary_text`（摘要压缩后的摘要）
  - `background_tasks`
- 依据：`H/agents/thread_state.py` 的 `ThreadState`、各 `merge_*`。

### 中间件链（`build_middlewares` + `_build_runtime_middlewares`，中间件注册顺序）
- 解决的问题：把「目录、上传、沙箱、上下文压缩、计划、标题、记忆、看图、限流、澄清、安全」这些横切逻辑从主循环里拆出来，且顺序可控。
- 实现方式：先由 `build_lead_runtime_middlewares` 生成共享底座，再由 `build_middlewares` 追加主智能体专属项，最后合并扩展贡献。LangChain 规则：`before_*`、`wrap_*` 按列表先后（先者在外），`after_*` 倒序（列表最后者最先执行）；`wrap_tool_call` 先注册者最外层。
- 实际注册顺序（`—` 后为钩子与作用；`[开关]` 表示条件注册）：
  1. `InputSanitizationMiddleware` — wrap_model_call，最外层，消毒用户输入中的框架/注入标签。
  2. `KnowledgeScopeMiddleware` — 暴露网关批准的知识范围，关闭时拦截 `knowledge_search`。
  3. `ToolOutputBudgetMiddleware` — 工具输出过长则外置到线程目录 `.tool-results`，模型侧留摘要与 `read_file` 引用。
  4. `ToolResultSanitizationMiddleware` — 对 web_fetch/web_search/MCP 等远程内容的工具结果做同类消毒。
  5. `PiiRedactionMiddleware` — `[pii_redaction.enabled，默认关]`。
  6. `ThreadDataMiddleware` — before_agent，算出（`lazy_init=True` 时只算路径、按需建）`workspace/uploads/outputs` 目录，路径形如 `.deer-flow/users/{user_id}/threads/{thread_id}/user-data/…`。
  7. `UploadsMiddleware` — before_agent，把本轮上传文件清单写入用户消息；历史上传不再每轮注入，改由 `list_uploaded_files` 按需查。
  8. `SandboxMiddleware` — before_agent/after_agent；`lazy_init=True` 时首次工具调用才获取沙箱，写 `sandbox_id`，运行结束释放。
  9. `DanglingToolCallMiddleware` — wrap_model_call，给缺回应的 tool_call 补占位 ToolMessage，并丢掉没有来源的孤儿 ToolMessage。
  10. `LLMErrorHandlingMiddleware` — 模型调用重试与熔断（见下）。
  11. `ToolReceiptMiddleware` — `[verification.receipts_enabled，默认开]`，最外层 wrap_tool_call，给工具结果盖回执（工具名、状态、参数/输出哈希、字节数、时间）。
  12. `ArtifactResolutionMiddleware` — `[tool_artifacts.enabled 且 resolve_handles_in_args]`。
  13. 授权 `GuardrailMiddleware` — `[authorization.enabled]`。
  14. 配置的 `GuardrailMiddleware` — `[guardrails.enabled 且有 provider]`。
  15. `SandboxAuditMiddleware` — 工具执行前审计沙箱命令（定位为纵深防御，不是安全边界）。
  16. `ReadBeforeWriteMiddleware` — `[read_before_write.enabled，默认开]`，覆盖已有文件的写入必须先读过最新内容。
  17. `ToolProgressMiddleware` — `[tool_progress.enabled]`，停滞守卫。
  18. `ToolErrorHandlingMiddleware` — wrap_tool_call，把工具异常转成 ToolMessage。
  19. `ArtifactCaptureMiddleware` — `[tool_artifacts.enabled]`，before_model，抓取产物句柄。
  20. `DynamicContextMiddleware` — before_agent，注入日期与记忆（见上）。
  21. `SkillActivationMiddleware` — 识别 `/技能名`。
  22. `DeferredToolPromotionAuditMiddleware` — `[有延迟工具]`。
  23. `SkillToolPolicyMiddleware` — 激活技能后才按其 `allowed-tools` 收窄工具。
  24. `DurableContextMiddleware` — 在压缩前把委派结果和已读技能抓进 `delegations`/`skill_context`，并每次请求时投影摘要、台账、技能。
  25. `DeerFlowSummarizationMiddleware` — `[summarization.enabled，默认关]`，before_model。
  26. `TodoMiddleware` — `[is_plan_mode]`。
  27. `TokenUsageMiddleware` — `[token_usage.enabled]`。
  28. `TitleMiddleware` — after_model。
  29. `MemoryMiddleware` — after_agent，`[memory.enabled 且 mode 为 middleware]`；tool 模式默认不挂，除非后端要求被动写入。
  30. `ViewImageMiddleware` — `[当前模型 supports_vision]`，wrap_model_call。
  31. `McpRoutingMiddleware`、`DeferredToolFilterMiddleware` — `[tool_search.enabled 且有延迟工具]`。
  32. `SystemMessageCoalescingMiddleware` — 把所有 SystemMessage 合并成开头唯一一条（严格后端会拒绝非首位 system）。
  33. `SubagentLimitMiddleware` — `[subagent_enabled]`，after_model。
  34. `LoopDetectionMiddleware` — `[loop_detection.enabled，默认开]`。
  35. `TokenBudgetMiddleware` — `[token_budget.enabled，默认关]`；若同时开 token_usage，再接 `CompletedSubagentUsageMiddleware`。
  36. `ModelContentCompatibilityMiddleware` — 请求视图里降级模型无法序列化的 URL 文件块。
  37. 自定义与配置声明的扩展中间件（`extensions.middlewares`，导入出错则建图失败）。
  38. `TerminalResponseMiddleware`、`ModelLengthFinishReasonMiddleware`、`SafetyFinishReasonMiddleware`（`[safety_finish_reason.enabled]`）、`ClarificationMiddleware`（始终最后）。
- 边界与失败行为：硬依赖是 ThreadData 先于 Sandbox、Clarification 在最后。
- 依据：`H/agents/middlewares/tool_error_handling_middleware.py:346-560`（`_build_runtime_middlewares`），`H/agents/lead_agent/agent.py:485-826`（`build_middlewares`），`H/agents/middlewares/AGENTS.md`（逐项说明，钩子归属部分取自此文档，未逐个核对每个类的钩子签名）。

### 摘要压缩（`DeerFlowSummarizationMiddleware`，上下文摘要压缩）
- 解决的问题：长对话逼近模型上下文上限。
- 实现方式：before_model 时数「消息 + 现有 summary_text」的 token；任一触发条件满足就把较旧消息交给摘要模型，只保留 `keep` 范围内的近期消息，摘要存 `summary_text` 并在每次请求里以隐藏数据块投影，不写回 messages；AI 消息与其 ToolMessage 不拆开；最新一条用户请求被保护；压缩前的钩子里会冲刷记忆（`memory_flush_hook`）。todo 提醒消息在压缩时被过滤，随后由 TodoMiddleware 重建。
- 关键数据与默认值：`enabled=False`；`trigger` 默认 `None`，开启时至少要配一个（`tokens` / `messages` / `fraction`，多条为「或」）；`keep` 默认 `messages: 20`；`trim_tokens_to_summarize` 默认 4000；`model_name` 默认 `null` = 用本次运行自己的模型，设置后该模型生成，失败则回退运行模型；`fraction` 取值须在 (0,1]，且依赖运行模型配置的 `context_window`，缺失则该条被丢弃并告警；`skill_file_read_tool_names` 默认 `read_file/read/view/cat`。
- 配置开关：`summarization.*`；手动入口 `POST /api/threads/{id}/compact`。
- 依据：`H/config/summarization_config.py`，`backend/docs/summarization.md`，`H/agents/middlewares/summarization_middleware.py`。

### 计划模式（`TodoMiddleware`，待办计划）
- 解决的问题：复杂任务拆步并让用户看见进度。
- 实现方式：只有请求的 `is_plan_mode=True` 才挂载；给模型 `write_todos` 工具和一段 `<todo_list_system>` 提示；状态存 `todos`（pending / in_progress / completed）。before_model：若 todos 非空但 `write_todos` 调用已被截出上下文，补一条 `todo_reminder`。after_model：模型想收尾而仍有未完成项时，排队一条提醒并 `jump_to: model` 回到模型。
- 关键数据：完成提醒上限 `_MAX_COMPLETION_REMINDERS = 2`；被长度截断的轮次不再提醒；`write_todos` 被授权去掉时整个中间件失效。
- 依据：`H/agents/lead_agent/agent.py:_create_todo_list_middleware`，`H/agents/middlewares/todo_middleware.py:198, 315-374`，`backend/docs/plan_mode_usage.md`。

### 澄清中断（`ClarificationMiddleware` + `ask_clarification` + `interaction_policy.py`）
- 解决的问题：需求缺失、有歧义或有风险时让模型先问人，而且问的时候不能同时执行别的动作。
- 实现方式：
  1. after_model：若同一条 AIMessage 里有 `ask_clarification`，丢弃其余并行工具调用。
  2. wrap_tool_call：拦截该调用，格式化问题（含类型 `missing_info/ambiguous_requirement/approach_choice/risk_confirmation/suggestion`、可选项、表单字段），生成带 `artifact={"human_input": …}` 的 ToolMessage，返回 `Command(update=…, goto=END)`，本次运行结束。
  3. 恢复：不是 LangGraph interrupt，而是线程已落检查点，用户的回答作为下一条消息在同一线程开新运行；回答可带 `human_input_response` 元数据（`text` 或 `option`，含 `request_id`）。
  4. 非交互运行（`scheduled`、`webhook`、`autonomous`）：`ask_clarification` 工具从工具集移除；若仍被调用，返回普通 ToolMessage 要求按最小可逆假设继续或返回 `BLOCKED`，运行不中断。
- 关键数据：`RunInteractionMode` 四值；显式 `interaction_mode` 优先，否则依次看 `non_interactive`（定时）→ `channel_name="github"`（webhook）→ `disable_clarification`（autonomous）；这些键只允许内部调用方设置。
- 依据：`H/agents/middlewares/clarification_middleware.py`，`H/agents/interaction_policy.py`，`H/agents/human_input.py`，`backend/docs/RUN_INTERACTION_POLICY.md`。

### 子智能体并发上限（`SubagentLimitMiddleware`）
- 解决的问题：模型一次发出过多 `task` 调用。
- 实现方式：after_model 截断最后一条 AIMessage 里超额的 `task` 调用；允许数 = min(每次响应并发上限, 本次 run 剩余总额)，已用数从 `delegations` 里按当前 `run_id` 计。总额用完时强制 `finish_reason="stop"`，追加提示文字，并在上下文记 `stop_reason="subagent_limit_capped"`。
- 关键数据与默认值：每响应并发上限默认取 `subagent_runtime.max_running=3`（上限 64）；每 run 总数 `subagents.max_total_per_run` 默认 6（夹在 1–50）；请求可用 `max_concurrent_subagents` / `max_total_subagents` 覆盖。
- 依据：`H/agents/middlewares/subagent_limit_middleware.py:120-176`，`H/config/subagents_config.py:13,17,179`，`H/config/subagent_runtime_config.py`。

### 循环检测（`LoopDetectionMiddleware`）
- 解决的问题：模型反复发出同样的工具调用。
- 实现方式：after_model 按 `(thread_id, run_id)` 记录工具调用集合的哈希与按工具类型的频次；达到 warn 阈值时把警告排队，下一次 wrap_model_call 追加到请求末尾（保证 tool_call 配对不被破坏）；达到硬限制则清空 tool_calls，追加 `[FORCED STOP]` 文案，强制出文字答案。
- 关键数据与默认值：`enabled=True`；`warn_threshold=3`；`hard_limit=5`；`window_size=20`；`max_tracked_threads=100`；`tool_freq_warn=30`；`tool_freq_hard_limit=50`（窗口 50）；可用 `tool_freq_overrides` 按工具改（如 bash）；每 run 排队警告最多 4 条。新用户 run 重置，同 run 的目标续跑共用。
- 依据：`H/config/loop_detection_config.py`，`H/agents/middlewares/loop_detection_middleware.py:100, 230-238`，`backend/docs/LOOP_DETECTION.md`。

### 标题 / 记忆入队 / 看图
- 标题（`TitleMiddleware`）：after_model，线程 state 无 title 且已有至少一轮完整往返（≥2 条消息）才生成。`title.enabled=True`、`max_words=6`、`max_chars=60`；`model_name` 为空时用本地回退标题（不调 LLM）。运行被打断时由 `runtime/runs/worker.py` 补写回退标题。
- 记忆入队（`MemoryMiddleware`）：after_agent，把原始消息交给记忆管理器 `add`，由后端过滤成「用户消息 + 最终 AI 回答」并去抖异步更新；`memory.enabled=True`、`mode` 默认 `middleware`（`tool` 模式则改为模型调用记忆工具）、`injection_enabled=True`。记忆内容的读取在 `DynamicContextMiddleware`。
- 看图（`ViewImageMiddleware`）：只在模型 `supports_vision` 时注册；`view_image` 工具调用全部完成后，在 wrap_model_call 里把图片 base64 追加进请求，从不写入检查点，state 里只留元数据。
- 依据：`H/agents/middlewares/title_middleware.py:178`，`H/config/title_config.py`，`H/agents/middlewares/memory_middleware.py:121,197`，`H/config/memory_config.py:113-130`，`H/agents/middlewares/view_image_middleware.py:33`。

### 模型工厂（`create_chat_model`，模型按配置实例化）
- 解决的问题：同一份 `config.yaml` 驱动任意厂商的模型，并统一处理「思考开关」「推理强度」「限速」。
- 实现方式：
  1. 按名字找 `models[]` 项，用 `resolve_class(model_config.use)` 反射导入类（缺依赖时给出 `uv add …` 提示）；配置值以 `$` 开头解析为环境变量。
  2. 把配置字段 dump 成构造参数，叠加自定义智能体的 `temperature/max_tokens` 覆盖，再叠加调用方传参。
  3. 思考开关两条路径：没有 `reasoning:` 契约的老配置走 `_apply_legacy_thinking_settings`（开启时合并 `when_thinking_enabled`/`thinking`；关闭时合并 `when_thinking_disabled`，或按形态自动生成：OpenAI 兼容的 `extra_body.thinking.type=disabled` 外加 `reasoning_effort=minimal`、vLLM 的 `chat_template_kwargs` 开关、原生 Anthropic 的 `thinking={"type":"disabled"}`）；声明了 `reasoning:` 契约的走 `_apply_contract_thinking_settings`（thinking 取 `unsupported | optional | required`，`dialect` 取 `auto | openai_extra_body | anthropic | vllm_chat_template | ollama | none`，`effort` 有取值表、别名、写入路径）。
  4. 厂商适配：Codex 响应 API 把 thinking 映射成 `reasoning_effort`（关闭为 `none`，开启默认 `medium`，接受 low/medium/high/xhigh）并去掉 `max_tokens`；MindIE 默认 `max_retries=1`；OpenAI 兼容类默认 `stream_chunk_timeout=240.0` 秒；默认打开 `stream_usage`；`context_window` 被写入模型 profile，供摘要的 fraction 触发使用。
  5. 可选 `request_admission`：进程内 RPM 限速，同组共享 FIFO 队列；默认 `max_wait_seconds=300`、`max_queue_size=256`；启用后 SDK 内部 `max_retries` 置 0，改由中间件重试。
- 关键数据：`models/` 下自带适配：`claude_provider`、`openai_codex_provider`、`vllm_provider`、`mindie_provider`、`patched_openai/deepseek/mimo/minimax/stepfun`。`supports_thinking`、`supports_reasoning_effort`、`supports_vision` 默认均为 False。
- 边界与失败行为：旧路径下，请求思考但配置里有思考模板却 `supports_thinking` 为假，直接抛 `ValueError`；`required` 思考的模型不会进入关闭分支；主智能体先按契约归一，所以通常是降级而不是报错。
- 依据：`H/models/factory.py:432-640`，`H/config/model_config.py`，`H/models/AGENTS.md`，`H/reflection/resolvers.py`。

### LLM 错误处理（`LLMErrorHandlingMiddleware`）
- 解决的问题：模型接口瞬时失败、限流、持续故障。
- 默认值：`retry_max_attempts=3`，`retry_base_delay_ms=1000`，`retry_cap_delay_ms=8000`，突发退避基准 5000 ms，`max_concurrent_llm_calls=0`；熔断 `failure_threshold=5`、`recovery_timeout_sec=60`；遵守 Retry-After 提示最长 24 小时。
- 依据：`H/agents/middlewares/llm_error_handling_middleware.py:428-438`，`H/config/app_config.py:81-160`。

### 护栏（`guardrails/`：`GuardrailMiddleware`、`GuardrailProvider`、`AllowlistProvider`）
- 解决的问题：在工具真正执行前，按外部策略放行或拒绝。
- 实现方式：wrap_tool_call 里把调用包成 `GuardrailRequest`（工具名、入参、thread_id、user_id、角色、run_id、tool_call_id、是否子智能体等）交给 provider 的 `evaluate`/`aevaluate`；拒绝时返回 `status="error"` 的 ToolMessage（`Guardrail denied: … Choose an alternative approach.`），模型可换方案；每次决定写入 run 日志（`middleware:guardrail`）。provider 通过类路径加载，不需要基类。
- 关键数据与默认值：`guardrails.enabled=False`；`fail_closed=True`（provider 抛错则拒绝；设 False 则放行并告警）；`passport` 可放 OAP 护照路径；内置 `deerflow.guardrails.builtin:AllowlistProvider` 接受 `allowed_tools` / `denied_tools`（`allowed_tools=[]` 表示全部拒绝，不设才是全放行）；另有 `typesafe.py` 一个第三方提供者实现。授权（`authorization.enabled`）复用同一中间件，排在配置的护栏之前。
- 依据：`H/guardrails/middleware.py`，`H/guardrails/provider.py`，`H/guardrails/builtin.py`，`H/config/guardrails_config.py`，`H/agents/middlewares/tool_error_handling_middleware.py:430-480`。

### 运行时目录（`runtime/`）
- 解决的问题：把「图」变成可在网关后台长时间运行、可断线重连、可取消、可回放的「运行」。
- 部件：
  - `runs/manager.py`（`RunManager`）：运行注册表，状态 `pending / running / success / error / timeout / interrupted`；同线程并发策略 `reject`（默认）/ `interrupt` / `rollback`，其他值抛 `UnsupportedStrategyError`；跨进程靠 `(thread_id) WHERE status IN ('pending','running')` 的唯一索引保证每线程只有一个在途运行；重启后孤儿运行被标为错误（`Gateway restarted before this run reached a durable final state.`）。
  - `runs/worker.py`（`run_agent`）：在 `asyncio.Task` 里执行；调 agent_factory 建图，`agent.astream(..., stream_mode=…)`，把事件发布到流桥；支持的流模式 `values / messages-tuple / updates / debug / tasks / checkpoints / custom`，默认 `["values"]`；`events` 模式被拒绝。取消时可按 `rollback` 回到运行前检查点（捕获失败则不回滚）。
  - `stream_bridge/`：生产者与 SSE 消费者解耦；`memory`（默认，单进程）/ `redis`（多 worker）；`queue_maxsize=256`、`heartbeat_interval_seconds=15`、Redis 流 TTL 86400 秒；支持 `Last-Event-ID` 重连。
  - `checkpointer/`：`memory` / `sqlite`（连接串缺省 `store.db`）/ `postgres`；`checkpoint_mode.py`：`full`（默认）或 `delta`（messages 只存增量），进程内冻结，不同模式的线程互相拒绝（HTTP 409），delta 线程不能分叉（改为线性化）。`checkpoint_state.py` 的 `CheckpointStateAccessor` 是读写线程状态的唯一入口。
  - `store/`：LangGraph Store，同样 memory / sqlite / postgres。
  - `events/`：运行事件的追加式记录（`run.start`、`llm.ai.response`、`llm.tool.result`、`middleware:{tag}` 等）；存储后端 `memory`（默认）/ `db` / `jsonl`（`run_events.backend`），`max_trace_content=10240` 字节（仅 db），`track_token_usage=True`；`journal.py` 的 `RunJournal` 是产出这些事件的回调。
  - `goal.py`：目标循环；`DEFAULT_MAX_GOAL_CONTINUATIONS=8`，`DEFAULT_MAX_NO_PROGRESS_CONTINUATIONS=2`。
- 关键数据与默认值：网关每次运行默认 `recursion_limit=100`，服务端上限 `max_recursion_limit=1000`。
- 依据：`H/runtime/__init__.py`，`H/runtime/runs/schemas.py`，`H/runtime/runs/manager.py:1645-1690`，`H/runtime/runs/worker.py`（模块文档与 `run_agent`），`H/config/stream_bridge_config.py`，`H/config/checkpointer_config.py`，`H/config/run_events_config.py`，`H/runtime/AGENTS.md`，`backend/docs/RUN_EVENT_STREAM.md`，`H/config/app_config.py:257-266`。

### 追踪（`tracing/`）
- 后端：LangSmith 与 Langfuse 是 LangChain 回调；Monocle 是进程级 OpenTelemetry 插桩，不是回调。
- 开关：`LANGSMITH_TRACING`（或 `LANGCHAIN_TRACING_V2`/`LANGCHAIN_TRACING`，需 API key）、`LANGFUSE_TRACING`（需 public/secret key，host 可配）、`MONOCLE_TRACING`（`MONOCLE_EXPORTERS` 默认 `file`，写入 `.monocle/`，另有 console、okahu、s3、blob、gcs；okahu 需 `OKAHU_API_KEY`）。启用但缺凭据则校验报错。
- 注入点：主智能体的回调挂在图根，保证一次运行一条 trace；Langfuse 会话字段取自 thread_id、user_id、assistant_id、模型名与 `DEER_FLOW_ENV`；子智能体的 trace 归到父线程会话下。独立调用模型（记忆更新等）时 `attach_tracing=True` 在模型上挂回调。
- 依据：`H/tracing/factory.py`，`H/tracing/AGENTS.md`，`H/config/tracing_config.py`。

## 端到端流程（一轮对话）

1. 网关为请求创建 `RunRecord`，`RunManager` 按 `multitask_strategy` 检查同线程是否已有在途运行（默认 `reject`）。
2. `run_agent` 记录运行前检查点，调用 `make_lead_agent` 的装配流程，按本次配置生成图。
3. 图开始执行，`before_agent` 链依次建线程目录路径、写入本轮上传清单、挂接沙箱（默认惰性）、注入日期与记忆、识别 `/技能名`。
4. 每次模型调用前，摘要中间件判断是否压缩，Todo 视情况补提醒；请求视图被合并系统消息、补悬空 ToolMessage、追加图片和循环警告。
5. 模型返回后，`after_model` 倒序：先澄清（丢并行调用），再长度/安全/终态守卫，再循环检测、子智能体截断、标题生成。
6. 若有工具调用，进入工具节点：回执 → 授权/护栏 → 沙箱审计 → 先读后写 → 错误转换 → 工具执行，结果经输出预算与消毒回到模型，循环回到第 4 步。
7. 遇到 `ask_clarification` 则 `goto=END`，运行结束，等用户在同线程发下一条消息；Todo 有未完成项且模型想收尾时，最多 2 次被拉回模型。
8. 模型不再调用工具，`after_agent` 把对话交给记忆队列、释放沙箱。
9. `run_agent` 把 `values/messages` 等事件写入流桥（SSE 推送给前端）和事件存储，检查点落库，运行状态置为 success/error/interrupted 等。

## 给产品经理的要点

- 系统提示词是静态的；日期与记忆放在第一条用户消息前的隐藏提醒里，首轮后冻结。想知道某次回答为何没用上新记忆，要看这一点。
- 摘要压缩默认关闭，开启后必须自己配触发条件；`keep` 默认保留最近 20 条消息，摘要不写回消息，而是每次请求时投影。
- 澄清不是弹窗式中断，而是本次运行以 `goto=END` 结束，用户答复开启下一次运行；定时、webhook 等无人场景根本没有这个工具，改为「做最小假设或返回 BLOCKED」。
- 三道防失控机制默认状态不同：循环检测默认开（3 次警告、5 次强停），token 预算默认关（开启后 `max_tokens` 默认 200000，80% 警告），子智能体每响应并发默认 3、每运行总数默认 6，超出的 `task` 调用被丢弃。
- 护栏默认关闭、`fail_closed=True`；拒绝以出错 ToolMessage 返回，模型会换路。内置只有按工具名的白/黑名单，更细的策略要自己接 provider。
- 思考开关按「请求 > 自定义智能体 > 默认开」决定，再被模型能力约束；不同厂商靠配置里的 `when_thinking_enabled/disabled` 或 `reasoning:` 契约适配，不是写死在代码里。

## 文档与源码的出入 / 未核实

- `backend/docs/middleware-execution-flow.md` 描述的是 `create_deerflow_agent` 的 14 项链（ThreadData、Uploads、Sandbox、Dangling、Guardrail、ToolError、Summarization、Todo、Title、Memory、ViewImage、SubagentLimit、LoopDetection、Clarification），不是 `make_lead_agent` 的实际链；实际链见上文，条目多得多，且 Guardrail、ToolErrorHandling 位置与之不同。该文档称 ViewImage 属 wrap_model_call，与源码一致；AGENTS.md 中另有旧生命周期的说明已不适用。
- 摘要压缩触发值、`token_budget` 等默认值来自配置类；`config.example.yaml` 是否给出示例值未读，未核实。
- 各中间件的钩子归属（尤其第 1–5、10–19 项）取自 `middlewares/AGENTS.md` 与类文档，未逐一核对代码；ToolReceipt、ToolProgress、ReadBeforeWrite 等只读了装配处与说明，内部阈值未核实。
- `H/runtime/runs/manager.py`、`worker.py`、`journal.py` 体量很大，只核对了枚举、策略集合、流模式与模块文档；孤儿租约时长、取消细节、回滚细节未核实。
- `sandbox/`、`tools/`、`subagents/`、`skills/` 不在本区域，只引用其接口。
- 记忆后端（deermem、mem0、honcho、openviking）的具体写入逻辑不在本区域，未读。
