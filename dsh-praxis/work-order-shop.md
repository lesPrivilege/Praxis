# 工单：开店、备货与拆仓

依据 [ADR-050](../docs/decisions/050-shop-stock-and-repository-convergence.md)（决定与六项裁定）与 [ADR-051](../docs/decisions/051-full-shelf-and-shared-search.md)。2026-11-09 编制。第 1–3 步与第 4 步的本机部分按序施工；打 release tag、新建 Praxis-dsh 远端、从本仓库删去 `dsh-praxis/`，都等用户确认后再做。每步完成后更新下表。

| 步 | 内容 | 状态 |
|---|---|---|
| 1 | Shop 界面 | 完成：scratch Host 走查通过（2026-11-09）；Open in chat 未在 scratch Host 上点，它会在共用的会话目录里建真会话 |
| 2 | download 备货与预览 | 完成：测试 39 项与走查 16 项通过；scratch Host 上 GOV.UK Button（网页）、emilkowalski/skills（仓库）、Marie Neurath 与 FinCEN 两份 PDF 各备一版，再取报 unchanged；BIS 的 PDF 链接现在转到网页，按网页备货；Restock 用伪造的检查验证 |
| 3 | distill 备货 | 完成：Distill 按钮经后台会话路径施工，测试覆盖；三份提炼（GOV.UK Button、emilkowalski/skills、Marie Neurath 一章）的定位逐条回原件查对得上；真 agent 会话没在 scratch Host 上跑，它会花用户的模型额度 |
| 4 | fresh 安装演练（本机） | 完成：`release/migrate.mjs` 把数据根复制到新目录，346 个快照导入库存，0 个跳过；`npm pack` 的包装进新建的 profile，配上副本，6 组 resolve 与挂载数、过期运行、upkeep 都与仓库模式一致；Praxis 页在这个 profile 里打开，导入的库存可以 Quick look。测试 profile 与副本已删除，真实数据未动。演练发现与处理见下 |
| 5 | 拆仓库 | 等用户确认 |

## 各步都守的约束

- 名册只存链接、说明与摘录定位；原件正文只在 `stock/` 的版本里（裁定 5）。
- 不加 npm 依赖。下载只经 Host 的 fetch，下载到的内容里的脚本一律不跑。
- 版本只增不改；删除版本要人确认；单个版本上限 50 MB，超出时只取正文，manifest 写明缺了什么（裁定 4）。
- 条目自成一体；读了哪个版本、用来做什么，记在运行里（裁定 7、ADR-051）。
- 界面文字用稳定英文，按 Kit 的 microcopy 逐个位置写：Shop、Browse、Manage、Cart、Checkout、Stock、Restock、Retire。
- 每步结束时 Praxis 都能用：`npm test`、`npm run walkthrough` 通过，在 scratch Host 上走一遍。桌面 DSH 重启后由用户看，本工单不替用户重启桌面应用。

## 第 1 步：Shop 界面

只动 `adapters/client.js`、相关的路由文字与文档。

- **改名。** 标签 id `sources` 改为 `shop`，标签名 Shop；看法 Catalog 改为 Browse，Review 改为 Manage（`mode: 'manage'`）。卡片链接、`/praxis` 与 `praxis:go` 事件里的 `tab: 'sources'` 一并改，不留旧名。
- **从需要进店。** Browse 的工具条加 **For**：任务类型、stream、Kit 页三组。选任务类型或 stream 时摆出 `praxis_resolve` 的全量清单，按它的顺序；选 Kit 页时摆出挂在这一页的来源。搜索与标签在这一排里继续筛。
- **闲逛。** 不筛选时，货架之前先摆两排：**New**（按收录时间）与 **Recently used**（按最近运行读到的时间），各摆三条，Show all 看其余；排序依据写在排名旁。商品页加 **On the same pages**：与它挂在同一页上的其他来源（互著），从这里打开时 ← → 在这一排里走。
- **结账。** 购物车加 **Copy IDs**：一行说明加 ID 列表，供装了 Praxis 的 agent 用 `praxis_source` 取。Open in chat 与 Copy 不变。
- **motion。** 只给有因果的反馈。加入购物车时，一个缩影从按钮飞到购物车，减弱动效时省去；Open in chat 之后购物车收起。备货进度在第 2 步。
- **验收。** 在 scratch Host 上逐一走一遍：Browse 的 For、New、Recently used 与货架，Manage，购物车的三种结账；`npm test`、walkthrough 通过。

## 第 2 步：download 备货与预览

- **位置。** 数据根下 `stock/<来源目录>/<UTC YYYYMMDDTHHMMSSZ>/`。来源目录名是来源 ID 里 `[A-Za-z0-9._-]` 以外的字符换成 `_`。每个版本一份 `manifest.json`：

  | 字段 | 内容 |
  |---|---|
  | `source`、`url`、`at`、`kind`、`by` | 来源、取自哪个 URL、时间、`download` 或 `distill`、操作者 |
  | `files` | 每个文件的 `path`、`sha256`、`bytes`、`from`（取自哪个 URL） |
  | `upstream` | 原件当时的 HTTP 码、content type、`sha256`，HTML 另有正文 hash |
  | `cover` | 封面文件（`og:image` 或 `twitter:image`），没有就不写 |
  | `commit` | GitHub 仓库取的提交 |
  | `missing` | 超过上限没取的文件与原因 |
  | `changes` | 与上一个 download 版本相比增、删、改的文件 |
  | `based_on`、`model`、`locators` | distill 依据的版本或原件、写提炼的模型、依据的定位（第 3 步） |

- **抓取。**
  - GitHub 仓库页（`github.com/<owner>/<repo>`，可带 `/tree/<ref>`）：经 GitHub API 取提交，存这个提交的源码归档 `repo-<sha>.tar.gz` 与 README。归档超出上限时只存 README。归档不解开，也不跑安装脚本。
  - HTML：存页面本身（`index.html`），以及它引用的图片与样式表和 `og:image`，到上限为止；HTML 不改写。
  - 其他（PDF、图片、音视频、文本）：存原文件。
- **补货。** 再取一次与最新的 download 版本比较。内容相同（HTML 比正文 hash）就不建新版本，返回 `unchanged` 和那一版的时间；不同就建新版本，并写 `changes`。
- **工具 `praxis_stock`。** `download` 建版本或返回 unchanged，`distill` 存一份提炼（第 3 步），`list` 列出版本。`praxis_refresh` 去掉 `keep`：真实数据里从未用过，库存取代它。
- **披露。** `praxis_resolve` 的每条素材，有库存时带 `stock`：最新版本的时间、方式与目录的绝对路径，不附正文。`praxis_source` 带全部版本。原件最近一次检查打不开时，素材与来源页都说明有本地版本可读。
- **运行。** `praxis_consume` 的来源可写 `stock: <时间戳>`，运行记录写读的是哪个库存版本；不写时照旧记上游 hash。
- **文件路由。** `GET /api/praxis.file?source=<id>&version=<时间戳>&file=<path>`，只给 manifest 列出的文件，带 `Content-Security-Policy: sandbox`。
- **页面。**
  - 商品页 Stock 栏：版本列表（日期、方式、大小、与上一版的差别），按钮 Download（有库存时为 Update），以及 Quick look。备货进行中只说正在取，不画百分比。原件不可达而有库存时，页首写“原件打不开，可读本地 <日期> 的版本”。
  - Quick look：网页给封面与正文文字，仓库给 README，PDF、图片、音视频按浏览器原生显示；都标出版本与日期，并留“打开原件”。
  - 卡片：有库存时角标 In stock 加日期，有封面时用封面作预览。
  - Manage 加两个筛选：Link only（没有库存），Restock（上游在最新库存版本之后变了）。补货只在 Manage 出现，不进 Log。
- **git。** 仓库 `.gitignore` 让 `dsh-praxis/data/stock/` 下只留 `manifest.json` 与 `distill.md`（裁定 3）。
- **验收。**
  - 本地 fixture 服务器上的网页、仓库归档、PDF 各备两版，第二版写出差别；服务器停掉之后 resolve 仍给出库存路径。
  - 新增 core 与 adapters 测试；walkthrough 加 `stock_survives_offline_original`。
  - 在 scratch Host 上对真实的一个网页、一个 GitHub 仓库、一个 PDF 各备一版，再取一次报 unchanged。

## 第 3 步：distill 备货

- 商品页的 **Distill** 走输入框同一条后台会话路径（`asks.js`），开一个 agent 会话。prompt 规定：
  - 读原件，有 download 版本时也读最新版；
  - 写一份 Markdown 提要，首行写明是提炼、不是原件；写它是什么、何时用、关键做法，每条带回原件的定位；
  - 用 `praxis_stock` 的 `distill` 存成新版本（`distill.md`），manifest 记模型、`based_on` 与定位；
  - 只用 `praxis_*` 与读网页的工具，不读写文件，不跑命令。
- 验收：三条来源的提炼，定位逐条回原件查对得上。

## 第 4 步：fresh 安装演练（本机）

- 打包用 `npm pack`，不打 tag、不推远端；装进一个新建的 DSH profile，数据根指向现有数据的副本。
- 迁移脚本把副本里名册来源已有的快照（`vault/snapshots`，按 `vault/snapshot-manifest.json` 与来源包记录的 `snapshot_path`）与 `vault/distilled` 里对应名册来源的提炼导入 `stock/`，时间取原快照的时间。
- 验收：每个任务类型与 stream 在两边的 `praxis_resolve` 结果一致，`stock` 字段除外。演练结束删除测试 profile 与副本，真实数据不动。

### 第 4 步发现

- **stream 页的挂载跟着数据根的位置走。** 挂载用路径指 stream 页，数据根一挪，路径就变；24 条挂载与 1 条运行记录由迁移改名，`history.jsonl` 保留原名。
- **vault 来源包按仓库里的包路径声明 Kit 页。** 154 条关系写的是 `dsh-praxis/kit/…`；包装到别处后对不上，已删除的挂载还会重新冒出来（挂载数从 677 变成 831）。来源包登记加 `kit` 字段，迁移时写上，声明的关系读成 `kit/…`。
- **`vault/distilled` 里没有逐个来源的提炼。** 指向这里的 12 条来源卡片都是资料包的 README 或几个来源共用的索引页，不导入，留作证据。
- **快照没有记自己的时间。** 导入的版本取来源记录的 `reviewed_at`；当时上游的 hash 不知道，这些版本不报 Restock。
- **用 `dsh plugin` 新建的 profile 只有 `dsh-base`。** 要在网页里看，profile 的 bundles 还要有 `@deepseek-ai/dsh-web-app`。
- **第 5 步的数据根放在哪还要定。** ADR-050 写的是本目录本身；`migrate.mjs` 只往空目录里写。数据根放在本目录根，还是本目录下的一个子目录，在第 5 步动手时决定。

## 第 5 步：拆仓库（等用户确认）

按 ADR-050 的做法。以下每一项动手前都要用户确认：`git bundle` 备份、新建 Praxis-dsh 远端、`git subtree split`、打 release tag、从本目录删去 `dsh-praxis/`、桌面 DSH 改装 release 版。

## 素材位

Shop 的立体素材（Blender）另交 Codex。界面只在空态与首屏留素材位，不阻塞施工。
