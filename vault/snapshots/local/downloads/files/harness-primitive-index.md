# Fresh Courtwork — Harness Core Explore 01

**日期：2026-09-06 · 状态：只读 breadth-first reconnaissance / 候选架构裁决**

本文件是外部机制索引，不是施工指令，不改变 V8、G1/G2、server/runtime/Core 或夺舍时序。当前施工位置来自用户 handoff；本轮没有查验或改动本地工作树。

## 0. 裁决摘要

**不要新写通用 Agent loop；也不要把四个仓库的内部状态机拼成一个新 framework。** 每次 Run 只保留一个执行宿主，使 loop、session writer、tool lifecycle 与进程所有权一起闭合；跨项目复用优先发生在公开 adapter、独立 browser/sandbox、UI contract 与领域语义层。

候选并列为 Pi 的薄 Agent / 既有 coding-agent 接口、Codex app-server、OpenCode server 和 DSH sdk-minimal。它们是不同封装粒度，不是“哪一个项目赢了”。Pi 新 AgentHarness 的耐久操作机制值得优先阅读，但 v4 仍 WIP，不能由包已发布推断它已适合承担正式状态。

Fresh Courtwork 暂只拥有：Matter binding、当前有效状态与版本、Context/Review projection、工作 Authority/Evidence/Completion 判据、typed commit/reject/revise 边界。通用存储引擎、模型适配、消息流、工具执行、浏览器和隔离设施优先复用。上述“拥有”表示语义责任，不要求新增服务或物理数据库。

## 1. 证据与范围

本轮读取了四个主干的固定版本源码片段、导出/类型、架构/协议文档，以及 Pi 的一个相关 issue 与评论。补充项目只作有界发现或官方机制阅读。**没有启动 GUI、调用模型跑任务、测真实 traffic、执行 crash/cancel/reconnect/安全测试，也没有完成源码全面审计。** 下文“有”只表示已观察到某接口或机制，不表示它已通过 Fresh Courtwork 验收；“未核”不表示项目没有。

当前 SE 基线是用户提供的 2026-09-06 / 9.4 三份文件。Canonical §13.2 的 canonical owner、Practice §3.1 的 host adapter、§7.3 的测试边界已经足够承接这些观察。此轮不建议扩大 Canonical，也不把外部宿主术语直接提升为专业工作 ontology。

版本元数据通过 GitHub API 核对。网页缓存曾提供较旧的 latest 标签，故不用于“最新版本”判断。下表发布日期为 UTC；2026-09-04 深夜发布的 Codex/OpenCode 在新加坡已是 9 月 5 日。

| Project | Frozen baseline | Commit | License | Activity / readiness observation |
|---|---|---|---|---|
| Pi | v0.85.1 | d981de1229ef | MIT | 2026-09-05T12:29:01Z |
| DeepSeek Harness | developer preview; pinned master snapshot | d347e703908d | MIT | preview + 固定 head；不宣称已核定 latest release |
| OpenAI Codex CLI | rust-v0.153.4 | 3d2ee51ca2d5 | Apache-2.0 | 2026-09-04T23:25:48Z |
| OpenCode | v1.18.29 | 02a167e048d3 | MIT | 2026-09-04T23:47:16Z |

版本/许可证入口：[PI-RELEASE](https://api.github.com/repos/earendil-works/pi/releases/latest) · [PI-TAG](https://api.github.com/repos/earendil-works/pi/git/ref/tags/v0.85.1) · [PI-ROOT](https://github.com/earendil-works/pi) · [DSH-HEAD](https://api.github.com/repos/deepseek-ai/deepseek-harness/git/ref/heads/master) · [DSH-LICENSE](https://github.com/deepseek-ai/deepseek-harness/blob/d347e703908d0406b7a7ef80e3a0e594d86b2215/LICENSE) · [CX-RELEASE](https://api.github.com/repos/openai/codex/releases/latest) · [CX-TAG](https://api.github.com/repos/openai/codex/git/tags/042fb41b7c813ac7999105e886b2b7aa715b5081) · [CX-ROOT](https://github.com/openai/codex) · [OC-RELEASE](https://api.github.com/repos/anomalyco/opencode/releases/latest) · [OC-ROOT](https://github.com/anomalyco/opencode)

## 2. Harness Primitive × Project Coverage Matrix

Pi 的 **Agent**、**C3（coding-agent v3 session）**、**H4（新 durable AgentHarness v4）** 分开判断。同名对象不保证语义相同：简单 Pi Agent 的 turn 通常是一轮模型调用和工具；DSH step 与它更接近，DSH/Codex 的 turn 则可包含多次模型调用。不要用名称相同实现一对一映射。

| Primitive | Pi：Agent / C3 / H4 | DSH | Codex | OpenCode |
|---|---|---|---|---|
| Loop / provider | Agent + pi-ai；H4 另评 | agent-loop / llm service | run_turn / model-client；外部 host | processor / LLM / provider 服务 |
| Tool lifecycle | pre/after hooks、并发与结果顺序 | guard + pre/around/post + normalize | ToolRouter / approval 的宿主边界 | ToolPart / permission / snapshot |
| Shell / FS | 默认进程权限；隔离外置 | 同一 execution world | command / file-change items；进程树未测 | 宿主工具/终端；进程树未测 |
| Browser / computer | 外置/extension；原生覆盖未核 | capability 可替换；实际覆盖未核 | 本轮未核全部原生 browser/computer API | 外置/extension；实际覆盖未核 |
| Persistence | C3 JSONL；H4 transactions/WIP | SessionHandle + JSONL + flush | ThreadStore；JSONL + SQLite metadata | Session state + 选择性 durable events |
| Resume / fork | C3 条目树；H4 replay policy/fork 未全 | 有效前缀 + interrupted repair | thread/resume、thread/fork | session API；副作用恢复未核 |
| Concurrent ownership | H4 host-owned single writer | write handle/lease 边界 | writer/metadata 单入口；跨进程待核 | aggregate seq/owner 接口；wire/CAS待核 |
| Context | transformContext / convertToLlm | logged input + deriveMessages | compaction / tools / plugins 接缝 | compaction + processor；治理投影待核 |
| Permission | 不自带 OS 权限；hook 可接 | approval + monotonic guard + sandbox seam | approval / sandbox policy | allow / ask / deny；不等于 OS sandbox |
| Streaming / events | 细粒度 loop event；H4 watchSession 未实现 | transient agent stream + durable settlement | Thread / Turn / Item | EventV2 / aggregate cursor / sync bridge |
| Status | API层次需区分；H4观察词汇有债务 | live status、durable turn ending | loaded/notLoaded 与 turn terminal | idle / busy / retry；不能当成果状态 |
| Extension | Agent/tool hooks；C3 extension 数据 | Cordis profile/bundle/scope | MCP / skills / plugins；部分 experimental | Plugin.Service；内部 Effect 耦合 |
| Usage / cost | pi-ai Usage；H4 ledger | telemetry seam；计费完整性未核 | token usage；估价口径仍需区分 | Usage 输入；完整计费闭合未核 |
| GUI bridge | 既有 SDK/RPC 候选；H4不假设完整 | web / SDK / ACP profiles | app-server；stdio优先 | HTTP/OpenAPI/SSE；durable wire待核 |
| Runtime verifier | hook/stop接入，不提供专业成立性 | turn-stopping/validation接缝 | 工具/执行结果，不等于工作接受 | 工具/快照/重试，不等于工作接受 |
| Matter / work commitment | 未证明原生完整提供 | 未证明原生完整提供 | project/thread不等于Matter | workspace/session不等于Matter |

覆盖证据：[PI-LOOP](https://github.com/earendil-works/pi/blob/v0.85.1/packages/agent/src/agent-loop.ts) · [PI-AGENT-DOC](https://github.com/earendil-works/pi/blob/v0.85.1/packages/agent/README.md) · [PI-RPC](https://github.com/earendil-works/pi/blob/v0.85.1/packages/coding-agent/docs/rpc.md) · [PI-V3](https://github.com/earendil-works/pi/blob/v0.85.1/packages/coding-agent/src/core/session-manager.ts) · [PI-HARNESS-SPEC](https://github.com/earendil-works/pi/blob/v0.85.1/packages/agent/docs/harness.md) · [DSH-ARCH](https://github.com/deepseek-ai/deepseek-harness/blob/d347e703908d0406b7a7ef80e3a0e594d86b2215/docs/architecture.md) · [DSH-PERSIST](https://github.com/deepseek-ai/deepseek-harness/blob/d347e703908d0406b7a7ef80e3a0e594d86b2215/docs/subsystems/persistence.md) · [DSH-TOOLS](https://github.com/deepseek-ai/deepseek-harness/blob/d347e703908d0406b7a7ef80e3a0e594d86b2215/docs/tool-execution-pipeline.md) · [CX-APP](https://github.com/openai/codex/blob/rust-v0.153.4/codex-rs/app-server/README.md) · [CX-STORE-DOC](https://github.com/openai/codex/blob/rust-v0.153.4/codex-rs/thread-store/README.md) · [CX-TURN](https://github.com/openai/codex/blob/rust-v0.153.4/codex-rs/core/src/session/turn.rs) · [OC-PROCESSOR](https://github.com/anomalyco/opencode/blob/v1.18.29/packages/opencode/src/session/processor.ts) · [OC-EVENT](https://github.com/anomalyco/opencode/blob/v1.18.29/packages/core/src/event.ts) · [OC-STATUS](https://github.com/anomalyco/opencode/blob/v1.18.29/packages/schema/src/session-status-event.ts) · [OC-SERVER](https://opencode.ai/docs/server/) · [OC-PERMISSION](https://opencode.ai/docs/permissions/)

## 3. 按 primitive 排列的 mechanism cards

卡片的 Adopt / Thin-adapt 都是**候选采用方式**，不是已经安装或通过验收。跨项目借机制默认 Reference only；只有实际缺口经验证后，才升级为自实现任务。

### Agent loop / provider

#### K01 · Agent / agentLoop 与 pi-ai 的分离

**Project**：Pi

**Version / commit**：v0.85.1 / d981de1229ef

**License**：MIT

**Primary purpose**：通用执行/互操作机制；不自行授予专业工作效力

**Relevant mechanism**：Agent / agentLoop 与 pi-ai 的分离

**Source location**：[PI-LOOP](https://github.com/earendil-works/pi/blob/v0.85.1/packages/agent/src/agent-loop.ts) · [PI-AGENT-DOC](https://github.com/earendil-works/pi/blob/v0.85.1/packages/agent/README.md) · [PI-ROOT](https://github.com/earendil-works/pi)

**How it works**：循环处理模型输出、工具调用与排队输入；转换为 provider message 的位置位于模型调用边界。Agent 与较新的 durable AgentHarness 是不同层。

**Useful for Fresh Courtwork**：优先验证薄执行候选；保留现成 provider 适配，不把专业语义写进模型循环。

**Costs / coupling**：只使用 Agent 不会自动得到持久化、进程隔离或跨进程恢复；选择 coding-agent SDK 与选择裸 loop 的补齐成本不同。

**SE compatibility**：Thin-adapt（优先验证候选）

**Confidence**：源码入口高；完整产品适配成本中，未实跑

**Open questions**：当前 SDK/RPC 对所有必需状态是否有稳定出口？；工作表面的上下文注入能否不 patch loop？

### Tool lifecycle

#### K02 · preflight / execute / normalized result / ordered events

**Project**：Pi

**Version / commit**：v0.85.1 / d981de1229ef

**License**：MIT

**Primary purpose**：通用执行/互操作机制；不自行授予专业工作效力

**Relevant mechanism**：preflight / execute / normalized result / ordered events

**Source location**：[PI-AGENT-DOC](https://github.com/earendil-works/pi/blob/v0.85.1/packages/agent/README.md) · [PI-LOOP](https://github.com/earendil-works/pi/blob/v0.85.1/packages/agent/src/agent-loop.ts)

**How it works**：公开接口提供 beforeToolCall、afterToolCall、AbortSignal 与流式工具更新；文档区分并发完成顺序和结果进入模型历史的顺序。

**Useful for Fresh Courtwork**：薄适配工具注册、结果格式与检查点；不要由 UI 根据文本猜工具终态。

**Costs / coupling**：钩子不是 OS sandbox；后置钩子不能阻止已经发生的副作用。批次顺序及取消时机需回归。

**SE compatibility**：Thin-adapt

**Confidence**：接口文档高；边界竞态中

**Open questions**：取消时未执行、执行中、已完成但未落盘的调用是否各自可区分？；并发工具是否共享可变工作空间？

### Tool / permission pipeline

#### K03 · waterfall 与不可放宽的 monotonic guard 分层

**Project**：DeepSeek Harness

**Version / commit**：developer preview; pinned master snapshot / d347e703908d

**License**：MIT

**Primary purpose**：通用执行/互操作机制；不自行授予专业工作效力

**Relevant mechanism**：waterfall 与不可放宽的 monotonic guard 分层

**Source location**：[DSH-TOOLS](https://github.com/deepseek-ai/deepseek-harness/blob/d347e703908d0406b7a7ef80e3a0e594d86b2215/docs/tool-execution-pipeline.md) · [DSH-ARCH](https://github.com/deepseek-ai/deepseek-harness/blob/d347e703908d0406b7a7ef80e3a0e594d86b2215/docs/architecture.md)

**How it works**：pre-execute 可做改写与询问；之后的 guard 只能拒绝或放行，不通过改写抹除 owner policy。最终结果经规范化后供模型与 UI 消费。

**Useful for Fresh Courtwork**：借用权限检查、执行拦截、结果规范化和最终通知的分层；适合作为 Work Contract 的宿主接缝。

**Costs / coupling**：Cordis 服务/作用域/生命周期耦合；tool-fs 的写入 guard 不覆盖任意 shell 的 OS 写入。

**SE compatibility**：Reference only；选 DSH 为宿主时 Thin-adapt

**Confidence**：固定版本流水线文档高；防绕过仍待执行验证

**Open questions**：可信插件能否在 pipeline 之外持有副作用权限？；所有有后果的调用路径是否都进入 guard 或独立隔离边界？

### Shell / filesystem / environment

#### K04 · 共享 execution world

**Project**：DeepSeek Harness

**Version / commit**：developer preview; pinned master snapshot / d347e703908d

**License**：MIT

**Primary purpose**：通用执行/互操作机制；不自行授予专业工作效力

**Relevant mechanism**：共享 execution world

**Source location**：[DSH-ARCH](https://github.com/deepseek-ai/deepseek-harness/blob/d347e703908d0406b7a7ef80e3a0e594d86b2215/docs/architecture.md)

**How it works**：filesystem、subprocess、shell、PTY 等围绕可替换 capability service 组合；环境替换应同时迁移这些能力。

**Useful for Fresh Courtwork**：采用“一个运行环境 identity”的机制，而非分别配置相互不一致的 shell cwd、文件目录和终端。

**Costs / coupling**：服务替换不等于本地进程树已终止或远端任务已清理；仍需验证环境 owner。

**SE compatibility**：Reference only / Thin-adapt when hosted

**Confidence**：架构证据中高；进程行为未测试

**Open questions**：kill 是否涵盖子孙进程？；大输出何时落盘、截断、过期？；环境销毁与后台任务取消怎样协调？

### Session persistence

#### S01 · 既有 coding-agent v3 会话树

**Project**：Pi

**Version / commit**：v0.85.1 / d981de1229ef

**License**：MIT

**Primary purpose**：通用执行/互操作机制；不自行授予专业工作效力

**Relevant mechanism**：既有 coding-agent v3 会话树

**Source location**：[PI-V3](https://github.com/earendil-works/pi/blob/v0.85.1/packages/coding-agent/src/core/session-manager.ts)

**How it works**：SessionManager 写 v3 header；条目以 id/parentId 形成分支，compaction 和 branch summary 有自己的条目与引用。

**Useful for Fresh Courtwork**：复用执行历史；Matter 只保存 session locator，不复制另一份 transcript。

**Costs / coupling**：不能直接当成新 AgentHarness v4 的存储；不从树历史推断正式审批效力。

**SE compatibility**：Thin-adapt through existing host API

**Confidence**：版本与条目类型高；完整 crash durability 未核

**Open questions**：SDK/RPC 如何读取并恢复该格式？；并发写和 torn tail 的当前处理需读实现并故障注入。

#### S04 · ThreadStore / LiveThread / LocalThreadStore

**Project**：OpenAI Codex CLI

**Version / commit**：rust-v0.153.4 / 3d2ee51ca2d5

**License**：Apache-2.0

**Primary purpose**：通用执行/互操作机制；不自行授予专业工作效力

**Relevant mechanism**：ThreadStore / LiveThread / LocalThreadStore

**Source location**：[CX-STORE-DOC](https://github.com/openai/codex/blob/rust-v0.153.4/codex-rs/thread-store/README.md) · [CX-STORE](https://github.com/openai/codex/blob/rust-v0.153.4/codex-rs/thread-store/src/lib.rs)

**How it works**：历史 append 与 metadata patch 分开；LiveThread 持有运行中的持久化入口；本地历史经 JSONL 保存，查询 metadata 可经 SQLite 保存。

**Useful for Fresh Courtwork**：让执行宿主保留其 canonical history；通过 durable thread ID 对接，而非解析目录即宣称掌握当前状态。

**Costs / coupling**：复制 Rust recorder 会把存储政策、metadata 同步和恢复责任一起拉入项目；不是可直接替换的通用业务数据库。

**SE compatibility**：Thin-adapt via app-server；不摘取内部 writer

**Confidence**：固定版本接口高；跨进程写竞争未审计

**Open questions**：当前 app-server 能否返回所需恢复/终态证据？；cold read 与 loaded read 的差异能否在适配层消化？

### Persistence / recovery

#### S02 · AgentHarness v4 的 intent → effect → settlement

**Project**：Pi

**Version / commit**：v0.85.1 / d981de1229ef

**License**：MIT

**Primary purpose**：通用执行/互操作机制；不自行授予专业工作效力

**Relevant mechanism**：AgentHarness v4 的 intent → effect → settlement

**Source location**：[PI-HARNESS-API](https://github.com/earendil-works/pi/blob/v0.85.1/packages/agent/src/harness/agent-harness.ts) · [PI-HARNESS-SPEC](https://github.com/earendil-works/pi/blob/v0.85.1/packages/agent/docs/harness.md) · [PI-ISSUE](https://github.com/earendil-works/pi/issues/7937)

**How it works**：操作先接纳，再 drive；持久状态记录动作意图与结果落定。safe 调用可重放，never 调用失联后合成中断结果。entries、values/lists、usage 分开。

**Useful for Fresh Courtwork**：直接缩小通用恢复自研范围；借用不确定副作用窗口与显式 replay policy。

**Costs / coupling**：v4 仍 WIP；watchSession 空实现；search、telemetry、fork、迁移有明确未完项。单 writable owner 由宿主保证，不是后端普遍提供多写者安全。

**SE compatibility**：Reference only / 候选实验；不做正式状态默认存储

**Confidence**：机制/未完成状态高；生产适用性待验证

**Open questions**：发布稳定性门何时明确？；旧 v3 数据能否经正式迁移消费？；使用最小子集是否仍受 v4 无迁移变更影响？

#### S03 · SessionHandle、flush barrier、interrupted-turn repair

**Project**：DeepSeek Harness

**Version / commit**：developer preview; pinned master snapshot / d347e703908d

**License**：MIT

**Primary purpose**：通用执行/互操作机制；不自行授予专业工作效力

**Relevant mechanism**：SessionHandle、flush barrier、interrupted-turn repair

**Source location**：[DSH-PERSIST](https://github.com/deepseek-ai/deepseek-harness/blob/d347e703908d0406b7a7ef80e3a0e594d86b2215/docs/subsystems/persistence.md) · [DSH-SESSION](https://github.com/deepseek-ai/deepseek-harness/blob/d347e703908d0406b7a7ef80e3a0e594d86b2215/packages/core/session/src/index.ts) · [DSH-ARCH](https://github.com/deepseek-ai/deepseek-harness/blob/d347e703908d0406b7a7ef80e3a0e594d86b2215/docs/architecture.md)

**How it works**：写 handle 统一 log 访问和单写者所有权；append 有序可见但 flush 才承诺抗崩溃。恢复保存有效前缀，对未结束 turn 补中断闭合事件。

**Useful for Fresh Courtwork**：把可见、已接收、已持久化分开；可复用日志所有权与恢复边界。

**Costs / coupling**：公开 session/event 不代表已刷盘；“committed session event”不是 SE 已批准 work event；后端契约不能证明外部作用恰好一次。

**SE compatibility**：Thin-adapt if hosted；otherwise Reference only

**Confidence**：契约高；fsync/lease/故障行为未实跑

**Open questions**：哪些命令返回前真正跨过 flush？；崩溃后发生过但未记录的外部动作如何核对？

### Event / observable state

#### E01 · 选择性持久 EventV2 与聚合游标

**Project**：OpenCode

**Version / commit**：v1.18.29 / 02a167e048d3

**License**：MIT

**Primary purpose**：通用执行/互操作机制；不自行授予专业工作效力

**Relevant mechanism**：选择性持久 EventV2 与聚合游标

**Source location**：[OC-EVENT](https://github.com/anomalyco/opencode/blob/v1.18.29/packages/core/src/event.ts) · [OC-BRIDGE](https://github.com/anomalyco/opencode/blob/v1.18.29/packages/opencode/src/event-v2-bridge.ts)

**How it works**：durable event 携带 aggregateID、seq、version；提供 after cursor 的聚合读取和 replay 接口。Bridge 分别发布一般事件与 durable sync。

**Useful for Fresh Courtwork**：优先复核 snapshot + cursor + live stream 的组合；不要再把 OpenCode 当作只有无序瞬时 SSE。

**Costs / coupling**：不是所有事件 durable。内部 Effect/DB/schema 所有权很强；公开 SSE 是否暴露同等恢复契约尚未闭合。

**SE compatibility**：Reference only；server adapter 候选

**Confidence**：所读源码高；端到端 reconnect 中

**Open questions**：订阅与快照间是否有 gap？；保留窗口、重复事件、overflow、owner claim 在公开 wire 上怎样表达？

### Status taxonomy

#### E02 · session.status 不等于工作终态

**Project**：OpenCode

**Version / commit**：v1.18.29 / 02a167e048d3

**License**：MIT

**Primary purpose**：通用执行/互操作机制；不自行授予专业工作效力

**Relevant mechanism**：session.status 不等于工作终态

**Source location**：[OC-STATUS](https://github.com/anomalyco/opencode/blob/v1.18.29/packages/schema/src/session-status-event.ts) · [OC-STATUS-IMPL](https://github.com/anomalyco/opencode/blob/v1.18.29/packages/opencode/src/session/status.ts)

**How it works**：该 union 只有 idle、busy、retry；查询未命中时返回 idle。工具和权限等事实还需读各自事件/对象。

**Useful for Fresh Courtwork**：强制把执行观测与工作效力分开；禁止 idle→completed/approved 的 UI 捷径。

**Costs / coupling**：只看这一个状态字段会漏掉 waiting_user、失败原因或未知结果；不能由此断言整个系统不支持相应动作。

**SE compatibility**：Thin-adapt with explicit mapping

**Confidence**：所读实现高

**Open questions**：哪些可靠对象可以合成 waiting_user？；重连后 unknown 必须用什么事实才能清除？

### Event / GUI bridge

#### E03 · 版本化 app-server 与 Thread / Turn / Item

**Project**：OpenAI Codex CLI

**Version / commit**：rust-v0.153.4 / 3d2ee51ca2d5

**License**：Apache-2.0

**Primary purpose**：通用执行/互操作机制；不自行授予专业工作效力

**Relevant mechanism**：版本化 app-server 与 Thread / Turn / Item

**Source location**：[CX-APP](https://github.com/openai/codex/blob/rust-v0.153.4/codex-rs/app-server/README.md) · [CX-ENGINEERING](https://openai.com/index/unlocking-the-codex-harness/)

**How it works**：初始化后使用 thread 和 turn 请求，接收 item start/delta/completed；cancel 请求与终态通知分开。可生成匹配当前二进制的 schema。

**Useful for Fresh Courtwork**：外部进程 executor 的首选对照；GUI 订阅和读取宿主事实，不持有第二套执行状态。

**Costs / coupling**：WebSocket 明示 experimental/unsupported；优先研究本地 stdio bridge。experimental 字段不得自动成为稳定依赖。

**SE compatibility**：Thin-adapt（外部 executor 候选）

**Confidence**：协议文档高；进程/断连恢复未实测

**Open questions**：连接断开后哪些 run 持续、哪些请求失效？；如何找回未决 approval，以及抑制重复提交？

#### E05 · 既有 coding-agent RPC：接纳、队列、取消落定

**Project**：Pi

**Version / commit**：v0.85.1 / d981de1229ef

**License**：MIT

**Primary purpose**：通用执行/互操作机制；不自行授予专业工作效力

**Relevant mechanism**：既有 coding-agent RPC：接纳、队列、取消落定

**Source location**：[PI-RPC](https://github.com/earendil-works/pi/blob/v0.85.1/packages/coding-agent/docs/rpc.md) · [PI-V3](https://github.com/earendil-works/pi/blob/v0.85.1/packages/coding-agent/src/core/session-manager.ts)

**How it works**：RPC 用 stdin/stdout JSONL；也可直接调用 AgentSession。prompt success 只代表接纳/排队/处理，不是任务成功；abort 在 session idle 后响应。

**Useful for Fresh Courtwork**：薄接现有 C3 GUI bridge，而不是等 H4 watchSession；composer 可明确区分 steer 与 followUp。

**Costs / coupling**：队列未清空时 abort 后仍可能续行；交互式 Esc 需先 clear_queue 并恢复用户草稿。协议要求严格 LF 分帧，不把 Unicode 行分隔符当作 record boundary。

**SE compatibility**：Thin-adapt（优先验证候选）

**Confidence**：固定协议文档高；子进程/GUI行为未实测

**Open questions**：能否不改core就去掉不适合professional work的coding默认值？；RPC读取/重连所需snapshot是否充分？；是否满足当前V8的permission和review交互？

### Event vocabulary

#### E04 · durable Session / live Agent / capability interception

**Project**：DeepSeek Harness

**Version / commit**：developer preview; pinned master snapshot / d347e703908d

**License**：MIT

**Primary purpose**：通用执行/互操作机制；不自行授予专业工作效力

**Relevant mechanism**：durable Session / live Agent / capability interception

**Source location**：[DSH-ARCH](https://github.com/deepseek-ai/deepseek-harness/blob/d347e703908d0406b7a7ef80e3a0e594d86b2215/docs/architecture.md)

**How it works**：实时 assistant-stream chunks 属进程内流；完整结果或失败 attempt 落定后写入 session log。model-visible input 可从日志重建。

**Useful for Fresh Courtwork**：对 GUI 明确 transient 与 durable；尝试失败和有效模型消息分开；保留失败 trace 而不污染下次 context。

**Costs / coupling**：落定前进程硬退出可能没有完整 durable attempt stream；不能对用户许诺逐 token 零丢失。

**SE compatibility**：Reference only / Thin-adapt

**Confidence**：固定文档高；实机丢失窗口待测

**Open questions**：UI 显示过但未落盘的尾部怎样降级？；跨版本日志生成迁移与业务状态迁移是否完全隔离？

### Context compilation

#### C01 · transformContext / convertToLlm 的应用投影位置

**Project**：Pi

**Version / commit**：v0.85.1 / d981de1229ef

**License**：MIT

**Primary purpose**：通用执行/互操作机制；不自行授予专业工作效力

**Relevant mechanism**：transformContext / convertToLlm 的应用投影位置

**Source location**：[PI-AGENT-DOC](https://github.com/earendil-works/pi/blob/v0.85.1/packages/agent/README.md) · [PI-LOOP](https://github.com/earendil-works/pi/blob/v0.85.1/packages/agent/src/agent-loop.ts)

**How it works**：应用消息先经 context transformation，再转换为模型消息；可以排除仅供 UI 的类型，选择需要进入请求的内容。

**Useful for Fresh Courtwork**：SE 只提供 governed-state projection、source refs、obligations 与版本，而不再写模型循环。

**Costs / coupling**：接口存在不保证状态充分；每轮大幅重排输入可能损害 cache；不能把摘要提升为正式事实。

**SE compatibility**：Thin-adapt + SE semantic compiler

**Confidence**：接口高；收益需配对实验

**Open questions**：何时刷新投影而不打断健康窗口？；关键约束遗漏、旧版本重引入如何衡量？

### Context / persistence

#### C02 · model-visible means logged 与 deriveMessages

**Project**：DeepSeek Harness

**Version / commit**：developer preview; pinned master snapshot / d347e703908d

**License**：MIT

**Primary purpose**：通用执行/互操作机制；不自行授予专业工作效力

**Relevant mechanism**：model-visible means logged 与 deriveMessages

**Source location**：[DSH-ARCH](https://github.com/deepseek-ai/deepseek-harness/blob/d347e703908d0406b7a7ef80e3a0e594d86b2215/docs/architecture.md) · [DSH-SESSION](https://github.com/deepseek-ai/deepseek-harness/blob/d347e703908d0406b7a7ef80e3a0e594d86b2215/packages/core/session/src/index.ts)

**How it works**：模型历史由日志派生；额外模型可见输入通过记录进入，live interception 与 durable projection 各有位置。

**Useful for Fresh Courtwork**：Context compiler 的输出可追踪到具体输入版本，不能经旁路注入无法追溯的权威状态。

**Costs / coupling**：日志中的一条输入仅记录模型看过，不代表它获得机构效力；正式 state owner 仍要明确。

**SE compatibility**：Thin-adapt if hosted

**Confidence**：架构/源码定位中高

**Open questions**：能否把 Matter projection ref 与内容/hash 一同保存？；怎样撤换投影而不静默删 Raw Evidence？

### Extension / activation

#### X01 · profile / bundle / scoped services

**Project**：DeepSeek Harness

**Version / commit**：developer preview; pinned master snapshot / d347e703908d

**License**：MIT

**Primary purpose**：通用执行/互操作机制；不自行授予专业工作效力

**Relevant mechanism**：profile / bundle / scoped services

**Source location**：[DSH-ARCH](https://github.com/deepseek-ai/deepseek-harness/blob/d347e703908d0406b7a7ef80e3a0e594d86b2215/docs/architecture.md)

**How it works**：配置组合 plugin tree；sdk-minimal 有独立最小 bundle。web 可 live reload，已拥有运行任务的 stdio/one-shot profile 在启动时组合。

**Useful for Fresh Courtwork**：借用依赖与生命周期纪律；Expert 先 stage-bound 配置，不为每 turn 全量热插拔建设框架。

**Costs / coupling**：采用 Cordis 会带来整套 lifecycle 语义；插件卸载撤销注册不等于逆转外部写入。

**SE compatibility**：Reference only；sdk-minimal 为 host 候选

**Confidence**：架构证据高；适配经济性中

**Open questions**：Work Extension 是否只依赖公开 seam？；升级宿主时能否保持 formal state 不变？

### Browser

#### T01 · Playwright browser primitive；MCP 只是可选载体

**Project**：专项外部组件 / 官方协议

**Version / commit**：官方页面访问于 2026-09-06；未锁安装版本，除 ACP v1 规范外

**License**：见补充索引；未核实的许可证标为 pending，不能据此分发依赖

**Primary purpose**：通用执行/互操作机制；不自行授予专业工作效力

**Relevant mechanism**：Playwright browser primitive；MCP 只是可选载体

**Source location**：[PLAYWRIGHT](https://github.com/microsoft/playwright-mcp)

**How it works**：以浏览器引擎和结构化页面观察执行操作；可选 MCP 暴露或现有 CLI 路径。

**Useful for Fresh Courtwork**：直接复用浏览器能力，不重写浏览器 agent framework；页面结构和视觉两类观察按任务选择。

**Costs / coupling**：浏览器状态、账号权限、导航边界与外部提交仍需受控；MCP 连接不构成 sandbox。

**SE compatibility**：Adopt/Thin-adapt candidate；锁版本后才能接受

**Confidence**：官方机制中高；本轮未实跑

**Open questions**：登录态隔离、下载/upload、弹窗及危险提交是否可控？；大 accessibility snapshot 怎样按需披露？

### Computer use

#### T02 · 受隔离环境约束的观察/输入能力

**Project**：专项外部组件 / 官方协议

**Version / commit**：官方页面访问于 2026-09-06；未锁安装版本，除 ACP v1 规范外

**License**：见补充索引；未核实的许可证标为 pending，不能据此分发依赖

**Primary purpose**：通用执行/互操作机制；不自行授予专业工作效力

**Relevant mechanism**：受隔离环境约束的观察/输入能力

**Source location**：[COMPUTER](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool) · [CLAUDE-DESKTOP](https://code.claude.com/docs/en/desktop)

**How it works**：官方公开 computer tool 的观察与输入接口；产品还区分干净 browser profile 与用户既有登录态。

**Useful for Fresh Courtwork**：作为一等可选 primitive，而非只有 API 缺失才启动；执行路径由当前任务和模型选择。

**Costs / coupling**：本轮证据不足以确定跨 provider、跨 OS 的统一成熟 adapter。屏幕输入可能直接产生现实副作用，事后成果审批无法撤销。

**SE compatibility**：Reference only；首片暂不开放高风险 computer action

**Confidence**：公开表面中；跨平台可替换性低/未验证

**Open questions**：坐标/缩放/焦点、会话恢复与环境 fencing 怎样表达？；无法可靠拦截外部提交时，是否限制为只读/人工完成提交？

### Sandbox

#### P01 · 独立进程隔离而非提示词承诺

**Project**：专项外部组件 / 官方协议

**Version / commit**：官方页面访问于 2026-09-06；未锁安装版本，除 ACP v1 规范外

**License**：见补充索引；未核实的许可证标为 pending，不能据此分发依赖

**Primary purpose**：通用执行/互操作机制；不自行授予专业工作效力

**Relevant mechanism**：独立进程隔离而非提示词承诺

**Source location**：[SRT](https://github.com/anthropic-experimental/sandbox-runtime) · [PI-ROOT](https://github.com/earendil-works/pi)

**How it works**：SRT 提供宿主相关 filesystem/network/process boundary；Pi 明示默认以启动进程权限运行，强边界需要外部方案。

**Useful for Fresh Courtwork**：使用宿主已有隔离；不足时再验证独立 sandbox，而不是自写权限字符串过滤器。

**Costs / coupling**：SRT 是 Beta Research Preview；不同 OS 能力并不完全等价；默认可读范围不自动等于 Matter 隔离。

**SE compatibility**：Thin-adapt candidate；禁止自研 sandbox

**Confidence**：公开机制高；安全配置/威胁模型未验证

**Open questions**：凭据、网络出口、Unix socket、子进程是否同时受限？；隔离启动失败是否 fail closed？

### GUI bridge

#### G01 · ExternalStoreRuntime / ToolUIPart

**Project**：专项外部组件 / 官方协议

**Version / commit**：官方页面访问于 2026-09-06；未锁安装版本，除 ACP v1 规范外

**License**：见补充索引；未核实的许可证标为 pending，不能据此分发依赖

**Primary purpose**：通用执行/互操作机制；不自行授予专业工作效力

**Relevant mechanism**：ExternalStoreRuntime / ToolUIPart

**Source location**：[ASSISTANT-UI](https://www.assistant-ui.com/docs/runtimes/custom/external-store) · [AI-ELEMENTS](https://elements.ai-sdk.dev/components/tool)

**How it works**：UI 通过 adapter 接收外部状态和动作回调；renderer 展示 typed tool parts，而不拥有执行事实。

**Useful for Fresh Courtwork**：借用可用动作由 capability 决定、消息转换、取消/重载等语义；保留当前原生 ES-module UI。

**Costs / coupling**：直接采用组件会引入 React/特定 SDK；为这些组件迁移现有 UI 不在本轮范围。

**SE compatibility**：Reference only

**Confidence**：文档高；与当前 shell 集成未测试

**Open questions**：同一 candidate 的版本变化如何使旧 approval 失效？；pending UI 与服务器终态如何收敛？

### Interop protocol

#### G02 · ACP capability negotiation

**Project**：专项外部组件 / 官方协议

**Version / commit**：官方页面访问于 2026-09-06；未锁安装版本，除 ACP v1 规范外

**License**：见补充索引；未核实的许可证标为 pending，不能据此分发依赖

**Primary purpose**：通用执行/互操作机制；不自行授予专业工作效力

**Relevant mechanism**：ACP capability negotiation

**Source location**：[ACP](https://agentclientprotocol.com/protocol/v1/overview)

**How it works**：定义 client/agent 请求、会话加载能力、增量更新、取消、permission 和可选文件/terminal 委派。

**Useful for Fresh Courtwork**：作为互操作 port 候选；对不同 executor 协商哪些功能确实存在。

**Costs / coupling**：不等于正式状态模型、不保证 durable replay 或 exactly-once；产品自身的 review packet 仍要独立版本。

**SE compatibility**：Reference only / Thin-adapt when required

**Confidence**：规范表面高；各宿主实现一致性未验证

**Open questions**：当前宿主的 ACP 实现缺哪些 capability？；自定义字段是否保持可替换且不泄漏权威？

## 4. GUI 反推的最小 runtime contract

这是接口候选，不是 UI 重设计。默认沿用当前 V8 shell；assistant-ui / AI Elements 只提供反向检查，不能成为迁移 React 的理由。

| Surface | Core contract candidate | Boundary |
|---|---|---|
| Composer / queued input | client command id、acknowledged/queued/rejected、attachment refs；保留本地未发送草稿 | 不能把消息已显示等同于后端已接纳 |
| Thread / tab / workspace | 稳定宿主session id、Matter binding、environment id、可查询snapshot | tab关闭不应无声删除Matter；UI不是任务owner |
| Tool activity / terminal | tool call id、环境、输入/输出ref、exit/error、截断标记、task owner | 任务checklist与实际运行中的后台process分开 |
| Permission / waiting_user | request id、scope、expiry、allowed decision set、resolved/rejected记录 | 不能只显示一个无对象版本的Approve |
| Diff / artifact / review | base version、candidate version/hash、Evidence refs、checks、authority、consequence | 批量意见和批准须绑定被审阅版本 |
| Cancel / retry | 取消请求ack与最终settlement分别表示；retry creates/targets a known run | 取消连接不是取消操作；重试不等于重放全部副作用 |
| Resume / connection | snapshot version、cursor或明确的resync策略、gap/duplicate detection | 无法确认时unknown；不要默认恢复为idle/success |
| Background / notification | 由宿主持有任务；notification是可重建的事件投影 | 桌面toast未送达不应丢失pending review |
| Usage / cost | 原始usage、provider/model、缺失状态与可追溯估价规则 | 不能把abort时无usage记成0或当作账单 |

观察入口：[PI-RPC](https://github.com/earendil-works/pi/blob/v0.85.1/packages/coding-agent/docs/rpc.md) · [CX-APP](https://github.com/openai/codex/blob/rust-v0.153.4/codex-rs/app-server/README.md) · [OC-EVENT](https://github.com/anomalyco/opencode/blob/v1.18.29/packages/core/src/event.ts) · [OC-STATUS](https://github.com/anomalyco/opencode/blob/v1.18.29/packages/schema/src/session-status-event.ts) · [CLAUDE-CLI](https://code.claude.com/docs/en/interactive-mode) · [CLAUDE-DESKTOP](https://code.claude.com/docs/en/desktop) · [ASSISTANT-UI](https://www.assistant-ui.com/docs/runtimes/custom/external-store) · [AI-ELEMENTS](https://elements.ai-sdk.dev/components/tool) · [CLINE-CHECKPOINT](https://docs.cline.bot/core-workflows/checkpoints)

建议不要把 `running / waiting_user / failed / cancelled / unknown / recovered` 强塞成一个互斥枚举。执行状态、连接观测、恢复结果与工作效力是不同维度。`recovered` 可先作恢复事件；恢复后 Run 可以继续运行，也可以等待人；`completed` 的 Run 仍可能只产出未接受 Candidate。只为当前界面确实需要的差异增加字段。

还必须区分两类回执：执行宿主承认某调用已发生，和 system of record 承认某工作版本已生效。二者不能因都叫“commit”就混为一个记录。

## 5. 辅助生态索引（不扩大为框架大全）

以下记录仅够决定值不值得下一次精读，不够作依赖批准。未锁版本/许可证之处显式保留 pending；没有把搜索出现、Star 数或维护者自述当作真实流量质量证据。

| Project / group | Primitive / reason | Disposition | Version / license |
|---|---|---|---|
| OpenHands Software Agent SDK / Agent Canvas | 独立 SDK、typed Action/Observation、workspace、REST/WebSocket；作为第五宿主候选，Canvas只是消费方。 [OH-SDK](https://docs.openhands.dev/sdk/arch/sdk) · [OH-REPO](https://github.com/OpenHands/software-agent-sdk) · [OH-CANVAS](https://github.com/OpenHands/OpenHands) | Discovery / backup host candidate | release未锁；not independently pinned in this pass |
| Goose | 通用桌面/CLI/API、MCP/ACP 与交互式工具surface。 [GOOSE](https://github.com/aaif-goose/goose) | Discovery / GUI and extension reference | release未锁；Apache-2.0 (repository declaration; dependency audit not performed) |
| Aider | 上下文选择、repo map 与文件变更工作流候选。 [AIDER](https://github.com/Aider-AI/aider) | Discovery only | release未锁；not independently pinned in this pass |
| Cline / Roo Code | 审批、diff、checkpoint与任务恢复；Cline检查到公开checkpoint文档，Roo仅发现。 [CLINE](https://github.com/cline/cline) · [CLINE-CHECKPOINT](https://docs.cline.bot/core-workflows/checkpoints) · [ROO](https://github.com/RooCodeInc/Roo-Code) | Reference for checkpoint semantics; no host adoption | release未锁；not independently pinned in this pass |
| Continue | 开发者工具client/core分工与宿主集成。 [CONTINUE](https://github.com/continuedev/continue) | Discovery only | release未锁；not independently pinned in this pass |
| assistant-ui / AI Elements | 外部state adapter、typed Tool renderer、按callback开放操作。 [ASSISTANT-UI](https://www.assistant-ui.com/docs/runtimes/custom/external-store) · [AI-ELEMENTS](https://elements.ai-sdk.dev/components/tool) | UI-contract reference only | release未锁；not independently pinned in this pass |
| Playwright / Playwright MCP | 浏览器执行和结构化观察；MCP作为可选载体。 [PLAYWRIGHT](https://github.com/microsoft/playwright-mcp) | Independent capability candidate | release未锁；Apache-2.0 (repository declaration; release audit pending) |
| Anthropic Sandbox Runtime | 独立宿主隔离候选；Beta Research Preview。 [SRT](https://github.com/anthropic-experimental/sandbox-runtime) | Independent capability candidate, not accepted yet | release未锁；Apache-2.0 (repository declaration) |
| Agent Client Protocol | client/agent互操作协议、权限与terminal委派。 [ACP](https://agentclientprotocol.com/protocol/v1/overview) | Interop reference; not a core or SoR | protocol/v1 documentation；not audited; specification and implementation licenses must be distinguished |

Claude Code / Desktop 与 Codex app 的商业产品 UI 只作公开交互参考，不列为可直接复制的开源前端。Pi 生态本轮重点是原生 TUI、既有 SDK/RPC 与新 H4 surface 的边界，没有对某个第三方 Pi WebUI 作“成熟可采用”的背书。OpenHands 不再被笼统排除为单体平台：其独立 SDK 值得作为备用宿主；同时不要求 Fresh 引入 Canvas 和 automation 服务。

## 6. Harness Core Selection Matrix — provisional

| Primitive | Candidate | 推荐方式 | 理由 | 风险 |
|---|---|---|---|---|
| Agent loop | Pi Agent / 既有 SDK；Codex/OpenCode/DSH最小host作对照 | Thin-adapt（候选） | 一个Run只选一个执行owner；无新loop | 裸loop的补齐成本可能超过整宿主adapter |
| Provider | 所选宿主的provider；Pi路线用pi-ai | Adopt | 不要建立第二份provider兼容矩阵 | auth/stream/retry/usage差异不可假装消失 |
| Tool registry | 所选宿主registry；DSH guard机制对照 | Thin-adapt | 统一权限、结果与生命周期 | MCP schema≠完整工具生命周期 |
| Shell execution | 宿主shell/PTY + 单一execution environment | Adopt / Thin-adapt | 保留进程和工作目录owner | child cleanup、timeout、大输出、未知结果 |
| Computer use | 官方computer接口 + 隔离desktop adapter | Reference only；可选激活 | 一等primitive但不要求首片开放 | 跨平台成熟度、账号与不可逆提交未闭合 |
| Event protocol | 原生协议 + 极薄语义映射；Codex/OpenCode/ACP作对照 | Thin-adapt | 复用id/cursor/snapshot能力，不写大一统协议 | 同名turn语义、瞬时/持久事件、gap/duplicate |
| Session persistence | 宿主原生session/thread store | Adopt | SE只引用执行日志；不复制一套 | Pi v3/v4不互换；DSH append不等于flush |
| Resume / recovery | 宿主恢复；PiH4/DSH机制用于审查 | Thin-adapt | 重连、执行恢复、工作恢复分层 | 未知副作用不能自动重做；H4仍WIP |
| Context compiler | SE最小状态选择 + 宿主context seam | 薄自有语义层 | 真正需要的是版本/权限/有效性选择 | state不足、遗漏、cache churn；不能每turn清空 |
| Permission | 宿主technical policy + SE Authority映射 | Thin-adapt + 薄自有语义层 | 先阻止越权副作用，再检查正式成果提交 | shell/browser可绕过仅tool-name级业务检查 |
| Sandbox | 宿主现有隔离优先；独立SRT作候选 | Adopt / Thin-adapt；不自研 | 复用成熟OS机制 | preview、OS差异、凭据/网络/读范围需验证 |
| Extension / plugin | 所选宿主公开seam；DSH profile思路 | Thin-adapt / Reference only | 先stage-bound预编排 | hot-unload≠外部动作回滚；ABI变化 |
| Subagent | 宿主原生有界委派 | 暂不需要；按实际任务启用 | 没有责任独立性就只是并行Lane | 孤儿任务、共享写、取消传播、相关错误 |
| Verification | 已有validator/test工具 + SE rubric/review | Adopt通用设施；自有工作判据 | 运行检查与离线Eval分开 | 同一模型共识不等于独立验收 |
| Usage / cost | 宿主原始usage + Matter级汇总 | Thin-adapt | 不重复采样或漏算重试/压缩 | 丢失usage应标unknown；估价不当账单 |
| GUI bridge | 宿主server/RPC + 当前V8的视图adapter | Thin-adapt | UI只持有可重建投影和本地草稿 | 不为React组件迁移；断线不等于cancel |

### 不可省略的补充原语：正式状态提交

**Candidate / Review / Commitment 是这次选型的控制边界，不是第十七个需要新写的通用 agent framework 模块。** 第一片可压在现有应用/SoR 中：保存 Candidate 与 active version 的区别；提交带 expected Matter version、candidate identity/hash、Review decision 与 Authority；失败保留候选，成功得到可查询的 commit receipt。存储用现成事务能力，专业语义才由 SE 维护。暂不引入分布式多写者或全量事件溯源平台。

## 7. 最小 blueprint：一个执行 owner，两个不同事实域

```text
当前 V8 GUI
    │ 用户命令 / 订阅 / snapshot 查询
    ▼
薄 Host Adapter ──────────────► 一个选定的 Generic Execution Host
    │                          loop / provider / native session journal
    │                          tool / shell / stream / cancel / native recovery
    │                          independent browser / sandbox adapters
    │ 候选、来源引用、运行回执
    ▼
SE Work Boundary
    Matter binding + governed-state Context / Review projection
    Evidence / Completion / Authority + version-bound commit/reject/revise
    │
    ▼
唯一工作 System of Record
    Current Semantic State / active artifact version / open obligations
    Review decisions / version history / session and evidence locators
```

执行日志与正式工作状态可以在同一物理应用甚至同一数据库中，责任却不能合并。禁止同时由 GUI、宿主 transcript summary 和 Matter sidecar 各自宣布哪个成果已被批准。

Context compiler 不意味着每轮清空窗口。保留健康 Run 的稳定 Contract / tool / permission 前缀与宿主续行；在 stage、版本、权限或工作窗口需要改变时，从当前 governed state 形成新的投影；Raw Evidence 保持可检索。需要对照关键约束遗漏、旧状态污染、cache稳定性与成果接受，而不只测 token。

**Permission 必须位于副作用之前。** 给一个“只能写草稿”的 Agent 无限制 shell、网络和凭据，再在输出末尾加 Review gate，不能形成该权限边界。经 shell、MCP、browser、computer-use 发出的操作也必须受同一授权范围约束。无法可靠隔离某种外部提交时，首片缩到只读、draft 或人工完成外部动作；不要声称 Git rollback 能收回已经发送、发布或批准的外部事实。

## 8. 只读阶段后的验证队列（本轮均未执行）

| Test | 最小情形 | 通过判据 |
|---|---|---|
| Q1 — 单一owner / 无core patch | 把真实一次委派接到宿主，走其读/启动/事件/取消入口，并移除不适用的coding默认值 | work state不靠改宿主内部、复制transcript或UI私有状态才能成立 |
| Q2 — Cancel settlement | 等待模型、等待工具、等待用户、后台进程分别取消 | cancel_requested与cancelled可区分；仍存活/无法确认的作用显式unknown |
| Q3 — Durability window | 在工具执行前、执行后但落盘前、flush后分别终止进程 | 恢复不虚构结果、不丢权威版本、不盲目重放never动作 |
| Q4 — Reconnect gap | 快照/订阅交界断开，重复或乱序投递，再重连 | 最终投影收敛；有缺口时重取snapshot而非猜测成功 |
| Q5 — Version conflict | Reviewer打开v3后产生v4，再提交旧review packet | expected_version / artifact hash冲突被拒绝，不能批准不曾审阅的版本 |
| Q6 — Authority closure | 同一受限动作分别经tool、shell、MCP、browser尝试 | 副作用边界一致；不能由低层接口绕过，无法闭合则缩权限 |
| Q7 — Fresh context / cache | 健康窗口续行与fresh projection分组；插入旧结论和关键证据 | 测遗漏/污染/成本/latency/复原；不以token更少单项获胜 |
| Q8 — Work acceptance | 执行正常结束但Evidence/Completion缺失 | Run completed不自动成为Artifact accepted或Matter completed |

这不是要求先建设八套设施。每项只需检查候选宿主能否承载当前一个 bounded slice。任一候选必须靠长期 core patch 或第二套事实才能通过，即缩小适配范围或换宿主，而不是立刻 fork。

下一轮源码阅读只需围绕差异最大的三个主题：**Pi H4 的实际恢复/未完 surface；DSH flush/单写者/guard 闭合；Codex与OpenCode的取消、snapshot和reconnect契约**。不继续横向收集更多框架。

## 9. 停止准则与不作出的结论

本轮已经有足够依据停止“是否需要从零造通用 Harness”的讨论，转向宿主接缝验证。还没有足够依据宣布某个候选是总体最成熟或最终架构。没有验证性能、安全性、真实流量、专业收益、GUI成熟度或完整许可证供应链。

若一个候选通过单一执行owner、可靠终态、权限闭合、恢复与当前work slice，而所需自有代码仍局限于 Matter/Context/Review/Commit，选型可以结束。若缺的是通用原语，先查看该宿主或独立组件已有实现；仅在一个具体不变量持续失败且社区没有适合的机制时，才建立局部自研任务。

## 10. Source ledger / frozen pointers

JSON 文件保留源码读取深度、版本来源、未执行测试和各卡片裁决。这里列出的路径是本轮读过或明确定位的入口；搜索片段、源码入口、规范和已运行测试不会互相冒充。

| ID | Primary source | Read depth | Notes |
|---|---|---|---|
| PI-LOOP | [packages/agent/src/agent-loop.ts](https://github.com/earendil-works/pi/blob/v0.85.1/packages/agent/src/agent-loop.ts) | pinned-source-excerpt | Outer follow-up loop; inner tool/steering loop. Not an execution benchmark. |
| PI-AGENT-DOC | [packages/agent/README.md](https://github.com/earendil-works/pi/blob/v0.85.1/packages/agent/README.md) | pinned-api-documentation | Events, transformContext, convertToLlm, before/afterToolCall, abort and settlement. Large tool output was truncated; do not claim full-file audit. |
| PI-EXPORT | [packages/agent/src/index.ts](https://github.com/earendil-works/pi/blob/v0.85.1/packages/agent/src/index.ts) | pinned-source |  |
| PI-RPC | [packages/coding-agent/docs/rpc.md](https://github.com/earendil-works/pi/blob/v0.85.1/packages/coding-agent/docs/rpc.md) | pinned-protocol-documentation | AgentSession and subprocess RPC routes; prompt acceptance differs from execution completion; abort waits for idle, clear_queue controls queued continuation; strict LF JSONL framing. |
| PI-V3 | [packages/coding-agent/src/core/session-manager.ts](https://github.com/earendil-works/pi/blob/v0.85.1/packages/coding-agent/src/core/session-manager.ts) | pinned-source-excerpt | CURRENT_SESSION_VERSION = 3. Only header/types and beginning of custom entry documentation inspected. |
| PI-HARNESS-API | [packages/agent/src/harness/agent-harness.ts](https://github.com/earendil-works/pi/blob/v0.85.1/packages/agent/src/harness/agent-harness.ts) | pinned-source-excerpt |  |
| PI-HARNESS-SPEC | [packages/agent/docs/harness.md](https://github.com/earendil-works/pi/blob/v0.85.1/packages/agent/docs/harness.md) | pinned-normative-spec-and-status | Implementation-status section explicitly distinguishes WIP, missing methods, future design and implemented operation graph. Not all implementation bodies inspected. |
| PI-ISSUE | [https://github.com/earendil-works/pi/issues/7937](https://github.com/earendil-works/pi/issues/7937) | issue-and-comments | Historical v0.84.1 report, closed/not_planned. Maintainer said WIP; this is not a fixed-bug claim. Current v0.85.1 source/status is the primary readiness evidence. |
| PI-ROOT | [https://github.com/earendil-works/pi](https://github.com/earendil-works/pi) | repository-metadata-and-readme | MIT; renamed namespace; explicitly no built-in OS permission boundary. Browser-indexed root not used for latest release. |
| PI-RELEASE | [https://api.github.com/repos/earendil-works/pi/releases/latest](https://api.github.com/repos/earendil-works/pi/releases/latest) | live-release-api | v0.85.1 at access time; assets not exhaustively inspected. |
| PI-TAG | [https://api.github.com/repos/earendil-works/pi/git/ref/tags/v0.85.1](https://api.github.com/repos/earendil-works/pi/git/ref/tags/v0.85.1) | live-ref-api |  |
| DSH-ARCH | [docs/architecture.md](https://github.com/deepseek-ai/deepseek-harness/blob/d347e703908d0406b7a7ef80e3a0e594d86b2215/docs/architecture.md) | pinned-architecture-documentation |  |
| DSH-PERSIST | [docs/subsystems/persistence.md](https://github.com/deepseek-ai/deepseek-harness/blob/d347e703908d0406b7a7ef80e3a0e594d86b2215/docs/subsystems/persistence.md) | pinned-contract-documentation |  |
| DSH-TOOLS | [docs/tool-execution-pipeline.md](https://github.com/deepseek-ai/deepseek-harness/blob/d347e703908d0406b7a7ef80e3a0e594d86b2215/docs/tool-execution-pipeline.md) | pinned-generated-pipeline-documentation |  |
| DSH-SESSION | [packages/core/session/src/index.ts](https://github.com/deepseek-ai/deepseek-harness/blob/d347e703908d0406b7a7ef80e3a0e594d86b2215/packages/core/session/src/index.ts) | pinned-search-excerpt | deriveMessages implementation entry located; not a full audit of the Session class. |
| DSH-LICENSE | [LICENSE](https://github.com/deepseek-ai/deepseek-harness/blob/d347e703908d0406b7a7ef80e3a0e594d86b2215/LICENSE) | pinned-license |  |
| DSH-HEAD | [https://api.github.com/repos/deepseek-ai/deepseek-harness/git/ref/heads/master](https://api.github.com/repos/deepseek-ai/deepseek-harness/git/ref/heads/master) | live-ref-api |  |
| CX-APP | [codex-rs/app-server/README.md](https://github.com/openai/codex/blob/rust-v0.153.4/codex-rs/app-server/README.md) | pinned-protocol-documentation | Initialization, transports, Thread/Turn/Item, thread APIs and experimental boundaries. Large return truncated; only observed sections are used. |
| CX-STORE-DOC | [codex-rs/thread-store/README.md](https://github.com/openai/codex/blob/rust-v0.153.4/codex-rs/thread-store/README.md) | pinned-architecture-documentation |  |
| CX-STORE | [codex-rs/thread-store/src/lib.rs](https://github.com/openai/codex/blob/rust-v0.153.4/codex-rs/thread-store/src/lib.rs) | pinned-source |  |
| CX-TURN | [codex-rs/core/src/session/turn.rs](https://github.com/openai/codex/blob/rust-v0.153.4/codex-rs/core/src/session/turn.rs) | pinned-source-entry-and-imports | Source dependency map and loop entry comment inspected, not the entire run_turn implementation. |
| CX-RELEASE | [https://api.github.com/repos/openai/codex/releases/latest](https://api.github.com/repos/openai/codex/releases/latest) | live-release-api | rust-v0.153.4 at access time; cached HTML latest was older and not used. |
| CX-TAG | [https://api.github.com/repos/openai/codex/git/tags/042fb41b7c813ac7999105e886b2b7aa715b5081](https://api.github.com/repos/openai/codex/git/tags/042fb41b7c813ac7999105e886b2b7aa715b5081) | live-annotated-tag-api |  |
| CX-ROOT | [https://github.com/openai/codex](https://github.com/openai/codex) | repository-metadata | Apache-2.0. |
| CX-ENGINEERING | [https://openai.com/index/unlocking-the-codex-harness/](https://openai.com/index/unlocking-the-codex-harness/) | official-engineering-documentation | Product/core separation reference; publication-era description, not proof every planned refactor is now shipped. |
| OC-STATUS | [packages/schema/src/session-status-event.ts](https://github.com/anomalyco/opencode/blob/v1.18.29/packages/schema/src/session-status-event.ts) | pinned-source |  |
| OC-STATUS-IMPL | [packages/opencode/src/session/status.ts](https://github.com/anomalyco/opencode/blob/v1.18.29/packages/opencode/src/session/status.ts) | pinned-source |  |
| OC-BRIDGE | [packages/opencode/src/event-v2-bridge.ts](https://github.com/anomalyco/opencode/blob/v1.18.29/packages/opencode/src/event-v2-bridge.ts) | pinned-source |  |
| OC-EVENT | [packages/core/src/event.ts](https://github.com/anomalyco/opencode/blob/v1.18.29/packages/core/src/event.ts) | pinned-source-excerpt | Aggregate read cursor and stream/replay interfaces inspected; full transactional publication and wire reconnection races not audited. |
| OC-PROCESSOR | [packages/opencode/src/session/processor.ts](https://github.com/anomalyco/opencode/blob/v1.18.29/packages/opencode/src/session/processor.ts) | pinned-source-excerpt | Dependency and tool-call state entry; snapshot taken before LLM stream. Not a complete processor audit. |
| OC-SERVER | [https://opencode.ai/docs/server/](https://opencode.ai/docs/server/) | official-documentation | HTTP/OpenAPI/SSE public surface; docs are not release-pinned. |
| OC-PERMISSION | [https://opencode.ai/docs/permissions/](https://opencode.ai/docs/permissions/) | official-documentation | allow/ask/deny capability policy; not equivalent to business approval. |
| OC-RELEASE | [https://api.github.com/repos/anomalyco/opencode/releases/latest](https://api.github.com/repos/anomalyco/opencode/releases/latest) | live-release-api | v1.18.29, immutable release at access time; cached HTML v1.18.16 not used. |
| OC-ROOT | [https://github.com/anomalyco/opencode](https://github.com/anomalyco/opencode) | repository-metadata | MIT. |
| OH-SDK | [https://docs.openhands.dev/sdk/arch/sdk](https://docs.openhands.dev/sdk/arch/sdk) | official-architecture-documentation | Standalone SDK, typed Action/Observation, Conversation, Workspace and events; do not treat as only a monolithic GUI. |
| OH-REPO | [https://github.com/OpenHands/software-agent-sdk](https://github.com/OpenHands/software-agent-sdk) | repository-discovery | SDK/Agent Server; exact release/license audit remains open. |
| OH-CANVAS | [https://github.com/OpenHands/OpenHands](https://github.com/OpenHands/OpenHands) | repository-discovery | Current Agent Canvas / SDK / typescript-client / automation responsibilities; unpinned. |
| GOOSE | [https://github.com/aaif-goose/goose](https://github.com/aaif-goose/goose) | repository-discovery | Former Block/goose; desktop, CLI, API, MCP/ACP. No source-level lifecycle audit this round. |
| AIDER | [https://github.com/Aider-AI/aider](https://github.com/Aider-AI/aider) | repository-discovery | Context/repo-map and file-change workflow follow-up candidate; not evaluated as primary host. |
| CLINE | [https://github.com/cline/cline](https://github.com/cline/cline) | repository-discovery | Current project should not be reduced to IDE-only architecture without checking SDK/CLI. |
| CLINE-CHECKPOINT | [https://docs.cline.bot/core-workflows/checkpoints](https://docs.cline.bot/core-workflows/checkpoints) | official-documentation | Shadow-Git file/task checkpoint distinction; no claim that remote side effects can be rolled back. |
| ROO | [https://github.com/RooCodeInc/Roo-Code](https://github.com/RooCodeInc/Roo-Code) | repository-discovery | Maintenance and release state not adjudicated. |
| CONTINUE | [https://github.com/continuedev/continue](https://github.com/continuedev/continue) | repository-discovery | Client/core separation and developer-tool integration candidate; no implementation adjudication. |
| ASSISTANT-UI | [https://www.assistant-ui.com/docs/runtimes/custom/external-store](https://www.assistant-ui.com/docs/runtimes/custom/external-store) | official-documentation | State-owner adapter, feature callbacks. No React migration recommendation. |
| AI-ELEMENTS | [https://elements.ai-sdk.dev/components/tool](https://elements.ai-sdk.dev/components/tool) | official-documentation | ToolUIPart renderer only; not a durable runtime. |
| ACP | [https://agentclientprotocol.com/protocol/v1/overview](https://agentclientprotocol.com/protocol/v1/overview) | versioned-protocol-documentation | Negotiated client/agent capabilities; not a Matter ledger or exactly-once transport. |
| PLAYWRIGHT | [https://github.com/microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp) | official-repository-documentation | Accessibility-oriented browser adapter and MCP vs CLI tradeoff; not OS desktop automation. |
| SRT | [https://github.com/anthropic-experimental/sandbox-runtime](https://github.com/anthropic-experimental/sandbox-runtime) | official-repository-documentation | Beta Research Preview. Host-specific filesystem/network isolation. Do not assume default read policy is Matter isolation. |
| COMPUTER | [https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool) | official-documentation | Provider computer observation/action interface; not independent validation of cross-provider or cross-OS maturity. |
| CLAUDE-CLI | [https://code.claude.com/docs/en/interactive-mode](https://code.claude.com/docs/en/interactive-mode) | official-product-documentation | Background task IDs, output retrieval, interrupt, resume surfaces; no closed-source internals inferred. |
| CLAUDE-DESKTOP | [https://code.claude.com/docs/en/desktop](https://code.claude.com/docs/en/desktop) | official-product-documentation | Code-tab diff review, panes, shared execution environment and browser profiles; not a backend ontology audit of Chat/Cowork. |
