# Freqtrade · Lookahead analysis 文档

原件：<https://raw.githubusercontent.com/freqtrade/freqtrade/develop/docs/lookahead-analysis.md>

## 是什么

说明未来信息泄漏（lookahead bias）为什么容易引入却难以发现，以及 freqtrade 的 lookahead-analysis 通过比较指标值与入场/出场位置在截断数据下是否改变来探测它，并给出强制关闭缓存、无限资金等避免误报的选项。

读取范围：2026-10-26 经 GitHub raw 读取 develop 分支该页全文（约 7.8 KB）。。证据状态：partial。

## 支持的说法

- 回测会一次性把全部数据载入并同时计算指标，若指标或信号看到未来 K 线，回测结果就会失真。（引言段）
- 该分析通过链式回测对比截断与完整数据下的指标值和信号位置来暴露泄漏，而不是阅读策略代码。（命令说明段）

## 边界

该命令只探测特定类型的泄漏，不能证明策略没有其他偏差；未运行验证。

## 何时重访

讲未来函数与泄漏检测方法时按当时文档重读。

## 本 Kit 取用什么

第 6 章与第 8 章泄漏实验的方法参照。
