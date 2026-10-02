---
id: "s03-superpowers-debugging-tdd"
status: "partial"
---

# superpowers 调试与 TDD

状态：5 个链接，主会话读了 3 个。许可（研究包自述）：MIT。

## 研究包取什么，不取什么

取：复现或记下不确定→一条可证伪假设→最小实验→回归；测试预期不由被测实现算出。

不取：魔法词拼写、失败恰好三次的阈值、“先写实现就删掉重来”。

## 逐链接

| 编号 | 链接 | 状态 | 本仓库读到的 |
|---|---|---|---|
| K09 | [调试主体](https://github.com/obra/superpowers/blob/8ca22dba9a94f28898bbce59f2537ff4d87c747d/skills/systematic-debugging/SKILL.md) | `verified` | 主会话读了全文：四个阶段，第三阶段要求单一假设、最小改动、一次一个变量、不在失败的修补上再叠修补；修三次不成就停下来质疑架构并找人讨论。 |
| K10 | [TDD主体](https://github.com/obra/superpowers/blob/8ca22dba9a94f28898bbce59f2537ff4d87c747d/skills/test-driven-development/SKILL.md) | `unverified` | 未打开 |
| K11 | [MIT许可](https://github.com/obra/superpowers/blob/8ca22dba9a94f28898bbce59f2537ff4d87c747d/LICENSE) | `unverified` | 未打开 |
| K12 | [关键词耦合改动90e1721](https://github.com/obra/superpowers/commit/90e1721817ff783a200017e395911b9af858285a) | `verified` | 主会话读了提交说明：改掉一个会被宿主扫描到的字面词的拼写，文档要求的动作不变。作者日期 2026-05-23，提交日期 2026-06-16。 |
| K13 | [压力消融报告b9e75dd](https://github.com/obra/superpowers/commit/b9e75dddec7a384f42ce08532ec17bb1ef5d9459) | `verified` | 主会话读了提交说明：删掉论证、只留一行表格会让“先写测试”在压力题上从 8/10 降到 5/10（n=10），普通触发不变；所以把五条论证并进表格行而不是删掉。作者日期 2026-07-05，提交日期 2026-07-24。 |

没有打开的链接，内容以研究包 [sources.md](../../../snapshots/local/community-grammar-20261002/sources.md)记的读取范围为准，本仓库没有核对。

## 何时重访

要据这组来源在 Kit 里写规则、上游改动、或研究包的结论被真实任务推翻时。

研究包正文见 [快照](../../../snapshots/local/community-grammar-20261002/community-grammar-review.md)，机器登记见 [`../catalog.json`](../catalog.json)。
