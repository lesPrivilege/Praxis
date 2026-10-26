# 排列与刻度 · 清点与裁决

2026-10-04。上一轮把关系图的“成立程度”和“指向”各泛化成一页 Kit 条目，当时列出的第三条是“轨与挂接行”：几项内容沿一条线排开，行挂在线上。这一轮清点了仓库里这类排法怎样使用位置，对照四份公开规范的用词，泛化成 [排列与刻度](../../../dsh-praxis/kit/design/foundations/placement.md)。裁决见 [ADR-026](../../../docs/decisions/026-placement-and-scale.md)，样板在 [grammar-specimens](../../../projects/editable-native-svg/grammar-specimens/README.md)。

状态是 `distilled / partial / candidate`：清点由三个只读的 Claude Sonnet 子代理完成，Luna 在这个会话不可用；主会话重读了写进本页的每一行，其余行没有逐一复核。登记见 [intake](../../intake/placement-grammar-20261004.json)。

## 先更正一句话

上一轮的提议写的是“四个件的窄版是同一种构造：一条竖轨，行挂在轨上”。重读代码后，这句话只对两个件成立：`rel-tracks` 和 `rel-fan` 的窄版确实是一条竖线加挂在上面的行。`rel-qualify` 的窄版是左侧的括线，量的是一段范围；`rel-scope` 是嵌套的框，表示包含。四个件真正共有的是另一件事：它们都让位置说了话，却都没有写明说的是什么。

| 件 | 位置表示 | 当时写在哪里 |
|---|---|---|
| `rel-tracks` | 每条线自上而下是版本先后；间距不表示时长；几条线并排时同一高度不表示同时 | 只在源码注释里 |
| `rel-fan` | 分支的上下次序没有含义 | 没有写 |
| `rel-qualify` | 括线的起止是被限定的范围 | 图里有括线，另有文字指向 |
| `rel-scope` | 框套框是包含，边界表示什么必须写 | 图里逐个写明 |

`rel-tracks` 的宽版把三条各排各的版本线并排，材料 v2 和规则 v3 落在相近的高度，没有一句话说它们不是同时。这是本轮修的第一处。

## 仓库里沿一条线排开的做法

子代理列出五十四种构造，分布在原子编排实验、视觉工场、A01 样张、答卷线图、Palantir 打样和企业实验里。下表是主会话重读过的十九行，按位置实际回答的问题归类；“写明了吗”指图里有没有一句话告诉读者。

| 位置回答的 | 出处 | 做法 | 写明了吗 |
|---|---|---|---|
| 先后加时长 | `vault/distilled/layout-specimens-20260927/atoms/enum.html:69`（E01-b） | 纵向一格一分钟 | 写了：“纵轴按分钟等比（21:30–22:00，1 分钟 = 1 格）” |
| | 同目录 `quantity.html:774`、`quantity.css:421`（Q07-b 宽版） | 横向位置按天数 | 写了：“位置按真实天数” |
| | 同目录 `quantity.css:407`（Q07-b 窄版） | 竖排，上间距是天数乘 1.1 像素，再加文字高度 | 图题仍写“位置按真实天数”，实际已不严格成比例 |
| | 同目录 `quantity.html:780` | 停开五晚画成比例轴上的一个点 | 没有；同页 `:748` 自己把“区间事件被画成一个点”列为已见失败 |
| | `projects/visual-grammar/attention-grammars/scene.js:261–262` | 三条轨共用一条按秒的横轴 | 没有刻度，也没有说三条轨共用 |
| | `vault/distilled/design-grammar-atlas-20261002/a01-reading-relations/specimen.css:112` | 三段的宽度按分钟 | 卡片里没有，说明在卡片外的画廊文字里 |
| 只有先后 | 同目录 `quantity.css:559`（Q09-b） | 五个等宽的列，时刻间隔是 15、5、10、10 分钟 | 没有 |
| | 同目录 `enum.css:89`、`enum.html:87`（E01-c） | 五个等宽的列，横向是步骤次序 | 图题只写“按执行角色分道” |
| | `projects/visual-grammar/event-state-context/scene.js:124` | 事件卡片每 256 像素一格，事件的播放时刻并不等距 | 没有 |
| | `projects/enterprise-grammar-lab/web/workbench/AuditTimeline.tsx:26`、`backend/payment/domain.ts:391` | 时间线等距，新的在上 | 方向和间距都没有写 |
| | `vault/distilled/ai-capability-assessment/rendered/exhibits.py:197` | 四段等距 | 写了：“刻度间距不代表实际时长” |
| 是不是同一个 | 同目录 `quantity.css:579`、`quantity.html:1041`（Q09-c） | 泳道的同一列是同一时刻 | 靠表头；窄屏丢掉后，画廊文字承认“这是泳道在窄屏上的真实损失” |
| | `vault/distilled/ai-capability-assessment/rendered/exhibits.py:417`、`:422` | 两条道各排各的，只有一条“现在”的竖线是共用的 | 写了：“两项分别审查，一项的理由不能用于另一项” |
| | `projects/palantir-discovery/index.html:1044–1047` | 前后两栏按属性对齐，格子里写“不变”“未知” | 靠表头 |
| | `vault/distilled/layout-specimens-20260927/specimens.json:6624` | 两份同构的算式并排 | 记为失败：“并排两份 V04-a 的步骤行不能跨槽对齐” |
| | 同目录 `patterns/patterns.html:1065` | 日历时间和周序两种坐标并在一个单元里 | 画廊文字承认同一事件落在两种坐标上，连不起来 |
| 属于谁 | 同目录 `atoms/wayfinding.css:30–31`（W01-c） | 每层缩进 12 像素，另写“章、节、小节” | 写成了词 |
| | `vault/distilled/ai-capability-assessment/rendered/style.css:146`、`:151` | 分支树的缩进加一条竖线 | 没有写缩进表示什么 |
| 位置未知 | 同目录 `atoms/evidence.html:186`（V02-c） | 已知时刻是实心点；只知道时长、不知道落点的一段悬在轴上方，不贴刻度 | 写了“位置未知” |

读下来有三点。写明的和没写明的大约各占一半，写明的几处都读得对，没写明的几处要靠旁边的数字自己换算。等距被读成等长是最常见的一类，原子编排的 [catalog](../layout-specimens-20260927/catalog.md)第 547 行早已记为已见失败。并排是否共用一条尺是组合层的事：同一份 catalog 第 962 行写着“共享尺度是组合性质，需组合层声明”，但没有哪一页把它写成约束。

## 仓库已有的说法

主会话重读了下面几句，新页面与它们一致，没有改动它们。

- [图形编码](../../../dsh-praxis/kit/design/composition/encoding.md)：“数量比较需要共同尺度”“长度有尺度”。
- [空间编排](../../../dsh-praxis/kit/design/composition/layout.md)：“并置支持同时比较，堆叠支持连续阅读”“宽窄投影可以改变排列，但比较口径和必要条件应当可达”。
- [视觉渲染评审](../reporting/visual-renderer-review.md)第 62、63 行：“时间轴用真实间距；若为顺序排列，注明不是比例时间”“同一图组比较同一量时共用尺度；不同尺度分开并直标”。这两句来自 career-kit 的快照，一直留在 Vault，没有进 Kit。
- [工单二的迁移题](../design-kit-workorders-20261002/wo2-unfamiliar-briefs/README.md)第 73、88 行：三步用时是约数、区间和未知时，读过 Kit 的和不读仓库的都拒绝画比例尺，理由是“未知画不出长度，分钟和工作日差两个量级”；三步同单位而其中一步是区间时，都用了比例尺，把区间画成实心加斜纹。同页第 92 行写着“仓库里没有画区间的规则”。
- [A01 样张](../design-grammar-atlas-20261002/a01-reading-relations/README.md)第 13 行，变体丙：三个环节共用一条时间尺，处置是“保留，限时长有差别的日程”。

新页面补的是两处空白：只表示先后时要说间距不表示时长；并排的线要说是否共用一条尺。另把“没有量就不按比例画”从一次冷读的观察写成约束。

## 外部用词的对照

读了四份公开文档，逐条登记在 [来源卡](../../provenance/placement-grammar-20261004/cards/README.md)。

- [Vega-Lite 的 Scale 文档](https://vega.github.io/vega-lite/docs/scale.html)把尺度分成连续的（linear、time 等）和离散的（ordinal、band、point）。band 尺度把范围“分成均匀的带”，位置由项数决定，不由数值决定。本页的“只有先后”与“先后加时长”对应这两类；文档没有说离散尺度“不表示大小”，这一句是本仓库的推断。
- [Vega-Lite 的 Resolve 文档](https://vega.github.io/vega-lite/docs/resolve.html)规定几个视图拼在一起时，每个通道的尺度要么 shared，要么 independent，独立的尺度意味着各自的坐标轴。本页第 6 条“要么共用一条标尺，要么写明各排各的”与它是同一个选择。各种拼法的默认值在另外四页，没有读。
- [W3C Time Ontology in OWL](https://www.w3.org/TR/owl-time/)（Candidate Recommendation Draft，2022-11-15）分开定义 Instant 和 Interval；`before` 只比较一个的结束与另一个的开始，不涉及时长；它还提到序数式的时间参照系是“一列有名字的区间，不一定等长”。这支持“先后”和“时长”是两个问题。结束未知的区间它没有说。
- [WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/)的 `aria-level` 把层级写成一个从 1 起的整数，文档结构不能准确表示层级时要求明确写出。本页第 1 条“每一项自己带着位置词”取的是这个做法；生成的 SVG 在每一行上写了 `data-level` 和 `data-position`，没有使用 ARIA 的树角色。

## 落位

| 内容 | 位置 |
|---|---|
| 泛化的判断，不带参数 | `kit/design/foundations/placement.md` |
| 先后、时间、上下级、并排的栏 | `projects/editable-native-svg/svg-01-relations/src/rail.mjs`，版本 0.3.0 |
| 前后对照与选取 | 同目录 `pair.mjs` |
| 三级做法的样板 | `projects/editable-native-svg/grammar-specimens/` 的第三节 |
| 清点的逐行表 | 没有入库。三份报告留在会话记录里；本页只收主会话重读过的行 |

## 缺口

使用证据只有同一名制作者在合成内容上做的两个生成器和一页样板，冷读与对照的结果见 [验收回执](../../../docs/verification/placement-grammar-20261004.md)。时长本身是区间时怎样画、标尺怎样断开、“现在”画不画，都没有进默认。横排没有做。外部来源只读了四份，甘特图、泳道图各自领域的约定没有查。
