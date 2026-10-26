# 量化的底层原理与 Agent 时代 · 学习手册

状态：底稿阶段，2026-10-26 停工，没有最终产物。

## 是什么

面向懂领域、不读原件的读者的中文交互式知识页：把量化交易拆成市场机制、收益来源、数学统计、算法、数据、回测、组合执行、技术栈与 Agent 时代研究方向，交付可离线打开的单文件 HTML。

## 做到哪

只有底稿。`draft/facts.md` 写完了事实底稿：证据身份约定、十个主题的逐条说法、未核实清单、第 8 章两个构造实验的口径。页面没有成形：`draft/partA.html` 只是一行占位，`draft/src/style.css` 是样式雏形，`build/h.sh` 只有两个标签输出函数，`out/` 为空。六份来源只读了 README 或文档，未安装、未运行，页面不得写成实测。施工会话被用户停止。

## 下一步

按 `facts.md` 写页面各章与两个交互实验，生成单文件 HTML 放进 `out/`，检查后用 `praxis_consume` 登记产物。继续前先核对 facts.md 的“未核实”一节，arXiv 条目未打开过。

## 东西在哪

| 位置 | 内容 |
|---|---|
| [draft/facts.md](draft/facts.md) | 事实底稿，页面的唯一事实来源 |
| [draft/partA.html](draft/partA.html) | 占位片段 |
| [draft/src/style.css](draft/src/style.css) | 样式雏形 |
| [build/h.sh](build/h.sh) | 生成器用的标签函数 |
| out/ | 空 |

收录的来源卡在 [vault/provenance/praxis-captures/](../../vault/provenance/praxis-captures/)：[qlib-readme](../../vault/provenance/praxis-captures/qlib-readme.md)、[rdagent-readme](../../vault/provenance/praxis-captures/rdagent-readme.md)、[tradingagents-readme](../../vault/provenance/praxis-captures/tradingagents-readme.md)、[freqtrade-backtesting](../../vault/provenance/praxis-captures/freqtrade-backtesting.md)、[freqtrade-lookahead](../../vault/provenance/praxis-captures/freqtrade-lookahead.md)、[lean-slippage-key-concepts](../../vault/provenance/praxis-captures/lean-slippage-key-concepts.md)。
