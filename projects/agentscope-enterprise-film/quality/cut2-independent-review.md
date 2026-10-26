# 第二版独立审阅

2026-10-12（Asia/Singapore）。审阅者为本轮委派的 `cut2_review`，实际沿主代理模型继承，未冒称指定 Luna/Astra。仅拥有本文件；未修改影片源码、未运行目标 AgentScope、未 clone/安装、未跑整仓库 validator。最终包含和接受由主代理负责。

**结论：已核范围未发现 P0。第二版在执行所有权、等待/恢复、快照回放、文件发布等关键局部，已经从目录卡片推进到可以追问的机制图。交付前仍需处理四项 P1：跨场文件身份漂移、EXPLORE 例外缺席、ToolResponse URL 失败缺席、实际文字清单与当前字号不一致。** 快照恢复处另有一项单词级修正，见下文。当前证据不足以宣称整片质量不弱于参考作品或观众已经认可。

## 审阅版本与方法

本轮输入为 `cut2/script/beats.json` 的50段、`coverage.json` 的53个局部映射，脚本合计2945秒（49:05），11段使用定制展项，39段保留一般布局。数量覆盖只能证明主题有映射，不能证明所有默认和失败行为都上了屏幕。

- `beats.json` SHA-256：`b562338347712d2680953a4b6503c22599dab152a8f267ec45a8b15921cbc3c4`。
- `cut2/out/timeline.json` SHA-256：`ef3738102b317908a64c8a66ba422a2ab482adeaf16838673c69aabe76ef685b`。
- `cut2/out/screen-text.md`：1793条文字记录，SHA-256 `090e61b21e2c204bf4456ec2e615dbceb5f5d9dd48debe0e959ed919f59f4cfe`。对全文做关键词检索，逐场读一般布局的标题/内容/结论，对指定机制读阶段文字并看实际图；不是1793条逐条人工校对。
- 已读四个Lab的质量交接、`quality/comparison-baseline.md`、`script/depth-v2.json`，回查权限静态裁决和 ToolResponse 固定源码。
- 从当前集成页面 `cut2/film/index.html` 通过 Playwright、1920×1080、DPR=1、`Film.seek` 新抓10个阶段；没有使用尚在渲染的完整MP4作为证据。

## P1 最小修订

### 1. 同一调用/文件身份换了文件名

`permission` 606.5–685.9秒以 **R2/T2** 保存 `reviews/risk.md`，而闭环2828.5秒仍以 **R2/T2** 调用 `Write review-v3.md`。Java文件段2296.5–2366.9秒以 **JS1/JF1/JA1** 发布并下载 `risk-report.pdf`；闭环2882.5秒的同一 **JA1** 已变成 `review-v3.md`。新抓645、2832、2887秒与场尾PNG均确认了这种漂移。

它使观众无法判断是原调用续接、另一份文件，还是一次未讲解的转格式。最小修订：保持既定R2/T2与JS1/JF1/JA1，统一产物名和路径（例如全线 `review-v3.md`）；若业务确需PDF转换，则给转换动作和新文件新的身份并显式画出转换。当前没有必要为此增加整场。

### 2. EXPLORE 的显式 ASK 确认例外未进入屏幕

全文没有 `EXPLORE`。当前权限95秒充分画了DEFAULT优先级、输入校验、ASK停止stream、确认绑定原R2/T2、允许后才执行；但本轮已经裁决的重要模式差异仍只在研究/深度计划中。

最小修订：在权限段中增加一个可读的对照状态，明确 **“EXPLORE：未命中deny/ask的非只读调用默认拒绝；显式ASK命中后，用户可批准该次调用执行；allow规则不参与”**。不能用“EXPLORE绝对只读”替换此结论。模式对照可复用原工具对象，切换模式后改变判定和执行出口；不必新增装饰性卡片。

依据：`vault/distilled/agentscope-enterprise-20261012/permission-verdict-v2.md`，固定源码 `as-145a584b7630` 的214–295行以及 `as-df9d991bfc3d` 的确认恢复链。这里是固定版本静态源码行为，不是目标项目实测。

### 3. ToolResponse 的URL合并失败缺席

`tools` 531.5秒已有“按block ID合并；error不被success覆盖”，这是正确增量；全文仍没有URL或Base64规则。PM仍看不到“为什么不能把所有流式数据都按字符串拼接”。

最小修订：保留现有Schema→Chunk→Response→Result脉络，给Response加一个同ID的两步小例：Text追加 / Base64先解码合并 / URL再次追加→ValueError；并以 `error → success` 的输入展示最终仍为error。至少URL失败须真实可见，不能只补进阅读稿或coverage映射。

已回查固定快照 `as-87b75e2c3fd3-_response.py.txt:72-149`：同ID的URL DataBlock追加抛ValueError；ERROR保留。没有重新核实官网当前版本。

### 4. 验收文字清单的字号与当前DOM不一致

`screen-text.md` 把permission的“无工具结果/asking/state=success”、Artifact的“已上传/已发布”等 `.ml-chip` 记录为16px。实际场尾PNG及本轮fresh Playwright `getComputedStyle` 均为30px，当前 `film/mechanism-lab.css` 也指定30px。**这不是已确认的实际画面小字失败**；它是验收材料与当前渲染状态不一致。

最小修订：最终编译后重新生成screen-text，并检查采集器是否读实际文本元素而非默认字号或过期产物；保存与最终timeline/源码对应的hash。不可据这份清单声称所有字号核查已和成片同步。

### 单词级修正：410恢复的是视图

2206秒新抓图右栏大标题为“重建原任务U1”，同屏底部却准确写“保留U1，不新建Turn”。标题容易把恢复观察误读成重建执行。改为 **“重建U1的视图”** 即可；其余snapshot/after链无需重写。

## 已核实的机制与身份边界

- **Python读与写分离**：events维持R1/T1、工具为Read；permission/runtime/closure用R2/T2表示写任务。没有把批准一个读取ID误当写入批准。尚需修正上述同一写调用的目标文件漂移。
- **Python/Java分离**：lanes明确两套实现路径；Java回放使用JS1/U1，发布使用JS1/JF1/JA1。闭环2867秒明确标出“Python执行例→材料交付契约→Java Managed交付例”，未把S1与JS1画成同一后台。Java回放工具仍名T1，但章节与Session命名能区分命名空间；后续若追求更强识别可用JT1，这不是本轮阻断项。
- **ASK执行门**：645秒中间停在ASK，右侧“尚未执行/无工具结果”，没有出闸箭头；655秒确认回到R2及嵌套ToolCallBlock T2，才出现通往工具的路径。确认与真实工具开始分阶段呈现。
- **后台生命周期**：场内进程边界、页面观察、inbox/wakeup分开；1482秒投递inbox并唤醒，1498秒明确先拿S1 run lock，并可在同一run或新wakeup run继续。场尾失败分支区分进程退出、任务取消/失活与stale registry，未把registry metadata当持久可恢复的asyncio任务。
- **执行矩阵**：Managed/External/Hosted按执行者、上下文、Service记录、发现、文件、恢复六个维度展开；available_commands是具体选择返回的例子。Hosted保持观察入口而checkpoint_restore=false。不是三张同层宣传卡。
- **SSE回放**：同一JS1/U1/M1继续；e19历史/实时重复只应用一次，cursor在应用后保存；410重新读snapshot与as_of；turn.completed才改任务终态。工具完成未污染M1正文。
- **闭环**：材料缺口、补件、候选、确认写入、发布Artifact、法务接收，以及XW1超时后查询回执分别出现。业务接入分支没有自称AgentScope自带台账。来源footer目前全段为Java，正文里的Python/Java标识承担了概念分界；如调整footer，建议写混合来路，而不是扩大产品统一后台的暗示。

## 文案与参考质量比较

屏幕关键词扫描未发现制作流程、TTS、clone、验收通过、观众认可等制作旁白，也未见“PM要记住/本片只讲/注意本片不是实测”式保护段落。可见的“示例”、不透明游标、权限/副作用区别属于机制必要限定，应保留。`background` 末句“不能据此宣称恢复执行”略有审稿口吻，可直接写“硬重启后原asyncio task已消失；registry旧记录不能重新执行任务”，但不是必须加新安全文案的理由。

一般布局39场的结尾仍多为“分别配置/分别核对/决定/按能力和状态”等概括。多数有具体对象支撑，例如预算并行超限、202 queued/input.applied、download_secret，不能一律当套话删除；`memory`、`plan`、`middleware`仍偏抽象。它们是剩余局部深度风险，不能用11段定制展项代表全50段都达到同等讲解密度。

以 `comparison-baseline.md` 的六项标准看，新的权限、后台、矩阵、回放和闭环已经有认知对象、状态变化、失败出口和执行所有权，显著收窄第一版与参考作品之间的机制差距。本轮实际看了参考金字塔162秒的续约率冲突、212秒的同批材料分组，以及DeerFlow消息旅程/中间件+模式控件截图。金字塔用材料变换承担解释，DeerFlow让读者按步探索具体职责与默认值；当前11个展项开始具备相同的局部因果条件。

仍不能接受“因此整片优于/不弱于Opus或Sonnet”的结论：脚本49:05，其中39场一般布局的重复感、首读认知负担、长段留屏和章节过渡尚未完整实时观看；没有PM观众测试。参考作品含音轨/交互，不能把TTS当唯一差距，也不能把我们的覆盖更广当观感更好。

## 实际图像查看清单

当前成片场尾原生PNG（8张）：`cut2/evidence/events.png`、`permission.png`、`background.png`、`workspace.png`、`java-03-execution-targets.png`、`java-05-snapshot-sse-cursor.png`、`java-07-files-artifacts.png`、`end.png`。

本轮新抓并实际查看（10张）：`/tmp/praxis-scope-quality/cut2-review-{645,655,1482,1498,1975,2188,2206,2832,2867,2887}.png`。对应ASK/确认、后台inbox/续接、矩阵能力、SSE去重/410、闭环确认/发布/验收。不是仅保存而未查看。

参考已有抽取图并实际查看（4张）：`/tmp/praxis-scope-frames/pyramid-0162.00.png`、`pyramid-0212.00.png`、`deerflow-s2.png`、`deerflow-s3.png`；原仓库和抽取范围见comparison-baseline。本轮没有重新全量外部探索，也没有把参考截图称为新一轮完整观看。

双封面实际查看：`covers/agentscope-4x3.png`（1600×1200）、`covers/agentscope-3x4.png`（1200×1600）。前者为横向错位三块，后者为纵向三块；`script/cover.py`分别编排两套坐标，不是横屏裁切。封面无制作/保护段落，未发现截字或布局冲突。

未覆盖：最终MP4编码/解码与完整实时播放，所有50场及全部中间帧的人工视觉验收，真实AgentScope部署行为/性能，最新外部站点变化，PM观众理解结果。本轮未新增外部依赖或未快照材料；既有字体/GSAP等依赖的整体离线检查由主代理既有验收负责。

## 修后独立裁决附录（3121秒版本）

此附录保留上文2945秒版本的hash、问题与范围，不把旧检查自动升级为新版本验收。

原四项P1已独立核对关闭：

1. 修后实际DOM文字清单中，permission的R2/T2、Java JS1/JF1/JA1及closure都使用review-v3.md。
2. 权限阶段已有“EXPLORE：deny→显式ask→只读；其余非只读调用兜底DENY”，并明确本例显式ASK等待逐次确认、合法确认置ALLOWED、后续调用重新判定。
3. tools屏幕已出现“按block ID合并；URL内容不能追加；error不被success覆盖”。它满足此前最低可见失败要求；三类数据聚合的更丰富动画例仍只是可选深化。
4. 修后screen-text.json的ml-chip字号统一为30px，与当前CSS和此前实际图一致。410标题已改“重建U1的视图”。

随后独立跑完1629–2426秒797秒1倍时间轴并查看39张实际帧，发现新P1：SSE初始“责任上限待核对”经delta“缺失”变成“责任上限缺失”，具体示例实为替换。主代理修复后，再独立1倍跑完2206–2378秒172秒，实际查看9张修后帧：到达前M1=责任上限/c17；到达后追加缺失仍c17；应用后再保存c18。新P1与先变结果后到达的次要动效问题均关闭。

详细墙钟、RAF、全部取帧及实际查看名单见[第三段审阅](playback-part3.md)和证据目录。原797秒运行797.0685秒、191帧采集；补验172.0842秒、39帧采集，均无page_errors。它们是连续墙钟驱动时间轴加稀疏帧视觉检查，不是完整连续人类观看，也不是最终MP4编码验收。

修后beats hash：95be21753589503c3a177b87e8916ea463d6892591f4469e6d76bce1988a0691；timeline hash：85b0c010d260631b8efb30de1668c96fae6d7adeca2112567398650fd00210d4。service-lab.js hash：dd83c5a967a50b0423a66977e93738815823bc54a36f6311661b8fa37e929899。附录核对时screen-text.json hash：190d40faa668d3f71f6cd9a4dc946ef0aeb0ac10a34c1eb30c77553fefae41a5。

**独立结论：上述已发现P1在核对范围内均关闭；第三段没有剩余P0/P1。** “全片不弱于参考作品”的整体观感与PM理解度仍不能据有限帧观察保证；主代理汇总其余分段与最终媒体验收后作最终接受。

2026-10-26：本文提到的 `playback-part3/README.md` 已按 ADR-044 删除，结论以本文和回执为准；登记见 `docs/governance/retired-paths.json`。
