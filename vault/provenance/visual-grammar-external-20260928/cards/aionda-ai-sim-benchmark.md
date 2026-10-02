# AiondaDotCom/ai-sim-benchmark

- source ID: `aionda-ai-sim-benchmark`
- URL: <https://github.com/AiondaDotCom/ai-sim-benchmark>
- accessed: 2026-09-28 (Asia/Singapore)
- status: `verified`（README 页面）；snapshot: `summary-only`

## 读到什么

README 将仓库定义为比较 autonomous coding agents 的 reproducible 3D water-simulation challenge，要求软件架构、数值模拟、3D rendering、UI、testing 与 performance。技术约束区列出 TypeScript、Vite、Three.js、无外部 3D assets、无预制 physics/fluid engine、seeded terrain 和自动化模拟测试。README 的 Opus 5.5 run 条目自述 23/23 tests、production build、zero corrective interventions、约 21 分钟，并记录 browser checks 的水流、地形与相机观察。

同一 README 的 protocol/status 部分说明早期 runs 的提示词仍在变化，评估者不是独立 evaluator，构建与评估角色有重叠；因此这些数字应和限制一起阅读。

## 可消费内容

可作为程序模拟、地形/水流、相机 orbit、seed、测试契约与视觉验收的成熟挑战入口。它比单纯“生成一个好看的视频”更适合构造可失败、可测量的 specimen 工单。

## 边界

本批只读 README，未固定 commit、未克隆源码、未运行 tests/build/browser、未下载 demo 视频，不能声称 benchmark 在 Praxis 可复现。仓库的自述结果不是独立实验结论；许可证、依赖和当前 branch 仍需施工时复查。

## 重访

选定水模拟或 procedural 3D 工单、需要固定协议/commit、审计测试与许可证或做独立评估时重访；Skillry specimen 的二手描述见 [`skillry-stephanferraro-water`](skillry-stephanferraro-water.md)。
