# 静态图施工说明

交给绘制者。每张图是 `src/drawings/<id>.html`：一个 `<div class="dw-scroll" style="--dw-min:…;--dw-max:…">` 包住原生 `<svg>`，后跟一行 `<figcaption>`。正文在锚句所在段落之后另起一行插入 `<!-- svg: id -->`，前后空行；除此之外不改 Books。样板见 `src/drawings/f08-bloom.html`。

## 只画正文写出的东西

每个对象、数字、标签、关系都要能在正文里找到原句；画之前逐项核对。正文没写的中间值、映射或分支不画；推不出的就缩小范围或放弃这张图，并在回报里说明。图注一句，用书的语体：陈述机制，不写“如图所示”，不写免责或来路说明。

## 画法

- `viewBox` 按内容裁到最小；宽度一般 560–900。`--dw-max` 取 viewBox 宽的 1–1.25 倍（px），防止放大后字太大；`--dw-min` 取在 375px 屏上字仍可读的宽度，超出时横向滚动。
- 只用 `book.css` 里 drawing 一节的类：文字 `t`、`t-s`、`t-b`、`t-n`（数）、`t-big`、`t-em`、`t-inv`，对齐 `mid`、`end`；线 `ln`、`ln-soft`、`ln-strong`、`ln-dash`、`ln-em`；框 `box`、`box-dash`、`box-em`；填充 `f0`–`f3`、`f-ink`、`f-em`。不写颜色值，不加渐变、阴影、圆角胶囊、图标或装饰性编号。
- 实线是已确定，虚线只表示尚未发生或尚未确定。强调色全图最多一处，给正文要读者看的那一个差别。
- 层级靠位置、字号和粗细；同类元素对齐在同一基线或网格上。
- `<title>` 写图名，`<desc>` 用一两句复述图中事实，`role="img"`、`aria-labelledby` 指向两者，id 带图名前缀。

## 自查

`node demos/saas-engineering-textbook/build/build.mjs` 通过；用无头 Chrome 或浏览器截图看 1280 与 375 两种宽度，文字不重叠、线不穿字；正文数字与图中数字逐一比对。
