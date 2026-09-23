# 设计参考索引

每行一条参考。状态沿用[状态词表](../../docs/governance/status-vocabulary.md)的采纳维度：accepted、candidate、deferred、rejected、reference、superseded。“证据”一列写原件或记录位置；标为“在线读取”的来源没有保存正文快照，引用前需重新核对。

CW 指 `/Users/lesprivilege/Projects/Courtwork`，行号对应读取时的提交 `f3ccc27`；SE 指 Schema Engineering，读取时的提交为 `adbd793`。

## 内容与数据可视化编排

| ID | 参考 | 状态 | 取用内容 | 消费位置 | 证据 |
|---|---|---|---|---|---|
| C01 | CW Pages 闭环图 `site/src/assets/diagram.svg` | accepted | 内联 SVG、1.5 线宽、箭头标记；只有尚未发生的返回线用虚线 | 答卷 Q3、Q5 线图 | [快照](../../vault/snapshots/local/downloads/cw-pages-recall-20260923/diagram.svg) |
| C02 | CW 图形样式 `site/src/site.css` 869–907、1030–1041 | accepted | 虚线表示候选或未发生，线宽表示当前状态；每张图只在需要人决定处用一种强调色；高对比度模式下的替代样式 | 答卷五题线图 | CW 原仓库，未存快照 |
| C03 | CW 宽窄两版图 `site/src/continuity-figures.mjs` | accepted（改用） | 宽版与窄版共用图注，只靠 CSS 切换；本项目窄屏改用 HTML 版本，不横向滚动 | 答卷五题线图 | CW 原仓库，未存快照 |
| C04 | CW Pages 的 Paper、Tour 与分论点截图 | accepted | 衬线只用于顶层标题，分论点用黑体；图放在浅灰底板上；分区之间用细线 | 答卷排印 | [composition-anchors](../../vault/distilled/frontend-design/composition-anchors.md) |
| C05 | CW 数据可视化约定 `home-composition-2026-09-10/data-visualization.md` | accepted | 直接标注代替只靠颜色的图例；每张图配精确值；缺失值与零值分开标示 | 答卷 Q2 成本图与计时图 | [快照](../../vault/snapshots/local/courtwork/engineering/design/home-composition-2026-09-10/data-visualization.md) |
| C06 | CW 信息分层 `ui-composition-standard.md` 134–148 | accepted | 下一层只增加信息，不重复上一层；按任务选择表、图或正文 | 答卷 Q2 计时图 | CW 原仓库，未存快照 |
| C07 | show-me、visual-explainer、OpenAI data-visualization | accepted（方法） | 按论证关系选择表达方式；图注说清主张；第一屏显出主要判断 | 答卷[表达方式选择](../../vault/distilled/ai-capability-assessment/representation-plan.md) | [索引](../../vault/distilled/frontend-design/explanation-visualization-index.md) |
| C08 | SE 阅读器目录 `papers/dist/*reader*paper-v1.html` 205–224、308 | accepted | 原生 `<details>` 目录，无 JS 可用，打印时隐藏 | 答卷窄屏章节菜单 | SE 原仓库，未存快照 |
| C09 | CW 导览章节路径 `site/src/product-pages.css` 108–111 | accepted | 章节导航在窄屏改为纵向排列，不横向滚动 | 答卷窄屏章节菜单 | CW 原仓库，未存快照 |
| C10 | career-kit 图式样张 | accepted（组织关系） | 总览、单页、页序与翻页的关系；不取固定 16:9 舞台 | 答卷纲要总览与翻页 | [快照](../../vault/snapshots/local/career-kit/10-Vault/地基/企业汇报图式库/图式样张.html) |
| C11 | career-kit 宣讲面板：窄屏隐藏章节导航 | rejected | 窄屏没有替代导航，读者失去位置 | — | career-kit 原目录 |
| C12 | career-kit rule-console：JS 生成、横向滚动的标签栏 | rejected | 横向滚动，关闭 JS 后内容不存在 | — | career-kit 原目录 |
| C13 | [GOV.UK contents list](https://design-guide.publishing.service.gov.uk/components/content-list/) | accepted | 写明条目数，标出当前所在 | 答卷章节菜单与翻页条 | 在线读取，2026-09-24 |
| C14 | [ONS table of contents](https://service-manual.ons.gov.uk/design-system/components/table-of-contents) | accepted；吸附侧栏 deferred | 滚动时标出当前小节；小节少时不用吸附侧栏 | 答卷翻页条的小节号 | 在线读取，2026-09-24 |
| C15 | [W3C APG Disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) | accepted | 展开与收起的控件语义和键盘操作 | 答卷窄屏章节菜单 | 在线读取，2026-09-24 |
| C16 | [WCAG 2.2 SC 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) | accepted | 用户操作触发的非必要动效可以关闭 | 答卷动效 | 在线读取，2026-09-24 |
| C17 | [WCAG 1.4.10、1.4.12](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) | accepted | 文字容器随内容重排，不固定高度裁切 | 答卷全部版面 | 经 CW `grammar-convergence-20260921/luna-external-index.md` 转引 |
| C18 | [MDN ::details-content](https://developer.mozilla.org/en-US/docs/Web/CSS/::details-content) | reference | 展开与收起都可以做过渡；本次只做展开 | — | 在线读取，2026-09-24 |
| C19 | 动效判断框架（本地 skill emil-design-eng） | accepted | 先问是否该动、为何动，再定缓动与时长；键盘操作不动；减弱动效只留淡入 | 答卷动效 | 本地 skill |
| C20 | [Claude Opus 5.5 100 HTML Files](https://miaai-lab.github.io/Claude-Opus-5.5-100-HTML-Files/) 008 长文页 | accepted（阅读进度线） | 本题阅读进度线 | 答卷翻页条 | 在线读取，2026-09-24 |
| C21 | 同合集 008、020 的其余做法 | rejected | 奶油色纸底、Didone 标题、首字下沉、拉出引文、滚动淡入、数据竞速动画：属于暖色、装饰或非必要动效 | — | 同上 |
| C22 | [Vercel design](https://vercel.com/design) | accepted | 字号用具名档位；表格按基线对齐、数字右对齐；不用嵌套框补层级；不用装饰渐变 | 答卷排印与表格 | 在线读取，2026-09-24 |
| C23 | [Clerk design.md](https://clerk.com/design.md) | rejected | 营销页的渐变光晕和按钮强调色，不适合文档 | — | 在线读取，2026-09-24 |
| C24 | [Refero Styles](https://styles.refero.design/) | reference | DESIGN.md 合集，多为营销站 | — | 在线读取，2026-09-24 |
| C25 | anti-ai-slop-kit | accepted | 大号衬线标题、紫蓝渐变、玻璃拟态等是模板化特征 | 答卷排印 | [快照](../../vault/snapshots/local/downloads/files/anti-ai-slop-kit/README.md) |

## 产品软件界面

| ID | 参考 | 状态 | 取用内容 | 消费位置 | 证据 |
|---|---|---|---|---|---|
| U01 | WCAG 目标尺寸与缩放（CW-FE-R01） | accepted | 命中区 24px 为下限，触控与高后果操作 44px；200% 缩放与文字间距下仍可读 | CW 工作台 | [消费记录](../../vault/distilled/frontend-design/cw-consumption.md) |
| U02 | W3C APG Tabs（CW-FE-R01、R03） | accepted | 标签页识别对象、版本与范围；关闭和切换只是视图动作，不等于取消、删除或批准 | CW 工作台 | 同上 |
| U03 | CW 能力消费（CW-FE-R04） | accepted | 录入、启用、已用、已加载分别标示；模型提议经人审才生效 | CW 运行时 | 同上 |
| U04 | CW 表面层级 `surface-hierarchy.md`（参考 Radix、Atlassian Elevation） | accepted | 分组靠留白、对齐和字阶；卡片只给独立对象；提示框不承载必要信息 | CW 工作台；答卷去掉嵌套框 | CW 原仓库，未存快照 |
| U05 | CW 字阶约束 `type-density-constraints.md` | accepted | 正文字号不动，界面文字降一档；层级靠字号与字重 | CW 工作台；答卷排印 | [快照](../../vault/snapshots/local/courtwork/engineering/design/type-density-constraints.md) |
| U06 | CW 界面语法 `ux-grammar.md` UX-05 | accepted | 没有真实进度，不画百分比或预计完成时间 | CW 工作台 | [快照](../../vault/snapshots/local/courtwork/engineering/design/ux-grammar.md) |
| U07 | MCP 外部实践（CW-FE-R06） | accepted | 发出后结果未知单独成态；宿主负责授权与取消 | CW 运行时；答卷 Q3 | [消费记录](../../vault/distilled/frontend-design/cw-consumption.md) |
| U08 | Carbon、Radix | reference | 控件尺寸、图标尺寸、组间距和标签字形分开设定；具体数值不照搬 | — | 同上 |
| U09 | Linear、Vercel、Stripe 等站点拆解 | reference | 冷调科技站的字阶、描边与动效克制度 | — | [快照](../../vault/snapshots/local/downloads/files/anti-ai-slop-kit/03-范例档案/06-冷调科技站拆解.md) |

## 参考产出

| ID | 产出 | 可复用部分 | 位置 |
|---|---|---|---|
| P01 | 能力测试答卷（2026-09-24） | 问题—答案页结构、五种线图、宽窄两版、窄屏章节菜单、翻页条位置提示、打印与离线交付、图中文字溢出检查 | [rendered](../../vault/distilled/ai-capability-assessment/rendered/README.md) |
