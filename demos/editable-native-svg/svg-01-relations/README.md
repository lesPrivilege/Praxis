# SVG-01 · 四个可编辑的关系图件

版本 `0.2.0`，2026-10-04（`0.1.0` 是第一批的交付；`0.2.0` 把成立程度和指向统一成共用的一套，并加了组合件，见下方“0.2.0 的变化”）。工单 [SVG-01](../work-orders.md)，接收基线为 Praxis `9514ce4`（登记包的交接基线 `d4fd387` 之后，main 多了企业工作面实验的两个提交；登记补丁在新基线上无冲突应用，九个受影响入口里只有 `demos/README.md` 有别人的新增行，已保留）。分支 `claude/editable-native-svg-01-20261004`，登记包和本作品各一个提交，已按用户要求并入 main 并推送到远端。

实际执行者是 Claude Opus 5.5（`claude-opus-5-5`，Claude Code 桌面端的一个新会话）。独立复查由一个只读的 Claude Sonnet 子代理做，结果见 [验收回执](acceptance.md)。用户尚未 review，四个件都还是候选。

| 当前需要 | 入口 |
|---|---|
| 看图 | [index.html](index.html)，可直接用 `file://` 打开，不需要 JS 和网络 |
| 改图 | 改 [inputs/](inputs/README.md) 或上层 [fixtures.json](../fixtures.json)，再运行 `node src/build.mjs` |
| 取用单张 SVG 或对象坐标 | [svg/](svg/README.md) 与 `svg/manifest.json` |
| 读实现 | [src/](src/README.md) |
| 核对验收 | [验收回执](acceptance.md) 与 [evidence/](evidence/README.md) |

## 任务与取舍

SVG-01 要求先画可编辑的关系与限定（R01–R10、R17、R18），选一个足以支撑后续组合的小集合，检验端点、包含、范围和文字能否分别修改。本批没有按需求一项画一件，而是按“输入的形状相同、排法相同”合并成四个生成器，各自由一份语义输入生成宽、窄两版静态 SVG。

| 件 | 回答的问题 | 覆盖的需求 |
|---|---|---|
| `rel-fan` 分支与汇合 | 一个对象有几条去向、各由什么条件决定；几项输入怎样汇到一处 | R01、R02、R03 |
| `rel-scope` 范围与跨界 | 谁在哪个范围里，哪些关系越过了边界 | R04、R05 |
| `rel-qualify` 限定与证据 | 条件、注释、证据各自限定哪项主张或哪几个字 | R06、R07、R08 |
| `rel-tracks` 版本与绑定 | 各对象的版本，以及判断、建议、候选绑定在谁的哪个版本上 | R17，R08 的版本定位，R09 和 R18 的一部分 |
| `rel-sheet` 组合（0.2.0 新增） | 几件图叠成一张，靠共同的指向连起来 | R27 的一次试作；不是 SVG-03 的替代 |

没有画完的三项，去向如下。

- R09 只画了一半。一个对象上的当前版本、候选、拒绝和重放用 `rel-tracks` 表达，F02 能照此画出。具名状态之间的转移图（三到六个状态、非法转移）没有画，它的形状是多中心的图，`rel-fan` 一次只画一个中心。留给 SVG-03 的 R25 决定是另做一件，还是用几个 `rel-fan` 由组合层连接。
- R10 没有画。前后对照的每一行是同一个字段的两个值，本质是一张表；单独使用时 HTML 表格更合适，也是合同允许的。`rel-tracks` 只在每个版本下写出字段值，没有标差异。
- R18 只画了一半。上下文选入和没有选入的字段写在绑定行的文字里，没有画字段到槽位的映射。它和 R10 的形状相同（同一字段在两列里对齐），建议合并成一件“同身份字段行”，等 R25、R27 或 R30 确实需要把它嵌进图里时再画。

画法按 [成立程度与归属的标记](../../../kit/design/foundations/standing.md)的默认分配：线型回答“生效了吗”，端点回答“确认了吗”，蓝色只标等人决定的那一处，归属写成字。每个回答同时写成词，图例由图自己生成。

## 怎么改

改语义输入，不改几何。每份输入是一个 JSON 对象，字段见各生成器开头的 `validate`。常见修改与对应字段：

| 要改的内容 | 字段 |
|---|---|
| 对象的身份与标签 | 各对象的 `id`、`label`（主张是 `text`） |
| 关系的端点 | `rel-fan` 的 `spokes[].node`，`rel-scope` 的 `crossings[].from/to` |
| 关系的依据 | `basis`：一条指向 `{ id, label, version, locator }`；说不出身份时写 `{ text }`，图上标“未定位” |
| 分支条件、默认分支、汇合规则 | `spokes[].label`、`spokes[].default`、`rule` |
| 关系是否成立 | `state: "pending"` |
| 成员属于哪个容器、容器嵌套 | `members[].container`、`containers[].parent` |
| 限定语限定谁 | `qualifiers[].target`：`claim`、`claims` 或加 `fragment` |
| 证据的关系与核对状态 | `relation`、`status`、`source`（同样是一条指向） |
| 是否画图例 | 生成时的 `legend`，默认画；组合时由整张图统一画一次 |
| 判断绑定哪个版本 | `bindings[].basis`：`id`、`version`、`locator` |
| 容器宽度 | 生成时的 `width` |

生成的 SVG 里，语义身份写在 `data-*` 属性上，和 DOM 的 `id` 分开：

| 语义 | 元素 |
|---|---|
| 对象 | `<g data-object-id data-role>` |
| 关系 | `<path data-edge-id data-from data-to data-state>` |
| 一段文字 | `<text data-text="对象或关系的 ID.字段">`，一行一个 `<tspan>` |
| 限定语、括线、引线 | `<g data-qualifier-id>`、`<path data-bracket-for>`、`<path data-leader-for data-target>` |
| 片段 | `<tspan text-decoration="underline" data-fragment-of>` |
| 版本、绑定 | `<g data-version="对象@版本">`、`<g data-binding-id data-origin data-state data-basis="对象@版本#定位">` |

## 可编辑的边界

三种形态能改的程度不同。

- 语义输入：上表的修改都支持，图、等效文字、`manifest.json` 和预览页一起重建。
- 单个 SVG 文件：文字是文字节点，可以直接改字；但文件里没有排版逻辑，文字变长后外框和连线不会跟着动，改端点只能手改坐标。需要这类修改时回到输入。
- 预览页：由 build 生成，不单独维护。

目前做不到的：字号不是参数（正文 14、辅助 12）；配色只能改 `src/kernel.mjs` 的 `T`，默认为浅色背景设计；只放大文字不缩放页面时 SVG 文字不会跟着变大，页面整体放大到窄视口时由预览页换成窄版；双向文字没有测试；没有在任何图形编辑器里做过保存再打开，所以不声称支持哪个编辑器。

各件测试到的规模写在预览页每一节的“测试到”，超出时生成器以 `capacity` 拒用，不缩小字号硬画。

## 组合接口

每次生成返回并写入 `manifest.json` 的 `boxes`（对象 ID 到外框）和 `labels`（文字标签的位置与预留宽度），坐标与该 SVG 的 viewBox 同一坐标系，单位是用户单位，没有额外的 transform。每次生成还返回 `mentions`：图里每一处写到的指向和它所在的位置。`rel-sheet` 用这两样把几件图连起来：一件里写到的 `对象@版本` 如果是另一件的 `boxes` 里的键，就在左侧留白处连一条浅线。它只处理上下叠放的窄版布局，最多五个被指到的对象或版本；更一般的组合仍留给 SVG-03。同一页放多个实例时给每个实例不同的 `scope`。

## 0.2.0 的变化

- 四个件的状态词收进 `src/standing.mjs` 一张表，每个取值对应一个词、一种线型和一种端点。`rel-qualify` 里“推断，未核对”的证据不再用虚线，改为实线加空心端点；虚线只留给尚未成立或没有生效的内容。
- 依据、来源和绑定统一成一种指向 `{ id, label, version, locator }`。`rel-fan` 和 `rel-scope` 的 `basis` 不再接受一句话；`rel-tracks` 的 `lane`、`rev` 改名为 `id`、`version`。旧写法没有保留。
- 每张图自动带图例，只列图里出现的画法。
- `rel-tracks` 在绑定的版本不是当前版本时标“非当前版本”。
- 新增 `rel-sheet`。
- 检查脚本的浏览器段改用屏幕坐标，能量嵌套在组合图里的文字。

## 运行

```sh
node src/build.mjs   # 重建 svg/、manifest.json、index.html
node src/check.mjs   # 自动检查，写 evidence/check.json；浏览器段需要本机 Chrome
```

没有安装任何依赖。浏览器段调用本机已有的 Chrome 无界面模式，路径可用环境变量 `CHROME` 指定；找不到时这一段记为未运行。

## 来源与许可

代码、输入和图形都是本批新写的，没有复制任何库的源码、图形、字体或数据。字体使用系统字体，文件里不带字体。方法上的参考如下，都只取了做法：

- [REF-COMP-002 注释保持邻接](../../../kit/design/references/curated/note-adjacency.md)：限定语在内容顺序上紧跟所限定的主张，宽版再摆到右侧。本批的用法是它的一次新消费：多条和长条的限定语在两种宽度下都没有碰撞（见验收回执 P02），但对象换成了 SVG 里的主张列表，不是正文段落。
- [原子编排筛选记录](../../../vault/distilled/layout-specimens-20260927/review.md)里 T05-c 的失败：括线围住了条件块，目标只靠标签表达。`rel-qualify` 反过来让括线量被限定的主张，并用自动检查核对。
- 研究页的 [S01、S04、S05、S08](../../../vault/distilled/editable-native-svg-20261004/README.md)：分组与 title/desc、复杂图的长说明、数据与几何分开、关系输入与生成几何分开。S02（SVG 文本）的正文登记方没有读到，本批没有使用 SVG 2 的文本换行，换行由生成器自己算。
- 成立程度和指向的写法依据 Kit 的 [两页判断](../../../kit/design/foundations/README.md)，它们由本作品泛化而来，见 [ADR-025](../../../docs/decisions/025-relation-marks-and-anchors.md)。
- 页面文字按 [Write / Prose](../../../kit/write/prose/README.md)写；配色与线型取自用户此前对视觉的要求（浅冷色、单一强调色、实线已定虚线未定）。

## 下一步

用户 review 之后，可用的件 ID 交给 SVG-02 和 SVG-03。交接时需要带上的真实情况：图件的版本是 `0.2.0`；R09 的状态转移图、R10、R18 的字段映射没有画；组合件只是一次试作；编辑器往返、读屏、Motion 和 Flash 消费都没有做。维护者是本项目，重访的触发条件是：换字体或平台后文字溢出、真实任务里出现超出容量的输入、组合时发现外框或坐标约定不够用。
