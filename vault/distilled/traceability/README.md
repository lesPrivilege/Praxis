# 逐轮追溯

[`turn-manifest.json`](turn-manifest.json) 登记源线程的 10 个 turn 及全部 20 个 message item。每个条目保留：稳定 `turnId`、稳定 `itemId`、消息角色、类型、文本长度、覆盖主题和关键证据标签。

`turnId` 与 `itemId` 直接来自归档 JSON，不重新生成，也不以顺序编号替代。顺序编号 `turnNumber` 只用于阅读。

主题文档用 `Tn/U` 与 `Tn/A` 指向用户/assistant item，并在需要时给出完整 UUID；这让“用户意图”和“原建议”可分开回查。

