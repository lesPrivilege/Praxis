# AgentScope 企业线默认值与边界补查

本次只读补查针对现有 53 场审阅中会改变 PM 判断的六组数字/默认，再核对一次 EXPLORE 权限优先级。基线仍是固定 Python 提交 `e4c1e074dee3f0f6cca28ca29e934c4ec0605354`、2.0.10dev 文档与 Java Service 2.1.0-BETA1 公开页面。没有 clone、安装、运行或真实测试。

## 一句话结论

| 检查项 | 可安全写进 v2 的一句话 | 证据类型 | 不能顺手推广成 |
|---|---|---|---|
| Agent 循环预算 | 默认 `max_iters=50`；structured output 在达到上限后默认再给 `5` 个 grace iterations；普通文本在上限处还有一次禁用工具的最终总结路径。 | 固定源码默认 + 运行分支 + 文档 | 每个 Service/模型/业务都一定执行 50 次。配置可覆盖，模型/工具调用成本仍需另算。 |
| Context | `trigger_ratio=0.8`；代码 `tool_result_limit=50000` tokens。文档里的 `tool_result_limit=3000` 是构造示例，不是默认。 | 固定源码默认；文档示例/说明 | 0.8 × 任意产品的“总上下文”或把 3000 当系统默认。实际窗口取模型 `context_size`。 |
| Python Service run lock / replay | Service 的 `ChatService` 将 session run lock 以 `SESSION_RUN_TTL_SECS=600` 传入；session replay 的 `SESSION_REPLAY_MAX_LEN=1000` 传给 `publish_session_event`。Redis 用近似 `MAXLEN ~1000`，内存 bus 精确裁到 1000。 | MessageBusKeys + ChatService/_bus_ops + transport 实现 | 所有锁都是 600 秒、所有回放都是 1000 条，或 600 秒等于业务任务超时。checkpoint/inbox/SOP 有不同锁/TTL；自定义 bus 可有不同实现。 |
| Python ToolOffload | 固定提交的未登记原文件中 `ToolOffloadMiddleware.timeout_secs` 默认 `10.0s`；超时后底层 task 继续跑，synthetic result 先解堵，完成结果走 inbox+wakeup。 | 固定 raw 源文件补读；调用点已登记；后台 manager snapshot | 10 秒是所有工具、所有部署硬超时；state-injected/external tool不会走这条 offload。 |
| LocalWorkspaceManager | `WorkspaceManagerBase` 与 `LocalWorkspaceManager` 默认 `PER_AGENT`；Local cache TTL 默认 `3600s`；workdir 由 `basedir/agent_id` 得到。MCP live instances 按 `(agent_id, session_id)` 隔离，skills 按 agent partition。 | 固定源码 + Service 文档 | per_agent 等于 per_user 安全隔离，或 MCP/skills 与工作目录拥有相同共享粒度。Local 是 host filesystem，不是 sandbox。 |
| Java Managed file | 公开 Service 文件页明确说 Managed Session upload 上限 `16 MiB`，file 绑定当前 Session；Team/Workflow 是任务附件语义，External/Hosted 不自动继承 Managed file-input，先查 `file_input` capability。 | 当前公开 Java Service 页面，且 catalog 已登记 | 16 MiB 是所有目标/所有 Artifact/所有 provider 的统一上限。它是 Managed upload contract；其他目标必须按 capability/adapter 查。 |

## 1. Agent `max_iters` 与 structured grace

固定源码的 `ReActConfig` 默认是 `max_iters=50`，`structured_output_grace_iters=5`（`as-f99696363fae`，`vault/snapshots/agentscope-enterprise-20261012/as-f99696363fae-_config.py.txt:362-383`）。`Agent` 在没有传入配置时确实实例化 `ReActConfig()`（`as-df9d991bfc3d`，`.../as-df9d991bfc3d-_agent.py.txt:171-180`），所以这是 Agent 的代码默认，不是只存在于表单的示例值。

行为上，普通文本在 `cur_iter == max_iters` 时先走一次 `tool_choice=none` 的总结路径（`as-df9d991bfc3d`，`.../_agent.py.txt:3704-3719`）；如果仍没有最终文本，才以 `EXCEED_MAX_ITERS` 结束（`.../_agent.py.txt:3722-3757`）。structured output 未满足时，在 `max_iters + structured_output_grace_iters` 处结束；达到 `max_iters` 后强制选择 `GenerateStructuredOutput`（`.../_agent.py.txt:3580-3634`）。文档也给出 grace 默认 5，并明确失败时 `structured_output=None`（`as-188d64eb8aa5`，`.../building-blocks_agent_run-agent.md.txt:131-135`）。

适合分镜的一句话：**“默认一轮最多 50 个 reasoning-acting 迭代；普通文本到上限先做一次无工具总结，结构化输出另有默认 5 次提交宽限；这些都是 Agent 配置默认，可被覆盖。”**

未核到：没有运行 provider 验证一次模型响应如何计入 `cur_iter`，也没有性能/费用结论；不要把 50 说成 Service 任务总时限或固定模型调用数。

## 2. Context `trigger_ratio` 与 `tool_result_limit`

代码默认在 `ContextConfig` 中是：

- `trigger_ratio=0.8`，上限校验 `<=0.9`（`as-f99696363fae`，`.../_config.py.txt:51-60`）；
- `reserve_ratio=0.1`（同文件 `:62-64`）；
- `context_buffer_ratio=0.2`（同文件 `:66-80`）；
- `tool_result_limit=50000` tokens（同文件 `:146-154`）；
- `compression_fallback_to_truncation=True`、`compression_tool_enabled=False`（同文件 `:156-177`）。

压缩 threshold 是 `trigger_ratio × model.context_size`，不是固定 token 数（`as-188d64eb8aa5`，`.../building-blocks_agent_run-agent.md.txt:146-177`；`as-df9d991bfc3d`，`.../_agent.py.txt:518-520`）。文档 context 页的代码示例显式传 `tool_result_limit=3000`（`as-761fb054c0df`，`.../building-blocks_context_compress-context.md.txt:20-35`），属于示例配置；同页表格没有把 3000 宣称为默认，且只说字段意义（`:38-55`）。因此当前稿若出现 3000，应标为“示例”；若讲 Agent 默认，应写 50000。

适合分镜的一句话：**“默认在模型 context size 的 80% 触发压缩；单个工具结果代码默认上限 50000 tokens，文档示例可按场景改成 3000；超限时保留一段，余下截短，配置了 offloader 才能回查原件。”**

未核到：没有核每个 provider 的 `context_size` 实际值，也没有运行确认 tokenizer 差异；不要把 0.8 转成所有模型都相同的 token 数。

## 3. Python run lock TTL 与 replay maxlen 的作用范围

固定 key 常量是：

- `SESSION_RUN_TTL_SECS=600`，注释是 chat run 默认 lock lease 10 分钟；
- `SESSION_REPLAY_MAX_LEN=1000`，注释是 session replay log 的长度上限；
- checkpoint lock 是 30 秒，不能把它和 run lock 混称；
- inbox lock 也是 30 秒，SOP run lock 虽然也用 600，但不是 chat session lock；
- background task registry fallback TTL 是 86400 秒（`as-19629c6bf4d8`，`vault/snapshots/agentscope-enterprise-20261012/as-19629c6bf4d8-agentscope-src__agentscope__app__message_bus___keys.py-e4c1e074.txt:121-158,299-300`）。

实际使用位置：`ChatService._run_impl` 把 `SESSION_RUN_TTL_SECS` 传给 session lock（`as-73da307b2ffd`，`.../_chat.py.txt:804-816`）；`publish_session_event` 把 `SESSION_REPLAY_MAX_LEN` 传给 bus `log_append`（`as-68f5bb723b26`，`.../_bus_ops.py.txt:37-66`）；SSE replay 读取时也用同一常量作 `max_count`（`as-9af0c87d9dc4`，`.../_session.py.txt:892-906`）。持久化必须在 run lock 释放前完成，且 checkpoint lock 另行保护 cursor/state 组合（`as-73da307b2ffd`，`.../_chat.py.txt:1476-1512`）。

Transport 差异会改变“1000”如何落地：内存 bus 超过 `max_len` 后精确删除旧条目（`as-e2af92fa9ac1`，`.../_in_memory_message_bus.py.txt:204-234`）；Redis 用 `XADD MAXLEN ~N` 的近似裁剪（`as-ebaf50819a12`，`.../_redis_message_bus.py.txt:307-348`）。另外，服务完成一次持久化后会按 checkpoint cursor 主动 trim，实际可回放条数可能小于 1000。

适合分镜的一句话：**“对当前 Python Service 实现，ChatService 使用 600 秒 session run lease，session event replay 以 1000 为裁剪参数；它们是服务 key/transport 的默认，不是所有锁、所有自定义 bus 或业务任务的通用超时/历史保证。”**

未核到：没有运行 Redis、模拟 lease 过期或观察多副本接管；600 秒不应被画成“工具一定最多运行 10 分钟”，因为 lock heartbeat 会续租，且后台工具另有 task registry。

## 4. ToolOffload timeout 与 watcher 重启行为

固定提交的原始文件 `src/agentscope/app/middleware/_tool_offload_middleware.py` 不在当前 provenance catalog/snapshot 中；本次用固定 commit raw URL 作补读，故下面这个文件没有可引用的 catalog sourceID：

`https://raw.githubusercontent.com/agentscope-ai/agentscope/e4c1e074dee3f0f6cca28ca29e934c4ec0605354/src/agentscope/app/middleware/_tool_offload_middleware.py`

原文件 `ToolOffloadMiddleware.__init__` 的 `timeout_secs: float = 10.0`（raw `:68-99`），而 `ChatService` 装配时没有传 timeout 参数（已登记 `as-73da307b2ffd`，`vault/snapshots/agentscope-enterprise-20261012/as-73da307b2ffd-_chat.py.txt:984-995`），所以当前固定源码路径使用 10 秒默认。这个默认只对普通工具 timeout 生效：`is_state_injected` 与 `is_external_tool` 始终同步执行（raw `:46-71,127-159`）。

超时后底层 `drain_task` 不取消，注册到 `BackgroundTaskManager`，Agent 先收到 synthetic ToolChunk/ToolResponse；watcher 等 task 完成后把 HintBlock 推到 inbox 并触发 wakeup（raw `:105-125,223-245,338-394`）。`BackgroundTaskManager` 的注册表有 86400 秒 fallback TTL，任务完成回调会清理 local handle 和 registry（`as-d612211accc9`，`vault/snapshots/agentscope-enterprise-20261012/as-d612211accc9-_background_task_manager.py.txt:249-328`；TTL key 在 `as-19629c6bf4d8:299-300`）。服务 lifespan 正常退出时 `__aexit__` 会 cancel 所有本进程 task（`as-d612211accc9`，`.../_background_task_manager.py.txt:446-470`）。进程崩溃/硬重启没有可继续执行的 asyncio task；Redis registry 可能只作为最多 24 小时的 stale metadata，不能证明 watcher 仍活着。

适合分镜的一句话：**“当前固定 Service 装配的 ToolOffload 默认等待 10 秒；超时只是把仍在运行的 task 移到本进程 watcher，结果经 inbox+wakeup 回来；正常停机取消 watcher，崩溃后只可能留下过期 registry 记录，不能宣称跨重启恢复。”**

未决：raw 文件没有进入现有 provenance catalog，需在正式入账后才适合作为成片的正式 sourceID；当前报告把调用点 `as-73da307b2ffd` 和后台 manager `as-d612211accc9` 分别列为已登记支撑。

## 5. LocalWorkspaceManager 的 `per_agent`、MCP 与技能分区

代码默认：`WorkspaceManagerBase(isolation=PER_AGENT)`（`as-a40a77f95cef`，`vault/snapshots/agentscope-enterprise-20261012/as-a40a77f95cef-agentscope-src__agentscope__app__workspace_manager___base.py-e4c1e074.txt:18-56`），`LocalWorkspaceManager` 同样默认 `PER_AGENT`、`ttl=3600.0`（`as-b72c698b961f`，`.../_local_workspace_manager.py.txt:15-56`）。`assign_workspace_id` 的 per-agent 语义是复用同一 `(user, agent)` 已绑定的 workspace id；但第一次跨 app worker race 仍可能生成两个绑定（`as-a40a77f95cef:83-107`）。Local 实例的实际 workdir 是 `basedir/agent_id`（`as-b72c698b961f:128-137`），因此 PM 不应把 `per_agent` 讲成 per-user 安全隔离或天然跨租户隔离；当前证据没有为同一 agent 的不同用户承诺独立 host 目录。

工作目录内部是另一套分区：`.mcp` 记录 agent/session 声明，MCP live instances 按 `(agent_id, session_id)` 创建和复制，stateful MCP 状态不跨 agent/session 泄漏（`as-62baab197e50`，`vault/snapshots/agentscope-enterprise-20261012/as-62baab197e50-agentscope-src__agentscope__workspace___base.py-e4c1e074.txt:34-55,584-650`）；skills 按 agent partition 保存（同文件 `:50-55,379-420`）。Local workspace 本身是 host filesystem，官方文档明确不提供 sandbox isolation（`as-e8bf00e52cb9`，`vault/snapshots/agentscope-enterprise-20261012/as-e8bf00e52cb9-main-workspace.md.txt:12-18`；catalog limits）。

适合分镜的一句话：**“默认 Local workspace 按 agent 共享工作目录，空闲 cache 3600 秒回收；MCP live state 仍按 agent+session 分区，skills 按 agent 分区；这描述生命周期和状态隔离，不是 host filesystem 的安全沙箱。”**

未决：跨用户共享同一 Agent 时业务方的 ResourceAccess、workspace binding 与 host path 组合没有做运行核验；不能从 `per_agent` 自动推出组织级租户隔离。

## 6. Java Managed 文件 16 MiB 是否普遍

当前公开 Java Service 文件页面明确写的是：Session file upload 上限 16 MiB，文件属于当前 Session，另一 Session 不能直接引用（`as-69ccfb190c6d`，`vault/snapshots/agentscope-enterprise-20261012/as-69ccfb190c6d-java-service-files.md.txt:13-17`）。同页要求先查 Session 的 `files` 与 `file_input` capabilities（`:17-22`），并明确该 input format 是 **Managed Agents** 的格式；Teams/Workflows 接受业务定义的 task input，Service 只把相关 Session files 作为附件交给 executor；Direct External/Hosted 不自动继承 Managed file-input（`:36-69`）。

Artifact 发布也是 Managed 的显式 `/artifacts` 记录，并不读取/生成工作目录文件（`:90-108`）；Team/Workflow 任务 artifacts 走 Turn artifacts 资源且要验证内容、版本、权限，completed 不等于交付正确（`:149-165`）。Service index 标明当前 release 是 2.1.0-BETA1 prerelease（`as-9d9136196aa8`，`vault/snapshots/agentscope-enterprise-20261012/as-9d9136196aa8-java-service-index.md.txt:5-15`）。

适合分镜的一句话：**“16 MiB 是当前公开 Managed Session upload contract；它不是所有 Agent target、Team/Workflow task attachment、External/Hosted input 或 Artifact 的统一上限，先查 `file_input`/目标能力。”**

未核到：没有运行 Service、上传边界或读取 Java Service router schema；结论是当前公开页面的 contract 读取，不是行为测试。

## EXPLORE 权限优先级修正

先前“EXPLORE 对非只读操作直接 DENY，保留 ask 规则”的表述需要收窄。固定源码的实际顺序是：

```text
deny rule → ask rule → read-only fast path → (skip tool check) → (skip allow) → fallback DENY
```

因此：

- deny rule 匹配时，非只读也先 DENY；
- **显式 ask rule 匹配时，先 ASK**，并生成 suggested rules；这不是“非只读一律先 DENY”；
- 没有 deny/ask 规则且本次调用不是 read-only 时，才走 EXPLORE fallback DENY；
- allow rule 不参与 EXPLORE，不能放开写操作；tool-level safety ASK 也不执行，因为 tool check 被跳过；
- read-only fast path 仍可 ALLOW，而且 read-only 是按本次 input 判断。

证据是源码 `_check_explore` 的顺序和返回（`as-145a584b7630`，`vault/snapshots/agentscope-enterprise-20261012/as-145a584b7630-_engine.py.txt:214-295`），以及公开 decision matrix（`as-7dad78a203b5`，`vault/snapshots/agentscope-enterprise-20261012/as-7dad78a203b5-main-permission.md.txt:54-74`）。

适合分镜的一句话：**“EXPLORE 的非只读 fallback 是 DENY，但显式 ask rule 仍在 fallback 前产生 ASK；deny 先于 ask，allow 永远不能放开 EXPLORE。”**

## 未决与核查边界

- ToolOffloadMiddleware 原文件已按固定 commit 补读，但它不在当前 provenance catalog/snapshot；正式成片若要把 `10.0s` 当可追溯事实，应先入账，或把它标成固定提交源码补查。
- 未运行模型、Redis、InMemory bus、LocalWorkspaceManager、ToolOffload 或 Java Service；所有数字来自默认构造、常量、调用点和公开文档。
- `600s` 是当前 ChatService session run lock 传入值；`1000` 是当前 session event replay 参数。自定义 MessageBus、部署改写、未来版本可能改变实现/裁剪语义。
- `16 MiB` 是公开 Managed files 页面上的当前值；没有证据说明它适用于 External/Hosted/所有 Team/Workflow executor 或所有 artifact 类型。
