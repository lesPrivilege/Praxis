# 第二版的证据与验收

保留第一版作为比较基线；在同一主题与无 TTS 约束下，比较内容颗粒度、对象连续性、状态变化、图形的解释作用和实际阅读节奏。记录应由实际源码、画面或成片支持，不能把编码/布局通过称为整体品质通过。

[阶段审计](completion-audit.md) · [项目](../README.md)。第二版完成前，已交付第一版的入口保持可用。

- [第一版与参考比较](comparison-baseline.md)
- [机制构件交接](mechanism-lab-handoff.md)
- [新版阅读稿检查](reader-v2-check.json)

- [四段状态样片](prototypes/README.md)
- 深度与默认补查保留在 [现有研究主题](../../../vault/distilled/agentscope-enterprise-20261012/README.md)。

- [Service 回放与执行目标矩阵交接](service-lab-handoff.md)：两种新展项，15帧与API检查通过，待主片集成。

- [Service结构检查](service-check.json) · [Service API检查](service-api-check.json)

- [切 2 状态检查脚本](check_cut2_states.py)：按当前时间线检查 39 个一般场最终态及 71 个展项阶段；实际 DOM、字号、正逆序 PNG、EXPLORE/URL、调用与文件身份。输入 hash 在运行前后核对，自动结果不替代完整实时观看。
- [阅读语义 fixture](cut2-reading-semantics-fixture.json)：验证显式语义键去重、值变化、移动副本排除及曝光区间求并；无键的第一版保持原统计行为。

- [切 2 状态与阅读验收](cut2-state-acceptance.md)：冻结后的3121秒版本；110状态正逆序、实际文字/字号和语义阅读统计均通过，图像人工抽查与未覆盖范围单独记录。


## 完整第二版

- [50场/53主题舞台](../cut2/film/index.html) · [最终画面文字](../cut2/out/screen-text.md)
- [局部内容增量](content-v2-handoff.md) · [Runtime机制](runtime-lab-handoff.md) · [工作区与闭环](work-lab-handoff.md)
- [110状态与动态因果验收](cut2-state-acceptance.md) · [最终媒体检查](../cut2/out/check-report.json)
- [独立裁决与修后追加](cut2-independent-review.md)
- 一倍时间轴分段运行与取帧审阅：[第一段](playback-part1.md)、[第二段](playback-part2.md)、[第三段](playback-part3.md)、[第四段](playback-part4.md)。它们不冒充人类连续完整观片。

- [修后编码边界检查](cut2-repair-media-check.json) · [媒体保存回执](media-preservation.json)

## 2026-10-15 视觉复核

用户反馈视觉效果不足，原制作接收不作为视觉接收。[视觉spec diff](visual-spec-diff-20261015.md)对照现有规格、实现及Claude施工产物；[图像对照](visual-diff-20261015/comparison.html)。本轮仅审计，未重绘成片。

## 2026-10-15 视觉修订实施

[第三版](../cut3/README.md)包含47场/53主题的原生SVG重画、11:02核心样段和新双画幅封面。原审计与用户反馈保留；设计卡、独立裁决与实际范围从第三版入口进入。
