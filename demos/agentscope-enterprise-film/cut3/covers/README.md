# 原生封面 · 第三版

[4:3 SVG](agentscope-4x3.svg) · [4:3 PNG](agentscope-4x3.png) · [3:4 SVG](agentscope-3x4.svg) · [3:4 PNG](agentscope-3x4.png)

两种画幅分别编排：1600×1200 横向消息—授权—目录，1200×1600 纵向折线路径。它们不是视频画面的裁切；文字保留为原生 SVG text。冷浅底色与影片 core 一致，蓝色集中于动作授权。仅使用消息、授权与文件目录关系；无制作状态或保护性页脚。

运行 `python3 demos/agentscope-enterprise-film/cut3/covers/generate.py` 可重建 SVG 与 PNG；依赖已安装的 Playwright/Chromium，没有安装新依赖。当前环境字体为 PingFang SC / Helvetica Neue，其他环境的字体替换会改变字宽，应重新预览。

2026-10-15 已实际查看两张完整原生 PNG。核对：PNG 与 SVG 尺寸对应，标题/主体/线条位于画幅 5% 安全边距内，文字无重叠、无裁切；横版横向关系与竖版折线路径均连接到目录边界。最终检查见 [checks.json](checks.json)。没有验证具体发布平台的缩略图与裁切策略。
