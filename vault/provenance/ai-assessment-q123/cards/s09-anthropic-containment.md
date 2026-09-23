---
id: "s09-anthropic-containment"
status: "verified"
url: "https://www.anthropic.com/engineering/how-we-contain-claude"
---

# Anthropic — How we contain Claude across products

来源：[原始页面](https://www.anthropic.com/engineering/how-we-contain-claude) · 状态：`verified`

用途：GRAMMAR / SCALE

## 摘要

Anthropic 的生产安全文章强调环境边界、网络出口和文件系统隔离，指出用户或项目文件也可能成为 prompt-injection 入口，并讨论审批疲劳与不同隔离级别。

## 证据与使用边界

厂商安全经验和披露案例，不是目标产品的独立安全审计；隔离不会自动使挂载目录内写入、账号、生产连接或凭证安全。

## 何时重访

沙箱/VM、凭证挂载、网络出口、项目配置加载或人工审批策略变化时；目标环境独立做权限和注入测试。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
