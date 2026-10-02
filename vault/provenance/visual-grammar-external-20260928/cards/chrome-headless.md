# Chrome Headless mode

- source ID: `chrome-headless`
- original URL: <https://developer.chrome.com/docs/chromium/headless>
- canonical URL: <https://developer.chrome.com/docs/automation-and-testing/headless>
- accessed: 2026-09-28 (Asia/Singapore)
- status: `verified`; snapshot: `summary-only`

## 读到什么

Chrome 官方文档说明 Headless mode 在无可见 UI 的 unattended environment 运行 Chrome；Chrome 112 起 headless 与 headful 共享代码路径，Chrome 132 起旧实现定位为独立的 `chrome-headless-shell`。文档还给出 Puppeteer `headless: true`/`'shell'`/`false` 与 Selenium `--headless` 示例。

## 可消费内容

可把 headless 当作浏览器 scene runtime 的自动化入口，用于打开页面、驱动渲染或采集帧；它适合与 Remotion/Three.js/Canvas/FFmpeg 组合。

## 边界

文档只说明运行模式和 API，不保证帧渲染确定性、字体/资产一致性、GPU 选择、时钟、网络或 WebGL/WebGPU 行为。因而“headless 本身不保证 deterministic”是结合文档未作该保证和工程变量的边界推断，不是 Chrome 文档的原话。

## 重访

固定 Chrome for Testing/Puppeteer 版本、搭建 frame harness、处理 GPU/字体/网络差异或选择旧 headless shell 时重访；回查 canonical URL。
