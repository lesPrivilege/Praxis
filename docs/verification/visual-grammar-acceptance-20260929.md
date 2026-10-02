# 视觉语法作品阶段验收

日期：2026-09-29。对象：Claude / Opus 交付的四件 visual-grammar 作品，提交 `88f2c65a14d77572c7d55c2f9bddb033031ee023`。主审负责裁决与静帧审阅，Luna Max 负责代码、fixture、回执和提交闭包核对。

## 裁决

**有条件接收为 demo 研究成果；完整交付验收暂未通过。** 四件作品的形式方向、合成输入与失败语义值得保留。接收不等于认定视频全部达标、受众能够理解，或共享运行层可以晋升 Kit。

本轮读了四件 README、运行层、流水线相关代码与制作方回执，目视检查了 8 张已提交关键帧。关键帧由制作方生成，本轮未重新渲染。内置浏览器拒绝 `file://` 访问，安全策略禁止绕过；因此现场播放、控件操作和新截图验收未执行。本文是代码、文档和既有静帧的阶段审阅，不是完整浏览器体验审计。

| 步骤 | 对象 | 阶段结果 |
|---|---|---|
| 1 | 作品入口与 fresh clone 交付 | 未通过：四个视频链接仍指向被忽略的文件，导航与来源依赖未全部提交 |
| 2 | 事件、状态与上下文 | 接收概念演示方向；近景构图待修，动态与交互未独立复验 |
| 3 | Schema 闸门 | 接收闸门与三投影结构；展示的 JSON 有语法错误，需修正后验收 |
| 4 | 注意力的三种语法 | 接收同一输入的三种表示与失败揭示；声音缺失反馈、实际听感与逐事件同步待验 |
| 5 | 形式实验 01 | 接收形式探索；既有视频质量回执未通过，不能作为合格视频交付 |

## 必须收尾的问题

### P2 · 首页仍链接被忽略的视频

[作品首页](../../demos/visual-grammar/index.html) 的四个“视频”链接仍指向 `renders/*.webm`。仓库不跟踪这些文件，所以新 clone 的入口会产生断链。这与交付说明中“No links to ignored media remain”不符。页脚已有生成提示，但不能让缺失链接变为可用。

验收条件：默认入口呈现明确的“需本地生成”状态与对应命令；生成后再提供有效播放入口。不要为修复导航而把所有媒体直接提交。

### P2 · Schema 的“JSON 原文”并非合法 JSON

[scene.js](../../demos/visual-grammar/schema-gate/scene.js) 的 `docLines()` 把 evidence 对象画成 `[{ "src-email-0925", "v1", "§2" }]`，缺少 `source`、`source_version`、`location` 键。真实 fixture 是合法对象，画面却把有证据的候选画成语法错误输入；这直接损害“结构可检查”的教学语义。

验收条件：显示内容来自实际候选的合法序列化，保持可读换行；用展示字符串可被解析且与候选对应的检查防止再发生。

同一帧中 JSON 文档框遮住①结构规则左半部分，需为文档与闸门说明分别留出区域。证据：[38.30 秒关键帧](../../demos/visual-grammar/schema-gate/renders/keyframes/t038.30.png)。

### P2 · 缺少音轨时声音按钮仍表示已开启

[运行层](../../demos/visual-grammar/_runtime/vg-stage.js) 创建 `Audio` 后不处理资源加载失败；点击声音立即设置 `aria-pressed=true`，`audio.play()` 的拒绝被空 catch 吞掉。被忽略的 WAV 在新 clone 中不存在时，用户没有失败原因或生成入口。这是源码确认的失败路径，未在浏览器现场复现。

验收条件：资源不存在或播放失败时显示具体状态与生成方法，按钮状态反映实际可播放性，并保留静音浏览能力。

### P2 · 形式实验视频尚未达到既定质量线

[制作方回执](../../demos/visual-grammar/form-lab-01/renders/check-report.json) 记录 55 秒帧 PSNR 为 22.47 dB，低于该流水线规定的 30 dB；README 也明确说明流场视频比网页模糊。此项不是本轮重新解码的结果。

验收条件：重导出后通过既定检查与视觉对照；或明确只交付网页实验，并在作品入口标注视频为质量未达标的预览。

### P2 · 回执与最终提交需要重新绑定

Luna 核对发现，event / schema / attention 三份 render-config 记录的 `vgpipe.py` SHA 与当前提交代码不同；四份报告的 `git_head` 均指向前一提交 `17d44bd`。不能把这些回执当作最终提交完整复验的证明。需补记最终输入 hash，说明脚本差异及受影响检查，按差异范围补验。

其他收尾：attention 的 `scene.js` 页脚仍写“导出视频无音轨”，与现有 Opus 回执矛盾；`receipt.py` 对无音轨作品也输出 Opus / audio-only 描述。`vgpipe.py check` 报告失败后仍正常退出，若接入自动验收门禁，需让必要检查失败产生非零退出码。

## 视觉判断与可访问性边界

- 三层作品把拒绝、版本过期和上下文选择的区别写进画面，信息语义比纯装饰动效扎实。不过 [38 秒](../../demos/visual-grammar/event-state-context/renders/keyframes/t038.00.png) 状态面板上沿和 [51.5 秒](../../demos/visual-grammar/event-state-context/renders/keyframes/t051.50.png) 上下文面板上沿出画。近景可用于强调，但承担阅读的面板应留完整边界；1080p 之外的实际阅读尺度仍待验。
- Schema 的 [三投影页](../../demos/visual-grammar/schema-gate/renders/keyframes/t074.70.png) 是本轮最完整的解释性静帧：身份轨线、版本一致与不同消费目的能同时看到。修正 JSON 与遮挡后，适合作为下一轮理解测试的优先对象。
- Attention 的 [28 秒](../../demos/visual-grammar/attention-grammars/renders/keyframes/t028.00.png) 明确区分账本、轨道与艺术隐喻。三栏并非等量传递信息，光场不能单独承担状态说明；界面已标注该边界。技术字段和底部时间线较密，尚未证明缩小到手机后仍能读懂。
- 形式实验的 [无限缩放](../../demos/visual-grammar/form-lab-01/renders/keyframes/t038.50.png) 与 [时间切片](../../demos/visual-grammar/form-lab-01/renders/keyframes/t046.50.png) 有明确的形式差异；[流场](../../demos/visual-grammar/form-lab-01/renders/keyframes/t055.00.png) 的细线高频纹理也解释了其编码难度。这里只判断静帧构成，未评价连续运动节奏或听感。
- 运行层具备字幕、静态分镜与 reduced-motion 分支，是合理起点。制作方“390px 无横向溢出”只证明布局范围，不证明画布内文字可读；屏幕阅读器、键盘原生控件行为、闪光和完整动态舒适度未独立验收。

## 证据、依赖与覆盖边界

- 本轮仓库验证器通过；这是含未提交文件的工作树验证，不代表提交 `88f2c65` 的 fresh clone 链接闭包通过。
- Luna 本轮独立检查：全部交付 JS 的 `node --check`、5 个 Python AST、8 个 JSON 解析，以及 `git diff --check 88f2c65^ 88f2c65` 均通过；没有运行浏览器、render 或 check。提交为 96 个文件（其中作品目录 95 个），含 50 张关键帧，不含 WebM、WAV 或 contact-sheet PNG。
- 提交版 `demos/README.md` 仍称当前无可运行 demo；工场 README 与来源、规划文件未跟踪，运行层和流水线的返回链接也因此在 fresh clone 中断裂。需以明确的关联路径补齐，不应把全部未提交工作一并纳入。
- 制作方四份 render-config / check-report 的 `git_head` 仍为 `17d44bd`，不能单凭这个字段把结果绑定到最终提交；后续回执应记录实际输入文件 hash 或明确的工作树版本。
- `audio_sync` 比较的是独立 audio-only WebM 与源 WAV 前 20 秒的互相关；0 ms 不等于主视频逐事件的画面与声音切换都已实测同步。
- 系统字体、Playwright Chromium 及 Python 导出依赖没有随仓库快照；跨机器、跨 GPU、Safari / Firefox 的表现未验证。
- Courtwork 与 Schema Engineering 的原来源语义本轮未逐源重新核实；使用的是本仓库索引和制作方声明。未证明此 demo 等同原项目 runtime，也未做受众理解或业务接受测试。

下一步是完成上述交付与表达修正，再在可访问的浏览器预览中检查四件作品的播放、暂停、seek、静态入口、缺资产反馈和两件有声作品的实际听感。接收标准和范围保持分层，不把已有回执全部重跑当作默认动作。
