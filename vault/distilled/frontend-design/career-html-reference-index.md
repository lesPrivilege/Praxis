# Career-kit HTML 展示参考索引

本索引是对 `/Users/lesprivilege/Projects/career-kit` 的一次有界只读召回。它登记可跨任务复用的实际展示结构，以五页AI能力测试为当前消费例，消费对象是页面骨架、CSS/JS 交互、打印规则和图式语法。样张文案、业务数字、内部项目名和合成案例事实不进入答题正文。

原字节副本、来源 mtime、大小和 SHA-256 见 [snapshot README](../../snapshots/local/downloads/career-html-recall-20260923/README.md)；机器登记见 [intake](../../intake/career-html-recall-20260923.json)。源仓库保持只读。本批没有读取简历、投递包、项目展开-内部机密、客户材料或个人数据。

## 召回实例

| 实例 | 用途 | 实际结构与定位 | 可借元素 | 边界 |
|---|---|---|---|---|
| `LNG CLM demo.html` | 长文/八幕合成展示 | 标题与 bundled scene/deck；`scene-1..8`、`chart-wrap`、`timeline`、`decision`、`drawer/modal`；inline style 的打印规则在源约第 155 行 | 一页一个判断、一个主展项、键盘 deck 导航、证据/决定抽屉、浅蓝灰和受控 amber、打印分页 | 这是源仓库标注的合成 LNG 案例；只借结构，不复制合同、ID、日期、金额或案例叙事 |
| `八页层级复核.html` | 分页/纲要复核 | 单文件 8 个 `article`；标题模式切换 `#toggle`；4→2→1 列响应式；inline SVG；`@media print` 保留卡片 | 先串读五张卡标题，再检查主展项权重；允许 title-only review 与打印安全卡片 | 合成 LNG 标题和灰盒文字不带入答题 |
| `图式样张.html` | 图表/图式/打印 | `data-index=0..8` 九种主展项；`data-level=L0..L4` 层级；平台、分层、系统、泳道、矩阵、数量图、时间轴、证据摘录、经营复核；打印 CSS 约 36–42、60 行 | 五张纲要卡可共享 L0–L4 信息层；Diagram/Chart/Table/Card 分工；图表保留单位、分母、来源与版本 | 占位长度、面积和比例不是真实数据；不复制样张业务标签 |
| `Frontier-Agent与下游产品-宣讲面板.html` | 长文/章节面板 | `nav`/`main` 约 677–693 行；11 个 `data-title` 章节；打印章分页约 645–650；键盘与 IntersectionObserver 约 942+ | 章节 rail、一个断言一章、上下键/上一页下一页、窄屏折叠、打印仍按章节阅读 | 只借 rail、章节和响应式结构；不复制技术论证、项目词或外部链接结论 |
| `Schema-Engineering-宣讲面板.html` | 卡片纲要/证据纪律 | 14 个 `data-title` 章节，约 520 行起；proposal/commitment 双卡、state projection、falsifier、acceptance；打印约 476–481、键盘脚本约 748+ | 适合把每题拆成“判断→证据→限制→验收”，保留证伪条件与最终验收章节 | 不把 Schema/Matter 或私有项目映射写进公开答题页 |
| `rule-console/index.html` | 控制面/规则状态参考 | `nav`/`main`，10 张表与 `select` 控件；Rule/RuleVersion、ChangeRequest、Exception、GuardrailMetric、Case、DecisionRecord、AuditEvent 标题；inline JS 约 205+ | Q5 可借规则、版本、变更请求、判定记录和审计事件的分层；适合静态反事实矩阵和详情展开 | 不复制演示规则名、ID、状态或暗示生产能力；未发现打印 CSS |

## 对五页答题的映射

五页可以共用五张纲要导航卡，卡片只负责定位和状态，正文仍按题目判断展开：

- Q1 借 `LNG` deck 的“一个主展项 + 证据抽屉”结构，把上下文供给、工具成本和回放放在同一页的不同层级。
- Q2 借 Frontier/Schema 的章节 rail 与控制台的状态/成本字段，把节点路由、等待、单位经济性和信任事实分成可跳转卡片。
- Q3 借图式样张的泳道、时间轴和证据层级，把授权、执行、UNKNOWN、核验和恢复画成动作关系。
- Q4 借图式样张的传统数量图/时间轴口径位和 Schema 的 falsifier/acceptance 章节，展示概率分布、动作阈值、版本和降级。
- Q5 借 rule-console 的 Rule/RuleVersion/ChangeRequest/DecisionRecord/AuditEvent 分层，静态呈现 D1/D2、客户/法域范围、非 active 状态和回滚。

## 共同消费规则

页面统一使用浅色冷色系。精确图表由代码生成，保留单位、分母、来源、版本和更新时间；位图只在确有必要时另行准备。本批没有调用图像生成，也没有把 HTML 样张当作可运行产品或离线完整站点。

展示层级可沿用 `L0 画布 → L1 结论 → L2 主展项 → L3 解释/控制 → L4 来源/版本/时间/单位`。图表负责数量，Diagram 负责结构，Table 负责查数，Card 负责独立工作对象。容器、阴影和颜色是阅读提示，不是批准、实测或权限证明。

样张自身已经把打印视为一条阅读路径：LNG deck 和技术面板使用 `@media print`/`break-after`，图式样张保留打印分页；rule-console 没有打印规则，本次只借控制面信息架构。五页答题应保持静态打印可读，即使关闭交互也能看到结论、关键反例和证据状态。

## 不消费范围与证据边界

源仓库还有简历、投递、归档和内部机密 HTML；它们不在本批候选范围。选中的 Frontier/Schema 页面虽属于通用技术扫盲，但本索引只提取结构，不搬运其中的项目映射或内部叙事。LNG 页面由源 README 与 presentation AGENTS 标为合成案例，仍只作为结构样张消费。

本批没有浏览器逐页 QA、打印输出验证、移动端验证或完整外部依赖镜像；Frontier 页面有一个外部 `ui-skills.com` 链接，未快照。后续 Claude 工单应以本索引和快照为输入，沿浅色冷色系、五页/五卡和代码图表约束实现；本批不实现页面、不修改源 repo。

## 去重

图式样张复用既有[原件](../../snapshots/local/career-kit/10-Vault/地基/企业汇报图式库/图式样张.html)，本目录实际新存5份HTML，6个实例仍逐项登记。当前答卷只采用标题与一句判断的纲要卡，来源、版本、核查与保护说明留index；原样张的amber不采用。
