# 对 GPT 材料的更正

两份 Deep Research 报告（R1 首轮叙述、R2 补档）和原 Chat 里的说法，本轮回到原始来源后有下列更正。原件不改写；每条给出原说法、所在位置、核实结果和依据。“主会话已读”指主会话本人打开原页核对过，其余为探索代理读到、主会话按其定位采信。

## 数字与日期

| 原说法 | 位置 | 核实结果 | 依据 |
|---|---|---|---|
| Jev 输入每百万 token 42 美元，输出免费 | R2 §2.5 | 每百万 0.042 美元（每十亿 42 美元），差 1000 倍 | A-C-16，主会话已读 |
| TypeSafe 发布博文为 2026 年 1 月 | R1 §一 | 2026-09-15，Diogo Almeida 署名；R2 的日期和 URL 是对的 | A-C-04，主会话已读 |
| Jev 比 LLM 快 100–200 倍 | R2 §1 | 发布文章写 40–200 倍；首页的 193.6 倍来自自建 workflow eval，TypeSafe 自称“真实收益的高端” | A-C-15，主会话已读 |
| Laya、Kev、Simple Jev 的日期为 2023–2024 年 | R2 来源账本 | 全部创建于 2026-09（Laya 09-18，Kev 09-17，Simple Jev 09-18） | B-C-01, B-C-15, B-C-29 |
| Kev-4B 在 A100 上 18 ms | R2 §2.5 | 18.1 ms 是 H100 上六个问题的模型时间；L40S 41.5 ms；README 说 A100 比 L40S 慢 | C-C-21 |
| `kev.serve` 端口 8010 | R2 §2.3 | 8009 | C-C-14 |
| Perplexity 每百万输入 0.04 美元 | R1 §二 | 10-02 时 Knowviq 记 0.04；10-23 文档为 v1.2 每百万 0.02、flash 0.01；按读取日期并存 | B-C-54，主会话读了 Knowviq |
| Liquid d1 每百万 0.04 美元 | R1 §二 | Liquid 自己未公布；0.04 出自 Vercel AI Gateway 与 OrcaRouter | B-C-50, D-04 |
| 中国移动 EnterpriseRAG：13 个模型平均单项约 80%、全部约束 26.8% | 原 Chat Turn 4 | 26.8% 是最好模型的严格分（宽松 83.8%） | D-C-32 |
| Laya ECE 0.466 → 0.081 是多语言模型 | 原 Chat Turn 6 与 OrcaRouter 的对照 | 0.466 → 0.081 是英文 checkpoint；0.314 → 0.106 是多语言 | C-C-06 |

## 归属与身份

| 原说法 | 位置 | 核实结果 | 依据 |
|---|---|---|---|
| Jev-as-a-Judge 出自 CMU 团队 | R1 §四 | Alden Do Rosario、Kirollos Atef，CustomGPT.ai | D-C-17，主会话读了摘要页的作者 |
| Jev-as-a-Judge：延迟 0.15 s、成本 0.36%、级联提升 0.9 点 | R1 §四 | 论文没有测延迟；成本比约 187 倍（约 0.54%）；级联对 Astra +0.27，不显著。0.9 可能来自摘要里级联对廉价模型的 0.83 点 | D-C-21, D-C-22，主会话已读摘要 |
| Jev 有 4.69B 参数 | 原 Chat 与 R2 引 OrcaRouter | 4.69B 是开源的 RSI-Jev v6.1-VL；TypeSafe 未公布参数量 | A-C-10, B-C-10 |
| Jev 采用 pointer-head 架构 | R1 §一 | Jev 架构未公开；pointer head 属于 Kev | A-C-09, B-C-17 |
| Decision Index、decision-v7、JevBench 是 Jev 的基准 | 原 Chat Turn 8，R2 §3.4 | 都不是 TypeSafe 的：Decision Index 为社区 HF Space（另有 Artificial Analysis 同名指数），decision-v7 是 Kev 的套件，JevBench 有多个第三方同名项目；TypeSafe 自己的是 Workflow evals | A-C-20, A-C-21, D-C-36, D-C-38 |
| Clef 在 Decision Index 4 项中赢 3 项 | R1 §二 | 3/4 指 TypeSafe 的四个 workflow eval；Decision Index 上 10 项中 8 项领先 | B-C-37, B-C-38 |
| Arize 独立横评 | 原 Chat Turn 8 | Arize 是集成 Jev 的厂商，独立性不成立 | D-C-33 |
| System1-Arena 是 NanoJev 的基准 | R2 §1、§3.4 | 独立论文 arXiv 2610.21244，NanoJev README 链接它 | D-C-40 |
| SAG2 的 MuSiQue 开发使用说明在 §4.1 和 §5.5 | 原 Chat Turn 2 | 只在 §5.5；§4.1 讲子集与语料汇集 | D-C-08 |
| LargitData 的多轮路由测试在 `course.largitdata.com` | 原 Chat Turn 4 | 原文在 `www.largitdata.com/en/blog`（2026-09-20）；D 线经旧地址读到同一内容，E 线未在 course 子域找到 | E-C-26, D-C-25 |
| Knowviq 的流水线依次为相关性、可回答性、逐句支持 | 原 Chat Turn 4 | 三项判断都在，Knowviq 自己的说明没有规定这个顺序 | E-C-23 |

## 授权与命令

| 原说法 | 位置 | 核实结果 | 依据 |
|---|---|---|---|
| Laya 代码 MIT、权重 Apache-2.0 | R2 §1 | 只对 receptron 的 Node 运行时成立；主仓库代码 Apache-2.0 | B-C-03 |
| NandhaKishorM/laya 与 receptron/laya 互相冲突 | 两份报告的分歧 | 两个仓库都真实存在，前者是模型作者的 Python 仓库，后者是另一组织的 Node/TS ONNX 运行时 | B-C-02 |
| `npm install -g laya`、`laya-train --model`、`laya-run` | R2 §2.2 | npm 的 `laya` 是无关包；Python 包 `laya`；底座参数是 `--base`；没有 `laya-run` | C-C-10 |
| `docs/finetune.md` 记载 `laya-serve` 与 `LAYA_EXTRA_MODELS` | 原 Chat Turn 6 | 二者在主 README，不在 finetune.md | C-C-08 |
| Fastino GLiDE 为 Apache-2.0 开放权重 | R1 §二 | 发布文章未写授权、无开放权重；Apache-2.0 属于 GLiNER2.5-Decide。Knowviq 称 Fastino 模型列表标为 Apache 2.0，未能裁定 | B-C-56，主会话读了 Knowviq |
| Liquid d1 为 Apache-2.0 | R1 隐含 | LFM Open License（lfm1.0） | B-C-47 |
| Clef “经 Cloudflare 优化后延迟约 38 ms” | R2 §2.5 | 38.8 ms 是 Clef-flash 的中位数，未写硬件 | B-C-36 |

## 来源不足、未能核实

| 原说法 | 位置 | 状态 |
|---|---|---|
| Jev 训练数据全部为合成 | R1、R2 | 只见于对创始人的媒体采访；TypeSafe 页面上的对应 FAQ 折叠未读到（A-C-08） |
| 微信文章：Laya 多语言零样本 18.45%，`bert-base-chinese` 微调 95% 以上 | 原 Chat Turn 6 | 微信验证页拦截，未读（C-C-26） |
| “领域分类器对照”“证据充分性实验” | 原 Chat Turn 8 | 没有找到同名实验；最接近的是 Glean、Akita 与第三方 `jevrag` 包（D-C-42, D-C-43） |
| JevBench 上 Jev 排名第一 | 原 Chat Turn 8 | 取决于版本；v1.5.4 中第三，早期第一的说法只见于检索片段（D-C-35） |

## R2 的移交清单不采用

R2 第 5、6 节建议的目录（`Praxis/Jev/ledger/…`、`scripts/Laya_train_example.sh`、`export_artifacts.sh`）、Mermaid 甘特图和“访问控制”步骤没有采用：其中的训练脚本基于不存在的命令，甘特图的日期是虚构的（调研阶段写成 2026-09-01 起），访问控制与 Praxis 的入账规范不符。本专章的目录见 [Jev 专章](../README.md)。
