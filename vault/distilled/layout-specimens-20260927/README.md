# 原子化编排样张探索 · 2026-09-27

状态：已完成，`consumption_status: ready-for-reference/adaptation`。可直接查阅、取样、改编为项目样板或消费失败对照，无需等待main再次批准。全部内容为synthetic；逐项unreviewed及局部review描述审阅覆盖，不妨碍参考消费，也不代表canonical、生产组件或Kit规范。

本目录用一组共同的 synthetic 情境，按读者要完成的判断划分编排原子，在同一内容上比较结构、空间、阅读路径与表现强度，再用 pattern 与完整页面检验组合。执行者为 Opus 5.5 主会话与十一个并行 Opus 5.5 子代理；Luna 在该会话不可用。

## 从哪里进入

| 需要 | 打开 |
|---|---|
| 看样张、按语义职责找原子、看覆盖矩阵 | [index.html](index.html)（本地直接打开，无需服务器） |
| 制作方覆盖、组合问题与交接 | [handoff.md](handoff.md) |
| Main后续筛选与复验顺序 | [review.md](review.md)（局部截图观察，不是全库通过） |
| 机器索引 / 可读清单 | [specimens.json](specimens.json) / [catalog.md](catalog.md) |
| 实际检查了什么 | [checks](checks/README.md) |
| 原工单 | [brief.md](brief.md) |

目录：[atoms](atoms/README.md)（45 个原子，244 个样张）、[patterns](patterns/README.md)（8 个 pattern）、[compositions](compositions/README.md)（5 个整页）、[shared](shared/README.md)（fixture、制作约定、共用样式与脚本）、[tools](tools/README.md)（索引生成与检查）。

## 离线与依赖

页面只用本地 HTML、CSS、SVG 与少量 JS，不加载远端资源；无 JS 时所有样张完整可读，JS 只提供观察控件和少数渐进增强。字体使用系统字体栈（PingFang SC、Songti SC 等），缺少时退化为系统无衬线或衬线，断行会变化。检查脚本依赖本机 Google Chrome 与 Node 内置模块，不安装依赖。

## 边界

写入范围仅限本目录。`specimens.json` 是本次实验的索引，不是全仓 grammar registry；样张中的数字与引文不能移入真实材料。参考和改编由当前任务自行选择；优先层、泛化与Kit晋升另按仓库流程处理。

仓库校验（2026-09-27）：`python3 scripts/validate_repository.py` 报告的失败来自本目录之外既有的 `vault/distilled/ai-capability-assessment/rendered/` 断链（answer.html、answer.pdf 已在工作区删除），本目录没有新增错误。

2026-09-29维护：统一生成索引的制作方人数，收掉已修正日期的旧问题，新增消费状态；成本分母与第26周归属缺口仍保留，不全局改写synthetic数字。后续消费与本轮检查见 [收尾回执](../../../docs/verification/visual-grammar-20260928.md)。
