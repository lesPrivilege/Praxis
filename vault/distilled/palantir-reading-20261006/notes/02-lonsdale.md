# Lonsdale · Lessons from Peter Thiel

- 取证身份：主会话（dsh 串行执行；claude 未登录、无 codex CLI，不是 Luna 集群）
- 存取日期：2026-10-06
- 证据状态：`verified`（全文在手）
- 来源路径：`vault/snapshots/local/palantir-20261006/lonsdale-lessons-from-peter-thiel.html.txt`
- 来源性质：Joe Lonsdale 2010-04-11 发表在 8VC「Resources · Posts」下的一页笔记。**个人回顾，不是 Palantir 官方陈述**
- **原站直连取得**（HTTP 200，页面 `last-modified` 2026-10-06）——本批七份里唯一「当前原站内容」与「本地原件」同源的一份
- locator 体例：条号 + 清理后文本行号

## 九条

正文从行 41 起，行 42 标「The nine lessons:」。清理后共 107 行，其中正文约在行 41–65；行 66 之后是站点导航。

> "These lessons summarize what Joe Lonsdale learned from working over many years with Peter Thiel, a chairman and founder of Palantir."（行 41，`来源原话`）

**1. Divide reasoning into separate parts and clearly identify the most important factor.**（行 43）
> "If you can't give a single reason that justifies doing something on its own, you should be very wary that you aren't exercising sufficient intellectual discipline."（行 44，`来源原话`）

**2. Don't divide your attention: focusing on one thing yields increasing returns for each unit of effort.**（行 45）
讲注意力集中有凸性回报；既有微观（多一小时在当前项目 vs 新开一件事），也有宏观（把资源从既有项目转到新领域的机会成本很高）。

**3. In hiring, value intelligence highly. Like focus, intelligence yields increasing returns.**（行 48）
> "The key in hiring is to value potential skill rather than currently existing skill — and potential skill is based on intelligence rather than training."（行 49，`来源原话`）
他称最聪明的人可能比稍逊者高出一个数量级。**作者判断。**

**4. Obsess over perfection.**（行 50）
理由是赢家通吃（网络效应与切换成本），99.99 百分位比 98 百分位值钱得多。行 51 有具体的行动含义：凌晨一点已有「very good」的东西，也值得再花两小时做到「amazing」。**作者判断。**

**5. Use small details as indicators to point to the larger truth — and be alert when they point to conclusions you don't like.**（行 53）

**这一条曾在本仓库被写错过。** 2026-10-03 做 Palantir 设计打样时，交接包把第 5、6 点写成「分拆推理」与「澄清行动」，对应关系反了；主会话读原页后改正。此处重新确认：

> "you can derive a lot of wisdom from subtle indicators. How competent a single person is or how hard one person is working, or what a couple smart people think, might tell you a lot about a group before deciding whether to work with them."（行 54，`来源原话`）

> "you should be open to them especially when they do not confirm your biases."（行 54，`来源原话`）

即：**第 5 条讲的是用细小迹象看整体，并留意指向你不喜欢的结论的迹象。** 他同时给了限定：「indicators are not always right」（行 54，作者的自我限定，不是我们加的）。

**6. Don't waste time talking about what you plan to think about; instead, work through it immediately.**（行 55）
> "If you are sitting there talking about problems you plan to solve later, there's a good chance you are being inefficient."（行 56，`来源原话`）

行 56 里出现了 GTD（见下「跨材料线索」）。即：**第 6 条讲的是不要空谈打算想什么，当场就想清楚。**

**7. Take the time to listen to smart people with whom you disagree.**（行 57）
> "this mindset cannot be allowed to ossify into an orthodoxy."（行 58，`来源原话`）
他给出的机制是主动去找持不同看法或走了不同路径的聪明人。

**8. Be skeptical of any sort of external allies, and don't trust the execution of anyone outside Palantir.**（行 60）
> "the incentives of the other company will not line up with ours, and even if they do for the moment, they no longer will once the situation changes."（行 61，`来源原话`）
> "other companies don't have the same culture of execution that Palantir does, and we don't have the power to instill that culture in them."（行 61，`来源原话`）
实践上的做法：行 62 说这种怀疑导致他们要求对方先付费以证明价值。行 61 提到 Peter 早期曾使公司免于一场「可能会毁掉公司」的合作。**作者判断，且是对第三方的负面评价，引用时须带上出处与主语。**

**9. Return to first principles and act quickly on your new conclusions.**（行 63）
重新设计时的两种做法对比：在既有基础上小改， vs 假想从空白开始重新设计。行 64 给了一句限定——**实现上几乎总是复用既有代码库**：
> "in either case, the right approach is almost always to re-use the existing codebase in your implementation — but starting from first principles frees your mind from your assumptions about implementation complexity..."（行 64，`来源原话`）
行 65 提到「世界上最大的对冲基金，现在是我们的客户」也强调这一点（未点名）。

## 跨材料线索

行 56 出现了一次 GTD：

> "Similarly, in GTD, you don't put off tasks that only take a couple minutes."（`来源原话`）

这是作者顺手援引，**不能当作 GTD 本身的证据**。它在本仓库的意义是：这两份材料之间存在作者自己指出的关联——他在讲「当场想清楚」时，拿 GTD 的「两分钟能做完就别拖」作类比。

结合 01 号笔记：Qureshi 行 51 说 Lonsdale 这篇「此前是对内文件，后来公开」，行 45 说入职时发那四本书加 Dalio 早期 PDF。也就是说，**第 6 条的 GTD 援引不是巧合——GTD 本来就在同一份入职书单里。**

## 我以为重要

第 9 条那个限定值得单独记：作者主张回到第一性原理重新设计，但**实现上仍要复用既有代码**。这两件事在他这里不矛盾——重新思考是为了摆脱对实现复杂度的成见，不是要重写。只取前半句会读成「推倒重来」。

第 8 条是本批材料里对「合作方激励错位」最直接的陈述，而且是作者主动写的、带具体理由（激励不对齐 + 执行文化无法移植）。不过它同时是对外部组织的评价，不是可泛化的事实。

## 未覆盖

- 行 66 之后的站点导航未读（也不必读）
- 8VC 站点上的其他文章未读
- 未核对页面的作者署名区（行 35–36 显示 Joe Lonsdale / Investment Team）

## 重访触发

- 引用某条具体教训时
- 页面改版，或需要 8VC 官方背书时
- 与 01 号笔记的入职书单一并核对时

## 交接摘要

九条全文已读，约 1,600 词，正文在清理文本行 41–65。**确认了本仓库此前的一个真实错误**：第 5 条是用细小迹象看整体并留意指向不合心意结论的迹象（行 53–54），第 6 条是不要空谈打算想什么、当场想清楚（行 55–56）——2026-10-03 打样时交接包把这两条写反过，此处重新核对无误。行 56 出现一次 GTD 援引（「两分钟能做完就别拖」），是作者顺手类比，不是 GTD 的证据；结合 Qureshi 行 45 的入职书单可知这不是巧合。其余：第 3 条招聘看潜力而非既有技能；第 8 条对外部盟友的激励错位给了两条理由（激励不对齐、执行文化无法移植），作者判断；第 9 条主张回到第一性原理，但实现上仍要复用既有代码库。性质：个人回顾，非 Palantir 官方陈述。
