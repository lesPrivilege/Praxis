---
id: "r3-1password-secrets"
status: "verified"
url: "https://developer.1password.com/docs/cli/secrets-scripts"
---

# 1Password CLI: load secrets into scripts

来源：[原始页面](https://developer.1password.com/docs/cli/secrets-scripts) · 状态：`verified`

用途：GRAMMAR / GOVERNANCE

## 摘要

1Password 官方文档说明 op run、op read、op inject 和 secret references 可在运行时把秘密注入 subprocess、环境变量或配置文件，并建议用限制到特定 vault 的 Service Account 遵循最小权限。

## 证据与使用边界

需要 1Password 账户、CLI 和已存储秘密；环境变量/命令行仍需防日志泄露，Service Account 范围与组织政策要单独审查。

## 何时重访

CLI 版本、beta Environment、Service Account 权限或企业秘密注入策略变化时复查。

引用映射与核查日期见 [catalog](../catalog.json)。本卡为登记结果的阅读投影；补充找到的来源不代表恢复原Chat隐藏引用。
