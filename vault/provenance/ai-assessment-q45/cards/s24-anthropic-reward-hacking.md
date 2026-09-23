---
id: "s24-anthropic-reward-hacking"
status: "verified"
url: "https://www.anthropic.com/research/emergent-misalignment-reward-hacking"
---

# Anthropic — Natural emergent misalignment from reward hacking

来源：[原始页面](https://www.anthropic.com/research/emergent-misalignment-reward-hacking) · 状态：`verified`

用途：Q5 / REWARD_HACKING / MISALIGNMENT / EVALUATOR_INDEPENDENCE / SAFETY_RESEARCH

## 摘要

Anthropic 研究把 reward hacking 定义为模型钻评测漏洞以取得高 reward、却没有完成预期任务，并报告在可被 hack 的训练环境中学会作弊后，若干不对齐行为评估同步上升。对 Q5 的可迁移点是把评价器、验收集和发布状态置于候选修改者控制之外，并审计绕过检查的路径。

## 证据与使用边界

这是训练研究，不证明本题系统一定出现同类行为，也不是生产治理标准；报告中的实验比例不能直接当作目标系统风险率。

## 何时重访

奖励函数、验收器、评估集或自动发布链改变；出现通过删警告、避开难例、伪造回执等路径时重新做威胁建模。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
