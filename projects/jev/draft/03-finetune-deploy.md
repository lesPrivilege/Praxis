# 三 · 私有数据微调与部署

Jev 本身不能用客户数据 fine-tune，私有化只能走开放权重的实现，或者在 Jev 旁边训练自己的分类器〔A-C-25〕。开放实现都给出了从 JSONL 到本地服务的完整命令；它们共同的做法是训练决策函数、让知识留在知识库里，训练后在留出数据上重新拟合温度。下文的命令与硬件都按来源原样登记，算力和成本不作预设。

## 3.1 微调的对象

企业知识留在可更新、可追溯的知识库里，模型接收问题、候选证据和必要的上下文，对候选材料作判断。原 Chat 第 6 轮把可以标注的判断列成五类：检索相关性、证据支持（supported / contradicted / insufficient）、两份资料的关系（重复、修订、补充、无关）、证据是否充分、新旧资料的更新关系。ACL、版本生效规则和发布权限仍由源系统执行，模型不是事实或权限的权威来源〔原 Chat Turn 6〕。

这一划分是本专章采用的工作假设。找到的来源里，开放实现的示例都是工单路由、投诉分类、合同条款、游戏动作这类任务，没有一份公开材料在企业知识库上做过上述五类判断的微调。

## 3.2 训练数据的形状

两种主要实现都直接用 API 请求的形状作训练样本，再给每个问题加上标签：

| 实现 | 格式 | 标签写法 |
|---|---|---|
| Laya | CSV：一行一个决策，一列文本、一列标签，标签自动变成按出现顺序排列的 choice 问题。JSONL：每行 `state`、`questions`、`expected` | noul 写 true / false；score 写级别，可写小数，1.5 表示权重分在 1 级与 2 级之间 |
| Kev | JSONL，与请求体同形，每个问题加 `label` | choice 写选项名；noul 写 true / false；score 写从 0 开始的级别序号 |

〔C-C-03, C-C-13〕

Kev 建议留出 10%–20% 作评测〔C-C-13〕。Laya 在训练开始前固定种子留出至多 400 条或 10%（取较小者）专门用于校准〔C-C-04〕。

## 3.3 各实现写明的流程

| 实现 | 训练入口 | 方法 | 来源点名的硬件 |
|---|---|---|---|
| Laya | `laya-train --data … --out …`，底座用 `--base`（默认 `convaiinnovations/laya`，可选 english、multilingual、typed-decisions），`--dry-run` 只检查编码与预算 | 在所选 checkpoint 上继续训练，`--loss` 可选 `rlcd`；训练后按问题类型用 LBFGS 拟合温度 | 两块 Kaggle T4 的 notebook；benchmark 每次一块 T4；另有 Apple Silicon（MPS / CPU）notebook |
| Kev | `uv run python -m kev.train --data … --base Qwen/Qwen3.5-4B-Base --init_from jaredpalmer/kev-4b …` | 0.8B、4B、9B 在冻结底座上训 rank-16 LoRA 和 pointer head，两个 epoch；27B 训练全部底座参数 | CUDA（L4、L40S、H100、H200、B200）、MPS、CPU；9B 约需 17 GB 显存，27B 约 66 GB |
| Kev 的 `kev-finetune` skill | `modal run scripts/kev_modal.py::train …` | 同上，在 Modal 云 GPU 上跑 | 默认云端，本地不需要 GPU |
| Simple Jev 的 RFDT | `prepare.py` → `train.py` → `export.py` | 只训练答案 token 的 logits，支持 LoRA 与多卡 | README 称 GPU 示例“未经验证” |
| JevAny | `jevany train --config recipes/sft.toml`；`recipes/finetune.toml` 在已发布的 27B 上继续训 | SFT 加 LoRA | 起步示例为 CUDA 上的 Qwen3.5-0.8B |

〔C-C-01, C-C-02, C-C-05, C-C-12, C-C-16, C-C-17, C-C-22, C-C-24, C-C-25〕

数据会不会离开本地，取决于选哪条路：Kev 的默认 skill 在 Modal 上训练；它和 RFDT 都提供可选的“老师标注”，调用一个 OpenAI 兼容的 API 给没有标签的样本补标签〔C-C-16, C-C-24〕。私有数据不得出域时，用本地入口，关掉老师标注。

Python 包名是 `laya`，命令行入口为 laya、laya-serve、laya-evals、laya-mcp-server、laya-train；npm 上同名的 `laya` 是一个无关的 Phaser 工具〔C-C-10〕。

## 3.4 自报的微调收益

| 来源 | 任务 | 结果 | 限定 |
|---|---|---|---|
| Kev README | 5,219 条已标注的消费金融投诉，一个 epoch | Kev-4B 准确率 0.804 → 0.904 | 作者自测，分布内收益；测试集大小未读到；原文未出现 “CFPB” |
| `kev-finetune` 示例 | 三个问题、1,050 条生成数据 | 67.7% → 73.6%（增益 95% CI +2.3 至 +9.7），Brier 0.402 → 0.330 | 合成数据，单一示例；H100 约 15 分钟、约 1 美元 |
| Laya | typed-decisions（400 例、2,000 个决策） | 0.362 → 0.766 | 在该 benchmark 自己的训练划分上微调 |
| Open-Jev DeBERTa | 小领域 | 域内 0.854、ECE 0.022；域外 0.690 | 自测 |

〔C-C-19, C-C-20, B-C-08, B-C-64〕

一篇常被引用的微信文章（Laya 多语言零样本在中文游戏意图识别上 18.45%，换用 `bert-base-chinese` 微调后 95% 以上）被微信验证页挡住，未读到〔C-C-26〕；按转述，那组数字换了模型，算不上 Laya 微调前后的对照。

## 3.5 校准是部署前的一步

Laya 与 Kev 的发布版本都过度自信，各自在留出数据上重新拟合温度；Open-Jev DeBERTa 自报域内 ECE 0.022，是少数出厂即校准良好的例子〔B-C-64〕：

| 实现 | 校准前后 | 条件 |
|---|---|---|
| Laya（英文） | mean ECE 0.466 → 0.081 | 按（问题类型，选项数）拟合温度 |
| Laya（多语言） | mean ECE 0.314 → 0.106 | 同上；多语言 checkpoint 出厂不带温度 |
| Kev | 每个 checkpoint 存一个温度（0.8B 2.35，4B 2.41，9B 2.19，27B 1.32）；9B 在新来源上 0.103 → 0.041 | 加载时应用 |

〔C-C-04, C-C-06, C-C-18〕

OrcaRouter 文章引用的 0.466 → 0.081 属于英文 checkpoint，多语言 checkpoint 是 0.314 → 0.106〔C-C-06, B-C-10〕。两组数字背后的 benchmark 与样本量，Laya README 的相应段落没有写。

温度缩放出自 Guo 等 2017：单参数的 Platt scaling 变体，在多数数据集上效果出奇地好；scikit-learn 文档提醒校准器要在独立于分类器训练数据的集合上拟合〔C-C-37〕。拒答阈值与风险—覆盖率的做法见 Geifman 与 El-Yaniv 2017：给定可接受的风险，分类器按需拒绝输入〔C-C-38〕。第四章 4.4 记录了 Hamel Husain 与 Antaripa Saha 的阈值选择流程。

## 3.6 服务

| 实现 | 启动 | 端口（来源示例） | 接口 |
|---|---|---|---|
| Laya | `pip install "laya[serve]"`，`laya-serve`；环境变量 `LAYA_DEVICE`、`LAYA_MODELS` 等，私有 checkpoint 经 `LAYA_EXTRA_MODELS` 注册，请求里用 `model` 字段指定 | 8000 | `/v1/systemone` |
| Kev | `uv run --extra serve python -m kev.serve --run jaredpalmer/kev-4b` | 8009 | `/v1/systemone`，另有 `/permute`、`/separate` |
| Kev on Modal | `modal deploy kev_serve.py`，L40S，带 API key | — | 同上 |
| Simple Jev | `python hf-server/hf_server.py --model …` | 8000 | `/v1/classifier`，别名 `/v1/systemone` |
| JevAny | `jevany serve` | 8008 | 同 Jev |

〔C-C-08, C-C-14, C-C-15, C-C-23, C-C-25〕

Kev 的 18.1 ms 是 H100 上的模型时间，不含 HTTP；README 说 A100 比 L40S 慢且更贵〔C-C-21〕。

不走这些项目自带的服务时，外部的成熟做法：

| 做法 | 来源写明的能力 |
|---|---|
| Hugging Face Text Embeddings Inference | `/predict` 服务 sequence classification 模型，`/rerank` 服务 reranker；docker 启动 |
| vLLM pooling | `classify` 任务输出每条序列的概率向量；`*For*Classification` 架构用 `--convert classify` |
| ONNX Runtime 与 Optimum | `ORTModelForSequenceClassification` 导出并加载 ONNX 分类器；CPU 与 CUDA |
| NVIDIA Triton | 通用推理服务；读到的页面没有针对分类器的说明 |

〔C-C-39, C-C-40, C-C-41, C-27〕

## 3.7 若改走专用 encoder

原 Chat 第 6 轮提议的对照组之一是直接 fine-tune 一个中文 encoder 分类器，不经过 System One 接口。可用的底座与通用流程：

| 来源 | 内容 |
|---|---|
| Transformers 文本分类指南 | `AutoModelForSequenceClassification` 的标准流程；示例不涉及校准与阈值 |
| PEFT LoRA | 冻结底座、训练低秩更新；随机初始化的分类头放进 `modules_to_save` |
| QLoRA | 4-bit NF4 与分页优化器；面向生成式 LLM 的指令微调 |
| SetFit | 每类 8 个样本的少样本微调，与全量微调的 RoBERTa Large 相当（Customer Reviews） |
| ModernBERT-base | Apache-2.0，约 149M，8,192 上下文，以英文为主 |
| mmBERT-base | MIT，307M，1,800 多种语言，8,192 上下文；Laya 多语言版的底座 |
| bert-base-chinese / chinese-roberta-wwm-ext | Apache-2.0，约 0.1B；卡片未写训练数据与评测 |

〔C-C-30至C-C-36〕

没有找到专门把 mmBERT 或中文 encoder 用于“决策模型式”微调的公开材料。

## 3.8 训练私有数据的风险条目

| 来源 | 相关条目 |
|---|---|
| NIST AI 600-1（2024-07）§2.4 数据隐私 | 训练数据可能含个人数据，涉及知情同意与目的限定 |
| OWASP LLM04:2025 数据与模型投毒 | 预训练、fine-tune 和 embedding 数据可能被篡改；缓解包括数据来源追踪（ML-BOM、CycloneDX）与数据集版本化 |
| OWASP LLM02:2025 敏感信息泄露 | 训练与推理两端的敏感信息处理 |

〔C-C-42, C-C-43, C-30〕

NIST 文件只读了第 2 节，第 3 节的建议动作未读。

## 3.9 本章未核实

- Laya README 末尾约两万字与 BENCHMARKS 页；校准数字对应的 benchmark 与样本量。
- Kev 的 Hugging Face 模型卡与各尺寸上传日期；投诉数据集的名称与测试集大小。
- JevAny 只经摘要读取，配方文件内容未逐行核对。
- 微信文章原文。
