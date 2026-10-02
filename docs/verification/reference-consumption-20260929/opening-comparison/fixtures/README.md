# Synthetic fixtures

这两个 JSON 是本 demo 的输入样本，均为 synthetic，不代表真实社区空间。页面把相同逻辑直接写入 HTML，保证双击 `index.html` 时不依赖 `fetch` 或本地服务器；JSON 作为可审阅、可复核的 fixture 记录。

| Fixture | 输入变化 | 预期判断 |
|---|---|---|
| [`normal.json`](normal.json) | `weekend_volunteers_present=true`；C 的周六、周日状态为“志愿者” | A 直接满足；C 有条件满足；B 不满足 |
| [`failure-no-weekend-volunteers.json`](failure-no-weekend-volunteers.json) | `weekend_volunteers_present=false`；C 的周六、周日状态为“关闭” | A 直接满足；C 因专属条件失败而不满足；B 不满足 |

每份 fixture 固定七天顺序、A/B/C 顺序和三个共同字段：`open_days`、`monthly_cost`、`condition_scope`。失败样本只改变 C 的周末状态，并保留 `condition_scope=C-only`，用于检查条件不会误作用于 A 或 B。

验收重点：七天数组长度为 7；C 的条件作用域始终是 `C-only`；失败样本中 C 的最后两天为“关闭”；`expected` 说明与页面的结果一致。页面内的按属性比较矩阵使用 A→B→C 固定槽位，窄屏也不隐藏任一方案或条件。
