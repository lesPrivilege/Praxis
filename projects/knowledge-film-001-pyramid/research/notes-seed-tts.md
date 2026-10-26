# Seed TTS (豆包语音合成大模型 2.0) integration brief

Date of check: 2026-10-04. Target use: ~2,500 Chinese characters, ~20 paragraphs of 100-200 characters, one Mandarin voice, per-character or per-word timestamps, plain HTTP from Python (urllib), single-key auth.

Evidence rules used here: every API fact below comes from an official page I opened (www.volcengine.com / docs.volcengine.com, docs.byteplus.com). Community material is marked **[community]** and is a pointer only. Anything not on a page I opened is **not confirmed**. Quotes are short excerpts of the official wording.

How the pages were read: the Volcengine doc site renders client-side, so I read the same document bodies through a text fetcher and through the doc site's own public JSON endpoint (`www.volcengine.com/api/doc/getDocDetail`). BytePlus pages ship their markdown inside the served HTML. No copies were kept.

Official pages used (with their "last updated" stamps as shown):

| Short name | URL | Updated |
|---|---|---|
| VC-uni (current) 单向流式语音合成(HTTP) | https://docs.volcengine.com/docs/DoubaoVoice/unidirectional-streaming-text-to-speech-http | 2026-09-29 |
| VC-V3 (history section) HTTP Chunked/SSE单向流式-V3 | https://docs.volcengine.com/docs/6561/1598757?lang=zh | 2026-05-25 |
| VC-submit 任务提交 (async) | https://docs.volcengine.com/docs/DoubaoVoice/Tasksubmission | 2026-09-28 |
| VC-query 结果查询 (async) | https://docs.volcengine.com/docs/DoubaoVoice/Resultquery | 2026-09-28 |
| VC-voices 音色列表 | https://docs.volcengine.com/docs/6561/1257544?lang=zh | 2026-08-20 |
| VC-ssml SSML标记语言 | https://www.volcengine.com/docs/6561/1330194 | 2026-09-10 |
| VC-instr 语音指令与标签 | https://docs.volcengine.com/docs/6561/1871062?lang=zh | 2026-08-20 |
| VC-errors 错误码查询 | https://docs.volcengine.com/docs/6561/2534853?lang=zh | 2026-09-10 |
| VC-billing 计费说明 | https://www.volcengine.com/docs/6561/1359370 | 2026-09-29 |
| VC-trial 计费概述 (trial quota) | https://docs.volcengine.com/docs/DoubaoVoice/BillingOverview-15?lang=zh | 2026-08-20 |
| BP-uni TTS - Unidirectional Streaming (HTTP) | https://docs.byteplus.com/en/docs/byteplusvoice/unidirectional_tts_http | 2026-07-20 |
| BP-voices Voice List | https://docs.byteplus.com/en/docs/byteplusvoice/tts-voice-list | 2026-09-10 |
| BP-tts2 TTS 2.0 | https://docs.byteplus.com/en/docs/byteplusvoice/texttospeechv2 | 2026-07-29 |
| BP-console Speech Console Guide | https://docs.byteplus.com/en/docs/byteplusvoice/Speech_Console_Guide | 2026-06-25 |

Two Volcengine pages describe the same endpoint and they disagree in places. VC-uni (2026-09-29) is the newer one and sits in the "API参考" tree; VC-V3 sits under "历史文档" (history). Where they differ I say so and prefer VC-uni.

---

## 1. Endpoint, method, headers

**Volcengine**
- Chunked: `POST https://openspeech.bytedance.com/api/v3/tts/unidirectional` (VC-uni).
- SSE is a separate path: `https://openspeech.bytedance.com/api/v3/tts/unidirectional/sse`. VC-V3: "Request Headers ... 同2.1节中的HTTP Chunked格式接口的Request Headers中内容一样" (same headers and same body as chunked). VC-uni does not cover SSE.
- Also listed in VC-V3: `wss://.../api/v3/tts/unidirectional/stream` and `wss://.../api/v3/tts/bidirection` (not needed).

**BytePlus**
- `POST https://voice.ap-southeast-1.bytepluses.com/api/v3/tts/unidirectional` (BP-uni: "The request path is: ...").
- SSE variant on BytePlus: not confirmed (BP-uni lists none).

**Headers with an API key (Volcengine, VC-uni)**

| Header | Status | Notes |
|---|---|---|
| `X-Api-Key` | required | API Key from console "API Key管理". |
| `X-Api-Resource-Id` | required | `seed-tts-2.0` or `seed-icl-2.0` (VC-uni lists only these two). |
| `X-Api-Request-Id` | **required in VC-uni**, optional in VC-V3 | UUID string. Send it. |
| `X-Control-Require-Usage-Tokens-Return` | optional | `*` returns billed character count. VC-V3 allows `text_words`; the closing object then carries `"usage":{"text_words":N}`. |
| `Content-Type: application/json` | needed in practice | Shown in BP-uni sample headers; VC pages do not list it. Send it. |

- `X-Api-App-Id` / `X-Api-Access-Key` are **not needed** with an API key. VC-V3: "旧版控制台...新版控制台只需要X-Api-Key即可". They belong to the legacy console only.
- `X-Api-App-Key` is not mentioned on any Volcengine page I read. It **is** required on BytePlus (section 8).

**`X-Api-Resource-Id` values that exist (VC-V3, VC-voices, VC-submit)**
- `seed-tts-2.0`: "仅支持调用'豆包语音合成模型2.0'的音色" (voices ending `_uranus_bigtts`, plus `saturn_`/`ICL_uranus_` families listed in the 2.0 table). Billing item 语音合成2.0字符版.
- `seed-tts-1.0` / `seed-tts-1.0-concurr`: "仅支持调用'豆包语音合成模型1.0'的音色" (voices ending `_moon_bigtts`, `_mars_bigtts`, `_wvae_bigtts`). VC-V3 only; the current VC-uni page no longer lists them.
- `volc.service_type.10029`: appears only in the legacy/async V1-era pages (large-model TTS 1.0 character edition). Not in VC-uni or VC-V3. Treat as obsolete for this task.
- `seed-icl-1.0`, `seed-icl-1.0-concurr`, `seed-icl-2.0`: cloned voices, not needed.
- Rule that matters: "豆包语音合成模型2.0"的资源信息ID仅适用于"豆包语音合成模型2.0"的音色 (resource id and voice generation must match; 1.0 and 2.0 ids are not interchangeable).

---

## 2. Request body

Field names and nesting (VC-uni; extras from VC-V3 flagged):

```
{
  "user": {"uid": "..."},                    // VC-V3 lists user.uid; VC-uni's body list omits "user". Required? not confirmed.
  "req_params": {
    "text": "...",                           // required
    "speaker": "zh_male_m191_uranus_bigtts", // required
    "model": "...",                          // ONLY for cloned (ICL 2.0) voices. Omit.
    "ssml": "<speak>...</speak>",            // optional, see section 7
    "audio_params": {                        // required object
      "format": "pcm",                       // mp3 | pcm | ogg_opus | wav ; default mp3
      "sample_rate": 24000,                  // 8000/16000/22050/24000/32000/44100/48000 ; ogg_opus only 48000
      "bit_rate": 64000,                     // mp3/ogg_opus only
      "speech_rate": 0,                      // int, -50..100
      "loudness_rate": 0,                    // int, -50..100
      "enable_subtitle": true,               // TTS 2.0 timestamps (see section 3)
      "emotion": "...", "emotion_scale": 4   // VC-V3 only; 1.0-style multi-emotion voices; not for this task
    },
    "additions": "{\"...\":...}"             // a JSON-encoded STRING, not an object
  }
}
```

- `additions` is a string: VC-uni "配置自定义附加参数，须传入JSON序列化后的字符串"; VC-V3 types it `jsonstring`. BP-uni sample sends it as an escaped string too.
- `namespace` appears in the VC-V3 table (default `BidirectionalTTS`); it is a WebSocket-era field and not in VC-uni. Do not send.
- 2.0 controls inside `additions` (VC-uni): `context_texts` (list; "仅speaker...为豆包语音合成模型2.0音色时，支持使用语音指令"; "该字段文字不参与计费"; VC-V3: "当前字符串列表只第一个值有效"), `section_id` (string; "可用于保持跨包语义"), `post_process.pitch` (-12..12), `silence_duration` (0..30000 ms, tail of the whole text), `max_length_to_filter_parenthesis` (default 0 = no filtering in VC-uni; VC-V3 says default 100), `disable_markdown_filter`, `disable_emoji_filter`, `explicit_language`, `explicit_dialect`, `enable_auto_language_recognition`, `pronunciation_dict`, `aigc_watermark`, `aigc_metadata`.
- The `model` field: VC-uni "仅当speaker参数为复刻音色时需指定此参数". Not for stock voices.
- Docs example (VC-V3, single-voice request; note the sample is a 1.0 voice and is malformed JSON as printed, a stray brace). Reconstructed minimal body for 2.0, assembled from the documented field names:

```json
{
  "user": {"uid": "12345"},
  "req_params": {
    "text": "明朝开国皇帝朱元璋也称这本书为,万物之根",
    "speaker": "zh_female_shuangkuaisisi_moon_bigtts",
    "audio_params": {"format": "mp3", "sample_rate": 24000}
  }
}
```
For 2.0, change `speaker` to a `_uranus_bigtts` id and send `X-Api-Resource-Id: seed-tts-2.0`. A fully official 2.0 minimal example is not shown on VC-uni (it only has an `additions` snippet); the only official 2.0 body fragment is the pronunciation_dict one below, so the 2.0 minimal body above is **assembled, not copied**.

Official `additions` example from VC-uni (2.0 voice, pronunciation + transcription rules):
```
"additions": "{\"pronunciation_dict\":{\"tone\":[\"北京/(bei3)(jing1)\",\"omg/oh my god\"]}}"
```

---

## 3. Response framing, end codes, errors, timestamps

**Framing (Chunked).** Official wording (VC-V3 best practice): "客户端读取服务端流式返回的json数据，从中取出对应的音频数据". Audio: "音频数据返回的是base64格式". Response header `Transfer-Encoding: chunked` plus `X-Tt-Logid` (log it).
- Whether objects are newline-delimited or simply concatenated: **not confirmed**. The docs do not say. Use a tolerant parser (`json.JSONDecoder().raw_decode` over a buffer), not `splitlines()`.
- **[community]** A GitHub issue for a gateway project (QuantumNous/new-api #4709/#4710) describes the chunked endpoint as "binary frames". That contradicts the official JSON description and I could not verify it. Dump the first raw bytes in your first test.

**Object shapes (VC-V3 2.3):**
```
{"code": 0, "message": "", "data": "<base64 audio>"}                       // audio
{"code": 0, "message": "", "data": null, "sentence": {...}}               // timing/text
{"code": 20000000, "message": "ok", "data": null, "usage": {"text_words": 10}}   // end; usage only if you asked
```
- Success/end: `code` 20000000, message `ok`. VC-uni also says "code ... 返回0则表示语音合成成功" for the per-chunk objects and `message` `OK`. So: 0 on each content object, 20000000 on the final object. Keep reading until 20000000.
- Errors (VC-V3 §4, VC-errors): HTTP non-200 or a body with a non-zero code. Rows seen:

| code | message | meaning |
|---|---|---|
| 40402003 | TTSExceededTextLimit:exceed max limit | text too long |
| 45000000 | speaker permission denied: get resource id: access denied | wrong/unauthorised speaker for that resource id |
| 45000000 | quota exceeded for types: concurrency | over concurrency |
| 45000001 | [Invalid argument] speaker not found / InvalidModel / InvalidDialect | bad parameter |
| 45002000 / 45002001 | TTS invalid speaker / No readable text! | empty speaker / nothing readable |
| 55000000 | server error; also "Request timeout: synthesis processing timeout" | retry; shorten text |
| 55000000 | resource ID is mismatched with speaker related resource | resource id vs voice mismatch |

**Timestamps on TTS 2.0 (this is the important part).**
- The switch is **`req_params.audio_params.enable_subtitle`**, not `enable_timestamp`. VC-V3: `enable_timestamp (仅TTS1.0支持)`; `enable_subtitle` ... "该参数只在TTS2.0、ICL2.0生效". VC-uni lists only `enable_subtitle`: "启用字幕服务，开启后将返回字级别的时间戳 ... 仅支持中文和英文语种". BP-uni says the same split.
- Each timing object carries `sentence`, with `text`, `words[]` and `phonemes[]`. Fields per word: `word`, `startTime`, `endTime` (seconds, float), `confidence` (0-1). VC-uni: "startTime float 开始时间（秒）".
- Quoted example (VC-V3, a 1.0 voice, sentence-end style):

```json
{"code":0,"message":"","data":null,
 "sentence":{"text":"其他人。","words":[
   {"confidence":0.8531248,"endTime":0.315,"startTime":0.205,"word":"其"},
   {"confidence":0.9710379,"endTime":0.515,"startTime":0.315,"word":"他"},
   {"confidence":0.9189944,"endTime":0.815,"startTime":0.515,"word":"人。"}]}}
```
- Granularity: Chinese words are single characters, with trailing punctuation fused to the preceding character ("日，", "人。", "瑕。"). Digits and Latin text are not per character in 2.0: VC-V3 2.0 example gives `"word": "2019"`, `"1"`, `"8"` as single tokens (low confidence 0.11 on "2019"). So "per character" holds for Chinese prose, not for numerals.
- 1.0 vs 2.0 difference (VC-V3 §2.4):
  - TTS 1.0 (`enable_timestamp`): words follow the normalised reading ("二零一九年一月八日"); one sentence's timing arrives before the next sentence's audio.
  - TTS 2.0 (`enable_subtitle`): words follow the **original text** ("2019 年 1 月 8 日"). "在一句音频合成之后，不会立即返回该句的字幕 ... 可能一个子句的字幕返回的时候，已经返回下一句的音频帧". So the timing object for sentence N can arrive after audio for sentence N+1. Do not tie ordering to audio arrival; collect everything until 20000000.
- Time base: "第二句开始时间，是相对整个session的位置". Times are relative to the start of that request's audio (session), not to each sentence. For 20 requests you must add your own cumulative offset.
- Cases that return **no subtitles** on 2.0 (VC-V3 §2.4): SSML input ("req_params.ssml不为空，无字幕返回，接口不报错"), LaTeX (`enable_latex_tn`), and cache hits (`cache_config` ... "通过缓存返回的数据不会附带时间戳"). Other languages and dialects: "不支持".
- Does `context_texts`, `pronunciation_dict`, `explicit_dialect` or `speech_rate` change the timestamps? **Not confirmed.** The docs do not say. `speech_rate` is applied by the synthesiser, so times should follow the audio; verify.

**SSE variant (VC-V3 §3.4).** `Content-Type: text/event-stream`, frames like:
```
event: 352
data: {"code":0,"message":"","data":"<audio>"}

event: 351
data: {"code":0,"message":"","data":null,"sentence":{"phonemes":[],"text":"音频文件能够正常播放。","words":[]}}

event: 152
data: {"code":20000000,"message":"OK","data":null,"usage":{"text_words":11}}
```
Event ids: 351 TTSSentenceEnd, 352 TTSResponse (audio), 151 SessionCancel, 152 SessionFinish, 153 SessionFailed. Note the official 351 example shows `"words":[]` (empty), so word lists are not guaranteed to be populated. VC-V3 §3.5: "不支持" reconnect and resume. SSE gives no advantage here over chunked.

---

## 4. Limits, quota, price

| Item | Value | Source |
|---|---|---|
| Max characters per request (V3 unidirectional) | **not confirmed.** Error `40402003 TTSExceededTextLimit` exists but no number is given. For reference only, the V1 HTTP page says "长度限制 1024 字节（UTF-8 编码）建议小于300字符" (https://docs.volcengine.com/docs/6561/1257584?lang=zh), V1 not V3. | VC-V3, V1 page |
| SSML | "使用ssml标签时合成字符不要超过150（包含标签本身）". | VC-ssml |
| Your paragraphs | 100-200 chars each, under every number seen. One paragraph per request is safe. | |
| Default concurrency, 2.0 official edition | "正式版默认支持10并发，超出部分按需增购"; "默认并发/QPS数量以控制台为准" (console is authoritative). Extra: 100 元/并发/月. | VC-billing |
| QPS as a separate number for sync TTS | **not confirmed.** Docs speak in concurrency ("quota exceeded for types: concurrency"). | |
| Concurrency definition | "同一时刻请求服务的数量" (requests being processed at once). Serial calls count as 1. | VC-billing |
| Free trial, 豆包语音合成模型2.0 | 20000 字符, valid 半年 (half a year). "试用额度的用量...以控制台领取页面显示为准". Trial: "语音合成试用阶段可调用全部音色进行测试". | VC-trial |
| Pay-as-you-go price, 豆包语音合成模型2.0 | **3 元/万字符**. Prepaid packs (1 year): 10万字 28元 (2.8), 2000万字 5400元 (2.7). | VC-billing |
| Counting | "1个汉字算1个字符"; punctuation, spaces, newlines also 1 each; SSML tags are billed as characters; `context_texts` is "不参与计费". | VC-billing, VC-uni |
| Cost of this film | ~2,500 chars ≈ 0.75 元 for one full pass; the 20,000-char trial covers about 8 passes. | derived |

**[community]** Vendor-community articles quote inconsistent prices (1.3 元/千字, 5 元/万字符, 6.5 元/万字符). They conflict with the official 3 元/万字符 above; ignore them.

BytePlus pricing, quota and concurrency: **not confirmed** (I did not open a BytePlus pricing page). BP-console says to add a credit card before activating, and that a trial can be activated in the console.

---

## 5. Async long text: `/api/v3/tts/submit` and `/api/v3/tts/query`

Volcengine only. I found no BytePlus equivalent in the BytePlus doc tree (its "Text-to-Speech" API pages are bidirectional WebSocket and unidirectional HTTP).

**Submit** (VC-submit): `POST https://openspeech.bytedance.com/api/v3/tts/submit`
- Headers: `X-Api-Key`, `X-Api-Resource-Id` (`seed-tts-2.0` | `seed-icl-2.0`), `X-Api-Request-Id`.
- Body: same shape as sync (`req_params.text/speaker/audio_params/additions`), plus `user.unique_id` (20-64 chars; "响应中的task_id取该值"). `audio_params` here lists `enable_timestamp` ("开启后将返回字级时间戳") and `format` mp3/pcm/ogg_opus. So on the async path the switch is `enable_timestamp`, while on the sync 2.0 path it is `enable_subtitle`. Treat as two different parameters; I could not confirm why.
- Limit: "最大单次支持 10 万字符"; ">10%" control characters (non-tab/newline) rejects the task.
- Response: `code` 20000000; `data.task_id`, `data.task_status`, `data.req_text_length`, `message` ("OK").

**Query** (VC-query): `POST https://openspeech.bytedance.com/api/v3/tts/query`, same headers, body `{"task_id": "..."}`.
- `data.task_status`: 1 Running, 2 Success, 3 Failure. `data.audio_url` valid 1 hour, audio kept 7 days ("合成音频在服务端可保存 7 天").
- Timing: `data.sentences[]` with `text`, `startTime`, `endTime` (seconds, float64) and `words[]` of `word`, `startTime`, `endTime`, `confidence`. Also `req_text_length`, `synthesize_text_length`, `url_expire_time`. Search-excerpt sample showed per-character Chinese words ("提", "交", ... "音。"), sentence text including a trailing "\n".
- Shares concurrency with other TTS calls ("submit接口和query接口，与其他TTS合成接口...共享并发"; stated on the older async page, https://docs.volcengine.com/docs/6561/1829010?lang=zh).
- Typical latency for the V3 async path: **not confirmed**. (The older V1 async product said "通常返回时间会在数十分钟，最长返回时延3小时以内" at https://docs.volcengine.com/docs/6561/1096680?lang=zh; V3 may differ.)
- SSML conflict: submit says SSML is supported for 2.0 Chinese voices ("目前仅中英文音色支持ssml"), while the older async page says "豆包语音合成模型2.0的音色暂不支持SSML". Not reconciled.
- Also in VC-submit: `additions.pronunciation_dict.tone`, `silence_duration`, `post_process.pitch`, same as sync.

**When to prefer async for this film:** one request carries the whole 2,500-character script (20 paragraphs joined by newlines), so you get **one continuous timeline** and consistent prosody, with no per-request offset stitching. Cost: polling, 1-hour URL, unknown latency, and one failure loses all. For ~2,500 chars, sync per-paragraph is also viable and easier to audition; async is attractive for the final render. Test both and compare timelines.

---

## 6. Voice shortlist (copied from the official list)

Source list: VC-voices, section `"豆包语音合成模型2.0" 音色列表`, https://docs.volcengine.com/docs/6561/1257544?lang=zh . Every id below is copied from the table; none invented. All require `X-Api-Resource-Id: seed-tts-2.0` ("seed-tts-2.0仅支持调用'豆包语音合成模型2.0'的音色").

Caveat first: the Volcengine list gives **only a scene tag (场景), language/dialect and capability ("指令遵循")**, no sonic description. The "doc's own description" below therefore means: the Volcengine scene tag, plus the English description from BytePlus's list (BP-voices) where the same id exists there. Suitability for "calm, mature documentary narration" is my inference from names, scenes and those descriptions, **not a statement in the docs**. Audition them.

| # | Gender | 中文名 | `speaker` (exact) | Volcengine 场景 | BytePlus name and description (BP-voices) |
|---|---|---|---|---|---|
| 1 | M | 云舟 2.0 | `zh_male_m191_uranus_bigtts` | 通用场景 | Kian: "A steady, clear, and versatile mid-range male voice" |
| 2 | M | 大壹 2.0 | `zh_male_dayi_uranus_bigtts` | 视频配音 | Magnus: "A mature, resonant, and slightly dramatic male voice" |
| 3 | M | 儒雅逸辰 2.0 | `zh_male_ruyayichen_uranus_bigtts` | 视频配音 | Quentin: "A refined, gentle, and elegant young male voice" |
| 4 | M | 渊博小叔 2.0 | `zh_male_yuanboxiaoshu_uranus_bigtts` | 通用场景 | not on BytePlus list; no description anywhere (name = "learned uncle") |
| 5 | F | 知性女声 2.0 | `zh_female_zhixingnv_uranus_bigtts` | 通用场景 | not on BytePlus list |
| 6 | F | 流畅女声 2.0 | `zh_female_liuchangnv_uranus_bigtts` | 视频配音 | Pearl: "A clear, steady, and highly articulate female voice" |

Also in the list and worth one audition if the six disappoint: 解说小明 2.0 `zh_male_jieshuoxiaoming_uranus_bigtts` (通用), 磁性解说男声 2.0 `zh_male_cixingjieshuonan_uranus_bigtts` (通用), 深夜播客 2.0 `zh_male_shenyeboke_uranus_bigtts` (通用), 高冷沉稳 2.0 `zh_male_gaolengchenwen_uranus_bigtts` (通用), 悬疑解说 2.0 `zh_male_xuanyijieshuo_uranus_bigtts` (有声阅读), 爽快思思 2.0 `zh_female_shuangkuaisisi_uranus_bigtts` (BytePlus Gigi: "steady, composed young female voice with a slightly low, mellow tone"), 小何 2.0 `zh_female_xiaohe_uranus_bigtts` (BytePlus Mindy: "gentle, soft-spoken, and slightly mature").

Notes:
- Not on this list as 2.0 plain voices: anything "有声阅读"-tagged and mature in 2.0 is sparse (霸气青叔 2.0 `zh_male_baqiqingshu_uranus_bigtts`, 悬疑解说 2.0, 儿童绘本 2.0). 2.0 is not thin overall; no need to fall back to 1.0.
- `ICL_uranus_*` voices (e.g. 儒雅公子 `ICL_uranus_zh_male_ruyagongzi_tob`, 有声阅读) and `saturn_*` voices are in the 2.0 table, but they are clone-family ids. Which resource id they need, and whether they work with `seed-tts-2.0` for plain synthesis, is **not confirmed**; skip them.
- `_saturn_bigtts` voices do not support SSML (VC-ssml). `_uranus_bigtts` is the plain stock family.
- 1.0 equivalents exist (the 1.0 table has a column "对应2.0音色", e.g. 渊博小叔 `zh_male_yuanboxiaoshu_moon_bigtts`, 解说小明 `zh_male_jieshuoxiaoming_moon_bigtts`) and would need `seed-tts-1.0` and would give `enable_timestamp` word times on the **normalised reading** (numbers spelled in characters). That path is a trade-off, not a recommendation (see Pitfalls).

---

## 7. Controls that matter for narration

**Speech rate.** `audio_params.speech_rate`, int, range -50 to 100; "100代表2.0倍速，-50代表0.5倍速"; default 0. A calm documentary pace would start around -10 to -20; the effective speed per unit step is **not confirmed**. Test.

**Volume.** `audio_params.loudness_rate`, same range, default 0.

**Pauses.**
- SSML `<break time="..."/>`: "[number]s ... [1, 10]的整数" or "[number]ms ... [1, 10000]的整数"; only `time` is supported ("strength 属性不支持"); needs a closing tag form `<break/>` (VC-ssml). The whole text must sit in one `<speak>` root, and use `req_params.ssml`; "disable_markdown_filter" must be false. Keep it under 150 characters including tags. VC-submit and VC-uni now say 2.0 Chinese voices support SSML; the older async page says they do not. **Not reconciled; test.**
- **Timestamps vs SSML: no subtitles come back on 2.0 when `ssml` is used** (VC-V3 §2.4). That kills your main requirement. So prefer plain text, punctuation (commas, 。, ……, line breaks) and paragraph-level requests plus your own silent gaps in post. The only built-in tail pause is `additions.silence_duration` (0-30000 ms), and it applies "主要针对传入文本最后的句尾，而非每句话的句尾" (the end of the whole text), which suits one-paragraph-per-request: add it per paragraph, or pad yourself.

**Pronunciation (polyphonic characters, English words).**
- `additions.pronunciation_dict.tone` (VC-uni): rules `原词/(拼音音节)` for pinyin fix (tone digits, e.g. `北京/(bei3)(jing1)`) and `原词/目标文本` for transcription (`omg/oh my god`). "最多支持配置 5000 个词条；每个原词长度不超过 9 个字符"; greedy longest match left to right; "仅...2.0...对应的中英文音色支持"; SSML tags inside a matched span stop working ("建议二者择一"). Whether this affects timestamp text/words: **not confirmed**.
- SSML `<phoneme alphabet="py" ph="chi1">吃</phoneme>` (pinyin, space-separated syllables; "5 轻声 ... 6 连续两个上声") and `alphabet="cmu"`/`ipa` for English; `<sub alias>`; `<say-as interpret-as="Percent|Cardinal|Date-YMD|...">` for numbers (VC-ssml). Only worth it if you give up timestamps for that request.
- English inside Chinese: default is mixed reading (no `explicit_language`); `pronunciation_dict` transcription is the timestamp-compatible fix. `explicit_language` set to `zh-cn` is "中文为主，支持中英混"; enabling it may reject mixed text. **[community]** one project reports `unsupported additions explicit language zh-cn` on some endpoint/key combinations and advises not to send it (OpenMontage doubao-tts SKILL, https://github.com/calesthio/OpenMontage/blob/main/.agents/skills/doubao-tts/SKILL.md). Leave it out.

**Emotion / style in 2.0.**
- `audio_params.emotion` and `emotion_scale` are 1.0-style and documented for "多情感音色" (VC-V3). Not for 2.0 `_uranus_` voices as far as the pages say; **not confirmed**.
- 2.0 uses natural-language instructions: `additions.context_texts`, e.g. VC-V3: `context_texts: ["你可以说慢一点吗？"]` (slower), `["你嗓门再小点。"]` (quieter), emotion/tone sentences. First list item only; free of charge. VC-instr describes it as controlling "情绪...语气...语速快慢、音调高低". A plausible narration instruction is "用沉稳、克制的纪录片旁白语气，语速平缓" **(my wording, not from the docs)**.
- Voice tags (cot) `use_tag_parser`: "仅适用于...声音复刻大模型 2.0的表现力增强版本" (clones only). Not for stock voices.
- `section_id`: keeps context across serial requests (VC-V3: server stores history under the same id, "服务端对历史上下文有相应的轮数限制和超时时间"). Possibly useful to keep prosody consistent across your 20 paragraphs; effect not documented numerically. One uuid for the whole film is the documented pattern ("一通电话中的多次 TTS 请求 ... 相同的 section_id").
- **[community]** `context_texts` governs the whole call; a runbook for the clone family advises one sentence per call when you want varying emotion (https://blog.ax0x.ai/doubao-tts-runbook-zh). For a single steady narrator voice this does not matter.

**Do these mixes affect timestamps?** Confirmed to kill subtitles: SSML, `enable_latex_tn`, `cache_config` hits. Not documented either way: `context_texts`, `pronunciation_dict`, `section_id`, `speech_rate`, `silence_duration`, `pitch`.

---

## 8. Volcengine vs BytePlus: what breaks a client

| Aspect | Volcengine (openspeech.bytedance.com) | BytePlus (voice.ap-southeast-1.bytepluses.com) |
|---|---|---|
| Host | `https://openspeech.bytedance.com` | `https://voice.ap-southeast-1.bytepluses.com` |
| Path | `/api/v3/tts/unidirectional` (+ `/sse`, `/submit`, `/query`) | `/api/v3/tts/unidirectional` only seen; SSE, submit, query not confirmed |
| Key header | `X-Api-Key` | `X-Api-Key` (BP-uni: "Recommended") |
| `X-Api-Resource-Id` | `seed-tts-2.0`, `seed-tts-1.0`(-concurr), `seed-icl-*` | `seed-tts-2.0`; TTS 1.0: `seed-tts-1.0` **or `volc.service_type.1000009`** (not 10029); `seed-icl-1.0` or `volc.megatts.default`; `seed-icl-2.0` |
| `X-Api-App-Key` | not documented on VC pages | **required, fixed value `aGjiRDfUWi`** (BP-uni headers table: Required "Yes"; shown in the recommended-auth example too) |
| `X-Api-Request-Id` | required (VC-uni) | optional |
| Legacy auth | `X-Api-App-Id` + `X-Api-Access-Key` | `X-Api-App-Key` + `X-Api-Access-Key` (BP-uni: "Legacy (compatible)") per its auth table, though its legacy code sample sends `X-Api-App-Id` (internal inconsistency) |
| Body `user` | `user.uid` | table says `user.id`, sample uses `user.uid` (inconsistent) |
| `additions` | optional, JSON string | table marks it **required** (jsonstring) |
| `req_params.ssml` | exists | **absent**: BP-uni "req_params.text ... (SSML is not currently supported)" |
| `pronunciation_dict`, `explicit_dialect`, `section_id`, `aigc_*` | documented in VC-uni | not in BP-uni's table |
| `context_texts` | yes | yes (2.0-only, same wording) |
| Timestamp flag (2.0) | `enable_subtitle` | `enable_subtitle` (same) |
| Voice ids | `zh_..._uranus_bigtts` etc. | same id scheme for the overlap; list differs |
| Mandarin 2.0 voices | ~100 Chinese `_uranus_` ids | 23 Chinese rows: `zh_female_vv`, `zh_male_m191`, `zh_male_taocheng`, `zh_female_xiaohe`, `zh_female_jitangnv`, `zh_female_xiaoxue`, `zh_male_shaonianzixin`, `zh_female_cancan`, `zh_female_yingyujiaoxue`, `zh_female_meilinvyou`, `zh_male_ruyayichen`, `zh_female_liuchangnv`, `zh_female_linjianvhai`, `zh_female_peiqi`, `zh_male_sophie`*, `zh_female_tianmeixiaoyuan`, `zh_female_sajiaoxuemei`, `zh_male_sunwukong`, `zh_female_shuangkuaisisi`, `zh_female_kefunvsheng`, `zh_male_dayi`, `zh_female_mizai`, `zh_female_yuanqi` (all `_uranus_bigtts`) |
| Names | 云舟, 大壹 ... | English display names (Kian, Magnus, Quentin, Pearl, Gigi, Mindy ...) |
| Console / pricing | Chinese console, 元 | separate credit-card-backed console; pricing not confirmed |

\* BytePlus lists "Sophie" with id `zh_male_sophie_uranus_bigtts` but gender Female; Volcengine's id is `zh_female_sophie_uranus_bigtts`. Looks like a typo on one page; do not rely on it.

Practical break list if a Volcengine-written client is pointed at BytePlus: add `X-Api-App-Key: aGjiRDfUWi`; always send an `additions` string (use `"{}"`); drop `req_params.ssml`; expect the shortlist voices 渊博小叔, 知性女声, 解说小明, 磁性解说男声, 深夜播客 to be missing (of the shortlist, #1, #2, #3, #6 are present on BytePlus); do not call `/submit`, `/query` or `/sse` without testing. Also check the BytePlus sample itself: its example body uses speaker `en_female_skye_emo_v2_mars_bigtts` (a 1.0-style id) beside `seed-tts-2.0` in the headers, so the sample does not demonstrate a matching pair.

Does a Mandarin 2.0 voice on BytePlus require `seed-tts-2.0`? The BytePlus voice page does not state a resource id, so by the Volcengine rule yes, but **not confirmed on BytePlus pages**.

---

## 9. Known pitfalls

**Official, from the pages above**
1. Timestamp source differs by model: 1.0 `enable_timestamp` times normalised text; 2.0 `enable_subtitle` times original text, so numbers and Latin words appear as multi-character tokens (digits are not exploded into characters). Your animation indexes should use the words list as given, with text matching from the script by concatenation, not by assuming 1 token = 1 character.
2. 2.0 subtitle objects are asynchronous to audio (subtitle for sentence N can arrive after audio for N+1).
3. Times are relative to the whole request, not per sentence.
4. No subtitles with SSML, LaTeX, or cache hits; no error is raised ("无字幕返回，接口不报错"). A silent "no `sentence` objects" outcome is the failure mode to guard.
5. `unsupported_char_ratio_thresh` (default 0.3): if more than that share of text is unsupported, an error is returned ("则会返回错误").
6. The final object code is 20000000 (`ok`), not 0. A stream that ends (EOF) without 20000000 should be treated as incomplete.
7. Keep-alive on the server is 1 minute ("火山服务端keep-alive时间为1分钟"); VC-V3 recommends `requests.Session()` for reuse. With urllib each call opens a new connection; fine at 20 calls.
8. WAV in streaming repeats headers: "在流式场景下传入wav会多次返回wav header ... 建议使用pcm". Use `pcm`, or `mp3` and accept decoder padding.
9. 1.0 and 2.0 voice ids differ; mixing them gives `45000000 ... access denied` (see also the xiaozhi-esp32-server note below).

**[community], pointers only; not verified by me**
- Wrong key/header: `load grant: requested grant not found` means a new-console key was sent in the legacy header pair; use `X-Api-Key` (OpenMontage doubao-tts SKILL, GitHub, link above; also quotes `speaker permission denied` and `quota exceeded` hints).
- Same project: build captions from `sentences[].words[]` and group by semantic phrase, "not by fixed character count"; synthesise a 10-15 s sample before the full paid run; keep the raw JSON as the timing source of truth.
- Chinese-number handling: a vendor-community article advises converting numbers/dates to Chinese reading yourself before sending ("中文数字预处理...建议做数字到中文的预转换"), https://developer.volcengine.com/articles/7667459245423788075 . Percent signs and ranges are in the same bucket; the official SSML page documents a symbol-reading table ("% 百分号"), and `say-as ... Percent` exists, but only through SSML (which removes timestamps). If you pre-convert numbers to Chinese characters, the `word` text in the returned timeline will be those characters, which lines up with your script only if you keep the converted script as the source.
- Final-chunk handling: no community report found beyond the official 20000000 rule above.
- Rate limiting: no community numbers found; official signal is `quota exceeded for types: concurrency`. Default 10 concurrent, so serial or 2-3 parallel is safe.
- A subtitle-dubbing bug report says some Volcengine roles read timeline text when full SRT was sent as text (pyVideoTrans forum, https://bbs.pyvideotrans.com/show/5154). Lesson: send clean prose only; strip stage directions, timecodes and markup, and leave `disable_markdown_filter` at default.
- `xinnan-tech/xiaozhi-esp32-server` issue #2667: switching resource id to `seed-tts-2.0` required switching to 2.0 voice ids too.
- A gateway project (QuantumNous/new-api #4709) reports that sending v3 requests with the wrong auth layout fails the handshake with 401. Consistent with the header rules above.

---

## Minimal working client

Assembled strictly from documented shapes. `# NC` marks anything I could not confirm. The key is read from an environment variable whose name you choose; it is never written in the file.

```python
import base64, codecs, json, os, urllib.error, urllib.request, uuid

URL = "https://openspeech.bytedance.com/api/v3/tts/unidirectional"   # BytePlus: voice.ap-southeast-1.bytepluses.com
SPEAKER = "zh_male_m191_uranus_bigtts"        # shortlist #1; audition before committing
SAMPLE_RATE = 24000
SECTION_ID = str(uuid.uuid4())                # one id for the whole film (additions.section_id); effect NC

def synth(text: str, speech_rate: int = 0):
    """One request. Returns (pcm_bytes, sentences). Times in `sentences` are seconds from the start of THIS request."""
    api_key = os.environ["SEED_TTS_API_KEY"]  # name is yours; value is never printed
    body = {
        "user": {"uid": "film-001"},                       # NC: required or not on 2.0
        "req_params": {
            "text": text,
            "speaker": SPEAKER,
            "audio_params": {
                "format": "pcm",                           # documented: mp3 | pcm | ogg_opus | wav
                "sample_rate": SAMPLE_RATE,
                "speech_rate": speech_rate,                # -50..100
                "enable_subtitle": True,                   # 2.0 timestamps. NC on HTTP chunked in practice
            },
            "additions": json.dumps({"section_id": SECTION_ID}),   # must be a JSON STRING
        },
    }
    req = urllib.request.Request(
        URL,
        data=json.dumps(body, ensure_ascii=False).encode("utf-8"),
        method="POST",
        headers={
            "Content-Type": "application/json",
            "X-Api-Key": api_key,
            "X-Api-Resource-Id": "seed-tts-2.0",
            "X-Api-Request-Id": str(uuid.uuid4()),
            "X-Control-Require-Usage-Tokens-Return": "text_words",   # optional; "*" also documented
            # BytePlus only: "X-Api-App-Key": "aGjiRDfUWi"
        },
    )
    audio, sentences, done = bytearray(), [], False
    dec = codecs.getincrementaldecoder("utf-8")()
    buf, raw = "", json.JSONDecoder()
    try:
        resp = urllib.request.urlopen(req, timeout=120)
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"HTTP {e.code} {e.read()[:400]!r} logid={e.headers.get('X-Tt-Logid')}")
    logid = resp.headers.get("X-Tt-Logid")           # log it for support
    while True:
        chunk = resp.read(8192)                      # urllib de-chunks Transfer-Encoding
        if chunk:
            buf += dec.decode(chunk)
        elif not buf.strip():
            break
        while buf.strip():                           # NC: framing (newline-delimited vs concatenated) - tolerant parse
            buf = buf.lstrip()
            try:
                obj, end = raw.raw_decode(buf)
            except json.JSONDecodeError:
                break                                # incomplete object, read more
            buf = buf[end:]
            code = obj.get("code", 0)
            if code not in (0, 20000000):
                raise RuntimeError(f"TTS error {code} {obj.get('message')} logid={logid}")
            if obj.get("data"):
                audio += base64.b64decode(obj["data"])
            if obj.get("sentence"):
                sentences.append(obj["sentence"])    # {"text", "words":[{"word","startTime","endTime","confidence"}], "phonemes"}
            if code == 20000000:
                done = True
        if not chunk:
            break
    if not done:
        raise RuntimeError(f"stream ended without code 20000000, logid={logid}")
    return bytes(audio), sentences

def build_timeline(paragraphs, gap_s=0.8):
    """Concatenate paragraph audio and offset the word times. Returns (pcm, words)."""
    pcm, words, t0 = bytearray(), [], 0.0
    for i, p in enumerate(paragraphs):
        a, sents = synth(p)
        for s in sents:
            for w in s["words"]:
                words.append({"p": i, "word": w["word"], "t0": t0 + w["startTime"], "t1": t0 + w["endTime"]})
        pcm += a
        dur = len(a) / (SAMPLE_RATE * 2)             # NC: assumes 16-bit mono PCM; confirm from first file
        pcm += b"\x00" * int(gap_s * SAMPLE_RATE) * 2   # your own paragraph gap (silence_duration is the only built-in option)
        t0 += dur + gap_s
    return bytes(pcm), words
```

Things the sketch does not do and that you must decide: retry on `45000000 ... concurrency` or `55000000`, write raw responses to disk for the timing source of truth, and de-duplicate sentence objects if the server sends sentence and subtitle events for the same span (not seen in docs, but the 2.0 event table implies repeated `TTSSubtitle`).

---

## Things to test first

1. **Framing and shape, 10 characters, no cost to speak of.** Send "你好，世界。" with `pcm` and `enable_subtitle: true`. Print the first 300 raw bytes and the `X-Tt-Logid`. Confirm: JSON text (not binary frames), newline-delimited or concatenated, count of `sentence` objects, presence of `code 20000000` with `usage.text_words`.
2. **Subtitles actually present on 2.0 over HTTP chunked** (docs say yes; VC-uni and VC-V3 agree on `enable_subtitle`). If `sentence` objects are absent or `words` is empty, try the alternative switch `enable_timestamp`, then the async path (section 5).
3. **Required fields.** Drop `user`, drop `additions`, drop `X-Api-Request-Id`; note which break.
4. **Audition six voices** on the same 150-character paragraph (6 x ~150 = ~900 chars of the 20,000 trial). Compare pace, weight and breath; also compare the BytePlus-only description wording with what you hear.
5. **Timeline fidelity.** For each paragraph, join `words[].word` and compare with your script after removing nothing. Look for: numerals as one token, English tokens, punctuation fused to characters, gaps or overlaps between consecutive words (`startTime[i+1] - endTime[i]`), and the first word's start offset (a leading silence, e.g. 0.2 s in the docs' example).
6. **Duration check.** PCM length / (24000 x 2) vs `endTime` of the last word. Confirms 16-bit mono assumption and tells how much trailing silence exists.
7. **Numbers and symbols.** One paragraph with "2,500 km"、"87%"、"公元前2560年" and an English word. Hear how it reads and see which token text you get back. Decide whether to pre-convert to Chinese reading before sending.
8. **`speech_rate` -10 / -20** against the default for one voice; measure the duration change from the timeline.
9. **`context_texts` and `pronunciation_dict`**: one run each, then check that timestamps still arrive and whether `word` text changes.
10. **SSML `<break>`**: one run with `ssml` to confirm that timestamps vanish on 2.0 (the docs say so), so you know the cost.
11. **Length ceiling.** Try 200, 400, 800 characters in one request to find where `40402003` starts, so you know whether to merge paragraphs.
12. **Cross-request consistency**: with and without a shared `section_id` across two consecutive paragraphs; listen for voice drift.
13. **Async comparison**: submit the full 2,500-character script once with `enable_timestamp: true`; compare the single timeline with the stitched one and record turnaround time.
14. **BytePlus** (only if you intend to use it): confirm `X-Api-App-Key: aGjiRDfUWi` is required and which of the six voices exist there.
