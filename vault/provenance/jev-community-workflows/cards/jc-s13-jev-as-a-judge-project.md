---
id: "jc-s13-jev-as-a-judge-project"
status: "verified"
url: "https://yubol-bobo.github.io/jev-as-a-judge/"
---

# JEV-as-a-Judge 项目页

来源：[原始页面](https://yubol-bobo.github.io/jev-as-a-judge/) · 状态：`verified`

用途：Q2 / Q4 / JUDGE / CASCADE / CALIBRATION / CONFIDENCE / PRACTICE_MAP

## 摘要

作者项目页报告 17 个 judge 配置、冻结输入、保留失败和 source-cluster bootstrap 区间；JEV 在普通偏好/证据事实任务接近强 judge，但在 JudgeBench 推理编码和样式对抗任务明显落后，reference-free prose 近似随机且高置信。项目页报告冻结 JEV→GPT-6 cascade 在 510 个扩展 preference pairs 上保留约 99% accuracy、使用约 56.8% 费用。

## 证据与使用边界

作者研究页不是独立复现或生产 SLA；指标是 benchmark agreement/作者定义标签，非通用真实正确率。cascade 阈值在离线扩展集上选择，作者明确要求按 workload 验证；一个 proprietary JEV 版本、计算预算不匹配和估算费用限制外推。

## 何时重访

论文、补充代码、JEV 版本、judge 数据或 cascade policy 更新；任何上线闸门前重做独立标注与隐藏测试。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
