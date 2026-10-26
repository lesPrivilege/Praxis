# Foundations 交接

## 交付入口

[README](../../../../projects/books/saas-engineering/foundations/README.md)是渐进学习入口，12 章为连续中文教材，按“识题→解法→演算→验算→变式”展开。第 1 章建立对象与动作，第 2–8 章解释算法选择，第 9–11 章连接界面、服务、存储、异步任务、恢复和验证，第 12 章提供 33 案例地图与跨行业练习。

正文已完成事实范围、术语和算例核验。编纂可直接使用正文及 [examples.json](examples.json)中的 18 组小输入；[curriculum.json](curriculum.json)记录章节、既有 ALG 标识、案例、来源和样例的关系。[terms.md](../../../../projects/books/saas-engineering/foundations/terms.md)保留原文术语及容易混淆的区别，[evidence.json](evidence.json)保留 40 个一手来源的原文标题、定位和主张范围。

## 来源与变更边界

| 项目 | 精确值 |
|---|---|
| 仓库 | public `lesPrivilege/Praxis` |
| 独立交付分支 | `cloud/saas-atlas-foundations-recovery-20261014` |
| 起点 | `ae1827f34c6df067348d2454d7e5c9331ceda25d` |
| 接收完整教材原稿 | `cloud/saas-atlas-foundations-20261014`，`cd5bd9b37ceae71f6c42e39d8cce533a31b7f046` |
| 恢复任务早期远端检查点 | `74f8cc89542e0d23b43f41537abc78abf9e59b02` |
| 本分支写入范围 | `vault/distilled/saas-engineering-atlas/foundations/` |

完整原稿被接收并修订，早期三章版本已从当前目录移除，保留在检查点历史中。六个案例分支只读取 Git 对象及 handoff；其案例正文、公共 identifiers/source catalog/registry、网页与部署配置均未改动。新增来源和检查身份属于 foundations 本地侧车；公共目录若需收录，可按 canonical URL 和既有 case/ALG ID 对应。

## 已完成的核验

[verification.json](verification.json)记录命令、实际输出、教材输入哈希和覆盖范围。[check_examples.py](check_examples.py)重算 18 个样例，包括碰撞后的完整键比较、二分与 trie、B-tree 查找/范围、Top-K、双指针、窗口/前缀和、图遍历、最短路、并查集、拓扑排程、背包与搜索、缓存、概率结构更新、近邻召回率和评估分母。小规模独立对照覆盖 18,462 组输入/场景，另以 18 个损坏的期望值检验检查器能否拒绝错误答案。

退款检查是内存 SQLite 中的事务与独立外部效果模型，覆盖本地回滚、重复身份、参数冲突、旧版本写入、外部接受后响应丢失和按同一身份核对。它没有实际启动 PostgreSQL、队列、浏览器或第三方服务，也没有运行压测或模型推理；这些方法在第 10 章作为教材实验设计讲解，未包装成产品实测。四寄存器 HLL 示例检查更新机制，ANN 示例检查候选和 recall 计算，二者未声称复现完整生产索引。

## 编纂交接

后续作者可以重写解释、合并或拆分章节、选择图例与交互。当图形足以承担推理时，可以缩减对应正文；章节标题与样例身份提供定位，不是版式或运动脚本。输入、比较规则、状态边界和误差分母构成内容依据，正文、图注和交互反馈可据此保持一致。

当前没有影响编纂的未决事实问题。核验日志与来源读取过程留在侧车文件；不需要把它们搬进教材正文。独立分支未合并 main，未发起 CI、部署或页面发布。
