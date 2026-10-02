# SourceWeft context compression middleware

状态：verified-primary-web · supplemental-reference  
original URL：<https://github.com/SourceWeft/SourceWeft/blob/main/apps/backend/src/modules/threads/agent/middleware/context-compression.ts?utm_source=chatgpt.com>  
canonical URL：<https://github.com/SourceWeft/SourceWeft/blob/main/apps/backend/src/modules/threads/agent/middleware/context-compression.ts>  
pinned URL：<https://raw.githubusercontent.com/SourceWeft/SourceWeft/f88212b91216267f3dc1053f9424010cae9de5b6/apps/backend/src/modules/threads/agent/middleware/context-compression.ts>  
source commit：f88212b91216267f3dc1053f9424010cae9de5b6

## 是什么

固定提交中的压缩 prompt 明确：summary 是 conversation memory，不是 source evidence；保存 goal、constraints、progress、key decisions、next steps 与 locator hints；不能保留长引文、旧 citation 或把摘要当作事实证据。结构段包括 Relevant Sources 和 Non-Evidence Reminder，清理函数会把旧 citation marker 改写为已移除。

## 可消费语义

这给 Praxis 的 memory/evidence 边界提供具体参照：压缩摘要可帮助下一轮找到 source card，但事实 claim 必须重新取得当前证据和引用。

## 边界

只核实 prompt、常量和清理函数定义，不证明实际压缩触发、token budget、模型输出或运行效果。该文件不改变 Praxis 当前治理规则。

证据：SW-COMPRESS-01..02；访问：2026-09-28。
