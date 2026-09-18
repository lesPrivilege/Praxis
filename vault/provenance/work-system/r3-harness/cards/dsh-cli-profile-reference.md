---
id: "dsh-cli-profile-reference"
status: "verified"
url: "https://github.com/deepseek-ai/deepseek-harness/blob/master/apps/cli/reference/README.md"
---

# dsh CLI behavior reference

来源：[原始页面](https://github.com/deepseek-ai/deepseek-harness/blob/master/apps/cli/reference/README.md) · 状态：`verified`

用途：GRAMMAR / BUILD

## 摘要

官方 CLI reference 定义 dsh --profile <name>、profile 目录、bundle 顺序和 profile/home/argv patch 层；内置 bundles 从安装解析，树外插件从 profile node_modules 解析，web/headless 首次使用可从模板初始化。

## 证据与使用边界

命令语法和层级是当前 master 的实现契约，不能据此承诺旧 alpha 或未构建源码的行为。

## 何时重访

脚手架命令、profile 初始化、bundle resolution 或源码运行方式升级时复查。

引用映射与核查日期见 [catalog](../catalog.json)。本卡为登记结果的阅读投影；补充找到的来源不代表恢复原Chat隐藏引用。
