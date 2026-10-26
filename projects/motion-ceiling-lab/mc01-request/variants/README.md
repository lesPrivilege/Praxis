# 变体：改输入，重新渲染

每个 `.json` 是对 [editable.json](../editable.json) 或输入事件的一处修改，`node build.mjs <名字>` 生成同名目录（`data.js`、`index.html`、说明），代码与主片共用。名字以 `refuse-` 开头的是应当被拒绝的输入，生成脚本报出原因，不产生目录；每个文件的 `refuse_with` 写着应当报出的原因，`verify.py` 核对的是原因，不只是“被拒绝了”。后四个是独立复查之后补的。

| 变体 | 改了什么 | 预期 |
|---|---|---|
| [long-labels](long-labels/README.md) | 文字：层名、状态词、界面提示换成约两倍长 | 标签仍在画面内、互不遮挡；状态行自动缩小；记录和层级说明换行 |
| [double-click](double-click/README.md) | 数据：0.4 个时间单位内点了两次，产生两条请求，都落盘；时间线、镜头和文案随之重写 | 两条请求各有编号、标签和数据块，不合并 |
| [storage-from-behind](storage-from-behind/README.md) | 镜头：“落盘”一章换到存储层另一侧看 | 状态、标签文字、运行记录与主片逐刻相同，只有画面不同 |
| `refuse-no-ack` | 请求没有 ack 就 durable | 拒绝，不猜它经过了哪一层 |
| `refuse-unknown-state` | 出现没有定义的状态 `saved` | 拒绝，不当成已落盘 |
| `refuse-rewind` | 时间线让事件时间从 4 退回 3.5 | 拒绝；倒放不能把已落盘说成未落盘 |
| `refuse-missed-event` | 时间线没有经过 t=4 | 拒绝；状态只能在时间线写明的时刻翻转 |
| `refuse-early-caption` | req-1 落盘推迟到影片第 52 秒，字幕没有跟着改 | 拒绝；字幕不能先于它提到的事件 |
| `refuse-early-receipt` | 失败回执比失败早出发 5 秒 | 拒绝；回执不能先于它报告的事件 |
| `refuse-hidden-failure` | req-2 失败时更晚的 req-3 已经在途 | 拒绝；一行状态提示说不出这次失败，不把它藏起来 |
| `refuse-same-instant` | 两条请求同一时刻发出 | 拒绝；两个方块会画在同一个位置 |

合并规则：对象逐键合并，数组整体替换；对象里写 `"$replace": true` 时整体替换。实际跑出来的结果和这次改动暴露的问题见 [验收回执](../acceptance.md#改输入重新渲染)。返回 [作品说明](../README.md)。
