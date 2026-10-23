# 五条线的登记

每个文件是一个探索代理（Claude Sonnet）在 2026-10-23 的输出，格式相同：`sources`、`claims`、`gpt_discrepancies`、`gaps`。代理按同一份简报工作：只读一手来源，不保存网页副本，被拦截不绕过，引文不超过 25 个英文词，数字写明测量方与条件。

| 文件 | 线 |
|---|---|
| [A-jev-core.json](A-jev-core.json) | Jev 本身 |
| [B-ecosystem.json](B-ecosystem.json) | 开源与兼容生态 |
| [C-finetune-deploy.json](C-finetune-deploy.json) | 微调与部署 |
| [D-eval.json](D-eval.json) | 评测与 benchmark |
| [E-enterprise.json](E-enterprise.json) | 企业场景与数据库 |

这些文件保持代理交回时的原样。主会话的核对与裁决写在 [review.json](../review.json)，合并后的视图是 [sources.json](../sources.json) 与 [claims.jsonl](../claims.jsonl)。E 线的简报没有附上 GPT 的说法，所以它的 `gpt_discrepancies` 记的是来源之间的冲突。
