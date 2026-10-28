# 视觉观察账本（图像 ZIP 独立交付）

采集日期：2026-10-28 UTC  
采集主体：独立云端浏览器 worker；未使用用户 Mac  
附件状态：`library_saved_materialization_failed_in_research_executor`

## 证据边界

- `public_page_screenshot`：本次实际打开的公开页面像素。只有 Clio 价格页 AI 页签、Relativity 文档展开和官方视频播放器发生无账号交互。
- `official_documentation_embedded_product_image`：官方教程中明确链接的产品图片；不是登录产品测试，界面与示例数据可能较旧。
- `official_video_frame`：本次播放/快进/暂停的官方产品演示帧；不是执行真实法律工作。
- `official_marketing_product_illustration`：官方产品页/博客中的静态合成产品图；不是完整真实窗口，也未运行插件或 Agent。
- 无注册、登录、销售表单提交、付费、私人材料上传或权限绕过。
- 用户已明确批准截图交付。图像 ZIP version 1 已保存为 Library 文件 `libfile_a88ad92f6b5c81918600d90b21bc2ac0`；上游报告 SHA-256 `6d343bf83a676f0ad03501085b7ecdbeb9a196f3153d29d5bf40491ef3d74284`，含 42 份原始证据。当前研究执行环境没有材料化或本地复核 version 1 字节，也没有把图像复制进文本包。以下编号与独立图像 ZIP 对应；34–36、44–45 是采集过程排除项，不属于交付证据。

## 逐项观察

| 编号 | 类型 | 产品/页面 | URL | 页面/状态与可支持的观察 | 限制 |
|---|---|---|---|---|---|
| 01 | public_page_screenshot | Spellbook overview 帮助页 | https://help.spellbook.legal/en/articles/9926203-spellbook-overview | 深色帮助中心；左分层导航、主文章、右页内目录 | 文档页面，不是产品 |
| 02 | official_documentation_embedded_product_image | Spellbook rules list | 同 01 | 41 Rules / 3 Questions 页签；All 41、排序/搜索、状态圆环、逐条展开 | 文件名 `rule-detail` 不准确，以本账本为准 |
| 03 | official_documentation_embedded_product_image | Spellbook review scope | 同 01 | Standard Review / Redline Review 单选；Cancel / Start | 只支持运行前范围选择 |
| 04 | official_documentation_embedded_product_image | Spellbook passed rule | 同 01 | 绿色通过、解释、来源编号、Show Rule、反馈/刷新 | 不证明判断正确 |
| 05 | official_documentation_embedded_product_image | Spellbook failed rule | 同 01 | 橙色未通过、解释、来源气泡、Show Rule、Add Language | 不证明判断正确 |
| 06 | official_documentation_embedded_product_image | Spellbook candidate action | 同 01 | 建议文本及 Show / Dismiss / Apply；Apply 为主 CTA | Apply 是采用候选文本，不是接受风险 |
| 07 | official_documentation_embedded_product_image | Spellbook revision tools | 同 01 | Copy、regenerate、edit；Dismiss / Apply | 未操作撤销/版本链 |
| 08 | official_documentation_embedded_product_image | Spellbook Library | 同 01 | 文档数、New Folder、Awaiting Upload / 0 Documents、共享/锁图标 | 未测试上传或权限 |
| 09 | official_documentation_embedded_product_image | Spellbook citation popover | 同 01 | 来源编号弹出标题与 Show in document | 未验证 anchor 稳定性 |
| 10 | public_page_screenshot | Ironclad 帮助页 | https://support.ironcladapp.com/hc/en-us/articles/12275585451159-Use-Playbooks-in-Workflows-and-Contract-Reviews | 左功能导航、正文、右 ON THIS PAGE | 文档页面，不是应用 |
| 11 | official_documentation_embedded_product_image | Ironclad workflow overview | 同 10 | 左流程/审阅活动、中 Review、右 Documents / Properties / Clauses | 图较小，细节不扩推 |
| 12 | official_documentation_embedded_product_image | Ironclad Playbook review | 同 10 | 左合同正文、右 Clause List；Needs review / Detected clauses；Approve / Redline | 官方教程图，不是实测 |
| 13 | official_documentation_embedded_product_image | Ironclad redline alternatives | 同 10 | `1 of 5 drafts`、红线文本、Approve + insert、分主题解释 | 未验证生成质量 |
| 14 | official_documentation_embedded_product_image | Ironclad exception | 同 10 | 选择 approver、填写理由、Cancel / Save；空表单 Save 灰态 | 例外请求不同于规则批准 |
| 15 | public_page_screenshot | Vincent 支持页 | https://support.vlex.com/vincent-by-vlex/vincent/core-workflows/ask-a-research-question | 浏览器呈现原始 Markdown | 不把异常当正式网站 UX |
| 16 | public_page_screenshot | DISCO review stages 帮助页 | https://support.csdisco.com/hc/en-us/articles/205833693-Using-review-stages | 标题、长目录、右侧相关文章 | 文档页面，不是产品 |
| 17 | official_documentation_embedded_product_image | DISCO Decision Pane Editor | 同 16 | 左组件卡、右真实样式预览；Save / Close | 支持配置者/执行者分面 |
| 18 | official_documentation_embedded_product_image | DISCO batches | 同 16 | 完成比例、表格、Reviewed、Check-in | 示例数据非当前业务数据 |
| 19 | official_documentation_embedded_product_image | DISCO review viewer | 同 16 | 左决策编码、中 PDF、右 hits/related/metadata；Mark Reviewed & Next | 未验证键盘/权限/并发 |
| 20 | official_documentation_embedded_product_image | DISCO metrics | 同 16 | Reviewers/Groups/Batches/Metrics；Pace、burndown、ETA | 历史示例日期 |
| 21 | public_page_screenshot | Relativity review template 文档 | https://help.relativity.com/RelativityaiR/Content/Getting_Started/Review_Template/RelativityOne_Review_workspace_template.htm | 旧 URL 转至 RelativityaiR；页面显示 2026-09-17 更新；展开文档下拉 | 文档交互，不是产品 |
| 22 | official_documentation_embedded_product_image | Relativity 空工作区 | 同 21 | Browsers 树、过滤/搜索、文档表、Auto Run、保存搜索、Total 0 | 图内仍为 RelativityOne 品牌 |
| 23 | official_documentation_embedded_product_image | Relativity Review Queues 图标 | 同 21 | 仅导航图标 | 低价值；不能推断队列 UI |
| 24 | official_documentation_embedded_product_image | Relativity Review Center 图标 | 同 21 | 仅导航图标 | 低价值；不能推断 dashboard |
| 25 | official_documentation_embedded_product_image | Vincent Legal Authorities | 同 15 | 来源类型/计数、Modify List、标题/出处/摘要/引用摘录/复制 | 媒体 URL 图，不是网页设计或实测 |
| 26 | official_documentation_embedded_product_image | Vincent workflow home | 同 15 | 图标侧栏、输入区、法域、Add Documents、任务卡/标签 | 媒体 URL 图，不是实测 |
| 27 | public_page_screenshot | Clio pricing hero | https://www.clio.com/pricing/ | 黑底 hero、白导航；cookie 条遮挡底部 | 套餐名来自 DOM 核验，不是本图完整呈现 |
| 28 | public_page_screenshot | Clio AI comparison | 同 27 | 实际点击 `Do more with AI`；Starter/Core/Signature/Elite 矩阵 | 公开官网交互，不是 Clio 产品试用 |
| 29 | public_page_screenshot | Juro pricing | https://juro.com/pricing | 右侧合同量问卷；cookie/聊天层遮挡 | 未填/未提交/未联系销售 |
| 30 | public_page_screenshot | Thomson Reuters training | https://training.thomsonreuters.com/media/How+to+verify+authority+in+a+draft+brief/1_t5faxrhc/384481072 | 官方培训页封面与 Related Media | 播放前页面 |
| 31 | official_video_frame | CoCounsel 00:22 / 02:29 | 同 30 | Word 文档与右侧任务选项 | 顶部裁切；低价值辅助证据 |
| 32 | official_video_frame | CoCounsel 01:02 / 02:29 | 同 30 | 左 Word 草稿、右进度说明/研究工作流、Ask anything、Approve first | 不等于真实可审计工具日志 |
| 33 | official_video_frame | CoCounsel 01:52 / 02:29 | 同 30 | 右侧按问题组织的法律分析与蓝色权威链接；左草稿 | 未实际执行核验或修改 |

## 补充视觉观察：Harvey、Legora、Lawhive

| 编号 | 类型 | 产品/页面 | URL | 页面/状态与可支持的观察 | 限制 |
|---|---|---|---|---|---|
| 37 | official_marketing_product_illustration | Legora Drafting | https://legora.com/product/word-add-in | Word 红线旁 `Edit suggestions`，3 available、逐条编号、Dismiss、Apply 下拉 | 合成展示；未运行插件 |
| 38 | official_marketing_product_illustration | Legora Playbooks | 同 37 | Mutual NDA 规则卡、Reasoning / Suggestion、Not acceptable、红黄绿状态、Apply 24 suggestions | 不证明真实批量效果 |
| 39 | official_marketing_product_illustration | Legora Fill template | 同 37 | 文件拖放区与 PDF 示意 | 只支持输入模式概念，不支持格式/容量/准确率主张 |
| 40 | official_marketing_product_illustration | Harvey agent setup | https://www.harvey.ai/blog/contract-review-agents-in-harvey | MSA review agent Draft；Run/Edit schedule；Activity/Instructions；Files、Sources、Connectors | 官方博客产品演示图；未运行 Agent |
| 41 | official_marketing_product_illustration | Harvey benchmark review | 同 40 | 合同红线、建议卡、Sources；Modify / Accept / Reject；先例分布与 Playbook position | 人类决定与先例邻接，不证明判断正确 |
| 42 | official_marketing_product_illustration | Harvey Contract Intelligence | 同 40 | Overview/Agents/Insights/Assignments；标准坚持、争议、回合等 KPI；更新 agent 标准建议 | 583/72%/2.7 为示例数字，不是业绩 |
| 43 | public_page_screenshot | Lawhive UK 首页初访 | https://lawhive.co.uk/ | 英国官网 hero 与报价入口；US 地理分流弹窗和 cookie 遮挡 | US 页面展示已排除；不可把 US 承诺套到 UK |
| 46 | public_page_screenshot | Lawhive UK intake 首步 | https://lawhive.co.uk/onboarding/journey?r=true&posthogDistinctId=undefined | `Tell us about your case`、三段进度、自由文本、日期/截止/目标提示、Continue | 未输入或提交；匿名 journey 不是账号或咨询 |
| 47 | public_page_screenshot | Lawhive UK 服务模式段 | https://lawhive.co.uk/ | `Clear pricing`；fixed fee 或 billed by hour；回访入口显示 quote Step 1 / Continue | cookie 遮挡；未提供案件信息或测试报价 |

## 可迁移结论（分析，不是厂商承诺）

1. Playbook 结果应分 Rules / Questions、状态、理由、证据和局部动作；运行前先明确范围。
2. 合同风险卡应经候选红线与理由进入人工采用；偏离标准时走有 approver 与理由的例外分支。
3. 大规模审阅应将决策表单配置、执行者 viewer、batch 进度/提交和质控指标拆成一等对象。
4. 法律研究应让任务入口、法域/附件、来源集合和摘录可见；来源修改触发重算来自文档文字，不是本次交互验证。
5. 官网套餐/能力矩阵是采购入口证据，不是合同报价或应用权限的完整证明。

复查日期：2027-01-28；如果套餐、帮助域或产品品牌重构，提前复查。
