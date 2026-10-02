# Visual grammar 外部追溯 · 2026-09-28

本批是一次有界的 Luna explorer 追溯，服务于“建立视觉语法语料库”这条 Chat 的后续选编。机器登记见 [`catalog.json`](catalog.json)，逐 URL 阅读卡见 [`cards/`](cards/)。本目录只保存来源身份、可复查摘要与边界，不把外部网页当作本仓库指令，也不表示 Praxis 已采纳任何技术或视觉规则。

## 范围与筛选

- 读取已归档的原 Chat [`vault/archive/chat/visual-grammar-20260928.json`](../../archive/chat/visual-grammar-20260928.json)，归档内容为 3 轮、6 条消息、1 个附件；其中带有 6 个 `chatgpt-content-reference` 占位的 assistant 消息按原 turn/item/index 登记为 `missing-original`，补读到的 URL 只是 supplemental，不恢复原引用。
- Skillry 只打开总览页和 4 个互补 specimen 详情：水模拟、interactive camera lab、黑洞引力透镜 explainer、CPU 到原子 continuous zoom。没有遍历页面标示的 389 条样本，也没有把列表计数当成长期不变的 corpus 事实。
- 技术底座读取 Remotion fundamentals/render、Chrome Headless、FFmpeg、GSAP、Web Audio、Whisper、Demucs和CTC tutorial，并登记Three.js索引级入口；没有安装、克隆、运行、渲染或下载外部项目。
- 总计 21 个 URL 记录；4 个原 X 帖作为独立 URL 记录，分别标为 `unavailable`，不把 Skillry 二手摘要当成原帖核实。

## 证据层级与快照状态

`verified` 仅表示本批在访问时间读到该 URL 的页面文字或仓库 README；`partial` 表示只读到索引级内容或上游仓库明确处于 archive/维护受限状态；`unavailable` 表示 URL 身份已登记但直接访问没有返回可用内容（X 原帖为 HTTP 403，黑洞 demo 为 fetch error）。没有保存完整 HTML、视频、音频、远端图片、X 页面或 Git 仓库快照；`snapshot_status` 均明确写为 `not-captured` 或 `summary-only`。因此卡片可本地阅读，原件与 renderer 依赖仍需重访，不能声称离线可运行或复现视频。

Skillry 文案里的“one prompt”“21 min”“23/23 tests”等是作者/聚合页的自述；水模拟仓库 README 同时说明评估者与构建模型相同、部分早期 run 不符合冻结协议。它们可用于选择 specimen 和追溯验收语义，不能单独证明 Opus 的普遍性能。黑洞实验页、camera lab 和 continuous zoom 的技术标签同样只证明页面展示的主张，不证明源码、帧率、物理正确性或成本。

## 给后续施工的技术栈建议

可以按需把源输入、时间语义、场景运行时和交付编码分层：Markdown/JSON/音频分析 →（可选的 Timeline IR 或其他事件结构）→ React/Remotion 或 Three.js/Canvas/WebGL scene runtime → Remotion/浏览器帧渲染 → FFmpeg mux/encode。Remotion fundamentals 明确以 frame number、`fps`、`durationInFrames`、尺寸和 `<Composition>` 定义视频；Chrome Headless 只提供无可见 UI 的浏览器运行方式；FFmpeg 文档覆盖命令行工具、滤镜、编解码器和 mux/demux。Headless 本身不保证确定性，这是基于文档未作该保证及实际工程变量的边界推断：若工单需要可复现，再另行固定浏览器/字体/资产、viewport/DPR、seed、时钟与网络，并对关键帧做 hash 或截图回归。

后续 Opus 施工可按需要从 4 个 specimen 取样，分别探索概念解释、UI 状态叙事、连续尺度 zoom 和程序化水/空间关系；项目内复用结构由Opus自行设计，Kit晋升按仓库流程处理。这里登记的是开放参考，也未创建 demos 或修改共享索引。

## Main 可直接引用的来源 ID

- `skillry-voxyz-black-hole`：Skillry 详情页给出引力透镜的交互叙事与三轮 P0/P1/P2 review 自述；原 X 与 demo 分别独立登记为不可用，不能把作者自述当成独立性能或科学证据。
- `skillry-acoramaa-continuous-zoom`：详情页给出从桌面到 CPU 原子的 one-continuous-shot 叙事、层级拆解和尺度尺标；适合召回 progressive disclosure/continuous zoom，源码、帧率和物理准确性未核实。
- `aionda-ai-sim-benchmark`：上游 README 公开水模拟 benchmark 的 TypeScript/Vite/Three.js、seed、测试和相机验收约束，也披露评估者重叠等限制；仓库未运行、未锁 commit。
- `remotion-fundamentals`：官方把视频表达为按 frame number 渲染的 React component，并用 `fps`、`durationInFrames`、尺寸和 `<Composition>` 定义 composition；文档已读，Praxis 未运行。
- `chrome-headless`：官方只确认无可见 UI 的浏览器运行和 Puppeteer/Selenium 入口；headless 不提供确定性保证，若工单需要复现必须另做环境固定与帧验收。
- `torchaudio-forced-alignment`：官方 tutorial 展示 Wav2Vec2 emissions → trellis → CTC segmentation → 词级时间段；可作为 audio event 候选，模型/音频尚未运行，也未采纳固定结构。

## 未覆盖与重访

- 389 样本其余条目、Skillry 的完整 prompt/视频媒体、原 X 帖正文及可能存在的原始仓库未在本批恢复。
- 音频工具官方仓库与CTC tutorial已有独立记录，但模型、分轨、对齐与编码未实际运行；Three.js仅索引级读取，WebGPU具体实现与性能未验证。
- 当产品 owner 选定施工工单、上游文档/版本变化、需要许可证与源码审计、需要离线/确定性复现或需要验证原帖时，按稳定 slug 重访对应 URL；新增原始来源应新建 supplemental 记录，不覆盖本批历史。
