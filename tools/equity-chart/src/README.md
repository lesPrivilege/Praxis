# 源码

`index.html` 是页面骨架，`/*@inline …*/` 由 [build.py](../build.py) 替换成对应文件内容。各脚本挂在全局 `EC` 上，按 `index.html` 里的顺序加载。改完运行构建再打开 `../equity-chart.html` 检查。
