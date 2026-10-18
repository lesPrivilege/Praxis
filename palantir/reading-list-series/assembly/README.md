# 编排

单集和合集由同一份正文排出来，区别只在这里。

- [compilation-script.json](compilation-script.json)：合集专有的旁白。当前为空：各集正文开头都从自己的读物讲起，章节卡就是接缝，合集没有新增串词。
- `compilation-scenes.js`、`compilation-scenes.css`：合集专有的画面，当前为空，留着是为了加载约定不变。
- [timelines](timelines/README.md)：`build/assemble.py` 生成的各编排时间线与字幕。
- `ledgers.js`：`build/ledger.py` 从研究登记导出给舞台用的主张、图片与来源，生成物。
- `compilation.md`：合集专有旁白的阅读稿，生成物。
- `motif.py`、`covers/`：合集的封面图形与封面。

单集的编排是：系列标识 → 本集引入 → 标题卡 → 正文 → 本集收尾 → 片尾。合集是：系列标识 → 每一集的章节卡加正文 → 片尾。引入、收尾和“下一集”只在单集里。

返回 [系列说明](../README.md)。
