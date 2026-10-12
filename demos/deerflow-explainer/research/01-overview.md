# 全局定位、服务拓扑与部署

来源固定：bytedance/deer-flow @ 3f7a076972a927b4256df3e3c18b829186dd1355。以下路径均相对仓库根。

## 一句话

DeerFlow 2.0 是基于 LangGraph 的开源「super agent harness」：一个主智能体（lead agent）调度子智能体、长期记忆、沙箱代码执行和可扩展的技能/工具，所有状态按会话线程隔离；前端是 Next.js 聊天界面，另有飞书等 IM 渠道接入同一个智能体。生产与开发都只有一个后端进程（Gateway）承载 REST 与智能体运行时，nginx 是唯一对外入口。

## 局部清单

### 项目定位与受众（README.md 开头、docs/ARCHITECTURE.md §1）

- 解决的问题：让智能体不只会「搜索写报告」，而是拥有文件系统、记忆、技能、沙箱和子智能体，能做长流程、多步任务。
- 实现方式：名称展开为 Deep Exploration and Efficient Research Flow（README.md:11）；README「From Deep Research to Super Agent Harness」一节称，社区把 1.x 用到数据流水线、幻灯片、仪表盘、内容自动化等研究之外的场景，团队因此认为它是「harness」而非研究工具，于是重写。README 还写明「Use it as-is. Or tear it apart」，即既可直接用，也可二次开发。
- 能做的几类事（README 的 Core Features 小节标题与 skills/public/ 目录名可佐证）：研究与报告（deep-research、github-deep-research、systematic-literature-review、academic-paper-review、consulting-analysis）；内容生成（ppt-generation、podcast-generation、newsletter-generation、image-generation、music-generation、video-generation）；数据与图表（data-analysis、chart-visualization）；网页与前端（frontend-design、web-design-guidelines、vercel-deploy）；代码文档（code-documentation）；自举类（skill-creator、skill-reviewer、find-skills、bootstrap、claude-to-deerflow、surprise-me）。以上是 skills/public/ 下 22 个技能目录名，能力描述以各区域 agent 为准。
- 给谁用：README 的「Deployment Sizing」「Security Notice」表明主要对象是自托管的个人开发者、小团队和运维者；Security Notice 明说默认按「本地可信环境、仅 127.0.0.1 访问」设计。另有多用户登录、管理员、PAT（Personal Access Tokens）、可选细粒度授权（`authorization:`，默认关）等企业向能力。
- 边界：模型无关，要求 OpenAI 兼容接口即可；README「Recommended Models」建议长上下文（100k+）、推理、多模态、强工具调用；README 另推荐 Doubao-Seed-2.0-Code、DeepSeek v3.2、Kimi 2.5（这是营销推荐，非代码约束）。
- 依据：README.md:11-17、1282-1292、2568-2580、2959-2970；skills/ 目录；docs/ARCHITECTURE.md §1。

### 1.x → 2.0（README.md:17、1282）

- 变化：README 写明「2.0 is a ground-up rewrite. It shares no code with v1」；docs/ARCHITECTURE.md 同样说「shares no code with v1」。1.x 作为原 Deep Research 框架，保留在 `main-1.x` 分支（README 称 `1.x` 分支，链接为 `tree/main-1.x`），仍欢迎贡献，主线开发已转到 2.0。
- 定位对比（仅限 README 所述）：1.x = Deep Research 框架；2.0 = 「不再是需要自己拼装的框架，而是开箱即用的 harness」：自带文件系统、记忆、技能、沙箱感知执行、规划并派生子智能体。
- 本次未读到 1.x 的具体架构（多智能体节点划分等）：本提交不含 1.x 代码，README 也没描述，故未核实。
- 依据：README.md:17、1282-1292；docs/ARCHITECTURE.md 第 14 行附近。

### 仓库顶层分块（AGENTS.md「Repository Map」；tree.tsv 实际文件数）

| 目录/文件 | 作用 | 文件数（tree.tsv） |
|---|---|---|
| `backend/packages/harness/` | `deerflow-harness` 包（导入名 `deerflow.*`）：可发布的智能体框架——agents、sandbox、subagents、tools、mcp、skills、models、config、runtime、persistence、extensions、community 等 | 随 backend 合计 2189 |
| `backend/app/` | 未发布的应用层（导入名 `app.*`）：`gateway/`（FastAPI）、`channels/`（IM 渠道）、`scheduler/`、`mcp_tasks/`、`subagent_batches/` | |
| `backend/packages/extension-api/` | `deerflow-extension-api`：插件实现的、与宿主无关的公开契约 | |
| `frontend/` | Next.js 聊天与工作区界面，pnpm 管理 | 1230 |
| `skills/` | `public/`（入库，22 个）与 `custom/`（git 忽略） | 104 |
| `docker/` | compose 文件、nginx 配置、provisioner、lark-cli 相关镜像 | 20 |
| `deploy/helm/deer-flow/` | Helm Chart | 29 |
| `contracts/` | 跨组件 JSON 契约（run_event_stream、subagent_status、thread_goal、slash_skill、scheduled_task_errors 等，另有 skill_review 的四个 JSON Schema） | 11 |
| `examples/` | 扩展样例：agent-teams、bookmarks、example、jev-classify、jev-context、jev-screening | 42 |
| `scripts/` | Makefile 调用的编排脚本（serve.sh、deploy.sh、docker.sh、check.py、doctor.py、setup_wizard 等） | 50 |
| `docs/`、`tests/`、`.github/`、`.agent/` | 横切文档与设计笔记；根层测试（技能测试）；CI；冒烟测试用 agent 技能 | 102 / 6 / 24 / 18 |
| 根配置 | `config.example.yaml`（主配置模板）、`extensions_config.example.json`（MCP 与技能开关）、`Makefile`、`.env.example`、`LICENSE` | |

- harness / app 分工：app 依赖 deerflow，deerflow 不得导入 app；CI 由 `backend/tests/test_harness_boundary.py` 强制（docs/ARCHITECTURE.md §3）。harness 里包含 `deerflow.client.DeerFlowClient`（内嵌 Python 客户端），定时任务和测试用它驱动同一套运行生命周期。
- harness 子目录规模（tree.tsv 文件数）：agents 138、persistence 124、community 97、config 65、runtime 53、skills 36、tools 25、mcp 23、sandbox 23、extensions 20、subagents 20。
- 依据：AGENTS.md「Repository Map」；backend/AGENTS.md「Project Structure」；docs/ARCHITECTURE.md §3；tree.tsv 统计。

### 运行时服务与端口（docs/ARCHITECTURE.md §2、backend/AGENTS.md）

- 解决的问题：把浏览器、LangGraph SDK 客户端、REST 管理接口统一到一个入口。
- 服务清单：
  - nginx，`2026`：唯一对外入口。
  - Gateway，`8001`：FastAPI REST + 内嵌 LangGraph 兼容智能体运行时（入口 `app/gateway/app.py`，智能体入口 `deerflow.agents:make_lead_agent`）。
  - Frontend，`3000`：Next.js。
  - Provisioner，`8002`：可选，仅沙箱走 provisioner/K8s 模式时启动。
  - Redis：Docker 与 Helm 里有，用于 SSE 流桥（stream bridge）；本地 `make dev` 不起 Redis。
  - Postgres：仅 Helm 默认自带（见下）。
- 没有独立的 LangGraph Server 进程：`backend/langgraph.json` 只供 Studio/工具使用，docs 称「不是默认服务入口」。需要时在 `backend/` 下运行 `uv run langgraph dev --allow-blocking`。
- 网络约束：compose 里 nginx 发布为 `"${BIND_HOST:-127.0.0.1}:${PORT:-2026}:2026"`，默认只绑回环；Gateway 的 8001 不对外发布。本地 `make dev` 的 Gateway 与前端绑 `127.0.0.1`。`PORT` 只影响 Docker 入口，不改本地端口。
- 依据：docs/ARCHITECTURE.md §2；AGENTS.md「Service Topology」；backend/docs/ARCHITECTURE.md；docker/docker-compose.yaml:60-61；scripts/serve.sh:508-519；backend/langgraph.json。

### nginx 路由（docker/nginx/nginx.conf，本地版 nginx.local.conf，Helm 版 configmap-nginx.yaml）

- 实现方式（Docker 版，按 location）：
  - `/api/langgraph/` → `rewrite ^/api/langgraph/(.*) /api/$1 break;` 后转发 Gateway；关闭缓冲以支持 SSE；`client_max_body_size 20M`；`proxy_read_timeout 600s`。这一步让标准 LangGraph SDK 客户端不必有独立 LangGraph Server。
  - `/api/models`、`/api/memory`、`/api/mcp`、`/api/agents`、`/api/threads…`、`/docs`、`/redoc`、`/openapi.json`、`/health` → Gateway。
  - 上传类单独设体积：`/api/skills/install/upload` 101M；`/api/threads/{id}/uploads` 100M；`/api/projects/{id}/documents` 100M；这几处和 `/api/skills`、项目文档、`/api/threads` 等多处读超时为 600s。
  - `/api/threads/{id}/browser/stream` 有专门 location（实时浏览器流）。
  - `/api/sandboxes` → `provisioner:8002`（仅 Docker/Helm 版；本地版 grep 未见该 location）。
  - 其余 `/api/` → Gateway；`/` → 前端（`proxy_read_timeout 600s`）。
  - Docker 版用 `set $gateway_upstream gateway:8001` 在请求时解析服务名，避免上游重启后 IP 过期；容器启动时若内核无 IPv6，则用 sed 删掉 `listen [::]:2026`。
- 本地版：upstream 固定为 `127.0.0.1:8001` 与 `127.0.0.1:3000`，监听 `127.0.0.1:2026` 与 `[::1]:2026`。
- 依据：docker/nginx/nginx.conf:80-380；docker/nginx/nginx.local.conf:37-99；deploy/helm/deer-flow/templates/configmap-nginx.yaml:54-96。

### 三种起法各起什么

**本地（`make dev` / `make start`，scripts/serve.sh）**
- 起：uvicorn 跑 `app.gateway.app:app`（`127.0.0.1:8001`）、Next.js（`127.0.0.1:3000`）、nginx（用 `docker/nginx/nginx.local.conf`，`2026`）。日志在 `logs/{gateway,frontend,nginx}.log`。不起 Redis、不起 provisioner。
- dev 前端用 `pnpm run dev`；prod 前端先 `next build` 再 `run start`（`SKIP_FRONTEND_BUILD=1` 可复用上次构建，若无完整构建则立即失败）。
- 前置：`make check` 校验 Node 22+、pnpm、uv、nginx；`make install`；`make setup` 先生成最小 `config.yaml`。`make dev` 要求根目录有有效 `config.yaml`。
- Windows 需在 Git Bash 里运行。
- 依据：scripts/serve.sh:339-347,508-519；README.md:595-660；Makefile:151-171。

**Docker 开发（`make docker-start`，docker/docker-compose-dev.yaml）**
- 服务：redis、nginx、frontend（`pnpm run dev`，热更新）、gateway（`dev-entrypoint.sh`）、provisioner（可选）。是否起 provisioner 由 `config.yaml` 的 sandbox 段决定：`AioSandboxProvider` 且设置 `provisioner_url` 才起（README.md:455）。
- 需要 Docker Compose v2.24+（可选 `env_file` 语法）。

**Docker 生产（`make up`，scripts/deploy.sh + docker/docker-compose.yaml）**
- 固定服务 `redis frontend gateway nginx`，沙箱模式探测为 provisioner 时加 `provisioner`（deploy.sh:471-476）。以 `docker compose -p deer-flow … up -d --remove-orphans --wait --wait-timeout 180` 启动。
- 沙箱模式三选一（`detect_sandbox_mode()`）：local、aio（无 provisioner_url）、provisioner。aio 模式才追加 `docker-compose.dood.yaml`，把宿主 Docker socket 挂进 gateway；该文件自称给予容器「root-equivalent control of the host」。默认不挂 socket，也不挂 `~/.claude`、`~/.codex`（需另加 `docker-compose.cli-auth.yaml`）。
- 要点：gateway 的 `config.yaml` 只读挂载，`extensions_config.json` 读写挂载（因为 Gateway 会在运行时改它，如 MCP 开关与技能更新）；gateway 默认 `GATEWAY_WORKERS=1`；healthcheck 调 `/health/ready`，探测数据库、checkpointer、Redis 流桥、provisioner，其中 provisioner 结果只报告不判死；`stop_grace_period: 90s`。
- 必需环境变量：`BETTER_AUTH_SECRET`（前端会话安全）、`DEER_FLOW_INTERNAL_AUTH_TOKEN`（多 worker IM 渠道内部认证）、`DEER_FLOW_CREDENTIALS_KEY`（静态凭据加密，deploy.sh 会生成并存入 `$DEER_FLOW_HOME/.credentials_key`）。
- 资源参考（README「Deployment Sizing」）：本地评估起步 4 vCPU/8 GB，推荐 8/16；长期运行服务器起步 8 vCPU/16 GB/40 GB SSD，推荐 16/32；2 vCPU/4 GB 通常不够。
- 依据：docker/docker-compose.yaml:1-250；scripts/deploy.sh:463-531；docker/docker-compose.dood.yaml；README.md:430-441,444-565。

**Helm / Kubernetes（deploy/helm/deer-flow，Chart 版本 2.2.0-dev）**
- 把生产 compose 翻译成 K8s 资源。templates 含：gateway / frontend / nginx / provisioner 的 Deployment 与 Service，gateway 与 provisioner 的 PodDisruptionBudget，provisioner RBAC，postgres 与 redis 的 StatefulSet 与 Secret，home PVC，Ingress，config 与 nginx 的 ConfigMap。
- 默认值：gateway/frontend/nginx/provisioner 各 1 副本；`postgresql.enabled: true`、`redis.enabled: true`（可改接外部库）；`persistence.home` 10Gi、ReadWriteOnce；`ingress.enabled: true`；`skills.enabled: false`（技能目录默认是空的 emptyDir）；`provisioner.enabled: true`。
- 内置 `config`：沙箱用 `AioSandboxProvider` + `provisioner_url: http://provisioner:8002` + `provisioner_api_key: $PROVISIONER_API_KEY`，`replicas: 3`；`database.backend: postgres`；`stream_bridge.type: redis`；`run_ownership.heartbeat_enabled: true`；`run_events.backend: db`。
- 多副本：gateway `replicas > 1` 时 chart 导出 `DEER_FLOW_MULTI_INSTANCE=true`，启动门检查 Postgres、心跳、DB 运行事件、Redis 流桥等前提；IM 渠道、微信二维码登录、浏览器工具仍是单实例，启用渠道时副本须保持 1；多节点需 `ReadWriteMany` 卷。
- 发布：每个 `v*` 标签向 GHCR 发布三个镜像（`deer-flow-backend/-frontend/-provisioner`）和 OCI chart；README 称 Helm chart 自 2.1.0 起才有。
- 依据：deploy/helm/deer-flow/README.md、values.yaml（gateway 注释、config 段、persistence、ingress）、Chart.yaml、templates 文件清单。

### config.yaml 顶层段（config.example.yaml，`config_version: 59`）

文件位置：仓库根 `config.yaml`（git 忽略），由模板复制；可用 `DEER_FLOW_PROJECT_ROOT` 或 `DEER_FLOW_CONFIG_PATH` 指定位置，运行态数据默认在 `.deer-flow/`（`DEER_FLOW_HOME`）。字段值可写 `$ENV_VAR`。`make config-upgrade` 把新字段合并进旧文件；后端在下次读取时自动感知改动，无需重启。`use` 字段是 `包.模块:类或变量` 形式的路径。

| 段 | 管什么（据注释与默认值） |
|---|---|
| `config_version` | 模板版本，用于检测旧配置 |
| `log_level`、`logging` | 日志级别（默认 info）；`logging.enhance` 默认关，控制日志是否带 trace_id |
| `token_usage` | 记录并在界面显示 token 用量（默认开） |
| `token_budget` | 每次 run 的 token 硬上限，默认关；max_tokens 200000，警告阈值 0.8，硬停止 1.0 |
| `recursion_limit` / `max_recursion_limit` | LangGraph 超步上限，默认 100 / 1000；客户端可按请求覆盖但不得超过后者 |
| `models` | 模型列表（name、display_name、use、model、api_key、context_window、pricing 等） |
| `knowledge_base`、`tool_groups`、`tools` | 知识库开关（默认关，具体检索如 RAGFlow 配在 tools 里）；工具分组（web、file:read、file:write、bash）；具体工具条目 |
| `tool_search` | 按需检索延迟加载的 MCP 工具，默认关 |
| `tool_output` | 长工具输出外置，默认开，`externalize_min_chars: 12000` |
| `tool_artifacts`、`suggestions`、`input_polish` | 工具产物；追问建议（开，最多 3 条）；输入润色（开，4000 字上限） |
| `loop_detection` | 重复工具调用环检测，默认开，warn 3、hard 5、窗口 20 |
| `pii_redaction`、`read_before_write`、`safety_finish_reason` | 个人信息脱敏（默认关）；先读后写守卫（默认开）；模型安全终止原因识别（默认开） |
| `projects`、`uploads` | 项目指令 8192 字节上限等；上传限制 `max_files: 10`、`max_file_size: 50 MiB` |
| `sandbox` | 沙箱：默认 `LocalSandboxProvider`，`allow_host_bash: false`；可换 AIO（Docker）、provisioner/K8s、BoxLite 等；含输出截断上限 bash 20000 / read_file 50000 / ls 20000 字符 |
| `subagent_runtime`、`subagent_batches` | 子智能体并发（`max_running: 3`、`max_queued: 64`、排队超时 300s）；持久化批处理（默认关） |
| `verification`、`skills`、`skill_scan`、`skill_evolution` | 工具回执（默认开）；技能目录；技能安全扫描；智能体自写技能（默认关） |
| `title`、`task_continuity`、`summarization`、`memory` | 标题生成（6 词/60 字）；任务笔记（默认关）；上下文压缩（默认开，token 触发 32000）；长期记忆（默认开，`manager_class: deermem`，`mode: middleware`） |
| `blob_storage`、`agents_api` | 对象存储抽象（默认关）；自定义智能体管理 API（默认关） |
| `database`、`run_events`、`agent_storage` | 持久化：默认 sqlite（`.deer-flow/data`）；run 事件默认 memory；自定义智能体存储默认 file |
| `scheduler`、`mcp_tasks` | 定时任务（默认关，`tool_enabled: false`）；长任务 MCP 调度（默认关） |
| `deployment`、`run_ownership` | 多实例声明（默认 false）；run 租约（`lease_seconds: 30`、`grace_seconds: 10`、`heartbeat_enabled: false`） |
| 注释态可选段 | `stream_bridge`（默认 memory，Docker 自动用 Redis）、`channel_connections`、`channels`（IM）、`guardrails`、`typesafe`、`authorization`、`circuit_breaker`、`llm_call`、`auth`、`plugins`、`extensions`、`lead_prompt_overlay` |

- 另有 `extensions_config.json`（模板 `extensions_config.example.json`）：MCP 服务器与技能开关，可经 Gateway API 在运行时改写；会引入代码导入的 `plugins:` 只允许放在 `config.yaml`，不放这个可被 API 写的文件。
- 依据：config.example.yaml 对应行（config_version:23，log_level:46，token_budget:105，models:156，sandbox:1700，subagent_runtime:1969，summarization:2190，memory:2301，database:2681，scheduler:2833，deployment:2892，run_ownership:2917，stream_bridge:2935 起）；docs/ARCHITECTURE.md §5；backend/harness/config/stream_bridge_config.py（默认 `memory`）。

### Makefile 主要目标（Makefile:26-245）

- 引导：`setup`（交互向导）、`doctor`、`support-bundle`、`config`、`config-upgrade`、`check`、`install`、`setup-sandbox`。
- 扩展：`extension-install/upgrade/list/enable/disable/remove`，参数 `SOURCE=`、`NAME=`。
- 本地服务：`dev`、`start`、`dev-daemon`、`start-daemon`、`nginx`、`stop`；`dev-multi/-check/-down`（本机起两个 Gateway，共享 Postgres 与 Redis 的 Docker 容器）；`clean`（删 `backend/.deer-flow` 里的运行数据与日志，并先检查数据是否在使用）。
- Docker 开发：`docker-init`、`docker-start`、`docker-stop`、`docker-logs[-frontend|-gateway|-redis]`。
- Docker 生产：`up`、`down`、`prod-logs`。
- 诊断类：`check-agent-guidance`、`detect-thread-boundaries`、`detect-blocking-io`。
- `backend/Makefile` 另有 install、dev、gateway、test、test-live、test-blocking-io、test-shard、lint、format、migrate-rev。
- 所有脚本经 `bash` 显式调用，不依赖可执行位。

### 技术栈与主要依赖

- 后端：Python ≥3.12，uv 工作区（members：`packages/harness`、`packages/extension-api`）；根包 `deer-flow` 版本 `2.2.0-dev`，harness 包版本 `2.1.0`（pyproject 里写的是 2.1.0，与 Chart/frontend 的 2.2.0-dev 不同，见出入）。
- 应用层依赖（backend/pyproject.toml）：fastapi、uvicorn、starlette（>=1.3.1,<2，因直接用其私有函数而显式约束）、httpx、sse-starlette、websockets（锁 16.0）、bcrypt、pyjwt、IM SDK（lark-oapi、slack-sdk、python-telegram-bot、dingtalk-stream、wecom-aibot-python-sdk）。可选 extras：postgres、redis、discord、buzz、monocle、ollama、browser、memory-zh。
- harness 依赖（packages/harness/pyproject.toml）：langchain ≥1.3、langgraph ≥1.2.9,<1.3、langgraph-api、langgraph-cli、langchain-openai/anthropic/deepseek/google-genai、langchain-mcp-adapters、langfuse、kubernetes、agent-sandbox、e2b-code-interpreter、sqlalchemy[asyncio]+alembic+aiosqlite、langgraph-checkpoint-sqlite、markitdown、tavily-python、firecrawl-py、exa-py、ddgs、duckdb、croniter、cryptography、tiktoken。可选 extras 含 postgres、redis、boxlite、tenki、opensandbox、pymupdf、tui；命令行入口 `deerflow = deerflow.tui.cli:main`。
- 前端：Node 22+、pnpm 10.26.2；next ^16.3.8、react ^19、TypeScript、Tailwind v4、`@langchain/langgraph-sdk` ^1.5.3、TanStack Query、Radix UI、CodeMirror、`@xyflow/react`、streamdown、gsap/motion、nextra（文档站）；测试用 rstest 与 Playwright。
- 依据：backend/pyproject.toml；backend/packages/harness/pyproject.toml；frontend/package.json；docs/ARCHITECTURE.md §4。

### 许可证

MIT，版权为 2025 Bytedance Ltd. and/or its affiliates 与 2025-2026 DeerFlow Authors（LICENSE；README 徽章指向 LICENSE）。

## 端到端流程：一次浏览器对话请求怎样走通

1. 用户在浏览器打开 `http://localhost:2026`，nginx 把非 `/api` 路径转给前端（3000）。
2. 前端通过 LangGraph SDK 请求 `/api/langgraph/...`（默认 `NEXT_PUBLIC_LANGGRAPH_BASE_URL=/api/langgraph`，`NEXT_PUBLIC_BACKEND_BASE_URL` 为空）。
3. nginx 把 `/api/langgraph/*` 改写成 `/api/*`，转给 Gateway（8001），关闭代理缓冲以保留 SSE。
4. Gateway 做认证、CSRF、用户与线程归属检查，再由 `RunManager` 创建 run。
5. `run_agent()` 调用 `make_lead_agent()` 组装主智能体，套上中间件链（线程目录、上传、沙箱、摘要、标题、待办、识图、澄清等）后运行。
6. 运行中的事件经 `StreamBridge` 推给 SSE：本地默认 memory，Docker/Helm 用 Redis Streams；断线可按 `Last-Event-ID` 重放，窗口外会收到 `gap` 事件。
7. 需要执行代码时，主智能体经沙箱提供者执行：本地、Docker AIO 容器，或经 provisioner 在 K8s 里建 Pod。
8. 对话数据落在 `database.backend`（默认 sqlite，Helm 默认 postgres）；线程文件在 `.deer-flow/threads/{thread_id}/`。
9. IM 渠道（飞书、Slack、Telegram 等）和定时任务走同一个 Gateway 运行生命周期，不另起一套智能体。

## 给产品经理的要点

1. 只有一个后端进程：智能体运行时嵌在 Gateway 里，没有单独的 LangGraph Server。对外只有 nginx 的 2026 一个端口，默认只绑 127.0.0.1。要把端口开给局域网或公网，必须自己设 `BIND_HOST`，并在前面加 TLS 与认证；官方安全声明说默认按本地可信环境设计。
2. 三种起法的差别是「配套多少」。本地：Gateway + 前端 + nginx，数据 sqlite、流桥 memory。Docker：另加 Redis。Helm：另加 Postgres 与 Redis，沙箱默认走 provisioner 在 K8s 里按需起 Pod。是否支持多副本取决于是否满足 Postgres、Redis、心跳等前提。
3. 默认沙箱是本机直接执行（`LocalSandboxProvider`），宿主 bash 默认关闭（`allow_host_bash: false`）；生产隔离需要改成 AIO 或 provisioner。AIO 纯 Docker 模式要把宿主 Docker socket 挂给 Gateway，文件里自述等同于宿主 root 权限。
4. 大量能力是「默认关」：定时任务、长任务 MCP、技能自演进、PII 脱敏、token 预算、知识库、细粒度授权、guardrails。配置版本号已到 59，说明配置面扩张很快，新旧配置靠 `make config-upgrade` 合并。
5. Gateway 管理员权限等同于主机代码执行（可注册 stdio MCP 服务器，默认只允许 `npx`、`uvx`）；README 明说这是纵深防御而非边界。
6. 2.0 与 1.x 无代码继承；1.x 留在独立分支。判断「是否沿用旧 Deep Research 工作流」时，应按「全新 harness，研究只是 deep-research 技能之一」理解。

## 文档与源码的出入 / 未核实

- 服务数量：docs/ARCHITECTURE.md 与 AGENTS.md 说「四个协作服务」，表里没算 Redis；而 Docker/Helm 实际都起了 Redis（compose 的 gateway 还 `depends_on: redis: service_healthy`，且 Redis 不可达时 gateway 被判 unhealthy）。以 compose 文件为准。
- IM 渠道清单：AGENTS.md 写飞书、Slack、Telegram、Discord、钉钉；backend/app/channels/ 实际还有 buzz、github、qq、wechat、wecom 等文件，以目录为准（渠道细节归网关区域 agent）。
- 扩展样例：AGENTS.md 与 docs 写 `deerflow-extension-{example,bookmarks,agent-teams}`，tree.tsv 另有 jev-classify、jev-context、jev-screening 三个。
- 中间件数量：backend/README.md 称「9 middlewares」，表中含 MemoryMiddleware；docs/ARCHITECTURE.md 的清单只列 8 个、不含 Memory，顺序也不同（TitleMiddleware 与 TodoList 先后相反）。具体顺序以主智能体区域 agent 读源码的结论为准，这里未核实。
- 版本号：backend/pyproject.toml 根包与 frontend、Chart 均为 `2.2.0-dev`，`packages/harness/pyproject.toml` 为 `2.1.0`；docs 称「release 版本必须在 backend/pyproject.toml、frontend/package.json、Chart.yaml 一致」，未提 harness 包，未核实是否有意。
- 前面「README 称 1.x 分支」：文字写 `1.x` 分支，链接实际是 `main-1.x`。
- 未核实：1.x 的具体架构；`scripts/deploy.sh` 与 `scripts/docker.sh` 的完整流程（只读了服务选择与 DooD 叠加段）；`docker-compose-dev.yaml` 里 gateway 的端口与卷细节；`.env.example` 的变量全集；Helm 各模板的实际渲染结果（只读了 values、README、模板文件名与 nginx ConfigMap 的 location 行）；README 称 Docker 生产镜像的构建参数（UV_EXTRAS 等）的默认影响；CHANGELOG 里 2.0 的发布时间（未读，README 只说 2026-02-28 登上 GitHub Trending 第一）。
