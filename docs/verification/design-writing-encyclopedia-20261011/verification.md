# 检查与编订复核

## 基线与并发

2026-10-11，在未编辑基线上运行 `python3 scripts/validate_repository.py`：1,113 Markdown、250 JSON、850 snapshots、595 source records；两条既有断链导致 fail。两者都位于 `vault/distilled/knowledge-film-001-distill-20261005/README.md`，目标为未入库的 motion-ceiling 研究与卡片。保留原历史路径为缺件说明，未伪造文档或判定。

初始及交付前重新 fetch / ls-remote 的 `origin/main` 都是 `02ca9ea4b0faa6a9376523883c1f9f7afd5cf154`。原 work 工作树仍干净；没有并发 main 增量需要重放。授权远端分支在推送前不存在。所有编辑在独立工作树，只有协调者提交、推送 `cloud/design-writing-encyclopedia-20261011`；没有修改 CI、合并 main、强推、创建其他远端分支或发布站点。

## 实际检查

| 检查 | 结果与范围 |
|---|---|
| `python3 scripts/validate_repository.py` | pass：1,185 Markdown、256 JSON、856 snapshots、624 source records、344 generated source cards；零错误。含本地链接、README、JSON、快照 hash、生成卡投影和既有覆盖检查 |
| `python3 scripts/reference_index.py --check` | pass：29 来源 URL、13 grammar；来源/主张 ID、唯一 URL、registry alias、声明边与实际引用边、可选分面、摘录 hash、正文历史及生成投影无误 |
| `git diff --check` | pass：没有空白格式错误 |
| 反向链接回归探针 | 在内存副本删除 DWW-002 → multilingual 声明；check 确实报 undeclared source edge。磁盘内容不变 |
| 正文历史回归探针 | 在内存读取中给 microcopy 注入日期/使用记录；check 确实报 body contains chronology。磁盘内容不变 |
| 历史 registry 保留 | 与基线逐条比较全部 595 来源记录：解析 JSON 完全相同；仅新增 29 条。扩展字段由新 catalog 显式选择，不追标历史 |
| 历史快照保留 | 与基线逐条比较 850 条 manifest 记录完全相同；新增 6 份短摘录，hash 检查通过 |
| 分面筛选 | `task=error-recovery` 找到 DWW-004；`artifact=interactive-object` 找到 DWX-03/04、DWV-01/04；`artifact=interactive-control` 且 `stack_runtime=React` 找到 DWI-007。筛选仅覆盖已标注来源 |

registry、snapshot manifest 与本批交叉索引已由各自生成脚本重建。受影响脚本用 Python 编译检查；未安装新依赖。没有批量重建历史来源卡，既有 validator 已检查其生成投影。

## 独立任务与编辑复核

四名新代理分别从普通任务进入 Design、Writing、跨媒介和一个误导/旧状态案例，提示不含目标卡名。另有一名新代理复查修订后入口。真实路线、产出、原文和过读见 [消费记录](consumption.md)。它们证明相应任务可找到并使用资料；不证明所有读者都能找到、不证明 Kit 提高了效果，也不掩盖最后一次过读。

独立编辑/架构审阅没有参与研究或编辑。请求选择 `gpt-6-astra`，工具接受；没有底层模型遥测，因此不以代理自述认证实际引擎。审阅读了新语法、代表性来源卡、索引、治理与历史分层，并运行仓库和交叉索引检查，没有重新打开所有外部来源或运行界面。

| 审阅发现 | 修复与回看 |
|---|---|
| 书目总 README 只链 Cross，隐藏其余三流 | 补四流任务入口、coverage 和 index；审阅者回看通过 |
| 用“输出无法预先枚举”作为交互的必要条件 | 改为读者控制对象/时间/参数/步骤可能有用，有限选项亦可；回看通过 |
| 对象页称动画为“额外验证” | 改成表达/观察补充，明确演示不验证结构正确或理解；回看通过 |
| DWW-002 被 multilingual 引用却缺 catalog/card 反链 | 补边，并增加实际引用边检查与回归探针；回看通过 |
| Hairline 的 240px 可读性在本地证据链无支撑 | 删除精确成效数字，保留作者的紧凑图形目标；回看通过 |
| 模态背景“视觉和交互不可用”过强 | 分清背景不可交互与视觉区分，不暗示必须隐藏；回看通过 |

审阅者随后确认六项均解决，在其复查范围没有剩余 blocker；确认旧 registry 595 条未变。独立复核之后又完成记录定稿、根入口小修订和 Apple 兼容版本移入 CHANGELOG，后者均经协调者核对和静态检查，没有冒称再经一轮独立全文审阅。

## 公开范围与未验项

新材料仅公开原始 URL、可公开的简短摘录、原创总结及合成例子。没有复制私人项目、聊天导出、邮件、个人经历或客户材料；旧原件字节与既有注册不变。新增来源卡不要求访问私人仓库。没有完整转载网页/书籍、影片、版权未知图片，也没有执行外部 code/skill、安装未知软件或联系作者。

摘要可离线理解，但不是完整离线原件库或已运行组件库。具体限制保留在各卡：Anatomy 站点入口不可用；Apple HIG 部分读取、Microsoft 部分可见正文；Tversky 出版商页阻断且镜像版本一致性未知；NASA/Prompt Motion 影片未播放、Eyes 与交互库未运行；只看 Anatomy 静态图与 Hairline GIF 首帧。代码、字体、图像和依赖授权不能互相替代。

静态检查不检查所有外部死链、全部 Markdown 锚点语义、主张真伪、视觉渲染、中文断行、设备/辅助技术、技术正确性或读者效果。白模工业资料、非中英语种、复杂排印、触觉/音频、专门文体等仍是[覆盖地图](../../../vault/provenance/design-writing-encyclopedia/coverage.md)中的明确缺口。
