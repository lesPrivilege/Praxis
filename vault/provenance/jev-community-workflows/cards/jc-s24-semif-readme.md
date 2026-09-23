---
id: "jc-s24-semif-readme"
status: "verified"
url: "https://github.com/TheoLeeCJ/SemIf/blob/master/README.md"
---

# SemIf README

来源：[原始页面](https://github.com/TheoLeeCJ/SemIf/blob/master/README.md) · 状态：`verified`

用途：Q2 / Q4 / LOCAL_ALTERNATIVE / MPS / CALIBRATION / BACKEND / VERSIONING

## 摘要

SemIf 明确是独立项目，只复现 typed-decision 接口模式，不复现 TypeSafe/Jev 权重或训练。README 的 2026-09-22 更新新增 PyTorch/MPS、Qwen3.8-27B EXL3 bridge 和按 workload 的 temperature calibration；同时保留 MLX/llama.cpp 后端、模型 revision/prompt hash、BF16 fast-path argmax 差异和 out-of-fold ECE 表。

## 证据与使用边界

这是作者项目 README 和自有 fixture 测试，不是 Jev 等价物或独立复现；量化、后端、缓存路径会改变数值，calibration 只对各 workload 的标签切分有意义。README 的 TypeSafe published subset 不是本次 live Jev 运行。

## 何时重访

MPS/MLX/llama.cpp 后端、模型 revision、校准方法、结果 bundle 或 TypeSafe 对齐数据更新时复查；本地替代必须重新验收概率质量和动作质量。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
