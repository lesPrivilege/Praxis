# ADR-031：术语取最稳定的说法；讲解页的编排留作参考

日期：2026-10-12。状态：accepted（用户裁决）。主会话（Claude Opus 5.5）提炼并编订；Luna 在本环境不可用，分区调研由六个 Sonnet 只读代理完成，文字的独立审阅由一个 Opus 只读代理完成。

## 问题与依据

[DeerFlow 讲解页](../../demos/deerflow-explainer/README.md)是一次用 Kit 做的交互讲解。用户目验通过后说：“可以 distill 完成 kit 维护了。”制作过程中用户给过四条意见，其中两条 Kit 里没有：

- 术语。“有些术语类 grammar，建议优先采纳最稳定的语义，一般是英文，而不临时作生硬翻译，这反而更能达意，尤其是 ai 与 agent 这个领域，这也会作为 writing kit 的小修订。”初稿把 agent、run、artifact、StreamBridge 等译成了智能体、运行、产物、流桥，独立审阅没有把它列为问题。
- 读者与颗粒度。“颗粒度需要经得起追问，但不会到源码技术细节的程度”；“不预设角色是 pm，pm 只是颗粒度参考，其依然可能是工程师背景，只是不再 review code”。

另外两条是对形式的裁决：连续的 HTML 优先于 16:9 幻灯片，HTML 的交付为内容服务；验收后可以提炼成后续交付的指导，“但不过拟合，为具体主题服务”。

过程与去向的对照见[回执](../verification/explainer-distill-20261012.md)。

## 决定

- **[成文原理](../../dsh-praxis/kit/writing/principles.md)第 6 条写明术语取最稳定的说法。** 在术语主要以英文流通的领域，稳定的通常是英文原词，直接使用，不临时造译名；已经通行的中文说法照用；英文原词首次出现时交代一次含义。[审阅方法](../../dsh-praxis/kit/writing/review.md)的偏差表加一行，裁决记录加一条。强度不变，仍是中文语言约定。
- **Publish 新增 [讲解页的编排](../../dsh-praxis/kit/publish/html/explainer.md)，作为可以取用的参考。** 写每个局部回答的四问、四层的可见性、事实底稿要留下的四样东西、可以调的三处、一个正例和三个反例。Publish 入口加一处指向它，写明不是必经步骤。
- **[成立程度的标记](../../kit/design/foundations/standing.md)“可以调整的情形”加一句。** 供读者点选或步进的图里，强调色可以改作“当前选中”，写进图例；它与“等人决定”不放进同一张图。
- **稳定语义的记号、控件与运动，写成工单交给独立的 ClaudeDesign 绘制。** 用户先问能否在 Kit 里备一套原生 SVG 图标，随后指定：“派一单 paste，我交给独立的 ClaudeDesign 绘制”，范围是“HTML 与 video 两种编排方式里那些能够承载稳定语义的指引或控件”，Kit 中的 Design 参考可用。[工单](../../demos/editable-native-svg/claude-design-order-20261012.md)全文自足。用户对成果的期待是：“可以推广和泛化，会是一套稳定的 grammar，同时消费时不会过拟合，不限制下一次开工时取用或重新绘制。”工单因此要求 grammar 与这一版的画法分开写。成果回交后是候选，用户 review 之后再进 Kit；这次 Kit 里不新增图标或组件，也不加发现链接。

## 没有进入的

- 讲解页的具体参数：章数、配色、字号、八个图件的造型和实现。它们留在项目里。
- 分区调研的任务书。[工单原文](../../demos/deerflow-explainer/research/BRIEF.md)留在项目里；“把研究交出去”在 [工作开展方式](../../kit/environment/working-methods.md)已有备用素材，没有再写一份。
- 哪些中文术语算“已经通行”的清单。按读者和领域判断，不列表。
- 独立审阅把结构文字和冷读合成一轮的做法。只用过这一次，审阅页已有的两种做法没有改。

## 与既有决定的关系

在 [ADR-027](027-prose-review-goal-and-structural-text.md)、[ADR-028](028-narration-genre-and-cold-read.md)之上扩展成文原理第 6 条，不改它们的决定。讲解页的编排按 ADR-028 之后“可取用的参考、不是必经步骤”的写法进入。强调色的那一句是 [ADR-025](025-relation-marks-and-anchors.md)默认分配的一个可调情形，默认不变。记号与控件的去向遵守 [ADR-002](002-promotion.md)和可编辑原生 SVG 项目“候选不进 Kit 组件库”的约定。

## 验证与重访

仓库验证结果见回执。三处修订都没有对照：没有留一份不读新条文的产出来比较，按 [ADR-021](021-community-mechanisms-and-attribution-check.md)记“未对照”。使用证据只有一页、一名主笔。

- 术语一条：下一份不属于 AI 与 agent 领域的中文成文用到它时复核，看“最稳定的说法”在别的领域是否仍然好判断。
- 讲解页的编排：别的主题或别的主笔用到时复核；四问或四层套不上时修订。
- 工单：ClaudeDesign 回交后，由用户 review，再决定哪些进 Kit、放在 Design 的哪一支。
