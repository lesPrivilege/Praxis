---
id: "s08-material3-corner-radius"
status: "verified"
url: "https://m3.material.io/styles/shape/corner-radius-scale"
---

# S08 · Material 3：Corner radius scale

来源：[原始页面](https://m3.material.io/styles/shape/corner-radius-scale) · 状态：`verified` · 重访：2026-10-02（ok）

用途：GRAMMAR / STANDARD / DESIGN-SYSTEM

## 是什么

Material 3 形状系统说明，支持圆角阶梯、非对称形状、重映射与光学圆角。

页面所见：Google Material Design；未见日期

## 台账要点与本轮重访

- 有依据：十级 scale。从 None 0dp 到 Full，共十级，含 Large increased、Extra large increased 等。
- 有依据：对称/非对称形状。同一 10 级尺度用于对称与非对称（inner corners）形状。
- 有依据：style 与 component 两层重映射。页面分 Style changes 与 Component changes 两节。
- 有依据：圆角、切角与内容余量/嵌套关系。切角会比同尺寸圆角裁掉更多内容，需加 padding；嵌套对象应按外半径减 padding 得内半径。
- 有依据：数值 dp 不自动是 CSS px。页面以 dp 为单位，台账限定正确。

## 限制

光学圆角公式是设计指导而非感知定律；页面为 JS 渲染，WebFetch 只得空壳、curl HEAD 返回 405，正文由 Exa fetch 取得。 本轮只读文字，没有看图。

## 何时重访

项目明确采用该标准或设计系统的某一条、其版本或级别更新、或据此写检查项时重访原文。

台账原文见 [包内 standards 台账](../../../snapshots/local/design-grammar-atlas-20261002/research/standards-sources.md)，机器登记见 [`../catalog.json`](../catalog.json)。
