# 来源与生成

交付文件 `glyphs.svg`、`components.html`、`motion.html` 由这里的文件生成，生成后不依赖本目录。改记号或运动时改来源再重新生成，两页里内联的定义才会和 `glyphs.svg` 一致。

```
node src/build.mjs
```

零依赖，Node 18 以上。

| 文件 | 内容 |
|---|---|
| `glyphs.mjs` | 全部记号、端点和箭头的定义，唯一来源 |
| `motion-lib.mjs` | 十种运动的 t 函数和样张的画法；浏览器和 Node 用同一份 |
| `base.css` | 两个页面共用的排版和按钮 |
| `components.src.html` | 控件页的来源 |
| `motion.src.html` | 运动页的来源；各节由 `build.mjs` 按 `motion-lib.mjs` 生成 |
| `build.mjs` | 把 `../tokens.css`、`base.css`、用到的记号和运动函数内联进两页，并生成 `glyphs.svg` 的总览 |

两页只内联自己用到的记号。`tokens.css` 在上一级，是交付文件之一，也是这里的输入。
