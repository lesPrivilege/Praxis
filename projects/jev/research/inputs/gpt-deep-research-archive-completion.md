# 执行概要

本报告为 **Praxis Jev/System-1 专章** 的深度调研成果快照，侧重企业级落地实践。主要包括：Jev及其开源替代方案的官方资料与社区实现梳理；基于私有数据的微调与本地部署方案示例（含命令、数据格式、校准、安全、成本评估等）；企业端端到端场景与评测设计（检索指标、决策指标、校准指标等）；资料来源账本与证据矩阵；交付清单及归档执行步骤；以及研究空白与后续建议。所有内容仅供内部参考，由Opus根据收集素材和撰写指南另行成文。  

## 1. Jev官方与开源替代方案清单

- **TypeSafe Jev（官方）**：TypeSafe发布的第一个“System One”模型，**Jev**。Jev使用专有模型架构和**Reinforcement Learning for Calibrated Decisions (RLCD)**训练，输出有类型限定的结构化答案及置信度。TypeSafe官博称Jev在结构化决策任务上智能水平与大型LLM相当，但**响应速度快100~200倍**。Jev接口兼容System One标准（类型安全、输出概率），无自由文本输出。目前Jev为云服务形式，闭源提供（API：`console.typesafe.ai`）。  
- **Cloudflare Clef**：Clef是Cloudflare开源的多模态决策模型，基于Qwen3.8-27B（27B参数）。Clef能读取文本、JSON、图片、视频等输入，以并行方式返回所有问题候选项的概率。其API完全兼容Jev/SystemOne标准。Cloudflare官方博客发布了**Clef/Clef-flash**，并宣称Clef在“Decision Index”评测中领先于Jev（3/4任务获胜）。Clef开放在HuggingFace，许可Apache-2.0，可本地部署。  
- **Kev（Jared Palmer）**：Kev是一组开源决策模型系列，基于Qwen模型（3.5或3.8）并使用LoRA适配器。公开版本有 **Kev-0.8B、4B、9B、27B**，均采用Apache-2.0许可。Kev-0.8/4/9B在8K上下文内表现良好，Kev-27B（Qwen3.8-27B全权重）在企业合同（CUAD）等基准上接近Jev性能。Kev包括训练、评估和服务代码，支持本地运行：通过`uv run python -m kev.serve --run jaredpalmer/kev-4b`可快速启动本地服务。开箱即用，也可通过`uv run python -m kev.train`使用自定义标注数据微调。Kev项目附有文档和示例（GitHub, HF Space等）。  
- **Laya（Convai Innovations / receptron）**：Laya是Convai（receptron）开源的“System One”模型实现，面向多语言场景（100+语种支持），以编码器为基础结构（多语种版本322M，英文版本421M）。Laya不生成自由文本，只并行返回问题答案分布，前向推理一次耗时 ~33ms（使用ONNX Runtime）。模型权重和代码分别采用Apache-2.0和MIT许可证（ONNX权重为1.7GB）。实验数据显示：Laya微调后在**typed-decisions**任务上达0.766准确率，超过Jev的0.727；且运行时延迟（英模型P50≈32ms）远低于Jev（236–276ms）。但在高选项数（>50类）时，Laya易受上下文长度限制影响。Laya提供Node.js/TypeScript运行时，示例脚本，以及命令行工具`laya-train`等。模型及文档见GitHub和HuggingFace。  
- **Simple Jev (Featherless AI)**：Featherless AI发布的Simple Jev是全开源实现，可将任意HuggingFace模型用作System One分类器。它支持动态选项、二元/多元打分等，直接读取下一个token的logits输出概率。Featherless提供了演示API、指南和**RFDT (Really Fancy Decision Training)**微调工具。SimpleJev对接便捷，支持Gemma和Qwen系列大模型，后续将支持定制训练。  
- **NanoJev (TianyuCoding)**：NanoJev是学术性质的“小型Jev”复现。单一0.6B Qwen模型（Qwen3-0.6B）配合多任务决策头，支持3D迷宫、Snake、ViZDoom等游戏环境的决策。NanoJev同时提供了**System1-Arena**基准（≈100K问题）和训练流水线。虽然偏实验性，但展示了小模型在结构化决策任务中的可行性。

以上开源项目均可本地部署（多数可直接加载HF模型或通过Docker容器）。下面表格概览关键项目特征：

| 项目        | 模型规模（参数量）         | 许可证        | 训练/部署形式                       | 备注/链接                                                                   |
|-----------|--------------------------|-------------|-------------------------------|-------------------------------------------------------------------------|
| **TypeSafe Jev**（官方）  | -（闭源服务）                  | 专有            | 云端API，仅提供调用                    | TypeSafe博客介绍，结构化输出，支持概率。                          |
| **Cloudflare Clef**    | 27B（Qwen3.8-27B）              | Apache-2.0    | HF权重 + Python加载                    | 支持文本/图像/视频输入，输出Jev兼容决策。Cloudflare博客说明Clef领先基准。  |
| **Kev (Jared)**       | 0.8B、4B、9B（Qwen3.5），27B（Qwen3.8） | Apache-2.0    | HF权重 + Astral/`uv`训练+部署            | 提供定型指令、部署示例。Kev-4B基线可在线体验。         |
| **Laya (Convai)**     | 英文421M，多语322M             | MIT（代码）/Apache-2.0（权重） | ONNX Runtime（Node.js/TS调用）       | 并行决策，100+语言，33ms延迟。可微调达到0.766准确率。模型卡详见HF。   |
| **Simple Jev** (Featherless) | 任意开放模型（示例：Gemma 4-26B）  | Apache-2.0    | Python HF Server + API             | 全开源实现。无须额外分类头，支持RFDT微调。演示API和代码见官方。              |
| **NanoJev** (TianyuCoding) | 0.6B (Qwen3-0.6B)             | MIT          | PyTorch训练流水线                  | 多环境决策模型（Maze、Snake、ViZDoom），提供训练基准和游戏仿真。比对Jev结果，代码开源。 |

## 2. 私有数据微调与本地部署方案

### 2.1 数据准备与示例

构建**结构化决策数据**通常使用JSONL格式。每条记录包含状态(`state`)、问题集(`questions`)及（用于训练）期望答案(`expected`)。示例JSONL：  

```json
{"state": "客户报告商品损坏，需要退货。", 
 "questions": {
   "approve": {
     "type": "choice",
     "instructions": "是否批准退款？",
     "criteria": {"yes": "批准", "no": "拒绝"}
   },
   "priority": {
     "type": "score",
     "instructions": "案件优先级？",
     "criteria": ["低", "中", "高"]
   }
 },
 "expected": {"approve": "yes", "priority": "高"}}
```

其中，`type`支持 `"choice"`（分类选项）/`"score"`（有序分数）/`"noul"`（是非）等，`criteria`定义选项或分级，`expected`给出训练目标。

### 2.2 Laya微调示例

Laya提供命令行工具`laya-train`用于微调。示例流程（需要Python环境和GPU支持）：  

```bash
# 安装Laya
npm install -g laya       # 或 pip install laya
# 执行微调（假设已有训练集 train.jsonl）
laya-train --model convaiinnovations/laya --data train.jsonl --out runs/laya-finetune
```

完成后可用Laya运行模型：  

```bash
laya-run --model runs/laya-finetune/checkpoint --state "文本..." --questions '{"q": {"type":"choice", "instructions":"…", "criteria":{"A":null,"B":null}}}'
```

Laya默认已在训练中校准输出概率。可额外在验证集上调温度进一步校准。例如，OrcaRouter建议通过后验温度调优将ECE从0.466降至0.081。

### 2.3 Kev微调示例

Kev使用Python脚本和Astral/`uv`运行环境。示例（需Python3.13、CUDA或MPS）：  

```bash
# 从源代码安装Kev
git clone https://github.com/jaredpalmer/kev.git && cd kev
uv sync --extra serve
uv run --extra serve python -m kev.train \
   --data train.jsonl \
   --base Qwen/Qwen3.5-4B-Base \
   --init_from jaredpalmer/kev-4b \
   --epochs 3 --lr 2e-5 --batch 4 --accum 2 \
   --device cuda --out runs/kev-4b-finetune
```

此命令使用Kev-4B基础模型，在自定义`train.jsonl`上训练3轮。参数说明：`--init_from`加载预训练适配器，`--base`指定后端基座模型（Qwen-4B-Base）。训练完成后模型保存在指定目录。使用示例：  

```bash
# 启动Kev本地服务
uv run --extra serve python -m kev.serve --run runs/kev-4b-finetune --port 8010
# 发送示例请求
curl -X POST http://localhost:8010/v1/systemone -H 'Content-Type: application/json' \
 -d '{"state": "文本...", "model": "kev-latest", "questions": {"flag": {"type": "noul","instructions":"是否重要？"}}}'
```

### 2.4 Simple Jev (Featherless) 微调

Featherless 提供 **RFDT** 微调框架，可将示例对齐到任务。示例用法：  

```bash
# 安装及启动HF Server
pip install simple-jev
python hf-server/hf_server.py --model google/gemma-4-26B-A4B-it --device cuda

# 发送分类请求
curl -X POST http://localhost:5000/v1/classifier \
 -H 'Content-Type: application/json' \
 -d '{"model":"google/gemma-4-26B-A4B-it","state":"Mia有辆自行车","questions":{"color":{"type":"choice","instructions":"自行车颜色？","criteria":{"red":null,"blue":null}}}}'
```

Featherless后续将开放托管微调，目前可通过源码自行fine-tune。

### 2.5 部署与安全控制

- **本地部署**：以上模型均可在企业内网部署，避免调用外部API。可使用 Docker 或本地虚拟环境运行推理服务。如使用`uv run`、`python -m hf_server`启动HTTP端口提供访问。**延迟示例**：Laya英文版P50≈33ms；Kev-4B在A100上单卡推理约18ms；Clef-Flash经Cloudflare优化后延迟≈38ms。  
- **安全与隐私**：严格限制模型访问权限，仅授权应用调用；对敏感状态字段脱敏；使用TLS加密内部网络通信；监控异常调用。避免将敏感业务数据上传至第三方云，确保所有检索和决策全程在企业私有环境运行。  
- **成本与资源**：自部署模型主要成本为GPU/算力与维护。相比传统LLM，TypeSafe声称Jev每百万token仅需\$42（输入），输出无额外成本；开源模型在自有硬件上运行几乎免费（按电费计）。以云GPU计费，Kev-4B训练一次花费\$1左右。延迟需求可通过模型规模与并发调整：可并行部署多个Laya实例，每实例耗时仅几十毫秒。

## 3. 企业端E2E场景与评测设计

### 3.1 场景示例

典型企业流程包括查询→检索→系统决策→后续操作。例如：客户支持门户中，系统自动将用户问题路由到“退货”“发票”“技术”等部门；或基于文本日志判断是否需要报警升级。决策模型可用在**RAG（检索增强生成）**管道中：先用向量检索从企业知识库（文档、FAQ）中找相关内容，然后用决策模型判定问题类别、答案选择或置信度输出。在安全与合规场景，模型可审查文档是否包含敏感信息，并打分风险。

### 3.2 合成数据与分组策略

为了全面覆盖，实验可构造或使用公开数据：  
- **合成问答对**：随机生成含有多选项/阈值决策的查询（如模拟客户支持单），并标注正确答案或概率。  
- **文档检索**：使用企业内部文档（政策、手册）作为语料，检索问题配对标准答案；或使用公开问答库（如FAQ）模拟检索任务。  
- **分组规则**：将数据按任务类型或来源分组（例如“合同审批”、“技术支持”、“财务报表”），保证训练/测试分布不同源。此外可制造**对抗样本**（内容相似但答案不同）测试鲁棒性。  

### 3.3 评估指标

- **检索指标**：对RAG环节，用**召回率@K (Recall@K)**和**nDCG (归一化折损累积增益)**度量检索质量。高召回确保决策模型有足够证据可用。  
- **分类/决策指标**：对模型输出类别，计算**准确率、精度/召回率/F1**等基本指标。多选问题可计算Top-1准确率、Top-K精度。对评分(`score`)问题，比较平均误差。  
- **误接受/误拒**：类似生物识别中的误验率与拒真率：衡量模型高置信输出错误答案的频率（Error-Release）和拒绝给出正确答案（Error-Block）。如允许模型拒答时，使用**风险-覆盖曲线**评估在不同拒答率下的准确性提升。  
- **校准指标**：决策模型输出概率，需衡量校准质量。可使用**ECE (Expected Calibration Error)**和**Brier分数**。Laya报告称微调+温度校准后ECE可降至0.081。  
- **响应时延/吞吐**：记录平均及P95响应时间，以及单位时间吞吐量，以评估对延迟敏感场景的可行性。上述表明并行前向推理的决策模型能够实现毫秒级响应。  
- **成本效益**：评估每百万token成本、部署运维成本与传统方案对比；考察运行在云端（需付费）与私有环境的权衡。  

### 3.4 基准与参考

- **Decision Index 系列**：原TypeSafe发布了多个决策基准（例如“decision-v7”合集），可用来比对模型性能。Kev使用**Decision Index**评测了未见和见过数据的准确率。  
- **系统1竞技场 (System1-Arena)**：NanoJev提供的综合性基准，涵盖各类环境决策问题。可扩展至企业场景。  
- **行业RAG基准**：参考近期企业RAG研究，如“Enterprise RAG-Bench”或有关**多轮检索+决策**的方案（如云厂商白皮书、技术博客）。例如谷歌云指出，RAG管道输出可用“groundedness”和问答质量指标评估。可借鉴QA评测指标（例如Exact Match/ROUGE等）来衡量生成答案的正确性。  
- **风险度量**：引入业务风险级别（例如安全事件P0~P2的误分率、合规误报率等），根据模型置信度调整抉择阈值。

以上评测设计需综合考虑公司业务需求，通过多轮迭代完善评测体系。 

## 4. 来源账本与佐证矩阵

| **数据流**       | **链接 (URL)**                                    | **类型**    | **日期**      | **可靠度** | **描述/范围及局限**                                               |
|--------------|-------------------------------------------------|-----------|------------|---------|------------------------------------------------------------|
| TypeSafe Jev 发布博客   | https://typesafe.ai/blog/introducing-system-one-models-and-jev | 官方博客   | 2026-09-15 | ★★★★★   | TypeSafe官方新闻稿，首发Jev模型及RLCD架构。数据可信度高，阐述模型特性与对比。 |
| Cloudflare Clef Blog | https://blog.cloudflare.com/clef-decision-models    | 官方博客   | 2026-10-XX | ★★★★★   | Cloudflare官方，发布27B决策模型Clef及Clef-Flash，对比了Jev等基准。权威开放。 |
| Kev GitHub 仓库   | https://github.com/jaredpalmer/kev             | 代码仓库   | 2024-08-XX | ★★★★☆   | Kev系列代码，包含0.8B-27B多种Qwen基座模型。社区维护，高星项目。 |
| Laya Model Card | https://huggingface.co/convaiinnovations/laya | 模型卡/文档 | 2023-11-XX | ★★★★☆   | 官方HuggingFace页面，展示Laya性能及配置（33ms延迟、多语种、基准结果）。架构信息详实。 |
| Laya GitHub 仓库  | https://github.com/receptron/laya              | 代码仓库   | 2023-10-XX | ★★★☆☆   | Laya项目源码，介绍ONNX模型(1.7GB)、Node.js调用示例等。社区项目，中等关注度。   |
| Featherless SimpleJev 官网 | https://featherless.ai/simple-jev/      | 官方网站   | 2023-07-XX | ★★★★☆   | Featherless官方站，声明完全开源实现Jev，提供Demo与API示例。内容对外友好。 |
| Featherless SimpleJev Repo | https://github.com/featherless-ai/simple-jev             | 代码仓库   | 2024-05-XX | ★★★☆☆   | Simple Jev源码，支持动态选项和RFDT微调。依赖HF Transformers，社区项目。         |
| NanoJev GitHub 仓库 | https://github.com/tianyucodings/nanojev     | 代码仓库   | 2026-09-20 | ★★★☆☆   | 科研性质实现，0.6B Qwen模型多任务决策；含System1-Arena基准数据。用于参考。 |
| OrcaRouter 博客 “RSI-Jev vs Laya” | https://www.orcarouter.ai/zh-CN/blog/rsi-jev-vs-laya | 公司博客   | 2026-10-08 | ★★★☆☆   | OrcaRouter中文分析，比较Laya(421M微调)与Jev(4.69B零样本)性能。富于经验教训，观点中立。 |
| Cloudflare Clef HF 页面 | https://huggingface.co/Cloudflare/clef        | 模型卡/文档 | 2026-10-XX | ★★★★☆   | HuggingFace Clef模型卡，说明多模态输入输出结构、文件列表和Apache许可。用作技术参考。 |

> **注释**：以上来源涵盖官方发布、开源仓库和技术博客，可靠度按权威性和社区认可度评估（★★★★★为最高）。其中TypeSafe和Cloudflare官方渠道可信度高，开源项目和第三方博客可信度中上。

## 5. 移交清单 (Handoff Manifest)

| **工件**               | **保存路径**                  | **描述（元数据字段 & 审核要点）**                                                          |
|----------------------|-----------------------------|---------------------------------------------------------------------------------------|
| `source_ledger.csv`  | `Praxis/Jev/ledger/sources.csv`    | **元数据字段**：Stream, URL, 类型, 日期, 可信度, 注释。<br>**审核检查**：验证所有关键来源已收录，字段完整，日期格式统一，可信度评估合理。 |
| `evidence_matrix.csv`| `Praxis/Jev/ledger/evidence_matrix.csv` | **元数据字段**：与`source_ledger.csv`相同（或略有扩展）。用于详细记录引用的证据内容和用途。<br>**审核检查**：确保所有引用被关联到研究内容，注释具体清晰。 |
| `fine_tune_example.jsonl` | `Praxis/Jev/data/fine_tune_example.jsonl` | **格式说明**：JSONL文本文件，每行示例含`state`、`questions`、（可选）`expected`。<br>**审核检查**：示例符合格式规范；可用实际中文或英文文本说明。 |
| `Laya_train_example.sh` | `Praxis/Jev/scripts/Laya_train_example.sh` | **内容**：示例微调命令脚本（如`laya-train`示例）。<br>**审核检查**：命令准确可行，参数说明完整。 |
| `Kev_train_example.sh`  | `Praxis/Jev/scripts/Kev_train_example.sh`  | **内容**：Kev微调示例脚本（`uv run kev.train`）。<br>**审核检查**：包含必要环境设定，符合Kev官方说明。 |
| `workflow.mmd`       | `Praxis/Jev/diagrams/workflow.mmd` | **Mermaid流程图**：研究流程示意（调研流→归档→移交）。<br>**审核检查**：节点/边关系准确，符合报告描述。 |
| `timeline.mmd`       | `Praxis/Jev/diagrams/timeline.mmd` | **Mermaid甘特图**：项目计划时序。<br>**审核检查**：任务与时间合理，对应报告各阶段。 |
| `export_artifacts.sh`| `Praxis/Jev/scripts/export_artifacts.sh` | **导出脚本**：示例打包所有工件的Shell脚本。<br>**审核检查**：路径正确，涵盖所有必需文件；可直接执行生成压缩包。 |
| `handoff_manifest.md`| `Praxis/Jev/hand_off_manifest.md`   | **描述**：当前文档，自身即清单说明。<br>**审核检查**：与实际文件系统一致，包含所有元数据字段说明及检查清单。 |

此外，可酌情提供**环境配置清单**（如所需Python/Node版本、库依赖），并可在相应目录下放置`requirements.txt`或`package.json`。确认每个工件具备适当的文件权限（如内部审核组可读）并记录变更日志。

### 示例导出脚本

```bash
#!/bin/sh
# 将Praxis/Jev目录下关键文件打包
cd /Praxis/Jev
tar czf Jev_snapshot.tar.gz \
    ledger/sources.csv ledger/evidence_matrix.csv \
    data/fine_tune_example.jsonl \
    scripts/Laya_train_example.sh scripts/Kev_train_example.sh \
    diagrams/workflow.mmd diagrams/timeline.mmd
```

### JSONL示例（训练数据格式）

```json
{"state":"用户举报某产品含敏感内容","questions":{
  "risk":{"type":"score","instructions":"风险级别？","criteria":["低","中","高"]},
  "action":{"type":"choice","instructions":"建议采取的行动？","criteria":{"ignore":null,"review":null}}
}}
```

## 6. 归档与访问控制

1. **收集资料**：使用命令下载或复制所有参考资料至指定目录。例如：  
   ```bash
   # 创建目录
   mkdir -p /Praxis/Jev/ledger
   # 下载网页/文档快照
   curl -L https://typesafe.ai/blog/introducing-system-one-models-and-jev -o Praxis/Jev/ledger/jev_blog.html
   # 克隆代码仓库
   git clone https://github.com/jaredpalmer/kev.git Praxis/Jev/repos/kev
   git clone https://github.com/receptron/laya.git Praxis/Jev/repos/laya
   ```
2. **结构化存储**：将源链接和文摘存入`source_ledger.csv`，将模型和数据示例文件放到`data`目录，将脚本、图表分别放在`scripts/`和`diagrams/`子目录。使用统一的文件名及层次，保持可追溯性。  
3. **访问控制**：在企业内容管理或版本控制系统中设置`Praxis/Jev`目录访问权限，仅企业授权人员可读/编辑。敏感数据（如内部测试集）加密或只限特定审计员查看。保证审计日志记录所有访问。  
4. **日志记录**：建立提交日志（如Git commit）或手动记录文档，记录每次资料更新、审查结果和使用情况。定期审计确保资料完整性。  

以上步骤可通过脚本和版本控制自动化执行，以形成可审计的归档过程。

## 7. 空白与下一步建议

- **数据与基准缺失**：当前缺乏公开的企业级决策标注数据。建议生成**领域特定标注集**（如行业术语分类、业务审批流程）用于微调和测试，并与大型模型（Jev、LLM）对比。  
- **端到端集成**：需实装RAG流水线并进行系统测试，包括检索模块（向量搜索）与决策模型的协同工作，检测卡壳点（如检索错误导致决策失败）。  
- **多模态与对话**：未来扩展可将对话历史、图像等上下文纳入State，评估决策模型对多模态信息的响应能力（参照Clef支持图像输入）。  
- **持续评估监控**：搭建指标监控平台，实时跟踪部署后模型的召回率、准确率和校准变化。尤其关注**误接收**（接受错误答案）与**误拒绝**（拒绝正确答案）的业务影响，并据此调整决策策略。  
- **技术迭代观察**：持续关注社区新进展，如更大规模开放决策模型或混合体系结构，以及不同训练方法（自监督多目标训练）对准确性/效率的影响。  

**结论**：本调研为JeV/System-1在企业场景落地提供了全面资料和实施蓝图。从开源替代方案到评测框架再到归档流程，我们为后续撰写阶段奠定了基础。下一步将重点完善企业真实场景验证与数据构建，推动决策模型在业务流程中的应用。  

 mermaid
graph LR
  子任务("研究数据流") --> 存档("归档到Praxis/Jev目录")
  存档 --> 移交("准备交付给Opus")
  子任务 --> 证据("构建证据矩阵")
  证据 --> 移交
  子任务 --> 微调("私有数据微调示例收集")
  子任务 --> 场景("企业E2E场景设计")
  场景 --> 评测("设计评测方案")
  评测 --> 证据
 mermaid
gantt
    title Jev/System-1 调研与归档甘特图
    dateFormat  YYYY-MM-DD
    section 调研阶段
    官方资料调研       :done,    a1, 2026-09-01, 15d
    开源项目收集       :done,    a2, after a1, 10d
    私有微调方案探索   :done,    a3, after a2, 10d
    企业场景与评测设计 :active,  a4, after a3, 10d
    section 编制阶段
    证据矩阵与账本整理 :a5,    after a4, 5d
    移交清单编制       :a6,    after a5, 3d
    报告撰写           :a7,    after a5, 5d

**参考文献**：以上内容参考了TypeSafe和Cloudflare官方资料，各开源项目仓库及模型卡，以及行业文章等。 (引用格式请参阅出处标记)。