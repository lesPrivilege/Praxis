# 系统展项 · 原生画面检查

2026-10-15。当前 systems worker 实际执行；模型沿父代理继承，没有另称 Luna / Astra。使用真实 `cut3/film/index.html?render=1`、`core.js`、`engine.js`，以已有 Chrome headless 和已有 Playwright Node 包渲染，无新增依赖。

[检查回执](check.json)记录八场56个原生1920×1080状态图。每场在各phase+6秒截图，再逆序seek同一时刻比较PNG SHA-256；零逆序差异，零pageerror。实际可见SVG文字字号全部≥30px，文字位于x65..1855/y170..895内，当前56帧文字包围盒无互相重叠。body纸张内空白不是溢出判据；本检查也不把路径自动判为文字。

[代表帧联络表](contact.png)实际查看，八组均检查了主对象、字段/结果配对、边界与路径落点。检查中已修正：W2读状态标签与run lock重叠、storage提交注释碰底、后台结果被重复平移、Artifact业务接收文字压到文件、补件后底层旧附件标签仍参与阅读清单。每组完整状态PNG按scene id和场内秒命名。

临时独立harness还检查了同样56状态，支持组件可独立运行；交付回执只以真实core的结果为准。未在本worker完成整段实际速度观看、观众测试、整片编码、事实独立审阅或全仓库validator；这些由main集成接收。没有运行AgentScope，也没有加入音轨。
