---
id: "r01-web-annotation-model"
status: "partial"
url: "https://www.w3.org/TR/annotation-model/"
---

# W3C Web Annotation Data Model

来源：[原始页面](https://www.w3.org/TR/annotation-model/) · 状态：`partial`

用途：GRAMMAR / REFERENCE

## 摘要

W3C Recommendation，2017-02-23。一条注释至少有一个 target；指向资源的一部分时用 Selector 说明怎样从 Source 里定出那一段（4.2），其中 Text Quote Selector 靠抄下原文并带前后文来定位（4.2.4）；State 说明注释指的是资源的哪个状态，可以用来找回当时的版本（4.3）；Selector 可以用 refinedBy 再收窄。本仓库取用“对象、版本、范围分开写”的分法和“抄原文定位”的做法，不采用它的 JSON-LD 格式。

## 证据与使用边界

2026-10-04 主会话用内置浏览器打开原页，按关键词读取了摘要所列的句子与章节标题；没有通读全文，没有看页面里的图，没有保存正文快照。

## 何时重访

Kit 的对应页面改写术语、项目采用其中某个标准或版本、或原页版本变化时重访。

引用映射与核查日期见 [catalog](../catalog.json)。本卡为登记结果的阅读投影；补充找到的来源不代表恢复原Chat隐藏引用。
