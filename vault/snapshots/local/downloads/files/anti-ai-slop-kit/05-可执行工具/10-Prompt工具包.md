# Prompt 工具包（反 AI Slop）

> 用法：复制整块进 Claude / Cursor / Codex 的 system 或项目 `AGENTS.md`。  
> 原则：**正向约束 + 显式禁止 + 参考审美**。不要只说「make it beautiful」。

---

## 1. 通用 Frontend Aesthetics（改编自 Anthropic Cookbook）

```xml
<frontend_aesthetics>
You tend to converge toward generic "AI slop" frontends. Avoid this.

Typography:
- Choose distinctive, beautiful fonts. Never use Inter, Roboto, Open Sans, Lato, Arial as the primary face.
- Pair a display face with a refined body face, or one family with extreme weight contrast (200 vs 800).
- Size steps ≥ 1.25× between ranks. Body ≥ 16px. Measure 65–75ch.

Color & theme:
- Commit to one cohesive aesthetic. CSS variables only.
- Dominant color + sharp accent beats timid even palettes.
- No purple-to-blue gradients on white. No cyan-neon-on-dark as default "cool".
- No cream/beige as unmotivated "tasteful" default.

Motion:
- Prefer one orchestrated page-load (staggered opacity/transform) over scattered micro-interactions.
- No bounce/elastic dialogs. Ease-out-quart/quint/expo.
- Animate transform & opacity only — never width/height/margin for UI motion.
- Honor prefers-reduced-motion.

Layout:
- No 3 equal icon-feature cards as the default section.
- No cards-in-cards. No thick side-tab accent on rounded cards.
- No 01/02/03 section chrome or repeating uppercase kickers.
- Spacing has rhythm: tight within groups, generous between sections.

Copy:
- No "supercharge", "empower", "world-class", "next-generation".
- Limit em-dashes. No stacked aphorisms ("Not a feature. A platform.").
- Specific verbs and nouns only.

Backgrounds:
- Atmosphere if needed (subtle grain, restrained gradient, paper texture) — not orbs and glass soup.

Think outside the training-set median. Vary light/dark and type choices across projects.
</frontend_aesthetics>
```

---

## 2. 个人站专用 System 块

```xml
<personal_site>
Build a personal website, not a SaaS landing page.

Information architecture:
- First screen answers: who, what they do now, how to reach them.
- Sections: short intro, selected work/writing (unequal weight OK), now/about, contact.
- Forbidden default: Hero CTA + Features grid + Pricing + Testimonials.

Content rules:
- No lorem ipsum. Use provided real facts only; if missing, leave TODO comments.
- Every project links to a real URL (repo, live product, essay).
- Voice: first person, concrete, calm. No tag-cloud identity.

Visual rules:
- Pick ONE reference aesthetic named below and stay faithful.
- Max 2 type families. Max 1 accent color for interaction.
- border-radius ≤ 8px for cards; 999px only for pills/tags.
- Dense with meaning, not with chrome.

Accessibility:
- :focus-visible outlines required.
- Semantic headings without skips.
- Color contrast AA.

Performance:
- No full-page WebGL/video hero unless explicitly requested.
- Prefer CSS for motion.
</personal_site>
```

---

## 3. 审美参考卡片（选一张贴进 prompt）

### 3A. Swiss craft / design engineer
```
Aesthetic: Swiss minimalism with careful motion.
Reference spirit: rauno.me, paco.me, emilkowal.ski.
Black/white/gray + one sharp accent. Generous margin. Short sentences.
Motion: 200–300ms opacity/transform, staggered once on load.
No glassmorphism, no gradients on type.
```

### 3B. Editorial writer
```
Aesthetic: Quiet editorial blog.
Reference spirit: leerob.io, jvns.ca, eugeneyan.com.
High readability body, modest header, ink-on-paper or soft dark.
Serif or humanist sans for body optional. Longform measure 65–70ch.
Projects listed as annotated links, not marketing cards.
```

### 3C. Character collage (designer)
```
Aesthetic: Personal collage with a named brand color.
Reference spirit: commissioner.design.
Strong photography/objects from the person's life. One named hex (e.g. Cinnamon).
Playful but not random: grid still holds. Quotes and cultural refs allowed.
Avoid stock AI illustrations.
```

### 3D. Digital garden
```
Aesthetic: Growing notes garden.
Reference spirit: maggieappleton.com.
Uneven content maturity OK. Taxonomy: essays / notes / patterns.
Visual essays welcome; chrome stays quiet.
```

### 3E. 1970s ski lodge（反紫示例）
```
Aesthetic: 1970s ski lodge.
Colors: burnt orange, avocado green, warm brown, cream only as secondary.
Type: bold geometric display + readable serif body.
Layout: asymmetric, poster-like sections, not SaaS grid.
```

---

## 4. 禁止清单短贴（每次生成都带）

```
DO NOT USE:
- Inter, Roboto, Open Sans, Geist, Space Grotesk as primary
- Purple/indigo/violet gradients
- Three feature cards with icons in rounded squares
- Glassmorphism, neon glow orbs, gradient text
- bounce/elastic easing
- "Supercharge your workflow" style copy
- Section labels like 01 ABOUT / FEATURES kicker chips
- border-radius > 16px on content cards
- Nested cards with stacked shadows
```

---

## 5. 分维迭代 Prompt

### 只改字体
```
Redesign typography only. Keep layout and colors.
Never use Inter/Roboto/system-ui alone.
State font choices first, then implement with CSS variables.
Extreme weight contrast. Display + body pairing.
```

### 只改色
```
Replace the color system. No purple family.
Provide CSS variables: bg, surface, text, muted, accent, border.
Accent used only for links, focus, and primary buttons.
```

### 只改布局
```
Remove all equal card grids. Prefer single-column narrative with
occasional 2-col for work list. Uneven visual weight is good.
```

### 只改文案
```
Rewrite all UI strings. Specific, first-person, no buzzwords, max one em-dash per paragraph.
```

---

## 6. 参考驱动工作流 Prompt

```
I will describe 2 reference sites. Extract design DNA (type, color, space, motion, IA).
Then implement MY content with that DNA. Do not copy their text or logos.

Reference A: [url or description]
What works: [3 bullets]

Reference B: [url or description]
What works: [3 bullets]

My content:
[paste bio, projects, links]

Output: semantic HTML + CSS variables + minimal JS.
```

---

## 7. 审计 Prompt

```
Audit this page/code for AI slop using these categories:
color, type, layout, motion, copy, a11y.
Return a table: finding | severity | fix.
Then apply only severity=high fixes.
```

可配合 `09-检测清单.md` 条目编号。

---

## 8. AGENTS.md 迷你版（可直接落库）

```markdown
## Design constraints (anti-slop)
- No Inter-primary, no purple gradients, no 3-icon feature grids
- CSS variables for color/type/radius/easing
- radius cards ≤ 8px; motion = transform/opacity only
- Real content only; every project needs a live link
- focus-visible required; contrast AA
- Prefer references: paco.me / rauno.me structure over SaaS templates
```
