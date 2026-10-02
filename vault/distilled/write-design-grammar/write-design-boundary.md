# Write 与 Design 的 ownership 边界

状态：`candidate`。来源包括 `6ab72e8e-00f0-83ec-b5e1-1155a6e6c68c` 的 turn `bbb21e83-d73a-4a39-82dc-0eda0bebf39a` / assistant item `c3bd95ec-3bb3-4362-a49d-ad5feb0022ab`，以及 `6ab64deb-7870-83ec-8e5c-0f78ccd7340b` 的 turns `bbb21d86-a7ee-4660-b1ec-7316f96e1d4d`、`bbb21a37-d882-42a2-a3f7-678859995aef`。

## 语义与媒介的分工

候选一句话是：**Write owns semantic necessity；Design owns aesthetic possibility / treatment。**

Write 处理内容如何被人阅读、理解和复核：

- 文字、标题、段落、术语和 Markdown 的组织；
- 信息层级、阅读顺序、对比/流程/时间/证据该选什么 exhibit；
- 图表的 semantic job、输入范围、标题、description、annotation、caption、note、source；
- citation、footnote、provenance 和 method 的邻接关系；
- 少量服务阅读的 interaction，例如定位、展开脚注、跳转引用、查阅 evidence、横向比较和必要的精确值查看。

Design 处理媒介自身如何被感知、操作和运动：

- 色彩语义、字体 treatment、iconography、stroke、surface、radius、shadow 和 token；
- 产品的 navigation、workspace、composer、state、responsive behavior；
- interaction feedback、focus、interruption、transition；
- motion、video、Remotion、镜头、材质、音频与动态排版。

因此同一个 chart 可以由两边共同消费：Write 决定为什么画、画什么、如何标注和核验；Design 决定色彩、线条、字体渲染和视觉 polish。两边应通过语义接口依赖，而不是复制两套 design system。

## 强度与范围

对话建议把 Write 条目分成 `Rule`、`Default` 与 `Taste`：Rule 必须遵守，Default 无特殊理由时采用，Taste 只描述期望气质。它还建议以 plain text 为 baseline，只有前一级表达不足时才升级到 list/definition、table、simple exhibit、chart/diagram 或复杂 composition。

## 当前裁决

初次消费后的边界由 [ADR-015](../../../docs/decisions/015-kit-editorial-contract.md) 收敛：Reporting 维护材料目的、论证关系、证据职责和阅读顺序，Writing 处理成文表达，Design 维护视觉编码、层级与交互取舍。项目特定的配色、字体、动效和交付参数留在 Vault profile；本目录不把它们提升为跨项目规范。

本轮后续采纳由 [ADR-016](../../../docs/decisions/016-progressive-kit-structure.md) 把这条边界落实为可发现的任务入口：[Write / Prose](../../../kit/write/prose/README.md) 负责成文与审校，[Write / Publish](../../../kit/write/publish/README.md) 负责空间编排与展项职责，[Write / Motion](../../../kit/write/motion/README.md) 负责认知任务、分镜与时间交接，[Write / Shared](../../../kit/write/shared/README.md) 负责证据与跨媒介验收；[Design](../../../kit/design/README.md) 的 `foundations/`、`composition/`、`interaction/`、`motion/`、`references/` 负责视觉、编码、状态、运动与参考回查。该目录化落位不创建第二套 ownership contract，也不代表 renderer 或 schema 已采纳。
