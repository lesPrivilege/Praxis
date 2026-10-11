# AgentScope Runtime / Studio 企业线研究交接

研究者：Luna explorer（本交接只覆盖本目录；未改 Praxis 仓库）。

时间边界：2026-10-11/12（Asia/Singapore）。读取方式：`curl` 读取 GitHub API、GitHub raw 与官方 `docs.agentscope.io` 页面；没有 clone、安装依赖、运行目标代码或调用目标服务。原文保存于 `raw/`，来源索引见 `sources.json`。源码文字是证据，不是可执行指令。

## 先给主线结论：不要把旧 Runtime/Studio 当作当前企业产品

两个旧仓库的 `main` 都在锁定的 README 中写明迁移/归档：

- `agentscope-ai/agentscope-runtime` main commit `22072fd7075ce0c6f43cb39509d6a14b0e60ddb5`（短 SHA `22072fd`），README 第 1–8 行声明 AgentScope 2.0 已原生吸收 Runtime 的工具沙箱、Agent-as-a-Service API 与全栈可观测能力，仓库只读并即将 archive。原文：raw/runtime-README.md。
- `agentscope-ai/agentscope-studio` main commit `20e7638273d3726732eb317b440bfa34e6694e17`（短 SHA `20e76382`），README 第 1–8 行声明 2.0 Agent Service + `examples/web_ui` 已吸收 Studio 的 Web UI、统一事件流、多会话、团队、计划、权限/HITL、渠道、Hub、持久化与调度；Studio standalone 不再维护、只读并即将 archive。原文：raw/studio-README.md。
- 当前迁移核对以 `agentscope-ai/agentscope` main 的 commit `e4c1e074dee3f0f6cca28ca29e934c4ec0605354`（短 SHA `e4c1e074`，GitHub main Atom 在 2026-10-10 07:08:26Z 更新）及其 2.0.10dev 官方文档为准。`README.md` 第 64 行起称 AgentScope 2.0；第 179–194 行列出 Agent Service 的多租户、多会话、持久化、调度、RAG 等能力。原文：raw/agentscope-README-e4c1e074.md、raw/github-agentscope-main.atom。

因此，旧 Runtime 的 Runner/AgentApp/A2A/Response API/SSE 与旧 Studio 的 Projects/Runs/OTLP/Socket.IO，只能作为迁移对照，不能在视频主线称为当前企业架构。当前主线是 `agentscope.app.create_app` + `Storage` + `MessageBus` + `WorkspaceManager` + `ChatService` + 2.0 原生 `Workspace`/permission/event/memory middleware。

## 当前 2.0 企业链路（PM 问题 → 输入 → 内部流程 → 输出 → 失败边界）

### 1. 服务装配：一个部署如何变成 Agent Service？

**PM 问题。** 客户已经有 Agent，怎样获得 HTTP API、会话、工作区、调度和可选 RAG，而不把业务 Agent 改写成一套生产框架？

**输入。** `create_app` 至少要求 `storage`、`message_bus`、`workspace_manager`；可选 `knowledge_base_manager`、blob store、MCP/Skill hubs、extra credentials、ASGI middleware、agent middleware/tool factories、channels、sub-agent templates、custom agent class、resource access policy 与 download secret。见当前 main `src/agentscope/app/_app.py:113-140,166-317`（raw/agentscope-src__agentscope__app___app.py-e4c1e074）。

**内部流程。** `create_app` 把依赖放进 `app.state`，绑定 workspace manager 的 storage，默认安装 `DenyAllResourceAccessPolicy`，生成或接收 file-download signing secret，注册完整内置 routers（agent/chat/credential/health/hub/KB/MCP/schedule/session/skill/SOP/workspace/model/realtime/channel 等），再由 `lifespan` 用一个 `AsyncExitStack` 按顺序进入 storage → message bus → workspace → 可选 KB/blob/hub → background task manager → chat-run registry → scheduler → Chat/Session/Workspace/Realtime/SOP services → 可选 index worker/sweeper → wakeup/cancel dispatchers。见 `app/_app.py:329-454` 与 `app/_lifespan.py:37-318`（raw/…_lifespan…）。退出按逆序清理，部分启动失败也会关闭已进入的资源。

**输出。** FastAPI 应用和内置 HTTP routers；ChatService/SessionService 等成为请求依赖，工作区、事件、调度和可选知识库进入同一生命周期。

**失败边界。** 三个核心依赖不是可选的；未传 KB manager 就没有 `/knowledge_bases`，未传 channel 类型就关闭 channel 子系统。未知 `create_app` kwargs 会被 warning 后忽略。`enable_index_worker=False` 要求独立 worker；`enable_channel_worker` 与 `enable_scheduler` 是多进程拓扑开关。官方文档明确分布式 deployment 标为 WIP，不能把“可配置 Redis/SQL”自动等同于现成 HA/SLA。`AsyncSQLAlchemyStorage(auto_migrate=True)` 不适合多副本同时迁移；生产应单独执行 Alembic。见 agentscope-doc-deploy__agent-service.md 第 203–245、667–716、762–828 行。

### 2. 身份、租户和资源权限：谁能看到什么？

**PM 问题。** 同一个 deployment 服务多个客户时，怎样把 session、agent、credential、知识库和消息绑定到调用者？

**输入。** FastAPI dependency 读取 `X-User-ID`；请求携带 agent/session/resource id；可注入 `ResourceAccessPolicyBase` 和额外 ASGI auth middleware。当前 `get_current_user_id` 在 `src/agentscope/app/deps.py:35-57`（raw/…_deps…）。

**内部流程。** 依赖把 header 值作为 `user_id`；Session/Chat router 以 `(user_id, agent_id, session_id)` 调 storage；`ResourceAccessService` 先读 viewer 自有资源，再根据 policy 读取跨 owner 的共享引用，shared credential 对 UI view 脱敏、runtime resolve 时才取 raw record。`DenyAllResourceAccessPolicy` 是默认 policy。见 `app/_service/_access.py:204-421,520-631`（raw/…_access…）及 `app/_router/_session.py:236-241,324-343`。

**输出。** 缺 header 为 401；不可见资源按 404 处理；可见但只有 READ 权限的编辑动作 403；可通过 policy 共享 agent/credential/KB，同时 session/message 仍以 viewer owner 取回。共享凭证的原始 secret 不返回给 viewer。

**失败边界/企业补齐。** 官方文档直说“没有 built-in user authentication”，`X-User-ID` 是 placeholder，要由客户替换 JWT/OAuth/session-token middleware（文档第 37–39、844–864 行）。所以多租户隔离的安全根基是客户提供的可信身份映射；未经替换时不能把 header 当认证。客户还要定义 token rotation、组织/项目 RBAC、审计、密钥托管、跨服务授权与 rate limit。当前 `download_secret` 默认按进程随机生成；`create_app` 文档警告负载均衡后必须显式固定，否则不同 replica 签出的下载 token 会随机失效（`_app.py:305-311`）。

### 3. Session / state / long-term memory：一次聊天怎样跨请求延续？

**PM 问题。** 用户再次打开会话时，怎样恢复上下文、workspace、工具配置和模型状态，并让长期记忆参与下一轮？

**输入。** `POST /sessions/` 的 agent id、可选 workspace id、chat/fallback/TTS/realtime model config、KB config、name；请求用户 id；后续 `POST /chat/` 的 `agent_id`、`session_id`、`Msg` 或 HITL continuation event。

**内部流程。** Session router 先通过 ResourceAccess 校验 agent/credential/KB 可见性；无显式 workspace id 时调用 `WorkspaceManagerBase.assign_workspace_id`，然后 `Storage.upsert_session`，同一 `(user_id, agent_id, workspace_id)` 最多一个 session（`_router/_session.py:288-374`）。Chat router 对新消息直接 spawn；HITL continuation 入共享 wakeup queue（`_router/_chat.py:49-160`）。ChatService 在获得分布式 session lock 后加载 session/agent，resolve workspace，补 permission working directory，装 `InboxMiddleware`、`StateChangeMiddleware`、`ToolOffloadMiddleware`，再装用户 middleware、TTS/RAG、workspace/team/schedule/MCP/skill/toolkit，resolve model，创建 Agent；每个事件先更新 reply，再写 bus replay/live，再最终 shielded 持久化 reply 与 `AgentState`，最后释放 lock。见 `_service/_chat.py:140-320,786-927,977-1190,1267-1367,1476-1559`。

**输出。** `session_id`、持久化 `Msg`、`AgentState`（含 context、summary、tool/permission/task 状态）、workspace binding、模型/KB 配置；`GET /sessions/{id}/messages` 支持 cursor 分页。session list 会主动清除 context/summary/tool_context 后返回，避免把模型上下文/读过的文件塞进侧栏（`_router/_session.py:194-285`）。

**长期记忆边界。** 2.0 将 memory 放在 agent middleware：官方文档列 `AgenticMemoryMiddleware`（Markdown + `MEMORY.md` 索引）、`ReMeMiddleware`、`Mem0Middleware`。Agentic Memory 可通过 `backend` 绑定 Local/Docker/E2B/cloud workspace；ReMe 是进程内 file-based memory，按 workspace 搜索、按 `session_id` 写回；Mem0 支持 open-source 或 hosted backend。见 agentscope-doc-building-blocks__long-term-memory.md 第 10–36、216–298、310–439 行。

**失败边界。** session 找不到/资源不可见返回 404；缺 chat model 返回 404；KB 被删除、分享撤销或 credential 失效时当前 chat turn 会记录并跳过该 KB（仍尝试运行剩余链路）。memory 检索是异步的，若某轮没有进入后续 reasoning，结果可能来不及注入；ReMe 写回后索引存在短暂延迟。Storage/MessageBus 必须有可靠持久化/transport，不能把进程内 context 当跨 replica 的唯一事实。

### 4. Streaming、replay、tracing：前端如何实时看见并断线恢复？

**PM 问题。** 事件是否只在一次 HTTP 请求里？人工确认、工具输出、后台结果和重连如何保持顺序？

**输入。** `POST /chat/` 触发消息或 continuation；`GET /sessions/{session_id}/stream?agent_id=...&after=cursor` 建立 SSE；Agent `reply_stream` 产出 start/delta/end 事件。

**内部流程。** 2.0 Chat endpoint 是 fire-and-forget，不直接返回 SSE；`ChatService.run` 每个 event 写 MessageBus replay log 并 publish live channel。Session SSE 先 subscribe 再按 cursor replay，用 entry id 去重，随后消费 live queue；每 30 秒发 heartbeat `:\n\n`，断线客户端可用上次 cursor 重连。见 `_router/_chat.py:2-21,49-74` 与 `_router/_session.py:810-978`。2.0 event 模型覆盖文本/思考/数据/工具 call/result/permission/HITL、token usage、hint/custom events；同一 `reply_id` 关联一轮，`block_id`/`tool_call_id` 关联块。见 agentscope-doc-building-blocks__message-and-event.md 第 10–21、247–300、416–589 行。

**输出。** 前端或其他 subscriber 获得可重放的事件帧并重建 Msg；多 tab、断线重连和后台工具完成可接续。官方 Agent Service 文档把 protocol middleware（如 AG-UI）与 OpenTelemetry observability middleware 放在可插拔 ASGI 层，agent-level middleware 负责 inbox/offload/state changes（第 762–842 行）。

**失败边界。** SSE 连接断开时必须保存 replay cursor；replay 日志有上限，不能承诺无限事件历史。bus 不可用时无法 fan-out/lock/wakeup。前端必须按事件序列重建，不把一次 `POST /chat` response 当结果。OpenTelemetry 是可装 middleware/导出的能力；当前 evidence 没有证明一个独立 SaaS trace backend、告警、retention、PII redaction 或成本控制已随 OSS 提供，这些是客户的运营边界。

### 5. Permission / HITL：工具何时暂停，谁能批准？

**PM 问题。** 读文件、写文件、shell、MCP 和外部执行怎样按风险请求用户确认，同时让生产任务可中断、可恢复？

**输入。** 工具调用 + `PermissionContext`（mode、working directories、allow/deny/ask rules）；用户确认 `UserConfirmResultEvent` 或 external execution result；可按 session 更新 permission mode。

**内部流程。** Permission engine 对每个 tool call 产生 allow/deny/ask；`RequireUserConfirmEvent` 将工具 call 置为 ASKING，session 状态持久化，前端通过 event stream 显示卡片；用户再 POST `/chat`，router 把 continuation 放入 message bus，由 WakeupDispatcher 重新进入同一 worker/session。`ChatService.interrupt` 对 running run 发 interrupt channel，对 parked HITL run 入 resume queue，Agent 清理 pending calls 并继续可恢复状态（`_service/_chat.py:679-737`）。当前 permission 类型与 context 位于 `src/agentscope/permission/_context.py`、`_engine.py`、`_types.py`、`_rule.py`、`_decision.py`；原件均已保存。

**输出。** allow 执行、deny 产生拒绝结果、ask 产生待确认事件；permission state change 以 CustomEvent 通知 UI。官方 permission 文档将决策明确为 allow/deny/ask，工具 call state 为 pending/asking/allowed/submitted/finished，结果 state 可 success/error/interrupted/denied（agentscope-doc-building-blocks__permission-system__overview.md）。

**失败边界。** 不要把 `bypass`/自动 accept 等模式当合规审批：它们会绕开人工确认。客户需补审批主体绑定、超时/拒绝策略、不可抵赖审计、危险工具 allowlist、外部执行回传认证和 session 级并发策略。当前 `X-User-ID` placeholder 也意味着“谁批准”必须由客户 auth 层保证。

### 6. Workspace / tool sandbox：工具实际在哪里跑？

**PM 问题。** Agent 的 shell、文件编辑、搜索、MCP、skills 如何隔离并跨 session 复用？

**输入。** `WorkspaceManager` + `IsolationPolicy` (`per_agent` 默认、`per_session`、`per_user`)，可选显式 `workspace_id`；backend 可选 Local、Bubblewrap、Docker、Apple Container、E2B、Daytona、OpenSandbox、K8s 等。

**内部流程。** Session creation 一次性计算并保存 workspace id；`WorkspaceManagerBase.assign_workspace_id` 在 `(user, agent)` 上加本进程锁并利用 storage/reservation 避免同一进程首次 session 重复 mint（但源码 docstring 明确跨 app workers 的首次 race 仍可能重复）。后续 `ChatService` 用 session 记录的 id `get_workspace`；manager cache hit 复用，miss 由 backend `initialize` 建立/重连并 TTL sweeper 回收。见 `app/workspace_manager/_base.py:18-161`、`_local_workspace_manager.py:58-136`、`_docker_workspace_manager.py:204-313`、`_e2b_workspace_manager.py` 及官方 workspace-manager。WorkspaceBase 提供固定布局：`.mcp`（agent/session 声明）、`skills/`（agent partition）、`sessions/`（context/tool-result offload）、`data/`；`list_tools` 默认绑定 Bash/Edit/Glob/Grep/Read/Write 到当前 backend，stateful MCP 实例按 agent+session 隔离。见 `workspace/_base.py:1-59,489-620`。

**输出。** Agent 收到 workspace-derived tools、MCP/skills、offload backend；每个用户/agent/session 可选择共享或隔离工作区。Docker/E2B/K8s 等可重新 attach，云 backend 更适合多 replica。

**失败边界/客户边界。** `LocalWorkspaceManager` 是 host filesystem、零 sandbox；Bubblewrap 仍共享 host network（官方 workspace-manager 第 21–31 行），所以产品必须把 Local 与“安全隔离”分开命名。Docker 需要 daemon、镜像/网络/资源策略；E2B/Daytona/OpenSandbox 要第三方账号与配额；K8s 要 Pod/PVC/namespace/registry。Local/Docker 这类 cache 状态在多副本间不共享，必须使用可跨节点 reattach 的 cloud/K8s backend。TTL eviction 会关闭空闲 MCP/container，客户需定义持久化与冷启动预算。workspace 的 archive/path 保护虽有源码检查，仍不能代替组织级网络 egress、secret scanning、数据脱敏和审计。

### 7. Background、schedule、team、RAG：生产旁路如何回到同一会话？

**PM 问题。** 长工具调用、定时任务、团队 worker、文档索引完成后，怎样回到用户正在看的 session？

**输入。** ToolOffloadMiddleware、APScheduler schedule、team leader/worker sessions、可选 KB manager/blob store/index worker。

**内部流程。** BackgroundTaskManager 管理本进程 watcher；完成结果写 session inbox 并 enqueue wakeup；Scheduler fire 也只写 `HintBlock` + wakeup，不直接调用 ChatService；WakeupDispatcher 在目标 session lock 下驱动 run。RAG upload 与 indexing 通过 message bus 的任务 channel 解耦，API 可以 embedded worker 或独立 worker。Lifespan 与官方服务文档第 809–828、830–842 行说明这些依赖。

**输出。** 同一 session event stream 收到 hint/tool result/team messages；KB 提供 upload/search/CRUD（只在启用 manager 后出现）；schedule 可跨重启由 storage record 重建。

**失败边界。** `enable_scheduler=True` 的 APScheduler jobstore 在内存，多个 replica 同时持有 timers 会每个 replica 触发一遍；官方要求只保留一个 timer owner，其余 `False`。BackgroundTaskManager 是 asyncio 进程级 registry，不能在进程重启后保留 watcher；RAG dedicated worker 必须与 API 使用同一 storage/bus/blob/vector config，否则会索引失败或数据不一致。schedule/team/KB 都要求与 user/resource access 绑定，不能只靠“事件到了”视为授权。

## Studio 研究：旧开发控制台的真实边界

### PM 问题 → 输入 → 流程 → 输出 → 失败边界

**定位。** Studio README 第 58–66 行把它称为“local visualization toolkit”，功能是 Projects/Runs、chatbot runtime visualization、OpenTelemetry traces、统计型 evaluation、Friday Copilot；overview 文档把实现写为 TypeScript/React/Vite/Tailwind + TRPC over HTTP/WebSocket + Node/Express + TypeORM/SQLite（raw/studio-docs__tutorial__en__tutorial__overview.md）。它是开发可见性/调试工具，不是现行多租户生产控制面。

- **输入：** Agent 通过 `POST /trpc/registerRun` 注册 run（id/project/name/timestamp/pid/status）；通过 `POST /trpc/pushMessage` 上报按 `replyId` 聚合的 Msg；通过 `POST /trpc/requestUserInput` 请求人工输入；Python 端以 Socket.IO `/python` namespace、`auth={"run_id": id}` 接收 `forwardUserInput`。见 raw/studio-docs__tutorial__en__develop__project.md 第 45–152、158–280 行。
- **流程：** Studio server 把 run/message/input request 写 SQLite/TypeORM，WebSocket 推送 UI；用户提交后 Web client → server → Agent WebSocket，Python agent 解除等待。Projects 包含多个 Runs；run UI 左侧按时间列 run，主区按 reply/message 展示，右侧看状态/统计/trace。
- **输出：** chatbot-style interaction history；content blocks 支持 text/thinking/image/audio/video/tool_use/tool_result；Trace 页面按 OpenTelemetry GenAI semantic conventions 展示 call tree、inputs/outputs/attributes/token usage；Studio 还声称 evaluation 与 Friday。
- **Trace 输入/边界：** 老 Studio 默认只收 trace，OTLP/gRPC `localhost:4317`、OTLP/HTTP `localhost:3000`；可收 AgentScope/LoongSuite/OpenTelemetry exporters。未在本次源码局部复核到 enterprise retention、RBAC、tenant boundary、PII policy、alerting、SLA 或审批审计。
- **失败边界：** 文档示例 user-input wait timeout 300 秒，run/input queue 是客户端进程内结构；Socket.IO 断开、server 重启和 SQLite/单机 Docker volume 是客户需自行处理的开发态边界。Studio README 的 archive notice 已覆盖未来维护承诺。

迁移结论：视频可以讲“Studio 的 Projects/Runs/OTLP/HITL 经验如何被 2.0 unified event + Agent Service Web UI 吸收”，不能继续把 `@agentscope/studio` 或旧 Studio server 作为最新企业控制台。2.0 官方文档的推荐入口是 Agent Service + `examples/web_ui`（agent-service 第 41–47 行）。

## 旧 Runtime 机制（仅作迁移对照，勿当当前实现）

### Runner / adapter / server / protocol

- `agentscope_runtime.engine.Runner` 在旧 commit `22072fd` 以 `start/stop` 设置健康状态，`stream_query` 为所有请求生成 session/user id（缺省时 UUID），发出 created → in_progress → adapter events → completed/failed，序列号由 `SequenceNumberGenerator` 加在每个 event。它按 `framework_type` 选择 text/AgentScope/LangGraph/Agno/Microsoft Agent Framework adapter，并用 `@trace(AGENT_STEP)` 包围 agent step。见 raw/runtime-src__agentscope_runtime__engine__runner.py 第 46–170、193–355 行。
- 旧 `AgentApp` 是 FastAPI server，默认装 A2A、Response API、AG-UI protocol adapters；主 endpoint 是 SSE，另有 `/health`、`/`、`/shutdown`、`/admin/shutdown`、`/admin/status`。`enable_stream_task` 可 POST `/process/task` 后轮询，但只存 final response，不存 intermediate events；无 Celery 时 task state 在内存、重启丢失。见 raw/runtime-src__agentscope_runtime__engine__app__agent_app.py 第 60–107、124–220、382–422、497–605、607–650、699–711 行。
- 旧协议 `AgentRequest/AgentResponse` 是 OpenAI-like JSON：input messages、generation params、tools、`session_id`，SSE 按 content `delta/index/msg_id` 传输；旧 cookbook 的 protocol spec 在 raw/runtime-cookbook__en__protocol.md 第 15–384 行。旧 adapters 在 `engine/deployers/adapter/{a2a,agui,responses}`，可作为外部协议迁移清单。

### 旧 sandbox / deployment / tracing 的企业边界

- 旧 README 曾宣称 hardened tool sandbox、AaaS streaming API、local/K8s/serverless scale 与 logs/traces（第 37–53 行），代码提供 Docker/gVisor/BoxLite、Filesystem/Browser/GUI/Mobile sandbox 与 FC/K8s/Knative/Kruise/ModelStudio/AgentRun deployers；这些是 archive 仓库的 historical claims。旧 README 第 281–301、533–545 行及旧 cookbook sandbox/deployment 文档已保存。
- 旧 AgentApp 的 CORS 是 `allow_origins=["*"]`（`agent_app.py:359-368`），admin shutdown/status 没有可见 auth dependency；请求里的 user/session id 也不是租户认证。故不能把旧 AgentApp 的“production-ready” badge 当企业安全结论。
- 旧 tracing wrapper/local logging 是开发/集成链路；旧 Studio 可接 OTLP，但 archive 状态意味着客户不应新建 Studio 依赖。迁移到 2.0 时要重建事件订阅、OTel middleware、retention/PII/alerts 与 auth policy。

## 企业宣称与开源实现的分界

1. **已见 OSS 实现/文档：** FastAPI app factory；Redis/SQL storage interfaces；Redis/in-memory message bus；per-user/agent/session workspace binding；Local/Docker/cloud/K8s workspace managers；MCP/skill/toolkit；permission engine 与 HITL event；session lock + replay/live SSE；background wakeup；optional RAG worker；schedule/team/channel routers；memory middleware；可注入 auth/protocol/OTel middleware。
2. **官方文档中的产品宣称但需要客户补生产条件：** “multi-tenant”依赖可信 auth middleware；“distributed”文档仍标 WIP，Local/Docker workspace 不能跨节点复用；“production-ready”不自动含 SLA、HA、告警、retention、PII redaction、密钥轮换、RBAC、rate limit、审计、灾备、成本控制或供应商承诺。
3. **第三方/云依赖：** Redis、SQL driver、Docker daemon、Kubernetes/registry、E2B/Daytona/OpenSandbox、LLM provider credentials、object/blob/vector store 都需要客户采购/运营；源码存在 connector 不等于服务由 AgentScope 托管。
4. **许可证与维护：** Runtime/Studio README/pyproject/package 均显示 Apache-2.0；archive notice 是维护状态判断，不是商业支持或 enterprise edition 合同。当前 main `agentscope` README 也显示 Apache-2.0（原文已保存）。

## 仍需 main 裁决/补证

- 选择视频要承诺的 2.0 版本：当前文档页面是 `/en/versions/2.0.10dev`，官方 index 警告 `/latest/` 指向开发文档，需主线最终决定 Stable 版本号并避免混用 1.x/2.x API。
- 企业认证、组织/项目 RBAC、审计/retention/PII、SLO/告警、密钥托管与成本治理均不应从 `X-User-ID` placeholder、可注入 middleware 或 OSS connector 推导为已交付能力。
- 当前 evidence 未覆盖完整 `examples/web_ui` 前端源码、Java Agent Service、全部 router schema、所有 cloud workspace implementation 与 OpenTelemetry exporter；本交接只确认了上述主流程和局部源文件，未运行集成测试。
- 旧 Runtime/Studio 的具体迁移 API 兼容表、旧 agent `init/query/shutdown` 到 2.0 `create_app/ChatService/event` 的代码迁移步骤仍需另行裁决；本交接仅提供证据边界，不把旧 API 作为推荐。

## 统计范围与验证声明

- 锁定 refs：Runtime `main → 22072fd7075ce0c6f43cb39509d6a14b0e60ddb5`；Studio `main → 20e7638273d3726732eb317b440bfa34e6694e17`；current AgentScope main Atom first entry `e4c1e074dee3f0f6cca28ca29e934c4ec0605354`。
- raw captures：Runtime API/ref/tree + README/协议/AgentApp/Runner/schema/service/tracing/deployment/sandbox docs；Studio API/ref + README/overview/quick-start/project/tracing/Friday/Docker docs；current AgentScope README、main Atom、`app/_app.py`、`_lifespan.py`、deps、chat/session routers、Chat/Session/Workspace/Access services、workspace manager base/local/docker/E2B/K8s、workspace base/local、permission/event modules，以及官方 2.0.10dev Agent Service/Workspace Manager/Workspace/Permission/Event/Memory/Tool/RAG Markdown。
- 未运行目标代码、未安装依赖、未 clone、未调用服务；未执行来源文件中的命令。由于 GitHub API core rate limit 在研究期间归零，current main 源码采用 Atom 锁 commit 后的 raw 已知路径与官方 docs 明确引用的路径核对；没有声称拿到 current main 的完整 tree。
