# Palantir 阅读清单 · 初次提炼（2026-10-06）

状态：`distilled / partial / reference`。**已执行完毕。**

- 执行角色：**主会话，在 dsh 里串行执行**。不是 Luna 集群——`claude -p` 返回 `Not logged in`（`loggedIn: false`），本机无 codex CLI，`~/.codex/agents/luna-max-worker.toml` 无法调用。按 AGENTS.md「模型不可用时如实说明，不能伪称指定模型完成」，此处如实记录。
- 任务书见 [task-books/](task-books/README.md)，八份，写于执行之前。
- 七份笔记见 [notes/](notes/)。
- 原取得回执：[Palantir 阅读清单原件取得](../../../docs/verification/palantir-source-acquisition-20261006.md)
- 本页没有改 Kit、docs，也没有任何采纳。提炼仍是候选。

## 最重要的发现：这七份材料不是散书

`notes/01-qureshi.md` 行 45（原文清理文本行号）：

> "at the time when you joined they sent you a copy of Impro, The Looming Tower (9/11 book), Interviewing Users, and Getting Things Done. I also got an early PDF version of what became Ray Dalio's Principles. This set the tone."

**这五份是 Palantir 当年发给新人的入职书单。** 加上行 51 指出的 Lonsdale 那篇（「此前是对内文件，后来公开」），以及 Qureshi 这篇亲历回顾本身——**清单七个对象里，六个来自同一家公司同一套入职与文化材料；第七个是在讲这套材料。**

这改变了清单的性质：它不是一个「关于 Palantir 的书单」，而是一份**内部培训包的外部投影**。关联来自书单本身，不是我们后来拼出来的。

Qureshi 还给了各自用途（行 45–46）：Looming Tower 是创立背景（公司部分地为回应 9/11 而创立）；Interviewing Users 与 FDE 要跟客户建立信任有关；**Impro 是「it breaks down social behavior mechanistically」**——这是 Impro 在这批材料里唯一的定位线索，而 Impro 的正文我们一份都没有。

## 七份笔记与证据边界

| 笔记 | 对象 | 读到的 | 证据状态 |
|---|---|---|---|
| [01](notes/01-qureshi.md) | Qureshi | 全文七节，约 6,200 词 | `verified` |
| [02](notes/02-lonsdale.md) | Lonsdale | 全文九条，约 1,600 词 | `verified` |
| [03](notes/03-dalio.md) | Dalio | 106 页 PDF，**逐条读到的不足二十条** | `verified` |
| [04](notes/04-portigal.md) | Portigal | 第 1 章全文 + 六份作者工件 | `partial` |
| [05](notes/05-impro.md) | Impro | **仅出版方元数据** | `partial` |
| [06](notes/06-looming-tower.md) | Looming Tower | 授权节选 **2,470 词** | `partial` |
| [07](notes/07-gtd.md) | GTD | 官方节选 3,647 词 | `partial` |

**两处数字已在本次执行中更正**，取值回执里的旧值偏大：

- Looming Tower 的节选是 **2,470 词**，不是回执记的 3,448 词——旧值把出版方奖项与评价文案算进去了。作者正文只有清理后行 192 一整段，之后行 193 即是版权声明。
- Dalio 那 106 页虽在手，但 Part 3 的 210 条**基本未读**，只读了四个分部标题页与末页。

## 三条可迁移的东西

**一、现场与产品化的分工。** Qureshi 第 2 节：FDE 驻场每周 3–4 天，写快而脏的代码负责解决具体问题；PD 负责泛化并在别处售卖。他的原话是「Your job was to solve the problem, and not worry about overfitting; PD's job was to take whatever you'd built and generalize it」。产品化路径有具名证据：Magritte、Contour、Workshop → Foundry。

**二、数据整合的真正障碍常是组织政治。** Qureshi 第 3 节（行 41）：格式问题是明面的，真正挡路的常常是「某个团队的存在理由就是当这个数据源的守门人」。他把解法放在权限层（role-based access controls、row-level policies、security markings、audit trails）。

**三、记录与解读在格式上分开。** Portigal 六份工件里，两份复盘表每个栏位都带 `-- interpret` / `-- describe` / `-- report` / `-- assess` 后缀；Worksheet 1 有「受访者用的三个词 / 你找到佐证了吗」这种对照；Worksheet 2 有「什么让他们意外 / 什么让你意外」。**这是实物为证，不是转述。**

Dalio 那一份的可迁移句在第 03 号笔记里（p41 反馈回路、p106 拒绝 opt-out），但都只从我读到的那部分得出，未通读。

## 三处「不足以支撑」，如实记下

| 书 | 清单拟的维度 | 结论 |
|---|---|---|
| Impro | status / spontaneity / narrative skills | **这三个词与目录标题完全重合**，说明来自目录而非正文，目前是循环论证 |
| Looming Tower | 信息孤岛、激励错位、关系冲突 | **节选一个都支撑不了**——讲的是 Qutb 1948 年个人经历，无组织间信息阻断 |
| GTD | 五段工作流 / 四类边界 | **部分成立**：五段能在目录定位但正文未读；四类在节选中根本没出现 |

## 已核对的两条旧记录

- **Lonsdale 第 5、6 条**：确认 2026-10-03 打样时的改正无误——第 5 条是用细小迹象看整体并留意指向不合心意结论的迹象；第 6 条是不要空谈打算想什么、当场想清楚。（2026-10-03 交接包曾把这两条写反。）
- **Portigal 高层计划只有三项**：原文写「three (plus one special guest)」，参与者提问明说不算计划的一项。确认无误。

## 未做

- 四本书的完整正文仍缺，只能按购买、借阅或使用者提供合法副本补齐
- 10 个引用占位仍是 `missing-original`，**结构上无法恢复**
- Dalio 的 Part 3（210 条）基本未读
- 影子图书馆未接触
- 没有逐条走查原文中引用的外链（Ted Mabrey、Sarah Constantin 等）
- 没有 Kit 采纳

## 下一步

1. 补齐四本书正文后按来源重访（05、06、07 三份尤其需要）
2. 若要把这批做成对外可读的中文材料，走 Write / Prose：撰写前读 [成文原理](../../../kit/write/prose/grammar.md)，审阅前读 [审阅方法](../../../kit/write/prose/review.md)
3. 采纳与否归 `docs/decisions`，本页不产生任何规则
