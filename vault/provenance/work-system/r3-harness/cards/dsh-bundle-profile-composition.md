---
id: "dsh-bundle-profile-composition"
status: "verified"
url: "https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/bundle/README.md"
---

# Profile plugin bundles

来源：[原始页面](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/bundle/README.md) · 状态：`verified`

用途：GRAMMAR / BUILD

## 摘要

bundle README 规定每个 package 声明 dsh.bundle.patch，由 launcher 按顺序叠加成 dsh --profile 组合；web/headless/acp/sdk 基于 dsh-base，sdk-minimal 是完整树，树外 bundle 可通过 dsh plugin --profile <name> add 安装。

## 证据与使用边界

该页只定义 bundle 元数据和组合 grammar；不能单独证明某个 Computer Use 包实际声明了 dsh.bundle，或没有启动缺陷。

## 何时重访

新增 bundle、profile 层级或插件安装失败时复查 package manifest 与 app-boot 文档。

引用映射与核查日期见 [catalog](../catalog.json)。本卡为登记结果的阅读投影；补充找到的来源不代表恢复原Chat隐藏引用。
