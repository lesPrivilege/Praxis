---
id: "gitlab-global-nav"
status: "verified"
url: "https://docs.gitlab.com/development/documentation/site_architecture/global_nav/"
---

# Global navigation

来源：[原始页面](https://docs.gitlab.com/development/documentation/site_architecture/global_nav/) · 状态：`verified`

用途：GRAMMAR / DOCUMENTATION

## 摘要

GitLab 将导航视作使用者建立心智模型的工作流入口，而非所有页面的字母索引；页面缺失导航有报告可查，且通过固定的 top-level / Get started 模式减少首次进入时的猜测。

## 证据与使用边界

采用工作流导航与缺失入口检查的思想；不建立与 GitLab 相同的全局 nav YAML、审批角色或页面报告命令，除非后续实现任务证明有必要。 本次未保存 GitLab 导航配置或其仓库文件；只核查公开方法页，未复现其月度报告或评估真实导航使用数据。

## 何时重访

新增文档存在但无法从任务入口发现。 顶层 README 链接增长到读者无法选择，或同一链接在多个任务下含义不清。 需要判断页面应进入常用入口、二级参考或仅留在追溯目录。 GitLab 更新其工作流导航、缺页报告或 Get started 结构。

来源身份、核查日期、支持主张与选型状态见 [catalog](../catalog.json)。
