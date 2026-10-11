# 本地无声视频管线

复用既有 Write Kit 说明片的 GSAP、Playwright 与 ffmpeg 管线，输出 1080p、24 fps、H.264，无音轨。只用现有 Python、Chromium、numpy、Pillow；ffmpeg 依次读取 `PRAXIS_FFMPEG`、PATH 和现有 uv cache，不安装或下载依赖。

在项目目录运行：

```bash
python3 build/timeline.py
python3 build/screen_text.py
python3 build/render.py --workers 4
python3 build/check.py
```

| 工具 | 作用 | 产出 |
|---|---|---|
| timeline.py | 编译 beats 场景时钟与章跳 | film/timeline.js、out/timeline.json |
| frames.py | 场ID+2 形式取单帧与联络表 | 临时目录，可指定 --out |
| screen_text.py | 从实际 DOM 提取文字、字号、职责、曝光和溢出 | screen-text.json/.md、layout-report.json |
| render.py | 并行按场截图、静帧复用、编码拼接 | agentscope-enterprise.mp4、render.json |
| check.py | 媒体流/时长/无音轨、随机 PSNR、空白、读速、字号、布局 | check-report.json |

局部试片：`render.py --from 0 --to 12 --name sample`，再 `check.py out/sample.mp4`。局部检查读取相应 render.json 还原原片时钟。默认 veryfast、CRF 18；可修改 --preset / --crf。

## 静帧契约

每场 events: [{at:0,duration:1.1}, ...] 声明相对场起点的全部运动窗口，含 stagger。窗口内逐帧截图，结束后的第一帧也截图，窗口外复用最近截图。duration:0 表示瞬时变化。缺少 events 则逐帧截图；events:[] 声明整场常量。每场/worker 起点必截图。窗口外不得有无限 CSS 动画或 onFrame 变化；随机 fresh Film.seek 与视频 PSNR 会检验一致性。

## 检查解释

内容目标每场 ≤6 字符/秒，曝光按9字符/秒作启发式。标题计入内容；导航/来源单独保留，字号全部检查。4秒突发量仅建议，不把字幕规范当静态知识页硬规。静读驻留合理，不因超过6秒静止失败。布局检查运动窗口外的文字越界和自身/祖先裁剪。默认0.5秒采样有曝光边界误差；不能替代实际速度完整观看和 PM 受众验证。

PRAXIS_FILM_ROOT 可重定向至临时 fixture。播放器暂停起步，支持章节、上一下一场、空格/K、左右±5秒（Shift±10）、方括号、Home/End，窄屏有阅读稿入口。

恢复自本次已验证的7秒 fixture，临时重建后已通过 Python 编译、实际7秒fixture（168帧、22截图、约3秒编码）的媒体/PSNR/空白/DOM读速/字号/溢出检查，以及任意逆序seek、终场、controls、键盘、小屏和联络表检查。正式内容检查由 main 执行。返回 [项目说明](../README.md)。

可选：渲染后运行 `python3 script/chapter_video.py`，无重编码加入六章标记；再运行成片检查。

## 第二版完整重建

在 Praxis 工作树根目录运行。`PRAXIS_FILM_ROOT` 指向第二版，第一版文件保留。

```bash
python3 demos/agentscope-enterprise-film/script/compile_cut2.py --retain-timing
export PRAXIS_FILM_ROOT="$PWD/demos/agentscope-enterprise-film/cut2"
python3 demos/agentscope-enterprise-film/build/screen_text.py
python3 demos/agentscope-enterprise-film/quality/check_cut2_states.py
python3 demos/agentscope-enterprise-film/build/render.py --workers 4 --name agentscope-enterprise-cut2
python3 demos/agentscope-enterprise-film/script/chapter_video.py "$PRAXIS_FILM_ROOT/out/agentscope-enterprise-cut2.mp4"
python3 demos/agentscope-enterprise-film/build/check.py "$PRAXIS_FILM_ROOT/out/agentscope-enterprise-cut2.mp4" --samples 50
```

第二版文字采集按可见文本节点的真实父元素测量字号，保留语义身份与临时移动副本标记。阅读统计合并同对象同文字的重复显示，但新值仍计入，曝光区间取并集；没有语义键的第一版继续沿用原统计口径。边界与实际结果见 [状态检查](../quality/cut2-state-acceptance.md)。
