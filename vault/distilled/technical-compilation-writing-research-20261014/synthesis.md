# 技术文档与教材编订

**Praxis 当前更需要把已有写作规则接到教材的证据、术语、例题与审阅记录上，再用实际章节试用；没有足够理由换成一套通用“技术写作 skill”。** 社区与供应商样本中有价值的部分，大多延续既有技术传播实践：Docs as Code、面向任务的文档、逆向设计、术语管理、技术审阅、交叉引用和可复现计算。Agent Skills 把这些做法变成按需读取的操作入口，并没有替代它们。

本文中的“大语言模型（large language model，LLM）写作”指模型参与技术内容研究、起草、编订或审阅。研究对象不是文学模仿或泛化的 humanize 提示词。各来源的原语言摘要、作者和许可在 [来源卡](cards/README.md)，实施程度在 [比较](practice-comparison.md)，两本指定参考书的文档与配置核对在 [成书案例](book-workflows.md)。

## 成熟做法的共同部分

多份来源收敛到同一件事：让读者完成一项可观察的理解或操作，再决定文档结构。Write the Docs 把文档放入版本控制、审阅与测试；Diátaxis 区分学习、操作、查阅和理解的需要；The Carpentries 从学习目标与评价倒推内容；PingCAP 要求说明用户可做什么、前提是什么、执行之后会怎样。这些来源不是同一个提示词的多个转载，分别来自文档社区、文档方法、教学共同体和实际产品文档。[Docs as Code](cards/docs-as-code.md)、[Diátaxis 既有卡](../../provenance/documentation-practices/cards/diataxis-start-here.md)、[The Carpentries](cards/carpentries.md)、[PingCAP](cards/pingcap.md)

对软件即服务（Software as a Service，SaaS）工程教材，这意味着章节目标应写成“读者能识别什么、算出什么、在改变条件后重新决定什么”。已有“识题→解法→演算→验算→变式”已经接近这个方向。新增价值在于检查这五部分是否真的连成推理，而不是再增加一套五步名称。例如 H01 的收款与履行分离，需要在退款未知和新增席位取消后仍能解释各个余额；只会复述对象表不足以说明读者学会了。

另一个共同部分是事实依赖的可追溯性。PingCAP 要求具体默认值、范围和版本有依据；GitHub Docs 要求将不确定性落到具体句子；Gemini CLI 要求读实现及关联页面；AI Infra 区分规格、实现、测量与教学推算。我们可据此采用普通的 claim–source mapping（主张—来源映射），无需创造新的证据框架名称。来源可以权威而主张仍然超出来源范围：某提供商文档讲事件可能重复，不意味着它证明了本书合成数据库模式的正确性。[PingCAP](cards/pingcap.md)、[GitHub Docs](cards/github.md)、[Gemini CLI](cards/gemini.md)、[AI Infra](cards/infra-book.md)

## 技术文档与教材的不同验收

操作指南可以围绕一个可完成的任务；参考页需要准确、稳定、便于定位；教材还要控制概念进入的次序，使前面建立的知识能支持后面的推导。不能把 Diátaxis 的四类需要机械变成四套镜像章节，也不能要求每个教学单元都同时拥有完整教程、参考和说明。一个单元可以先教一个机制，再链接已有的精确参考。

教学质量最容易在“每段都正确”时失效。每位作者分别解释一次幂等性，合并后可能重复四遍；另一位作者删掉重复定义，又可能让单独进入后章的读者找不到前提。解决办法是指定概念的主要解释位置、后续简短回顾的位置，以及后章增加的条件。AI Infra 教学计划对此有具体跨章分工；The Carpentries 则把统一例子和学习目标连接起来。这支持章际接口与全书连续阅读，而不支持所有章节一律等长或同样数量的配图。[AI Infra 教学计划](cards/infra-book.md)、[Example Data and Narrative](cards/carpentries.md)

计算核对、技术审阅、教学审阅和排版检查回答不同问题。可执行检查适合查出悬空引用、错误输出和部分不变量；它不能判断读者是否知道为什么该公式适用。独立冷读能发现作者默认的背景；模型答对问题也可能依靠模型已有知识。真人试读能提供使用证据，但小样本仍不等于普遍效果。我们应把这些证据并列记录，不合成一个“质量已通过”。[Sphinx doctest](cards/sphinx.md)、[Anthropic Reader Testing](cards/anthropic.md)、[The Carpentries](cards/carpentries.md)

## 原语言、术语与中文表达

来源层保留原标题、原词、原句定位和固定版本，中文解释在提炼层形成。保留原语言不是保留生硬直译。PingCAP 的翻译约定同时要求忠实和自然，Google 强调同概念同术语，Praxis 已有多语言规则保护事实、单位和模态强度。稳定译法应来自目标领域和现有词表；没有稳定中文时，保留原词并解释用途。[术语来源卡](cards/terminology.md)、[PingCAP](cards/pingcap.md)、[Praxis 多语言约定](../../../kit/write/prose/multilingual.md)

用户要求缩写首用展开，比 Google 针对专业开发者的默认更严格；Google 对部分熟知缩写允许例外。SaaS 教材仍按本任务要求，第一次承担解释作用时给出英文全称、稳定中文和当前用途。独立图、独立页面与较远章节应提供可见的简短解释；词表能帮助维护一致性，却不能要求读者离开推理去查每个词。标题和标签可以保持简洁，完整解释放在邻接正文、图注或可访问说明中。[Google Abbreviations](cards/terminology.md)、[AI Infra](cards/infra-book.md)

术语表也不能抹平同词异义。`release` 在检验放行、软件发布和付款释放中并非同一业务事实；`hold` 的权威和解除条件随对象而变。多作者共享的应是明确的定义与作用域，不是强制全书把不同制度改写成一种状态机。

## 前沿实践的实际增量

供应商公开文件提供了三种值得保留的具体增量：Anthropic 的无背景读者测试；Gemini CLI 的实现审计、编辑审计和修订裁决衔接；OpenAI 文档 skill 的官方来源路由及带校验值的检索辅助。GitHub Docs 又把主张级不确定性写入助手指令，并用独立步骤区分显示 lint 注释和让检查失败。它们都是可定位的公开实践，不能外推为供应商全部内部流程，更不能以供应商自述替代独立效果证据。[Anthropic](cards/anthropic.md)、[Gemini CLI](cards/gemini.md)、[OpenAI](cards/openai.md)、[GitHub Docs](cards/github.md)

技术本身仍要分层：存在 `SKILL.md` 说明有协议；存在脚本说明有实现；工作流引用脚本说明配置了调用；成功回执只覆盖其输入版本和检查范围。本研究只静态检查这些层次，不运行外部 skill。特别是 AI Infra 历史第 4 章回执与当前稿哈希不同，这是审阅记录需要绑定版本的具体理由，而不是本研究发现当前稿一定有错。[核对细节](book-workflows.md)

## 建议的采用范围

先在 SaaS 现有材料上试用 [最小编订约定](candidate-convention.md)：明确学习目标，绑定证据与例题版本，维护术语首用，约定章节输入与产出，分别完成技术和教学审阅，再给 Claude 可直接写作的材料。Claude 保有完整的最终编订、用户界面（user interface，UI）、图形、交互和运动设计自由；受约束的是事实、单位、条件与身份关系，不是段落块或视觉模板。

暂缓更换构建框架、安装社区技能包、引入全书自动译写或自动发布。拒绝把引用格式、计数一致、模型自评和漂亮的导出物当作内容正确的替代证据。取舍与试用的判据见 [比较](practice-comparison.md) 和 [SaaS 试用计划](saas-dogfood-plan.md)；这些判断尚未晋升为 Kit 规则。
