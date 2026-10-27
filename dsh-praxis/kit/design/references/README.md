# Design 参考路由

按设计任务查成熟方法与样张的取用方式，并分清本仓库的采纳状态、来源核查与实现验收。

`accepted` 表示本仓库对特定用途的采纳。

## 已验收用途的优先入口

遇到[窄屏比较](curated/comparison-continuity.md)或[局部注释的宽窄邻接](curated/note-adjacency.md)，先读对应卡片；其余任务从下表查普通参考。两卡仅验收结构方法的查阅用途，代码与数据缺口仍明确保留。完整名单及维护见 [Curated](curated/README.md)。

## 按任务进入

| 任务 | 入口 | 可得内容 |
|---|---|---|
| 组织内容、关系、数据图和页面节奏 | [composition.md](composition.md) | 关系图、数据图、导航、动效和版式参考的借用范围与反例 |
| 定义产品界面、控件状态和可访问性检查 | [interface.md](interface.md) | 尺寸、焦点、对象状态、表面层级与 donor 的消费范围 |
| 查找成熟设计系统或前端参考 | [systems.md](systems.md) | 各家可借的组织方式与不照搬的部分 |
| 对照已有产出与实验样张 | [specimens.md](specimens.md) | 历史产出与原子实验的取用方式；区分结构参考、profile 与未验收实现 |
| 判断营销演示、源码、标准说明和已测行为各能证明什么 | [读来源](reading-sources.md) | 保留证据差别，找到需要补读的具体材料 |
| 把风格名（Swiss、Bauhaus、Y2K 等）换成可检验的构成关系 | [languages.md](languages.md) | 名称与别名、所指范围、可以试的关系与名字推不出的内容；不含主题参数 |

Opus 作品的取用价值由作品内容和验证范围判断，模型归属按来源记录。已采纳的设计语法见 [Design 各分支](../README.md)。

从织物、编辑、空间、乐谱、规则、软件组件或 agent 设计生态探索新方向，先读 [艺术与软件操作入口](art-software-atlas.md)。

## 按样张比较

- 需要比较原子、pattern 和完整页时，读 [样张](specimens.md)；需要已经提炼的查阅方法，优先进入 [Curated](curated/README.md)。
- 需要页面结构、图文邻接或组织关系样张时，从 [编排参考](composition.md) 开始。
- 需要答卷成品的宽窄版本、翻页、打印和离线检查时，进入 [样张](specimens.md)，再按它的边界回到编排与界面参考。
- 需要一次性页面风格或动效样本时查 [编排参考](composition.md)；这些记录保持 profile/reference 语义，不能直接当作全局视觉规范。

## 使用边界

项目应在自己的 index 记录实际使用的参考、来源版本、调整理由、验证和重访条件。跨项目反复消费后，是否回流 Design 语法仍由架构治理裁决。

`verified`、`partial` 是 URL 来源证据状态，和 `accepted`、`reference`、`rejected` 等 Kit 消费状态分开。
