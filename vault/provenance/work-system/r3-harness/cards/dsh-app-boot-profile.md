---
id: "dsh-app-boot-profile"
status: "verified"
url: "https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/boot/app-boot/README.md"
---

# @deepseek-ai/dsh-app-boot profiles and boot

来源：[原始页面](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/boot/app-boot/README.md) · 状态：`verified`

用途：GRAMMAR / BUILD / SCALE

## 摘要

app-boot 说明 dsh launcher 如何加载环境层、组合 profile bundles 与 patch、启动插件并报告失败；profile 位于 $DSH_HOME/profiles/<name>，由可安装 bundles 与 cordis.patch.yml 组成，web/headless/acp/sdk/sdk-minimal 是不同组合，缺少 bundle patch 声明会明确失败。

## 证据与使用边界

页面描述运行时组合和启动诊断，不证明社区包的质量、安全或长期兼容性。

## 何时重访

Profile manifest、patch 层级、HMR 或 runtime resolution 发生变化时复查。

引用映射与核查日期见 [catalog](../catalog.json)。本卡为登记结果的阅读投影；补充找到的来源不代表恢复原Chat隐藏引用。
