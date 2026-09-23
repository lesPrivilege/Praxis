# 五页答卷与可视化参考召回

日期：2026-09-23。Luna Max负责Courtwork Pages与career HTML的两路定向召回，Astra编订五页、纲要卡与Claude单工单。当前仓库路径为 `/Users/lesprivilege/Projects/Praxis`；历史原始定位保持当时路径，当前工单使用现路径。

## 本轮裁决

- 五个答题阅读页，每题一页，共用五张纲要导航卡；卡片只保留判断和机制，不增加封面或额外答题页。
- 每页自然滚动；打印按题起页并允许续页，检查打印全部五题，不限定为五张纸。
- 常见SaaS设计语言，仅浅色冷色系。冰白、白色、雾蓝灰组织内容，冰青与钴蓝强调导航与关键展项；早期苔黑/酸柠檬候选撤回。
- Q4保留唯一数据交互，Q3/Q5为静态图表，Q1/Q2按需要采用紧凑静态展项。精确数值与状态由代码表达。
- 必要概念配图由Codex调用Image 2.5绘制和验收，再交本地素材给Claude；当前未指定或生成位图，尚无实际模型调用记录。
- 正文继续自然语言，来源、版本、核查状态、参考快照和保护说明留index。

## 交付

[五页结构与卡片](../../vault/distilled/ai-capability-assessment/five-page-outline.md)、[唯一Claude工单](../../vault/distilled/ai-capability-assessment/claude-paste-order.md)、[CW Pages参考](../../vault/distilled/ai-capability-assessment/cw-pages-reference-index.md)、[career HTML参考](../../vault/distilled/ai-capability-assessment/career-html-reference-index.md)。

## 验证与覆盖

本轮只修改研究、索引和工单，来源仓库只读；已有rendered页面不作为本轮完成的实现。源码结构、数据契约、依赖、编译产物与真实渲染分别登记，静态代码检查不等同于浏览器/打印验收。未核实来源、未保存依赖和未覆盖文件以两份召回index及intake为准。

最终 `python3 scripts/validate_repository.py` 通过：438份Markdown、58份JSON、591份快照、89条已提炼消息、250条来源记录、185个引用映射，errors=[]；`git diff --check`通过。没有执行来源构建脚本、安装依赖、调用图像模型、发布或外发。

## 来源裁取与工作树

career选6份通用/合成HTML；CW索引8组实现，选4份小型SVG/编排源码作快照。CW当前HEAD、固定产品证据提交与旧dist身份分开，未把历史回执当本答卷验收；CW未发现现成打印CSS，打印参考career。精确定位、未快照依赖及未核实渲染在两份index。

保留既有rendered代码和HTML，仅为其补目录README满足仓库导航要求，没有运行生成器或修改页面。原有未提交变更未回退。

## 通用资料目收敛

[前端设计素材与消费记录](../../vault/distilled/frontend-design/README.md)独立于答卷维护。25份选中原件完成路径、SHA-256、大小及原字节对比；24份新存，1份复用既有图式样张。CW消费记录7份、SE消费记录8份；11个外部URL独立登记为partial，未重取当前正文或保存网页依赖。未复核来源、源站排队参考、未快照依赖均在通用index及catalog明确列出。

集成时核对并修正一处diagram.svg原路径，快照字节未变。素材与任务之间保留导航，原AI测试目录的两份索引改为跳转，避免两处维护。
