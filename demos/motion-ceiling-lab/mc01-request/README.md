# MC01 · 一条请求穿过一台机器

界面显示“已保存”的时候，数据在哪一层。合成输入 `request_chain`，作品修订 `r1`，2026-10-04。94 秒影片（1920×1080，30 帧，无声）和一页可操作的网页，出自同一份代码；另有一份不依赖画面的文字版。对应 [brief](../briefs.md) 的 MC01 和 [工单](../work-orders.md)的 WO00–WO01。

实际执行者是 Claude Opus 5.5（`claude-opus-5-5`，Claude Code 桌面端的一个会话）。独立复查由一个只读的 Claude Sonnet 子代理做。用户尚未 review，没有受众看过。

| 当前需要 | 入口 |
|---|---|
| 看作品 | [index.html](index.html)，用 `file://` 直接打开；需要 WebGL2，没有时页面改读文字版 |
| 看成片 | `renders/mc01-request.webm`，不进 git，按下面的命令在本地生成 |
| 知道动工前定了什么 | [选择、表达与资源计划](plan.md) |
| 核对检查了什么、没检查什么 | [验收回执](acceptance.md)、[证据](evidence/README.md) |
| 改内容再渲染 | [editable.json](editable.json)、[变体](variants/README.md) |

## 讲了什么

一份说明写好后点保存。请求 `req-1` 从界面出发，t=1 进入队列，队列发回一张回执，界面随即显示“已保存 ✓”；这时数据还没有写。请求接着经过处理层，t=4 才在存储层落盘，第二张回执上行三层回到界面，界面上那句话到这时才成立。之后把提示改成跟着回执走，再保存一次：`req-2` 在 t=6 入队，界面只说“已收到，等待写入”；t=8 写入失败，界面说“未保存”，等人决定要不要重试。

四层是解释用的示意，不代表物理尺寸；事件时间没有单位。请求在两个事件之间的位置是示意，输入没有给时点。

| 段落 | 起点 | 读者此刻要看懂的 |
|---|---|---|
| 01 保存 | 0:00 | 点保存，界面发出一条有编号的请求 |
| 02 屏幕后面 | 0:06 | 界面只是最上面一层，背后还有三层 |
| 03 第一张回执 | 0:14 | 队列的回执只上行一层，界面据此说了“已保存” |
| 04 处理 | 0:27 | 请求被机壳挡住时，编号和位置还在 |
| 05 落盘 | 0:39 | 数据块从虚线变成实心的那一刻，才是已保存 |
| 06 回到界面 | 0:49 | 第二张回执上行三层；镜头回去，数据留在原处；提示怎样改 |
| 07 第二次保存 | 1:03 | 改后的提示在入队时只说“已收到”；写入失败 |
| 08 界面说真话 | 1:26 | 失败回执回到界面；“已保存”要等最底层的回执 |

## 怎么操作

空格播放或暂停，←/→ 单帧（加 Shift 为 1 秒），`[` `]` 切换段落，Home/End 到首尾。数字键 1–4 让镜头停在界面、队列、处理、存储四层，5 是全景，0 回到影片的镜头；同样的按钮在时间轴下方。镜头只改变看到的范围，请求的状态照常由时间轴决定。把时间轴拖回更早的时刻，时间轴下方会写明这是回看，并列出记录里此后已经发生的事。

焦点在某个按钮上时，空格按下的是那个按钮。系统开启“减少动态效果”时，页面默认显示静态分镜和文字版，不播放镜头运动；静态分镜始终按影片的镜头画，不受观看者停住的镜头影响。`?static=1` 可以手动进入静态分镜，`?t=48` 停在指定时刻。

## 怎么改

改 [editable.json](editable.json)（文字、层名、状态词、界面提示、时间线、镜头、文案）或上层 [fixtures.json](../fixtures.json) 的 `request_chain`（事件），然后：

```bash
node demos/motion-ceiling-lab/mc01-request/build.mjs --all
```

生成脚本会拒绝场景需要猜、或画不出来的输入：状态不认识、缺 ack、事件时间倒退、时间线没有经过某个事件时刻、回执先于它报告的事件出发或在片尾之后才落地、字幕早于它提到的事件、一次失败会被更晚的请求的状态盖住、两条请求同一时刻发出、超过四条请求、层不是那四层、缺字段、字幕超过两行。字幕里的事件时间写成 `{t:req-1.ack}`，引用的界面提示写成 `{ui:truthful.ack}`，都由输入填入，不写死。

| 要改的内容 | 字段 |
|---|---|
| 层名与说明 | `levels[].label`、`levels[].gloss` |
| 状态怎样写成词 | `states.<状态>.word`、`.standing` |
| 界面上的文字与两套提示 | `ui.*`、`ui.policies.naive`、`ui.policies.truthful`；画面里“提示跟着回执走”的对照表由这两套提示生成 |
| 画面和页面上其余的字（图例、表头、按钮、提示） | `words.*`、`words.page.*` |
| 事件时间与叙事时间的对应 | `director.knots`：`[叙事秒, 事件时间]`，只能不减 |
| 回执飞多久 | `director.flights.<请求>.<状态>` |
| 镜头 | `director.camera[]`（方位角、距离、高度、注视点）；观看者可停的位置在 `director.stations` |
| 段落、字幕、静态分镜的时刻 | `director.chapters`、`director.captions`、`director.staticTimes` |

## 导出与检查

只用本机已有的工具：Node、Python Playwright 自带的 Chromium（经 ANGLE 使用 Metal）、numpy、OpenCV、Pillow。没有安装任何依赖。

```bash
python3 demos/visual-grammar/_pipeline/vgpipe.py render demos/motion-ceiling-lab/mc01-request
```

```bash
python3 demos/visual-grammar/_pipeline/vgpipe.py check demos/motion-ceiling-lab/mc01-request
```

```bash
python3 demos/motion-ceiling-lab/mc01-request/verify.py
```

`render` 逐帧调用 `__vg.seek(i/30)` 并送进 WebCodecs 的 VP9 编码器，不经过墙钟；`check` 做自检、重复 seek 一致、静态入口、解码对比和完整播放；`verify.py` 做需要操作的部分（观看者的镜头、回看、文字版、键盘、窄屏、减少动态效果、没有 WebGL、上下文丢失）和三个变体。`vgpipe.py frames` 生成关键帧，`strips.py` 生成关键连续段的密集抽帧。

## 实现

| 文件 | 作用 |
|---|---|
| [model.js](model.js) | 语义：某个事件时间下各请求的状态，事件时间与叙事时间的对应，界面在某一刻已经收到了哪张回执；输入校验。不含几何和绘制，页面和生成脚本共用 |
| [scene.js](scene.js) | 四层的布局、请求与回执的路径、镜头、WebGL 一遍画世界、Canvas 2D 一遍画所有文字；自检 |
| [gl.js](gl.js) | 不到 300 行的 WebGL2 即时渲染器：带光照的盒子、平面软边贴片、等宽线与世界长度的虚线，深度测试 |
| [page.js](page.js)、[page.css](page.css) | 镜头按钮、回看提示、HTML 文字版；不往画布里画任何东西 |
| [build.mjs](build.mjs) | 由输入生成 `data.js` 和各变体 |
| `data.js`、`variants/*/` | 生成物，不手改 |

画面是叙事时间的纯函数：同一时刻不论先后、正序倒序，画出来一样。唯一的例外是观看者自己按了镜头按钮，这时镜头从当前位置连续地移过去；导出和检查不走这条路。

## 来源、借用与新增

| 来源 | 用途 | 处理 |
|---|---|---|
| 交接稿的 MC01 brief、合同与 `request_chain`（[快照](../../../vault/snapshots/local/motion-ceiling-handoff-20261004/motion-ceiling-handoff-20261004.md)） | 读者与问题、正常与失败输入、验收项、三个时钟分开的要求 | 照 brief 做；六个事件逐字使用 |
| [成立程度与归属的标记](../../../dsh-praxis/kit/design/foundations/standing.md) | 线型、端点、强调色各回答哪个问题 | 按默认分配；“线型回答走过了吗”是把“生效了吗”用在路径上，写在页面文字版的图例里 |
| [运动判断](../../../dsh-praxis/kit/design/motion/grammar.md)、[叙事与分镜交接](../../../dsh-praxis/kit/publish/video/narrative.md) | 运动与真实状态同步；每段时间解决一个认知任务 | 段落表按后者的最小分镜表组织 |
| 视觉语法工场的 [运行层](../../visual-grammar/_runtime/README.md)与 [流水线](../../visual-grammar/_pipeline/README.md) | 舞台、时间轴、静态分镜、导出与检查 | 原样使用；流水线改了一处源文件哈希的路径算法 |
| 交接稿为 MC01 指的两个外部来源（W12、R08） | 无 | 本会话没有打开，没有借用 |

新增：界面上的文字和两套提示写法（合成设定），四层的空间布局，请求与回执的路径，镜头路径与观看者的镜头，遮挡与出画时的标签规则，全部代码。

## 已知缺口

见 [验收回执](acceptance.md#没有做的)。空间只为“界面、队列、处理、存储”四层搭建，镜头、时间线和字幕是对着这份输入手工排的：事件时间一变，三者都要跟着改，生成脚本只拦得住其中会说错话的情形。最主要的三项缺口：没有任何受众看过，读者能否复述“ack 不等于落盘”没有验证；成片没有被人按实际速度看过，本会话只读了关键帧、密集抽帧和解码拼图；只在一台机器的一个 Chromium 上运行过。

返回 [Motion ceiling lab](../README.md)。
