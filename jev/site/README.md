# 网页

[index.html](index.html)：Jev 专章的单文件网页，离线可读，不依赖外部字体或脚本，可打印 A4，375 px 窄屏可读。由底稿改编，改编范围见 [底稿 README](../draft/README.md#与网页的关系)。

## 构成

| 文件 | 内容 |
|---|---|
| [src/page.html](src/page.html) | 页面正文与样式；图的位置写作 `{{FIG:名称}}`，来源行写作 `<p class="src" data-src="ID 列表"></p>` |
| [src/data.json](src/data.json) | 六张图的数据，每组带它依据的主张 ID |
| [build.py](build.py) | 画图、按登记填出来源行与来源列表，未知 ID 时停止 |

```bash
python3 jev/site/build.py
```

## 设计取舍

- 色与字取自 Kit 的 [marks tokens](../../dsh-praxis/kit/design/marks/tokens.css)：浅色冷调，一种强调色。强调色在静态图里只标一处要读者注意的数（Jev 在 0.75 阈值下的 22.2%、它放行的 23.23%）；在步进图里改作“当前一步”，图注写明，两种用法不进同一张图（Kit [记号 grammar](../../dsh-praxis/kit/design/marks/README.md) 第 2 节第 4 条）。
- 运动只用在两处状态变化：SAG2 消融逐步加上一个环节，一个问题依次经过六步判断。都可以手动步进；后者可以播放，可以随时暂停。`prefers-reduced-motion` 时去掉过渡；没有脚本时全部内容可见；打印时全部展开。
- 生态图是按路线分组的点图，横轴为对数参数量；实心与空心区分是否开放权重，规模未公布的放在右侧单列，不估值。
- 窄屏下图保留 620 px 宽，横向滚动，表格同样可横向滚动，正文不横向溢出。
- 页面只链接公开 URL，不暴露原 Chat 与本地路径。

## 检查记录

2026-10-23，Browser pane（Chromium）：桌面宽度逐节截图；375 px 下 `scrollWidth` 等于视口宽度；两个步进图逐步点击，类名与计算后的透明度、背景色符合当前步；构建时 85 个来源全部解析。未做：Safari / Firefox、屏幕阅读器、键盘之外的辅助技术、读者测试、打印输出的实际检查。
