# 编订与验证记录

## 2026-10-14 · 第一检查点

从 ae1827f34c6df067348d2454d7e5c9331ceda25d 建立 cloud/saas-atlas-foundations-recovery-20261014。环境启动后本地仓库与公共 GitHub 读写权限核验成功。只在 foundations 内写入。

完成 0–2 课与渐进入口，记录 9 个已读范围的一手来源。原始 Princeton 教材页面和两条猜测的 ODS Python 路径未取得正文；改读独立登记的官方源码与确切 ODS C++ 章节，没有把失败路径记为已核实。原文未快照。

已读取仓库 AGENTS、Kit 维护/写作/证据/验收规则与 atlas architecture、learning-path、identifiers、33-case index、H01 正文/JSON。六个完成案例分支只获取对象与阅读 handoff，未检出、合并或修改；迁移例仍作为合成教学，不继承未读厂商主张。

第一检查点仅覆盖前三课；后续课、合成检查与最终仓库验收继续在本分支完成。

第一检查点实际运行 `python3 scripts/validate_repository.py`：pass，1740 Markdown、408 JSON，errors=[]；`git diff --check` 通过。收到完整草稿已存在的新信息后，后续改为消费原 worker 草稿并整合，不继续并行重写主线。

## 完整草稿接收

接收原作者独立分支 `cloud/saas-atlas-foundations-20261014` 的精确提交 `cd5bd9b37ceae71f6c42e39d8cce533a31b7f046`：12 章、18 个 examples。只读取 Git 对象并复制 foundations 正文与 examples；未合并其它路径。恢复版前三课被连续全稿取代，内容仍可在检查点 `74f8cc89542e0d23b43f41537abc78abf9e59b02` 回查。原稿侧车与检查未完成，以下继续补齐，不把原作者声明当作本轮验证。
## 完成稿修订与验收

在完整原稿上逐章修订，没有另建第二套教材。保留完整推理与合成小输入，补齐 12 章渐进导航、原文术语索引、章节/案例/算法/样例映射以及 40 个一手来源的原文标题、定位和主张范围。来源为官方文档、作者教材、课程讲义或论文；HNSW 与 HELM 仅使用已读摘要的有限主张，不升级为论文复现或厂商实现事实。

修订实质包括：静态拓扑算法的环判据与异步任务尚在运行分开；补出 Bloom 误报近似的两层假设；用 AWS outbox、k6 开闭负载模型和 OpenAI evaluation guidance 支持相应方法；明确缩写、分母和近义概念。正文删除来源审核过程和防御性流程说明，保留影响方法选择的适用条件。调用及阅读仓库 writing kit / grammar / review / evidence 指南完成编订，不规定后续可视化版式、图形或动效。

新增标准库检查程序，重算 18 个结构化例子，补入 B-tree 查找与范围输入；对前缀和、Top-K、双指针、背包、图、区间调度和拓扑边界运行独立小规模对照。实际通过 18,462 组输入/场景，并拒绝 18 个故意损坏的期望值。SQLite 检查范围为内存事务与外部效果模型；真实服务集成、进程重启、端到端、压测和 AI 推理未执行。具体输出见 verification.json。

一手来源通过 web 文本读取核对。尝试本地下载部分课程 PDF 时网络隧道返回 403；PDF screenshot 接口也不可用，已用可读的原站 PDF 文本核对所引章节与公式，未把下载或截图记为成功，也未留下未核实主张。初期来源列表随三章草稿被完整来源表替换，原记录可从早期检查点追溯；同一 URL 的 bisect、PostgreSQL index 和 heapq 身份沿用。

仓库结构与 atlas 的实际验收输出、文件摘要和路径检查保存在 verification.json。仅运行本地验证；没有触发工作流、CI、部署或合并 main。
