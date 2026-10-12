# 本地无声视频管线

复用 [Write Kit 说明片](../../write-kit-film/build/README.md) 的 GSAP + Playwright + ffmpeg 管线；这次改为 1080p、24 fps、H.264，无音轨。只使用已有 Python、Playwright Chromium、numpy、Pillow 和 ffmpeg，不安装或下载依赖。ffmpeg 优先读取 `PRAXIS_FFMPEG`，其次本机 PATH，再查现有 uv cache 的 imageio-ffmpeg 可执行文件。

在项目目录依次运行：

```bash
python3 build/timeline.py
python3 build/screen_text.py
python3 build/render.py --workers 4
python3 build/check.py
```

| 工具 | 作用 | 输出 |
|---|---|---|
| timeline.py | 编译 beats 的场景时钟和章跳 | film/timeline.js、out/timeline.json |
| frames.py | `frames.py 场ID+2 场ID+20 --full` 截图与联络表 | 临时目录，可指定 `--out` |
| screen_text.py | 从实际 DOM 提取内容、常驻标题、导航、来源和溢出 | out/screen-text.json、.md、layout-report.json |
| render.py | 并行按场截图、静帧复用、逐帧编码和拼接 | out/agentscope-enterprise.mp4、render.json |
| check.py | 实际媒体流/时长/无音轨、随机帧 PSNR、空白、读速、字号、DOM溢出 | out/check-report.json |

部分预览：`render.py --from 0 --to 12 --name sample`，再 `check.py out/sample.mp4`；部分成片用 render.json 记录的原片时间比对。可用 `--preset`、`--crf` 控制编码。默认 veryfast、CRF 18。

## 静帧复用契约

每场可带 `events: [{at:0,duration:1.1}, ...]`，相对该场起点，覆盖所有真实运动窗口；窗口内逐帧截图、窗口结束后的第一帧也截图。`duration:0` 表示瞬时突变。窗口外重复最近一张截图编码，场边界与每个 worker 起点必截图。没有 events 字段就安全逐帧截图；`events:[]` 声明整场静态。不得漏报无限 CSS 动画、onFrame 变化或后续提示。窗口之外的画面必须是常量；随机时刻与重新求值的 Film.seek 比对会检验这一承诺。

## 验收含义

画面文字清单来自可见 DOM；导航与来源保留为独立职责，字号均检查。目标每场内容 ≤ 6 字符/秒，实际曝光按 9 字符/秒作启发式；4 秒突发量只报告建议，不把字幕准则当知识阅读页的普遍硬规。静态驻留是明确的阅读时间，不以超过 6 秒静止判失败。布局报告在运动窗口外检查文字是否越出舞台或被自身裁剪。0.5 秒默认取样会带来曝光边界误差；报告不能替代实际速度完整观看和 PM 受众验证。

fixture 可通过 `PRAXIS_FILM_ROOT=/绝对路径` 重定向项目，不污染正片。现有 `engine.js` 的 GSAP 时间线先走终点再归零，保证任意顺序 seek；播放器暂停起步，支持章跳、上一/下一场、空格/K、左右 ±5 秒（Shift ±10）、方括号跳场、Home/End。窄屏显示阅读稿入口。

返回 [项目说明](../README.md)。
