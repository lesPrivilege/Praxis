# 任务书 01 · Qureshi《Reflections on Palantir》

先读 [通用规则](00-common-rules.md)。你拥有唯一输出文件 `vault/distilled/palantir-reading-20261006/notes/01-qureshi.md`。

## 你读的东西

`vault/snapshots/local/palantir-20261006/qureshi-reflections-on-palantir.html.txt`

Nabeel Qureshi 的个人回顾，2024-10-15 发表于他自己的站点。作者 2015 年入职、2023 年离职，以 forward deployed engineer 身份在伦敦、硅谷、DC 待过八年。原文标注「personal capacity」，并声明 `long $PLTR`。来源经 Internet Archive 2024-12-31 存档取得，原站当前直连返回 429。**不要把存档内容等同于原站现在的内容。**

正文约 6,200 词，七节。

## 一个陷阱

这份文件的 HTML 清理后，**第 5、6、7 节的标题粘在上一节的最后一段尾部**，不在独立行上。这不是三节缺失。用这些字符串搜索行数为证：`5. Bat-signals`、`6. Morality`、`7. What next?`。清理后的文本约有 96 行，第 5 节标题大约在第 55 行那一句的中后段。

七节依次是：

1. Why I joined
2. Forward deployed
3. Secrets
4. Notes on culture
5. Bat-signals
6. Morality
7. What next?

## 清理办法

可用这条 Python（只读，不写文件）：

```python
import re, html
h = open('qureshi-reflections-on-palantir.html.txt', errors='replace').read()
t = re.sub(r'<(script|style|noscript)[^>]*>.*?</\\1>', '', h, flags=re.S|re.I)
t = re.sub(r'</(p|div|li|h[1-6]|br)>', '\\n', t, flags=re.I)
t = re.sub(r'<[^>]+>', ' ', t)
t = html.unescape(t)
t = re.sub(r'[ \\t]+', ' ', t)
lines = [l.strip() for l in t.split('\\n') if l.strip()]
```

locator 请用「节名 + 清理后行号」。

## 记什么

按节走。每节给：这一节在讲什么（不超过两句）；三条以内支持它的来源原话，短、逐字、带 locator；以及这一节里**明确是作者个人评价而非事实**的地方。

特别留意，但不要只写这些：

- 第 2 节 forward deployed engineer 的双轨结构（FDE 与 PD），以及 Foundry 的产品化路径。这一段里有具体的产品名（Magritte、Contour、Workshop）和具体的毛利率数字（80% vs Accenture 32%）——数字照抄，标明是作者的陈述，本仓库**没有另行核实**。
- 第 2 节引用 Tyler Cowen 的「context is that which is scarce」一句，以及 Steve Blank 的「getting out of the building」。这两处是转引，标明。
- 第 3 节关于职级与信息接触面（他把标题层级与信息可见性挂钩的说法）是否自称猜测。逐字记录他的限定词。
- 第 5 节 talent bat-signals：他把招聘视为要有差异化的来源，记录他给的两个条件。
- 第 6 节有一段自我披露（童年在压抑国家生活过）——这是立场声明，不是论据，标明。
- 注释 [2][3][5] 转引了 Ted Mabrey、Sarah Constantin、Byrne Hobart 三个外部作者。只登记身份与 URL，**不要去读那些页面**。

## 不要做

不要在第 7 节的预测上做发挥；不要因为作者在别处声明持有多头就贬低全文，也不要忽略它——在合适的位置写明利益披露的存在。

## 交付

结构：

- `# Qureshi · Reflections on Palantir`（标题下写明取证身份、存取日期 2026-10-06、证据状态 `verified`、来源路径）
- `## 七节各一节`（内含上述三样东西）
- `## 我以为重要`
- `## 未覆盖`
- `## 重访触发`
- `## 交接摘要`（不超过 300 字）
