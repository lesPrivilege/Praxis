# compositions · 完整页面

五个完整页面检验原子能否组成不同读者任务的整页。它们是组合能力的压力测试，不替代原子覆盖。

| ID | 页面 | 读者任务 | 表现方向 |
|---|---|---|---|
| C01 | [c01-evidence-essay.html](c01-evidence-essay.html) | 从头读懂夜间开放吸引了谁、代价在哪、证据多强 | 编辑化长文，主栏 + 边注 |
| C02 | [c02-decision-memo.html](c02-decision-memo.html) | 会前 5 分钟知道决定什么、推荐什么；a 结论先行，b 推导在先 | 安静基线 |
| C03 | [c03-operating-review.html](c03-operating-review.html) | 每周 30 秒找到异常并下钻证据 | 图形化高密度 |
| C04 | [c04-mechanism-explainer.html](c04-mechanism-explainer.html) | 理解每次到馆成本为何约为日间三倍、杠杆在哪 | 空间化机制图 |
| C05 | [c05-slide-sequence.html](c05-slide-sequence.html) | 同一决定投影为 9 张 16:9 帧，窄屏转为讲义 | 跨媒介投影 |

每页一份组合层 CSS（前缀 `c1-`…`c5-`），通过 `../atoms/*.css` 复用原子类，并用 `data-atom` 标出原子边界。C02 的两版由子代理的临时生成脚本输出以保证原子块逐字相同，该脚本未保留，现在直接编辑 HTML。组合发现见 [handoff.md](../handoff.md)。
