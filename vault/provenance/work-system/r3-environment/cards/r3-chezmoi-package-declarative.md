---
id: "r3-chezmoi-package-declarative"
status: "verified"
url: "https://www.chezmoi.io/user-guide/advanced/install-packages-declaratively/"
---

# chezmoi declarative package installation

来源：[原始页面](https://www.chezmoi.io/user-guide/advanced/install-packages-declaratively/) · 状态：`verified`

用途：GRAMMAR / BUILD

## 摘要

官方示例用 .chezmoidata 声明包清单，再由 run_onchange 脚本调用 brew bundle；包清单变化时才重新执行安装逻辑。

## 证据与使用边界

官方明确这是用脚本模拟包安装的声明式体验；不保证跨机器、权限、锁版本或卸载语义。

## 何时重访

选择 chezmoi 与 Homebrew 的组合、包锁定或 bootstrap 失败恢复策略时复查。

引用映射与核查日期见 [catalog](../catalog.json)。本卡为登记结果的阅读投影；补充找到的来源不代表恢复原Chat隐藏引用。
