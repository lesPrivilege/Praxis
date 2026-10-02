# CLIProxyAPI v7.3.16：关键证据摘录

固定版本：`v7.3.16`，tag dereference commit `c404af96ebacedf8168b3c2bdbf4449a21cd1c1e`；GitHub release published `2026-09-24T00:10:28Z`。

来源：

- README：<https://raw.githubusercontent.com/router-for-me/CLIProxyAPI/c404af96ebacedf8168b3c2bdbf4449a21cd1c1e/README.md>
- SDK：<https://raw.githubusercontent.com/router-for-me/CLIProxyAPI/c404af96ebacedf8168b3c2bdbf4449a21cd1c1e/docs/sdk-usage.md>
- Claude executor：<https://raw.githubusercontent.com/router-for-me/CLIProxyAPI/c404af96ebacedf8168b3c2bdbf4449a21cd1c1e/internal/runtime/executor/claude_executor_execute.go>
- Codex executor：<https://raw.githubusercontent.com/router-for-me/CLIProxyAPI/c404af96ebacedf8168b3c2bdbf4449a21cd1c1e/internal/runtime/executor/codex_executor_execute.go>
- Codex stream：<https://raw.githubusercontent.com/router-for-me/CLIProxyAPI/c404af96ebacedf8168b3c2bdbf4449a21cd1c1e/internal/runtime/executor/codex_executor_stream.go>
- Model registry：<https://raw.githubusercontent.com/router-for-me/CLIProxyAPI/c404af96ebacedf8168b3c2bdbf4449a21cd1c1e/internal/registry/model_registry.go>

已查证的实现要点：

- README 把产品定位为面向 CLI 的 OpenAI/Gemini/Claude/Codex/Grok 兼容服务；列出 OAuth 登录、多个账号 round-robin、流式/非流式/WebSocket、tools/function calling、多模态和 OpenAI-compatible upstream 配置。
- SDK 的 `Service` 以 context 运行，负责 config/auth watcher、token refresh 和 graceful shutdown；`Manager.Execute` 与 `ExecuteStream` 作为独立执行入口，认证与 executor 可注入。management endpoint 需要 secret，远程访问还需显式 `allow-remote`。
- Claude/Codex/Antigravity executor 先根据 source/response format 做请求变换，再做 thinking/reasoning、tool schema、并行 tool、身份和模型兼容处理；响应再按下游格式翻译。Codex/Claude 有 reasoning replay/signature/cache 相关路径。
- executor 以 `http.NewRequestWithContext` 绑定取消；在请求、响应 metadata、响应 chunk/error 路径写入 request log。Codex stream 明确在 bootstrap 缓冲期识别 overload 才允许 conductor 在首字节前换 credential；流已开始后则把终态错误交付给下游。
- registry 保存 model/provider client 及 quota-exceeded client 状态；`ModelInfo` 同时携带 provider-specific capability、context length、thinking 等信息。credential weight 独立规范化，非正权重排除 weighted routing。

不可直接外推：README 的 provider/model 名单会随主线更新；文档和代码未证明它是通用 Host executor scheduler，也未证明跨运行时的自动切换具有副作用安全语义。OAuth 订阅凭据、服务条款和账号风险不在本研究范围内。
