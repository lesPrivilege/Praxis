# 工作系统与工具链

Goal：将现实事件变成可追溯对象、可审查的状态差异和可执行的后续动作，减少重复整理，将人的attention集中到真正需要判断的变化。

当前入口是手动loop的工作契约与工具研究，不是已启用的自动化。

## 使用顺序

1. [结构化提炼](../../vault/distilled/work-system/README.md)：会议对象、workspace、review grammar、Field Ops。
2. [控制面与外部来源](../../vault/provenance/work-system/README.md)：软件、CLI/MCP/API与设备订阅的逐源登记。
3. [汇报设计](../reporting/README.md)：把已确认的状态、决定和证据转成交付物。
4. [企业grammar](../grammar/README.md)：将个人loop的重复模式用于业务scenario，晋升仍需独立证据。

## 核心边界

`Event Log ≠ Matter State ≠ Model Context`。保存来源事件，抽取候选Decision/Action/Open Question，形成与当前state的diff，经适当review后更新；模型context是按任务编译的视图。

`Capture → Normalize → Extract → Diff → Commit → Follow`。这里的Commit表示提交获认可的状态变化，不等于自动git commit，也不意味着可擅自发送消息。

Review Space应暴露新决定、承诺、scope变化、冲突、责任不明和低置信度等语义变化。已有授权范围内的低风险整理可持续推进；对外发送遵守用户明确授权。来源对话里的承诺示例不是真实待办。

工具先看稳定控制面：API → CLI → MCP/Skill封装 → GUI fallback。具体顺序仍依可用能力与任务判断；采购、订阅、watch folder和定时任务均未因入账而启用。
