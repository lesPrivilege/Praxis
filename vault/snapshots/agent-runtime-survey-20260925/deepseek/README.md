# DeepSeek Harness 研究快照

本目录保存本轮读取的官方 DeepSeek Harness 版本元数据与关键源码/文档摘录，供 `deepseek.md` 回查。所有摘录取自 `dsh-v0.1.7-rc.2` / commit `477b4f420553e8a52c2fbccc464d7561b239c443`，除版本对照文件外不含完整仓库、依赖、构建产物或账号数据。

来源仓库：<https://github.com/deepseek-ai/deepseek-harness>

本目录文件是带上游行号标记的 **curated research extract**：部分为短摘录，部分为对上游段落的紧凑转述，不声称逐字保留上游字节。`manifest.json` 的 hash 只校验本地研究摘录本身，并记录 URL、源 commit、源行段和字节数；行号引用的是上游固定 commit 的文件，不代表本地 `vault` 文件的行号。

覆盖主题：版本差异、Cordis/profile/plugin composition、provider registry 与原子替换、定时任务及持久投递、plugin manager/HMR、user questions、subagent continuation、session persistence/recovery、permission presets/Auto review、background jobs。

边界：未安装依赖、未运行 DSH 或第三方插件、未登录 provider、未验证跨平台桌面生命周期与真实网关兼容性。
