# 图件施工说明（交给图件制作者）

工作目录：`/Users/lesprivilege/Projects/Praxis/.claude/worktrees/saas-textbook`（git worktree，不要 cd 到别处，不要 commit）。

## 这是什么

SaaS 工程教材的离线多页 HTML 站点。正文唯一来源是 `books/saas-engineering/**.md`；`demos/saas-engineering-textbook/build/build.mjs` 把它生成到 `demos/saas-engineering-textbook/site/`。读者是能借 AI 搭界面的 vibe coder，要从小例子看懂对象、状态、权威与验算。

## 图件机制

- 在 Markdown 里写：

  ```
  <!-- figure: 图件id -->
  （可选的回退内容：现有表格或一小段 Markdown）
  <!-- /figure -->
  ```

  构建时这一段变成 `<div class="fig" data-fig="id">` + `src/figures/<id>.html` 的内容 + 回退内容。脚本就绪后回退内容隐藏，图件显示；没有脚本或打印时只显示回退内容。回退为空时，正文必须已经独立讲清同样的事。
- `src/figures/<id>.html`：一个 `<div class="fig-body">`，含 `<p class="fig-title">`、一个挂载点和 `<p class="fig-caption">`。图件专用的 CSS 写在这个文件里的 `<style>`，选择器一律以 `.fig[data-fig="<id>"]` 开头。不要改 `src/book.css`、`src/book.js` 或别人的图件。
- `src/figures/<id>.js`：IIFE，注册 `window.FIGURES['<id>'] = function (body) {...}`，`body` 是 `.fig-body`。可用 `window.FigKit`：`stepper(host, labels, render)`、`toggle(host, label, onChange)`、`fmt(n)` 千分位、`h(tag, attrs, html)`。不引入任何外部库，不发网络请求，ES5 风格即可。
- 参考已完成的样例：`src/figures/em-e01-ledger.html` 与 `.js`；可用的样式类见 `src/book.css` 末尾（`.stage`、`.note`、`.num`、`.fig-controls`、`.units`、`.state-table tr.changed` 等）。

## 视觉

浅色冷调；层级靠字号和字重，不靠色块和嵌套卡片。唯一强调色 `var(--accent)` 只标“这一步刚改变的东西”或“当前选中”。实线表示已发生或已确定，虚线表示尚未发生。动效只在状态变化处，≤200ms，并尊重 `prefers-reduced-motion`。不放只在 hover 才出现的事实。375px 宽时不出现页面横向溢出（宽表放进 `.table-wrap`，SVG 用 viewBox 缩放）。控件可用键盘操作，按钮用 `<button>`，滑块用 `<input type="range">` 并配 `<label>`；数值变化处给 `aria-live="polite"`。

## 文字

图里的文字按 `kit/write/prose/grammar.md` 第 5 条写：标题、表头、标签、按钮、图例属于结构位置，单独撰写，用凝练的名词短语或动宾短语，同类并列，不从正文截句子，不写问句，不带口语。图注和步骤说明用完整书面句，补足独立读图所需的条件。术语与正文一致：保留原语言术语、对象 ID、provider 名称、单位（分、台、分钟、记账单位）和证据类别（合成、来源事实、推理）。不新造行业术语。所有数值必须与正文逐字一致；图件只能演示正文已有的计算和规则，不添加新的业务事实。正文说“合成”的，图注也写明合成。

## 验证

1. `cd demos/saas-engineering-textbook && node build/build.mjs` 无报错。
2. 用 jsdom（全局安装在 `/opt/homebrew/lib/node_modules/jsdom`，`require` 时用这个绝对路径）加载生成的页面，执行 `assets/book.js` 和你的图件脚本，确认：图件初始化无异常；逐步/逐个控件操作后，读数与正文的每个数字一致。验证脚本放在 scratchpad `/private/tmp/claude-501/-Users-lesprivilege-Projects-Praxis/c31d0cfe-ada7-4282-8c81-d8f50e93600e/scratchpad/`，不要放进仓库。
3. 回报：新建/修改的文件、在 Markdown 里插入的位置和回退内容、核对过的数字清单、你不确定或正文里自相矛盾的地方。
