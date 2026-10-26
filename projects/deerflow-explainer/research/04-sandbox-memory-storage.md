# 沙箱、文件系统、产物、持久化与记忆

来源：bytedance/deer-flow @ 3f7a076972a927b4256df3e3c18b829186dd1355。路径均相对仓库根；`H` = `backend/packages/harness/deerflow`。

## 一句话

每个用户的每个线程有一块固定的磁盘目录（workspace / uploads / outputs），agent 通过一个可替换的沙箱执行命令和读写文件；沙箱按"用户+线程"复用，空闲 10 分钟回收。线程、运行、用户存数据库，对话状态存检查点，长期记忆由后台 LLM 提炼成"摘要+事实"存成文件，下次对话开头一次性注入。

## 局部清单

### Sandbox / SandboxProvider（沙箱接口与提供方）
- 解决的问题：让 agent 在隔离程度不同的环境里执行命令、读写文件，上层代码不关心底层是本机、容器还是云虚拟机。
- 实现方式：
  - `Sandbox` 抽象方法：`execute_command(command, env=None)`、`execute_command_in_scope` / `release_command_scope`（按执行范围隔离 shell 会话，默认直通）、`read_file`、`download_file`、`write_file(path, content, append)`、`update_file`（二进制）、`list_dir(path, max_depth=2)`、`glob`、`grep`。
  - `SandboxProvider` 方法：`acquire` / `acquire_async`、`get`、`get_scoped`、`release`、`reset`、`sync_agent_skills`，另有一组网络策略审批方法（`consume_network_policy_events`、`decide_network_policy_request` 等）。
  - 提供方由 `sandbox.use` 的类路径决定，一次只用一种：
    1. `LocalSandboxProvider`：在网关所在主机直接执行。沙箱 id 为 `local:{user_id}:{thread_id}`，把 `/mnt/user-data/*` 与 `/mnt/acp-workspace` 映射到该线程的主机目录；LRU 缓存默认 256 个。
    2. `AioSandboxProvider`（`community/aio_sandbox`）：Docker（或 Apple Container）容器，默认镜像 `all-in-one-sandbox:latest`，端口 8080，容器前缀 `deer-flow-sandbox`；配了 `provisioner_url` 则改走 K8s Pod。
    3. 其他社区提供方：`E2BSandboxProvider`（E2B 云微虚拟机）、`OpenSandboxProvider`、`BoxliteProvider`（无守护进程微虚拟机）、`TenkiSandboxProvider`（云微虚拟机）。
  - 差别：本机提供方不是安全边界；AIO 有容器隔离；E2B/Tenki 不能把网关目录挂进去，靠上传同步，输出需写到 `/mnt/user-data/outputs`（E2B 映射到 `home_dir/outputs/`）。
- 关键数据与默认值：`sandbox.allow_host_bash` 默认 `false`；`bash_command_timeout` 默认 600 秒；输出截断 bash 20000 字符（取头尾）、read_file 50000、ls 20000，0 表示不截断。
- 配置开关：`sandbox.use`、`allow_host_bash`、`image`、`port`、`container_prefix`、`replicas`、`idle_timeout`、`mounts[]`、`environment`、`thread_data_mounts`、`bash_command_timeout`、`*_output_max_chars`。
- 边界与失败行为：本机提供方下 `bash` 默认被禁用，调用返回"Host bash execution is disabled…"，且 bash 子 agent 也禁用；要 bash 应换 AIO。本机沙箱构造时清洗继承的凭据类环境变量（`env_policy.py`）。
- 依据：`H/sandbox/sandbox.py`、`sandbox_provider.py`、`security.py`、`H/config/sandbox_config.py`、`H/sandbox/AGENTS.md`、`backend/docs/CONFIGURATION.md` §Sandbox。

### 线程目录与虚拟路径（Virtual Path System）
- 解决的问题：agent 只看到固定的虚拟路径，换沙箱类型不改提示词和工具。
- 实现方式：agent 看到 `/mnt/user-data/{workspace,uploads,outputs}`、`/mnt/skills`（技能），以及 ACP 工作区 `/mnt/acp-workspace`（容器内只读）。主机上是 `{base}/users/{user_id}/threads/{thread_id}/user-data/{workspace,uploads,outputs}`，`base` 取构造参数 → 环境变量 `DEER_FLOW_HOME` → `{项目根}/.deer-flow`。本机提供方在 acquire 时建路径映射；AIO 把这些目录用卷挂到容器内同名路径。工具层另有 `replace_virtual_path()` 做兜底翻译与校验，路径含 `..` 抛"Access denied: path traversal detected"。`ensure_thread_dirs` 建目录并 `chmod 0o777`，使不同 UID 的容器可写。技能不在线程目录里：普通沙箱读 `.deer-flow/skills_view/public/` 与 `users/{uid}/skills_view/{custom,legacy,integrations}/`；给 lead agent 指定了技能白名单时读线程内 `skills_view/`。
- 依据：`H/config/paths.py`（`VIRTUAL_PATH_PREFIX`、`thread_dir`、`ensure_thread_dirs`）、`H/sandbox/AGENTS.md` §Virtual Path System、`H/community/aio_sandbox/aio_sandbox_provider.py:_get_thread_mounts`。

### 沙箱生命周期（SandboxMiddleware + 租约 + 暖池）
- 解决的问题：同一线程的多轮对话复用同一个沙箱，避免每轮冷启动；多个并发执行（主 agent、子 agent、上传请求）不互相误释放。
- 实现方式：
  1. 创建：`SandboxMiddleware` 默认 `lazy_init=True`，第一次调用沙箱工具才 `acquire(thread_id, user_id)`；设为 False 则 agent 开始时就获取。获取前过 `sandbox:execute` 授权检查，被拒返回"sandbox execution is not permitted for your role"的工具错误。
  2. 标识：AIO 容器 id 由 `derive_sandbox_scope_token(user_id, thread_id)` 确定（SHA-256 取 16 位十六进制），同一用户线程重复 acquire 得到同一个容器；先查进程内、再查暖池、再发现已有容器，都没有才创建。
  3. 复用/回收：一轮结束 `after_agent` 释放；`SandboxLeaseManager` 记录并发持有者，最后一个持有者释放时才真正 `release`。AIO 的 `release` 把健康容器放进暖池；暖池条目空闲超过 `idle_timeout`（默认 600 秒，0 表示不回收；检查间隔 60 秒）被停掉，容量上限 `replicas`（默认 3）满了淘汰最老的暖池条目（仅淘汰暖池，不动正在用的）。
  4. 异常隔离：隐式 shell 或会话创建结果不明的容器被写入 `{DEER_FLOW_HOME}/sandbox-quarantine` 后销毁重建，不进暖池。
  5. 多网关：`sandbox.ownership.type` 为 `memory`（默认，仅单实例）或 `redis`；租约回答"谁有权回收这个容器"，不限制谁能用。续租间隔默认 30 秒、TTL 倍数 4、键前缀 `deerflow:sandbox:owner`。
- 关键数据与默认值：见上；并发子 agent 超过 9 时容器的 `MAX_SHELL_SESSIONS` 设为 `max_running + 1`（镜像默认 10）。fork 出来的线程恢复的沙箱状态不会被释放。
- 配置开关：`sandbox.idle_timeout`、`replicas`、`ownership.*`、`subagent_runtime.max_running`；E2B 另有 `overflow_policy`（默认 wait）、`acquire_timeout`（30）、`burst_limit`（0）。
- 边界与失败行为：AIO 所有权无法发布时不交付沙箱，抛 `OwnershipBackendError`；续租时存储不可答视为"未知"继续保留。E2B 的 `wait` 策略超时则该轮失败且不自动重试。
- 依据：`H/sandbox/middleware.py`、`H/sandbox/lease.py`、`H/community/warm_pool_lifecycle.py`（见 AGENTS 对常量的描述）、`H/community/aio_sandbox/aio_sandbox_provider.py`、`ownership/`、`H/config/sandbox_config.py`。

### 沙箱工具（bash / ls / glob / grep / read_file / write_file / str_replace）
- 解决的问题：把"文件与命令"交给模型，同时限住范围。
- 实现方式：工具在 `H/sandbox/tools.py`，先用虚拟路径校验（只允许 `/mnt/user-data` 等白名单），再调用当前沙箱的同名方法。`ls` 树形最多 2 层，远程列目录在 500 条上限前先剪枝；`glob`、`grep` 有结果上限。本机提供方下 bash 命令还会做 cwd 与路径参数检查。`ReadBeforeWriteMiddleware`（`read_before_write.enabled` 默认 true）要求修改已有文件前先读过当前版本（以文件 sha256 作标记，写入后旧标记作废），防止重复追加。命令超时返回 Exit Code 124，不重放结果不明的命令。
- 依据：`H/sandbox/tools.py`、`H/agents/middlewares/read_before_write_middleware.py`、`H/config/read_before_write_config.py`、`H/sandbox/AGENTS.md` §Sandbox Tools。

### 出网限制（sandbox.network）与代理侧车（sandbox-network-proxy）
- 解决的问题：容器里的代码默认能随意联网；运营者想禁网或只放行包管理源。
- 实现方式：仅本地 Docker 的 AIO 支持。`mode` 三档：`open`（默认，兼容现状，普通 Docker 出网）、`isolated`（每个沙箱一个内部网桥，禁止一切出站）、`allowlist`（同样的内部网桥 + 一个可信侧车，只支持 HTTP 与 HTTPS CONNECT，校验 CONNECT 目标与 TLS SNI，不解密）。`allow_domains` 接受精确域名与 `*.example.com`，拒绝 URL、端口、单独 `*`。侧车拒绝解析到回环、私网、链路本地、云元数据地址的目标。`approval: prompt` 时被拒域名在对话里出现人工输入卡，三个选项：拒绝、临时允许（`temporary_grant_ttl` 默认 300 秒）、本沙箱内一直允许；批准后不自动重放失败命令；自主、定时、webhook 运行和子 agent 一律自动拒绝。侧车镜像默认 `ghcr.io/bytedance/deer-flow-sandbox-network-proxy:latest`，由 `docker/sandbox-network-proxy/Dockerfile` 构建（Python Alpine，以 65532 用户运行 `network_proxy.py`）。
- 关键数据与默认值：容器加固默认 `--cap-drop=ALL` 仅保留 CHOWN/FOWNER/SETUID/SETGID/DAC_OVERRIDE，`no-new-privileges`；`DEER_FLOW_SANDBOX_MEMORY` 默认 `2g`、`DEER_FLOW_SANDBOX_CPUS` 默认 `2`、`DEER_FLOW_SANDBOX_PIDS_LIMIT` 默认 `512`；seccomp 默认 unconfined（为让镜像里的 Chromium 能启动，`DEER_FLOW_SANDBOX_SECCOMP_UNCONFINED=0` 可关）；沙箱端口默认只绑回环地址，因为沙箱 HTTP API 无认证。
- 边界与失败行为：受限模式要求本地 Docker 且 Engine ≥ 28，在 Apple Container、provisioner 模式、旧引擎上直接失败而非降级；HTTPS 下无法看到内层 Host，恶意客户端可能连到同一放行端点上的其他虚拟主机，要严格隔离应用 `isolated`；SSH、原始 TCP/UDP 不可用。
- 依据：`backend/docs/CONFIGURATION.md` §Sandbox network policy / §hardening、`H/config/sandbox_config.py:SandboxNetworkConfig`、`H/community/aio_sandbox/network_proxy.py`、`docker/sandbox-network-proxy/Dockerfile`。

### Provisioner（docker/provisioner，K8s 沙箱 Pod 管理服务）
- 解决的问题：网关不想拿宿主 Docker 套接字（等于宿主 root），改由独立服务在 K8s 里创建沙箱 Pod。
- 实现方式：FastAPI 服务（端口 8002）。网关 `POST /api/sandboxes`（`sandbox_id`、`thread_id`、可选 `user_id`、技能容器路径）→ 在 `deer-flow` 命名空间建 Pod + Service；Pod 挂载技能目录（只读）和 `/mnt/user-data`（读写）；`GET` 查状态（Pending/Running/Succeeded/Failed/Unknown/NotFound），`DELETE` 删 Pod 与 Service，`GET /api/sandboxes` 列表，`GET /api/capabilities`。创建是幂等的。Service 默认 NodePort，网关在集群内时设 `SANDBOX_SERVICE_TYPE=ClusterIP`。
- 关键数据与默认值：Pod 资源请求 cpu 100m / 内存 256Mi / 临时存储 500Mi；上限 cpu 1000m / 内存 1Gi / 临时存储 500Mi；就绪探针初始延迟 5 秒、周期 5 秒，存活探针 10/10 秒。卷：`THREADS_HOST_PATH` 主机路径，或设 `USERDATA_PVC_NAME` 用 PVC（subPath `deer-flow/users/{user_id}/threads/{thread_id}/user-data`）。
- 配置开关：provisioner 环境变量 `K8S_NAMESPACE`（默认 `deer-flow`）、`SANDBOX_IMAGE`、`SKILLS_PVC_NAME`、`USERDATA_PVC_NAME`、`NODE_HOST`、`K8S_API_SERVER`；网关侧 `sandbox.provisioner_url`、`provisioner_api_key`、`thread_data_mounts`。
- 边界与失败行为：远程/provisioner 后端默认假定网关与沙箱不是同一份存储，上传时额外把文件同步进沙箱；只有确认两边挂的是同一存储才设 `thread_data_mounts: true`，设错会让新上传文件在沙箱内不可见。已有容量不足的 Pod 收到创建请求时返回 409，不会被删。提供者的 Docker 开发模式只有配置了 provisioner 才启动该服务。
- 依据：`docker/provisioner/README.md`、`docker/provisioner/app.py`（资源与探针段）、`backend/docs/CONFIGURATION.md`。

### 上传（uploads）与文档转 Markdown
- 解决的问题：让用户把文件带进线程，agent 能按虚拟路径读，且大文档能快速定位。
- 实现方式：
  1. `POST /api/threads/{thread_id}/uploads`（multipart）→ `ThreadUploadIngestionService` 先写暂存文件（`.upload-*.part`，保留名，使用该名上传会 400；陈旧暂存文件超过 24 小时被清理），再落到线程 `uploads/`；文件名规范化、同名加后缀去重，路径不跟随符号链接；整批先检查保留名后才写。
  2. 非本地沙箱默认额外同步进 `/mnt/user-data/uploads/*`；被 `sandbox:execute` 拒绝的调用者只存盘、不同步。
  3. 可选转换：`uploads.auto_convert_documents`（默认 false）开启后，对 `.pdf .ppt .pptx .xls .xlsx .doc .docx` 转成同目录的 `.md`（名被占用则加 `_N`）。PDF 先试 pymupdf4llm（若已安装），输出过稀（每页字符少于 50，或页数未知时总数不足 200）判为扫描件，回退 MarkItDown；其余格式用 MarkItDown。大于 1 MB 的文件放线程池转换。转换文件的归属记录存在沙箱挂载目录之外。
  4. 下一条消息里，`UploadsMiddleware` 把"当前消息附带的文件"以 `<current_uploads>` 块塞到最后一条用户消息前：文件名、大小、虚拟路径，以及文档大纲（最多 `MAX_OUTLINE_ENTRIES=50` 条，加最多 5 行/2000 字符的预览）。往期上传不重复注入，agent 用 `list_uploaded_files` 查（默认 20 条，每页最多 100，游标分页）。
- 关键数据与默认值：`max_files` 10、`max_file_size` 50 MiB、`max_total_size` 100 MiB；`GET .../uploads/limits` 把限制给前端；单个文件名上限 255 字节。
- 配置开关：`uploads.max_files`、`max_file_size`、`max_total_size`、`auto_convert_documents`；`sandbox.thread_data_mounts`。
- 边界与失败行为：不安全文件名被跳过并在响应里列出（`skipped_files`，此时 `success=false`）；超数量 413。默认不转换是为了不在网关主机上解析不受信的 Office/PDF。
- 依据：`backend/app/gateway/routers/uploads.py`、`H/uploads/manager.py`、`H/utils/file_conversion.py`、`H/utils/file_outline.py`、`H/agents/middlewares/uploads_middleware.py`、`backend/docs/FILE_UPLOAD.md`。

### 产物（outputs + present_files + artifacts 路由）
- 解决的问题：agent 生成的文件要让用户看到、下载，并确认"生成了就交付了"。
- 实现方式：agent 把成品放到 `/mnt/user-data/outputs/`，调用 `present_files(filepaths)`；工具只接受 outputs 目录下的路径（虚拟路径或主机路径都会规范化为虚拟路径），把路径并入状态里的 `artifacts`，由 reducer 去重。前端通过 `GET /api/threads/{thread_id}/artifacts/{path}` 取文件（加 `?download=true` 强制下载）。文本类内联显示；HTML、XHTML、SVG、XML 这类"活动内容"总是作为附件下载，且带 `X-Content-Type-Options: nosniff`；支持 Range。路由也支持对文本产物按 sha256 做带版本校验的就地编辑，并同步回沙箱。
- 关键数据与默认值：运行结束时 worker 对比"运行前/后"的 outputs 快照；若本轮创建或修改了输出文件却没有任何 `present_files` 路径覆盖它们，运行以错误结束，错误文本为 "Artifact delivery incomplete: no produced output artifact was presented"，并写入 `run.delivery` 事件。工具结果外存目录（默认 `.tool-results`）、`.git`、`.venv`、`.cache`、`.next` 等不计入。
- 边界与失败行为：交付回执写失败时重试，仍失败则用 "terminal delivery receipt could not be persisted" 判错。
- 依据：`H/tools/builtins/present_file_tool.py`、`backend/app/gateway/routers/artifacts.py`、`H/runtime/runs/worker.py`（`_delivery_content_with_outputs`、`_delivery_error`）。

### workspace_changes（本轮工作区改动记录）
- 解决的问题：让用户在一轮结束后看到"这轮改了哪些文件、改了什么"。
- 实现方式：运行开始前对线程的 `workspace` 与 `outputs` 两个根各扫一次快照；运行结束再扫一次元数据，找出变化路径，只对这些路径再读文本，用 `difflib.unified_diff` 生成差异，写成运行事件（类型常量 `WORKSPACE_CHANGES_EVENT_TYPE`），摘要形如 "N files changed +A -D"。无改动则不记。网关用 `get_workspace_changes_response(event_store, thread_id, run_id, include_files, include_diff)` 读取最近一条。
- 关键数据与默认值：状态 `created / modified / deleted / symlink_created`；`WorkspaceChangeLimits`：`max_files` 200、`max_scanned_files` 2000、`max_file_bytes_for_diff` 256 KiB、`max_total_diff_bytes` 1 MiB。不给差异的原因枚举：`binary / large / sensitive / truncated / symlink`。敏感路径名模式包括 `.env`、`.env.*`、`*api_key*`、`*.key`、`*.pem`、`*credential*`、`*password*`、`*secret*`、`*token*` 等，只记哈希与大小，不记内容。
- 依据：`H/workspace_changes/{types,recorder,scanner,diff,api}.py`、`H/runtime/runs/worker.py:1151,1689`。

### 持久化（database 统一配置）
- 解决的问题：线程、运行、用户和对话状态在重启后仍在；多实例时共享。
- 实现方式：一个 `database.backend` 同时决定 LangGraph 检查点与应用数据：`memory`（默认，进程内，重启即丢）、`sqlite`（单机，检查点与应用数据共用 `{sqlite_dir}/deerflow.db`，WAL 模式）、`postgres`（多节点，同一 URL、两个独立连接池）。应用表（SQLAlchemy + Alembic 迁移，见 `persistence/migrations/versions` 0001–0031…）包括：`threads_meta`（thread_id、user_id、assistant_id、project_id、display_name、status 默认 idle、元数据 JSON）、`runs`（状态、模型名、多任务策略默认 reject、token 统计、租约字段、取消请求、change_seq）、`users`（email、password_hash、system_role、OAuth、disabled…）、`user_preferences`、`feedback`、`projects`、`project_documents`、计划任务、MCP 任务、渠道连接等。检查点是 LangGraph 的 checkpointer；store 随 `database` 配置（同样 memory/sqlite/postgres）；旧的独立 `checkpointer` 配置段已标"deprecated"，存在时优先。运行事件（消息与执行轨迹）另有 `run_events.backend`：`memory`（默认）/`db`/`jsonl`，`max_trace_content` 默认 10240 字节，`track_token_usage` 默认 true。
- 关键数据与默认值：`sqlite_dir` 默认 `.deer-flow/data`；postgres `pool_size` 5、`pool_recycle` 300 秒、`command_timeout` 30 秒；`checkpoint_channel_mode` 默认 `full`，可选 `delta`（消息以增量存储，快照频率 `snapshot_frequency` 默认 10，重启生效且所有共享进程必须一致）；`checkpoint_cache` 默认 memory、`max_entries` 128，可选 redis（`ttl_seconds` 默认 86400）。
- 配置开关：`database.*`、`run_events.*`、`blob_storage.*`（内容寻址 blob，默认关闭，`local_fs` 后端，单 blob 上限 64 MiB，供查看图片与外存工具结果跨实例读取）。
- 边界与失败行为：检查点是父链结构，分支/重新生成沿 `parent_config` 回溯，删除中间节点会让分支报 `CheckpointLineageIntegrityError`；保留策略文档是"草案"，还没有落地清理。SQLite 写事务持锁期间其他写入等 `busy_timeout`（30 秒）后报 "database is locked"。
- 依据：`H/config/database_config.py`、`H/config/checkpointer_config.py`、`H/config/run_events_config.py`、`H/runtime/checkpointer/provider.py`、`H/runtime/store/provider.py`、`H/persistence/{thread_meta,run,user,feedback,projects}/model.py`、`H/persistence/AGENTS.md`、`backend/docs/checkpoint-retention-contract.md`、`backend/docs/blob-storage.md`。

### 记忆：捕获、存储、提炼（memory / DeerMem）
- 解决的问题：跨对话记住用户的稳定信息，减少重复交代，同时不把一次性任务、项目约束或"授权指令"写进长期记忆。
- 实现方式：
  1. 捕获：`memory.mode=middleware`（默认）下，`MemoryMiddleware.after_agent` 在每轮结束把消息交给 `get_memory_manager().add(...)`。入队前先做 PII 脱敏；后端只保留用户输入与最终 AI 回复（排除 tool_calls 意图），并检测"纠正/强化"信号；摘要压缩前也会经 `memory_flush_hook` 把将被压缩的消息入队。`add` 时就捕获 `user_id`，因为后面计时器线程拿不到上下文。
  2. 排队与去抖：DeerMem 对每个 `(thread_id, user_id, agent_name)` 单独去抖，`debounce_seconds` 默认 30（1–300）；从首次待处理起最长等 `max_wait_seconds` 默认 300，持续有新消息也不能无限推迟；单消费者串行处理；`queue_max_depth` 默认 1000，满了拒绝普通更新，信号类更新始终接收。网关优雅退出时在 `shutdown_flush_timeout_seconds`（默认 30，1–300）内排空队列，超时丢弃尾部。
  3. 提炼：每个待处理批次一次 LLM 调用（可用 `backend_config.model` 指定模型）。提示词（`memory_update.chat.yaml`）让模型先反思错误/用户纠正/项目约束，再输出 JSON：`user`（workContext、personalContext、topOfMind、cognitiveStyle）与 `history`（recentMonths、earlierContext、longTermBackground）各带 `shouldUpdate`；`newFacts`（content、category、confidence、expected_valid_days）；`factsToReinforce`、`factsToRemove`、`staleFactsToRemove/Extend`、`factsToConsolidate`。每条新事实必须带 `scope`（user/thread/project）、`durability`（durable/temporary）、`authority`（descriptive/transactional）。确定性写入闸门只放行 user + durable + descriptive；缺标签的条目被丢弃；不确定时按提示词要求归为 thread/project 或 temporary。提示词禁止记录文件上传事件。事实类别：preference、knowledge、context、behavior、cognitive、goal、correction。置信度参考：明确陈述 0.9–1.0，强暗示 0.7–0.8，推断 0.5–0.6；纠正类要求 ≥ 0.95。
  4. 存储：`{base}/users/{user_id}/memory.json` 只存共享摘要、修订号与时间戳，不含事实；事实为每条一个 Markdown 文件（YAML 头），位于 `{base}/users/{user_id}/agents/{agent_name}/facts/{sha256前缀}/{fact-id}.md`；未指定 agent 的归入保留名 `__default__`。写入使用用户锁、共享修订号、恢复日志，冲突映射为 HTTP 409。
  5. 检索：默认用 SQLite FTS5 持久索引（`retrieval_adapter`），索引是可重建的派生数据，位于 `{storage_path}/.retrieval`；中文分词需 `memory-zh` 额外依赖（jieba）。
- 关键数据与默认值：`fact_confidence_threshold` 0.7；`max_facts` 100（10–500）；`staleness_review_enabled` true、`staleness_age_days` 90、`staleness_min_candidates` 3、`staleness_max_removals_per_cycle` 10、受保护类别 `correction`；`consolidation_enabled` false（有损，默认关）；`fact_dedup_enabled` 与 `retrieval_relevance_enabled` 为可选开启；`watermark_max_keys` 4096。记忆预筛（`memory.prescreen`）与信号分类（`memory.signal_classification`）默认 off，仅作成本闸门，失败一律照常提炼。
- 配置开关：`memory.enabled`（默认 true）、`mode`（middleware / tool）、`injection_enabled`（默认 true）、`manager_class`（默认 `deermem`，另有 noop、mem0、openviking、honcho 适配器，或点号类路径）、`backend_config.*`；自定义 agent 可在自己的 config 里设 `memory_enabled: false` 完全退出。
- 边界与失败行为：任务级、项目级的删除请求一律失败关闭；"一次性授权"类内容（编辑、删除、推送）被标 transactional 而拒绝入库；旧版自定义提示词模板缺分类字段会使提炼写入全部失败关闭，有拒绝计数和告警。
- 依据：`H/agents/memory/AGENTS.md`、`H/config/memory_config.py`、`H/agents/memory/backends/deermem/deermem/config.py`、`.../core/prompts/memory_update.chat.yaml`、`.../core/queue.py`、`.../core/storage.py`、`H/agents/middlewares/memory_middleware.py`、`H/agents/memory/summarization_hook.py`。

### 记忆：注入与工具模式
- 解决的问题：在不破坏提示词前缀缓存的前提下，把记忆交给模型。
- 实现方式：系统提示保持静态。`DynamicContextMiddleware` 每个对话只注入一次：在第一条用户消息前插入带 `<memory>…</memory>` 与 `<current_date>` 的 `<system-reminder>`，随后冻结（快照），跨午夜时另插日期更新。`<memory>` 内容为 "User Context"（Work / Personal / Current Focus / Thinking Style）、"History"、"Facts"（`- [类别 | 置信度] 内容`，纠正类可带 `(avoid: …)`）。事实按置信度排序，受预算截断；`guaranteed_categories`（默认 `correction`）享有单独预算先注入；开启相关性检索后改按当前用户消息排序。摘要与事实中的 `</memory>` 等标签会被转义。注入工作线程有 5 秒超时，超时降级为跳过（远程后端可声明读失败即致命）。每次运行记一条 `context:memory` 事件，仅含内容 sha256。`mode=tool` 时不被动注入事实，只注入共享摘要，模型用五个工具 `memory_search / memory_get / memory_add / memory_update / memory_delete` 自己查改（工具模式的增删改绕过提炼闸门）。
- 关键数据与默认值：`max_injection_tokens` 2000（100–8000）；`guaranteed_token_budget` 500（50–2000）；`token_counting` 默认 `tiktoken`，可设 `char`（免联网、按 CJK 估算）；tiktoken 加载失败后 600 秒内用字符估算。
- 依据：`H/agents/middlewares/dynamic_context_middleware.py`（`_INJECT_TIMEOUT_SECONDS = 5.0`）、`.../core/prompt.py:format_memory_for_injection`、`H/agents/memory/tools.py`。

### 记忆：容量淘汰（deermem eviction）
- 解决的问题：事实数超过 `max_facts` 时留谁，避免"高置信度但过时/没人用的事实挤掉刚被纠正的事实"（issue #4641 报告的置信度单一排序缺陷）。
- 实现方式：自动、手动、工具、导入四条路径都走 `core/eviction.py:select_facts_for_capacity`。`confidence`（默认）只按置信度。`hybrid-v1`（需手动开启，`fact_eviction_policy`）打分 = 置信度×0.65 + 确认新鲜度×0.25 + 访问热度×0.10；确认新鲜度按距上次用户确认的半衰期（90 天）衰减，从未确认时只取创建时间的一半权重；访问热度半衰期 30 天，仅搜索命中的事实累计，注入不计；纠正类事实预留 10% 容量、最多 10 条名额，未用的名额回到普通竞争。`fact_eviction_shadow_enabled` 可只记录两种策略的分歧而按置信度实际淘汰。只有确定性消息处理（最近 6 条过滤后消息中有用户的明确确认）能确认事实。
- 关键数据与默认值：权重之和必须为 1.0；基准结果（离线选择器，容量 7，40 道 LongMemEval 官方题 + 5 道合成纠正题共 45 例，评测容量另含 5、9）：`confidence` 27/45，`hybrid-v1` 45/45 保住支撑事实；容量 7 的真实问答（DeepSeek-V4-Flash，2026-08-18）：整体 24/45 对 40/45（精确 McNemar p=0.0001），其中 40 道官方题 23/40 对 35/40，5 道合成纠正题 1/5 对 5/5；"置信度对照"一类 `hybrid-v1` 反而 7/10 低于 8/10。
- 依据：`.../core/eviction.py`、`H/agents/memory/AGENTS.md` §Capacity and review、`backend/scripts/benchmark/deermem_eviction/README.md`。

### 记忆：作用域与用户查看/修改
- 作用域：按用户隔离（`resolve_runtime_user_id`；无认证模式用 `default`）；摘要对该用户所有 agent 共享，事实按 `(user_id, agent_name)` 分桶。DeerMem 范围隔离基准测五项：durable_retention_rate、unsafe_persistence_rate、atomic_correction_success_rate、cross_agent_contamination_rate、cross_user_contamination_rate（README 只描述指标，未给结果数字）。提炼闸门拒绝项目/线程级内容，因此没有"项目记忆"。
- 用户操作（网关 `/api` 下，路由名来自 `memory.py`）：`GET /memory`（取全部摘要与事实）、`POST /memory/reload`（重读磁盘）、`DELETE /memory`（清空）、`POST /memory/facts`、`PATCH` / `DELETE /memory/facts/{fact_id}`（事实内容至少 1 字符，置信度 0–1）、`GET /memory/export`、`POST /memory/import`、`GET /memory/config`、`GET /memory/status`。可带可选 `agent_name`；后端须声明 `supports_agent_scoped_management`，否则返回 501。前端有 `memory-settings-page.tsx` 设置页，调用 `/api/memory`（页面内容未读）。
- 依据：`backend/app/gateway/routers/memory.py`、`H/agents/memory/AGENTS.md` §Identity and isolation、`backend/scripts/benchmark/deermem_scope_isolation/README.md`、`frontend/src/core/memory/api.ts`（仅见文件名）。

### Projects（用户项目）
- 解决的问题：把一组相关线程和资料归到一个项目下，让每次运行自动带上项目指令和资料索引。
- 实现方式：`projects` 表（id、user_id、name、`instructions`、presentation、status 默认 active，可 archived）；线程通过 `threads_meta.project_id` 归属，改名不影响成员关系。每次运行开始解析一次项目快照（项目指令 + 资料架上最近文档的有界索引），渲染为请求级 `<project>` 与 `<documents>` 块，不写入消息历史或检查点（只用最新快照）。资料架文档存于 `users/{user_id}/projects/{project_id}/documents/{sha256前2位}/{sha256}/{document_id}/original/{文件名}`，内容寻址、同内容去重（先到者的名字保留）；`project_documents` 表记录名称、哈希、大小、可选摘要、来源线程；有回收站，`trashed_at` 非空即对所有读取不可见。agent 用 `list_project_documents`、`read_project_document` 两个工具读；可转换格式在首次读取时才懒转换为 `derived/converted.md`，且同样受 `uploads.auto_convert_documents` 控制。
- 关键数据与默认值：`instructions_max_bytes` 8192（超过写入时 422，不截断）；`shelf_index_max_entries` 50；`shelf_index_max_bytes` 4096；`trash_retention_days` 30；`summaries_enabled` false，开启后每文档摘要上限 `summary_max_bytes` 256，并发 2，队列 32，超时 60 秒。归档项目仍保留指令和只读资料访问。项目表无记忆开关或共享字段。
- 依据：`H/persistence/projects/model.py`、`H/projects/{context,documents,tools}.py`、`H/config/projects_config.py`、`H/config/paths.py`（`project_documents_dir`）。

## 端到端流程：一个上传了 PDF 并产出报告的回合

1. 用户在前端选文件，网关按 `uploads.*` 限制（10 个、50 MiB、100 MiB）接收并写入线程 `uploads/`；若开启转换则同时生成 `.md`。
2. `UploadsMiddleware` 在 agent 启动前把 `<current_uploads>`（含文件路径与大纲）拼到用户消息前，`DynamicContextMiddleware` 首轮插入记忆与日期的 `<system-reminder>`。
3. Agent 首次调用 `bash` 或 `read_file` 时，`SandboxMiddleware` 经授权检查后按"用户+线程"获取沙箱（命中暖池则免冷启动）。
4. Agent 用 `read_file` 读 `/mnt/user-data/uploads/…md`，用 `write_file`/`bash` 在 `workspace` 和 `outputs` 生成报告。
5. Agent 调用 `present_files` 登记 outputs 下的文件。
6. 轮末：沙箱租约释放，AIO 沙箱进入暖池；worker 比对输出快照，核验已交付，记录 workspace_changes 事件，写入运行记录与检查点。
7. `MemoryMiddleware` 把对话脱敏后入队，约 30 秒（最长 300 秒）静默后由 LLM 提炼，通过闸门后写入 memory.json 与事实文件；下个对话首轮才会被注入。

## 给产品经理的要点

1. 默认配置下沙箱是"本机"提供方，bash 默认被禁用；要让 agent 跑命令，需换成 Docker（AIO）并接受宿主 Docker 套接字风险，或用 K8s provisioner（文档称其隔离最强）。
2. 出网默认全开（`network.mode: open`）；要限制必须自行配置 `isolated` 或 `allowlist`，且仅限本地 Docker、Engine 28+，会话中被拒的域名可由用户在对话里临时放行，自主与定时运行一律拒绝。
3. 文档转 Markdown 默认关闭；不打开则 PDF/Office 文件只能原样放在 uploads，agent 读不到纯文本。
4. 产出文件若不调用 `present_files`，本轮会被判为失败；用户看到的"产物"就是被登记的 outputs 文件，HTML/SVG 产物只能下载不能内联预览。
5. 记忆是后台、延迟、有损的：约 30 秒去抖后才提炼，最多保留 100 条事实，只存"用户级、长期、描述性"内容；注入限 2000 token，且每个对话只在开头冻结注入一次，对话中途新学到的记忆下个对话才生效。
6. `database.backend` 默认是 `memory`：不改配置则重启后线程、运行、检查点全部丢失；单机用 sqlite，多机用 postgres，且多网关需配 redis 沙箱所有权。

## 文档与源码的出入 / 未核实

- 出入：`backend/docs/FILE_UPLOAD.md` 的路径示例写 `.deer-flow/threads/{thread_id}/user-data/uploads/…`（旧布局），源码与 `PATH_EXAMPLES.md` 为 `users/{user_id}/threads/{thread_id}/user-data/…`；`paths.thread_dir` 仍保留无 user_id 时的旧布局。
- 出入：`H/agents/memory/AGENTS.md` 写 `memory.token_counting: char`，而该字段实际定义在 DeerMem 的 `DeerMemConfig`（即 `memory.backend_config.token_counting`），顶层 `MemoryConfig` 里未见。
- 出入：`DeerMemConfig.storage_path` 的说明为"空则取 `$DEERMEM_DATA_DIR` 或 `~/.deermem/`"，而后端 README 说宿主默认传入 `runtime_home`；`paths.user_memory_file` 是 `{base}/users/{uid}/memory.json`。DeerFlow 实际取哪个未做运行验证。
- 出入：`CONFIGURATION.md` 的 §Sandbox 标题下并未包含 memory、database、uploads 的配置段，这三类默认值取自 `config/*.py` 源码。
- 未核实：`FileMemoryStorage` 事实 Markdown 的 YAML 头完整字段、`E2B/Boxlite/Tenki/OpenSandbox` 提供方的实现细节（只读了文档与 AGENTS）；`network_proxy.py` 源码本身；`ThreadUploadIngestionService` 的实现（读了调用方与文档）；`lease.py` 内部；`user USER.md` 画像路由；`memory-settings-page.tsx` 的页面行为；hybrid 之外的 mem0 / openviking / honcho 适配器；`backend/scripts/benchmark/sandbox` 与 `checkpoint` 没有 README，只有脚本，数字未取；检查点保留策略文档为草案，未见落地实现。
- 未核实：`H/agents/middlewares/thread_data_middleware.py` 在非懒加载时创建的目录，与 AIO `_get_thread_mounts` 的 `ensure_thread_dirs` 是否完全重合，只读了文档字符串。
