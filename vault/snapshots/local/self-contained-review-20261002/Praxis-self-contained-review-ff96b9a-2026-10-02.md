# Praxis 自足性审查与最小增量方案

审查基线：`lesPrivilege/Praxis main@ff96b9a16cfab14977a0891cb8c141124e124ca7`。远端提交为 **Community working methods as reserve material (ADR-021)**，核查日期为 2026-10-02 UTC。全文路径和引用均锚定这个提交，不将旧 `3417dca` 的缺陷当作现状。

## 结论

**保留现有层次。优先修复当前状态的重复维护、来源卡生成与消费索引的分叉，再用一次真实任务完成小范围改进闭环。现在没有证据支持大规模扁平化、另建 Present、另建 RSI 平台，或删除原件与历史。**

两个目标应分别验收：

1. **发现与消费自足**：陌生执行者从普通任务能选对入口，知道不该读什么，读到足够的规则、约束和证据后能开工；资源不足时能停止或补证。当前结构与文字契约大体具备这一能力，但尚不能据此宣称所有宿主都能自动发现、所有任务都已省读。
2. **简单增量 RSI**：本次工作的真实失败或改动理由能落到一处小候选，经对照、反例或留出任务后，有限地保留、修订、降级或撤回，再被下一次消费。当前维护链条已经存在；缺的是把它用于一个最新基线上的实际消费问题，并确保生成投影能可靠承接变化。

“自足”不要求把全部专业知识、外部产品能力和运行实现装进 Kit。它要求**在所声明用途内，足以作出下一项正确判断，并明确缺什么、去哪里取、什么时候不能继续**。

## 范围与证据口径

这是一轮远端只读审查，减法与加法建议均按当前文件和后续证据交叉核验。未修改、归档、删除、提交或推送仓库；未安装依赖，未执行仓库脚本或外部样本代码。

本轮检查当前入口、规则、ADR、回执、来源元数据及生成/验证脚本。原 Chat 与来源快照只按边界、定位和消费者关系判断，没有将私人原文搬进报告。脚本结论来自静态阅读与元数据计数，不是运行验收。

下面六条任务探查是**本轮静态走读**，不是新的独立业务运行、代码评测或成品验收。仓库中的历史实验单独标明版本、条件与局限，不并入本轮成功率。报告里的“已具备”指当前文字或结构机制存在；“有效”只有在对应范围的证据支持下使用。

[基线提交](https://github.com/lesPrivilege/Praxis/commit/ff96b9a16cfab14977a0891cb8c141124e124ca7) · [AGENTS](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/AGENTS.md) · [根 README](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/README.md)

## 已落实的机制应保留

| 当前机制 | 依据 | 能支持的结论 | 不能外推的结论 |
|---|---|---|---|
| 消费与维护分路，任务材料够用即停 | AGENTS、Kit README、ADR-019 | 做任务不必预读治理三件套 | 所有执行者都会停、全部宿主自动发现已验证 |
| 小请求不进分支；专业任务按判断进入 | Kit README、ADR-020 | 通用问答、轻改写、确定性转换有退出入口 | 绕过分支后永远不会丢限定 |
| Reporting、Write、Design 各有 owner | ADR-019、Write/Design README | 目的、信息职责、视觉语义可组合消费 | 需要再建立同义的 Present 主责层 |
| 底线、语言约定、编辑启发式分强度 | Write README、Prose grammar | 中文默认不强套英文；用户目标与证据优先 | 任一写作启发式都是跨任务硬规则 |
| 来源身份、证据、采纳、优先级分离 | intake、reference-lifecycle | preferred 不等于事实更可信或实现已成熟 | 卡片存在、accepted 或链接可达就是验证通过 |
| 变更有触发、裁决、迁移、退出与历史 | evolution、documentation | 小范围修订和撤回可复用现流程 | 已实现自主训练、自动执行治理或通用 runtime |
| 对照、留出、代价已成为默认验收方法 | ADR-021、working-methods | 可以拒绝把对照也会做的事算成规则收益 | 一次合成走读证明泛化效果 |

关键来源：[Kit 入口](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/kit/README.md)、[ADR-019](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/docs/decisions/019-expression-owners-and-entry-paths.md)、[ADR-020](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/docs/decisions/020-entry-calibration-and-depth-check.md)、[ADR-021](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/docs/decisions/021-community-mechanisms-and-attribution-check.md)

### 现有结构已经够用

```text
普通任务
  → AGENTS / Kit README
    → Reporting          目的与所需决定
    → Write              成文 / 空间编排 / 时间叙事
    → Design             视觉 / 编码 / 交互 / 运动判断
    → 企业工作与环境      业务机会 / 工作状态 / 契约 / 恢复
      → 必要规则与优先参考 → 普通参考 → 需要时回查来源
      → 产物与分层验收 → 消费者自己的薄记录

真实失败 / 新证据 / 依赖变化
  → 现有项目记录或 Vault
  → 一个小候选与反例
  → 对照 / 留出 / 代价
  → 现有主责页面的有限变更
  → 入口、投影、消费者与回执同步
  → 保留 / 降级 / 撤回，历史证据继续可追溯
```

这是现有层次的职责图，不是新增目录蓝图。

## 六条陌生任务的静态走读

这里给出足以完成判断的阅读序列与预期产物，不把“把所有链接读一遍”当成功。

| 任务探查 | 阅读序列 | 可据当前内容作出的判断与最小产物 | 停止、回流与缺口 |
|---|---|---|---|
| 1 英文技术段落改写，保留限定与证据强度 | Kit → Write → Prose → Shared/evidence；有审校时再读 Prose/review | 使用普适证据底线和不可损失项；不加载中文搭配与语体默认。产物为改稿及必要变动说明 | 限定、数字、来源身份核对后停。没有证据需要新建英文分支；本轮未产生真实改稿 |
| 2 已有简报改成 Slides，再改成短视频 | Kit → Write → Publish/composition 与 Shared/evidence；时间稿再读 Motion/narrative；仅视觉运动取舍进入 Design/Motion | 删减与重排是改编；内容职责与运动表现分开。产物为分页/分镜与来源、条件映射 | Slides 需最终导出逐页看，视频需全片实际速度观看。没有 renderer 不宣称完成成片；不新建 Present |
| 3 OPC/FDE 式业务机会判断，客户只说“报价太慢” | Kit → landscape → field-loop → field-governance；进入试点再读 scenario 模板 | 先查流程、样例、可比基线、非 AI 替代、数据/权限、接收 owner；不能由 demo 推收益。产物为机会判断或带阻塞的最小实验 | 关键启动条件仍缺时收缩为诊断；实验也无法做则交 sponsor 裁决。真实领域知识仍由来源与专业 owner 补齐 |
| 4 需要窄屏比较参考，并核查证据能否引用 | Kit/Design → References → curated/comparison-continuity；不匹配退普通参考；有具体主张才读对应来源卡与 catalog | 优先卡只证明指定结构查阅用途；保持证据与优先级分离。产物为取用/拒用理由、来源范围、调整与未验项 | 找到所需主张与边界即停，不读整个 Vault。生成卡与 registry 的当前分叉见 A1，可能破坏后续维护可靠性 |
| 5 一批外部动作部分完成，中断后有些结果未知 | Kit 失败/恢复行 → contracts → grammar/work；确有批次部分成功再按需读 working-methods | 按权威系统区分已成、未成、未知；未知先核对，不把超时当未执行；权限拒绝不得绕过。产物为逐项状态与恢复/升级计划 | 只读且可安全整份重做为近失例。当前通用恢复路由已修；可选素材能否进一步减少误读仍未证明 |
| 6 “解释一个通用概念”或只改一句话 | 已加载的任务入口足以识别后直接回答，不再进入领域分支 | 不把简单问答变成研究、brief 或入账任务；保留原有事实、范围与条件 | 答案完整即停。问 Praxis 自己的定义、事实不齐或有两种读法时才继续查找 |

对应正文：
- [Prose 语言范围](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/kit/write/prose/README.md)、[投影与改编](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/kit/write/shared/evidence.md)、[分镜](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/kit/write/motion/narrative.md)、[运动判断](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/kit/design/motion/grammar.md)
- [现场闭环](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/kit/work-system/field-loop.md)、[现场治理](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/kit/work-system/field-governance.md)、[场景模板](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/scenarios/_template/README.md)
- [参考路由](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/kit/design/references/README.md)、[恢复契约](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/kit/contracts/README.md)、[不变量与反例](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/kit/grammar/work.md)、[备用做法](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/kit/environment/working-methods.md)

这六条都能在当前文件中拼出合理路径；它只支持“有足够的静态承接”，不支持“陌生 agent 实际最省读”。当前最值得验证的是**是否及时停、是否误把历史/备用材料当当前必读、来源投影能否重建**。

## 减法线

### S1 收掉多处手写的当前工单状态

**处置：合并当前状态 owner，保留历史回执。优先级高，置信度高。**

当前证据存在直接矛盾：
- `vault/README.md` 第 45 行仍称 Design 工单一已执行，“其余四包未开工”。
- `vault/distilled/design-kit-workorders-20261002/README.md` 第 9 行及工单表第 32 行确认工单二也已完成，三至五未开；但第 49 行“边界”又说只执行了工单一。
- `docs/verification/design-kit-wo2-20261002.md` 是工单二完成范围与限制的后续证据。

**入链与消费者**：根 README → Vault → 近期入口，以及 Distilled 的“接着做 Design Kit”任务路由，都会到该主题；下游真实消费者是下一包施工者。它会影响是否重做工单二、选哪个后续工作及怎样理解完成范围。

**最小变更**：主题的工单表保留唯一当前状态；Vault/Distilled 上层只说明主题用途并链接；主题的接收时对照单列为历史时点，边界段只写仍适用的限制。不改写原 WO1/WO2 回执，也不删除未开工三至五的授权前置条件。

**反证与先决条件**：上层短状态摘要本可降低点击成本，不能机械禁止。这里已有漂移才值得收敛；若保留摘要，必须由同一状态源投影，而非新增人工更新点。

**验收与停止**：从两个上层入口进入，均只能得到“WO1/2 完成，WO3–5 未开”的同一结论；历史回执仍可访问；不要扩展成全站项目管理系统。

[父索引](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/vault/README.md#L45) · [主题页](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/vault/distilled/design-kit-workorders-20261002/README.md#L9-L49) · [WO2 回执](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/docs/verification/design-kit-wo2-20261002.md)

### S2 从默认导航中缩减重复的批次展陈

**处置：合并入口表述，暂不物理归档文件。优先级中，置信度中。**

`vault/README.md` 同时有任务表、职责表和近期入口；`vault/distilled/README.md` 同时有工作问题表与按批次长列表。多个近期主题被重复描述，S1 已显示手写摘要会漂移。更深层的 `docs/verification/README.md` 是历史证据入口，不能当作重复垃圾。

**入链与消费者**：正常 Kit 消费多从分支直达卡片，Vault/Distilled 主要服务研究取用与来源回查；批次列表也服务追溯。这里没有证据证明全部长索引都造成了任务失败，因此不建议一刀切删列表或搬走来源。

**最小变更**：保留上层任务表；“近期入口”只保简短名称、用途与唯一主题链接，不复述动态结果；Distilled 下半部标明是历史批次回查，去除与上方同义的长描述。保留稳定链接与按日期检索。

**反证与先决条件**：研究者确实需要批次发现；一份来源可被多个任务正常引用。先用一个“按任务找材料”和一个“按日期追溯决定”的任务检查，再删描述，不以链接数量判负担。

**验收与停止**：两类读者都能找到同一主题与历史范围，上层无第二份当前状态；无须创建新的总目录。

[Vault](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/vault/README.md) · [Distilled](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/vault/distilled/README.md) · [历史验收索引](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/docs/verification/README.md)

### S3 不合并不同职责的治理文档，只缩重复总述

**处置：保留文件职责；重复总述可改互引。优先级低，置信度高。**

`documentation.md` 管可消费条目的体例；`intake.md` 管身份、原件与披露；`reference-lifecycle.md` 管指定用途验收和检索优先级；`evolution.md` 管修订、迁移和撤回。几处都谈“唯一位置、使用反馈与退出”，但消费者和操作不同，直接揉成大规范会使每次消费更重。

**入链与消费者**：治理 README 的任务表已经逐一分派；Kit 分支主要链接体例或修订；参考卡链接 lifecycle。这些不是无人消费文件。

**最小变更**：现有 owner 不动；若后续同一段规则在两处出现，仅保留一处正文，另一处写适用结论和链接。Luna/Astra 分工的短摘要允许保留；根 AGENTS 是自动发现所需的有效指令，不因其他页面也有摘要就删。

**反证与先决条件**：跨独立页面的安全限制可能是必要重复。只合并同一规则的可变正文，不合并操作前必须可见的授权、来源数据身份或披露限制。

**验收与停止**：每个治理动作有唯一详细 owner；任务消费者不增加必读文件。没有具体冲突时不开展全仓同义词大扫除。

[文档契约](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/docs/architecture/documentation.md) · [治理路由](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/docs/governance/README.md) · [修订](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/docs/governance/evolution.md) · [参考生命周期](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/docs/governance/reference-lifecycle.md)

### S4 保留迁移导航与历史决定，明确当时效力

**处置：保留兼容入口；失效的正文标历史，不删除证据。优先级中，置信度高。**

`kit/writing/README.md`、`kit/design/grammar.md`、`kit/design/references.md` 与 `kit/reporting/assessment-answer-profile.md` 已承担兼容导航。ADR-016/019 说明旧路径不再维护正文。当前根 README 仍会把设计任务送到 `kit/design/references.md`，因此旧路径不是无消费者。

历史 ADR 与回执中的“改动没有提交”“未 push”等，是写作当时的事实；在当前提交中看到它们，**不意味着远端没有 push**。应让历史文件的时间范围清晰，不替换成事后事实。

**最小变更**：新维护的当前入口尽量直接指规范 owner；其中 references.md 仍有四行路由表、状态解释和维护条款；建议根 README 直链 references/README.md，旧文件只保留迁移目标、状态和确有入链的旧锚点。其他已是短导航的文件不必再瘦身。对容易被当执行单的旧提案，原件不动，当前入口标注“历史提案，当前裁决见……”。需要正式撤回时用新决定关联 supersedes。

**反证与先决条件**：内部链接不是所有外部消费者。物理删除 stub 前还需用户掌握的宿主/旧书签消费者盘点；本轮不具备该证据，所以不建议删除。

**验收与停止**：旧链接能到新 owner，无两份活跃规则；历史日期与当前任务路由可区分。

[迁移 ADR](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/docs/decisions/016-progressive-kit-structure.md) · [Design 参考 owner](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/kit/design/references/README.md) · [当前根入口](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/README.md)

### S5 不把备用机制与宽覆盖表扩成默认规则

**处置：保留 normal 备用页与延后候选，避免新增默认负担。优先级高，置信度高。**

`working-methods.md` 已明确不是规则、不是 skill、不默认加载。ADR-021 的对照到顶，是一次有价值的“不晋升”裁决。ADR-020 的九类能力候选与交付生命周期等待真实素材；`landscape.md` 的“应知与应能”是覆盖面，不是完整专业教材。

**入链与消费者**：Kit/Environment 仅按需链接备用页；Documentation 在声称规则有效时链接对照方法；企业工作入口已可完成最小机会判断。没有必要为每个宽覆盖词另建 grammar、目录、字段或评测表。

**最小变更**：本轮不扩充这些表和默认读取；未来某条在真实任务出现缺口，再写深已有主责页面。允许删除“应当有更多”的计划性冗余，但必须保留仍在等待真实素材的明确阻塞与裁决理由。

**反证与先决条件**：备用材料可对较弱执行者或更长任务有用；当前对照不能证明它永远无用，不能因未实测而删掉。

**验收与停止**：每次只处理触发了的一个缺口；对照到顶、没有消费者或新增成本超过收益时，允许零新增并结束。

[备用页](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/kit/environment/working-methods.md) · [ADR-020](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/docs/decisions/020-entry-calibration-and-depth-check.md) · [ADR-021](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/docs/decisions/021-community-mechanisms-and-attribution-check.md)

### S6 来源与公开范围先保留并盘点

**处置：暂留补证，不做物理清理。优先级为边界约束，置信度高。**

当前 intake 明确：原件已索引或本地可读不构成上传/公开授权；目录和 Git 跟踪未实现自动隔离；历史公开面清理要先盘点实际消费者。报告不将已经 public 当新授权，也不据文件年龄、体积或零入链推断可删除。

**最小动作仅为后续建议**：如要缩公开/同步范围，先列元数据级清单，区分当前规范、可泛化说明、来源定位、受限原件与历史引用；逐项确认消费者、替代定位、权限及恢复安排。原件不放入这份用户报告，原 Chat 不复制。

**停止条件**：缺消费者或处置授权就停；历史证据有追溯用途则保留。物理分仓、历史改写、删除或重新公开是另一项决定，不混进本轮架构整理。

[入账与披露边界](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/docs/governance/intake.md)

### S7 在 ADR 索引标明局部替代关系

**处置：补范围标签，保留历史原文。优先级中，置信度高。**

决定索引将 ADR-014、015、016、019 都列为 accepted。细读 ADR-016 已明确替代 014 的自足 writing skill、015 的延后 Write/Motion 决定；ADR-019 又修订 016 对写作原理强度的读法。关系已有正文证据，不能把早期 ADR 整份判失效，但入口仍要求读者自己追链才能拼出当前效力。

**入链与消费者**：根 README 的“历史取舍”、Docs 的“查已作裁决”及维护指南均进入该索引；消费者是试图判断当前规范的维护者。

**最小变更**：只在 `docs/decisions/README.md` 对三条旧记录各补一句“哪些范围被哪个后续 ADR 替代/细化”；不再复制规则正文，不另建 taxonomy。这里的 accepted 表示当时采纳，当前适用范围以指向的有效 Kit owner 为准。

**反证与先决条件**：索引已声明新 ADR 关联旧记录，后文也解释关系，所以这是减少追读与误用风险的改善，不是详细裁决丢失。须按局部范围措辞，不能把 ADR-014/015 整体改为 rejected。

**验收与停止**：从索引即可判定 writing 现在是薄入口、Write/Motion 已有分支、八条成文原理分强度；还能追到原决定为何成立。只处理已有显式替代关系，不推定其他 ADR 过时。

[决定索引](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/docs/decisions/README.md) · [ADR-016 的局部替代](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/docs/decisions/016-progressive-kit-structure.md) · [ADR-019 的细化](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/docs/decisions/019-expression-owners-and-entry-paths.md)

## 加法线

### A1 修好同一份来源登记的两种投影

**最小补充：扩展现有 renderer 的目标选择与只读一致性检查。优先级最高，置信度高；当前缺口为静态确认，运行后果待复验。**

证据链：
1. `vault/provenance/community-grammar-20261002/catalog.json` 有 45 条独立 URL 记录，使用 `card_path` 聚成 13 个卡片目标，仍保留逐 URL 身份。
2. 当前树中 13 个目标全部存在；按 source slug 推出的 45 个目标全部不存在。这是元数据计数，不是执行脚本的结果。
3. `build_registry.py:54` 尊重 `s.get('card_path')`。
4. `render_source_cards.py:152–155` 固定按每个 slug 写文件，随后覆盖目录索引，未消费显式 `card_path`；其自动发现会包含这批 catalog。
5. `validate_repository.py:125` 只检查 registry 指向的卡片存在，164 行比较 registry 与 build 结果；不会证明来源卡正文、分组索引与 renderer 可重复生成。

**旧部件为何不足**：登记与消费者已经支持“每 URL 登记、按用途分组阅读”，生成器仍假定“一 URL 一卡”。当前校验可以通过，仍无法再生当前阅读投影。这里缺的是现有链条一致性，不是另一套 catalog。

**最小变更位置**：
- `scripts/render_source_cards.py`：从现有 `card_path` 决定目标，缺省时继续 slug；重复目标按已有 group/card_path 显式聚合，保留每条 URL 的状态、用途和限制。校验目标仍在预期管理范围，禁止路径逃逸或覆盖不相干文件。
- `scripts/validate_repository.py`：复用同一预期投影逻辑做非写入比较，报告缺目标、正文/索引漂移；初期限定现有 provenance catalog 范围。
- `scripts/README.md`：同步命令的真实覆盖和非破坏边界。

不要把“尊重 card_path”简化成循环中反复覆盖同一文件；那会只留下最后一条来源。也不要自动删掉不在新目标集中的旧卡。

**删去的负担**：手工维护分组卡与自动生成卡两套真相；以后每次入账不必靠维护者记住哪些目录不可重建。

**验收**：单 URL 卡、多个 URL 共卡、缺省 slug、非法路径、冲突分组各有小 fixture；同一输入连续生成两次无差异；本批得到 13 个阅读目标，45 个 URL 身份无丢失；registry 与卡片目标一致；已有人工状态和限制不被静默覆盖。先在隔离副本验证，随后按批准范围落地。

**停止**：修到当前格式能可重复生成即止；不引入内容平台、全站 schema 或自动删除。

[登记](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/vault/provenance/community-grammar-20261002/catalog.json) · [13 组阅读入口](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/vault/provenance/community-grammar-20261002/cards/README.md) · [renderer](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/scripts/render_source_cards.py#L138-L170) · [registry](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/scripts/build_registry.py#L45-L57) · [validator](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/scripts/validate_repository.py#L118-L165)

### A2 让生成索引保留最小的选用理由

**最小补充：已有字段的消费投影，不新加字段体系。优先级中，置信度中高。**

当前 `render_source_cards.py` 的来源索引只有标题、证据状态、purpose tags；卡片正文投影 summary、limits 与 revisit。最新 community catalog 已有 `used_for`，但该字段既不进入 renderer 的卡正文，也不进入 registry 的摘要字段。部分 summary 只是“本仓库没有打开，研究包记了读取范围”，能表达证据边界，却不足以帮助陌生人选用。

**旧部件为何不足**：来源名和 GRAMMAR/REFERENCE 标签回答“是什么类别”，未必回答“何时值得读、能做什么”。但 Kit 任务入口和分组主题页已能补足不少导航，因此不是全仓路由失败。

**最小变更**：完成 A1 后，只为此类来源投影现有 `used_for` 到简短用途说明；保留证据状态与“未打开”的独立句。缺字段时沿用摘要，不强制批量回填所有 catalog。源卡和索引都由同一逻辑生成，避免重复人工描述。

**删去的负担**：为了知道是否相关而打开多张无差别卡，或另造一份手工任务目录。

**验收**：给不含材料名称的来源消费问题，读者能从用途区分部分恢复、调试、归因验收和不适用项；不能把转述用途误解为已核实有效。与改前比较查阅量与误选，不只测链接可达。

**反证与停止**：若现有主题卡已让读者正确选路，且投影没有减少误选或查阅，保留现状；不为“字段齐全”扩表。

[卡片投影代码](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/scripts/render_source_cards.py#L42-L135) · [现有用途字段](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/vault/provenance/community-grammar-20261002/catalog.json) · [description 契约](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/docs/architecture/documentation.md)

### A3 用最新入口补一次有明确停止条件的消费验收

**最小补充：一份现有回执格式的实测记录；先不改入口规则。优先级高，置信度高。**

WO2 曾有六次读 Kit 的运行，每次读 19–33 个文件，回执称“没有一次在够用时停下”。但它冻结在 `3954ca0`，早于 ADR-019 的两入口修订，**不能把这个旧结果当作 ff96b9a 仍然失败**。ADR-019 后的走读已不再读架构和入账，但读取量只在一个任务下降、一个上升。ADR-021 又明确：备用素材页及其两句入口是在走读之后写的，未经过那轮走读。

**旧部件为何不足**：停止语句已经存在；已有实验说明问题会随入口和模型变化，却没有覆盖最后写入的入口组合。再写一条“少读”规则缺乏理由。

**最小动作**：挑一件真实、已授权的下一次任务，固定最新 Kit revision；预先写明必须保住的产物、危险误选与不需要的分支。用当前入口与不读/改前入口作小对照，保留一个未参与措辞调整的近失例。沿用项目 index 与回执，仅记录必要层、误读、遗漏、输出和成本。

**删去的负担**：无效入口句、无收益默认读取，或反复重复同类合成题而不断加规范。

**验收**：输出正确且能在输入、约束、完成标准齐备处停；没有因为拒读而丢关键限定；新入口若未贡献收益就不晋升。只报告本任务/本执行环境，不宣称全仓永久有效。

**停止**：对照到顶且无可归因收益，记“保持/不新增”即结束；只有观测到明确导航断点才改一处 description 或条件链接。批次部分成功可选直达 `working-methods.md#一批动作做到一半`，但这只是待检验的小候选，现有通用链接已可到达，不应先升为必读。

[WO2 的版本与成本](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/docs/verification/design-kit-wo2-20261002.md) · [ADR-019 的修复与限制](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/docs/decisions/019-expression-owners-and-entry-paths.md) · [最后新增入口未走读的范围](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/docs/verification/community-grammar-20261002.md#L61-L64)

### A4 留一条贯穿真实问题到保留或撤回的薄样例

**最小补充：一次真实修订的串联说明，放在现有回执与主责页面；不新建 RSI 目录。优先级中高，置信度高。**

`evolution.md` 已有触发、旧判断、新证据、裁决、影响路径与验证；`reference-lifecycle.md` 已有 supports/challenges/extends/duplicates、降级与退出；ADR-021 已做过对照改变裁决的演示。因此不缺一份新的“RSI 总规范”。

**旧部件为何仍不够**：陌生维护者能找到各阶段，但实际可复用性还需一条本仓库真实问题的完整证据链，尤其要分清“合成走读”“维护修复”与“业务效果”。A1 的投影分叉是实际维护问题，适合做最小维护闭环；A3 的真实消费问题则用于行为闭环，二者不能混成同一种效果证据。

**最小动作**：
- 在本次对应 `docs/verification/<批次>.md` 留一段：触发与固定版本 → 一处候选 → 正例/反例/对照 → 变更或不变 → 回退点 → 再消费结果。
- `evolution.md` 只加指向这个完整样例的一个链接，已有字段不再抄一遍。
- 若改变参考用途或规则，当前 owner 回写结论；证据留回执/项目。每次允许零规则新增。

**删去的负担**：后续维护者把 ADR、实验协议、项目记录和原始提案全部重新拼读；避免每次聊天都入一条新规则。

**验收**：另一个维护者不靠会话背景能解释为何改、改哪一处、什么反例会使它撤回、未测试消费者是谁；回退只影响本次小变更，旧证据仍可回查。

**停止**：一个真实维护闭环与一个后续消费检查足以示范；没有真实消费材料时明确等待，不用更多合成卡填满九类能力语法。共享实现仍遵守 ADR-002，不把知识说明的小修套成三场景门槛，也不让小修成为绕过实现门槛的借口。

[修订流程](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/docs/governance/evolution.md) · [使用反馈与退出](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/docs/architecture/documentation.md) · [组件晋升边界](https://github.com/lesPrivilege/Praxis/blob/ff96b9a16cfab14977a0891cb8c141124e124ca7/docs/decisions/002-promotion.md)

## 两条线合并后的取舍

| 可能冲突 | 本次裁决 |
|---|---|
| 想少读，于是删除解释和反例 | 不采纳。删除同义导航和重复当前状态；保住压力条件、来源范围、例外及反例 |
| 想自足，于是把所有来源抄进 Kit | 不采纳。Kit 负责最小判断；来源保留身份、版本与按需回查 |
| 想统一，于是把 references、provenance、registry 合成一个大目录 | 不采纳。先修同一 catalog 的生成与消费一致性；历史 URL 身份与引用映射继续保留 |
| 想发现更好，于是加全站 frontmatter 或一个 skill 对应一个素材 | 不采纳。先用既有任务描述与 `used_for`；只有实际宿主消费提出要求才做 adapter |
| 想做 RSI，于是增加候选数、表单和流水线 | 不采纳。真实断点、一个候选、有限对照、有限裁决即可；对照到顶时零新增 |
| 想清理历史，于是重写未提交/未发布回执 | 不采纳。标清历史时点和当前 owner；历史回执保持当时证据 |
| 想补恢复路由，于是把所有备用做法变成默认必读 | 不采纳。现有路由保留，只有新基线任务暴露遗漏才补条件链接 |

### 两项原则的追踪矩阵

| 环节 | 当前 owner | 原则一 发现与消费 | 原则二 增量复用 | 这轮建议 |
|---|---|---|---|---|
| 任务触发 | AGENTS、Kit/各分支 README | 已有任务与不适用条件 | 导航反例可回流 | 保留；最新组合补验证 |
| 选路与停止 | Kit、Write、Design、field-loop | 已有够用即停和 fallback | 只修实际断点 | A3，不再泛加 stop 栏 |
| 内容判断 | grammar、contracts、场景模板 | 定义、约束与最小产物 | 同一规则唯一 owner | S3/S5，按真实素材写深 |
| 例子与证据 | 项目、Vault、分层验收 | 能区分用途、来源与未验项 | 对照、反例、留出 | 不复制原件，保留负结果 |
| 当前状态 | 主题当前裁决表 | 避免误读过期施工状态 | 变更只维护一处 | S1/S2 |
| 来源投影 | catalog、renderer、registry、validator | 选路描述与实际卡片一致 | 可重复生成与差异检查 | A1/A2 |
| 反馈与退出 | 项目 index、evolution、回执 | 不让反馈变日常前置 | 小修、回退、降级、retire | A4，允许零新增 |

## 可交给 Opus 的首批串行工单

以下是待裁决的工作单，不是已获准执行的仓库改动，也不授权外发、安装或清理历史。

### 工单一 校准当前状态并缩短重复入口

- 文件：`vault/README.md`、`vault/distilled/README.md`、`vault/distilled/design-kit-workorders-20261002/README.md`。
- 先读：WO1/WO2 回执与该主题工单表。
- 改动：落实 S1；S2 只处理同一主题的重复动态摘要，不扩全仓。S4 的旧参考入口与 S7 的 ADR 范围标签作为同批可选项，先核对入链与局部替代再裁决，不因这张工单自动扩围。
- 保留：历史接收时对照、原始提案、回执、三至五的授权前置。
- 验收：两个上层入口和主题边界不矛盾，旧链接仍可达。
- 停止：不重写历史，不清 raw，不开始工单三至五。

可用的短改文示例：

> 该主题的当前执行状态见本页“五包工单的裁决”；接收时基线和历史回执按各自日期理解。工单三至五仍需满足表中的开工条件。

上层入口可缩为：

> PraxisDesignKit 工单提案：五包串行工作的范围、当前裁决与下一包输入。

### 工单二 修复来源卡投影闭环

- 文件：`scripts/render_source_cards.py`、`scripts/validate_repository.py`、`scripts/README.md`；必要的最小 fixture 放现有测试/验收位置，由实际实现者确定，不先建框架。
- 范围：仅当前 provenance catalog 的单条卡与显式分组卡。
- 改动：落实 A1；按 `card_path` 分组时保留全部 URL 行，registry 和 renderer 使用同一目标含义。
- 验收：13 目标/45 身份，连续重建无差异；正例、冲突和路径边界均覆盖；不删除旧文件。
- 回退：保留生成前快照或版本，失败不覆盖当前可消费卡。
- 停止：可重复生成和检查成立，不顺手重构所有 intake 类型。

### 工单三 校准一处来源消费描述

- 依赖：工单二目标与投影已稳定。
- 文件：同一 renderer 的卡片/索引投影与本批 catalog；只使用现有 `used_for` 等字段。
- 改动：落实 A2，保留证据状态句，不批量强制补元数据。
- 验收：一个无材料名任务和一个拒用近失例，分别检查选路、证据强度及读取代价。
- 停止：无可归因收益则不扩大，保留当前主题卡即可。

### 工单四 用一次真实消费完成有限增量

- 输入：用户选择或提供一件真实任务；未提供时等待，不能用合成任务冒充。
- 范围：Write/Design、业务机会或批次恢复中任取一个实际发生的缺口，不同时展开全部能力。
- 动作：落实 A3/A4；先固定基线与预期，再决定是否改一处入口或规则；保留对照/反例/留出与成本。
- 写回：消费者 index、现有回执、唯一主责页面；evolution 最多补一个样例链接。
- 验收：另一执行者能不依赖本轮会话继续消费，能找到回退与退出理由。
- 停止：任务完成且新增规则无收益时零新增；效果不明保持候选；不新建平台、不生成更多默认表单。

## 最终判断

Praxis 当前已具备**任务入口、规则 owner、消费边界和否定证据**，是可按任务使用的知识与契约库。下一步最有收益的工作是让这条现有链条可靠闭合：上层不再重复维护易过期状态，来源卡能从登记可重复再生，最新入口经一次真实消费检验，所得增量能被下一位使用者独立理解和必要时撤回。

这四件事完成后，再根据真实缺口决定是否写深某条专业能力。没有必要先用新增目录、更多规则或清空历史来证明项目成熟。

