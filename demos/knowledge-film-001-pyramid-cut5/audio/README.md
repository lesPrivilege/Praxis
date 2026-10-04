# 声音

| 文件 | 作用 |
|---|---|
| `build_voice.py` | edge-tts 配音（前三版的临时声音）：逐段合成，自带词级时间 |
| `build_voice_aligned.py` | 按段落合成的配音（Seed TTS 或 Gemini）：取得逐字时间并对回文稿，按文稿要求打开停顿，逐段报告匹配率、基频和时间戳覆盖 |
| `seed.py`、`seed_check.py` | Seed TTS 的调用与凭据自检 |
| `gemini.py` | Gemini 的 REST 调用 |
| `audition.py` | 选角：同一段试音稿，逐个声音合成、测量、请能听音频的模型打分 |
| `score.py` | 配乐、音效和总混音，响度按 EBU R128 测量 |
| `mix-report.json`、`voice-report.json` | 响度与配音的测量结果 |
| [audition/](audition/README.md)、[voice/](voice/README.md)、[voice-gemini/](voice-gemini/README.md)、[voice-seed/](voice-seed/README.md) | 试音与配音缓存 |

`narration.wav` 与 `mix.wav` 是生成物，不入库。返回 [项目说明](../README.md)。
