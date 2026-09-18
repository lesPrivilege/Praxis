# 本地设计材料：Courtwork × career-kit

## 目的与证据边界

本文件把本机两个项目中与 design、汇报图式和 review 相关的规则接到 Reporting Kit。快照是离线阅读入口，原始路径、sha256、mtime 和逐文件处理状态见 [`../../intake/local-projects.json`](../../intake/local-projects.json)。

快照不是整仓复制，也不等于每个文件都已逐件深读：

- Courtwork：219 个文本/契约材料已复制；核心 design 总纲与规范已深读，其余 design 子目录已按目录和文件名索引，manifest 标为 `indexed`，不宣称逐件提炼。
- career-kit：10 个汇报设计入口材料已复制并深读，包括根入口、图式库 AGENTS/README、图式目录、绘制规范、视觉记号和 HTML 样张。

## Courtwork：设计治理可消费内容

### 1. 先定对象、动作、状态、恢复，再选组件

快照中的 UX Grammar 要求 UI 工作先写清：对哪个对象做什么、什么条件下可做、成功/失败留下什么、如何恢复；对象、状态、权限和保存事实由相应 Core/Host/service owner 负责，历史候选和外部规范不能自动成为当前实现。

核心规则包括：

- 常驻文字应帮助识别、行动、判断状态或避免/恢复错误；
- 必要的对象名、决定依据、权限范围、失败和未知应靠近动作；
- Link、Button、Tab、Disclosure、Switch 各自表达不同语义；
- request in flight、run state、connection、result 分开表达；
- Undo、重试、撤销只有在真实服务合同支持时提供；
- Agent 扩展应显示来源、工具、授权、历史，不能给普通 Save/Search 套 AI 装饰。

入口：[`Courtwork UX Grammar`](../../snapshots/local/courtwork/engineering/design/ux-grammar.md)、[`design principles`](../../snapshots/local/courtwork/engineering/design/principles.md)、[`completion surface`](../../snapshots/local/courtwork/engineering/design/completion-surface.md)。

### 2. Design loop 是 constraints 与 misfit 的循环

Courtwork 的设计 research index 把循环写成：

```text
constraints
  → reference / anti-reference retrieval
  → multiple structural directions
  → human comparison
  → removal
  → component / state isolation
  → interactive prototype
  → real-data preview
  → human review
  → misfit ledger
  → revise constraints
```

可直接消费的原则：constraint before generation、explore before implementation、compare rather than refine、removal pass、views first、evaluate states、real runtime review、feedback 先判断是否改变 constraint。Scout 截获的 screenshot 只能产生 candidate；必须追到 product precedent、design system 或 behavior primitive，再决定是否进入本地规则。

入口：[`design-research-index`](../../snapshots/local/courtwork/engineering/mvp/execution/work-surface-kit/inputs/design-research-index-2026-09-09.md)、[`design scout index`](../../snapshots/local/courtwork/engineering/mvp/execution/work-surface-kit/inputs/design-scout-index-v2-2026-09-09.md)、[`scout layer`](../../snapshots/local/courtwork/engineering/mvp/execution/work-surface-kit/inputs/design-scout-layer-2026-09-09.md)、[`Design Scout README`](../../snapshots/local/courtwork/engineering/design/scout/README.md)。

### 3. Projection 与 Control 分开；投影不得创造事实

Local UI Atlas 将 `Projection Grammar`（如何读）与 `Control Grammar`（如何改）并列放在 schema/intent 与 component anatomy 之间：

```text
Schema / intent
  → Projection Grammar / Control Grammar
  → Component anatomy
  → behavior / motion / local adaptation
```

本地 contract 的重要边界：adapter 透传服务器时间与 scope，不自己计算相对时间；缺失是 `null`，不是 `0` 或空字符串；投影不发 fetch、不缓存、不改排序；没有 unit/scope/timezone 不强行画更强的图形。对 Reporting Kit 的直接启示是：renderer 不得用卡片、颜色、精确数字或流程箭头创造不存在的事实。

入口：[`Local UI Atlas`](../../snapshots/local/courtwork/engineering/design/atlas/README.md)、[`UI state vocabulary`](../../snapshots/local/courtwork/engineering/mvp/execution/work-surface-kit/contracts/ui-state-vocabulary.md)、[`review projection`](../../snapshots/local/courtwork/engineering/mvp/execution/work-surface-kit/contracts/review-projection.md)、[`primitive canon`](../../snapshots/local/courtwork/engineering/mvp/execution/work-surface-kit/contracts/primitive-canon.md)。

### 4. Review 不是 screenshot 通过

本地规则把 design review 连接到运行时和状态空间：需要看正常、hover/selected、loading、empty、error、disabled、dense、narrow、long-content 等可复现状态；真实数据 preview、键盘/触屏、缩放、中文 IME、reduced motion 和恢复路径分别检查。截图只证明表示，不证明交互、恢复或后端语义。

这对 Reporting Kit 的 review 直接映射为：先故事线，再 claim/evidence，再视觉层级，再真实渲染，最后检查受众表面和反 slop。

入口：[`work-surface-kit README`](../../snapshots/local/courtwork/engineering/mvp/execution/work-surface-kit/README.md)、[`review visual`](../../snapshots/local/courtwork/engineering/mvp/execution/work-surface-kit/inputs/review-visual-2026-09-09.md)、[`review semantics`](../../snapshots/local/courtwork/engineering/mvp/execution/work-surface-kit/inputs/review-semantics-2026-09-09.md)、[`frontend handoff`](../../snapshots/local/courtwork/engineering/mvp/frontend-design-handoff-v8.md)。

### 5. 状态与动作命名是 contract，不是文案装饰

本地设计材料把 `Sending…`、`Working`、`Waiting for you`、`Failed`、`Unknown` 等 run/请求事实分开，强调“cancel requested ≠ stopped”；Approval、Permission、Question、Answer 也各有不同作用域。Reporting 图表和状态标记应沿用来源事实，不把状态颜色、阴影或标签当作权力/批准的替代物。

## career-kit：汇报图式的本地规则

### 1. 读者任务先于图式

`企业汇报图式库/绘制规范.md` 给出顺序：

```text
Slide Job
  → Exhibit Family
  → Container
  → Notation
```

任务包括 Orient、Explain structure、Explain flow、Explain change、Compare、Decide、Monitor、Prove、Evaluate。九种样张是组合配方，不是穷尽的视觉本体。

### 2. 九种常用图式与失败条件

图式目录登记平台全景、分层架构、系统全景、泳道流程、方案矩阵、传统数量图、时间轴、证据摘录、经营复核。每个图式要求先给必需输入和 L1–L4 层级，并列出失败条件，例如：没有真实循环却画循环箭头、展示层级冒充执行顺序、流程箭头没有动作、方案没有依据的评分、比率缺少分母、预测画成实际、没有来源的引文、四张等权 KPI 卡替代分析。

入口：[`图式目录`](../../snapshots/local/career-kit/10-Vault/地基/企业汇报图式库/图式目录.md)。

### 3. 页面、容器和数据表达

本地图式库定义：L0 画布、L1 标题、L2 主展项、L3 辅助证据、L4 元数据；一个 Card 对应一个语义对象，避免 Card 套 Card；阴影只提示独立讨论对象，不证明权限或状态；Diagram 表达结构，Chart 表达数量，Table 负责查数，Card 承载独立工作对象。

视觉记号中，位置表达阅读顺序/层级/依赖，长度表达数量或时间跨度但必须有单位/尺度/基准，箭头只表示真实流转/交接，虚线不能同时承担预测、待审和例外三种含义，颜色不自动编码批准或实测。

入口：[`绘制规范`](../../snapshots/local/career-kit/10-Vault/地基/企业汇报图式库/绘制规范.md)、[`视觉记号`](../../snapshots/local/career-kit/10-Vault/地基/企业汇报图式库/视觉记号.md)、[`图式样张`](../../snapshots/local/career-kit/10-Vault/地基/企业汇报图式库/图式样张.html)。

### 4. 消费接口与信息保护

career-kit 的 AGENTS 明确要求渐进读取：先读图式库 README，按业务问题选一到两个图式，再读对应绘制规范；样张用于看几何/容器/L1–L4，不把占位文案和尺寸当业务数据；外部归因或争议才查来源索引；真实 LNG 案例不作为新项目依赖。

快照刻意不含 `10-Vault/项目展开-内部机密/`、LNG case、20-Submit、`_archive`、个人投递材料及 QA raster 图片；因此本地设计提炼没有复制客户/求职敏感内容，也不声称这些排除目录已被消费。

## 进入 Reporting Kit 的可复用裁决

以下是跨本地源与 reporting chat 的提炼建议：

1. 报告先登记 `claim/evidence/audience/intent`，再选 page job 和 visual primitive。
2. renderer 只能投影已有事实；没有来源、单位、状态或 scope，就降级为文字说明或待核实项。
3. 页面 review 至少经过 story/title-only、claim/evidence、grey/ink/squint、真实 render、受众 fit 和 anti-slop pass。
4. 设计参考按 Scout → Product precedent → Design system → Behavior primitive → Local decision 消费；截图不直接成为规则。
5. 对现有规则保留 adopted/proposed/candidate 状态；本地快照中的历史候选不能自动升格。

这些是本次离线提炼的候选治理，不替换来源项目的 owner contract 或治理裁决。

## 快照覆盖与处理状态

- **Courtwork 深读**：根 `AGENTS.md`/`README.md`、`engineering/design/README.md`、UX Grammar、Principles、Completion Surface、Object Command Grammar、Work Surface Boundaries、UI Composition Standard、Design Research Index、Design Scout、Local UI Atlas、状态/投影/primitive/review contracts、work-surface-kit README、指定 review/hand-off 文档。
- **Courtwork 目录级索引**：其余 `engineering/design/**/*.md` 与部分 design handoff/review 子目录已复制并按文件名/路径登记；manifest 标记 `indexed`，不宣称本轮逐件深读。
- **career-kit 深读**：根 `AGENTS.md`/`README.md`、`10-Vault` 入口、图式库 AGENTS/README、图式目录、绘制规范、视觉记号和样张 HTML。

逐文件 `processingStatus`、摘要分类、sha256、原路径和 mtime 见 [`../../intake/local-projects.json`](../../intake/local-projects.json)。

