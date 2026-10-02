# 内容与数据可视化编排参考

本页是 C01–C25 的 canonical route。它记录内容关系、数据表达、章节导航、动效和历史版式观察；条目是可回查的消费记录，不是对所有项目的统一视觉 token。返回 [Design 参考路由](README.md) 或 [兼容入口](../references.md)。

CW 指 `/Users/lesprivilege/Projects/Courtwork`；C02、C03、C06、C09 等未存快照的行号对应当时读取的提交 `f3ccc27`。SE 指 Schema Engineering；未存快照的坐标对应当时读取的提交 `adbd793`。当前源仓库、浏览器和无障碍状态不能由这些历史坐标推导。

## 关系、数据与信息层级

| ID | 参考 | 状态 | 是什么 / Kit 消费什么 | 边界 | 消费位置 | 重访与证据 |
|---|---|---|---|---|---|---|
| C01 | CW Pages 闭环图 `site/src/assets/diagram.svg` | accepted | 本地 SVG 示范关系线、箭头和状态；消费为关系图的线型语法 | 单个图形快照，不是通用 renderer 或产品视觉 | 答卷 Q3、Q5 线图 | 改图式或换 renderer 时复查；[快照](../../../vault/snapshots/local/downloads/cw-pages-recall-20260923/diagram.svg) |
| C02 | CW 图形样式 `site/src/site.css` 869–907、1030–1041 | accepted | 本地记录报告虚线、线宽、单一强调色和高对比度替代样式 | 源仓库未存本段快照，不能声称当前 CSS 或全站符合 | 答卷五题线图 | 引用前按当前提交复核；CW 原仓库历史坐标 |
| C03 | CW 宽窄两版图 `site/src/continuity-figures.mjs` | accepted（改用） | 宽窄投影共享图注；本项目窄屏改用 HTML，不横向滚动 | 窄屏 HTML 是 Praxis/答卷决定，不是 CW 原样规则 | 答卷五题线图 | 改 breakpoint、打印或无 JS 时复查；CW 原仓库历史坐标 |
| C04 | CW Pages 的 Paper、Tour 与分论点截图 | accepted | 消费真实页面中的论证层级、图文邻接与分区关系 | 截图只证明历史可见机制；衬线、灰底等处理属于 profile，不自动全局化 | 答卷排印 | 新页面需有真实截图回检；[composition anchors](../../../vault/distilled/frontend-design/composition-anchors.md) |
| C05 | CW 数据可视化约定 `home-composition-2026-09-10/data-visualization.md` | accepted | 直接标值、精确值、缺失与零值区分；用数据语义决定图式 | 不能泛化为所有数量图必须零起点或同一 chart 类型 | 答卷 Q2 成本图与计时图 | 数据口径或图型变化时重访；[快照](../../../vault/snapshots/local/courtwork/engineering/design/home-composition-2026-09-10/data-visualization.md) |
| C06 | CW 信息分层 `ui-composition-standard.md` 134–148 | accepted | 下一层增加信息而不重复；按任务选择表、图或正文 | 本地 composition decision，不是外部通用标准 | 答卷 Q2 计时图 | 新 artifact family 时重访；CW 原仓库历史坐标 |
| C07 | show-me、visual-explainer、OpenAI data-visualization | accepted（方法） | 先辨认问题、机制、数据和交付，再选表达；图注说明主张，第一屏显出判断 | 固定版本方法参考；未安装、未执行，不要求每节点画图 | 答卷[表达方式选择](../../../vault/distilled/ai-capability-assessment/representation-plan.md) | 复制实现或采用新版本时复核许可与差异；[索引](../../../vault/distilled/frontend-design/explanation-visualization-index.md) |

## 导航、披露与响应式阅读

| ID | 参考 | 状态 | 是什么 / Kit 消费什么 | 边界 | 消费位置 | 重访与证据 |
|---|---|---|---|---|---|---|
| C08 | SE 阅读器目录 `papers/dist/*reader*paper-v1.html` 205–224、308 | accepted | 原生 `details` 目录、无 JS 基本可读、打印隐藏 | 源仓库未存快照，不能把历史 reader 行为当当前站点事实 | 答卷窄屏章节菜单 | reader 结构或浏览器变化时复核；SE 历史坐标 |
| C09 | CW 导览章节路径 `site/src/product-pages.css` 108–111 | accepted | 窄屏章节导航纵向排列，保留位置语义 | 源 CSS 未存快照；不规定所有页面必须相同导航 | 答卷窄屏章节菜单 | breakpoints 或导航对象变化时复核；CW 历史坐标 |
| C10 | career-kit 图式样张 | accepted（组织关系） | 总览、单页、页序和翻页之间的组织关系 | 合成样张，不复制业务标签，不固定舞台比例 | 答卷纲要总览与翻页 | 换交付媒介时重访；[快照](../../../vault/snapshots/local/career-kit/10-Vault/地基/企业汇报图式库/图式样张.html) |
| C11 | career-kit 宣讲面板：窄屏隐藏章节导航 | rejected | 记录窄屏无替代导航会丢失位置 | 只拒绝该退化路径，不代表所有隐藏导航都无效 | — | 只有提供可读 fallback 时复查；career-kit 原目录 |
| C12 | career-kit rule-console：JS 生成、横向滚动的标签栏 | rejected | 记录关闭 JS 后内容不存在、横向滚动成为唯一路径的失败模式 | 只拒绝该实现组合，不拒绝语义标签或 progressive enhancement | — | 有完整无 JS/窄屏 fallback 时复查；career-kit 原目录 |
| C13 | [GOV.UK contents list](https://design-guide.publishing.service.gov.uk/components/content-list/) | accepted | 条目数、当前所在和目录位置提示 | 2026-09-24 在线读取，无正文快照；不自动规定 sticky 侧栏 | 答卷章节菜单与翻页条 | 长文导航变化时重读官方页 |
| C14 | [ONS table of contents](https://service-manual.ons.gov.uk/design-system/components/table-of-contents) | accepted；吸附侧栏 deferred | 当前小节标示；小节少时不强加吸附侧栏 | 当前项与 sticky 是不同取舍；2026-09-24 在线读取 | 答卷翻页条的小节号 | 章节数量或滚动策略变化时重读官方页 |
| C15 | [W3C APG Disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) | accepted | 展开/收起控件的语义、键盘和焦点路径 | 不提供页面视觉或业务状态；2026-09-24 在线读取 | 答卷窄屏章节菜单 | 实现 details/disclosure 或 APG 版本变化时重读 |
| C16 | [WCAG 2.2 SC 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) | accepted | 用户触发的非必要动效应有关闭路径 | 不指定时长、缓动或替代动画；2026-09-24 在线读取 | 答卷动效 | 动效或减弱动效策略变化时重读 |
| C17 | [WCAG 1.4.10、1.4.12](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) | accepted | 文字放大、重排和文字间距下不固定高度裁切 | CW 转引且本批未重新核验，不形成页面 conformance 结论 | 答卷全部版面 | 响应式实现或验收时重新读标准并实测；CW luna external index |
| C18 | [MDN ::details-content](https://developer.mozilla.org/en-US/docs/Web/CSS/::details-content) | reference | 记录 details 展开/收起可做过渡，作为实现线索 | 未采纳为通用动效；2026-09-24 在线读取 | — | 需要过渡或浏览器兼容性时重读 |

## 动效、类型与反模式观察

| ID | 参考 | 状态 | 是什么 / Kit 消费什么 | 边界 | 消费位置 | 重访与证据 |
|---|---|---|---|---|---|---|
| C19 | 动效判断框架（本地 skill emil-design-eng） | accepted | 先判断是否该动、为何动，再定属性与曲线；键盘操作和减弱动效单独裁决 | 本地 skill 方法，不是外部标准；不强制减弱动效只留淡入 | 答卷动效 | skill 版本或 renderer 变化时重读 |
| C20 | [Claude Opus 5.5 100 HTML Files](https://miaai-lab.github.io/Claude-Opus-5.5-100-HTML-Files/) 008 长文页 | accepted（阅读进度线） | 取阅读进度线作为单次页面反馈机制 | 只采纳该机制；页面配色、字体、滚动动效等留在一次性 profile；2026-09-24 在线读取 | 答卷翻页条 | 复用样式或页面更新时重读并核对 profile |
| C21 | 同合集 008、020 的其余做法 | rejected | 记录奶油色纸底、Didone、首字下沉、引文拉出、滚动淡入和数据竞速等不适合本答卷的做法 | 是当前答卷 profile 的拒绝，不是对所有媒介的普遍审美判断 | — | artifact 目标变化时由 Astra 重裁决；同 C20 页面 |
| C22 | [Vercel design](https://vercel.com/design) | accepted | 具名字号档位、基线表格、数字右对齐；避免用嵌套框或装饰渐变补层级 | 入口页只支持记录的范围；2026-09-24 在线读取 | 答卷排印与表格 | 具体 typography/table 任务时重读 |
| C23 | [Clerk design.md](https://clerk.com/design.md) | rejected | 记录渐变光晕和按钮强调色作为不适合该文档 profile 的反例 | 反例只服务当前文档取向，不是产品或营销页的事实判定 | — | 设计目标改变时重裁决；2026-09-24 在线读取 |
| C24 | [Refero Styles](https://styles.refero.design/) | reference | DESIGN.md 合集，可用于召回营销站样式观察 | 不是官方规范，也未采纳为 Praxis grammar；2026-09-24 在线读取 | — | 需要外部样本比较时重读 |
| C25 | anti-ai-slop-kit | accepted | 作为模板化大标题、紫蓝渐变、玻璃拟态等反模式的识别材料 | 只消费反模式，不把样本风格当正面 token | 答卷排印 | 新反模式或 artifact 变化时重访；[快照](../../../vault/snapshots/local/downloads/files/anti-ai-slop-kit/README.md) |

## 维护

`accepted`、`reference` 和 `rejected` 只描述本地消费判断；在线来源没有正文快照时仍需重读。项目使用 C 条目后，在自己的 index 写下来源版本、调整理由、验证和重访条件。
