# 底稿

Jev 专章的中文底稿，快照日期 2026-10-23，由 Claude Opus 按 Kit 的 [Writing](../../dsh-praxis/kit/writing/README.md)（成文原理、证据与来源、机制讲解、论证与证据链）撰写。从 [00 · 结论与章节](00-overview.md) 开始读。

| 文件 | 内容 |
|---|---|
| [00-overview.md](00-overview.md) | 结论、改变判断的条件、章节与常见追问 |
| [01-jev.md](01-jev.md) | Jev：调用形状、训练、价格与速度的口径、版本、企业条款 |
| [02-ecosystem.md](02-ecosystem.md) | 五条实现路线、主要项目、自报成绩、延迟、托管价格、公开榜单 |
| [03-finetune-deploy.md](03-finetune-deploy.md) | 微调什么、训练数据、各实现的流程、校准、服务、外部成熟做法、风险条目 |
| [04-eval.md](04-eval.md) | 已发表的评测、四个发现、按决策单元的评测方向、阈值选择、benchmark 目录 |
| [05-enterprise.md](05-enterprise.md) | 公开用法、阈值做法、决策层与权威系统的分工、决策记录、到演示为止的实施顺序 |
| [appendix-a-enterprise-db.md](appendix-a-enterprise-db.md) | 数据平台的判断函数、数据离开数据库的位置、语义算子研究 |
| [appendix-b-sources.md](appendix-b-sources.md) | 读取方法、局限、未裁定的冲突、更正 |

## 体例

- 〔A-02〕是来源 ID，〔A-C-16〕是主张 ID，`至` 表示一段连续编号；都在 [research](../research/README.md) 的登记里。`python3 jev/research/tools/ledger.py` 检查每个引用的 ID 都存在。
- 引用“原 Chat”的地方，指 [inputs](../research/inputs/README.md) 里的对话记录；那是用户与 ChatGPT 的讨论，作为本专章的问题来源，不作事实依据。
- 每章末尾的“未核实”只列会影响判断的缺口。
- 5.5 的实施顺序是本专章的设计建议，其余各章是来源登记的投影。

## 重访触发

快照会随来源变化修订。出现下列情形时，回到对应章节重写：

- TypeSafe 提供私有部署或客户微调：结论第 2 点与第一章。
- 在真实企业知识库上、按决策单元报告误拒与误放的独立评测：结论第 5 点与第四章。
- 开放实现在中文判断任务上发布可复现的校准结果：第三章的路线比较。

## 与网页的关系

[网页](../site/index.html) 是底稿的改编：保留结论、五条判断、每章的主展项与数字；删去了 1.3、1.6、2.4、3.6–3.8、4.1 的大表、4.5 的逐项目录、5.2、附录 A 的研究表，读者回到底稿或来源登记查看。网页上的图由 `site/src/data.json` 绘制，数字与本底稿一致。
