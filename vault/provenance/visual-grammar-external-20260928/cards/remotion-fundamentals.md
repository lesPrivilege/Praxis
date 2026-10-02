# Remotion — The fundamentals

- source ID: `remotion-fundamentals`
- URL: <https://www.remotion.dev/docs/the-fundamentals>
- accessed: 2026-09-28 (Asia/Singapore)
- status: `verified`; snapshot: `summary-only`

## 读到什么

官方 fundamentals 的 React component 示例消费当前 frame number，在空画布上返回任何 React 内容；页面把 video 定义为随时间变化的 images。随后列出 width、height、durationInFrames、fps 四项属性，说明 first frame 是 0、last frame 是 `durationInFrames - 1`，并用 `<Composition>` 将组件与视频元数据注册成可渲染视频。

## 可消费内容

这是 frame-based motion grammar 与场景元数据的官方概念入口：视觉组件可以按 frame 读取时间，composition 提供尺寸/帧率/长度契约。它可与 Three.js/Canvas scene 组合，也可不采用 Remotion。

## 边界

页面示例没有验证当前机器的安装、实际 render、WebGL/WebGPU、音频、字体或跨平台一致性；它没有承诺确定性，也不是 Praxis 的验收结果。

## 重访

要把某个 specimen 映射为 Remotion composition、升级版本或比较 frame runtime 时重访 fundamentals 与对应 API。
