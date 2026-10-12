# 管线

在项目目录下依次运行。第一步联网，把念白文本发到火山引擎的 Seed TTS，需要环境变量 `SEED_TTS_API_KEY`、`SEED_TTS_RESOURCE_ID`、`SEED_TTS_HOST`；其余在本机完成。`check.py` 的转写比对会把念白的声音发到 Gemini，需要 `GEMINI_API_KEY`，加 `--no-listen` 可以跳过。

| 脚本 | 作用 | 产出 |
|---|---|---|
| `voice.py` | 按段落合成念白，把返回的逐字时间对回文稿 | `narration.wav`、`../film/timeline.js`、`../out/timeline.json`、`captions.vtt`、`narration.md`、`voice-report.json` |
| `mix.py` | 程序合成的铺底与混音，按 EBU R128 测响度 | `mix.wav`、`../out/mix-report.json` |
| `frames.py` | 取单帧和联络表，供看图 | 默认写到临时目录 |
| `render.py` | 无头 Chromium 逐帧截图，ffmpeg 编码并合入声音 | `../out/role-baseline.mp4` |
| `check.py` | 成片检查七项 | `../out/check-report.json` |
| `screen_text.py` | 把画面上出现过的文字抽成清单 | `../out/screen-text.md` |
| `doc.py` | 把 txt 编成 Word 和 PDF，只排内容层级；与片子的管线无关，改了 txt 之后单独运行 | `../out/补充说明.docx`、`../out/补充说明.pdf` |
| `seed.py` | Seed TTS 的客户端 | |

脚本改自[金字塔片第五版](../../knowledge-film-001-pyramid-cut5/pipeline/README.md)的同名管线：去掉了 Gemini 配音那条线，路径改成本项目的，检查里加了“念白不超过 500 字”一项。依赖是本机已有的 Python 3（numpy、scipy、Pillow、python-docx、Playwright 及其 Chromium）；ffmpeg 由 `uv` 临时取用 `imageio-ffmpeg`，没有往系统或仓库里安装东西。

段落音频缓存为 `_voice-<段号>-<哈希>.wav`，只有改过的段落会重新合成；音频和成片不入库。

返回 [项目说明](../README.md)。
