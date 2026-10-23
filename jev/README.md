# Jev 专章

Jev 与 System One 决策模型的快照，日期 2026-10-23：Jev 本身、开源与兼容生态、私有数据微调与部署、评测、企业知识库中的位置，附录为数据库里的判断列。面向 to B 场景的方案汇报与演示，不触及生产实现。

本专章的材料与产物都在本目录。Praxis 其他位置只有指向这里的提要。

| 读什么 | 去处 |
|---|---|
| 一页看完结论与图 | [site/index.html](site/index.html)，单文件离线网页，可打印 A4 |
| 中文底稿 | [draft](draft/README.md)，七章加两个附录，每条事实带来源 ID |
| 来源、主张与核实范围 | [research](research/README.md)，五条线的登记、主会话核对记录、对 GPT 材料的更正 |
| 冷读审阅与裁决 | [review-20261023.md](review-20261023.md) |

## 状态

- 研究：五条线完成，236 个来源、288 条主张；主会话亲自核对 23 条承重主张。未读与被拦截的列在 [附录 B](draft/appendix-b-sources.md)。
- 底稿：完成；一次不带撰写上下文的冷读审阅已逐条裁决，未经人工 review。
- 网页：完成，桌面与 375 px 窄屏、两个步进图已在浏览器里检查；未做读者测试、屏幕阅读器与 Safari / Firefox 检查。
- 采纳：本专章不产生 Kit 规则。

## 来路

用户在 ChatGPT 中从一张测试集截图问起，逐步扩到专章的范围与体例，两轮 Deep Research 交出两份报告（[inputs](research/inputs/README.md)）。用户的口径：GPT 只做沿路探索，正文由 Opus 按 Kit 写作规范撰写；所有材料与产物留在本目录；部署、微调与评测只登记外部成熟实践与 benchmark，不预设算力、成本与工程实现；企业 DB 的转变作附录。

两份报告里的价格、日期、作者、命令与授权有多处错误，本专章没有沿用报告的正文，而是按五条线回到一手来源重新登记，见 [更正](research/corrections.md)。

## 重建

```bash
python3 jev/research/tools/ledger.py
python3 jev/site/build.py
```

第一条把 `research/streams/` 的五份登记合并成 `sources.json` 与 `claims.jsonl`，并检查底稿引用的每个 ID 都存在；第二条从 `site/src/` 与登记生成网页，页面上每张图的来源行由登记自动填出。

## 下一步

- 人工 review 底稿与网页。
- 需要更新快照时，重跑对应的线，新的登记写成新文件，不覆盖本次的。
- 附录 B 列出的未读项：TypeSafe FAQ 的折叠答案、微信文章、JevBench 预印本、几篇论文的后半。
