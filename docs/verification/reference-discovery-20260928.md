# 需求驱动的参考发现与优先层验收 · 2026-09-28

用户目标：有相关需求时，模型自己的注意力分配与Kit的目录、文档语义足以支持渐进披露及消费已有参考，包括原子样张和外部事件快照；消费结果可持续回流维护。不要求用户每次点名资料，也不靠无限扩张单条prompt。

## 核查结论与边界

迁移后的核心任务链已具备结构，但本轮开头还不能声称所有材料无需额外引导。Luna做只读路径审计，main核对索引构建和入口；发现并处理：

| 缺口 | 本轮处理 |
|---|---|
| Vault总入口仍称样张未生成 | 同步现有产物、review与优先参考状态 |
| Design父级仍只登记P01 | 补LAB-20260927、完整atom索引与精选卡片的分别入口 |
| 参考有登记但没有先读次序 | [ADR-017](../decisions/017-reviewed-reference-priority.md)引入任务范围内的reference_priority与生命周期；首批两张结构参考卡通过限定用途验收 |
| 非Design参考族缺任务入口 | Work System/Grammar/Contracts/Environment按实际任务链接现有来源族，不复制catalog、不提升为实现承诺 |
| Runtime研究没有从环境任务可达 | Environment/Adapters链接带日期的研究、消费边界与来源/快照回查 |
| 根README残留旧“增量”锚点 | 改为当前维护位置 |
| registry被称为所有材料投影 | 明确它是已接入Chat与外部URL的投影；本地项目/下载/实验由intake和专题索引定位，未声称全覆盖 |

## 首批高权重参考的范围

[REF-COMP-001](../../kit/design/references/curated/comparison-continuity.md)与[REF-COMP-002](../../kit/design/references/curated/note-adjacency.md)验收的是已泛化结构说明的查阅价值。main看过对应1440/375截图，本轮核对了HTML/CSS。E06-b的窄屏可访问对象标签、共享数字和实现均有边界；W03-b的多注释碰撞与跨字体等未测。高权重只作用于两张说明卡，不改变实验本体和未验收代码的状态。

每张卡有稳定ID、任务、取用说明、来源、验收范围、不适用条件和消费/维护入口。实际demo消费者尚无记录；后续 supports/challenges/extends 先登记观察，再由main修订、降级或停止推荐。

## 不点名材料的新上下文检查

为避免只凭手工链接宣布成功，派出两个不继承本会话的Luna任务。输入只有实际需求、仓库工作目录和只读范围，没有提供材料名称、来源ID或应读文件路径：

- 手机方案比较：比较3个方案，条件只限制其中一个方案，并解释“每天都能开门”的反例。
- provider故障切换：部分输出、可能发生的工具操作、服务方私有状态、取消与恢复。

任务要求输出具体判断和实际阅读依据，未生成HTML或执行外部系统。两项均完成，摘要见 [runs.json](reference-discovery-20260928-runs.json)。

第一项自行找到REF-COMP-001，并继续进入实验的E09、T05、T06和C02，提出属性并置、限定作用范围与贴近量词的反例；它没有被优先卡片挡住而停止探索，也没有把synthetic数字当门店事实。第二项沿Environment/Adapter找到Runtime研究、来源卡及本地架构快照，区分未知效果、私有会话、取消与恢复，并保留日期和未运行边界。

这验证了两条任务的发现和语义消费，不是完整成品、可访问性或线上运行验收；也没有证明读取集合最小或效率最优。模型对业务数据、实际条件的澄清需求与“还需要用户指出参考在哪里”不同，前者不应靠编造消除。测试建议仍由main按证据裁决，不直接全部晋升为规范。

## SourceWeft补充材料

本轮完整读取用户提供的比较对话1轮/2消息；历史assistant建议只作研究材料。Luna有界核对固定提交`f88212b91216267f3dc1053f9424010cae9de5b6`的HTML Slides入口、catalog、capability manifest、explore与context compression五个文件；其余链接保留身份而不扩大核实范围。

[研究入口](../../vault/distilled/sourceweft-praxis-20260928/README.md)从Environment消费角色契约和共享证据规则可达。main只把它作为normal consumer/能力包装参照，并明确摘要用于回查；没有新增runtime、RAG、安装机制或machine schema。共登记12个显式URL身份，其中5个固定提交文件已核查、7个只保留定位且未核查；原citation index=6保持missing-original。上游源码字节及依赖未保存，本地为摘要/来源卡可读层。

## 尚未完成的范围

没有逐份对全仓原件、下载、所有外部URL及每个历史素材做消费者对账。未验证其他挂载路径、所有模型或任意未来任务；也没有实现强制注意力控制。40处既有答卷旧文件名断链仍单列，不因参考结构更新而消失。

外部事件研究保留原访问日期、版本与快照缺口，本轮没有重访外部网络或验证产品实际运行。来源失效、任务反例、入口遗漏与必须由用户点名的情况，均按 [参考生命周期](../governance/reference-lifecycle.md)进入后续维护。

## 仓库检查

已重建Chat inventory、registry与snapshot manifest，并运行 `python3 scripts/validate_repository.py`。最终输出见 [机器回执](reference-discovery-20260928-result.json)；消息/引用覆盖、来源卡与快照hash检查未增加错误，剩余40条均为先前答卷改名引起的旧路径断链，因此全库仍为fail。`git diff --check`通过。

首次检查发现SourceWeft来源映射中一处turn ID抄写错误，已从原始capture读取真实ID修正intake/catalog并重建registry；未修改原Chat。检查计数覆盖114条消息、338条来源、213个引用映射和623个快照。这些计数仍不等于所有本地材料或每个消费场景均已验证。
