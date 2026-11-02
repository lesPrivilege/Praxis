# Fresh Agent UI｜按产品区域配置参考而非照搬

这份归纳服务于 Fresh Agent UI / Praxis 的设计参考读取；**不构成 Harvey、Legora、Lawhive 或其他法律 SaaS 的功能交互审计**。合同审阅、Playbook、Intake 的任务流仍应对齐成熟产品的实际交互共识。

| 产品区域 | 可参考视觉语言 | 优先项 | 严格禁区 |
|---|---|---|---|
| Landing / New 的初始空状态 | OpenAI 情境摄影、Perplexity 编辑留白 | 少信息、明确 CTA、适度背景 | 不让 Hero 抢过 Composer |
| 研究报告封面 | Anthropic 纸质拼贴、Grok 简洁光学 | 章节层级、出处标记、单主角 | 不用拼贴伪造证据/图表 |
| Deep Research 正文 | Anthropic 编辑栅格 | 标题、脚注、来源、图文节奏 | 不将纸纹放在长段正文底下 |
| Contract Review | OpenAI 的克制、信息优先（方法层） | 左中右区域/逐条变化/来源定位/Accept/Reject | 不引入电影光效和海报插画 |
| Playbook 规则管理 | 仅借鉴排版秩序 | 规则、条件、优先级、版本、差异和审阅状态 | 不以品牌视觉替代规则可解释性 |
| 右侧 Chrome / Card | 统一容器尺寸与焦点层级 | 玻璃仅用于可控悬层；清晰边界 | 多层 blur 叠加产生脏页 |
| Service Intake / Provider 进度 | OpenAI 人类情境仅作介绍页配图 | 表单错误、委托状态、来源系统 | 不把服务营销与进度状态混排 |
| 持股、信托、供应链图谱 | Anthropic 工程图的审美分层（仅背景灵感） | 节点类型、方向、边语义、风险图例 | 不引用装饰性曲线作真实关系线 |
| 高管 Control Plane | Perplexity 的秩序感、Grok 的空间主焦点 | 可追溯事实、优先级、例外预警 | 避免所有卡片都发光、模糊 |
| Demo 视频与产品发布 | OpenAI 手作情境 + Grok/Anthropic 单焦点电影光 | 真实操作与情境穿插 | 不把宣传样片当交互说明 |

## 推荐的三层色彩 / 视觉系统

- **Layer 0 — Semantics（不可随 Skin 变化）**：风险、确认、警告、错误、禁用、选中与来源状态；先有功能语义再有审美。
- **Layer 1 — Product chrome（可配置）**：侧栏/Tab/Card/Composer、字体、空间、边框、低量玻璃与遮罩；深浅主题由完整 token 集控制。
- **Layer 2 — Brand art（限域）**：封面、首页、空状态、章节视觉；选取 editorial、cinematic、photo/material 中的一种主语法即可。

## 不应迁移的模式

- 网站中的海报属于品牌传播材料；不能推断它们代表对应公司的 SaaS 组件设计规范。
- 已有稳定交互（合同原文—差异—处理—来源）的成熟路径，不因为想获得视觉冲击而改造。
- 避免叠加点阵 + 颗粒 + 斜切线 + 荧光渐变 + 毛玻璃作为「高级感」万能模板。每个装饰必须能说明所在区域的主焦点为何需要它。

## 给后续 Agent 的视觉研究工单字段

`target_surface / business_semantics / candidate_reference_ids / visual_grammar / do_not_transfer / necessary_user_state / evidence_link / validation`。先挑 2–4 张源图深入对照，再做局部构件收敛。
