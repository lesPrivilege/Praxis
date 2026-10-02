# LiteLLM v1.101.2：关键证据摘录

固定版本：`v1.101.2`，commit `ccb327f032c69754445763dbec669a5d2517630c`；GitHub release published `2026-09-24T00:17:20Z`。本版本选稳定 release，未采用同批次的 `v1.104.0-dev.1`。

来源：

- Quick start：<https://docs.litellm.ai/docs/proxy/quick_start>
- Reliability/fallbacks：<https://docs.litellm.ai/docs/proxy/reliability>
- Load balancing：<https://docs.litellm.ai/docs/proxy/load_balancing>
- Model management：<https://docs.litellm.ai/docs/proxy/model_management>
- Rust workspace README：<https://raw.githubusercontent.com/BerriAI/litellm/ccb327f032c69754445763dbec669a5d2517630c/litellm-rust/README.md>
- Rust provider guide：<https://raw.githubusercontent.com/BerriAI/litellm/ccb327f032c69754445763dbec669a5d2517630c/litellm-rust/ADDING_A_PROVIDER.md>

已查证的实现要点：

- `model_name` 是客户端看到的模型组/alias，`litellm_params.model` 指向 provider/deployment；同一公开 model 可挂多 deployment。routing strategy 包括 simple-shuffle、least-busy、usage、latency、cost，`order` 定义 deployment 优先级。
- reliability 文档把 fallback 分为普通错误、content policy 和 context-window；每个 group 先按 `num_retries`，再按 fallback 顺序。cooldown 记录失败部署；spend log 记录 `attempted_fallbacks` 和 `original_model_group`，可追溯实际被 fallback 的组。
- load balancing 文档声明可用 Redis 共享多 proxy 实例的 RPM/TPM 状态；硬限额需显式 pre-call check。Responses API 的 encrypted content affinity 会把包含 `rs_...` reasoning items 的 follow-up 送回创建它的 deployment，避免密文无法由其他 key 解密。
- quick start/config 使用环境变量或 `os.environ/...` 注入 provider key；model management 显示公开模型、underlying provider/litellm model 及成本元数据。它提供统一 OpenAI Chat/Completions 入口，也兼容其他 SDK。
- `litellm-rust/README.md` 明确 Rust gateway 仍是 staged implementation：Python 继续拥有 config、retries、routing policy、logging、callbacks、spend tracking 和 customer plugins，直到 parity/production evidence；Rust core 自己提供 typed route entrypoints、provider transforms、auth、HTTP call 和 router。`ADDING_A_PROVIDER.md` 把 prepare（resolve provider/model, credentials, auth headers, URL）与 handler（provider call + response transform）分开。

不可直接外推：文档没有证明流已开始后可安全换 deployment；tool call/reasoning replay 的副作用契约需要单独验证。Rust gateway 的宣传性能或 staged API 不能当作 Python proxy 的完整行为证据，也不能当作本地 Host scheduler。
