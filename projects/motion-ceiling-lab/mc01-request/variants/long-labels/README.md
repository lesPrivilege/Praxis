# 变体 long-labels

由 `node build.mjs long-labels` 从 [long-labels.json](../long-labels.json) 生成，不手改。文字替换：层名、状态词和界面提示都换成约两倍长的写法；字幕里引用的提示跟着换，镜头和时间线不动。

预期：标签仍在画面内、不互相遮住，界面状态行自动缩小字号，左侧层级的说明换行。

打开 [index.html](index.html) 运行；代码与主片共用，只有 `data.js` 不同。检查结果见 [验收回执](../../acceptance.md)。返回 [变体说明](../README.md)。
