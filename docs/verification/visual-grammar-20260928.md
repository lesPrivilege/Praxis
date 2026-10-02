# 视觉语法、工作区收尾与自然消费验收

批次 `visual-grammar-20260928`，跨日完成于2026-09-29（Asia/Singapore）。Astra/main汇总；四组探索由 `luna_max_worker`（配置模型 `gpt-5.6-luna/max`）执行。本回执分别记录材料交接、工作区收尾和fresh-agent消费；本会话不承担Opus作品施工；检查末期已观察到并行新增的实现与导出，单独记录其边界。

## 本轮交付

[入账](../../vault/intake/visual-grammar-20260928.json)归档3轮6消息、1截图；6个原Chat citation保持missing-original。截图底部原帖URL截断，没有猜测补全。Luna分别追溯Courtwork、Schema Engineering、Praxis/Mnemos/Mnemos Prototype/Attention Assistant，以及21个独立外部URL。

[演示工场](../../demos/visual-grammar/README.md)提供8个开放素材工单、渐进来源地图、场景与工程记录、表现技术组合和可粘贴的Opus唤醒prompt。用户最新要求已落实：Astra只厘清材料结构，不限制技术栈、grammar、激进效果、作品数量与顺序；选题、实现和复用架构交Opus。

## 消费走读

- 从工场README可到开放工单→对应Luna索引→文件定位/hash/快照；只有需要时展开原件，不要求加载完整Vault。
- 选Schema方向可找到论文语义、独立的reader校验实现及stale candidate合成fixture；两种证据没有混作业务runtime验证。
- 选视觉实现可定位Mnemos Showroom、Praxis已有layout specimens与Remotion动态简报，而非要求全部从零实现。
- 外部样例有独立Skillry详情、X原帖、原仓库或官方API身份。X访问受阻、黑洞demo访问失败与未快照依赖显式保留。
- 主线VG工单与Luna局部PX/SE候选分开编号；它们是可改编起点，不是审批清单。

## 验证与限制

仓库命令与完整结果见 [机器回执](visual-grammar-20260928-result.json)。本轮检查JSON、消息覆盖、来源映射、快照hash和本地导航；自然消费的临时HTML仅作结构验证工件，检查范围由其生产者记录。没有安装依赖、渲染新视频或进行受众测试。Schema子代理另报告论文reader校验及11项QA通过，该结果不外推为业务schema/runtime已实现。

用户追加授权一并收尾后，已修复既有AI答卷改名留下的40处文档断链，统一生成器输出名与证据页返回链接。改名前的生成结果与已命名HTML逐字节一致；本次不改变答卷正文或视觉，也未重新生成PDF。历史验收保留原时点，新状态另行补记。

外部HTML/视频/音频/JS/字体、完整源仓库及运行依赖没有保存。精选本地源码快照可回查，不是完整可构建仓库。来源中的旧指令仅作材料；本会话没有发布、创建远端、调用Opus或改写来源仓库。


## 工作区归位与省并

Luna盘点当前docs/kit/templates/skill/scripts和相关Vault批次：活跃规则未发现重复正文；旧Writing/Design入口已经是导航，保留兼容路径。SourceWeft、写作结构、Write–Design消费与设计参考语义各有不同职责，未为减少文件数强行合并。原件/研究在Vault，已采纳契约在Kit/docs，真正的演示施工进入demos；本轮为结构测试临时生成的页面与trace收尾归入docs/verification。已补当前入口与历史时点说明，删除样张目录忽略的.DS_Store，索引由源登记重建。

布局实验已完成，45原子244样张、8patterns30assemblies、5整页6版本。`ready-for-reference/adaptation`明确可直接取材、改编或使用失败对照；unreviewed/局部review是覆盖，不是使用审批。修正生成源的制作方人数和2条已解决日期问题，保留原review baseline并追加维护版本。171/164/约163的分母差异和第26周停开归属未被全局改写。

本轮重新生成gallery/catalog后，`catalog.py`报告0错误；Chrome CDP对index在1440和375视口检查均0issue。它只证明索引几何与导航数据，不扩大旧样张的视觉/无障碍验收范围。


## Fresh agent 的实际消费测试

输入不给样张名称、目录或来源ID；两个Luna会话均 `fork_turns=none`，只给业务任务、仓库位置和产物写入范围，要求按正常入口完成HTML，而非只找资料。

第一项为社区开放方案比较。首版已自然找到优先参考和E09/T05/T06/C02，实际产出页面，但经过同题历史发现回执，所以单独记为“同题复用”。main还发现首版把对象卡片堆叠误记为REF-COMP-001的按属性比较；后续实现改为按属性分行，但该修正由main提示，不能计作完全无提示正确消费。

第二项改为自愿问卷决策说明，题材与历史比较/故障切换验收不同，用于观察新任务能否从正常入口发现并消费合适样张。它自然找到Q06-d、V06-a/V06-e、W03-b并实际取用；REF-COMP-001被过度归因，经过main要求后标记未采用。结果见 [机器回执](visual-grammar-20260928-result.json)及 [证据目录](reference-consumption-20260929/README.md)。

测试期间同步修正了样张“可参考/改编”的入口措辞；起始入口hash与这一变化均已登记。因此这是实际工作区接管观察，不是冻结版本的模型对照评测，也不证明所有任务或模型必然找到最优素材。


第三项只要求便携设备比较的文字布局样例。fresh agent通过实际目录阅读和rg检索进入参考，正确使用属性分组，让甲/乙/丙在每个属性下可对照，并明确不使用不匹配的注释卡。没有给它材料名或改布局提示；main只在产物后要求补记初始导航事实。路径仍包含历史验收记录，不能称作最小README路径。

本次闭合的是“自然发现→实际取用→识别误读→写回唯一参考卡→新上下文再消费”的有界循环。没有用临时prompt持续注入样张目录，也没有建立自动晋升机制或宣称任何任务都会正确泛化。用户明确测试只服务仓库结构后，两份临时HTML及trace已从demos归入 [验证证据](reference-consumption-20260929/README.md)，保留原生成路径与人工纠偏记录；不继续产品化或视觉打磨。


## 最终检查时点

`python3 scripts/validate_repository.py`通过：697份Markdown、120份JSON、669份快照、120条已消费消息、359条来源、219条引用映射，0错误；`git diff --check`通过。完整时间戳见机器回执。既有40处答卷断链已修复。

最后验证期间，其他并行工作新增了visual-grammar的runtime/pipeline、event-state-context源文件、WebM和关键帧。本会话只补缺失README并同步项目入口，没有改其实现或执行渲染/播放验收。这些产物不属于fresh-agent结构实测，也不从本回执继承运行通过结论；后续修改以施工方最新回执为准。
