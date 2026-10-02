---
id: "s03-w3c-media-queries-5"
status: "partial"
url: "https://www.w3.org/TR/mediaqueries-5/"
---

# S03 · W3C Media Queries Level 5

来源：[原始页面](https://www.w3.org/TR/mediaqueries-5/) · 状态：`partial` · 重访：2026-10-02，两次（ok）

用途：GRAMMAR / STANDARD / DESIGN-SYSTEM

## 是什么

媒体查询第 5 级工作草案，定义 prefers-reduced-motion、forced-colors 等偏好/环境条件特性。

页面所见：W3C (CSS WG)；W3C Working Draft, 19 February 2026

## 台账要点与本轮重访

- 有依据：文档状态为 Working Draft。实时页面与缓存副本均为 Working Draft。
- 有依据：prefers-reduced-motion 检测已表达的偏好，reduce 倾向减少非必要运动。§12.1：用于检测用户是否要求减少非必要运动；reduce 指移除或替换会引发前庭不适或分心的动画。
- 有依据：no-preference 不是用户喜欢动画。规范只说用户未向系统表明偏好，且在布尔上下文求值为 false。
- 有依据：forced-colors 与偏好是环境条件。forced-colors 与 prefers-color-scheme 均在同一规范内定义。
- 无法判断：不证明所有媒体特性已广泛实现。页面没有浏览器实现状况汇总。

与台账不符或需注意：台账写实读为 2021-12-18 Working Draft；实时抓取页面（dt-updated）与 W3C 现行版本为 2026-02-19 Working Draft。2021-12-18 与 Exa 缓存副本一致，疑为旧缓存。状态仍为 Working Draft，结论不变，但日期需更新。

## 第二次重访

2026-10-02，Opus 5.5 主会话，应用内浏览器直接读页面文字。直接读页首：现行版本是 2026-02-19 的 Working Draft，2021-12-18 列在“先前版本”里。台账的日期是旧版本。

## 限制

草案可变；不能证明特性被广泛实现，也不能证明检测到偏好就自动修好体验。 没有看图。

## 何时重访

项目明确采用该标准或设计系统的某一条、其版本或级别更新、或据此写检查项时重访原文。

台账原文见 [包内 standards 台账](../../../snapshots/local/design-grammar-atlas-20261002/research/standards-sources.md)，机器登记见 [`../catalog.json`](../catalog.json)。
