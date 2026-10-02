# 原始材料到项目输出的 lineage

状态：`candidate`。来源为 `6ab72e8e-00f0-83ec-b5e1-1155a6e6c68c`，主要证据是 turn `bbb213f4-db1f-4a35-9d51-a665a7937499` 与 assistant item `81322596-5c8f-4fd8-a692-8e5b3fd23e0d`。

## 生命周期

对话提出以下材料链：

```text
Chat / Explore / external material
        ↓
Raw material
        ↓
Consume: judge / extract / generalize
        ↓
Distilled knowledge
        ↓
Register and use
        ↓
Demo / output
```

消费不是“看过了”。至少要判断什么值得留下、去掉会话偶然性和不可公开上下文、再把结论写入适当的索引或产物。原 Chat 首先是 evidence；被消费后才可能成为候选知识；是否采纳仍是更晚的治理动作。

## Receipt 与索引

对话建议每份材料留下薄的 consumption receipt，记录 source、消费目的、接受/拒绝的结论、distilled paths 与 open questions。索引至少需要稳定 source ID、类型、捕获时间、路径、消费状态、derived paths、topics、公开边界和 hash。

公开层可以指向 source ID，但不得把 raw transcript、私密截图或附件沿 lineage 复制进去。`exists`、`read`、`consumed`、`distilled`、`accepted` 与 `published` 是不同状态，不能用一个布尔值代替。

## 当前未决

对话提出将 raw vault 与公开 working tree 做物理分离，或至少建立结构性排除；该建议涉及仓库同步和隐私治理，本批没有把它写入 `.gitignore` 或其他策略。初次消费后的消费、泛化和披露检查由 [ADR-015](../../../docs/decisions/015-kit-editorial-contract.md) 与入账规范采纳；[ADR-016](../../../docs/decisions/016-progressive-kit-structure.md) 只改变 Write/Design 的任务入口，不改变 raw source、distilled candidate 与已采纳规范之间的 lineage。相关仓库物理隔离与同步过滤仍未实施。
