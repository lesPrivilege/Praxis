# 管线

在系列目录下运行。只有 `assemble.py`（Seed TTS）、`check.py` 的转写比对（Gemini）和 `fetch_assets.py`（图片下载）联网；凭据只从环境变量 `SEED_TTS_API_KEY`、`SEED_TTS_RESOURCE_ID`、`SEED_TTS_HOST`、`GEMINI_API_KEY` 读取，不写进任何文件。ffmpeg 由 `uv` 临时取用 `imageio-ffmpeg`；浏览器优先用 Playwright 自带的 Chromium，没有安装时用本机 Google Chrome。本项目不安装任何东西。

| 脚本 | 作用 | 产出 |
|---|---|---|
| `assemble.py [编排…]` | 按段落合成并缓存念白，把逐字时间对回文稿，排出每个编排的时间线 | `assembly/timelines/<编排>.{js,json,vtt}`、`out/<编排>.narration.wav`、`episodes/*/narration.md`、`verification/voice-report.json` |
| `mix.py <编排>` | 程序合成的铺底与混音，整段编排一条铺底，EBU R128 测响度 | `out/<编排>.mix.wav`、`verification/mix-<编排>.json` |
| `render.py <编排>` | 无头浏览器逐帧截图，ffmpeg 编码，合入声音、软字幕与章节；整集渲染后记下画面所依赖输入的指纹。合集只渲染片头、各单元卡片、片尾与间隙，正文直接从各集成片截取，指纹对不上就拒绝 | `out/<编排>.mp4`、`out/<编排>.inputs.json` |
| `screen_text.py <编排>` | 画面上出现过的全部文字，带主张 ID | `verification/screen-text-<编排>.{md,json}` |
| `check.py <编排>` | 成片检查：流与时长、重渲比对、静止（超过 10 秒不变算失败，6–10 秒列出待看）与空白（1 秒以上算失败）、字号（取实际文字节点）、登记、转写（年份数字统一后比对）、响度；合集另查同源与接缝 | `verification/check-<编排>.json` |
| `cover.py [单元…]` | 4:3 与 3:4 原生封面，SVG 源件加 PNG 预览 | `episodes/*/covers/`、`assembly/covers/` |
| `frames.py <编排> 时刻…` | 取帧拼成联络表，供看图 | 临时目录 |
| `ledger.py` | 登记的检查、修改、批量更新与导出 | `research/*.jsonl`、`assembly/ledgers.js` |
| `fetch_assets.py` | 下载登记里标了 `use` 的图片并校验哈希 | `assets/files/` |
| `seed.py`、`common.py` | Seed TTS 客户端；路径、页面与 ffmpeg 的公共部分 | |

一集的完整顺序：`assemble.py epNN` → `mix.py epNN` → `render.py epNN` → `screen_text.py epNN` → `check.py epNN`。合集在各集都渲染之后做同样五步，`assemble.py` 会复用各集已经合成的段落，不重复合成。改了念白只会重新合成改动的段落；只改 `gap` 不重新合成。

用本机 Google Chrome 时，`common.py` 自己启动 Chrome、经 CDP 连接，Chrome 的输出接到 /dev/null：Chrome 启动时会拉起 Google 的更新程序，更新程序继承 Chrome 的输出，用 Playwright 自己启动时，Chrome 先退出而更新程序还占着输出，Playwright 会一直等。`render.py` 另有一道保险：工作进程在一个分段里 3 分钟画不出新帧，就把卡在哪里打印到日志并结束，没画完的分段换一组进程重画，最多三轮；进程被结束时带走自己启动的 Chrome。合集从各集成片截出的正文按帧重新编排时间戳：截下来的第一帧带着原片约一帧的时间偏移，拼接时会变成一帧空档，越往后的单元画面越落后于声音。字幕的每一句从这一句声音实际开始处起：合成服务给英文人名的逐字时间偏晚、偏挤时，字幕不跟着晚。

返回 [系列说明](../README.md)。
