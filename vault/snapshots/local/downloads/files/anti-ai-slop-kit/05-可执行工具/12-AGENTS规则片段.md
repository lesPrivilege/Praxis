# Anti-Slop Rules（可贴进 AGENTS.md / CLAUDE.md）

## 硬禁止

1. 主字体不得为 Inter / Roboto / Open Sans / Geist / Space Grotesk 独占  
2. 禁止紫/靛渐变作为默认品牌色；禁止渐变文字标题  
3. 禁止「Hero + 三等分 icon 卡片」作为默认结构  
4. 禁止 card 嵌套 card；禁止侧边粗色条 rounded card  
5. 禁止 bounce / elastic UI 动效；禁止 animate width/height  
6. 禁止 Supercharge / Empower / World-class 等套话  
7. 禁止 lorem 与空 img src  
8. 禁止 01/02/03 section 脚手架与每节 uppercase kicker  

## 硬要求

1. 色/字号/半径/easing 必须进 CSS variables  
2. 卡片 radius ≤ 8px（pill 仅用于 tag/button）  
3. 正文 measure 65–75ch；字号级差 ≥ 1.25  
4. `:focus-visible` 可见焦点环  
5. 对比度 WCAG AA  
6. `prefers-reduced-motion` 尊重  
7. 个人站首页 10 秒内说清身份与现状  
8. 每个项目必须有可点击真实链接  

## 流程

1. 先写禁止清单 + 2 个参考站 DNA  
2. 再写真实文案  
3. 再生成代码  
4. 对照 checklist / impeccable detect  

## 参考精神（结构，非皮肤）

- paco.me / rauno.me / emilkowal.ski — 极简 craft  
- leerob.io / delba.dev — 内容优先  
- commissioner.design — 人设材料（仅当你真有材料）  

## Agent 工具（可选装）

- 生成约束：`npx skills add Leonxlnx/taste-skill`
- 检测门禁：`npx impeccable install` → `npx impeccable detect src/`
- 行业系统：`uipro init --ai <harness>`（UI UX Pro Max）
- 细节见包内 `02-社区生态/02-Agent-Skills生态.md`

## 补充（Taste / Impeccable 共识，2026）

9. 禁止 em-dash 滥用与「Not X. A Y.」aphorism 文案  
10. 禁止 Instrument Serif / Fraunces 作无理由的默认 display  
11. 禁止 cream/beige 作无品牌理由的默认「品味底」  
12. Eyebrow（uppercase tracking 小标签）全页配额克制  
13. 禁止 div 拼的假 product screenshot / 假 terminal  

## 一句话

**反 slop = 有人决定什么不做 + 材料（HTML/CSS/JS）诚实 + 一个人的声音。**
