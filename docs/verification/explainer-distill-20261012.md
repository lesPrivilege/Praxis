# DeerFlow 讲解页的提炼 · 2026-10-12

基线：`02ca9ea`，分支 `preserve/local-work-before-art-atlas-20261011`。改动在工作区，未提交。裁决见 [ADR-031](../decisions/031-stable-terms-and-explainer-page.md)。主会话为 Claude Opus 5.5；Luna 不可用，没有工作记在 Luna 名下。

## 触发

用户看过 [讲解页](../../demos/deerflow-explainer/index.html)后说：“目验通过，可以 distill 完成 kit 维护了。”同一条消息问能否在 Kit 里备一套原生 SVG 图标，随后两条消息把它改成派给独立的 ClaudeDesign 的工单，并说明范围。

主会话对范围的理解：提炼的是这次制作里跨主题仍成立的做法和用户给出的裁决，不是这一页的样式。

## 过程与去向

| 步骤 | 起作用的做法 | 证据 | 去向 |
|---|---|---|---|
| 定范围 | 从读者的问题反推：每个局部答四问，颗粒度停在机制一层 | 用户两条意见；页面每章的结构 | [讲解页的编排](../../dsh-praxis/kit/publish/html/explainer.md)“每个局部回答四问” |
| 定形式 | 连续页；结论、章、细节、回查四层；条件不进折叠 | 用户同意连续 HTML；33 处细节层，默认值都在可见层 | 同上“四层”“可以调的” |
| 读原件 | 固定提交；六个区域各一份带定位的底稿；主笔只回查影响结论的地方 | [底稿](../../demos/deerflow-explainer/research/README.md)；主会话核对配置模板后发现两处“代码默认与模板默认不同” | 同上“事实底稿” |
| 归组 | 四十项左右的中间件按六个执行位置归组，写明没有逐项列出 | 页面第 3 章的图与图注 | 同上正例 |
| 独立审阅 | 结构文字与正文各出一张意见表，逐条裁决 | 40 条意见，多数采纳；没有留逐条的裁决表 | 没有新条文；审阅页已有 |
| 术语 | 取最稳定的说法，AI 与 agent 领域用英文原词 | 用户原话；初稿的译名没有被独立审阅指出 | [成文原理](../../dsh-praxis/kit/writing/principles.md)第 6 条；[审阅方法](../../dsh-praxis/kit/writing/review.md)偏差表与裁决记录 |
| 强调色 | 交互图里表示当前选中，写进图例 | 页面的图例；与 Kit 默认不同，记在项目说明里 | [成立程度的标记](../../dsh-praxis/kit/design/foundations/standing.md)可调情形一句 |
| 记号与控件 | 不在本会话绘制，写成自足的工单 | 用户原话 | [工单](../../demos/editable-native-svg/claude-design-order-20261012.md)；Kit 暂不新增 |

## 验证

| 项 | 结果 |
|---|---|
| 仓库验证 | 运行 `python3 scripts/validate_repository.py`，结果见下节 |
| 入口走读 | 主会话从 [Kit 入口](../../kit/README.md) → Write → Publish 走到新页，链接可达；没有请不带上下文的读者走读 |
| 对照 | 未对照。没有不读新条文的产出可比 |
| 真实使用 | 新条文写成之后还没有在别的任务上用过；讲解页本身是它们的来路，不计作使用 |
| 事实 | 讲解页的事实只做了抽查，未核实项列在页面第 13 章 |

## 仓库验证结果

本次改动没有引入报错。验证仍然报 fail，10 条错误都在本次范围之外：`demos/motion-ceiling-lab`、`demos/role-baseline-film`、`demos/write-kit-film` 三个未提交的项目缺 README（8 条），以及 `vault/distilled/knowledge-film-001-distill-20261005/README.md` 的两条断链。它们属于别的会话的在途工作，没有动。

## 未决项

- 讲解页的键盘与读屏走查、200% 缩放和真实读者试读没有做。
- 术语替换之后没有再做一轮文字审阅。
- ClaudeDesign 的工单还没有交出；回交、review 和入 Kit 是后续三步。

## 之后（同日）

- 本地 main 合并了艺术与软件图谱分支，工作区改到新基线 `ae1471e` 上重放。审阅裁决的表已随 main 移出审阅方法，本次那一行不再追加，裁决以 ADR-031 为准。ADR 由 029 改为 031：029 已被 main 占用，030 被本地一份未恢复的 stash 占用。
- ClaudeDesign 的交付经用户看过，收进 [kit/design/marks](../../dsh-praxis/kit/design/marks/README.md)（[ADR-032](../decisions/032-semantic-marks-library.md)）。主会话看了记号总览和控件页的截图，重新运行生成脚本，三个生成文件内容未变；运动页没有看。
- 讲解页取用 18 个记号，看了宽屏和 500 px 的截图；效果与缺口见该包的 [checks.md](../../dsh-praxis/kit/design/marks/checks.md)。375 px、打印和键盘在加记号之后没有重查。
