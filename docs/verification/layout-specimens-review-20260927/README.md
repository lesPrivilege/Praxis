# 原子化编排样张独立核查 · 2026-09-27

本目录记录对 [`vault/distilled/layout-specimens-20260927`](../../../vault/distilled/layout-specimens-20260927/) 的只读核查，供主代理筛选样张时回查。核查对象是机器索引、检查报告、共享 synthetic fixture 和源码定位；不替代主代理看图，也不把实验样张晋升为 canonical 或 Kit 规范。

## 入口

- [证据与算术核对](evidence.md)：数量、锚点、检查范围、fixture 口径和组合耦合的可复核定位。
- [样张交接](../../../vault/distilled/layout-specimens-20260927/handoff.md)：制作方交接和候选清单。
- [主代理筛选](../../../vault/distilled/layout-specimens-20260927/review.md)：main 的局部视觉筛选与下一轮裁决方向。
- [原始检查记录](../../../vault/distilled/layout-specimens-20260927/checks/README.md)：报告的原始范围、排除项与已检查边界。

## 方法与状态

本轮只读解析 `specimens.json`、报告 JSON、HTML/CSS 和 Markdown 行号；没有执行样张来源脚本、没有安装依赖、没有修改 `vault/distilled/layout-specimens-20260927/`。数值均来自本次合成 fixture 或由其做的透明算术，不能当成外部事实。若与生成索引的自述冲突，以证据页列出的源码定位和主代理裁决为准。

## 接收与验证

Main接收状态为candidate reference，部分样张做了截图初筛；具体处置保持在 [review](../../../vault/distilled/layout-specimens-20260927/review.md)，来源身份及内容指纹见 [intake](../../../vault/intake/layout-specimens-20260927.json)。全库验证结果见 [repository-check.json](repository-check.json)，不把未通过的既有断链隐藏为全库通过。
