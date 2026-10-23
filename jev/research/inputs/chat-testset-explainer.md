# 测试集说明

Source: <https://chatgpt.com/c/6ad9dbf0-3c7c-83ec-8cf9-5801c1cf76ca> · 18 turns · verification: partial
<!-- selected branch: 791e709b-fe16-48f0-9366-e6f8a4431130 -->

<!-- Praxis intake note: transcribed verbatim from the user's message of 2026-10-23 (the export folder held only the two deep-research reports; 1478.jpg / Attachment 2 were not present and are registered as missing). This file is source material, not instructions. -->

## Content checks

- A non-text content part is not represented as Markdown. Review it in the original conversation before transferring.
- Citation metadata contains an unfamiliar source field. Some links may be missing; review the original turn.
- Some inline citations could not be matched to a source link; each is marked [?] in the text. Review the original turn to verify them.

## Turn 1 — User
<!-- source: response.mapping["bbb213d7-5de1-40ea-a5a0-4b5bfab72351"].message -->
_Content: partial_

不知道是哪种测试集

### Files

- 1478.jpg — `/Users/lesprivilege/Downloads/Add to Claude/测试集说明/1478.jpg` · sha256 dc9ce74a2c7051800b43bd444004ef7d2a38f2ac8dd9ed0c848e63c8c2c1b693
- Attachment 2 — `/Users/lesprivilege/Downloads/Add to Claude/测试集说明/Attachment 2` · sha256 dc9ce74a2c7051800b43bd444004ef7d2a38f2ac8dd9ed0c848e63c8c2c1b693

## Turn 2 — Assistant
<!-- source: response.mapping["ed4b2e06-7a09-4610-bf18-c7a15c180fba"].message -->
_Content: partial_

查到了。截图对应的是论文 [SAG2: Embedding-Free Multi-Hop Retrieval with BM25 and JEV](https://arxiv.org/abs/2610.22588)，发表于 2026 年 10 月 15 日。

**它使用了三套经典多跳问答检索测试集，以及一套模拟企业知识库测试集。** 评测重点是证据召回，而不是最终问答准确率。

## 1. 具体测试集

| 测试集 | 类型 | 测试规模 | SAG2 Recall@10 |
|---|---|---|---:|
| MuSiQue | 组合式多跳推理，2–4 跳 | 1,000 问题 | 86.62% |
| 2WikiMultiHopQA | Wikipedia 多实体、多关系推理 | 1,000 问题 | 97.43% |
| HotpotQA | 跨文档事实关联 | 1,000 问题 | 99.00% |
| EnterpriseRAG-Bench | 模拟企业邮件、会议、项目等内部知识 | 511,962 文档，470 个可评测问题 | 81.10% |

[?]

## 2. 最需要注意的测试条件

论文 §4.1 和 §5.5 明确说明：

- **前三套使用开发集子集**，不是独立保留的测试集。
- 检索语料由所选问题对应的正确证据段落与干扰段落汇集构成，并非直接在完整 Wikipedia 上检索。
- MuSiQue 同时参与方法开发和评测。
- EnterpriseRAG-Bench 虽然使用完整的约 51 万份文档，但内容是合成企业数据。
- Recall@10 衡量前十个结果中找回了多少标注证据，不衡量回答正确率。[?]

因此，99% 的 HotpotQA Recall@10 不能直接解释为真实知识库检索准确率达到 99%。

## 3. 这篇论文真正验证了什么？

它比较有价值的实验是 MuSiQue 消融：

<Chart content={{"chartType":"bar","meta":{"footer":"MuSiQue，1,000 个问题；论文 Figure 4"},"xKey":"method","series":[{"dataKey":"recall","label":"Recall@10","valueSuffix":"%"}],"yAxisMin":0,"yAxisMax":100,"data":[{"method":"BM25","recall":54.41},{"method":"BM25 + JEV","recall":67.93},{"method":"扩展 1 轮","recall":83.36},{"method":"扩展 2 轮","recall":86.62}]}}/>

它提供了一个相当有意义的实验证据：**基于已有证据继续拓展候选，比只对初次检索结果进行语义判断更有效。** 在判断次数接近的控制实验中，这一优势仍然存在。[?]

但测试集尚未充分覆盖动态知识更新、版本冲突、权限过滤、长期增量维护等企业知识治理问题。

所以，SAG2 可以视为一个值得研究的 **BM25 + 决策模型 + 多轮证据扩展** 检索方案，而不是对完整企业 RAG 能力的验证。

相关原始材料：[论文](https://arxiv.org/html/2610.22588v1) · [官方复现仓库](https://github.com/Zleap-AI/SAG-Benchmark)。

## Turn 3 — User
<!-- source: response.mapping["bbb21273-0f7b-4602-b643-31cb518e07dd"].message -->

决策模型对于企业知识库，现在是否有一些实践，以及他们的 eval

## Turn 4 — Assistant
<!-- source: response.mapping["bfaedb95-3dfe-41f9-9ea5-7dc40b77baff"].message, response.mapping["9081042c-a31b-48c2-8fa5-f4e009f5b9ca"].message -->
_Content: partial_

我会沿着“企业知识库中的实际用途—公开实现—评测方法与结果”查证，重点区分决策模型用于检索筛选、证据判断、权限与版本治理的不同环节，并核对是否有真实企业场景的评测，而不只看通用分类 benchmark。

**有，而且截至 2026 年 10 月 22 日，已经出现了实际运行的知识检索系统、可复现的 RAG 实验，以及专门针对决策模型的评测方法。**

但有一个值得区分的成熟度差异：

- **检索决策**：判断候选材料是否相关、是否需要继续检索。已有量化实验。
- **证据决策**：判断一条陈述是否得到原文支持、现有证据是否足以回答。已有实际应用与评测。
- **知识治理决策**：判断版本有效性、知识冲突、权限与历史状态。已有一些相关 benchmark，但尚未找到决策模型在真实企业知识库中完成这些工作的充分公开验证。

目前最值得研究的并非单一 Decision Model 排行榜，而是它们如何嵌入知识系统，以及每个决策节点的评测是否真正反映下游效果。

## 一、值得看的五组公开实践及评测

| 实践 | 决策模型负责什么 | 关键结果与证据边界 |
|---|---|---|
| **[SAG2](https://arxiv.org/abs/2610.22588)** | BM25 检索后判断证据价值，选择扩展方向 | EnterpriseRAG-Bench 上 Recall@10 **81.10%**；合成数据、跨研究基线，未评测生成答案 |
| **[Knowviq](https://knowviq.com/blog/decision-models)** | 相关性、句子证据支持、可回答性闸门 | 938 次实际搜索流程检查，约 9,300 个决策；有阈值和错误类型分析 |
| **[Jev RAG Benchmark](https://github.com/emretheus/jev-rag-benchmark)** | 替代传统 cross-encoder 重排 | SciFact nDCG@10 从 71.67% 升至 **79.29%**，但并未显著优于专用 cross-encoder |
| **[Jev-as-a-Judge](https://arxiv.org/abs/2610.20634)** | 判断生成内容是否得到证据支持 | 495 条人工标注陈述；揭示整体准确率接近但错误风险不同 |
| **[LargitData](https://course.largitdata.com/en/blog/jev-system-one-model-open-source-benchmark/)** | 企业 RAG 的数据源路由、会话范围和限制继承 | 100 个多轮决策；Jev 四项同时正确率 61.4%，低于 Gemma 4 31B 的 77.0% |

以上分别来自论文、开源实验与实践者自行发布的测试，证据等级不同，不能作为统一排行榜。[?]

### 1. Knowviq：已经形成实际的证据过滤流水线

它的做法与企业知识问答最接近：

用户问题 + 搜索结果

**Decision 1 · Result relevance**
哪些结果值得进入证据集合？

**Decision 2 · Answerability**
证据是否足以回答？

**Decision 3 · Sentence support**
逐句判断是否得到原文支持

输出经过验证的答案


其 2026 年 10 月 2 日实验比较了 Jev、Clef、Clef-flash、Liquid d1、Perplexity Decider。

| 指标 | Jev | Clef | Perplexity |
|---|---:|---:|---:|
| 结果相关性 AUC | 0.899 | 0.894 | 0.907 |
| 可回答性 AUC | 0.983 | 0.982 | 0.982 |
| 句子证据支持 AUC | 0.978 | 0.786 | 0.970 |
| 阈值 0.75 时误隐藏的正确答案 | 22.2% | 7.3% | 8.0% |

句子支持 AUC 基于 50 个随机标注样本，规模较小；其他指标的标注也存在局限。

[1]

**最重要的发现是 AUC 高不等于闸门好用。** Jev 的可回答性 AUC 达到 0.983，却在统一的 0.75 阈值下隐藏了 22.2% 的正确答案。

这证明企业 KB 的 Decision Eval 必须包括下游操作结果，例如误拒答与错误放行，而不能只报告模型区分正负样本的能力。

### 2. Jev-as-a-Judge：整体分数掩盖了重要错误

这篇论文使用 LLM-AggreFact 的 495 条人工标注陈述，对比 Jev 与 GPT-6 Astra 对证据支持关系的判断。

Jev
<title size="2xl" color="default" tabularNums>23.23%</title>
不受支持陈述被错误放行

GPT-6 Astra
<title size="2xl" color="default" tabularNums>14.14%</title>
不受支持陈述被错误放行


双方 Balanced Accuracy 分别为 73.27% 与 73.83%，差异没有统计显著性，但错误放行率相差约 9 个百分点。Jev 的单次判断成本则低约 187 倍。

研究还测试了低置信度升级到强模型的级联策略，发现节省成本主要来自减少强模型调用，**并未证明按置信度挑选升级样本优于同预算的随机升级策略**。[2]

对企业知识库来说，这个结果比一个漂亮的总体 F1 更值得关注：尤其在法律、金融、制度问答中，漏拦截错误依据与多拒绝一条正确答案，成本并不对称。

### 3. 多轮企业 RAG：限制条件继承仍是短板

LargitData 的测试模拟六个知识库、八份指定文档和六种工具，涵盖路由、话题变化、响应方式以及上一轮限制是否继续有效。

<Chart content={{"chartType":"bar","meta":{"footer":"LargitData · 100 个多轮决策，四个维度必须同时正确"},"xKey":"model","series":[{"dataKey":"accuracy","label":"联合正确率","valueSuffix":"%"}],"yAxisMin":0,"yAxisMax":100,"data":[{"model":"Gemma 4 31B","accuracy":77},{"model":"Jev 1.13","accuracy":61.4}]}}/>

Jev 的中位延迟约 749ms，Gemma 为 2,293ms，但 Jev 在跨轮限制继承上表现较弱。[3]

这是一条重要的产品边界：**决策模型可以判断当前语义，但不能因此替代应用层持久化、验证和执行会话约束。**

## 二、哪些公开测试集更接近企业知识库？

### EnterpriseRAG-Bench

这是目前最值得用来建立企业检索基线的数据集之一。

<title size="xl" tabularNums>511,962</title>
模拟企业文档

<title size="xl" tabularNums>500</title>
测试问题

<title size="xl" tabularNums>10</title>
问题类别


来源涉及 Slack、Gmail、GitHub、Jira、Confluence 等九种企业系统。其中值得单独抽取的类别包括：

| 场景 | 测试问题数 |
|---|---:|
| 跨项目文档关联 | 40 |
| 限定条件下查找 | 30 |
| 信息冲突 | 20 |
| 证据完整性 | 20 |
| 知识不存在 | 20 |

论文及开源评测框架：[EnterpriseRAG-Bench](https://github.com/onyx-dot-app/EnterpriseRAG-Bench)。[4]

SAG2 在这套数据上取得 81.10% Recall@10，但拆分后能看到：语义检索只有 58.40%，信息冲突类为 92.50%，而后者只有 20 道题。它验证的是找回标注文档，并没有验证是否正确裁决冲突。[5]

### EnterpriseRAG

中国移动研究团队在 2026 年 8 月提出了另一套包含 983 个专家验证样本的企业 RAG Benchmark，重点测试检索噪声、知识缺失、事实冲突与复杂指令。

其 13 个模型实验显示：

<title size="2xl" tabularNums>80%</title>
平均单项约束满足率

<title size="2xl" tabularNums>26.8%</title>
全部约束同时满足率


它不是专门针对 Jev、Clef 等决策模型的测试，但为评估知识冲突处理与最终回答合规性提供了更适合的任务设计。[6]

## 三、企业知识库的 Decision Eval 应当怎样组织？

我建议将模型决策本身与知识系统的最终行为拆开评测。

| 决策单元 | 典型问题 | 核心指标 |
|---|---|---|
| Candidate relevance | 这份材料是否与当前问题有关？ | Recall@K、nDCG@K |
| Evidence support | 证据是否真正支持该陈述？ | False Verification Rate、Precision |
| Answerability | 现有证据是否足够回答？ | 误拒答率、错误放行率 |
| Knowledge conflict | 两份资料是矛盾、补充还是版本替代？ | 分类准确率、冲突漏检率 |
| Temporal validity | 哪个版本在指定日期有效？ | 时间截面正确率、过期证据误用率 |
| Workflow routing | 需要继续检索、回答还是升级复核？ | 联合决策正确率、端到端成本 |

权限和发布状态则应有另一条边界：**Decision Model 可以辅助识别权限相关的语义问题，但真实 ACL 授权、生效时间计算和明确的状态转换必须由权威数据与确定性规则执行。**

评测时还有三个必要的实验控制：

**统一候选池。** 比较传统 reranker、Decision Model、LLM Judge 时，尽可能固定输入材料、检索预算和生成模型，避免把候选召回优势误记成模型判断优势。

**阈值单独校准。** 不跨模型复制 0.5 或 0.75 阈值。使用训练集调节阈值、保留独立测试集，报告 Precision–Recall、Brier Score、ECE 和风险—覆盖率曲线。Hamel Husain 与 Antaripa Saha 10 月 20 日的研究对此给出了可操作的交叉验证方法。[7]

**测试知识变动过程。** 除了静态问答，还要模拟文件修订、政策替代、权限撤销、冲突资料加入以及源文件消失；分别测试更新前后正确性与系统恢复行为。

## 四、对 Gleaner / Courtwork 方向的启示

结合当前知识控制面的定位，决策模型最有潜力的作用不是替代知识治理，而是承担高频的语义判断：

**Source of truth**
原件、事件记录、权限、逻辑身份、版本与有效时间

**Candidate retrieval**
利用原生拓扑、结构指针、关键词或向量检索候选

**Decision layer**
相关性、证据支持、关系推定、冲突提示、升级建议

**Governance & execution**
确定性校验、必要时强模型复核、人工审定、结果登记


从这些评测来看，**更值得探索的是 Decision Model 作为知识系统的可测量语义决策层，而不是把它做成一个新的知识库或万能检索器。**

特别建议先复现两个实验：Knowviq 的证据支持与可回答性闸门，以及 SAG2 在 EnterpriseRAG-Bench 上的增量证据扩展。前者可以检验误放行风险，后者可以检验决策模型究竟增加了多少原本找不到的证据。然后再用版本更新和知识冲突样本，测试现有检索评测尚未充分覆盖的治理能力。

### References

1. [Decision models compared: Jev, Clef, d1 and Perplexity](<https://knowviq.com/blog/decision-models>)
2. [Jev-as-a-Judge for RAG Claim Verification: Confidence-Gated Cascading Between a Non-Generative Verifier and a Frontier LLM](<https://arxiv.org/abs/2610.20634>)
3. [Jev: System One Models, Use Cases, Open Source and Benchmarks | LargitData Blog](<https://course.largitdata.com/en/blog/jev-system-one-model-open-source-benchmark/>)
4. [EnterpriseRAG-Bench: A RAG Benchmark for Company Internal Knowledge](<https://arxiv.org/abs/2605.05253>)
5. [SAG2: Embedding-Free Multi-Hop Retrieval with BM25 and JEV · PaperPeel](<https://www.paperpeel.com/paper/2610.22588>)
6. [EnterpriseRAG: Benchmarking LLM Instruction Adherence and Robustness under Non-Ideal Enterprise Retrieval](<https://arxiv.org/abs/2608.11584>)
7. [How To Use Decision Models for Evals – Hamel’s Blog](<https://hamel.dev/blog/posts/decision-model-evals/index.html>)

## Turn 5 — User
<!-- source: response.mapping["bbb21cd8-aada-4ab4-90af-574c911ec025"].message -->

开源 jev 类方案自部署，通过私有数据集微调？
https://mp.weixin.qq.com/s/z4a6QVVdujnDxEucYyLSAg

## Turn 6 — Assistant
<!-- source: response.mapping["7ceb8ae9-d0b1-4a6c-a230-0ca2e9a1eee2"].message, response.mapping["94a68582-713d-4671-8814-52c33c9feb5a"].message -->
_Content: partial_

我先核对这篇文章提到的模型及其开源范围，再查 Jev、d1、Clef 等是否真正开放权重、训练代码与微调接口。重点看私有数据能否完全本地训练和推理，以及如何用企业知识库样本做有效的微调与评测。

**可以，而且对私有企业知识库，我认为“自部署的轻量决策模型 + 领域数据监督微调 + 独立校准”是一条值得验证的路径。** 目前已有能够实际训练和部署的开源实现，不必依赖 Jev 的托管 API。

你提供的文章《Jev开源平替Laya实测：33毫秒完成判断，微调才是正确打开方式？》尤其值得注意。

但文章有一个重要的实验边界：

- **Laya 零样本实验**：多语言 checkpoint 在中文游戏意图识别任务上取得 18.45% 准确率。
- **微调实验**：改用 `bert-base-chinese` 进行监督微调，取得 95% 以上的结果。
- **这不是 Laya 微调前后的直接对照。** 同时改变了模型、训练状态与任务适配方式，因此尚不能将约 80 个百分点的提升归因于 Laya 架构或其训练方法。

文章更可靠的启示是：对于类别明确、决策边界可以标注的中文垂直任务，专门训练的轻量分类器可能比通用 Decision Model 零样本调用更合适。

真正需要比较的是三条路线：**Laya 类原生决策模型微调、中文 Encoder 分类器微调，以及更强的开放权重 Decision Model 微调。**

## 一、目前可自部署的开源候选

| 项目 | 模型规模 | 私有数据微调 | 主要特点 |
|---|---:|---|---|
| [Laya](https://github.com/NandhaKishorM/laya) | 322M / 421M | 支持 | Encoder 架构、中文多语言版本、CPU/MPS/CUDA、概率校准 |
| [Kev](https://github.com/jaredpalmer/kev) | 0.8B–27B | 支持 LoRA / 全参 | 提供完整训练、校准、评测及 Jev 兼容服务 |
| [JevAny](https://github.com/SimpleJev/JevAny) | 0.8B–27B | 支持 | 通用 System 1 训练基础设施、多类模型适配 |
| [NanoJev](https://github.com/TianyuCodings/NanoJev) | 0.6B | 支持 | 小模型、完整训练流水线，更偏实验性智能体任务 |

这些是独立实现，并非 Jev 官方开放的模型权重。其中 Laya、Kev、JevAny 的公开实现提供了实际可运行的私有数据训练路径。[?]

### 我会优先验证 Laya 与 Kev

**Laya 更适合轻量中文企业部署。** 截至现在，它已经提供 `laya-train` 命令行工具，不再需要自行编写整套训练循环：支持 CSV/JSONL 输入、训练、留出校准集、保存 checkpoint，并能在 Apple Silicon MPS 上运行。[1]

**Kev 更适合做通用 Decision Model 的实验基线。** 它具有训练代码、LoRA、概率温度校准、测试对照，以及与 Jev 相似的输入输出接口。作者报告在 5,219 条真实金融消费者投诉标注数据上，Kev-4B 的准确率由 0.804 提升到 0.904，不过这是项目自身实验，不代表在企业知识检索中也有相同提升。[2]

两者均可完全本地训练与推理。需要注意，Kev 提供的便捷微调 Skill 默认使用 Modal 云端 GPU；如果私有知识不得上传外部服务，应选择它的本地训练入口，而不是直接使用默认云端工作流。

## 二、企业知识库应当微调什么？

核心区别是：**不要主要用模型微调来记忆企业知识，而要用私有标注数据训练决策函数。**

知识本身仍保留在可持续更新、可追溯的知识库中。决策模型接收问题、候选证据及必要上下文，对候选材料作判断。

| 决策任务 | 训练输入 | 监督标签 |
|---|---|---|
| 检索相关性 | Query + Candidate | Relevant / Irrelevant |
| 证据支持 | Claim + Evidence | Supported / Contradicted / Insufficient |
| 资料关系 | Document A + Document B | Duplicate / Revision / Supplement / Unrelated |
| 证据充分性 | Query + Evidence Set | Sufficient / Insufficient |
| 知识更新线索 | Old + New | Supersedes / Conflicts / Coexists |

实际 ACL、版本生效规则和发布权限仍由源系统执行。模型只负责需要语义理解的部分，不成为知识事实或权限的权威来源。

### 一个 Laya 可使用的训练样本

其 JSONL 结构支持 `state`、`questions`、`expected`，例如：

```json
{
  "state": {
    "query": "2026 年甲部门的审批金额上限是多少？",
    "evidence": "《甲部门审批办法（2024）》规定，上限为 5 万元。"
  },
  "questions": {
    "support": {
      "type": "choice",
      "instructions": "判断候选证据对当前问题的支持关系",
      "criteria": {
        "supported": "能够明确支持结论",
        "contradicted": "明确否定结论",
        "insufficient": "证据不足或适用时间未确定"
      }
    }
  },
  "expected": {
    "support": "insufficient"
  }
}
```

这是一个有意构造的时间错配样本。模型应该学会“不足以确定”，而不能因为检索到了明确的数字就直接认可它。

Laya 原生支持这种多选决策训练格式。[1]

## 三、完全私有部署的最小实验

Laya 当前的训练入口已经比较完整。以下以 macOS MPS 为例，CUDA 机器只需更换设备参数：

```bash
pip install "laya[serve]"

# 先检查数据编码与训练预算
laya-train \
  --data train.jsonl \
  --base multilingual \
  --dry-run

# 训练并使用独立数据集评测
laya-train \
  --data train.jsonl \
  --eval test.jsonl \
  --base multilingual \
  --device mps \
  --micro-batch 1 \
  --grad-accum 16 \
  --out ./checkpoints/kb-support
```

训练后可通过 `laya.load("./checkpoints/kb-support")` 在本地调用，也可在 `laya-serve` 中通过 `LAYA_EXTRA_MODELS` 注册私有 checkpoint，并由请求中的 `model` 字段指定。代码与权重采用 Apache 2.0 授权。[?]

部署时需要固定模型版本、禁用不必要的外网访问，控制训练日志、样本、checkpoint 的保存与访问。模型权重本身也应视为受保护资产。

## 四、怎样做出可信的 Eval？

第一轮不宜只比较 Laya 微调前后。建议使用完全相同的私有样本建立以下对照：

| 实验组 | 用途 |
|---|---|
| A · 规则 / BM25 基线 | 测量简单方法的能力下限 |
| B · 中文 BERT / ModernBERT 微调 | 专用 Encoder 基线 |
| C · Laya multilingual 零样本 | 判断通用 checkpoint 的迁移能力 |
| D · Laya multilingual 微调 | 验证决策架构的收益 |
| E · Kev 0.8B / 4B 微调 | 检验更大模型是否带来实际提升 |

评测必须至少包括 Macro-F1、错误证据放行率、误拒绝率、ECE/Brier、风险—覆盖率曲线，以及 p50/p95 延迟和单次判断成本。

数据集应按**项目、原件、版本与时间**分组拆分，避免同一份政策文档的不同切片同时进入训练和测试。还要建立专门的变化测试集，覆盖旧版取代、新旧并存、冲突、撤销、证据缺失和未知类别。

这里有两个现实约束：

**速度不是无条件的 33ms。** Laya 报告的 32.8ms 是 T4 上单个问题的测试结果；长上下文处理会显著变慢。[3]

**概率输出不等于概率已经校准。** Laya 自身公布的多语言模型 ECE 从 0.314 经温度拟合降至 0.106。这意味着私有数据集校准是上线步骤，而非可选优化。[3]

## 结论

对当前企业知识检索方向，我更倾向于先用 **Laya multilingual 与中文 BERT 两条本地微调路线做受控实验**，而不是立即投入训练更大规模的 Jev 替代品。

第一期只验证“候选证据是否支持当前问题”和“证据是否充分”两个原子任务；当它们的风险—覆盖率、成本和实际检索收益稳定后，再扩展到知识关系、冲突和版本治理。

这条路径的好处是，即使 Laya 没有胜出，得到的私有评测集、决策 Schema、校准方法和治理边界依然可以完整复用。对于长期演进的知识控制面，这些资产比某个具体模型更有价值。

### References

1. [laya/docs/finetune.md at main · NandhaKishorM/laya · GitHub](<https://github.com/NandhaKishorM/laya/blob/main/docs/finetune.md>)
2. [kev/README.md at main · jaredpalmer/kev · GitHub](<https://github.com/jaredpalmer/kev/blob/main/README.md>)
3. [GitHub - NandhaKishorM/laya: Non-autoregressive System 1 decision engine. Typed choice, score and yes/no decisions over any text in a single forward pass, in 100+ languages, with a router that picks the right checkpoint per request. · GitHub](<https://github.com/NandhaKishorM/laya>)

## Turn 7 — User
<!-- source: response.mapping["a78e6178-1ffb-4ea1-8b06-ef5fd8841b21"].message -->

考虑为 praxis 项目下增加 Jev/system 1 专章，以当下为快照，考虑 to B 场景可能用到的内容，比如分为 Jev 本身与开源替代生态、私有数据微调部署和 eval、企业 e2e 场景和实施方略等，ChatGPT 先进行 explore 收集实践，编制方式可以接近一部蓝皮书，素材足够后会由 opus 在 praxis design 与 write kit 下独立撰写快照底稿和可视化/motion html。

## Turn 8 — Assistant
<!-- source: response.mapping["00c89994-cb53-4c8b-a321-58acd464e391"].message, response.mapping["30a6c9c1-5fd0-4588-aac1-02c95eb472b6"].message, response.mapping["3510b91d-2857-4dbc-95f3-19fe082c90a9"].message -->

这轮我会先做研究素材包，而不提前代写蓝皮书：核验 Jev / System-1 决策模型及开源生态，收集私有化训练部署与评测实践，再整理企业端到端场景、证据分级和实施路线。最终交付可供 Opus 接手的研究底稿与来源目录，快照截至 2026-10-22；Praxis 的正式写作和 motion HTML 留给后续流水线。

生态核验又发现两项会影响蓝皮书结构的更新：Liquid 10 月 7 日已发布 d1-3B / d1-omni-600M 开放权重，Cloudflare 10 月 19 日又推出了从“固定选项决策”延伸到“类型化字段提取”的 Clairic 预览。因此需要把模型谱系拆成分类决策、可推理决策和结构化提取三支，避免用“Jev 平替”笼统覆盖。与此同时，我正在核对公开 benchmark 的样本来源、交叉污染和不同部署环境下的延迟口径。

研究素材已经具备成册的基本覆盖：不仅有模型与训练框架，还有 Knowviq 的实际流量、Arize 的独立横评、JevBench、领域分类器对照、EnterpriseRAG-Bench 和证据充分性实验。我会把它们整理为带来源与局限说明的研究卷宗，并单列“尚未被公开证实的企业生产能力”；不会直接将这份卷宗写成 Praxis 的正式章节。

## Turn 9 — User
<!-- source: response.mapping["7d44696f-fb7f-43cd-a6ed-e762bac44a6a"].message -->

所有进入底稿和 HTML 对外 review 的内容，gpt 不必撰写，只需要提供不同 stream 的沿路 explore，遵循他们原本的 release 语言，按照某种体例组织参考来源，最后统一由 worker opus 按照 kit 中文写作规范撰写。[$deep-research](app://connector_openai_deep_research)&#x20;
同时也会测试 praxis 下可视化/motion 的 workflow，我建议所有 mertrial 与 artifact 都留在 Jev 目录下，只在 rsi review 阶段在 praxis 其他的文档或目录中做提要，或在相应 log 中记录可视化/motion 消费记录，作为渐进披露的参考。
以及，企业 DB 在此影响下的转变可以作为附录章节。

## Turn 10 — Assistant
<!-- source: response.mapping["c77bcb93-d830-4d30-8e2e-703002316828"].message -->

Deep Research 已启动，并已收到本轮研究边界与交付要求。

研究应用将先展示研究计划供确认，随后开展多 Stream 资料探索、来源核验与证据归档。研究进展和最终成果将由 Deep Research 直接更新。

## Turn 11 — User
<!-- source: response.mapping["a5bdb9c7-c070-4103-84de-dd19a16d48f4"].message -->

reconnect，是否已经完成

## Turn 12 — Assistant
<!-- source: response.mapping["e8c49821-8475-4cbf-b45c-2dbc9269ff31"].message -->

**已重新取得 Deep Research 的任务状态。研究运行已结束，报告已生成，但尚未达到 Praxis 的交付标准。**

**Deep Research · Jev/System1 Praxis Snapshot**
运行完成

2026-10-22 23:59（UTC+8）结束，系统状态为 finished_successfully。

Jev 官方与开源资料收集

论文与生态研究

微调、部署实践收集

企业 E2E 与 Eval 整理
未收尾

Stream 来源归档与元数据
未收尾


### 当前交付缺口

研究报告主要是中文叙述性综述，与此前确定的 **Explore-only、原始 release language、Opus 独立写作** 的要求并不完全一致。

尚未确认完成的部分包括：

- 按 Stream 分类的 Source Ledger 和 Evidence Matrix。
- 独立的企业 DB 转变附录研究。
- 可供 Opus 消费的 Handoff Manifest。
- 可视化 / motion 的素材来源与消费记录。
- 将材料实际归档至 Praxis 的 Jev 目录。

**因此，研究运行已完成，但研究档案尚未完成验收。** 目前也没有证据表明文件已写入 Praxis 项目。

建议下一轮作为 **Research Archive Completion**，只补齐结构化证据、来源、缺口与交接清单，不重新生成中文蓝皮书正文，也不提前制作 HTML。

## Turn 13 — User
<!-- source: response.mapping["5bb5fd33-6ce6-4ae0-9462-710c10ee77b6"].message -->

补齐这部分，而后我会交给 Claude 完成 可视化/motion 面。

## Turn 14 — Assistant
<!-- source: response.mapping["f403d23a-2320-435c-aee4-c1222335ab31"].message -->

已启动 **Jev/System-1 Research Archive Completion** 补充研究。

本轮专门补齐企业 E2E 实践、Source Ledger、Evidence Matrix、企业 DB 转变附录，以及供 Claude/Opus 接手的 Handoff Manifest。

继续遵守此前约定：**只整理研究证据与来源，不撰写对外底稿，不制作可视化或 motion HTML**。所有材料以 Praxis 的 Jev 目录为归档边界，快照截止 2026 年 10 月 22 日。

Deep Research 将更新研究计划并交付结果，供后续 Claude 工作流使用。

## Turn 15 — User
<!-- source: response.mapping["3dd11392-f4b6-4a7b-a372-94c66ecea06a"].message -->

这会是一部源流清晰、足资参考的说明书，在研究方向之下，能够完成有益的设计，承载可视化方案汇报与 demo 需要，而不在触达生产环境前过渡设计或实现。

## Turn 16 — Assistant
<!-- source: response.mapping["488ad2dd-ca66-4b57-b64e-557fd8f0ba83"].message -->

已将这项定位补充给 Deep Research。研究计划将据此调整，并继续整理材料。

后续研究档案将以**来源可追溯、设计有依据、足以支撑方案汇报与 Demo** 为目标，同时明确区分研究假设、演示验证与生产级实现，避免在触达真实生产环境前过度设计。

Deep Research 将继续更新研究进展。

## Turn 17 — User
<!-- source: response.mapping["f7c7bd1f-0bfe-4362-a4d7-0ab642b065e5"].message -->

部署与微调会涉及模型 infra 与训练、eval 方面，可以先按保守口径提供参考，可以登记外部成熟实践，而不必预设算力资源与成本，eval 同理，可以将相应 benchmark 网罗一备，作为方向，而不预设工程实现。

## Turn 18 — Assistant
<!-- source: response.mapping["791e709b-fe16-48f0-9366-e6f8a4431130"].message -->

已将这项保守口径提交给 Deep Research，用于更新现有研究计划。

Deep Research 将继续整理外部成熟实践、模型基础设施与训练参考，以及相关 Benchmark 和 Eval 方法，但不预设 Praxis 的算力、成本或具体工程实现。

研究成果仍作为后续 Claude/Opus 工作的参考素材，而非生产部署方案。
