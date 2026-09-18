---
id: "r3-chezmoi-scripts"
status: "verified"
url: "https://www.chezmoi.io/user-guide/use-scripts-to-perform-actions/"
---

# chezmoi scripts and idempotency

来源：[原始页面](https://www.chezmoi.io/user-guide/use-scripts-to-perform-actions/) · 状态：`verified`

用途：GRAMMAR / BUILD / GOVERNANCE

## 摘要

官方文档说明 run、run_onchange、run_once 脚本的执行语义、内容哈希状态和 dry-run；明确要求所有脚本保持幂等。

## 证据与使用边界

脚本会突破声明式边界，仍可能修改系统、依赖外部命令或泄露输出；幂等需要由实现者验证。

## 何时重访

bootstrap 脚本、run_once/run_onchange 语义或目标系统权限变化时复查。

引用映射与核查日期见 [catalog](../catalog.json)。本卡为登记结果的阅读投影；补充找到的来源不代表恢复原Chat隐藏引用。
