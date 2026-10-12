# 场序

`beats.json` 是整部片子的时钟：十场各自的编号、章节标和时长（秒）。没有配音，时间由人定；改了某一场的 `dur`，之后的场整体后移，运行 `build/timeline.py` 重新生成时间线。

场内每一项出现的时间写在 [film/scenes.js](../film/README.md)，以本场开始后的秒数计。定时的依据是读速，见[项目说明](../README.md#读速怎么定)。

返回 [项目说明](../README.md)。
