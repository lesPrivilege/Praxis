# 社区空间开放安排比较 · Demo 交接

这是一份已实现的单文件离线 demo。本文只定义运行、输入、边界和验收，不把页面提升为通用组件或产品能力。

## 运行与依赖

- 入口：直接打开 [`index.html`](index.html)。
- 可选预览：在仓库根目录运行 `python3 -m http.server 8765 --bind 127.0.0.1`，访问 `http://127.0.0.1:8765/demos/community-opening-comparison/index.html`。
- 依赖：浏览器；页面只使用内嵌 CSS 与原生脚本，没有包管理器、远程字体、图片或外部 JavaScript。
- 输入：[`fixtures/normal.json`](fixtures/normal.json) 与 [`fixtures/failure-no-weekend-volunteers.json`](fixtures/failure-no-weekend-volunteers.json)。为保证双击 HTML 可用，页面把两份 fixture 的最小展示状态同步写在正文中，没有在运行时 `fetch` 外部文件。

## 实现范围

- 内容：结论先行、按属性比较 A/B/C、C-only 条件、紧邻解释、正常/失败周次条和可切换复核提示。
- 响应式：宽屏使用属性行 × A/B/C 三列；840px 以下按属性堆叠，375px 仍保留每行的 A/B/C 三个槽位与条件文本。
- 交互：checkbox 只用于切换 C 的当前提示，提供可见标签、键盘焦点和 `aria-live` 反馈；静态正文不依赖该脚本才能理解。
- 证据边界：采用 `REF-COMP-001` 的按属性跨对象比较，并采用 `REF-COMP-002` 的解释邻接；E09/T05/T06/C02 只提供结构方法。实际改写与不足见 [`consumption.json`](consumption.json)。

## 交付检查

- 静态检查：两个 JSON 可解析；七天数组、A/B/C 顺序、C-only 条件、失败周末关闭和预期结果一致。
- 浏览器检查：本地 HTTP 页面已用 Chrome DevTools 的 Responsive 视口检查 1440px 与 375px；宽屏显示按属性三列，窄屏显示 A/B/C 逐项堆叠，未隐藏方案或条件，也未观察到横向溢出。
- 状态检查：页面加载时看到正常和失败 fixture；在窄屏复核控件中取消“本周末有志愿者”后，结果提示变为 C 不满足且指出周六、周日。
- 键盘检查：复核控件可聚焦并切换，结果区域使用 `aria-live="polite"`；无脚本时静态判断仍在正文中。
- 未检查：真实数据、打印输出、完整读屏器组合、200% 文字缩放、真实运营接受率和全仓验证。

## 返回条件

如果 HTML 的论证口径或 fixture 身份改变，需要同时更新页面、两个 JSON、`scenario.md`、本文件和 `consumption.json`，然后重做上述检查。若新增真实系统接入或外部动作，另行建立授权边界，不在此 demo 内扩展。
