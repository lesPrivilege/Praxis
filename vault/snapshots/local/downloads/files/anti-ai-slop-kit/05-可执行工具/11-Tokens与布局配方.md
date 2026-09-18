# Tokens 与设计配方

> 可直接粘贴改造。**不要整包当皮肤**——改强调色与字体以匹配你自己。

---

## 1. 极简深色 Craft（Brittany 系改编 · 换掉 mint 防克隆感）

```css
:root {
  /* surface */
  --bg: #0b0f14;
  --bg-elevated: #141a22;
  --border: #243041;

  /* text */
  --text: #c5ced9;
  --text-strong: #eef3f8;
  --text-muted: #7d8b9a;

  /* accent — 示例：琥珀，非 mint/紫 */
  --accent: #e8a838;
  --accent-dim: rgba(232, 168, 56, 0.12);

  /* type */
  --font-sans: "IBM Plex Sans", "Segoe UI", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;
  --fz-body: 1.125rem;
  --fz-small: 0.875rem;
  --fz-h1: clamp(1.75rem, 3vw, 2.25rem);
  --lh-body: 1.65;
  --measure: 68ch;

  /* chrome */
  --radius: 4px;
  --radius-pill: 999px;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 1rem;
  --space-4: 1.5rem;
  --space-5: 2.5rem;
  --space-6: 4rem;
  --easing: cubic-bezier(0.645, 0.045, 0.355, 1);
  --t-fast: 150ms var(--easing);
  --t-med: 250ms var(--easing);
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  font-size: var(--fz-body);
  line-height: var(--lh-body);
  -webkit-font-smoothing: antialiased;
}

.prose {
  max-width: var(--measure);
}

a {
  color: var(--accent);
  text-underline-offset: 0.15em;
}

:focus-visible {
  outline: 2px dashed var(--accent);
  outline-offset: 3px;
}

:focus:not(:focus-visible) {
  outline: none;
}
```

---

## 2. 纸感浅色 Editorial（Lee / 写作站）

```css
:root {
  --bg: #f7f4ef;
  --bg-card: #fffdf9;
  --ink: #1a1a1a;
  --ink-muted: #5c5c5c;
  --accent: #0b3d2e; /* 深松绿，非紫 */
  --rule: #e0d8cc;

  --font-display: "Newsreader", "Iowan Old Style", Georgia, serif;
  --font-body: "Source Serif 4", Georgia, serif;
  --font-ui: "Source Sans 3", system-ui, sans-serif;

  --measure: 65ch;
  --radius: 2px;
  --space-section: 4.5rem;
}

h1, h2, h3 {
  font-family: var(--font-display);
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--ink);
}

body {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--ink);
}
```

**注意**：cream 背景这里有「纸」的语义动机；Impeccable 警告的是 **无动机的 cream 默认**。

---

## 3. 近单色 Swiss（Paco / Rauno 精神）

```css
:root {
  --bg: #fafafa;
  --fg: #111;
  --muted: #666;
  --line: #eaeaea;
  --accent: #111; /* 链接可用 underline 而非第二色 */
  --font: "Helvetica Neue", Helvetica, Arial, sans-serif;
  --mono: "SF Mono", Menlo, monospace;
  --max: 640px;
  --pad: 24px;
}

/* 暗色翻转 */
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0a0a0a;
    --fg: #ededed;
    --muted: #a1a1a1;
    --line: #222;
  }
}

.layout {
  max-width: var(--max);
  margin: 0 auto;
  padding: var(--pad);
}
```

---

## 4. 字体配对菜单（避开 Inter 陷阱）

| 气质 | Display | Body | 备注 |
|------|---------|------|------|
| 工程冷静 | IBM Plex Sans | IBM Plex Sans | 同族多 weight |
| 工程 + 代码 | Söhne / Geist **慎用** | IBM Plex Mono 点缀 | Geist 已过热 |
| 编辑 | Newsreader / Fraunces | Source Serif 4 | 长文 |
| 尖锐现代 | Bricolage Grotesque | Inter **仅 body fallback** | display 要有性格 |
| 人文 | Literata | Source Sans 3 | 研究站 |
| 复古技术 | IBM Plex Mono | IBM Plex Sans | 终端感克制用 |
| 瑞士 | Neue Haas / Helvetica | 同 | 系统字体诚实 |

**规则**：先定 display，再定 body；写进 CSS 变量；prompt 里点名。

---

## 5. 间距节奏配方

```css
/* 不要全局 gap: 1rem */
.stack-tight > * + * { margin-top: 0.5rem; }
.stack > * + * { margin-top: 1rem; }
.stack-loose > * + * { margin-top: 2rem; }
.section + .section { margin-top: 4.5rem; }
```

相关信息用 tight；section 用 loose。

---

## 6. 入场动效（一次编排，非 bounce）

```css
@keyframes rise {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
}

[data-animate] {
  animation: rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

[data-animate="2"] { animation-delay: 60ms; }
[data-animate="3"] { animation-delay: 120ms; }

@media (prefers-reduced-motion: reduce) {
  [data-animate] { animation: none; }
}
```

---

## 7. 布局配方（个人站）

### 7A. 单栏叙事（推荐默认）
```
[name]
[1–3 sentence bio]
[selected work — list, not equal cards]
[writing]
[now]
[contact]
```

### 7B. 左导航 + 右内容（Brittany 变体）
```
aside: name, links, social
main: experience timeline, projects
```

### 7C. Garden 索引
```
header manifesto
grid of note cards with maturity tags (seedling/budding/evergreen)
```

### 7D. 避免的默认
```
centered hero
H1 12 words display size
subtitle
[Get Started] [Learn More]
3 feature cards
logo cloud
pricing
```

---

## 8. 组件克制表

| 需要 | 用 | 不用 |
|------|----|------|
| 分组 | 间距 + 小标题 | 嵌套 card |
| 强调链接 | 下划线 + accent | 渐变按钮 + glow |
| 项目列表 | dl / 表格式行 | 相同高度 bento |
| 分隔 | 1px hairline | 双阴影板块 |
| 标签 | 小 caps + 细 tracking | 大 pill 彩虹 |
| 头像/照片 | 真实照片 | AI 头像插画 |

---

## 9. 从摄影/电影取色（反训练默认）

1. 选一张你喜欢的静帧 / 照片  
2. 吸 5 色：深底、浅底、主、辅、强调  
3. 丢弃最接近 `#6366f1` / `#8b5cf6` 的色  
4. 强调色只用于 interactive  

工具：浏览器取色、Coolors 从图生成、Happy Hues。

---

## 10. 最小可用 HTML 骨架

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Your Name</title>
  <link rel="stylesheet" href="tokens.css" />
</head>
<body>
  <main class="layout">
    <header data-animate>
      <h1>名字</h1>
      <p class="lede">一句话：现在在做什么 + 对谁有用。</p>
    </header>

    <section class="section" data-animate="2" aria-labelledby="work">
      <h2 id="work">Work</h2>
      <ul class="work-list">
        <li>
          <a href="https://…">项目名</a>
          <span class="muted">— 具体贡献一句</span>
        </li>
      </ul>
    </section>

    <section class="section" data-animate="3" aria-labelledby="now">
      <h2 id="now">Now</h2>
      <p>当前关注…</p>
    </section>

    <footer class="section">
      <a href="mailto:you@domain">email</a>
      ·
      <a href="https://github.com/you">github</a>
    </footer>
  </main>
</body>
</html>
```
