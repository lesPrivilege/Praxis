# 渐进披露与发现机制来源

用途：当校订description、index与按需内容路由时核对依据。读取日期2026-10-02。Exa检索结果槽位5，实际正文读页2；它们不是已验证本地Agent行为的数据。

## D01 Agent Skills Specification

- 出处：[官方规范](https://agentskills.io/specification)
- 实际读取：格式、description、body、progressive disclosure、file references、validation章节；文字依据，不用图作论据
- 支持什么：description说明能力和触发时机；metadata/body/resources分层；详细参考按需读取；建议避免深层引用链
- 不支持什么：把普通Kit目录自动等同已安装skill；保证任意Agent一定发现正确内容；规定所有知识卡片统一六字段
- 可转成哪种样例：只向目标Agent暴露入口metadata，用真实任务检查其选择与后续读取轨迹
- 授权或复用边界：本包只链接和概括，不打包原文或执行第三方脚本；若后续复制其代码/文档需核对对应仓库许可
- 质量：格式发布者的当前规范，适用于采用该格式的实现；对本任务的迁移判断是建议

## D02 Equipping agents for the real world with Agent Skills

- 出处：[Anthropic工程原文](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)，2025-10-16，页面含2025-12-18更新
- 实际读取：anatomy、context window、developing/evaluating、security等正文；未看配图，不依赖图中细节
- 支持什么：metadata先入上下文、激活后读body、其余资源按需；从代表任务缺口和实际使用轨迹迭代；关注name/description
- 不支持什么：某个设计语言必然更容易被Agent发现；本包尚未试跑的召回或质量数值；把工程经验升级为所有宿主标准
- 可转成哪种样例：冷启动任务的正例/误触发/缺项对照，观察实际读取而非只审目录名
- 授权或复用边界：仅链接与概述，不复制插图、不把厂商产品说明当资产授权
- 质量：机制原作者的工程说明，包含实践建议与产品语境；不是本地Kit的实测结果
