---
id: "s02-anthropic-skill-creator"
status: "partial"
---

# Anthropic skill-creator

状态：4 个链接，主会话读了 2 个。许可（研究包自述）：Apache-2.0。

## 研究包取什么，不取什么

取：有无对照或新旧对照；看无鉴别力的断言、波动、成本与轨迹；一次改一处再决定接纳或撤回。

不取：命令行、查看器、固定的查询数与轮数。

## 逐链接

| 编号 | 链接 | 状态 | 本仓库读到的 |
|---|---|---|---|
| K05 | [固定主体](https://github.com/anthropics/skills/blob/b0cbd3df1533b396d281a6886d5132f623393a9c/skills/skill-creator/SKILL.md) | `verified` | 主会话读了相关段落：每个测试例同时起有 skill 和基线两次运行；改已有 skill 时基线是改动前的快照；记录 token 与用时；分析时找两边都通过的断言、高波动的例子，并要求读轨迹而不只看产出。 |
| K06 | [选择最佳描述的代码](https://github.com/anthropics/skills/blob/b0cbd3df1533b396d281a6886d5132f623393a9c/skills/skill-creator/scripts/run_loop.py) | `verified` | 主会话读了脚本：评测集分成 train 与 test；改写器看不到 test 分数；最后按 test 分数挑最佳一轮。所以 test 参与了选择。 |
| K07 | [Apache-2.0许可](https://github.com/anthropics/skills/blob/8a1541c4a3ffa5a20a5a91de0dcf3f0bab1d1ef4/skills/skill-creator/LICENSE.txt) | `unverified` | 未打开 |
| K08 | [变更](https://github.com/anthropics/skills/commit/b0cbd3df1533b396d281a6886d5132f623393a9c) | `unverified` | 未打开 |

没有打开的链接，内容以研究包 [sources.md](../../../snapshots/local/community-grammar-20261002/sources.md)记的读取范围为准，本仓库没有核对。

## 何时重访

要据这组来源在 Kit 里写规则、上游改动、或研究包的结论被真实任务推翻时。

研究包正文见 [快照](../../../snapshots/local/community-grammar-20261002/community-grammar-review.md)，机器登记见 [`../catalog.json`](../catalog.json)。
