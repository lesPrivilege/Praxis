# Agent Runtime 机制研究 · 2026-09-25

Luna 三路探索，Astra 编订与裁决。研究到功能细节、关键接口与失败边界，不逐行审计；未安装或运行外部项目。结论是增量参考与四个有限候选工单，不替换当前 Pi，不新增 Orchestra Core 或通用网关平台。

## 从这里消费

| 需要 | 阅读入口 | 本轮结论 |
|---|---|---|
| DeepSeek 新版究竟变化什么 | [版本与机制 diff](deepseek.md) | 官方 `dsh-v0.1.7-rc.2` / `477b4f4`，2026-09-24 发布，仍是预发布；区分 alpha.2 历史基线、rc.1 功能汇总与 rc.2 新条目 |
| 哪个 Orchestra 值得参考 | [同名候选与实现](orchestra.md) | 未获用户确认唯一仓库；`proboscis/orch` 优先参考任务/尝试/工作树管理，Agent Workbench 参考 native session UI，AI Orchestra 仅保留同名候选 |
| 多 provider 怎样路由、重试、续接 | [三网关对照](gateways.md) | CLIProxyAPI、LiteLLM、Bifrost；参考 actual route/attempt、流式提交边界及 opaque state affinity，不照搬账号池和默认自动 fallback |
| 哪些参考、哪些开单 | [Astra 裁决与候选工单](disposition.md) | ARS-01 请求身份、ARS-02 重试/续接边界、ARS-03 单 CLI 生命周期、ARS-04 持久提醒（延后） |
| 与现有 CW 架构怎样衔接 | [消费边界](consumption-boundary.md) | 固定 CW `10c364e`，沿现有 Host/Runtime/Provider owner；已接受的 Run binding、CAS、恢复机制不重复登记 |

## 证据等级与覆盖

官方文档说明、关键实现已读取、实际运行已验证是三个不同等级。本批只有前两类证据；搜索结果出现不算主张核实，读取源码也不证明真实行为。外部研究摘录可能是归纳或短节选，不冒称原始仓库逐字节快照。

- [入账与覆盖](../../intake/agent-runtime-survey-20260925.json)
- [逐 URL 来源卡](../../provenance/agent-runtime-survey-20260925/README.md)
- [本地原件与外部研究摘录](../../snapshots/agent-runtime-survey-20260925/README.md)
- [验证回执](../../../docs/verification/agent-runtime-survey-20260925.md)

未验证真实账号/API、跨 provider 工具重放、取消/恢复故障、跨平台桌面行为、迁移、性能与包兼容性。未保存完整上游源码、依赖与网页 renderer，不声称外部项目可离线运行。

Orchestra 名称对应的候选仍应在实施前确认；本次用户允许 Exa 自行探索，并未指定唯一 repo。候选工单仅在本研究包登记，尚未写入 Courtwork backlog 或远端 issue，未触发施工。
