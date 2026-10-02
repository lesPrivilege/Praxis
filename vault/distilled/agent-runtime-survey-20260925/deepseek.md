# DeepSeek Harness 新版功能机制交接

研究日期：2026-09-25（Asia/Singapore）

结论先行：官方当前可见版本是开发预览 `dsh-v0.1.7-rc.2`，tag 指向 `477b4f420553e8a52c2fbccc464d7561b239c443`，发布于 2026-09-24T14:10:21Z。派单中的初始仓库线索 `https://github.com/deepseek-harness/deepseek-harness` 在本次访问返回 404；官方仓库身份核实为 [`deepseek-ai/deepseek-harness`](https://github.com/deepseek-ai/deepseek-harness)。本轮没有安装、构建或运行 DSH。

本批 Exa 调用的 `numResults` 总和为 **132**（去重与筛选后以官方仓库/官方文档为准）。原始 URL、主张和边界见 [`deepseek-sources.json`](./deepseek-sources.json)；必要摘录及 hash 见 [`deepseek/manifest.json`](../../snapshots/agent-runtime-survey-20260925/deepseek/manifest.json)。

## 基线和版本差异

Praxis 已消费基线是既有已登记卡片 [`dsh-release-016-alpha2.md`](../../provenance/work-system/r3-harness/cards/dsh-release-016-alpha2.md)（状态 `verified`），并由 [`vault/provenance/work-system/r3-harness/catalog.json`](../../provenance/work-system/r3-harness/catalog.json) 的 `dsh-release-016-alpha2` source entry 索引；固定为 `dsh-v0.1.6-alpha.2`、commit `ddefc45fbc7f8e46dd73185e68295696d1297887`，约 2026-09-17 发布。该基线不是本轮凭 release 页面临时推断。本轮没有把本地 DeepSeek-TUI/Reasonix 当作 DSH 版本基线。`/Users/lesprivilege/Projects/DeepSeek-TUI` 是 2026-05-17 的 Hmbown/DeepSeek-TUI 源码快照（workspace 0.8.39）；`DeepSeek-Reasonix` 是 2026-05-18 的 0.46.1 快照；`DeepSeek-Reasonix-main` 是 2026-05-23 的 0.49.0 快照。它们可作本地 runtime 参照，但不是官方 Harness checkout。

| 对照 | 固定版本 | 这次应归属的功能增量 |
|---|---|---|
| 已消费基线 | `v0.1.6-alpha.2 @ ddefc45` | 既有卡片已记录 profile/plugin manager、运行时安装/卸载、Client Sessions 等；本轮沿用，不重新升级主张。 |
| `alpha.2 → 0.1.7-rc.1` | `rc.1 @ 46a7f68`，2026-09-23 | rc.1 发布说明集中汇总了归档/筛选/恢复、MCP resources/URI 模板、headless stdin/session-id/NDJSON、SSH 工作区、浏览器/CUA、Auto review、文件 diff、Office/URL/Subagent/plan 侧栏、registry fallback、Team/voice，以及 Session V4、插件兼容检查和冷恢复修复。**这是 release surface 对照，不是逐项的 alpha.2→rc.1 引入证明**：既有 alpha.2 卡片已列 Office/URL/Subagent/计划预览，其他更早 release 卡片也覆盖部分 Browser/CUA/MCP/headless。它们均不是 rc.2 新增。 |
| `rc.1 → rc.2` | `rc.2 @ 477b4f4`，2026-09-24 | 定时任务及 run history（重启保留，最快每分钟）；可恢复 Desktop onboarding；Web/Desktop shortcut 搜索/自定义/恢复；进行中会话热启用新工具；Auto review deny 后人工决定继续、review failure 分离；Desktop 关窗后任务继续、退出提示影响。另有 Inspector 改为单独安装、账号/Key 模型入口分离、scheduled tasks/time context 默认关闭、Coding Tools 合并轨迹/差异/模式选择。 |

## 可复用的实现机制

1. **Provider / model routing 是可替换注册表，不是 profile 自身的权限。** `LlmRuntime` 同时维护 adapter routes、configurable-provider directory 和 model-discovery offers；`registerAdapter().replace()` 与 `registerConfigurableProviders().replace()` 先完整验证候选，再在一个同步段替换，读者看不到空窗（[`llm-runtime.ts.txt`](../../snapshots/agent-runtime-survey-20260925/deepseek/llm-runtime.ts.txt)，上游 `packages/llm/llm/src/index.ts:293-335,338-470,490-627`）。`prepareCall()` 将模型解析和实际 stream 绑定到同一 adapter generation（`270-283`），session 的 `request/context` 另行记录 provider/model/capacity（[`architecture.md.txt`](../../snapshots/agent-runtime-survey-20260925/deepseek/architecture.md.txt)，`docs/subsystems/session.md:143-148,208-224`）。这适合作为多 provider gateway 的“原子 route swap + durable route provenance”候选。

2. **Provider 配置与 secret 分开。** configurable provider 只登记 `settingsNs/settingsPath/displayName`；discovery 以 settings namespace 服务草稿 endpoint，返回去重后的模型 metadata，不替配置或凭据落盘（`llm-runtime.ts.txt` 上游 `554-627`）。credentials seam 每次 operation 重新解析值，UI 只读 configured/source/writable 等脱敏事实（`packages/credentials/credentials/src/index.ts:154-201`）。可借鉴“route descriptor、discovery、credential reference、request-time resolve”四件分离；不要把 API key 当 provider route 的 durable value。

3. **Schedule 从 session-local reminder 升成 Host-wide durable task。** 当前 `ScheduleService` 打开 storage domain 的 `tasks` 表，管理全局 id、原 Session 绑定、delivery history（30 天/200 条默认），读/list/history 不激活 Session；archive stop 会在同一 serialized queue 中删除仍 armed 的任务（[`schedule-index.ts.txt`](../../snapshots/agent-runtime-survey-20260925/deepseek/schedule-index.ts.txt)，上游 `packages/schedule/schedule/src/index.ts:72-229,236-430`）。`ScheduleRuntime` 只保留一个 timer，恢复 Agent 后 `followup`，先 `sessions.flush()`，再提交 delivery/status/next occurrence；失败保留任务并记录未确认 id（[`schedule-runtime.ts.txt`](../../snapshots/agent-runtime-survey-20260925/deepseek/schedule-runtime.ts.txt)，`1-165`）。这直接支撑 rc.2 的“重启保留 + run history”；但仍是 session 绑定的 conversational delivery，不等于外部通知或 exactly-once。

4. **Plugin manager 是 profile-wide HMR composition，不是安全沙箱。** Web sidebar 和 `plugin_manager` tool 共用 install/remove/toggle/inspect；需要 Full access 或本次 approval，已安装 Host code 在进程内执行。HMR 重新读取 bundle/patch、等待卸载资源、通过 profile writer lock 串行写入；当前 profile 的所有 Sessions 都受影响（[`plugin-manager.md.txt`](../../snapshots/agent-runtime-survey-20260925/deepseek/plugin-manager.md.txt)，上游 `packages/boot/plugin-manager/README.md:10-18,28-67,86-94`）。这解释 rc.2 的“进行中会话使用新工具”可行路径，也给出明确边界：profile-wide 热变更必须有 approval、compatibility check、失败恢复和 restart-required 状态。

5. **Question/approval 是 provider-neutral presentation seam。** `ctx.userQuestions.ask()` 只负责稳定 id、选项/多选/Other、intent（presentation only）和错误词汇，通过 Agent-scoped `user-questions/request` waterfall 交给 Web/remote answerer；提供 Agent 时只允许 exact live root，owned child 返回 `DELEGATED_CALLER`，避免子代理永久等待（[`user-questions.ts.txt`](../../snapshots/agent-runtime-survey-20260925/deepseek/user-questions.ts.txt)，上游 `packages/interaction/user-questions/src/index.ts:64-150`；文档 `docs/subsystems/user-questions.md:23-35,49-108`）。可登记为 Work Surface 的询问/确认接缝，但 intent 不能被当成 Authority。

6. **Subagent continuation 是 durable child Session + process-local Activation。** provider 在 start 前声明能力；不支持 `agentOptions/outputSchema/depthLimit/toolFilter/persona` 就 typed reject。`toolFilter` 同时影响 schema visibility 和 execution lookup，但文档明确它不是 authority、sandbox 或 parent subset（[`subagent-types.ts.txt`](../../snapshots/agent-runtime-survey-20260925/deepseek/subagent-types.ts.txt)，上游 `packages/subagent/subagent/src/types.ts:119-200`）。continuation manager 以 Agent inbox 为唯一 FIFO，stable child id/descriptor 入持久 Session；send 只允许 exact live parent/child 邻接，冷 child 通过 persisted descriptor resume，accepted inbox message 后 caller cancellation 不再撤销（[`subagent-continuation.ts.txt`](../../snapshots/agent-runtime-survey-20260925/deepseek/subagent-continuation.ts.txt)，上游 `continuation.ts:1-11,97-325,402-420`）。这是 Host admission、direct-parent authorization、recovery 的高信号参考。

7. **Durability 由 append-only event log + flush barrier + single writer 组成。** `SessionPersistence` 不另造事件类型；handle 统一 read/append/flush/close，append 可先入 buffer，只有 flush 承诺 crash durability，第二 writer 直接拒绝。崩溃 open turn 不被静默截断；resume 在同一 write handle 下补 missing tool errors、open step/end 和 synthetic interrupted turn/end，再发布 Session（[`persistence.md.txt`](../../snapshots/agent-runtime-survey-20260925/deepseek/persistence.md.txt)，上游 `docs/subsystems/persistence.md:5-11,67-114`）。适合作为 event/receipt/recovery 研究参考；不要把它自动等同 Courtwork 的 committed effect receipt。

8. **Auto review 是可卸载的实验性 policy plugin，失败关闭但不是 sandbox。** 它在 `tools/pre-execute` 预审 native/PTC inner call，沿用当前 provider/model，`allow` 直接 Full access；`ask` 下 deny 进入人工审批，`never` 下 delegated child deny 为终局；reviewer failure 与 final denial 分开，卸载时迁移 live Auto Session、abort/drain review（[`permission-auto-review.md.txt`](../../snapshots/agent-runtime-survey-20260925/deepseek/permission-auto-review.md.txt)，上游 `auto-review/src/index.ts:617-739`）。官方自身列出没有 deterministic sandbox、grant 或通用配置。可参考 gate/ask/deny 语义，不能照搬为 Courtwork Authority 或安全证明。

9. **Background jobs 的 owner fence 与 wakeup 机制清楚，但当前是 process-local。** `dsh-jobs` 以 owner Session 隔离 job read/kill/wait，`dsh-tool-jobs` 在 busy owner 的 next step 注入完成，在 idle owner 用 follow-up wake；`maxConsecutiveWakes` 限制自激链。官方明确 shipped registry 进程退出即丢失，跨重启需要另一个 backend（[`jobs.md.txt`](../../snapshots/agent-runtime-survey-20260925/deepseek/jobs.md.txt)）。可登记为本地 agent CLI 的 job control 参考，不能宣称持久任务已由该包实现。

## 给 Astra 的裁决候选

- **可登记为参考工单：** provider registry 的 atomic route replacement、discovery/credential separation、durable route context；user-question waterfall 的 stable answer vocabulary；subagent 的 capability fail-loud、direct-parent authorization、cold resume；session persistence 的 flush/single-writer/interrupted-turn recovery；schedule 的 durable task + delivery history + serialized archive stop。
- **需保持条件化：** plugin-manager/HMR 只能作为 profile-wide controlled mutation 参考，必须连同 approval、compatibility、rollback/unknown outcome、restart boundary 一起登记；“进行中会话热启用工具”应单独写验证条件，不能由 release note 推成所有 provider/tool 都无缝可见。
- **不建议照搬：** Auto review 的模型裁决不能代替 Authority/sandbox/effect receipt；`toolFilter` 不能代替权限；process-local jobs 不能当持久队列；Schedule 的 conversational `followup` 不能当外部 notification 或 exactly-once receipt；DSH profile/plugin code 的同进程加载不等于安全隔离。

## 未验证和覆盖边界

未运行 DSH/插件，未核查真实 provider/gateway、账号与 API key、registry 镜像、Web/Desktop 跨平台行为、关窗/退出竞态、Node 版本兼容、Session V4 实例迁移、暗色/视觉表现和性能。rc.2 release note 的 shortcut/onboarding/background/热启用行为尚未逐个回查实现测试；本轮只核到上述功能机制与源码路径。已有官方来源仍处 developer preview，兼容性可破坏变化；本报告不构成安装、替换、发布或接受架构决策。
