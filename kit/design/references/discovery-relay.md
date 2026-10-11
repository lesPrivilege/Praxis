<a id="asa-g-discovery"></a>

# 从集合到作品，再到可用操作

稳定 ID：`ASA-G-DISCOVERY`。normal / reference。用于“找些会呼吸的界面”“想要有材料感的图表”等尚无材料名的探索任务；产物是两条可比较的设计假设及其证据边界，而不是一份长网址清单。

先把意图写成关系：哪些对象变化、哪些对象保持、谁感知变化、在哪种媒介交付。然后用集合的原有分类找到候选，回到单件作品和作者说明，最后另找实现契约。保留作者的名称、贡献者与文化语境；本仓库的操作词只增加一个索引，不替换原分类。

| 入口 | 原有组织方式 | 下一跳 | 不能带过去的结论 |
|---|---|---|---|
| [Rhizome ArtBase 指南](../../../vault/provenance/art-software-atlas/discovery/cards/rhizome-guide.md) | artwork、variant、actor、description、access point 与关联查询 | 某作品 → 某变体 → 环境、来源与保全行为 | 有档案条目不代表原作仍可运行；档案变体不能归为艺术家新作 |
| [Rhizome 数据模型](../../../vault/provenance/art-software-atlas/discovery/cards/rhizome-model.md) | 独立的作品、变体、参与者、文本、事件与保全记录 | 先确认正在谈的是哪一实体，再引用主张 | 提议中的模型不等于全部已经实现；结构化字段不能取代作者声明 |
| [Codrops demos](../../../vault/provenance/art-software-atlas/discovery/cards/codrops-demos.md) | 布局、状态转场、幻灯、排印、hover、cursor 等栏目 | 某 demo → 作者文章 → 源码与许可 → 实测 | 目录视频与流行度不证明可达性、生产适用性或某库授权 |
| [Awesome Creative Coding](../../../vault/provenance/art-software-atlas/discovery/cards/creative-coding-directory.md) | books、tools、learning、communities 等，工具再分框架、视觉/声音编程等 | 工具官方文档或艺术家原作 | 列表作者的推荐不证明每项仍维护，也不统一各项目许可证 |

## 可控制的发现过程

同一个形容词至少试两种机制。“呼吸”可能是低频振幅、曝光变化、留白密度或交互后的恢复节奏，不自动等于缩放动画。保留一件反例：无动画而有节奏的编辑页，或大量运动却无法保持对象身份的演示。检索操作是换关系、换媒介、沿作者相邻作品、沿依赖/引用上溯，不是只换一组风格同义词。

每次先读入口摘要；必要时再打开作品说明及一件实际输出。运行需求触发代码/环境检查；资产复用触发逐项许可检查。做到能够写出一个可调变量、一个不变量和一个失败条件即可停止这次读取，把未读候选留为 lead。使用 linked data 或本地 JSON 索引均可保留实体关系；本批选择后者，避免为有限书目搭建未经消费的服务。

反例：从某目录读到“WebGL”的标签，就把其下全部作品标成 WebGL；从某截图觉得“日本感”，就补一个传统名；看到 MIT 仓库就把其中摄影、字体一并当 MIT。这些都须退回具体 URL、具体主张与具体权利对象。

来源接力支持发现，不替消费设计师作创意裁决；拒绝某候选及其理由也是合法产物。集合抽样的完成标准与下一轮流向见 [研究流地图](../../../vault/provenance/art-software-atlas/streams.md)，实际读取范围见 [记录](../../../vault/provenance/art-software-atlas/discovery/CHANGELOG.md)。
