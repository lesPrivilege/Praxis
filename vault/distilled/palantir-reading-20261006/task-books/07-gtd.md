# 任务书 07 · Allen《Getting Things Done》：只有出版方官方节选，且版本需注意

先读 [通用规则](00-common-rules.md)。你拥有唯一输出文件 `vault/distilled/palantir-reading-20261006/notes/07-gtd.md`。

## 你读的东西（两个文件，同一个页面）

1. `vault/snapshots/local/palantir-20261006/allen-gtd-official-excerpt.txt` — 22,471 字节，**这才是可读正文**，约 3,647 词。**主读这份。**
2. `vault/snapshots/local/palantir-20261006/allen-gtd-publisher-page.html.txt` — 出版方页面本身，423,905 字节，绝大部分是站点导航。只在需要核元信息时翻它。

两份都于 2026-10-06 从 penguinrandomhouse.com 原站直连取得（HTTP 200）。

节选是这样来的：出版方页面里嵌了一个 `textExcerpt` 字段，把它取出并转为 UTF-8 文本，就是第 1 个文件。内容包括：目录、版权页、致谢、引言（「Welcome to Getting Things Done」），以及第 1 章开头的一小段。

## 版本边界

- **登记 URL 指向的是 2015 年 Penguin 版**：ISBN 9780143126560，352 页，2015-03-17 出版。
- **节选本身据其版权页为 2001 年 Viking 版**：`Copyright (c) David Allen, 2001`，「First published in the United States of America by Viking Penguin, a member of Penguin Putnam Inc. 2001」，2003 年转入 Penguin Books。

**两者不是同一版。** 你写的每一条都要说明它出自节选（据版权页为 2001 年版），不要让人以为读到的是 2015 版。`status` 写 `partial`，`full_text_status` 写 `publisher-excerpt-only`。

## 记什么

按节选的实际结构走。每节给：在讲什么（不超过两句）；支持它的短原话 + locator（节选的行号或小节名）；标明这是 `来源原话`。

特别留意，但不要只写这些：

- **目录里的三部与十三章标题，以及第三部分的三章**（ collection habit / next-action decision / outcome focusing ）。这是节选里唯一能看到全书骨架的地方。
- 引言里作者自陈的写作目的（有一句 Teaching you how to be maximally efficient and relaxed…was my main purpose in writing this book）。逐字记录。
- 第 1 章开头讲的三个蜕变化讲：（1）工作不再有清晰边界、（2）我们的工作在不断改变、（3）旧的模式与习惯不够用。这三条是作者自己列的结构，照写，写明节选只到第 3 条标题为止。
- 若节选里出现「两分钟内能做完就当场做掉」这类具体做法，登记；没有就写没有。

## 关于阅读清单拟的那两个维度

清单给 GTD 拟的是：`capture/clarify/organize/review/engage` 的工作流，以及 `task、project、reference、someday/maybe` 的边界。

**请核对你读到的节选能不能支持这两项。** 目录第三部分的三章标题分别是 The Power of the Collection Habit、The Power of the Next-Action Decision、The Power of Outcome Focusing——这与 capture/clarify/organize/review/engage 五段**不是同一套说法**。如果你的结论是「节选只能支持作者强调的三条 power，不足以支持五段工作流或四类划分」，就写这句话。不要拿你已知的 GTD 知识去凑。

## 不要做

- 不要使用你自己知道的 GTD 术语体系来补完。这是最容易犯错的一份，因为 GTD 的说法流传很广。
- 不要把第 1 章开头那点内容升华成全书的方法。
- 不要为了使五段工作流显得完整而发明缺失的阶段。

## 交付

- `# Allen · Getting Things Done（出版方官方节选）`（取证身份、存取日期 2026-10-06、证据状态 `partial`、来源路径、**版本不一致说明**）
- `## 版本与来源`
- `## 全书骨架（自目录）`
- `## 引言`
- `## 第 1 章开头`
- `## 拟维度能否成立`
- `## 未覆盖`（写明全书正文未取得、且版本不符）
- `## 重访触发`
- `## 交接摘要`（不超过 250 字）
