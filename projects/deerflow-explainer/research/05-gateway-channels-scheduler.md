# 应用层：Gateway API、鉴权、IM 渠道、定时任务、GitHub 集成、TUI

固定提交 3f7a076（bytedance/deer-flow）。路径均相对仓库根；`backend/CLAUDE.md` 只是 `@AGENTS.md` 的引用桩，架构说明读的是 `backend/docs/*` 与各目录 AGENTS.md，再用源码核对。

## 一句话

一个 FastAPI 进程（Gateway，默认 0.0.0.0:8001）同时承担 REST API、兼容 LangGraph 的 runs/threads 接口和 agent 运行本身；IM 渠道、定时任务、GitHub webhook 都是在这个进程里生成"一次 agent 运行"的不同入口，TUI 与 `DeerFlowClient` 则绕开 Gateway，在本进程内直接跑同一个 agent。

## 局部清单

### Gateway（`app/gateway/app.py`，FastAPI 网关）
- 解决的问题：给浏览器、IM 渠道、第三方后端一个统一入口，并负责身份、隔离、文件和配置管理。
- 实现方式：
  1. agent 运行**内嵌在 Gateway 进程里**，不起单独的 LangGraph 服务。`ARCHITECTURE.md` 写明 Nginx 把 `/api/langgraph/*` 改写到 Gateway 的 `/api/*`，`langgraph.json` 只留给工具、Studio 或直连兼容，"不是默认服务入口"。
  2. `lifespan` 启动时依次：加载配置、预热 tiktoken（5 秒超时）、清理上传残留、初始化运行时（StreamBridge、RunManager、checkpointer、store）、检查是否已有 admin、起定时任务服务和渠道服务。
  3. 中间件：AuthMiddleware、CSRFMiddleware、TraceMiddleware。
  4. 健康检查：`/health`（固定返回 healthy）、`/health/ready`（含 Redis 流桥探测，不通返回 503）。
- 路由分组（`app/gateway/routers/`，端点以 `@router` 装饰器为准）：
  - 线程：`/api/threads`（创建、`/search`、GET/PATCH/DELETE、`/{id}/branches`、`/move`、`/read`、`/goal`、`/compact`、`/state`、`/history`）；`/api/thread-activity`。
  - 运行与流式：`/api/threads/{id}/runs`（建后台运行）、`/runs/stream`（SSE）、`/runs/wait`、`/runs/{run_id}`、`/cancel`、`/join`、`/stream`、`/messages`、`/events`、`/workspace-changes`、`/artifacts/archive`、`/regenerate/prepare`、`/edit-regenerate/prepare`、`/api/threads/{id}/token-usage`；无状态版 `/api/runs/stream`、`/api/runs/wait`；反馈 `/api/threads/{id}/runs/{run_id}/feedback`；`/api/assistants`（LangGraph 兼容壳）。
  - 模型：`/api/models`、`/api/managed-models`。
  - MCP：`/api/mcp/config`、`/mcp/cache/reset`、`/api/mcp/personal/config`；线程内 `/api/threads/{id}/mcp-tasks`。
  - 技能：`/api/skills`、`/skills/install`、`/skills/reload`、`/skills/custom/{name}`（含 export、history、rollback）。
  - 记忆：`/api/memory`（含 `/facts`、`/export`、`/import`、`/config`、`/status`、`/reload`）。
  - 上传与产物：`/api/threads/{id}/uploads`（含 `/limits`、`/list`）、`/api/threads/{id}/artifacts/{path}`（GET、PUT）。
  - agents：`/api/agents`（含 `/check`、`/import`、`/{name}/export`）、`/api/user-profile`、`/api/subagents`、`/api/threads/{id}/subagent-batches`（暂停/恢复/取消/重试）。
  - 渠道：`/api/channels`、`/api/channels/{provider}/connect`、`/connections`、`/runtime-config`、`/wechat/qr-login`。
  - 定时任务：`/api/scheduled-tasks`。
  - 项目、知识库、回收站：`/api/projects`（含归档、恢复、`/{id}/threads`）、`/api/projects/{id}/documents`（含 `/from-thread`、`attach-to-thread`、`/content`）、`/api/knowledge/retrieval-catalog/datasets`、`/api/trash/documents`（`/restore`、`/purge`）、`/api/trash/purge`。
  - 其他：`/api/console/{stats,runs,usage}`（运维看板，仅 SQL 后端，memory 后端返回 503）、`/api/features`、`/api/suggestions`、`/api/input-polish`、`/api/plugins`、`/api/capabilities`、`/api/integrations/lark/*`、浏览器 `/api/threads/{id}/browser/navigate` 与 WebSocket `/browser/stream`、`/api/webhooks/github`。
- 流式事件怎样到前端：`POST …/runs/stream` 先 `start_run` 起一个 `asyncio` 任务（`runtime/runs/worker.py::run_agent`）跑 `agent.astream()`，每个 chunk 经 `StreamBridge`（进程内 Queue，或 Redis Streams）送给 `sse_consumer`，写成 `event: <名>\ndata: <json>` 帧。响应头带 `Content-Location`（LangGraph SDK 靠它取 run id）、`Cache-Control: no-cache, no-transform`、`X-Accel-Buffering: no`。
- 关键数据与默认值：
  - 事件名：worker 发布 `metadata`、`values`、`messages`、`error`，以及请求的其他模式；公开 stream_mode 枚举为 `values / messages-tuple / updates / debug / tasks / checkpoints / custom`，未指定时默认 `["values"]`；worker 把 `messages-tuple` 翻成图层的 `messages`。收尾有 `end`；游标过期发 `gap`（`recovery: reload_durable_state`，不带 id 也不再发 `end`）；空闲发 `: heartbeat` 注释帧。
  - 心跳 `stream_bridge.heartbeat_interval_seconds` 默认 15 秒（文档）；`queue_maxsize` 默认 256；`type` 为 `memory`（默认）或 `redis`。
  - 断线重连用 `Last-Event-ID`，只保证保留窗口内完整重放。
  - `RunCreateRequest` 字段：`on_disconnect` 默认 `cancel`（可 `continue`）；`multitask_strategy` 默认 `reject`（可 `rollback`、`interrupt`）；`webhook`、`on_completion`、`after_seconds`、`feedback_keys` 只接受空值，传了就拒绝；`conversation_references` 最多 3 条。
  - 取消：`action=interrupt`（保留检查点）或 `rollback`（回到运行前），`wait=true` 阻塞直到停稳（204），否则 202。
- 配置开关：环境变量 `GATEWAY_HOST`、`GATEWAY_PORT`（8001）、`GATEWAY_ENABLE_DOCS`（true）；`config.yaml` 的 `stream_bridge`、`run_ownership`、`deployment.multi_instance`。
- 边界与失败行为：
  - 多 worker 或多实例（`GATEWAY_WORKERS>1` 或 `deployment.multi_instance`）要求 Postgres、`run_events.backend: db`、`run_ownership.heartbeat_enabled`、Redis 流桥，否则启动失败。
  - 创建者的 SSE 断开才触发 `on_disconnect`，旁观者 join 断开不会取消运行。
  - 用户客户端传不了 `interaction_mode`、`non_interactive`、`disable_clarification`、`channel_name` 这类内部键。
- 依据：`app/gateway/app.py:563+`、`config.py`、`sse_headers.py`、`run_models.py`、`services.py:sse_consumer / start_run`、`routers/*.py`、`runtime/stream_modes.py`、`docs/ARCHITECTURE.md`、`docs/STREAMING.md`、`docs/RUN_INTERACTION_POLICY.md`。

### 鉴权（`app/gateway/auth/`、`auth_middleware.py`、`csrf_middleware.py`，登录与会话）
- 解决的问题：把 DeerFlow 从单用户工具变成多用户部署，用户身份贯穿 API、文件、记忆、自定义 agent。
- 实现方式：
  1. 首次启动没有 admin 时只记日志提示访问 `/setup`；前端调 `GET /api/v1/auth/setup-status`，提交 `POST /api/v1/auth/initialize` 建 admin（存储层原子认领，SQLite 用 `BEGIN IMMEDIATE`，Postgres 用 advisory lock）。
  2. 登录 `POST /api/v1/auth/login/local`（邮箱+密码）成功后签 HS256 JWT，放进 HttpOnly 的 `access_token` cookie，响应体不返回 token。
  3. `AuthMiddleware` 全局拒绝（默认拒绝）；每个请求的来源优先级：内部 token → `Authorization` Bearer（PAT）→ cookie JWT → 开发用免鉴权。
  4. 通过后把用户写进 `request.state` 和 `user_context` 的 ContextVar，下层仓储用 `AUTO` 哨兵自动按当前用户过滤。
- 四种身份来源：本地账号；OIDC/SSO（`GET /api/v1/auth/oauth/{provider}` → callback，PKCE+nonce 默认开，`auto_create_users`、`require_verified_email` 默认 true，可限邮箱域、指定 admin 邮箱）；IM 渠道绑定；Internal Auth（`X-DeerFlow-Internal-Token` + `X-DeerFlow-Owner-User-Id`，合成 `system_role=internal` 用户，不写 users 表，DeerFlow 不核实 owner 是否真实）。另有 PAT（源码有，AUTH_DESIGN 未列）：`dfp_` 前缀，只存 SHA-256，一次性展示；scope 限 `threads:*`、`runs:create/read/cancel`、`projects:*`；路由默认拒绝，只放行线程/运行生命周期，记忆、agents、渠道配置对 PAT 一律 403。
- 关键数据与默认值：JWT 有效期 `token_expiry_days` 默认 7（1–30）；`token_version` 在改密码/重置时递增使旧 token 失效；登录限速 `max_login_attempts` 默认 5、`lockout_seconds` 默认 300，`throttle_storage` 默认 `auto`（有数据库就用 `login_throttle` 表，多副本共享，否则进程内）；`allow_registration` 默认 true；CSRF 为双提交 cookie（`csrf_token` cookie 对 `X-CSRF-Token`），管 POST/PUT/DELETE/PATCH，登录类端点改校验 Origin。
- 配置开关：`AUTH_JWT_SECRET`（未设则自动生成并写入 `{base_dir}/.jwt_secret`，日志警告）、`DEER_FLOW_INTERNAL_AUTH_TOKEN`（未设则每进程随机）、`DEER_FLOW_AUTH_DISABLED=1`（匿名按合成 admin 运行；`DEER_FLOW_ENV` 或 `ENVIRONMENT` 为 prod/production 时失效）、`AUTH_TRUSTED_PROXIES`、`auth.oidc.*`、`auth.local.*`。
- 边界与失败行为：cookie 存在但 JWT 无效/过期/用户不存在/版本不符，直接 401，不穿透；重置用 `python -m app.gateway.auth.reset_admin`，只把随机密码写进 0600 的凭据文件；`/api/webhooks/` 免登录免 CSRF，由签名保护；无 admin 时允许注册普通用户（文档承认的缺口）。
- 依据：`docs/AUTH_DESIGN.md`、`auth_middleware.py`、`auth/jwt.py`、`auth/config.py`、`auth/pat.py`、`auth_disabled.py`、`internal_auth.py`、`harness/deerflow/config/auth_config.py`。

### 权限与多用户隔离（`app/gateway/authz.py`、`deerflow/authz/`，授权层）
- 解决的问题：谁能调哪些接口、用哪些模型/工具/技能/沙箱，以及用户间数据互不可见。
- 实现方式：
  - 路由层：`@require_permission("资源","动作", owner_check=…)`。权限串为：`threads:read/write/delete`、`runs:create/read/cancel`、`projects:read/write/delete`、`memory:read/write`、`agents:read/write`。`owner_check` 对线程查 `threads_meta.user_id`，别人的线程返回 404 而不是 403。
  - 策略层（可插拔）：`AuthorizationProvider` 协议，输入 `Principal`（user_id、role、oauth、`is_internal` 等）加 `AuthzRequest(resource, action, target)`；内置 `RbacAuthorizationProvider` 按 `roles → 资源类型 → {allow, deny}` 编译，deny 优先，未知角色抛错。资源类型：tool、model、skill、sandbox、mcp_server、route、plugin_action、plugin_management。
  - 执行点：组装期过滤（模型看不到的工具根本不绑定）加运行期拦截（经 `GuardrailAuthorizationAdapter` 走护栏中间件）；路由权限在 `resolve_route_permissions` 里逐项评估。
  - 角色分配：admin 专用 `PATCH /api/v1/admin/users/{id}` 改 `system_role` 或停用账号；最后一个 admin 不能降级或停用。
  - 隔离：文件在 `users/{user_id}/threads/{thread_id}/user-data/{workspace,uploads,outputs}`，沙箱内映射为 `/mnt/user-data/*`；记忆在 `users/{user_id}/memory.json`；自定义 agent 在 `users/{user_id}/agents/{name}/`；客户端传入的 `metadata.user_id/owner_id` 会被剥离。
- 关键数据与默认值：`authorization.enabled` 默认 false（关闭时所有登录用户拥有全部路由权限）；`fail_closed` 默认 true；`default_role` 默认 `user`（内部调用方或未绑定渠道没有真实角色时使用）。
- 边界与失败行为：策略出错时 fail_closed 为真则拒绝；`memory.storage_path` 设为绝对路径即退出按用户隔离，所有用户共享；`user_id=None` 只留给迁移脚本。
- 依据：`app/gateway/authz.py`、`harness/deerflow/authz/{provider,rbac}.py`、`config/authorization_config.py`、`routers/admin_users.py`、`docs/AUTH_DESIGN.md`。

### 渠道系统（`app/channels/`，IM 渠道）
- 解决的问题：让用户在 IM 里直接和 agent 对话，不用开网页。
- 平台（`service.py:_CHANNEL_REGISTRY` 共 10 个）：buzz（Nostr 中继）、dingtalk、discord、feishu、github、qq、slack、telegram、wechat（iLink）、wecom。连接方式均为出站长连接，无需公网 IP：飞书用 lark-oapi WebSocket；Slack 用 Socket Mode；Telegram 用长轮询；钉钉用 Stream Push；企业微信用 WebSocket（wss://openws.work.weixin.qq.com）；微信用 iLink 长轮询（默认 35 秒）；Discord 用 discord.py 网关；QQ 用 WebSocket；GitHub 是例外，靠入站 webhook。
- 部件：`MessageBus`（入站队列，`inbound_queue_maxsize` 默认 1000，出站按监听者快照分发）；`ChannelManager`（固定 worker 池，`max_concurrency` 默认 5）；`ChannelStore`（`channel_name:chat_id[:topic_id]` → thread_id，sqlite/postgres 用 `channel_thread_bindings` 表，否则 `{base_dir}/channels/store.json`）；各平台 `Channel` 子类；`CHANNEL_CAPABILITIES` 登记 `supports_streaming`（buzz、feishu、telegram、wecom 为 true）与 `proactive_notifications`（仅 wecom 为 true）。
- 一条消息的流程（见下文端到端）；命令集 `KNOWN_CHANNEL_COMMANDS`：`/agent`、`/bootstrap`、`/goal`、`/new`、`/status`、`/models`、`/model`、`/memory`、`/help`，另有 `/connect <code>` 绑定、`/<skill-name> <任务>` 单轮激活技能。
  - `/new` 新建线程；`/status` 回显当前线程 id；`/model <名>` 把模型钉在当前线程元数据；`/agent use <名>` 总是新建线程；`/goal` 设目标后把目标当一轮聊天发出。
- 关键数据与默认值：去重键 `(渠道, workspace, chat, 消息id)`，窗口 10 分钟、最多 4096 条；流式更新最短间隔 1 秒或累积 60 字符即刷新；默认运行配置 `recursion_limit: 100`、`thinking_enabled: true`、`subagent_enabled: false`；Telegram 编辑占位消息"Working on it..."（私聊 1 秒/群聊 3 秒节流，超 4096 字符拆条）；钉钉配 `card_template_id` 走 AI Card 流式；飞书对同一卡片原地 patch；入站飞书文件超 20,000,000 字节、Telegram 超 20,000,000 字节被拒；微信默认 20 MB 图片/50 MB 文件；企业微信出站上限 20480 UTF-8 字节。
- 用户绑定（`channel_connections`，默认关）：浏览器 `POST /api/channels/{provider}/connect` 发一次性码（`token_urlsafe(16)`、600 秒、单次），用户在 IM 发 `/connect <码>`（Telegram 为深链 `/start <码>`）；同一外部身份只允许一个活跃 owner，最新绑定者胜出，数据库部分唯一索引保证；绑定后 `owner_user_id` 成为 run 的 `user_id`；`require_bound_identity` 配置默认 true，未绑定消息被拒；凭据用 `DEER_FLOW_CREDENTIALS_KEY` 加密落库。
- 配置开关：`channels.langgraph_url`（默认 `http://localhost:8001/api`）、`channels.gateway_url`、`channels.<平台>.*`（含 `allowed_users`）、`channel_connections.enabled`；环境变量 `DEER_FLOW_CHANNELS_LANGGRAPH_URL`、`DEER_FLOW_CHANNELS_GATEWAY_URL`。Docker 内要写 `http://gateway:8001`。
- 边界与失败行为：同一线程忙时回复 `THREAD_BUSY_MESSAGE`；多副本部署下同一 bot 只能一个实例连（本地多实例演练默认关闭渠道）；管理员可 `POST /api/channels/{name}/restart`。
- 依据：`app/channels/AGENTS.md`、`service.py`、`message_bus.py`、`manager.py:68–171, 2245+, 3290+`、`commands.py`、`capabilities.py`、`dedupe_store.py`、`docs/IM_CHANNEL_CONNECTIONS.md`。

### 定时任务（`app/scheduler/`、`deerflow/scheduler/`，Scheduler）
- 解决的问题：让 agent 按计划自己跑（日报、巡检），结果落在一个会话里并可通知。
- 数据结构（`scheduled_tasks` 表）：`user_id`、`thread_id`、`context_mode`（`fresh_thread_per_run` 默认，或复用线程）、`assistant_id`（默认 `lead_agent`，可指自定义 agent）、`title`、`prompt`、`schedule_type`（`once` / `cron` / `interval`）、`schedule_spec`、`timezone`、`status`、`overlap_policy`（默认 `enqueue`）、`next_run_at`、`run_count`、`goal_objective`、`stop_condition`（≤500 字，单独存，启动时才拼进消息）、`max_runs`、`end_at`、`standing_notes`、租约字段。每次触发在 `scheduled_task_runs` 记一条，状态 `queued / launching / running / success / unmet / failed / skipped / interrupted`。
- 触发方式：`once` 用 `run_at`（无时区则按任务时区，须晚于现在）；`cron` 必须 5 个字段，用 croniter，DST 回拨时定点任务不重复触发；`interval` 用 `every_seconds`（≥`min_once_delay_seconds`，≤30 天，从"现在"起算，不补错过的节拍）。另有手动 `POST …/trigger`、`/pause`、`/resume`、`/preview-cron`（一次预览 1–10 个）。
- 实现方式：
  1. `ScheduledTaskService` 轮询（`poll_interval_seconds`）：先恢复过期租约、淘汰排队超时的行，再排队、再 `claim_due_tasks` 抢到期任务。
  2. `dispatch_task` 把本次触发先写成持久化的 `queued` 行，再原子抢占为 `launching`（受全局与单用户并发上限约束）。
  3. `launch_scheduled_thread_run` 用合成的内部请求调用 `start_run`：消息 id 为 `scheduled-<run_id>`，`on_disconnect=continue`、`multitask_strategy=reject`，上下文带 `non_interactive: true`，递归上限取 `scheduler.recursion_limit`，幂等键 `scheduled-task:<run_id>`。
  4. 运行结束后 `handle_run_completion` 归类：成功；设了目标但没满足为 `unmet`；中断；报错/超时为 `failed`。
  5. 结果写进该会话；若开了 `channel_connections`，同一事务里写通知发件箱，工作线程推送（目前仅企业微信）。
- 关键数据与默认值（`config.yaml` 的 `scheduler`）：`enabled: false`、`tool_enabled: false`、`multi_instance: false`、`poll_interval_seconds: 5`、`lease_seconds: 120`、`max_concurrent_runs: 3`、`max_concurrent_runs_per_user: 2`（0 关闭，≤32）、`queue_timeout_seconds: 3600`、`min_once_delay_seconds: 60`、`recursion_limit: 1000`。通知事件：`run_completed`、`run_failed`、`run_unmet`、`task_paused`、`task_stopped`、`task_finished`；一次触发只发一条，优先级 task_stopped > task_paused > task_finished > run_failed > run_unmet > run_completed。
- 配置开关：`tool_enabled` 打开后对话里的 agent 可用 `schedule_task`，定时运行里可用 `stop_scheduled_task`，两者都需 `enabled` 为真。
- 边界与失败行为：连续 3 次 `unmet` 自动暂停（`paused after 3 unmet scheduled goal runs`）；`once` 任务运行中保持 `running` 直到真实终态；手动触发失败不消耗 `once` 的未来计划；任务有排队或在跑的触发时不可编辑（409）；重启时把遗留的活跃运行标为 `interrupted`；轮询异常只记日志下一轮重试；定时运行属 `scheduled` 模式，不能向人提问，只能"最小假设"或返回 `BLOCKED`；多 worker 下开 `scheduler.enabled` 必须同时 `multi_instance: true`（需 Postgres）。通知送达失败：通道故障最多挂起约一天，平台拒绝则约 15 分钟重试后置 `failed`。
- 依据：`app/scheduler/service.py`、`notification_delivery.py`、`deerflow/scheduler/{schedules,stop_rule,runtime,host_notes}.py`、`persistence/scheduled_tasks/model.py`、`persistence/scheduled_task_runs/finalization.py`、`routers/scheduled_tasks.py`、`services.py:launch_scheduled_thread_run`、`docs/CONFIGURATION.md:524+`。

### GitHub 集成（`app/gateway/github/`、`routers/github_webhooks.py`、`channels/github.py`）
- 解决的问题：让绑定在仓库上的自定义 agent 对 issue、PR、评论事件做出反应，并自己用 `gh` 回写。
- 实现方式：
  1. 每个自定义 agent 在自己的 `config.yaml` 里写 `github:` 块（`installation_id`、`bot_login`、`bindings: [{repo, triggers}]`）；全局 `channels.github` 只有总开关和默认 mention 名。
  2. GitHub 投递到 `POST /api/webhooks/github`，路由校验 `X-Hub-Signature-256` HMAC 后调用 `fanout_event`，为每个匹配的 agent 发一条 `InboundMessage`；跳过 bot 自己触发的事件。
  3. 线程 id 确定：`UUID5(repo#编号:agent名)`，同一 PR 的不同 agent 各用各的线程。
  4. 管理器按 `ChannelRunPolicy` 运行：`interaction_mode=webhook`、`is_interactive=False`、`default_recursion_limit=250`、`requires_bound_identity=False`、`fire_and_forget=True`（`runs.create` 即返回）、`buffer_followups_on_busy=True`；运行前铸造 App 安装令牌（约 1 小时）放进 `GH_TOKEN`/`GITHUB_TOKEN` 给沙箱。
  5. 出站只写日志，agent 在沙箱里用 `gh` 自己评论或开 PR。
- 关键数据与默认值：默认触发字段：`pull_request` 仅 `actions: [opened]`，`issue_comment` 与 `pull_request_review_comment` 默认 `require_mention=true`；事件必须在绑定里列出才会送达该 agent；mention 名优先级：触发项 `mention_login` > `bot_login` > `default_mention_login` > agent 名；忙线时的后续消息缓冲每线程最多 20 条，超出丢最旧。
- 配置开关：环境变量 `GITHUB_WEBHOOK_SECRET`（未设且未设 `DEER_FLOW_ALLOW_UNVERIFIED_GITHUB_WEBHOOKS=1` 时路由不挂载，返回 404）、`GITHUB_APP_ID`、`GITHUB_APP_PRIVATE_KEY` 或 `GITHUB_APP_PRIVATE_KEY_PATH`。
- 边界与失败行为：缓冲只在单进程内有效；签名不符拒绝；注册表随 agent 配置变化而失效重建。
- 依据：`docs/GITHUB_AGENTS.md`、`routers/github_webhooks.py`、`github/{triggers,run_policy,app_auth,dispatcher}.py`、`app/channels/github.py`。

### 飞书 CLI 边车镜像（`docker/lark-cli-broker`、`docker/lark-cli-init`，沙箱内的飞书命令行）
- 解决的问题：让沙箱里的 agent 能执行 `lark-cli`，但读不到飞书密钥。
- 实现方式：init 镜像（Pattern A）构建时下载并校验 `larksuite/cli` 二进制，运行时拷到共享 emptyDir；broker 镜像（Pattern B）是常驻边车，持有凭据并在 `127.0.0.1:8788` 服务，沙箱里只放一个转发命令的 shim，原始 appSecret 与 OAuth 文件不进沙箱文件系统。
- 依据：`docker/lark-cli-broker/README.md`、`docker/lark-cli-init/README.md`。

### TUI（`deerflow/tui/`，终端工作台）
- 解决的问题：不起 Gateway、前端、Docker，在终端里直接用同一套 agent。
- 实现方式：Textual 应用，嵌入式调用 `DeerFlowClient`；`stream()` 是同步生成器，所以在 Textual 工作线程里跑，经 `call_from_thread` 把动作送回 UI 线程；纯逻辑层（`view_state`、`runtime`、`command_registry` 等）无 Textual 依赖。
- 关键数据与默认值：命令 `deerflow`（console script，入口 `deerflow.tui.cli:main`）；`--tui`、`--cli`、`--print "问题"`、`--json`（逐行 StreamEvent）、`--continue`、`--resume THREAD`、`--recursion-limit`（无头默认 100）；斜杠命令 `/help /new /clear /threads /switch /resume /goal /model /skills /tools /mcp /memory /uploads /artifacts /details /usage /config /quit` 加 `/<skill> 任务`；`Esc` 或 `Ctrl+C` 中断，空闲时 `Ctrl+C` 退出。
- 配置开关：`DEER_FLOW_TUI=1`、`DEER_FLOW_TUI_TRANSPARENT=1`；textual 为可选依赖 `deerflow-harness[tui]`。
- 边界与失败行为：被中断的运行不能中途停，正在执行的工具会跑完，期间向同线程再发消息只给提示；LLM 供应商错误会被转成带 `deerflow_error_fallback` 标记的 AI 消息，`--print` 仍输出文本并在 stderr 报错、退出码 1。`persistence.py` 往 Gateway 所读的同一数据库写 `threads_meta`（owner 为 `default`），所以 TUI 会话能出现在网页侧栏；数据库后端为 memory 时静默不写。
- 依据：`docs/TUI.md`、`tui/cli.py`、`tui/command_registry.py`、`tui/persistence.py`、`pyproject.toml` 的 `[project.scripts]`。

### 嵌入式 Python 客户端（`deerflow/client.py::DeerFlowClient`）
- 解决的问题：在 Jupyter、脚本、测试里把 agent 当普通函数调用，不依赖 Gateway。
- 实现方式：构造时读 `config.yaml`，首次调用才建 agent，配置变化后重建；`chat(message, thread_id)` 返回累加后的文本；`stream()` 同步 yield `StreamEvent`，类型为 `values`、`messages-tuple`、`end`（代码注释所列），直接订阅 LangGraph 的 `values / messages / custom`，数据保留原生 LangChain 对象，不做 JSON 序列化，没有 StreamBridge、RunManager。另有与 Gateway 对应的管理方法：模型/技能/记忆/MCP 配置、上传与产物、线程列表、目标（goal）。
- 关键数据与默认值：构造参数 `thinking_enabled=True`、`subagent_enabled=False`、`plan_mode=False`、可选 `checkpointer`、`agent_name`、`available_skills`、`middlewares`。
- 边界与失败行为：没有 checkpointer 就无多轮记忆，`thread_id` 只用于文件隔离；系统提示在 agent 创建时生成并缓存，长驻进程需 `reset_agent()` 刷新；`messages` 事件是增量，由调用方累加。
- 与 Gateway 的关系：两条流式路径并存且刻意不共享代码（文档解释：Gateway 为跨网络送 HTTP 消费者才需要 asyncio+Queue+JSON，进程内调用者不需要）。IM 渠道不走客户端，而是通过 `langgraph-sdk` HTTP 回调 Gateway。
- 依据：`client.py:135–280`、`docs/STREAMING.md`。

## 端到端流程：一条飞书消息变成一次运行再回帖

1. 飞书 WebSocket 把消息交给 `FeishuChannel`，它把消息封成 `InboundMessage` 并发布到 `MessageBus`。
2. `ChannelManager` 的某个 worker 取出消息，先用 `(渠道, workspace, chat, 消息id)` 查去重，10 分钟内重复则丢弃。
3. 管理器检查命令；`/connect <码>` 先于 `allowed_users` 处理。启用了 `channel_connections` 时，再核对发送者是否已绑定（`owner_user_id`），否则回复"先去设置里连接"。
4. 管理器按 `channel:chat[:topic]` 查 `ChannelStore`，没有就经 SDK 调 Gateway 创建线程；首次创建受按 key 的锁保护，避免重复建线程。
5. 管理器带内部令牌、CSRF 头和 `X-DeerFlow-Owner-User-Id` 调 Gateway 的 `runs.stream()`，请求 `messages-tuple` 与 `values`。
6. Gateway 的 `start_run` 起 `run_agent` 任务，流经 StreamBridge 以 SSE 返回。
7. 管理器只累积"助手类"消息文本（白名单），按至少 1 秒或 60 字符发出非最终更新；飞书把更新 patch 到同一张卡片。
8. 收尾时管理器读取 `present_files` 工具调用得到产物，只从 owner 的 `outputs/` 目录解析并校验路径，发出最终出站消息，渠道把文本和文件回传到平台。
9. 非流式平台（Slack、Discord 等）改用 `runs.wait()`，取最后一条 AI 文本一次发出。
10. 完成后释放去重键；出错走统一失败路径，只回通用错误文案。

## 给产品经理的要点

1. agent 与 API 在同一进程里跑：没有独立的 LangGraph 服务；多实例部署必须配 Postgres、Redis 流桥和运行租约，否则启动会被拒。
2. 默认的并发与可用性边界：同一线程默认拒绝并发运行（`reject`）；SSE 创建者断开默认取消运行（`on_disconnect=cancel`）；IM 默认 5 个并发 worker。
3. 授权默认是关的：`authorization.enabled=false` 时所有登录用户拥有全部路由权限，细粒度 RBAC 要运营者另配角色表；角色可由 admin 在 `/api/v1/admin/users` 分配。
4. IM 渠道是"出站长连接 + 绑定码"模型：不需要公网回调，但每个外部身份只能归属一个 DeerFlow 账号，后绑定者覆盖前者；定时任务通知目前只有企业微信能主动推送。
5. 定时任务默认关闭，且与"对话里让 agent 建任务"是两个开关（`enabled`、`tool_enabled`）；单用户并发上限 2；目标连续 3 次未达成自动暂停。
6. GitHub 集成不自动回帖：agent 在沙箱里用 `gh` 自己决定是否评论；Webhook 没配密钥时整条路由不存在（404）。
7. TUI 和 `DeerFlowClient` 不经过 Gateway 的登录与权限，是本机信任模型；TUI 会话以 `default` 用户写入共享数据库后才会出现在网页里。

## 文档与源码的出入 / 未核实

- AUTH_DESIGN.md 写"角色只有 admin 和 user，尚未实现细粒度 RBAC"，源码已有可插拔 RBAC、`admin_users` 路由、账号停用和 PAT；文档的"四类身份来源"未含 PAT。以源码为准。
- 文档称"登录限速是进程内字典"，同一文档"已知边界"和源码（`throttle_storage: auto` 走 `login_throttle` 表）显示默认已入库；文档内部也不一致。
- `ChannelManager` 构造参数 `require_bound_identity` 默认 False，而 `channel_connections` 配置里该项默认 True；实际生效值由 `service.py` 传入，传参路径未逐行核实。
- `channels/AGENTS.md` 的 `channels.github` 配置键说明被截断，没读全；GitHub 之外 buzz（Nostr）和 QQ 渠道只读了登记与说明，未读实现。
- 未读：`oidc.py`、`github/dispatcher.py` 的细节、`routers/threads.py` 与 `thread_runs.py` 的全部分支（分支、重新生成、编辑重生成的内部机制）、`mcp.py` 与 `skills.py` 路由内部、`console.py` 返回字段、`langgraph_studio.py`、`docs/tui/*.svg`（仅为截图）。
- Slack 的 `supports_streaming` 在能力表里为 false，对应 `runs.wait`；Slack 的 `thread_ts` 回帖行为未核实。
- 通知"企业微信是唯一支持主动推送"来自 `capabilities.py` 与 CONFIGURATION.md，二者一致。
