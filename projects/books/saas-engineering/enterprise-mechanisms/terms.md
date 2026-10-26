# 术语与原语言索引

中文正文在解释阶段翻译，原题、原词和来源定位保留在证据侧栏。本表只说明本册使用的含义；近似词若涉及不同对象、责任或证据，不合并成一个“完成”或“审批”。

| 原词或缩写 | 本册表述 | 含义与不能混同的概念 |
|---|---|---|
| Software as a Service (SaaS) | 软件即服务 | 一种软件交付方式；不自动说明内部架构或客户实施完成 |
| Enterprise Resource Planning (ERP) | 企业资源计划 | 某类企业系统；不能泛指所有业务事实的唯一权威 |
| User Interface (UI) | 用户界面、前端工作面 | 人看证据、提出动作与恢复工作的入口 |
| Application Programming Interface (API) | 应用程序接口 | 调用契约；接通接口不等于获得业务授权 |
| Hypertext Transfer Protocol (HTTP) | 超文本传输协议 | 本地实验真实传输协议；响应码的业务含义仍由 API 定义 |
| JavaScript Object Notation (JSON) | JSON 数据格式 | 结构可解析不等于字段的业务含义正确 |
| identifier (ID) | 标识符 | 技术 ID、业务编号和外部引用有不同用途；身份包括适当范围 |
| Coordinated Universal Time (UTC) | 协调世界时 | 本册窗口与切换时间的时区；不是所有企业的营业时区 |
| Service Level Agreement (SLA) | 服务水平协议 | 约定服务目标；响应时间与恢复时间分别定义 |
| World Wide Web Consortium (W3C) | 万维网联盟 | 发布 Web 标准与无障碍指导的组织 |
| Accessible Rich Internet Applications (ARIA) | 可访问的富互联网应用 | 为辅助技术表达交互语义；不是自动生成行为的脚本 |
| ARIA Authoring Practices Guide (APG) | ARIA 创作实践指南 | 本册取用 grid 的交互模式与焦点责任 |
| System Integration Testing (SIT) | 系统集成测试 | 检查系统间连接、消息与数据流 |
| User Acceptance Testing (UAT) | 用户验收测试 | 检查约定角色能否完成可接受的工作 |
| Comma-Separated Values (CSV) | 逗号分隔值 | 表格文本格式；导出字段不等于导出全部关系与语义 |
| Ontology | Ontology，按来源解释为组织运行层 | Palantir 的产品术语；原文含对象、关系、动作等，不简化成数据库 schema |
| object / property / link | 对象 / 属性 / 关系 | 关系可能具有数量、版本和独立证据，不能一概作为无语义链接 |
| action / command / event | 动作 / 命令 / 事件 | 动作表达工作意图，命令提出请求，事件记录发生的事实；请求不等于事实 |
| guard / effect | 前提条件 / 成功效果 | 前者在转换前检查，后者是转换后留下的结果 |
| system of record / read model | 权威记录来源 / 查询投影 | 事实归属与阅读便利性分开；投影滞后不改变权威 |
| authorization / approval | 授权 / 批准 | 授权决定能执行什么；批准是有范围和依据的一项决定，可能成为执行前提 |
| acceptance | 接收、验收 | 对约定结果的接受；与外部接口 accepted 状态区分 |
| accepted / applied / settled / closed | 已受理 / 已应用 / 已结算 / 已关闭 | 外部受理、效果、资金事实与业务状态不同；以具体契约为准 |
| submission criteria | 提交条件 | Palantir 动作权限中的原词；不替代全部数据权限与副作用条件 |
| writeback | 回写 | 将结果写入某个权威或工作系统；必须指明写入内容、方向与依据 |
| outbox | 待发送记录 | 与本地业务意图一起持久化，供后续发送；不自动使远端效果原子化 |
| idempotency | 幂等性 | 同一意图重复执行仍保持约定效果；新键不代表新义务 |
| compensation | 补偿 | 对已经生效结果进行业务补救；与数据库回滚不同 |
| System Schema | 系统结构 | 本册分析用语：对象、字段、身份、关系、约束与接口 |
| Work Schema | 工作结构 | 本册分析用语：目标、前提、授权、动作、证据、接收与恢复 |
| Agent Context | agent 的本次工作上下文 | 当前任务视图与执行依据；不是新权威数据库或凭空授权来源 |
| agent / tool / adapter | agent / 工具 / 适配器 | agent 规划与调用；工具公开有界动作；适配器连接具体系统 |
| consumer / provider | 调用方 / 提供方 | Pact 在 HTTP 中按请求发起方与响应方定义；消息场景另按消费和生产定义 |
| fake / mock / stub | 保留英文，按用途说明 | 本册 fake 有状态和效果；参考 HTTP 服务独立实现参考协议；不把三词当成同义的“真实系统” |
| data steward | 保留英文并解释职责 | 维护定义、质量与使用规则的角色；不等于数据库管理员或所有数据的法律所有者 |
| configuration / customization | 配置 / 定制 | 在受支持范围内选择行为，与增加或改变能力的区别；具体产品边界要写明 |
| cutover / go-live | 切换 / 上线 | 转交权威与执行责任，与开放服务使用不是同一个瞬间 |
| incident / change / problem | 服务事件 / 变更 / 原因调查事项 | H05 三种关联对象，生命周期分别成立 |
| booking / work order | 预约排班 / 工单 | V20 的子执行安排与总履约对象 |
| consent / signature / data lock | 同意 / 签署 / 数据锁定 | V02 中人的决定、对确定范围的确认与之后允许动作的限制 |
| lot / sample | 生产批次 / 样品 | 批次结论需要样品代表性与其他证据；两者身份不能替换 |
| folio | 住客账夹 | V06 汇集费用与支付的对象，不等于预订或实体房间 |
| reserve / payoff / transcript | 赔付准备业务记录 / 提前结清 / 成绩记录 | 各自属于 V13、V12、V17；含义以对应案例对象与原来源为准 |

原语言来源标题与段落定位见 [证据侧栏](../../../../vault/distilled/saas-engineering-atlas/enterprise-mechanisms/evidence.md)，案例原词的进一步解释见 [33 个案例入口](case-connections.md)。
