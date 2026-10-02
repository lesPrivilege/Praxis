# Bifrost HTTP transports/v2.2.2：关键证据摘录

固定版本：tag `transports/v2.2.2`，annotated tag dereference commit `fdeef8e3f31a3b18a61666ba49247d07bae3600a`；GitHub release published `2026-09-23T05:23:40Z`。

来源：

- Provider routing：<https://docs.getbifrost.ai/providers/provider-routing>
- Model catalog：<https://docs.getbifrost.ai/architecture/framework/model-catalog>
- Retries/fallbacks：<https://docs.getbifrost.ai/features/fallbacks>
- Governance/virtual keys：<https://docs.getbifrost.ai/features/governance>
- Budget/rate limits：<https://docs.getbifrost.ai/features/governance/budget-and-limits>
- Cancel response API：<https://docs.getbifrost.ai/api-reference/responses/cancel-a-response>
- Fixed-version source guide (layout evidence)：<https://raw.githubusercontent.com/maximhq/bifrost/fdeef8e3f31a3b18a61666ba49247d07bae3600a/AGENTS.md>
- Core/provider schema：<https://raw.githubusercontent.com/maximhq/bifrost/fdeef8e3f31a3b18a61666ba49247d07bae3600a/core/schemas/provider.go>
- Core queue/stream source：<https://raw.githubusercontent.com/maximhq/bifrost/fdeef8e3f31a3b18a61666ba49247d07bae3600a/core/bifrost.go>
- MCP agent loop：<https://raw.githubusercontent.com/maximhq/bifrost/fdeef8e3f31a3b18a61666ba49247d07bae3600a/core/mcp/agent.go>
- Streaming accumulator：<https://raw.githubusercontent.com/maximhq/bifrost/fdeef8e3f31a3b18a61666ba49247d07bae3600a/framework/streaming/accumulator.go>
- HTTP inference handler：<https://raw.githubusercontent.com/maximhq/bifrost/fdeef8e3f31a3b18a61666ba49247d07bae3600a/transports/bifrost-http/handlers/inference.go>

已查证的实现要点：

- Model Catalog 从 provider `/v1/models` 和 pricing/capability 数据建立 provider↔model 映射；显式 `provider/model` 可确定路由，裸 model 由最后的 resolver 依据 catalog 选择 provider。governance 与 load balancing 共用 catalog 的 allow-check。
- Virtual Key 的 `provider_configs` 组合 allowed_models、key_ids、weight、budget/rate limit；weighted selection 产生 primary 与 ordered fallbacks。routing rules 可用 CEL、priority、scope 和 fallback provider list。响应额外字段可报告实际 provider。
- provider 级 retry 与跨 provider fallback 分开：同 provider 的网络/5xx 复用同 key、指数退避；429/401/402/403 按 key 轮换并区分暂时/永久失败；provider retry 耗尽后才进入下一个 fallback，每个 fallback 有完整 retry budget。请求取消不重试。
- fixed-version source layout 显示每 provider 独立 queue/worker，HTTP integration 层负责 OpenAI/Anthropic/Bedrock/GenAI 等格式转换，stream accumulator 按 request ID 保存 chunks；MCP agent loop 处理多轮 tool call，并行执行可自动执行工具，未知或不可执行工具留给下游处理。
- governance 以 virtual key/team/customer 预算及 request/token rate limit 控制路由可用性；telemetry/logging/otel 等插件提供 metrics、audit log、trace。API schema 与配置支持 env-backed secrets、file-only 或 DB-backed config；管理面和推理面可分开授权。

不可直接外推：高吞吐、MCP agent loop 和 governance 是 gateway 能力，不等于本地 agent run 的生命周期/Host admission。fallback 请求涉及工具和副作用时，必须由上层定义何时允许重放；已发出流不能无感切 provider。Bifrost 的 database/UI/插件面较重，不应直接照搬为轻量本地 CLI sidecar。
