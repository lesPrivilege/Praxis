# 产品界面与 SaaS 官网设计参考包

研究日期：2026-10-28。此包将两条参考线分开，避免把营销页面压缩成工作区，或把公开网站体验误说成已登录产品能力。

## 先读什么

1. **产品内界面与 agent 工作状态：**[Open Claude UI 自足主文](01-open-claude-ui/open-claude-ui-design-reference.zh-CN.md)。覆盖字体、留白、密度、语义色、圆角、输入、授权、产物分栏及工程缺口。配套 [tokens](01-open-claude-ui/design-tokens.reference.json)、[视觉证据说明](01-open-claude-ui/visual-evidence.zh-CN.md)、[7 张截图图册](01-open-claude-ui/screenshots.md)。
2. **未来产品官网及产品内 price/service pop 参考：**[SaaS 自足主文与 20 张图谱](02-saas-public/REFERENCE.md)及[截图索引](02-saas-public/screenshot-index.json)。覆盖 Linear、Stripe、Notion、Vercel、Ramp、Intercom 的官网、定价、服务说明及一条真实价格说明弹窗路径。它不是首页“好看排行榜”。
3. **证据边界与质量检查：**[QA 与使用边界](QA-AND-BOUNDARIES.zh-CN.md)。所有文件的大小、像素与 SHA-256 记录见 `manifest.json`；校验表见 `SHA256SUMS.txt`。

## 如何组合，不如何照抄

- 官网承担“为什么相信、适合谁、买什么”；工作区承担“当前任务、证据、执行状态”；价格/服务弹层承担“此刻成本、权限、额度或服务范围的决定”。三者采用同一语义，但不同信息密度。
- 保留结构关系：有限主动作、渐进披露、明确计费单位、低干扰表面、证据与承诺相邻。替换品牌、文案、图形、字体与业务对象。
- 截图只证明捕获时可见状态；源码值、DOM 测量、视觉观察和设计建议各有不同证据强度。
- 两份主文离线可读，不依赖重新打开外链才能理解结论；完整截图仅在 ZIP 内，单独 MD 以文字论证为主。

## 范围

共 27 张未改动的公开页面截图：Open Claude UI 7 张，跨行业 SaaS 20 张。未包含完整第三方源码、登录态数据、采购流程、支付数据或品牌资产包。本次包是两条设计研究线的交付，不代表已经完成法律科技全行业产品/商业模式尽调，也不是实现后的产品。
