# Palantir 阅读清单 · 原件取得 · 2026-10-06

范围：逐 URL 实访阅读清单的 8 个条目，取得可读原件并登记；不提炼、不采纳。本轮由主会话执行，Luna 在本会话不可用，没有工作记在 Luna 名下。

用户指令是「补充 reading list 拿到网络资源原本」。此前 8 个 URL 全部为 `unverified`，7 个对象 `full_text_status` 均为 `missing-local-copy`。

## 实访结果

| ID | 直连 | 结果 | 取得方式 |
|---|---|---|---|
| url-01 Qureshi | 429（Vercel Security Checkpoint，三次重试同结果） | 全文 | Internet Archive 2024-12-31 存档 |
| url-02 Lonsdale | 200 | 全文 | 原站 HTTP 正文 |
| url-03 Dalio | 200，但 content-type 为 text/html，已不是 PDF | 全文 PDF | Internet Archive 2016-10-21 存档 |
| url-04 Portigal 样章 | 403（Cloudflare 人机验证） | 第 1 章 | Internet Archive 2025-02-06 存档 |
| url-05 Portigal 资源 | 未直连 | 资源索引 | Internet Archive 2025-01-13 存档 |
| url-06 Impro | 403 | 仅出版方元数据 | Internet Archive 2022-12-06 存档 |
| url-07 Looming Tower | 200 | 授权节选 | 原站 HTTP 正文 |
| url-08 GTD | 200 | 出版方页 + 内嵌官方节选 | 原站 HTTP 正文 |

没有绕过任何人机验证。三个受阻站点的人机验证页都停在那一页。

## 逐件核对

**Qureshi。** 存档全文七节，与作者自办 Substack 同源文本比对，正文相似度 0.977；差异只在导航与评论区，Substack 侧 `datePublished` 为 2024-10-15，与存档页面标注一致。未另存 Substack 页面。

**Lonsdale。** 原页九条齐全，日期 2010-04-11。这一条此前的 2026-10-03 打样已由主会话在浏览器读过并改正了条目对应（见 [Palantir 首次设计打样](../../demos/palantir-discovery/README.md#验收记录)），本轮是首次保存原件。

**Dalio。** 登记 URL 已失效为官网首页，PDF 不再提供。经存档取得的文件 `pdfinfo` 报 106 页、标题「Principles by Ray Dalio」、作者 Ray Dalio、Creator Adobe InDesign CC 2015、CreationDate 2016-03-04；正文标 Copyright © 2011 Ray Dalio，分 Part 1/2/3。这是 2011 版权版本，与 2017 年成书《Principles: Life & Work》不是同一版本。

**Portigal。** 样章为第 2 版第 1 章全文。核对了此前打样记载的一条：第 1 章的高层研究计划只有业务问题、研究问题、研究方法三项，参与者提问另列一节——存档正文与此相符，作品的收窄写法可以保留。

**Impro。** 只有出版方描述、目录（Preface / Introduction / Status / Spontaneity / Narrative Skills / Masks and Trance）与产品详情。页内「Read an extract」是空的 Google 预览容器，没有返回节选文字。

**Looming Tower。** 出版方授权节选「The Martyr」约 3,448 词，讲的是 Sayyid Qutb 1948 年的个人经历。与阅读清单关注的信息孤岛、激励错位等维度没有直接对应关系，不足以支撑案例提炼。

**GTD。** 除页面本身，另从页面内嵌 `textExcerpt` 字段取出官方节选（22,471 字节：目录、版权页、致谢、引言与第 1 章开头）。节选据版权页为 2001 年 Viking 版，登记 URL 指向 2015 年 Penguin 版（ISBN 9780143126560、352 页），两者版本不同。

## 补取：Portigal 自行发布的实践工件

从资源索引页出发，按页内链接到作者自己的媒体库（`rm-media.nyc3.digitaloceanspaces.com`）取得六份 PDF，363,054 字节：筛选问卷（8 页）、Reading Ahead 访谈提纲（3 页）、现场参与说明（1 页）、两份复盘表（1 页 / 2 页）、Reading Ahead 顶部摘要（4 页）。

全部 `pdfinfo` 显示 Author 为 Steve、页眉为 Portigal Consulting LLC，生成于 2011–2012 年；magic bytes 与页数均已校验。作者在自己的资源页免费发布这些文件，不是第三方转载，也不是出版方样章。

第七份 *Take It from Consumers* 在资源页上有链接，作者站点返回 404，没有取得。演示幻灯片、音视频与 Google Doc 排期模板未下载。

## 未走的路

Internet Archive 有 Impro（1979）、The Looming Tower（2006）和 Getting Things Done（2003）的扫描件，三者 collection 均为 `internetarchivebooks` / `printdisabled`，`access-restricted-item: true`。直接抓取 `_djvu.txt` 全文返回 **401 Authorization Required**——Archive 自己的借阅闸门。这是受控借阅，不是自由下载。本轮没有登录账号、没有替使用者借阅、没有绕过闸门。

影子图书馆（zlib、Anna’s Archive、libgen 等）未接触。使用者提出「仅用于个人学习」后仍未采用：所涉四本为版权期内商业书，是来源不授权，缺少的不是许可而是权利基础，而借阅或学习目的不构成中国、美国等地版权法意义上的豁免。这是本轮唯一主动放弃的路径，记录在案以便日后复核。

## 覆盖与缺口

7 个对象全部有本地文本：3 个全文、1 个第 1 章（另加 6 份作者公开工件）、1 个授权节选、1 个官方节选、1 个仅出版方元数据。15 个文件、4,365,133 字节。8 个 URL 中 4 个 `verified`、4 个 `partial`，`unverified` 归零。

未做：

- 四本书的完整正文都没有取得，需要购买、借阅或使用者提供合法副本补齐。
- 影子图书馆未接触，理由见上一节。
- 作者实践工件中的音视频、幻灯片与外部排期模板未取。
- 没有逐源提炼，没有形成任何 Kit 规则或 Palantir 事实断言。
- 10 个引用占位仍是 missing-original，本轮没有恢复。
- 存档内容不等于原站当前内容；三个受阻站点的人机验证没有绕过。
- 出版方描述、目录、奖项与评价文案未作证据使用。

## 验证

仓库校验通过：860 个快照、634 个来源记录、127 条消息映射，无错误。本轮重新生成了 registry 与 snapshot-manifest。
