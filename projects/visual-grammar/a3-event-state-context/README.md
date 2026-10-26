# 同一件事，三种存在 · A3 机制演算

当前版本 `a3-esc-001 / 20261002-r1`。基线为 Praxis `b76ece44264a4dd3efe767d3b4e8b829c8e7a778`，执行者为本轮 Sol 6.1 单代理；没有子 worker、消融或双盲。用户接收待定，不宣称 Kit 的因果增益。

| 当前需要 | 入口 | 得到什么 |
|---|---|---|
| 操纵机制 | [index.html](index.html) | 可直接以 file:// 打开的中文交互页，九步演算与投影实验 |
| 看视频 | [review-player.html](review-player.html) | 84 秒、1920×1080、30 fps、H.264 MP4，无音轨；本地文件在 media 中 |
| 理解本次取用 | [消费摘要](consumption.md) | 用了什么、为何、改编、新增与未复用边界 |
| 核对输入与公开边界 | [内容基线](baseline.md) / [来源](sources.md) | 真实研究主题、合成数据、来源版本与披露范围 |
| 修改与复现 | [源码](src/README.md) | HTML 模板、共享演算模型、Remotion 工程和验证脚本 |
| Review 呈现 | [简明验收页](acceptance.html) / [详细报告](acceptance.md) / [证据](evidence/README.md) | 实际测试、关键帧、截图、失败修正与剩余限制 |
| 查本轮增量 | [2026-10-02 回合](rounds/2026-10-02/README.md) | 施工经过的简短决策与工具轨迹，不复制当前状态 |

## 目的与场景

面向需要理解 Event / State / Context 区分的读者。不是重新展示旧片：把 VG-01 已加工的合成输入改编成可检验的折叠与投影推导。读者应能从本例说出提议为什么未生效、拒绝为什么仍有记录、旧上下文为什么过期，以及未选字段为什么没有被删除。是否真正帮助陌生读者理解尚未做受众验证。

本次只写本目录及上层索引，不接业务系统、不读取原始 Chat、实名答卷或全文书稿，不修改来源仓库。事项、事件和证据 ID 均来自合成 fixture，附件并没有真实正文。场景与输入责任由本项目维护，最终接收人为用户。

## 运行与输出

交互页没有外部 JS、字体、CDN 或网络依赖；来源链接由读者主动打开。系统字体没有打包，其他机器的字形可能不同。

```sh
# 在本项目目录，已安装依赖时
npm run build:html
npm test
npm run studio
npm run render
npm run preview
```

默认 preview 只绑定 `127.0.0.1:8765`。视频通过 Remotion 4.0.529 渲染，代码只用 React、SVG、frame/fps 和插值。首次复现可在核对 Remotion 许可与可信 npm registry 后执行 `npm ci`；这不是授权全局安装。当前依赖复制自本机已存在且 lock 指向 npm 官方 registry 的工程，没有新安装或付费服务。`package-lock.json` 锁定实际依赖。没有把 node_modules、系统字体或浏览器二进制放入源码包。

`media/three-existences.mp4` 与日志为本地生成文件，不入 Git；交付的视频另存 Library，源码包包含可编辑源码、当前 HTML、播放器、字幕、关键图帧与验收记录。下载独立 MP4 后可置于 `media/three-existences.mp4` 供播放器打开；完整交付包也保留成片。

## 局部目录取舍

本项目保留 brief、内容基线、源码、必要生成资产、成品入口、消费摘要和本轮回执；Vault 保持外部参考、研究与原始资料的来源位置。Kit 本轮零修改，没有泛化 patch 或共享 renderer 晋升。这样项目能独立消费与 review，输出仍附在输入、施工与证据旁，而不是成为孤立 output。

旧四件作品、历史回执和工场 owner 全部保留。当前入口只在本 README 维护，回合只记增量。该体例是本次局部验证，不是全仓强制规则；后续迁移建议见验收报告。
