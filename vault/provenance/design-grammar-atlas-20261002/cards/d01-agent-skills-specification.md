---
id: "d01-agent-skills-specification"
status: "verified"
url: "https://agentskills.io/specification"
---

# D01 · Agent Skills Specification

来源：[原始页面](https://agentskills.io/specification) · 状态：`verified` · 重访：2026-10-02（ok）

用途：KIT / DISCOVERY

## 是什么

Agent Skills 格式规范，支持 description 写法、三层渐进披露与一层引用的建议。

页面所见：Agent Skills（agentskills.io）；未见版本或日期

## 台账要点与本轮重访

- 有依据：description 说明能力和触发时机。description 必填、至多 1024 字符，应写明做什么与何时用，并含便于识别的关键词。
- 有依据：metadata/body/resources 分层。渐进披露三层：启动时加载名称与描述，激活时加载正文，资源按需。
- 有依据：详细参考按需读取。references 目录由 Agent 按需加载，并建议保持文件聚焦。
- 有依据：建议避免深层引用链。文件引用应距 SKILL.md 一层，避免深层嵌套。

## 限制

不能证明任意 Agent 必然发现正确内容，也不能证明普通 Kit 目录等同已安装 skill。 本轮只读文字，没有看图。

## 何时重访

调整 Kit 入口、skill description 或宿主的发现机制时重访。

台账原文见 [包内 discovery 台账](../../../snapshots/local/design-grammar-atlas-20261002/research/discovery-sources.md)，机器登记见 [`../catalog.json`](../catalog.json)。
