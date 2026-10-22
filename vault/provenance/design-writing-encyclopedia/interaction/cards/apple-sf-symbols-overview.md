# DWI-008 · Apple SF Symbols official overview

来源：[Apple Developer SF Symbols](https://developer.apple.com/sf-symbols/) · 状态：verified（正文文字已读；页面图像和符号样张未查看）

## 这份来源是什么

Apple 官方 SF Symbols 目录/产品概览页面。正文定位它为与 San Francisco 系统字体协作的 Apple 平台符号库，列出符号、字重、尺度、字向/脚本适配，以及 Draw、Variable Rendering、动画和多种 rendering mode 的能力。该产品简介有宣传语境；此页不是完整设计规范、兼容矩阵或授权文本。具体符号和能力受平台兼容性约束；页面所列版本见[独立变更记录](../CHANGELOG.md)，不能推成所有旧系统都有同一内容。

## 支持的判断

- 官方介绍页面说明符号的多字重、多尺度、与文字对齐，以及阅读方向和脚本本地化设计。
- Draw On/Off 依层结构、标注点和 timing choreography 动画绘制；Variable Rendering/Color/Draw 可以表达强度、进度或值变化；预设有 Bounce、Wiggle、Rotate、Breathe、Magic Replace 等。页面描述了功能，不代表观察过实际播放或可视质量。
- Monochrome、Hierarchical、Palette 与 Multicolor 是页面列出的 rendering modes；具体哪些 symbol 支持何种变体需以当前 app/API 检查。

定位：[SF Symbols](https://developer.apple.com/sf-symbols/) 页面正文第 133–180 行：overview（133–136）、Draw/Annotation（147–152）、Variable Rendering / Animation（153–158）、Rendering（159–161）、current platform availability（142–145）。只读到这些文本，没有打开图片或工具。

## 用途、边界与重访

可将其用作 Apple 平台图标对齐、字重/尺度系统化、方向本地化、符号动画与变量表达的参考；不构成其他平台授权，不表示所有 symbol 都有全部能力，更不支持从 marketing page 推断动画在真实界面的易读性。HIG page DWI-005 的搜索摘要另提示 app icon/logo/trademark 使用限制；该正式条款没有在本页展开，查阅 Apple 当前 license 前不要复制或部署符号资产。

重访触发：选择具体 SF Symbol、目标 OS 版本变化、或需用其动画/变量渲染时，查 HIG、许可证、应用版本 API 文档并实际预览。关联语法：[controls.md](../../../../../dsh-praxis/kit/design/interaction/controls.md)（`DWG-I-CONTROLS`）、[choreography.md](../../../../../dsh-praxis/kit/design/motion/choreography.md)（`DWG-M-CHOREOGRAPHY`）。

许可状态：只阅读官方网页，未下载、复制或嵌入任何 symbol；Apple asset license 未审阅，禁止据此推断许可。证据形态：官方网站全文文字；未查看网页图像、未播放动效、未运行 Apple 工具或应用。
