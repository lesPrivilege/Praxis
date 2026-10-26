# QuantConnect LEAN · Slippage Key Concepts

原件：<https://www.quantconnect.com/docs/v2/writing-algorithms/reality-modeling/slippage/key-concepts>

## 是什么

LEAN 官方文档说明滑点的定义（预期成交价与实际成交价之差，可正可负）、影响滑点的因素（引擎延迟、券商连接、市场波动与竞争者），以及滑点模型的作用；并说明券商模型会为每种证券自动设定滑点模型、可覆盖。

读取范围：2026-10-26 打开官方页面并提取正文的 Introduction、Factors、Set Models 小节文字；没有运行 LEAN。。证据状态：partial。

## 支持的说法

- 滑点是订单预期成交价与实际成交价之差，价格在等待成交时可能双向移动，所以滑点可正可负；滑点模型用来让回测更接近现实。（Introduction 段）
- 交易引擎延迟、券商的连接速度与市场波动、订单是否制造套利机会都会影响滑点。（Factors Impacting Slippage 段）
- 券商的 brokerage model 会自动为每种证券设置滑点模型，也可以手动覆盖。（Set Models 段）

## 边界

页面为产品文档，示例数值属于具体模型；未读全部 reality modeling 页面。

## 何时重访

引用滑点模型默认行为时重读，注意其按券商模型而异。

## 本 Kit 取用什么

第 5 章执行成本与第 8 章成本实验的依据。
