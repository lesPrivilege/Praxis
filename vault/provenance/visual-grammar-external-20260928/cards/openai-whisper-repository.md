# OpenAI Whisper

- source ID: `openai-whisper-repository`
- URL: <https://github.com/openai/whisper>
- accessed: 2026-09-28 (Asia/Singapore)
- status: `verified`（README）；snapshot: `summary-only`

## 读到什么

OpenAI 仓库 README 将 Whisper 定义为 general-purpose speech recognition model，涵盖 multilingual speech recognition、speech translation、language identification 与 voice activity detection；其 approach 段落说明 Transformer sequence-to-sequence、多任务 token 设计。

## 可消费内容

可作为音频到文本/粗时间语义的分析候选，为 kinetic typography、字幕和后续 CTC alignment 提供输入。它与 Skillry 的音频 specimen 相关，但不是视觉 renderer。

## 边界

本批只读 README，未运行模型、未测 timestamp 精度、语言覆盖、GPU/CPU 成本或许可证；README 不证明 Praxis 音画同步质量，也不证明具体 release 的行为。

## 重访

需要词级 timeline、模型/语言对比、固定 release 或生产成本评估时重访 README、model card 和 release，并以样音验收。
