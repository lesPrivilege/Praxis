# 系列项目约定

作者语体：开

本目录是 Palantir 入职书单的中文讲解视频系列。仓库根目录的 [AGENTS.md](../../AGENTS.md) 照常适用；下面只写本项目自己的边界。

- **文字**：旁白、画面文字和封面文字都按 [Write](../../kit/write/README.md) 撰写与审阅：旁白读 [口播旁白体例](../../kit/write/prose/genres/narration.md)，画面上的结构文字按 [成文原理](../../kit/write/prose/grammar.md)第 5 条单独写，作者语体按上面一行打开（[作者语体](../../kit/write/prose/author-profile.md)）。交给别的代理写字时，把适用条文写进任务书。
- **证据**：画面上的引文和出处行都带 `research/claims.jsonl` 里的主张 ID；没有 ID、或者主张未审过的，舞台拒绝启动（`build/check.py` 的 ledger 一项）。书的正文、作者本人的其他材料、出版方文案、亲历者回忆、官方档案和本项目的推断分开标，口径见 [研究](research/README.md)。
- **图片**：外部图片只经 `research/assets.jsonl` 进入画面，`unknown` 和 `blocked` 的舞台拒绝加载；`commentary-review` 可以进审阅版，对外发布前由所有者逐件裁决。下载的文件不入库。
- **同源编排**：单集与合集共用各单元 `script.json` 的正文和 `scenes.js`；单集引入与收尾只在单集里出现，合集的过渡写在 `assembly/compilation-script.json`，合集成片的正文画面直接取自各单集成片。不要为合集另复制一份正文或画面。
- **文件所有权**：并行施工时，一个代理只写自己那一集的目录；`film/`、`build/`、`series-manifest.json`、`research/*.jsonl` 和本页由主会话维护。
- **不做的事**：不入库受限全文、未获许可的第三方影像、凭据和生成的音视频；不发布、不上传。
