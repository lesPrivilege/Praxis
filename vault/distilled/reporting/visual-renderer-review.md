# Visual Grammar、Renderer 与 Review

## 先问关系，再选图

Reporting Kit 不应维护漂亮页面图库，而应维护 semantic visual vocabulary。历史回答提出至少六类问题：

| 读者要理解的关系 | 首选 primitive |
|---|---|
| 多少、是否变化 | line、bar、small multiples、variance |
| 为什么变化 | causal tree、driver decomposition、waterfall |
| 怎么运行、谁交接 | flow、swimlane、state machine、sequence |
| 系统怎样连接 | architecture、data flow、dependency graph |
| 应该选哪个 | option matrix、trade-off frontier、scenario |
| 怎么推进 | roadmap、milestone、critical path、RACI |

选择顺序应是：

```text
semantic question → visual primitive → annotation → provenance → renderer
```

不要从 chart library 的可用组件反推业务问题（T2/A）。

## Chart、Table、Diagram、Card 的分工

- **Table**：精确查数、对象明细、责任状态、版本核对；
- **Chart**：趋势、差异、分布、结构比例、异常模式；
- **Diagram**：对象、系统、层级、流转、依赖和边界；
- **Card**：可独立讨论的 claim/evidence/decision 对象，不是默认页面网格。

没有需要表达的关系时，不为了“有数据可视化”强行画 chart。重点数据可用 annotation、reference line、局部强调和 small multiples 直接引导；series 重叠时优先拆解，避免 spaghetti chart（T2/A）。

## 页面层级

career-kit 本地汇报图式库把页面拆为：

| 层级 | 责任 |
|---|---|
| L0 | 画布与章节环境，不把整页包进 Card |
| L1 | 标题：判断或准确主题 |
| L2 | 主展项：本页主要阅读任务，通常占主体 |
| L3 | 辅助证据、定义、局部记录 |
| L4 | ID、版本、单位、来源、时间等元数据 |

比例（如主展项占 55–70%）是选型起点，不是删信息或缩小文字的硬指标。影响判断的状态、风险和权限不能降到不可读小字。

## 容器与关系线

本地图式规则提供了可复用的容器语法：

- **Open Section**：连续说明、架构主体；
- **Bounded Card / Frame**：完整边界的合同记录、版本、审批范围、系统边界、表格；
- **Raised Card**：可独立讨论的方案、证据包、专业判断；
- **Tinted Panel / Callout**：架构能力、政策、异常或特殊状态。

一个 Card 对应一个语义对象，避免 Card 套 Card。边界只表达范围或独立记录；只有真实存在交接、依赖或因果时才画箭头。阴影和颜色是内部视觉约定，不能伪造权限、审批或实测状态。

## 数据与状态的视觉诚实

- 金额、时间、比率必须有单位、基准、分母和来源；
- actual、forecast、estimate、target、synthetic 保留文字状态和更新时间，不仅靠颜色；
- 时间轴用真实间距；若为顺序排列，注明不是比例时间；
- 同一图组比较同一量时共用尺度；不同尺度分开并直标；
- 风险色只在状态定义存在时使用，蓝色不自动等于批准/实测；
- 表格可与主图并存，图表负责模式、表格负责核对。

这些规则来自本地 career-kit 图式库快照，具体原文见 [`local-design.md`](local-design.md)。

## Renderer 选择

Reporting Kit 应将内容与 renderer 解耦：

| Renderer / surface | 适合的阅读模式 | 约束 |
|---|---|---|
| PPT/投屏 deck | live briefing | 一屏一主语，给口述留空间，标题可独立定位结论 |
| PPT 式 HTML | live + readable hybrid | 16:9/section geometry 可控，支持链接、responsive、静态导出 |
| Pre-read HTML / memo | async-reference | 脱离讲者自足，保留 reasoning、来源和下钻路径 |
| PDF | portable / frozen record | 版本、页码、字体、图表和来源需固定可复核 |
| Markdown | source / working document | 适合审阅与差异，不把 renderer 细节混进 claim |
| Evidence appendix | audit / deep review | 原文、表格、计算、方法、反例和缺口完整保留 |

同一 `claim/evidence/visual` 模型可以渲染成多种 surface；Renderer 不得自行补充业务数字、状态或引用。

## Review 顺序

历史回答与本地设计源共同支持分层 review：

1. **Story / Sorter**：只看页面顺序和 action titles，确认每页在推进什么判断；
2. **Claim / Evidence**：逐页核对主张、证据、来源、状态、单位、ask；
3. **Grey/Ink**：去掉颜色后检查层级是否仍成立；
4. **Squint / Blur**：缩小或模糊后检查主要视觉主语和节奏；
5. **Geometry**：真实渲染检查文字换行、线条、比例、容器边界、页间密度；
6. **Surface**：分别在 live、pre-read、HTML/PDF、窄视口和打印尺寸检查；
7. **Reality**：长文本、空态、错误、加载、实际数据、重复使用和来源回跳；
8. **Anti-slop**：删除装饰性 chart、重复标题、无意义 card、强凑对称和过程旁白；
9. **Change record**：记录采用/调整/拒绝的规则、证据和未决问题。

本地 Courtwork 的设计研究把“constraints → references → variants → compare → remove → isolate states → prototype → real-data preview → review → misfit ledger”作为设计循环；这比一次 screenshot 通过更强。参见 [`local-design.md`](local-design.md)。

## HTML render contract（候选）

```yaml
render:
  artifact_id:
  renderer: html | ppt | pdf | markdown | appendix
  delivery_mode: live | pre-read | async-reference | audit
  viewport:
  theme:
  data_snapshot:
  source_manifest:
  unresolved:
  review_status:
```

它用于可复现和 review 的候选 contract，尚未成为当前仓库实现。

## 待核实与限制

- 本地快照未复制 raster QA 图、视频、完整 runtime 预览或浏览器截图；因此“可视化规则已可交互验证”不能由本文件推出。
- 16:9、打印、responsive 和长文本需要实际 renderer 运行后再确认。
- 外部 visual vocabulary 的来源 URL 在 chat 中是 citation placeholder，需外部登记流程补回。

