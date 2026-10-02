# Demucs Music Source Separation

- source ID: `demucs-repository`
- URL: <https://github.com/facebookresearch/demucs>
- accessed: 2026-09-28 (Asia/Singapore)
- status: `partial`（官方仓库已归档）；snapshot: `summary-only`

## 读到什么

GitHub 页面显示 `facebookresearch/demucs` 已由 owner 于 2025-01-01 archive。README 说明 Demucs v4 是 Hybrid Spectrogram/Waveform source separation，v4 使用 Hybrid Transformer，并声明原维护者离开 Meta、仓库不再积极维护，指向一个 fork。

## 可消费内容

可把 source separation 放在 audio-aware visual pipeline 的分析层：先把混合音频拆成 vocal/music 等来源，再把分析结果交给后续 ASR、alignment 或 visual event 生成。这里只登记其身份和 README 边界，未做运行推荐。

## 边界

未固定 commit、未下载模型、未分离音频、未比较 fork、未评估许可证、显存或速度；archive 状态意味着不能把当前维护性或最新修复当成事实。README 的能力描述不是 Praxis 质量验收。

## 重访

选择 source separation 工单、需要维护 fork/锁定模型、或要测质量/成本时重访仓库、fork、release 和 license，并保存实际配置。
