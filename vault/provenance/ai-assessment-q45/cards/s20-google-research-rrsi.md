---
id: "s20-google-research-rrsi"
status: "verified"
url: "https://github.com/google-research/rrsi"
---

# Google Research — RRSI: Regularized Recursive Self-Improvement of Agent Harnesses

来源：[原始页面](https://github.com/google-research/rrsi) · 状态：`verified`

用途：Q5 / RSI / PLAYBOOK / VERSIONING / CANDIDATE / INDEPENDENT_EVAL / COST_GUARD

## 摘要

RRSI README 把 harness 演化描述为研究方法：开放 prompt、control flow、tools、memory 等编辑空间，但通过编辑预算、完整历史、leakage critic、噪声调整门槛、成本规则、剪枝和独立 worktree 控制搜索；每个编辑保留假设、分数、成本变化和裁决。

## 证据与使用边界

README 明确项目不是受支持的 Google 产品；其 benchmark、代码和工作流不能证明法律 playbook 的正确性、组织成熟度、权限隔离或生产 SLA，也未固定远端默认分支 commit。

## 何时重访

研究论文/仓库 commit、候选选择算法或本题 playbook 变更治理设计改变；正式采用前必须用独立业务评估验证。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
