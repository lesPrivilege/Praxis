# 实际画面文字清单

取自 Film.seek 后实际 DOM；导航、来源另行标记。取样间隔 0.5 秒，曝光边界精度受间隔限制。

| 首次出现 | 场 | 职责 | 字号 px | 可见秒数 | 文字 |
|---|---|---|---|---|---|
| 0.0s | message-journey | navigation | 24 | 192.0 | 02 · Agent 内核 |
| 0.0s | message-journey | navigation | 24 | 192.0 | 01 / 4 |
| 0.0s | message-journey | content | 48 | 192.0 | 一条消息，怎样长成一次完整回复 |
| 0.0s | message-journey | content | 36 | 192.0 | 模型 |
| 0.0s | message-journey | content | 40 | 192.0 | R1 |
| 0.0s | message-journey | content | 31 | 192.0 | Msg |
| 0.0s | message-journey | content | 30 | 186.0 | reply 生成中 |
| 0.0s | message-journey | content | 30 | 192.0 | assistant |
| 0.0s | message-journey | content | 30 | 192.0 | B1 · text |
| 0.0s | message-journey | content | 30 | 186.0 | finished_reason=None |
| 0.0s | message-journey | content | 30 | 116.5 | 本轮输出 |
| 0.0s | message-journey | content | 30 | 46.0 | 本例：只读查询。两个 delta 更新同一文字块 B1。 |
| 0.0s | message-journey | source | 24 | 192.0 | AgentScope 2.0.10dev |
| 10.0s | message-journey | content | 30 | 39.0 | delta |
| 10.0s | message-journey | navigation | 28 | 39.0 | reply_id=R1 |
| 10.0s | message-journey | navigation | 28 | 39.0 | block_id=B1 |
| 12.0s | message-journey | content | 37 | 180.0 | 先查合同条款。 |
| 30.0s | message-journey | content | 37 | 162.0 | 再核对责任边界。 |
| 46.0s | message-journey | content | 30 | 3.0 | TEXT_BLOCK_END只结束B1；R1仍在生成，工具调用还可继续。 |
| 47.0s | message-journey | content | 30 | 145.0 | TEXT_BLOCK_END · B1 |
| 49.0s | message-journey | content | 30 | 17.0 | R9 / B1 |
| 49.0s | message-journey | content | 32 | 17.0 | “追加一段” |
| 49.0s | message-journey | content | 30 | 17.0 | 收到事件后，身份匹配才会改变这条消息。 |
| 55.0s | message-journey | content | 30 | 11.0 | reply 不符 → 跳过 |
| 66.0s | message-journey | content | 30 | 36.0 | 调用记录留在 R1；校验与权限允许后才进入工具。 |
| 70.0s | message-journey | content | 32 | 53.0 | 第 1 轮 |
| 71.0s | message-journey | content | 36 | 121.0 | 查询合同条款 |
| 71.0s | message-journey | content | 34 | 121.0 | T1 |
| 71.0s | message-journey | content | 30 | 121.0 | read_contract(contract_id) |
| 79.0s | message-journey | content | 34 | 113.0 | 只读查询 |
| 79.0s | message-journey | content | 30 | 7.0 | 尚未调用 |
| 83.0s | message-journey | content | 30 | 109.0 | 执行 |
| 86.0s | message-journey | content | 30 | 15.0 | 执行中 |
| 101.0s | message-journey | content | 30 | 91.0 | 已完成 |
| 102.0s | message-journey | content | 30 | 18.0 | 结果写回 |
| 102.0s | message-journey | content | 36 | 90.0 | 3 条相关条款 |
| 102.0s | message-journey | content | 34 | 90.0 | T1 |
| 102.0s | message-journey | content | 30 | 18.0 | 结果以原调用 T1 的身份写回，保留在有序内容中。 |
| 106.0s | message-journey | content | 30 | 86.0 | ToolResultBlock · success |
| 109.0s | message-journey | content | 30 | 83.0 | 调用与结果共享 T1 |
| 120.0s | message-journey | content | 30 | 72.0 | 下一次模型输入 |
| 120.0s | message-journey | content | 30 | 18.0 | 下一轮模型读取上下文与当前回复，决定继续还是结束。 |
| 123.0s | message-journey | content | 30 | 69.0 | 上下文 + 完整 R1 |
| 123.0s | message-journey | content | 32 | 69.0 | 第 2 轮 |
| 138.0s | message-journey | content | 30 | 19.0 | ASK 是条件支路：暂停时，R1 尚无最终结束原因。 |
| 139.0s | message-journey | content | 30 | 38.5 | 若 ASK |
| 139.0s | message-journey | content | 34 | 38.5 | 等待确认 |
| 139.0s | message-journey | content | 30 | 38.5 | 确认后续接 |
| 157.0s | message-journey | content | 30 | 19.0 | 失败内容仍写回原调用，并交给下一轮推理。 |
| 158.0s | message-journey | content | 32 | 19.5 | 若工具失败 |
| 158.0s | message-journey | content | 30 | 19.5 | error 也写回 T1 |
| 176.0s | message-journey | content | 30 | 10.0 | 50 限制一次 reply 的推理—行动迭代，不等于固定模型请求次数。 |
| 177.0s | message-journey | content | 30 | 15.0 | max_iters |
| 177.0s | message-journey | content | 48 | 15.0 | 默认 50 轮 |
| 177.0s | message-journey | content | 30 | 15.0 | 普通文本到上限 |
| 177.0s | message-journey | content | 30 | 15.0 | → 禁工具总结 |
| 186.0s | message-journey | content | 30 | 6.0 | reply 已结束 |
| 186.0s | message-journey | content | 30 | 6.0 | finished_reason=completed |
| 186.0s | message-journey | content | 30 | 6.0 | REPLY_END才写入整次回复的finished_reason；本例为completed。 |
| 187.0s | message-journey | content | 34 | 5.0 | REPLY_END |
| 187.0s | message-journey | content | 30 | 5.0 | R1 整次回复结束 |
| 192.0s | permission | navigation | 24 | 168.0 | 02 · Agent 内核 |
| 192.0s | permission | navigation | 24 | 168.0 | 02 / 4 |
| 192.0s | permission | content | 48 | 168.0 | 权限：调用先停住，再决定是否放行 |
| 192.0s | permission | content | 30 | 168.0 | 工具输入 |
| 192.0s | permission | content | 30 | 168.0 | 输入检查 |
| 192.0s | permission | content | 30 | 146.5 | 权限决定 |
| 192.0s | permission | content | 30 | 168.0 | 工具执行端 |
| 192.0s | permission | content | 32 | 168.0 | R2 / |
| 192.0s | permission | content | 32 | 168.0 | T2 |
| 192.0s | permission | content | 32 | 168.0 | · Write |
| 192.0s | permission | content | 34 | 168.0 | review-v3.md |
| 192.0s | permission | content | 30 | 12.0 | 待检查 |
| 192.0s | permission | content | 30 | 24.0 | 等待权限决定 |
| 192.0s | permission | content | 30 | 12.0 | Write 输入 review-v3.md；输入检查与权限决定是两道关口。 |
| 192.0s | permission | source | 24 | 168.0 | AgentScope 2.0.10dev |
| 197.0s | permission | content | 30 | 163.0 | 只读放行 |
| 197.0s | permission | content | 30 | 163.0 | 工具检查 |
| 197.0s | permission | content | 30 | 163.0 | 兜底 ASK |
| 197.0s | permission | content | 30 | 163.0 | DEFAULT |
| 197.0s | permission | content | 30 | 163.0 | deny |
| 197.0s | permission | content | 30 | 163.0 | ask |
| 197.0s | permission | content | 30 | 163.0 | allow |
| 204.0s | permission | content | 30 | 12.0 | 输入合法 |
| 204.0s | permission | content | 30 | 12.0 | 输入合法，调用才抵达权限闸门。 |
| 205.0s | permission | content | 30 | 155.0 | 输入合法 |
| 215.0s | permission | content | 30 | 70.0 | 命中 ASK |
| 216.0s | permission | content | 30 | 50.0 | ASKING · 待确认 |
| 216.0s | permission | content | 30 | 50.5 | ASK · 等待确认 |
| 216.0s | permission | content | 30 | 28.0 | ASK 把 T2 留在闸门前；此时工具尚未执行。 |
| 244.0s | permission | content | 30 | 14.0 | 确认回传携带嵌套的工具调用对象，并指定 confirmed = true。 |
| 245.0s | permission | content | 30 | 40.0 | 用户确认 · R2 |
| 245.0s | permission | content | 30 | 40.0 | confirm_results[0].tool_call.id = |
| 245.0s | permission | content | 30 | 40.0 | T2 |
| 245.0s | permission | content | 32 | 40.0 | confirmed = true |
| 257.0s | permission | content | 30 | 14.0 | 对应待确认 T2 |
| 258.0s | permission | content | 30 | 8.0 | confirm_results[].tool_call.id 必须对应当前等待确认的 T2。 |
| 266.0s | permission | content | 30 | 94.0 | ALLOWED · 本次获准 |
| 266.0s | permission | content | 30 | 20.0 | 匹配后 T2 置为 ALLOWED，原调用进入执行路径。 |
| 276.0s | permission | content | 30 | 84.0 | 获准进入执行路径 |
| 276.0s | permission | content | 30 | 84.0 | 执行仍可返回失败 |
| 286.0s | permission | content | 30 | 26.0 | DENY 直接拒绝；T3 留在执行端之外。 |
| 288.0s | permission | content | 30 | 12.0 | 等待下一调用 |
| 289.0s | permission | content | 32 | 71.0 | R3 / |
| 289.0s | permission | content | 32 | 71.0 | T3 |
| 289.0s | permission | content | 32 | 71.0 | · Write |
| 289.0s | permission | content | 34 | 71.0 | review-v3.md |
| 289.0s | permission | content | 30 | 11.0 | 新调用 · 重新判定 |
| 290.0s | permission | content | 30 | 21.0 | 先命中 DENY |
| 299.0s | permission | content | 34 | 61.0 | DENY |
| 299.0s | permission | content | 32 | 61.0 | 不调用工具 |
| 300.0s | permission | content | 30 | 60.0 | DENIED · 已止步 |
| 300.0s | permission | content | 30 | 12.0 | DENY · 拒绝执行 |
| 312.0s | permission | content | 30 | 48.0 | 每次调用独立决定 |
| 312.0s | permission | content | 30 | 20.0 | EXPLORE 非只读调用默认拒绝，显式 ASK 先于只读判断。 |
| 313.0s | permission | content | 30 | 47.0 | 跳过工具检查 |
| 313.0s | permission | content | 30 | 47.0 | 只读放行 |
| 313.0s | permission | content | 30 | 47.0 | 其余拒绝 |
| 313.0s | permission | content | 30 | 47.0 | EXPLORE |
| 313.0s | permission | content | 30 | 47.0 | deny |
| 313.0s | permission | content | 30 | 47.0 | ask |
| 313.0s | permission | content | 30 | 47.0 | 与 allow 规则 |
| 332.0s | permission | content | 30 | 13.0 | EXPLORE 命中显式 ASK 后，合法单次确认仍可进入执行路径。 |
| 333.0s | permission | content | 30 | 27.0 | 显式 ASK → 单次确认 |
| 345.0s | permission | content | 30 | 15.0 | EXPLORE 跳过 allow 规则；单次确认不代表未来调用永久获准。 |
| 346.0s | permission | content | 30 | 14.0 | 下一调用重新判定 |
| 360.0s | workspace | navigation | 24 | 206.0 | 04 · Python 服务 |
| 360.0s | workspace | navigation | 24 | 206.0 | 03 / 4 |
| 360.0s | workspace | content | 48 | 206.0 | 同一份文件，哪些会话能看见？ |
| 360.0s | workspace | content | 32 | 206.0 | Python Agent Service · 用户 U-A |
| 360.0s | workspace | content | 36 | 206.0 | Agent A |
| 360.0s | workspace | content | 34 | 206.0 | W-A |
| 360.0s | workspace | content | 30 | 206.0 | 默认 per_agent |
| 360.0s | workspace | content | 34 | 206.0 | Session PA1 |
| 360.0s | workspace | content | 36 | 206.0 | contract-v3.pdf |
| 360.0s | workspace | content | 30 | 206.0 | 已在 W-A 的真实工作文件 |
| 360.0s | workspace | content | 30 | 24.0 | 会话创建时分配工作区；文件留在已绑定的目录。 |
| 360.0s | workspace | source | 24 | 206.0 | AgentScope 2.0.10dev |
| 384.0s | workspace | content | 30 | 22.0 | 同一用户、同一 Agent 的新会话，默认仍访问同一目录。 |
| 385.0s | workspace | content | 34 | 181.0 | Session PA2 |
| 406.0s | workspace | content | 30 | 24.0 | 不同 Agent 默认分目录；目录可见性不替代工具动作授权。 |
| 407.0s | workspace | content | 36 | 101.5 | Agent B |
| 407.0s | workspace | content | 34 | 101.5 | W-B |
| 407.0s | workspace | content | 34 | 101.5 | Session PB1 |
| 430.0s | workspace | content | 30 | 24.0 | per_session 为每个新会话分配独立目录。 |
| 431.0s | workspace | content | 30 | 77.5 | 仅对新建会话分配 |
| 431.0s | workspace | content | 30 | 77.5 | PA3 |
| 431.0s | workspace | content | 32 | 77.5 | per_session |
| 431.0s | workspace | content | 30 | 77.5 | PA4 |
| 454.0s | workspace | content | 30 | 26.0 | per_user 让同一用户的多个 Agent 共享新目录；旧文件没有迁移。 |
| 455.0s | workspace | content | 30 | 53.5 | A / PA5 |
| 455.0s | workspace | content | 32 | 53.5 | per_user |
| 455.0s | workspace | content | 30 | 53.5 | U-A |
| 455.0s | workspace | content | 30 | 53.5 | B / PB2 |
| 480.0s | workspace | content | 30 | 27.0 | 文件可共享；MCP 按 Agent＋Session 分区，Skills 按 Agent 分区。 |
| 481.0s | workspace | content | 30 | 85.0 | MCP PA1 |
| 481.0s | workspace | content | 30 | 85.0 | Skills · 按 Agent |
| 481.0s | workspace | content | 30 | 85.0 | MCP PA2 |
| 507.0s | workspace | content | 30 | 26.0 | Local 使用主机文件系统且无沙箱；Docker 为单机，云后端可跨节点重连。 |
| 508.0s | workspace | content | 32 | 58.0 | Local · 主机文件系统 · 无沙箱 |
| 514.0s | workspace | content | 32 | 20.5 | 其他后端配置 |
| 514.0s | workspace | content | 30 | 20.5 | 执行位置随后端变化 |
| 514.0s | workspace | content | 34 | 52.0 | Docker |
| 514.0s | workspace | content | 34 | 52.0 | E2B |
| 514.0s | workspace | content | 34 | 52.0 | K8s |
| 514.0s | workspace | content | 30 | 52.0 | 容器 ↔ 主机挂载 |
| 514.0s | workspace | content | 30 | 52.0 | 按元数据重连云沙箱 |
| 514.0s | workspace | content | 30 | 52.0 | Pod + PVC |
| 514.0s | workspace | navigation | 24 | 52.0 | 单机 |
| 514.0s | workspace | navigation | 24 | 52.0 | 跨节点 |
| 514.0s | workspace | navigation | 24 | 52.0 | 跨节点 |
| 533.0s | workspace | content | 30 | 33.0 | TTL 回收的是缓存与运行资源；隔离策略改变只影响新的分配。 |
| 534.0s | workspace | content | 32 | 32.0 | 闲置 TTL 默认 3600s |
| 534.0s | workspace | content | 30 | 32.0 | Local：下次访问清理缓存 |
| 534.0s | workspace | content | 32 | 32.0 | Session 保存 workspace_id |
| 534.0s | workspace | content | 30 | 32.0 | 沙箱后端：另有后台回收 |
| 534.0s | workspace | content | 30 | 32.0 | 显式 ID 优先；既有会话保持原绑定 |
| 566.0s | java-recovery | navigation | 24 | 96.0 | 05 · Java 企业接入 |
| 566.0s | java-recovery | navigation | 24 | 96.0 | 04 / 4 |
| 566.0s | java-recovery | content | 48 | 96.0 | 断在哪里，恢复就核对哪里的事实 |
| 566.0s | java-recovery | content | 32 | 96.0 | Java Harness · AgentSession |
| 566.0s | java-recovery | content | 36 | 96.0 | J-TURN1 |
| 566.0s | java-recovery | content | 32 | 96.0 | 页面 / 观察者 |
| 566.0s | java-recovery | content | 30 | 84.0 | run J-RUN1 |
| 566.0s | java-recovery | content | 30 | 96.0 | 读取 committed log |
| 566.0s | java-recovery | content | 32 | 96.0 | 接受任务 |
| 566.0s | java-recovery | content | 32 | 96.0 | 派发工具 |
| 566.0s | java-recovery | content | 32 | 96.0 | 外部执行 |
| 566.0s | java-recovery | content | 32 | 96.0 | 提交工具结果 |
| 566.0s | java-recovery | content | 32 | 96.0 | 观察页面 |
| 566.0s | java-recovery | content | 30 | 71.0 | J-T1 |
| 566.0s | java-recovery | content | 30 | 96.0 | 持久接受记录 |
| 566.0s | java-recovery | content | 30 | 96.0 | committed log |
| 566.0s | java-recovery | content | 30 | 96.0 | Checkpoint |
| 566.0s | java-recovery | content | 30 | 96.0 | Agent 工作状态 |
| 566.0s | java-recovery | content | 30 | 96.0 | 原 turn / 输入 |
| 566.0s | java-recovery | content | 30 | 96.0 | 同一前缀 + cursor |
| 566.0s | java-recovery | content | 30 | 18.0 | 提交获得任务回执；执行与前端观察分别推进。 |
| 566.0s | java-recovery | source | 24 | 96.0 | Java Harness v2 / Service 2.1.0-BETA1 |
| 584.0s | java-recovery | content | 30 | 16.0 | 浏览器断连不取消后台任务；页面从同一已提交前缀恢复，再接后续事件。 |
| 584.5s | java-recovery | content | 30 | 10.5 | 浏览器断连 |
| 600.0s | java-recovery | content | 30 | 19.0 | Checkpoint 不恢复线程、网络请求或工具进度；派发后未提交的结果需要核对。 |
| 601.0s | java-recovery | content | 32 | 61.0 | 外部系统 · 原回执 |
| 601.0s | java-recovery | content | 30 | 61.0 | J-T1 → 已写入 ORD-42 |
| 601.0s | java-recovery | content | 30 | 36.0 | 派发后 → 提交前：外部结果未知 |
| 601.0s | java-recovery | content | 34 | 36.0 | 进程停止 |
| 601.0s | java-recovery | content | 30 | 36.0 | 本地结果未提交 |
| 619.0s | java-recovery | content | 30 | 18.0 | 按原调用 J-T1 查询外部记录；结果仍未知时继续调查。 |
| 624.5s | java-recovery | content | 30 | 15.0 | J-T1 · 已核实 |
| 637.0s | java-recovery | content | 30 | 13.0 | reconcile 保存实际查到的结果与 checkpoint，不再次执行原工具。 |
| 638.0s | java-recovery | content | 30 | 24.0 | J-T1 · 核实结果 |
| 638.0s | java-recovery | content | 30 | 24.0 | reconcile 保存 |
| 650.0s | java-recovery | content | 30 | 12.0 | run J-RUN2 |
| 650.0s | java-recovery | content | 30 | 12.0 | 只有显式 resume 才继续原任务；turn 保留，run 更新。 |
| 650.5s | java-recovery | content | 30 | 11.5 | 同工具、凭据、工作文件 |
| 650.5s | java-recovery | content | 30 | 11.5 | 旧 writer lease 已释放 / 过期 |
| 650.5s | java-recovery | content | 32 | 11.5 | 显式 resume · 原 turn / 新 run |

返回 [成品](README.md)。
