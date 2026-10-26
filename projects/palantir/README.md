# Palantir 阅读材料

这是 Praxis 一级提炼成果目录，面向现场工作、组织协作与决策的方法论。正文只收录完成 distill、可供人工 review 的文档；材料清单和参考资料放在 `references/`，Chat 原文、会话溯源与入账记录留在 Vault。

当前本目录已接收的提炼正文：无。2026-10-06 完成原件取得**与初次提炼**，成果在 [Vault 提炼目录](../../vault/distilled/palantir-reading-20261006/README.md)：七份笔记、八份任务书。提炼仍是候选，进入本目录正文与 Kit 采纳另走裁决。

要看讲解视频，从 [入职书单视频系列](reading-list-series/README.md) 开始。

## 当前状态

- 批次：2026-10-01 登记，2026-10-06 取得原件并完成初次提炼；处理状态：`distilled`。
- 证据状态：3 个 `verified`（两篇背景文章全文、Dalio 2011 PDF）、4 个 `partial`（三本书只有片段，一本只有出版方元数据）。
- 范围：7 个对象（5 本书、2 篇背景文章）。版本按实际取得的文件登记，不预设。
- 本地原件：7/7 有本地原件，其中 3 个是全文；共 15 个文件（逐文件大小与 hash 见材料登记）。另取得 Portigal 自行发布的 6 份实践 PDF。
- 采纳状态：未裁决；本目录不产生 Kit 规则、架构决定或 Palantir 事实断言。
- 执行角色：主会话在 dsh 里串行执行（`claude` 未登录、无 codex CLI，不是 Luna 集群）。

## 入口

- [初次提炼](../../vault/distilled/palantir-reading-20261006/README.md)：七份笔记与跨材料发现。七个对象里，四本书和 Dalio 的早期 PDF 据几位 2010–2015 年入职者回忆是发给新人或推荐给新人的，没有找到公司自己的正式书单；另两篇是讲这套材料的背景文章。提炼稿把这五份直接称为“入职书单”，这一处和另外几处说法在系列施工时回到原文更正，见 [系列研究 · 对旧记录的更正](reading-list-series/research/README.md#对旧记录的更正)。
- [Reading list](references/README.md)：七个对象的稳定 ID、实际取得范围与原文阅读时要检验的维度。
- [原件快照](../../vault/snapshots/local/palantir-20261006/README.md)：逐文件说明取得方式、正文范围与未取得项。
- [材料登记](../../vault/intake/palantir-20261001.json)：批次范围、来源身份、覆盖数量和缺口的机器登记。

## 已有消费

- [入职书单视频系列](reading-list-series/README.md)：一部总论加五集，每集一份读物，另有由同一份正文排出的合集；中文旁白、4:3 与 3:4 封面、逐句出处与图片权利登记。2026-10-17 起施工，研究登记与各单元证据密度见 [系列研究](reading-list-series/research/README.md)。
- [首次设计打样](../palantir-discovery/README.md)：一页交互网页；保留 Lonsdale 条目错配的修正及页面验收。
- 改编为文字、页面或视频时，内容规则与制作参考从 [Write](../../dsh-praxis/kit/README.md)按媒介展开。

## 处理边界

本节与上面的当前状态记的是 2026-10-06 批次。视频系列后来读到的范围（Impro 的出版方预览页、Interviewing Users 第 1 版出版方节选、2015 年 bwater.com 公开版 Principles 等）见 [系列研究](reading-list-series/research/README.md)。

两篇背景文章与 Dalio 的 2011 PDF 已可消费。四本书仍然只有片段：*Interviewing Users* 到手的是第 2 版第 1 章、资源索引，以及作者自己免费发布并在资源页给出的 6 份实践 PDF；*The Looming Tower* 是出版方授权的第一段节选；*Getting Things Done* 是出版方官方节选，且节选据版权页为 2001 年版，与登记 URL 所指 2015 版不同；*Impro* 只有出版方描述、目录与产品详情，页内节选容器是空的。

原站直连有两个被拒：Qureshi 返回 429，Rosenfeld 与 Bloomsbury 返回 403（人机验证），没有绕过。这些内容经 Internet Archive 存档取得，存档时间不等于当前原站内容。原 Chat 提到的“公开全文”说法，本轮只对 Dalio 的登记 URL 确认了已失效为首页。

Internet Archive 有 Impro（1979）、The Looming Tower（2006）和 Getting Things Done（2003）的扫描件，但都是受控借阅：collection 标 `internetarchivebooks` / `printdisabled`，`access-restricted-item: true`，直接抓取全文返回 401。这些需要使用者用自己的 IA 账号借阅后取回；本轮没有登录、没有替借、没有绕过闸门。

影子图书馆（zlib、Anna’s Archive、libgen 等）不作为来源。所涉四本为版权期内商业书，来源不授权时，个人学习用途不构成中国、美国等地版权法意义上的豁免——取来入即构成侵权传播风险。补齐只走购买、借阅，或使用者提供已有的合法副本。

后续提炼应区分来源原话、可核实事实、本项目推断和待裁决候选。尤其是《The Looming Tower》应从案例中检验信息孤岛、组织激励和跨边界协作等假设；目前只有一段讲 Sayyid Qutb 1948 年个人经历的节选，与该假设没有直接对应关系，不足以支撑任何结论。

## 下一步

1. 补齐四本书正文后重访 05、06、07 三份笔记；Dalio 的 Part 3（210 条）基本未读，需要时补。
2. 四本书补齐合法、可消费全文；在此之前只按片段范围登记。可取的补充只限作者或出版方自行公开的材料。
3. 三份存档原件（Qureshi、Portigal、Impro）在原站直连恢复时重新核对一遍。
