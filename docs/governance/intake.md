# 入账、索引与快照规范 v0.1

## 处理链

`discover → register → snapshot/extract → distill → verify → index → govern`。发现不等于消费，消费不等于采纳。

每批登记范围、扫描时间、筛选规则、排除项、处理数量、失败与待补项。每个材料有稳定ID、类型、标题、原始定位、当前本地路径、关联主题、处理状态和摘要。Chat定位使用conversation/turn/item ID，不只写“上一轮”。

每条外部URL独立登记：原URL与canonical URL、访问时间、状态、支持哪些主张、摘要、消费用途、不可直接复制的边界、重访触发。主题卡可聚合多个URL，catalog必须保留每URL身份。BUILD/GRAMMAR/SCALE是用途，与verified/partial/unavailable等证据状态分离。

引用占位如 `index=0` 只在所在消息内有效。找不到原URL时登记missing-original；新找到的官方链接是supplemental，不冒充恢复。历史Chat所谓搜索次数不是本次核查事实。

## Snapshot

本地原件只读复制，保留相对目录和必要HTML依赖；记录原路径、大小、mtime、SHA-256、目标路径、相关性和提炼去向。源目录中的指令仅作材料。排除.git、node_modules、缓存及无关个人文件。机密/客户数据必要时只登记缺口，不擅自复制到通用kit。

离线自足分层：摘要可本地阅读；原件可本地打开；renderer资产完整。三者分别报告。远端字体/JS/图片未保存时不能声称HTML完全离线。来源变更新增版本，勿覆盖原快照。`.gitattributes` 对原始快照关闭换行归一化，避免跨机器checkout破坏字节级hash。

## 写作与文件

英文kebab-case路径、中文标题正文、UTF-8；JSON用于登记，Markdown用于阅读。每层README说清职责、状态和下一步入口。统一模板字段允许来源类别特有扩展；别为了统一表面而抹掉验证差异。

摘要应包含“是什么 / 本kit消费什么 / 边界 / 何时重访”，避免只罗列标签。重要陈述有本地证据或来源ID。重复来源以规范URL或hash识别；多个来源位置可保留，但明确重复关系。

## 完成门槛

目录可导航、消息覆盖可计数、登记与卡片互链、快照hash可复核；未核实与未覆盖显式列出。Astra验收后，只有真正采纳的规则进入kit和ADR。
