# Remotion — Render your video

- source ID: `remotion-render`
- URL: <https://www.remotion.dev/docs/render>
- accessed: 2026-09-28 (Asia/Singapore)
- status: `verified`; snapshot: `summary-only`

## 读到什么

官方 rendering 页面列出 Remotion Studio 的 Render 按钮、CLI `npx remotion render HelloWorld`（可指定 composition ID 和输出路径）以及完整 server-side rendering API。页面把这些作为不同的 rendering entry points。

## 可消费内容

后续可以把 Remotion 当 frame renderer/runtime 候选；CLI 与 SSR 入口适合写入施工记录和验收命令，实际选择仍由工单与渲染效果决定。

## 边界

文档没有证明依赖已安装、浏览器/GPU 路径、性能或输出确定性；本批没有执行 CLI/SSR，也没有保存生成视频。

## 重访

选择 Remotion renderer、需要比较 Studio/CLI/SSR 或处理 WebGL/WebGPU render 时重访当前页面及具体 rendering API。
