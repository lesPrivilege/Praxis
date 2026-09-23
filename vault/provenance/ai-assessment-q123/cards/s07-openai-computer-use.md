---
id: "s07-openai-computer-use"
status: "verified"
url: "https://developers.openai.com/api/docs/guides/tools-computer-use"
---

# OpenAI — Computer use

来源：[原始页面](https://developers.openai.com/api/docs/guides/tools-computer-use) · 状态：`verified`

用途：GRAMMAR / SCALE

## 摘要

官方 computer-use 指南要求隔离环境、站点/动作 allowlist、不信任屏幕和第三方文本、在具体副作用前确认、为敏感数据输入取得明确同意，并限制步数/时间/成本及核对实际结果。

## 证据与使用边界

指南是集成与安全控制建议，不证明目标桌面、浏览器、账号或企业权限已按这些要求实现；敏感输入、生产变更和邮件发送仍需目标系统验证。

## 何时重访

computer tool/code execution 版本、权限策略、敏感数据范围或桌面运行环境变化时；上线前做故障注入和人工接管演练。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
