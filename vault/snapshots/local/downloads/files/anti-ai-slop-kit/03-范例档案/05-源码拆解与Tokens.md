# 源码与 Repo 拆解

> 目标：从可审计仓库提取 **可复用 DNA**，而不是复制整站皮肤。

---

## 1. 高价值开源个人站

| Repo | Stars（约） | 栈 | 学什么 | 勿盲抄 |
|------|-------------|-----|--------|--------|
| [bchiang7/v4](https://github.com/bchiang7/v4) | 很高 | Gatsby, styled-components | tokens、a11y focus、分区组件 | Navy+mint 已成模板 |
| [pacocoursey/paco](https://github.com/pacocoursey/paco) | ~300 | Next 12, postcss, next-themes | 极简信息架构、主题切换 | 已 archived，现网可能已变 |
| [brianlovin/brian-lovin-next](https://github.com/brianlovin/brian-lovin-next) | ~2.2k | Next + TS | 产品化个人站模块 | 体量大，按需读 |
| [leerob/leerob.io](https://github.com/leerob/leerob.io) | ~7.5k | Next + MDX + Tailwind | 博客/内容站骨架 | Tailwind 默认易滑向 slop |
| [joshwcomeau/blog](https://github.com/joshwcomeau/blog) | 历史版 | JS | 文章内交互思路 | OLD VERSION |
| [emmabostian/developer-portfolios](https://github.com/emmabostian/developer-portfolios) | 列表 | — | 灵感索引 1800+ | 质量参差，需自筛 |
| [logancyang/awesome-personal-websites](https://github.com/logancyang/awesome-personal-websites) | 小而精 | — | ML/研究型站列表 | 偏 2020 |

---

## 2. Brittany Chiang v4 — Design Token 解剖

路径：`src/styles/variables.js`

### 2.1 色板（有叙事的深色系统）

```css
--dark-navy: #020c1b;
--navy: #0a192f;           /* 页面底 */
--light-navy: #112240;
--lightest-navy: #233554;
--navy-shadow: rgba(2, 12, 27, 0.7);
--dark-slate: #495670;
--slate: #8892b0;          /* 正文 */
--light-slate: #a8b2d1;
--lightest-slate: #ccd6f6; /* 标题近白 */
--white: #e6f1ff;
--green: #64ffda;          /* 唯一强调：链接/焦点/编号 */
--green-tint: rgba(100, 255, 218, 0.1);
```

**反 slop 要点**：强调色单一；正文用 slate 阶，不用纯灰 #999；无紫。

### 2.2 字体与字号阶

```css
--font-sans: 'Calibre', 'Inter', 'San Francisco', 'SF Pro Text', system-ui, sans-serif;
--font-mono: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;

--fz-xxs: 12px; … --fz-heading: 32px;
```

**注意**：fallback 含 Inter——学习其 **阶梯**，展示标题可换掉 Calibre/Inter。

### 2.3 动效 tokens

```css
--easing: cubic-bezier(0.645, 0.045, 0.355, 1);
--transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
--border-radius: 4px;  /* 克制！不是 16/24 */
```

### 2.4 无障碍（GlobalStyle）

- `:focus-visible` → `outline: 2px dashed var(--green); outline-offset: 3px`  
- 鼠标 `:focus:not(:focus-visible)` 去环  
- `::selection` 使用系统色  
- 自定义 scrollbar 与主题一致  

**这是开源站里最值得直接偷的一段。**

### 2.5 依赖里的「动效诚实」

- `animejs` / `scrollreveal`：入场编排，不是 bounce modal  
- 无 three.js 首页负担  

---

## 3. Paco (pacocoursey/paco) — 架构解剖

### 3.1 package.json 信号

| 依赖 | 含义 |
|------|------|
| `next` | 页面路由 + 博客 |
| `next-themes` | 认真对待 dark mode（作者即库作者） |
| `cmdk` | 命令菜单 = 个人站也可是产品感 |
| `use-delayed-render` | 动画卸载时序 craft |
| `prism-react-renderer` | 代码高亮服务写作 |
| postcss-preset-env | 现代 CSS，少 runtime CSS-in-JS |

### 3.2 目录哲学

```
components/  data/  lib/  pages/  posts/  styles/
```

- **posts + data**：内容与展示分离  
- **无** `components/Hero.tsx` + `FeatureGrid.tsx` SaaS 脚手架  
- styles：`global.css` / `inter.css` / `markdown.css` / `syntax.css` / `nprogress.css`

### 3.3 真实 tokens（archived `styles/global.css`）

```css
:root {
  --gap-quarter: 0.25rem;
  --gap-half: 0.5rem;
  --gap: 1rem;
  --gap-double: 2rem;
  --small-gap: 4rem;
  --big-gap: 4rem;
  --main-content: 45rem;   /* 阅读栏宽度 = 设计决策 */
  --radius: 8px;
  --inline-radius: 5px;

  --font-sans: 'Inter', -apple-system, …, sans-serif;
  --font-mono: 'SFMono-Regular', 'Consolas', 'Menlo', monospace;

  --transition: 0.1s ease-in-out;
  --transition-slow: 0.3s ease-in-out;

  /* dark default */
  --bg: #131415;
  --fg: #fafbfc;
  --gray: #666;
  --article-color: #eaeaea;
  --header-bg: rgba(19, 20, 21, 0.45);
  --selection: rgba(255, 255, 255, 0.99);
}

[data-theme='light'] {
  --bg: #fff;
  --fg: #000;
  --article-color: #212121;
  --header-bg: rgba(255, 255, 255, 0.8);
  --selection: rgba(0, 0, 0, 0.99);
}
```

其它 craft 细节：

- `::selection` **反色**（selection 色 = 对侧 bg）  
- body 正文字号 `1.125rem`，`letter-spacing: -0.33px`  
- 标题 weight 600、h1 `2.5rem` / line-height 1.25  
- 主题靠 `data-theme` 翻转整组变量  

### 3.4 重要修正：Paco 用过 Inter，为何仍不算 slop？

开源历史版主字体就是 **Inter**。这不推翻反 Inter 规则，而是精确化：

| 年代 | Inter 的含义 |
|------|----------------|
| ~2019–2021 craft 站 | 有意识选的中性 UI 字 + 强间距/主题系统 |
| 2024–2026 AI 默认 | 无选择时的统计中心 → **slop 签名** |

**反 slop 禁的是「无决策的 Inter」，不是「永远不许 Inter」。**  
若全站只有 Inter 且无 measure/主题/节奏，就是 slop；若有完整 token 系统与声音，字体只是一环。

现网 paco.me 可能已迭代；以现网为准，开源 repo 学 **变量与结构**。

### 3.5 可学交互

- 主题切换不闪烁（next-themes 模式）  
- 延迟渲染避免动画闪断  
- 个人站可承载「小产品」（cmd palette）作为 craft 证明  

---

## 3b. 现网栈快照（2026，package.json）

### brianlovin/brian-lovin-next（产品级个人站）

- Next 16 + React 19 + Turbopack  
- `motion`、`cmdk`、`sonner`、`next-themes`  
- Tailwind 4、shiki、Notion CMS、Upstash rate limit、OG image  
- **启示**：个人站可以当小型产品做（缓存、RSS、热键、虚拟列表），而不必做成 SaaS 落地页皮  

### leerob/leerob.io（内容站）

- Next 16 + MDX + Tailwind 4  
- `sugar-high` 代码高亮、framer-motion、几乎无重依赖  
- **启示**：写作型站保持依赖极瘦；反 slop 靠内容与排版，不靠库数量 

---

## 4. Lee Robinson / Brian Lovin — 内容站 vs 产品站

### leerob.io
- MDX 优先：文章是一等公民  
- Tailwind：效率高，但 **必须自带禁止清单**，否则 AI 续写易紫  
- 适合：写作者、课程作者  

### brian-lovin-next
- TypeScript 全站  
- 模块多（bookmarks、app 感）  
- 适合：想展示「能做产品」的设计师/工程师  

---

## 5. 源码阅读清单（按优先级）

### P0（2 小时内）
1. bchiang7/v4 `src/styles/variables.js` + `GlobalStyle.js`  
2. bchiang7/v4 `src/components/sections/` 信息架构  
3. pacocoursey/paco `pages/index` + `styles/`  

### P1（半日）
4. brianlovin 的 design system 组件边界  
5. leerob MDX 管道  
6. cmdk 仓库（交互细节，非个人站但同源审美）  

### P2（进阶）
7. next-themes 实现  
8. 自选一个 Awwwards 站 View Source（只学一项技术）  
9. Devouring Details（付费/产品）交互章节  

---

## 6. 从源码提炼的「实现规范」

```text
1. 所有色/字号/半径/easing 进 CSS variables
2. border-radius 默认 ≤ 8px；pill 仅 button/tag
3. transition 只动 transform/opacity（及必要的 color）
4. 必须有 :focus-visible 可见环
5. 正文 max-width: 65ch ~ 75ch
6. 减少第三方字体；display + body 最多两族
7. 图片必须有真实 src 与尺寸，禁止空占位
8. 动效 duration 150–300ms 交互；入场可 staggered
9. 禁止 animate height/width/top/left（用 transform）
10. 暗色主题单独测对比度（WCAG AA）
```

---

## 7. View Source 野外技巧

对无开源站：

```bash
# 快速抓 CSS 变量与字体
curl -sL https://example.com | rg -o 'font-family:[^;]+' | head
curl -sL https://example.com | rg -o '--[a-z0-9-]+:\s*[^;]+' | head -40
```

或 DevTools：
1. Computed → 点标题看 font-family  
2. 搜索 `--` 变量  
3. Performance 看首屏 JS 重量  
4. Accessibility 树看标题层级是否跳级  

---

## 8. 相关「非个人站」但同源 craft 的库

| 项目 | 作者语境 | 学什么 |
|------|----------|--------|
| [cmdk](https://github.com/pacocoursey/cmdk) | Paco | 焦点、键盘、过滤动画 |
| [next-themes](https://github.com/pacocoursey/next-themes) | Paco | 无闪烁主题 |
| [sonner](https://github.com/emilkowalski/sonner) | Emil | toast 动效与克制 |
| [vaul](https://github.com/emilkowalski/vaul) | Emil | drawer 手势 |
| Radix UI | Pedro 生态 | 无障碍 primitive |

做个人站时 **借用这些库的交互品味**，比借用 SaaS 落地页模板更安全。
