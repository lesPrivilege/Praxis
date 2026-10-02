# Drift 探针源码研究 · 2026-09-30

本目录消费了两个固定提交源码 seed：[`yacuo/check-cc`](https://github.com/yacuo/check-cc/tree/078e7baa1d2a08df28da3f25dacb90e687f4c79f)（MIT）与 [`TZZ520/claude-environment-check`](https://github.com/TZZ520/claude-environment-check/tree/723385d6e07052196fe0e2df4647c7c88882c993)（Apache-2.0）。固定提交分别为 `078e7baa1d2a08df28da3f25dacb90e687f4c79f`（2026-08-03）和 `723385d6e07052196fe0e2df4647c7c88882c993`（2026-07-04）。GitHub API 返回两个仓库均存在、默认分支 main、未归档；官方许可证文件与 API 一致。TZZ 的 [Pages 部署](https://tzz520.github.io/claude-environment-check/) 返回 HTTP 200，但当前部署字节未与固定提交绑定。

完整逐 URL 登记、原始出现位置、证据状态、快照路径与 SHA-256 在 [`catalog.json`](catalog.json)；本批 intake 在 [`vault/intake/drift-checkers-20260930.json`](../../intake/drift-checkers-20260930.json)。共保存 23 个必要上游文件。未保存依赖/lockfile/构建产物，也未安装、构建或运行上游项目。

## 可安全借鉴

- 将每项检测建模为独立观测：`status`、值、来源/方法、采集时间、耗时、错误或 unknown 原因。TZZ 的 [`model.go`](snapshots/claude-environment-check/internal/model/model.go) 具备 status/source/evidence/duration 字段；可借结构，剥离 weight/score。
- 明确浏览器权限边界：无法读 macOS 系统代理/PAC、系统 DNS 配置和系统证书库就写 `unknown`。TZZ [`browserScan.ts`](snapshots/claude-environment-check/web/src/browserScan.ts) 同样显式区分浏览器可见值与本机不可见值。
- 给网络请求设置有限超时，捕获错误并保留可理解的失败原因。TZZ native scanner 默认单次检查 8 秒、整体 context 约 3 倍超时；CheckCC 的配置声明 3 秒默认超时、IP 服务 3.5 秒，但其 runner 对插件并未体现 timeout enforcement。因此只借鉴边界与错误语义，不照搬其超时实现。
- 浏览器可见信息可使用 `navigator.languages`、`navigator.userAgent`、可用时的 `userAgentData.platform/brands` 与 `Intl.DateTimeFormat().resolvedOptions()`。见 [`client-engine.ts`](snapshots/check-cc/src/detection/client-engine.ts#L109)。这些值描述浏览器暴露的信息，不保证准确代表 OS；macOS 原生只读采集应明确来源和失败状态。
- macOS 原生配置读取可考虑 `scutil --dns` / `scutil --proxy` 的受限只读路线，且在超时/命令缺失时返回 unknown。TZZ scanner 有相关调用；Drift 只借鉴路径，不保留其完整代理地址、自动发现 URL 或诊断细节，只输出请求范围内的代理启用布尔值。
- 公网 IP/ASN 必须记明公开回显或 ASN 数据来源与采样时间。浏览器/应用观察到的是该请求链路对端看见的地址；服务失败或数据源不可用时 unknown，不能将空值解释成风险。

## 来源事实与作者解释分开

**源码可核事实：** CheckCC 的 browser collector 读取 Navigator/Intl，并用 canvas 字体测量生成额外信号；其信号随后进入地区 profile 权重评分。runner 默认配置声明 `failFast=false`、`defaultTimeoutMs=3000`，IP intelligence 默认 disabled、timeout 3500ms（[`runner.ts`](snapshots/check-cc/src/detection/config/runner.ts)、[`services.ts`](snapshots/check-cc/src/detection/config/services.ts)）。

TZZ 的 browser scan 将系统代理/PAC、CA 库、本机 DNS 配置和 CLI 状态明确标记为网页 unknown；网页对 API 的 `no-cors` 请求只提供基础链路完成信息，不能读取真实 HTTP 状态。其 native collector 读系统 DNS/代理配置并运行公网 IP、TLS、WebSocket、DoH 比对；默认公共 IP fallback 会向第三方发送网络请求。它实现 signed rules 与加权 compatibility/region-exposure score。TZZ 作者也在 web 限制说明中指出浏览器到 Probe 的 TLS/JA3 只描述该浏览器连接，不代表 CLI。

**作者判断 / 评分 / 修复建议：** 两项目源码包含地区画像、住宅 IP 判断、地区风险权重、支持状态、颜色阈值和建议。这些只是作者自行定义的启发式，不是经过本研究验证的事实，也不表示掌握任何供应商的内部策略。Drift 不应移植其权重、风险总分、地区判断或 remediation。

## 明确边界与未覆盖

- 不采集或伪装浏览器/系统指纹；不采集字体指纹、JA3 或其他客户端指纹。
- 不把浏览器 DNS prefetch/远端 DNS Probe 结果冒充 macOS resolver 配置或 DNS egress；缓存、DoH、代理和浏览器策略都会影响可见性。本批没有配置/托管验证用的权威 DNS Probe。
- 不做 WebSocket egress 比较：它需要远端配套 Probe，超出首版观测范围。
- TLS 只报告到明示目标的可达性以及明确测得的握手结果；浏览器 `no-cors` 成功不能证明目标 HTTP 返回状态、系统信任库状态或其他客户端的 TLS 行为。
- 本批未检查 `checkcc.org`、`sihuangtech/ip-purity-checker`、`superagents-lab/howismyip`，也未验证任何 IP/ASN 服务的数据质量；未捕获 Go/Node 依赖与 lockfile。TZZ Pages 部署能访问，但部署内容的当前提交未核实。

源码快照：[`check-cc`](snapshots/check-cc/) · [`claude-environment-check`](snapshots/claude-environment-check/)。来源状态均为 supplemental-reference，等待 Astra 审阅；本研究不修改 Kit、ADR、应用或全局索引。
