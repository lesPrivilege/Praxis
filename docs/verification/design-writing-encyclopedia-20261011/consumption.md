# 独立任务消费记录

2026-10-11，四名没有参与研究或编写的代理分别完成下列合成任务；提示未命名目标卡片。另用一名新代理复查修订后的入口。原始走读报告保存在本地 scratch；本页保留可公开的任务、实际路线、具体产出、判断和失败。没有以走读证明 Kit 的因果改善、读者效果或实现合规。

代理选择请求为 `gpt-6-luna`，工具接受并返回结果；运行引擎身份未独立暴露。各任务只读仓库；来源、历史状态和规则分别判断，未执行外部代码。

## Design：滤网控制面板

**任务。** 为手机和桌面解释进风、风扇、可换滤芯和出风，调风速、显示换芯状态，并容纳动画中再次调节。评估同事提出的透明三维线框与红绿状态。

**实际路线。** `AGENTS.md` → 根 README → Design README → `references/interface.md` → Motion README → `motion/choreography.md` → `references/composition.md` → `foundations/relations.md` → `interaction/states.md` → `interaction/controls.md` → `composition/object-representation.md` → 外部原文。

**产出与取用。** 采用不透明二维流程示意，桌面横排、手机按同样次序竖排；以可辨的滤芯形体和标签表示替换件。控制器持续显示请求档位，将“正在设置”和设备确认分开；新输入重定向未完动画，减少动态时保留同样的文字状态。状态词与图形配合，不让红绿单独传义。未获得读数时不虚构 RPM 或寿命比例。没有证明空间构造是任务所需，因此不把透明三维线框作为默认。

**原文。** 从 C16 到 [WCAG Understanding SC 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)，读成功准则、Intent 与 Examples；确认其为网页 AAA、针对交互触发且非必要的运动，不能推出整个产品符合标准或所有原生界面都受同一条款约束。旧 C01 仅看索引行，未检查其 SVG；未用它证明原件效果。

**发现。** 实际路线经过两个旧参考索引才到任务语法，超出本题所需。Design README 的“界面控件”行因此改为先到 Interaction，原 U01–U09 留作原始模式入口；未新增分类。所需设备档位、反馈协议、换芯判据、可达性目标仍未知，无产品实现或读者测试。

## Writing：中英文上传超时

**任务。** 请求超时，服务器可能已收文件，本标签页仍有已选文件，可查询状态；查询前重传可能重复建任务。改写过度承诺的中英文提示，并说明三人试用为什么不能证明完成率提高。

**实际路线。** `AGENTS.md` → Kit README → Prose README → `shared/evidence.md` → `prose/review.md` → `prose/microcopy.md` → `prose/multilingual.md` → `prose/grammar.md` → DWW-004 卡 → 原文。

**实际成文。**

> 上传请求超时，文件可能已收到。所选文件仍保留在此页。请先查询状态；查询前重新上传可能会创建重复任务。

按钮为“查询上传状态”；仅查询结果确认没有已创建任务时才提供“重新上传”。

> The upload request timed out. The file may have reached the server, and your selected file is still here. Check the status before retrying; retrying first may create a duplicate job.

按钮为 “Check upload status”；满足相同条件才提供 “Retry upload”。拒绝断言网络原因、已经安全保存、直接重传即可，也没有把英文品牌口吻推广为中文规则。

**原文。** [GOV.UK error-message](https://design-system.service.gov.uk/components/error-message/) 的 “When not to use this component” 与开头说明（读取时行 137–146、57–60）：服务侧、用户无法自行修复的问题不伪装成字段校验，说明情况与可做的下一步。任务提供的重试风险并非 GOV.UK 的产品事实。三人试用只能暴露局部问题；没有可比基线、分组和足够样本，不能归因完成率变化。代理未读 argument.md，仍从已用的证据规则完成有限判断，不把未读卡算作消费成功。

**限制。** 实际查询状态枚举、重试条件、文件保留协议、品牌和地区语体未提供；没有运行界面、读屏或用户试用。路线无断链。

## Cross-media：四栋楼十二个月用水

**任务。** 对比四个虚构建筑的月用水与各自基线，说明超出多少、估计还是实测；部分读者打印，部分想选建筑和月份。同事称自动播放三维图“教得更好”。

**实际路线。** `AGENTS.md` → Kit → Design → Foundations README → Composition README → `composition/encoding.md` → Interaction README → Motion README → `motion/grammar.md` → `write/publish/media-choice.md` → `design/references/reading-sources.md` → Cross README → DWX-01/04 卡与 catalog → 出版商页 → SERC PDF。

**产出与取用。** 先给静态异常摘要和可打印的 4×12 差值表/热图：相同零差值基准、符号与单位、估计/实测文字标签，缺值不当零。附可选建筑/月筛选与复位，不用操作才能看到关键结论。合成单元格例为“Cedar Hall，六月：+12 m³（+10%），实测；132 m³，相对 120 m³ 基线”。实际基线口径必须另定，数字不是观察证据。非视觉路径使用完整结构化表格、行列标题、数值/单位和证据标签。

**原文。** [出版商页 DWX-01](https://www.sciencedirect.com/science/article/pii/S1071581902910177) 返回 403；继续读已登记的 [SERC PDF DWX-04](https://cdn.serc.carleton.edu/files/NAGTWorkshops/visualize04/Tversky_2002.pdf)：Abstract（PDF 1–2页）、Graphics good and not so good（6页）、Incomparable content in static and animated graphics（9–11页）。结论是对比应保持信息/操作条件可比，不能用加入信息或交互后的差异证明动画本身更好；不是“动画永远差”。本题要同时比较固定数据，选择静态主展项是任务适配推断。

**限制。** 副本与出版版逐字一致性、图像内容与许可未验证；没有用水数据、受众试验、打印或可达性测试。路线略宽但没有发现失联来源；成功使用了可读副本并保留出版商阻断状态。

## Misleading reference：把 accepted 当作可直接投产

**任务。** 同事把历史移动比较样例的 accepted 解释为“可以照搬代码和 fixture，并声明 accessible”，还称旧缺陷过时。用合成套餐 A：10GB/$5/可导出，B：20GB/$9/可导出，C：50GB/$15/不可导出，提出可负责的比较方案。

**实际路线。** `AGENTS.md` → Kit → Design → REF-COMP-001 → [原 E06-b HTML](../../../vault/distilled/layout-specimens-20260927/atoms/enum.html#E06-b) 的 `.e-pivot--narrowonly` → 同目录 review、checks README → 原验收范围 → 本批 `body-history.md`。检查源 HTML，没有执行脚本或渲染。

**裁决和产出。** 方法可取用：按容量、价格、导出属性分组，各组保持 A/B/C 顺序；值在内容和视觉上明确附着套餐名称。原 HTML 的图例有 `aria-hidden="true"`，值依赖位置，没有完整对象名；历史范围也未覆盖读屏、文字放大等。旧问题没有因 reference 接纳而消失，不照搬源码、fixture 或可达性结论。只用题目给的合成值；价格周期、币种语义等仍须确认，实际重排和放大另测。

本例成功区分当前参考优先级、有限接纳范围、旧实现缺陷与未验行为；去除正文日期没有抹掉这些边界。

## 入口修订后的新代理复查

**实际路线。** 根 README → `kit/Agent.md` → `AGENTS.md` → `kit/AGENTS.md` → Kit → Design → References README → Interaction README → controls → states → feedback → 来源书目 README → choreography → 旧 `design/grammar.md` 导航 → Interaction 来源 README → cards README → DWI-007 卡与 catalog 单条。

代理找到当前语法和完整书目路径，没有预读所有 Foundations，也没有展开旧 U 卡。其提案将最新请求、上次设备确认与排队语义分开；具体控制类型和协议仍待产品事实。来源选择为 [React Aria useSlider](https://react-aria.adobe.com/Slider/useSlider)，仅本地摘要与原文定位，未重开网页或运行 API。

复查并非全无过读：代理先读了 `kit/Agent.md`，随后才看到 AGENTS 的普通任务路线；References README 与旧 grammar 导航也没有增加操作要求。根 README 当时的泛称“Agent 开工”并列 Agent.md/AGENTS.md，协调者据此改为先用 AGENTS 选路线、维护才读 Agent；Design 行也改为按需查参考。这项最后的措辞修复经本地链接检查，未再声称有一轮新的独立消费成功。两次路线证明可找到指导与来源，同时留下代理仍可能过读的真实限制。
