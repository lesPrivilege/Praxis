# 第三段1倍时间轴观察证据

范围1629–2426秒，workspace至java-06，共10场。run.json保留UTC起止、单调时钟、RAF调用数、取帧实际时间与版本hash。191张1920×1080、DPR=1 PNG来自连续运行的舞台，文件名数字为计划取帧点；截图完成后的timeline见run.json。

运行UTC 2026-10-11 20:06:27.226 → 20:19:44.303，共797.0685秒。performance.now驱动Film.seek，速率1，未跳段或加速。47792次RAF，最大RAF间隔498.9ms；证明墙钟与完整时间范围，不证明无掉帧60fps。计划191帧/保存191帧；截图完成时间最晚比计划晚0.2801秒。

本轮实际用view_image查看39张，其余152张仅保存。没有把这些截图称为完整连续人类观看。已看名单：

- [01659.00-workspace-default_agent-hold.png](01659.00-workspace-default_agent-hold.png)
- [01679.00-workspace-new_session-hold.png](01679.00-workspace-new_session-hold.png)
- [01691.50-workspace-session_scope-hold.png](01691.50-workspace-session_scope-hold.png)
- [01705.00-workspace-user_scope-hold.png](01705.00-workspace-user_scope-hold.png)
- [01726.00-workspace-resource_scopes-hold.png](01726.00-workspace-resource_scopes-hold.png)
- [01758.00-workspace-backends-hold.png](01758.00-workspace-backends-hold.png)
- [01674.35-workspace-motion.png](01674.35-workspace-motion.png)
- [01675.50-workspace-settled.png](01675.50-workspace-settled.png)
- [01795.50-workspace-access_boundary-hold.png](01795.50-workspace-access_boundary-hold.png)
- [01822.50-sandbox-settled.png](01822.50-sandbox-settled.png)
- [01831.50-sandbox-settled.png](01831.50-sandbox-settled.png)
- [01852.50-sandbox-scene-end.png](01852.50-sandbox-scene-end.png)
- [01870.29-deployment-settled.png](01870.29-deployment-settled.png)
- [01892.50-deployment-scene-end.png](01892.50-deployment-scene-end.png)
- [01903.69-observability-settled.png](01903.69-observability-settled.png)
- [01929.50-observability-scene-end.png](01929.50-observability-scene-end.png)
- [01936.50-java-01-harness-context-settled.png](01936.50-java-01-harness-context-settled.png)
- [01972.50-java-01-harness-context-scene-end.png](01972.50-java-01-harness-context-scene-end.png)
- [01983.69-java-02-agent-session-settled.png](01983.69-java-02-agent-session-settled.png)
- [02016.50-java-02-agent-session-scene-end.png](02016.50-java-02-agent-session-scene-end.png)
- [02045.00-java-03-execution-targets-ownership-hold.png](02045.00-java-03-execution-targets-ownership-hold.png)
- [02067.50-java-03-execution-targets-context-hold.png](02067.50-java-03-execution-targets-context-hold.png)
- [02083.50-java-03-execution-targets-records-hold.png](02083.50-java-03-execution-targets-records-hold.png)
- [02099.00-java-03-execution-targets-discovery-hold.png](02099.00-java-03-execution-targets-discovery-hold.png)
- [02117.50-java-03-execution-targets-delivery-hold.png](02117.50-java-03-execution-targets-delivery-hold.png)
- [02136.50-java-03-execution-targets-recovery-hold.png](02136.50-java-03-execution-targets-recovery-hold.png)
- [02147.50-java-03-execution-targets-settled.png](02147.50-java-03-execution-targets-settled.png)
- [02169.54-java-04-session-turn-idempotency-settled.png](02169.54-java-04-session-turn-idempotency-settled.png)
- [02205.50-java-04-session-turn-idempotency-scene-end.png](02205.50-java-04-session-turn-idempotency-scene-end.png)
- [02241.50-java-05-snapshot-sse-cursor-snapshot-hold.png](02241.50-java-05-snapshot-sse-cursor-snapshot-hold.png)
- [02271.50-java-05-snapshot-sse-cursor-subscribe-hold.png](02271.50-java-05-snapshot-sse-cursor-subscribe-hold.png)
- [02282.15-java-05-snapshot-sse-cursor-motion.png](02282.15-java-05-snapshot-sse-cursor-motion.png)
- [02291.00-java-05-snapshot-sse-cursor-delta_applied-hold.png](02291.00-java-05-snapshot-sse-cursor-delta_applied-hold.png)
- [02312.00-java-05-snapshot-sse-cursor-disconnected-hold.png](02312.00-java-05-snapshot-sse-cursor-disconnected-hold.png)
- [02333.00-java-05-snapshot-sse-cursor-replay_deduplicated-hold.png](02333.00-java-05-snapshot-sse-cursor-replay_deduplicated-hold.png)
- [02351.00-java-05-snapshot-sse-cursor-fresh_snapshot-hold.png](02351.00-java-05-snapshot-sse-cursor-fresh_snapshot-hold.png)
- [02368.50-java-05-snapshot-sse-cursor-turn_terminal-hold.png](02368.50-java-05-snapshot-sse-cursor-turn_terminal-hold.png)
- [02402.23-java-06-interaction-capabilities-settled.png](02402.23-java-06-interaction-capabilities-settled.png)
- [02425.50-java-06-interaction-capabilities-scene-end.png](02425.50-java-06-interaction-capabilities-scene-end.png)

结论与新增SSE文字追加问题见[分段报告](../playback-part3.md)。旧图保留问题修正前证据。repair-前缀属于修后172秒1倍补验，另记录repair-run.json，不能覆盖或替代原797秒运行版本。


## 修后补验实际查看名单

repair-run.json记录2206–2378秒独立1倍172.0842秒运行，39帧中实际查看9帧，其余30帧仅保存。以下帧确认“到达→追加→保存游标”顺序及后续五类状态，没有覆盖原图。

- [repair-02241.50-java-05-snapshot-sse-cursor-snapshot-hold.png](repair-02241.50-java-05-snapshot-sse-cursor-snapshot-hold.png)
- [repair-02271.50-java-05-snapshot-sse-cursor-subscribe-hold.png](repair-02271.50-java-05-snapshot-sse-cursor-subscribe-hold.png)
- [repair-02283.10-java-05-snapshot-sse-cursor-before-arrival.png](repair-02283.10-java-05-snapshot-sse-cursor-before-arrival.png)
- [repair-02283.55-java-05-snapshot-sse-cursor-after-append.png](repair-02283.55-java-05-snapshot-sse-cursor-after-append.png)
- [repair-02284.10-java-05-snapshot-sse-cursor-after-cursor.png](repair-02284.10-java-05-snapshot-sse-cursor-after-cursor.png)
- [repair-02312.00-java-05-snapshot-sse-cursor-disconnected-hold.png](repair-02312.00-java-05-snapshot-sse-cursor-disconnected-hold.png)
- [repair-02333.00-java-05-snapshot-sse-cursor-replay_deduplicated-hold.png](repair-02333.00-java-05-snapshot-sse-cursor-replay_deduplicated-hold.png)
- [repair-02351.00-java-05-snapshot-sse-cursor-fresh_snapshot-hold.png](repair-02351.00-java-05-snapshot-sse-cursor-fresh_snapshot-hold.png)
- [repair-02368.50-java-05-snapshot-sse-cursor-turn_terminal-hold.png](repair-02368.50-java-05-snapshot-sse-cursor-turn_terminal-hold.png)
