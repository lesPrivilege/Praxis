# 研究

系列片里每一句事实、每一处引文和每一张外部图片，都回到这里的三份登记：

| 文件 | 内容 | 维护 |
|---|---|---|
| [claims.jsonl](claims.jsonl) | 主张：一句中文陈述、证据身份（`direct-source` 原典 / `eyewitness` 亲历者 / `official-record` 官方档案 / `inference` 本系列推论 / `unresolved` 未决）、来源 ID、定位、英文原话、画面用的中文译文与出处行、审阅状态 | `build/ledger.py`；画面只接受 `checked` 与 `checked-with-limits`（限度写在出处行或念白里） |
| [sources.json](sources.json) | 来源：标题、作者、URL、取得方式、版本或日期、读到的范围 | 同上 |
| [assets.jsonl](assets.jsonl) | 外部图片：作者、权利人、许可与许可证据、署名、权利状态（`approved` / `commentary-review` / `research-only` / `unknown` / `blocked`）、本地文件与 SHA-256 | 同上；`build/fetch_assets.py` 下载并校验 |

舞台读的是由这三份导出的 `assembly/ledgers.js`；没有登记、没有审过的主张，以及权利状态为 `unknown`、`blocked` 的图片，舞台拒绝启动。

## 各单元的证据密度与裁决

2026-10-17 派出六个来源探索代理（Sonnet），每个单元配一个独立核验代理逐条复核引文与定位；图片另派一个代理按单件查许可。主会话逐单元裁决，并亲自读了 Qureshi 全文、Portigal 第 2 版第 1 章、第 1 版出版方节选和两版 Principles PDF 的比对。

| 单元 | 一手可读的依据 | 与 Palantir 的联系 | 裁决 |
|---|---|---|---|
| 00 总论 | Qureshi 全文；Mabrey、Agrawal 与 Blumenfeld-Gantz、Saraf 的文章；Qureshi 的 Lenny's Podcast 逐字稿；Palantir 官方博客与 S-1 | 亲历者对发书的说法措辞不一（寄来 / 必读 / 选读）；官网入职页不提书 | 独立成集，简要；不写成“官方课程” |
| 01 Interviewing Users | 第 2 版（2023）第 1 章全文；第 1 版（2013）出版方节选：完整目录与第 3 章书页 36–46；作者 2011–2012 年公布的六份工作表格；作者访谈与 AMA | 只有书单里的一个条目；入选理由无人讲过 | 独立成集；版本分开标，联系标为本系列的读法 |
| 02 Impro | Routledge 2012 年重印本在 Google Books 的出版方预览：书页 42–46、50、55–56 整页，其余片段 | Qureshi 与 Mabrey 两位当事人各讲过一种用法 | 独立成集，范围收窄到 Status 一章与 offer / block |
| 03 Getting Things Done | 2001 年版出版方节选（到第 1 章开头）；作者官网、讲义、官方播客与访谈逐字稿 | Saraf：邮件密送全组与会议纪要，书后来成为必读；Lonsdale 一句提及 | 独立成集；2001 节选与作者后来的说法分开交代 |
| 04 Principles | 2011 年版权 PDF 全文（106 页重排版），并与 2015 年夏 bwater.com 公开版（123 页）逐词比对 | 只有 Qureshi 一句“早期 PDF”；Palantir 怎样使用无人讲过 | 独立成集，讲“文件里写了什么” |
| 05 The Looming Tower | 书只有出版方节选（与机构无关）；作者本人在《纽约客》的两篇报道与访谈逐字稿；9/11 委员会报告（公有领域）；CIA 监察长摘要 | Qureshi：创立背景；Agrawal 与 Blumenfeld-Gantz：了解对手；S-1：成立于 9/11 之后 | 探索代理建议并入总论；主会话改判为独立成集：书的正文不可核时，用作者自己的报道和官方档案讲同一段历史，与 Palantir 的对照标为本系列的推论 |

研究阶段探索与核验代理的原始结果见 [研究交接](handoffs/README.md)。

## 版本

- **Interviewing Users**：Qureshi 2015 年入职时只有第 1 版（2013）。片中安全帽、satisficing、三要素计划出自第 2 版第 1 章；第 1 版目录与第 3 章节选、作者 2011–2012 年的表格属于第 1 版时期。第 1 版正文其余部分未读。
- **Getting Things Done**：节选的版权页是 2001 年 Viking 版；官网 2014-05 存档已用 Capture / Clarify / Organize / Reflect / Engage 五个词，2015 年第二版全面改写，正文未读。
- **Principles**：本地 106 页 PDF 是 2016 年 3 月的重排版；2012-01 至 2016-03-04 间 bwater.com 提供的是 123 页的另一份（载荷摘要 `P4PUWX…`），两份按词比对序列相似度 0.936，差异主要是脚注挪位，原则编号一致，片中引用的原话两份都有。Palantir 发出的“早期 PDF”是不是这份公开文件，无从判断。2017 年成书未读，不与之混用。
- **Impro**：只读到 Routledge 2012 年重印本的预览页；页码只适用于该版。

## 对旧记录的更正

本轮回到原文后，下列旧说法不再采用（原记录不改写，更正记在这里）：

- `vault/distilled/palantir-reading-20261006/README.md` 与 `notes/01-qureshi.md` 说 Qureshi 把 Interviewing Users 对应到“FDE 跟客户建立信任”。原文第 45–46 行只解释了 The Looming Tower 与 Impro；“建立信任”是他解释 Impro 时说的。
- `notes/04-portigal.md` 说复盘表“把记录与解读分得很明确”。表上的 describe / interpret / report / assess 只是栏目标注，栏内问题混着描述与判断，作者 2017 年还说自己通常不填这张表。片中只说“多数栏目后面标着一个词”。
- `notes/03-dalio.md` 把拒绝 opt-out 记为第 209、210 两条；实为第 209 条（第 210 条是 Don’t try to please everyone）。
- `notes/07-gtd.md` 说两个目标在引言；实在第 1 章开头。
- 提炼目录 `README.md` 第 17 行（`palantir/README.md` 曾照录）说这五份“是 Palantir 当年发给新人的入职书单”。来源只到几位 2010–2015 年入职者的回忆：有人说寄来，有人说必读，也有匿名的人说选读；没有找到公司自己的正式书单。总论一集按这个口径讲。

## 制作中补登

分镜与审阅时发现画面需要、探索结果里没有的事实，由主会话回到原文补登，`found_by` 记为 `main`：共 29 条（总论 7、Interviewing Users 7、The Looming Tower 6、Principles 4、GTD 3、Impro 2）。核验人一栏，344 条是 Sonnet 核验代理，121 条由主会话新审或改审（含这 29 条）。`review_state` 为 `needs-fix` 与 `unverified` 的 23 条，舞台拒绝上屏。

## 没有取得的

- 四本书的全文（Impro、The Looming Tower、Getting Things Done、Interviewing Users 全书）。只走购买、借阅或使用者提供合法副本；影子图书馆不作来源。
- 作者谈话的可读逐字稿：Johnstone 的 TEDxYYC 与教学视频、Allen 的两场 TEDx、Portigal 的 NN/g 播客。YouTube 字幕接口不可用，没有绕过。
- Impro 的 Status 一章缺第 47–49、51–54 页，接受与阻挡一节只有检索片段；可走的合法途径是 Internet Archive 的受控借阅，要用使用者本人的账号，本轮没有用。Theatresports 学员的口述史 Something Like a Drug（1995）与 Johnstone 的 Impro for Storytellers（1999）未读。YouTube 上 TEDxYYC 与 Master-Servant 两段有人工字幕，只能在网页播放器里读，没有取用。
- Palantir 内部怎样使用这些书，除上表中的几位外，没有找到第二位一手证人。

探索与核验的完整输出（含每条来源的访问记录）在本机 scratchpad，未入库；入库的是由它们整理成的三份登记。来源快照见 [Vault](../../../vault/snapshots/local/palantir-series-20261017/README.md)，登记见 [intake](../../../vault/intake/palantir-reading-list-series-20261017.json)。

返回 [系列说明](../README.md)。
