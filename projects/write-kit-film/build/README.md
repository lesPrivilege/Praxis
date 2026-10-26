# 管线

在项目目录下依次运行，全部在本机完成，不联网，不需要任何密钥。

| 脚本 | 作用 | 产出 |
|---|---|---|
| `timeline.py` | 把 `../script/beats.json` 编成时间线 | `../film/timeline.js`、`../out/timeline.json` |
| `frames.py` | 取单帧和联络表，供看图。`frames.py loss+6 floor+20` 即“某场开始后的秒数” | 默认写到临时目录 |
| `screen_text.py` | 把画面上出现过的文字连同首次出现的时间抽成清单 | `../out/screen-text.md`、`screen-text.json` |
| `render.py` | 无头 Chromium 逐帧截图，ffmpeg 编码，不含声音 | `../out/write-kit.mp4` |
| `check.py` | 成片检查六项，其中读速和字号读 `screen-text.json` | `../out/check-report.json` |

```bash
python3 build/timeline.py
```

```bash
python3 build/screen_text.py
```

```bash
python3 build/render.py
```

```bash
python3 build/check.py
```

脚本改自[薪酬基线说明片](../../role-baseline-film/build/README.md)的同名脚本：去掉配音与混音两条线，念白字数、转写比对和响度三项检查换成读速和字号两项，成片检查不再要求音频流。依赖是本机已有的 Python 3（numpy、Pillow、Playwright 及其 Chromium）；ffmpeg 由 `uv` 临时取用 `imageio-ffmpeg`，没有往系统或仓库里安装东西。

返回 [项目说明](../README.md)。
