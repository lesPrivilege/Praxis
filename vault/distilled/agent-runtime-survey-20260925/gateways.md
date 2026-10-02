# 多 provider 网关路由参考（Luna explore 交接）

研究日期：2026-09-25（Asia/Singapore）。范围固定为 3 个有官方公开实现、可服务本地 agent/CLI 的网关：CLIProxyAPI、LiteLLM、Bifrost。未做市场大全，也没有安装、运行或修改本地 CLI 配置。Exa 共发起 11 次搜索，`numResults` 总量 90；随后只读取候选官方文档、固定版本 README/source 和 release metadata。结论是参考候选，不是 Praxis 采纳。

## 版本锚点

| 项目 | 固定版本/日期 | 公开实现定位 | 适配本地 agent/CLI 的证据 |
|---|---|---|---|
| [CLIProxyAPI](https://github.com/router-for-me/CLIProxyAPI) | `v7.3.16`，2026-09-24；tag commit `c404af96ebacedf8168b3c2bdbf4449a21cd1c1e` | Go，本地 proxy + provider-specific runtime executors；OAuth/auth-file pool | 官方 README 直接定位 CLI；OpenAI/Gemini/Claude/Codex/Grok 兼容入口，multi-account、stream、tools、多模态、SDK embed |
| [LiteLLM](https://github.com/BerriAI/litellm) | `v1.101.2`，2026-09-24；commit `ccb327f032c69754445763dbec669a5d2517630c` | Python proxy/router；Rust gateway 仍 staged | 官方 proxy CLI/config/SDK 文档；`model_name`/deployment routing、Redis shared limits、fallback/spend logs |
| [Bifrost](https://github.com/maximhq/bifrost) | HTTP `transports/v2.2.2`，2026-09-23；annotated tag deref `fdeef8e3f31a3b18a61666ba49247d07bae3600a` | Go core + HTTP transport + plugins；provider queue/MCP/gov | OpenAI-compatible gateway、SDK integrations、MCP/tool loop、provider/model catalog、virtual keys |

固定版本不是“截至今日 HEAD”。CLIProxyAPI 与 Bifrost 均有频繁 release；LiteLLM 同批有 dev release，故这里选稳定版并记录精确 commit。版本和日期来自官方 GitHub release/tag API 页面，源码链接使用该 commit 的 immutable raw URL。

## 功能细节比较

| 维度 | CLIProxyAPI | LiteLLM | Bifrost | 对 Praxis 的读法 |
|---|---|---|---|---|
| 路由粒度 | provider-specific executor → model/auth client；credential pool 内可按权重、quota/cooldown 选择 | 客户端 `model_name`/alias → deployment group；`litellm_params.model` 才是 provider/deployment；`order` 与 routing strategy 选 deployment | `provider/model` 可显式 pin；裸 model 由 Model Catalog resolver 找 provider；VK、CEL rule、weighted targets 可再选 primary/fallback | 先保存 requested/resolved provider+model+auth，再谈自动路由；不要把 alias 当真实执行身份 |
| provider/model 身份 | registry 保存 provider/client、provider-specific ModelInfo 和 quota-exceeded client；request log 带 auth/provider/upstream model | fallback spend log 记录 original group 与实际 group；响应 header 可暴露 deployment/model id；affinity 记录原 deployment | `extra_fields.provider` 报实际 provider；catalog 维护 provider↔model 和 capability/pricing | 需要稳定 `route decision/attempt trail`，可区分 requested、resolved、selected、fallback |
| request/response 转换 | source/target translator；Claude/Codex/Antigravity 在 upstream 前做 model、tool schema、thinking/reasoning、identity/cache/signature 处理，回程按下游格式翻译 | Python provider adapters；Rust `prepare` 分离 provider/model、credential、auth header、URL 与 transform；`handler` 做 call + response transform | HTTP integrations（OpenAI/Anthropic/Bedrock/GenAI 等）→ Bifrost schema；provider 实现各自 request/response conversion | 只采纳“转换层显式、provider executor 独立”的结构；不要用 schema 相似掩盖语义丢失 |
| tool/reasoning | 有工具 schema/parallel tool normalization；Claude/Codex/Antigravity reasoning replay/signature/cache，部分 CLI identity 注入 | 文档能确认统一 provider route 和 Responses affinity；Rust source 明确 typed transforms，但全量 tool/reasoning parity 尚未完成 | MCP agent loop 多轮执行 tool call；自动执行与非自动执行分流，未知/不可执行留给下游 | tool call ID、reasoning item/signature、session state 必须和 retry policy 绑定；跨 provider 重试需上层批准 |
| 流式、重试、fallback | stream executor 用 context；Codex bootstrap 阶段缓存 frames，只有首字节前 overload 才换 credential；流已开始后错误交付下游 | 每 deployment `num_retries` 后按 fallback 顺序；cooldown；Redis 共享 RPM/TPM。文档未证明首字节后安全切 deployment | provider retry 与 provider fallback 分层；同 key 的网络/5xx 指数退避，429/401/402/403 key rotation；fallback 各自完整 retry budget；取消不重试 | retry 边界以“首字节/副作用”划线；同 runtime credential retry 与跨 runtime executor fallback 分开登记 |
| 预算/限流/熔断 | quota/cooldown/account status；未核实为通用预算/熔断系统 | RPM/TPM、budget/virtual key、cooldown；没有把 circuit breaker 当已核实核心能力 | VK/team/customer/provider-config budget、request/token rate limit；有 circuit-breaker API surface，但本批未深审策略细节 | quota/budget/rate-limit 是治理层；熔断可作为单独能力，不由 provider adapter 隐式决定 |
| 凭据边界 | OAuth/auth files、token refresh、API key/client source；management secret，remote management 需显式开关 | provider key 通常 env/os.environ；proxy virtual key 与 model access controls | provider key 可 env-backed；virtual key `key_ids` 限定具体 provider key；file-only 或 DB-backed config | 只记录 credential scope/id/type 和 selected key 的 trace；secret 永不进普通请求日志 |
| 取消、粘性、会话 | `http.NewRequestWithContext`；session context；reasoning replay/credential-aware handling | Responses `encrypted_content_affinity` 把 follow-up 粘回原 deployment/key；一般粘性需另证 | context cancellation；Responses background cancel endpoint；source layout 有 session-affinity/key-selection context | session affinity 是 response/tool/reasoning 连续性的契约，不能仅作为“负载均衡优化” |
| 观测 | upstream request/response metadata/chunks/error log，request ID；SDK hooks/request logger | spend logs、fallback metadata、headers、debug logs/callbacks；Rust gateway README 明确这些仍由 Python 拥有 | request logs、Prometheus/telemetry、OTel/logging plugins、provider/attempt context | gateway 只能提供证据与统计；run receipt、Host admission、恢复和副作用治理仍属 Praxis |

## 可直接借鉴的实现形状

1. **显式路由身份（PV-13 对齐）**：入口保存 `requested_protocol/model`、解析后的 `provider/model`、`auth_scope/type/id`，再保存 `selected runtime/executor` 和每次 attempt。Bifrost 的显式 `provider/model`、LiteLLM 的 `model_name → deployment` 分层，以及 CLIProxyAPI 的 provider/model/auth logs 共同支持这一点。
2. **两层 retry 语义**：区分同一 provider 内的网络/429/credential retry 与显式允许的 provider/model fallback，不默认执行后者；用不同事件和预算标记二者。Bifrost 明确区分同 key retry、per-key rotation、跨 provider fallback；CLIProxyAPI 的 Codex bootstrap 也把“首字节前换 credential”与“流内错误”分开。
3. **首字节前可换，首字节后不静默换**：没有拿到下游可见内容前，只在原请求明确允许重试、预算仍足且不存在未结算副作用/不透明续接约束时，才可考虑透明 retry；首字节前本身不证明上游未执行。已经发出 stream chunk 或 tool side effect 后，必须交付终止/恢复事件，不可自动变更执行器并假装同一次请求。三项目的文档不足以替上层定义副作用策略，但 CLIProxyAPI/Bifrost 源码边界已给出可复用形状。
4. **provider/model capability registry**：以 provider-specific capability、context window、reasoning/tool support 为可查询数据；裸 alias 解析后把候选和选择写进 trace。Bifrost Model Catalog 与 CLIProxyAPI Model Registry 都是实现参考。
5. **粘性与回放保护**：带 encrypted reasoning item、tool call continuation 或上游 session id 的请求必须 pin 到能解密/继续该状态的 deployment/auth；LiteLLM 的 `encrypted_content_affinity` 是窄而清楚的参考。
6. **网关观测与 run receipt 分界**：借鉴 fallback attempt、selected provider、latency、usage、error class 的记录；不要把 provider gateway 的日志当作 Praxis 的 Run receipt、Host admission 或恢复证明。

## 候选工单（待 Astra 裁决）

- **GW-01 Route Decision / Attempt Trail（建议进入 PV-13 增量）**：定义 requested → resolved → selected → fallback 的事件字段，强制 provider/model/auth trace 在自动路由和配额 fallback 之前落地；每次重试标注 `same-runtime credential` 或 `cross-provider`。
- **GW-02 Pre-byte Retry Boundary**：在 stream 首字节前允许按请求契约 retry；首字节后禁止静默切换，返回可恢复的 terminal/incomplete 事件；tool call 已执行时禁止未经策略批准的重放。
- **GW-03 Provider/Model Capability Registry（衔接 PV-21）**：维护 provider-specific model capability、context/reasoning/tool/stream/cancel 支持和 alias mapping；显式 provider/model 优先，裸 alias 选择必须可追溯。
- **GW-04 Credential Scope and Session Affinity**：把 credential scope、key id、session affinity、encrypted reasoning/tool continuation 作为同一请求契约的可审计字段；secret 只走受控 credential store。
- **GW-05 Budget/Rate/Fallback Guardrails**：预算、RPM/TPM、cooldown/circuit、provider fallback 的顺序和边界写成 provider-independent policy；每层拒绝原因可观测，不能由网关自行变成 Host admission。

## 不适合照搬

- 不把 CLIProxyAPI 的 OAuth/subscription account pool、provider-specific executor 或其模型特例当作 Praxis 的通用 runtime/executor 选择器；它可参考 credential-bound retry，不能授权跨 runtime 自动换执行器。
- 不把 LiteLLM 的公开 `model_name` alias 当作稳定执行身份；必须保留 underlying provider/deployment，并注意 Rust gateway 在 v1.101.2 仍明确将 retry/routing/logging/spend 等能力留在 Python。
- 不直接复制 Bifrost 的 full gateway/MCP/governance/database/UI 插件面；它适合提取队列隔离、retry/fallback/key rotation、catalog 和观测契约，成本与运行治理应由 Praxis 自己裁决。

## 覆盖边界

本批没有安装或运行任一项目，没有验证 live provider API、真实 tool side effect、跨 provider request replay、首字节后网络故障、熔断恢复、Node/Python/Go 依赖兼容性或账号/条款风险。官方网页的功能主张已与固定版本 source 做了有限交叉检查；未深审的字段仍标为“文档宣称”或“未核实”。逐 URL 记录、用途和边界见 [`gateways-sources.json`](gateways-sources.json)，证据摘录见 [网关摘录目录](../../snapshots/agent-runtime-survey-20260925/gateways/README.md)。该目录是 Luna 整理的摘录与摘要，不是原网页/源码的逐字节副本；原始正文未快照，必须按固定 URL 回查。
