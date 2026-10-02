# 消费边界与既有责任

2026-09-25 · Astra。外部研究的消费基线为 Courtwork main `10c364eab1aee85d3991fa35d9821d640fa843b2`，6 份定向原件均与该提交字节一致；[固定来源](../../snapshots/agent-runtime-survey-20260925/local-context/README.md)与[入账](../../intake/agent-runtime-survey-20260925.json)可复核。来源仓库未修改。

## 先区分三个问题

| 研究对象 | 要回答的问题 | 既有责任归属 | 不从参考项目继承的结论 |
|---|---|---|---|
| DeepSeek Harness | model/tool loop、能力组合、会话与插件怎样变化 | 参考 Harness/Adapter/Extension；当前 Pi loop 继续保留 | 新版机制不等于应替换当前 Runtime，不把外部事件视为正式 Work 决定 |
| 本地 CLI Orchestra | 多个进程怎样发现、启动、交互、停止与恢复 | Host admission + versioned Runtime Adapter + Session/Run | 能显示终端或退出码，不等于可兑现权限、取消和未知结果；worktree 不等于 sandbox |
| 多 provider 网关 | 单次模型请求怎样选连接、转换协议、重试与记录 | provider connection、model、request telemetry；受 Run 配置边界约束 | 模型 fallback 不等于可切换 executor；兼容入口不证明工具、reasoning、usage 完全等价 |

## 避免重复开单

- `ARS-LOCAL-02` 的 Local Agent Orchestra 是 CW 已登记的组合方向，不是一个新增第六层，也不证明某个外部同名仓库就是用户所指。
- `ARS-LOCAL-05` 已接受 RuntimeStore22 的 Session executor choice、CAS、Run binding 和历史路由。生产启动仍只构造 Pi，managed alternate 的合成工厂验证不等于 live 可用。新研究不把这些已接受机制重新列为缺口。
- `ARS-LOCAL-06` 的 PV-13 先保留 provider/model/auth 与调用测量，再议自动路由；PV-21 将自定义网关连接归于既有 provider 多连接与模型录入路径。本文只引用责任与次序，不能从 9 月 10 日旧清单判断今天每一 BE 工单仍未完成。
- `ARS-LOCAL-04` 当前页已记载 K5 profile editor 与取消结算修正；不能从较早文档把它们重新打开。

## 本轮裁决含义

“参考”表示可学习的机制；“候选工单”表示含问题、责任、触发与退出证据的本地交接条目，尚未给产品写权限；“延后”表示等待明确消费者或运行证据。本批在 Praxis Vault 登记，不自动修改 Courtwork backlog、安装 CLI/网关、调整账号凭据或调用付费模型。

产品项目消费后应回填原责任记录；若已有工单覆盖，则把证据挂回原单，不另建第二个 roadmap。

## 候选工单的退出证据

后续每个候选须固定一个用户结果、一个现有 owner、来源版本和实际触发条件；给出正常路径、关键失败反例以及不涉及的邻域。三类证据分别记录：官方文档说明、关键实现已读取、实际运行已验证。本轮最多达到前两类，不能从源码存在推出真实账号、兼容性、性能或可靠性已成立。

网关必须另分请求尚未开始、已收到流片段、工具已经执行三个边界；HTTP retry 的可用性收益不自动覆盖工具副作用。持久化调度必须分开计划、到期派发尝试和工作结算；桌面窗口关闭或连接断开也不能直接充当运行终止事实。
