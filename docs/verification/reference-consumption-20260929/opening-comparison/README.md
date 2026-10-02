# 社区空间开放安排比较

状态：自然发现与消费的验证工件，不作为产品demo；原生成目录为 `demos/community-opening-comparison/`，收尾归到本目录。

这页回答一个有界问题：在 A（每周 7 天、每月成本 1800）、B（每周 5 天、每月成本 1200）和 C（每周 7 天、每月成本 1500，但只在周末有志愿者时成立）之间，哪个安排满足“每天有人开门”。判断口径是周一至周日七天都有人负责开门；因此 A 直接满足，B 不满足，C 只有专属条件成立时满足。

## 本地运行

直接在浏览器打开 [`index.html`](index.html) 即可，不需要安装依赖、启动服务或联网。页面的复核控件是渐进增强；即使禁用脚本，按属性比较矩阵、正常 fixture 和失败反例仍然在正文中可读。

## 文件

| 文件 | 作用 |
|---|---|
| [`index.html`](index.html) | 离线页面；按属性跨 A/B/C 的比较矩阵、核心判断、C 的条件、正常/失败 fixture、可键盘操作的条件复核 |
| [`fixtures/normal.json`](fixtures/normal.json) | `weekend_volunteers_present=true` 的正常 synthetic fixture 及预期结果 |
| [`fixtures/failure-no-weekend-volunteers.json`](fixtures/failure-no-weekend-volunteers.json) | `weekend_volunteers_present=false` 的失败 synthetic fixture；C 的周六、周日关闭 |
| [`fixtures/README.md`](fixtures/README.md) | fixture 字段、正常/失败语义和验收边界 |
| [`scenario.md`](scenario.md) | 有界场景契约：输入、动作、失败恢复、验收和接收责任 |
| [`demo.md`](demo.md) | 有界实现交接：运行、依赖、响应式实现、检查和返回条件 |
| [`consumption.json`](consumption.json) | 实际导航顺序、入口选择原因、采纳程度、改写范围、反例和不足 |

## 已消费材料与改写边界

实际导航从 Kit 使用约定、架构入口、入账规范和 Demo/Write/Design 分支开始，随后经同题历史任务的本地发现记录回查两个优先结构参考及其精确样张；这不是本次独立题材发现，也不是业务事实核查。`consumption.json` 按实际顺序记录这些入口，并区分已采纳的工作约束与只作为结构参考的材料。

本页实际采用的已登记来源 ID 是：

- `REF-COMP-001`：按属性维持比较。采用按属性分行、每行固定 A→B→C 槽位的结构；窄屏把属性行堆叠，但仍保留三个对象和条件。没有复制该样张的机构、数字或未验收代码。
- `REF-COMP-002`：注释保持邻接。采用“核心判断后紧跟解释”的阅读顺序；宽窄屏都依靠正常文档顺序，不用脚本搬移解释节点。
- `E09-a`、`T05-a`、`T05-b`、`T06-a`、`T06-b`、`C02-a`：分别借用中立对照、条件作用域、内联条件、紧随主张的反例和结论先行的决定说明结构。页面内容与数据全部按本题重新编写。
- `atoms-comparison-scope`：同题本地发现记录，仅用于确认上述材料入口和三个要求的结构对应；它不是业务事实来源。

Kit 和分支文档只提供工作约束：`kit/Agent.md`、`docs/architecture/README.md`、`docs/governance/intake.md`、`demos/README.md`、`kit/write/publish/composition.md`、`kit/write/publish/exhibits.md`、`kit/write/shared/verification.md`、`kit/design/composition/layout.md` 与 `kit/design/interaction/states.md`。本页没有消费真实客户资料，也没有引入外部 URL、远程字体、图片或模板。

## 新增实现与检查范围

- 新增单文件离线 HTML/CSS/JS；桌面端以按属性分行的 A/B/C 三列矩阵对照，宽度降到 840px 后按属性堆叠，保留所有方案和 C 的条件，375px 目标宽度下每行仍保留三个方案槽位、周次条仍保留七格。
- 正常和失败 fixture 是独立 JSON；HTML 同步呈现两者，避免 `file://` 下依赖 `fetch` 读取 JSON。条件复核 checkbox 只改变当前提示，不隐藏任何方案或条件。
- 已做静态结构检查：方案代码 A/B/C、三组每周天数/成本、C-only 条件、正常/失败 fixture、周六/周日关闭反例和无远程依赖均在文件中找到；另以 JSON 解析检查两个 fixture 的七天长度、C-only 作用域与失败状态。
- 已做本地浏览器渲染检查：宽屏按属性显示 A/B/C 三列，375px 窄屏按属性堆叠且每行仍保留 A/B/C、条件和失败反例，窄屏不出现横向溢出；checkbox 可用键盘切换并更新 `aria-live` 结果。未运行仓库级验证；由主代理统一执行。

本页的合成数据只证明逻辑和呈现路径，不证明任何真实空间的成本、排班或志愿者供给。

本项只验证仓库路径与参考取用。初版经同题历史回执找到素材；REF-COMP-001误读由main指出后修正，不能把修正版计作完全无提示成功。scenario/demo文档保留为这次测试的生成现场，不形成新的产品维护义务。
