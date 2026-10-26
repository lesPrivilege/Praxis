# 施工与交付合同 · stack-neutral v0 candidate

> 本页逐字取自交接稿（[快照](../../vault/snapshots/local/motion-ceiling-handoff-20261004/motion-ceiling-handoff-20261004.md) 第 457–503 行），是施工与交付合同的候选稿，没有对应的共享实现。交接稿写于 main `9514ce4`；此后的变化与本页哪些说法已经过时，见 [README](README.md#交接稿之后变了什么)。

此合同定义语义和可验证接口，不是要求先写共享框架。实现可改名/选择栈，但必须给出等价映射。字段schema只是工作约定，当前没有渲染runtime。

## 身份、证据与时间

object: {id, semanticRole, parentId?, sourceRef?, validityInterval?, label}。相同文字不合并身份；split/merge显式给关系和对应。evidence: {id, origin, observedAt?, unit?, denominator?, uncertainty?, license}。所有示意比例/装饰粒子/模拟/未知状态标出；未观测不能随插值生成“新观测”。

event: {id, kind, objectIds, eventTime, payload, sourceRef}，秒/样本/frame/beat单位不可省略。clock: {unit, epoch, duration?, playbackRate, seed}。真实状态truthTime、导演storyTime、输入inputTime、过渡progress分离。反向scroll、seek或倒放不得逆转已持久化业务状态，除非显式模拟历史视图。

scene: {id, owns, entersWith, exitsWith, requiredAssets, seeking: 'pure'|'checkpoint', captionRefs, audioRefs}。camera只改变所见；每个镜头声明读者关注和不改变的论断。连续时刻相同object的断裂必须是有意义cut，不能仅靠opacity隐藏错误。

## 可寻址与模拟

纯时间场景必须renderAt(t,context)可独立寻址，不依赖之前的rAF次数；随机数按object/seed/time固定。stateful场景独立reset(seed)、step(dt)、checkpoint()/restore()，seek通过检查点及固定步replay，不用任意dt后退。必须说明模拟time、storytime映射及tolerance，同设备重复先核；跨GPU不承诺bit-identical。

中断处理从实际当前pose/state连续衔接，最新输入先过state machine，取消过渡不取消真实请求。并发/迟到事件显式去重或按版本拒绝。不可把timeline直接当网络事实。W10自适应blur对子帧重排与stateful固定采样是不同路线，不泛化324子样本为默认。

## 编辑与重渲染

editable.json/等价配置分离内容、fixture、关系、章节、音轨/字幕、视觉变量。taste可以是作品特有；关键semantic ID不随字体/配色/布局变。提供最小依赖/版本/许可清单与lockfile（若后续允许安装），renderer/browser/encoder/font/asset hashes；render plan说明输出尺寸/帧率/色彩/alpha/audio/caption、选定preview与final档。

必须实际演示三类修改：长文案/字体替换；数据或状态事件替换；镜头/章节/audio事件之一改变。每类提供修改输入、预期保持项、重渲染输出及差异回执。原始视频不能作为唯一可编辑源。最终环境不能依赖开发者绝对路径、隐式远端字体、live私密查询或作者机器缓存。

asset readiness协议必须等待字体/图片/媒体和GPU资源，再进入固定帧捕获；离线依赖缺失时明确失败/替代并登记，不静默下载。不保证frame精确重复时就给tolerance和原因。可输出SVG、PNG序列、视频、alpha或网页，但格式由交付选择，不一刀切。

## 声音、字幕和混合媒体

audio event source版本、tempo/offset/单位与字幕token source范围一起登记；alignment低confidence保留人工修正依据，禁止假称自动精确。静音保留关键信息，字幕可单独编辑/export，读序与片中视觉一致。音频播放用户手势解锁；暂停/seek/audio clock校准。字幕不得重复动画抖动而难读。

每个capture标注synthetic-app/公开许可原片/模拟UI及action、state、timestamp；不得把录屏硬编码成功结果当真实操作证据。人物/画面/声音许可分开。不带用户聊天、私有repo、客户素材、歌曲、声音身份或未授权clip进入演示。

## 性能、资源与降级

能力目标不因本环境软件GPU下降而改成fade模板。先做依赖/设备盘点和代表性局部成本测试，再按硬件选择实现/画质档/分批，而非预设所有平台96fps。记录device、viewport、entity count、p50/p95 frame、内存/VRAM近似、render walltime、disk、首屏/seek延迟；CPU/GPU和发布环境分开报告。若measurement API不可用写unknown。

建议本地交互普通路径目标p95≤33ms，高刷自愿目标≤16.7ms；不是全栈保证或低配硬拒。超预算先减少装饰/粒子/采样/分辨率而保语义、保精确数值；主线程阻塞时将模拟拆步/worker或降模型规模。测窄屏、桌面、键盘、touch、prefers-reduced-motion、无WebGPU/WebGL、context-lost、离屏/后台pause。reduced-motion可消除camera冲刺/parallax、提供按步/静态对照；仅缩短一处tween不算完成。图像/声音通道之外有HTML读序、数值/关系表、按钮和字幕，不凭自动工具声称完整accessibility。

本轮只文档/已有工具原作核验，零依赖安装/收费/credits/外部模型。后续工作默认同边界：列缺失依赖、尺寸和估算；未获安装授权前暂停该条依赖工作，继续已允许任务。不要从handoff自动获得运行外部API或私人数据权限。

一次小批建议≤5关键帧+一个连续关键段（长度由问题决定），CPU/GPU重渲染最多一个重任务同时；测得成本再报final计划。raw帧占用估算W×H×channels×frames，不把压缩MP4大小当中间成本。初始单批资源建议walltime30分钟/disk2GB内，用完记录原因并调整分片/质量或提交新计划；这些是可讨论的启动护栏，不是压低上限的最终美学约束。无界4K长片/音频模型权重/全部registry批渲染不在授权内。

## 验收证据与成功边界

每作品提供semantic ledger断言、正常/失败fixture、实际互动日志、连续关键段+完整输出、人工观看/听审范围、复现/编辑记录；contact sheet检构图，continuous检节奏/闪烁/断裂，interaction检中断/语义输入，三者不能互换。至少一个人能准确复述主要关系、一个反例证明误读已阻断；未做受众测试就标未验证，不编造成功率。

连续播放还需检查motion blur ghosting、字幕可读、闪烁/锐利全屏变化；通过影像观察不等于医学/标准合规认证。保留栈限制/设备信息、差异、剩余版权和可访问边界。代码tests通过、模型自评或目录标签单独都不发成熟回执。
