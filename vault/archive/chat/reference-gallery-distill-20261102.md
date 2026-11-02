# 参考库分析

Source: <https://chatgpt.com/c/6ae58f84-2b2c-83ee-b9fb-75d74d7dc738> · 4 turns · verification: partial
<!-- selected branch: 895bbe1e-0106-44e0-9ed5-5b7723014a2d -->
Selected branch only; 2 branch variants exist.

<!-- 入账说明（不属于原件）：2026-11-02 用户在 Claude Code 会话中粘贴本导出，开头一句“同意，收录这几笔、reviewer 完成 source index 等登记后，同步安装本机的 dsh plugin”。正文未改。登记见 vault/intake/reference-gallery-distill-20261102.json。 -->

## Content checks

- Some inline citations could not be matched to a source link; each is marked [?] in the text. Review the original turn to verify them.
- catalog.jsonl: download this file from the original conversation and select it separately; this export contains a reference only.

## Turn 1 — User
<!-- source: response.mapping["bbb2185e-facb-4b44-9b45-d5581f13a816"].message -->

https://azivor.github.io/reference

## Turn 2 — Assistant
<!-- source: response.mapping["ecff8f99-c409-470d-9e3d-6c50bdd1a7fa"].message -->
_Content: partial_

已访问 [Reference — A Visual Collection](https://azivor.github.io/reference/)。

这是一个**AI 产品视觉设计参考图库**，适合纳入 Fresh Agent UI / Praxis Design Kit 的参考来源。

网站目前提供：

- **AI Companies**：收录 Anthropic、OpenAI、Grok、Perplexity 等产品的视觉素材，其中 Anthropic 的样本更丰富。
- **Image Treatment**：图片表现与处理方式的参考分类。
- **交互式画廊**：纵向切换分类、横向浏览图片，支持放大查看、搜索和收藏。
- **设计观察**：每张图片附有来源署名与独立的设计观察，而不只是图片堆积。
- **本地收藏**：收藏保存在当前浏览器设备，不跨设备同步。[?]

对我们正在推进的 Fresh Agent UI，最值得借鉴的是它的**视觉参考组织方法**：

1. 将色彩、排版、构图、光影、材质、图像处理拆分为可复用的 Design Grammar。
2. 区分品牌视觉风格与产品交互规范，不直接照搬参考页面。
3. 将图片与设计观察、来源、适用场景绑定，形成 Agent 可消费的参考材料。
4. 与 Harvey、Legora 等法律 SaaS 的业务交互参考分开管理。

目前确认的是网站公开内容与信息架构，尚未完成逐张图片的视觉审阅。

**这个网站比较适合做 Visual Reference Library，而不是直接作为组件库或 Design System。** 它可以补充既有 Design Kit 的审美参考，特别是品牌皮肤、图像处理以及背景视觉语法。

## Turn 3 — User
<!-- source: response.mapping["bbb21129-1197-4a54-a2a7-ebb652767a82"].message -->

可以逐章 distill 编译索引，以备后续参考时能够按需展开而不必重读

## Turn 4 — Assistant
<!-- source: response.mapping["3db8285f-a4e6-4bba-b0c1-cd792bc0cc50"].message, response.mapping["895bbe1e-0106-44e0-9ed5-5b7723014a2d"].message -->

我会按网站实际的章节、分类和条目组织一份可检索的参考包：总索引保留定位信息，每章提炼视觉语法、适用场景和来源链接；图片与细节留作按需展开，不重复存储整站内容。先核对网站结构与素材数量，再编译 Markdown 索引。

## Reference 视觉参考库 · Distill 索引

已定位网站的公开源仓库 [Azivor/reference](https://github.com/Azivor/reference)，可以直接读取原始条目、设计观察与图片索引，不必仅靠网页截图整理。

<title size="xl" color="default" tabularNums>{x.n}</title>


原站目前有四个品牌集合：Anthropic 60 条、Perplexity 12 条、OpenAI 11 条、Grok / xAI 7 条。`Image treatment` 是跨品牌的视觉类型筛选，不是另一个独立素材章节。

编译采用三层：**总索引定位 → 章节 Distill → 原始条目及图片按需展开**。保留来源与设计语法，同时避免把参考图库直接变成产品设计规范。

## 编译产物

**Reference Visual Distill**

2026-10-31 快照 · ZIP · 约 86 KB

已校验

[下载完整索引包 ZIP](sandbox:/mnt/data/azivor_reference_visual_distill_2026-10-31.zip)

独立文件入口
[INDEX.md — 总索引](sandbox:/mnt/data/reference_distill/INDEX.md)
90 条定位

[catalog.jsonl](sandbox:/mnt/data/reference_distill/catalog.jsonl)
Agent 消费

[catalog.csv](sandbox:/mnt/data/reference_distill/catalog.csv)
结构化检索

[Grammar Crosswalk](sandbox:/mnt/data/reference_distill/06-grammar-crosswalk.md)
视觉语法

[Fresh UI Application](sandbox:/mnt/data/reference_distill/07-fresh-ui-application.md)
产品适用边界


包中包含逐条中文视觉线索、稳定 ID、来源链接、图片入口、标签，以及后续 Agent 的按需展开协议。

**验证边界：** 已覆盖全部 90 条原始记录及其附带的视觉观察，但尚未逐张对高清图片进行像素级审阅；图片本体没有打包。

后续使用时，优先从总索引定位，读取相关章节，再展开少量原始作品。不需要重新浏览整站。文件尚未同步到 Praxis 仓库；如果还需要将这套读取约定明确保存为跨会话记忆，可以在新对话中提出。

### Files

- azivor_reference_visual_distill_2026-10-31.zip — `/Users/lesprivilege/Downloads/Add to Claude/参考库分析/azivor_reference_visual_distill_2026-10-31.zip` · sha256 b512978ff0db91230823916f8d67d181f2c492619ae3fcc910f3758efbc9fd93
- INDEX.md — `/Users/lesprivilege/Downloads/Add to Claude/参考库分析/INDEX.md` · sha256 db03fde8b917e11ccc555cd5645932058bda47e6bab829839ed6f149a701d6c9
- catalog.jsonl — download-needed
- catalog.csv — `/Users/lesprivilege/Downloads/Add to Claude/参考库分析/catalog.csv` · sha256 06fa1e9043da2745be85b0b0bf4f5d3c69ece3b805a1eea253343875c14f3661
- 06-grammar-crosswalk.md — `/Users/lesprivilege/Downloads/Add to Claude/参考库分析/06-grammar-crosswalk.md` · sha256 34eb13d0da86500f7e34b52f38c0bdd53a272d2d5c717e7f3530b73e8cf574d7
- 07-fresh-ui-application.md — `/Users/lesprivilege/Downloads/Add to Claude/参考库分析/07-fresh-ui-application.md` · sha256 2c59e3902270e6102d0fcd72c4a2702891e5f2e3dea21e8b747c4480e426801a
