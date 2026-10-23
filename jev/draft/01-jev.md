# 一 · Jev

Jev 是 TypeSafe AI 于 2026-09-15 发布的 decision model：调用方交给它一段 state 和一组带类型的问题，它为每个问题返回一个类型确定的答案和一组概率，不生成文本。TypeSafe 把这一类模型称为 System One model，Jev 是其中第一个公开模型，只以托管 API 提供〔A-02, A-04〕。

## 1.1 这一类模型的位置

TypeSafe 的发布文章把它放在 LLM 与传统分类器之间：LLM 用自然语言回答任何问题，代码要再解析一遍字符串，模型自述的把握也只是文字；传统分类器给出干净的概率，但只会它训练过的那一个任务。Jev 接收用自然语言写的问题，返回代码可以拿去和阈值比较的概率，同一段 state 上的多个问题在一次调用里并行作答〔A-02, D-04〕。

发布文章把这类调用叫作 “smart if-statements”：分类、路由、打分、抽取和分支，以及大规模数据上的 map-reduce、实时应用、对 LLM 输出的打分与核验〔A-02, A-23〕。命名来自 Kahneman 对快思考与慢思考的区分；Jev 之名取自 William Stanley Jevons〔A-02〕。

## 1.2 一次调用的形状

请求体有四个顶层字段：`model`、`state`（字符串、JSON 对象或数组）、`questions`（以问题 ID 为键的映射）和可选的 `assets`。每个问题写 `type`、`instructions` 和 `criteria`〔A-05〕。

| 类型 | 问的是 | 返回 |
|---|---|---|
| `noul` | 是或否 | 为“是”的概率，0 到 1；没有 confidence 字段 |
| `choice` | 从至多 255 个选项中选一个 | 选中的项、每个选项的概率、confidence |
| `score` | 在 2 到 10 级的有序量表上打分 | 可以带小数的 score、每一级的概率、confidence |

响应返回实际作答的版本号（如 `jev-1.13.0`）、以问题 ID 为键的 `answers`，以及 `usage`〔A-05〕。问题数量本身不设上限，受上下文限制：每个请求 64k token，每个问题 32k；带上 `TypeSafe-Danger-Zone-Long-Context` 请求头可放到 262k，速度和准确率下降，单价不变〔A-07, A-10〕。

confidence 由概率推出。choice 的公式是 (p_max − 1/n) / (1 − 1/n)；noul 没有这个字段，文档建议用 |2p − 1| 代替。文档的用法是置信低就不执行：交给人、追问或退回别的路径，并举了“低于 0.5 转人工”这类阈值作例子〔A-08〕。

## 1.3 训练方法

TypeSafe 称训练方法为 Reinforcement Learning for Calibrated Decisions（RLCD），与 RLHF、RLVR 对照：RLHF 优化人类评分员偏好的回答，RLVR 优化能被程序验证的输出，RLCD 优化“带有诚实概率的答案”。发布文章说他们做了新的模型架构和并行 sampler〔A-02〕。

架构没有公开，也没有论文或参数量。媒体只转述为“基于 transformer，不是 LLM”〔A-09, A-23〕。“训练数据全部是合成的”这一说法出自 TechCrunch 对创始人 Diogo Almeida 的采访；TypeSafe 自己的页面里，发布文章 FAQ 有“训练数据从哪里来”一问，答案折叠，未读到〔A-08〕。

## 1.4 价格、速度与它们的口径

输入 $0.042 / 百万 token（即每十亿 token 42 美元），输出不收费〔A-02〕。TypeSafe 在同一篇文章里写明无法证明这个价格没有补贴。

速度有三种说法，口径各不相同：

| 说法 | 出处 | 口径 |
|---|---|---|
| 端到端 70–500 ms，比同等智能的 LLM 快 40–200 倍 | 发布文章 | 针对 “System One shaped” 的查询；评测从美国西海岸的笔记本上发出 |
| 快 193.6 倍，便宜 444.6 倍 | 官网首页 | 来自 TypeSafe 自建的四个 workflow eval，TypeSafe 自己说这是“真实收益的高端” |
| p50 236–276 ms | 第三方测试，经 Laya、OrcaRouter 转述 | 包含测试者到 TypeSafe 服务的网络往返 |

〔A-02, A-01, A-26, A-27〕

Knowviq 在美国西部的测试机上测得 Jev 中位数 98–122 ms，Cloudflare 在自己的表里记为 524 ms，两者的请求大小和发起位置都不同〔D-04, B-12〕。速度的数字只能连同测量位置和请求形状一起读。

## 1.5 TypeSafe 的自建评测

TypeSafe 不发布标准 benchmark 排行表（2026-09-11 的博文专门谈过这一点），自建的是 Workflow evals：安全事件、agent trace 可观测性、发票处理、客服四个 workflow，每个模型走同一张计算图，以 GPT-6 Astra 与 Claude Fable 5.1 的平均输出作参考答案〔A-16, A-19〕。这样测的是与两家前沿模型的一致程度，TypeSafe 自己在文中写明这会偏向 OpenAI 与 Anthropic 的模型，workflow 也由其能力团队编写〔A-02〕。

社区里常被当作 Jev 官方榜单的几个名字都不是 TypeSafe 的：Decision Index 是 Hugging Face 上的社区 Space，页面写明与 TypeSafe 无关；Artificial Analysis 另有一个同名指数；decision-v7 是开源复现 Kev 的训练与评测套件；JevBench 至少有三个互不相关的第三方项目在用这个名字〔A-21, D-19〕。第四章按出处分别列出。

## 1.6 版本

| 版本 | 发布 | 别名（2026-10-23 文档） |
|---|---|---|
| `jev-1.13.0` | 2026-09-15 | `jev-latest`，SDK 默认 |
| `jev-1.14.0` | 2026-10-14 | `jev-preview`；博文称之后 `jev-latest` 会切到它 |

〔A-10, A-15〕

1.14 在 “danger zone” 下加入了图像输入；1.13 的文档写的是只接受文本〔A-09, A-15〕。文档另有逐版本的 “jaggedness” 页，列出该版本已知做不好的任务〔A-13〕。

## 1.7 企业条款

企业页列出：SOC 2 Type II 报告可按需索取，企业客户可向销售申请零数据保留，不用客户输入和输出训练模型，更高的速率限制找销售〔A-14〕。模型页写明 Jev 不用客户数据做 fine-tune 或 LoRA 适配，所有账户用同一套权重；定制靠 state、instructions、criteria，或者在 Jev 之外训练自己的模型〔A-10〕。

企业页 FAQ 里有“能否在自己的 VPC 或本地运行 Jev”一问，读到的页面文本里没有答案；文档只描述托管访问〔A-14〕。Cloudflare 的模型目录也上架了 `typesafe/jev`，标注零数据保留〔A-33〕。

公司层面：2026-10-09 宣布 a16z 领投、Sequoia 与 DCVC 跟投的 8.7 亿美元 A 轮，估值 75 亿美元，并称“三分之一的 Fortune 500”在用 Jev，这是公司自述〔A-17, A-24〕。TypeSafe 自己发布的一个客户案例是 Jack & Jill：在候选人筛选的一个打分环节替换 Gemini 3.1 Flash Lite，成本下降 88%，中位耗时从 20.3 s 降到 10.3 s，最终入选者的保留率 93.9% 对 94.6%，差异不显著；这是客户自己做的离线测试〔A-18〕。

## 1.8 本章未核实

- 发布文章 FAQ 与企业页 FAQ 的折叠答案，包括训练数据来源和私有部署。
- Trust Center、客户协议、DPA；速率限制的具体数字、延迟 SLA 和弃用政策（文档称弃用政策会先于任何弃用发布）。
- evals.typesafe.ai 的逐 workflow 数字只经第三方页面读到。
