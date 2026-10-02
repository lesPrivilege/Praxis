---
id: "d02-anthropic-agent-skills-engineering"
status: "verified"
url: "https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills"
---

# D02 · Equipping agents for the real world with Agent Skills

来源：[原始页面](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) · 状态：`verified` · 重访：2026-10-02（ok）

用途：KIT / DISCOVERY

## 是什么

Anthropic 对 Agent Skills 机制与开发评估方法的工程说明，支持渐进披露与按使用轨迹迭代。

页面所见：Anthropic Engineering；2025-10-16 发布，页面含 2025-12-18 的更新说明（Agent Skills 作为开放标准发布）

## 台账要点与本轮重访

- 有依据：metadata 先入上下文，激活后读 body，其余按需。启动时预载每个已装 skill 的 name 与 description，相关时读入 SKILL.md，附加文件按需。
- 有依据：从代表任务缺口与实际使用轨迹迭代。建议在代表任务上运行 Agent 并观察困难处，再增量构建，并据真实使用迭代。
- 有依据：关注 name/description。文章说明二者是第一层披露；评估节强调对其观察与迭代。
- 有依据：页面含 2025-12-18 更新。页面有 2025-12-18 的更新说明。

## 限制

不能证明某种设计语言更容易被发现，也不是本地 Kit 的实测，也不能升格为所有宿主的标准。 本轮只读文字，没有看图。

## 何时重访

调整 Kit 入口、skill description 或宿主的发现机制时重访。

台账原文见 [包内 discovery 台账](../../../snapshots/local/design-grammar-atlas-20261002/research/discovery-sources.md)，机器登记见 [`../catalog.json`](../catalog.json)。
