# 分镜施工约定

这部片子是一张 1920×1080 的网页舞台。画面的每一帧都只由时间 `t` 决定，渲染器逐帧调用 `Film.seek(t)` 再截图。配音先生成，画面跟着配音的时间点走。

## 文件

| 文件 | 作用 | 谁能改 |
|---|---|---|
| `script/narration.json` | 旁白分段。每段有 `id` 和 `text` | 只有主会话 |
| `script/timeline.json`、`film/data/timeline.js` | 由配音生成的时间线：每段的起止、每个词的时间 | 生成物，不手改 |
| `film/js/engine.js`、`kit.js`、`parts.js`、`css/film.css` | 引擎、工具、共用部件、设计变量 | 只有主会话 |
| `film/js/scenes/<章>.js`、`film/css/<章>.css` | 各章分镜 | 该章的负责人 |
| `research/notes-*.md` | 核查过的事实，末尾有“可以说 / 不能说”清单 | 只读 |

## 时间

一切时间都是全片的绝对秒数，从旁白取：

```js
const { T } = Film, tl = K.tl;
T('c1.5')              // 这一段开始
T('c1.5', '伦敦')      // 旁白说到“伦敦”的时刻
T('c1.5', '伦敦', 1)   // 第二次出现
T('c1.5', 'end')       // 这一段的声音结束
T('c1.5', 1.2)         // 这一段开始后 1.2 秒
```

锚词只用汉字词。数字、百分号和英文在不同配音引擎里切分不同，不要拿来当锚。配音会重做，时间点会整体移动，所以**不要写死秒数**，也不要假设某一段有多长。画面动作通常比锚词早 0.1–0.2 秒起步，落点压在词上。

## 场景

```js
Film.scene('c1-map', from, to, ({ root }) => {
  root.classList.add('paper');           // 或 'night'
  const world = K.el(root, 'fill');      // 内容放这里
  K.el(root, 'grain'); K.el(root, 'vignette');
  ...
});
```

场景只在 `[from, to)` 之间可见。相邻场景可以重叠几分之一秒来做转场；后开始的场景盖在上面。每章第一个画面是共用的章节卡 `Parts.chapterCard('c1', '01', '起点')`，占 `c1.card` 那段静默；正文场景从 `T('c1.card','end')` 附近开始，到下一章的 `T('c2.card')` 结束，结束前自己把内容收掉。

## 写法规则

1. **初始状态在搭建时设定，动画只用 `tl.to()`。** 用 `K.show`、`K.rise`、`K.draw` 这些工具，或先 `gsap.set(el, {...})` 再 `tl.to(el, {...}, 时间)`。不用 `from()`、`fromTo()`、CSS transition、CSS animation、`setTimeout`、`Date`、`Math.random()`（随机数用 `K.rng(seed)`）。
2. **不依赖回调。** 需要每帧计算的东西用 `Film.onFrame(t => ...)`，它必须是 `t` 或被补间的对象的纯函数。
3. **量尺寸用 `offsetWidth` / `offsetLeft`**，不用 `getBoundingClientRect()`（播放器会缩放舞台）。
4. 位置用舞台像素的绝对定位：`K.box(parent, cls, x, y, w, h, html)`。
5. CSS 类名带本章前缀（`c1-…`），只写进本章的 CSS 文件。
6. 同一个元素的同一个属性，不要让两个补间在时间上重叠。

## 工具（`K`）

`el` `box` `svg` `sv` `path` 建元素；`split(el)` 拆成单字；`lines(parent, cls, [行…])` 建带遮罩的行，配 `rise` / `sink`；`show` / `hide` 显隐；`draw(path, at, {duration})` 描线；`type(chars, at, cps)` 打字机；`spoken(chars, segId)` 字随旁白逐个出现；`count(el, from, to, at, dur, fmt)` 数字滚动；`rng(seed)`；`elbow(a, b)` 上下两个框之间的折线；`chrome(root, {chapter:['01','起点'], badge, dark})` 左上角章节标；`source(root, html, from, to, dark)` 左下角出处。源码在 `film/js/kit.js`，开工前读一遍；`film/js/scenes/c0-hook.js` 是完整的范例。

## 设计

- **调子**：编辑设计，不是课件。冷白纸面（`.paper`）是常态；深色（`.night`）只留给“信息过载”和少数需要压低的段落。颜色只有墨色、灰阶和一个蓝色。蓝色只给“答案 / 结构 / 此刻的重点”，红色只给“断裂 / 出错”。不用渐变装饰、阴影卡片、图标、表情符号。
- **变量**：见 `css/film.css` 顶部。`--paper --ink --ink2 --ink3 --rule --blue --red --night --moon --moon2`。
- **字**：中文标题和引文用衬线（`.serif`，宋体），说明用无衬线，数字用 `.t-num`，史料感用 `--type`（打字机体）。字级用 `.t-hero 148 / .t-display 92 / .t-title 64 / .t-lead 46 / .t-body 34 / .t-small 26`。**画面上任何要读的字不小于 30px**，出处行除外（24px）。
- **版面**：四周留 80px 以上；主要内容的左缘常用 200px。左上角 (80,64) 是章节标，左下角是出处行，别压住。一屏只讲一件事，留白是正常的，但主体要够大：主体内容至少占画面宽度的六成。
- **运动**：运动只表示一件事的变化——出现、归位、连接、替换、镜头移动。同一个对象在变换前后保持是同一个元素（散落的条目聚成组，而不是一批淡出、另一批淡入）。进场用 `expo.out` / `power3.out`，0.5–1.0 秒；镜头和大位移用 `power2.inOut` / `power3.inOut`，1.2–2 秒；成组的东西错开 0.04–0.12 秒。画面不要长时间完全静止：一段旁白超过 4 秒时，中间要有与语义对应的推进。不做无意义的漂浮和呼吸。
- **线**：实线是已经成立的关系，虚线是尚未成立或被否定的。描线用 `K.draw`。
- **屏幕文字**：屏幕上的字是旁白的骨架，不是字幕。只放关键词、数字、引文、出处；不整句照抄旁白。

## 事实

屏幕上出现的每个事实、数字、引文、出处，都必须能在 `research/notes-*.md` 的“可以说”清单里找到；清单外的不写。英文原话保留英文并配中文。引用处用 `K.source` 给出处。合成的内容标明“合成”。

## 自查

```bash
python3 pipeline/frames.py c1.5 c1.5+2 c1.6+1 --name c1-a --out pipeline/_review/c1
python3 pipeline/frames.py --range 70 90 --step 2 --name c1-b --out pipeline/_review/c1
```

输出一张带时间和段号的拼图，用 Read 看。每段旁白至少看开头、中间、结尾三帧；转场处按 0.2 秒一帧看。检查：字有没有溢出、重叠、被裁切；最小字号；元素是否在该出现时出现、该消失时消失；控制台有没有报错（脚本会把报错打到终端）。全章做完后按 3 秒一帧过一遍。
