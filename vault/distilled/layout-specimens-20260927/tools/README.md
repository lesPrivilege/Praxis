# tools · 生成与检查

- `catalog.py`：校验 [specimens.json](../specimens.json) 的 ID、锚点、轴取值与关联，并生成 `index.html` 与 `catalog.md`。两者是生成物，改内容请改 JSON 后重跑。
- `cdp.mjs`：通过 Chrome DevTools 协议仿真真实视口（375 为移动端仿真），输出几何报告，可按 `page.html#id` 截单个元素或整页；`--nojs` 禁用脚本，`--reduced` 仿真减少动效。最终检查以它为准，记录见 [checks](../checks/README.md)。
- `check.py`：施工期的快速自查。headless 窗口不能窄于 500px，375 用 `?w=375` 收窄布局盒，media query 仍看到 500；`#id` 截图通过 `lab.js` 的 `?focus=` 只渲染该元素。

只用 Python 标准库、Node 内置模块和本机 Google Chrome，不安装依赖。
