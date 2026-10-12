# Qureshi · Reflections on Palantir

- 取证身份：主会话（dsh 串行执行；claude 未登录、无 codex CLI，不是 Luna 集群）
- 存取日期：2026-10-06
- 证据状态：`verified`（全文在手）
- 来源路径：`vault/snapshots/local/palantir-20261006/qureshi-reflections-on-palantir.html.txt`
- 来源性质：作者个人回顾，2024-10-15，以个人身份写作，已离职，并声明 `long $PLTR`
- 经 Internet Archive 2024-12-31 存档取得，原站直连返回 429
- locator 体例：节名 + 清理后文本行号（清理办法见任务书 01）

## 七节各一节

### 1. Why I joined（行 10–19）

作者 2015 年夏入职，先后在伦敦、硅谷、DC，身份是 forward deployed engineer。当时公司约 1500 人，现在约 4000 人、总部丹佛。

入职理由给了两条：想做「难」的行业（医疗、航天、制造、网络安全）；以及人才密度。

> "I wanted to work in 'difficult' industries on real, meaningful problems."（行 13，`来源原话`）

> "I like to meet candidates with no data about them: no résumé, no preliminary discussions or job description, just the candidate and me in a room."（行 18，引号内是作者引述的 Alex Karp 2012 年访谈，`来源原话`但为转引）

**性质提示：** 行 19「The combo of intellectual grandiosity and intense competitiveness was a perfect fit for me」以及行 15「true believers; weird, fascinating people」是作者的评价，不是事实陈述。

### 2. Forward deployed（行 20–37）

**双轨结构。** 一类是 FDE（forward deployed engineers），在客户现场；一类是 PD（product development），很少见客户。

> "FDEs were typically expected to 'go onsite' to the customer's offices and work from there 3-4 days per week, which meant a ton of travel. This is, and was, highly unusual for a Silicon Valley company."（行 24，`来源原话`）

> "The PD engineers then 'productize' what the FDEs build, and – more generally – build software that provides leverage for the FDEs to do their work better and faster."（行 25，`来源原话`）

**产品化路径。** 行 26–27：FDE 在现场手工做完脏活，PD 把脏活自动化。具名产品：Magritte（数据接入）、Contour（点选式可视化）、Workshop（类 Retool 的建站工具）。作者说这些现在贡献公司 50%+ 营收，即 Foundry。

**数字（作者陈述，本仓库未另行核实）：** 行 27 提到 2016 年被称作「硅谷服务公司」不算离谱，2024 年则「deeply off the mark」，理由是建成了企业数据平台；他举 2023 年 80% 毛利，对比 Accenture 的 32%。行 27 另称 Foundry 驱动 50%+ 营收。

**两处转引：** Tyler Cowen 的「context is that which is scarce」（行 28）与 Steve Blank 的「getting out of the building」（行 28）。作者称前者是「the foundational insight of this model」。

**现场细节：** 行 29 他第一个客户是 Airbus，在图卢兹待了一年，每周四天在工厂；行 31 客户 CEO 说最大问题是 A350 产能爬坡，他们照此建软件，作者自比为「Asana, but for building planes」。行 32 有一句很关键的分工描述：

> "Your job was to solve the problem, and not worry about overfitting; PD's job was to take whatever you'd built and generalize it, with the goal of selling it elsewhere."（`来源原话`）

**两类工程师的代价：** 行 34 FDE 写快而脏的代码（技术债），PD 写干净可扩展的；作者说「generating deep, sustaining enterprise value requires both」。

行 36–37 把障碍归为「mostly political」，并举政府外包失败为例——这是**作者的评价**。

### 3. Secrets（行 38–42）

两个「秘密」。其一是数据整合（data integration），他给了三步定义（行 40）：拿到数据、清洗转换、放到人人可访问处。

**组织层面的障碍（本仓库最相关的一段，行 41）：**

> "often what really gets in the way is organizational politics: a team, or group, controls a key data source, the reason for their existence is that they are the gatekeepers to that data source, and they typically justify their exist[ence]..."（`来源原话`，原文在此处被截断）

其二是权限：行 42 说数据访问的争夺部分是真实的安全顾虑，可通过把安全控制建进平台的数据整合层来缓解——role-based access controls、row-level policies、security markings、audit trails。

### 4. Notes on culture（行 43–54）

**这一节是整批材料的关键（见下「我以为重要」）。** 行 45：

> "at the time when you joined they sent you a copy of Impro, The Looming Tower (9/11 book), Interviewing Users, and Getting Things Done. I also got an early PDF version of what became Ray Dalio's Principles. This set the tone."（`来源原话`）

行 45–46 给出他理解的各自用途：The Looming Tower 是因为公司部分地为回应 9/11 而创立；Interviewing Users 与 FDE 要跟客户建立信任有关；**Impro 是因为「it breaks down social behavior mechanistically」（行 46）**，而做 FDE 需要对社会语境有异常敏锐的感知。

行 44：批评被高度容忍——他举了一个入门级工程师与 Director 公开争论、全公司约千人抄送的邮件串。另称整体氛围「more of a messianic cult than a normal software company」（**作者评价**）。

行 49–51：引 Tyler Cowen《Talent》的观点——最有才华的人会发展自己的词汇；作者说公司也一样，并列出 ontology、impl、artist's colony、compounding、the 36 chambers、dots、metabolizing pain、gamma radiation 等内部词。

**行 51 是本批七份材料之间的第二处直接关联：**

> "This document, written by Joe Lonsdale, was previously an internal document but made public at some point and gives a flavor for the type of cultural principles."（`来源原话`，指向本清单的 `palantir-lonsdale`）

行 52–54：不给头衔（人人都是 FDE）。代价是行 54 说的「no clear strategy or direction, more like a Petri dish of smart people building little fiefdoms」，但作者认为「incredibly generative」。

### 5. Bat-signals（标题在行 55 句中；行 56–58）

作者的提法来自 Peter Thiel：招聘要有**差异化的人才来源**。他给的两个条件（行 56）：(a) 这批人特别想加入你而非别家；(b) 有办法规模化触达他们。

两个来源：一是亲国防/情报的人（行 57–58），二是「愿意 weird」的人（行 59）。行 58 称「Palantir was the only real 'beacon' for these types」。

### 6. Morality（标题在行 59 句中；行 60–69）

**立场声明（非论据）：** 行 60「a world more CCP-aligned or Russia-aligned seems like a bad one to me」；同行的自我披露「as I have - I spent a few childhood years in a repressive country」。

他的框架是把客户工作分四类（行 62–64）：道德中性（FedEx、CVS 一类）、明确为善（CDC 抗疫、NCMEC 反儿童色情）、**灰色地带**（医疗保险、移民执法、石油公司、军队、间谍机构、警察）、以及他未编号的第一类（ marginally good，如 Google 搜索）。

行 68 他对灰色地带的回答是逐案判断，并给出他理解的 Palantir 立场；行 69 举 ICE 一例：Trump 时期退出 ERO，继续与 HSI 合作。

**注意：** 行 61、66–68 全是作者的判断框架，不是 Palantir 的官方政策。

### 7. What next?（标题在行 77 句尾；行 78–80）

对 AI 周期的判断（行 78）：生产力增益将来自 AI 给大型企业和行业加杠杆，而 Palantir 花了十年与这些公司合作。行 79「So yes, I'm bullish.」行 80 说他下一步自己创业，且会有政府部分。

**利益披露：** 全文开头的 `long $PLTR` 声明 + 行 79 的看多表态 + 行 80 的自述创业方向，三处应放在一起看。这不构成贬低全文的理由，但引用他对公司前景的判断时必须带上。

**注释转引（只登记身份，未读）：** 行 89 Ted Mabrey（FDE 模式）、行 90 Sarah Constantin（数据整合）、行 92 Byrne Hobart（cult 与薪资）、行 95 Paul Christiano。行 91 是作者对「data mining」一说的新闻误解的澄清；行 93 说同事多数是「normie centrists」——**这是作者评价**。

## 我以为重要

**这份解答了「为什么这七份材料在同一个清单里」。** 行 45 说明它们不是散书，而是 Palantir 当年发给新人的入职书单：Impro、The Looming Tower、Interviewing Users、Getting Things Done，加上一份后来成为 Dalio《Principles》的早期 PDF。行 51 又把 Lonsdale 那篇指为「曾是对内文件，后来公开」。

也就是说：**本清单的七个对象里，有五个是同一家公司同一份入职包的内容；Lonsdale 那篇是同一家公司的对内文化文件；Qureshi 这篇是亲历者对这套书的说明。** 这七份材料的关联来自这份书单本身，不是我们后来拼出来的。

逐份的用途，行 45–46 也给了他的理解：Looming Tower 是创立背景，Interviewing Users 是 FDE 跟客户建立信任的方法，**Impro 是「把社会行为拆成机制」**——这一句是 Impro 在这批材料里唯一的定位线索，而 Impro 的正文我们一份都没有。

## 未覆盖

- 第 2、3 节的注释 [2][3] 指向的两篇外部文章未读
- 第 7 节的注释 [1] 引了 OpenAI 与 Altman 的长段引文（行 83–88），只扫过，未逐句核对
- 原文中的链接（多为新闻报道与 Substack）未点开

## 重访触发

- 提炼 FDE 模式或数据整合时
- 需要引用文中数字时（营收占比、毛利、头衔与人数）——这些是作者陈述，若要作为事实引用须另行核实
- Impro 取得正文后，回来对照行 46 的定位
- 原站直连恢复时，核对当前版本与 2024-12-31 存档的差异

## 交接摘要

七节全文已读。**最重要的发现：这七份材料不是散书**——行 45 说明 Impro、The Looming Tower、Interviewing Users、Getting Things Done 加 Dalio 早期 PDF，是 Palantir 当年发给新人的入职书单；行 51 把 Lonsdale 那篇指为曾是对内文件。因此清单的关联来自这份书单本身。其余要点：FDE/PD 双轨（FDE 驻场每周 3–4 天、写快而脏的代码负责解决问题，PD 负责泛化），产品化路径 Magritte/Contour/Workshop→Foundry；数据整合的真正障碍常是组织政治（行 41，某个团队的存在理由就是当数据守门人）；不给头衔换来「generative」但失去方向感。Impro 在这批材料里唯一的定位是行 46「把社会行为拆成机制」。数字（50%+ 营收、80% 毛利）是作者陈述，未另行核实。利益披露：`long $PLTR` 加行 79 看多，引用前景判断时必须带上。
