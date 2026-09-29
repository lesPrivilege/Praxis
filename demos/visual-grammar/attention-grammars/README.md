# 注意力的三种语法：排印 · 空间 · 光与声

工单 VG-02、VG-05 与 VG-06 的组合。合成 fixture `vg-attention-001` r1，56 秒，1920×1080 @30fps，另有 22.05 kHz 单声道音轨；导出的 WebM 为 VP9 + Opus，已含音轨。打开 [index.html](index.html)，按“声音”开启音轨；导出与检查见 [renders](renders/README.md)。

## 意图

三条线索在同一时间线上被三种语法同时呈现。账本把状态当作文字，状态词在切换时上下滚动；轨道把状态当作位置，同心环外侧是已处理托盘；光场是着色器，只收到每个事项的位置与状态亮度，外加从音轨中检出的起点和响度，不接触作者事件时刻。底部把作者事件、声音包络和检出起点分三行显示，并连线配对。

失败语义都是可观察的：重放复用回执，产生灰色回声环；IDEMPOTENCY_CONFLICT、INVALID_TRANSITION、VERSION_CONFLICT 让轨道上的点原地抖动，并显示反白标签；运行时信号试图把事项拉向已处理，虚线伸出又收回，只把 freshness 置为 unknown；结尾仍有两条线索未完成，画面停在未完成状态。声音分析的漏检（静默信号、60ms 内的第二声）和误检（创建提示音的第二个音符）在时间线上逐一标出。因为光场只听声音，静默信号在光场里没有任何波纹。

## 分镜与时间线

| 时刻 | 段落 | 动作（request_id → 结果） |
|---|---|---|
| 4–9 | 出现 | req-01/02/03 create → investigating |
| 12–15 | 确认与等待 | req-04 acknowledge（只改 seen）；req-05 set_waiting，due 10-02 |
| 18–24 | 重放与冲突 | req-06 snooze → later；同 id 同内容 → replayed；同 id 换内容 → IDEMPOTENCY_CONFLICT |
| 27 | 信号不授权 | sig-01 record_signal（runtime）→ freshness unknown，状态不变，无声音 |
| 30–33 | 无效转移 | req-08 resolve；req-09 对 resolved 执行 snooze → INVALID_TRANSITION |
| 36–43 | 重开与版本冲突 | req-10 reopen → needs_you；req-11 过期 revision → VERSION_CONFLICT；60ms 后 req-12 → needs_you；req-13 resolve |
| 46–56 | 结束不是完成 | req-14 att-B resume → investigating；之后无事件，att-B 与 att-C 仍未完成 |

## 输入与预期

[fixture.js](fixture.js) 中每个动作都带 expected_revision、request_id、sound 与 expect。`applyAll()` 用最小 JS 重述这些规则：revision 检查、request identity 回执、各状态的转移限制，以及 record_signal 只改 freshness。`selfTest()` 对照：16 个动作的结果、三项最终状态与 revision、信号后 freshness 为 unknown 且状态不变、结尾有 2 条未完成，以及声音分析的漏检名单为 sig-01、req-12。

声音由 [audio.py](audio.py) 生成：第一步把 fixture 合成为 `attention.wav`（不进 git，运行 audio.py 重新生成），用 numpy 确定性合成，所有声音都是自制；第二步只读 WAV 做线性频谱通量起点检测，阈值为最大值的 0.15 倍，最小间隔 0.12 秒，写出 [audio-events.js](audio-events.js)（`origin: audio-derived`）。匹配窗口 ±50ms。

```bash
python3 demos/visual-grammar/attention-grammars/audio.py
```

## 实现

账本与轨道用 Canvas 2D；光场用 WebGL 片元着色器，在离屏画布上以 `preserveDrawingBuffer` 渲染后合成到主画布。着色器输入为位置、状态亮度、needs_you 标记、最近 4 个检出起点的时龄和响度包络；噪点按 `floor(t×30)` 取种子，因此 seek 可复现。网页中开启声音后，以 `<audio>` 时间为主时钟。

## 来源、借用与新增

| 来源 ID / 版本 | 用途 | 处理 |
|---|---|---|
| Courtwork `app/core/attention.py`（HEAD d44e0fc，经 `provenance-visual-grammar-courtwork-20260928`） | STATUSES、ACTIONS、expected_revision → VERSION_CONFLICT、request identity 重放或 IDEMPOTENCY_CONFLICT、resolved 需先 reopen、record_signal 只置 freshness | 按 Luna 索引与召回交接，用 JS 最小重写；Opus 未直接读源码。事项与数据均为合成 |
| Courtwork `three_layer_boundary.layer_1_attention` | next_action 是记录的后续描述，不是定时器，也不是核心义务 | 写入字幕 |
| `RV26-FE03`（Courtwork 工单，blocked-by-dependencies） | normal/failure fixture 的动作序列思路 | 借用序列结构；本作品不代表该工单已实现 |
| `VG-AA-CONTRACT`（Attention Assistant eefc5a8） | 人工决定枚举为 approve/edit/reject/defer/dismiss，没有 unknown | 没有虚构“未知”枚举；结尾的“未完成”由状态表达 |
| `provenance-visual-grammar-external-20260928:web-audio-api-mdn`、`torchaudio-forced-alignment` | 音频驱动与对齐的方向线索 | 没有使用这些库；起点检测为本 demo 自写 |

新增：规则重写与自检、三种 grammar、着色器光场、声音合成、起点检测与匹配、声音时间线、全部代码与音频。

## 验证

2026-09-29 本机实测，详见 [check-report.json](renders/check-report.json)。

| 结论 | 结果 |
|---|---|
| 网页可运行 | 通过：Chromium 加载无 console 错误；空格播放 1.2 秒后暂停；`?static=1` 与减少动态效果两种入口各生成 12 张分镜，390px 下无横向溢出；GL：ANGLE (Apple, ANGLE Metal Renderer: Apple M2, Unspecified Version) |
| 自检 | 通过：selfTest 22/22 项 |
| 重复 seek 一致 | 通过：33 个时刻 × 顺序、逆序、乱序 3 遍，帧指纹 0 处不一致 |
| 视频已导出 | 通过：renders/attention-grammars.webm，vp09.00.40.08 8 Mbps，1920×1080 @30fps，1681 帧，42.4 MB；音轨 Opus 192 kbps，1 声道，来自 attention.wav；WebCodecs 编码，webm.py 封装，用时 12.6 秒 |
| 实际解码 | 通过：OpenCV 5.0.0 解码 1681/1681 帧；12 个关键帧与新渲染对比，PSNR 40.95–43.13 dB |
| 完整播放 | 通过：Chromium `<video>` 4 倍速播放至 ended，时长 56.033 秒，解码音频 320,659 字节；Opus 读了解码拼图 `renders/contact-sheet.png` |
| 音画同步 | 通过：Chromium decodeAudioData 解码封装后的 Opus 流，与源 WAV 互相关，偏移 0.0 ms，相关系数 1.0 |
| 依赖已离线 | 部分：页面与运行层没有外部请求；字体使用系统字体，未随仓库保存；导出依赖本机 Playwright Chromium，未快照 |
| 受众验证 | 未做：没有观看基线，理解与感受未知 |

声音分析实测：17 个检出起点；16 个作者事件中 14 个匹配，最大偏移 6.9ms；漏检 2 个，即 sig-01（按设计静默）与 req-12（与 req-11 相隔 60ms，小于 0.12 秒最小间隔）；误检 3 个，都是 create 双音提示的第二个音符（约 +0.24 秒）。

音画同步只测量了整条音轨相对源 WAV 的偏移（0.0 ms），没有逐事件测量画面切换与声音起点的对应。

未检查：网页开启声音后的实际听感与同步误差（headless 环境没有人收听）；其他 GPU 上的着色器输出；受众理解。

## 失败样例与 review

- 第一版起点检测对幅度谱做对数压缩，把每个衰减尾巴都读成起点，检出 60 个，其中 46 个误检；改用线性幅度加最大值比例阈值后，误检降为 3 个。剩下 3 个没有再调掉，留作“一个事件的双音被读成两个起点”的实例。
- 轨道上 att-A 与 att-C 同时进入 needs_you 时标签重叠；已扩大中心区，并把“需要你”标签移到圆盘下方。
- 环名原先放在右下 45°，与已处理托盘挤在一起；已改到约 20°。

Opus 读图 review：同一时刻三栏的信息量差别很大。账本能读出 revision 与 freshness，轨道只看得出大致阶段，光场几乎只剩“哪里亮、何时响”；这正是本作品要展示的差异，但光场单独看时不能作为状态说明。

## 下一步验证

1. 从导出视频中逐事件测量音画偏移：解码 Opus 流做起点检测，与同一时刻画面状态的变化帧对照。
2. 用 Whisper 或 torchaudio 做一段含人声的对齐实验，把 `model-inferred` 事件单独成轨。
3. 做受众测试：只给光场与声音，询问读者能否说出哪条线索需要处理；预期答不出，这一点也需要实测。
