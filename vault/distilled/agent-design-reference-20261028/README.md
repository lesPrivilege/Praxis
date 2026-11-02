# Agent 产品界面与 SaaS 官网设计参考 · 2026-10-28

云端研究任务交付的参考包，分两条线：agent 对话工作区的层次、密度、字体与工作状态；SaaS 官网叙事与产品内价格、服务浮层。包内文件原样保存，`SHA256SUMS.txt` 可复核（入账时 41 个文件全部通过）。

- [包说明](README.zh-CN.md) · [QA 与使用边界](QA-AND-BOUNDARIES.zh-CN.md) · `manifest.json`
- [Open Claude UI 参考](01-open-claude-ui/README.md)：固定提交 `c1f923ae` 的源码换算值、公开演示站 7 张截图、token JSON
- [SaaS 官网与价格浮层参考](02-saas-public/README.md)：Linear、Stripe、Notion、Vercel、Ramp、Intercom 的首页与定价，20 张截图

网页来源登记在 dsh-praxis 名册：`praxis:open-claude-ui`（design/interaction，component-library），六个定价页 `praxis:linear-pricing`、`praxis:stripe-pricing-zh-us`、`praxis:notion-pricing`、`praxis:vercel-pricing`、`praxis:ramp-pricing`（design/composition，case）与 `praxis:intercom-pricing`（design/interaction，case）。首页观察写在各定价页条目的概要与摘录里。

边界：证据为 partial，截图与源码阅读由云端代理完成，本会话只读了正文、核了 hash，没有重开页面。价格是采集时页面状态；截图不授予品牌、字体、图像的再利用权。尚未进入 Kit，也未挂到任何 Kit 页；Kit 目前没有 agent 产品界面一页。
