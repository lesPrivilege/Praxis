# 变体 double-click

由 `node build.mjs double-click` 从 [double-click.json](../double-click.json) 生成，不手改。数据替换：0.4 个时间单位内点了两次保存，产生两条编号不同的请求，两条都写进了磁盘。

预期：两条请求各有标签和各自的数据块，编号不合并；界面状态行跟着后一条请求。

打开 [index.html](index.html) 运行；代码与主片共用，只有 `data.js` 不同。检查结果见 [验收回执](../../acceptance.md)。返回 [变体说明](../README.md)。
