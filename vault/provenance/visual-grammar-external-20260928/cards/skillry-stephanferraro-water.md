# Skillry specimen：autonomous 3D water simulation

- source ID: `skillry-stephanferraro-water`
- canonical URL: <https://skillry.dev/ai-videos/opus-5-5/stephanferraro-224281>
- original post URL（独立缺口记录）：<https://x.com/StephanFerraro/status/2103020274107224281>
- accessed: 2026-09-28 (Asia/Singapore)
- status: `verified`（Skillry 详情页）；原帖见 [`x-stephanferraro-water`](x-stephanferraro-water.md)，状态 `unavailable`
- snapshot: `summary-only`

## 读到什么

详情页 `Prompt` 区域（网页阅读定位约第 21–31 行）展示：从空仓库构建程序化山地、雨、溪流和湖泊的 3D water simulation；文字提到 TypeScript + Three.js、无 physics engine、约 21 分钟、23/23 tests green，并明确给出 <https://github.com/AiondaDotCom/ai-sim-benchmark>。标签是 Three.js、GLSL、Physics。`View original post` 解析出的 X URL 已独立登记，但 fetch 返回 403。

## 可消费内容

这是“程序模拟 + 3D 场景 + 无 UI 的自动镜头 + 验收测试”组合的候选 specimen。下游可以把它当作水流、地形、相机轨迹和测试契约的检索入口；仓库 README 另有协议与评估限制，见 [`aionda-ai-sim-benchmark`](aionda-ai-sim-benchmark.md)。

## 边界

“one prompt / zero corrections / 21 min / 23/23 tests”是作者或聚合页自述，不是本批独立实测；详情页没有源码、固定 commit、媒体快照或跨机器确定性证据。原帖与 remake 未保存，不能从标签推断 WebGL/GLSL 具体实现。

## 重访

施工水/物理 specimen、需要固定仓库 commit、查看原视频、复现实验或审计许可证时，先重访独立 X 记录和仓库，再决定是否消费。
