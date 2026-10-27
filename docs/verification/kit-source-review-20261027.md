# Kit 来源省察与 design 来源召回 · 2026-10-27

基线：`273b15f`。用户要求对挂在 Kit 上的来源省察删汰，留下的都要是 worker 真会打开、打开有用的；中途裁定个人或项目专属的来源不常用但仍足资参考的照留，并要求召回早期 Praxis 与 Courtwork design 系列收录的来源。主会话（Claude Opus 5.5）定标准、裁决并写入名册；五个 Sonnet 子代理按 Kit 区域初审，一个 Sonnet 子代理做召回。

范围：挂在 `kit/…` 上的 277 条挂载，涉及 229 个来源。挂在 SaaS 教科书各页的 428 条属项目关系；没有挂载的 vault 研究与 Jev 索引只经 `praxis_search` 出现。这两部分都不在本轮范围内。

## 标准

- **保留**：做这页任务的 worker 会为四件事之一打开它：
  - 照着做；
  - 对照范例；
  - 核对或引用一条主张；
  - 往深走。
- **移除**：
  - 挂错页；
  - 读不到：记录本身是访问失败，或原件确认已死；
  - 同页重复；
  - 只是规则的形成过程，没有可读增量；
  - 说不出何时打开。
- **网络失败不算死链**：本机连不上 gov.uk、nasa.gov、digital.gov，部分站点对检查返回 403 或 429，这些都不算链接失效。

## 结果

| 项 | 数 |
|---|---|
| 移除挂载 | 37 |
| 改挂到更合适的页 | 7 |
| 改写说明 | 7 |
| 淘汰自有来源（唯一挂载已移除，记录保留） | 11 |
| 集合成员 008、020 挂到集合所服务的页 | 2 |
| 召回登记并挂载 | 40 |
| Kit 上的挂载 | 277 → 242 → 282 |

移除的几类：
- `publish/html/exhibits.md` 上的 6 条量化研究来源（Freqtrade、Qlib、RD-Agent、TradingAgents、LEAN）：说明写的是 quant-fieldguide 的章节用处，Kit 里也没有可改挂的页。上一轮留给用户裁定的那几条挂载就是这一批，本轮已处理。
- 访问失败记录与读不到的原件：
  - Neubrutalism 文章：403，没有快照；
  - Wikimedia 原图：一条 403 记录；
  - ASD-STE100：一条访问缺口记录；
  - ScienceDirect 入口：已有可读副本；
  - career-kit 的两个页面：原目录不在本机；
  - 下载目录里的旧研究包。
- 同页或跨页重复：
  - 目录级索引，其下各卡已逐条挂载；
  - 同一来源挂在不依赖它的写作页上；
  - Design 与 references 路由页上的动态和视频来源。
- 过程记录：
  - Write/Design 分工候选；
  - 设计 pipeline 设想；
  - 参考语义治理索引；
  - SourceWeft 运行时参考；
  - 材料来路。

主会话改判初审：
- 保留 4 条（初审提议移除）：
  - Courtwork product-pages 窄屏 CSS；
  - VL 条目的包内完整解释；
  - 样张工单（可作版式探索的模板）；
  - 作者语体的交接全文。
- 改挂 2 条（初审提议移除）：
  - Refero 改挂到设计系统参考页；
  - AI 能力测试的形成过程目录改挂到答卷文体页。

召回：
- **早期 Praxis 设计页**：7aff301 之前的设计页里有 14 个链接，11 个已在名册，余下 3 个是锚点或命名空间变体。
- **Courtwork**：
  - 设计目录里有 332 个链接，16 个已在名册；
  - 冻结归档有 5 个；
  - 交接与回执目录里没有外链。
- **登记的 40 条**：
  - 外部 26 条：Vercel 界面准则、Lucide 设计原则、Linear 两篇、Emil Kowalski 两篇、WCAG Understanding 四条、APG 三条、Primer、Stripe、Carbon、Base UI、Supabase 文案、Apple HIG 两页（正文由 JS 渲染，记 `partial`）、Atlassian token、Storybook、Figma Code Connect、ECharts aria。
  - 本地 14 条：Courtwork 的文案、图标、完成面、披露弹层、Tab、对象命令、视觉空间体例，图标与字阶样张，两张页面截图，以及冻结归档的用语与排印凡例。
- **跳过约 325 条**：
  - 单个 glyph 的 SVG 钉版 98 条；
  - 过程记录与二进制回执约 60 条；
  - 合成或基础设施 URL 18 条；
  - 死链 1 条；
  - Kit 没有对应页的约 60 条：材质与半透明、注意力、agent 产品界面。

## 随本轮修的几处

- **链接失效信号只认确定的答复**：refresh 失败时记网络错误码，`unreachable` 只在最近一次检查答复 404、410 或域名不存在时出现。本轮 155 个来源的检查里，有 28 条挂载因 403、429 或超时被标成链接失效，用户对这些做不了什么。`objects.md` 同步。
- **HTML 按正文判断变化**：refresh 原先对原始字节取 hash，HTML 页的标记里带每次载入都不同的令牌，Google 开发者文档、Microsoft 文档与 GitHub 页因此被判为“来源变了”（6 条挂载）。检查现对 HTML 另记正文 hash（去掉标签、脚本、样式与注释，压缩空白），判断变化时 HTML 比正文、其余比字节；只记了字节的旧 HTML 检查不参与比较。实测这 5 个来源各连取两次：4 个字节不同，正文 hash 全部相同，没有误报。
- **review 记下所见的来源版本**：“来源变了”原先比较 review 与变化的毫秒时间戳，同一毫秒时次序不定，测试套件约每 6 次失败 1 次（改动前的提交上同样复现）。review 现在记 `source_version`，来源与它不同才出信号；没有这一项的旧 review 仍按时间判断。全套测试连跑 15 次通过。
- **MCP 服务经符号链接路径启动**：`adapters/mcp.js` 原先拿 `import.meta.url` 与 `file://` 拼上 `argv[1]` 比较。Node 对前者解析了真实路径，路径经过符号链接时（如 `/var` → `/private/var`，或 `link:` 安装），服务不启动也不报错，fresh 走查因此一直挂着。现在比较两边的真实路径。走查在 MCP 进程退出时直接失败，打包加 `--offline`，不再等 registry。

## 验证

| 范围 | 结果 |
|---|---|
| `node --test core/*.test.mjs adapters/*.test.mjs` | 32 项通过，连跑 15 次无失败；新增：403 不算链接失效，HTML 只改标记不算变化 |
| `python3 scripts/check_praxis_acceptance.py` | 通过 |
| `node dsh-praxis/release/walkthrough.mjs` | 14 项通过 |
| `python3 scripts/validate_repository.py` | 通过 |
| upkeep | 挂载信号为 0；没有未挂载的自有来源；6 条过期运行都因 Kit 页更新，与来源无关 |

## 没有处理

- **没有挂载的 vault 研究与 Jev 索引不在本轮范围内**：它们经 `praxis_search` 出现，要不要整包接入，是另一项裁定。
- **Kit 没有对应页的约 60 条召回来源没有登记**：材质与半透明、注意力、agent 产品界面三类。等 Kit 长出对应页，再按召回清单登记。
- **初审未打开的来源**：子代理的 WebFetch 在部分站点被拒，召回改用 curl 取页面，外部页面多为抽读。凡是没有核实正文的，状态都记为 `partial`。
