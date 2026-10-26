# 同一件事，三种存在：事件 · 状态 · 上下文

工单 VG-01。合成 fixture `vg-esc-001` r1，64 秒，1920×1080 @30fps。打开 [index.html](index.html)；静态分镜入口为 `index.html?static=1`；导出视频见 [renders](renders/README.md)。

## 意图

一件合同续签事项在三块玻璃面板之间流动：日志只追加，状态只随已生效事件变化，上下文是某次调用按任务做的选择。镜头在三层之间升降，把“派生”表现为空间上的上升。四个失败语义各占一段：拒绝仍留在日志中；修正使旧上下文过期（`basis.current = false`，决定入口暂停）；重放同一 event_id 不新增事件；未选入上下文不等于从状态中删除。

## 分镜与时间线

| 时刻 | 段落 | 镜头 | 语义 |
|---|---|---|---|
| 0–5 | 三层 | 斜俯总览，标题卡 | 三层关系 |
| 5–18.5 | 追加与生效 | 日志 → 日志+状态 | evt-001 生成 v1；evt-002 为候选（虚线，未生效）；evt-003 人工批准后生成 v2 |
| 18.5–27 | 拒绝被记录 | 日志+状态 | evt-004 候选、evt-005 人工拒绝；被拒卡片划线，但仍留在日志中 |
| 27–35 | 上下文投影 | 状态+上下文 | ctx-A 基于 v2，选入对方与期限；付款与状态的光束在半路停止 |
| 35–43 | 修正与过期 | 日志+状态 → 状态+上下文 | evt-006 生成 v3；ctx-A 变为 `basis.current = false` |
| 43–48 | 重放去重 | 日志正面 | evt-003 的幽灵卡片撞到原卡片，显示“已存在 · 不新增”，log_length 仍为 6 |
| 48–57.3 | 未选入≠删除 | 状态+上下文 → 状态正面 | ctx-B 基于 v3，未选入期限；状态中的期限行被框出 |
| 57.3–64 | 回看 | 总览，三行结语 | — |

## 输入与预期

[fixture.js](fixture.js) 列出 7 条事件（含 1 条重放）、2 次上下文选择，以及 `expected`。[scene.js](scene.js) 中的 `fold()` 由事件算出日志、状态、版本和候选；画面只读取折叠结果。`selfTest()` 逐项对照 expected：log_length 6、重放未追加、最终 v3、最终状态、被拒候选不在状态中、拒绝事件在日志中、ctx-A 最终过期、ctx-B 最终有效、期限虽未被 ctx-B 选入但仍在状态中。

## 实现

Canvas 2D 自写透视相机：先 lookAt，再做透视投影；面板上的内容按局部仿射绘制；面板由远及近排序，镜头关键帧用缓动插值，并叠加随 t 变化的正弦漂移。没有使用 Three.js。共享 [运行层](../_runtime/README.md) 与 [流水线](../_pipeline/README.md)。

## 来源、借用与新增

| 来源 ID / 版本 | 用途 | 处理 |
|---|---|---|
| `VG-PX-CORE-MODEL`（Praxis `vault/distilled/work-system/core-model.md`，HEAD 17d44bd） | Event ≠ State ≠ Context 三层定义 | 改写为画面与字幕；该文档是候选契约，不是 Courtwork runtime |
| Courtwork `app/core/owner.mjs`（HEAD d44e0fc，经 Luna 索引 `provenance-visual-grammar-courtwork-20260928`） | `basis.current = false` 时暂停决定入口；上下文省略正文并设 24,000 字符预算 | 只借用语义；预算数字与事项均为合成 |
| Courtwork `three_layer_boundary` 说明 | basis.current 表示输入适用性，不是接受授权 | 写入字幕 |

新增：fixture、fold 与自检、透视相机与三面板 grammar、四个失败段落、全部代码。来源由 Sonnet 只读召回代理（替代不可用的 Luna）读取索引后交接，Opus 裁决使用范围；本轮没有直接打开 Courtwork 源文件。

## 验证

2026-09-29 本机实测，详见 [check-report.json](renders/check-report.json)。

| 结论 | 结果 |
|---|---|
| 网页可运行 | 通过：Chromium 加载无 console 错误；空格播放 1.2 秒后暂停；`?static=1` 与减少动态效果两种入口各生成 12 张分镜，390px 下无横向溢出；GL：ANGLE (Apple, ANGLE Metal Renderer: Apple M2, Unspecified Version) |
| 自检 | 通过：selfTest 9/9 项 |
| 重复 seek 一致 | 通过：33 个时刻 × 顺序、逆序、乱序 3 遍，帧指纹 0 处不一致 |
| 视频已导出 | 通过：renders/event-state-context.webm，vp09.00.40.08 8 Mbps，1920×1080 @30fps，1921 帧，33.2 MB；无音轨（作品没有声音）；WebCodecs 编码，webm.py 封装，用时 12.8 秒 |
| 实际解码 | 通过：OpenCV 5.0.0 解码 1921/1921 帧；12 个关键帧与新渲染对比，PSNR 38.83–41.67 dB |
| 完整播放 | 通过：Chromium `<video>` 4 倍速播放至 ended，时长 64.033 秒；Opus 读了解码拼图 `renders/contact-sheet.png` |
| 依赖已离线 | 部分：页面与运行层没有外部请求；字体使用系统字体，未随仓库保存；导出依赖本机 Playwright Chromium，未快照 |
| 受众验证 | 未做：没有观看基线，理解与感受未知 |

未检查：受众理解（无受众测试）；其他浏览器与 GPU；缺少 PingFang 字体的机器；真实屏幕阅读器朗读；1080p 以下嵌入时面板小字的可读性（仅读图目检）。

## 失败样例与 review

- 第一版双层镜头距离过近，面板顶部被画面裁掉；光学中心没有避开字幕带，状态面板下半部被字幕遮住。之后把 CY 上移到 468，并把镜头拉远到 2560。
- 事件卡片中 `candidate.proposed` 溢出卡片宽度，evt-001 的四行内容压到底部标记上；已加宽卡片、缩小类型字号，并把内容限制为 4 行。
- 光束淡出时同时缩短，看起来像“收回”，误导为撤销；现已把生长与透明度分开。
- 上下文光束原先汇聚到面板底部的同一点，看不出哪个字段进了哪一行；现在每个选入字段落到透镜中对应的行，未选入字段在半路以 × 终止。
- 字幕换行时句号单独落到第二行；运行层补了避头规则。

Opus 读图 review：拒绝、过期、重放三段在静帧中能独立看懂；总览斜角下面板上的文字只起纹理作用，要读的内容都安排了正面镜头。

## 下一步验证

在另一台机器或另一种 GPU 上复跑 `check`，比较帧指纹；请一位未看过材料的读者只看静音视频，复述四个失败语义。
