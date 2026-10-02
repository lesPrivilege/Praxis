---
id: "s05-swe-agent"
status: "unverified"
---

# SWE-agent

状态：4 个链接，主会话读了 0 个。许可（研究包自述）：MIT。

## 研究包取什么，不取什么

取：失败先分类；可修的有限恢复，不可修的显式终止；保留轨迹与可用产物。

不取：固定重试次数、提交标记、“不改测试”的基准契约。

## 逐链接

| 编号 | 链接 | 状态 | 本仓库读到的 |
|---|---|---|---|
| K20 | [默认契约](https://github.com/SWE-agent/SWE-agent/blob/3ea751c087f32b16e039a2233dd6eefecef325d5/config/default.yaml) | `unverified` | 未打开 |
| K21 | [错误处理](https://github.com/SWE-agent/SWE-agent/blob/3ea751c087f32b16e039a2233dd6eefecef325d5/sweagent/agent/agents.py#L1062-L1218) | `unverified` | 未打开 |
| K22 | [含xfail的测试](https://github.com/SWE-agent/SWE-agent/blob/3ea751c087f32b16e039a2233dd6eefecef325d5/tests/test_agent.py) | `unverified` | 未打开 |
| K23 | [MIT许可](https://github.com/SWE-agent/SWE-agent/blob/3ea751c087f32b16e039a2233dd6eefecef325d5/LICENSE) | `unverified` | 未打开 |

没有打开的链接，内容以研究包 [sources.md](../../../snapshots/local/community-grammar-20261002/sources.md)记的读取范围为准，本仓库没有核对。

## 何时重访

要据这组来源在 Kit 里写规则、上游改动、或研究包的结论被真实任务推翻时。

研究包正文见 [快照](../../../snapshots/local/community-grammar-20261002/community-grammar-review.md)，机器登记见 [`../catalog.json`](../catalog.json)。
