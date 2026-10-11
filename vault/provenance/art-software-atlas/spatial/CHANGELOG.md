# Spatial stream change log

## 2026-10-11

- 新增两条普通参考 grammar：James Turrell 的 Skyspace 感知编排，以及 Tadao Ando《光之教会》的混凝土开口、采光与脚手架木材。
- 两批 Exa 检索、6 个语义查询、每个请求 5 个结果位，共请求 30 个 Exa 结果位；另有 1 个普通 web 搜索和 2 个图像查询。最初选读 9 个公开 URL；本轮补读一个保留的 Commons 文件页和一个未保留的替代候选页，共读取 11 个网页 URL，并登记一个图像资源访问失败 URL。扫描现有 `vault/provenance/**/catalog.json`，未发现已登记 URL 的重复来源。
- 读取来源正文，不将检索摘要或图注当作亲自观看。UT Landmarks 与 UT 项目站的静态图请求均返回 HTTP 403，Exa 图像 URL fetch 返回 `CRAWL_UNEXPECTED_CONTENT_TYPE`。本轮从 Commons 文件页核实摄影者、页面所列许可和原始上传 URL；对该准确 `upload.wikimedia.org` URL 的获准 curl 请求返回 HTTP 403，未收到图像数据。网页截图工具拒绝非 PDF 页面，提示截图仅支持 PDF。因此没有通过 browser screenshot / view_image 实际查看任何图像。未执行现场访问或 renderer demo。
- 检查过另一个 Commons 候选文件页 `https://commons.wikimedia.org/wiki/File:Church_of_the_Light.jpg`；因本轮只保留 Ibaraki Kasugaoka light-cross 照片元数据，未将该候选用于主张或来源目录。
- 证据缺口：未比对日照、天气、视点、眼睛暗适应或材料老化的现场测量；也未检查字体、设备亮度或渲染器的跨设备一致性。

## 2026-10-11 · 实现文档身份修正

旧 hash 路由指向既有 three.js docs index 身份。根代理另外实际读取 class 专属页面 https://threejs.org/docs/pages/MeshStandardMaterial.html，ASA-S-08 以此精确 URL 入账；旧入口复用既有 threejs-docs-index，不新造重复正文。新页面仅验证 API 文本，无渲染运行。
