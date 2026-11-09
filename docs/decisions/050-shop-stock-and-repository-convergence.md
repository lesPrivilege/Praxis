# ADR-050：开店与购物，来源备货，仓库收敛为 Praxis-dsh

日期：2026-11-09。状态：accepted（spec；六项裁定见文末，均由用户在本会话裁定，尚未施工）。用户在本会话里先后提出：来源加入购物车，选好后去 chat 施工，也可导出给别的 agent；来源详情提供 Download 或 distill，由 agent 按时间戳在 Praxis 自己的目录里建缓存，尽量拿到不依赖原件存活的资源，接近安装但不一次进入 context，快照纳入版本管理并可 update；仓库收敛为 fresh 安装的 release 版 Praxis 加导入的资源，项目目录转为 Praxis 自己的缓存目录，项目只收敛到 Praxis-dsh；shop 作为核心交互，登记来源就是商品上架，可视化、界面与 motion 围绕“开店与购物”展开，需要 Blender 时交 Codex 制作，Praxis 自己的参考资源照常可用。主会话（Claude Opus 5.5）对照 ADR-045 至 ADR-049 与 0.3.0 的代码编写本 spec。

## 问题

- **来源只能读，不能拿走。** 0.3.0 的 Praxis 页能逛、能 review，购物车刚做出第一版；人选好的来源怎样交给一次施工、交给别的 agent，还没有统一说法。
- **原件会消失或改变。** 名册只存链接（ADR-047）。`praxis_refresh` 能记 hash，带 `keep` 时按 hash 另存一份字节，旧版不删；但它只存单个文件，没有时间戳版本、没有提炼、没有进入 `praxis_resolve`，agent 不知道本地有一份可读。
- **仓库是“资源上长出的插件”。** 数据根以 `settings.json` 的 `base: "../.."` 运行在仓库模式；名册按引用读 `vault/registry.json`、`projects/jev/research/sources.json` 与 `vault/distilled/reference-gallery-20261031/catalog.json` 三个来源包；`dsh-praxis/` 与根 `kit/`、`vault/`、`docs/`、`projects/`（5.0 GB）同处一个公开推送的仓库。fresh 安装的 release 版从没在真实数据上跑过。

## 决定

### 开店与购物：同一份名册的两面

开店是收录与维护，购物是取用。两面用同一套对象，不新增对象（ADR-049 体例不增加对象）；shop 是交互与视觉的组织方式，词表落在已有机制上：

| 店里的说法 | 机制 | 谁做 |
|---|---|---|
| 上架 | `praxis_capture` 登记来源与编目：description 就是商品卡 | agent（输入框贴链接或对话） |
| 货架 | 编目：层 → 区域 → 形态 | Praxis |
| 质检 | review：准确 / 待改，待改交 agent 重写 | 人 |
| 进货、补货 | 备货（下节）：download 或 distill 一个版本；上游变了再备一版 | agent，人从商品页触发 |
| 下架 | `praxis_retire`，写理由 | 人或 agent |
| 逛、搜 | Catalog、搜索、`praxis_catalog`、`praxis_search` | 人或 agent |
| 商品页 | 来源详情：固定栏目，外加库存一栏 | 人 |
| 购物清单 | `praxis_resolve`：按任务列出单元与来源 | agent |
| 购物车 | 人挑的来源，存在本机浏览器 | 人 |
| 结账 | Open in chat（新会话带清单开工）、Copy（给别的 agent）、MCP（装了 Praxis 的 agent 凭 ID 取） | 人 |
| 小票 | `praxis_consume` 的运行记录：读了哪些来源、读的是原件还是哪个库存版本 | agent |

每一个来源都按一件商品设计：界面模仿购物，可以拟物（货架、商品包装、价签式的标签、购物车），但每个元素的逻辑意义仍是 Praxis 的：封面是原件的预览，价签位写形态与读取深度，不写价格；“缺货”是没有本地库存，不是不可用。界面文字用稳定英文（Shop、Cart、Checkout、Stock、Restock、Retire）。

### 界面：Shop 取代 Sources

- **标签**：Kit、Shop、Task、Artifacts、Log。Shop 有两种看法：**Browse**（原 Catalog）与 **Manage**（原 Review：待质检、待改、已质检，加缺货与可补货）。Log 只留运行和真正要人处理的事；补货提醒移到 Manage。
- **两种逛法**：
  - **知道要什么**：从需要进店。按任务类型或 Kit 页筛（“做技术说明要什么”即 `praxis_resolve` 给出的素材，摆成一排货），加搜索与标签筛选。
  - **闲逛**：货架按层 → 区域 → 形态陈列；另有新上架、最近被用过、同一页上的相邻来源（互著）几排。不做算法推荐，排序都说得出依据。
- **商品卡**：封面（预览）、标题、站点、何时用；标签：形态、Kit 分类、来源自带的 `tags`（已有字段，收录时由 agent 写，人在质检时可改）；角标说库存：`In stock`（本地有版本，写日期）或不写（只有链接）。
- **预览**：封面取库存里的截图或原件的 `og:image`，备货时一并保存；没有就是形态图标，不画占位图。商品页首屏放大预览，点开 **Quick look**：网页显示库存截图，仓库显示 README 首屏，PDF 显示首页，视频显示封面帧；都标明取自哪个版本与日期，并保留“打开原件”。
- **商品页**：现有固定栏目后加 **Stock**：版本列表（时间、download / distill、大小、与上一版的差别），按钮 **Download**、**Distill**、**Update**；原件打不开时首屏直说“原件不可达，读本地 <日期> 版本”。
- **购物车与结账**：保持 0.3.x 的行为，结账加第三个通道 **MCP**：只给 ID 列表，供已装 Praxis 的 agent 用 `praxis_source` 取。
- **视觉与 motion**：取 Praxis 自己的参考来源（`design/interaction`、`design/motion` 等区域）定方向，遵守 DSH 的 token（蓝色 business 系、shadow 级别）。motion 只给三处有因果的反馈：加入购物车（卡片向购物车的位移反馈，可减弱）、备货进行中（库存栏的进度，不画假百分比）、结账（购物车收起成运行记录）。需要 Blender 的立体素材（例如空态或首屏的货架场景）另立任务交 Codex，交付为离线可用的静态图或短循环视频，带减弱动效时的静帧；本 spec 只留素材位，不阻塞施工。

### 备货：本地库存，按版本，渐进披露

- **位置**：数据根 `stock/<source-id>/<时间戳>/`，时间戳用 UTC `YYYYMMDDTHHMMSSZ`。每个版本一份 `manifest.json`：来源 ID、URL、时间、方式、文件清单（路径、sha256、字节数、取自哪个 URL）、上游 hash、许可证（读得到时）、操作者；distill 另记模型与依据的定位。版本只增不改。`praxis_refresh` 的 `keep` 并入这里，旧的 `snapshots` 目录作为导入来源迁入（见“迁移”）。
- **download**：尽量取不依赖原件存活的资源。网页：正文 HTML 与它引用的图片、样式；GitHub 仓库：指定提交的源码归档（不跑安装脚本）；PDF 与媒体：原文件。由 Host 侧按清单抓取，agent 只决定取哪些；单个版本上限 50 MB，超出时只取正文并在 manifest 写明缺了什么。
- **distill**：agent 读原件后写一份 Markdown 提要：它是什么、何时用、关键做法，每条带回原件的定位；文首标明是提炼，不是原件（writing/evidence 的证据身份不变）。distill 与 download 可以并存于同一版本。
- **披露**：`praxis_resolve` 的每条素材加 `stock`：最新版本的时间、方式与路径，不附正文。agent 先看 description，再决定读原件还是读库存；原件不可达、或上游 hash 与库存版本不同而任务要的是当时的说法时读库存。运行记录写明读的是原件（带上游 hash）还是库存版本（带时间戳）。库存不进常驻上下文，不像全局 skill 那样一次性加载；skill 形态的来源备货后仍是“读用法、取脚本”，不安装。
- **更新**：Update 备一个新版本，并给出与上一版的差别（文件增减与 hash；distill 由 agent 写一段变化说明）。`praxis_refresh` 发现上游变了时，Manage 列出“可补货”。删除旧版本要人确认。

### 仓库收敛：代码一处，数据一处

- **Praxis-dsh 仓库**只放插件包：现在 `dsh-praxis/` 的内容到仓库根，加与包有关的 ADR（037–050 中关于包的部分）。用 `git subtree split` 保留 `dsh-praxis/` 的历史。每个 release 在 Praxis-dsh 打 git tag（`v0.4.0` 起），安装用 `dsh plugin --profile <名> add github:lesPrivilege/<仓库>#<tag>`，不走 link，不发布 npm。
- **Praxis 目录**（现在这个仓库目录）转为 Praxis 的数据根与工作区：名册、挂载、运行、产物、预设、stream、`stock/`，以及作为 `base` 的 vault、projects、根 `kit/`、templates 与仓库治理文档。用 fresh 安装的 release 版指向它（`PRAXIS_DATA`），不再从仓库里 link 插件。
- **导入而不是重建**：数据根的 JSON 与 JSONL 原样搬到新位置；三个来源包继续按引用读（路径相对 `base`，`base` 不变则记录不用改写）；`vault/snapshots` 与 `vault/snapshot-manifest.json` 迁成 `stock/` 的 download 版本，时间取原快照时间；`vault/distilled` 中对应名册来源的提炼迁成 distill 版本，其余留作证据。
- **可见性**：现在的 GitHub 远端 `lesPrivilege/Praxis` 是公开的，归 Praxis-dsh。数据目录会存第三方原件与 `vault/private`，用自己的 git，本机或私有远端，不推到公开远端。`stock/` 里只有 manifest 与 distill 进 git，下载的字节由 `.gitignore` 排除，靠 manifest 的 hash 校验。

### 施工顺序

每一步结束时 Praxis 都能用，后一步建在前一步上：

1. **Shop 界面**：标签与看法改名重组，两种逛法，标签筛选，商品卡与商品页加预览位与库存位（先用形态图标、显示“只有链接”），结账加 MCP 通道。只动 `adapters/client.js` 与文档。验收：Browse、Manage、购物车、三种结账在 scratch Host 与桌面 DSH 各走一遍；`npm test`、`npm run walkthrough` 通过。
2. **download 备货与预览**：core 加库存（manifest、版本、大小上限、截图或 `og:image` 作封面），工具 `praxis_stock`（download、list、update），`praxis_resolve` 与运行记录带库存；商品页可触发，Quick look 读库存。验收：对一个网页、一个 GitHub 仓库、一个 PDF 各备两版；断网时 resolve 仍给出库存路径；新增 core 与 adapters 测试；走查加 `stock_survives_offline_original`。
3. **distill 备货**：复用输入框的后台会话（`asks.js`）跑提炼，prompt 规定标明提炼与定位。验收：三条来源的提炼回查定位都对得上原件。
4. **fresh 安装演练**：打 release tag，从 git 地址装进干净的 DSH profile，数据根指向现有数据的副本，迁移脚本把快照与提炼导入 `stock/`；同一组任务类型在旧、新两边的 `praxis_resolve` 结果一致。可撤回。
5. **拆仓库**：subtree split 出 Praxis-dsh 仓库；本目录删去 `dsh-praxis/`，数据根改为本目录；桌面 DSH 改装 release 版。

Shop 的立体素材（Blender，Codex）与 1–3 并行，接到界面的素材位即可。

## 已先行（2026-11-09）

另一份对 0.3.0 的评审建议先收一轮小闭环，已在 0.3.x 做完，属第 1、2 步的前段：

- **用途标签贯通**：`praxis_catalog` 的行带 `tags`，查询也查标签；卡片露出至多三个，点一个在当前目录筛选。现有标签不齐：68 条有标签，但 `WEB`（60 条）、`CASE`（28 条）等旧的大写标签与形态重复，其余多为单次出现；归一交给 agent 经输入框处理，词表规则在第 1 步定。
- **文本预览**：卡片以第一条摘录（说法加定位）作预览；图像预览随第 2 步的库存截图到来。人挑定代表某个来源的那张图与理由是要保留的编排信息，缩略图与尺寸变体是可重建的缓存，刷新不覆盖人的选择。
- **连续浏览**：从来源返回保留筛选、搜索、展开的区域与滚动位置。
- **review 记看到的版本**：Praxis 页提交 review 时带上看到的 revision（来源编目用 `entry_revision`）；与当前不同时 `praxis_review` 拒绝并给出新内容，人读过新说明再判断。挂载的 review 同样校验。

## 裁定（2026-11-09，用户）

1. **远端归 Praxis-dsh。** `lesPrivilege/Praxis` 是公开仓库，拆分后承载插件代码与历史；数据目录改用私有远端或只在本机。第 5 步换远端内容之前先完整备份本仓库（`git bundle`）；已推送的历史（含 `vault/snapshots`）在公开远端已可见，换内容不会收回，需要收回时另议。
2. **按主题分。** 根 `kit/`、`templates/` 留在数据目录作为 `base` 下的工作区材料，不进包（ADR-045 两个 Kit 不合并）；关于包的 ADR（037–050 中涉及 dsh-praxis 的）随 Praxis-dsh 走，仓库治理 ADR 留在数据目录。
3. **只把 manifest 与 distill 放进 git。** 下载的字节不进 git，靠 manifest 的 hash 校验。
4. **单版 50 MB，全部保留。** 删除任何版本都要人确认。
5. **名册仍只存链接，正文进库存。** 来源记录只有链接、说明与摘录定位；原件正文只在 `stock/` 的版本里。ADR-047 状态行注明此修订。
6. **release 用 git tag 安装。** `package.json` 保持 `private: true`，不发布 npm。

## 后果

- 人和 agent 用同一套“逛、挑、结账”取用来源；agent 的购物清单（resolve）与人的购物车走同一个出口，运行记录照旧可追溯。
- 原件失效后来源仍可用，且读的是哪个版本有据可查；库存只在需要时披露，不增加常驻上下文。
- 代码仓库变小、可公开、按版本发布；数据目录保留全部研究与交付，不依赖插件的仓库模式。
- 代价：数据目录要单独备份；迁移一次性改写 `settings.json` 与快照登记；三个来源包的路径依赖 `base` 不变。
