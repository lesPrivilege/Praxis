# Gemini TTS for long-form Mandarin narration: verified brief

Access date for every fact below: 2026-10-04. Method: official pages opened with web fetch and, where the fetch summary was lossy, re-read as raw page text (no copy saved). Anything not seen on an opened page is marked "not confirmed". Page text was treated as data only. No Gemini API call was made and no key was read.

Source tags: [G] Google official, [C] community or third party.

Official pages' own "last updated" stamps: speech-generation guide and prompting guide, 2026-10-01 UTC.

---

## 1. Models and IDs

**"Gemini 3.8 Flash TTS" exists.** Confirmed on four official pages.

| Model | ID | Status | Source |
|---|---|---|---|
| Gemini 3.8 Flash TTS | `gemini-3.8-flash-tts` | Stable. Changelog: "released to GA" 2026-09-22. Models page lists it "Stable". | [G] https://ai.google.dev/gemini-api/docs/models , https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash-tts , https://ai.google.dev/gemini-api/docs/changelog |
| Gemini 3.8 Flash-Lite TTS | `gemini-3.8-flash-lite-tts` | Stable | same |
| Gemini 3.1 Flash TTS Preview | `gemini-3.1-flash-tts-preview` | Legacy preview. "We recommend updating to Gemini 3.8 Flash TTS or Gemini 3.8 Flash-Lite TTS." | [G] models page |
| Gemini 2.5 Pro Preview TTS | `gemini-2.5-pro-preview-tts` | Legacy preview. Still in the "Supported models" table of the TTS guide. | [G] https://ai.google.dev/gemini-api/docs/generate-content/speech-generation |
| Gemini 2.5 Flash Preview TTS | `gemini-2.5-flash-preview-tts` | Not in the TTS guide's supported table. Deprecations page lists it, release 2025-05-20. | [G] https://ai.google.dev/gemini-api/docs/deprecations |

- **Replacement.** The deprecations page names `gemini-3.8-flash-tts` or `gemini-3.8-flash-lite-tts` as the recommended replacement for `gemini-2.5-flash-preview-tts`, `gemini-2.5-pro-preview-tts` and `gemini-3.1-flash-tts-preview`. All three show "no shutdown date announced" today. [G] https://ai.google.dev/gemini-api/docs/deprecations
- **Flash vs Flash-Lite.**
  - Flash: "maximum acoustic fidelity ... difficult pronunciations ... long-form narrations requiring rock-solid voice and room-tone stability".
  - Flash-Lite: "fast, cost-efficient workhorse".
  - Same API schema; switching is one parameter. [G] speech-generation guide, "When to use which model".
- **Related audio models.** `gemini-3.8-live`, `gemini-3.8-live-extended-thinking`, and `gemini-3.5-transcribe` (speech-to-text). [G] models page.
- **Date discrepancy in Google's own pages.** The changelog says `gemini-3.1-flash-tts-preview` was released 2026-04-15. The deprecations page says 2026-02-26. Not resolved; irrelevant for this project.
- **Cloud side.** Google Cloud documents the same models under "Gemini Enterprise Agent Platform" (Preview wording). https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/text-to-speech/prompting-guide . Not used further; the Gemini Developer API is enough here.

## 2. Exact call shape

SDK requirement: `google-genai >= 2.25.0` (Python), `@google/genai >= 2.24.0`. [G] speech-generation guide, voices section.

There are two documented API surfaces for 3.8 TTS.

### 2a. generateContent (primary documented path in the guide at `/docs/generate-content/speech-generation`)

Python, verbatim from the page [G] https://ai.google.dev/gemini-api/docs/generate-content/speech-generation :

```python
from google import genai

client = genai.Client()

response = client.models.generate_content(
    model="gemini-3.8-flash-tts",
    contents=[{
        "role": "user",
        "parts": [{
            "text": "Have a wonderful day!",
            "speech_metadata": {"style": "cheerful and friendly"},
        }],
    }],
    config={
        "response_modalities": ["AUDIO"],
        "speech_config": {
            "voice_config": {"voice": "Kore"}
        },
    },
)

data = response.candidates[0].content.parts[0].inline_data.data
with open("out.wav", "wb") as f:
    f.write(data)
```

REST, verbatim:

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash-tts:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" -X POST -H "Content-Type: application/json" \
  -d '{
    "contents": [{"role": "user", "parts": [{
        "text": "Have a wonderful day!",
        "speech_metadata": {"style": "cheerful and friendly"} }]}],
    "generationConfig": {
      "responseModalities": ["AUDIO"],
      "speechConfig": {"voiceConfig": {"voice": "Kore"}}
    }
  }' | jq -r '.candidates[0].content.parts[0].inlineData.data' | base64 --decode > out.wav
```

- **Schema change from 2.5 and 3.1.** The voice is now `speechConfig.voiceConfig.voice` (a plain string). The old `prebuiltVoiceConfig.voiceName` form remains in the doc only for the multi-speaker example. The style moves out of the text into `parts[].speech_metadata.style`.
- **The Python SDK returns raw bytes** in `inline_data.data`. The REST JSON returns base64 in `inlineData.data`.

### 2b. Interactions API (documented on the other page, `/docs/speech-generation`)

[G] https://ai.google.dev/gemini-api/docs/speech-generation (fetch summary, shape not re-read raw):

```python
interaction = client.interactions.create(
    model="gemini-3.8-flash-tts",
    input=[{"type": "user_input", "content": [{"type": "text", "text": "...",
        "annotations": [{"type": "speech_metadata", "style": "..."}]}]}],
    response_format={"type": "audio"},
    generation_config={"speech_config": [{"voice": "Kore"}]},
)
# audio: base64.b64decode(interaction.output_audio.data)
```

REST: `POST https://generativelanguage.googleapis.com/v1beta/interactions`.

- **Community pitfall.** A DEV post reports that the REST response for interactions puts audio in `steps[].content[]` and not in the SDK convenience field `output_audio.data`, and that wrongly parsed calls still consumed quota. [C] https://dev.to/gde/ai-in-practice-gemini-38-flash-tts-launch-i-built-a-learn-japanese-with-mvs-web-app-and-4o79
- **Recommendation for this project:** use generateContent (2a), because it is the simpler shape and the one the guide shows first.

### 2c. Audio output format

[G] speech-generation guide and model migration notes.

- **Unary requests:** default is `audio/wav` with a 44-byte RIFF header, 24 kHz, mono, 16-bit signed little-endian PCM.
- **Streaming requests:** default is headerless `audio/L16;codec=pcm;rate=24000` (24 kHz, mono, 16-bit).
- **Other formats:** `audio/l16`, `audio/mulaw`, `audio/alaw` via `response_format.mime_type` (Interactions) or `AUDIO_L16 / AUDIO_MULAW / AUDIO_ALAW` (generateContent).
- **Behaviour change:** 3.1 returned headerless PCM by default; 3.8 returns WAV. Remove any manual WAV wrapping.
- **Concatenation:** "Because unary requests return audio/wav with a 44-byte RIFF header by default, request raw PCM (AUDIO_L16) or strip the WAV header from each turn before concatenating the 24kHz PCM audio frames." (Limitations section.)
- **Sample-rate options 24000/16000/8000:** [C] https://github.com/davidheryanto/learn-gemini-3.8-flash-tts (fetch summary only).
- **Duration is exact from the data:** frames / 24000 s. Nothing needs to be guessed.

## 3. Voices

### 3a. Prebuilt voices

30 prebuilt voices with one-word descriptors. [G] https://ai.google.dev/gemini-api/docs/generate-content/speech-generation (raw text re-read):

Zephyr Bright; Puck Upbeat; Charon Informative; Kore Firm; Fenrir Excitable; Leda Youthful; Orus Firm; Aoede Breezy; Callirrhoe Easy-going; Autonoe Bright; Enceladus Breathy; Iapetus Clear; Umbriel Easy-going; Algieba Smooth; Despina Smooth; Erinome Clear; Algenib Gravelly; Rasalgethi Informative; Laomedeia Upbeat; Achernar Soft; Alnilam Firm; Schedar Even; Gacrux Mature; Pulcherrima Forward; Achird Friendly; Zubenelgenubi Casual; Vindemiatrix Gentle; Sadachbia Lively; Sadaltager Knowledgeable; Sulafat Warm.

The guide does not give gender for these prebuilt voices. Gender per voice: not confirmed from an official page.

### 3b. Other voice sources (new in 3.8)

All [G] speech-generation guide and https://ai.google.dev/gemini-api/docs/generate-content/voice-design .

- **Extended Voice Library.** "Hundreds" of additional voices, via `client.voices.list()` / `GET /v1beta/voices`. Filters:
  - `language_code` (BCP-47, case-insensitive exact match)
  - `region_code`, `accent`
  - `gender` (female, male, neutral)
  - `pitch` (low, medium, high)
  - `persona` (for example "Narrator")
  - `contexts` (for example "Audiobook", "News")
  - `type`
- **Voice design.** `POST /v1beta/voices`, `type="prompted"`. It returns a persistent `voice_...` ID plus a `sample_audio` WAV preview. Retention is 1 year from last use, 200 stored voices per project.
- **Voice replication.** Persistent `voice_...` or stateless `voicekey_...` (7-day TTL).
- **A designed voice is passed as** `speech_config.voice_config.voice = "voice_..."`. Voice design takes `language_code` (the doc example uses `en-GB`) and `gender`.
- **Chinese `language_code` value for the voice library or voice design** (`zh-CN`, `cmn-CN`, `cmn-Hans-CN`): not confirmed. `cmn-Hans-CN` is used by 3.5 Transcribe, a different model. https://ai.google.dev/gemini-api/docs/transcribe

### 3c. Which voice for calm, mature Mandarin narration

**No official or community page I opened gives a verified Mandarin voice ranking.** What exists:

- **Official descriptors that fit a calm, mature, informative tone:**
  - Charon (Informative), Rasalgethi (Informative), Sadaltager (Knowledgeable)
  - Gacrux (Mature), Schedar (Even)
  - Algieba (Smooth), Iapetus (Clear), Vindemiatrix (Gentle), Sulafat (Warm), Achernar (Soft)
- **Community, English-centric, older models:**
  - Charon: "information-rich and clear, for news and documents".
  - Aoede: safest for long narration without fatigue.
  - Gacrux called "weakest even with expressive tags".
  - Source: [C] a web-search summary of Chinese tutorial pages (https://www.53ai.com/news/MultimodalLargeModel/2025121486572.html and others). I did not open these pages directly, so treat as weak.
- **CSDN test of the 3.1 preview voices (2026-04-15):**
  - Recommends Kore, Aoede, Charon for cross-language consistency.
  - Names Gacrux (monotone) and Umbriel (rhythm) as worst.
  - Has no Mandarin-specific per-voice data.
  - Source: [C] https://blog.csdn.net/shebao3333/article/details/160339457
- **Not confirmed:** which prebuilt voice is male or female, and which sounds best in Mandarin. Audition is needed (Recipe below).

## 4. Style control, tags, and the "read aloud" risk

[G] speech-generation guide and https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/text-to-speech/prompting-guide (both re-read raw).

- **Core rule.** "Gemini 3.8 TTS treats the text field strictly as a verbatim transcript."
  - Sustained delivery goes in `speech_metadata.style` (emotion, prosody, pace, volume). Examples: `"speaking slowly"`, `"speaking rapidly"`, `"warm and enthusiastic"`.
  - Point-in-time events go inline in angle brackets.
- **Read-aloud risk.** The model page migration note says: inline text directions like "Say cheerfully: Hello!" or "Speaker 1: Hello!" **may be spoken aloud.** Fix: put them in `speech_metadata` and keep `text` as the spoken words only. [G] https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash-tts
- **Inline tags** (angle brackets, "for highest audio quality"):
  - Vocal tags: `<breath> <sigh> <cough> <short pause> <long pause>` and others.
  - Square-bracket tags like `[pause]` or `[softly]` belong to the 3.1 era; 3.8 docs use angle brackets. Not confirmed that `[pause]` is still honoured.
  - "If your transcript isn't in English, keep the inline tags in English."
  - Use human vocalisations only, not sound effects.
- **Pace control, three levels.**
  - Punctuation: commas, `--`, `...`.
  - `<short pause>` / `<long pause>`.
  - Turn-level `style` such as `"speaking slowly"`.
- **Emphasis.** Capitalise words (Latin letters only; no Chinese equivalent documented).
- **Google's workflow advice.**
  - Design the persona once in Voice design.
  - Test with an empty style first ("most requests need no style instruction at all").
  - Then add only a short style string, and reuse the same exact string across turns.
  - "Long-form Audio Profile paragraphs and multi-bullet Director's Notes ... are the most common cause of voice drift."
  - "Don't include instructions telling the model to hold the voice steady ... Extra prompt text increases drift."
  - Do not put age, gender, names or permanent accent into `style`.
- **Tag-induced drift in the 3.1 preview.** Issue #1292 (2026-07-19, open, awaiting review) reports progressive volume collapse to a whisper after about 1.5 to 3 minutes of long-form output with soft style tags (`[softly]` or system-instruction softness). Workaround reported: strip the style tags. Model tested was `gemini-3.1-flash-tts-preview`, not 3.8. Source: [C] https://github.com/google-gemini/cookbook/issues/1292
- **IPA pronunciation override in /slashes/:** appears in a search-result summary and a third-party review's description of Google's launch claims, but is **not confirmed** on any Google page I opened (the guide and prompting guide text contain no IPA). [C] https://blog.buildfastwithai.com/gemini-3-8-flash-tts-review

## 5. Limits, rate limits, pricing

### Per-request limits

[G] https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash-tts

- **Input token limit:** 8,192.
- **Output token limit:** 16,384 ("Gemini API serving limit").
- **Derived duration (my arithmetic, not an official figure):** the pricing page says `$9.00/M` audio tokens equals `$0.00225` per 10 s of audio, so 250 tokens per 10 s, which is 25 tokens/s. 16,384 / 25 gives about 655 s, roughly 10.9 min.
- **Community cross-check:** "about 11 minutes per generation" cited in [C] https://xmsumi.com/detail/3007 for the 3.1 preview.
- **Whole film in one request:** a 10-minute film is about 15,000 audio tokens. That sits right at the output ceiling and far above what the community considers safe. It is unnecessary.
- **Other capabilities on the model page:** Batch, Flex, Priority, Caching supported. Not supported: Live API, function calling, structured outputs, thinking, code execution.
- **Input** is text only; **output** is audio only.

### Rate limits

- **Official rate-limits page:** does not list per-model limits for 3.8 TTS. It says limits "can be viewed in Google AI Studio" (https://aistudio.google.com/rate-limit). The page's batch table lists only Gemini 2.5 TTS rows. [G] https://ai.google.dev/gemini-api/docs/rate-limits
  - 3.8 free-tier and paid-tier RPM, TPM and RPD: **not confirmed from Google**.
- **Community datapoint (3.8, DEV post):** "100 requests per day" quota, labelled Tier 1, no per-minute rate published. A 429 carried a `Retry-After` of about 25,936 s, and the Python SDK silently waited out that whole period. [C] https://dev.to/gde/ai-in-practice-gemini-38-flash-tts-launch-i-built-a-learn-japanese-with-mvs-web-app-and-4o79
  - 110 per-segment calls plus retries would exceed 100 per day. Check the AI Studio dashboard before the production run.
- **Older datapoints:** 10 requests per day per key for the 3.1 preview ([C] https://github.com/TTTV273/Text-To-SPeech-Gemini); 429s on many Chinese lines for 2.5 ([C] https://pyvideotrans.com/gemini-tts).

### Pricing (per 1M tokens, USD)

[G] https://ai.google.dev/gemini-api/docs/pricing (re-read raw)

| Model | Input (text) | Output (audio) |
|---|---|---|
| `gemini-3.8-flash-tts`, paid | $0.50 through 2026-12-31, then $1.00 | $9.00 through 2026-12-31, then $18.00 |
| `gemini-3.8-flash-tts`, batch | $0.25 / $0.50 | $4.50 / $9.00 |
| `gemini-3.8-flash-lite-tts`, paid | $0.50, then $1.00 | $6.00, then $12.00 (fetch summary only) |
| `gemini-3.1-flash-tts-preview`, paid | $1.00 | $20.00 |

- **Free tier:** "free of charge" for Flash TTS standard calls; free-tier content is "used to improve our products". Paid tier is not.
- **Cost of this film (my arithmetic):** about 15,000 audio tokens at $9/M is about $0.14 per full pass, before retries.

## 6. Timestamps

- **No timestamp, alignment or duration data is returned by TTS.** None of these pages mention word, character or sentence timing in the TTS response: the generateContent guide, the interactions guide, the model page, the prompting guide. [G]
- **Community confirmation:** a forum feature request from 2026-10-01 says no timing data comes back from `gemini-2.5-flash-preview-tts`, `gemini-3.1-flash-tts-preview`, `gemini-3.8-flash-tts` and `gemini-3.8-flash-lite-tts`. It says `audioTranscriptionConfig.wordTimestamp = true` is "silently ignored". No Google reply was visible. [C] https://discuss.ai.google.dev/t/feature-request-word-character-timestamps-for-gemini-tts-output-caption-sync/186189
- **What Google recommends:** nothing in the TTS docs. The nearest official path is the separate speech-to-text model.
  - `gemini-3.5-transcribe` supports word timestamps via `generation_config.transcription_config.mode = {"type": "verbatim", "timestamp_granularities": ["word"]}`.
  - Output is `word_info` with `text`, `start_offset`, `end_offset`.
  - Caveats: word-level only, no character-level mention for CJK. Enabling timestamps "may degrade overall transcription accuracy". The audio limit drops to 30 min with timestamps. It cannot take a reference text.
  - Source: [G] https://ai.google.dev/gemini-api/docs/transcribe and https://ai.google.dev/gemini-api/docs/models/gemini-3.5-transcribe
- **What is available for free:** the clip's total duration is exact from the returned PCM (item 2c). Only the inside-the-clip timing is missing.

## 7. Determinism

- **Seed or temperature for TTS:** not documented on the TTS guide, model page, prompting guide or the third-party cheat sheet. Not confirmed. https://github.com/davidheryanto/learn-gemini-3.8-flash-tts reports the same absence.
- **One community report** (multi-speaker, 2.5 models, 2026-03-15) says lowering temperature to 0.5 reduced hallucinated inserted lines. This implies `temperature` is accepted in `generationConfig`; whether it has an effect on 3.8 is not confirmed. [C] https://discuss.ai.google.dev/t/gemini-tts-multi-speaker-mode-7-critical-bugs-after-3-weeks-in-production-finishreason-other-truncation-voice-swapping-hallucinated-lines/132776
- **Voice stability between requests.**
  - Google's claim for 3.8 Flash: "consistent voice identity, timbre, volume, and acoustic room tone across extended dialogues and multi-minute narrations without voice drift" ([G] model page).
  - The mechanism Google gives: the model "anchors on the audio reference first". Stability comes from the `voice` ID (designed, replicated, or library). It does not come from prompt text.
  - Independent measurement of 3.8: not found. Treat the claim as untested.
- **Outputs are not bit-identical between calls.** Not stated anywhere official. Community describes truncation and line skips as "non-deterministic" for 2.5 multi-speaker. Plan for a re-generate-and-compare loop.

## 8. Mandarin

- **Language coverage.** "Chinese (Hans script)" and "Chinese (Hant script)" are in the 3.8 Flash and Flash-Lite columns of the supported-languages table. Flash is "over 130 languages", Flash-Lite "over 100" (model page says 101). "The TTS models detect the input language automatically": there is no language parameter on the TTS request. Cantonese is listed separately. [G] https://ai.google.dev/gemini-api/docs/generate-content/speech-generation
- **Polyphonic characters, numbers, English terms in Chinese text:** the official docs say nothing. Not confirmed.
- **Community report (3.1 preview, Chinese blog, publication date not shown on the fetch, but it covers the 3.1 preview, so April 2026 or later):**
  - Chinese is less stable than English.
  - Professional terms, rare words and polyphonic characters raise failure rates. Symptoms: switching into a formal broadcast tone, odd pauses, English acronyms and numbers mispronounced ("API网关" read letter by letter; "DAU" and "LTV" wrong).
  - Suggested workarounds: add spelled-out annotations such as `API（A-P-I）网关`, expand abbreviations, human review.
  - Source: [C] https://xmsumi.com/detail/3007 (fetch summary; this is a single blog's testing).
  - A Bilibili test of 3.8 exists (https://www.bilibili.com/video/BV14Yaa6XEC8/); I did not open it. Content not confirmed.
- **No 3.8-specific Mandarin failure data found.** The above is from the previous generation. Test with the actual script.

---

## 9. Long-form consistency (community patterns)

- **Google's own guidance** (item 4): fixed voice ID, no long persona text, empty or one constant short style string, no "keep voice steady" instructions. Google's sample for conversational agents is "one TTS call per turn". Google gives no numeric chunk-size guidance for narration. [G] speech-generation guide
- **Per-request, not one long request.**
  - Community pipelines chunk and join. The cheat sheet: "One request per turn, then joining the audio" ([C] https://github.com/davidheryanto/learn-gemini-3.8-flash-tts).
  - Chinese-language reports advise splitting long text into short segments after truncations even inside the 11-minute ceiling: an 8,000-character podcast script was interrupted ([C] https://xmsumi.com/detail/3007).
- **Context from the previous sentence:** no source found that recommends sending the previous sentence as context for TTS. Not confirmed. Google's guidance runs against adding more prompt text.
- **Retries and resume.** The audiobook generator at https://github.com/TTTV273/Text-To-SPeech-Gemini uses: 3 retries at 30 s, key rotation, a "soft-fail" check for empty content, checkpointed resume (reported 91% quota saving on resume). It warns of "distortion/noise" when chunks are too large and suggests 500 to 750 tokens in that case (default 1,000). [C]
- **Content-hash caching** of generated clips recovered about 30 to 40% of calls for repeated lines. [C] DEV post above.
- **Known failure modes (mostly on 2.5 or 3.1; 3.8 status not confirmed):**
  - Truncation: `finishReason: "OTHER"` with only 13 to 46% of the expected duration, "30-40% of calls wasted on retries"; later reports of single-speaker truncation with 3 to 80% success rates; plus silent truncation by safety filters. Source: [C] forum thread 132776 (link in item 7).
  - Hallucinated inserted lines and skipped or duplicated lines, voice swapping on longer chunks. Same thread.
  - Workarounds reported there: keep chunks under 3,000 characters; add identity reinforcement; check the output turn count.
  - Volume fade and whisper drift after 1.5 to 3 minutes (item 4, issue #1292).
  - The only reliable detector reported for inserted or dropped words is an ASR round trip diffed against the script: https://mahimai.ca/learn/100x/tts/tts-hallucinations (general TTS, Gemini not mentioned) and the forum thread. A duration-versus-text-length check also catches drops (mahimai).
  - One-sided mixed evidence on drift: Google claims 3.8 has fixed it; no independent test found yet.
- **Noise or odd sound at the clip end:** no source found for Gemini TTS. Not confirmed. Check clip tails in the test run.

## 10. Segmentation

- **No official guidance on unit size for narration.** Only: "split long agent responses into shorter turns rather than reaching for stronger style prompts." [G]
- **Community numbers:**
  - Under 3,000 characters per request (multi-speaker 2.5; forum).
  - 500 to 750 tokens when distortion appears; default 1,000 (TTTV273 repo).
  - Single-speaker truncation was reported even at much shorter lengths for 2.5, so the cap is not safe by itself.
  - "Each line not too long, break at natural pauses" (Chinese podcast-script advice, xmsumi).
- **Short-utterance caveat:** a long context or director prompt distorted very short utterances; workaround was to skip the prompt for short ones. [C] forum thread 132776. This matters because this script averages about 24 characters per segment.
- **Segmentation for this project is a judgment call, not a sourced rule.** See the recipe.

## 11. Timestamp tools for Mandarin audio (forced alignment of known text)

All install and size facts from the repos' own pages unless stated. Nothing was installed or run.

| Tool | Takes known script text? | Chinese granularity | Apple Silicon / install | Evidence for accuracy |
|---|---|---|---|---|
| **Qwen3-ForcedAligner-0.6B via `mlx-qwen3-asr`** | Yes: `ForcedAligner.align(audio, text, language)` in the source. High-level `transcribe(return_timestamps=True)` aligns its own ASR text. | Per character (CJK split per character in `ForcedAlignTextProcessor`) | Native MLX, no torch. `pip install mlx-qwen3-asr` (v0.4.4, Python >= 3.10, Apache-2.0). Aligner weights: bf16 about 1.84 GB, 4-bit 979 MB on Hugging Face (https://huggingface.co/aitytech/Qwen3-ForcedAligner-0.6B-4bit). 0.21 s mean aligner latency on a short clip (M4 Pro). | Paper: Chinese AAS 33.1 ms short-form and 36.5 ms on up to 300 s, vs NFA 109.8/235.0 ms and Monotonic-Aligner 161.1/1742.4 ms. English: WhisperX 92.1 ms short, 227.2 ms long. Max 300 s per clip. MLX port matches the official backend at 5.69 ms MAE on 50 English samples. Sources: https://arxiv.org/html/2601.18220v1 , https://github.com/moona3k/mlx-qwen3-asr |
| **Qwen3-ForcedAligner via official `qwen-asr`** | Yes: `model.align(audio, text, language="Chinese")` | Character or word | PyTorch; the README examples use CUDA/bf16. Apple Silicon (MPS/CPU) behaviour: not confirmed. Apache-2.0. https://huggingface.co/Qwen/Qwen3-ForcedAligner-0.6B | Same paper |
| **stable-ts** | Yes: `model.align(audio, text, language='zh')` | Whisper-token based; character vs word splitting for Chinese: not confirmed | `pip install -U stable-ts[mlx]`, `load_mlx_whisper('base')` documented for transcription; `align()` with the MLX backend: not confirmed. Version 2.19.1 on PyPI. https://pypi.org/project/stable-ts/ | No Chinese accuracy figure found |
| **mlx-whisper** `word_timestamps=True` | No (transcribes) | Not confirmed per character | Native MLX | A reported issue: memory grows per chunk with word timestamps (https://github.com/ml-explore/mlx-examples/issues/1254). Whisper's own word timestamps "are often inaccurate" (a research-paper summary). |
| **WhisperX** | Aligns its own transcript. Words not in the aligner's dictionary, such as "2014." or "£13.60", get no timing. | Needs a zh wav2vec2 model: not confirmed | README gives CPU-only for macOS (`--device cpu --compute_type int8`) | Paper numbers above (92 to 227 ms on English) |
| **FunASR (Paraformer-zh; TP-Aligner "fa-zh")** | `fa-zh` (ModelScope `iic/speech_timestamp_prediction-v1-16k-offline`; HF `funasr/fa-zh`) is a Mandarin timestamp predictor that takes speech plus text. 37.8M parameters, trained on 50,000 h per the model-zoo table. Exact `AutoModel` call with text input: not confirmed on pages I opened. | Character-level for Mandarin (per search summary; not verified from the README) | `pip install funasr` plus torch. Apple Silicon/MPS: not confirmed. Torch install size not confirmed. | No numeric comparison found |
| **ctc-forced-aligner (MMS)** | Yes | Via `--romanize` for non-Latin scripts | `pip install git+https://...`; CUDA or CPU, no MPS mention. **Default MMS model is CC-BY-NC 4.0: non-commercial licence.** | Interspeech 2024 comparison (search snippet): MFA beat WhisperX and MMS. Not opened in full. |
| **Montreal Forced Aligner, aeneas** | Yes | Not opened or evaluated | Not evaluated in this research | Not confirmed |

- **Which is most accurate and simplest on an M2 16 GB for Mandarin, given a known script?** The only tool with Chinese-specific, long-form accuracy numbers is Qwen3-ForcedAligner, and `mlx-qwen3-asr` runs it natively on Apple Silicon. 16 GB is enough: 0.6B model, about 1.2 GB runtime memory reported for the ASR 0.6B; the 4-bit aligner is about 1 GB on disk. This is a conclusion from the above, not a tested result. Caveat: all published numbers are on read speech. Check with a few real Gemini Mandarin clips and verify against audible onsets.
- **Fallback:** FunASR `fa-zh` (Mandarin-specific, small), but the exact call and the MPS path need checking first.

**Known script plus short clips makes this easier than the general case.** Each clip is much shorter than the 300 s limit, the text is known, and the exact clip length is known from the PCM.

## 12. Final mix: loudness and chain

- **YouTube target.** Widely cited as -14 LUFS integrated, turning loud content down and leaving quieter content as is. **I did not find this on a Google page.** A third-party page that I opened states it explicitly and says it does not cite an official YouTube source: [C] https://www.criticallisteninglab.com/en/learn/loudness/youtube . Treat -14 as an observed convention, not an official spec.
- **Authoritative standard (opened and read locally).** AES TD1004.1.15-10 (2015), "Recommendation for Loudness of Audio Streaming and Network File Playback": [G-equivalent: AES] https://aes2.org/wp-content/uploads/2024/01/AESTD1004_1_15_10.pdf
  - Target loudness not above -16 LUFS ("to avoid excessive peak limiting") and not below -20 LUFS ("to improve the audibility of streams on mobile devices").
  - True peak is measured per ITU-R BS.1770 Annex 2 (4x oversampling); the document's peak-limit wording was not re-read in full. Secondary summary says maximum -1 dBTP: https://www.production-expert.com/production-expert-1/aes-update-loudness-recommendations-for-audio-only-streaming
  - Speech normalised to the same integrated loudness as music "inevitably sounds too loud": speech (dialog) segments should be normalised lower than music (the document's section on speech versus music; exact figure not extracted).
  - EBU R128 (-23 LUFS, -1 dBTP) is a broadcast spec and applies to YouTube only by analogy. Not opened.
- **Music ducking.** One search summary: music about 18 to 25 dB under speech; W3C WCAG guidance of at least 20 dB lower for non-speech sound. Sources not opened directly. [C] https://pureaudioinsight.com/blogs/content-production/background-music-volume-how-loud-should-it-be . Confirm by ear.
- **Voice chain** (high-pass, de-ess, compression, limiter): no authoritative source found. The numbers are standard practice, not cited. Not confirmed.

---

## Recommended recipe

All steps are my recommendation, built on the facts above. Where a fact was not confirmed, the step is a test, not an assumption.

**Model.** `gemini-3.8-flash-tts` (stable, Google's pick for "long-form narrations" and "difficult pronunciations"). Keep `gemini-3.8-flash-lite-tts` as a cheap draft pass to find script problems: it shares the API schema, so only the model ID changes.

**Voice (this is the one-voice requirement).**
1. Audition in AI Studio (https://aistudio.google.com/generate-speech). Candidate shortlist by official descriptor: Charon (Informative), Sadaltager (Knowledgeable), Rasalgethi (Informative), Gacrux (Mature), Schedar (Even) for a mature, calm male-leaning read; Sulafat (Warm), Vindemiatrix (Gentle), Achernar (Soft), Iapetus (Clear) for a female-leaning read. The gender labels are my guess; the docs give none. Listen to each with a Mandarin paragraph that includes numbers, an English term and polyphonic characters.
2. Better for stability: query the Extended Voice Library (`voices.list`, filters `language_code` for Chinese, `persona=["Narrator"]`, `pitch=["low"]`, `contexts=["Audiobook"]`) or create one persona with Voice design (a one-sentence description, `gender`, Chinese `language_code`). Pass the stored `voice_...` ID on every request. Google says this is the mechanism for stability. The exact Chinese `language_code` string needs checking against the live API.
3. Record the chosen ID in the repository.

**Request shape.** generateContent with `response_modalities=["AUDIO"]`, `speech_config.voice_config.voice=<id>`. Request `AUDIO_L16` or strip headers if joining raw; otherwise keep the default WAV and read it with the `wave` module. Text field holds only the spoken script. Leave `speech_metadata.style` empty first. If a pace change is needed, use one short constant string for every request, such as a slow-pace phrase, and nothing else. No persona text, no "keep voice steady" text.

**Segmentation.**
- One request per one to three sentences (a breath group or a scene beat), about 30 to 150 characters, aligned to the film's cue boundaries. That gives each segment its own exact duration from the PCM and stays far from the 3,000-character and 8,192-token ceilings.
- Do not make 110 requests of about 24 characters each without testing: Google's "one call per turn" guidance is for conversation, and a community report found very short utterances distorted. Compare per-segment output with grouped output (about 8 to 15 scene-sized requests of a few hundred characters) on three scenes before committing.
- Check the free-tier daily request cap in AI Studio before the run; a 100-request daily cap would be hit.

**Preflight on the script text.**
- Spell out or annotate numbers, English terms, acronyms and known polyphonic characters in the TTS input. Keep a separate display text for subtitles.
- Keep English inline tags (`<short pause>`) if any are used; use sparingly and test for the soft-volume fade.

**Verification per clip (automatic).**
- Whisper or `gemini-3.5-transcribe` ASR round trip, with a character error rate against the TTS input; reject on mismatch.
- Compare duration with characters-per-second for the voice; reject outliers (truncation, repeats).
- Check `finishReason == STOP`, non-empty audio, tail silence.
- Retry on failure with backoff; hash the request and cache every accepted clip so retries never regenerate accepted clips. Log the model ID, voice ID and style string with each clip.

**Alignment.** `mlx-qwen3-asr` `ForcedAligner` (`align(audio, text, language)` with the clip's known text) per clip; character-level times offset by the clip's start in the final timeline. Validate on five clips against the waveform before trusting it. Fallback: FunASR `fa-zh`.

**Timing.** The cue time of each segment is the accumulated exact clip duration plus fixed inter-segment gaps you define. Do not re-time the picture from alignment output; use alignment only inside the clip.

**Mixing targets.**
- Normalise each clip to the same loudness before concatenation (gain only, to keep voice level steady).
- Final programme: -14 LUFS integrated as the YouTube convention (not an official Google number), -1 dBTP true-peak ceiling; AES allows -16 to -20 LUFS for streaming.
- Voice chain: high-pass about 80 Hz, light de-ess, gentle compression, brick-wall limiter at the true-peak ceiling. These are standard practice, not sourced.
- Music about 18 to 25 dB under speech while speech is present; check by ear.

## Known failure modes to test for

1. **Voice or timbre drift** between requests (Google claims fixed for 3.8; no independent test found). Test: same sentence, 10 calls, spread over the session; compare by ear and with a speaker-embedding or spectral check.
2. **Volume fade and whisper drift** inside a clip, seen at 1.5 to 3 minutes on the 3.1 preview with soft style tags (issue #1292). Check the level over time in every clip; keep the style empty.
3. **Truncation**: `finishReason` not STOP, audio at 13 to 46% of expected duration, or a clip that ends mid-sentence. Detect by duration ratio plus ASR round trip.
4. **Skipped, duplicated or inserted words** (reported on 2.5 multi-speaker). Detect by ASR diff.
5. **Mandarin-specific:** wrong polyphonic readings, numbers, English acronyms read letter by letter, sudden "broadcast tone" switch, strange pauses.
6. **Accent change** (random non-native accent) in Mandarin: reported for 2.5 Chinese by one tutorial summary, not verified; listen for it on every clip.
7. **Instruction read aloud:** any text in `text` that is not meant to be spoken. Check the ASR transcript for "style" words.
8. **Short-clip distortion** for very short utterances.
9. **Clip-edge noise or leading/trailing silence variation:** no source found; measure the head and tail of every clip and trim to a fixed pad.
10. **Rate limits and quota:** 429 with a very long `Retry-After`; the Python SDK waited out the whole period silently in one report. Set an explicit timeout and retry policy.
11. **Format surprise:** WAV header on unary responses versus headerless PCM on streaming; do not double-wrap or concatenate WAV files byte for byte.
12. **Preview-era behaviours changing:** the three preview models have no shutdown date yet; the 3.8 launch pricing steps up on 2027-01-01.
