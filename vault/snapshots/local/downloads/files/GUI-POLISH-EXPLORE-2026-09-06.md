# GUI Polish Explore：轻量 Work Agent WebUI

日期：2026-09-06  
状态：调研与候选实验任务书；不是已批准的依赖清单，也不是完成验收的设计方案。  
用途：交给本地 coding agent，在功能基本面之上开展隔离的 GUI polish 探索。  
边界：本轮已核查公开仓库文档与外部官方资料；未运行当前本地分支、未安装或实测候选库、未对现有 GUI 作逐屏视觉验收。

## 1. 目标与边界

目标不是再做一个功能很多的 agent dashboard，而是：保留用户熟悉的通用 agent 交互，以可靠的组件行为、细致的排印和少量可辨识的作者性，让真实工作过程与结果适合阅读、操作、审阅和公开展示。

成熟交互不重造，视觉表达不外包。充分探索外部资源，不等于充分增加依赖。

本轮不重构 harness core、不更换 provider、不新增工作流引擎、不为了展示而制造未接线控件、不修改工作状态的权威来源。展示层可以改变分组、折叠、排版、面板安排和动效；不能自行把 running 改成 completed，也不能把 proposal 渲染成已获批准。

仓库旧文档是参考与历史约束来源，不是全部设计空间。既有生产规范仍然约束合流；与其冲突的候选先在隔离实验页比较，获准后明确修订 token、组件和相关门禁，不绕过检查，也不让旧像素值提前否决探索。

## 2. 已核查的仓库基线

以下来自远端默认分支，不代表用户本地尚未推送的双线施工状态。开工前必须检查本地工作树、实际 lockfile、已有设计分支；不要因为远端存在某组件就假设本地没有改动。

### Courtwork

- `apps/desktop/package.json`，blob `95639ec8f91a24a7ce8fd68167c758d3175eb047`：已经有 React/Vite、`lucide-react`、`@assistant-ui/react`、`@antv/g6`、SVGO、Playwright，以及较多视觉/文案/边界检查脚本。候选实验必须包含“保留现有依赖并精修”的基线。
- `docs/design/README.md`，blob `0c9ee5e1dc51f80561d82906f1bbc95f958b55bc`：设计资料覆盖 tokens、principles、voice、typography-density、svg-standards、signature-line、visualization-kit 等；`courtwork-design.md` 明确为编译产物，而非权威原稿。
- `docs/design/principles.md`：已有“Pages / Agent 通用界面 / schema 工作面”的激进度梯度；作者性可以主要落在外壳与导航，审阅区域优先保证判断清晰。
- `docs/design/svg-standards.md`，blob `5b66a75e993891da5fe61a87e26ec01edc741d9b`：已有 SVG-as-code、Lucide 静态具名导入优先、自绘补缺、16px/24px 审计板的做法。其固定描边、标签白名单等是当前规范，不自动成为所有新候选的审美前提。

### Motto

- `docs/TUI-THESIS.md`：canonical 与 display/copy projection 分离；正文、过程摘要、异常的视觉权重不同；强调流式稳定、成功压缩、失败不被静默隐藏。
- `docs/MOTTO-PHILOSOPHY.md`：作者性来自秩序、留白、层级，而非仿古符号；提出 ledger / bounded preview / canonical evidence 三层阅读面。

可迁移的是上述问题意识与阅读机制。TUI 的零框线、终端字符限制、特定色数和布局数值不能不加论证地搬到 Web。

## 3. 前端调研地图

每一项先问清楚是“行为”“视觉”“信息表示”还是“工程资产”；不要把所有问题都交给一套 UI kit。

| 层次 | 应调研的细项 | 候选入口 / 实验边界 |
| --- | --- | --- |
| 视觉基础 | 色温、明暗主题、语义色、表面层次、间距、圆角、线重、密度 | 现有 tokens 为基线；Radix Colors 为色阶参考，不整套照搬 |
| 排印 | 中英混排、字体回退、标题与正文、数字对齐、路径折行、代码字体、阅读行长 | Fontsource；先做好系统字体回退，再评估额外字体收益与加载成本 |
| SVG 图标 | 家族、视觉重量、线/填充、光学对齐、16/20/24px 可读性、静态导入 | Lucide / Phosphor / Tabler；同一组动作做对比，不同时装三套 |
| 基础交互原语 | button、toggle、tooltip、menu、dialog、popover、select、combobox | 原生 HTML 优先；Base UI / Radix / React Aria 作为行为候选，选择一个主要底座 |
| 复合控件 | 命令面板、搜索、键盘快捷键、toast、行内编辑、附件上传 | cmdk / Sonner；先复用现有实现，避免第二套弹层与焦点机制 |
| 页面外壳 | sidebar、tabs、split view、resizing、收起/恢复、焦点与滚动位置 | react-resizable-panels；Linear / Raycast 的公开产品材料用于研究行为，不复制品牌 |
| Agent 工作面 | composer、消息动作、工具折叠、停止、重试、自动跟随、跳到最新、会话恢复 | 已有 assistant-ui 优先；AI Elements 为对照；检查各自 runtime 适配边界 |
| 流式内容 | 不完整 Markdown、表格/代码块增量渲染、复制原文、长文本性能 | 现有 unified/remark 为基线；Streamdown 做定向 spike，不为渲染器改后端协议 |
| 产物阅读与审阅 | diff、原文锚点、边注、版本、证据面板、明确审批动作 | Pierre Diffs 适用于代码/文本 diff；AI Elements Sources 仅提供引用展示，不替代证据模型 |
| 结构化资料 | 表格、排序/筛选、树、时间线、图谱、空值/未知值 | TanStack Table；现有 G6 为图谱基线；React Flow 仅在真实节点交互需求下比较 |
| 文档编辑 | 只读/编辑切换、选择、批注、粘贴、撤销、中文输入法 | Tiptap 仅在明确富文本编辑需求出现时进入 shortlist，不为一个聊天输入框引入完整编辑器 |
| 动效与反馈 | hover/press、菜单过渡、展开/收起、运行反馈、减少动态效果 | CSS 优先；复杂编排再考虑 Motion；不要每个组件各用一种动画引擎 |
| 响应式与平台 | 窄窗、触控、软键盘、缩放、中文 IME、快捷键平台差异 | 按真实设备与 viewport 验证，不以桌面截图替代移动适配 |
| 文案与状态 | 空态、首次使用、错误、等待、取消、部分完成、离线、权限不足 | 沿用成熟短句与明确动词；事实状态不能只靠颜色或图标暗示 |
| 质量与回归 | 组件状态页、键盘操作、焦点、可访问名称、视觉对比、渲染成本 | 已有 Playwright 优先；必要时引入 Storybook；自动检查不能代替人类审美判断 |
| 作品展示 | 首屏、真实演示样本、截图、录屏、分享图、README 与展示页 | Mobbin/Page Flows 用于参考真实流程；Magic UI/React Bits 主要作为表现手法参考 |

## 4. 图标与按钮：先做一张真正有用的 specimen

“按钮的 SVG 库”其实至少分三件事：按钮语义与交互行为、图标绘制、组件视觉与状态。SVG 图标不会自动提供键盘操作、焦点恢复或不可逆动作保护。

图标 shortlist：

- Lucide：现有工程基线；React 包提供可定制的 inline SVG 与按需导入。
- Phosphor：用于比较 Regular / Light / Bold / Fill / Duotone 等不同视觉重量的表达。
- Tabler：用于比较另一套 SVG 几何语言与实际动作覆盖率。

同一张审计板使用同样的动作：新建、发送、停止、重试、附件、搜索、展开、收起、来源、复制、编辑、批准、驳回、设置、更多。

分别在 16 / 20 / 24px 下查看，不把所有来源图标强制改成同一个描边值后再比较；先尊重各自设计网格。图标尺寸与点击区域分开评估。产品可试验较小图标搭配较大 hit area，具体数值由密度、设备与可访问性验证共同决定。

按钮至少展示：默认、hover、focus-visible、pressed、disabled、pending。toggle、危险动作、确认中等只给具有相应语义的按钮增加，不给每个按钮硬塞所有状态。

必测问题：

1. 纯图标按钮有没有可访问名称；tooltip 是否只是补充，而非唯一解释？
2. pending 后是否保留合理焦点、避免重复提交、避免文字切换导致布局抖动？
3. 键盘 Enter / Space 与鼠标行为是否一致；菜单关闭后焦点回到哪里？
4. 停止是取消当前执行，还是仅停止显示？界面必须反映真实能力。
5. 放大页面与窄窗下是否挤压、错位或出现不可点击的极小控件？

W3C 的 WCAG 2.2 目标尺寸最低要求通常为 24×24 CSS px，另有间距、行内文字等例外。不要把 16px 图形的审美尺寸误认为 16px 点击目标已足够。

## 5. 六个可独立执行的 Explore Tasks

### EX-P0：基线、资产与约束盘点

问题：现有 GUI 哪些已经可复用，哪些真的缺失？

读取本地 package/lockfile、tokens、公共组件、agent thread、composer、artifact/review surfaces、测试与相关文档。对远端基线与本地差异只做记录，不覆盖未提交变更。

交付：surface inventory；现有依赖/机制复用表；当前主流程的截图与录屏；历史文档的 keep / adapt / retire-proposal 表。

退出条件：每个后续任务都能指向真实组件或页面；不以“缺一套现代设计系统”为由启动全量替换。

### EX-P1：视觉语法与排印方向

问题：同一功能骨架，在不增加功能的前提下能形成哪些有辨识度的视觉表达？

候选来源：Motto 的阅读秩序、Courtwork 的激进度分层、Linear 的公开设计说明、Radix Colors、Fontsource。

交付：三套可切换的同数据试样，不只是三种配色。每套同时涉及排印、间距、线重、表面、图标重量和一个一致的焦点组织原则。

实验方向（假设，不是已批准设计）：

- A 清冷编辑台：以正文、边注、细层级与阅读节奏组织界面。
- B 精密工作台：以动作紧邻对象、紧凑元信息与稳定面板组织界面。
- C 正文＋证据边栏：将结果阅读与证据检查组织成主次清晰的连续体验，而非多张等权卡片。

退出条件：三个方向使用相同内容、相同真实状态和相同 viewport；能解释取舍与维护成本；没有虚构图表、计数或能力。

### EX-P2：图标、按钮与交互原语

问题：哪些肉眼可见的廉价感来自图标/排印，哪些来自交互行为不完整？

候选：Lucide / Phosphor / Tabler；原生 HTML、Base UI / Radix / React Aria；shadcn 的 open-code 分发方式作为可选组织方式。

交付：图标对照板、按钮状态板、菜单/tooltip/dialog/combo 的交互试样；保留现有组件与替换原语两条实现路线。

退出条件：建议一个主图标家族与一个主要行为底座；记录缺失图标的补绘成本；覆盖键盘、焦点、标签、禁用与 pending；不得默认采用多个相互重叠的 overlay/focus 系统。

### EX-P3：Agent 通用工作面的微交互

问题：保留熟悉的 agent 交互，如何让流式、长会话与异常处理更稳定？

候选：现有 assistant-ui + 当前渲染栈为基线；AI Elements、Streamdown 作为局部对照；Raycast 的动作发现方式为参考。

交付：一个真实接线或明确 fixture 驱动的完整 turn：输入 → 运行 → 工具活动 → 结果；补上用户上翻、停止、失败、重试、恢复等分支。画清显示状态与 canonical 数据的边界。

退出条件：上翻时不抢滚动；新内容可被发现；展开细节不丢阅读位置；错误不隐藏在成功摘要内；显示装饰不混入复制内容；不更换 harness runtime 来迁就组件库。

### EX-P4：产物与人类审阅工作面

问题：不用再读一遍长对话，用户能否看懂产物变化、证据和待决定事项？

候选：现有阅读视图/结构化构件；Pierre Diffs；AI Elements Sources；TanStack Table。图谱与富文本编辑按明确任务再启动，不因库成熟而新增功能。

交付：同一份产物的摘要、展开预览、原文证据三级；含一项可确认、一项证据不足、一项有冲突的审阅样本；检查版本与引用锚点。

退出条件：事实状态、工作状态、人工裁决彼此可辨；引用展示不被误当作证据已核验；视觉美化不改变确认权限、提交范围或实际状态。

### EX-P5：动效、展示与质量闭环

问题：如何让第一印象和操作过程同样完整，而不是只做一张漂亮截图？

候选：CSS、Motion；Magic UI/React Bits 用于探索表现手法；Mobbin/Page Flows 用于观察真实流程；已有 Playwright，必要时 Storybook。

交付：一条约 45–90 秒的真实工作演示路径；静态关键帧；默认/窄窗/长文本/运行/待确认/失败/恢复状态的回归集合；reduced-motion 版本。时长是本项目实验目标，不是行业阈值。

退出条件：展示素材与产品使用相同组件；fixture/replay 有明确标记；演示中没有伪成功、伪活动或未接线按钮；不因动效延迟实际状态反馈；人类审阅视觉质量，自动测试负责防止已批准结果回退。

## 6. 参考的消费方式

把每个参考标成以下四种之一：

- pattern-only：借交互或版式思路，不复制代码。
- asset-adopt：采用图标或其他资产，核查对应资产许可。
- source-adapt：复制少量源码并归项目维护，记录来源与升级责任。
- package-adopt：作为依赖，记录版本、必要性、适配边界与移除办法。

这些标签避免把“看到很好的参考”误写成“决定引入一个库”。shadcn 的 open-code 方式提供修改自由，也意味着本地复制的代码需要有人维护；不是无成本地永久同步上游。

对每一项候选，至少记录：来源、核查日期、版本或 commit、演示入口、实际被观察的状态、尚未验证的能力、框架适配、许可证、键盘/可访问性表现、体积/渲染成本、现有替代、最终取舍。

“官方声称支持”“本地样例运行”“真实场景验证”必须分开。没有实测包体积、Safari/IME、长会话表现时，写未验证，不填想象中的分数。

## 7. 统一实验材料与验收

所有候选使用同一套数据，避免某个设计因为内容更短或状态更少而看起来更好。

统一内容包括：中英混排标题、长文件名、带单位的数字、时间戳、Markdown 代码块与表格、来源锚点、一次失败、一次等待确认、一次部分完成。图谱/时间线只在真实数据确有这些关系时进入材料。

统一 viewport 至少覆盖宽桌面、常见笔记本、窄窗；具体尺寸在 EX-P0 从实际使用环境决定。补测浏览器缩放、键盘操作、中文输入法 composition、减少动态效果、长内容和弱网/断流。

评价顺序：

1. 行为真实、语义清楚、关键动作可访问，这是门槛。
2. 默认阅读是否疏朗、焦点是否明确、动态过程是否稳定。
3. 作者性是否可辨而不增加学习负担。
4. 单人能否维护，依赖与自有代码是否减少而非膨胀。

不把星数当成熟度，不把 screenshot diff 通过当审美完成，也不把视觉 agent 的自评当最终设计裁定。

## 8. 建议交付目录

```text
explore/gui-polish/
  README.md                 # 当前问题、边界、候选与状态
  source-register.md        # 官方入口、观察记录、许可证待核项
  baseline.md               # 本地现状与复用基线
  decisions.md              # adopt / adapt / reference / reject
  specimens/                # 可运行的同数据样板
  captures/                 # 标注环境与状态的截图/短录屏
  acceptance.md             # 人审结论与可复现测试
```

这只是建议目录；若已有同用途目录，复用现有位置。不要为了任务书再创造一套文档体系。

Explore 阶段不直接修改 main、不提交整体换肤、不安装所有候选。先并行读资料与做有限试样，再由一个整合者统一 tokens、icon mapping、状态命名、组件边界和最终依赖。

## 9. 已核查的外部入口

以下入口用于找到官方资料与可运行例子；列入本表不等于完成源码审计或许可证验收。

### 图标与行为

- Lucide React：`https://lucide.dev/guide/react/`
- Phosphor：`https://phosphoricons.com/`
- Phosphor 源码说明：`https://github.com/phosphor-icons/homepage`
- Tabler Icons：`https://tabler.io/icons`
- Base UI：`https://base-ui.com/`
- Base UI Button：`https://base-ui.com/react/components/button`
- React Aria：`https://react-aria.adobe.com/`
- React Aria Button：`https://react-aria.adobe.com/Button`
- Radix Primitives：`https://www.radix-ui.com/primitives/docs/overview/introduction`
- shadcn：`https://ui.shadcn.com/docs`
- shadcn Base UI 文档说明：`https://ui.shadcn.com/docs/changelog/2026-01-base-ui`
- cmdk：`https://cmdk.paco.me/`
- Sonner：`https://sonner.emilkowal.ski/`

### 视觉、布局与产品行为

- Radix Colors：`https://www.radix-ui.com/colors`
- Fontsource：`https://fontsource.org/`
- Fontsource 可变字体：`https://fontsource.org/docs/getting-started/variable`
- react-resizable-panels：`https://react-resizable-panels.vercel.app/`
- Linear 2026 设计调整：`https://linear.app/now/behind-the-latest-design-refresh`
- Raycast Action Panel：`https://manual.raycast.com/action-panel`
- Mobbin：`https://mobbin.com/`
- Page Flows：`https://pageflows.com/web/`

### Agent、资料与审阅

- assistant-ui Thread：`https://www.assistant-ui.com/docs/primitives/thread`
- assistant-ui：`https://www.assistant-ui.com/`
- AI Elements：`https://elements.ai-sdk.dev/`
- AI Elements Sources：`https://elements.ai-sdk.dev/components/sources`
- Streamdown：`https://streamdown.ai/docs`
- Pierre Diffs：`https://diffs.com/`
- Pierre diff 渲染技术说明：`https://pierre.computer/writing/on-rendering-diffs`
- TanStack Table：`https://tanstack.com/table/latest`
- React Flow：`https://reactflow.dev/`
- Tiptap：`https://tiptap.dev/docs/editor/getting-started/overview`

### 动效与质量

- Motion 减少动态效果：`https://motion.dev/docs/react-use-reduced-motion`
- Magic UI：`https://magicui.design/`
- React Bits：`https://reactbits.dev/`
- Storybook 交互测试：`https://storybook.js.org/docs/writing-tests/interaction-testing`
- Storybook 可访问性：`https://storybook.js.org/docs/writing-tests/accessibility-testing`
- Playwright 视觉比较：`https://playwright.dev/docs/test-snapshots`
- Playwright 可访问性：`https://playwright.dev/docs/accessibility-testing`
- W3C Button Pattern：`https://www.w3.org/WAI/ARIA/apg/patterns/button/`
- W3C 目标尺寸：`https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html`

### 仓库来源

- `https://github.com/lesPrivilege/Courtwork/blob/main/apps/desktop/package.json`
- `https://github.com/lesPrivilege/Courtwork/blob/main/docs/design/README.md`
- `https://github.com/lesPrivilege/Courtwork/blob/main/docs/design/principles.md`
- `https://github.com/lesPrivilege/Courtwork/blob/main/docs/design/svg-standards.md`
- `https://github.com/lesPrivilege/motto/blob/motto/main/docs/TUI-THESIS.md`
- `https://github.com/lesPrivilege/motto/blob/motto/main/docs/MOTTO-PHILOSOPHY.md`
