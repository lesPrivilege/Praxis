# Agent Skills 反 Slop 生态（2025–2026）

> 包内编号：`02` · 总序见 `00-发凡起例.md`  
> 调研刷新：2026-07-16  
> 补全 **coding agent skill 浪潮**——社区讨论量最大的一条工具线。

---

## 0. 一句话地图

```
Anthropic frontend-design (官方起点)
        │
        ├─► Impeccable (pbakaus)     ── 命令词汇 + 确定性检测 + Live Mode
        ├─► Taste Skill (Leonxlnx)   ── 多 skill 包 + 三旋钮 + 硬性 ban 清单
        ├─► UI UX Pro Max            ── 行业检索 + 设计系统生成（BM25）
        ├─► Superdesign skill        ── 无限画布设计 agent + design system 抽取
        └─► 大量 fork/变体            ── ux-skill、SDesign、design-anti-slop…
```

**共同问题**：模型默认采样「训练语料里的中位 SaaS 页」。  
**共同解法**：把品味编码成 **可安装的指令 / 可执行的规则 / 可检索的素材库**。

---

## 1. 星级与定位对照（约 2026-07 公开数据）

| 项目 | Stars（约） | 网站 | 形态 | 强项 | 弱项 / 风险 |
|------|-------------|------|------|------|-------------|
| **UI UX Pro Max** | ~106k | [uupm.cc](https://uupm.cc) | Skill + Python 检索引擎 + CLI | 行业→风格→色板→字体一条龙；22 技术栈 | 风格库本身若滥用会变成「另一种模板」；有 premium 分层 |
| **Taste Skill** | ~64k | [tasteskill.dev](https://www.tasteskill.dev/) | 多个 SKILL.md | 硬 ban 清单极细；三旋钮 VARIANCE/MOTION/DENSITY；赞助含 Emil Kowalski | 默认 skill 声明偏 landing/portfolio，不主打 dashboard |
| **Impeccable** | ~47k | [impeccable.style](https://impeccable.style/) | Skill + 23 commands + detector + 扩展 | **唯一成熟的确定性 slop 检测**（CI 可门禁）；PRODUCT.md/DESIGN.md | 安装面广，学习曲线在命令词汇上 |
| **Anthropic frontend-design** | 官方 skills 仓 | [anthropics/skills](https://github.com/anthropics/skills) | 单 SKILL.md | 正统源头；「avoid AI slop」写进官方叙事 | 无检测器；无命令系统 |
| **Superdesign** | 产品 + skill | [superdesign.dev](https://superdesign.dev/) | IDE 内设计 agent + skill | 从代码库抽 design system，无限画布迭代 | 偏「设计工具」而非纯规则包 |
| **Laith0003/ux-skill** | 较小 | GitHub | 152 规则 linter + MCP | 规则数量多、可 lint | 生态声量 < 前三 |
| **simonlin1212/SDesign** | 早期 | GitHub | 64 套 design system prompt | 复制粘贴 prompt 家族 | 更像 prompt 库 |

数据会变；以 GitHub stargazers 为准。**star 高 ≠ 品味高**，但说明 vibe-coding 圈的需求：  
「别再给我紫渐变 landing」。

---

## 2. Impeccable — 最「工程化」的反 slop

### 2.1 定位

- 作者：[Paul Bakaus](https://www.paulbakaus.com)（`pbakaus/impeccable`）  
- 口号：**给 agent 一套设计师词汇**，而不是再生成一个模板  
- 起源：从 Anthropic `frontend-design` 延伸；社区常说「uninstall other frontend skills, use this」  
- License：Apache-2.0  
- 安装：`npx impeccable install` → `/impeccable init`  
- 支持：Cursor / Claude Code / Codex / Copilot / Gemini / Grok Build / OpenCode 等

### 2.2 产品结构（源码可读）

| 路径/产物 | 作用 |
|-----------|------|
| `skill/` | agent skill 本体 + scripts（hook、live browser） |
| `cli/` | `npx impeccable detect` 等 |
| `extension/` | Chrome 扩展：任意页叠 detection overlay |
| `site/` | 文档站（Astro），自带 **Neo Kinpaku** 设计系统 |
| `DESIGN.md` | Google Stitch 兼容的可移植设计规格（frontmatter tokens + 长文规则） |
| `PRODUCT.md` | init 时写入的产品/受众/反参考 |
| hooks | Claude / Cursor / Codex / Copilot：改 UI 文件时跑 detector |

### 2.3 23 条命令（共享词汇）

按意图分组：

| 类 | 命令 |
|----|------|
| 系统 | `init` `document` `extract` `shape` `craft` |
| 评审 | `critique` `audit` `polish` |
| 方向旋钮 | `bolder` `quieter` `distill` `delight` `overdrive` |
| 学科 | `typeset` `colorize` `layout` `animate` `clarify` |
| 工程 | `harden` `onboard` `adapt` `optimize` `live` |

**用法心智**：你不是 prompt「做得好看一点」，而是 `/impeccable typeset the hero`——把设计决策拆成可重复的动词。

### 2.4 46 条 slop 规则（摘要）

完整交互目录：[impeccable.style/slop](https://impeccable.style/slop)

| 类别 | 代表性规则 |
|------|------------|
| 布局 | side-tab 粗色条、nested cards、identical card grids、01/02/03 markers、monotonous spacing |
| 字体 | flat hierarchy、overused font (Inter/Geist/Space Grotesk/Instrument Serif)、single font everything、italic serif hero、hero eyebrow pill、oversized full-sentence H1 |
| 颜色 | AI purple palette、dark+glow、gradient text、cream/beige 默认「品味」、gray-on-color |
| 组件 | icon-tile-above-heading、glassmorphism 装饰用、extreme radius、massive icons |
| 动效 | bounce/elastic easing、layout property animation、image hover transform |
| 文案 | em-dash 滥用、marketing buzzword、aphoristic cadence、theater framing |
| 质量 | low contrast、skipped headings、line length、cramped padding 等 |

检测分流：

- **CLI 确定性**（无需 LLM）：多数视觉/CSS 可扫  
- **Browser**：需布局的规则  
- **LLM-only**：glassmorphism 意图、hero metrics 语义等  
- **opt-in provider tells**：`--gpt` / `--gemini` 针对特定模型习惯

```bash
npx impeccable detect src/
npx impeccable detect https://example.com
npx impeccable detect --json .   # CI
```

### 2.5 自家站点的「反 slop 示范」：Neo Kinpaku

`DESIGN.md` 不是空话——Impeccable 官网自己用 **黑漆 + 金箔 (kinpaku) + 铜绿 (verdigris)**：

- 禁止：紫渐变、霓虹、玻璃拟态、斜体衬线 hero、cream 作默认深色主题底  
- 圆角：小（2–16px 阶，不用 blob）  
- 阴影：几乎不用；靠 hairline + 材质  
- 字体：Alumni Sans（display）+ Albert Sans（body），**weight inversion**（h1 更轻、h2 更重）  
- kit 原语：`.ks-button` / `.ks-bento` / `.ks-section`——禁止每页发明新 card 类

**启示**：反 slop 产品自己也必须有 **可叙述的材料系统**，否则网站本身就是 slop。

### 2.6 社区用法（2026-07 X）

高频组合：

1. Impeccable `audit`/`critique` 指出问题 → Emil / motion skill 修动效  
2. GPT 强模型 + Impeccable skill 做 landing  
3. 「手写 de-slop skill」用户迁移到 Impeccable 内置检测  

---

## 3. Taste Skill — 最「规则暴力」的 ban 清单

### 3.1 定位

- Repo：`Leonxlnx/taste-skill`  
- 站：tasteskill.dev  
- License：MIT  
- 赞助：Vercel OSS Program + **Emil Kowalski / animations.dev**（设计工程圈信用背书）  
- 安装：`npx skills add Leonxlnx/taste-skill`  
- 默认 skill 名：`design-taste-frontend`（v2 experimental）

### 3.2 技能矩阵

| Skill | Install name | 用途 |
|-------|--------------|------|
| taste-skill (v2) | `design-taste-frontend` | 默认：读 brief → 推断方向 → 硬 pre-flight |
| taste-skill-v1 | `design-taste-frontend-v1` | 钉死旧行为 |
| gpt-tasteskill | `gpt-taste` | 对 GPT/Codex 更严 |
| image-to-code | `image-to-code` | 先出图 → 分析 → 实现 |
| redesign | `redesign-existing-projects` | 先 audit 再改 |
| soft / minimalist / brutalist | 风格包 | 方向已定后用 |
| output | `full-output-enforcement` | 防半成品输出 |
| stitch | `stitch-design-taste` | Google Stitch / DESIGN.md |
| imagegen-web/mobile/brandkit | 仅出图 | 参考板 |

### 3.3 三旋钮（源码核心隐喻）

```
DESIGN_VARIANCE  1–10  对称 → 非对称
MOTION_INTENSITY 1–10  静态 → 电影/物理
VISUAL_DENSITY   1–10  画廊空气 → cockpit 密
```

基线常见：`8 / 6 / 4`（landing 偏实验但不乱）。

### 3.4 v2 SKILL.md 里值得单独记的硬规则

从 `skills/taste-skill/SKILL.md` 提炼（**规则本身可抄进自己的 AGENTS.md**）：

1. **Brief inference 先于代码**：先输出一行 “Reading this as: …”  
2. **Anti-default**：紫渐变、三等分 feature card、Inter+slate-900、玻璃铺满  
3. **Serif 纪律**：Fraunces / Instrument Serif 作默认 display 被 ban；serif 仅在真正 editorial/luxury 且能说理时  
4. **Premium-consumer 米色+黄铜 palette 被 ban 为默认**（cookware/wellness 类最常中招）  
5. **Eyebrow 配额**：最多每 3 个 section 1 个 uppercase tracking 小标签  
6. **Em-dash 全禁**（比 Impeccable 更激进）  
7. **Hero 文本元素 ≤ 4**；subtext ≤ 20 词；top padding 有 cap  
8. **禁止 div 假截图** / 假任务列表 / 假 terminal  
9. **Marquee 全页最多 1**；zigzag 图文交替最多连续 2  
10. **GSAP sticky-stack / horizontal-pan 有 canonical skeleton**（可直接当实现模板）  
11. **适用边界写死**：landing / portfolio / redesign —— **不是 dashboard**

### 3.5 与 Impeccable 的分工

| | Taste Skill | Impeccable |
|--|-------------|------------|
| 主交付 | 生成时约束（prompt 内） | 生成后检测 + 命令式改稿 |
| 确定性检测 | 弱（靠 pre-flight 自检文） | 强（CLI/CI） |
| 命令 UX | 少 | 23 命令 + live |
| 规则口吻 | 极细 ban，偏 marketing 页 | 学科词汇 + brand/product 双寄存器 |

**实践推荐**：生成用 Taste 或 Pro Max → 定稿前 `impeccable detect` + `critique`。

---

## 4. UI UX Pro Max — 最大的「设计情报」库

### 4.1 定位

- Repo：`nextlevelbuilder/ui-ux-pro-max-skill`  
- 站：uupm.cc  
- 核心：`scripts/search.py` + CSV 数据域 + BM25  
- 安装：`npm i -g ui-ux-pro-max-cli` → `uipro init --ai claude|cursor|…`

### 4.2 数据规模（README 宣称）

- 84 UI styles（含 Soft UI、Neubrutalism、Bento、Anti-Polish…）  
- 192 product types + 对齐色板  
- 74 font pairings  
- 161 industry reasoning rules  
- 98 UX guidelines  
- 22 tech stacks（Web 到 SwiftUI / Flutter / WinUI）

### 4.3 工作流

```
用户：「做一个美业 spa 落地页」
  → 多域并行检索（产品类型 / 风格 / 色 / 字体 / landing pattern）
  → reasoning engine 输出完整 design system ASCII/Markdown
  → 含 anti-patterns 与 pre-delivery checklist
  → 可 --persist 到 design-system/MASTER.md + pages/*
```

### 4.4 源码架构启示

```
src/ui-ux-pro-max/
  data/*.csv          # 真源数据
  scripts/*.py        # 检索与 design-system 生成
  templates/          # 各 AI 平台 skill 模板
cli/                  # 安装器，生成各 harness 文件
```

**反 slop 价值**：用「行业规则」打断模型的紫默认（例如 banking 明确 avoid AI purple）。  
**风险**：style 名本身（Glassmorphism、Aurora）若被机械套用，会产出 **有标签的 slop**。需要人做最终「这一页只选一个北星」。

### 4.5 生态衍生

- Issue #219：有人用其 anti-pattern 数据库做 PR slop detector（vibecheck-slop-stopper）  
- Medium/Instagram 大量「End of AI Slop」营销帖——**声量高，需交叉验证质量**

---

## 5. 其他相关项目（顺藤摸瓜）

| 项目 | 链接 | 备注 |
|------|------|------|
| Anthropic frontend-design | github.com/anthropics/skills/.../frontend-design | 官方：distinctive, avoid AI slop |
| Claude 博客 | claude.com/blog/improving-frontend-design-through-skills | Skills 动态加载叙事 |
| Superdesign skill | github.com/superdesigndev/superdesign-skill | `npx skills add superdesigndev/superdesign-skill` |
| Superdesign app | superdesign.dev | 无限画布 mock → 导出 style.md |
| Laith0003/ux-skill | github.com/Laith0003/ux-skill | 152 规则 linter + MCP 18 tools |
| SDesign | github.com/simonlin1212/SDesign | 64 design systems / 6 aesthetic families |
| 21st.dev | https://21st.dev/ | **「Crafted React components, not AI slop」** 社区组件注册表 + prompt |
| details.so | https://www.details.so/ | 按细节分类的交互画廊 + Vault 可复制动画代码 |
| transitions.dev | github.com/Jakubantalik/transitions.dev | 转场相关 skill（X 推荐列表常见） |
| peakoss/anti-slop | GitHub Action | 关低质 AI PR（代码 slop，非 UI） |
| yousentmeaislop.com | 社交「甩锅」链接 | 文案/沟通 slop，非 UI |
| design-anti-slop (emraher) | MCP Market | 审计 mesh gradient 等 |

---

## 6. 灵感画廊（agent 时代书签扩展）

旧版 `06` 已有 recent / designspells / awwwards / mobbin。  
**2026 agent 圈额外高频：**

| 站 | 角色 |
|----|------|
| [recent.design](https://recent.design/) | 原 godly.website 系策展 |
| [land-book.com](https://land-book.com/) | Landing 手选 |
| [details.so](https://www.details.so/) | Hero/转场/footer **细节**级 |
| [21st.dev](https://21st.dev/) | 可装组件 + AI 友好 prompt |
| [mobbin.com](https://mobbin.com/) | 产品 UI 流 |
| [toools.design](https://www.toools.design/) | 工具目录（2200+） |
| [sneakpeek.design](https://www.sneakpeek.design/) | 顶设 Figma 透视 |
| [shapeof.ai](https://www.shapeof.ai/) | 为 AI 产品做设计 |
| [uncut.wtf](https://uncut.wtf/) | 字体 |
| [tinkerfont.com](https://tinkerfont.com/) | 任意站点换字体试 |

X 典型帖（2026-07）：  
「Stop asking AI to design from zero → Awwwards / recent.design / onepagelove / Mobbin / motion 参考 → 再 prompt Claude/Codex」。

---

## 7. 文化层：Anti-slop 不只是 UI

[Guardian, 2026-06-08](https://www.theguardian.com/technology/2026/jun/08/anti-slop-ai-art)：艺术家与商业创意走向 **刻意手工、janky、homespun**（Michael Schmelling 书籍封面、Stoopid Buddy 定格动画广告）。  
Packers 社媒直接写：**「Your AI slop bores us.」**

两条平行美学：

| 支 | 特征 | 对应 web |
|----|------|----------|
| **Craft minimal** | 材料诚实、排版、交互细节 | Rauno / Emil / Paco / Linear 系 |
| **Anti-slop handmade** | 涂鸦、粗糙、停格、非光滑 | 部分 portfolio、brutalist、editorial |

两者都反「光滑无作者」；**不要混成「既粗糙又紫渐变」**。

Merriam-Webster 2025 Word of the Year：**slop** = 通常由 AI 大量生产的低质数字内容。

---

## 8. 推荐组合拳（按场景）

### A. 个人站 / 作品集

1. 人定：人设、禁止清单、2–3 参考站（见 `03-范例档案/04-个人站档案`）  
2. Taste Skill 或 Anthropic frontend-design 约束生成  
3. `npx impeccable detect` + 人工 checklist（`03`）  
4. 动效参考 Emil（animations.dev）/ details.so Vault  

### B. SaaS landing（vibe coding）

1. UI UX Pro Max 生成行业 design system → 写入 `design-system/MASTER.md`  
2. Impeccable `init` 写 PRODUCT.md（anti-references 写满）  
3. Taste v2 或 Impeccable `craft`  
4. CI：`impeccable detect --json`  

### C. 已有代码库改观

1. Impeccable `document` → DESIGN.md  
2. Taste `redesign` 或 Impeccable `audit` + `polish`  
3. Superdesign：从现有页抽 replica HTML + design-system  

### D. 不要做的事

- 同时装 5 个 frontend skill 无优先级（冲突规则互相抵消）  
- 只用 Pro Max 的 style 名当 prompt（「做 glassmorphism」= 主动要 slop）  
- 用 AI 生成「反 AI」文案（em-dash 与 theater framing 会立刻露馅）  

---

## 9. 源码级「可偷」清单

| 偷什么 | 从哪 |
|--------|------|
| 46 条检测语义 | impeccable.style/slop + CLI 规则 id |
| 命令词汇设计 | Impeccable README 23 commands |
| 硬 ban 文案/布局 | Taste Skill SKILL.md §4–§9 |
| 三旋钮模型 | Taste Skill §1 |
| 行业 anti-pattern | UI UX Pro Max reasoning CSV / design-system 输出 |
| 完整品牌系统示例 | Impeccable `DESIGN.md` Neo Kinpaku |
| 个人站 tokens | Brittany Chiang variables.js（见 `03-范例档案/05-源码拆解与Tokens`） |
| 组件级非 slop 起点 | 21st.dev 手选组件 + 改 token |

---

## 10. 本文件在 kit 中的位置

| 路径 | 角色 |
|------|------|
| `00-发凡起例.md` | 总序与读法 |
| `01-问题与原则/01-…` | 问题定义 + 原则 |
| **`02-社区生态/02-…`（本文件）** | **Agent skill 生态** |
| `03-范例档案/` | 个人站 + 冷调拆解 + 截图 |
| `05-可执行工具/` | checklist · prompt · AGENTS 片段 |

读法建议：发凡 → 本文件 → `05/09` 检测清单 → 动手。
