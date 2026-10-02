# Orchestra / 本地 Agent CLI 外部研究

研究日期：2026-09-25。Luna 只查官方 GitHub README、release、docs 和固定 commit 的关键源码；Exa 搜索 `numResults` 总和为 125，另对命中 URL 做了定向抓取。本文是候选证据和机制交接，不是用户已指定项目、安装建议或 Astra 的架构采纳。

## 先定身份

| 候选 | 固定来源 | 与本请求的匹配 | 身份置信度 | 结论边界 |
|---|---|---|---|---|
| **proboscis/orch** | `v1.8.3-beta` · `b1a6c1628fea02ad56347d4df9a7e1bef4e2b65d`；release 2026-07-15 | 最匹配：明确管理 Claude/Codex/Gemini/OpenCode 的 Issue/Run/Event、worktree、后台 worker 和终端会话 | **高** | 用户没有给仓库 URL；不能把它写成用户所指或默认依赖 |
| **reidliu41/agent-workbench** | tag `0.1.12` · `4c6f7b7d937873fb3b546cd616a1a7edad55e3f7`；无 targeted Exa release 命中 | 相邻参考：本地 web 工作台、多项目/多 session、native terminal、worktree、resume/import | **中高** | 版本是 Git tag/source 固定；未找到官方 release 页，未运行验证 |
| **yedidya-buildfy/ai-orchestra** | `main` · `107b590f4404bed258edeed493feb42fbc7f6a72`；package `1.4.0` | 同名相邻参考：Claude/Codex/Gemini + tmux + Markdown brain + token refresh | **仓库高，用户意图低** | 与 Courtwork 内部 Orchestra 方向无证据关联；共享 workspace、默认 bypass、无 worktree |

Courtwork 的 `ARS-LOCAL-02` 是自身的 Local Agent Orchestra 组合方向，不是上述任何外部仓库，也不是已实现的第六层或第二 ledger。研究边界和本地裁决入口见 [本地方向快照](../../snapshots/agent-runtime-survey-20260925/local-context/orchestra-direction-20260919.md.txt)。

证据登记见 [orchestra-sources.json](orchestra-sources.json)；官方来源的研究摘录见 [外部快照目录](../../snapshots/agent-runtime-survey-20260925/orchestra/README.md)。`.txt` 快照是 `curated-research-extract`，基于官方内容的整理/改写，不是逐字原件，也不声称离线可运行。

## 已核实的实现方式

### proboscis/orch：最接近的管理器

它把一个工作项拆成 Issue → Run → append-only Event；Run 有独立 branch/worktree 和 terminal multiplexer session。daemon 负责 issue/run/event 状态与 project identity，worker 在执行主机启动并监督 agent；本机 worker 可按需自启，远程 TCP/多 host 虽有实现但仍超出 beta 支持范围。[ARS-ORCH-S01][ARS-ORCH-S06]

transport 有意按 CLI 分化，而非假设一个 SDK ABI：Claude、Codex、Gemini 默认经 tmux/zellij 运行；OpenCode 启动本地 headless HTTP server，通过 `/global/health`、`/session`、`/message`、`/abort` 和 SSE `/event` 交互。[ARS-ORCH-S03][ARS-ORCH-S04][ARS-ORCH-S05]

会话身份是可回收性的前提。Claude 在 launch 时 mint 并传 `--session-id`，Codex 启动后从 `$CODEX_HOME` rollout metadata 按 worktree 解析 session ID；两者以 `agent_session` artifact 写入事件。缺失 Codex identity 会记录 error 并使 Run 保持不可 reap，而不是猜一个 ID。Gemini 没有这个 identity seam，OpenCode 使用自己的 `opencode_session` artifact。[ARS-ORCH-S06][ARS-ORCH-S07]

ADR-0005 将 multiplexer session 当 disposable cache：reaper 先保存 pane snapshot、写 `session_reaped`，再 kill；只有存在 native session identity 且 worktree 仍存在才可 reap。`send`/`attach` 对同一 Run 原地 revive，Claude/Codex 继续同一 native conversation，不以 fork 代替 resume。状态事件区分 `unknown` 的 `never_alive`、`session_lost`、`agent_exited` 等原因；这套 ADR 在源码中仍标为 proposed，不能当成已在本机验收的事实。[ARS-ORCH-S07]

OpenCode 的多 provider 路由只在 adapter/client 看到：`provider/model` 拆成 `ProviderID + ModelID`，每次 prompt 可携带 model 和 variant，状态映射 busy/idle/retry，HTTP 请求做有限 exponential retry。由此可借鉴“provider/model 路由属于 executor 的协议层”的边界；不能把 orch 说成通用 provider gateway，也不能把 HTTP retry 自动当成工具副作用安全。[ARS-ORCH-S04][ARS-ORCH-S05]

### Agent Workbench：native session UI 参考

Workbench 的 core 创建 task/session 时先校验 backend，再用 `git worktree add -b` 建立每 session 的 worktree/branch；导入 Gemini/Qwen 时会把历史桥接到新 worktree。服务器启动时检查 stale task：如果进程不在，保留 diff 并改成 `review_ready`（有改动）或 `failed`（无改动），而不是伪造 session 仍在运行。[ARS-ORCH-S08][ARS-ORCH-S10]

真正的 native terminal 由 Fastify/WebSocket 服务器中的 `node-pty` 管理。PTY handle 按 task/channel 保存在内存，输出 buffer 广播给浏览器，exit 记录 event 并刷新 diff；输入、resize、stop 直接落到 PTY，已有 handle attach 时复用，restart 时 kill 后重建。native session ID 从终端输出提取，并在进程存活期间每 5 秒轮询候选。[ARS-ORCH-S09]

各 CLI 的命令语义被显式写在 provider switch：Claude 先 `--session-id` 后 `--resume`；Codex 通过 rollout metadata 绑定再 `codex resume`；Qwen 先固定 ID 并桥接历史；Copilot 用 `--resume=<id>`；Gemini 可 resume。Claude/Codex/Qwen/Copilot 的 adapter 主要宣告能力并把 slash command、权限、skills 留在 native terminal；只有 Gemini ACP 路径提供 typed tool event 和 approval ID，其他 approval 仍在 CLI 内。[ARS-ORCH-S08][ARS-ORCH-S09][ARS-ORCH-S11]

因此它适合作为“native session + worktree + review/diff + restart recovery”的产品参考，但不是已经统一了跨 CLI 语义的 runtime port：generic PTY fallback 是 task-scoped child process，没有结构化 conversation、approval 或持久 terminal registry。[ARS-ORCH-S09]

### AI Orchestra：context refresh 参考，不宜直接采用

AI Orchestra 用 Node 子进程调用 tmux；每个 CLI 一个固定 session、pipe-pane buffer 和 JSON metadata。`orc rename` 从各 CLI 的本地 session store 找最近 conversation ID，存入 `~/.config/orc/sessions.json`；`orc resume` 按 CLI 重新组合 resume command。这个 registry 是 workspace/name → native IDs 的映射，不是统一 Session/Run ledger。[ARS-ORCH-S12][ARS-ORCH-S13]

watcher 监听 `.orchestra/board.md`，用 writer lock、debounce 和 self-write hash 防止自触发；refresh 会先把 agent block 与最近 50 行 pane output 写入 memory/changelog，再 compress、kill tmux、respawn、注入 protocol/memory/board/objective，最后做 bounded `isAlive` 检查。[ARS-ORCH-S13][ARS-ORCH-S14]

它默认把 Claude/Codex/Gemini 置于 bypass/YOLO 模式，多个 agent 共享一个 workspace，没有 per-agent worktree、结构化 approval/event 协议或 provider gateway。board 的 picomatch scope 只是编排层 helper；本次没有证据证明 child CLI 会遵守这些 scope。因此可借鉴 snapshot → rehydrate → verify 的流程，不应复制其共享编辑面和默认权限旁路。[ARS-ORCH-S12][ARS-ORCH-S13]

## 跨候选比较

| 维度 | `proboscis/orch` | Agent Workbench | AI Orchestra |
|---|---|---|---|
| 进程/协议 | tmux/zellij；OpenCode 是本地 HTTP/SSE | `node-pty` native terminal；Gemini ACP 是结构化例外 | tmux CLI subprocess |
| session 发现/恢复 | Claude mint；Codex rollout resolve；事件记录；reap/revive ADR | 输出/metadata 绑定；原生 import；Qwen history bridge；stale diff fallback | 本地 session store + global registry；refresh 主要是新 generation |
| 隔离 | 每 Run branch/worktree；远程 worker 另有 target | 每 session branch/worktree | 共享 workspace；无 worktree |
| 状态/事件 | append-only Event fold，`unknown` reason，daemon/worker lease | task/event + overview；provider approval 多为 native | board/changelog/log；无统一结构化 tool/approval protocol |
| approval | gate/waiting 与 native CLI；OpenCode 由 server 状态观察 | Gemini ACP 可在 Workbench 显示 approval；其他 CLI 保留 native | 默认 bypass；scope helper 不等于执行强制 |
| 失败/重连 | worker heartbeat/lease；reap 需 stored revivability；native resume | PTY exit + diff recovery；server restart 后 review fallback | refresh kill/respawn + liveness；共享状态依赖文件 |
| 多 provider | 通过 OpenCode 的 provider/model，不是 orch 自有 gateway | provider 选择是 CLI backend，未统一 gateway | 无 provider routing |

跨 CLI 的共同事实是“命令和 native session 语义必须逐 provider 适配”；显示一个终端、记录一个 UUID 或接受一个 HTTP ACK，都不足以证明工具、权限、取消、usage 和历史完全等价。[ARS-ORCH-S03][ARS-ORCH-S08][ARS-ORCH-S13]

## 给 Astra 的候选处置（待裁决）

1. **登记 `proboscis/orch` 为主参考，不直接采纳。** 可回查的增量是：Host/Runtime Adapter 分离、Run 级 worktree、append-only observation、native identity 的 stored fact、reap 前快照与 explicit unknown。阻塞因素是 beta、evaluation-only 未定 license、远程 TCP 未认证，以及 ADR-0005 仍是 proposed。若登记工单，应要求一个现有 Session/Run owner、一个受控 executor consumer、一个 failure/unknown 反例和真实测试退出证据。
2. **登记 Workbench 的两个可比机制。** 一是 PTY/native terminal 与 provider-specific session binding，二是 server restart 后保留 worktree diff 的 review fallback。可考虑回查当前 Runtime Adapter/Session executor choice；不要新增一套 Workbench ledger，也不要把 terminal attach 当统一 approval。
3. **仅选择性参考 AI Orchestra。** snapshot → rehydrate → verify 和 named native-session registry 对 context pressure 有启发；其共享 workspace、默认 permission bypass、无 worktree/structured approval 应明确标为不可照搬。
4. **将 OpenCode 路由放回 gateway lane。** 当前只核实了 orch 如何把 provider/model/variant 交给 OpenCode，以及 health/status/SSE/retry 边界；没有核实 OpenCode 各 provider 的真实兼容性、凭据、工具调用或副作用重试，不能另立“网关已可用”结论。

## 未覆盖

没有安装或运行任何外部项目；没有真实 CLI、账号、provider、PTY、worktree、SSE、approval、reap/revive 或多 host 实测；没有比较性能、跨平台、并发或安全性。没有用户指定的确切仓库 URL，因此三候选的“用户意图匹配”仍待确认。完整源码、依赖、二进制和网页 renderer 未快照；源码摘录由官方材料整理而来，不能替代逐字原件。

