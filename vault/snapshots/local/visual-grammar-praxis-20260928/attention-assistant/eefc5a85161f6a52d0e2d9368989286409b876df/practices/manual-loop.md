# 手动 attention loop v0

1. **Discover**：用户启动本轮；读取本地registry，选择与目标相关的attention。存在性只在允许的范围内披露。
2. **Inspect**：读取对象state revision、理由、下一动作、授权与来源定位。检查是否已完成或有更新，避免重复工作。
3. **Disclose / compile**：按角色、目标、来源版本和范围展开。跨项目先确定可透露的descriptor和字段；无可确认授权时准备披露预览，等待人的决定。
4. **Investigate / propose**：完成已授权的阅读、核验、分类、草稿或可逆本地动作。网络读取使用公共来源或当前明确允许的连接；proposal绑定来源/resource version。不要为了connections制造低价值互动。
5. **Human decision**：人的界面说明“为什么现在需要我”，并列出证据、proposal、风险、stale 条件与 `approve / edit / reject / defer / dismiss`。外发须有当前会话明确授权；只需要一般续行时继续工作，不人为制造needs-you。
6. **Effect / verify**：只执行获授权的副作用，使用 provider-native action；随后 readback 核对目标、provider ID、thread/resource version 和最终状态。回执不明先查实际状态，不自动重试。
7. **Record**：先追加event，再更新state revision与registry，最后写briefing。保存 proposal、human decision、edit delta、effect/readback 或 failure；中断留下unknown和恢复步骤，不把工具执行成功当事情resolved。
8. **Stop**：本轮记录完整即结束。下一次由用户手动启动。没有后台监控，也不声称已自动检查新邮件。

## 状态

`investigating`：有已授权的本地研究可做；`needs_you`：确需人的具体决定；
`waiting`：明确外部对象/事件未返回；`later`：有明确延后理由/复查条件；
`resolved`：有闭合原因与证据。状态不是运行状态，不能从session finished自动推断。
`seen` 是独立的人已阅字段，不覆盖事情状态。

## 续行检查

核对event_id与last_event_id；revision不匹配先恢复，不重复发送。外部动作回执不明记unknown，先核查实际结果。手动协议不提供exactly-once保证。

可输入：“继续 goraven-isolation 的下一步，只核验公开实现与原issue，产出一个有依据的互动草稿，暂不发送。”

完整 decision packet、Luna 停点与 trace 字段见 [human decision loop](human-decision-loop.md)。
