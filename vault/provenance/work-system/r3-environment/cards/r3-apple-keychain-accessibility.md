---
id: "r3-apple-keychain-accessibility"
status: "partial"
url: "https://developer.apple.com/documentation/Security/restricting-keychain-item-accessibility"
---

# Apple Keychain item accessibility

来源：[原始页面](https://developer.apple.com/documentation/Security/restricting-keychain-item-accessibility) · 状态：`partial`

用途：GRAMMAR / GOVERNANCE

## 摘要

Apple 官方 Security 文档说明 Keychain item 的可访问条件可按设备状态设置，并以 kSecAttrAccessible 控制应用访问密码等秘密的条件。

## 证据与使用边界

本轮页面正文需要 JavaScript，具体 API 细节未逐行读取；Keychain access control 也不自动解决组织审批、备份、同步或第三方工具边界。

## 何时重访

macOS Keychain API、设备锁定策略、应用 access group 或企业 MDM 要求变化时复查。

引用映射与核查日期见 [catalog](../catalog.json)。本卡为登记结果的阅读投影；补充找到的来源不代表恢复原Chat隐藏引用。
