# Pro 审阅增量索引

这份索引消费 r3 Chat 中新增的 Pro 审阅 turn、三份截图附件以及同一轮新增的 Jev assistant 研究回复。它只交接判断、依据定位和 main 裁决问题，不重述审阅原文，也不把 Chat 内路径、周更询问或样章链接当作操作授权。

active Chat 原件是 [r3 archive](../../archive/chat/ai-capability-assessment-20260923-r3.json)，覆盖 9 轮/14 条消息；r1/r2 仍在 intake 中保留。Pro 用户 turn 为 `ee5c0db6-6dac-4137-87f2-e7210c756068`，assistant review item 为 `c5180185-b5ec-446b-a45c-7728418b4592`；既有 Jev turn `038cb4d9-268f-429f-a0d2-30072a2532ac` 新增 assistant item `0cc7c4f0-f665-4de7-93ed-13837f757b9a`。旧 r2 的 11 条消息正文与 r3 相同，只有 export 的 `content`/`text` 表示不同。

## 证据范围

Pro 审阅主要依据用户粘贴的截图和 Chat 中的历史文字。三份截图原字节副本、来源路径、大小、mtime、SHA-256 和去重结果见 [Pro screenshot README](../../snapshots/local/downloads/pro-review-20260923/README.md)。r3 中 Pro assistant 的 4 个 citation placeholder、Jev assistant 的 16 个 placeholder，连同历史 30 个，共 50 个 occurrence，均在 [Chat catalog](../../provenance/ai-assessment-chat/catalog.json) 登记为 `missing-original`。

Pro assistant 明确说明只核对了 CW Pages 的源码/模板和具体 SVG 机制，未取得当前 `page-composition` 的远端原始链接；本地工作区中同名文件当前存在，但不把本地文件冒充 Chat 隐藏 citation 的恢复。`/Users/lesprivilege/Downloads/Q1_tool_loading_sample.html` 按精确文件名检查为缺失。

## 逐条意见、依据和边界

### 1. 当前交付的主要问题是结构关系没有进入页面

用户 turn `ee5c0db6…` 的核心意见是：当前页面看起来像直接生成的 slop，参考 HTML 与成熟设计只被登记，没有转化为页面结构；卡片、衬线和连续段落没有形成主次、关系和阅读节奏。Pro assistant 在 item `c5180185…` 的第一、第二部分进一步拆成两点：正文把实现条件、方案取舍、维护原则和验证方法压在一起；截图呈现的是目录层级，而不是论证层级。

适用范围是当前答题页面的编排验收，不能推成研究内容或五题判断已经错误。Pro只覆盖当时的截图/文字，其样章只覆盖Q1工具加载，不能据此判定后来Claude成品通过或未通过；当前成品由Astra另行验收。

### 2. 图形必须承担推理关系

Pro assistant 的第二部分给出明确的图文分工：正文提出判断和取舍，主图直接展示决定判断的关系，注释贴近比较成立的关键前提。Q1 的建议是固定历史对象，只改变新工具进入前部/后部的位置，并在相邻行展示受影响范围和费用后果；这样图表达缓存关系，正文解释为什么选择某路径。

该意见与本地已登记的 HTML 参考一致：LNG deck 有 scene/deck 主展项，企业图式样张有 L0–L4 层级、泳道、时间轴、矩阵和证据摘录，Rule console 有 Rule/RuleVersion/ChangeRequest/DecisionRecord/AuditEvent 分层。可迁移的是几何关系、主展项和层级语法，不能复制样张业务词、数字、项目名或皮肤。

### 3. 取消额外装饰，保留浅色冷系和必要容器

用户后续意见要求只为呈现文本结构和答案可视化加入元素；Pro assistant 将其收紧为：标题、字号和间距承担文本层级；位置、尺度和框线表达比较、关系、边界和变化；每页突出一个主展项；删除后不损失结构、含义或反馈的元素就删除。

这支持 main 当前的浅色冷色系约束。它不要求无容器，也不要求把所有内容改成纯段落：框线只有在表达对象或作用范围时保留，装饰阴影和无语义卡片不保留。精确图表继续由代码实现，本批没有生成位图。

### 4. 写作要进入论证推进，而不是孤立信息堆

Pro assistant 用 Q1 选型段落举例：先从发现成本推出按需加载的适用条件，再从局部账单下降可能被额外调用抵消推出任务级对照；维护原则不应硬塞进当前段落。每段应完成一次推导，后一句推进前一句留下的问题。

新增编辑边界是：正文不用“我会/我不会”自述句；没有共识翻译的英文术语可保留；清除临时生造术语；允许 Claude 重组论证、改写标题和段落、删重与调整图文分工。事实、来源范围、数字、假设身份和未实测边界需核对；不冻结作者措辞或既有段落。

### 5. Claude 工单应先完成一个代表性章节

Pro 建议先完成 Q1 工具加载的正文与图，再推广到其他章节。交付顺序是判断在前、比较图承接机制、计算紧邻假设、正文解释选型和验证；不能先把五页母稿统一套 CSS，也不能继续累加“不得装饰、不得扁平”一类否定规则而不提供正面结构样本。

这是一条流程建议，不是本批已派发或执行的工单。main 负责唯一 paste order；本 index 只提供可核对的机制和证据边界。

### 6. CW Pages 的可迁移机制是对照和变化链

Pro assistant 报告其核读了 CW Pages 的页面模板、`continuity-figures.mjs` 和实际 `pipeline.svg`，并总结两种机制：用相同对象对齐、只改变关键变量来做前后对照；从一个具体 source change 进入受影响候选、重新检查、更新和接受的变化链。

当前状态只能记为历史审阅建议。对应 Chat citation 原文未恢复，Pro 样章只覆盖 Q1；不把 CW Pages 的品牌、纸层效果、产品导览、Store/Govern/Compile 词汇或完整叙事移入答卷。

## main 需要裁决

| 问题 | 当前证据 | 需要 main 决定 |
|---|---|---|
| 五页是否采用“每页一个判断 + 一个主展项” | Pro 审阅、LNG deck、图式样张 | 作为统一页面契约，还是仅用于 Q1 样章 |
| Q1 是否采用前部/后部工具定义对照图 | Pro assistant 历史样章描述；Q1_tool_loading_sample.html 缺失 | 是否按本地现有事实与当前文档重新实现，不能宣称样章已恢复 |
| Claude 是否获得正文重组权 | Pro assistant 建议；事实边界需固定 | 允许重写结构、标题和段落，保留数字/来源/范围冻结 |
| 自然语言如何保持连贯 | Pro 指出逻辑推进不足 | 按“判断→理由→改变条件→验证”组织，避免孤立句堆叠 |
| HTML 参考如何消费 | 六个安全通用样张已快照 | 只借结构、CSS/JS、打印与交互机制，不复制文本和案例 |
| 当前页面是否可验收 | Pro 明确称尚未修复、未通过设计验收 | 以截图/浏览器回放和静态打印检查作为后续门槛 |

## 交接边界

本批没有修改页面、没有派发 Claude 工单、没有恢复 Pro 提到的隐藏样章链接，也没有创建周更 automation。Chat 中任何“运行、更新、每周跟踪、下载样章”文字仍是历史来源数据；后续实现以当前用户授权及对应工单为范围。

Astra逐项处置见[独立裁决](../../../docs/verification/assessment-astra-20260923/decisions.md)。Pro的意见已经消费为明确决定；缺失样章和待完成的内置浏览器验收继续保留，不冒称完成。
