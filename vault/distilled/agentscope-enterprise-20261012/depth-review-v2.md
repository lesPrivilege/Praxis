# AgentScope 企业线视频：局部深度审阅

审阅对象是 `/Users/lesprivilege/.codex/worktrees/agentscope-enterprise-film/Praxis/demos/agentscope-enterprise-film` 当前产物，重点对照：

- reading.md 的 53 个局部；
- script/beats.json 的展项、画面文字、PM 句和证据；
- 固定研究批次 `vault/distilled/agentscope-enterprise-20261012`、`vault/provenance/agentscope-enterprise-20261012/catalog.json` 与对应 snapshots。

本审阅把局部按讲解页约定检查四问：为什么需要、怎样工作、影响判断的默认是什么、失败时怎样表现。这里的“默认”只保留会改变方案判断的条件；没有核到的地方明确标出。原仓库的 `kit/write/publish/explainer.md` 只作为本次审阅的参考，未提升为全局指令。

## 结论先行

当前片子的故事线成立，且大多数局部至少回答了“是什么、作用是什么”。但以下八处如果按现稿直接拍，下一问会把观众带到错误的实现模型：

| 优先级 | 局部 | 当前可见覆盖 | 下一版必须补的判断 |
|---|---|---|---|
| P0 | `agent` / 06 | 说了 AgentState 保存上下文、当前消息、工具和暂停信息 | AgentState 是持久 JSON 单元；parked 不是一个抽象旗标，而是**该 Agent 的尾部 assistant Msg** 中 `ASKING`，或无匹配结果的 `SUBMITTED`；还要显示 `reply_context`、permission/tool/task/middleware context。 |
| P0 | `tools` / 11 | 说了 ToolChunk、ToolResponse 聚合结果 | 结果按 block id 聚合；Text 追加、Base64 独立解码后再合并、URL DataBlock 不能追加；状态会保留更严重的 error/interrupted/denied；最终 ToolResultBlock 的 id 必须对应 ToolCallBlock。 |
| P0 | `permission` / 13 | 屏幕上只有 ALLOW/DENY/ASK 三分支 | DEFAULT 的优先级要可见：deny → ask → read-only fast path → tool check → allow → fallback ASK；EXPLORE 跳过 tool check/allow，BYPASS 跳过 safety ASK，DONT_ASK 把 ASK 转 DENY。 |
| P0 | `background` / 30 | 说了长工具后台执行、结果回到同一会话 | 先由 ToolOffloadMiddleware 产出占位并交给进程级 watcher；完成后经 inbox + wakeup 回到 Agent；watcher 不是 durable execution，进程重启不会保留它；ToolStop 受 session 约束，晚到结果必须按原 task identity 处理。 |
| P0 | `sessions` / 29 | 说了 Storage、Bus、锁、回放和 stale snapshot | 要画出 bus session lock 的 lease/heartbeat 和“拿锁后再读 state”；事件写 replay log + live pub/sub，持久化消息/state/cursor 后才释放锁，避免下一 worker 读旧快照。 |
| P0 | `java-04-session-turn-idempotency` / 38 | 说了 Session、Turn、Idempotency-Key、排队/审批 | `202 queued` 只表示 accepted；`input.accepted` 和 `input.applied` 不同；同一 key 必须连同相同 body 重试，Turn 复用；等待中的 Turn 阻塞后续；Team/Workflow 每个 Turn 是独立协作/流程。 |
| P0 | `java-07-files-artifacts` / 41 | 说了 Session file、Artifact、Team/Workflow 交付 | file 是当前 Session 绑定且受 `file_input` 能力限制（Managed 上传上限 16 MiB）；工作目录文件不会自动可下载；必须显式 publish Artifact 并按 artifact record 取回，`completed` 不等于交付正确。 |
| P0 | `java-09-recovery-capabilities` / 43 | 说了日志、checkpoint、workspace、sandbox 和外部副作用 | 恢复前要查 capabilities、pending actions、uncertain tool calls；checkpoint 不恢复 OS thread/网络请求/工具内部进度；旧 writer lease 必须释放或过期；恢复不会撤销外部写入。 |

次一级但仍应在画面或邻近细节层保留：

1. `events` / 08 要把事件“到达”和 Msg 实际改变分开；错 `reply_id`/目标 block 会被跳过，DataBlock delta 不能按字符串拼接。
2. `java-05-snapshot-sse-cursor` / 39 要点出 Managed Session、generic Turn、Team/Workflow 的 snapshot shape 不同，`item.delta` 要追加、`item.completed` 要替换；目标 Turn 的终态才代表任务完成。
3. `java-06-interaction-capabilities` / 40 要把 capabilities 变成控件前置条件，并把 accepted receipt 与 applied/继续执行分开。
4. `java-08-auth-grant-registration` / 42 已抓住主要边界，但要标明 Access 页面是 preview；External 首次 registration 端点本身不认证调用者，application key 也不替代用户 Namespace 权限。
5. `java-01-harness-context` / 35 与 `java-09` / 43 有一个未裁决的 Java 默认冲突：Harness architecture 说默认 `EVENT_LOG/native checkpoints`，production 页面又说 `JsonFileAgentStateStore` 是 Harness 默认。成片不要把两者合并成同一个“默认”。

### 版本与证据边界

- Python 研究基线是固定提交 `e4c1e074dee3f0f6cca28ca29e934c4ec0605354`，源码版本 2.0.10dev；片中大量页面证据仍指向 2.0.9 稳定文档。必须在片头或章节角标说明这是稳定文档入口与固定 main 源码的并置，不能让观众以为所有默认来自同一版本。
- Java Service 当前公开页标 `2.1.0-BETA1` prerelease；Access、External 等页明确 preview。画面可以讲公开契约和边界，不能把它说成已验证的企业 SLA 或稳定产品承诺。
- 本审阅只消费保存的文档和选定静态源码。没有 clone、安装依赖、启动服务、调用 provider/MCP/vector DB、做集成或性能测试，也没有逐行审计全部 Java Service router、全部 storage adapter、全部 workspace backend。下文“覆盖”均是机制证据，不是运行证明。

## 八组重点深审

### 1. AgentState：`agent` / 06

**为什么需要。** 片中“连续工作需要保存和恢复正确的运行状态”是对的，但还不够。没有 AgentState，跨请求/进程只能重新猜测上下文；尤其无法判断一个 reply 是完成、等待确认、等待外部结果，还是可继续的中间状态。

**怎样工作。** 固定源码把 `AgentState` 作为可 JSON 序列化单元，包含 `session_id`、压缩 `summary`、未压缩 `context`、`reply_context`、`permission_context`、`tool_context`、`tasks_context` 和 `middle_context`。`ReplyContext` 还保存 `reply_id`、`cur_iter`、structured schema 和当前 structured output。`append_context` 按当前 `reply_id` 把同一 reply 的 assistant blocks 合并进一个 Msg。parked 判定只看尾部且属于该 Agent 的 assistant Msg：`ToolCallState.ASKING`，或 `SUBMITTED` 但没有同 id 的 ToolResultBlock；别的 Agent 观察消息不会把本 Agent 误判成 waiting。状态恢复后应先 `upsert_session`；直接对不存在的 session 做 `update_session_state` 会抛 `KeyError`。

**影响判断的默认。** `session_id` 默认由 state 生成，但服务层以 `(user_id, agent_id, session_id)` 组织持久状态；tool cache 默认有文件数/字节上限，activated tool groups 和 middleware context 也会进入状态。structured schema 在进程内是 Pydantic class，序列化后是 JSON Schema；重启后自定义 validator/default factory 的语义可能变化。默认不是“把全部历史永远塞给模型”：summary/context 会配合压缩，workspace/offloader 负责被移出的内容。

**失败行为。** 只有一个旧的“有暂停字段”或只看 session status 不能推出 parked。尾部若是别的 Agent、ToolResult 已经补上、或 session 删除，waiting 应为 false。运行中的持久快照可能落后，不能拿它覆盖 worker 的 live state。结构化输出恢复后 `structured_output` 也可能为 `None`，应按失败/超限处理。

**v2 可直接用的状态例子。**

```text
AgentState {
  session_id: S-17,
  reply_context: {reply_id: R-4, cur_iter: 2, structured_schema: null},
  context[-1]: AssistantMsg(id=R-4, tool_call=[
    {id=C-9, name=publish_file, state=ASKING}
  ]),
  permission_context.mode: DEFAULT,
  tool_context.activated_groups: [basic, files]
}
→ status = AWAITING_PERMISSION；下一步必须接 UserConfirmResultEvent。
```

**反例。**

```text
context[-1] = AssistantMsg(id=R-4, tool_call C-9 state=SUBMITTED)
context[-1] 同时已有 ToolResultBlock(id=C-9, state=success)
→ 不是 waiting；若 UI 仍画“等待外部结果”，会重复恢复。
```

证据：`as-614314fd8b6b`（`vault/snapshots/agentscope-enterprise-20261012/as-614314fd8b6b-_state.py.txt:182-220,268-372`）、`as-188d64eb8aa5`（`.../as-188d64eb8aa5-building-blocks_agent_run-agent.md.txt:180-244`）、`as-f2b9fa0f0bea`（`.../as-f2b9fa0f0bea-building-blocks_agent_overview.md.txt:12-67`）。当前局部：`reading.md:94-109`；`beats.json:454-534`。缺口是画面没有显示 state 的字段和“尾部+同 Agent+无结果”的条件。

### 2. 工具结果结构：`tools` / 11，关联 `message` / 07、`events` / 08

**为什么需要。** 模型看到的是 function schema，工具执行中看到的是流式 ToolChunk，下一轮上下文需要的是稳定、可聚合的 ToolResultBlock；三者不是一个对象。若只展示一块“工具结果”，PM 会把流式进度、最终结果和错误状态混成同一个字段。

**怎样工作。** `ToolChunk` 带 `content`、`state`、`is_last`、`metadata`、`id`；`ToolResponse.append_chunk` 按 content block id 合并，TextBlock 追加文本；两个 Base64 DataBlock 先分别 decode、拼二进制、再 encode，不能直接拼 base64 字符串；URL DataBlock 或不同 source 类型再次追加会抛 `ValueError`。metadata 后写入覆盖/合并，结果状态保留更严重的 `ERROR`，否则再升级到 `INTERRUPTED`、`DENIED`。最后 Agent 将聚合结果写入与 ToolCallBlock 同 id 的 ToolResultBlock，回灌 ReAct。

**影响判断的默认。** ToolResultState 的最终可见状态是 `success/error/interrupted/denied`；流式 chunk 默认 `running`，`is_last` 默认 true，不能据此假设每个工具只发一块。工具输出可为 TextBlock 或 DataBlock；多模态能力仍受 formatter/provider 限制。ToolCallBlock 有 `pending → asking → allowed/submitted → finished`，ToolResultBlock id 必须对应调用 id。

**失败行为。** 未注册/未激活/参数不匹配在副作用前返回模型可读 error；streaming URL 数据追加失败；错误 chunk 会让聚合状态升级，不能用后来的 success 把 error 洗掉。错误 ToolCall id 的结果不能安全续接。当前 `reading.md:178-194` 只点名 ToolChunk/ToolResponse，没有把这些状态转换和数据合并规则变成可见判断。

**v2 状态例子。** `C-9` 先发 `ToolChunk(block=b1,text="uploading ",state=running)`，再发 `ToolChunk(block=b1,text="report.pdf",state=success)`，聚合为一个 `ToolResponse(content=[TextBlock(id=b1,text="uploading report.pdf")], state=success)`；随后包装为 `ToolResultBlock(id=C-9,state=success)`。

**反例。** 第一个 chunk 是 `DataBlock(source=url://a)`，第二个同 id 是 `DataBlock(source=url://b)`；不能把两个 URL 拼成一个文件。另一个反例是先收到 `ERROR` 后收到 `SUCCESS`，最终状态仍应保留 error，不能画成“最后一块成功”。

证据：`as-87b75e2c3fd3`（`.../as-87b75e2c3fd3-_response.py.txt:28-43,50-170`）、`as-24299c5c3ff5`（`.../as-24299c5c3ff5-building-blocks_message-and-event.md.txt:123-145,247-300`）、`as-13c3e91cfe2f`（`.../as-13c3e91cfe2f-building-blocks_tool_overview.md.txt:14-34`）。当前局部：`reading.md:110-143,178-194`；`beats.json:535-702,878-968`。

### 3. 权限优先级：`permission` / 13，关联 `hitl` / 14

**为什么需要。** 合法 JSON schema 只说明参数形状，不说明副作用可以发生。产品必须能回答“哪个判断先赢”“什么模式不可被 allow 规则放开”“谁在何时被要求确认”。

**怎样工作。** DEFAULT 顺序是：

```text
deny rule → ask rule → read-only fast path → tool.check_permissions
→ allow rule → fallback ASK
```

EXPLORE 保留 deny/ask 与只读快速路径，非只读直接 DENY，跳过 tool check 和 allow；ACCEPT_EDITS 让工作目录内的编辑可由 tool check 自动 ALLOW；BYPASS 仍守显式 deny/ask 和 tool DENY，但跳过工具 safety ASK，最后 fallback ALLOW；DONT_ASK 用于无人值守，把 ask/safety ASK/fallback ASK 转成 DENY。ASK 产生 `RequireUserConfirmEvent`，把工具变成 asking 并带 `suggested_rules`；批准后再以对应 reply/tool id 续接。

**影响判断的默认。** read-only 是**按这次 input**判断，不是工具静态标签；例如 `git status` 可过，写文件的 Bash 不可过。安全 ASK（`bypass_immune`）不能被后面的 allow 规则覆盖，除了 BYPASS 明确跳过它。不要把 BYPASS 说成沙箱或合规审批。

**失败行为。** 未注册工具、inactive group、JSON repair/schema 失败都在 permission 之前阻断，不进副作用；错 reply/tool id 的确认不能续接。并发 batch 的普通 ASK 可按已接受规则去重，safety ASK 不这样去重。HITL parked 的 `finished_reason=None` 表示未完成。

**v2 状态例子。** `Bash("git status")` 在 DEFAULT 走 read-only fast path → ALLOW；`Write("/workspace/report.md")` 在 DEFAULT 进入 tool check/allow 或 ASK；同一 Write 在 EXPLORE → DENY，即使 allow rule 存在；无人值守 DONT_ASK 下未显式允许的写操作 → DENY。

**反例。** “模型选了 `publish_file`，schema 验证成功，所以执行”是错的；若 deny rule 匹配，deny 先赢。把 BYPASS 画成“更安全的确认模式”也是错，它故意绕过工具 safety ASK。

证据：`as-145a584b7630`（`.../as-145a584b7630-_engine.py.txt:117-212,214-295,297-393,395-489,491-560`）、`as-7dad78a203b5`（`.../as-7dad78a203b5-main-permission.md.txt:14-24,54-74`）、`as-7bfd7ee86f21`（`.../as-7bfd7ee86f21-building-blocks_agent_human-in-the-loop.md.txt:14-81,85-120`）。当前局部：`reading.md:212-244`；`beats.json:1060-1229`。

### 4. 背景结果：`background` / 30，关联 `sessions` / 29

**为什么需要。** 浏览器连接不是工具生命周期。长工具若占住 HTTP/Agent 协程，页面关闭、代理超时或多进程切换都会把“观察中断”误当成“执行停止”。

**怎样工作。** Service 的 `ToolOffloadMiddleware` 在工具超过 timeout 时把调用转为后台 watcher，并向当前 Agent 产出占位；`BackgroundTaskManager` 持有本进程 asyncio task，同时在 bus registry 登记 `(session_id, agent_id, user_id, tool_name)` 和 TTL。watcher 完成后经 MessageBus inbox + wakeup 推回目标 session，由 `WakeupDispatcher` 在 session lock 下重新运行；结果通过 `HintBlock`/ToolResult 路径进入下一轮。`ToolStop` 对本 worker 的同 session task 直接 cancel，跨 worker 通过 bus cancel channel 广播；不存在或跨 session 的 task id 返回 error。

**影响判断的默认。** background registry/watcher 是进程级运行管理，不是跨重启的 durable execution；Service 的 durable 部分是 inbox/replay/storage，后台 asyncio task 进程退出会被取消。前端断开只切观察，不自动停止后台任务；取消、完成、失败、晚到结果都必须保留原 task/session identity。

**失败行为。** worker 重启后没有 watcher 可以继续，不能把“session 有 inbox”描述成后台进程已恢复；结果到达时应先按原 session lock 和 task id 处理，不能重新 POST 同一用户输入。ToolStop guessed 其他 session 的 id 不应触发跨会话取消。后台结果若落在 parked HITL session，应入 inbox 等待下一次确认/恢复，而不是强行启动 `None` turn。

**v2 状态例子。**

```text
POST /chat → ToolOffloadMiddleware
  → tool_call C-9 = submitted/background(task=B-7)
  → browser disconnects
  → B-7 finishes on worker W2
  → inbox(S-17).push(result C-9) + wakeup(S-17)
  → lock(S-17) → Agent consumes result → next reasoning
```

**反例。** 浏览器断开后重新发送同一 Msg，以为这是“取回后台结果”；它会制造第二次工具调用。另一个反例是进程重启后仅凭 registry 记录就宣称任务仍在执行；registry 没有 watcher 的执行进度。

证据：`as-dc202a66c974`（`.../as-dc202a66c974-main-agent-service.md.txt:30-35,121-124,195-196,327-357,803-840`）、`as-d612211accc9`（`.../as-d612211accc9-_background_task_manager.py.txt:216-231,249-328,380-408,446-470`）、`as-19629c6bf4d8`（`.../as-19629c6bf4d8-agentscope-src__agentscope__app__message_bus___keys.py-e4c1e074.txt:27-47,201-240`）。当前局部：`reading.md:501-517`；`beats.json:2502-2585`。

### 5. 锁与事件回放：`sessions` / 29、`events` / 08、Java `39`

#### Python Service

`MessageBus.acquire_lock` 以 `SET key random-token NX EX ttl` 竞争，默认 run lease 600 秒，heartbeat 每半个 TTL 续租；释放时只删除仍持有自己 token 的 key。`ChatService._run_impl` 先拿 session lock，再加载可变 session state；事件每次先 append 到 replay log，再 publish live channel。finally 中 shielded persistence 先写 reply/AgentState、checkpoint cursor 并 trim log，锁保持到写完，避免下一 worker 读 stale state。replay log 是 append-only、多消费者、受 max length 约束；Redis 实现用近似 `MAXLEN`，本项目 session cap 是 1000。live pub/sub 是 fire-and-forget，离线 subscriber 收不到历史，所以订阅端采用“先 subscribe，再 replay”，用 entry id 去重。

**为什么需要。** 锁解决同一 session 同时执行/覆盖状态，回放解决观察者错过事件；两者都不能替代对方。live event 到达也不是 storage commit 的确认。

**默认与失败。** 运行 lock 过期/worker 崩溃后可以被另一 worker 接管，但旧 worker 不能在 lease 失效后释放新 worker 的 token；checkpoint lock 是另一把短锁，不能拿来当 run lock。replay cap/TTL 过后，旧 cursor 不能保证还有数据；UI 应从 message snapshot/cursor 或最新状态重建。当前 `reading.md:484-500` 只说“cluster-wide run lock”和 stale snapshot，没有 lease、写入顺序、replay cap 和 pub/sub 丢失条件。

**Python v2 状态例子。** `W1` 持有 `lock(S-17)`，每个 `ReplyEvent` 同时进 `log(S-17)` 与 live channel；页面断开，W1 完成后写 storage/state/cursor 并释放；页面重连先订阅、再从 cursor replay，交界重复 entry id 只显示一次。

**Python 反例。** 先从 storage 读状态、还未拿锁就开始组装 Agent；W1 写完后 W2 获锁，W2 仍可能用旧 snapshot 覆盖 W1。只用 pub/sub 订阅重连，断线期间的事件永久漏掉。

证据：`as-ad100b5dcf7e`（`.../as-ad100b5dcf7e-_base.py.txt:172-241,259-396`）、`as-ebaf50819a12`（`.../as-ebaf50819a12-agentscope-src__agentscope__app__message_bus___redis_message_bus.py-e4c1e074.txt:304-404,622-715`）、`as-19629c6bf4d8`（`.../as-19629c6bf4d8-agentscope-src__agentscope__app__message_bus___keys.py-e4c1e074.txt:121-158,201-240`）、`as-73da307b2ffd`（`.../as-73da307b2ffd-_chat.py.txt:140-153,272-299,804-816,1476-1512`）、`as-9af0c87d9dc4`（`.../as-9af0c87d9dc4-_session.py.txt:649-682,827-906`）。

#### Java Service / Harness

Java 的 snapshot/SSE 是应用投影或 Service API 观察面，不等同于统一 SDK snapshot；cursor 属于具体 Session/Turn/subagent 资源。`410 cursor_expired` 要 fresh snapshot + 新 `as_of`，不能重投 Turn。Harness native `seq`、Service public SSE cursor、submission idempotency key、interaction request id 各自独立，不能混用。

证据：`as-e60a2f6c58b3`（`.../as-e60a2f6c58b3-java-harness-session.md.txt:75-103,193-233,254-303`）、`as-528e3df546ca`（`.../as-528e3df546ca-java-service-sse.md.txt:13-34,66-100`）、`as-eb83f48e5259`（`.../as-eb83f48e5259-java-service-operations.md.txt:83-100`）。当前局部：`reading.md:127-143,484-500,655-671`；`beats.json:619-702,2418-2501,3326-3417`。

### 6. Java Session / Turn：`java-02` / 36、`java-04` / 38、`java-06` / 40

**为什么需要。** 应用要区分“接受了一项工作”“它正在运行”“它暂停等待输入”“页面只是断线观察”。Session 固定目标和配置，Turn 表示一次逻辑提交，run 是该 Turn 的一次执行；若只讲统一 Session API，PM 会把观察、重试和新任务混为一件事。

**怎样工作。** `AgentSession.submit(requestKey, body)` 持久接收输入并分配 turnId，可能先无 runId、处于 queued；同一 Session 按 acceptance order 排队，审批/未完成 Turn 会阻塞后续。网络重试必须使用相同 key 和相同 body，返回原 Turn；不同逻辑任务才换 key。`input.accepted` 是持久接收，`input.applied` 是 runtime 消费；`202 Accepted` 不是完成。Managed 在同一 Session 保留 conversation context，Team/Workflow 每个 Turn 启动独立协作/流程。steer 影响下一 reasoning，inject 只写上下文不启动推理，actions 以 request_id 回答 pending action，resume 需看 capabilities。

**影响判断的默认。** `call/streamEvents` 是应用拥有执行的直接入口；`AgentSession` 才负责后台 acceptance、queue、pending action 和 resume。只读 `await`/transcript/stream 观察不会再次启动 inference；页面断开不会取消工作。

**失败行为。** 已完成/已取消 Turn 不能 resume；steer 目标不再 running 会被拒绝；同一 key 改 body 是冲突而不是新任务；accepted receipt 不能当 tool 已执行。checkpoint restore 要求 session idle、无 pending/uncertain outcome，并不会撤销外部副作用。

**v2 状态例子。** `S1/T1/R1`: `submit(key=k1)` → `202 queued`, `input.accepted`; UI 断开；`T1` 等审批，`T2` 保持 queued；重试 `k1+同 body` 仍取回 `T1`；批准后 `input.applied`、`R1` 继续或生成新 run；只有 `turn.completed` 才能标完成。

**反例。** `202` 后页面超时，应用重新生成 `k2` 再 POST 同一合同，于是得到 `T2` 的第二次执行；或者 `GET events` 只是观察，却被画成“重新调用 Agent”。

证据：`as-e60a2f6c58b3`（`.../as-e60a2f6c58b3-java-harness-session.md.txt:9-13,40-58,62-103,107-149,172-185`）、`as-79adbb1a7334`（`.../as-79adbb1a7334-java-service-session.md.txt:9-41,74-97,113-146,197-210`）、`as-9d9136196aa8`（`.../as-9d9136196aa8-java-service-index.md.txt:41-50`）。当前局部：`reading.md:604-620,638-654,672-688`；`beats.json:3043-3134,3234-3325,3418-3516`。

### 7. Artifact：`java-07` / 41，关联 `java-orchestration` / 44

**为什么需要。** 工作目录和应用交付目录不是同一边界。文件存在于 Agent 环境不能推出业务应用可以下载、别的 Team member 可以读、或结果已经过验收。

**怎样工作。** 先检查 Session `files/file_input` capability；上传 raw bytes 得到 session-bound `file_id`，再在 Turn structured input 中引用。Managed 上传上限为 16 MiB，其他 Team/Workflow/External/Hosted 输入语义要单独核对。工作目录文件要先成为 Session file，或经 `POST /artifacts` 显式发布（实际 `file_id` 或可访问 external URI）；应用从 artifact record 读取 `artifact_id/file_id` 后按权限下载。Team/Workflow executor 从 Turn artifacts 报告结果，成员间通过可访问 Artifact 交接，不自动共享 filesystem。

**影响判断的默认。** `completed` 只表示任务状态，不证明 Artifact 内容、版本、权限和业务验收正确；External/Hosted Host disk 文件默认不会自动可下载。Artifact 是显式交付记录，且下载 URL 不是永久公开链接。

**失败行为。** 目标没有 `file_input` 时上传仍不能保证任务能处理；跨 Session 直接引用 file_id 无效；猜 Agent 回复里的路径构造下载 URL 是错的；外部 URI Artifact 的发布不复制文件也不授予访问权。下载需 Session/Turn read access 和正确 artifact resource。

**v2 状态例子。** `report.pdf` → `SessionFile F-1` → `Turn input.file_id=F-1`；Agent 在 workspace 生成候选；应用验证内容后 `POST /artifacts {file_id:F-2}` → `Artifact A-7` → 按 A-7 读取和下载。

**反例。** Agent 回答“已写入 `/workspace/report.pdf`”，但没有上传/发布；应用把这个路径当成公开下载链接。或者 Team member 完成了自己的 step，就直接假定 Lead 的本地文件系统能看到它。

证据：`as-69ccfb190c6d`（`.../as-69ccfb190c6d-java-service-files.md.txt:9-17,36-69,71-92,90-149`）、`as-675c5fc9c363`（`.../as-675c5fc9c363-java-service-orchestration.md.txt:15-21,43-49`）、`as-556d0c6a5726`（`.../as-556d0c6a5726-java-service-runtime-host.md.txt:148-153,179-183`）。当前局部：`reading.md:689-704,738-753`；`beats.json:3517-3602,3795-3868`。

### 8. Java 恢复能力与默认冲突：`java-01` / 35、`java-09` / 43、`java-storage` / 50

Harness architecture 的固定页称 `EVENT_LOG/native checkpoints` 为默认跨调用状态路径（`as-0cf03f3aa25d` snapshot:49-61）；production 页又称单机默认 `JsonFileAgentStateStore`、多副本用 `DistributedStore`（`as-66d70ed869dd` snapshot:49-59,84-95）。这是来源间真实冲突，当前研究没有 Java worker 源码来裁决；v2 只能把它画成“取决于 Harness/Service 版本和配置”，不要写一个无条件默认。

恢复机制自身的下一问是：checkpoint 恢复的是 Agent working state，不是 OS thread、正在进行的 network request 或 tool 内部进度；强退后旧 writer lease 释放/过期后新 runtime 才能写。若 `uncertainToolCalls` 指示外部订单可能已经创建，先查业务系统，再用 verified ToolResult reconcile，不要空造 success 或重复执行。Sandbox snapshot、filesystem、session log、Vault key 与外部副作用分别有生命周期；恢复页面/事件观察也不等于恢复进程。

证据：`as-0cf03f3aa25d`（`.../as-0cf03f3aa25d-java-harness-architecture.md.txt:33-61`）、`as-66d70ed869dd`（`.../as-66d70ed869dd-java-production.md.txt:49-95,117-159,297-345`）、`as-e60a2f6c58b3`（`.../as-e60a2f6c58b3-java-harness-session.md.txt:127-170`）、`as-556d0c6a5726`（`.../as-556d0c6a5726-java-service-runtime-host.md.txt:148-183`）、`as-79adbb1a7334`（`.../as-79adbb1a7334-java-service-session.md.txt:197-210,299-325`）。当前局部：`reading.md:588-603,722-737,839-854`；`beats.json:2957-3042,3706-3794,4303-4376`。

## 53 个局部逐项检查

下面每项用 `为什么 / 怎样 / 默认 / 失败` 的顺序给出当前稿是否能经得起下一问。`绿`表示在当前目标颗粒度下足够，`黄`表示可讲但需要补一个影响判断的条件，`红`表示若不补会把实现边界讲错。行号是当前工作树中的 `reading.md` 与 `beats.json`，不是来源源码行号。

### 01 · 项目全貌

1. **`whole`（黄；`reading.md:9-24`; `beats.json:5-85`）**：为什么——把 Agent、Service、Workspace 分开能定位需求；怎样——当前只给职责堆栈，没把消息/状态/文件怎样跨边界连接起来；默认——未显式标出 Python 2.0.10dev 源码、2.0.9 稳定文档及 Service 生产条件；失败——缺少“模型成功但外部交付失败”“X-User-ID 不是认证”的入口。补一条 `AgentState → Service session → workspace/artifact` 状态链。
2. **`docs`（黄；`reading.md:25-41`; `beats.json:86-176`）**：为什么——目录可把业务问题映射到实现层；怎样——构建块/编排/部署/接入四类映射清楚；默认——`/latest/` 开发文档、稳定入口和 Java beta 未显示；失败——目录存在不代表接口同版本或已验证。保留“目录是导航，不是能力承诺”。
3. **`lanes`（黄；`reading.md:42-58`; `beats.json:177-274`）**：为什么——Python Agent/Service 与 Java Harness/Service 的运行所有权不同；怎样——四泳道清楚；默认——Java Service 2.1.0-BETA1、自托管/应用侧运维边界未露出；失败——跨 lane 混用 Session、权限或恢复默认。给 Java Service 加 prerelease 角标。
4. **`migration`（绿；`reading.md:59-74`; `beats.json:275-362`）**：为什么——避免把归档 Runtime/Studio 当现行产品；怎样——历史能力流入 2.0；默认——archive notice 已有事实；失败——未覆盖旧 API 兼容迁移，不能把“迁移”画成自动升级。当前可保留为转场。
5. **`task`（黄；`reading.md:75-91`; `beats.json:363-453`）**：为什么——合同助手例子承载检索、审批、文件交付；怎样——四步业务流顺；默认——业务应用定义规则、授权和接受标准已提到；失败——缺 file capability、Artifact publish、外部回执/未知结果。将“生成候选”和“发布并被接受”分成不同状态。

### 02 · Agent 内核

6. **`agent`（红；`reading.md:94-109`; `beats.json:454-534`）**：为什么——连续工作需要状态；怎样——循环入口和暂停/续接有了，但 AgentState 结构和 parked 条件缺失；默认——序列化 schema、session key、upsert 首次写入缺失；失败——旧快照覆盖 live state、把 resolved SUBMITTED 当 waiting。按上面的重点深审补状态卡。
7. **`message`（黄；`reading.md:110-126`; `beats.json:535-618`）**：为什么——Msg 是持久化/通信单位；怎样——reply 聚合和 content block 有了；默认——各角色可携带的 block、ToolCall/ToolResult 对应 id 未显式；失败——暂停 `finished_reason=None`、数据 block 约束和错误状态未显式。关联 11/14 的状态卡。
8. **`events`（黄；`reading.md:127-143`; `beats.json:619-702`）**：为什么——UI 要增量而不是轮询；怎样——reply/block/tool id、start/delta/end 已给；默认——SSE 交界 subscribe/replay、heartbeat、回放上限未给；失败——错 id/缺目标 block 会跳过，DataBlock 不能字符串拼接。补一个“事件到了但视图不变”的反例。
9. **`react`（黄；`reading.md:144-160`; `beats.json:703-786`）**：为什么——工具结果是下一轮推理输入；怎样——Reasoning/Acting/暂停/结束链清楚；默认——max_iters 总结、structured grace、并发批次等待全部结果未露出；失败——流缺最终 chunk、middleware busy loop、ExceptionGroup 未露出。至少把“暂停≠完成”保留在主层。
10. **`model`（黄；`reading.md:161-177`; `beats.json:787-877`）**：为什么——供应商协议差异要收在 Formatter/Model；怎样——转换、重试、流式统一输出有了；默认——`max_retries+1`、媒体能力和 MultiAgentFormatter 选择未做显式条件；失败——无最终 chunk、取消 partial 不能当完成。保留 provider capability 角标。
11. **`tools`（红；`reading.md:178-194`; `beats.json:878-968`）**：为什么/怎样说得对；默认和失败缺 ToolResponse 聚合细节、ToolCall/Result id/状态结构。按重点深审补一屏“schema → chunk → response → result block”。
12. **`scheduling`（黄；`reading.md:195-211`; `beats.json:969-1059`）**：为什么——独立读取可并发，副作用依赖要串行；怎样——`is_concurrency_safe` 与结果汇合清楚；默认——调度器不自动推断业务依赖已写；失败——属性声明错误、一个 worker 异常如何合并、取消语义未写。当前正文有重复句“生成文件再发布文件”，应删一处。
13. **`permission`（红；`reading.md:212-227`; `beats.json:1060-1145`）**：三种输出有了；优先级、模式矩阵和 safety ASK 规则必须可见，否则“allow 可解除一切”会被误读。按重点深审补。
14. **`hitl`（黄；`reading.md:228-244`; `beats.json:1146-1229`）**：为什么——危险动作/外部执行需要人或外部系统；怎样——asking、事件、续接链清楚；默认——每个 ToolCall 的 reply/tool id、suggested rules、partial confirm 去重未显示；失败——错 id、重新传 schema、外部结果 metadata/schema 不匹配未显示。补“waiting notice 的 `finished_reason=None`”。
15. **`integration`（黄；`reading.md:245-260`; `beats.json:1230-1310`）**：为什么——Python/MCP/Skill 的生命周期和授权不同；怎样——三入口清楚；默认——basic group 永远 active，`reset_tools` 是最终状态而非增量未写；失败——MCP enumerate 失败只撤下该服务、Skill 文本不授予权限。补一个被 reset_tools 隐藏的工具例子。

### 03 · 上下文与协作

16. **`context`（黄；`reading.md:263-278`; `beats.json:1311-1384`）**：为什么——模型只能按本轮输入判断；怎样——system/summary/recent 三层正确；默认——activated tools、runtime state injection、on_system_prompt 顺序未明；失败——必要材料不在本轮而质量下降，不能只换模型。补“工具 schema 取当前 activated group”。
17. **`compression`（黄；`reading.md:279-295`; `beats.json:1385-1468`）**：为什么——长任务要腾 context 空间；怎样——token threshold、摘要、tool result 截短有了；默认——具体 ratio/limit 未核实，system prompt 超阈值会 RuntimeError；失败——丢约束/待办/材料身份改变下一步。把“默认值未核实”留在底稿，不编数字。
18. **`offload`（黄；`reading.md:296-312`; `beats.json:1469-1552`）**：为什么——摘要不能代替原件细节；怎样——保存、引用、按需读回有了；默认——无 offloader 时不会自动获得完整回查，workspace/权限/版本条件未明；失败——同名文件变更或不可读会把旧引用指向新材料。补 `tool_result_limit → path reference`。
19. **`memory`（黄；`reading.md:313-329`; `beats.json:1553-1636`）**：为什么——跨对话保留可复用事实；怎样——middleware static/agent/both 路径清楚；默认——workspace/user/agent/session 边界、ReMe `close()`、无 session_id 不回写未在画面显示；失败——异步写回/检索失败不阻断主回复，结果可能延迟。避免把 memory 说成完整会话重放。
20. **`rag`（绿；`reading.md:330-346`; `beats.json:1637-1727`）**：为什么——知识材料要经索引进入输入；怎样——parser/chunk/embed/search/static/agentic 和 metadata filter 清楚；默认——static Hint 默认不持久化、rerank/top_k/文本 embedding 边界可放细节；失败——可选 parser/worker 后端不一致、DataBlock query 可能被丢弃。当前足够，但要标出 2.0.9/2.0.10dev 并置。
21. **`structured`（黄；`reading.md:347-363`; `beats.json:1728-1811`）**：为什么——字段结果才能进入后续流程；怎样——schema/校验/业务核对分开；默认——schema 是临时工具、`structured_output_grace_iters` 默认 5、重启后 validator/default 语义变化未写；失败——超限后 `structured_output=None` 不能当成功。补一个 `pass schema ≠ business accepted`。
22. **`interrupt`（黄；`reading.md:364-380`; `beats.json:1812-1902`）**：为什么——停止等待和撤销副作用是两件事；怎样——running cancel、parked UserInterrupt、保留记录有了；默认——HTTP 202 只是接受请求、idle no-op、parked 清理 pending calls 未完整；失败——外部操作继续、恢复前要查 receipt。补“终态查询”。
23. **`middleware`（黄；`reading.md:381-397`; `beats.json:1903-1986`）**：为什么——审计、计费、fallback 不必改 loop；怎样——生命周期插槽和 on_acting 边界正确；默认——on_system_prompt transformer 与 onion before/after 顺序未展开；失败——后台化 state-injected tool 可并发突变，hook 失败/结束事件吞掉可能造成 busy loop。当前应保留为局部深度，不再扩展组件名。
24. **`pipeline`（黄；`reading.md:398-414`; `beats.json:1987-2070`）**：为什么——执行结果要由 verifier 判定；怎样——executor/report/verifier/feedback 有了；默认——verifier_reset_context、预算属于 pipeline instance 未显式；失败——verifier 自己可能失败、需工具/HITL，pass 不是业务接收。补“不可判定 impossible”。
25. **`team`（黄；`reading.md:415-431`; `beats.json:2071-2161`）**：为什么——分工、并行和汇总；怎样——leader/member/reply-id 路由有了；默认——同一 member assignment 串行、不同 member 可并发、leader 结束默认清理 member context 未显式；失败——成员权限仍生效、结果只允许 text/data，不能暗示共享 filesystem。关联 Java Artifact。
26. **`plan`（黄；`reading.md:432-448`; `beats.json:2162-2252`）**：为什么——复杂工作需剩余步骤和 SOP 约束；怎样——计划与 verifier 推进有了；默认——Plan Mode 的只读/HITL 与 SOP 状态未细化；失败——用户输入变化可能改计划而非重跑已完成步骤，不能只看 completed label。当前可保持概念层。

### 04 · Python 服务

27. **`service`（黄；`reading.md:451-466`; `beats.json:2253-2326`）**：为什么——把 Agent loop 接成多用户服务；怎样——FastAPI/ChatService/Storage/Bus/Workspace 三层有了；默认——create_app 三个核心依赖、`/chat` fire-and-forget、SSE out-of-band 未都显式；失败——缺 bus/storage/workspace 或分布式 WIP，不是“自动生产化”。
28. **`identity`（黄；`reading.md:467-483`; `beats.json:2327-2417`）**：为什么——资源归属需要可信 caller；怎样——X-User-ID、ResourceAccess、DenyAll、共享边界有了；默认——header 不认证、download_secret 跨副本条件未在本局；失败——401/404/403、shared agent 不等于共享 workspace/MCP/Memory。补一张权限层级小卡。
29. **`sessions`（红；`reading.md:484-500`; `beats.json:2418-2501`）**：为什么/怎样方向正确；默认和失败缺锁 lease、读取顺序、回放 cap、持久化后释放锁。按重点深审补。
30. **`background`（红；`reading.md:501-517`; `beats.json:2502-2585`）**：为什么/怎样方向正确；默认和失败把进程 watcher、inbox+wakeup、ToolStop/session guard、restart 丢失写清。按重点深审补。
31. **`workspace`（黄；`reading.md:518-534`; `beats.json:2586-2676`）**：为什么——文件/MCP/skill/终端要有共享粒度；怎样——per_agent/per_session/per_user 有了；默认——per_agent 默认、MCP 按 agent+session、skill 按 agent 隔离未完整；失败——Local 是 host filesystem/zero sandbox，多副本 cache 不共享，TTL 会冷启动。补“路径不是授权”。
32. **`sandbox`（黄；`reading.md:535-551`; `beats.json:2677-2767`）**：为什么——权限和执行位置不同；怎样——workspace backend 到 sandbox 有了；默认——Local 无隔离、Bubblewrap 仍共享 host network、第三方 backend 要账号/配额未露出；失败——网络/挂载/secret/egress 不由权限 engine 自动解决。当前可加一条反例。
33. **`deployment`（绿；`reading.md:552-568`; `beats.json:2768-2865`）**：为什么/怎样/默认——scheduler 单 timer owner、shared download_secret、RAG 后端一致、ProcessPool 已覆盖；失败——分布式文档 WIP、共享后端不等于 HA/SLA。已接近可交付深度。
34. **`observability`（黄；`reading.md:569-585`; `beats.json:2866-2956`）**：为什么——事件、消息、trace 解决不同问题；怎样——reply/LLM/tool spans 有了；默认——未 setup tracing 时透传、streaming 要等最后 chunk 关闭 span 未显式；失败——没有证据证明 OSS 自带 retention/PII redaction/告警/SaaS backend。保留客户运维边界。

### 05 · Java 企业接入

35. **`java-01-harness-context`（红；`reading.md:588-603`; `beats.json:2957-3042`）**：为什么/怎样——RuntimeContext、Builder、AgentState 关系清楚；默认——EVENT_LOG 与 JsonFileAgentStateStore 来源冲突，不能合并；失败——缺 userId/sessionId 会串状态、共享 storage 不自动协调 direct calls。标 unresolved。
36. **`java-02-agent-session`（黄；`reading.md:604-620`; `beats.json:3043-3134`）**：为什么——直接调用和后台会话的执行所有权不同；怎样——call/streamEvents/AgentSession/respond/resume 有了；默认——观察不启动 inference、session manager 持有实例、close 会停止调度未完全露出；失败——已完成/取消不能 resume、checkpoint 不恢复 thread/tool progress。补一条。
37. **`java-03-execution-targets`（黄；`reading.md:621-637`; `beats.json:3135-3233`）**：为什么——Managed/External/Hosted 选择运行所有权；怎样——共同 Session/Turn 观察面有了；默认——capabilities 必须查询、External registration preview/未认证、Hosted provider 条件未显示；失败——catalog visibility ≠ dispatch，OpenClaw 无 Session resume。补“能力查询”。
38. **`java-04-session-turn-idempotency`（红；`reading.md:638-654`; `beats.json:3234-3325`）**：为什么/怎样的对象关系对；默认——accepted/applied/202 queued/key+body/queue barrier 缺失；失败——重复 POST 制造第二个 Turn、修改 frozen target 不影响既有 Session。按重点深审补。
39. **`java-05-snapshot-sse-cursor`（黄；`reading.md:655-671`; `beats.json:3326-3417`）**：为什么/怎样——snapshot→as_of→SSE→410 已清楚；默认——cursor 资源专属已写，但 snapshot shape、delta/complete replacement、终态以 Turn 而非工具决定未显式；失败——重投任务会重复执行。补一个 UI 重建例子。
40. **`java-06-interaction-capabilities`（黄；`reading.md:672-688`; `beats.json:3418-3516`）**：为什么——控制入口会改变任务语义；怎样——steer/inject/actions/resume 有了；默认——先读 capabilities/available_commands、accepted receipt≠applied 未完整；失败——pending action request_id/expected_version 错会拒绝，Hosted 能力不同。补到屏幕。
41. **`java-07-files-artifacts`（红；`reading.md:689-704`; `beats.json:3517-3602`）**：为什么/怎样方向正确；默认缺 file_input/16 MiB/session binding/显式 publish；失败缺跨 Session 引用、Host disk、completed≠valid deliverable。按重点深审补。
42. **`java-08-auth-grant-registration`（黄；`reading.md:705-721`; `beats.json:3603-3705`）**：为什么——Account/Namespace/应用凭证/External runtime credential 分层；怎样——三条链和初始 registration 未认证有了；默认——Access preview、application key 不替代用户 Namespace permission、credential rotation 未显示；失败——404/403/可发现/可调用/可读工作需分开。补 preview 角标。
43. **`java-09-recovery-capabilities`（红；`reading.md:722-737`; `beats.json:3706-3794`）**：为什么/怎样方向正确；默认——capabilities/pending/uncertain outcomes、writer lease、checkpoint 限制缺；失败——恢复不撤销副作用。按重点深审补。
44. **`java-orchestration`（黄；`reading.md:738-753`; `beats.json:3795-3868`）**：为什么——Subagent/Team/Workflow 是不同持续性层级；怎样——职责与 Artifact 传递有了；默认——Automation 不能直接 target Workflow、channel 能力变化未在局部；失败——成员不共享 filesystem，取消/retry 不回滚外部效果。当前可与 41 联动。
45. **`java-issue`（黄；`reading.md:754-770`; `beats.json:3869-3959`）**：为什么——执行与业务接受要有同一工作记录；怎样——Issue→Run/Node/Attempt→accept/return 有了；默认——Issue sharing、artifact/acceptance 依赖未显式；失败——到达无结果时不能只看聊天，要查等待/缺输入/partial artifact。当前基本够用。
46. **`java-auth-scope`（黄；`reading.md:771-787`; `beats.json:3960-4043`）**：为什么——资源 use 与工作 read 是不同授权；怎样——Account/Namespace/resource/work 四层有了；默认——Issue `private/namespace/shared` 与 contributor/reader 未露出；失败——404/403、依赖资源权限和 admin 非默认 reader。补一条诊断例子。
47. **`java-budget`（黄；`reading.md:788-804`; `beats.json:4044-4127`）**：为什么——预算决定可继续到哪一步；怎样——model calls/usage/parallel calls 有了；默认——文档示例的 30 calls/100000 tokens 是例子，不是系统默认，pricing 才能算 cost；失败——unpriced calls、已启动 parallel calls 不会被强截断。不要把额度调整说成自动 resume。
48. **`java-channels`（黄；`reading.md:805-821`; `beats.json:4128-4211`）**：为什么——外部对话要映射到稳定任务；怎样——接收/路由/观察/回传有了；默认——Feishu 当前 Issue 只接 Agent/Team、Automation 与 Channel 独立；失败——其他 adapter 能力不继承，Workflow 需发布后 Session API。当前基本够用。
49. **`java-webhook`（绿；`reading.md:822-838`; `beats.json:4212-4302`）**：为什么——至少一次投递必须去重；怎样——签名、时间、event id、持久后 ack 有了；默认——delivery at-least-once；失败——通知成功不证明邮件/支付/外部写入提交，业务动作要自己的幂等。已够用。
50. **`java-storage`（绿；`reading.md:839-854`; `beats.json:4303-4376`）**：为什么——恢复要保持数据、文件和解密能力一致；怎样——DB/workspace/artifact/Vault key 组合有了；默认——同一备份点和匹配版本、先停写；失败——只开知识问答不能证明 credential/Vault/runtime 恢复，恢复不撤销后续外部写入。已够用。

### 06 · 从机制到方案

51. **`failure`（黄；`reading.md:857-873`; `beats.json:4377-4467`）**：为什么——失败闭环要沿原任务身份走；怎样——补依据、权限拒绝、回执查询、去重、输入改变有了；默认——accepted/applied/completed/unknown/published/accepted 的状态词未完全统一；失败——没有把每种失败映射到具体 `ToolResultState`、Turn/Attempt 或 Artifact。用前述状态例子收束。
52. **`delivery`（黄；`reading.md:874-890`; `beats.json:4468-4558`）**：为什么——输入/动作/状态/交付契约让业务可验收；怎样——四契约映射清楚；默认——file capability、Artifact ID/version、业务 acceptance 未显式；失败——生成候选、发布文件、业务接受和外部回执仍可能分离。把 `completed` 与 `accepted` 分开。
53. **`end`（黄；`reading.md:891-905`; `beats.json:4559-4640`）**：为什么——把构建、托管和接入业务收束；怎样——三层总结清楚；默认——两条实现路线的版本/所有权条件不再可见；失败——没有最终“观察断线不重跑、恢复不回滚副作用、交付要 Artifact/验收”的三条硬边界。结尾应重复而不是抽象掉。

## 可直接交给 v2 分镜的八个状态例子

这些例子不是运行录屏；它们来自固定文档/源码机制，用于让画面承载下一问。

1. **AgentState parked**：`S-17/R-4/C-9=ASKING`，UI 显示“awaiting permission”，`finished_reason=null`；批准事件带原 `reply_id`/`tool_call_id` 回到同一 reply。
2. **ToolResponse aggregation**：`chunk b1: "uploading "` + `chunk b1: "report.pdf"` → 单个 TextBlock；`ERROR` 后 `SUCCESS` → final state 仍 `error`。
3. **Permission mode**：同一 `Write(/workspace/a.md)` 在 DEFAULT→ASK、EXPLORE→DENY、BYPASS→按显式 guardrail/工具结果可能 ALLOW、DONT_ASK→DENY；四条箭头经过同一个优先级 gate。
4. **Background wakeup**：`C-9 → B-7` 进入 watcher；页面断开；`B-7 completed → inbox(S-17)+wakeup → lock → next reasoning`；进程重启则 watcher 不自动复原。
5. **Replay seam**：SSE 先建立 subscription，再 replay cursor 之后的 log；交界同一个 `_entry_id` 只应用一次；live pub/sub 本身不补离线历史。
6. **Java Turn**：`202 queued / input.accepted` 与 `input.applied` 分两帧；T1 等批准时 T2 排队；`same idempotency key + same body` 取回 T1，new key 才是 T2。
7. **Artifact**：`file_id F-1` 作为输入；workspace 结果 `F-2` 经 publish 生成 `Artifact A-7`；只有读取 A-7 的 metadata/权限后下载，Lead 不因同名路径看到成员文件。
8. **Recovery**：`checkpoint + uncertainToolCall C-9`；先查业务系统得到真实外部结果，再 reconcile，之后 resume；不画“回滚邮件/订单”。

## 没有核到的部分

- 没有核到 Java Service 全部 router、实际 worker/lease 实现和所有 API schema；Java 结论主要来自固定官方页面与选定 Harness/Runtime Host 资料。
- 没有裁决 Java `EVENT_LOG/native checkpoints` 与 `JsonFileAgentStateStore` 的默认冲突；需要同版本 Harness worker/source 或明确版本说明后再做唯一默认画面。
- 没有核到 Python Service 所有 Storage/Redis backend 的生产 HA、SSE retention、跨租户 auth/RBAC、PII redaction、审计、SLA、告警和成本治理；这些不能从 connector 或“multi-tenant”宣传推出。
- 没有运行 provider、MCP、RAG vector store、ReMe/Mem0、OpenTelemetry exporter、Docker/E2B/K8s、Java Runtime Host 或目标项目测试；不报告性能、连通性、实际恢复成功率。
- 没有覆盖 TTS/realtime provider、A2A、完整 formatter/provider 差异、全部 tool-level parser 和商业版/付费支持；无 TTS 要求已遵守。
- 没有对受众理解做测试；“可经得起下一问”是固定源和当前文字的结构审阅，不是用户测试结果。

