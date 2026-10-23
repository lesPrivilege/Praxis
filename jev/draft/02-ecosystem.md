# 二 · 开源替代与兼容生态

Jev 发布后五周内，同一种调用形状已有十几个实现：有的开放权重，有的只给托管 API，多数直接接受 TypeSafe 的请求格式。按“决策怎样产生”分，它们落在五条路线上；同一路线内的差别主要在模型大小、授权和是否经过校准。各项目的日期取自 GitHub、Hugging Face 的创建与发布记录，截至 2026-10-23〔B-01至B-32〕。

## 2.1 五条路线

| 路线 | 怎样产生决策 | 代表 | 取舍 |
|---|---|---|---|
| encoder 加 decision head | 双向 encoder 读入 state 与问题，一个决策头一次前向给出全部问题的分布 | Laya、Open-Jev DeBERTa、GLiNER2.5-Decide、Von | 几亿参数，T4 或 CPU 上几十毫秒；零样本弱，需要按任务 fine-tune；上下文 512 到 8k |
| LLM backbone 加 head 或 LoRA | 冻结或后训练一个 Qwen 等 LLM，接决策头或 LoRA 适配器 | Kev、Clef、Perplexity Decider、Liquid d1-3B、RSI-Jev、JevAny、NanoJev | 0.6B 到 27B；零样本能力接近 Jev；27B 需要 80 GB 级 GPU |
| 包装任意 LLM 的 logits | 不加新头，读 LLM 在答案 token 上的 next-token logits | Simple Jev（Featherless） | 换一个 HF 模型即可；概率是 token 分布，不是专门校准过的输出 |
| 先快后想（thinking） | 先给一遍快速答案，领先答案不确定时追加推理再并入概率 | Fastino GLiDE | 难题更准，单次耗时不固定；冷启动要等 |
| 结构化抽取 | 不在固定选项里选，而是填出带类型的字段：数值、日期、时长、列表、估计、预测 | Cloudflare Clairic（预览） | 2026-10-19 发布，权重“即将开放”，大小与授权未公布 |

〔B-01, B-06, B-11, B-12, B-16, B-24, B-30, B-32〕

前三条路线输出的是“在定义好的选项上的概率”，与 Jev 同类；后两条把 System One 的接口延伸到需要多想一步和需要填值的场合，统称为“Jev 平替”会混淆这一区别。

## 2.2 主要项目

| 项目 | 所有者 | 首次公开 | 规模与底座 | 代码 / 权重授权 | 接 Jev 格式 |
|---|---|---|---|---|---|
| Laya | NandhaKishorM（权重在 HF `convaiinnovations/laya`） | 2026-09-18 | 421M（ModernBERT-large，英文）；322M（mmBERT-base，多语言）；另有 typed-decisions 微调版 | Apache-2.0 / Apache-2.0 | 是，`/v1/systemone` |
| laya（Node 运行时） | receptron | 2026-09-19 | 同上的 ONNX 包，约 1.7 GB | MIT / Apache-2.0 | 是 |
| Kev | Jared Palmer | 2026-09-17；kev-1.0 于 10-01 | 0.8B、4B、9B（Qwen3.5 Base + rank-16 LoRA + pointer head）；27B（Qwen3.8-27B 全参，51.3 GB bf16） | Apache-2.0 / Apache-2.0 | 是 |
| Clef / Clef-flash | Cloudflare | 2026-10-01 | 27B（Qwen3.8-27B）/ 9B（Qwen3.5-9B），冻结底座加路由头与 LoRA，保留视觉 encoder | — / Apache-2.0 | 是；也在 Workers AI 托管 |
| Clef-omni | Cloudflare | 2026-10-09 | Qwen3-Omni-30B-A3B，文本、图像、音频、视频 | 未写明 | 是 |
| pplx-decider | Perplexity | 2026-10-01 | 27B（Qwen3.8-27B 微调），已到 v1.2 与 flash | — / Apache-2.0（v1） | 自有端点 `/v1/decisions`，问题类型相同 |
| d1-3B / d1-omni-600M | Liquid AI | 2026-10-07 | 3.12B decoder（LFM2.5-VL-3B）/ 587M | — / LFM Open License（lfm1.0） | 托管 d1 用同名端点；开放权重卡未声明 |
| JevAny | SimpleJev | 2026-09-22 | 多个底座的 LoRA 适配器，默认 Qwen3.8-27B | Apache-2.0 | 是 |
| RSI-Jev | Shanghua-Gao | 2026-09-22 | 4B（Qwen3.5-4B-Base）与 27B | MIT / Apache-2.0 | 是 |
| NanoJev | TianyuCodings | 2026-09-17 | 0.6B（Qwen3-0.6B 加决策头），以游戏环境为主 | MIT | — |
| Simple Jev | Featherless AI | 2026-09-18 | 任意 HF causal LM | Apache-2.0 | `/v1/classifier`，别名 `/v1/systemone` |
| GLiDE | Fastino | 2026-09-30 | 未公布；40k 上下文 | 见 2.5 | 是，`/v1/systemone`；`score` 语义不同 |
| GLiNER2.5-Decide | Fastino | 2026-09-23 | 486M（HF API；媒体报道 340M） | Apache-2.0 | — |

〔B-01至B-32〕

名字容易混淆的几处：Hugging Face 上的 `autotrust/JEV-*` 是第三方的 Qwen 与 Gemma 适配器，下载量很大，训练语料是 Jev 输出的蒸馏，与 TypeSafe 无关〔B-C-60〕；Nokia 的 AnyJev 与 SimpleJev 的 JevAny 是两个项目〔B-C-25〕；Liquid AI 的 d1 是决策模型，Cloudflare D1 是 SQLite 数据库〔B-C-51〕。

## 2.3 自报成绩的读法

各项目报告的数字几乎都由作者自己测，口径互不相通。读的时候要看清三件事：比的是零样本还是在该 benchmark 上微调过的版本，Jev 的分数是自己测的还是转引的，用的是哪一个“Decision Index”。

| 项目 | 自报 | 同一来源里的限定 |
|---|---|---|
| Laya | typed-decisions 0.766，Jev 0.727 | 0.766 是在该 benchmark 的训练划分上微调后的版本；未微调的 Laya 为 0.362，低于多数类基线；Jev 的 0.727 为转引 |
| Laya | AG News 0.950 对 Jev 0.910；Banking77（77 类）0.425 对 0.870 | 选项超过约 20 个时 Jev 领先 |
| Kev-27B | “与 Jev 相差一个点以内” | 新来源准确率 0.851 对 0.857 成立；Decision Index 52.3 对 54.0；MMLU-Pro 0.675 对 0.840；checkpoint 在看过测试结果后选定 |
| Clef | 在 TypeSafe 的四个 workflow eval 中 3 个超过 Jev | 落后的一项是 agent trace；另在 10 个公开 benchmark 中 8 个领先 |
| d1-3B | Decision Index 0.2.1 公开划分 48.57 | 厂商自测 |
| GLiDE | Decision Index 0.2.1 为 64.81，Jev 57.91 | Fastino 自己用官方 scorer 跑出，未上公开榜单 |

〔B-C-08, B-C-09, B-C-20, B-C-37, B-C-49, B-C-57〕

OrcaRouter 一篇比较 Laya 与 “Jev 4.69B” 的文章常被转引，比较对象实为开源的 RSI-Jev v6.1-VL（4B 底座），与 TypeSafe 的 Jev 无关；文章自己说两个项目从未互相跑过对照，发布方是 Jev 的经销商〔B-C-10〕。

## 2.4 延迟要连同硬件读

| 模型 | 自报延迟 | 硬件与条件 |
|---|---|---|
| Laya 多语言 / 英文 | 一个问题 32.8 / 39.5 ms；十个问题批处理 72.3 / 158.6 ms | Tesla T4 |
| Kev-4B | 六个问题 18.1 ms（L40S 上 41.5 ms） | H100 上的模型时间，不含 HTTP |
| d1-3B | 每个问题 8 ms（RTX 4090）到 50 ms（Jetson Orin Nano） | 厂商测，预热后 |
| Clef / Clef-flash | 中位数 209.3 / 38.8 ms | 博文与 changelog 未写硬件；第三方在 Worker 外测到 524–726 / 191–205 ms |
| Von | p50 96 ms（4 vCPU OpenVINO），23 ms（A10G） | 项目已于 10-19 归档，推荐改用 d1-omni-600M |

〔B-C-07, B-C-36, B-C-48, B-C-62, C-C-21〕

Knowviq 在同一批请求上实测时，Clef 从 Worker 内部调用约 1.1–1.4 s，远慢于 Cloudflare 公布的中位数；它的请求有几千 token、每次十几个问题，与厂商的测法不对等〔D-04〕。

## 2.5 托管价格

| 服务 | 输入价格（每百万 token） | 出处与日期 |
|---|---|---|
| Jev | $0.042 | TypeSafe，2026-09-15 |
| Clef / Clef-flash / Clef-omni | $0.24 / $0.038 / $0.15 | Cloudflare，2026-10-09 降价后；flash 上市价 $0.09 |
| pplx-decider v1.2 / flash | $0.02 / $0.01 | Perplexity 文档，2026-10-23 读；10-02 时 Knowviq 记 v1-27b 为 $0.04 |
| Liquid d1 | Liquid 未公布；Vercel AI Gateway 列 $0.04 | Knowviq 转引 |
| GLiDE | $0.15；Fastino 模型目录另写 $0.30 | Knowviq 转引 Fastino 页面 |
| Simple Jev 托管 | 自 $0.03（beta） | Featherless 落地页 |

〔A-02, B-C-41, B-C-54, B-C-32, D-04〕

单价不能直接比：Knowviq 发现同一批请求，d1 与 Perplexity 计出的输入 token 约为 Jev 的 6.4 倍，折算下来 Perplexity 每次调用约为 Jev 的 6 倍成本〔D-04〕。

GLiDE 的授权有两种说法：Knowviq 写“Fastino 的模型列表标为 Apache 2.0”，而发布文章没有写授权，也没有开放权重或 HF 链接，Apache-2.0 明确属于另一个模型 GLiNER2.5-Decide〔B-24, B-25, D-04〕。两说未能裁定。

## 2.6 公开榜单

| 榜单 | 维护者 | 性质 |
|---|---|---|
| Decision Index | Hugging Face Space（apolinario / multimodalart） | 社区维护，37–38 个公开 benchmark 分五个领域加权；版本 0.2.1、0.3、0.4.1 并存，0.2.1 已暂停提交 |
| Artificial Analysis Decision Index | Artificial Analysis | 同名不同物：五项权重，含 HLE 多选、When2Call、WildGuardTest |
| JevBench | Benchmark Heaven（另有同名第三方项目） | 版本之间排名不同：v1.5.4（1,624 个决策）中 Jev 1.13.0 排第三；早期 v1.3.0 第一名的说法只见于检索片段 |
| System1-Arena | Tianyu Chen 等，arXiv 2610.21244 | 论文形式的 benchmark：92,125 个问题、105 个任务、30 个模型，含闭环环境 |
| Workflow evals | TypeSafe | 四个 workflow，参考答案取两家前沿模型的平均 |

〔A-21, D-18, D-19, D-24, D-27〕

## 2.7 本章未核实

- Cloudflare 自己的 Decision Index 排行页未打开；Clef 总分 61.2 只见于个人博客。
- Liquid 的价格与 LFM Open License 全文（据二手来源有营收门槛）。
- GitHub 检索结果只读了前二十条左右；Valen、OneJev、StartLux 等只见列表元数据。Laya 仓库五周 3.4 万 star 未作考察。
- `feder-cr/jev` 的仓库创建日期为 2024-08-15，早于整个生态一年以上，原因不明；ChatGPT 账本里 Kev 的 “2024-08” 是否由此而来，无从判断。
