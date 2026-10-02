# 文件化状态契约 v0

本地试验使用JSON/JSONL，无依赖。状态的权威范围仅是个人attention管理，不替代其他项目的Core/工作对象状态。

每个attention包含稳定id、schema_version、revision、descriptor、status、reason、next_action、sources、relations、authorization、last_event_id、updated_at。事实必须带source定位；缺失/未知明确写null或unknown。registry只保存可重建摘要及相对state路径，不存复制的Matter正文。

跨角色披露至少绑定 requester、purpose、object id/revision、fields、source versions、grant/reason 与过期或撤销条件。允许知道存在，不等于允许读取内容；未知权限不等于公开。人可手动批准本次预览；文件本身不提供ACL服务。

事件追加后再更新state；最后更新registry和briefing。单writer在开始和提交前比较revision；多writer或中断不一致需人工协调。此设计验证可寻址和手动续行，不宣称原子事务、并发CAS、加密或自动授权执行。

Context与briefing均是派生工件；runtime替换后从registry+state+来源重建。不得把上一runtime的总结提升为未核验事实。

## Human-loop 对象

每次需要人的 loop 至少在语义上区分五种对象；第一版可以同存于 event/state/briefing，不要求先建设数据库：

| 对象 | 责任 | 不得替代 |
|---|---|---|
| `provider_event` | 外部发生的事实快照；含 provider ID、thread/resource、observed_at、resource_version 与 raw_ref | 不是长期判断或授权 |
| `attention_item` | 当前投影；含 disposition、why_now、responsible_party、priority、risk 与 stale 条件 | 不等于 unread/notification |
| `proposal` | Agent 候选动作；含 action_kind、参数/草稿、依据、confidence、model/runtime/prompt version | 不等于已决定或已执行 |
| `human_decision` | `approve / edit / reject / defer / dismiss`；保存 decision scope、reason 与 edited_delta | 不从 click 自动推断长期偏好 |
| `effect` | provider 实际副作用与 readback；含 action/provider ID、idempotency key（若有）、result、verified_at 或 failure | 工具成功回执不自动等于已验证 |

`proposal` 与 `effect` 永不合并。Provider resource version 改变时，依赖旧版本的 attention judgment 和 proposal 变为 `stale`；必须重读和重新裁决，不能只更新时间戳。

## Disposition 与独立轴

`attention_item.disposition` 第一版只取：`needs_reply / waiting / action_required / reference / noise`。`priority`、`risk`、`confidence`、`stale`、deadline 与人的 seen 状态单独记录。例如 `waiting + high priority` 合法；`urgent` 不是 disposition。

## Learning boundary

Human-loop trace 先保存人的判断证据，再考虑偏好：proposal 与最终动作的 delta、分类/priority 修正、decision latency、staleness、effect failure 和后来发现的 false dismissal。多次稳定 trace 可形成 `preference_candidate`，但只有人在明确 scope、依据、版本、撤销方式后才能 promote 为规则。

空 trace 结构见 [`human-decision-trace.json`](../templates/human-decision-trace.json)。
