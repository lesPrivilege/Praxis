---
id: "p04-wai-aria-level"
status: "partial"
url: "https://www.w3.org/TR/wai-aria-1.2/"
---

# W3C WAI-ARIA 1.2：aria-level、aria-posinset、aria-setsize

来源：[原始页面](https://www.w3.org/TR/wai-aria-1.2/) · 状态：`partial`

用途：GRAMMAR / REFERENCE

## 摘要

W3C Recommendation，2023-06-06。aria-level 定义元素在一个结构里的层级，取值是不小于 1 的整数，越深越大；文档结构不能准确表示层级时，作者应当明确写出。aria-posinset 和 aria-setsize 说明一项在一组里排第几、一组共几项。本仓库取用“层级和次序可以写成不依赖版面的数”这一做法，在生成的 SVG 上写 data-level 和 data-position；没有使用 ARIA 的 tree 角色，也没有声明符合 ARIA。aria-posinset 一条的原句主会话没有单独核对到。

## 证据与使用边界

2026-10-04 子代理用 curl 取回原页全文并摘句；主会话另行取回原页，按关键词核对了摘要里引到的句子。没有通读全文，没有看页面里的图，没有保存正文快照。

## 何时重访

Kit 的对应页面改写术语、项目采用其中某个标准或版本、或原页版本变化时重访。

引用映射与核查日期见 [catalog](../catalog.json)。本卡为登记结果的阅读投影；补充找到的来源不代表恢复原Chat隐藏引用。
