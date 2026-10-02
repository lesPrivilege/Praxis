# Design 参考路由

本目录承载 Design 参考的分支索引。旧入口 [references.md](../references.md) 保留为兼容导航；稳定 ID、状态、消费语义、边界和证据以本目录对应分支为准。这里的 `accepted` 表示本地消费处置，不表示来源主张已经核实，也不表示当前实现或渲染已经通过。

## 已验收用途的优先入口

遇到[窄屏比较](curated/comparison-continuity.md)或[局部注释的宽窄邻接](curated/note-adjacency.md)，先读对应卡片；其余任务从下表查普通参考。两卡仅验收结构方法的查阅用途，代码与数据缺口仍明确保留。完整名单及维护见 [Curated](curated/README.md)。

## 按任务进入

| 任务 | 入口 | 稳定 ID | 先得到什么 |
|---|---|---|---|
| 组织内容、关系、数据图和页面节奏 | [composition.md](composition.md) | C01–C25 | 从关系、导航、动效和版式样本中选择表达方式，并保留各条边界 |
| 定义产品界面、控件状态和可访问性检查 | [interface.md](interface.md) | U01–U09 | 尺寸、焦点、对象状态、表面层级与 donor 的消费范围 |
| 查找成熟设计系统或前端参考的原文入口 | [systems.md](systems.md) | ref-* | 逐 URL 的状态、消费语义、证据卡片和重访触发 |
| 对照已有产出与实验样张 | [specimens.md](specimens.md) | P01、LAB-20260927 | 历史答卷、原子实验及局部筛选；区分结构参考、profile与未验收实现 |
| 把风格名（Swiss、Bauhaus、Y2K 等）换成可检验的构成关系 | [languages.md](languages.md) | VL01–VL08 | 名称与别名、所指范围、可以试的关系、名字推不出的内容和逐来源状态；不含主题参数 |

## 需要原文或证据时

- 逐条的外部语义提炼见 [Design reference semantics](../../../vault/distilled/design-reference-semantics/README.md)。它解释为什么消费某条参考，但不替代本目录的 ID、状态和证据路径。
- `ref-*` 的原 URL、canonical URL、核验差异和访问状态见 [systems.md](systems.md) 链接到的 Vault 卡片；卡片标为 `partial` 或缺少正文快照时，引用前重访原页面。
- 本地样本、历史提交坐标和未快照来源仍按条目中的证据说明处理；本目录不复制外部原件，也不把在线可访问当作本地快照。

## 按样张比较

- 首选不匹配、要比较条件作用范围、反例或其他原子时，从 [实验索引](../../../vault/distilled/layout-specimens-20260927/index.html) 按语义家族找变体；机器读取使用同目录 `specimens.json` 的 `job`、`input_shape`、`use_when`与`avoid_when`，不预读280个样张。
- 需要比较原子、pattern和完整页时，读 [LAB-20260927](specimens.md#lab-20260927--原子化编排实验)；需要已经提炼的查阅方法，优先进入 [Curated](curated/README.md)。

- 需要页面结构、图文邻接或组织关系样张时，从 [C04、C10](composition.md) 开始。
- 需要答卷成品的宽窄版本、翻页、打印和离线检查时，进入 [P01](specimens.md)，再按它的边界回到 C/U 条目。
- 需要一次性页面风格或动效样本时查 [C20–C25](composition.md)；这些记录保持 profile/reference 语义，不能直接当作全局视觉规范。

## 使用边界

先读本页选择分支，再读该分支的任务小节；只有任务需要时才沿条目证据链接回 Vault。项目应在自己的 index 记录实际使用的 ID、来源版本、调整理由、验证和重访条件。跨项目反复消费后，是否回流 Design 语法仍由架构治理裁决。

状态词表沿用 [status vocabulary](../../../docs/governance/status-vocabulary.md)。`verified`、`partial` 是 URL 来源证据状态，和 `accepted`、`reference`、`rejected` 等 Kit 消费状态分开。
