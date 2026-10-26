# Freqtrade · Backtesting 文档

原件：<https://raw.githubusercontent.com/freqtrade/freqtrade/develop/docs/backtesting.md>

## 是什么

开源加密交易机器人的回测文档：说明回测的输出指标、费用默认来自交易所 pair 信息、止损与 ROI 的成交假设，以及在缺少 K 线内部信息时必须引入的假设清单。可支持“回测依赖成交假设”“费用与滑点默认值决定净收益口径”等说法。

读取范围：2026-10-26 经 GitHub raw 读取 develop 分支 markdown 全文，读了指标、费用、assumptions、trading limits 等小节；没有运行 freqtrade。。证据状态：partial。

## 支持的说法

- 回测在缺少 K 线内部信息时引入若干成交假设，例如价格落在 K 线高低区间内即按请求价成交、不模拟滑点。（“Assumptions made by backtesting” 小节）
- 默认手续费取自交易所 pair/market 信息，可用 --fee 覆盖；费用在入场与出场各计一次。（“Supplying custom fee value” 小节）
- 单笔平均利润的 p 值假设交易独立同分布，真实策略常常不满足，因此是偏乐观的下界；多重测试会让部分策略仅凭运气得到低 p 值。（“Reading the mean profit p-value” 注释）

## 边界

只覆盖 crypto 现货/合约撮合与 freqtrade 自己的假设；不能证明其他市场或框架的行为；develop 分支没有锁定提交号。

## 何时重访

引用具体假设或默认费用口径时按当时 develop 分支重读。

## 本 Kit 取用什么

第 7 章回测可信度与第 8 章成本实验的口径依据。
