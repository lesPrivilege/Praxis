# 代表性技能与实践比较

“提示协议”“实现文件”“配置调用”“执行回执”是不同证据。下表中的执行程度只来自本次静态检查；没有一项上游 skill 在本研究中安装或运行。成熟度判断按公开材料的职责、实现与局限作出，不按星数、营销标签或模型品牌排名。

## 技能与供应商公开工作流

| 来源 | 有用机制 | 实际形态 | 适合什么 | 取舍 |
|---|---|---|---|---|
| [Anthropic doc-coauthoring](cards/anthropic.md) | 先聚齐上下文，再编订；无背景读者问答 | 长交互协议；该目录未见独立 checker | 规格、决策文档及独立可读性检查 | **候选采用**冷读；**拒绝**把自测当事实审阅、固定问题配额、公开开发对话 |
| [Gemini docs-writer](cards/gemini.md) | 对代码与文档、编辑意见与实施裁决分别检查 | skill + reference；公开定时审计 workflow | 维护快速变化的软件文档 | **候选采用**变更影响与裁决记录；**延后**自动审计；英语风格仅作参考 |
| [PingCAP write/review](cards/pingcap.md) | 每个具体技术值有来源；变更适用分支；源文映射 | skill、共享规则、词表；另有模型审阅 action 配置 | 中文产品文档、版本更新、翻译 | **优先候选**事实与译本约束；不移植数据库专用字段与自动写入流程 |
| [GitHub Docs](cards/github.md) | 精确标记未确认主张；复用内容；依赖变更检查 | 助手 instructions + content lint workflow | 多作者、版本化产品文档 | **优先候选**主张级缺口和入口依赖；不照搬 Liquid/AUTOTITLE |
| [OpenAI docs](cards/openai.md) | 官方文档路由、当前性、hash 与提纲 | 领域检索 skill + fetch helper | 获取提供商当前产品材料 | **有界候选**来源取用；**不当作**内部写书流程或独立证据 |
| [Tech Leads Club docs-writer](cards/tech-leads.md) | 简短调查—写作—核对，风格按需读取 | skill + style reference；含具体仓库路径假设 | 示范薄入口 | **延后直接采用**；与 Gemini 重叠，文件级派生关系未确认，不增加独立方法证据 |

“有 workflow”比纯提示多了一层可检查的配置，但仍依赖权限、运行环境与模型判断。PingCAP 的自动审阅使用独立 action 和 prompt；Gemini 的定时流程直接让 agent 修订并提出拉取请求（pull request，PR）。两者都不能自动满足本任务“交给 Claude 的材料已验证”的要求，仍需研究/技术负责人消解事实问题。

## 传统方法与工具

| 来源 | 成熟实践与术语 | 可机械检查的部分 | 必须另行审阅的部分 | SaaS 决策 |
|---|---|---|---|---|
| [Write the Docs](cards/docs-as-code.md) | Docs as Code：版本、评审、测试共同工作 | 差异、版本、检查记录 | 内容是否帮助读者 | 沿用现有 Git，不增加流程名称 |
| [Diátaxis](../../provenance/documentation-practices/cards/diataxis-start-here.md) | tutorial / how-to / reference / explanation | 页面职责元数据只能辅助 | 当前读者需要哪类内容 | 复用现有覆盖，不建四套目录 |
| [The Carpentries](cards/carpentries.md) | backward design、learning objectives、formative assessment | 目标与习题是否有映射 | 读者是否会解释和迁移 | 试用同一例子贯穿与留出变式 |
| [Google style](cards/terminology.md) | terminology、first reference、translation/localization | 词表一致、部分缩写候选 | 首用是否可理解、译文是否准确 | 用户首用展开要求优先；英语标点不迁入中文 |
| [Vale](cards/vale.md) | 可配置 prose linting | 拼写、术语替换、模式/范围关系 | 中文语义、事实、读者前提 | 延后安装；先以本书错误样本评估收益与误报 |
| [Sphinx](cards/sphinx.md) | doctest；源文消息与译文分离 | 指定样例输出、setup/skip 状态 | 假设、现实适用性和完整学习链 | 先绑定现有脚本与算例，不迁移框架 |
| [Quarto](cards/quarto.md) | cross-reference、bibliography、freeze | 引用标识、输出生成、部分执行记录 | 引用是否支持结论、缓存输入是否新鲜 | 采用概念；多格式需求成立再选工具 |
| [AI Agent](cards/agent-book.md) | 主语言同步、图注跨 renderer 保留 | 文件/表计数、图注转换、特定测试 | 翻译语义、可访问图文、真实学习 | 候选采用逐输出核对；不移植目录 |
| [AI Infra](cards/infra-book.md) | 教学单元、贯穿算例、全章复核、来源构建记录 | 图号/脚注/链接、局部算式、字体和源 hash | 跨章认知顺序、图解释是否充分 | 优先用作编订工作样例；历史通过不能覆盖新稿 |

## 共识与分歧

- **共同约定**：围绕读者任务组织；具体事实有依据；术语稳定；变更检查关联内容；自动检查与人的判断并存。依据来自不同领域来源，而非重复技能目录。
- **条件不同**：Google 的熟词例外服务于开发者读者；本书的缩写首用要求服务于进入陌生行业的人。按任务取舍，不能表述为其中一方“违反标准”。
- **风格不同**：Gemini 偏好第二人称、每标题后引介段；Praxis 中文正文按对象和推理展开。保留其任务前提先于动作的语义，不移植英语句型。
- **构建语义不同**：Quarto freeze 便于复用已有计算产物；技术复核需要知道输入是否改变。离线能渲染、计算已重跑、结论适用是三项不同声明。
- **素材职责不同**：AI Agent 的实现以 alt 生成 caption 解决图注丢失；Quarto 提供分开的 caption/alt 字段。应保留“两个职责”，不能把某一兼容实现说成通用出版规范。

## 采用、延后与拒绝

本目录的“采用”均指建议纳入有界试用，不是规范晋升。优先试用的增量只有：章际输入与产出、正文与算例/来源的版本关联、首用检查、分层审阅、完成后的主笔交接。它们对应 [实际缺口](praxis-coverage.md)，没有证据要求重建既有写作 Kit。

延后：新建生成器体系、自动翻译、定时审阅机器人、Vale 全套规则、多代理固定分工。触发条件是实际教材任务出现重复成本，且局部方法不能解决。拒绝：未核实的数字进入正文、用“官方”覆盖推断、把检查数合并为质量分、引用格式代替证据支持、复制不明许可技能包、把出版检查交给最终作者重新完成研究。
