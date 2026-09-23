---
Status: Product Narrative Brief
Edition: 2026-08-25
Audience: Technical founder, product leader, marketing leader
Semantic source: ../architecture/schema-engineering.md
---

# Schema Engineering for Courtwork

## 把专家跑通的方法，编译成团队反复使用的工作能力

Courtwork 的核心产品方法，是把领域判断编译成模型可写、系统可验、人可读改签的 Work Contract。

模型负责生成提案，确定性系统执行门禁，人对着来源完成确认、驳回与修正。同一份 schema 贯穿模型输出、工作界面、事件账本、续行投影与 E2E 验收，使工作存在于单次会话和单个模型之外。

> 通用 Agent 提供干线能力；Schema Engineering 完成最后一公里。

## 1. 为什么是最后一公里

通用 Agent 可以研究、比较、起草和调用工具，但每次落入具体工作，用户仍要重新支付三笔成本：

- 把任务、材料和交付标准编成 prompt；
- 在生成过程中持续监督和补位；
- 判断结果是否有来源、是否完成、是否取得正式效力。

Courtwork 把这笔成本一次性编进垂类包：字段、词表、来源策略、确认动作、renderer、projection 和测试随版本共同维护。模型只承担生成段，规则承担可确定的裁决，专业判断落在结构化的人类工作面。重复使用越多，单次交付的边际编订成本越低。

## 2. 从专家 Demo 到 E2E

专家 Demo 不是宣传素材，而是专业能力的 source material。Courtwork 观察专家如何：

- 选择真实任务与材料；
- 调整问题、上下文和工具；
- 发现遗漏、修订或驳回结果；
- 判断什么可以交付、什么需要升级。

这些行为被拆成四层：跨任务稳定义务、机构规则、Matter 特有要求、不可转移的专业判断。前三层进入版本化 Work Contract，最后一层进入人类裁决位。

```text
Expert Demo
→ Human Harness Extraction
→ Work Contract
→ Vertical Package / Agent Extension
→ E2E Acceptance
```

E2E 检验完整工作结果：原作者离场后，另一位使用者能否从真实材料出发，得到有来源、有覆盖说明、有处置状态的 artifact，并完成确认、驳回、修正、恢复与续行。伪造坐标、缺失词表、绕过确认或破坏事件回放时，对应测试必须精确变红。

## 3. Work Contract 是弱编译器

Work Contract 把一个工作场景编译到两个后端。

| 模型后端 | 确定性中间层 | 人类后端 |
|---|---|---|
| prompt segment | schema / pointer | renderer / vocabulary |
| draft schema | evidence / coverage | source expansion |
| target address | authority / completion | confirm / reject / revise |
| allowed verbs | state transition | escalation / delivery |

“弱”描述判定如何分工：机器处理结构、坐标、词表、权限和明确覆盖；人承担重要性、风险接受、例外和最终责任。编译器不复刻专家的全部思维，只固定可靠委派所需的输入、依据、动作和后果。

## 4. 一张 schema 的四个消费者

1. **用户**：逐字段核对来源，确认、驳回与修正落在明确对象上。
2. **Agent**：schema 实例成为长任务与续行的语义锚点，当前状态由投影重建。
3. **上游模型**：提示词段、输出约束和目标地址随包版本化，调研与定制不会随会话蒸发。
4. **下游模型**：既有结构吸收大部分临时编译工作，低成本模型也能稳定承担生成段。

因此，schema 同时是限定、界面与载体：它规定表达空间，组织人的裁决，并承载事件、存储、投影、评测与跨系统交换。

## 5. 从生产修订到 Post-training

每次确认、驳回、修正、定点重试和 coverage 缺口都以 RevisionEvent 或失败记录进入账本。改进从归因开始：问题来自 Contract、Context、Tool、Validator、Evaluator，还是 Model？

```text
Production Event / E2E Failure
→ Failure Attribution
→ Contract / Validator / Eval / Environment Refinement
→ Regression
→ Selective Post-training
```

一次修订先改变当前 artifact；跨任务重复出现、经复核且语义稳定的模式再晋升为 Contract、validator 或 eval。只有模型缺口在固定 Contract、Context、Tool 与 Evaluator 后仍稳定复现，才进入 post-training。Work Contract 同时提供训练任务定义、输出目标和验收标准。

可训练材料来自显式授权、脱敏或合成 Environment。案件内容留在案件账本；生产事件首先服务运行、审计、产品修订和评测构造。

## 6. Courtwork 如何封装这一方法

一个垂类能力以 `VerticalPackageManifest` 闭合：

```text
artifact descriptor
+ scenario
+ renderer / uiTemplate
+ projection / vocabulary
+ source policy / confirmation policy
+ fixture / golden / conformance
```

准入同时回答两件事：模型能否按目标地址写出合法数据；人能否用领域语言看到来源、状态并完成修正确认。两端与事件回放、第二 namespace 同宿主测试共同构成包级 E2E。

Legal 是第一条压力测试：原件 → 引语 → 系统锚点 → 结构化结论 → 人工决定 → docx。PM 是第二 namespace 的 ABI 证明。新的垂类复用同一套 core 机器层，把领域差异留在包内。

## 7. 产品资产与衡量

模型能力与 prompt 措辞持续折旧；以下资产随使用复利：

- 领域字段、词表与确认规则；
- 来源解析、确定性 validator 与 renderer；
- Work Contract、E2E fixture、golden 与 failure taxonomy；
- 经授权沉淀的 eval 与合成 Environment；
- 跨模型、跨版本仍成立的包级 ABI。

衡量重点落在 accepted work product：首次可采用成果时间、来源覆盖、人工修订率、E2E 通过率、恢复准确率、单次运行成本，以及更换模型后的性能保持。

> Prompt 会折旧；契约、验证器、词表与来源能力会复利。
