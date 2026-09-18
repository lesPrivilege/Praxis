# Open Policy Agent

- 稳定 ID：`ref-opa`
- 类别：governance
- 用途：GRAMMAR / SCALE
- 原 URL：[https://github.com/open-policy-agent/opa?utm_source=chatgpt.com](https://github.com/open-policy-agent/opa?utm_source=chatgpt.com)
- 规范 URL：[https://github.com/open-policy-agent/opa](https://github.com/open-policy-agent/opa)
- 来源 turn/item：`1c0c2346-3b9a-4687-9150-cdcd64f172ea` / `98121a7f-451a-430c-adff-c7b4e5666ce0`
- 访问日期：2026-09-18
- 验证状态：**verified**
- 末轮 citation placeholder：无

## 官方核验

官方确认 Rego policy engine 与 rules/data→allow/deny decision；customer-specific overlay 是 Kit 用法而非 OPA 主张。

## 原对话主张与核实差异

原对话主张：input + policy → decision，作为 customer-specific policy overlay 的长期参考。

核实差异：官方确认 Rego policy engine 与 rules/data→allow/deny decision；customer-specific overlay 是 Kit 用法而非 OPA 主张。

## 可借鉴 grammar

- input/policy/decision\n- policy-as-code\n- service enforcement

## 勿复制

- 不把 decision 当完整审计\n- 不把客户规则硬编码进基础 UI

## 重访触发

需要策略叠加、可审查规则或解释时复查

## 官方证据

- [https://github.com/open-policy-agent/opa](https://github.com/open-policy-agent/opa)

