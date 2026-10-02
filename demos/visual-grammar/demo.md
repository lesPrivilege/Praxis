# 工程交接

这是一份待施工方案，不是已实现系统。具体构图、镜头、字体、配色、代码组织和表现由 Opus 判断；本文件只约束证据、可复现性和交付。

## 按需选栈

TypeScript、SVG/DOM、Canvas、React/Remotion、Three.js、GLSL/WebGPU、GSAP、Web Audio、Python音频分析及FFmpeg均可自由组合。Vite/Bun是构建选择。粒子、shader、物理、空间镜头和激进动态排印都可以成为独立探索对象，不要求先证明它们优于简单表现。先检查本地工具和已有依赖；仓库“不自动安装”的执行规则不等于限制选型，可记录完整依赖方案与需要的环境。

可参考源输入、时间事件、scene状态、导出的分层，也可按作品需要采用其他组织方式。时间事件可采用项目内的最小 `time / type / target / origin / evidence_id` 结构；`origin` 区分 authored、audio-derived、model-inferred。这是实验候选，不是共享 Timeline IR 标准。

Remotion 路径以 frame 和 fps 推导状态；独立浏览器路径提供显式 `renderAt(t)` 或等价 seek 入口，等待字体和资源就绪，固定随机种子、视口和版本。Headless 浏览器能渲染页面，但不自动保证确定性；不能以等待墙钟时间充当可复现的时间线。

FFmpeg 可作为导出编码候选。若本地无可用编码器，先交可执行 scene 和分镜，明确视频导出未完成，不能把网页交付称作已成片。音频分析、模型与3D引擎可直接纳入方案；安装和下载仍遵循仓库执行规则。

技术依据与适用边界见 [外部来源](../../vault/provenance/visual-grammar-external-20260928/README.md)。截图中的 Demucs/Whisper/CTC 组合是一条二手线索；Opus可从已登记官方入口继续判断和采用，记录实际验证范围。

## 施工回执

作品 README 记录：工单/fixture/Kit版本、启动与导出命令、依赖实际版本、mock范围、证据来源ID、borrowed/adapted/new 内容、已运行检查、未运行检查、失败与重访条件。依赖与字体未保存时不能声称完全离线。

Opus可做独立作品、同语义多grammar实验、共享时间控制或自动视频流水线，自行决定先后和复用程度。记录所选参考、实际改写和结果，让后续作品可以继续复用。
