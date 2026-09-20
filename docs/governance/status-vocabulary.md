# 状态词表

不同材料使用同一语义边界；来源特有字段可扩展，不把三类状态压成一个“完成”。

| 维度 | 值 | 含义 |
|---|---|---|
| 处理 | discovered / registered / distilled / reviewed | 发现、登记、提炼、治理复核 |
| 证据 | verified / partial / unavailable / unverified | 指定主张支持、部分支持、无法取得、未核查 |
| 引用恢复 | original / supplemental / missing-original | 原链接可知、另找补充、原链接缺失 |
| 采纳 | reference / candidate / accepted / deferred / rejected / superseded | 从研究到裁决的生命周期 |
| 本地可用 | summary / original / renderer-complete | 摘要可读、原件可读、呈现依赖完整 |

`verified` 总是针对卡片写明的主张与读取范围，不代表整个产品、原Chat全部断言或未来版本都得到验证。处理完成仍可带证据缺口。

每次复核记录日期。不可用来源仍保留ID、历史摘要和重访条件；后续补证据更新review，旧版本以snapshot或变更记录留存。

## 能力与消费者状态

在 Markdown 能力条目或回执中分别记录：

| 维度 | 记录内容 |
|---|---|
| 使用证据 | 未使用 / 人工走读 / 真实任务验证，并注明日期和范围 |
| 实现 | 契约 / 原型 / 运行实现，并链接版本 |
| 兼容 | 已验证的消费者与版本；其余未知 |
| 活跃性 | 当前推荐 / 待复核 / 停止推荐，并注明替代位置 |

既有来源 catalog 字段保持原义；消费者状态随实际使用记录维护。
