# 子智能体、工具、MCP、技能、能力与扩展

提交：bytedance/deer-flow @ 3f7a076。路径省略前缀处，`H/` = `backend/packages/harness/deerflow/`，`E/` = `backend/packages/extension-api/deerflow_extension_api/`。`backend/CLAUDE.md` 只有一行，导入 `backend/AGENTS.md`；各目录的 `AGENTS.md`（subagents、tools、mcp、skills、extensions）才是主要文档，下文凡与源码核对过的才下断言。

## 一句话

主智能体靠一个 `task` 工具把有边界的子任务交给隔离上下文的子智能体；它能调用的工具由「配置声明 + 内置 + MCP + ACP + 扩展插件」按固定顺序拼成；技能是目录里的 SKILL.md，按需读入而不是全塞进提示词；capabilities 是给用户看的「连接器目录」，extensions 是运营者装进网关进程的 Python 扩展包。

## 局部清单

### task 工具与子智能体执行器（`task_tool`、`SubagentExecutor`，「委派子任务」）
- 解决的问题：把并行或上下文很重的工作隔离出去，主对话不被中间过程撑满；同时给委派设上限，防止失控。
- 实现方式：
  1. 主智能体调用 `task(prompt, subagent_type, acceptance_criteria?, description?, context_mode)`。`context_mode` 只有 `isolated`（默认，子智能体只看到 prompt）与 `snapshot`（把父对话的保留历史与摘要作为背景一次性带入，之后不同步）。
  2. 工具先查可用类型；`bash` 类型在主机 bash 未被允许时直接返回失败（`LOCAL_BASH_SUBAGENT_DISABLED_MESSAGE`），自定义智能体可用 `allowed_subagents`（None=全部，[]=全禁，列表=白名单）收窄。
  3. `SubagentExecutor` 在「一条常驻的独立事件循环线程」上执行子智能体，进程内有一个 FIFO 的异步准入控制器，排队的任务不占线程。
  4. `task` 工具在后端每 5 秒轮询一次结果（不让 LLM 自己轮询），期间向前端发 `task_started`、`task_running`（每条新 AI 消息一次）、终态 `task_completed` / `task_failed` / `task_timed_out`。
  5. 子智能体图以 `checkpointer=False` 编译，一次性，不续跑；检查点坐标继承自父上下文，使子图留在父线程的子命名空间下。
  6. 子智能体系统提示末尾由 `report_contract.py` 追加「汇报契约」：动作声明须引用工具回执 `[rN tool_name]`，交付物须带可核对句柄（绝对路径、URL、ID、HTTP 状态）；`verification.receipts_enabled`（默认 true）关闭时不要求引用。
  7. 若传了 `acceptance_criteria`，工具在完成分支用代码做确定性检查：`file:<path> exists|non-empty|json-valid`、`file_written:<path>`、`tests_passed:<command>`；其余写法一律标 UNVERIFIED，不会默认通过。JSON 校验上限 50,000 字节。
- 关键数据与默认值：
  - 状态枚举 `SubagentStatus`：pending / running / completed / failed / cancelled / timed_out。
  - 内置类型 `BUILTIN_SUBAGENTS` 只有两个：`general-purpose`（tools=None 继承全部，禁用 `task`、`ask_clarification`、`present_files`，max_turns=150）与 `bash`（白名单仅 `bash`、`ls`、`read_file`、`write_file`、`str_replace`，同样禁上述三个，max_turns=60）。
  - 超时：全局 `subagents.timeout_seconds` 默认 1800（30 分钟）；自定义智能体默认 900。`task` 轮询上限 = (超时 + 60) // 5 次。
  - 进程并发 `subagent_runtime`：`max_running` 3（1–64）、`max_queued` 64、`admission_policy` queue|reject、`queue_timeout_seconds` 300。均为启动时冻结，改了要重启。
  - 单次运行委派总数 `subagents.max_total_per_run` 默认 6（1–50）；超限时 `task` 调用被剥离，并追加可见提示让主智能体用已有结果收尾。
  - 令牌预算 `subagents.token_budget`：默认启用，摘要开启时 1,000,000、否则 2,000,000，`warn_threshold` 0.7；到顶时本轮工具调用被剥离、`finish_reason` 强制 stop，结果标记 `completed` + `stop_reason=token_capped`。
  - 解析顺序：内置 → `config.yaml` 的 `subagents.custom_agents` → 管理员在库里维护的定义，之后叠加 `subagents.agents.<name>` 覆盖（timeout_seconds / max_turns / model / skills / token_budget / prompt_overlay）。
- 配置开关：`subagent_runtime.*`、`subagents.timeout_seconds|max_turns|max_total_per_run|token_budget|agents|custom_agents`；`task` 工具本身由运行时参数 `subagent_enabled` 决定是否装入（`H/tools/tools.py`）。
- 边界与失败行为：
  - 不能再嵌套：三类 `disallowed_tools` 默认都含 `task`；`general-purpose` 提示词明确写「不得调用 task」。AGENTS.md 提到「显式启用的嵌套任务」会传递遗漏 ID，但开启方式我没找到，未核实。
  - 技能：子智能体用父运行的用户身份解析技能，`skills` 为 None=全部已启用、[]=无；子智能体不继承 `required-secrets` 注入集。
  - 上传文件：普通 `task` 在派发时快照父状态的 `uploaded_files` 才启用 `list_uploaded_files`；缺失或畸形则该工具关闭。
  - 模型报错被中间件转成带标记的 AI 消息时，执行器据标记判为 FAILED，而不是「完成」。
  - 取消与超时：`wait_for` 超时给出 `Execution timed out after N seconds`；终态只写一次（`SubagentResult` 首写守卫）。
  - 沙箱：并行子智能体共享父线程沙箱，按租约持有者计数，最后一个持有者才释放。
- 依据：`H/subagents/config.py`、`builtins/general_purpose.py`、`builtins/bash_agent.py`、`capacity.py`、`registry.py`、`executor.py`（`SubagentStatus`、`MAX_CONCURRENT_SUBAGENTS=3`、`run_with_timeout`）、`H/tools/builtins/task_tool.py`（`_SUBAGENT_POLL_INTERVAL_SECONDS=5.0`、`max_poll_count`）、`H/config/subagents_config.py`、`subagent_runtime_config.py`、`H/subagents/AGENTS.md`、`config.example.yaml` 约 1969–2075 行。

### 子智能体批处理（`subagent_batches` / `batch_task`，「大批量独立任务」）
- 解决的问题：几百几千个互相独立的小任务不能塞进主上下文，也不能一次并发打满。
- 实现方式：主智能体显式调用 `batch_task(title, items[{key,prompt,acceptance_criteria}], subagent_type, max_live_items?, max_running_items?)`，立即返回批次 ID；条目写入数据库（`SubagentBatchRow`/`SubagentBatchItemRow`，迁移 0016），由 `SubagentBatchService`（`H/subagents/batch_service.py`，`backend/app/subagent_batches` 仅是兼容转发）以租约方式领取并交给同一个执行器与同一批槽位。配套工具 `batch_status`、`cancel_batch`、`read_batch_result`（按位置、偏移分段读，`max_chars` 默认 4000）。网关路由 `/api/threads/{thread_id}/subagent-batches`：列表、详情、`items`、`pause`、`resume`、`cancel`、`items/{id}/retry`、`results.jsonl`。
- 关键数据与默认值（`subagent_batches`，启动时读取）：`enabled` false；`poll_interval_seconds` 1；`lease_seconds` 120；`max_items_per_batch` 5000；`default_max_live_items` 100（上限 1000）；`default_max_running_items` 3（上限 64）；`max_attempts` 3；`max_result_chars` 100000；`result_preview_max_chars` 2000。
- 边界与失败行为：必须是显式调用，不会因提示变长自动转批；需要 SQLite 或 Postgres；条目键必须唯一；队列拒绝或排队超时只释放租约、不消耗重试次数，执行失败或租约过期各消耗一次；验收裁决单独存储，「succeeded」只代表执行结束；批处理刻意不启用 `list_uploaded_files`。条目与批次的状态字符串（pending/queued/running/succeeded/failed/cancelled/paused/completed）出现在 `persistence/subagent_batches/sql.py`，未逐一核对各自归属。
- 依据：`H/config/subagent_batches_config.py`、`H/tools/builtins/batch_task_tool.py`、`H/subagents/batch_runtime.py`、`H/persistence/subagent_batches/model.py`、`backend/app/gateway/routers/subagent_batches.py`。

### 工具汇集（`get_available_tools`，「给主智能体拼工具表」）
- 解决的问题：把多处来源的工具合成一张不重名的表，并按部署策略与模型能力裁剪。
- 实现方式（`H/tools/tools.py`）：
  1. 读取 `config.yaml` 的 `tools:`，可按 `tool_groups` 过滤；用 `resolve_variable(use)` 加载。`knowledge` 组仅在 `knowledge_base.enabled` 时保留；`bash` 组/`bash_tool` 在 `is_host_bash_allowed` 为假时剔除；`read_conversation` 仅当宿主提供读取能力时保留；`schedule_task` 等不允许靠 YAML 注册。
  2. 内置工具 `BUILTIN_TOOLS = [present_files, ask_clarification, review_skill_package]`，再按条件追加：调度器工具、`list_background_tasks`/`cancel_background_task`（MCP 任务运行时可用时）、`list_uploaded_files`（`include_upload_tool`）、`skill_manage`（`skill_evolution.enabled`）、`task`（`subagent_enabled`）及批处理四件（批运行时可用时）。
  3. `view_image` 仅当所选模型 `supports_vision` 为真才加入。
  4. 若模型有 `max_tokens`，克隆 `write_file` 并在描述里追加「PER-RESPONSE BUDGET」，估算安全字符数 = max_tokens×3×0.7，提示超出要分段 append。
  5. MCP 工具：从磁盘重读 `extensions_config.json`，取缓存的工具并打标；再合并个人 MCP 工具（与部署同名则丢弃个人的）；若传了 `mcp_plugins` 则按安装 ID 过滤。
  6. ACP：配置了 `acp_agents` 才加入 `invoke_acp_agent`。
  7. 合并顺序 `配置工具 + 内置 + MCP + ACP + 扩展插件工具`，按名字去重，先到者胜，重名只记警告。
- 配置开关：`tool_groups`、`tools`、`sandbox.allow_host_bash`、`tool_search.enabled`、`knowledge_base.enabled`、`skill_evolution.enabled`、`acp_agents`。
- 依据：`H/tools/tools.py`，`H/tools/AGENTS.md`。

### 内置与示例配置中的工具逐个
- `present_files`：把 `/mnt/user-data/outputs` 下的文件登记到 `artifacts` 供界面展示；只允许该目录（`present_file_tool.py`）。
- `ask_clarification`：`return_direct`，中断执行向用户提问；类型 `missing_info|ambiguous_requirement|approach_choice|risk_confirmation|suggestion`；支持 `options` 与结构化表单 `fields`（text/textarea/number/select/multi_select/checkbox/date）。
- `review_skill_package`：只读审查技能包，不激活不安装（见技能评审）。
- `view_image`：读沙箱内图片，上限 20 MiB，jpg/jpeg/png/webp（描述另提 gif，但 MIME 表只有前四种，gif 是否可用未核实）。
- `list_uploaded_files`：分页列出上传，默认 20、最大 100，可选文档大纲。
- `task`、`batch_task` 等：见上。`invoke_acp_agent`：调用外部 ACP 兼容智能体，`timeout_seconds` 默认 1800。`list_background_tasks`/`cancel_background_task`：管理 MCP 长任务。`setup_agent`、`update_agent`：创建/更新自定义智能体的 SOUL.md、描述、技能与工具组白名单、默认模型。
- `tool_search`：见 MCP。`describe_skill`：见技能。`skill_manage`：动作 create/patch/edit/delete/write_file/remove_file。
- 示例配置里的沙箱工具（`deerflow.sandbox.tools`，源码不在本区域）：`ls`、`read_file`、`glob`（max_results 200）、`grep`（max_results 100）、`write_file`、`str_replace`、`bash`。`web_search` 默认 `ddg_search`，`web_fetch` 默认 `jina_ai`，`image_search` 默认 `image_search`（DuckDuckGo），均为 `web` 组。
- 依据：`H/tools/builtins/*.py`、`config.example.yaml` 841–1380 行。

### 社区工具与沙箱实现（`H/community/`，「第三方适配」）
- 解决的问题：同一个工具名（如 `web_search`）可换不同服务商，改一行 `use:` 即可；沙箱后端也可替换。
- 实现方式：每个目录导出同名工具函数，`config.yaml` 里用 `use: deerflow.community.<目录>.tools:<函数>` 指定；同名工具同一时刻只能启用一个来源。
- 目录清单（`tree.tsv` 与示例配置核对）：
  - 搜索 `web_search`：ddg_search（默认）、searxng、serper、serply、webz、brave、tavily、infoquest、tencent_wsa、exa、firecrawl、groundroute、fastcrw、sofya、youcom。
  - 抓取 `web_fetch`：jina_ai（默认）、browserless、crawl4ai、exa、infoquest、firecrawl、groundroute、fastcrw、sofya、unbrowse；`web_capture`：browserless 截图。
  - 图片搜索：image_search、infoquest、serper、brave。
  - 知识库（组 `knowledge`）：ragflow（`knowledge_search`、`list_knowledge_bases`）、lightrag。
  - 浏览器自动化（组 `browser`）：`browser_navigate/snapshot/click/type/get_text/back/screenshot/close`，需 Playwright 可选依赖；URL 经 SSRF 检查和固定出口代理；会话存于单个网关 worker 内存，要求 `GATEWAY_WORKERS=1`。
  - 沙箱提供者：aio_sandbox、boxlite、e2b_sandbox、opensandbox、tenki。
  - 公共：`url_safety.py`（拦 localhost、云元数据域名、解析后的私网地址）、`provider_credentials.py`。
- 边界：抓取类工具默认 `allow_private_addresses: false`；自托管服务（Browserless、Crawl4AI）因服务端自己解析 URL，需运营者确认网络隔离。
- 依据：`H/community/**`、`config.example.yaml` 860–1340 行。

### MCP 客户端（`H/mcp/`，「接入外部工具服务器」）
- 解决的问题：不改代码接入 MCP 服务器的工具，且在多用户、多进程下安全使用。
- 实现方式：
  1. 配置在 `extensions_config.json` 的 `mcpServers.<name>`，字段：`enabled`（默认 true）、`type`（stdio 默认 / sse / http）、`command`/`args`/`cwd`/`env`（stdio），`url`/`headers`（sse、http），`oauth`、`user_auth`、`headers_from_context`、`description`、`routing`、`tools.<原名>.routing`、`tool_name_prefix`（默认 true，工具名加 `<server>_` 前缀）、`tool_call_timeout`（默认无）、`session_init_timeout`（默认 60 秒）、`task_toolsets`。另有顶层 `mcpInterceptors`、`middlewares`、`skills`。
  2. `mcp/client.py::build_server_params` 把配置转成 `langchain-mcp-adapters` 的 `MultiServerMCPClient` 参数；缺 command/url 或头值含非法字符的服务器被单独丢弃并记日志，不影响其他。
  3. 认证叠加顺序（后者覆盖前者）：静态 `headers` < `oauth` < `user_auth` < `headers_from_context`。OAuth 支持 `client_credentials` 与 `refresh_token` 两种授权，自动刷新（提前 `refresh_skew_seconds`=60 秒），按轮换后的 refresh_token 更新；`user_auth` 把 DeerFlow 用户 ID 映射到凭据头，缺失默认 deny；`headers_from_context` 取单次请求的 `context.secrets`。
  4. 缓存：首次使用时懒加载并缓存（`get_cached_mcp_tools`）；按「配置路径 + (mtime,size,sha256)」判过期，网关 API 写文件后各进程无需重启即可发现增删服务器；stdio 会话进池，`MCPSessionPool.MAX_SESSIONS=256`，按「服务器 + 用户/线程范围」隔离，断连只淘汰对应会话且不自动重放调用。
  5. 延迟加载：`tool_search.enabled`（默认 false）开启后，MCP 工具不绑 schema，只在系统提示的 `<available-deferred-tools>` 列名字；模型调用 `tool_search` 取回 schema 才可调用。查询形式 `select:a,b` / `keywords:...` / 正则 / `+前缀 词`；每次最多 5 个；正则最长 256 字符、共享 100 ms 预算，超限返回提示而非部分结果。`auto_promote_top_k`（默认 3，范围 1–5）根据 `routing`（mode `off|prefer`、priority、keywords）每次模型调用前自动晋升匹配的 schema。
  6. 个人 MCP：存于用户目录，字面值配置；非公网目标需管理员权限。
  7. 通过 HTTP 注册 stdio 服务器的约束：命令必须在 `{npx, uvx}`（可由 `DEER_FLOW_MCP_STDIO_COMMAND_ALLOWLIST` 扩展），并拒绝可执行任意代码的参数和环境变量；文档自述这是纵深防御而非信任边界。
- 依据：`H/mcp/AGENTS.md`、`client.py`、`cache.py`、`oauth.py`、`session_pool.py`、`H/config/extensions_config.py`、`H/config/tool_search_config.py`、`H/tools/builtins/tool_search.py`、`extensions_config.example.json`。

### MCP 长任务运行时（`mcp_tasks`，「后台任务跟踪」）
- 解决的问题：远端 MCP 的耗时任务（如生成报告）不应让主智能体循环守着轮询。
- 实现方式：在服务器配置里用 `task_toolsets[{name,submit_tool,status_tool,cancel_tool}]` 绑定三种原始工具名；对模型只暴露「提交」，其包装在远端句柄持久化后只返回本地任务 ID，状态与取消工具被隐藏。`McpTaskService`（`backend/app/mcp_tasks/service.py`）在智能体回路之外用租约领取到期记录，调用协议驱动取状态，归一化为 `submitted / working / input_required / completed / failed / cancelled`，并发完成通知；租约过期即重启恢复机制。模型侧可用 `list_background_tasks`、`cancel_background_task`；HTTP：`/api/threads/{thread_id}/mcp-tasks`（列表、详情、cancel）。
- 关键数据与默认值（`mcp_tasks`，启动时读取，`enabled` 默认 false）：`poll_interval_seconds` 5、`lease_seconds` 120、`max_concurrent_polls` 8、`max_poll_backoff_seconds` 300、`input_required_poll_interval_seconds` 60、`tracking_degraded_after_errors` 3、`max_result_bytes` 65,536、`result_preview_max_chars` 2000；错误文本上限 4000 字符；`input_required` 与结果制品各限 64 KiB，超限判永久协议失败；通知失败最多 5 次后进 `dead_letter`。
- 边界：开关改磁盘不影响运行中的工具集，需重启网关。
- 依据：`H/config/mcp_tasks_config.py`、`H/mcp/tasks/models.py`、`backend/app/mcp_tasks/service.py`、`H/tools/builtins/background_tasks_tool.py`、`H/mcp/AGENTS.md`。

### 技能（`H/skills/`、仓库根 `skills/`，「按需加载的工作手册」）
- 解决的问题：把成套的做法（流程、脚本、参考资料）封装起来，只在相关时读入，提示词不膨胀。
- 实现方式：
  1. 结构：一个目录，内含 `SKILL.md`（YAML 头 + Markdown 正文），可带 `scripts/`、`references/`、`templates/`、`assets/`。头部允许的键：`name`、`description`、`license`、`allowed-tools`、`argument-hint`、`required-secrets`、`secrets-autonomous`、`metadata`、`compatibility`、`version`、`author`，出现其他键会校验失败。
  2. 校验规则：`name` 必填，小写字母数字与连字符，不得首尾连字符或连续连字符，≤64 字符；`description` 必填、≤1024、不得含尖括号。
  3. 位置：公共技能 `skills/public/`；用户自建 `{DEER_FLOW_HOME}/users/{user_id}/skills/custom/`；托管集成 `{DEER_FLOW_HOME}/integrations/skills/{provider}/`；旧版全局自定义为只读 legacy。沙箱内挂载在 `/mnt/skills`（`skills.container_path`），根路径可用 `skills.path` 或环境变量 `DEER_FLOW_SKILLS_PATH` 改。含 `SKILL.md` 的目录是包边界，其下嵌套的 SKILL.md 不登记。
  4. 启用状态：`extensions_config.json` 的 `skills.<name>.enabled`（缺省视为启用）；非公共类别另有每用户状态。`load_skills()` 每次调用都重新扫描，不做目录缓存。
  5. 渐进式加载：默认把已启用技能的名称、描述、容器路径以 `<available_skills>` 放进 `<skill_system>`，提示词写明「匹配时先 `read_file` 读 SKILL.md，其引用的资源用到再读」。`skills.deferred_discovery: true` 时只列 `<skill_index>` 名字，模型调 `describe_skill`（`select:a,b`、`+前缀`、自由词，最多 5 条）取元数据再读文件。
  6. 斜杠激活：用户消息以 `/技能名 任务` 开头，运行时只在本轮模型调用注入该技能全文；保留命令（`/new`、`/help`、`/bootstrap`、`/status`、`/models`、`/memory`、`/goal`、`/agent`）不会被当成技能。
  7. 工具策略：`allowed-tools` 只对斜杠激活或经 `read_file` 载入上下文的技能动态生效；未激活的启用技能不限制基线工具。
  8. 请求级密钥：`required-secrets` 声明的值只经 `context.secrets` 传入，作为环境变量注入本次激活的 bash，不进提示、参数、检查点或日志；子智能体不继承。
  9. 安装：`POST /api/skills/install` 解压 `.skill`（ZIP）到 custom；限制 4096 个条目、解压总量 512 MiB，拒绝路径越界、符号链接与可执行二进制；之后过 SkillScan（离线确定性扫描，CRITICAL 拦截）与 LLM 扫描器；`skill_scan.enabled` 可关确定性分析器。
  10. 自进化：`skill_evolution.enabled`（默认 false）才允许智能体经 `skill_manage` 写 custom；`security_fail_closed` 默认 true（审查模型不可用就全部拦截）。
- 依据：`H/skills/types.py`、`frontmatter.py`、`validation.py`、`installer.py`、`describe.py`、`catalog.py`、`slash.py`、`H/agents/lead_agent/prompt.py`（`<skill_system>`）、`H/skills/AGENTS.md`、`config.example.yaml` 2125–2185、2558 行。

### 公共技能清单（`skills/public/`，共 23 个，名称与 description 开头取自各 SKILL.md）
academic-paper-review（学术论文评审）、bootstrap（用对话生成 SOUL.md）、chart-visualization（26 种图表）、claude-to-deerflow（经 HTTP API 调用 DeerFlow）、code-documentation、consulting-analysis（咨询级研究报告）、data-analysis（Excel/CSV）、deep-research（多角度网络研究）、find-skills（发现并安装技能）、frontend-design、github-deep-research、image-generation、music-generation（MiniMax 音乐 API）、newsletter-generation、podcast-generation（双主持人音频）、ppt-generation（逐页生图合成 PPTX）、skill-creator（创建/评测/优化技能）、skill-reviewer（技能就绪度评审）、surprise-me（组合其他技能做惊喜体验）、systematic-literature-review（检索 arXiv，APA/IEEE/BibTeX）、vercel-deploy、video-generation、web-design-guidelines。

### 技能评审（`H/skills/review/`、`contracts/skill_review/`、`review_skill_package`）
- 解决的问题：上线或发布前，用确定性事实 + 模型语义判断评估一个技能包是否可用、安全。
- 实现方式：读取器生成包快照（schema `deerflow.skill-package-snapshot.v1`），分析器产出事实（`deerflow.skill-review.facts.v1`，含资源图、评测、SkillScan 发现），评审报告（`deerflow.skill-review.report.v1`）。命令行 `python -m deerflow.skills.review.cli <目录或.skill> --profile deerflow|agentskills --format json|text`，CI 建议 `--fail-on error --fail-on-incomplete`。另有豁免清单契约 `deerflow.skill-review-waivers.v1`（最多 256 条，包路径须以 `skills/public/` 开头，含 `expires_on`）。工具 `review_skill_package(target, profile, include_content, scope, inline_content)` 把目标当不可信数据，不激活、不绑密钥；本地路径只允许落在技能根与调用者自己的用户目录内。
- 关键数据：包限额默认 4096 个文件、单文件 64 MiB、总量 512 MiB；严重度 blocker/error/warning/info（SkillScan 的 CRITICAL/HIGH/MEDIUM/LOW 依次映射）；报告 `readiness` ∈ blocked / revise / publish_candidate；`assurance` ∈ static_only / trigger_checked / behavior_verified / regression_verified；维度结论 pass / concern / blocker / not_assessed。
- 依据：`H/skills/review/models.py`、`cli.py`、`contracts/skill_review/*.json`、`H/tools/builtins/review_skill_package_tool.py`。

### 能力目录（`H/capabilities/`，「连接器目录」）
- 解决的问题：让用户在界面里用「卡片」添加外部服务，而不是手写 MCP 配置。
- 实现方式：`builtin.json` 是清单（`PluginManifest`：id、category、kind `mcp|cli|native`、adapter、auth_methods `none|api_key|oauth`、contributions `tools|skills`、中英文名称与说明、`source` 必须 HTTPS、图标必须是内置资源）；`load_catalog()` 只读 JSON、不加载可执行代码。安装后就是一条普通的 MCP 配置，并带 `capability.id`（缺省按服务器名 uuid5 生成）；智能体可用 `mcp_plugins` 按安装 ID 限定可见的 MCP 工具，重复 ID 的条目被排除（文档自述这是选择机制，不是授权系统）。`business.py` 是内置的 stdio MCP 服务：钉钉群机器人、企业微信群机器人（发文本/Markdown 通知）、HubSpot（`get_companies`、`create_contact` 等），凭据只放在子进程环境变量；响应上限 2,000,000 字节，请求超时 20 秒。
- 清单 15 项：lark（cli，oauth，含技能）、dingtalk、wecom、tencent-docs、notion、openviking、web-search、web-fetch、exa、firecrawl、database、hubspot、github、atlassian、browser。其中 web-search / web-fetch / exa / firecrawl / browser 的 kind 是 native，adapter 为 guide（给配置指引，非自动安装）。
- `H/integrations/`：`lark_cli.py` 安装官方 `lark-*` 技能包为只读 INTEGRATION 类别，版本跟随网关运行的 lark-cli，记录内容 SHA-256；`lark_broker.py` 让沙箱内只有一个转发垫片，凭据文件留在宿主侧的代理进程里。
- 依据：`H/capabilities/catalog.py`、`runtime.py`、`business.py`、`builtin.json`，`H/integrations/lark_cli.py`、`lark_broker.py`。

### 扩展系统与扩展 API（`H/extensions/`、`extension-api`，「运营者安装的 Python 扩展包」）
- 解决的问题：不改主仓库，增加中间件、生命周期钩子、服务、HTTP 路由，乃至带界面和模型工具的完整插件。
- 实现方式：扩展包暴露 `install(registry, config)`，通过 PEP 621 入口点组 `deerflow.extensions` 注册；由 `config.yaml` 顶层、仅启动时读取的 `plugins:` 列表按确定顺序加载（不放进可经 API 写入的 `extensions_config.json`）。`required: true` 的加载失败会让网关启动中止，可选插件失败则带归因诊断地跳过。运营者命令 `deerflow extensions install|upgrade SOURCE [--yes]`、`list`、`enable|disable|remove NAME`，由 `ExtensionManager` 用 `uv add/remove` 事务式修改依赖并在失败时回滚；本地目录以快照复制，不是可编辑链接。
- 扩展点（`ExtensionRegistry`，共 8 类）：`plugin`（带开关、设置字段、浏览器模块/静态资源、后端动作、模型工具）、`middlewares`（`MiddlewareContributor`，按语义位置 `MODEL_LOGICAL / MODEL_PHYSICAL / TOOL_VISIBLE / TOOL_RAW / STANDARD` 与 `AgentScope` LEAD/SUBAGENT/BOTH 放置）、`task_lifecycle`（任务开始/结束，结果 completed|aborted|failed，区分 lead 与 subagent）、`system_model_observer`（目标、记忆、标题、摘要四类系统自发模型调用）、`agent_assembly_observer`、`context_compaction_observer`、`service`（网关启停时绑定 `ExtensionRuntimeDeps`）、`routers`。另有主机提供的能力：`AgentRuns`（创建线程、启动/恢复运行）、`ModelInvoker`、`RunEvidenceReader`、`ExtensionPrincipal` 鉴权。插件的模型工具默认分组 `extensions`，并入工具表时排在其他来源之后。
- 关键数据：`API_VERSION = "0.2.5"`，1.0 前小版本可能破坏兼容；契约包不得导入 `deerflow`；Protocol 方法都有默认实现以保证新增方法兼容。
- 边界：后端动作与扩展代码以网关权限运行，不是沙箱；改包或开关需重启网关。
- 依据：`H/extensions/AGENTS.md`、`E/__init__.py`、`E/contracts.py`、`E/plugins.py`、`E/placement.py`、`H/tools/tools.py`（`build_plugin_tools`）。

### 示例扩展（`examples/deerflow-extension-*`）
- `example`：演示 5 类扩展点——中间件（在 `TOOL_VISIBLE` 统计工具调用次数、结果、耗时，覆盖主智能体与子智能体）、任务生命周期（任务级统计汇入应用级）、系统模型观察者、服务、路由 `GET /api/extension-example/stats`；不含装配观察者、压缩观察者与完整插件。
- `bookmarks`：完整插件示例，要求 extension-api 0.2.3 以上；保存最近一条可见回答，在「我的书签」页检索、改名、删除，并提供只读模型工具 `search_bookmarks`，按用户隔离，数据存 SQLite（`storage_path`）。
- `agent-teams`：要求 extension-api ≥ 0.2.5；让多个自定义智能体通过定向请求与共享记录协作，每个成员有独立持久会话，无强制主管；选 2–8 个成员；SQLite 示例一库只支持一个网关进程；若智能体设了工具组白名单需包含 `extensions`。
- 依据：三个目录的 `README.md`。

## 端到端流程：一次带子任务的对话

1. 网关为本次运行调用 `get_available_tools`，按配置、模型能力、沙箱策略拼出工具表，并把已启用技能写入 `<skill_system>`。
2. 用户消息到达主智能体；若以 `/技能名` 开头，技能中间件为本轮注入该技能正文。
3. 主智能体按提示词判断，对确有并行或隔离收益的工作调用 `task`；`SubagentLimitMiddleware` 检查并发与单次运行总数。
4. 执行器取得进程槽位（满则排队，超 300 秒报准入失败），在独立事件循环上启动子智能体，附带汇报契约与（可选）上下文快照。
5. `task` 工具每 5 秒查一次状态并向前端发进度事件，直到终态或超时。
6. 执行器在终态前收集工具回执，`task` 对验收条件做代码检查，返回带 UNVERIFIED/holds 标记的结果。
7. 主智能体综合结果；若需上千个独立条目，则改用 `batch_task`，由网关批处理服务异步消化，主智能体只读摘要与分段结果。

## 给产品经理的要点

- 子智能体默认并发 3、排队 64、单次运行最多委派 6 个、单个最长 30 分钟，这四个数都能改，但并发与队列需重启；内置只有 `general-purpose` 与 `bash`，且都不能再委派。
- 子智能体的「完成」只表示执行结束；是否达成靠 `acceptance_criteria` 的代码检查，能检查的只有文件存在/非空/已写入/JSON 合法/测试命令通过，其余全部标为未验证。
- 批处理默认关闭，且要求 SQL 数据库；单批最多 5000 条，默认同时在途 100、同时运行 3，每条最多尝试 3 次。
- MCP 工具默认全量把 schema 放给模型；`tool_search.enabled` 默认关闭，开启后才改为「先列名、按需取 schema」。配置文件改动无需重启即可生效，但 `mcp_tasks`、子智能体并发、批处理都是启动后冻结的。
- 技能与工具是两层：技能是被读取的说明文件，`allowed-tools` 仅对斜杠激活或已载入的技能起限制作用；技能自进化与 MCP 任务跟踪默认都关。
- 想换搜索或抓取服务商，只改 `tools:` 里的 `use:` 一行（社区目录里有 15 家搜索、10 家抓取）；扩展与 capabilities 不同：前者是装进网关进程的代码（运营者权限，改后需重启），后者只是目录卡片加 MCP 配置。

## 文档与源码的出入 / 未核实

- `view_image` 的文档串称支持 gif，但 `_detect_image_mime` 附近的 MIME 表只见 jpeg/png/webp，gif 是否实际可用未核实。
- `task` 工具的类内说明称 `bash` 子智能体在「主机 bash 被允许或使用隔离沙箱（AioSandboxProvider）」时可用；源码只见 `is_host_bash_allowed` 判断，对隔离沙箱的放行逻辑不在本区域，未核实。
- 「显式启用的嵌套 task」的开关在 AGENTS.md 里被提及，源码中我没找到对应配置，未核实；就已读代码而言子智能体不能嵌套。
- `backend/app/subagent_batches/service.py` 只是对 `deerflow.subagents.batch_service` 的兼容转发，真正实现在 harness。
- 沙箱工具（`bash` 等）实现在 `H/sandbox/tools.py`，不在本区域，未读源码，只据示例配置记录。
- 未读：`acceptance_checks.py`（约 100 KB）、`executor.py` 全文、`mcp/session_pool.py` 与 `cache.py` 的全部分支、`skillscan/orchestrator.py` 规则明细、`lark_cli.py` 全文、各 community 工具的参数细节；相应结论均来自 AGENTS.md、配置模型与文件头。批次/条目的完整状态机未核实。
