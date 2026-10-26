# 最终稿定点复核

结论：此前列出的六项 P1 已在本次读取的编译后稿中修复。指定五张静态画面的文字与核心图形语义可接受；本轮未发现需要停止当前渲染的新增事实问题。

## 实际检查范围

- 读取最终 `script/beats.json` 中与前次问题对应的场次，含 title、lead、kind、items、pm、essay、scope 与 sourceLine。
- 对 `out/screen-text.md` 搜索泛泛保护/制作旁白及旧错误标识；没有发现“未测试、未验证、非承诺、无配音、本片、defaultSessionId、JsonFile、DistributedStore”等残留。命中的 respond 只在 Harness AgentSession 场，所属层正确。此项是关键词检查，不等于逐字精读全部 DOM 条目。
- 实际使用 view_image 查看：`react.png`、`permission.png`、`java-05-snapshot-sse-cursor.png`、`java-03-execution-targets.png`、`sandbox.png`。
- 未另起源码研究，事实比对沿用前轮已读官方来源及固定源码材料。

## P1 修订复核

| 前次问题 | 最终稿证据 | 结论 |
| --- | --- | --- |
| Java 直接调用→后台会话错误串联 | java-02 改 compare；实例持有、respond/resume 明确落在 Harness | 已修复 |
| Harness 场被 Service 版本覆盖 | java-01/02 的 scope 与实际 sourceLine 均为 Java Harness v2 | 已修复 |
| 缺 sessionId 必然跨用户串状态 | java-01 使用 namespace/userId/agentId/sessionId，并改为缺失或复用身份键的条件表述 | 已修复 |
| 旧状态存储路径泛化 | java-09 分开日志、checkpoint、workspace、sandbox 与运行协调，不断言默认 AgentStateStore | 已修复 |
| Service respond 与 SDK 方法混用 | java-06 使用 actions、request_id；读取 Turn /capabilities | 已修复 |
| 事件类型错误顺序/依赖自动推断 | events 改 rows；scheduling 明示属性调度、业务依赖由编排或后续推理轮表达 | 已修复 |

## 五张关键画面

1. **ReAct**：四节点反馈环清晰；“检查状态”明确包括暂停或结束，“调用模型”明确无工具请求时形成答复。当前截图没有另画终态出口箭头，但已有文字限定循环，未声称所有推理都必须执行工具。作为本轮循环抽象可接受，不需要因新增终态节点重建成片。
2. **权限**：待执行工具调用分到 ALLOW / DENY / ASK 三条独立路径。拒绝回推理、询问暂停、允许执行的文案相符，没有把三者画成顺序阶段。
3. **Java 快照/SSE**：Snapshot→as_of→Cursor 主链对应恢复后订阅、应用后保存。410 放在独立下方，并以“游标过期”明确条件；不是每次连接必须发生的一步。页脚明确 Service 2.1.0-BETA1。
4. **Java 执行目标**：Managed、External、Hosted 与共同观察面并列，保留运行责任和能力差异。没有跨后端统一恢复或无条件功能对齐的暗示；版本正确。
5. **Sandbox**：工具请求→工作区接口→沙箱后端→执行结果表达隔离执行路径；lead保留本地/隔离后端选择，pm保留网络/挂载/凭据配置。没有把沙箱等同工具授权。

五张截图中未见文本截断、遮挡或超出边框。ReAct 右上和 Sandbox 个别行自然换行，仍可读。这里只认可所看静帧。

## 其余修订抽查

- compression 已改 rows，历史压缩与截短不再画成必经流水线。
- GoalPipeline 上屏 pass/fail/impossible，反馈要求预算允许。
- Java Session 补入已发布流程版本，Turn 不再以“独立执行”遮蔽 Managed 上下文。
- 文件系统用“不自动共享”，Artifact强调实际文件与登记交付。
- Managed 预算明确不能强行截断已启动并行调用；调额与续跑区分。
- Webhook改为“接收投递/可能重复”；channel标题与消息图相符。
- lanes阅读正文已移走“本片局部机制...”制作版本说明。屏幕Python保留2.0主线，Java Service保留具体BETA版本。

## 非阻断记录

java-more追加场（如java-budget）的sourceLine仍为“Harness v2 / Service 2.1.0-BETA1”组合页脚；场内明确 Managed/Service，对本轮机制理解不构成混用。后续版可进一步按场收窄来源页脚，不要求中断当前渲染。

本轮没有观看完整影片，没有验证实际动效播放、全片阅读节奏、音轨、编码输出或每一帧；静帧检查不能替代这些验收。没有修改仓库、脚本或成片。

## 此次读取快照

- beats.json SHA-256：`e0c0c0973c7268c1bc130d501c46ae89fc0c2b784d4f31c5f52eaffd1b57eb31`
- screen-text.md SHA-256：`ce553b3b4000d0ebec76afb11e53c2ba5d24f4ac03dce5fb51fa192d0d83ad30`
