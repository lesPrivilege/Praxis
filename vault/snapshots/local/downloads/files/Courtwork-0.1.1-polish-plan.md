# Courtwork 架构续任 · 0.1.1 收束与 Polish 安排

**角色**：架构会话（发单 / 验收 / 拍板 / 板面；不写实现码，docs 例外）  
**再水化入口**：`docs/90` → README 状态行 → `docs/11` 末 + `docs/55` → `git log refs/heads/main -25`  
**板面权威时点**：2026-07-11 夜，经本会话仓库核验后**校正**（见 §0）

---

## 0. 再水化发现：板面 vs 仓库真相

### 0.1 产品与宪法（不变）

- **论纲**（docs/92）：卖秩序不卖能力——场景化、防呆、承诺、留痕；模型越便宜，秩序越值钱。
- **形态**：文件夹级协作 workharness；schema 握手（docs/53）= 推理限定 / 右侧工作面 / 记忆投影三位一体；chat 只叙事。
- **治理三角**（AGENTS.md）：实现与验收异会话；契约拍板独属架构；纪律对模型一视同仁。
- **当前任命口径**：实现默认 Grok / 重型 Opus / B 阶 UI 曾任命 sol；验收 sol 或 Claude 互查池。

### 0.2 仓库物理态（核验铁证）

| 事实 | 证据 |
|---|---|
| `main` tip | `a1f6355`（RP-2.11 追加⑧ **仅 docs**） |
| 共享检出 HEAD | 常在 `codex/sol-courtwork-rp2ui-b@24c61bd`（手册判例：须显式读写 `refs/heads/main`） |
| 版本 | 仍 **0.1.0**（package / tauri.conf）；BUILD-1 已录 SPEC |
| Playwright floor on main | **146** |
| PRV-1 实现 | **在 main**（`193fa7e`） |
| QF-1 | **在 main**（`4389bf3`，队列语义改 `session.completed`） |
| RP-2.10 | **在 main** + 验收放行（`24c61bd` / `a7c3e83`） |
| **QF-2 实现** | **仅在 `codex/qf2`**（`79f72c4` / `001465b` / `ed0ee67`）— **`merge-base --is-ancestor` 对 main 为假** |
| RP-2.11 实现 | **未见任何分支合入 main**；批复与⑧仅 docs（`6f1d59b` / `a1f6355`） |
| PRV-1 验收报告 | ACCEPTANCE.md **无「PRV-1 验收」节**（仅实现 + 验收 prompt 发出） |
| ThinkingStream on main | 仍 **brand-mark SVG**（#26.3）；RP-2.11 改判「字符 ▏」尚未落地 |

### 0.3 关键漂移（架构必须先纠）

1. **QF-2 假清账**：`docs/90` / `docs/55` 写「阻断清零」，但 main 上 `queuedMessages` **无 `caseId`**，FileOps 报告红action 仍可能漏相对路径化——代码在侧支 `codex/qf2` 未 merge。**收账提交信息 ≠ 合流**（与「提交信息声称、diff 未包含」同族教训）。
2. **README 过期**：仍写「2026-07-10 全部工单放行、Build 段完成」——与 0.1.1 未出、真 key 未跑冲突；归 RM-1。
3. **SPEC 状态行滞后**：仍提「RP-2.8.1 待单点复验」等；RP-2.10/QF 叙事未统一。
4. **principles vs 49 修宪**：阴影白名单、三列贯通、composer 声明位——实现以 49/55 为准；32 principles 未全文回灌（SITE-1 勿写「全站 shadow:none」）。

### 0.4 校正后板面（本会话起以此为准）

```
关账：W1–W8 · eval · 设计语言 P-1–P-4 · S-1/S-2 · T-* · F-* · D-1 · UX-1/SET-1
      · FIX-KC-1 · BUILD-1 0.1.0 · RP-1…RP-2.10 放行 · QF-1 放行 · PRV-1 实现
      · AUDIT-1 登记 · SEC-1（仅私有）

阻断未清（main 真相）：QF-2 未合流 main
在途：RP-2.11（批复齐、实现未见）‖ PRV-1 验收 + QF-1 单点复验（prompt 已备）
门闩：合流终验（main 全绿）→ BUILD 0.1.1
用户：push · 真机四项 · DeepSeek 真 key
0.1.2：#29–#34 · HARNESS 记忆层 · SCHEMA-SPEC · 词表一批 · PM 包
```

---

## 1. 互联调研结论（文档图 → 执行序）

### 1.1 主依赖图

```
92 论纲 ──┬── 53 握手/披露 ──┬── 58 存储·HARNESS ──┐
          │                 ├── 49 UI 宪法 ch1–12 ──┼── 36 空间分册 → SCHEMA-SPEC-1
          │                 └── 20/24/25 信源·注册·记忆 ┘
03/04 规划 ── 60 炼化 ── 48 裁决 ── 61/62 PM 包
54 收束 ── SITE-1 ← 59 deslop / 32 tokens
90/55 板面工单 ── 当前唯一执行真相（相对 README）
```

### 1.2 收束后建设窗（不挡 0.1.1，但决定 polish 序列）

| 窗 | 内容 | 锚 |
|---|---|---|
| **A 演示闭环** | 真 key → S3/S6 剧本 → eval 基线 | 90 用户项 · 53 宣言实证 |
| **B 对外** | push 时间戳 → RM-1 → MIRROR-1 → SITE-1（key 后） | 54 · 59 |
| **C 底座加深** | HARNESS-1（组装+续行块）· chatspace 剪裁 0.1.2 | 58 §3/7/11 · 25 修正二 |
| **D 第二垂类** | SCHEMA-SPEC-1 → 词表一批 → PM-PKG 零 core diff | 36 · 49 ch7 · 62 |
| **E 炼化常备** | docs/60 前 10 就绪件蒸馏上架 | 60 · 48 |

**时序律重申**（哲学 §9）：设计语言已重做；0.1.x 只做地基上的便宜增量 + 纪律修补，不开新范式除非收束窗明确开张。

### 1.3 批次五裁决（AUDIT-1 → 实现授权）

| # | 项 | 裁决 | 排期 |
|---|---|---|---|
| **27** | 排队跨案污染 | **阻断** → QF-2（已实现于 `codex/qf2`，**待 merge main**） | **0.1.1 前门** |
| **28** | 整理报告命令/路径/hash | **阻断** → QF-2 同批 | **0.1.1 前门** |
| **29** | 整理计划表行高/内部 id | polish · 紧凑 list 原语 + 零编码 a11y | **0.1.2 PL-1** |
| **30** | 折叠态双入口 | polish · 每侧单方向动作 | **0.1.2 PL-1** |
| **31** | modal 下 popover 残留 | polish · 全局单浮层根 | **0.1.2 PL-1** |
| **32** | 11px/10px 低于 meta 下限 | polish · ≥12px（hash 用色/截断降权） | **0.1.2 PL-1** |
| **33** | 图谱 slug 暴露 | polish · 用户标识词表 | **0.1.2 PL-1** |
| **34** | 欢迎入口无 hover | polish · `bg.hover` 120ms | **0.1.2 PL-1** |

deslop 扫描器：SITE-1 CI 先行；产品侧白名单化（token/fixture）后挂 SCHEMA-SPEC-1 候选（DSGN-1 既裁）。

---

## 2. 0.1.1 Ship Gate（严格序）

> 纪律：`docs/55` 已写——**终验全量在合流 main 上跑**；共享检出禁用裸 HEAD。

### Phase 0 — 真相复位（架构会话 · 分钟级）

1. 板面改回「**QF-2 待合流 main**」（docs/90 + docs/55 一行补丁，勿再写阻断清零直至 `git merge-base --is-ancestor 79f72c4 main` 为真）。
2. 通知实现线：先 merge 再 RP-2.11 叠码，避免 App.tsx 二次冲突。

### Phase 1 — QF-2 合流（P0 阻断）

| 步骤 | 动作 | 验证 |
|---|---|---|
| 1.1 | `codex/qf2` → `main`（fast-forward 或 merge，**禁 force**） | `79f72c4`/`001465b` 为 main 祖先 |
| 1.2 | 若 RP-2.11 已开 branch，rebase 到含 QF-2 的 main | 无 queue/FileOps 回退 |
| 1.3 | 独立 worktree 抽跑 `d1-case-scope` + `file-ops` | 四步矩阵 + 报告零 hash/绝对路径 |

**范围摘要（已实现于侧支，勿重做）**：
- `queuedMessages` 绑 `caseId`，投影 filter 当前案；CASE_SCOPE_AUDIT 补行
- FileOps 报告：中文动词 + `displayCaseRelativePath`；hash 退诊断层

### Phase 2 — 并行两线（热点错峰）

#### 2A · RP-2.11（Opus 视觉线 · 热点 App.tsx/styles）

批复已齐（`6f1d59b` + ⑧ `a1f6355`）。实现范围：

| # | 项 | 值/纪律 |
|---|---|---|
| ① | 顶栏秩序 | 标题与红绿灯同排；**wordmark 下沉左栏顶**；chat\|work 对齐 Cowork；**案件标题在顶栏**（覆盖 RP-2 #19） |
| ② | 两侧卡贯通 | shell gap **8→12**（提案已过目） |
| ③ | 分隔间隙 | 贯通到底；展开钮驻间隙垂直上部 |
| ④ | 右三 tap | 同层横排、各自 L2 下拉；dock 顶对齐左栏 |
| ⑤ | composer | 内零框线；五钮沉底（add / add folder / workmode / model / send） |
| ⑥ | message 按钮 | 缩小一档 |
| ⑦ | hover | `--control-hover: #e6eaf0`；与 selected 色分离 |
| 推理 | **字符版 ▏** | terminal 硬闪；静默字符锚；**brand-mark 动画留 post-P-4**（须改 `ThinkingStream` + **rp210 e2e/lint 契约**，禁止两套并存） |
| ⑧ | 长消息 | 默认收敛 N 行（user 阈值更短）；底渐隐 + Show more/less；纯呈现 |

**chat\|work 中间档**（0.1.1 必做壳，不做记忆）：
- 二段真路由 / chat 轻画布内存单 session / 气泡行退场 / Recents 纯容器 / 存入桥
- **诚实缺口登记**：chat 重启即逝；剪裁/滚动摘要/chatspace 落盘 = **HARNESS 系 0.1.2**

门禁：floor ≥146 只升；两轮串行实跑原始输出；pinned 断言迁移逐条列理由。

#### 2B · PRV-1 验收 + QF-1 复验（Claude Code · 安全件）

- 沿用 `docs/55` 既备 prompt（WebView 无明文 / 唯冒烟 connected / 六型分型 / quirk 声明化 / key 不进日志）
- **追加**：composer:56 三连跑 + 读 App 在途判定一处（QF-1 遗产）
- 结论节必须写：「验证连接」可否交用户真 key 首跑

### Phase 3 — 合流终验（独立验收 · 放行 BUILD 的唯一钥匙）

干净 worktree @ **合流后 main tip**：

```
pnpm -r build                    → 9 包
Vitest desktop+core              → 全绿
cargo test（凭证相关）           → 全绿
Playwright 全量两轮 + floor≥146  → 零已知红
门禁反例抽 2（shadow 白名单 / icons 或 thinking 契约）
git 卫生：凭证语义零回退；无他会话脏吞
```

抽验矩阵：
1. QF-2 四步切案 + 报告零编码
2. RP-2.11 ①–⑧ + gap=12 几何 + 字符推理契约（旧 brand-mark e2e 已迁移）
3. PRV-1 安全七主张摘要复核
4. ch12 三卡一纸不回归
5. 首屏 1440 主观：是否达投递演示

### Phase 4 — BUILD 0.1.1

复用 BUILD-1 工序：版本号 **0.1.1** 三处对齐 → dmg → codesign + hdiutil verify → 前端内容哈希 → 写入 SPEC「Build 记录」；Developer ID 仍挂账则 ad-hoc 如实记录。

### Phase 5 — 用户闸（非码门，是收束门）

| 项 | 说明 |
|---|---|
| push | SEC-1 仅私有已放行；宜早立时间戳 |
| 真机四项 | 错误密码流 / 环境变量流 / #9 minimap / chip 呈现 |
| 凭证 trace | FIX-KC-1 剧本回传 log |
| DeepSeek 真 key | 产品内「验证连接」→ 冒烟 → eval 基线 → 53 宣言首实证 |
| 然后 | RM-1 亲笔 README → SITE-1 触发条件满足 |

---

## 3. Polish  backlog（0.1.2+）

### 3.1 PL-1 · 批次五非阻断（一单或拆两单）

实现授权正式开：#29–#34（见 §1.3）。  
纪律：TDD；floor 只升；零编码律（docs/36 五节）全覆盖；不扩功能面。

### 3.2 PL-2 · 批次三工作面（base 优先后的独立线）

| # | 项 | 锚 |
|---|---|---|
| 13 | 图谱 drag-canvas + 边路由 | docs/52 |
| 14 | 矩阵 hover 全文+溯源 | docs/52 |
| 15 | 修订 glyph 进 P-4 SVG | docs/52 · 32 svg-standards |

### 3.3 底座加深（收束后第一建设窗 · 可并行包）

| 工单 | 内容 | 锚 |
|---|---|---|
| **HARNESS-1** | 优先级律拼接 + 续行块确定性投影 + golden prompt | 58 §3/7 |
| **HARNESS-2** | chatspace 剪裁/轻摘要（防过拟合三线）；记忆永不跨容器 | 58 §11 · 25 |
| **SCHEMA-SPEC-1** | docs/36 细则 + 五工作面回灌；ArtifactTypeEnum 分包第一案 | 36 · 48 · 61 |
| **VOCAB-1** | 词表第一批（statcard/checklist/…） | 49 ch7 · 57 |
| **PM-PKG-1** | pm-schemas/scenarios + 栖屋 demo；验收五考点 + **零 core diff** | 62 |
| **REG-v2** | `context` 字段 + 左栏声明宿主 | 49 十章 · 61 |

### 3.4 对外与材料

| 工单 | 谁 | 锚 |
|---|---|---|
| **RM-1** | 架构亲笔 | 54 · 92 · 治理判例数字化 |
| **MIRROR-1** | 可派 | 54 白/黑名单 |
| **SITE-1** | key 后 | 59 采纳表 + 营销 tell；CSS 手绘 Mac 窗框放真截图 |
| career-kit | **另 session** | 54 L1–L4 |

### 3.5 挂账（不挡 0.1.1）

- W6.1 遥测事件接线
- T-provider.1 分片验证 + 思考流内容
- 撤销日志按执行实例 id
- message edit / fork UI（Stage 1）
- OCR W3/W8（卷宗样本外部依赖）
- Developer ID 公证
- 真 FileOpsHost 落盘（现 memory demo）
- PartyGraph contradiction marker 契约拍板

---

## 4. 建议立刻发出的工单（文案骨架）

### 4.1 MERGE-QF-2（Grok 或 sol · 30 分钟级）

```
认领 MERGE-QF-2：将 codex/qf2（79f72c4/001465b/ed0ee67）合入 main。
禁 force；冲突以 QF-2 语义为准。合流后独立 worktree 跑 d1-case-scope + file-ops + floor 断言。
完工回报：merge commit sha + 祖先核验命令输出 + 测试原始输出。
不在本单做 RP-2.11。
```

### 4.2 RP-2.11 实现（Opus · 沿 docs/55 既发单 + ⑧）

- 第 0 步：**确认 main 已含 QF-2**，否则暂停。
- 必读：49 九/十一/十二 + 55 RP-2.11 批复 + chat\|work 中间档 + ⑧
- 契约迁移：ThinkingStream 字符版时 **同步** lint/e2e，旧 brand-mark 动画断言退役并登记理由
- 完工：两轮串行原始输出 + 对照截图 visual-audit 序号续编

### 4.3 PRV-1 验收（Claude · 既备 prompt 原样粘贴 + QF-1 复验条）

### 4.4 合流终验（异实现者 · 新建 prompt）

三问：①各线放行？②0.1.1 可 BUILD？③首屏达投递演示？

### 4.5 BUILD-0.1.1（终验放行后 · 工序单）

版本 0.1.1；不改产品行为。

---

## 5. 风险与纪律

1. **侧支收账陷阱**：实现在 branch、docs 写清账——本会话已踩；以后「清账」判定条件 = **main 祖先 + ACCEPTANCE/SPEC 留痕**。
2. **App.tsx 热点**：QF-2 merge 与 RP-2.11 串行或严格错峰（手册排单纪律）。
3. **推理指示契约战争**：#26.3 brand-mark vs RP-2.11 字符——实现单必须连同测试契约一次迁完。
4. **端口隔离**：验收/自测禁 reuse :1420（AGENTS 判例）。
5. **完工实跑判例**：报告附全量原始输出，禁摘要虚报（RP-2.8 案）。
6. **共享检出**：架构 git 一律 `refs/heads/main`；CAS 协议写 docs 时不碰他人暂存。

---

## 6. 成功标准（可验证）

### 0.1.1 完成当且仅当

- [ ] `git merge-base --is-ancestor 79f72c4 refs/heads/main` 成功
- [ ] RP-2.11 ①–⑧ 在 main；thinking 契约单一
- [ ] PRV-1 验收节写入 ACCEPTANCE.md 且放行
- [ ] 合流终验 146+ 全绿两轮
- [ ] 版本 0.1.1 DMG + SPEC Build 记录
- [ ] docs/90 板面改为「0.1.1 已出；待真 key / push / RM-1」

### Polish 阶段完成信号（0.1.2 切片）

- [ ] #29–#34 关账
- [ ] HARNESS-1 golden prompt 绿
- [ ] SCHEMA-SPEC-1 过目 + 五面回灌
- [ ] PM-PKG 零 core diff 证明图可截

---

## 7. 本会话后续动作（待用户批准本 plan 后）

1. **架构 docs 补丁**（唯一实现例外）：校正 docs/90 板面 + docs/55 一行「QF-2 待合流」；批次五 #29–#34 正式授权注记写入 docs/52。
2. 发出 MERGE-QF-2 + 确认 RP-2.11 / PRV-1 两线任命。
3. 终验 prompt 成文进 docs/55。
4. 不触 `usecase/`、不 push、不改产品码。

---

## 8. 一句话

**0.1.1 不是「再 polish 一轮」——是 QF-2 真合流 + RP-2.11 壳层收口 + PRV-1 安全验收 → 版本化 BUILD；其后才是真 key、对外叙事与 HARNESS/PM/SITE 建设窗。** 当前最大风险是板面超前于 main：先 merge，再画。
